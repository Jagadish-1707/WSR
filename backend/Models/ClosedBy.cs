using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    [Table("ClosedBy")]
    public class ClosedBy
    {
        [Key]
        public int ClosedById { get; set; }

        [ForeignKey("TicketDetails")]
        public int TicketDetailsId { get; set; }
        public int? UserId { get; set; }
        public string? UserName { get; set; }
    }
}
