using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    [Table("ProjectDetails")]
    public class ProjectDetails : BaseModel
    {
        [Key]
        public int Id { get; set; }

        public string? CustomerId { get; set; }
        public string? CustomerName { get; set; }

        public string? ProjectId { get; set; }
        public string? ProjectName { get; set; }

        public int? EngagementMode { get; set; }
        public string? CurrencyType { get; set; }
        public decimal? ContractValue { get; set; }
        public decimal? EstimatedHours { get; set; }

        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }

        public string? Remarks { get; set; }
    }
}
