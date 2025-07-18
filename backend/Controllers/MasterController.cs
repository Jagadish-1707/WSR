using backend.DtoModels;
using backend.ReposirotyService;
using backend.RepositoryInterface;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MasterController : ControllerBase
    {
        private readonly IMasterService _masterService;

        public MasterController(IMasterService masterService)
        {
            _masterService = masterService;
        }

        // 1. Get ProjectTypeMaster by Id
        [HttpGet]
        [Route("GetProjectTypeById/{id}")]
        public async Task<ActionResult> GetProjectTypeMasterByIdAsync(int id)
        {
            var result = await _masterService.GetProjectTypeMasterByIdAsync(id);
            if (result == null)
            {
                return NotFound("ProjectTypeMaster not found.");
            }
            return Ok(result);
        }

        // 2. Add a new ProjectTypeMaster
        [HttpPost]
        [Route("AddProjectType")]
        public async Task<ActionResult> AddProjectTypeMaster([FromBody] AddProjectTypeMasterDto addProjectTypeMasterDto)
        {
            try
            {
                var result = await _masterService.AddProjectTypeMasterAsync(addProjectTypeMasterDto);
                if (result == null)
                {
                    return BadRequest("Error adding ProjectType.");
                }
                return Ok(result);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message }); 
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while processing your request.", details = ex.Message });
            }
        }


        // 3. Get all ProjectTypeMasters
        [HttpGet]
        [Route("GetAllProjectType")]
        public async Task<ActionResult> GetAllProjectTypeMasters()
        {
            var result = await _masterService.GetProjectTypeMasterListAsync();
            return Ok(result);
        }

        // 4. Edit an existing ProjectTypeMaster
        [HttpPut]
        [Route("EditProjectType")]
        public async Task<ActionResult> EditProjectTypeMaster([FromBody] EditProjectTypeMasterDto editProjectTypeMasterDto)
        {
            var result = await _masterService.EditProjectTypeMasterAsync(editProjectTypeMasterDto);
            if (result == null)
            {
                return BadRequest("Error updating ProjectTypeMaster.");
            }
            return Ok(result);
        }


        //Ticket Type
        [HttpGet]
        [Route("GetTicketTypeById/{id}")]
        public async Task<ActionResult> GetTicketTypeById(int id)
        {
            var result = await _masterService.GetTicketTypeById(id);
            if (result == null)
            {
                return NotFound("ProjectTypeMaster not found.");
            }
            return Ok(result);
        }

        [HttpPost]
        [Route("AddTicketType")]
        public async Task<ActionResult> AddTicketTypeAsync([FromBody] AddTickettypeDto addProjectTypeMasterDto)
        {
            try
            {
                var result = await _masterService.AddTicketTypeAsync(addProjectTypeMasterDto);
                if (result == null)
                {
                    return BadRequest("Error adding ProjectType.");
                }
                return Ok(result);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while processing your request.", details = ex.Message });
            }
        }

        [HttpGet]
        [Route("GetTicketTypeList")]
        public async Task<ActionResult> GetTicketTypeList()
        {
            var result = await _masterService.GetTicketTypeList();
            return Ok(result);
        }

        [HttpPut]
        [Route("EditTicketType")]
        public async Task<ActionResult> EditTicketTypeAsync([FromBody] EditTickettypeDto editProjectTypeMasterDto)
        {
            var result = await _masterService.EditTicketTypeAsync(editProjectTypeMasterDto);
            if (result == null)
            {
                return BadRequest("Error updating ProjectTypeMaster.");
            }
            return Ok(result);
        }

        // POST: api/MetricsMaster
        [HttpPost("AddMetrics")]
        public async Task<ActionResult> AddMetricsMaster([FromBody] AddMetricsMasterDto addMetricsMasterDto)
        {
            var result = await _masterService.AddMetricsMasterAsync(addMetricsMasterDto);
            if (result == null)
            {
                return BadRequest("Error adding MetricsMaster.");
            }
            return Ok(result);
        }

        // PUT: api/MetricsMaster
        [HttpPut("EditMetricsMaster")]
        public async Task<ActionResult> EditMetricsMaster([FromBody] EditMetricsMasterDto editMetricsMasterDto)
        {
            var result = await _masterService.EditMetricsMasterAsync(editMetricsMasterDto);
            if (result == null)
            {
                return BadRequest("Error updating MetricsMaster.");
            }
            return Ok(result);
        }

        // GET: api/MetricsMaster/{id}
        [HttpGet("GetMetricsById/{id}")]
        public async Task<ActionResult> GetMetricsMasterByIdAsync(int id)
        {
            var result = await _masterService.GetMetricsMasterByIdAsync(id);
            if (result == null)
            {
                return NotFound("MetricsMaster not found.");
            }
            return Ok(result);
        }

        // GET: api/MetricsMaster
        [HttpGet("GetAllMetricsList")]
        public async Task<ActionResult<List<MetricsMasterDto>>> GetMetricsMasterListAsync()
        {
            var result = await _masterService.GetMetricsMasterListAsync();
            return Ok(result);
        }

        // GET: api/MetricsMaster
        [HttpGet("GetAllMetricsMaster")]
        public async Task<ActionResult<List<MetricsMasterDto>>> GetAllMetricsMasterListAsync()
        {
            var result = await _masterService.GetAllMetricsMasterListAsync();
            return Ok(result);
        }


        [HttpPost]
        [Route("AddGeneralMetrics")]
        public async Task<ActionResult> AddGeneralMetricsMaster([FromBody] AddGeneralMetricsMasterDto addGeneralMetricsMasterDto)
        {
            var result = await _masterService.AddGeneralMetricsMasterAsync(addGeneralMetricsMasterDto);
            if (result == null)
            {
                return BadRequest("Error adding GeneralMetricsMaster.");
            }
            return Ok(result);
        }

        [HttpPut]
        [Route("EditGeneralMetrics")]
        public async Task<ActionResult> EditGeneralMetricsMaster([FromBody] EditGeneralMetricsMasterDto editGeneralMetricsMasterDto)
        {
            var result = await _masterService.EditGeneralMetricsMasterAsync(editGeneralMetricsMasterDto);
            if (result == null)
            {
                return NotFound("GeneralMetricsMaster not found.");
            }
            return Ok(result);
        }

        [HttpGet]
        [Route("GetGeneralMetricsList")]
        public async Task<ActionResult<List<GeneralMetricsMasterDto>>> GetGeneralMetricsMasterList()
        {
            var result = await _masterService.GetGeneralMetricsMasterListAsync();
            return Ok(result);
        }

        [HttpGet]
        [Route("GetGeneralMetricsById/{id}")]
        public async Task<ActionResult<GeneralMetricsMasterDto>> GetGeneralMetricsMasterById(int id)
        {
            var result = await _masterService.GetGeneralMetricsMasterByIdAsync(id);
            if (result == null)
            {
                return NotFound("GeneralMetricsMaster not found.");
            }
            return Ok(result);
        }
    }
}
