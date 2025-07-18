using backend.Common;
using backend.DtoModels;
using backend.Models;
using backend.RepositoryInterface;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Identity.Client;
using System;
using System.Linq;

namespace backend.ReposirotyService
{
    public class TaskDetailsService : ITasksService
    {
        private readonly IConfiguration _configuration;
        private readonly UnitOfWork _unitOfWork;

        public TaskDetailsService(IConfiguration configuration)
        {
            _configuration = configuration;
            _unitOfWork = new UnitOfWork(configuration);
        }
        public async Task<List<TaskDetailsDto>> GetAllTaskDetails()
        {
            try
            {
                var tasks = _unitOfWork.TaskDetailsRepository.GetAll().Where(t => t.Active);

                var metrics = _unitOfWork.TaskMetricsRepository.GetAll();
                var employees = _unitOfWork.AssignedToRepository.GetAll();

                var taskDetailsDtoList = tasks
                    .OrderByDescending(t => t.Id)
                    .Select(t => new TaskDetailsDto
                    {
                        Id = t.Id,
                        CustomerId = t.CustomerId,
                        CustomerName = t.CustomerName,
                        ProjectId = t.ProjectId,
                        ProjectName = t.ProjectName,
                        ProjectType = t.ProjectType,
                        AssignmentStartDate = t.AssignmentStartDate,
                        AssignmentEndDate = t.AssignmentEndDate,
                        AssignmentPercent = t.AssignmentPercent,
                        Remarks = t.Remarks,
                        BillingType = t.BillingType,
                        Options = t.Options,
                        MetricsCount = metrics.Count(m => m.TaskId == t.Id),
                        AssignedEmployeeCount = employees.Count(e => e.TaskDetailsId == t.Id)
                    }).ToList();

                return taskDetailsDtoList;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        public async Task<List<ProjectDetails>> GetProjectByCustomerId(int customerId)
        {
            try
            {
                var contextData = _unitOfWork.ProjectDetailsRepository.Context;
                var project = contextData.ProjectDetails.ToList();
                //var project = contextData.ProjectDetails.Where(x => x.CustomerId == customerId).ToList();

                return project;
            }
            catch (Exception ex)
            {
                return null;
            }
        }


        public async Task<TaskDetailsDto> GetTaskDetailsById(int id)
        {
            try
            {
                var TaskDetailsDto = await _unitOfWork.TaskDetailsRepository.GetNoTrackWithInclude(
             g => g.Id == id,
             include: new string[] { nameof(Models.TaskDetails.AssignedTo) }
         )
         .Select(s => new TaskDetailsDto
         {
             Id = s.Id,
             CustomerId = s.CustomerId,
             CustomerName = s.CustomerName,
             ProjectId = s.ProjectId,
             ProjectName = s.ProjectName,
             ProjectType = s.ProjectType,
             AssignmentStartDate = s.AssignmentStartDate,
             AssignmentEndDate = s.AssignmentEndDate,
             AssignmentPercent = s.AssignmentPercent,
             BillingType = s.BillingType,
             Remarks = s.Remarks,
             Options = s.Options,
             AssignedTo = s.AssignedTo.Select(at => new AssignedToDto
             {
                 AssignedToId = at.AssignedToId,
                 TaskDetailsId = at.TaskDetailsId,
                 userId = at.userId,
                 UserName = at.UserName
             }).ToList()
         }).FirstOrDefaultAsync();

                return TaskDetailsDto;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error retrieving task details: {ex.Message}");
            }
        }

        public async Task<TaskDetailsDto> AddTaskDetailsAsync(AddTaskDetailsDto addTaskDetailsDto)
        {
            try
            {
                var assignmentStartDate = addTaskDetailsDto.AssignmentStartDate;
                var assignmentEndDate = addTaskDetailsDto.AssignmentEndDate;

                var taskDetails = new Models.TaskDetails
                {
                    CustomerId = addTaskDetailsDto.CustomerId,
                    CustomerName = addTaskDetailsDto.CustomerName,
                    ProjectId = addTaskDetailsDto.ProjectId,
                    ProjectName = addTaskDetailsDto.ProjectName,
                    ProjectType = addTaskDetailsDto.ProjectType,
                    AssignmentStartDate = TimeZoneInfo.ConvertTimeFromUtc((DateTime)assignmentStartDate, TimeZoneInfo.FindSystemTimeZoneById("India Standard Time")),
                    AssignmentEndDate = TimeZoneInfo.ConvertTimeFromUtc((DateTime)assignmentEndDate, TimeZoneInfo.FindSystemTimeZoneById("India Standard Time")),
                    AssignmentPercent = addTaskDetailsDto.AssignmentPercent,
                    BillingType = addTaskDetailsDto.BillingType,
                    Remarks = addTaskDetailsDto.Remarks,
                    Active = true,
                    Status = 1,
                    Options = addTaskDetailsDto.Options
                };

                _unitOfWork.TaskDetailsRepository.Insert(taskDetails);
                _unitOfWork.Save();

                var assignedToList = new List<AssignedToDto>();

                if (addTaskDetailsDto.AssignedTo != null && addTaskDetailsDto.AssignedTo.Count > 0)
                {
                    foreach (var assignedToDto in addTaskDetailsDto.AssignedTo)
                    {
                        var assignedTo = new AssignedTo
                        {
                            UserName = assignedToDto.UserName,
                            TaskDetailsId = taskDetails.Id,
                            userId = assignedToDto.userId
                        };

                        _unitOfWork.AssignedToRepository.Insert(assignedTo);
                        _unitOfWork.Save();

                        assignedToList.Add(new AssignedToDto
                        {
                            AssignedToId = assignedTo.AssignedToId,
                            UserName = assignedTo.UserName,
                            userId = assignedTo.userId,
                            TaskDetailsId = assignedTo.TaskDetailsId
                        });
                    }
                }

                var addedTaskDetailsDto = new TaskDetailsDto
                {
                    Id = taskDetails.Id,
                    CustomerId = taskDetails.CustomerId,
                    CustomerName = taskDetails.CustomerName,
                    ProjectId = taskDetails.ProjectId,
                    ProjectName = taskDetails.ProjectName,
                    ProjectType = taskDetails.ProjectType,
                    AssignmentStartDate = taskDetails.AssignmentStartDate,
                    AssignmentEndDate = taskDetails.AssignmentEndDate,
                    AssignmentPercent = taskDetails.AssignmentPercent,
                    BillingType = taskDetails.BillingType,
                    Remarks = taskDetails.Remarks,
                    Active = true,
                    Status = 1,
                    AssignedTo = addTaskDetailsDto.AssignedTo,
                    Options = addTaskDetailsDto.Options
                };

                return addedTaskDetailsDto;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error adding Task: {ex.Message}");
                throw ex;
            }
        }

        public async Task<TaskDetailsDto> EditTaskDetails(EditTaskDetailsDto editTaskDetailsDto)
        {
            try
            {
                var taskDetails = await _unitOfWork.TaskDetailsRepository.GetNoTrackWithInclude(x => x.Id == editTaskDetailsDto.Id).FirstOrDefaultAsync();

                var assignmentStartDate = editTaskDetailsDto.AssignmentStartDate;
                var assignmentEndDate = editTaskDetailsDto.AssignmentEndDate;

                if (taskDetails != null)
                {

                    taskDetails.CustomerId = editTaskDetailsDto.CustomerId;
                    taskDetails.CustomerName = editTaskDetailsDto.CustomerName;
                    taskDetails.ProjectId = editTaskDetailsDto.ProjectId;
                    taskDetails.ProjectName = editTaskDetailsDto.ProjectName;
                    taskDetails.ProjectType = editTaskDetailsDto.ProjectType;
                    taskDetails.AssignmentStartDate = TimeZoneInfo.ConvertTimeFromUtc((DateTime)assignmentStartDate, TimeZoneInfo.FindSystemTimeZoneById("India Standard Time"));
                    taskDetails.AssignmentEndDate = TimeZoneInfo.ConvertTimeFromUtc((DateTime)assignmentEndDate, TimeZoneInfo.FindSystemTimeZoneById("India Standard Time"));
                    taskDetails.AssignmentPercent = editTaskDetailsDto.AssignmentPercent;
                    taskDetails.Remarks = editTaskDetailsDto.Remarks;
                    taskDetails.BillingType = editTaskDetailsDto.BillingType;
                    taskDetails.Options = editTaskDetailsDto.Options;

                    var existingAssignedTo = _unitOfWork.AssignedToRepository.GetAll().Where(at => at.TaskDetailsId == taskDetails.Id).ToList();
                    foreach (var assignedTo in existingAssignedTo)
                    {
                        _unitOfWork.AssignedToRepository.Delete(assignedTo);
                    }
                    if (editTaskDetailsDto.AssignedTo != null)
                    {
                        foreach (var assignedToDto in editTaskDetailsDto.AssignedTo)
                        {
                            var newAssignedTo = new AssignedTo
                            {
                                UserName = assignedToDto.UserName,
                                TaskDetailsId = taskDetails.Id,
                                userId = assignedToDto.userId
                            };
                            _unitOfWork.AssignedToRepository.Insert(newAssignedTo);
                        }
                    }
                    _unitOfWork.TaskDetailsRepository.Update(taskDetails);
                    _unitOfWork.Save();

                    var updatedTaskDetailsDto = new TaskDetailsDto
                    {
                        Id = taskDetails.Id,
                        CustomerId = taskDetails.CustomerId,
                        CustomerName = taskDetails.CustomerName,
                        ProjectId = taskDetails.ProjectId,
                        ProjectName = taskDetails.ProjectName,
                        ProjectType = taskDetails.ProjectType,
                        AssignmentStartDate = taskDetails.AssignmentStartDate,
                        AssignmentEndDate = taskDetails.AssignmentEndDate,
                        AssignmentPercent = taskDetails.AssignmentPercent,
                        Remarks = taskDetails.Remarks,
                        BillingType = taskDetails.BillingType,
                        Status = taskDetails.Status,
                        Active = taskDetails.Active,
                        AssignedTo = editTaskDetailsDto.AssignedTo,
                        Options = editTaskDetailsDto.Options,
                    };

                    return updatedTaskDetailsDto;
                }
                else
                {
                    return null;
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Error editing task details: {ex.Message}");
            }
        }

        public async Task<bool> DeleteTaskIdAsync(int id, int userId)
        {
            try
            {
                var contextData = _unitOfWork.TaskDetailsRepository.Context;
                var role = _unitOfWork.TaskDetailsRepository.GetByID(id);
                if (role != null)
                {
                    using (var transaction = _unitOfWork.TaskDetailsRepository.Context.Database.BeginTransaction())
                    {
                        role.Active = false;
                        role.ModifiedOn = DateTime.Now;
                        role.ModifiedBy = userId != 0 ? userId.ToString() : null;

                        _unitOfWork.TaskDetailsRepository.Update(role);
                        contextData.SaveChanges();
                        transaction.Commit();
                    }
                }
                return true;
            }
            catch (Exception e)
            {
                return false;
            }
        }

        public async Task<List<AssignedToDto>> GetAssignedEmployee(int taskid)
        {
            try
            {
                var DtoList = _unitOfWork.TaskDetailsRepository.Context;

                var EmpList = (from task in DtoList.Tasks
                               where task.Id == taskid
                               join assignedto in DtoList.AssignedTo on task.Id equals assignedto.TaskDetailsId
                               join zohoemp in DtoList.ZohoEmp on assignedto.userId equals zohoemp.ZohoEmp_Id

                               select new AssignedToDto
                               {
                                   userId = assignedto.userId,
                                   EmployeeName = zohoemp.UserName,
                                   EmployeeId = zohoemp.Employee_Id,
                                   Department = zohoemp.Department,
                                   //EmployeeId_Name = zohoemp.Employee_Id + " - " + zohoemp.UserName
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

        public async Task<List<TaskMetricsDto>> GetAssignedMetrics(int taskid)
        {
            try
            {
                var DtoList = _unitOfWork.TaskDetailsRepository.Context;

                var EmpList = (from task in DtoList.Tasks
                               where task.Id == taskid
                               join taskmetrics in DtoList.TaskMetrics on task.Id equals taskmetrics.TaskId
                               join metrics in DtoList.MetricsMaster on taskmetrics.MetricsId equals metrics.Id

                               select new TaskMetricsDto
                               {
                                   MetricsId = taskmetrics.MetricsId,
                                   MetricsName = metrics.MetricsName,
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


    }

}
