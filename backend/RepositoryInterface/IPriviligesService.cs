using backend.DtoModels;

namespace backend.RepositoryInterface
{
    public interface IPriviligesService
    {
        public Task<PriviligesDto> AddPrivilegesAsync(AddPriviligesDto addPriviliges);
        public Task<PriviligesDto> EditPrivilegesAsync(EditPriviligesDto editPriviliges);
        public Task<bool> DeletePrivilegesByIdAsync(int id, int UserId);
        public Task<List<PriviligesDto>> GetPrivilegesListAsync();
        public Task<PriviligesDto> GetPrivilegesByIdAsync(int id);
        public Task<List<PriviligesDto>> GetPrivilegesListByRoleIdAsync(int roleId);
    }
}
