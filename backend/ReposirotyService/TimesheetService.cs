using backend.Common;
using backend.DtoModels;
using backend.Migrations;
using backend.Models;
using backend.RepositoryInterface;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using static backend.DtoModels.TimesheetsDto;
using backend.Models;
using Timesheets = backend.Models.Timesheets;

namespace backend.ReposirotyService
{
    public class TimesheetService : ITimesheetService
    {
        private readonly IConfiguration _configuration;
        private readonly UnitOfWork _unitOfWork;
        private readonly IEmailService _emailService;

        public TimesheetService(IConfiguration configuration, IEmailService emailService)
        {
            _configuration = configuration;
            _unitOfWork = new UnitOfWork(configuration);
            _emailService = emailService;
        }

        public List<WeeklyTimesheetSummary> GetWeeklyTimesheetSummaryByEmployeeName(string employeeName)
        {
            var contextData = _unitOfWork.TimesheetRepository.Context;
            var timesheets = contextData.Timesheets
                .Where(t => t.EmployeeName == employeeName)
                .ToList();

            var groupedByWeek = timesheets
                .GroupBy(t => new { t.WeekStartDate, t.WeekEndDate })
                .ToList();

            List<WeeklyTimesheetSummary> weeklySummaries = new List<WeeklyTimesheetSummary>();

            foreach (var weekGroup in groupedByWeek)
            {
                decimal totalBillableHours = 0;
                decimal totalNonBillableHours = 0;
                decimal totalHolidayHours = 0;

                foreach (var timesheet in weekGroup)
                {
                    var billingType = timesheet.BillingType?.Trim().ToLower() ?? "";

                    if (billingType == "billable")
                    {
                        totalBillableHours += timesheet.LogHours ?? 0;
                    }
                    else if (billingType.Contains("non"))
                    {
                        totalNonBillableHours += timesheet.LogHours ?? 0;
                    }
                    else if (billingType.Contains("holiday") || billingType.Contains("timeoff"))
                    {
                        totalHolidayHours += timesheet.LogHours ?? 0;
                    }
                    // Optionally: else ignore
                }

                var totalHours = weekGroup.Sum(t => t.LogHours ?? 0);

                weeklySummaries.Add(new WeeklyTimesheetSummary
                {
                    WeekStartDate = weekGroup.Key.WeekStartDate ?? DateTime.MinValue,
                    WeekEndDate = weekGroup.Key.WeekEndDate ?? DateTime.MinValue,
                    TotalBillableHours = totalBillableHours,
                    TotalNonBillableHours = totalNonBillableHours,
                    TotalHolidayHours = totalHolidayHours,
                    TotalHours = totalHours
                });
            }

            return weeklySummaries;
        }
        public List<DailyTimesheetEntryDto> GetDailyTimesheetsDetailedForManager(int managerUserId)
        {
            var context = _unitOfWork.TimesheetRepository.Context;

            // Get all employee IDs reporting to this manager
            var employeeIdsUnderManager = context.Users
                .Where(u => u.Reporting_To == managerUserId)
                .Select(u => u.Employee_ID)
                .ToList();

            // Fetch timesheets for these employees with non-null LogHours
            var timesheets = context.Timesheets
                .Where(t => employeeIdsUnderManager.Contains(t.EmployeeId) && t.Active && t.LogHours != null)
                .OrderBy(t => t.LogTs)
                .ToList();

            // Map to DTO
            return timesheets.Select(t => new DailyTimesheetEntryDto
            {
                TimesheetId = t.Id,
                LogDate = t.LogTs.Date,
                EmployeeId = t.EmployeeId,
                EmployeeName = t.EmployeeName,
                ProjectName = t.ProjectName,
                CustomerName = t.customerName,
                BillingType = t.BillingType,
                LogHours = t.LogHours ?? 0,
                TimesheetStatus = t.TimesheetStatus,
                Site = t.Site,
                Activity = t.Activity,
                Remarks = t.Remarks,
                CreatedOn = t.CreatedOn
            }).ToList();
        }
        public List<Models.Timesheets> GetTimesheetsByDateRange(DateTime weekStartDate, DateTime weekEndDate)
        {
            var contextData = _unitOfWork.TimesheetRepository.Context;
            return contextData.Timesheets
                .Where(t => t.LogTs >= weekStartDate && t.LogTs <= weekEndDate && t.Active == true)
                .ToList();
        }
        public List<Models.Timesheets> GetTimesheetsByDateRange(DateTime weekStartDate, DateTime weekEndDate, string employeeName)
        {
            var contextData = _unitOfWork.TimesheetRepository.Context;
            return contextData.Timesheets
                .Where(t => t.LogTs >= weekStartDate && t.LogTs <= weekEndDate && t.EmployeeName == employeeName && t.Active == true)
                .ToList();
        }
        public List<string> GetTimesheetsStatus(DateTime weekStartDate, DateTime weekEndDate, string employeeId)
        {

            var contextData = _unitOfWork.TimesheetRepository.Context;
            var timesheetStatuses = contextData.Timesheets
                .Where(t => t.LogTs >= weekStartDate && t.LogTs <= weekEndDate && t.EmployeeId == employeeId && t.Active == true)
                .Select(t => t.TimesheetStatus)
                .Distinct()
                .ToList();

            return timesheetStatuses;
        }
        public class TimesheetData
        {
            public string BillingType { get; set; }
            public decimal? LogHours { get; set; }
        }

