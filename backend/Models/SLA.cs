using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    [Table("SLA")]
    public class SLA:BaseModel
    {
        [Key]
        public long SLAId { get; set; }
        public string CustomerId {  get; set; }
        public string CustomerName { get; set; }
        public string ProjectId {  get; set; }
        public string ProjectName { get; set; }
        public string Priority { get; set; }
        public double SLAHours { get; set; }
        public string? Remarks { get; set; }

    }

    [Table("Response_SLA")]
    public class ResponseSLA : BaseModel
    {
        [Key]
        public long Id { get; set; }
        public string CustomerId { get; set; }
        public string CustomerName { get; set; }
        public string ProjectId { get; set; }
        public string ProjectName { get; set; }
        public int PriorityId { get; set; }
        public double SLAHours { get; set; }
        public string? Remarks { get; set; }

    }
}
