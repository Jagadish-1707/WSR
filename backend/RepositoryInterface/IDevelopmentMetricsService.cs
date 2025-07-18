using backend.DtoModels;

namespace backend.RepositoryInterface
{
    public interface IDevelopmentMetricsService
    {
        Task<List<DevelopmentMetricsDto>> GetAllDevMetricsDetails();
        Task<DevelopmentMetricsDto> AddDevelopmentMetricsAsync(AddDevelopmentMetricsDto addDevelopmentMetricsDto);
        Task<DevelopmentMetricsDto> EditDevMetricsDetails(EditDevelopmentMetricsDto editDevMetricsDetailsDto);
        Task<DevelopmentMetricsDto> GetDevMetricsDetailsById(int id);
    }
}
