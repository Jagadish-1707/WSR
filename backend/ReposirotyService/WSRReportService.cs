using System;
using System.Linq;
using System.Text.Json;
using backend.Common;
using backend.DtoModels;
using backend.Models;
using backend.RepositoryInterface;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.ReposirotyService
{
    public class WSRReportService : IWSRReportService
    {
        private readonly UnitOfWork _unitOfWork;

        public WSRReportService(UnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }


        public async Task<(bool Success, string Message, string ReportId)> AddWSRReportAsync(WSRReportDto wsrReportDto, WSRProjectDetailsDto detailDto, WSRProjectStatusDto statusDto, List<WSRTaskDto> taskDto, List<WSRIssuesDto> issuesDto, List<WSRKeyRisksDto> risksDto)
        {
            using var transaction = await _unitOfWork.Context.Database.BeginTransactionAsync();

            try
            {
                // Check for duplicate report with same ProjectId and ReportStartDate/EndDate
                var reportStartDate = wsrReportDto?.ReportStartDate?.Date;
                var reportEndDate = wsrReportDto?.ReportEndDate?.Date;
                var projectId = detailDto?.ProjectId;
                var existingWSR = await _unitOfWork.WSRReportRepository
                    .GetManyQueryable(r =>
                        r.ProjectId == projectId &&
                        r.ReportStartDate == reportStartDate &&
                        r.ReportEndDate == reportEndDate)
                    .FirstOrDefaultAsync();

                if (existingWSR != null)
                {
                    return (false, "This project already has a WSR report for this week.", null);
                }

                var wsrReportId = $"WSR{DateTime.UtcNow:yyyyMMddHHmmssfff}";

                var zohoProject = await _unitOfWork.ZohoProjectRepository
                    .GetManyQueryable(p => p.ProjectId == detailDto.ProjectId)
                    .FirstOrDefaultAsync();

                var projectName = zohoProject?.ProjectName ?? $"Project-{detailDto.ProjectId}";

                var report = new WSRReport
                {
                    Id = wsrReportId,
                    ProjectId = detailDto.ProjectId,
                    WSRName = projectName,
                    ReportStartDate = wsrReportDto.ReportStartDate?.Date,
                    ReportEndDate = wsrReportDto.ReportEndDate?.Date,
                    CreatedOn = DateTime.UtcNow,
                    CreatedBy = "system"
                };

                _unitOfWork.WSRReportRepository.Insert(report);
               

                var detail = new WSRProjectDetails
                {
                    ProjectId = detailDto.ProjectId,
                    WSRId = wsrReportId,
                    ManagerName = detailDto.ManagerName,
                    TeamSize = detailDto.TeamSize,
                    Technology = detailDto.Technology,
                    CustomerLocation = detailDto.CustomerLocation,
                    BusinessDomain = detailDto.BusinessDomain,
                    ProjectType = detailDto.ProjectType,
                    CreatedOn = DateTime.UtcNow,
                    CreatedBy = "system",
                    Resources = detailDto.Resources != null ? JsonSerializer.Serialize(detailDto.Resources) : null
                };

                _unitOfWork.WSRProjectDetailsRepository.Insert(detail);
              

                var status = new WSRProjectStatus
                {
                    ProjectId = detailDto.ProjectId,
                    WSRId = wsrReportId,
                    OverallStatus = statusDto.OverallStatus,
                    Schedule = statusDto.Schedule,
                    Financial = statusDto.Financial,
                    Resource = statusDto.Resource,
                    Quality = statusDto.Quality,
                    Scope = statusDto.Scope,
                    PlannedResource = statusDto.PlannedResource,
                    ActualResource = statusDto.ActualResource,
                    MeasureTaken = statusDto.MeasureTaken,
                    Remarks = statusDto.Remarks,
                    CreatedOn = DateTime.UtcNow,
                    CreatedBy = "system"
                };

                _unitOfWork.WSRProjectStatusRepository.Insert(status);
                

                if(issuesDto != null)
                {
                    foreach (var tasks in taskDto)
                    {
                        var task = new WSRTask
                        {
                            ProjectId = detailDto.ProjectId,
                            WSRId = wsrReportId,
                            Task = tasks.Task,
                            TaskStatus = tasks.TaskStatus,
                            Remarks = tasks.Remarks,
                            Active = tasks.Active,
                            CreatedOn = DateTime.UtcNow,
                            CreatedBy = "system",
                            UpdatedOn = DateTime.UtcNow,
                            UpdatedBy = "system"
                        };
                        _unitOfWork.WSRTaskRepository.Insert(task);
                    }
                }

                if (issuesDto != null)
                {                    
                    foreach (var issues in issuesDto)
                    {
                        var issue = new WSRIssues
                        {
                            WSRId = wsrReportId,
                            ProjectId = detailDto.ProjectId,
                            Type = issues.Type,
                            FunctionalArea = issues.FunctionalArea,
                            Description = issues.Description,
                            ActionRequired = issues.ActionRequired,
                            DateReported = issues.DateReported?.Date,
                            ResolveByDate = issues.ResolveByDate?.Date,
                            IssueOwner = issues.IssueOwner,
                            CreatedOn = DateTime.UtcNow,
                            CreatedBy = "system",
                            UpdatedOn = DateTime.UtcNow,
                            UpdatedBy = "system"
                        };
                        _unitOfWork.WSRIssuesRepository.Insert(issue);
                    }
                }

                if (risksDto != null)
                {
                    foreach (var risks in risksDto)
                    {
                        var risk = new WSRKeyRisks
                        {
                            ProjectId = detailDto.ProjectId,
                            WSRId = wsrReportId,
                            RiskDescription = risks.RiskDescription,
                            Mitigation = risks.Mitigation,
                            Likelihood = risks.Likelihood,
                            RiskOwner = risks.RiskOwner,
                            DateRaised = risks.DateRaised?.Date,
                            ResolveByDate = risks.ResolveByDate?.Date,
                            CreatedOn = DateTime.UtcNow,
                            CreatedBy = "system",
                            UpdatedOn = DateTime.UtcNow,
                            UpdatedBy = "system"
                        };
                        _unitOfWork.WSRKeyRisksRepository.Insert(risk);
                    }
                }



                await _unitOfWork.SaveAsync();

                await transaction.CommitAsync();
                return (true, "WSR Report saved successfully", wsrReportId);
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return (false, $"Failed to save WSR Report: {ex.Message}", null);
            }
        }

        //get wsr report by projectID,month & year
        public async Task<(bool Success, string Message, List<WSRRequestModel> Data)> GetFilteredWSRReportsAsync(string? projectId, int month, int year)
        {
            var query = _unitOfWork.WSRReportRepository.GetManyQueryable(r =>
                r.ReportStartDate.HasValue &&
                r.ReportStartDate.Value.Month == month &&
                r.ReportStartDate.Value.Year == year
            );

            if (!string.IsNullOrEmpty(projectId))
            {
                query = query.Where(r => r.ProjectId == projectId);
            }

            var reports = await query.ToListAsync();
            var result = new List<WSRRequestModel>();

            foreach (var report in reports)
            {
                // Fetch customer name from ZohoProject table using ProjectId
                var projectCustomer = await _unitOfWork.ProjectDetailsRepository
                    .GetManyQueryable(p => p.ProjectId == report.ProjectId)
                    .FirstOrDefaultAsync();

                var customerName = projectCustomer?.CustomerName;

                result.Add(new WSRRequestModel
                {
                    WSRReportDto = new WSRReportDto
                    {
                        Id = report.Id,
                        WSRName = report.WSRName,
                        ProjectId = report.ProjectId,
                        CustomerName = customerName,
                        ReportStartDate = report.ReportStartDate,
                        ReportEndDate = report.ReportEndDate,
                        CreatedOn = report.CreatedOn,
                        CreatedBy = report.CreatedBy,
                        UpdatedOn = report.UpdatedOn,
                        UpdatedBy = report.UpdatedBy
                    }
                    
                });
            }

            if (!result.Any())
            {
                return (false, "No WSR report available for the selected project and month/year.", null);
            }

            return (true, "WSR report(s) retrieved successfully.", result);
        }

        //Get report by wsrId
        public async Task<(bool Success, string Message, WSRRequestModel Data)> GetReportByIdAsync(string wsrId)
        {
            try
            {
                // Get the main WSR report
                var wsrReport = await _unitOfWork.WSRReportRepository
                    .GetManyQueryable(r => r.Id == wsrId)
                    .FirstOrDefaultAsync();

                if (wsrReport == null)
                {
                    return (false, "WSR Report not found.", null);
                }

                // Get wsrproject details
                var wsrprojectDetails = await _unitOfWork.WSRProjectDetailsRepository
                    .GetManyQueryable(d => d.WSRId == wsrId)
                    .FirstOrDefaultAsync();

                // Get project information from ProjectDetails table using ProjectId
                var projectInfo = wsrprojectDetails != null ? await _unitOfWork.ProjectDetailsRepository
                    .GetManyQueryable(p => p.ProjectId == wsrprojectDetails.ProjectId)
                    .FirstOrDefaultAsync() : null;

                // Get wsrproject status
                var projectStatus = await _unitOfWork.WSRProjectStatusRepository
                    .GetManyQueryable(s => s.WSRId == wsrId)
                    .FirstOrDefaultAsync();
                var projectNameForStatus = projectStatus != null
                    ? await _unitOfWork.ZohoProjectRepository
                    .GetManyQueryable(p => p.ProjectId == projectStatus.ProjectId)
                    .FirstOrDefaultAsync()
                    : null;

                //Get wsrtasks
                var wsrtasks = await _unitOfWork.WSRTaskRepository
                    .GetManyQueryable(t => t.WSRId == wsrId)
                    .ToListAsync();
                //Get Issues
                var issues = await _unitOfWork.WSRIssuesRepository
                    .GetManyQueryable(i => i.WSRId == wsrId)
                    .ToListAsync();
                //Get Risks
                var risks = await _unitOfWork.WSRKeyRisksRepository
                    .GetManyQueryable(r => r.WSRId == wsrId)
                    .ToListAsync();

                // Create the response model
                var result = new WSRRequestModel
                {
                    WSRReportDto = new WSRReportDto
                    {
                        Id = wsrReport.Id,
                        ProjectId = wsrReport.ProjectId,
                        WSRName = wsrReport.WSRName,
                        ReportStartDate = wsrReport.ReportStartDate,
                        ReportEndDate = wsrReport.ReportEndDate,
                        CreatedOn = wsrReport.CreatedOn,
                        CreatedBy = wsrReport.CreatedBy,
                        UpdatedOn = wsrReport.UpdatedOn,
                        UpdatedBy = wsrReport.UpdatedBy
                    },
                    WSRProjectDetailsDto = wsrprojectDetails != null ? new WSRProjectDetailsDto
                    {
                        Id = wsrprojectDetails.Id,
                        ProjectId = wsrprojectDetails.ProjectId,
                        ManagerName = wsrprojectDetails.ManagerName,
                        TeamSize = wsrprojectDetails.TeamSize,
                        Technology = wsrprojectDetails.Technology,
                        CustomerLocation = wsrprojectDetails.CustomerLocation,
                        BusinessDomain = wsrprojectDetails.BusinessDomain,
                        ProjectType = wsrprojectDetails.ProjectType,
                        Resources = !string.IsNullOrEmpty(wsrprojectDetails.Resources)
                            ? JsonSerializer.Deserialize<List<ResourceDto>>(wsrprojectDetails.Resources)
                            : null,
                        CreatedOn = wsrprojectDetails.CreatedOn,
                        CreatedBy = wsrprojectDetails.CreatedBy,
                        UpdatedOn = wsrprojectDetails.UpdatedOn,
                        UpdatedBy = wsrprojectDetails.UpdatedBy,
                        ProjectStartDate = projectInfo?.StartDate,
                        ProjectEndDate = projectInfo?.EndDate,
                        ProjectDescription = projectInfo?.Remarks
                    } : null,
                    WSRProjectStatusDto = projectStatus != null ? new WSRProjectStatusDto
                    {
                        Id = projectStatus.Id,
                        ProjectId = projectStatus.ProjectId,
                        ProjectName= projectNameForStatus.ProjectName,
                        WSRId = projectStatus.WSRId,
                        OverallStatus = projectStatus.OverallStatus,
                        Schedule = projectStatus.Schedule,
                        Financial = projectStatus.Financial,
                        Resource = projectStatus.Resource,
                        Quality = projectStatus.Quality,
                        Scope = projectStatus.Scope,
                        PlannedResource = projectStatus.PlannedResource,
                        ActualResource = projectStatus.ActualResource,
                        MeasureTaken = projectStatus.MeasureTaken,
                        Remarks = projectStatus.Remarks,
                        CreatedOn = projectStatus.CreatedOn,
                        CreatedBy = projectStatus.CreatedBy,
                        UpdatedOn = projectStatus.UpdatedOn,
                        UpdatedBy = projectStatus.UpdatedBy
                    } : null,
                    //task
                    WSRTaskDto = wsrtasks.Select(t => new WSRTaskDto
                    {
                        Id = t.Id,
                        ProjectId = t.ProjectId,
                        WSRId = t.WSRId,
                        Task = t.Task,
                        TaskStatus = t.TaskStatus,
                        Remarks = t.Remarks,
                        Active = t.Active,
                        CreatedOn = t.CreatedOn,
                        CreatedBy = t.CreatedBy,
                        UpdatedOn = t.UpdatedOn,
                        UpdatedBy = t.UpdatedBy
                    }).ToList(),

                    // issues
                    WSRIssueDto = issues.Select(i => new WSRIssuesDto
                    {
                        Id = i.Id,
                        ProjectId = i.ProjectId,
                        WSRId = i.WSRId,
                        Type = i.Type,
                        FunctionalArea = i.FunctionalArea,
                        Description = i.Description,
                        ActionRequired = i.ActionRequired,
                        DateReported = i.DateReported,
                        ResolveByDate = i.ResolveByDate,
                        IssueOwner = i.IssueOwner,
                        CreatedOn = i.CreatedOn,
                        CreatedBy = i.CreatedBy,
                        UpdatedOn = i.UpdatedOn,
                        UpdatedBy = i.UpdatedBy
                    }).ToList(),

                    // risks
                    WSRKeyRisksDto = risks.Select(r => new WSRKeyRisksDto
                    {
                        Id = r.Id,
                        ProjectId = r.ProjectId,
                        WSRId = r.WSRId,
                        RiskDescription = r.RiskDescription,
                        Mitigation = r.Mitigation,
                        Likelihood = r.Likelihood,
                        RiskOwner = r.RiskOwner,
                        DateRaised = r.DateRaised,
                        ResolveByDate = r.ResolveByDate,
                        CreatedOn = r.CreatedOn,
                        CreatedBy = r.CreatedBy,
                        UpdatedOn = r.UpdatedOn,
                        UpdatedBy = r.UpdatedBy
                    }).ToList()

                };

                return (true, "WSR Report retrieved successfully.", result);
            }
            catch (Exception ex)
            {
                return (false, $"Failed to retrieve WSR Report: {ex.Message}", null);
            }
        }

        //Get multiple wsrreport by wsrid
        public async Task<(bool Success, string Message, List<WSRRequestModel> Data)> GetMultipleReportsByIdsAsync(List<string> wsrReportsIds)
        {
            try
            {
                if (wsrReportsIds == null || !wsrReportsIds.Any())
                {
                    return (false, "No WSR IDs provided.", null);
                }

                var resultList = new List<WSRRequestModel>();

                foreach (var wsrId in wsrReportsIds)
                {
                    // Fetch the main report
                    var wsrReport = await _unitOfWork.WSRReportRepository
                        .GetManyQueryable(r => r.Id == wsrId)
                        .FirstOrDefaultAsync();

                    if (wsrReport == null) continue;

                    // Fetch details
                    var wsrprojectDetails = await _unitOfWork.WSRProjectDetailsRepository
                        .GetManyQueryable(d => d.WSRId == wsrId)
                        .FirstOrDefaultAsync();

                    var projectInfo = wsrprojectDetails != null
                        ? await _unitOfWork.ProjectDetailsRepository
                            .GetManyQueryable(p => p.ProjectId == wsrprojectDetails.ProjectId)
                            .FirstOrDefaultAsync()
                        : null;

                    var projectStatus = await _unitOfWork.WSRProjectStatusRepository
                        .GetManyQueryable(s => s.WSRId == wsrId)
                        .FirstOrDefaultAsync();

                    var projectNameForStatus = projectStatus != null
                        ? await _unitOfWork.ZohoProjectRepository
                            .GetManyQueryable(p => p.ProjectId == projectStatus.ProjectId)
                            .FirstOrDefaultAsync()
                        : null;

                    //Get wsrtasks
                    var wsrtasks = await _unitOfWork.WSRTaskRepository
                        .GetManyQueryable(t => t.WSRId == wsrId)
                        .ToListAsync();
                    //Get Issues
                    var issues = await _unitOfWork.WSRIssuesRepository
                        .GetManyQueryable(i => i.WSRId == wsrId)
                        .ToListAsync();
                    //Get Risks
                    var risks = await _unitOfWork.WSRKeyRisksRepository
                        .GetManyQueryable(r => r.WSRId == wsrId)
                        .ToListAsync();

                    // Construct WSRRequestModel
                    var reportModel = new WSRRequestModel
                    {
                        WSRReportDto = new WSRReportDto
                        {
                            Id = wsrReport.Id,
                            ProjectId = wsrReport.ProjectId,
                            WSRName = wsrReport.WSRName,
                            ReportStartDate = wsrReport.ReportStartDate,
                            ReportEndDate = wsrReport.ReportEndDate,
                            CreatedOn = wsrReport.CreatedOn,
                            CreatedBy = wsrReport.CreatedBy,
                            UpdatedOn = wsrReport.UpdatedOn,
                            UpdatedBy = wsrReport.UpdatedBy
                        },
                        WSRProjectDetailsDto = wsrprojectDetails != null ? new WSRProjectDetailsDto
                        {
                            Id = wsrprojectDetails.Id,
                            ProjectId = wsrprojectDetails.ProjectId,
                            ManagerName = wsrprojectDetails.ManagerName,
                            TeamSize = wsrprojectDetails.TeamSize,
                            Technology = wsrprojectDetails.Technology,
                            CustomerLocation = wsrprojectDetails.CustomerLocation,
                            BusinessDomain = wsrprojectDetails.BusinessDomain,
                            ProjectType = wsrprojectDetails.ProjectType,
                            Resources = !string.IsNullOrEmpty(wsrprojectDetails.Resources)
                                ? JsonSerializer.Deserialize<List<ResourceDto>>(wsrprojectDetails.Resources)
                                : null,
                            CreatedOn = wsrprojectDetails.CreatedOn,
                            CreatedBy = wsrprojectDetails.CreatedBy,
                            UpdatedOn = wsrprojectDetails.UpdatedOn,
                            UpdatedBy = wsrprojectDetails.UpdatedBy,
                            ProjectStartDate = projectInfo?.StartDate,
                            ProjectEndDate = projectInfo?.EndDate,
                            ProjectDescription = projectInfo?.Remarks
                        } : null,
                        WSRProjectStatusDto = projectStatus != null ? new WSRProjectStatusDto
                        {
                            Id = projectStatus.Id,
                            ProjectId = projectStatus.ProjectId,
                            ProjectName = projectNameForStatus?.ProjectName,
                            WSRId = projectStatus.WSRId,
                            OverallStatus = projectStatus.OverallStatus,
                            Schedule = projectStatus.Schedule,
                            Financial = projectStatus.Financial,
                            Resource = projectStatus.Resource,
                            Quality = projectStatus.Quality,
                            Scope = projectStatus.Scope,
                            PlannedResource = projectStatus.PlannedResource,
                            ActualResource = projectStatus.ActualResource,
                            MeasureTaken = projectStatus.MeasureTaken,
                            Remarks = projectStatus.Remarks,
                            CreatedOn = projectStatus.CreatedOn,
                            CreatedBy = projectStatus.CreatedBy,
                            UpdatedOn = projectStatus.UpdatedOn,
                            UpdatedBy = projectStatus.UpdatedBy
                        } : null,
                        //task
                        WSRTaskDto = wsrtasks.Select(t => new WSRTaskDto
                        {
                            Id = t.Id,
                            ProjectId = t.ProjectId,
                            WSRId = t.WSRId,
                            Task = t.Task,
                            TaskStatus = t.TaskStatus,
                            Remarks = t.Remarks,
                            Active = t.Active,
                            CreatedOn = t.CreatedOn,
                            CreatedBy = t.CreatedBy,
                            UpdatedOn = t.UpdatedOn,
                            UpdatedBy = t.UpdatedBy
                        }).ToList(),

                        // issues
                        WSRIssueDto = issues.Select(i => new WSRIssuesDto
                        {
                            Id = i.Id,
                            ProjectId = i.ProjectId,
                            WSRId = i.WSRId,
                            Type = i.Type,
                            FunctionalArea = i.FunctionalArea,
                            Description = i.Description,
                            ActionRequired = i.ActionRequired,
                            DateReported = i.DateReported,
                            ResolveByDate = i.ResolveByDate,
                            IssueOwner = i.IssueOwner,
                            CreatedOn = i.CreatedOn,
                            CreatedBy = i.CreatedBy,
                            UpdatedOn = i.UpdatedOn,
                            UpdatedBy = i.UpdatedBy
                        }).ToList(),

                        // risks
                        WSRKeyRisksDto = risks.Select(r => new WSRKeyRisksDto
                        {
                            Id = r.Id,
                            ProjectId = r.ProjectId,
                            WSRId = r.WSRId,
                            RiskDescription = r.RiskDescription,
                            Mitigation = r.Mitigation,
                            Likelihood = r.Likelihood,
                            RiskOwner = r.RiskOwner,
                            DateRaised = r.DateRaised,
                            ResolveByDate = r.ResolveByDate,
                            CreatedOn = r.CreatedOn,
                            CreatedBy = r.CreatedBy,
                            UpdatedOn = r.UpdatedOn,
                            UpdatedBy = r.UpdatedBy
                        }).ToList()

                    };

                    resultList.Add(reportModel);
                }

                if (!resultList.Any())
                {
                    return (false, "No valid WSR reports found for given IDs.", null);
                }

                return (true, "WSR reports retrieved successfully.", resultList);
            }
            catch (Exception ex)
            {
                return (false, $"Failed to retrieve WSR reports: {ex.Message}", null);
            }
        }


        public async Task<(bool Success, string Message)> UpdateWSRReportAsync(string wsrId, WSRReportDto reportDto,WSRProjectDetailsDto detailDto,WSRProjectStatusDto statusDto, List<WSRTaskDto> taskDto, List<WSRIssuesDto> issuesDto, List<WSRKeyRisksDto> risksDto)
        {
            using var transaction = await _unitOfWork.Context.Database.BeginTransactionAsync();

            try
            {
                var report = await _unitOfWork.WSRReportRepository.GetByIdAsync(wsrId);
                if (report == null) return (false, "WSR report not found.");

                
                var detail = await _unitOfWork.WSRProjectDetailsRepository
                    .GetManyQueryable(d => d.WSRId == wsrId)
                    .FirstOrDefaultAsync();

                var status = await _unitOfWork.WSRProjectStatusRepository
                    .GetManyQueryable(s => s.WSRId == wsrId)
                    .FirstOrDefaultAsync();

                var tasks = await _unitOfWork.WSRTaskRepository
                    .GetManyQueryable(t => t.WSRId == wsrId) 
                    .ToListAsync();

                var issues = await _unitOfWork.WSRIssuesRepository
                    .GetManyQueryable(i => i.WSRId == wsrId)
                    .ToListAsync();

                var risks = await _unitOfWork.WSRKeyRisksRepository
                    .GetManyQueryable(r => r.WSRId == wsrId)
                    .ToListAsync();

                //Console.WriteLine($"[DEBUG] report.ProjectId: '{report.ProjectId}'");
                //Console.WriteLine($"[DEBUG] reportDto.ProjectId: '{reportDto.ProjectId}'");

                // If project changed, update projectId and WSRName in all tables
                if (report.ProjectId != reportDto.ProjectId)
                {
                    report.ProjectId = reportDto.ProjectId;

                    var projectMeta = await _unitOfWork.ZohoProjectRepository
                        .GetManyQueryable(p => p.ProjectId == reportDto.ProjectId)
                        .FirstOrDefaultAsync();

                    report.WSRName = projectMeta?.ProjectName ?? $"Project-{reportDto.ProjectId}";

                    if (detail != null)
                    {
                        detail.ProjectId = reportDto.ProjectId;
                        _unitOfWork.WSRProjectDetailsRepository.Update(detail);
                        await _unitOfWork.SaveAsync();
                    }

                    if (status != null)
                    {
                        status.ProjectId = reportDto.ProjectId;
                        _unitOfWork.WSRProjectStatusRepository.Update(status);
                        await _unitOfWork.SaveAsync();
                    }

                    foreach (var task in tasks)
                    {
                        task.ProjectId = reportDto.ProjectId;
                        _unitOfWork.WSRTaskRepository.Update(task);
                    }

                    foreach (var issue in issues)
                    {
                        issue.ProjectId = reportDto.ProjectId;
                        _unitOfWork.WSRIssuesRepository.Update(issue);
                    }

                    foreach (var risk in risks)
                    {
                        risk.ProjectId = reportDto.ProjectId;
                        _unitOfWork.WSRKeyRisksRepository.Update(risk);
                    }
                }

                // Update WSRReport fields
                report.ReportStartDate = reportDto.ReportStartDate?.Date;
                report.ReportEndDate = reportDto.ReportEndDate?.Date;
                report.UpdatedOn = DateTime.UtcNow;
                report.UpdatedBy = "system";

                _unitOfWork.WSRReportRepository.Update(report);

                // Update WSRProjectDetails
                if (detail != null)
                {
                    detail.ManagerName = detailDto.ManagerName;
                    detail.TeamSize = detailDto.TeamSize;
                    detail.Technology = detailDto.Technology;
                    detail.CustomerLocation = detailDto.CustomerLocation;
                    detail.BusinessDomain = detailDto.BusinessDomain;
                    detail.ProjectType = detailDto.ProjectType;

                    if (detailDto.Resources != null)
                    {
                        var updatedResources = detailDto.Resources;
                        detail.Resources = JsonSerializer.Serialize(updatedResources);
                    }

                    detail.UpdatedOn = DateTime.UtcNow;
                    detail.UpdatedBy = "system";

                    _unitOfWork.WSRProjectDetailsRepository.Update(detail);
                }

                // Update WSRProjectStatus
                if (status != null)
                {
                    status.OverallStatus = statusDto.OverallStatus;
                    status.Schedule = statusDto.Schedule;
                    status.Financial = statusDto.Financial;
                    status.Resource = statusDto.Resource;
                    status.Quality = statusDto.Quality;
                    status.Scope = statusDto.Scope;
                    status.PlannedResource = statusDto.PlannedResource;
                    status.ActualResource = statusDto.ActualResource;
                    status.MeasureTaken = statusDto.MeasureTaken;
                    status.Remarks = statusDto.Remarks;
                    status.UpdatedOn = DateTime.UtcNow;
                    status.UpdatedBy = "system";

                    _unitOfWork.WSRProjectStatusRepository.Update(status);
                }

                foreach(var task in tasks)
                {

                    task.WSRId = task.WSRId;
                    task.Task = task.Task;
                    task.TaskStatus = task.TaskStatus;
                    task.Remarks = task.Remarks;
                    task.Active = task.Active;
                    task.UpdatedOn = DateTime.UtcNow;
                    task.UpdatedBy = "system";

                    _unitOfWork.WSRTaskRepository.Update(task);
                }

                foreach (var issue in issues)
                {

                    issue.WSRId = issue.WSRId;
                    issue.Type = issue.Type;
                    issue.FunctionalArea = issue.FunctionalArea;
                    issue.Description = issue.Description;
                    issue.ActionRequired = issue.ActionRequired;
                    issue.DateReported = issue.DateReported?.Date;
                    issue.ResolveByDate = issue.ResolveByDate?.Date;
                    issue.IssueOwner = issue.IssueOwner;
                    issue.UpdatedOn = DateTime.UtcNow;
                    issue.UpdatedBy = "system";

                    _unitOfWork.WSRIssuesRepository.Update(issue);
                }

                foreach (var risk in risks)
                {

                    risk.WSRId = risk.WSRId;
                    risk.RiskDescription = risk.RiskDescription;
                    risk.Mitigation = risk.Mitigation;
                    risk.Likelihood = risk.Likelihood;
                    risk.RiskOwner = risk.RiskOwner;
                    risk.DateRaised = risk.DateRaised?.Date;
                    risk.ResolveByDate = risk.ResolveByDate?.Date;
                    risk.UpdatedOn = DateTime.UtcNow;
                    risk.UpdatedBy = "system";

                    _unitOfWork.WSRKeyRisksRepository.Update(risk);
                }


                await _unitOfWork.SaveAsync();
                await transaction.CommitAsync();
                return (true, "WSR report updated successfully.");
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return (false, $"Failed to update WSR Report: {ex.Message}");
            }
        }

    }
}


