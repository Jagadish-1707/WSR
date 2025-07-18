using backend.Common;
using backend.DtoModels;
using backend.Models;
using backend.RepositoryInterface;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Client;
using System.Linq;
using System.Linq.Expressions;

namespace backend.ReposirotyService
{
    public class MetricsService : IMetricsService
    {
        private readonly IConfiguration _configuration;
        private readonly UnitOfWork _unitOfWork;

        public MetricsService(IConfiguration configuration)
        {
            _configuration = configuration;
            _unitOfWork = new UnitOfWork(configuration);
        }

        // --- GET All Metrics (for the main grid view) ---
        public async Task<List<MetricsDto>> GetAllMetricsData()
        {
            var dbContext = _unitOfWork.MetricsprojectfieldRepository.Context; // Adjust to your DbContext access

            // This query is for your first table display
            // It needs to join MetricsData with Tasks, ProjectDetails, ProjectTypes
            var metricsList = await (from md in dbContext.MetricsDetails
                                     join t in dbContext.Tasks on md.ProjectId equals t.ProjectId
                                     join pd in dbContext.ProjectDetails on t.ProjectId equals pd.ProjectId 
                                     //join pt in dbContext.ProjectTypeMetricSelection on t.Id equals pt.ProjectId 
                                     join prt in dbContext.ProjectTypeMaster on t.ProjectType equals prt.Id
                                     
                                     select new MetricsDto
                                     {
                                         Id = md.Id,
                                         ProjectId = md.ProjectId,
                                         CustomerId = md.CustomerId,
                                         MonthYear = md.MonthYear,
                                         WeekStartDate = md.WeekStartDate,
                                         WeekEndDate = md.WeekEndDate,
                                         CustomerName = t.CustomerName,
                                         ProjectName = t.ProjectName,   
                                         ProjectType = prt.ProjectTypeName, 
                                                                
                                     })
                                     .OrderByDescending(m => m.Id)
                                     .ToListAsync();

            return metricsList;
        }

        public async Task<MetricsDto> GetMetricsDataById(int metricsDataId)
        {
            var dbContext = _unitOfWork.MetricsprojectfieldRepository.Context;

            // 1. Load main record
            var md = await dbContext.MetricsDetails
                .FirstOrDefaultAsync(m => m.Id == metricsDataId);

            if (md == null)
                return null;

            // 2. Load related names separately
            var customerName = await dbContext.Tasks
                .Where(t => t.CustomerId == md.CustomerId)
                .Select(t => t.CustomerName)
                .FirstOrDefaultAsync();

            var projectName = await dbContext.Tasks
                .Where(t => t.ProjectId == md.ProjectId)
                .Select(t => t.ProjectName)
                .FirstOrDefaultAsync();

            var projectType = await dbContext.ProjectTypeMaster
                .Where(pt => pt.Id == md.ProjectTypeId)
                .Select(pt => pt.ProjectTypeName)
                .FirstOrDefaultAsync();

            // 3. Load field values
            var fieldValues = await (
                from mfv in dbContext.MetricsDetailsFieldValues
                join mpf in dbContext.MetricsProjectField
                    on mfv.FieldColumnId equals mpf.Id
                where mfv.MetricsDetailsId == md.Id
                select new
                {
                    mfv.RowNumber,
                    mfv.FieldColumnId,
                    mfv.FieldValue,
                    mpf.FieldName,
                    mpf.FieldType,
                    IsMandatory = dbContext.SelectionCheckBoxOption
                        .Where(ptms => ptms.FieldColumnId == mpf.Id)
                        .Select(ptms => ptms.IsMandatory)
                        .FirstOrDefault()
                })
                .OrderBy(x => x.RowNumber)
                .ToListAsync();

            // 4. Map to DTO
            var metricsDto = new MetricsDto
            {
                Id = md.Id,
                ProjectId = md.ProjectId,
                CustomerId = md.CustomerId,
                ProjectTypeId = md.ProjectTypeId,
                MonthYear = md.MonthYear,
                WeekStartDate = md.WeekStartDate,
                WeekEndDate = md.WeekEndDate,
                CustomerName = customerName,
                ProjectName = projectName,
                ProjectType = projectType,
                DynamicFieldRows = fieldValues
                    .GroupBy(x => x.RowNumber)
                    .OrderBy(g => g.Key)
                    .Select(g => new MetricsDataRowDto
                    {
                        FieldsInRow = g.Select(f => new MetricsFieldValueDto
                        {
                            FieldColumnId = f.FieldColumnId,
                            FieldValue = f.FieldValue,
                            RowNumber = f.RowNumber
                        }).ToList()
                    })
                    .ToList()
            };

            return metricsDto;
        }


