namespace backend.DtoModels
{
    public class DevelopmentTaskDto
    {
        public int TaskId { get; set; }
        public int MetricsId { get; set; }
        public string? TaskName { get; set; }
        public string? CRNumber { get; set; }
        public string? Priority { get; set; }
        public DateTime? PlannedStartDate { get; set; }
        public DateTime? PlannedEndDate { get; set; }
        public int? PlannedDuration { get; set; }
        public DateTime? ActualStartDate { get; set; }
        public DateTime? ActualEndDate { get; set; }
        public int? ActualDuration { get; set; }
        public string? OnTimeDelivery { get; set; }
        public double? PlannedEffort { get; set; }
        public double? ActualEffort { get; set; }
        public int? NumberOfDefects { get; set; }
        public double? ReworkEffort { get; set; }
        public string? Status { get; set; }
        public string? Remarks { get; set; }
        public int? ExpectedCompletionMonth { get; set; }
        public string? TaskToBeCompletedThisMonth { get; set; }
    }
}
