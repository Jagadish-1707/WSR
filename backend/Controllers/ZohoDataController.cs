using backend.Common;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ZohoDataController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ZohoDataController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/ZohoData/clients
        [HttpGet("clients")]
        public async Task<IActionResult> GetAllClients()
        {
            var clients = await _context.ZohoClient.ToListAsync();
            return Ok(clients);
        }

        // GET: api/ZohoData/projects
        [HttpGet("projects")]
        public async Task<IActionResult> GetAllProjects()
        {
            var projects = await _context.ZohoProjects.ToListAsync();
            return Ok(projects);
        }

        // GET: api/ZohoData/projects/by-client/{clientId}
        [HttpGet("projects/by-client/{clientId}")]
        public async Task<IActionResult> GetProjectsByClientId(string clientId)
        {
            if (string.IsNullOrWhiteSpace(clientId))
                return BadRequest("ClientId is required.");

            var projects = await _context.ZohoProjects
                .Where(p => p.ClientId == clientId)
                .ToListAsync();

            if (projects == null || projects.Count == 0)
                return NotFound($"No projects found for ClientId: {clientId}");

            return Ok(projects);
        }
    }
}
