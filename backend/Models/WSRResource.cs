using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class WSRResource
    {
        public int Id { get; set; }
        public int? WSRProjectDetailsId { get; set; }
        public int? ZohoEmp_Id { get; set; }
        public int? Rating { get; set; }
        public int? Active { get; set; }
        public DateTime CreatedOn { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? UpdatedOn { get; set; }
        public string? UpdatedBy { get; set; }
        [ForeignKey("ZohoEmp_Id")]
        public ZohoEmp ZohoEmp { get; set; } //Navigation property 
        public WSRProjectDetails WSRProjectDetail { get; set; }
    }
}

