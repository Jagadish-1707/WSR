namespace backend.DtoModels
{
    public class WorkedByDto
    {
        public int WorkedById { get; set; }
        public int TicketDetailsId { get; set; }
        public int? UserId { get; set; }
        public string? UserName { get; set; }
    }
}
