using backend.DtoModels;

namespace backend.RepositoryInterface
{
    public interface IWSRReportService
    {
        Task<(bool Success, string Message, string ReportId)> AddWSRReportAsync(WSRReportDto wsrReportDto, WSRProjectDetailsDto detailDto, WSRProjectStatusDto statusDto, List<WSRTaskDto> taskDto, List<WSRIssuesDto> issuesDto, List<WSRKeyRisksDto> risksDto);
        Task<(bool Success, string Message, List<WSRRequestModel> Data)> GetFilteredWSRReportsAsync(string? projectId, int month, int year);
        Task<(bool Success, string Message, WSRRequestModel Data)> GetReportByIdAsync(string wsrId);
        Task<(bool Success, string Message, List<WSRRequestModel> Data)> GetMultipleReportsByIdsAsync(List<string> wsrReportsIds);
        Task<(bool Success, string Message)> UpdateWSRReportAsync(string wsrId, WSRReportDto reportDto, WSRProjectDetailsDto detailDto, WSRProjectStatusDto statusDto, List<WSRTaskDto> taskDto, List<WSRIssuesDto> issuesDto, List<WSRKeyRisksDto> risksDto);

    }
}
