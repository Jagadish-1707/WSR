using backend.DtoModels;
using backend.ReposirotyService;
using backend.RepositoryInterface;
using backend.RepositoryService;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SLAController : Controller
    {
        private readonly ISLAService _SLAService;
        private readonly IPriorityService _priorityService;
        public SLAController(ISLAService SLAService, IPriorityService priorityService)
        {
            _SLAService = SLAService;
            _priorityService = priorityService;
        }

        [HttpPost]
        [Route("AddSLAAsync")]
        public async Task<ActionResult> AddSLAAsync([FromBody] AddSLADto addSLADto)
        {
            var result = await _SLAService.AddSLA(addSLADto);
            return Ok(result);
        }

        [HttpGet]
        [Route("GetPriorityList")]
        public async Task<ActionResult> GetPriorityList()
        {
            var result = await _priorityService.GetPriorityListAsync();
            return Ok(result);

        }

        [HttpGet]
        [Route("GetMetricsPriorityList")]
        public async Task<ActionResult> GetMetricsPriorityList()
        {
            var result = await _priorityService.GetMetricsPriorityList();
            return Ok(result);

        }

        [HttpGet]
        [Route("GetSLAList")]
        public async Task<ActionResult> GetSlaList()
        {
            var result = _SLAService.GetAllSLA();
            return Ok(result);

        }
        [HttpGet]
        [Route("GetSLAMetricsList")]
        public async Task<ActionResult> GetSLAMetricsList()
        {
            var result = _SLAService.GetSLAMetricsList();
            return Ok(result);

        }
        [HttpPut]
        [Route("EditSLADetails")]
        public async Task<ActionResult> EditSLADetailsAsync([FromBody] SLADto editSLA)
        {
            var result = await _SLAService.EditSLADetailsAsync(editSLA);
            if (result == null)
            {
                return NotFound();
            }
            return Ok(result);
        }
        [HttpGet]
        [Route("GetSLAById/{id}")]
        public async Task<ActionResult> GetSlaById(long id)
        {
            var result = await _SLAService.GetSLADetailsByIdAsync(id);
            if (result == null)
            {
                return NotFound();
            }
            return Ok(result);

        }

        //Response SLA
        [HttpGet]
        [Route("GetResponseSLAList")]
        public async Task<ActionResult> GetAllResponseSLA()
        {
            var result = _SLAService.GetAllResponseSLA();
            return Ok(result);

        }
        [HttpGet]
        [Route("GetResponseSLAMetricsList")]
        public async Task<ActionResult> GetSLAResponseMetricsList()
        {
            var result = _SLAService.GetSLAResponseMetricsList();
            return Ok(result);

        }
        [HttpPost]
        [Route("AddResponseSLA")]
        public async Task<ActionResult> AddResponseSLA([FromBody] AddResponseSLADto addSLADto)
        {
            var result = await _SLAService.AddResponseSLA(addSLADto);
            return Ok(result);
        }
        [HttpPut]
        [Route("EditResponseSLA")]
        public async Task<ActionResult> EditResponseSLA([FromBody] EditResponseSLADto editSLA)
        {
            var result = await _SLAService.EditResponseSLA(editSLA);
            if (result == null)
            {
                return NotFound();
            }
            return Ok(result);
        }
        [HttpGet]
        [Route("GetResponseSLAById/{id}")]
        public async Task<ActionResult> GetResponseSLADetailsByIdAsync(long id)
        {
            var result = await _SLAService.GetResponseSLADetailsByIdAsync(id);
            if (result == null)
            {
                return NotFound();
            }
            return Ok(result);

        }


    }
}
