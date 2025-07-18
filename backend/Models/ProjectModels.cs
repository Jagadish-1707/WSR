namespace backend.Models
{
    public class ProjectModels
    {
        public int Id { get; set; }
        public string ModelName { get; set; } = string.Empty;
        public DateTime? CreatedOn { get; set; }
        public string? CreatedBy { get; set; }
        public bool? Active { get; set; }
    }
}
