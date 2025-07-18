using backend.Models;
using System.Text.Json.Serialization;

namespace backend.DtoModels
{
    public class TimesheetsDto
    {
        public class TimesheetDetailsDto : BaseModel
        {
            public int Id { get; set; }
            public int EmployeeId { get; set; }
            public string EmployeeName { get; set; } = "";
            //public int CustomerId { get; set; }
            //public string CustomerName { get; set; } = "";
            public DateTime Doj { get; set; }
            public List<WeeklyTimesheets>? WeeklyTimesheet { get; set; }
        }

        public class AddTimesheetDetailsDto
        {
            public string EmployeeId { get; set; } = "";
            public string EmployeeName { get; set; } = "";
            //public int CustomerId { get; set; }
            //public string CustomerName { get; set; } = "";
            public DateTime Doj { get; set; }
            public List<WeeklyTimesheets>? WeeklyTimesheet { get; set; }
        }

        public class EditTimesheetDetailsDto
        {
            
            public int Id { get; set; }
            public string EmployeeId { get; set; } = "";
            public string EmployeeName { get; set; } = "";
            //public int CustomerId { get; set; }
            //public string CustomerName { get; set; } = "";
            public DateTime Doj { get; set; }
            [JsonPropertyName("weeklyTimesheet")]
            public List<WeeklyTimesheets>? WeeklyTimesheet { get; set; }
        }

        public class WeeklyTimesheetSummary
        {
            public DateTime WeekStartDate { get; set; }
            public DateTime WeekEndDate { get; set; }
            public decimal TotalBillableHours { get; set; }
            public decimal TotalNonBillableHours { get; set; }
            public decimal TotalHolidayHours { get; set; }
            public decimal TotalHours { get; set; }
        }

        public class WeeklyTimesheetsWithdrawDto
        {
            public DateTime WeekStartDate { get; set; }
            public DateTime WeekEndDate { get; set; }
            public string EmployeeId { get; set; }
            //public int ProjectId { get; set; }
        }

        public class DailyTimesheetApproveDto
        {
            public int TimesheetId { get; set; }
            public DateTime? LogDate { get; set; }             
            public string? EmployeeId { get; set; }
            public string? ApprovedBy { get; set; }
            public string? Comments { get; set; }
        }
        public class DailyTimesheetRejectDto
        {
            public int TimesheetId { get; set; }
            public DateTime? LogDate { get; set; }         
            public string? EmployeeId { get; set; }
            public string? RejectedBy { get; set; }
            public string? Comments { get; set; }
        }

        public class TimesheetActionEntry
        {
            public int? TimesheetId { get; set; }
            public DateTime LogDate { get; set; }
            public string EmployeeId { get; set; }
        }

        public class BatchApproveDto
        {
            public List<TimesheetActionEntry> Entries { get; set; } = new();
            public string? ApprovedBy { get; set; }

            public string? Comments { get; set; }
        }

        public class BatchRejectDto
        {
            public List<TimesheetActionEntry> Entries { get; set; } = new();
            public string? RejectedBy { get; set; }
            public string? Comments { get; set; }
        }


        public class WeeklyApprovalSummaryDto
        {
            public DateTime WeekStartDate { get; set; }
            public DateTime WeekEndDate { get; set; }
            public List<EmployeeWeeklyTimesheetDto> EmployeeTimesheets { get; set; }
        }

        public class EmployeeWeeklyTimesheetDto
        {
            public string EmployeeId { get; set; }
            public string EmployeeName { get; set; }
            public decimal TotalBillableHours { get; set; }
            public decimal TotalNonBillableHours { get; set; }
            public decimal TotalHolidayHours { get; set; }
            public decimal TotalHours { get; set; }
            public string TimesheetStatus { get; set; }
        }

        public class DailyApprovalSummaryDto
        {
            public DateTime LogDate { get; set; }
            public List<DailyTimesheetDto> EmployeeTimesheets { get; set; }
        }

        public class DailyTimesheetDto
        {
            public string EmployeeId { get; set; }
            public string EmployeeName { get; set; }
            public DateTime LogDate { get; set; }
            public decimal TotalBillableHours { get; set; }
            public decimal TotalNonBillableHours { get; set; }
            public decimal TotalHolidayHours { get; set; }
            public decimal TotalHours { get; set; }
            public string TimesheetStatus { get; set; }
        }


        public class DailyTimesheetEntryDto
        {
            public int TimesheetId { get; set; }
            public DateTime LogDate { get; set; }
            public string EmployeeId { get; set; }
            public string EmployeeName { get; set; }
            public string ProjectName { get; set; }
            public string CustomerName { get; set; }
            public string BillingType { get; set; }
            public decimal LogHours { get; set; }
            public string TimesheetStatus { get; set; }
            public string Site { get; set; }
            public string Activity { get; set; }
            public string? Remarks { get; set; }
            public DateTime? CreatedOn { get; set; }
        }


        public class TimesheetNotificationDto
        {
            public string ManagerEmail { get; set; }
            public string EmployeeName { get; set; }
            public DateTime LogDate { get; set; }
            public string Action { get; set; }
            public string CcMail { get; set; }
        }
    }
}
