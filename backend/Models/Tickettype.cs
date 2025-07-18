using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class Tickettype : BaseModel
    {
        [Key]
        public int Id { get; set; }
        public string CustomerId { get; set; }
        public string Customer { get; set; }
        public string ProjectId { get; set; }
        public string Project { get; set; }
        public string TicketType { get; set; }
        public string? Remarks { get; set; }
    }
}
