using backend.DtoModels;
using backend.ReposirotyService;
using backend.RepositoryInterface;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DevelopmentMerticsController : ControllerBase
    {
        private readonly IDevelopmentMetricsService _developmentMetricsService;

        public DevelopmentMerticsController(IDevelopmentMetricsService developmentMetricsService)
        {
            _developmentMetricsService = developmentMetricsService ?? throw new ArgumentNullException(nameof(developmentMetricsService));
        }

        [HttpPost]
        [Route("AddDevMetrics")]
        public async Task<IActionResult> AddDevelopmentMetrics([FromBody] AddDevelopmentMetricsDto addDevelopmentMetricsDetailsDto)
        {
            if (addDevelopmentMetricsDetailsDto == null)
            {
                return BadRequest("Invalid request body.");
            }

            try
            {
                var addedDevMetrics = await _developmentMetricsService.AddDevelopmentMetricsAsync(addDevelopmentMetricsDetailsDto);
                return Ok(addedDevMetrics);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error adding Development metrics: {ex.Message}");
            }
        }
        [HttpGet]
        [Route("GetDevMetrics")]
        public async Task<IActionResult> GetAllDevMetrics()
        {
            try
            {
                var devMetrics = await _developmentMetricsService.GetAllDevMetricsDetails();
                return Ok(devMetrics);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while retrieving metrics: {ex.Message}");
            }
        }
        [HttpPut]
        [Route("EditDevMetricsDetails")]
        public async Task<ActionResult<DevelopmentMetricsDto>> EditDevMetricsDetails([FromBody] EditDevelopmentMetricsDto editDevMetricsDto)
        {
            try
            {
                var result = await _developmentMetricsService.EditDevMetricsDetails(editDevMetricsDto);
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
        [HttpGet]
        [Route("GetDevMetricsById/{id}")]
        public async Task<IActionResult> GetDevMetricsDetails(int id)
        {
            try
            {
                var devMetricsDetailsDto = await _developmentMetricsService.GetDevMetricsDetailsById(id);

                if (devMetricsDetailsDto == null)
                {
                    return NotFound(); // Or handle the case when metrics details with the given ID is not found
                }

                return Ok(devMetricsDetailsDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error retrieving metrics details: {ex.Message}");
            }
        }
    }
}