        public List<TimesheetData> GetTimesheetsHours(DateTime weekStartDate, DateTime weekEndDate, string employeeId)
        {
            var contextData = _unitOfWork.TimesheetRepository.Context;
            var timesheetData = contextData.Timesheets
                .Where(t => t.LogTs >= weekStartDate && t.LogTs <= weekEndDate && t.EmployeeId == employeeId)
                .Select(t => new TimesheetData
                {
                    BillingType = t.BillingType,
                    LogHours = t.LogHours
                })
                .ToList();

            return timesheetData;
        }

        public async Task<bool> WeeklyTimesheetsWithDrawAsync(WeeklyTimesheetsWithdrawDto timeSheetWithdrawDto)
        {
            try
            {
                var contextData = _unitOfWork.TimesheetRepository.Context;
                var timesheets = contextData.Timesheets
                    .Where(t => t.LogTs >= timeSheetWithdrawDto.WeekStartDate &&
                                t.LogTs <= timeSheetWithdrawDto.WeekEndDate &&
                                t.EmployeeId == timeSheetWithdrawDto.EmployeeId &&
                                t.TimesheetStatus == "Pending")
                    .ToList();

                foreach (var wkt in timesheets)
                {
                    wkt.TimesheetStatus = "Withdrawn";
                    /*wkt.Status = 0;
                    wkt.Active = false;
                    wkt.LogHours = 0; */
                }

                await contextData.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {

                return false;
            }
        }

        public async Task<bool> DailyTimeSheetApproveAsync(DailyTimesheetApproveDto dto)
        {
            try
            {
                var contextData = _unitOfWork.TimesheetRepository.Context;
                var timesheet = contextData.Timesheets
                    .FirstOrDefault(t => t.Id == dto.TimesheetId && t.TimesheetStatus == "Pending");

                if (timesheet == null)
                    throw new Exception($"Timesheet not found or already processed with ID {dto.TimesheetId}");

                timesheet.TimesheetStatus = "Approved";
                timesheet.ModifiedBy = dto.ApprovedBy;
                timesheet.ModifiedOn = DateTime.UtcNow;
                timesheet.Remarks = dto.Comments;

                await contextData.SaveChangesAsync();

                // Email logic remains mostly the same, fetch user by timesheet.EmployeeId
                var user = contextData.Users.FirstOrDefault(u => u.Employee_ID == timesheet.EmployeeId);
                if (user == null)
                    throw new Exception($"User not found for EmployeeId {timesheet.EmployeeId}");

                if (string.IsNullOrEmpty(user.UserName))
                    user.UserName = "Employee";

                string employeeEmail = user.Email_Address;
                if (string.IsNullOrEmpty(employeeEmail))
                    throw new Exception($"Email address not found for EmployeeId {timesheet.EmployeeId}");

                string managerEmail = null;
                if (user.Reporting_To.HasValue)
                {
                    var manager = contextData.Users.FirstOrDefault(u => u.User_Id == user.Reporting_To.Value);
                    if (manager != null && !string.IsNullOrEmpty(manager.Email_Address))
                    {
                        managerEmail = manager.Email_Address;
                    }
                }

                try
                {
                    var emailResult = await _emailService.SendTimesheetNotificationEmailAsync(
                        employeeEmail,
                        user.UserName,
                        timesheet.LogTs,
                        "Approved",
                        managerEmail ?? "adhin.adish@excelenciaconsulting.com"
                    );

                    if (!emailResult.Success)
                        Console.WriteLine($"Email sending failed: {emailResult.ErrorMessage}");
                }
                catch (Exception emailEx)
                {
                    Console.WriteLine($"Email sending failed: {emailEx.Message}");
                }

                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Approval failed: {ex.Message}");
                return false;
            }
        }

        public async Task<bool> DailyTimeSheetRejectAsync(DailyTimesheetRejectDto dto)
        {
            try
            {
                var contextData = _unitOfWork.TimesheetRepository.Context;
                var timesheet = contextData.Timesheets
                    .FirstOrDefault(t => t.Id == dto.TimesheetId && t.TimesheetStatus == "Pending");

                if (timesheet == null)
                    throw new Exception($"Timesheet not found or already processed with ID {dto.TimesheetId}");

                timesheet.TimesheetStatus = "Rejected";                
                timesheet.Remarks = dto.Comments;
                timesheet.ModifiedBy = dto.RejectedBy;
                timesheet.ModifiedOn = DateTime.UtcNow;

                await contextData.SaveChangesAsync();

                var user = contextData.Users.FirstOrDefault(u => u.Employee_ID == timesheet.EmployeeId);
                if (user == null)
                    throw new Exception($"User not found for EmployeeId {timesheet.EmployeeId}");

                if (string.IsNullOrEmpty(user.UserName))
                    user.UserName = "Employee";

                string employeeEmail = user.Email_Address;
                if (string.IsNullOrEmpty(employeeEmail))
                    throw new Exception($"Email address not found for EmployeeId {timesheet.EmployeeId}");

                string managerEmail = null;
                if (user.Reporting_To.HasValue)
                {
                    var manager = contextData.Users.FirstOrDefault(u => u.User_Id == user.Reporting_To.Value);
                    if (manager != null && !string.IsNullOrEmpty(manager.Email_Address))
                    {
                        managerEmail = manager.Email_Address;
                    }
                }

                try
                {
                    var emailResult = await _emailService.SendTimesheetNotificationEmailAsync(
                        employeeEmail,
                        user.UserName,
                        timesheet.LogTs,
                        "Rejected",
                        managerEmail ?? "adhin.adish@excelenciaconsulting.com"
                    );

                    if (!emailResult.Success)
                        Console.WriteLine($"Email sending failed: {emailResult.ErrorMessage}");
                }
                catch (Exception emailEx)
                {
                    Console.WriteLine($"Email sending failed: {emailEx.Message}");
                }

                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Rejection failed: {ex.Message}");
                return false;
            }
        }

        public List<DailyTimesheetEntryDto> GetTimesheetsByEmployeeId(string employeeId)
        {
            var context = _unitOfWork.TimesheetRepository.Context;

            // Fetch timesheets for the given employeeId with non-null LogHours
            var timesheets = context.Timesheets
                .Where(t => t.EmployeeId == employeeId && t.Active && t.LogHours != null)
                .OrderBy(t => t.LogTs)
                .ToList();

            // Map to DTO
            return timesheets.Select(t => new DailyTimesheetEntryDto
            {
                TimesheetId = t.Id,
                LogDate = t.LogTs.Date,
                EmployeeId = t.EmployeeId,
                EmployeeName = t.EmployeeName,
                ProjectName = t.ProjectName,
                CustomerName = t.customerName,
                BillingType = t.BillingType,
                LogHours = t.LogHours ?? 0,
                TimesheetStatus = t.TimesheetStatus,
                Site = t.Site,
                Activity = t.Activity,
                Remarks = t.Remarks,
                CreatedOn = t.CreatedOn
            }).ToList();
        }



        public async Task<bool> AddTimesheetDetailsAsync(AddTimesheetDetailsDto addTimesheetDetailsDto)
        {
            if (addTimesheetDetailsDto == null)
            {
                throw new ArgumentNullException(nameof(addTimesheetDetailsDto));
            }

            try
            {
                var contextData = _unitOfWork.TimesheetRepository.Context;

                var existingTimesheets = contextData.Timesheets
                    .Where(t => t.WeekStartDate == addTimesheetDetailsDto.WeeklyTimesheet.First().WeekStartDate &&
                                t.WeekEndDate == addTimesheetDetailsDto.WeeklyTimesheet.First().WeekEndDate &&
                                t.EmployeeId == addTimesheetDetailsDto.EmployeeId)
                    .ToList();

                if (existingTimesheets.Any())
                {
                    contextData.Timesheets.RemoveRange(existingTimesheets);
                    await contextData.SaveChangesAsync();
                }

                foreach (var weeklyTimesheet in addTimesheetDetailsDto.WeeklyTimesheet)
                {
                    foreach (var logs in weeklyTimesheet.Logs)
                    {
                        if (logs.LogHours.HasValue && logs.LogHours.Value > 0)
                        {
                            var timesheet = new Models.Timesheets
                            {
                                ProjectId = weeklyTimesheet.ProjectId,
                                ProjectName = weeklyTimesheet.ProjectName,
                                EmployeeId = addTimesheetDetailsDto.EmployeeId,
                                EmployeeName = addTimesheetDetailsDto.EmployeeName,
                                customerId = weeklyTimesheet.CustomerId,
                                customerName = weeklyTimesheet.CustomerName,
                                Doj = addTimesheetDetailsDto.Doj,
                                Site = weeklyTimesheet.Site,
                                Activity = weeklyTimesheet.Activity,
                                BillingType = weeklyTimesheet.BillingType,
                                LogHours = logs.LogHours,
                                LogTs = logs.LogTs,
                                TimesheetStatus = "Pending",
                                WeekStartDate = weeklyTimesheet.WeekStartDate,
                                WeekEndDate = weeklyTimesheet.WeekEndDate,
                                Status = 1,
                                Active = true
                            };

                            _unitOfWork.TimesheetRepository.Insert(timesheet);
                            _unitOfWork.Save();
                        }
                    }
                }

                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public async Task<bool> SaveDailyTimesheetAsync(AddTimesheetDetailsDto dto)
        {
            try
            {
                var context = _unitOfWork.TimesheetRepository.Context;

                // Step 1: Get distinct dates from incoming logs
                var allLogDates = dto.WeeklyTimesheet
                    .SelectMany(w => w.Logs)
                    .Where(l => l.LogHours.HasValue && l.LogHours.Value > 0)
                    .Select(l => l.LogTs.Date)
                    .Distinct()
                    .ToList();

                // Step 2: Delete all existing logs for that employee on those dates
                foreach (var date in allLogDates)
                {
                    var toDelete = context.Timesheets
                        .Where(t => t.EmployeeId == dto.EmployeeId && t.LogTs.Date == date);

                    context.Timesheets.RemoveRange(toDelete);
                }

                await context.SaveChangesAsync(); // flush deletes

                // Step 3: Insert new logs
                foreach (var weekly in dto.WeeklyTimesheet)
                {
                    foreach (var log in weekly.Logs.Where(l => l.LogHours.HasValue && l.LogHours.Value > 0))
                    {
                        var timesheet = new Models.Timesheets
                        {
                            ProjectId = weekly.ProjectId,
                            ProjectName = weekly.ProjectName,
                            EmployeeId = dto.EmployeeId,
                            EmployeeName = dto.EmployeeName,
                            customerId = weekly.CustomerId,
                            customerName = weekly.CustomerName,
                            Doj = dto.Doj,
                            Site = weekly.Site,
                            Activity = weekly.Activity,
                            BillingType = weekly.BillingType,
                            LogHours = log.LogHours,
                            LogTs = log.LogTs,
                            TimesheetStatus = "Pending",
                            WeekStartDate = log.LogTs.StartOfWeek(),
                            WeekEndDate = log.LogTs.EndOfWeek(),
                            Status = 1,
                            Active = true
                        };

                        _unitOfWork.TimesheetRepository.Insert(timesheet);
                        _unitOfWork.Save();
                    }
                }

                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }



        public async Task<List<Timesheets>> GetDailyLogsByDateAsync(DateTime logDate, string employeeId)
        {
            var startOfDay = logDate.Date;
            var endOfDay = startOfDay.AddDays(1);

            return await _unitOfWork.TimesheetRepository.Context.Timesheets
                .Where(t => t.EmployeeId == employeeId && t.LogTs >= startOfDay && t.LogTs < endOfDay)
                .OrderBy(t => t.CreatedOn)
                .ToListAsync();
        }




        public async Task<bool> EditTimesheetAsync(EditTimesheetDetailsDto editTimesheetDetailsDto, DateTime startOfWeek, DateTime endOfWeek)
        {
            if (editTimesheetDetailsDto == null)
                throw new ArgumentNullException(nameof(editTimesheetDetailsDto));

            try
            {
                var contextData = _unitOfWork.TimesheetRepository.Context;

                // Remove all existing timesheets for this employee and week
                var existingTimesheets = contextData.Timesheets
                    .Where(x => x.EmployeeId == editTimesheetDetailsDto.EmployeeId &&
                                x.LogTs >= startOfWeek &&
                                x.LogTs <= endOfWeek)
                    .ToList();

                if (existingTimesheets.Any())
                {
                    contextData.Timesheets.RemoveRange(existingTimesheets);
                    await contextData.SaveChangesAsync();
                }

                // Insert new timesheets
                foreach (var weeklyTimesheet in editTimesheetDetailsDto.WeeklyTimesheet)
                {
                    foreach (var log in weeklyTimesheet.Logs)
                    {
                        if (log.LogHours.HasValue && log.LogHours.Value > 0)
                        {
                            var newTimesheet = new Models.Timesheets
                            {
                                ProjectId = weeklyTimesheet.ProjectId,
                                ProjectName = weeklyTimesheet.ProjectName,
                                EmployeeId = editTimesheetDetailsDto.EmployeeId,
                                EmployeeName = editTimesheetDetailsDto.EmployeeName,
                                customerId = weeklyTimesheet.CustomerId,
                                customerName = weeklyTimesheet.CustomerName,
                                Doj = editTimesheetDetailsDto.Doj,
                                Site = weeklyTimesheet.Site,
                                Activity = weeklyTimesheet.Activity,
                                BillingType = weeklyTimesheet.BillingType,
                                LogHours = log.LogHours,
                                Status = 1,
                                Active = true,
                                WeekStartDate = weeklyTimesheet.WeekStartDate,
                                WeekEndDate = weeklyTimesheet.WeekEndDate,
                                TimesheetStatus = "Pending",
                                LogTs = log.LogTs,
                            };

                            _unitOfWork.TimesheetRepository.Insert(newTimesheet);
                        }
                    }
                }


                // Save all changes
                _unitOfWork.Save();

                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

    public async Task<bool> BatchApproveTimesheetsAsync(BatchApproveDto dto)
        {
            try
            {
                var context = _unitOfWork.TimesheetRepository.Context;

                foreach (var entry in dto.Entries)
                {
                    var timesheets = context.Timesheets
                        .Where(t => t.Id == entry.TimesheetId &&
                                    t.LogTs.Date == entry.LogDate.Date &&
                                    t.EmployeeId == entry.EmployeeId &&
                                    t.TimesheetStatus == "Pending")
                        .ToList();

                    foreach (var t in timesheets)
                    {
                        t.TimesheetStatus = "Approved";
                        t.ModifiedBy = dto.ApprovedBy;
                        t.ModifiedOn = DateTime.UtcNow;
                        t.Remarks = dto.Comments;
                    }

                    // Send email logic
                    var user = context.Users.FirstOrDefault(u => u.Employee_ID == entry.EmployeeId);
                    if (user != null)
                    {
                        string employeeEmail = user.Email_Address;
                        string managerEmail = user.Reporting_To.HasValue
                            ? context.Users.FirstOrDefault(m => m.User_Id == user.Reporting_To.Value)?.Email_Address
                            : null;

                        await _emailService.SendTimesheetNotificationEmailAsync(
                            employeeEmail,
                            user.UserName ?? "Employee",
                            entry.LogDate,
                            "Approved",
                            managerEmail ?? "adhin.adish@excelenciaconsulting.com"
                        );
                    }
                }

                await context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Batch approval failed: {ex.Message}");
                return false;
            }
    }

    public async Task<bool> BatchRejectTimesheetsAsync(BatchRejectDto dto)
        {
            try
            {
                var context = _unitOfWork.TimesheetRepository.Context;

                foreach (var entry in dto.Entries)
                {
                    var timesheets = context.Timesheets
                        .Where(t => t.Id == entry.TimesheetId &&
                                    t.LogTs.Date == entry.LogDate.Date &&
                                    t.EmployeeId == entry.EmployeeId &&
                                    t.TimesheetStatus == "Pending")
                        .ToList();

                    foreach (var t in timesheets)
                    {
                        t.TimesheetStatus = "Rejected";
                        t.ModifiedBy = dto.RejectedBy;
                        t.ModifiedOn = DateTime.UtcNow;
                        t.Remarks = dto.Comments;
                    }

                    // Send email logic
                    var user = context.Users.FirstOrDefault(u => u.Employee_ID == entry.EmployeeId);
                    if (user != null)
                    {
                        string employeeEmail = user.Email_Address;
                        string managerEmail = user.Reporting_To.HasValue
                            ? context.Users.FirstOrDefault(m => m.User_Id == user.Reporting_To.Value)?.Email_Address
                            : null;

                        await _emailService.SendTimesheetNotificationEmailAsync(
                            employeeEmail,
                            user.UserName ?? "Employee",
                            entry.LogDate,
                            "Rejected",
                            managerEmail ?? "adhin.adish@excelenciaconsulting.com"
                        );
                    }
                }

                await context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Batch rejection failed: {ex.Message}");
                return false;
            }
        }

    }
}

public static class DateTimeExtensions
{
    public static DateTime StartOfWeek(this DateTime date)
    {
        int diff = (7 + (date.DayOfWeek - DayOfWeek.Monday)) % 7;
        return date.AddDays(-1 * diff).Date;
    }

    public static DateTime EndOfWeek(this DateTime date)
    {
        return date.StartOfWeek().AddDays(6);
    }
}
