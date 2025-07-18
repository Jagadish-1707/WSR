using backend.Models;

namespace backend.DtoModels
{
    public class DevelopmentMetricsDto :BaseModel
    {
        public int Id { get; set; }
        public int? CustomerId { get; set; }
        public string? CustomerName { get; set; }
        public int? ProjectId { get; set; }
        public string? ProjectName { get; set; }
        public string? ProjectType { get; set; }
        public DateTime? MonthYear { get; set; }
        public DateTime? WeekStartDate { get; set; }
        public DateTime? WeekEndDate { get; set; }
        public string FlagType { get; set; }
        public List<DevelopmentTaskDto>? DevelopmentTasks { get; set; }
    }
    
    public class AddDevelopmentMetricsDto
    {
        public int? CustomerId { get; set; }
        public string? CustomerName { get; set; }
        public int? ProjectId { get; set; }
        public string? ProjectName { get; set; }
        public string? ProjectType { get; set; }
        public DateTime? MonthYear { get; set; }
        public DateTime? WeekStartDate { get; set; }
        public DateTime? WeekEndDate { get; set; }
        public List<DevelopmentTaskDto>? DevelopmentTasks { get; set; }
    }

    public class EditDevelopmentMetricsDto
    {
        public int Id { get; set; }
        public int? CustomerId { get; set; }
        public string? CustomerName { get; set; }
        public int? ProjectId { get; set; }
        public string? ProjectName { get; set; }
        public string? ProjectType { get; set; }
        public DateTime? MonthYear { get; set; }
        public DateTime? WeekStartDate { get; set; }
        public DateTime? WeekEndDate { get; set; }
        public List<DevelopmentTaskDto>? DevelopmentTasks { get; set; }
    }
}
