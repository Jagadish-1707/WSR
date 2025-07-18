using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class WSRKeyRisks
    {
        [Key]
        public int Id { get; set; }
        public string? ProjectId { get; set; }
        public string? WSRId { get; set; }
        public string? RiskDescription { get; set; }
        public string? Mitigation { get; set; }
        public string? Likelihood { get; set; }
        public string? RiskOwner { get; set; }
        public DateTime? DateRaised { get; set; }
        public DateTime? ResolveByDate { get; set; }
        public DateTime? CreatedOn { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? UpdatedOn { get; set; }
        public string UpdatedBy { get; set; }
        [ForeignKey("ProjectId")]
        public ZohoProject ZohoProject { get; set; }
        [ForeignKey("WSRId")]
        public WSRReport WsrReport { get; set; }
    }
}
