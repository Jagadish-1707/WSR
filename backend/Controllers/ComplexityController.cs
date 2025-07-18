using backend.DtoModels;
using backend.ReposirotyService;
using backend.RepositoryInterface;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ComplexityController : ControllerBase
    {
        private readonly IComplexityService _complexityService;
        public ComplexityController(IComplexityService complexityService)
        {
            _complexityService = complexityService;
        }

        [HttpGet]
        [Route("GetComplexityByIdAsync/{id}")]
        public async Task<ActionResult> GetComplexityByIdAsync(int id)
        {
            var result = await _complexityService.GetComplexityByIdAsync(id);
            return Ok(result);
        }

        [HttpPost]
        [Route("AddComplexityAsync")]
        public async Task<ActionResult> AddComplexityAsync([FromForm] AddComplexityDto addComplexityDto)
        {
            var result = await _complexityService.AddComplexityAsync(addComplexityDto);
            return Ok(result);
        }


        [HttpGet]
        //[Authorize]
        [Route("GetAllComplexity")]
        public async Task<ActionResult> GetAllComplexity()
        {
            var result = await _complexityService.GetComplexityListAsync();
            return Ok(result);
        }


        [HttpPut]
        [Route("EditComplexityAsync")]
        public async Task<ActionResult> EditComplexityAsync([FromBody] EditComplexityDto editComplexityDto)
        {
            var result = await _complexityService.EditComplexityAsync(editComplexityDto);
            return Ok(result);
        }
    }
}

