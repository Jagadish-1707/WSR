using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class WSRIssues
    {
        [Key]
        public int Id { get; set; }
        public string? WSRId { get; set; }
        public string? ProjectId { get; set; }
        public string? Type { get; set; }
        public string? FunctionalArea { get; set; }
        public string? Description { get; set; }
        public string? ActionRequired { get; set; }
        public DateTime? DateReported {  get; set; }
        public DateTime? ResolveByDate { get; set; }
        public string? IssueOwner { get; set; }
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
