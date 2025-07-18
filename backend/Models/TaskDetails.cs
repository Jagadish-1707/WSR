using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    [Table("TaskDetails")]
    public class TaskDetails: BaseModel
    {
        [Key]
        public int Id { get; set; }
        public string? CustomerId { get; set; }
        public string? CustomerName { get; set; }
        public string? ProjectId { get; set; }
        public string? ProjectName { get; set; }
        public int ProjectType { get; set; }
        public ICollection<AssignedTo>? AssignedTo { get; set; }
        public DateTime? AssignmentStartDate { get; set; }
        public DateTime? AssignmentEndDate { get; set; }
        public decimal? AssignmentPercent { get; set; }
        public string? BillingType { get; set; }
        public string? Remarks { get; set; }
        //public ICollection<TaskAttachment>? TaskAttachment { get; set; }
        public string? Options {  get; set; }
    }
}
