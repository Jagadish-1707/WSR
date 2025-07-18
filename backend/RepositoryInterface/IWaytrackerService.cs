using backend.DtoModels;
using backend.Models;

namespace backend.RepositoryInterface
{
    public interface IWaytrackerService
    {
        Task<List<ContractorDetailsDto>> GetContractorList();
        Task<string> GetAccessTokenUsingRefreshTokenAsync();
        //bool AddEmployees(List<Employee> employees);

        Task<bool> ImportActiveEmployeesAsync();
        Task<List<ZohoEmp>> GetAllZohoEmployeesAsync();
        Task<List<ZohoProjectDto>> GetZohoProjectDetailsAsync();
        Task<List<ZohoClientDto>> GetZohoClientsAsync(int index = 1, int limit = 200);
        Task<bool> ImportZohoClientsAsync();
        Task<List<ZohoProjectDto>> GetAllZohoProjectsAsync();
        Task<List<ZohoProjectDto>> GetProjectsByClientAndAssignedToAsync(string? clientId = null, string? assignedTo = null);
        Task<List<ZohoProjectDto>> GetProjectsForAllEmployeesAsync();

        bool SaveZohoProjectsToDb(List<ZohoProjectDto> projects);
    }

}
