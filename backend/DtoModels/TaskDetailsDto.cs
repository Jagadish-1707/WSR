using backend.Models;

namespace backend.DtoModels
{
    public class TaskDetailsDto : BaseModel
    {
        public int Id { get; set; }
        public string? CustomerId { get; set; }
        public string? CustomerName { get; set; }
        public string? ProjectId { get; set; }
        public string? ProjectName { get; set; }
        public int ProjectType { get; set; }
        public List<AssignedToDto>? AssignedTo { get; set; }
        public DateTime? AssignmentStartDate { get; set; }
        public DateTime? AssignmentEndDate { get; set; }
        public decimal? AssignmentPercent { get; set; }
        public string? BillingType { get; set; }
        public string? Remarks { get; set; }
        //public List<TaskAttachmentDto>? TaskAttachment { get; set; }
        public string? Options { get; set; }
        public int? AssignedEmployeeCount { get; set; }
        public int? MetricsCount { get; set; }
    }

    public class AddTaskDetailsDto
    {
        public string CustomerId { get; set; }
        public string? CustomerName { get; set; }
        public string ProjectId { get; set; }
        public string? ProjectName { get; set; }
        public int ProjectType { get; set; }
        public List<AssignedToDto>? AssignedTo { get; set; }
        public DateTime? AssignmentStartDate { get; set; }
        public DateTime? AssignmentEndDate { get; set; }
        public decimal? AssignmentPercent { get; set; }
        public string? BillingType { get; set; }
        public string? Remarks { get; set; }
        //public List<IFormFile>? TaskAttachment { get; set; }
        public string? Options { get; set; }
    }

    public class EditTaskDetailsDto
    {
        public int Id { get; set; }
        public string? CustomerId { get; set; }
        public string? CustomerName { get; set; }
        public string? ProjectId { get; set; }
        public string? ProjectName { get; set; }
        public int ProjectType { get; set; }
        public List<AssignedToDto>? AssignedTo { get; set; }
        public DateTime? AssignmentStartDate { get; set; }
        public DateTime? AssignmentEndDate { get; set; }
        public decimal? AssignmentPercent { get; set; }
        public string? BillingType { get; set; }
        public string? Remarks { get; set; }
        //public List<IFormFile>? TaskAttachment { get; set; }
        public string? Options { get; set; }
    }
}
