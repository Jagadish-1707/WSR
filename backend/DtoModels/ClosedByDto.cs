namespace backend.DtoModels
{
    public class ClosedByDto
    {
        public int ClosedById { get; set; }
        public int TicketDetailsId { get; set; }
        public int? UserId { get; set; }
        public string? UserName { get; set; }
    }
}
