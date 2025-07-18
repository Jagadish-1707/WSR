using backend.Models;

namespace backend.DtoModels
{
    public class ProjectTypeMasterDto:BaseModel
    {
        public int Id { get; set; }
        public string? ProjectTypeName { get; set; }
        public string? Description { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string? Remarks {  get; set; }
    }

    public class AddProjectTypeMasterDto
    {
        public string? ProjectTypeName { get; set; }
        public string? Description { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string? Remarks { get; set; }
        public int Status { get; set; }
        public string? CreatedBy { get; set; }

    }

    public class EditProjectTypeMasterDto
    {
        public int Id { get; set; }
        public string? ProjectTypeName { get; set; }
        public string? Description { get; set; }
        public DateTime? StartDate { get; set; }
        public bool Active { get; set; }
        public int Status { get; set; }
        public DateTime? EndDate { get; set; }
        public string? Remarks { get; set; }
        public string? ModifiedBy { get; set; }
    }
}
