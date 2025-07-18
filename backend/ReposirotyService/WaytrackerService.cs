using backend.Common;
using backend.DtoModels;
using backend.Models;
using backend.RepositoryInterface;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using MySqlConnector;
using Newtonsoft.Json;
using System.Collections.Concurrent;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Resources;
using System.Web;

namespace backend.RepositoryService
{
    public class WaytrackerService : IWaytrackerService
    {
        private readonly ApplicationDbContext _context;
        private readonly HttpClient httpClient;
        private readonly string waytrackerUrl;
        private readonly ZohoAuthSettings _zohoAuth;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly string _mysqlConnString;
        public WaytrackerService(
            ApplicationDbContext context,
            IConfiguration configuration,
            IOptions<ZohoAuthSettings> zohoOptions,
            IHttpClientFactory httpClientFactory)
        {
            _context = context;
            waytrackerUrl = "http://exlprd.excelenciaconsulting.com:8080/ords/exc_finauto_dev/ci/consultant_info/";
            httpClient = new HttpClient { BaseAddress = new Uri(waytrackerUrl) };
            _zohoAuth = zohoOptions.Value;
            _httpClientFactory = httpClientFactory;
            _mysqlConnString = configuration.GetConnectionString("MySqlDatabase");
        }


        public async Task<List<ContractorDetailsDto>> GetContractorList()
        {
            try
            {
                HttpResponseMessage response = await httpClient.GetAsync("");
                if (response.IsSuccessStatusCode)
                {
                    string result = await response.Content.ReadAsStringAsync();
                    var data = JsonConvert.DeserializeObject<Dictionary<string, List<ContractorDetailsDto>>>(result);

                    if (data != null && data.ContainsKey("items"))
                    {
                        return data["items"];
                    }
                }
                return new List<ContractorDetailsDto>();
            }
            catch (Exception ex)
            {
                // log ex
                return new List<ContractorDetailsDto>();
            }
        }

        public async Task<string> GetAccessTokenUsingRefreshTokenAsync()
        {
            try
            {
                var client = new HttpClient();
                var tokenEndpoint = "https://accounts.zoho.com/oauth/v2/token";

                var requestContent = new FormUrlEncodedContent(new[]
                {
                    new KeyValuePair<string, string>("refresh_token", _zohoAuth.RefreshToken),
                    new KeyValuePair<string, string>("client_id", _zohoAuth.ClientId),
                    new KeyValuePair<string, string>("client_secret", _zohoAuth.ClientSecret),
                    new KeyValuePair<string, string>("grant_type", "refresh_token")
                });

                var response = await client.PostAsync(tokenEndpoint, requestContent);

                if (response.IsSuccessStatusCode)
                {
                    var content = await response.Content.ReadAsStringAsync();
                    var token = JsonConvert.DeserializeObject<ZohoAccessTokenResponse>(content);

                    return token?.access_token;
                }

                return null;
            }
            catch (Exception e)
            {
                // log e
                return null;
            }
        }