        // --- SAVE New Metrics Data ---
        public async Task<MetricsDto> SaveMetrics(AddMetricsDetailsDto dto)
        {
            try
            {
                var dbContext = _unitOfWork.MetricsDetailsRepository.Context;

                var metricsDetails = new MetricsDetails
                {
                    CustomerId = dto.CustomerId,
                    ProjectId = dto.ProjectId,
                    ProjectTypeId = dto.ProjectTypeId,
                    MonthYear = dto.MonthYear,
                    WeekStartDate = dto.WeekStartDate,
                    WeekEndDate = dto.WeekEndDate,
                };

                _unitOfWork.MetricsDetailsRepository.Insert(metricsDetails);
                _unitOfWork.Save();

                if (dto.FieldValues != null && dto.FieldValues.Any())
                {
                    foreach (var fvDto in dto.FieldValues)
                    {
                        var metricsFieldValue = new MetricsDetailsFieldValues
                        {
                            FieldColumnId = fvDto.FieldColumnId,
                            FieldValue = fvDto.FieldValue,
                            MetricsDetailsId = metricsDetails.Id,
                            RowNumber = fvDto.RowNumber
                        };
                        _unitOfWork.TicketDetailsRepository.Insert(metricsFieldValue);
                    }
                }

                _unitOfWork.Save();
                return await GetMetricsDataById(metricsDetails.Id);
            }
            catch (Exception e)
            {
                return null;
            }
        }
        // --- EDIT Existing Metrics Data ---
        public async Task<MetricsDto> UpdateMetrics(EditMetricsDetailsDto dto)
        {
            try
            {
                var dbContext = _unitOfWork.MetricsDetailsRepository.Context;

                // 1. Fetch the existing MetricsDetails record, eagerly including its current MetricsFieldValues.
                var metricsDataToUpdate = await dbContext.MetricsDetails
                                                         .Include(md => md.MetricsFieldValues)
                                                         .FirstOrDefaultAsync(md => md.Id == dto.Id);

                if (metricsDataToUpdate == null)
                {
                    return null;
                }

                // 2. Update the main MetricsDetails properties
                metricsDataToUpdate.CustomerId = dto.CustomerId;
                metricsDataToUpdate.ProjectId = dto.ProjectId;
                metricsDataToUpdate.ProjectTypeId = dto.ProjectTypeId;
                metricsDataToUpdate.MonthYear = dto.MonthYear;
                metricsDataToUpdate.WeekStartDate = dto.WeekStartDate;
                metricsDataToUpdate.WeekEndDate = dto.WeekEndDate;

                _unitOfWork.MetricsDetailsRepository.Update(metricsDataToUpdate);
                _unitOfWork.Save();

                if (metricsDataToUpdate.MetricsFieldValues != null && metricsDataToUpdate.MetricsFieldValues.Any())
                {
                    dbContext.MetricsDetailsFieldValues.RemoveRange(metricsDataToUpdate.MetricsFieldValues); // Assuming DbSet<MetricsFieldValue> is named MetricsFieldValues
                }

                if (dto.FieldValues != null && dto.FieldValues.Any())
                {
                    foreach (var fvDto in dto.FieldValues)
                    {
                        var newMetricsFieldValue = new MetricsDetailsFieldValues
                        {
                            FieldColumnId = fvDto.FieldColumnId,
                            FieldValue = fvDto.FieldValue,
                            RowNumber = fvDto.RowNumber,
                            MetricsDetailsId = metricsDataToUpdate.Id
                        };
                        _unitOfWork.TicketDetailsRepository.Insert(newMetricsFieldValue);
                    }
                }

                _unitOfWork.Save();
                return await GetMetricsDataById(metricsDataToUpdate.Id);
            }
            catch (Exception e)
            {
                return null;
            }
        }
        // --- DELETE Metrics Data ---
        public async Task<bool> DeleteMetrics(int metricsDataId)
        {
            var dbContext = _unitOfWork.MetricsprojectfieldRepository.Context;
            var metricsData = await dbContext.MetricsDetails.FindAsync(metricsDataId);

            if (metricsData == null)
            {
                return false;
            }

            dbContext.MetricsDetails.Remove(metricsData);
            await dbContext.SaveChangesAsync();
            return true;
        }

