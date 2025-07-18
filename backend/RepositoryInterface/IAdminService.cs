using backend.DtoModels;
using backend.Models;

namespace backend.RepositoryInterface
{
    public interface IAdminService
    {
        public Task<RoleDto> AddRoleAsync(AddRoleDto addRole);
        public Task<RoleDto> EditRoleAsync(EditRoleDto editRole);
        public Task<bool> DeleteRoleByIdAsync(int id,int UserId);
        public Task<List<RoleDto>> GetRolesListAsync();
        public Task<List<RolesDto>> GetRolesAsync();
        public Task<RoleDto> GetRoleByIdAsync(int id);
        public Task<List<Client>> GetClientListAsync();
        public Task<List<Projects>> GetProjectsListAsync(int clientid);
        public Task<List<AssignRoleDto>> AddAssignRoleAsync(AddAssignRoleDto addAssignRole);
        public Task<List<AssignRoleDto>> GetAssignRoleByRoleIdAsync(int roleId);
        public Task<AssignRoleDto> GetAssignRoleByIdAsync(int Id);
        public Task<List<AssignRoleDto>> GetAssignRolesListAsync();
        public Task<List<AssignRoleDto>> EditAssignRolesAsync(EditAssignRoleDto editAssignRole);
        public Task<bool> DeleteAssignRoleByIdAsync(int id, int UserId);
        public Task<List<DepartmentDto>> GetDepartmentsAsync();

    }
}
