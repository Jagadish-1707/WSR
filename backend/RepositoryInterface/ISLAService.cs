using backend.DtoModels;
using backend.Models;

namespace backend.RepositoryInterface
{
    public interface ISLAService
    {
        Task<SLADto> AddSLA(AddSLADto addSLA);
        List<SLA> GetAllSLA();
        List<SLA> GetSLAMetricsList();
        Task<SLADto> GetSLADetailsByIdAsync(long id);
        Task<SLADto> EditSLADetailsAsync(SLADto editSLADetails);
        List<ResponseSLA> GetAllResponseSLA();
        List<ResponseSLA> GetSLAResponseMetricsList();
        Task<ResponseSLADto> AddResponseSLA(AddResponseSLADto addSLA);
        Task<ResponseSLADto> EditResponseSLA(EditResponseSLADto editSLADetails);
        Task<ResponseSLADto> GetResponseSLADetailsByIdAsync(long id);

    }
    
}