        //get ProjecType by ProjectId
        public async Task<List<ProjectTypeMasterDto>> GetProjectTypeByProjectId(string projectId)
        {
            var context = _unitOfWork.TaskDetailsRepository.Context;

            var projectMetricsList = (from task in context.Tasks
                                      where task.ProjectId == projectId
                                      join projectType in context.ProjectTypeMaster on task.ProjectType equals projectType.Id into projectGroup
                                      from pt in projectGroup.DefaultIfEmpty()

                                      select new ProjectTypeMasterDto
                                      {
                                          Id = pt != null ? pt.Id : 0,
                                          ProjectTypeName = pt != null ? pt.ProjectTypeName : string.Empty
                                      }
            ).ToList();

            return projectMetricsList;
        }

        //get emp from task using projectid
        public async Task<List<AssignedToDto>> GetMetricsAssignedEmployee(string projectId)
        {
            try
            {
                var DtoList = _unitOfWork.TaskDetailsRepository.Context;

                var EmpList = (from task in DtoList.Tasks
                               where task.ProjectId == projectId
                               join assignedto in DtoList.AssignedTo on task.Id equals assignedto.TaskDetailsId
                               join zohoemp in DtoList.ZohoEmp on assignedto.userId equals zohoemp.ZohoEmp_Id

                               select new AssignedToDto
                               {
                                   userId = assignedto.userId,
                                   EmployeeName = zohoemp.UserName,
                                   EmployeeId = zohoemp.Employee_Id,
                                   Department = zohoemp.Department,
                                   EmployeeId_Name = zohoemp.Employee_Id + " - " + zohoemp.UserName
                               }
                ).ToList();

                return EmpList;
            }
            catch (Exception ex)
            {
                // Log or handle the exception
                throw new Exception(ex.Message);
            }
        }




