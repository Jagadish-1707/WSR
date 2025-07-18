using backend.Common;
using backend.DtoModels;
using backend.Models;
using backend.RepositoryInterface;
using Microsoft.EntityFrameworkCore;
using MySqlConnector;

namespace backend.ReposirotyService
{
    public class MasterService : IMasterService
    {
        private readonly IConfiguration _configuration;
        private readonly UnitOfWork _unitOfWork;

        public MasterService(IConfiguration configuration)
        {
            _configuration = configuration;
            _unitOfWork = new UnitOfWork(configuration);
        }

        // 1. Add a new ProjectTypeMaster
        public async Task<ProjectTypeMasterDto> AddProjectTypeMasterAsync(AddProjectTypeMasterDto addProjectTypeMasterDto)
        {
            try
            {
                int projectTypeId = 0;
                ProjectTypeMaster projectType = new ProjectTypeMaster();

                using (var transaction = _unitOfWork.ProjectTypeMasterRepository.Context.Database.BeginTransaction())
                {
                    projectType.ProjectTypeName = addProjectTypeMasterDto.ProjectTypeName;
                    projectType.Description = addProjectTypeMasterDto.Description;
                    projectType.StartDate = addProjectTypeMasterDto.StartDate;
                    projectType.EndDate = addProjectTypeMasterDto.EndDate;
                    projectType.Remarks = addProjectTypeMasterDto.Remarks;
                    projectType.Active = true;
                    projectType.Status = addProjectTypeMasterDto.Status;  
                    projectType.CreatedOn = DateTime.Now;
                    projectType.CreatedBy = addProjectTypeMasterDto.CreatedBy;

                    _unitOfWork.ProjectTypeMasterRepository.Insert(projectType);
                    _unitOfWork.Save();
                    transaction.Commit();
                    projectTypeId = projectType.Id;

                    if (projectTypeId != 0)
                    {
                        return await GetProjectTypeMasterByIdAsync(projectTypeId);
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
        }

        // 2. Edit an existing ProjectTypeMaster
        public async Task<ProjectTypeMasterDto> EditProjectTypeMasterAsync(EditProjectTypeMasterDto editProjectTypeMasterDto)
        {
            try
            {
                // Fetch the existing ProjectTypeMaster record
                var projectType = _unitOfWork.ProjectTypeMasterRepository.GetNoTrackWithInclude(p => p.Id == editProjectTypeMasterDto.Id).FirstOrDefault();

                if (projectType != null)
                {
                    using (var transaction = _unitOfWork.ProjectTypeMasterRepository.Context.Database.BeginTransaction())
                    {
                        // Update the ProjectTypeMaster properties
                        projectType.ProjectTypeName = editProjectTypeMasterDto.ProjectTypeName;
                        projectType.Description = editProjectTypeMasterDto.Description;
                        projectType.StartDate = editProjectTypeMasterDto.StartDate;
                        projectType.EndDate = editProjectTypeMasterDto.EndDate;
                        projectType.Remarks = editProjectTypeMasterDto.Remarks;
                        projectType.Status = editProjectTypeMasterDto.Status;
                        projectType.Active = editProjectTypeMasterDto.Active;
                        projectType.ModifiedOn = DateTime.Now;
                        projectType.ModifiedBy = editProjectTypeMasterDto.ModifiedBy;

                        //if (editProjectTypeMasterDto.EndDate.HasValue && editProjectTypeMasterDto.EndDate.Value.Date >= DateTime.Now.Date)
                        //{
                        //    projectType.Status = 1;
                        //}
                        //else
                        //{
                        //    projectType.Status = 0;
                        //}

                            // If ProjectType is being deactivated (Active set to false), update corresponding MetricsMaster entries
                        //    if (!editProjectTypeMasterDto.Active)
                        //{
                        //    // Update all MetricsMaster entries related to this ProjectTypeId
                        //    var metricsToUpdate = _unitOfWork.MetricsMasterRepository.Context.MetricsMaster
                        //        //.Where(m => m.ProjectTypeId == projectType.Id)
                        //        .ToList();

                        //    foreach (var metrics in metricsToUpdate)
                        //    {
                        //        metrics.Active = false;  // Set Active to false for all related MetricsMaster
                        //        _unitOfWork.MetricsMasterRepository.Update(metrics);
                        //    }
                        //}

                        // Save changes to ProjectTypeMaster and MetricsMaster
                        _unitOfWork.ProjectTypeMasterRepository.Update(projectType);
                        _unitOfWork.Save();
                        transaction.Commit();
                    }

                    return await GetProjectTypeMasterByIdAsync(projectType.Id);
                }

                return null;  // If ProjectTypeMaster was not found
            }
            catch (Exception ex)
            {
                // Handle and log exception if necessary
                return null;
            }
        }


        // 3. Get a ProjectTypeMaster by ID
        public async Task<ProjectTypeMasterDto> GetProjectTypeMasterByIdAsync(int id)
        {
            try
            {
                var contextData = _unitOfWork.ProjectTypeMasterRepository.Context;
                var projectTypeDto = contextData.ProjectTypeMaster.Where(w => w.Id == id).Select(s => new ProjectTypeMasterDto
                {
                    Id = s.Id,
                    ProjectTypeName = s.ProjectTypeName,
                    Description = s.Description,
                    StartDate = s.StartDate,
                    EndDate = s.EndDate,
                    Remarks = s.Remarks,
                    CreatedBy = s.CreatedBy,
                    CreatedOn = DateTime.Now,
                    Status = s.Status,
                    Active = s.Active,
                    ModifiedBy = s.ModifiedBy,
                    ModifiedOn = s.ModifiedOn
                }).FirstOrDefault();

                if (projectTypeDto == null)
                {
                    return null;
                }
                return projectTypeDto;
            }
            catch (Exception e)
            {
                return null;
            }
        }

        // 4. Get a list of ProjectTypeMasters
        public async Task<List<ProjectTypeMasterDto>> GetProjectTypeMasterListAsync()
        {
            try
            {
                //var today = DateTime.UtcNow.Date;

                var contextData = _unitOfWork.ProjectTypeMasterRepository.Context;

     //           var expiredRecords = await contextData.ProjectTypeMaster
     //.Where(s => s.Active == true && s.Status == 1 && s.EndDate.HasValue && s.EndDate.Value.Date < today)
     //.ToListAsync();

                //foreach (var record in expiredRecords)
                //{
                //    record.Status = 0;
                //}

                //// Step 3: Save changes to DB
                //if (expiredRecords.Any())
                //{
                //    await contextData.SaveChangesAsync();
                //}

                var projectTypeListDto = await contextData.ProjectTypeMaster
                    .Where(s => s.Active == true) // Only include active records
                    .OrderByDescending(s => s.Id) // Order by Id in descending order
                    .Select(s => new ProjectTypeMasterDto
                    {
                        Id = s.Id,
                        ProjectTypeName = s.ProjectTypeName,
                        Description = s.Description,
                        StartDate = s.StartDate,
                        EndDate = s.EndDate,
                        Remarks = s.Remarks,
                        CreatedBy = s.CreatedBy,
                        CreatedOn = s.CreatedOn,
                        Status = s.Status,
                        Active = s.Active,
                        ModifiedBy = s.ModifiedBy,
                        ModifiedOn = s.ModifiedOn
                    })
                    .ToListAsync();

                return projectTypeListDto ?? new List<ProjectTypeMasterDto>();  // Return empty list if null
            }
            catch (Exception e)
            {
                // Log the exception (e.g., for debugging)
                Console.WriteLine($"Error: {e.Message}");
                return null;
            }
        }

        // Ticket Type
        public async Task<TickettypeDto> AddTicketTypeAsync(AddTickettypeDto addPriority)
        {
            try
            {
                int priorityId = 0;
                Tickettype priority = new Tickettype();

                using (var transaction = _unitOfWork.TicketTypeRepository.Context.Database.BeginTransaction())
                {
                    priority.CustomerId = addPriority.CustomerId;
                    priority.Customer = addPriority.Customer;
                    priority.ProjectId = addPriority.ProjectId;
                    priority.Project = addPriority.Project;
                    priority.TicketType = addPriority.TicketType;
                    priority.Remarks = addPriority.Remarks;
                    priority.Status = addPriority.Status;
                    priority.Active = true;
                    priority.CreatedOn = DateTime.Now;

                    _unitOfWork.TicketTypeRepository.Insert(priority);
                    _unitOfWork.Save();
                    transaction.Commit();
                    priorityId = priority.Id;
                    if (priorityId != 0)
                    {
                        return await GetTicketTypeById(priorityId);
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
        public async Task<TickettypeDto> EditTicketTypeAsync(EditTickettypeDto editPriority)
        {
            try
            {
                var priority = _unitOfWork.TicketTypeRepository.GetNoTrackWithInclude(p => p.Id == editPriority.Id).FirstOrDefault();
                if (priority != null)
                {
                    using (var transaction = _unitOfWork.TicketTypeRepository.Context.Database.BeginTransaction())
                    {
                        priority.Id = editPriority.Id;
                        priority.CustomerId = editPriority.CustomerId;
                        priority.Customer = editPriority.Customer;
                        priority.Status = editPriority.Status;
                        priority.Active = editPriority.Active;
                        priority.TicketType = editPriority.TicketType;
                        priority.ProjectId = editPriority.ProjectId;
                        priority.Project = editPriority.Project;
                        priority.Remarks = editPriority.Remarks;
                        priority.ModifiedOn = DateTime.Now;
                        _unitOfWork.TicketTypeRepository.Update(priority);
                        _unitOfWork.Save();
                        transaction.Commit();
                    }
                    return await GetTicketTypeById(priority.Id);
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
        public async Task<TickettypeDto> GetTicketTypeById(int id)
        {
            try
            {
                var contextData = _unitOfWork.TicketTypeRepository.Context;
                var priorityDto = contextData.TicketType.Where(w => w.Id == id).Select(s => new TickettypeDto
                {
                    Id = s.Id,
                    CustomerId = s.CustomerId.ToString(),
                    Customer = s.Customer,
                    ProjectId = s.ProjectId.ToString(),
                    Project = s.Project,
                    TicketType = s.TicketType,
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
        public async Task<List<TickettypeDto>> GetTicketTypeList()
        {
            try
            {
                var contextData = _unitOfWork.TicketTypeRepository.Context;
                var priorityDto = await contextData.TicketType.Where(x => x.Active == true && x.Status == 1).Select(s => new TickettypeDto
                {
                    Id = s.Id,
                    CustomerId = s.CustomerId,
                    Customer = s.Customer,
                    ProjectId = s.ProjectId,
                    Project = s.Project,
                    TicketType = s.TicketType,
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
        //End Ticket type

        public async Task<MetricsMasterDto> AddMetricsMasterAsync(AddMetricsMasterDto addMetricsMasterDto)
        {
            try
            {
                var metricsMaster = new MetricsMaster
                {
                    MetricsName = addMetricsMasterDto.MetricsName,
                    Description = addMetricsMasterDto.Description,
                    // ProjectTypeId = addMetricsMasterDto.ProjectTypeId,
                    StartDate = addMetricsMasterDto.StartDate,
                    EndDate = addMetricsMasterDto.EndDate,
                    Remarks = addMetricsMasterDto.Remarks,
                    Active = true,
                    Status = addMetricsMasterDto.Status,
                    CreatedOn = DateTime.Now,
                    CreatedBy = addMetricsMasterDto.CreatedBy
                };

                _unitOfWork.MetricsMasterRepository.Insert(metricsMaster);
                _unitOfWork.Save();

                return await GetMetricsMasterByIdAsync(metricsMaster.Id);
            }
            catch (MySqlException ex) when (ex.Number == 1062) // 1062 is the error code for duplicate entry in MySQL
            {
                throw new InvalidOperationException("A record with the same MetricsName already exists.");
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while adding the metrics master: " + ex.Message);
            }
        }


        public async Task<MetricsMasterDto> EditMetricsMasterAsync(EditMetricsMasterDto editMetricsMasterDto)
        {
            try
            {
                var metricsMaster = await _unitOfWork.MetricsMasterRepository.GetNoTrackWithInclude(p => p.Id == editMetricsMasterDto.Id).FirstOrDefaultAsync();

                if (metricsMaster != null)
                {
                    metricsMaster.MetricsName = editMetricsMasterDto.MetricsName;
                    metricsMaster.Description = editMetricsMasterDto.Description;
                    // metricsMaster.ProjectTypeId = editMetricsMasterDto.ProjectTypeId;
                    metricsMaster.StartDate = editMetricsMasterDto.StartDate;
                    metricsMaster.EndDate = editMetricsMasterDto.EndDate;
                    metricsMaster.Remarks = editMetricsMasterDto.Remarks;
                    metricsMaster.ModifiedOn = DateTime.Now;
                    metricsMaster.Status = editMetricsMasterDto.Status;
                    metricsMaster.Active = editMetricsMasterDto.Active;
                    metricsMaster.ModifiedBy = editMetricsMasterDto.ModifiedBy;
                    //if (editMetricsMasterDto.EndDate.HasValue && editMetricsMasterDto.EndDate.Value.Date >= DateTime.Now.Date)
                    //{
                    //    metricsMaster.Status = 1;
                    //}
                    //else
                    //{
                    //    metricsMaster.Status = 0;
                    //}

                    _unitOfWork.MetricsMasterRepository.Update(metricsMaster);
                    _unitOfWork.Save();

                    return await GetMetricsMasterByIdAsync(metricsMaster.Id);
                }

                return null;
            }
            catch (Exception)
            {
                return null;
            }
        }

        public async Task<List<MetricsMasterDto>> GetMetricsMasterListAsync()
        {
            try
            {
                var metricsList = await _unitOfWork.MetricsMasterRepository.Context.MetricsMaster
                    .Where(m => m.Active == true && m.Status == 1) 
                    .OrderByDescending(m => m.Id)
                    .Select(m => new MetricsMasterDto
                    {
                        Id = m.Id,
                        MetricsName = m.MetricsName,
                        Description = m.Description,
                        // ProjectTypeId = m.ProjectTypeId,
                        StartDate = m.StartDate,
                        EndDate = m.EndDate,
                        Remarks = m.Remarks,
                        Status = m.Status,
                        Active = m.Active,
                        CreatedOn = m.CreatedOn,
                        ModifiedOn = m.ModifiedOn
                    }).ToListAsync();

                return metricsList ?? new List<MetricsMasterDto>();
            }
            catch (Exception ex)
            {
                // Handle the exception properly, e.g. log the error
                Console.WriteLine(ex.Message);
                return null;
            }
        }

              public async Task<List<MetricsMasterDto>> GetAllMetricsMasterListAsync()
        {
            try
            {
                var today = DateTime.UtcNow.Date;

                var contextData = _unitOfWork.ProjectTypeMasterRepository.Context;

     //           var expiredRecords = await contextData.ProjectTypeMaster
     //.Where(s => s.Active == true && s.Status == 1 && s.EndDate.HasValue && s.EndDate.Value.Date < today)
     //.ToListAsync();

     //           foreach (var record in expiredRecords)
     //           {
     //               record.Status = 0;
     //           }

     //           // Step 3: Save changes to DB
     //           if (expiredRecords.Any())
     //           {
     //               await contextData.SaveChangesAsync();
     //           }

                var metricsList = await _unitOfWork.MetricsMasterRepository.Context.MetricsMaster
                    .Where(m => m.Active == true)
                    .OrderByDescending(m => m.Id)
                    .Select(m => new MetricsMasterDto
                    {
                        Id = m.Id,
                        MetricsName = m.MetricsName,
                        Description = m.Description,
                        // ProjectTypeId = m.ProjectTypeId,
                        StartDate = m.StartDate,
                        EndDate = m.EndDate,
                        Remarks = m.Remarks,
                        Status = m.Status,
                        Active = m.Active,
                        CreatedOn = m.CreatedOn,
                        ModifiedOn = m.ModifiedOn
                    }).ToListAsync();

                return metricsList ?? new List<MetricsMasterDto>();
            }
            catch (Exception ex)
            {
                // Handle the exception properly, e.g. log the error
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<MetricsMasterDto> GetMetricsMasterByIdAsync(int id)
        {
            try
            {
                var metricsMaster = await _unitOfWork.MetricsMasterRepository.Context.MetricsMaster
                    .Where(m => m.Id == id)
                    .Select(m => new MetricsMasterDto
                    {
                        Id = m.Id,
                        MetricsName = m.MetricsName,
                        Description = m.Description,
                        // ProjectTypeId = m.ProjectTypeId,
                        StartDate = m.StartDate,
                        EndDate = m.EndDate,
                        Remarks = m.Remarks,
                        Status = m.Status,
                        Active = m.Active,
                        CreatedOn = m.CreatedOn,
                        ModifiedOn = m.ModifiedOn
                    }).FirstOrDefaultAsync();

                return metricsMaster;
            }
            catch (Exception)
            {
                return null;
            }
        }


        public async Task<GeneralMetricsMasterDto> AddGeneralMetricsMasterAsync(AddGeneralMetricsMasterDto addGeneralMetricsMasterDto)
        {
            try
            {
                var generalMetricsMaster = new GeneralMetricsMaster
                {
                    GeneralMetricsName = addGeneralMetricsMasterDto.GeneralMetricsName,
                    Description = addGeneralMetricsMasterDto.Description,
                    StartDate = addGeneralMetricsMasterDto.StartDate,
                    EndDate = addGeneralMetricsMasterDto.EndDate,
                    Remarks = addGeneralMetricsMasterDto.Remarks,
                    Status = addGeneralMetricsMasterDto.Status,
                    CreatedOn = DateTime.Now,
                    Active = true,
                    CreatedBy = addGeneralMetricsMasterDto.CreatedBy
                };

                _unitOfWork.GeneralMetricsMasterRepository.Insert(generalMetricsMaster);
                _unitOfWork.Save();

                return await GetGeneralMetricsMasterByIdAsync(generalMetricsMaster.Id);
            }
            catch (MySqlException ex) when (ex.Number == 1062) 
            {
                throw new InvalidOperationException("A record with the same GeneralMetricsName already exists.");
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while adding the general metrics master: " + ex.Message);
            }
        }

        public async Task<GeneralMetricsMasterDto> EditGeneralMetricsMasterAsync(EditGeneralMetricsMasterDto editGeneralMetricsMasterDto)
        {
            try
            {
                var generalMetricsMaster = await _unitOfWork.GeneralMetricsMasterRepository.GetNoTrackWithInclude(p => p.Id == editGeneralMetricsMasterDto.Id).FirstOrDefaultAsync();

                if (generalMetricsMaster != null)
                {
                    generalMetricsMaster.GeneralMetricsName = editGeneralMetricsMasterDto.GeneralMetricsName;
                    generalMetricsMaster.Description = editGeneralMetricsMasterDto.Description;
                    generalMetricsMaster.StartDate = editGeneralMetricsMasterDto.StartDate;
                    generalMetricsMaster.EndDate = editGeneralMetricsMasterDto.EndDate;
                    generalMetricsMaster.Remarks = editGeneralMetricsMasterDto.Remarks;
                    generalMetricsMaster.ModifiedOn = DateTime.Now;
                    generalMetricsMaster.Status = editGeneralMetricsMasterDto.Status;
                    generalMetricsMaster.Active = editGeneralMetricsMasterDto.Active;
                    generalMetricsMaster.ModifiedBy = editGeneralMetricsMasterDto.ModifiedBy;

                    _unitOfWork.GeneralMetricsMasterRepository.Update(generalMetricsMaster);
                    _unitOfWork.Save();

                    return await GetGeneralMetricsMasterByIdAsync(generalMetricsMaster.Id);
                }

                return null;
            }
            catch (Exception)
            {
                return null;
            }
        }

        public async Task<List<GeneralMetricsMasterDto>> GetGeneralMetricsMasterListAsync()
        {
            try
            {
                var generalMetricsList = await _unitOfWork.GeneralMetricsMasterRepository.Context.GeneralMetricsMaster
                    .Where(m => m.Active == true)  // Only active records
                    .OrderByDescending(m => m.Id)
                    .Select(m => new GeneralMetricsMasterDto
                    {
                        Id = m.Id,
                        GeneralMetricsName = m.GeneralMetricsName,
                        Description = m.Description,
                        StartDate = m.StartDate,
                        EndDate = m.EndDate,
                        Remarks = m.Remarks,
                        Status = m.Status,
                        Active = m.Active,
                        CreatedOn = m.CreatedOn,
                        ModifiedOn = m.ModifiedOn
                    }).ToListAsync();

                return generalMetricsList ?? new List<GeneralMetricsMasterDto>();
            }
            catch (Exception ex)
            {
                // Handle the exception properly, e.g. log the error
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<GeneralMetricsMasterDto> GetGeneralMetricsMasterByIdAsync(int id)
        {
            try
            {
                var generalMetricsMaster = await _unitOfWork.GeneralMetricsMasterRepository.Context.GeneralMetricsMaster
                    .Where(m => m.Id == id)
                    .Select(m => new GeneralMetricsMasterDto
                    {
                        Id = m.Id,
                        GeneralMetricsName = m.GeneralMetricsName,
                        Description = m.Description,
                        StartDate = m.StartDate,
                        EndDate = m.EndDate,
                        Remarks = m.Remarks,
                        Status = m.Status,
                        Active = m.Active,
                        CreatedOn = m.CreatedOn,
                        ModifiedOn = m.ModifiedOn
                    }).FirstOrDefaultAsync();

                return generalMetricsMaster;
            }
            catch (Exception)
            {
                return null;
            }
        }
    }
}
