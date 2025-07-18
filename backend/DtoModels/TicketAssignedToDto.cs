namespace backend.DtoModels
{
    public class TicketAssignedToDto
    {
        public int TicketAssignedToId { get; set; }
        public int TicketDetailsId { get; set; }
        public int? UserId { get; set; }
        public string? UserName { get; set; }
    }
}
