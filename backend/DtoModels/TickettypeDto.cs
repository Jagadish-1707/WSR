using backend.Models;

namespace backend.DtoModels
{
    public class TickettypeDto : BaseModel
    {
        public int Id { get; set; }
        public string CustomerId { get; set; }
        public string Customer { get; set; }
        public string ProjectId { get; set; }
        public string Project { get; set; }
        public string TicketType { get; set; }
        public string Remarks { get; set; }
    }

    public class AddTickettypeDto
    {
        public string? CustomerId { get; set; }
        public string? Customer { get; set; }
        public string? ProjectId { get; set; }
        public string? Project { get; set; }
        public string? TicketType { get; set; }
        public string? Remarks { get; set; }
        public int? Status { get; set; }
    }
    public class EditTickettypeDto
    {
        public int Id { get; set; }
        public string CustomerId { get; set; }
        public string Customer { get; set; }
        public string ProjectId { get; set; }
        public string Project { get; set; }
        public string TicketType { get; set; }
        public string? Remarks { get; set; }
        public int Status { get; set; }
        public bool Active { get; set; } = true;
    }
}