        private DateTime? ConvertFromUnixMs(string? ms)
        {
            if (string.IsNullOrEmpty(ms)) return null;
            return DateTimeOffset.FromUnixTimeMilliseconds(long.Parse(ms)).UtcDateTime;
        }
        public async Task<bool> ImportActiveEmployeesAsync()
        {
            try
            {
                var accessToken = await GetAccessTokenUsingRefreshTokenAsync();
                Console.WriteLine($"Access Token: {accessToken}");

                var page = 1; // Start from the first page
                var allEmployees = new List<ZohoEmployeeData>();
                var hasMoreData = true;

                while (hasMoreData)
                {
                    // Set per_page to 50 to limit the number of employees per request
                    var requestUri = $"https://people.zoho.com/people/api/forms/P_EmployeeView/records?criteria=(Employee_Status:equals:Active)&page={page}&per_page=50";

                    // Create a new request for each iteration to avoid reuse
                    var request = new HttpRequestMessage(HttpMethod.Get, requestUri);
                    request.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Zoho-oauthtoken", accessToken);

                    // Send the request and handle retries if needed
                    var response = await SendRequestWithRetryAsync(request);
                    if (response == null) return false; // If we couldn't get a valid response, return false

                    var json = await response.Content.ReadAsStringAsync();
                    Console.WriteLine($"Response JSON: {json}");

                    if (!response.IsSuccessStatusCode)
                    {
                        Console.WriteLine($"Error Status Code: {response.StatusCode}");
                        Console.WriteLine($"Error Response: {json}");
                        throw new Exception("Failed to fetch employees from Zoho API.");
                    }

                    var zohoEmployees = JsonConvert.DeserializeObject<List<ZohoEmployeeData>>(json);
                    if (zohoEmployees != null && zohoEmployees.Any())
                    {
                        allEmployees.AddRange(zohoEmployees);
                    }

                    // Check if the number of records returned is less than the expected limit (50 in this case)
                    hasMoreData = zohoEmployees.Count == 50; // If less than 50 records, we've reached the last page
                    page++; // Increment the page number for the next request
                }

                // Now that all employees are fetched, process them and add them to the DB
                var employees = allEmployees.Select(item => new ZohoEmp
                {
                    Employee_Id = item.Employee_Id,
                    UserName = $"{item.First_Name} {item.Last_Name}".Trim(),
                    Designation = item.Designation,
                    Business_unit = item.BusinessUnit,
                    Status = item.Status,
                    YearOfExperience = item.Experience,
                    Mobile = item.Mobile,
                    EmailID = item.Email,
                    DateOfJoining = item.DateOfJoining,
                    Department = item.Department,
                    EmployeeCategory = item.EmploymentType,
                    Reporting_Manager = item.Reporting_Manager,
                    Second_Reporting_To = item.SecondReportingManager,
                    Work_location = item.WorkLocation,
                    Entity = item.Location,
                    OwnerName = item.OwnerName,
                    RecordId = item.RecordId,
                    ApprovalStatus = item.ApprovalStatus,
                    CreatedOn = ConvertFromUnixMs(item.CreatedTime),
                    ModifiedOn = ConvertFromUnixMs(item.ModifiedTime)
                }).ToList();

                return AddZohoEmployees(employees);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error: " + ex.Message);
                return false;
            }
        }

