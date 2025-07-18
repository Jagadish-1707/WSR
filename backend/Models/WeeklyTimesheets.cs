using System;

namespace backend.Models
{
    public class WeeklyTimesheets
    {
        public int CustomerId { get; set; } //Added 8-5-25
        public string CustomerName { get; set; } = ""; //Added 8-5-25
        public int ProjectId { get; set; }
        public string ProjectName { get; set; } = "";
        public string Activity { get; set; } = "";
        public string Site { get; set; } = "";
        public string BillingType { get; set; } = "";
        public DateTime WeekStartDate { get; set; }
        public DateTime WeekEndDate { get; set; }
        public ICollection<Logs>? Logs { get; set; }
       
    }
    public class Logs
    {
        public string TimesheetStatus { get; set; } = "";
        public decimal? LogHours { get; set; }
        public DateTime LogTs { get; set; }
    }
}
