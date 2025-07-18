using backend.DtoModels;

namespace backend.RepositoryInterface
{
    public interface IPriorityService
    {
         Task<PriorityDto> AddPriorityAsync(AddPriorityDto addPriority);
         Task<PriorityDto> EditPriorityAsync(EditPriorityDto editPriority);
         Task<List<PriorityDto>> GetPriorityListAsync();
         Task<PriorityDto> GetPriorityByIdAsync(int Id);
        Task<List<PriorityDto>> GetMetricsPriorityList();
    }
}
