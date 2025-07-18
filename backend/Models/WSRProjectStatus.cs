using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class WSRProjectStatus
    {
        [Key]
        public int Id { get; set; }
        public string? ProjectId { get; set; }
        public string? WSRId { get; set; }
        public string? OverallStatus { get; set; }
        public string? Schedule { get; set; }
        public string? Financial { get; set; }
        public string? Resource { get; set; }
        public string? Quality { get; set; }
        public string? Scope { get; set; }
        public int? PlannedResource { get; set; }
        public int? ActualResource { get; set; }
        public string? MeasureTaken { get; set; }
        public string? Remarks { get; set; }
        public DateTime? CreatedOn { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime? UpdatedOn { get; set; }
        public string? UpdatedBy { get; set; }

        [ForeignKey("ProjectId")]
        public ZohoProject ZohoProject { get; set; }
        [ForeignKey("WSRId")]
        public WSRReport WsrReport { get; set; }
    }
}
