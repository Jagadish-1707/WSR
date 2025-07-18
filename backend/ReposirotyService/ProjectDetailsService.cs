using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using backend.Common;
using backend.DtoModels;
using backend.Models;
using backend.RepositoryInterface;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.RepositoryService
{
    public class ProjectDetailsService : IProjectDetailsService
    {
        private readonly IConfiguration _configuration;
        private readonly UnitOfWork _unitOfWork;

        public ProjectDetailsService(IConfiguration configuration)
        {
            _configuration = configuration;
            _unitOfWork = new UnitOfWork(configuration);
        }

        public async Task<ProjectDetailsDto> AddProjectDetailsAsync(AddProjectDetailsDto addProjectDetailsDto)
        {
            try
            {
                var startDate = addProjectDetailsDto.StartDate;
                var endDate = addProjectDetailsDto.EndDate;

                var projectDetails = new ProjectDetails
                {
                    CustomerId = addProjectDetailsDto.CustomerId ?? "",
                    CustomerName = addProjectDetailsDto.CustomerName,
                    ProjectId = addProjectDetailsDto.ProjectId ?? "",
                    ProjectName = addProjectDetailsDto.ProjectName,
                    EngagementMode = addProjectDetailsDto.EngagementMode,
                    CurrencyType = addProjectDetailsDto.CurrencyType,
                    ContractValue = addProjectDetailsDto.ContractValue,
                    EstimatedHours = addProjectDetailsDto.EstimatedHours,
                    StartDate = startDate,
                    EndDate = endDate,
                    Remarks = addProjectDetailsDto.Remarks,
                    Active = true,
                    Status = 1
                };

                _unitOfWork.ProjectDetailsRepository.Insert(projectDetails);
                _unitOfWork.Save();

                return new ProjectDetailsDto
                {
                    Id = projectDetails.Id,
                    CustomerId = projectDetails.CustomerId,
                    CustomerName = projectDetails.CustomerName,
                    ProjectId = projectDetails.ProjectId,
                    ProjectName = projectDetails.ProjectName,
                    EngagementMode = projectDetails.EngagementMode,
                    CurrencyType = projectDetails.CurrencyType,
                    ContractValue = projectDetails.ContractValue,
                    EstimatedHours = projectDetails.EstimatedHours,
                    StartDate = projectDetails.StartDate,
                    EndDate = projectDetails.EndDate,
                    Remarks = projectDetails.Remarks,
                    Active = true,
                    Status = 1
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error in AddProjectDetailsAsync: " + ex.Message);
                return null;
            }
        }


        public async Task<ProjectDetailsDto> EditProjectDetailsAsync(EditProjectDetailsDto editProjectDetails)
        {
            try
            {
                var projectDetails = await _unitOfWork.ProjectDetailsRepository
                    .GetNoTrackWithInclude(x => x.Id == editProjectDetails.Id)
                    .FirstOrDefaultAsync();

                if (projectDetails != null)
                {
                    projectDetails.CustomerId = editProjectDetails.CustomerId ?? "";
                    projectDetails.CustomerName = editProjectDetails.CustomerName;
                    projectDetails.ProjectId = editProjectDetails.ProjectId ?? "";
                    projectDetails.ProjectName = editProjectDetails.ProjectName;
                    projectDetails.EngagementMode = editProjectDetails.EngagementMode;
                    projectDetails.CurrencyType = editProjectDetails.CurrencyType;
                    projectDetails.ContractValue = editProjectDetails.ContractValue;
                    projectDetails.EstimatedHours = editProjectDetails.EstimatedHours;
                    projectDetails.StartDate = editProjectDetails.StartDate;
                    projectDetails.EndDate = editProjectDetails.EndDate;
                    projectDetails.Remarks = editProjectDetails.Remarks;
                    projectDetails.ModifiedOn = DateTime.Now;
                    projectDetails.Active = editProjectDetails.Active;

                    _unitOfWork.ProjectDetailsRepository.Update(projectDetails);
                    _unitOfWork.Save();

                    var taskDetailsList = await _unitOfWork.TaskDetailsRepository
                     .Where(x => x.Options == editProjectDetails.Id.ToString())
                     .ToListAsync();

                    // Check if taskDetailsList is null or empty
                    if (taskDetailsList != null && taskDetailsList.Any())
                    {
                        foreach (var taskDetails in taskDetailsList)
                        {
                            taskDetails.CustomerId = editProjectDetails.CustomerId;
                            taskDetails.CustomerName = editProjectDetails.CustomerName;
                            taskDetails.ProjectId = editProjectDetails.ProjectId;
                            taskDetails.ProjectName = editProjectDetails.ProjectName;

                            _unitOfWork.TaskDetailsRepository.Update(taskDetails);
                        }

                        // Save the changes
                        await _unitOfWork.SaveAsync();
                    }
                    else
                    {
                        Console.WriteLine("No TaskDetails found to update.");
                    }


                    _unitOfWork.Save();


                    return await GetProjectDetailsByIdAsync(editProjectDetails.Id);
                }

                return null;
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error in EditProjectDetailsAsync: " + ex.Message);
                return null;
            }
        }

        public async Task<ProjectDetailsDto> GetProjectDetailsByIdAsync(int id)
        {
            try
            {
                var projectDetailsDto = await _unitOfWork.ProjectDetailsRepository.GetNoTrackWithInclude(
            p => p.Id == id
        )
                .Select(s => new ProjectDetailsDto
                {
                    Id = s.Id,
                    CustomerId = s.CustomerId,
                    CustomerName = s.CustomerName,
                    ProjectId = s.ProjectId,
                    ProjectName = s.ProjectName,
                    EngagementMode = s.EngagementMode,
                    CurrencyType = s.CurrencyType,
                    ContractValue = s.ContractValue,
                    EstimatedHours = s.EstimatedHours,
                    StartDate = s.StartDate,
                    EndDate = s.EndDate,
                    Remarks = s.Remarks,                   
                }).FirstOrDefaultAsync();

                return projectDetailsDto;
            }
            catch (Exception ex)
            {
                // Log or handle the exception
                return null;
            }
        }
        public async Task<List<ProjectDetailsDto>> GetProjectDetailsListAsync()
        {
            try
            {
                var contextData = _unitOfWork.ProjectDetailsRepository.Context;
                var projectDetailsDtoList = (from projectDetails in contextData.ProjectDetails.Where(pd => pd.Active)
                                             join mode in contextData.ProjectEngagementMode on projectDetails.EngagementMode equals mode.Id into modeListGroup
                                             from projectEngagementMode in modeListGroup.DefaultIfEmpty()

                                             select new ProjectDetailsDto
                                             {
                                                 Id = projectDetails.Id,
                                                 CustomerId = projectDetails.CustomerId,
                                                 CustomerName = projectDetails.CustomerName,
                                                 ProjectId = projectDetails.ProjectId,
                                                 ProjectName = projectDetails.ProjectName,
                                                 EngagementMode = projectDetails.EngagementMode,
                                                 ContractValue = projectDetails.ContractValue,
                                                 EstimatedHours = projectDetails.EstimatedHours,
                                                 StartDate = projectDetails.StartDate,
                                                 EndDate = projectDetails.EndDate,
                                                 Remarks = projectDetails.Remarks,
                                                 ModeName = projectEngagementMode.ProjectEngagementMode
                                             }).OrderByDescending(s => s.Id).ToList();

                return projectDetailsDtoList;
            }
            catch (Exception ex)
            {
                // Log or handle the exception
                throw new Exception(ex.Message);
            }
        }
        public async Task<List<ProjectDetails>> GetProjectDetailsList()
        {
            try
            {
                var dbContext = _unitOfWork.ProjectDetailsRepository.Context;
                var projectDetailsDtoList = dbContext.ProjectDetails.Where(pd => pd.Active)
                    .OrderByDescending(s => s.Id).GroupBy(pd => pd.CustomerId)
                    .Select(s => s.First()).ToList();
                return projectDetailsDtoList;
            }
            catch (Exception ex)
            {
                // Log or handle the exception
                throw new Exception(ex.Message);
            }
        }        
        public async Task<bool> DeleteProjectDetailsByIdAsync(int id, int userId)
        {
            try
            {
                var contextData = _unitOfWork.ProjectDetailsRepository.Context;
                var projectDetails = _unitOfWork.ProjectDetailsRepository.GetByID(id);
                if (projectDetails != null)
                {
                    using (var transaction = _unitOfWork.ProjectDetailsRepository.Context.Database.BeginTransaction())
                    {
                        projectDetails.Status = 0;
                        projectDetails.Active = false;
                        projectDetails.ModifiedOn = DateTime.Now;
                        projectDetails.ModifiedBy = userId != 0 ? userId.ToString() : null;

                        _unitOfWork.ProjectDetailsRepository.Update(projectDetails);
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

        //Project Engagement Mode
        public async Task<ProjectEngagementModeDto> AddEngagmentModeAsync(AddEngagementModeDto addMode)
        {
            try
            {
                int modeId = 0;
                ProjectMode mode = new ProjectMode();

                using (var transaction = _unitOfWork.ProjectengagementmodeRepository.Context.Database.BeginTransaction())
                {
                    mode.ProjectEngagementMode = addMode.ProjectEngagementMode;
                    mode.Remarks = addMode.Remarks;
                    mode.Status = addMode.Status;
                    mode.CreatedOn = DateTime.Now;
                    mode.Active = true;

                    _unitOfWork.ProjectengagementmodeRepository.Insert(mode);
                    _unitOfWork.Save();
                    transaction.Commit();
                    modeId = mode.Id;
                    if (modeId != 0)
                    {
                        return await GetEngagmentModeByIdAsync(modeId);
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

        public async Task<ProjectEngagementModeDto> EditEngagementModeAsync(EditEngagementModeDto editMode)
        {
            try
                {
                var mode = _unitOfWork.ProjectengagementmodeRepository.GetNoTrackWithInclude(p => p.Id == editMode.Id).FirstOrDefault();
                if (mode != null)
                {
                    using (var transaction = _unitOfWork.ProjectengagementmodeRepository.Context.Database.BeginTransaction())
                    {
                        mode.Id = editMode.Id;
                        mode.Status = editMode.Status;
                        mode.ProjectEngagementMode = editMode.ProjectEngagementMode;
                        mode.Remarks = editMode.Remarks;
                        mode.ModifiedOn = DateTime.Now;
                        mode.Active = editMode.Active;
                        _unitOfWork.ProjectengagementmodeRepository.Update(mode);
                        _unitOfWork.Save();
                        transaction.Commit();
                    }
                    return await GetEngagmentModeByIdAsync(mode.Id);
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

        public async Task<ProjectEngagementModeDto> GetEngagmentModeByIdAsync(int id)
        {
            try
            {
                var contextData = _unitOfWork.ProjectengagementmodeRepository.Context;
                var ProjectEngagementModeDto = contextData.ProjectEngagementMode.Where(w => w.Id == id).Select(s => new ProjectEngagementModeDto
                {
                    Id = s.Id,
                    ProjectEngagementMode = s.ProjectEngagementMode,
                    Remarks = s.Remarks,
                    CreatedBy = s.CreatedBy,
                    CreatedOn = DateTime.Now,
                    Status = s.Status,
                    ModifiedBy = s.ModifiedBy,
                    ModifiedOn = s.ModifiedOn
                }).FirstOrDefault();
                if (ProjectEngagementModeDto == null)
                {
                    return null;
                }
                else
                {
                    return ProjectEngagementModeDto;
                }
            }
            catch (Exception e)
            {
                return null;
            }
        }

        public async Task<List<ProjectEngagementModeDto>> GetAllEngagementModeAsync()
        {
            try
            {
                var contextData = _unitOfWork.ProjectengagementmodeRepository.Context;
                var ProjectEngagementModeDto = await contextData.ProjectEngagementMode.Where(x=> x.Active).OrderByDescending(s => s.Id).Select(s => new ProjectEngagementModeDto
                {
                    Id = s.Id,
                    ProjectEngagementMode = s.ProjectEngagementMode,
                    Remarks = s.Remarks,
                    CreatedBy = s.CreatedBy,
                    CreatedOn = s.CreatedOn,
                    Status = s.Status,
                    ModifiedBy = s.ModifiedBy,
                    ModifiedOn = s.ModifiedOn
                }).ToListAsync();
                if (ProjectEngagementModeDto != null)
                {
                    return ProjectEngagementModeDto;
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
