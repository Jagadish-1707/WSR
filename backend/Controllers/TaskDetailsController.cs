using Microsoft.AspNetCore.Mvc;
using backend.DtoModels;
using backend.RepositoryInterface;
using System.Threading.Tasks;
using backend.RepositoryService;
using backend.ReposirotyService;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TaskDetailsController : ControllerBase
    {
        private readonly ITasksService _taskService;

        public TaskDetailsController(ITasksService taskService)
        {
            _taskService = taskService;
        }

        [HttpGet]
        //[Authorize]
        [Route("GetAllTaskDetails")]
        public async Task<ActionResult> GetAllTaskDetails()
        {
            var result = await _taskService.GetAllTaskDetails();
            return Ok(result);
        }
        [HttpGet]
        //[Authorize]
        [Route("GetAllTaskDetails/{customerId}")]
        public async Task<ActionResult> GetAllUniqueProject(int customerId)
        {
            var result = await _taskService.GetProjectByCustomerId(customerId);
            return Ok(result);
        }

        [HttpPost]
        [Route("TaskDetails")]
        public async Task<IActionResult> AddTaskDetails([FromBody] AddTaskDetailsDto addTaskDetailsDto)
        {
            if (addTaskDetailsDto == null)
            {
                return BadRequest("Invalid request body.");
            }

            var addedTaskDetails = await _taskService.AddTaskDetailsAsync(addTaskDetailsDto);
            if (addedTaskDetails != null)
            {
                return Ok(addedTaskDetails);
            }
            else
            {
                return BadRequest("Failed to add task details.");
            }
        }

        [HttpGet]
        [Route("GetTaskDetailsById/{id}")]
        public async Task<ActionResult> GetTaskDetailsByIdAsync(int id)
        {
            var result = await _taskService.GetTaskDetailsById(id);
            if (result == null)
            {
                return NotFound();
            }
            return Ok(result);
        }


        [HttpPut]
        [Route("EditTaskDetails")]
        public async Task<ActionResult> EditTaskDetails([FromBody] EditTaskDetailsDto editTaskDetailsDto)
        {
            try
            {
                var result = await _taskService.EditTaskDetails(editTaskDetailsDto);
                if (result == null)
                {
                    return NotFound();
                }
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred while processing the request.");
            }
        }

        [HttpDelete]
        [Route("DeleteTask")]
        public async Task<ActionResult> DeleteTaskAsync(int id, int userId)
        {
            var result = await _taskService.DeleteTaskIdAsync(id, userId);
            return Ok(result);
        }

        [HttpGet]
        [Route("GetAssignedEmployee/{id}")]
        public async Task<ActionResult> GetAssignedEmployee(int id)
        {
            var result = await _taskService.GetAssignedEmployee(id);
            return Ok(result);
        }

        [HttpGet]
        [Route("GetAssignedMetrics/{id}")]
        public async Task<ActionResult> GetAssignedMetrics(int id)
        {
            var result = await _taskService.GetAssignedMetrics(id);
            return Ok(result);
        }
    }
}
