using System.Collections.Generic;
using System.Threading.Tasks;
using backend.DtoModels;

namespace backend.RepositoryInterface
{
    public interface IComplexityService
    {
        Task<ComplexityDto> AddComplexityAsync(AddComplexityDto addComplexity);
        Task<ComplexityDto> EditComplexityAsync(EditComplexityDto editComplexity);
        Task<List<ComplexityDto>> GetComplexityListAsync();
        Task<ComplexityDto> GetComplexityByIdAsync(int roleId);
    }
}

