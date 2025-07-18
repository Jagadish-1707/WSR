using backend.DtoModels;
using backend.Models;
using backend.ReposirotyService;
using backend.RepositoryInterface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProjectDetailsController : ControllerBase
    {
        private readonly IProjectDetailsService _projectDetailsService;

        public ProjectDetailsController(IProjectDetailsService projectDetailsService)
        {
            _projectDetailsService = projectDetailsService;
        }

        [HttpGet]
        [Route("GetProjectDetailsById/{id}")]
        public async Task<ActionResult> GetProjectDetailsByIdAsync(int id)
        {
            var result = await _projectDetailsService.GetProjectDetailsByIdAsync(id);
            if (result == null)
            {
                return NotFound();
            }
            return Ok(result);
        }

        [HttpPost]
        [Route("AddProjectDetails")]
        public async Task<ActionResult> AddProjectDetailsAsync([FromBody] AddProjectDetailsDto addProjectDetailsDto)
        {
            try
            {
                var result = await _projectDetailsService.AddProjectDetailsAsync(addProjectDetailsDto);
                if (result == null)
                {
                    return BadRequest("Failed to add project details.");
                }
                return Ok(result);
            }
            catch (Exception ex)
            {
                // Log the exception
                return StatusCode(500, "Internal Server Error");
            }
        }

        [HttpGet]
        [Route("GetAllProjectUniqueCustomer")]
        public async Task<ActionResult> GetAllProjectCumstomer()
        {
            var result = await _projectDetailsService.GetProjectDetailsList();
            return Ok(result);
        }


        [HttpGet]
        [Route("GetAllProjectDetails")]
        public async Task<ActionResult> GetAllProjectDetails()
        {
            var result = await _projectDetailsService.GetProjectDetailsListAsync();
            return Ok(result);
        }

        [HttpPut]
        [Route("EditProjectDetails")]
        public async Task<ActionResult> EditProjectDetailsAsync([FromBody] EditProjectDetailsDto editProjectDetailsDto)
        {
            try
            {
                var result = await _projectDetailsService.EditProjectDetailsAsync(editProjectDetailsDto);
                if (result == null)
                {
                    return NotFound();
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                // Optional: log the exception
                return StatusCode(500, "An error occurred while processing the request.");
            }
        }



        [HttpDelete]
        [Route("DeleteProjectDetails")]
        public async Task<ActionResult> DeleteProjectDetailsAsync(int id, int userId)
        {
            var result = await _projectDetailsService.DeleteProjectDetailsByIdAsync(id, userId);
            if (!result)
            {
                return BadRequest("Failed to delete project details.");
            }
            return Ok(result);
        }      

        //Project Engagement Mode
        [HttpGet]
        [Route("GetEngagmentModeById/{id}")]
        public async Task<ActionResult> GetEngagmentModeById(int id)
        {
            var result = await _projectDetailsService.GetEngagmentModeByIdAsync(id);
            if (result == null)
            {
                return NotFound();
            }
            return Ok(result);
        }

        [HttpPost]
        [Route("AddEngagmentMode")]
        public async Task<ActionResult> AddEngagmentMode([FromBody] AddEngagementModeDto addProjectDetailsDto)
        {
            try
            {
                var result = await _projectDetailsService.AddEngagmentModeAsync(addProjectDetailsDto);
                if (result == null)
                {
                    return BadRequest("Failed to add project engagement mode");
                }
                return Ok(result);
            }
            catch (Exception ex)
            {
                // Log the exception
                return StatusCode(500, "Internal Server Error");
            }
        }

        [HttpGet]
        //[Authorize]
        [Route("GetAllEngagementMode")]
        public async Task<ActionResult> GetAllEngagementMode()
        {
            var result = await _projectDetailsService.GetAllEngagementModeAsync();
            return Ok(result);
        }

        [HttpPut]
        [Route("EditEngagementMode")]
        public async Task<ActionResult> EditEngagementMode([FromBody] EditEngagementModeDto editComplexityDto)
        {
            var result = await _projectDetailsService.EditEngagementModeAsync(editComplexityDto);
            return Ok(result);
        }
    }
}
