using backend.DtoModels;
using backend.Models;
using backend.RepositoryInterface;
using backend.RepositoryService;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MetricProjectColumnsController : ControllerBase
    {
        private readonly IMetricsProjectColumnService _metricsProjectColumnService;

        public MetricProjectColumnsController(IMetricsProjectColumnService metricsProjectColumnService)
        {
            _metricsProjectColumnService = metricsProjectColumnService;
        }

        //Project Engagement Mode
        [HttpGet]
        [Route("GetMetricProjectColumnsById/{id}")]
        public async Task<ActionResult> GetMetricProjectColumnsById(int id)
        {
            var result = await _metricsProjectColumnService.GetMetricProjectColumnsById(id);
            if (result == null)
            {
                return NotFound();
            }
            return Ok(result);
        }

        [HttpPost]
        [Route("AddMetricProjectColumns")]
        public async Task<ActionResult> AddMetricProjectColumns([FromBody] AddMetricProjectColumnsDto addMetricProjectColumnsDto)
        {
            try
            {
                var result = await _metricsProjectColumnService.AddMetricProjectColumns(addMetricProjectColumnsDto);
                if (result == null)
                {
                    return BadRequest("Failed to add metrics project Field");
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
        [Route("GetAllMetricProjectColumns")]
        public async Task<ActionResult> GetAllMetricProjectColumns()
        {
            var result = await _metricsProjectColumnService.GetAllMetricProjectColumns();
            return Ok(result);
        }

        [HttpPut]
        [Route("EditMetricProjectColumns")]
        public async Task<ActionResult> EditMetricProjectColumns([FromBody] EditMetricProjectColumnsDto editMetricProjectColumnsDto)
        {
            var result = await _metricsProjectColumnService.EditMetricProjectColumns(editMetricProjectColumnsDto);
            return Ok(result);
        }

        [HttpPost]
        [Route("AddMetricsProjectColumnSelection")]
        public async Task<ActionResult> AddMetricsProjectColumnSelection([FromBody] SelectionDto model)
        {
            try
            {
                var result = await _metricsProjectColumnService.SaveSelection(model);
                if (result == null)
                {
                    return BadRequest("Failed to add metrics project Field selection");
                }
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal Server Error");
            }
        }
        [HttpGet]
        [Route("GetMetricProjectColumnsSelectedById/{id}")]
        public async Task<ActionResult> GetMetricProjectColumnsSelectedById(int id)
        {
            var result = await _metricsProjectColumnService.GetSelection(id);
            if (result == null)
            {
                return NotFound();
            }
            return Ok(result);
        }
        [HttpGet]
        [Route("GetAllMetricProjectColumnsSelected")]
        public async Task<ActionResult> GetAllMetricProjectColumnsSelected()
        {
            var result = await _metricsProjectColumnService.GetAllMetricProjectColumnsSelected();
            return Ok(result);
        }
        [HttpGet]
        [Route("CheckDuplicateCombination/{projectId}")]
        public async Task<ActionResult> CheckDuplicate(int projectId)
        {
            var result = await _metricsProjectColumnService.CheckDuplicate(projectId);
            return Ok(result);
        }

        [HttpGet]
        [Route("GetTaskMetricsByProjectId/{projectId}")]
        public async Task<ActionResult> GetTaskMetricsByProjectId(int projectId)
        {
            var result = await _metricsProjectColumnService.GetTaskMetricsByProjectId(projectId);
            if (result == null)
            {
                return NotFound();
            }
            return Ok(result);
        }
        [HttpGet]
        [Route("GetMetricsGridColumSelected/{id}")]
        public async Task<ActionResult> GetMetricsGridColumSelected(string id)
        {
            var result = await _metricsProjectColumnService.GetMetricsGridColumSelected(id);
            if (result == null)
            {
                return NotFound();
            }
            return Ok(result);
        }

    }
}
