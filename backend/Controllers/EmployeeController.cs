using backend.RepositoryInterface;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmployeeController : ControllerBase
    {
        private readonly IWaytrackerService _waytrackerService;

        public EmployeeController(IWaytrackerService waytrackerService)
        {
            _waytrackerService = waytrackerService;
        }

        // GET: api/employee/contractors
        [HttpGet("contractors")]
        public async Task<IActionResult> GetContractors()
        {
            var list = await _waytrackerService.GetContractorList();

            if (list == null || list.Count == 0)
            {
                return NotFound("No contractors found.");
            }

            return Ok(list);
        }

        [HttpGet("activeEmployees")]
        public async Task<IActionResult> GetAllZohoEmployees()
        {
            var employees = await _waytrackerService.GetAllZohoEmployeesAsync();
            return Ok(employees);
        }

        [HttpPost("zoho-import-employees")]
        public async Task<IActionResult> ImportZohoEmployees()
        {
            var result = await _waytrackerService.ImportActiveEmployeesAsync();
            if (result)
                return Ok("Zoho employee import successful.");
            else
                return StatusCode(500, "Zoho employee import failed.");
        }

        [HttpGet("zoho-clients")]
        public async Task<IActionResult> GetZohoClients()
        {
            var clients = await _waytrackerService.GetZohoClientsAsync();
            if (clients == null || clients.Count == 0)
                return NotFound("No clients found.");
            return Ok(clients);
        }

        [HttpPost("zoho/import-clients")]
        public async Task<IActionResult> ImportZohoClients()
        {
            var result = await _waytrackerService.ImportZohoClientsAsync();
            return Ok(new { success = result });
        }


        [HttpGet("zoho-all-projects")]
        public async Task<IActionResult> GetAllProjects()
        {
            var projects = await _waytrackerService.GetAllZohoProjectsAsync();
            return Ok(projects);
        }        


        [HttpGet("zoho-projects")]
        public async Task<IActionResult> GetProjects([FromQuery] string? clientId = null, [FromQuery] string? assignedTo = null)
        {
            try
            {
                var projects = await _waytrackerService.GetProjectsByClientAndAssignedToAsync(clientId, assignedTo);

                if (projects == null || !projects.Any())
                    return NotFound("No projects found for the given parameters.");

                return Ok(projects);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error fetching projects: {ex.Message}");
            }
        }

        [HttpGet("projects-by-employees")]
        public async Task<IActionResult> GetProjectsForAllEmployees()
        {
            try
            {
                var projects = await _waytrackerService.GetProjectsForAllEmployeesAsync();
                return Ok(projects);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error: {ex.Message}");
            }
        }


        [HttpPost("zoho-import-all-projects")]
        public async Task<IActionResult> ImportAllProjectsFromZoho()
        {
            try
            {
                var projects = await _waytrackerService.GetProjectsForAllEmployeesAsync();

                if (projects == null || projects.Count == 0)
                    return NotFound("No projects retrieved from Zoho.");

                bool saved = _waytrackerService.SaveZohoProjectsToDb(projects);
                if (saved)
                    return Ok(new { message = "Projects imported and saved successfully.", total = projects.Count });
                else
                    return StatusCode(500, "Failed to save projects to the database.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Internal Server Error", details = ex.Message });
            }
        }

    }
}