        /* public async Task<MetricsDetailsDto> AddMetricsAsync(AddMetricsDetailsDto addMetricsDetailsDtoList)
         {
             try
             {
                 var addedMetricsDetailsList = new List<MetricsDetailsDto>();

                 var metricsDetails = new Models.MetricsDetails
                 {
                     CustomerId = addMetricsDetailsDtoList.CustomerId,
                     CustomerName = addMetricsDetailsDtoList.CustomerName,
                     ProjectId = addMetricsDetailsDtoList.ProjectId,
                     ProjectName = addMetricsDetailsDtoList.ProjectName,
                     ProjectType = addMetricsDetailsDtoList.ProjectType,
                     MonthYear = addMetricsDetailsDtoList.MonthYear,
                     WeekStartDate = addMetricsDetailsDtoList.WeekStartDate,
                     WeekEndDate = addMetricsDetailsDtoList.WeekEndDate,
                     Active = true,
                     Status = 1
                 };

                 _unitOfWork.MetricsDetailsRepository.Insert(metricsDetails);
                 _unitOfWork.Save();

                 var ticketDetailsListDto = new List<TicketDetailsDto>();

                 if (addMetricsDetailsDtoList.TicketDetails != null && addMetricsDetailsDtoList.TicketDetails.Any())
                 {
                     foreach (var ticketDetailsDto in addMetricsDetailsDtoList.TicketDetails)
                     {
                         var ticketDetails = new TicketDetails
                         {
                             TicketNo = ticketDetailsDto.TicketNo,
                             TicketDesc = ticketDetailsDto.TicketDesc,
                             CreateDate = TimeZoneInfo.ConvertTimeFromUtc((DateTime)ticketDetailsDto.CreateDate, TimeZoneInfo.FindSystemTimeZoneById("India Standard Time")),
                             CreatedBy = ticketDetailsDto.CreatedBy,
                             AssignedDate = TimeZoneInfo.ConvertTimeFromUtc((DateTime)ticketDetailsDto.AssignedDate, TimeZoneInfo.FindSystemTimeZoneById("India Standard Time")),
                             AssignedBy = ticketDetailsDto.AssignedBy,
                             PriorityId = ticketDetailsDto.PriorityId,
                             Priority = ticketDetailsDto.Priority,
                             ComplexityId = ticketDetailsDto.ComplexityId,
                             Complexity = ticketDetailsDto.Complexity,
                             ExpectedClosureDate = TimeZoneInfo.ConvertTimeFromUtc((DateTime)ticketDetailsDto.ExpectedClosureDate, TimeZoneInfo.FindSystemTimeZoneById("India Standard Time")),
                             ExpectedClosureEffort = ticketDetailsDto.ExpectedClosureEffort,
                             ActualResolvedDate = TimeZoneInfo.ConvertTimeFromUtc((DateTime)ticketDetailsDto.ActualResolvedDate, TimeZoneInfo.FindSystemTimeZoneById("India Standard Time")),
                             ActualResolutionEffort = ticketDetailsDto.ActualResolutionEffort,
                             Reopened = ticketDetailsDto.Reopened,
                             ReopenedDate = TimeZoneInfo.ConvertTimeFromUtc((DateTime)ticketDetailsDto.ReopenedDate, TimeZoneInfo.FindSystemTimeZoneById("India Standard Time")),
                             TicketStatus = ticketDetailsDto.TicketStatus,
                             SlaMet = ticketDetailsDto.SlaMet,
                             MetricsId = metricsDetails.Id,
                             MetricsDetailsId = metricsDetails.Id
                         };

                         _unitOfWork.TicketDetailsRepository.Insert(ticketDetails);
                         _unitOfWork.Save();

                         ticketDetailsListDto.Add(new TicketDetailsDto
                         {
                             TicketDetailsId = ticketDetails.TicketDetailsId,
                             TicketNo = ticketDetails.TicketNo,
                         });

                         if (ticketDetailsDto.TicketAssignedTo != null && ticketDetailsDto.TicketAssignedTo.Any())
                         {
                             foreach (var ticketAssignedToDto in ticketDetailsDto.TicketAssignedTo)
                             {
                                 var ticketAssignedTo = new TicketAssignedTo
                                 {
                                     UserName = ticketAssignedToDto.UserName,
                                     TicketDetailsId = ticketDetails.TicketDetailsId,
                                     UserId = ticketAssignedToDto.UserId
                                 };

                                 _unitOfWork.TicketAssignedToRepository.Insert(ticketAssignedTo);
                                 _unitOfWork.Save();
                             }
                         }

                         if (ticketDetailsDto.WorkedBy != null && ticketDetailsDto.WorkedBy.Any())
                         {
                             foreach (var workedByDto in ticketDetailsDto.WorkedBy)
                             {
                                 var workedBy = new WorkedBy
                                 {
                                     UserName = workedByDto.UserName,
                                     TicketDetailsId = ticketDetails.TicketDetailsId,
                                     UserId = workedByDto.UserId
                                 };

                                 _unitOfWork.WorkedByRepository.Insert(workedBy);
                                 _unitOfWork.Save();
                             }
                         }

                         if (ticketDetailsDto.ClosedBy != null && ticketDetailsDto.ClosedBy.Any())
                         {
                             foreach (var closedByDto in ticketDetailsDto.ClosedBy)
                             {
                                 var closedBy = new ClosedBy
                                 {
                                     UserName = closedByDto.UserName,
                                     TicketDetailsId = ticketDetails.TicketDetailsId,
                                     UserId = closedByDto.UserId
                                 };

                                 _unitOfWork.ClosedByRepository.Insert(closedBy);
                                 _unitOfWork.Save();
                             }
                         }
                     }
                 }

                 addedMetricsDetailsList.Add(new MetricsDetailsDto
                 {
                     Id = metricsDetails.Id,
                     CustomerId = metricsDetails.CustomerId,
                     CustomerName = metricsDetails.CustomerName,
                     ProjectId = metricsDetails.ProjectId,
                     ProjectName = metricsDetails.ProjectName,
                     ProjectType = metricsDetails.ProjectType,
                     MonthYear = metricsDetails.MonthYear,
                     WeekStartDate = metricsDetails.WeekStartDate,
                     WeekEndDate = metricsDetails.WeekEndDate,
                     TicketDetails = ticketDetailsListDto,
                     Active = true,
                     Status = 1,
                 });

                 return addedMetricsDetailsList.FirstOrDefault();
             }
             catch (Exception ex)
             {
                 Console.WriteLine($"Error adding Metrics: {ex.Message}");
                 throw;
             }
         }

         public async Task<List<MetricsDetailsDto>> GetAllMetricsDetails()
         {
             try
             {
                 // Fetching the metrics details
                 var metricsDtoList = _unitOfWork.MetricsDetailsRepository.GetAll()
                     .OrderByDescending(s => s.Id)
                     .Select(s => new MetricsDetailsDto
                     {
                         Id = s.Id,
                         CustomerId = s.CustomerId,
                         CustomerName = s.CustomerName,
                         ProjectId = s.ProjectId,
                         ProjectName = s.ProjectName,
                         ProjectType = s.ProjectType,
                         MonthYear = s.MonthYear,
                         WeekStartDate = s.WeekStartDate,
                         WeekEndDate = s.WeekEndDate,
                         CreatedOn = s.CreatedOn,
                         FlagType = "Support"
                     });

                 // Fetching the development metrics details
                 var devMetricsDtoList = _unitOfWork.DevelopmentMetricsRepository.GetAll()
                     .OrderByDescending(s => s.DevelopmentMetricsId)
                     .Select(s => new MetricsDetailsDto
                     {
                         Id = s.DevelopmentMetricsId,
                         CustomerId = s.CustomerId,
                         CustomerName = s.CustomerName,
                         ProjectId = s.ProjectId,
                         ProjectName = s.ProjectName,
                         ProjectType = s.ProjectType,
                         MonthYear = s.MonthYear,
                         WeekStartDate = s.WeekStartDate,
                         WeekEndDate = s.WeekEndDate,
                         CreatedOn = s.CreatedOn,
                         FlagType = "Development"
                     });

                 // Combining the two lists
                 var combinedMetricsDtoList = metricsDtoList.Concat(devMetricsDtoList).OrderByDescending(s => s.CreatedOn).ToList();

                 return combinedMetricsDtoList;
             }
             catch (Exception ex)
             {
                 throw new Exception(ex.Message);
             }
         }

         public async Task<MetricsDetailsDto> GetMetricsDetailsById(int id)
         {
             try
             {
                 var metricsDetails = await _unitOfWork.MetricsDetailsRepository.GetNoTrackWithInclude(
                     g => g.Id == id,
                     include: new string[]
                     {
                   nameof(MetricsDetails.TicketDetails),
                 $"{nameof(MetricsDetails.TicketDetails)}.{nameof(TicketDetails.TicketAssignedTo)}",
                 $"{nameof(MetricsDetails.TicketDetails)}.{nameof(TicketDetails.WorkedBy)}",
                 $"{nameof(MetricsDetails.TicketDetails)}.{nameof(TicketDetails.ClosedBy)}"
             }
                 ).FirstOrDefaultAsync();

                 if (metricsDetails == null)
                 {
                     return null;
                 }

                 var metricsDetailsDto = new MetricsDetailsDto
                 {
                     Id = metricsDetails.Id,
                     CustomerId = metricsDetails.CustomerId,
                     CustomerName = metricsDetails.CustomerName,
                     ProjectId = metricsDetails.ProjectId,
                     ProjectName = metricsDetails.ProjectName,
                     ProjectType = metricsDetails.ProjectType,
                     MonthYear = metricsDetails.MonthYear,
                     WeekStartDate = metricsDetails.WeekStartDate,
                     WeekEndDate = metricsDetails.WeekEndDate,
                     TicketDetails = metricsDetails.TicketDetails.Select(t => new TicketDetailsDto
                     {
                         TicketDetailsId = t.TicketDetailsId,
                         MetricsId = t.MetricsId,
                         MetricsDetailsId = t.MetricsDetailsId,
                         TicketNo = t.TicketNo,
                         TicketDesc = t.TicketDesc,
                         CreateDate = t.CreateDate,
                         CreatedBy = t.CreatedBy,
                         AssignedDate = t.AssignedDate,
                         AssignedBy = t.AssignedBy,
                         PriorityId = t.PriorityId,
                         Priority = t.Priority,
                         ComplexityId = t.ComplexityId,
                         Complexity = t.Complexity,
                         ExpectedClosureDate = t.ExpectedClosureDate,
                         ExpectedClosureEffort = t.ExpectedClosureEffort,
                         ActualResolvedDate = t.ActualResolvedDate,
                         ActualResolutionEffort = t.ActualResolutionEffort,
                         Reopened = t.Reopened,
                         ReopenedDate = t.ReopenedDate,
                         TicketStatus = t.TicketStatus,
                         SlaMet = t.SlaMet,
                         TicketAssignedTo = t.TicketAssignedTo.Select(tt => new TicketAssignedToDto
                         {
                             TicketAssignedToId = tt.TicketAssignedToId,
                             TicketDetailsId = tt.TicketDetailsId,
                             UserId = tt.UserId,
                             UserName = tt.UserName
                         }).ToList(),
                         WorkedBy = t.WorkedBy.Select(w => new WorkedByDto
                         {
                             WorkedById = w.WorkedById,
                             TicketDetailsId = w.TicketDetailsId,
                             UserId = w.UserId,
                             UserName = w.UserName
                         }).ToList(),
                         ClosedBy = t.ClosedBy.Select(c => new ClosedByDto
                         {
                             ClosedById = c.ClosedById,
                             TicketDetailsId = c.TicketDetailsId,
                             UserId = c.UserId,
                             UserName = c.UserName
                         }).ToList()
                     }).ToList()
                 };

                 return metricsDetailsDto;
             }
             catch (Exception ex)
             {
                 throw new Exception($"Error retrieving metrics details: {ex.Message}");
             }
         }

         public async Task<MetricsDetailsDto> EditMetricsDetails(EditMetricsDetailsDto editMetricsDetailsDto)
         {
             try
             {
                 var metrics = await _unitOfWork.MetricsDetailsRepository.GetNoTrackWithInclude(x => x.Id == editMetricsDetailsDto.Id).FirstOrDefaultAsync();

                 if (metrics != null)
                 {
                     metrics.CustomerId = editMetricsDetailsDto.CustomerId;
                     metrics.CustomerName = editMetricsDetailsDto.CustomerName;
                     metrics.ProjectId = editMetricsDetailsDto.ProjectId;
                     metrics.ProjectName = editMetricsDetailsDto.ProjectName;
                     metrics.ProjectType = editMetricsDetailsDto.ProjectType;
                     metrics.MonthYear = editMetricsDetailsDto.MonthYear;
                     metrics.WeekStartDate = editMetricsDetailsDto.WeekStartDate;
                     metrics.WeekEndDate = editMetricsDetailsDto.WeekEndDate;

                     var existingTicketDetails = _unitOfWork.TicketDetailsRepository.GetAll().Where(at => at.MetricsDetailsId == metrics.Id).ToList();

                     foreach (var ticketDetails in existingTicketDetails)
                     {
                         var existingTicketAssignedToList = _unitOfWork.TicketAssignedToRepository.GetAll().Where(ta => ta.TicketDetailsId == ticketDetails.TicketDetailsId).ToList();

                         foreach (var ticketAssigned in existingTicketAssignedToList)
                         {
                             _unitOfWork.TicketAssignedToRepository.Delete(ticketAssigned);
                         }

                         var existingClosedByList = _unitOfWork.ClosedByRepository.GetAll().Where(ta => ta.TicketDetailsId == ticketDetails.TicketDetailsId).ToList();

                         foreach (var closedBy in existingClosedByList)
                         {
                             _unitOfWork.ClosedByRepository.Delete(closedBy);
                         }

                         var existingWorkedByList = _unitOfWork.WorkedByRepository.GetAll().Where(ta => ta.TicketDetailsId == ticketDetails.TicketDetailsId).ToList();

                         foreach (var workedBy in existingWorkedByList)
                         {
                             _unitOfWork.WorkedByRepository.Delete(workedBy);
                         }

                         _unitOfWork.TicketDetailsRepository.Delete(ticketDetails);
                     }

                     var newTicketDetailsList = editMetricsDetailsDto.TicketDetails;

                     foreach (var ticketDetailsDto in newTicketDetailsList)
                     {
                         var newTicketDetails = new TicketDetails
                         {
                             TicketNo = ticketDetailsDto.TicketNo,
                             TicketDesc = ticketDetailsDto.TicketDesc,
                             CreateDate = TimeZoneInfo.ConvertTimeFromUtc((DateTime)ticketDetailsDto.CreateDate, TimeZoneInfo.FindSystemTimeZoneById("India Standard Time")),
                             CreatedBy = ticketDetailsDto.CreatedBy,
                             AssignedDate = TimeZoneInfo.ConvertTimeFromUtc((DateTime)ticketDetailsDto.AssignedDate, TimeZoneInfo.FindSystemTimeZoneById("India Standard Time")),

                             AssignedBy = ticketDetailsDto.AssignedBy,
                             PriorityId = ticketDetailsDto.PriorityId,
                             Priority = ticketDetailsDto.Priority,
                             ComplexityId = ticketDetailsDto.ComplexityId,
                             Complexity = ticketDetailsDto.Complexity,
                             ExpectedClosureDate = TimeZoneInfo.ConvertTimeFromUtc((DateTime)ticketDetailsDto.ExpectedClosureDate, TimeZoneInfo.FindSystemTimeZoneById("India Standard Time")),
                             ExpectedClosureEffort = ticketDetailsDto.ExpectedClosureEffort,
                             ActualResolvedDate = TimeZoneInfo.ConvertTimeFromUtc((DateTime)ticketDetailsDto.ActualResolvedDate, TimeZoneInfo.FindSystemTimeZoneById("India Standard Time")),
                             ActualResolutionEffort = ticketDetailsDto.ActualResolutionEffort,
                             Reopened = ticketDetailsDto.Reopened,
                             ReopenedDate = ticketDetailsDto.ReopenedDate == null? null : TimeZoneInfo.ConvertTimeFromUtc((DateTime)ticketDetailsDto.ReopenedDate, TimeZoneInfo.FindSystemTimeZoneById("India Standard Time")),
                             TicketStatus = ticketDetailsDto.TicketStatus,
                             SlaMet = ticketDetailsDto.SlaMet,
                             MetricsDetailsId = metrics.Id,
                             MetricsId = metrics.Id,

                         };
                         _unitOfWork.TicketDetailsRepository.Insert(newTicketDetails);
                         _unitOfWork.Save();

                         if (ticketDetailsDto.TicketAssignedTo != null)
                         {

                             foreach (var ticketAssignedToDto in ticketDetailsDto.TicketAssignedTo)
                             {
                                 var newTicketAssignedTo = new TicketAssignedTo
                                 {
                                     TicketDetailsId = newTicketDetails.TicketDetailsId,
                                     UserName = ticketAssignedToDto.UserName,
                                     UserId = ticketAssignedToDto.UserId
                                 };
                                 _unitOfWork.TicketAssignedToRepository.Insert(newTicketAssignedTo);
                             }

                         }
                         if (ticketDetailsDto.WorkedBy != null)
                         {

                             foreach (var workedByDto in ticketDetailsDto.WorkedBy)
                             {
                                 var newWorkedBy = new WorkedBy
                                 {
                                     TicketDetailsId = newTicketDetails.TicketDetailsId,
                                     UserName = workedByDto.UserName,
                                     UserId = workedByDto.UserId
                                 };
                                 _unitOfWork.WorkedByRepository.Insert(newWorkedBy);
                             }

                         }
                         if (ticketDetailsDto.ClosedBy != null)
                         {

                             foreach (var closedByDto in ticketDetailsDto.ClosedBy)
                             {
                                 var newClosedBy = new ClosedBy
                                 {
                                     TicketDetailsId = newTicketDetails.TicketDetailsId,
                                     UserName = closedByDto.UserName,
                                     UserId = closedByDto.UserId
                                 };
                                 _unitOfWork.ClosedByRepository.Insert(newClosedBy);
                             }

                         }

                         _unitOfWork.Save();
                     }

                     _unitOfWork.MetricsDetailsRepository.Update(metrics);
                     _unitOfWork.Save();

                     var updatedMetricsDto = new MetricsDetailsDto
                     {
                         Id = metrics.Id,
                         CustomerId = metrics.CustomerId,
                         CustomerName = metrics.CustomerName,
                         ProjectId = metrics.ProjectId,
                         ProjectName = metrics.ProjectName,
                         ProjectType = metrics.ProjectType,
                         MonthYear = metrics.MonthYear,
                         WeekStartDate = metrics.WeekStartDate,
                         WeekEndDate = metrics.WeekEndDate,
                         TicketDetails = editMetricsDetailsDto.TicketDetails,
                     };

                     return updatedMetricsDto;
                 }
                 else
                 {
                     return null;
                 }
             }
             catch (Exception ex)
             {
                 throw new Exception($"Error editing metrics: {ex.Message}");
             }
         }

         public async Task<bool> CheckMetricsExistence(int customerId, int projectId, DateTime weekStartDate, DateTime weekEndDate)
         {
             Expression<Func<MetricsDetails, bool>> predicate = m =>
                 m.CustomerId == customerId &&
                 m.ProjectId == projectId &&
                 m.WeekStartDate == weekStartDate &&
                 m.WeekEndDate == weekEndDate;

             return await _unitOfWork.MetricsDetailsRepository.GetNoTrackWithInclude(predicate)
                 .AnyAsync();
         }

         public async Task<List<GroupedUserDataDto>> ChartForTicketColsed(int customerId, int ProjectId, string projectType)
         {
             try
             {
                 var conetxtdata = _unitOfWork.MetricsDetailsRepository.Context;
                 var data = (from metrics in conetxtdata.Metrics
                             join ticket in conetxtdata.TicketDetails on metrics.Id equals ticket.MetricsId into ticketmetricsgroup
                             from ticket in ticketmetricsgroup.DefaultIfEmpty()
                             join closedby in conetxtdata.ClosedBy on ticket.TicketDetailsId equals closedby.TicketDetailsId into ticketsclosedgroup
                             from closedby in ticketsclosedgroup.DefaultIfEmpty()
                             where metrics.CustomerId == customerId && metrics.ProjectId == ProjectId && ticket.TicketStatus == "Closed" && metrics.ProjectType == projectType
                             select new ChartTicketClosedDto
                             {
                                 labels = closedby.UserName,
                                 ticketstatus = ticket.TicketStatus
                             }).ToList();
                 var groupedData = data
              .GroupBy(d => d.labels)
              .Select(g => new GroupedUserDataDto
              {
                  Username = g.Key,
                  count = g.Count()
              })
              .ToList();
                 return groupedData;
             }
             catch (Exception ex)
             {
                 throw new Exception($"Error editing metrics: {ex.Message}");
             }
         }

         public async Task<List<GroupedUserDataComplexDto>> ChartForTicketColsedComplexity(int customerId, int ProjectId, string projectType)
         {
             try
             {
                 var conetxtdata = _unitOfWork.MetricsDetailsRepository.Context;
                 var data = (from metrics in conetxtdata.Metrics
                             join ticket in conetxtdata.TicketDetails on metrics.Id equals ticket.MetricsId into ticketmetricsgroup
                             from ticket in ticketmetricsgroup.DefaultIfEmpty()
                             join closedby in conetxtdata.ClosedBy on ticket.TicketDetailsId equals closedby.TicketDetailsId into ticketsclosedgroup
                             from closedby in ticketsclosedgroup.DefaultIfEmpty()
                             where metrics.CustomerId == customerId && metrics.ProjectId == ProjectId && ticket.TicketStatus == "Closed" && metrics.ProjectType == projectType
                             select new ChartTicketClosedComplexityDto
                             {
                                 labels = closedby.UserName,
                                 ticketstatus = ticket.TicketStatus,
                                 complexity = ticket.Complexity,
                             }).ToList();
                 var groupedData = data
                     .GroupBy(d => new { d.labels, d.complexity })
                     .Select(g => new GroupedUserDataComplexDto
                     {
                         Username = g.Key.labels,
                         complexity = g.Key.complexity,
                         count = g.Count()
                     })
                     .ToList();
                 return groupedData;
             }
             catch (Exception ex)
             {
                 throw new Exception($"Error editing metrics: {ex.Message}");
             }
         }*/




    }
}
