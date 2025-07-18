using backend.Common;
using backend.DtoModels;
using backend.Migrations;
using backend.Models;
using backend.RepositoryInterface;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace backend.ReposirotyService
{
    public class DevelopmentMetricsService :IDevelopmentMetricsService
    {
        private readonly IConfiguration _configuration;
        private readonly UnitOfWork _unitOfWork;

        public DevelopmentMetricsService(IConfiguration configuration)
        {
            _configuration = configuration;
            _unitOfWork = new UnitOfWork(configuration);
        }
        public async Task<List<DevelopmentMetricsDto>> GetAllDevMetricsDetails()
        {
            try
            {
                var devMetricsDtoList = _unitOfWork.DevelopmentMetricsRepository.GetAll()
                    .OrderByDescending(s => s.DevelopmentMetricsId)
                    .Select(s => new DevelopmentMetricsDto
                    {
                        Id = s.DevelopmentMetricsId,
                        CustomerId = s.CustomerId,
                        CustomerName = s.CustomerName,
                        ProjectId = s.ProjectId,
                        ProjectName = s.ProjectName,
                        ProjectType = s.ProjectType,
                        MonthYear = s.MonthYear,
                        WeekStartDate = s.WeekStartDate,
                        WeekEndDate = s.WeekEndDate
                    }).ToList();

                return devMetricsDtoList;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        public async Task<DevelopmentMetricsDto> AddDevelopmentMetricsAsync(AddDevelopmentMetricsDto addDevelopmentMetricsDto)
        {
            try
            {

                var addedDevelopmentList = new List<DevelopmentMetricsDto>();

                var developmentMetrics = new Models.DevelopmentMetrics
                // Create the DevelopmentMetrics object from the DTO

                {
                    CustomerId = addDevelopmentMetricsDto.CustomerId,
                    CustomerName = addDevelopmentMetricsDto.CustomerName,
                    ProjectId = addDevelopmentMetricsDto.ProjectId,
                    ProjectName = addDevelopmentMetricsDto.ProjectName,
                    ProjectType = addDevelopmentMetricsDto.ProjectType,
                    MonthYear = addDevelopmentMetricsDto.MonthYear,
                    WeekStartDate = addDevelopmentMetricsDto.WeekStartDate,
                    WeekEndDate = addDevelopmentMetricsDto.WeekEndDate,
                    Active = true,
                    Status = 1
                };

                // Insert the DevelopmentMetrics into the database
                _unitOfWork.DevelopmentMetricsRepository.Insert(developmentMetrics);
                _unitOfWork.Save();

                // Create a list to hold the DTOs for the response
                var developmentTaskListDto = new List<DevelopmentTaskDto>();

                // Check if there are any DevelopmentTasks to add
                if (addDevelopmentMetricsDto.DevelopmentTasks != null && addDevelopmentMetricsDto.DevelopmentTasks.Any())
                {
                    foreach (var taskDto in addDevelopmentMetricsDto.DevelopmentTasks)
                    {
                        // Create the DevelopmentTask object from the DTO
                        var developmentTask = new DevelopmentTask
                        {
                            TaskName = taskDto.TaskName,
                            CRNumber = taskDto.CRNumber,
                            Priority = taskDto.Priority,
                            PlannedStartDate = taskDto.PlannedStartDate,
                            PlannedEndDate = taskDto.PlannedEndDate,
                            PlannedDuration = taskDto.PlannedDuration,
                            ActualStartDate = taskDto.ActualStartDate,
                            ActualEndDate = taskDto.ActualEndDate,
                            ActualDuration = taskDto.ActualDuration,
                            OnTimeDelivery = taskDto.OnTimeDelivery == "Yes" ? true : false,
                            PlannedEffort = taskDto.PlannedEffort,
                            ActualEffort = taskDto.ActualEffort,
                            NumberOfDefects = taskDto.NumberOfDefects,
                            ReworkEffort = taskDto.ReworkEffort,
                            Status = taskDto.Status,
                            Remarks = taskDto.Remarks,
                            ExpectedCompletionMonth = taskDto.ExpectedCompletionMonth,
                            TaskToBeCompletedThisMonth = taskDto.TaskToBeCompletedThisMonth == "Yes"? true: false,
                            DevelopmentMetricsId = developmentMetrics.DevelopmentMetricsId // Set the foreign key relationship
                        };

                        // Insert the DevelopmentTask into the database
                        _unitOfWork.DevelopmentTaskRepository.Insert(developmentTask);
                        _unitOfWork.Save();

                        // Add the inserted task to the response DTO list
                        developmentTaskListDto.Add(new DevelopmentTaskDto
                        {
                            TaskId = developmentTask.TaskId,
                            TaskName = developmentTask.TaskName,
                            // Include other necessary fields
                        });
                    }
                }

                // Prepare the response DTO
                addedDevelopmentList.Add(new DevelopmentMetricsDto
                {
                    Id = developmentMetrics.DevelopmentMetricsId,
                    CustomerId = developmentMetrics.CustomerId,
                    CustomerName = developmentMetrics.CustomerName,
                    ProjectId = developmentMetrics.ProjectId,
                    ProjectName = developmentMetrics.ProjectName,
                    ProjectType = developmentMetrics.ProjectType,
                    MonthYear = developmentMetrics.MonthYear,
                    WeekStartDate = developmentMetrics.WeekStartDate,
                    WeekEndDate = developmentMetrics.WeekEndDate,
                    DevelopmentTasks = developmentTaskListDto,
                    Active = true,
                    Status = 1,
                });

                return addedDevelopmentList.FirstOrDefault();

            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error adding Metrics: {ex.Message}");
                throw;
            }
        }
        public async Task<DevelopmentMetricsDto> EditDevMetricsDetails(EditDevelopmentMetricsDto editDevMetricsDetailsDto)
        {
            try
            {
                // Fetch the DevelopmentMetrics entity to update
                var devMetrics = await _unitOfWork.DevelopmentMetricsRepository
                    .GetNoTrackWithInclude(x => x.DevelopmentMetricsId == editDevMetricsDetailsDto.Id)
                    .FirstOrDefaultAsync();

                if (devMetrics != null)
                {
                    // Update the DevelopmentMetrics entity
                    devMetrics.CustomerId = editDevMetricsDetailsDto.CustomerId;
                    devMetrics.CustomerName = editDevMetricsDetailsDto.CustomerName;
                    devMetrics.ProjectId = editDevMetricsDetailsDto.ProjectId;
                    devMetrics.ProjectName = editDevMetricsDetailsDto.ProjectName;
                    devMetrics.ProjectType = editDevMetricsDetailsDto.ProjectType;
                    devMetrics.MonthYear = editDevMetricsDetailsDto.MonthYear;
                    devMetrics.WeekStartDate = editDevMetricsDetailsDto.WeekStartDate;
                    devMetrics.WeekEndDate = editDevMetricsDetailsDto.WeekEndDate;

                    // Delete existing DevelopmentTasks associated with the metrics
                    var existingTaskDetails = _unitOfWork.DevelopmentTaskRepository
                        .GetAll()
                        .Where(devMet => devMet.DevelopmentMetricsId == devMetrics.DevelopmentMetricsId)
                        .ToList();

                    foreach (var taskDetails in existingTaskDetails)
                    {
                        _unitOfWork.DevelopmentTaskRepository.Delete(taskDetails);
                    }

                    // Insert new DevelopmentTasks



                    devMetrics.DevelopmentTasks = editDevMetricsDetailsDto.DevelopmentTasks.Select(taskDetailsDto => new DevelopmentTask
                    {
                        TaskId = taskDetailsDto.TaskId,
                        DevelopmentMetricsId = taskDetailsDto.MetricsId,
                        TaskName = taskDetailsDto.TaskName,
                        CRNumber = taskDetailsDto.CRNumber,
                        Priority = taskDetailsDto.Priority,
                        PlannedStartDate = TimeZoneInfo.ConvertTimeFromUtc((DateTime)taskDetailsDto.PlannedStartDate, TimeZoneInfo.FindSystemTimeZoneById("India Standard Time")),
                        PlannedEndDate = TimeZoneInfo.ConvertTimeFromUtc((DateTime)taskDetailsDto.PlannedEndDate, TimeZoneInfo.FindSystemTimeZoneById("India Standard Time")),
                        PlannedDuration = taskDetailsDto.PlannedDuration,
                        ActualStartDate = TimeZoneInfo.ConvertTimeFromUtc((DateTime)taskDetailsDto.ActualStartDate, TimeZoneInfo.FindSystemTimeZoneById("India Standard Time")),
                        ActualEndDate = TimeZoneInfo.ConvertTimeFromUtc((DateTime)taskDetailsDto.ActualEndDate, TimeZoneInfo.FindSystemTimeZoneById("India Standard Time")),
                        ActualDuration = taskDetailsDto.ActualDuration,
                        OnTimeDelivery = taskDetailsDto.OnTimeDelivery == "yes" ? true : false,
                        PlannedEffort = taskDetailsDto.PlannedEffort,
                        ActualEffort = taskDetailsDto.ActualEffort,
                        NumberOfDefects = taskDetailsDto.NumberOfDefects,
                        ReworkEffort = taskDetailsDto.ReworkEffort,
                        Status = taskDetailsDto.Status,
                        Remarks = taskDetailsDto.Remarks,
                        ExpectedCompletionMonth = taskDetailsDto.ExpectedCompletionMonth,
                        TaskToBeCompletedThisMonth = taskDetailsDto.TaskToBeCompletedThisMonth == "Yes" ? true : false,
                    }).ToList();


                

                    // Save all changes at once
                    _unitOfWork.DevelopmentMetricsRepository.Update(devMetrics);
                     _unitOfWork.Save();

                    // Return the updated DTO
                    var updatedDevMetricsDto = new DevelopmentMetricsDto
                    {
                        Id = devMetrics.DevelopmentMetricsId,
                        CustomerId = devMetrics.CustomerId,
                        CustomerName = devMetrics.CustomerName,
                        ProjectId = devMetrics.ProjectId,
                        ProjectName = devMetrics.ProjectName,
                        ProjectType = devMetrics.ProjectType,
                        MonthYear = devMetrics.MonthYear,
                        WeekStartDate = devMetrics.WeekStartDate,
                        WeekEndDate = devMetrics.WeekEndDate,
                        //DevelopmentTasks = devMetrics.DevelopmentTasks,
                    };

                    return updatedDevMetricsDto;
                }
                else
                {
                    // Return null if the DevelopmentMetrics entity is not found
                    return null;
                }
            }
            catch (Exception ex)
            {
                // Throw the caught exception to preserve stack trace
                throw new Exception($"Error editing metrics: {ex.Message}", ex);
            }
        }
        //public async Task<DevelopmentMetricsDto> GetDevMetricsDetailsById(int id)
        //{
        //    try
        //    {
        //        var devMetricsDetails = await _unitOfWork.DevelopmentMetricsRepository.GetNoTrackWithInclude(
        //            g => g.Id == id,
        //            include: new string[]
        //            {
        //          nameof(DevelopmentMetrics.DevelopmentTasks)
        //    }
        //        ).FirstOrDefaultAsync();

        //        if (devMetricsDetails == null)
        //        {
        //            return null;
        //        }

        //        var devMetricsDetailsDto = new DevelopmentMetricsDto
        //        {
        //            Id = devMetricsDetails.Id,
        //            CustomerId = devMetricsDetails.CustomerId,
        //            CustomerName = devMetricsDetails.CustomerName,
        //            ProjectId = devMetricsDetails.ProjectId,
        //            ProjectName = devMetricsDetails.ProjectName,
        //            ProjectType = devMetricsDetails.ProjectType,
        //            MonthYear = devMetricsDetails.MonthYear,
        //            WeekStartDate = devMetricsDetails.WeekStartDate,
        //            WeekEndDate = devMetricsDetails.WeekEndDate,
        //            DevelopmentTasks = devMetricsDetails.DevelopmentTasks.Select(t => new DevelopmentTaskDto
        //            {
        //                TaskName = t.TaskName,
        //                CRNumber = t.CRNumber,
        //                Priority = t.Priority,
        //                PlannedStartDate = TimeZoneInfo.ConvertTimeFromUtc((DateTime)t.PlannedStartDate, TimeZoneInfo.FindSystemTimeZoneById("India Standard Time")),
        //                PlannedEndDate = TimeZoneInfo.ConvertTimeFromUtc((DateTime)t.PlannedEndDate, TimeZoneInfo.FindSystemTimeZoneById("India Standard Time")),
        //                PlannedDuration = t.PlannedDuration,
        //                ActualStartDate = TimeZoneInfo.ConvertTimeFromUtc((DateTime)t.ActualStartDate, TimeZoneInfo.FindSystemTimeZoneById("India Standard Time")),
        //                ActualEndDate = TimeZoneInfo.ConvertTimeFromUtc((DateTime)t.ActualEndDate, TimeZoneInfo.FindSystemTimeZoneById("India Standard Time")),
        //                ActualDuration = t.ActualDuration,
        //                OnTimeDelivery = t.OnTimeDelivery,
        //                PlannedEffort = t.PlannedEffort,
        //                ActualEffort = t.ActualEffort,
        //                NumberOfDefects = t.NumberOfDefects,
        //                ReworkEffort = t.ReworkEffort,
        //                Status = t.Status,
        //                Remarks = t.Remarks,
        //                ExpectedCompletionMonth = t.ExpectedCompletionMonth,
        //                TaskToBeCompletedThisMonth = t.TaskToBeCompletedThisMonth,
        //            }).ToList()
        //            };

        //        return devMetricsDetailsDto;
        //    }
        //    catch (Exception ex)
        //    {
        //        throw new Exception($"Error retrieving metrics details: {ex.Message}");
        //    }
        //}
        public async Task<DevelopmentMetricsDto> GetDevMetricsDetailsById(int id)
        {
            try
            {
                // Fetching the DevelopmentMetrics including the related DevelopmentTasks


                //var devMetricsDetails = await _unitOfWork.DevelopmentMetricsRepository.GetNoTrackWithIncludes(
                //                     g => g.DevelopmentMetricsId == id,
                //                     includes: new Expression<Func<DevelopmentMetrics, object>>[]
                //                     {
                //                        d => d.DevelopmentTasks // Using lambda for strongly typed include
                //                     }).FirstOrDefaultAsync();
                var devMetricsDetails = await _unitOfWork.DevelopmentMetricsRepository.GetNoTrackWithInclude(
                    g => g.DevelopmentMetricsId == id,
                    include: new string[]
                    {
                   nameof(Models.DevelopmentMetrics.DevelopmentTasks),
                $"{nameof(Models.DevelopmentMetrics.DevelopmentTasks)}",
            }).FirstOrDefaultAsync();

                //devMetricsDetails = await _unitOfWork.DevelopmentMetricsRepository.GetNoTrackWithIncludes(
                //                        g => g.Id == id,
                //                        d => d.DevelopmentTasks // Include the related DevelopmentTasks
                //                    ).FirstOrDefaultAsync();

                if (devMetricsDetails == null)
                {
                    return null;
                }

                // Mapping the fetched data to the DTO
                var devMetricsDetailsDto = new DevelopmentMetricsDto
                {
                    Id = devMetricsDetails.DevelopmentMetricsId,
                    CustomerId = devMetricsDetails.CustomerId,
                    CustomerName = devMetricsDetails.CustomerName,
                    ProjectId = devMetricsDetails.ProjectId,
                    ProjectName = devMetricsDetails.ProjectName,
                    ProjectType = devMetricsDetails.ProjectType,
                    MonthYear = devMetricsDetails.MonthYear,
                    WeekStartDate = devMetricsDetails.WeekStartDate,
                    WeekEndDate = devMetricsDetails.WeekEndDate,
                    DevelopmentTasks = devMetricsDetails.DevelopmentTasks.Select(t => new DevelopmentTaskDto
                    {
                        TaskId = t.TaskId, // Assuming TaskId is the Id field of DevelopmentTask
                        MetricsId = t.DevelopmentMetricsId, // The foreign key reference
                        TaskName = t.TaskName,
                        CRNumber = t.CRNumber,
                        Priority = t.Priority,
                        PlannedStartDate = TimeZoneInfo.ConvertTimeFromUtc((DateTime)t.PlannedStartDate, TimeZoneInfo.FindSystemTimeZoneById("India Standard Time")),
                        PlannedEndDate = TimeZoneInfo.ConvertTimeFromUtc((DateTime)t.PlannedEndDate, TimeZoneInfo.FindSystemTimeZoneById("India Standard Time")),
                        PlannedDuration = t.PlannedDuration,
                        ActualStartDate = TimeZoneInfo.ConvertTimeFromUtc((DateTime)t.ActualStartDate, TimeZoneInfo.FindSystemTimeZoneById("India Standard Time")),
                        ActualEndDate = TimeZoneInfo.ConvertTimeFromUtc((DateTime)t.ActualEndDate, TimeZoneInfo.FindSystemTimeZoneById("India Standard Time")),
                        ActualDuration = t.ActualDuration,
                        OnTimeDelivery = t.OnTimeDelivery == true? "Yes": "No",
                        PlannedEffort = t.PlannedEffort,
                        ActualEffort = t.ActualEffort,
                        NumberOfDefects = t.NumberOfDefects,
                        ReworkEffort = t.ReworkEffort,
                        Status = t.Status,
                        Remarks = t.Remarks,
                        ExpectedCompletionMonth = t.ExpectedCompletionMonth,
                        TaskToBeCompletedThisMonth = t.TaskToBeCompletedThisMonth == true? "Yes": "No",
                    }).ToList()
                };

                return devMetricsDetailsDto;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error retrieving metrics details: {ex.Message}");
            } 
        }
    }
}
