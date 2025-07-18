using backend.Models;

namespace backend.DtoModels
{
    public class ProjectEngagementModeDto : BaseModel
    {
        public int Id { get; set; }
        public string ProjectEngagementMode { get; set; }
        public string? Remarks { get; set; }
        public int Status { get; set; }
        public DateTime? CreatedOn { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public string? ModifiedBy { get; set; }

        public bool Active { get; set; }
    }

    public class AddEngagementModeDto
    {
        public string ProjectEngagementMode { get; set; }
        public string? Remarks { get; set; }
        public int Status { get; set; }
        public DateTime? CreatedOn { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public string? ModifiedBy { get; set; }

        public bool Active { get; set; } = true;


    }
    public class EditEngagementModeDto
    {
        public int Id { get; set; }
        public string ProjectEngagementMode { get; set; }
        public string? Remarks { get; set; }
        public int Status { get; set; }
        public DateTime? CreatedOn { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public string? ModifiedBy { get; set; }

        public bool Active { get; set; }
    }
}
