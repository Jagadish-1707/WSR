using backend.DtoModels;
using backend.ReposirotyService;
using backend.RepositoryInterface;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]

    public class PriorityController:Controller
    {
        private readonly IPriorityService _priorityService;
        public PriorityController(IPriorityService priorityService)
        {
            _priorityService = priorityService;
        }

        [HttpGet]
        [Route("GetPriorityByIdAsync/{id}")]
        public async Task<ActionResult> GetPriorityByIdAsync(int id)
        {
            var result = await _priorityService.GetPriorityByIdAsync(id);
            return Ok(result);
        }

        [HttpPost]
        [Route("AddPriorityAsync")]
        public async Task<ActionResult> AddPriorityAsync([FromBody] AddPriorityDto addPriorityDto)
        {
            var result = await _priorityService.AddPriorityAsync(addPriorityDto);
            return Ok(result);
        }


        [HttpGet]
        //[Authorize]
        [Route("GetAllPriority")]
        public async Task<ActionResult> GetAllPriority()
        {
            var result = await _priorityService.GetPriorityListAsync();
            return Ok(result);
        }

        
        [HttpPut]
        [Route("EditPriorityAsync")]
        public async Task<ActionResult> EditPriorityAsync([FromBody] EditPriorityDto editPriorityDto)
        {
            var result = await _priorityService.EditPriorityAsync(editPriorityDto);
            return Ok(result);
        }
    }
}
