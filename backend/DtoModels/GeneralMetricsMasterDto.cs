using backend.Models;
using System.ComponentModel.DataAnnotations;

namespace backend.DtoModels
{
    public class GeneralMetricsMasterDto:BaseModel
    {
        public int Id { get; set; }
        public string? GeneralMetricsName { get; set; }
        public string? Description { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string? Remarks { get; set; }
    }

    public class AddGeneralMetricsMasterDto
    {
        public string? GeneralMetricsName { get; set; }
        public string? Description { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string? Remarks { get; set; }
        public int Status { get; set; }
        public string? CreatedBy { get; set; }
    }

    public class EditGeneralMetricsMasterDto
    {
        public int Id { get; set; }
        public string? GeneralMetricsName { get; set; }
        public string? Description { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string? Remarks { get; set; }
        public bool Active { get; set; }
        public int Status { get; set; }
        public string? ModifiedBy { get; set; }

    }
}