        private async Task<HttpResponseMessage> SendRequestWithRetryAsync(HttpRequestMessage request, int maxRetries = 3, int delayMs = 2000)
        {
            var retryCount = 0;
            while (retryCount < maxRetries)
            {
                try
                {
                    var response = await httpClient.SendAsync(request);
                    if (response.IsSuccessStatusCode)
                    {
                        return response;
                    }
                    else
                    {
                        Console.WriteLine($"Attempt {retryCount + 1}: API request failed with status code {response.StatusCode}");
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Attempt {retryCount + 1}: Error while sending request: {ex.Message}");
                }

                retryCount++;
                if (retryCount < maxRetries)
                {
                    Console.WriteLine("Retrying request...");
                    await Task.Delay(delayMs); // Wait before retrying
                }
            }

            Console.WriteLine("Max retries reached. Could not get a successful response.");
            return null;
        }




        public bool AddZohoEmployees(List<ZohoEmp> employees)
        {
            try
            {
                if (employees == null || employees.Count == 0)
                {
                    Console.WriteLine("No employees to import.");
                    return false;
                }

                using (MySqlConnection connection = new MySqlConnection(_mysqlConnString))
                {
                    connection.Open();

                    foreach (var employee in employees)
                    {
                        string checkQuery = "SELECT COUNT(*) FROM ZohoEmp WHERE Employee_Id = @Employee_Id";
                        using (MySqlCommand checkCommand = new MySqlCommand(checkQuery, connection))
                        {
                            checkCommand.Parameters.AddWithValue("@Employee_Id", employee.Employee_Id);
                            int count = Convert.ToInt32(checkCommand.ExecuteScalar());

                            if (count == 0)
                            {
                                string insertQuery = @"INSERT INTO ZohoEmp 
                            (Employee_Id, UserName, Designation, Business_unit, Status, YearOfExperience, Mobile, EmailID,
                             DateOfJoining, Department, EmployeeCategory, Reporting_Manager, Second_Reporting_To,
                             Work_location, Entity, OwnerName, RecordId, ApprovalStatus, CreatedOn, ModifiedOn)
                            VALUES 
                            (@Employee_Id, @UserName, @Designation, @Business_unit, @Status, @YearOfExperience, @Mobile, @EmailID,
                             @DateOfJoining, @Department, @EmployeeCategory, @Reporting_Manager, @Second_Reporting_To,
                             @Work_location, @Entity, @OwnerName, @RecordId, @ApprovalStatus, @CreatedOn, @ModifiedOn)";

                                using (MySqlCommand insertCommand = new MySqlCommand(insertQuery, connection))
                                {
                                    insertCommand.Parameters.AddWithValue("@Employee_Id", employee.Employee_Id);
                                    insertCommand.Parameters.AddWithValue("@UserName", employee.UserName);
                                    insertCommand.Parameters.AddWithValue("@Designation", employee.Designation);
                                    insertCommand.Parameters.AddWithValue("@Business_unit", employee.Business_unit);
                                    insertCommand.Parameters.AddWithValue("@Status", employee.Status);
                                    insertCommand.Parameters.AddWithValue("@YearOfExperience", employee.YearOfExperience);
                                    insertCommand.Parameters.AddWithValue("@Mobile", employee.Mobile);
                                    insertCommand.Parameters.AddWithValue("@EmailID", employee.EmailID);
                                    insertCommand.Parameters.AddWithValue("@DateOfJoining", employee.DateOfJoining);
                                    insertCommand.Parameters.AddWithValue("@Department", employee.Department);
                                    insertCommand.Parameters.AddWithValue("@EmployeeCategory", employee.EmployeeCategory);
                                    insertCommand.Parameters.AddWithValue("@Reporting_Manager", employee.Reporting_Manager);
                                    insertCommand.Parameters.AddWithValue("@Second_Reporting_To", employee.Second_Reporting_To);
                                    insertCommand.Parameters.AddWithValue("@Work_location", employee.Work_location);
                                    insertCommand.Parameters.AddWithValue("@Entity", employee.Entity);
                                    insertCommand.Parameters.AddWithValue("@OwnerName", employee.OwnerName);
                                    insertCommand.Parameters.AddWithValue("@RecordId", employee.RecordId);
                                    insertCommand.Parameters.AddWithValue("@ApprovalStatus", employee.ApprovalStatus);
                                    insertCommand.Parameters.AddWithValue("@CreatedOn", employee.CreatedOn);
                                    insertCommand.Parameters.AddWithValue("@ModifiedOn", employee.ModifiedOn);
                                    insertCommand.ExecuteNonQuery();
                                    Console.WriteLine($"Inserted: {employee.Employee_Id}");
                                }
                            }
                            else
                            {
                                string updateQuery = @"UPDATE ZohoEmp SET 
                            UserName = @UserName, 
                            Designation = @Designation,
                            Business_unit = @Business_unit,
                            Status = @Status,
                            YearOfExperience = @YearOfExperience,
                            Mobile = @Mobile,
                            EmailID = @EmailID,
                            DateOfJoining = @DateOfJoining,
                            Department = @Department,
                            EmployeeCategory = @EmployeeCategory,
                            Reporting_Manager = @Reporting_Manager,
                            Second_Reporting_To = @Second_Reporting_To,
                            Work_location = @Work_location,
                            Entity = @Entity,
                            OwnerName = @OwnerName,
                            RecordId = @RecordId,
                            ApprovalStatus = @ApprovalStatus,
                            CreatedOn = @CreatedOn,
                            ModifiedOn = @ModifiedOn
                            WHERE Employee_Id = @Employee_Id";

                                using (MySqlCommand updateCommand = new MySqlCommand(updateQuery, connection))
                                {
                                    updateCommand.Parameters.AddWithValue("@UserName", employee.UserName);
                                    updateCommand.Parameters.AddWithValue("@Designation", employee.Designation);
                                    updateCommand.Parameters.AddWithValue("@Business_unit", employee.Business_unit);
                                    updateCommand.Parameters.AddWithValue("@Status", employee.Status);
                                    updateCommand.Parameters.AddWithValue("@YearOfExperience", employee.YearOfExperience);
                                    updateCommand.Parameters.AddWithValue("@Mobile", employee.Mobile);
                                    updateCommand.Parameters.AddWithValue("@EmailID", employee.EmailID);
                                    updateCommand.Parameters.AddWithValue("@DateOfJoining", employee.DateOfJoining);
                                    updateCommand.Parameters.AddWithValue("@Department", employee.Department);
                                    updateCommand.Parameters.AddWithValue("@EmployeeCategory", employee.EmployeeCategory);
                                    updateCommand.Parameters.AddWithValue("@Reporting_Manager", employee.Reporting_Manager);
                                    updateCommand.Parameters.AddWithValue("@Second_Reporting_To", employee.Second_Reporting_To);
                                    updateCommand.Parameters.AddWithValue("@Work_location", employee.Work_location);
                                    updateCommand.Parameters.AddWithValue("@Entity", employee.Entity);
                                    updateCommand.Parameters.AddWithValue("@OwnerName", employee.OwnerName);
                                    updateCommand.Parameters.AddWithValue("@RecordId", employee.RecordId);
                                    updateCommand.Parameters.AddWithValue("@ApprovalStatus", employee.ApprovalStatus);
                                    updateCommand.Parameters.AddWithValue("@CreatedOn", employee.CreatedOn);
                                    updateCommand.Parameters.AddWithValue("@ModifiedOn", employee.ModifiedOn);
                                    updateCommand.Parameters.AddWithValue("@Employee_Id", employee.Employee_Id);
                                    updateCommand.ExecuteNonQuery();
                                    Console.WriteLine($"Updated: {employee.Employee_Id}");
                                }
                            }
                        }
                    }
                }

                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine("DB Error: " + ex.Message);
                return false;
            }
        }

        public async Task<List<ZohoEmp>> GetAllZohoEmployeesAsync()
        {
            return await _context.ZohoEmp.ToListAsync();
        }
        public async Task<List<ZohoClientDto>> GetZohoClientsAsync(int index = 1, int limit = 200)
        {
            var resultList = new List<ZohoClientDto>();
            bool hasMore = true;

            try
            {
                var accessToken = await GetAccessTokenUsingRefreshTokenAsync();
                if (string.IsNullOrEmpty(accessToken))
                    throw new Exception("Access token is empty.");

                while (hasMore)
                {
                    string url = $"https://people.zoho.com/people/api/timetracker/getclients?sIndex={index}&limit={limit}";
                    using var client = new HttpClient();
                    client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Zoho-oauthtoken", accessToken);

                    var response = await client.GetAsync(url);
                    var json = await response.Content.ReadAsStringAsync();

                    if (!response.IsSuccessStatusCode)
                        throw new Exception($"Zoho Client API Error: {response.StatusCode} | {json}");

                    var parsed = JsonConvert.DeserializeObject<ZohoClientApiResponse>(json);
                    if (parsed?.response?.result != null)
                        resultList.AddRange(parsed.response.result);

                    hasMore = parsed?.response?.isNextAvailable == true;
                    index += limit;
                }

                return resultList;
            }
            catch (Exception ex)
            {
                Console.WriteLine("Zoho Client Fetch Error: " + ex.Message);
                return new List<ZohoClientDto>();
            }
        }

        public async Task<bool> ImportZohoClientsAsync()
        {
            try
            {
                var clients = await GetZohoClientsAsync();

                using var connection = new MySqlConnection(_mysqlConnString);
                connection.Open();

                // Ensure table exists
                string createTableQuery = @"
        CREATE TABLE IF NOT EXISTS ZohoClient (
            clientId VARCHAR(100) PRIMARY KEY,
            clientName VARCHAR(255),
            currencyCode VARCHAR(50),
            billingMethod VARCHAR(100),
            emailId VARCHAR(150),
            firstName VARCHAR(100),
            lastName VARCHAR(100),
            phoneNo VARCHAR(50),
            mobileNo VARCHAR(50),
            faxNo VARCHAR(50),
            streetAddr VARCHAR(255),
            city VARCHAR(100),
            state VARCHAR(100),
            pincode VARCHAR(50),
            country VARCHAR(100),
            industry VARCHAR(100),
            compsize VARCHAR(100),
            description TEXT
        );";

                using var createCommand = new MySqlCommand(createTableQuery, connection);
                createCommand.ExecuteNonQuery();
                Console.WriteLine("🛠️ Ensured ZohoClient table exists.");

                foreach (var client in clients)
                {
                    string checkQuery = "SELECT COUNT(*) FROM ZohoClient WHERE clientId = @clientId";
                    using var checkCommand = new MySqlCommand(checkQuery, connection);
                    checkCommand.Parameters.AddWithValue("@clientId", client.clientId);
                    int exists = Convert.ToInt32(checkCommand.ExecuteScalar());

                    if (exists == 0)
                    {
                        string insertQuery = @"INSERT INTO ZohoClient 
                    (clientId, clientName, currencyCode, billingMethod, emailId, firstName, lastName, phoneNo, mobileNo, faxNo, 
                     streetAddr, city, state, pincode, country, industry, compsize, description)
                    VALUES 
                    (@clientId, @clientName, @currencyCode, @billingMethod, @emailId, @firstName, @lastName, @phoneNo, @mobileNo, @faxNo,
                     @streetAddr, @city, @state, @pincode, @country, @industry, @compsize, @description)";

                        using var insertCommand = new MySqlCommand(insertQuery, connection);
                        insertCommand.Parameters.AddWithValue("@clientId", client.clientId);
                        insertCommand.Parameters.AddWithValue("@clientName", client.clientName);
                        insertCommand.Parameters.AddWithValue("@currencyCode", client.currencyCode);
                        insertCommand.Parameters.AddWithValue("@billingMethod", client.billingMethod);
                        insertCommand.Parameters.AddWithValue("@emailId", client.emailId);
                        insertCommand.Parameters.AddWithValue("@firstName", client.firstName);
                        insertCommand.Parameters.AddWithValue("@lastName", client.lastName);
                        insertCommand.Parameters.AddWithValue("@phoneNo", client.phoneNo);
                        insertCommand.Parameters.AddWithValue("@mobileNo", client.mobileNo);
                        insertCommand.Parameters.AddWithValue("@faxNo", client.faxNo);
                        insertCommand.Parameters.AddWithValue("@streetAddr", client.streetAddr);
                        insertCommand.Parameters.AddWithValue("@city", client.city);
                        insertCommand.Parameters.AddWithValue("@state", client.state);
                        insertCommand.Parameters.AddWithValue("@pincode", client.pincode);
                        insertCommand.Parameters.AddWithValue("@country", client.country);
                        insertCommand.Parameters.AddWithValue("@industry", client.industry);
                        insertCommand.Parameters.AddWithValue("@compsize", client.compsize);
                        insertCommand.Parameters.AddWithValue("@description", client.description);

                        insertCommand.ExecuteNonQuery();
                        Console.WriteLine($"✅ Inserted: {client.clientName} ({client.clientId})");
                    }
                    else
                    {
                        string updateQuery = @"UPDATE ZohoClient SET 
                    clientName=@clientName, currencyCode=@currencyCode, billingMethod=@billingMethod, emailId=@emailId,
                    firstName=@firstName, lastName=@lastName, phoneNo=@phoneNo, mobileNo=@mobileNo, faxNo=@faxNo,
                    streetAddr=@streetAddr, city=@city, state=@state, pincode=@pincode, country=@country,
                    industry=@industry, compsize=@compsize, description=@description
                    WHERE clientId = @clientId";

                        using var updateCommand = new MySqlCommand(updateQuery, connection);
                        updateCommand.Parameters.AddWithValue("@clientName", client.clientName);
                        updateCommand.Parameters.AddWithValue("@currencyCode", client.currencyCode);
                        updateCommand.Parameters.AddWithValue("@billingMethod", client.billingMethod);
                        updateCommand.Parameters.AddWithValue("@emailId", client.emailId);
                        updateCommand.Parameters.AddWithValue("@firstName", client.firstName);
                        updateCommand.Parameters.AddWithValue("@lastName", client.lastName);
                        updateCommand.Parameters.AddWithValue("@phoneNo", client.phoneNo);
                        updateCommand.Parameters.AddWithValue("@mobileNo", client.mobileNo);
                        updateCommand.Parameters.AddWithValue("@faxNo", client.faxNo);
                        updateCommand.Parameters.AddWithValue("@streetAddr", client.streetAddr);
                        updateCommand.Parameters.AddWithValue("@city", client.city);
                        updateCommand.Parameters.AddWithValue("@state", client.state);
                        updateCommand.Parameters.AddWithValue("@pincode", client.pincode);
                        updateCommand.Parameters.AddWithValue("@country", client.country);
                        updateCommand.Parameters.AddWithValue("@industry", client.industry);
                        updateCommand.Parameters.AddWithValue("@compsize", client.compsize);
                        updateCommand.Parameters.AddWithValue("@description", client.description);
                        updateCommand.Parameters.AddWithValue("@clientId", client.clientId);

                        updateCommand.ExecuteNonQuery();
                        Console.WriteLine($"🔄 Updated: {client.clientName} ({client.clientId})");
                    }
                }

                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine("❌ Zoho Client Import Error: " + ex.Message);
                return false;
            }
        }

        public async Task<List<ZohoProjectDto>> GetZohoProjectDetailsAsync()
        {
            try
            {
                var accessToken = await GetAccessTokenUsingRefreshTokenAsync();
                if (string.IsNullOrEmpty(accessToken))
                    throw new Exception("Unable to get access token");

                using var client = new HttpClient();
                var request = new HttpRequestMessage(HttpMethod.Get, "https://people.zoho.com/people/api/timetracker/getprojects");
                request.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Zoho-oauthtoken", accessToken);

                var response = await client.SendAsync(request);
                var json = await response.Content.ReadAsStringAsync();

                if (!response.IsSuccessStatusCode)
                    throw new Exception($"Zoho Project API Error: {response.StatusCode}");

                // JSON Response structure is likely to be like: { "projects": [ ... ] }
                var result = JsonConvert.DeserializeObject<Dictionary<string, List<ZohoProjectDto>>>(json);

                return result != null && result.ContainsKey("projects")
                    ? result["projects"]
                    : new List<ZohoProjectDto>();
            }
            catch (Exception ex)
            {
                Console.WriteLine("Zoho Project Fetch Error: " + ex.Message);
                return new List<ZohoProjectDto>();
            }
        }

        public async Task<List<ZohoProjectDto>> GetAllZohoProjectsAsync()
        {
            var assignedToId = "741687000000297186"; // your fixed Zoho record ID

            var accessToken = await GetAccessTokenUsingRefreshTokenAsync();
            if (string.IsNullOrEmpty(accessToken))
                throw new Exception("Access token is missing");

            var httpClient = new HttpClient();
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Zoho-oauthtoken", accessToken);

            string url = $"https://people.zoho.com/people/api/timetracker/getprojects?assignedTo={HttpUtility.UrlEncode(assignedToId)}";

            var response = await httpClient.GetAsync(url);
            var json = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                Console.WriteLine($"❌ Failed for assignedTo: {assignedToId} → {json}");

                if (json.Contains("threshold limit exceeded"))
                {
                    Console.WriteLine("⚠️  Rate limit hit. Consider retrying after 5 minutes...");
                }

                return new List<ZohoProjectDto>();
            }

            var parsed = JsonConvert.DeserializeObject<ZohoProjectApiResponse>(json);
            if (parsed?.response?.result != null)
            {
                Console.WriteLine($"✅ Success → Found {parsed.response.result.Count} projects for assignedTo: {assignedToId}");
                return parsed.response.result;
            }

            return new List<ZohoProjectDto>();
        }        

