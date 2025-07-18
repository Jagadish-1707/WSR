using backend.Models;

namespace backend.DtoModels
{
    public class MetricsMasterDto : BaseModel
    {
        public int Id { get; set; }
        public string? MetricsName { get; set; }
        public string? Description { get; set; }
        // public int? ProjectTypeId { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string? Remarks { get; set; }
    }

    public class AddMetricsMasterDto
    {
        public string? MetricsName { get; set; }
        public string? Description { get; set; }
        // public int? ProjectTypeId { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string? Remarks { get; set; }
        public int Status { get; set; }
        public string? CreatedBy { get; set; }

    }

    public class EditMetricsMasterDto
    {
        public int Id { get; set; }
        public string? MetricsName { get; set; }
        public string? Description { get; set; }
        //public int? ProjectTypeId { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string? Remarks { get; set; }
        public bool Active { get; set; }
        public int Status { get; set; }
        public string? ModifiedBy { get; set; }
    }
}
