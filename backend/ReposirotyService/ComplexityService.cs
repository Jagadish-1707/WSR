using backend.Common;
using backend.DtoModels;
using backend.Models;
using backend.RepositoryInterface;
using Microsoft.EntityFrameworkCore;

namespace backend.ReposirotyService
{
    public class ComplexityService : IComplexityService
    {
        private readonly IConfiguration _configuration;
        private readonly UnitOfWork _unitOfWork;

        public ComplexityService(IConfiguration configuration)
        {
            _configuration = configuration;
            _unitOfWork = new UnitOfWork(configuration);
        }

        public async Task<ComplexityDto> AddComplexityAsync(AddComplexityDto addComplexity)
        {
            try
            {
                int complexityId = 0;
                Complexity complexity = new Complexity();

                using (var transaction = _unitOfWork.ComplexityRepository.Context.Database.BeginTransaction())
                {
                    complexity.CustomerId = addComplexity.CustomerId;
                    complexity.Customer = addComplexity.Customer;
                    complexity.ProjectId = addComplexity.ProjectId;
                    complexity.Project = addComplexity.Project;
                    complexity.ProjectComplexity = addComplexity.ProjectComplexity;
                    complexity.Remarks = addComplexity.Remarks;
                    complexity.Status = addComplexity.Status;
                    complexity.Active = true;
                    //priority.CreatedBy=addPriority.UserId!=0?addPriority.UserId.ToString():null;
                    complexity.CreatedOn = DateTime.Now;

                    _unitOfWork.ComplexityRepository.Insert(complexity);
                    _unitOfWork.Save();
                    transaction.Commit();
                    complexityId = complexity.Id;
                    if (complexityId != 0)
                    {
                        return await GetComplexityByIdAsync(complexityId);
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

        public async Task<ComplexityDto> EditComplexityAsync(EditComplexityDto editComplexity)
        {
            try
            {
                var complexity = _unitOfWork.ComplexityRepository.GetNoTrackWithInclude(p => p.Id == editComplexity.Id).FirstOrDefault();
                if (complexity != null)
                {
                    using (var transaction = _unitOfWork.ComplexityRepository.Context.Database.BeginTransaction())
                    {
                        complexity.Id = editComplexity.Id;
                        complexity.CustomerId = editComplexity.CustomerId;
                        complexity.Customer = editComplexity.Customer;
                        complexity.Status = editComplexity.Status;
                        complexity.Active = true;
                        complexity.ProjectComplexity = editComplexity.ProjectComplexity;
                        complexity.ProjectId = editComplexity.ProjectId;
                        complexity.Project = editComplexity.Project;
                        complexity.Remarks = editComplexity.Remarks;
                        //priority.ModifiedBy=editPriority.UserId!=0? editPriority.UserId.ToString():null;
                        complexity.ModifiedOn = DateTime.Now;
                        _unitOfWork.ComplexityRepository.Update(complexity);
                        _unitOfWork.Save();
                        transaction.Commit();
                    }
                    return await GetComplexityByIdAsync(complexity.Id);
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

        public async Task<ComplexityDto> GetComplexityByIdAsync(int id)
        {
            try
            {
                var contextData = _unitOfWork.ComplexityRepository.Context;
                var ComplexityDto = contextData.Complexitys.Where(w => w.Id == id).Select(s => new ComplexityDto
                {
                    Id = s.Id,
                    CustomerId = s.CustomerId,
                    Customer = s.Customer,
                    ProjectId = s.ProjectId,
                    Project = s.Project,
                    ProjectComplexity = s.ProjectComplexity,
                    Remarks = s.Remarks,
                    CreatedBy = s.CreatedBy,
                    CreatedOn = DateTime.Now,
                    Status = s.Status,
                    Active = s.Active,
                    ModifiedBy = s.ModifiedBy,
                    ModifiedOn = s.ModifiedOn
                }).FirstOrDefault();
                if (ComplexityDto == null)
                {
                    return null;
                }
                else
                {
                    return ComplexityDto;
                }
            }
            catch (Exception e)
            {
                return null;
            }
        }

        public async Task<List<ComplexityDto>> GetComplexityListAsync()
        {
            try
            {
                var contextData = _unitOfWork.ComplexityRepository.Context;
                var ComplexityDto = await contextData.Complexitys.OrderByDescending(s => s.Id).Select(s => new ComplexityDto
                {
                    Id = s.Id,
                    Customer = s.Customer,
                    Project = s.Project,
                    ProjectComplexity = s.ProjectComplexity,
                    Remarks = s.Remarks,
                    CreatedBy = s.CreatedBy,
                    CreatedOn = s.CreatedOn,
                    Status = s.Status,
                    Active = s.Active,
                    ModifiedBy = s.ModifiedBy,
                    ModifiedOn = s.ModifiedOn
                }).ToListAsync();
                if (ComplexityDto != null)
                {
                    return ComplexityDto;
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