        public async Task<List<ZohoProjectDto>> GetProjectsByClientAndAssignedToAsync(string? clientId = null, string? assignedTo = null)
        {
            var accessToken = await GetAccessTokenUsingRefreshTokenAsync();
            if (string.IsNullOrEmpty(accessToken))
                throw new Exception("Access token is missing");

            var httpClient = new HttpClient();
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Zoho-oauthtoken", accessToken);

            var queryParams = new List<string>();
            if (!string.IsNullOrWhiteSpace(clientId))
                queryParams.Add($"clientId={HttpUtility.UrlEncode(clientId)}");

            if (!string.IsNullOrWhiteSpace(assignedTo))
                queryParams.Add($"assignedTo={HttpUtility.UrlEncode(assignedTo)}");

            string url = "https://people.zoho.com/people/api/timetracker/getprojects";
            if (queryParams.Count > 0)
                url += "?" + string.Join("&", queryParams);

            var response = await httpClient.GetAsync(url);
            var json = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
                throw new Exception($"Failed to fetch projects: {json}");

            var parsed = JsonConvert.DeserializeObject<ZohoProjectApiResponse>(json);
            return parsed?.response?.result ?? new List<ZohoProjectDto>();
        }

        public async Task<List<ZohoProjectDto>> GetProjectsForAllEmployeesAsync()
        {
            var accessToken = await GetAccessTokenUsingRefreshTokenAsync();
            if (string.IsNullOrEmpty(accessToken))
                throw new Exception("Access token is missing");

            var employees = await _context.ZohoEmp
                .Where(e => !string.IsNullOrWhiteSpace(e.RecordId))
                .Select(e => new { e.UserName, e.RecordId })
                .ToListAsync();

            var httpClient = _httpClientFactory.CreateClient();
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Zoho-oauthtoken", accessToken);

            var allProjects = new ConcurrentBag<ZohoProjectDto>();
            var seenProjectIds = new ConcurrentDictionary<string, bool>();
            var throttler = new SemaphoreSlim(5); // Adjust throttle for Zoho API limits
            var tasks = new List<Task>();

            foreach (var emp in employees)
            {
                await throttler.WaitAsync();

                tasks.Add(Task.Run(async () =>
                {
                    try
                    {
                        string url = $"https://people.zoho.com/people/api/timetracker/getprojects?assignedTo={HttpUtility.UrlEncode(emp.RecordId)}";
                        var response = await httpClient.GetAsync(url);
                        var json = await response.Content.ReadAsStringAsync();

                        if (response.IsSuccessStatusCode)
                        {
                            var parsed = JsonConvert.DeserializeObject<ZohoProjectApiResponse>(json);
                            if (parsed?.response?.result != null)
                            {
                                foreach (var proj in parsed.response.result)
                                {
                                    if (seenProjectIds.TryAdd(proj.projectId, true))
                                        allProjects.Add(proj);
                                }
                            }
                            Console.WriteLine($"Success → AssignedTo: {emp.UserName} ({emp.RecordId})");
                        }
                        else
                        {
                            Console.WriteLine($"Failed → {emp.UserName}: {json}");

                            if (json.Contains("threshold limit exceeded"))
                            {
                                Console.WriteLine("Rate limit hit. Backing off 5 mins...");
                                await Task.Delay(TimeSpan.FromMinutes(5));
                            }
                        }

                        await Task.Delay(1500); // Wait before next call
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Error → {emp.UserName}: {ex.Message}");
                    }
                    finally
                    {
                        throttler.Release();
                    }
                }));
            }

            await Task.WhenAll(tasks);
            return allProjects.ToList();
        }

