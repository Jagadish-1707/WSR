using backend.Common;
using backend.DtoModels;
using backend.Models;
using backend.RepositoryInterface;
using Microsoft.EntityFrameworkCore;

namespace backend.ReposirotyService
{
    public class PriviligesService:IPriviligesService
    {
        private readonly IConfiguration _configuration;
        private readonly UnitOfWork _unitOfWork;

        public PriviligesService(IConfiguration configuration)
        {
            _configuration = configuration;
            _unitOfWork = new UnitOfWork(configuration);
        }

        public async Task<PriviligesDto> AddPrivilegesAsync(AddPriviligesDto addPriviliges)
        {
            try
            {
                int priviligeId = 0;

                Priviliges priviliges = new Priviliges();

                using (var transaction = _unitOfWork.PriviligesRepository.Context.Database.BeginTransaction())
                {

                    priviliges.ModelName = addPriviliges.ModelName;
                    priviliges.RoleId = addPriviliges.RoleId;
                    priviliges.AddPriviliges = addPriviliges.AddPriviliges;
                    priviliges.ViewPriviliges = addPriviliges.ViewPriviliges;
                    priviliges.EditPriviliges = addPriviliges.EditPriviliges;
                    priviliges.DeletePriviliges = addPriviliges.DeletePriviliges;
                    priviliges.Status = 1;
                    priviliges.Active = true;
                    priviliges.CreatedBy = addPriviliges.UserId != 0 ? addPriviliges.UserId.ToString() : null;
                    priviliges.CreatedOn = DateTime.Now;

                    _unitOfWork.PriviligesRepository.Insert(priviliges);

                    _unitOfWork.Save();
                    transaction.Commit();

                    priviligeId = priviliges.Id;
                }
                if (priviligeId != 0)
                {

                    return await GetPrivilegesByIdAsync(priviligeId);

                }
                else
                    return null;
            }
            catch (Exception e)
            {
                return null;
            }
            finally
            {

            }
        }

        
        public async Task<bool> DeletePrivilegesByIdAsync(int id, int userId)
        {
            try
            {
                var contextData = _unitOfWork.PriviligesRepository.Context;
                var priviliges=_unitOfWork.PriviligesRepository.GetByID(id);
                if (priviliges != null)
                {
                    using (var transaction = _unitOfWork.PriviligesRepository.Context.Database.BeginTransaction())
                    {
                        priviliges.Active = false;
                        priviliges.Status = 0;
                        priviliges.ModifiedOn= DateTime.Now;
                        priviliges.ModifiedBy = userId != 0 ? userId.ToString() : null;

                        _unitOfWork.PriviligesRepository.Update(priviliges);
                        contextData.SaveChanges();
                        transaction.Commit();
                        
                    }
                }
                return true;
            }
            catch(Exception e)
            {
                return false;
            }
        }

        public async Task<PriviligesDto> EditPrivilegesAsync(EditPriviligesDto editPriviliges)
        {
            try
            {
                var priviliges=_unitOfWork.PriviligesRepository.GetNoTrackWithInclude(p=>p.Id == editPriviliges.Id).FirstOrDefault();
                if (priviliges != null)
                {
                    using ( var transaction=_unitOfWork.PriviligesRepository.Context.Database.BeginTransaction() )
                    {
                        priviliges.Id = editPriviliges.Id;
                        priviliges.ModelName = editPriviliges.ModelName;
                        priviliges.RoleId = editPriviliges.RoleId;
                        priviliges.AddPriviliges = editPriviliges.AddPriviliges;
                        priviliges.EditPriviliges = editPriviliges.EditPriviliges;
                        priviliges.ViewPriviliges = editPriviliges.ViewPriviliges;
                        priviliges.DeletePriviliges = editPriviliges.DeletePriviliges;
                        priviliges.Status=editPriviliges.Status;
                        priviliges.ModifiedBy = editPriviliges.UserId != 0 ? editPriviliges.UserId.ToString() : null;
                        priviliges.ModifiedOn=DateTime.Now;
                        _unitOfWork.PriviligesRepository.Update(priviliges);
                        _unitOfWork.Save();
                        transaction.Commit();
                    }
                    return await GetPrivilegesByIdAsync( priviliges.Id );
                }
                return null;
            }
            catch(Exception ex)
            {
                return null;
            }
            finally
            {
            }
        }

