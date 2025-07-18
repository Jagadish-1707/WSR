namespace backend.DtoModels
{
    public class ProjectAttachmentDto
    {
        public int? Id { get; set; }
        public string? FileName { get; set; }
        public string? AttachmentUrl { get; set; }
        public int? ProjectDetailsId { get; set; }

    }
}
