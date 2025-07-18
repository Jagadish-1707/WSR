using backend.DtoModels;
using backend.RepositoryInterface;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MetricsController : ControllerBase
    {
        private readonly IMetricsService _metricsService;

        public MetricsController(IMetricsService metricsService)
        {
            _metricsService = metricsService ?? throw new ArgumentNullException(nameof(metricsService));
        }

        [HttpPost]
        [Route("AddMetrics")]
        public async Task<IActionResult> AddMetrics([FromBody] AddMetricsDetailsDto addMetricsDetailsDto)
        {
            if (addMetricsDetailsDto == null)
            {
                return BadRequest("Invalid request body.");
            }

            try
            {
                var addedMetrics = await _metricsService.SaveMetrics(addMetricsDetailsDto);
                return Ok(addedMetrics);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error adding metrics: {ex.Message}");
            }
        }




        [HttpGet]
        [Route("GetAllMetricsData")]
        public async Task<IActionResult> GetAllMetrics()
        {
            try
            {
                var metrics = await _metricsService.GetAllMetricsData();
                return Ok(metrics);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while retrieving metrics: {ex.Message}");
            }
        }

        [HttpGet]
        [Route("GetMetricsById/{id}")]
        public async Task<IActionResult> GetMetricsDetails(int id)
        {
            try
            {
                var metricsDetailsDto = await _metricsService.GetMetricsDataById(id);

                if (metricsDetailsDto == null)
                {
                    return NotFound(); // Or handle the case when metrics details with the given ID is not found
                }

                return Ok(metricsDetailsDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error retrieving metrics details: {ex.Message}");
            }
        }

        [HttpPut]
        [Route("EditMetricsDetails")]
        public async Task<ActionResult<MetricsDetailsDto>> EditMetricsDetails([FromBody] EditMetricsDetailsDto editMetricsDto)
        {
            try
            {
                var result = await _metricsService.UpdateMetrics(editMetricsDto);
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
        [Route("GetProjectTypeByProjectId/{id}")]
        public async Task<IActionResult> GetProjectTypeByProjectId(string id)
        {
            try
            {
                var metricsDetailsDto = await _metricsService.GetProjectTypeByProjectId(id);

                if (metricsDetailsDto == null)
                {
                    return NotFound(); // Or handle the case when metrics details with the given ID is not found
                }

                return Ok(metricsDetailsDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error retrieving metrics details: {ex.Message}");
            }
        }


        [HttpGet]
        [Route("GetMetricsAssignedEmployee/{id}")]
        public async Task<IActionResult> GetMetricsAssignedEmployee(string id)
        {
            try
            {
                var empDetailsDto = await _metricsService.GetMetricsAssignedEmployee(id);

                if (empDetailsDto == null)
                {
                    return NotFound(); // Or handle the case when metrics details with the given ID is not found
                }

                return Ok(empDetailsDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error retrieving metrics details: {ex.Message}");
            }
        }
        /* [HttpGet("CheckExistence")]
         public async Task<IActionResult> CheckMetricsExistence(int customerId, int projectId, DateTime weekStartDate, DateTime weekEndDate)
         {
             try
             {
                 var exists = await _metricsService.CheckMetricsExistence(customerId, projectId, weekStartDate, weekEndDate);
                 return Ok(exists);
             }
             catch (Exception ex)
             {
                 return StatusCode(500, $"Internal server error: {ex.Message}");
             }
         }

         [HttpGet("ChartForTicketColsed/{customerId}/{projectId}/{projectType}")]
         public async Task<IActionResult> ChartForTicketColsed(int customerId,int projectId, string projectType)
         {
             try
             {
                 var result = await _metricsService.ChartForTicketColsed(customerId, projectId, projectType);
                 return Ok(result);
             }
             catch (Exception ex)
             {
                 return StatusCode(500, $"Internal server error: {ex.Message}");
             }
         }


         [HttpGet("ChartForTicketColsedComplexity/{customerId}/{projectId}/{projectType}")]
         public async Task<IActionResult> ChartForTicketColsedComplexity(int customerId, int projectId, string projectType)
         {
             try
             {
                 var result = await _metricsService.ChartForTicketColsedComplexity(customerId, projectId, projectType);
                 return Ok(result);
             }
             catch (Exception ex)
             {
                 return StatusCode(500, $"Internal server error: {ex.Message}");
             }
         }*/
    }
}
