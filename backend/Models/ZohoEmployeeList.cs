using Newtonsoft.Json;

namespace backend.Models
{    
    public class ZohoEmployeeListResponse
    {
        [JsonProperty("data")]
        public List<ZohoEmployeeData> Data { get; set; }
    }

    public class ZohoEmployeeData
    {
        [JsonProperty("Employee ID")]
        public string Employee_Id { get; set; }

        [JsonProperty("First Name")]
        public string First_Name { get; set; }

        [JsonProperty("Last Name")]
        public string Last_Name { get; set; }

        [JsonProperty("Designation")]
        public string Designation { get; set; }

        [JsonProperty("Business Unit")]
        public string BusinessUnit { get; set; }

        [JsonProperty("Employee Status")]
        public string Status { get; set; }

        [JsonProperty("Current Experience")]
        public string Experience { get; set; }

        [JsonProperty("Personal Mobile Number")]
        public string Mobile { get; set; }

        [JsonProperty("Email address")]
        public string Email { get; set; }

        [JsonProperty("Date of Joining")]
        public string DateOfJoining { get; set; }

        [JsonProperty("Department")]
        public string Department { get; set; }

        [JsonProperty("Employment Type")]
        public string EmploymentType { get; set; }

        [JsonProperty("Reporting Manager")]
        public string Reporting_Manager { get; set; }

        [JsonProperty("Secondary Reporting Manager")]
        public string SecondReportingManager { get; set; }

        [JsonProperty("Work Location")]
        public string WorkLocation { get; set; }

        [JsonProperty("Location")]
        public string Location { get; set; }

        [JsonProperty("ownerName")]
        public string OwnerName { get; set; }

        [JsonProperty("recordId")]
        public string RecordId { get; set; }

        [JsonProperty("ApprovalStatus")]
        public string ApprovalStatus { get; set; }

        [JsonProperty("createdTime")]
        public string CreatedTime { get; set; }

        [JsonProperty("modifiedTime")]
        public string ModifiedTime { get; set; }
    }




}
