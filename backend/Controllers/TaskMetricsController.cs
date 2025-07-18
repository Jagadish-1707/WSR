using backend.DtoModels;
using backend.RepositoryInterface;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TaskMetricsController : ControllerBase
    {
        private readonly ITaskMetricsService _taskMetricsService;

        public TaskMetricsController(ITaskMetricsService taskMetricsService)
        {
            _taskMetricsService = taskMetricsService;
        }

        [HttpPost("add-task-metrics")]
        public async Task<IActionResult> AddTaskMetrics([FromBody] AddTaskMetricsDto addTaskMetricsDto)
        {
            var result = await _taskMetricsService.AddTaskMetricsAsync(addTaskMetricsDto);

            if (!result)
            {
                return BadRequest("Failed to add TaskMetrics.");
            }

            return Ok(result);
        }

        [HttpPut("edit-task-metrics")]
        public async Task<IActionResult> EditTaskMetrics([FromBody] EditTaskMetricsDto editTaskMetricsDto)
        {
            var result = await _taskMetricsService.EditTaskMetricsAsync(editTaskMetricsDto);

            if (!result)
            {
                return BadRequest("Failed to edit TaskMetrics.");
            }

            return Ok(result);
        }


        [HttpGet("task-metrics/{taskId}")]
        public async Task<IActionResult> GetTaskMetricsByTaskId(int taskId)
        {
            var taskMetrics = await _taskMetricsService.GetTaskMetricsByTaskIdAsync(taskId);

            if (taskMetrics == null || !taskMetrics.Any())
            {
                return NotFound("No metrics found for the specified TaskId.");
            }

            return Ok(taskMetrics);
        }


    }
}
