using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class WSRTask
    {
        [Key]
        public int Id { get; set; }
        public string? WSRId { get; set; }
        public string? ProjectId { get; set; }
        public string? Task { get; set; }
        public string? TaskStatus { get; set; }
        public string? Remarks { get; set; }
        public bool Active { get; set; }
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
