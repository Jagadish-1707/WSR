using backend.DtoModels;

namespace backend.RepositoryInterface
{
    public interface ITaskMetricsService
    {
        Task<bool> AddTaskMetricsAsync(AddTaskMetricsDto addTaskMetricsDto);
        Task<bool> EditTaskMetricsAsync(EditTaskMetricsDto editTaskMetricsDto);
        Task<List<TaskMetricsDto>> GetTaskMetricsByTaskIdAsync(int taskId);
    }
}
