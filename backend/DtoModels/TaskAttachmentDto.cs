namespace backend.DtoModels
{
    public class TaskAttachmentDto
    {
        public int Id { get; set; }
        public int TaskDetailsId { get; set; }
        public string? FileName { get; set; }
        public string? AttachmentUrl { get; set; }
    }
}
