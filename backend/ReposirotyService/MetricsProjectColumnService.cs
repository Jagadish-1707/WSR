using backend.Common;
using backend.DtoModels;
using backend.Models;
using backend.RepositoryInterface;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualBasic.FileIO;
using MimeKit;
using MySqlConnector;
using static Org.BouncyCastle.Crypto.Engines.SM2Engine;

namespace backend.ReposirotyService
{
    public class MetricsProjectColumnService : IMetricsProjectColumnService
    {
        private readonly IConfiguration _configuration;
        private readonly UnitOfWork _unitOfWork;

        public MetricsProjectColumnService(IConfiguration configuration)
        {
            _configuration = configuration;
            _unitOfWork = new UnitOfWork(configuration);
        }

        public async Task<MetricProjectColumnsDto> AddMetricProjectColumns(AddMetricProjectColumnsDto addMetricProjectColumnsDto)
        {
            try
            {
                int modeId = 0;
                MetricProjectColumns mode = new MetricProjectColumns();

                using (var transaction = _unitOfWork.MetricsprojectfieldRepository.Context.Database.BeginTransaction())
                {
                    mode.FieldName = addMetricProjectColumnsDto.FieldName;
                    mode.FieldType = addMetricProjectColumnsDto.FieldType;
                    mode.Status = addMetricProjectColumnsDto.Status;
                    mode.IsMandatory = "False";
                    mode.Editable = "Yes";
                    mode.Active = true;
                    mode.CreatedOn = DateTime.Now;
                    mode.DropdownValues = addMetricProjectColumnsDto.DropdownValues;
                    mode.OrderBy = addMetricProjectColumnsDto.OrderBy;

                    _unitOfWork.MetricsprojectfieldRepository.Insert(mode);
                    _unitOfWork.Save();
                    transaction.Commit();
                    modeId = mode.Id;
                    if (modeId != 0)
                    {
                        return await GetMetricProjectColumnsById(modeId);
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

        public async Task<MetricProjectColumnsDto> EditMetricProjectColumns(EditMetricProjectColumnsDto editMetricProjectColumnsDto)
        {
            try
            {
                var mode = _unitOfWork.MetricsprojectfieldRepository.GetNoTrackWithInclude(p => p.Id == editMetricProjectColumnsDto.Id).FirstOrDefault();
                if (mode != null)
                {
                    using (var transaction = _unitOfWork.MetricsprojectfieldRepository.Context.Database.BeginTransaction())
                    {
                        mode.Id = editMetricProjectColumnsDto.Id;
                        mode.Status = editMetricProjectColumnsDto.Status;
                        mode.FieldName = editMetricProjectColumnsDto.FieldName;
                        mode.FieldType = editMetricProjectColumnsDto.FieldType;
                        mode.ModifiedOn = DateTime.Now;
                        mode.IsMandatory = "False";
                        mode.Editable = "Yes";
                        mode.DropdownValues = editMetricProjectColumnsDto.DropdownValues;
                        mode.Active = editMetricProjectColumnsDto.Active;
                        mode.OrderBy = editMetricProjectColumnsDto.OrderBy;

                        _unitOfWork.MetricsprojectfieldRepository.Update(mode);
                        _unitOfWork.Save();
                        transaction.Commit();
                    }
                    return await GetMetricProjectColumnsById(mode.Id);
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

        public async Task<MetricProjectColumnsDto> GetMetricProjectColumnsById(int id)
        {
            try
            {
                var contextData = _unitOfWork.MetricsprojectfieldRepository.Context;
                var FieldNameDto = contextData.MetricsProjectField.Where(w => w.Id == id).Select(s => new MetricProjectColumnsDto
                {
                    Id = s.Id,
                    FieldName = s.FieldName,
                    FieldType = s.FieldType,
                    CreatedOn = DateTime.Now,
                    IsMandatory = "False",
                    Editable= s.Editable,
                    Status = s.Status,
                    ModifiedOn = s.ModifiedOn,
                    DropdownValues = s.DropdownValues,
                    OrderBy = s.OrderBy
                }).FirstOrDefault();
                if (FieldNameDto == null)
                {
                    return null;
                }
                else
                {
                    return FieldNameDto;
                }
            }
            catch (Exception e)
            {
                return null;
            }
        }

        public async Task<List<MetricProjectColumnsDto>> GetAllMetricProjectColumns()
        {
            try
            {
                var contextData = _unitOfWork.MetricsprojectfieldRepository.Context;
                var FieldNameDto = await contextData.MetricsProjectField.
                    Where(s => s.Active == true).OrderBy(s => s.Editable) 
                   .ThenByDescending(s => s.Id).Select(s => new MetricProjectColumnsDto
                {
                    Id = s.Id,
                    FieldName = s.FieldName,
                    FieldType = s.FieldType,
                    CreatedOn = s.CreatedOn,
                    IsMandatory = "False",
                    Editable = s.Editable,
                    Status = s.Status,
                    ModifiedOn = s.ModifiedOn,
                    OrderBy = s.OrderBy

                }).ToListAsync();
                if (FieldNameDto != null)
                {
                    return FieldNameDto;
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
        //metrics column selection

        public async Task<SelectionDto> SaveSelection(SelectionDto model)
        {
            try
            {
                var dbContext = _unitOfWork.MetricsprojectfieldRepository.Context;

                var selection = dbContext.ProjectTypeMetricSelection
                    .FirstOrDefault(x => x.ProjectId == model.ProjectId && x.ProjectTypeId == model.ProjectTypeId);

                if (selection == null)
                {
                    selection = new ProjectTypeMetricSelection
                    {
                        ProjectId = model.ProjectId,
                        ProjectTypeId = model.ProjectTypeId,
                        CreatedOn = DateTime.UtcNow
                    };

                    _unitOfWork.ProjectTypeMetricSelectionRepository.Insert(selection);
                    _unitOfWork.Save();
                }
                else
                {
                    // Update ModifiedOn
                    selection.ModifiedOn = DateTime.UtcNow;
                    _unitOfWork.ProjectTypeMetricSelectionRepository.Update(selection);

                    var Context = _unitOfWork.SelectionCheckBoxOptionRepository.Context;
                    // Delete old checkbox mappings
                    var existingOptions = Context.SelectionCheckBoxOption
                        .Where(x => x.ProjectTypeMetricSelectionId == selection.Id).ToList();

                    foreach (var item in existingOptions)
                    {
                        _unitOfWork.SelectionCheckBoxOptionRepository.Delete(item);
                    }

                    _unitOfWork.Save(); // Save deletions
                }
                foreach (var metricId in model.MetricsIDs)
                {
                    foreach (var field in model.SelectedCheckBoxIds)
                    {
                        var newOption = new SelectionCheckBoxOption
                        {
                            ProjectTypeMetricSelectionId = selection.Id,
                            MetricsId = metricId,
                            FieldColumnId = field.FieldColumnId,
                            IsMandatory = field.IsMandatory // true or false from UI
                        };
                        _unitOfWork.SelectionCheckBoxOptionRepository.Insert(newOption);
                    }
                }
                _unitOfWork.Save();

                return model;
            }
            catch (Exception e)
            {
                return null;
            }
        }
        public async Task<SelectionDto> GetSelection(int id)
        {
            var dbContext = _unitOfWork.MetricsprojectfieldRepository.Context;
            var selection = dbContext.ProjectTypeMetricSelection.FirstOrDefault(s => s.Id == id);

            if (selection == null) return null;

            var context = _unitOfWork.SelectionCheckBoxOptionRepository.Context;

            var selectedMetrics = await context.SelectionCheckBoxOption
                .Where(m => m.ProjectTypeMetricSelectionId == id)
                .Select(m => m.MetricsId)
                .Distinct()
                .ToListAsync();

            var selectedFields = context.SelectionCheckBoxOption
                .Where(opt => opt.ProjectTypeMetricSelectionId == id).GroupBy(opt => opt.FieldColumnId)
                 .Select(group => new SelectionFieldDto
                 {
                     FieldColumnId = group.Key,
                     IsMandatory = group.Any(opt => opt.IsMandatory)
                 })
                .ToList();

            return new SelectionDto
            {
                Id = selection.Id, // <--- Add this to the DTO if it's not there, crucial for update
                ProjectId = selection.ProjectId,
                ProjectTypeId = selection.ProjectTypeId,
                MetricsIDs = selectedMetrics,
                SelectedCheckBoxIds = selectedFields
            };
        }

        public async Task<List<SelectionDto>> GetAllMetricProjectColumnsSelected()
        {
            var contextData = _unitOfWork.MetricsprojectfieldRepository.Context;

            // Load main selection rows
            var mainRows = await (
                from projectcolumnDetails in contextData.ProjectTypeMetricSelection
                join task in contextData.Tasks on projectcolumnDetails.ProjectId equals task.Id into taskGroup
                from Task in taskGroup.DefaultIfEmpty()
                join project in contextData.ProjectDetails on Task.ProjectId equals project.ProjectId into projectDetailsGroup
                from ProjectDetails in projectDetailsGroup.DefaultIfEmpty()
                join projecttype in contextData.ProjectTypeMaster on projectcolumnDetails.ProjectTypeId equals projecttype.Id into projectTypeListGroup
                from ProjectTypeMaster in projectTypeListGroup.DefaultIfEmpty()
                select new
                {
                    projectcolumnDetails.Id,
                    projectcolumnDetails.ProjectId,
                    ProjectName = ProjectDetails.ProjectName,
                    projectcolumnDetails.ProjectTypeId,
                    ProjectTypeName = ProjectTypeMaster.ProjectTypeName
                })
                .OrderByDescending(x => x.Id)
                .ToListAsync();

            var selectionIds = mainRows.Select(x => x.Id).ToList();

            // Load child collections in batches
            var metricsIds = await contextData.SelectionCheckBoxOption
                .Where(c => selectionIds.Contains(c.ProjectTypeMetricSelectionId))
                .GroupBy(c => c.ProjectTypeMetricSelectionId)
                .Select(g => new
                {
                    SelectionId = g.Key,
                    MetricsIds = g.Select(x => x.MetricsId).Distinct().ToList()
                })
                .ToListAsync();

            var metricNames = await (
                from colSelection in contextData.SelectionCheckBoxOption
                join metrics in contextData.MetricsMaster on colSelection.MetricsId equals metrics.Id
                where selectionIds.Contains(colSelection.ProjectTypeMetricSelectionId)
                group metrics by colSelection.ProjectTypeMetricSelectionId into g
                select new
                {
                    SelectionId = g.Key,
                    MetricNames = g.Select(x => x.MetricsName).Distinct().ToList()
                })
                .ToListAsync();

            var selectedCheckBoxNames = await (
                from colSelection in contextData.SelectionCheckBoxOption
                join fields in contextData.MetricsProjectField on colSelection.FieldColumnId equals fields.Id
                where selectionIds.Contains(colSelection.ProjectTypeMetricSelectionId)
                group new { colSelection, fields } by colSelection.ProjectTypeMetricSelectionId into g
                select new
                {
                    SelectionId = g.Key,
                    Fields = g.GroupBy(x => new { x.fields.Id, x.fields.FieldName })
                        .Select(fg => new SelectionFieldDto
                        {
                            FieldColumnId = fg.Key.Id,
                            FieldName = fg.Key.FieldName,
                            IsMandatory = fg.Any(y => y.colSelection.IsMandatory)
                        }).ToList()
                })
                .ToListAsync();

            var selectedCheckBoxIds = await (
                from colSelection in contextData.SelectionCheckBoxOption
                where selectionIds.Contains(colSelection.ProjectTypeMetricSelectionId)
                group colSelection by colSelection.ProjectTypeMetricSelectionId into g
                select new
                {
                    SelectionId = g.Key,
                    Fields = g.GroupBy(x => x.FieldColumnId)
                        .Select(fg => new SelectionFieldDto
                        {
                            FieldColumnId = fg.Key,
                            IsMandatory = fg.Any(y => y.IsMandatory)
                        }).ToList()
                })
                .ToListAsync();

            // Assemble DTOs
            var result = mainRows.Select(row =>
            {
                return new SelectionDto
                {
                    Id = row.Id,
                    ProjectId = row.ProjectId,
                    ProjectName = row.ProjectName,
                    ProjectTypeId = row.ProjectTypeId,
                    ProjectTypeName = row.ProjectTypeName,
                    MetricsIDs = metricsIds.FirstOrDefault(x => x.SelectionId == row.Id)?.MetricsIds ?? new List<int>(),
                    MetricName = metricNames.FirstOrDefault(x => x.SelectionId == row.Id)?.MetricNames ?? new List<string>(),
                    SelectedCheckBoxIdsName = selectedCheckBoxNames.FirstOrDefault(x => x.SelectionId == row.Id)?.Fields ?? new List<SelectionFieldDto>(),
                    SelectedCheckBoxIds = selectedCheckBoxIds.FirstOrDefault(x => x.SelectionId == row.Id)?.Fields ?? new List<SelectionFieldDto>()
                };
            }).ToList();

            return result;
        }


        public async Task<bool> CheckDuplicate(int projectId)
        {
            var dbContext = _unitOfWork.MetricsprojectfieldRepository.Context;

            var exists = await dbContext.ProjectTypeMetricSelection
                .AnyAsync(x => x.ProjectId == projectId);

            return exists;
        }

        //get Metricsid and project type name from task table using project id
        public async Task<List<ProjectMetricsDto>> GetTaskMetricsByProjectId(int projectId)
        {
            var context = _unitOfWork.TaskDetailsRepository.Context;

            var projectMetricsList = (from task in context.Tasks
                                      where task.Id == projectId
                                      join taskMetric in context.TaskMetrics on task.Id equals taskMetric.TaskId into taskMetricGroup
                                      from tm in taskMetricGroup.DefaultIfEmpty()
                                      join metric in context.MetricsMaster on tm.MetricsId equals metric.Id into metricGroup
                                      from m in metricGroup.DefaultIfEmpty()
                                      join projectType in context.ProjectTypeMaster on task.ProjectType equals projectType.Id into projectGroup
                                      from pt in projectGroup.DefaultIfEmpty()

                                      select new ProjectMetricsDto
                                      {
                                          MetricId = tm != null ? tm.MetricsId : 0,
                                          MetricName = m != null ? m.MetricsName : string.Empty,
                                          ProjectTypeId = pt != null ? pt.Id : 0,
                                          ProjectTypeName = pt != null ? pt.ProjectTypeName : string.Empty
                                      }
            ).ToList();

            return projectMetricsList;
        }

        //Metrics Grid table column Data fetch
        public async Task<SelectedProjectFieldsDto> GetMetricsGridColumSelected(string Projectid)
        {
            var dbContext = _unitOfWork.MetricsprojectfieldRepository.Context;

            var ProjectId = await dbContext.ProjectDetails
                                         .Where(pd => pd.ProjectId == Projectid).FirstOrDefaultAsync();

            var taskId = await dbContext.Tasks
                                        .Where(task => task.ProjectId == Projectid)
                                        .Select(task => task.Id) // Get the Task.Id
                                        .FirstOrDefaultAsync();

            var projectId = await dbContext.Tasks.Where(task => task.Id == taskId).FirstOrDefaultAsync();

            var selectedMetricFields = await (from pMetric in dbContext.ProjectTypeMetricSelection.Where(task => task.ProjectId == taskId)
                                              join pf in dbContext.SelectionCheckBoxOption on pMetric.Id equals pf.ProjectTypeMetricSelectionId
                                              join columnlist in dbContext.MetricsProjectField on pf.FieldColumnId equals columnlist.Id
                                              group new { pf, columnlist } by new { pf.FieldColumnId, columnlist.FieldName, columnlist.FieldType ,columnlist.DropdownValues, columnlist.OrderBy } into g
                                              select new SelectedProjectFieldsDataDto
                                              {
                                                  FieldColumnId = g.Key.FieldColumnId,
                                                  FieldName = g.Key.FieldName,
                                                  FieldType = g.Key.FieldType,
                                                  DDValue = g.Key.DropdownValues,
                                                  OrderBy =g.Key.OrderBy,
                                                  IsMandatory = g.Any(x => x.pf.IsMandatory) // Check if any option for this field is mandatory
                                              })
                                             .Distinct()
                                             .OrderBy(x => x.OrderBy)// Ensure distinct FieldColumnId, FieldName, and IsMandatory combinations
                                             .ToListAsync();

            return new SelectedProjectFieldsDto
            {
                ProjectId = taskId,
                SelectedMetrics = selectedMetricFields
            };
        }
    }
}