        public async Task<PriviligesDto> GetPrivilegesByIdAsync(int id)
        {
                try
                {
                    var contextData = _unitOfWork.PriviligesRepository.Context;
                var priviligesDto = contextData.Priviliges.Where(w => w.Id.Equals(id)).Select(s => new PriviligesDto
                {
                    Id = s.Id,
                    ModelName = s.ModelName,
                    RoleId = s.RoleId,
                    Active = s.Active,
                    Status = s.Status,
                    AddPriviliges = s.AddPriviliges,
                    EditPriviliges = s.EditPriviliges,
                    ViewPriviliges = s.ViewPriviliges,
                    DeletePriviliges = s.DeletePriviliges,
                    CreatedOn = s.CreatedOn,
                    CreatedBy = s.CreatedBy,
                    ModifiedBy = s.ModifiedBy,
                    ModifiedOn = s.ModifiedOn
                }).FirstOrDefault();

                if (priviligesDto == null)
                {
                    return null;
                }
                else
                {
                    return priviligesDto;
                }
            }
                catch (Exception ex)
                {
                    ex.ToString();
                    return null;
                }

        }

        public async Task<List<PriviligesDto>> GetPrivilegesListAsync()
        {
            try
            {
                var contextData = _unitOfWork.PriviligesRepository.Context;
                var priviligesDto = await contextData.Priviliges.Where(w => w.Active.Equals(true)).Select(s => new PriviligesDto
                {
                    Id = s.Id,
                    ModelName = s.ModelName,
                    RoleId = s.RoleId,
                    Active = s.Active,
                    Status = s.Status,
                    AddPriviliges = s.AddPriviliges,
                    EditPriviliges = s.EditPriviliges,
                    ViewPriviliges = s.ViewPriviliges,
                    DeletePriviliges = s.DeletePriviliges,
                    CreatedOn = s.CreatedOn,
                    CreatedBy = s.CreatedBy,
                    ModifiedBy = s.ModifiedBy,
                    ModifiedOn = s.ModifiedOn

                }).ToListAsync();
                if (priviligesDto == null)
                {
                    return null;
                }
                else
                {
                    return priviligesDto;
                }
            }
            catch (Exception ex) 
            {
                ex.ToString();
                return null;
            }
        }

        public async Task<List<PriviligesDto>> GetPrivilegesListByRoleIdAsync(int roleId)
        {
            try
            {
                var contextData = _unitOfWork.PriviligesRepository.Context;
                var priviligesDto = await contextData.Priviliges.Where(w => w.RoleId.Equals(roleId) && w.Active.Equals(true)).Select(s => new PriviligesDto
                {
                    Id = s.Id,
                    ModelName = s.ModelName,
                    RoleId = s.RoleId,
                    Active = s.Active,
                    Status = s.Status,
                    AddPriviliges = s.AddPriviliges,
                    EditPriviliges = s.EditPriviliges,
                    ViewPriviliges = s.ViewPriviliges,
                    DeletePriviliges = s.DeletePriviliges,
                    CreatedOn = s.CreatedOn,
                    CreatedBy = s.CreatedBy,
                    ModifiedBy = s.ModifiedBy,
                    ModifiedOn = s.ModifiedOn
                }).ToListAsync();

                if (priviligesDto == null)
                {
                    return null;
                }
                else
                {
                    return priviligesDto;

                }
            }
            catch (Exception ex)
            {
                return null;
            }
        }
    }
}
