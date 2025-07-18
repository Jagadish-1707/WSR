using backend.Models;

namespace backend.DtoModels
{
    public class PriorityDto:BaseModel
    {
        public int Id { get; set; }
        public string CustomerId { get; set; }
        public string Customer { get; set; }
        public string ProjectId { get; set; }
        public string Project { get; set; }
        public string ProjectPriority { get; set; }
        public string Remarks { get; set; }
    }

    public class AddPriorityDto
    {
        public string? CustomerId { get; set; }
        public string? Customer { get; set; }
        public string? ProjectId { get; set; }
        public string? Project { get; set; }
        public string? ProjectPriority { get; set; }
        public string? Remarks { get; set; }
        public int? Status { get; set; }
    }
    public class EditPriorityDto
    {
        public int Id { get; set; }
        public string CustomerId { get; set; }
        public string Customer { get; set; }
        public string ProjectId { get; set; }
        public string Project { get; set; }
        public string ProjectPriority { get; set; }
        public string? Remarks { get; set; }
        public int Status { get; set; }
        public bool Active { get; set; } = true;
    }
}
