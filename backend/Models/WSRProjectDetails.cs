using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class WSRProjectDetails
    {
        [Key]
        public int Id { get; set; }
        public string? ProjectId { get; set; }
        public string? WSRId { get; set; }
        public string? ManagerName { get; set; }
        public int? TeamSize { get; set; }
        public string? Technology { get; set; }
        public string? CustomerLocation { get; set; }
        public string? BusinessDomain { get; set; }
        public string? ProjectType { get; set; }
        public string? Resources { get; set; }
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
