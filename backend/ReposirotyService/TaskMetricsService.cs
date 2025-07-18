using backend.Common;
using backend.DtoModels;
using backend.Models;
using backend.RepositoryInterface;
using Microsoft.EntityFrameworkCore;

namespace backend.RepositoryService
{
    public class TaskMetricsService : ITaskMetricsService
    {
        private readonly ApplicationDbContext _context;

        public TaskMetricsService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<bool> AddTaskMetricsAsync(AddTaskMetricsDto addTaskMetricsDto)
        {
            try
            {
                // Insert each metric associated with the task
                foreach (var metricId in addTaskMetricsDto.MetricsIds)
                {
                    var taskMetrics = new TaskMetrics
                    {
                        TaskId = addTaskMetricsDto.TaskId,
                        MetricsId = metricId,
                        Active = true,
                        Status = 1
                    };
                    await _context.TaskMetrics.AddAsync(taskMetrics);
                }

                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error adding TaskMetrics: " + ex.Message);
                return false;
            }
        }

        public async Task<bool> EditTaskMetricsAsync(EditTaskMetricsDto editTaskMetricsDto)
        {
            try
            {
                // Remove existing metrics for the task
                var existingMetrics = await _context.TaskMetrics
                    .Where(tm => tm.TaskId == editTaskMetricsDto.TaskId)
                    .ToListAsync();

                _context.TaskMetrics.RemoveRange(existingMetrics);

                // Insert the new metrics
                foreach (var metricId in editTaskMetricsDto.MetricsIds)
                {
                    var taskMetrics = new TaskMetrics
                    {
                        TaskId = editTaskMetricsDto.TaskId,
                        MetricsId = metricId,
                        Active = true,
                        Status = 1
                    };
                    await _context.TaskMetrics.AddAsync(taskMetrics);
                }

                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error editing TaskMetrics: " + ex.Message);
                return false;
            }
        }


        public async Task<List<TaskMetricsDto>> GetTaskMetricsByTaskIdAsync(int taskId)
        {
            var taskMetricsList = await _context.TaskMetrics
                .Where(tm => tm.TaskId == taskId)
                .Select(tm => new TaskMetricsDto
                {
                    Id = tm.Id,
                    TaskId = tm.TaskId,
                    MetricsId = tm.MetricsId
                })
                .ToListAsync();

            return taskMetricsList;
        }


    }
}
