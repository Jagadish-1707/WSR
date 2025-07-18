using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    [Table("WorkedBy")]
    public class WorkedBy
    {
        [Key]
        public int WorkedById { get; set; }

        [ForeignKey("TicketDetails")]
        public int TicketDetailsId { get; set; }
        public int? UserId { get; set; }
        public string? UserName { get; set; }
    }
}