        public bool SaveZohoProjectsToDb(List<ZohoProjectDto> projects)
        {
            try
            {
                if (projects == null || !projects.Any())
                {
                    Console.WriteLine("No projects to insert.");
                    return false;
                }

                using var connection = new MySqlConnection(_mysqlConnString);
                connection.Open();

                // Create table if it doesn't exist
                string createTableQuery = @"
                CREATE TABLE IF NOT EXISTS ZohoProjects (
                    ProjectId VARCHAR(100) PRIMARY KEY,
                    ProjectName VARCHAR(255),
                    ClientId VARCHAR(100),
                    ClientName VARCHAR(255),
                    ProjectStatus VARCHAR(50),
                    OwnerId VARCHAR(100),
                    OwnerName VARCHAR(255),
                    IsDeleteAllowed BOOLEAN,
                    ProjectManagers JSON,
                    CreatedOn DATETIME
                );";

                using (var createCmd = new MySqlCommand(createTableQuery, connection))
                {
                    createCmd.ExecuteNonQuery();
                    Console.WriteLine("Ensured ZohoProjects table exists.");
                }

                foreach (var proj in projects)
                {
                    string checkQuery = "SELECT COUNT(*) FROM ZohoProjects WHERE ProjectId = @ProjectId";
                    using var checkCommand = new MySqlCommand(checkQuery, connection);
                    checkCommand.Parameters.AddWithValue("@ProjectId", proj.projectId);
                    int exists = Convert.ToInt32(checkCommand.ExecuteScalar());

                    string projectManagersJson = JsonConvert.SerializeObject(proj.projectManagers ?? new List<ProjectUser>());

                    if (exists == 0)
                    {
                        string insertQuery = @"
                INSERT INTO ZohoProjects 
                (ProjectId, ProjectName, ClientId, ClientName, ProjectStatus, OwnerId, OwnerName, IsDeleteAllowed, ProjectManagers, CreatedOn)
                VALUES 
                (@ProjectId, @ProjectName, @ClientId, @ClientName, @ProjectStatus, @OwnerId, @OwnerName, @IsDeleteAllowed, @ProjectManagers, @CreatedOn)";

                        using var insertCommand = new MySqlCommand(insertQuery, connection);
                        insertCommand.Parameters.AddWithValue("@ProjectId", proj.projectId);
                        insertCommand.Parameters.AddWithValue("@ProjectName", proj.projectName);
                        insertCommand.Parameters.AddWithValue("@ClientId", proj.clientId);
                        insertCommand.Parameters.AddWithValue("@ClientName", proj.clientName);
                        insertCommand.Parameters.AddWithValue("@ProjectStatus", proj.projectStatus);
                        insertCommand.Parameters.AddWithValue("@OwnerId", proj.ownerId);
                        insertCommand.Parameters.AddWithValue("@OwnerName", proj.ownerName);
                        insertCommand.Parameters.AddWithValue("@IsDeleteAllowed", proj.isDeleteAllowed);
                        insertCommand.Parameters.AddWithValue("@ProjectManagers", projectManagersJson);
                        insertCommand.Parameters.AddWithValue("@CreatedOn", DateTime.UtcNow);

                        insertCommand.ExecuteNonQuery();
                        Console.WriteLine($"Inserted: {proj.projectName} ({proj.projectId})");
                    }
                    else
                    {
                        string updateQuery = @"
                        UPDATE ZohoProjects SET 
                            ProjectName = @ProjectName,
                            ClientId = @ClientId,
                            ClientName = @ClientName,
                            ProjectStatus = @ProjectStatus,
                            OwnerId = @OwnerId,
                            OwnerName = @OwnerName,
                            IsDeleteAllowed = @IsDeleteAllowed,
                            ProjectManagers = @ProjectManagers
                        WHERE ProjectId = @ProjectId";

                        using var updateCommand = new MySqlCommand(updateQuery, connection);
                        updateCommand.Parameters.AddWithValue("@ProjectName", proj.projectName);
                        updateCommand.Parameters.AddWithValue("@ClientId", proj.clientId);
                        updateCommand.Parameters.AddWithValue("@ClientName", proj.clientName);
                        updateCommand.Parameters.AddWithValue("@ProjectStatus", proj.projectStatus);
                        updateCommand.Parameters.AddWithValue("@OwnerId", proj.ownerId);
                        updateCommand.Parameters.AddWithValue("@OwnerName", proj.ownerName);
                        updateCommand.Parameters.AddWithValue("@IsDeleteAllowed", proj.isDeleteAllowed);
                        updateCommand.Parameters.AddWithValue("@ProjectManagers", projectManagersJson);
                        updateCommand.Parameters.AddWithValue("@ProjectId", proj.projectId);

                        updateCommand.ExecuteNonQuery();
                        Console.WriteLine($"🔄 Updated: {proj.projectName} ({proj.projectId})");
                    }
                }

                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine("Zoho Project DB Save Error: " + ex.Message);
                return false;
            }
        }








    }
}
