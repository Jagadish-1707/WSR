using backend.Models;

namespace backend.DtoModels
{
    public class ComplexityDto : BaseModel
    {
        public int Id { get; set; }
        public int CustomerId { get; set; }
        public string Customer { get; set; }
        public int ProjectId { get; set; }
        public string Project { get; set; }
        public string ProjectComplexity { get; set; }
        public string? Remarks { get; set; }
    }

    public class AddComplexityDto
    {
        public int CustomerId { get; set; }
        public string Customer { get; set; }
        public int ProjectId { get; set; }
        public string Project { get; set; }
        public string ProjectComplexity { get; set; }
        public string? Remarks { get; set; }
        public int Status { get; set; }
    }
    public class EditComplexityDto
    {
        public int Id { get; set; }
        public int CustomerId { get; set; }
        public string Customer { get; set; }
        public int ProjectId { get; set; }
        public string Project { get; set; }
        public string ProjectComplexity { get; set; }
        public string? Remarks { get; set; }
        public int Status { get; set; }
    }
}
