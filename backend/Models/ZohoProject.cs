using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    [Table("ZohoProjects")]
    public class ZohoProject
    {
        [Key]
        public string? ProjectId { get; set; }
        public string? ProjectName { get; set; }
        public string? ClientId { get; set; }
        public string? ClientName { get; set; }
        public string? ProjectStatus { get; set; }
        public string? OwnerId { get; set; }
        public string? OwnerName { get; set; }
        public bool? IsDeleteAllowed { get; set; }

        public string? ProjectManagers { get; set; }
        public DateTime CreatedOn { get; set; } = DateTime.UtcNow;
    }
}
