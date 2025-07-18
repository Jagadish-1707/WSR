using backend.ReposirotyService;
using backend.RepositoryInterface;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OverviewController : Controller
    {
        private readonly OverviewService _overviewService;

        public OverviewController(OverviewService overviewService)
        {
            _overviewService = overviewService ?? throw new ArgumentNullException(nameof(overviewService));
        }
        [HttpGet]
        [Route("GetDevMetrics")]
        public async Task<IActionResult> GetAllDevMetrics()
        {
            try
            {
                var devMetrics = await _overviewService.GetAllDevDetails();
                return Ok(devMetrics);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while retrieving metrics: {ex.Message}");
            }
        }
    }
}
