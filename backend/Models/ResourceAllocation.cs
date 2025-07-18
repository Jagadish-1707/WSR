using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class ResourceAllocation
    {
        [Key]
        //autoincre
        public int Id { get; set; }

        [Required]

        public int UserId { get; set; }

        [Required]
        [MaxLength(10)]
        public string EmployeeId { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; }

        [MaxLength(100)]
        //foregin
        public string ReportingManagerUserId { get; set; }

        [MaxLength(100)]
        public string? Tower { get; set; }

        public bool? Fresher { get; set; }

        [MaxLength(500)]
        public string? CustomerName { get; set; }

        [MaxLength(500)]
        public string ProjectName { get; set; }

        [MaxLength(50)]
        public string ProjectType { get; set; }

        [MaxLength(50)]
        public string Billability { get; set; }

        [MaxLength(50)]
        public string ResourceType { get; set; }

        [MaxLength(500)]
        public string InvoiceName { get; set; }

        public DateTime? InvoiceDate { get; set; }

        [Column(TypeName = "decimal(4,2)")]
        public decimal Total { get; set; }

        [Range(0, 100)]
        public int AllocationPercentage { get; set; }
    }
}
