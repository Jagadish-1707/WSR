using backend.DtoModels;
using backend.RepositoryInterface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]

    public class RoleController:ControllerBase
    {
        private readonly IAdminService _adminService;
        public RoleController(IAdminService adminService)
        {
            _adminService = adminService;
        }

        [HttpGet]
        [Route("GetRoleByIdAsync/{id}")]
        public async Task<ActionResult> GetRoleByIdAsync(int id)
        {
            var result = await _adminService.GetRoleByIdAsync(id);
            return Ok(result);
        }

        [HttpPost]
        [Route("AddRoleAsync")]
        public async Task<ActionResult> AddRoleAsync([FromForm] AddRoleDto addRoleDto)
        {
            var result = await _adminService.AddRoleAsync(addRoleDto);
            return Ok(result);
        }

        [HttpGet]
        [Route("GetAllRoles")]
        public async Task<ActionResult> GetAllRoles()
        {
            var result = await _adminService.GetRolesListAsync();
            return Ok(result);
        }


        [HttpGet]
        [Route("GetRoles")]
        public async Task<ActionResult> GetRoles()
        {
            var result = await _adminService.GetRolesAsync();
            return Ok(result);
        }

        [HttpPut]
        [Route("EditRoleAsync")]
        public async Task<ActionResult> EditRoleAsync([FromForm] EditRoleDto editRoleDto)
        {
            var result = await _adminService.EditRoleAsync(editRoleDto);
            return Ok(result);
        }

        [HttpDelete]
        [Route("DeleteRoleAsync")]
        public async Task<ActionResult> DeleteRoleAsync(int id, int userId)
        {
            var result = await _adminService.DeleteRoleByIdAsync(id, userId);
            return Ok(result);
        }

    }
}
