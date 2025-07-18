using backend.DtoModels;
using backend.ReposirotyService;
using backend.RepositoryInterface;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WSRReportController : ControllerBase
    {
        private readonly IWSRReportService _wsrReportService;

        public WSRReportController(IWSRReportService wsrReportService)
        {
            _wsrReportService = wsrReportService;
        }

        [HttpPost("AddWSRReport")]
        public async Task<IActionResult> AddWSRReport([FromBody] WSRRequestModel report)
        {
            var result = await _wsrReportService.AddWSRReportAsync(report.WSRReportDto, report.WSRProjectDetailsDto, report.WSRProjectStatusDto, report.WSRTaskDto ,report.WSRIssueDto, report.WSRKeyRisksDto);

            if (result.Success)
            {
                return Ok(new { message = result.Message, reportId = result.ReportId });
            }

            return Ok(new { message = result.Message });
        }

        //get all wsrreport by projectId ,Month&Year
        [HttpGet("filterWSRReport")]
        public async Task<IActionResult> GetFilteredReports([FromQuery] string? projectId, [FromQuery] int month, [FromQuery] int year)
        {
            var (success, message, data) = await _wsrReportService.GetFilteredWSRReportsAsync(projectId, month, year);

            if (!success)
                return NotFound(new { message });

            return Ok(data);
        }

        //Get wsrreport by id
        [HttpGet("GetReportById/{wsrId}")]
        public async Task<IActionResult> GetReportById(string wsrId)
        {
            var (success, message, data) = await _wsrReportService.GetReportByIdAsync(wsrId);

            if (!success)
                return NotFound(new { message });

            return Ok(data);
        }

        [HttpPost("GetConsolidatedReports")]
        public async Task<IActionResult> GetConsolidatedReports([FromBody] List<string> wsrReportsIds)
        {
            
            var result = await _wsrReportService.GetMultipleReportsByIdsAsync(wsrReportsIds);

            if (!result.Success)
                return NotFound(result.Message);

            return Ok(result.Data);
        }


        [HttpPut("UpdateWsrReport/{wsrId}")]
        public async Task<IActionResult> UpdateWsrReportById(string wsrId, [FromBody] WSRRequestModel report)
         {
            var result = await _wsrReportService.UpdateWSRReportAsync(wsrId,report.WSRReportDto,report.WSRProjectDetailsDto,report.WSRProjectStatusDto, report.WSRTaskDto,report.WSRIssueDto,report.WSRKeyRisksDto);

            if (result.Success)
                return Ok(new { message = result.Message });

            return Ok(new { message = result.Message });
        }





    }
}
