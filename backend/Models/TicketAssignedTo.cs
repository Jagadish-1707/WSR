using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    [Table("TicketAssignedTo")]
    public class TicketAssignedTo
    {
        [Key]
        public int TicketAssignedToId { get; set; }

        [ForeignKey("TicketDetails")]
        public int TicketDetailsId { get; set; }
        public int? UserId { get; set; }
        public string? UserName { get; set; }
    }
}

