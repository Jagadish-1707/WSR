using backend.Common;
using backend.DtoModels;
using backend.Models;
using backend.RepositoryInterface;
using Microsoft.EntityFrameworkCore;

namespace backend.ReposirotyService
{
    public class PriorityService : IPriorityService
    {
        private readonly IConfiguration _configuration;
        private readonly UnitOfWork _unitOfWork;

        public PriorityService(IConfiguration configuration)
        {
            _configuration= configuration;
            _unitOfWork=new UnitOfWork(configuration);
        }

        public async Task<PriorityDto> AddPriorityAsync(AddPriorityDto addPriority)
        {
            try
            {
                int priorityId = 0;
                Priority priority=new Priority();

                using (var transaction=_unitOfWork.PriorityRepository.Context.Database.BeginTransaction())
                {
                    priority.CustomerId = addPriority.CustomerId;
                    priority.Customer=addPriority.Customer;
                    priority.ProjectId = addPriority.ProjectId;
                    priority.Project=addPriority.Project;
                    priority.ProjectPriority=addPriority.ProjectPriority;
                    priority.Remarks=addPriority.Remarks;
                    priority.Status=addPriority.Status;
                    priority.Active = true;
                    //priority.CreatedBy=addPriority.UserId!=0?addPriority.UserId.ToString():null;
                    priority.CreatedOn=DateTime.Now;

               

                _unitOfWork.PriorityRepository.Insert(priority);
                    _unitOfWork.Save();
                    transaction.Commit();
                    priorityId = priority.Id;
                    if (priorityId != 0)
                    {
                        return await GetPriorityByIdAsync(priorityId);
                    }
                    else
                    {
                        return null;
                    }
                }
            }
            catch (Exception e)
            {
                return null;
            }
            finally
            { 
            }
        }

        public async Task<PriorityDto> EditPriorityAsync(EditPriorityDto editPriority)
        {
            try
            {
                var priority=_unitOfWork.PriorityRepository.GetNoTrackWithInclude(p=>p.Id==editPriority.Id).FirstOrDefault();
                if (priority != null)
                {
                    using (var transaction=_unitOfWork.PriorityRepository.Context.Database.BeginTransaction())
                    {
                        priority.Id=editPriority.Id;
                        priority.CustomerId = editPriority.CustomerId;
                        priority.Customer = editPriority.Customer;
                        priority.Status=editPriority.Status;
                        priority.Active = editPriority.Active;
                        priority.ProjectPriority=editPriority.ProjectPriority;
                        priority.ProjectId=editPriority.ProjectId;
                        priority.Project=editPriority.Project;
                        priority.Remarks=editPriority.Remarks;
                        //priority.ModifiedBy=editPriority.UserId!=0? editPriority.UserId.ToString():null;
                        priority.ModifiedOn=DateTime.Now;
                        _unitOfWork.PriorityRepository.Update(priority);
                        _unitOfWork.Save();
                        transaction.Commit();
                    }
                    return await GetPriorityByIdAsync(priority.Id);
                }
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

        public async Task<PriorityDto> GetPriorityByIdAsync(int id)
        {
            try
            {
                var contextData = _unitOfWork.PriorityRepository.Context;
                var priorityDto = contextData.Priority.Where(w => w.Id == id).Select(s => new PriorityDto
                {
                    Id = s.Id,
                    CustomerId = s.CustomerId.ToString(),
                    Customer = s.Customer,
                    ProjectId = s.ProjectId.ToString(),
                    Project = s.Project,
                    ProjectPriority = s.ProjectPriority,
                    Remarks = s.Remarks,
                    CreatedBy = s.CreatedBy,
                    CreatedOn = DateTime.Now,
                    Status = s.Status,
                    Active = s.Active,
                    ModifiedBy = s.ModifiedBy,
                    ModifiedOn = s.ModifiedOn
                }).FirstOrDefault();
                if (priorityDto == null)
                {
                    return null;
                }
                else
                {
                    return priorityDto;
                }
            }
            catch (Exception e)
            {
                return null;
            }
        }

        public async Task<List<PriorityDto>> GetPriorityListAsync()
        {
            try
            {
                var contextData= _unitOfWork.PriorityRepository.Context;
                var priorityDto = await contextData.Priority.Where(x => x.Active == true).Select(s => new PriorityDto
                {
                    Id = s.Id,
                    CustomerId = s.CustomerId.ToString(),
                    Customer = s.Customer,
                    ProjectId = s.ProjectId.ToString(),
                    Project = s.Project,
                    ProjectPriority = s.ProjectPriority,
                    Remarks = s.Remarks,
                    CreatedBy = s.CreatedBy,
                    CreatedOn = s.CreatedOn,
                    Status = s.Status,
                    Active = s.Active,
                    ModifiedBy = s.ModifiedBy,
                    ModifiedOn = s.ModifiedOn
                }).ToListAsync();
                if (priorityDto != null)
                {
                    return priorityDto;
                }
                else
                {
                    return null;
                }
            }
            catch (Exception e)
            {
                return null;
            }
        }


        public async Task<List<PriorityDto>> GetMetricsPriorityList()
        {
            try
            {
                var contextData = _unitOfWork.PriorityRepository.Context;
                var priorityDto = await contextData.Priority.Where(x => x.Active == true && x.Status == 1).Select(s => new PriorityDto
                {
                    Id = s.Id,
                    CustomerId = s.CustomerId,
                    Customer = s.Customer,
                    ProjectId = s.ProjectId,
                    Project = s.Project,
                    ProjectPriority = s.ProjectPriority,
                    Remarks = s.Remarks,
                    CreatedBy = s.CreatedBy,
                    CreatedOn = s.CreatedOn,
                    Status = s.Status,
                    Active = s.Active,
                    ModifiedBy = s.ModifiedBy,
                    ModifiedOn = s.ModifiedOn
                }).ToListAsync();
                if (priorityDto != null)
                {
                    return priorityDto;
                }
                else
                {
                    return null;
                }
            }
            catch (Exception e)
            {
                return null;
            }
        }

    }
}
