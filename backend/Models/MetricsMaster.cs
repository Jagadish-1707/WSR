using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class MetricsMaster : BaseModel
    {
        [Key]
        public int Id { get; set; }
        public string? MetricsName { get; set; }
        public string? Description { get; set; }
        //public int? ProjectTypeId { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string? Remarks { get; set; }
    }
}
