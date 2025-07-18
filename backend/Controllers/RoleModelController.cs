using backend.DtoModels;
using backend.RepositoryInterface;
using backend.RepositoryService;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RoleModelController : ControllerBase
    {
        private readonly IRoleModelRepository _repository;

        public RoleModelController(IRoleModelRepository repository)
        {
            _repository = repository;
        }

        [HttpGet("{roleId}")]
        public async Task<IActionResult> GetByRoleId(int roleId)
        {
            var models = await _repository.GetModelsByRoleIdAsync(roleId);
            return Ok(models);
        }

        [HttpPost("AddRoleModel")]
        public async Task<IActionResult> AddRoleModels([FromBody] AddRoleModelsDto dto)
        {
            if (dto.ModelNames == null || !dto.ModelNames.Any())
                return BadRequest("ModelNames cannot be empty.");

            await _repository.AddRoleModelsAsync(dto);
            return Ok("Models added successfully.");
        }

        [HttpGet("ProjectModels")]
        public async Task<ActionResult<IEnumerable<ProjectModelsDto>>> GetModels()
        {
            var models = await _repository.GetModelsAsync();

            return Ok(models); 
        }

    }

}
