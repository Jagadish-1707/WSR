using backend.DtoModels;
using backend.Models;
using backend.RepositoryInterface;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]

    public class PriviligesController : ControllerBase
    {
        private readonly IPriviligesService _priviligesService;
        public PriviligesController(IPriviligesService priviligesService)
        {
            _priviligesService = priviligesService;
        }

        [HttpGet]
        [Route("GetPrivilegesByIdAsync/{id}")]
        public async Task<ActionResult> GetPrivilegesByIdAsync(int id)
        {
            var result = await _priviligesService.GetPrivilegesByIdAsync(id);
            return Ok(result);
        }

        [HttpPost]
        [Route("AddPrivilegesAsync")]
        public async Task<ActionResult> AddPrivilegesAsync([FromBody] AddPriviligesDto addPriviligesDto)
        {
            var result = await _priviligesService.AddPrivilegesAsync(addPriviligesDto);
            return Ok(result);
        }


        [HttpGet]
        //[Authorize]
        [Route("GetAllPrivileges")]
        public async Task<ActionResult> GetAllPrivileges()
        {
            var result = await _priviligesService.GetPrivilegesListAsync();
            return Ok(result);
        }

        [HttpGet]
        [Route("GetPrivilegesByRoleIdAsync/{roleId}")]
        public async Task<ActionResult> GetPrivilegesByRoleIdAsync(int roleId)
        {
            var result = await _priviligesService.GetPrivilegesListByRoleIdAsync(roleId);
            return Ok(result);
        }


        [HttpPut]
        [Route("EditPrivilegesAsync")]
        public async Task<ActionResult> EditPrivilegesAsync([FromBody] EditPriviligesDto editPriviligesDto)
        {
            var result = await _priviligesService.EditPrivilegesAsync(editPriviligesDto);
            return Ok(result);
        }

        [HttpDelete]
        [Route("DeletePrivilegesAsync")]
        public async Task<ActionResult> DeletePrivilegesAsync(int id, int userId)
        {
            var result = await _priviligesService.DeletePrivilegesByIdAsync(id, userId);
            return Ok(result);
        }

    }
}
