using backend.DtoModels;
using backend.ReposirotyService;
using backend.RepositoryInterface;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]

    public class AdminController:ControllerBase
    {
        private readonly IAdminService _adminService;
        public AdminController(IAdminService adminService)
        {
            _adminService = adminService;
        }

        [HttpGet]
        [Route("GetClients")]
        public async Task<ActionResult> GetClients()
        {
            var result = await _adminService.GetClientListAsync();
            return Ok(result);
        }

        [HttpGet]
        [Route("GetProjects")]
        public async Task<ActionResult> GetProjectsList(int clientid)
        {
            var result = await _adminService.GetProjectsListAsync(clientid);
            return Ok(result);
        }

        [HttpGet]
        [Route("GetAssignRoleByRoleIdAsync/{roleId}")]
        public async Task<ActionResult> GetAssignRoleByRoleIdAsync(int roleId)
        {
            var result = await _adminService.GetAssignRoleByRoleIdAsync(roleId);
            return Ok(result);
        }

        [HttpGet]
        [Route("GetAssignRoleByIdAsync/{Id}")]
        public async Task<ActionResult> GetAssignRoleByIdAsync(int Id)
        {
            var result = await _adminService.GetAssignRoleByIdAsync(Id);
            return Ok(result);
        }

        [HttpPost]
        [Route("AddAssignRoleAsync")]
        public async Task<ActionResult> AddAssignRoleAsync([FromBody] AddAssignRoleDto addAssignRoleDto)
        {
            var result = await _adminService.AddAssignRoleAsync(addAssignRoleDto);
            return Ok(result);
        }

        [HttpGet]
        [Route("GetAllAssignRoles")]
        public async Task<ActionResult> GetAllAssignRoles()
        {
            var result = await _adminService.GetAssignRolesListAsync();
            return Ok(result);
        }

        [HttpPut]
        [Route("EditAssignRoleAsync")]
        public async Task<ActionResult> EditAssignRoleAsync([FromBody] EditAssignRoleDto editAssignRoleDto)
        {
            var result = await _adminService.EditAssignRolesAsync(editAssignRoleDto);
            return Ok(result);
        }

        [HttpDelete]
        [Route("DeleteAssignRoleAsync")]
        public async Task<ActionResult> DeleteAssignRoleAsync(int id, int userId)
        {
            var result = await _adminService.DeleteAssignRoleByIdAsync(id, userId);
            return Ok(result);
        }


        [HttpGet]
        [Route("GetDepartments")]
        public async Task<ActionResult> GetDepartments()
        {
            var result = await _adminService.GetDepartmentsAsync();
            return Ok(result);
        }
    }
}
