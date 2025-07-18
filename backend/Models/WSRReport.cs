namespace backend.Models
{
    public class WSRReport
    {
        public string Id { get; set; }
        public string WSRName { get; set; }
        public string? ProjectId { get; set; }
        public DateTime? ReportStartDate { get; set; }
        public DateTime? ReportEndDate { get; set; }
        public DateTime? CreatedOn { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime? UpdatedOn { get; set; }
        public string? UpdatedBy { get; set; }
    }
}
