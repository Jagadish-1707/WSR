using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    [Table("DevelopmentMetrics")]
    public class DevelopmentMetrics : BaseModel
    {
        [Key]
        public int DevelopmentMetricsId { get; set; }
        public int? CustomerId { get; set; }
        public string? CustomerName { get; set; }
        public int? ProjectId { get; set; }
        public string? ProjectName { get; set; }
        public string? ProjectType { get; set; }
        public DateTime? MonthYear { get; set; }
        public DateTime? WeekStartDate { get; set; }
        public DateTime? WeekEndDate { get; set; }
        public ICollection<DevelopmentTask>? DevelopmentTasks { get; set; }
    }
}
