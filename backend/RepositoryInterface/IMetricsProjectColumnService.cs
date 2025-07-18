using backend.DtoModels;

namespace backend.RepositoryInterface
{
    public interface IMetricsProjectColumnService
    {
        Task<MetricProjectColumnsDto> AddMetricProjectColumns(AddMetricProjectColumnsDto addMetricProjectColumnsDto);
        Task<List<MetricProjectColumnsDto>> GetAllMetricProjectColumns();
        Task<MetricProjectColumnsDto> GetMetricProjectColumnsById(int id);
        Task<MetricProjectColumnsDto> EditMetricProjectColumns(EditMetricProjectColumnsDto editMetricProjectColumnsDto);
        Task<SelectionDto> SaveSelection(SelectionDto model);
        Task<SelectionDto> GetSelection(int id);
        Task<List<SelectionDto>> GetAllMetricProjectColumnsSelected();
        Task<bool> CheckDuplicate(int projectId);
        Task<List<ProjectMetricsDto>> GetTaskMetricsByProjectId(int projectId);
        Task<SelectedProjectFieldsDto> GetMetricsGridColumSelected(string Projectid);
    }
}
