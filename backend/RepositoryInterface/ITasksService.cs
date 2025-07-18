using backend.DtoModels;
using backend.Models;

namespace backend.RepositoryInterface
{
    public interface ITasksService
    {
        Task<List<TaskDetailsDto>> GetAllTaskDetails();
        Task<TaskDetailsDto> GetTaskDetailsById(int Id);
        Task<TaskDetailsDto> AddTaskDetailsAsync(AddTaskDetailsDto addTaskDetailsDto);
        Task<TaskDetailsDto> EditTaskDetails(EditTaskDetailsDto editTaskDetailsDto);
        Task<List<ProjectDetails>> GetProjectByCustomerId(int customerId);

        public Task<bool> DeleteTaskIdAsync(int id, int UserId);
        Task<List<AssignedToDto>> GetAssignedEmployee(int taskid);
        Task<List<TaskMetricsDto>> GetAssignedMetrics(int taskid);

    }
}
