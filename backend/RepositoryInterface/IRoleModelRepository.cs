using backend.DtoModels;
using backend.Models;

namespace backend.RepositoryInterface
{
    public interface IRoleModelRepository
    {
        Task<IEnumerable<RoleModelsDto>> GetModelsByRoleIdAsync(int roleId);
        Task AddRoleModelsAsync(AddRoleModelsDto dto);
        Task<List<string>> GetModelNamesByRoleNameAsync(string roleName);
        Task<IEnumerable<ProjectModelsDto>> GetModelsAsync();
    }
}
