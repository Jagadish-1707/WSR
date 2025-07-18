using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Diagnostics.CodeAnalysis;

    public class Timesheets:BaseModel
    {
        [Key]
        public int Id { get; set; }
        public int ProjectId { get; set; }
        public string ProjectName { get; set; }
        public string EmployeeId { get; set; }
        public string EmployeeName { get; set; }
        public int customerId { get; set; }
        public string customerName { get; set; }
        public DateTime Doj { get; set; }
        public string Site { get; set; }
        public string Activity { get; set; }
        public string BillingType { get; set; }
        public decimal? LogHours { get; set; }
        public DateTime LogTs { get; set; }
        public DateTime? WeekStartDate { get; set; }
        public DateTime? WeekEndDate { get; set; }
        public string TimesheetStatus { get; set; }
        public string? Remarks { get; set; }

        }
    }
