using Microsoft.AspNetCore.Mvc;
using backend.DtoModels;
using backend.RepositoryInterface;
using System.Threading.Tasks;
using backend.RepositoryService;
using backend.DtoModels;
using static backend.DtoModels.TimesheetsDto;
using backend.ReposirotyService;
using static backend.Controllers.TimesheetController;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TimesheetController : ControllerBase
    {
        private readonly IEmailService _emailService;
        private readonly ITimesheetService _timesheetService;

        public TimesheetController(ITimesheetService timesheetService)
        {
            _timesheetService = timesheetService;
        }

        [HttpGet]
        [Route("GetAllTimesheet/{employeeName}")]
        public async Task<ActionResult> GetTimesheetList(string employeeName)
        {
            var result = _timesheetService.GetWeeklyTimesheetSummaryByEmployeeName(employeeName);
            return Ok(result);
        }

        [HttpGet]
        [Route("GetTimesheetsByDateRange/{weekStartDate}/{weekEndDate}")]
        public async Task<ActionResult> GetTimesheetsByDateRange(DateTime weekStartDate, DateTime weekEndDate)
        {
            var result =  _timesheetService.GetTimesheetsByDateRange(weekStartDate, weekEndDate);
            return Ok(result);
        } 

        [HttpGet("GetDailyTimesheetsDetailed/{managerUserId:int}")]
        public async Task<ActionResult> GetDailyTimesheetsDetailed(int managerUserId)
        {
            var result = _timesheetService.GetDailyTimesheetsDetailedForManager(managerUserId);
            return Ok(result);
        }




        [HttpPost("WithdrawTimesheet")]
        public async Task<IActionResult> WithdrawWeeklyTimesheets([FromBody] WeeklyTimesheetsWithdrawDto dto)
        {
            if (dto == null || dto.WeekStartDate == default || dto.WeekEndDate == default)
            {
                return BadRequest("Invalid input.");
            }

            var result = await _timesheetService.WeeklyTimesheetsWithDrawAsync(dto);

            if (result)
                return Ok(new { message = "Timesheets withdrawn successfully." });

            return StatusCode(500, new { message = "An error occurred while withdrawing timesheets." });
        }

        [HttpPost("ApproveDailyTimeSheet")]
        public async Task<IActionResult> ApproveDailyTimeSheet([FromBody] DailyTimesheetApproveDto approveDto)
        {
            if (approveDto == null || approveDto.TimesheetId <= 0)
                return BadRequest(new { message = "Invalid input. TimesheetId is required." });

            var result = await _timesheetService.DailyTimeSheetApproveAsync(approveDto);

            if (result)
                return Ok(new { message = "Timesheet approved successfully." });

            return StatusCode(500, new { message = "An error occurred while approving timesheet." });
        }

        [HttpPost("RejectDailyTimeSheet")]
        public async Task<IActionResult> RejectDailyTimeSheet([FromBody] DailyTimesheetRejectDto rejectDto)
        {
            if (rejectDto == null || rejectDto.TimesheetId <= 0)
                return BadRequest(new { message = "Invalid input. TimesheetId is required." });

            var result = await _timesheetService.DailyTimeSheetRejectAsync(rejectDto);

            if (result)
                return Ok(new { message = "Timesheet rejected successfully." });

            return StatusCode(500, new { message = "An error occurred while rejecting timesheet." });
        }

        [HttpGet("GetTimesheetsByEmployeeId/{employeeId}")]
        public async Task<ActionResult> GetTimesheetsByEmployeeId(string employeeId)
        {
            var result = _timesheetService.GetTimesheetsByEmployeeId(employeeId);
            return Ok(result);
        }


        [HttpPost("ApproveBatchTimeSheet")]
        public async Task<IActionResult> ApproveDailyTimeSheet([FromBody] BatchApproveDto dto)
        {
            if (dto == null || dto.Entries == null || !dto.Entries.Any())
                return BadRequest(new { message = "Invalid input. At least one entry is required." });

            var result = await _timesheetService.BatchApproveTimesheetsAsync(dto);
            if (result)
                return Ok(new { message = "Timesheets approved successfully." });

            return StatusCode(500, new { message = "An error occurred while approving timesheets." });
        }

        [HttpPost("RejectBatchTimeSheet")]
        public async Task<IActionResult> RejectDailyTimeSheet([FromBody] BatchRejectDto dto)
        {
            if (dto == null || dto.Entries == null || !dto.Entries.Any())
                return BadRequest(new { message = "Invalid input. At least one entry is required." });

            var result = await _timesheetService.BatchRejectTimesheetsAsync(dto);
            if (result)
                return Ok(new { message = "Timesheets rejected successfully." });

            return StatusCode(500, new { message = "An error occurred while rejecting timesheets." });
        }



        [HttpPost]
        [Route("GetTimesheetsLogHours")]
        public async Task<ActionResult> GetTimesheetsLogHours([FromBody] TimesheetRequest request)
        {
            if (request == null || request.DateRanges == null || string.IsNullOrEmpty(request.EmployeeId))
            {
                return BadRequest("Invalid request payload");
            }

            var results = new List<object>();
            foreach (var range in request.DateRanges)
            {
                var data = _timesheetService.GetTimesheetsHours(range.Start, range.End, request.EmployeeId);
                results.Add(new { range.Start, range.End, Data = data });
            }

            return Ok(results);

        }

        [HttpPost]
        [Route("GetTimesheetsStatus")]
        public async Task<ActionResult> GetTimesheetsByDateDistinct([FromBody] TimesheetRequest request)
        {
            if (request == null || request.DateRanges == null || string.IsNullOrEmpty(request.EmployeeId))
            {
                return BadRequest("Invalid request payload");
            }

            var results = new List<object>();
            foreach (var range in request.DateRanges)
            {
                var data = _timesheetService.GetTimesheetsStatus(range.Start, range.End, request.EmployeeId);
                results.Add(new { range.Start, range.End, Data = data });
            }

            return Ok(results);
        
        }

        public class DateRange
        {
            public DateTime Start { get; set; }
            public DateTime End { get; set; }
        }

        public class TimesheetRequest
        {
            public List<DateRange> DateRanges { get; set; }
            public string EmployeeId { get; set; }
        }
        [HttpGet]
        [Route("GetTimesheetsByDateRange/{weekStartDate}/{weekEndDate}/{employeeName}")]
        public async Task<ActionResult> GetTimesheetsByDateRange(DateTime weekStartDate, DateTime weekEndDate, string employeeName)
        {
            var result = _timesheetService.GetTimesheetsByDateRange(weekStartDate, weekEndDate, employeeName);
            return Ok(result);
        }

        [HttpPost]
        [Route("AddTimesheet")]
        public async Task<IActionResult> AddTimesheetDetailsAsync([FromBody] AddTimesheetDetailsDto addTimesheetDetailsDto)
        {

            if (addTimesheetDetailsDto != null)
            {
                var timesheetDetails = await _timesheetService.AddTimesheetDetailsAsync(addTimesheetDetailsDto);
                return Ok(timesheetDetails);
               
            }
            else
            {
                return null;
               
            }
        }

        [HttpPost]
        [Route("AddDailyTimesheet")]
        public async Task<IActionResult> AddDailyTimesheetAsync([FromBody] AddTimesheetDetailsDto dto)
        {
            if (dto == null || dto.WeeklyTimesheet == null || !dto.WeeklyTimesheet.Any())
                return BadRequest("Invalid payload");

            var result = await _timesheetService.SaveDailyTimesheetAsync(dto);
            return result
                ? Ok(new { success = true, message = "Saved successfully" })
                : StatusCode(500, new { success = false, message = "Error saving daily timesheet" });
        }

        [HttpGet]
        [Route("GetDailyTimesheetLogs/{logDate}/{employeeId}")]
        public async Task<ActionResult> GetDailyTimesheetLogs(DateTime logDate, string employeeId)
        {
            if (string.IsNullOrEmpty(employeeId) || logDate == default)
                return BadRequest("Invalid input");

            var result = await _timesheetService.GetDailyLogsByDateAsync(logDate, employeeId);

            if (result == null || !result.Any())
                return NotFound("No records found");

            return Ok(result);
        }



        [HttpPut]
        [Route("EditTimesheet")]
        public async Task<IActionResult> EditTimesheetAsync([FromBody] EditTimesheetDetailsDto editTimesheetDetailsDto, [FromQuery] DateTime startOfWeek, [FromQuery] DateTime endOfWeek)
        {
            if (editTimesheetDetailsDto != null)
            {
                var result = await _timesheetService.EditTimesheetAsync(editTimesheetDetailsDto, startOfWeek, endOfWeek);
                if (result)
                {
                    return Ok(new { message = "Timesheet updated successfully", status = "success" });
                }
                else
                {
                    return StatusCode(500, new { message = "Failed to update timesheet", status = "error" });
                }
            }
            else
            {
                return BadRequest(new { message = "Invalid request body.", status = "error" });
            }
        }

        [HttpPost("SendTimesheetNotification")]
        public async Task<IActionResult> SendTimesheetNotification([FromBody] TimesheetNotificationDto dto)
        {
            var response = await _emailService.SendTimesheetNotificationEmailAsync(
                dto.ManagerEmail,
                dto.EmployeeName,
                dto.LogDate,
                dto.Action,
                dto.CcMail);  // Assuming you added CcMail property to DTO

            if (response.Success)
                return Ok(response);

            return StatusCode(500, response);
        }


    }
}
