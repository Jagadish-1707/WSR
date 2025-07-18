using backend.DtoModels;


namespace backend.RepositoryInterface
{
    public interface IMetricsService
    {
        Task<List<MetricsDto>> GetAllMetricsData();
        Task<MetricsDto> GetMetricsDataById(int metricsDataId);
        Task<MetricsDto> SaveMetrics(AddMetricsDetailsDto dto);
        Task<MetricsDto> UpdateMetrics(EditMetricsDetailsDto dto);
        Task<bool> DeleteMetrics(int metricsDataId);
        Task<List<ProjectTypeMasterDto>> GetProjectTypeByProjectId(string projectId);
        Task<List<AssignedToDto>> GetMetricsAssignedEmployee(string projectId);

        /*Task<MetricsDetailsDto> AddMetricsAsync(AddMetricsDetailsDto addMetricsDtoList);
        Task<List<MetricsDetailsDto>> GetAllMetricsDetails();
        Task<MetricsDetailsDto> GetMetricsDetailsById(int id);
        //Task<EditMetricsDetailsDto> EditMetricsDetails(EditMetricsDetailsDto editMetricsDto);
        Task<MetricsDetailsDto> EditMetricsDetails(EditMetricsDetailsDto editMetricsDetailsDto);
        Task<bool> CheckMetricsExistence(int customerId, int projectId, DateTime weekStartDate, DateTime weekEndDate);
        Task<List<GroupedUserDataDto>> ChartForTicketColsed(int customerId, int ProjectId, string projectType);

        Task<List<GroupedUserDataComplexDto>> ChartForTicketColsedComplexity(int customerId, int ProjectId, string projectType);*/

    }
}
