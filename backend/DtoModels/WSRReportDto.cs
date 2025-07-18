using System.ComponentModel.DataAnnotations;

namespace backend.DtoModels
{
    public class WSRReportDto
    {
        public string Id { get; set; }
        public string WSRName { get; set; }
        public string? ProjectId { get; set; }
        public string? CustomerName { get; set; }
        public DateTime? ReportStartDate { get; set; }
        public DateTime? ReportEndDate { get; set; }
        public DateTime? CreatedOn { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime? UpdatedOn { get; set; }
        public string? UpdatedBy { get; set; }

    }

    public class WSRRequestModel
    {
        public WSRReportDto? WSRReportDto { get; set; }
        public WSRProjectDetailsDto? WSRProjectDetailsDto { get; set; }
        public WSRProjectStatusDto? WSRProjectStatusDto { get; set; }
        public List<WSRTaskDto>? WSRTaskDto { get; set; }
        public List<WSRIssuesDto>? WSRIssueDto { get; set; }
        public List<WSRKeyRisksDto>? WSRKeyRisksDto { get; set; }

    }
}
