using System.Collections.Generic;
using System.Threading.Tasks;
using backend.DtoModels;

namespace backend.RepositoryInterface
{
    public interface IMasterService
    {
        //Project Type
        Task<ProjectTypeMasterDto> AddProjectTypeMasterAsync(AddProjectTypeMasterDto addProjectTypeMasterDto);
        Task<ProjectTypeMasterDto> EditProjectTypeMasterAsync(EditProjectTypeMasterDto editProjectTypeMasterDto);
        Task<List<ProjectTypeMasterDto>> GetProjectTypeMasterListAsync();
        Task<ProjectTypeMasterDto> GetProjectTypeMasterByIdAsync(int id);

        //Ticket type
        Task<TickettypeDto> AddTicketTypeAsync(AddTickettypeDto addPriority);
        Task<TickettypeDto> EditTicketTypeAsync(EditTickettypeDto editPriority);
        Task<TickettypeDto> GetTicketTypeById(int id);
        Task<List<TickettypeDto>> GetTicketTypeList();


        //Metrics Master
        Task<MetricsMasterDto> AddMetricsMasterAsync(AddMetricsMasterDto addMetricsMasterDto);
        Task<MetricsMasterDto> EditMetricsMasterAsync(EditMetricsMasterDto editMetricsMasterDto);
        Task<List<MetricsMasterDto>> GetMetricsMasterListAsync();
        Task<MetricsMasterDto> GetMetricsMasterByIdAsync(int id);

        //General Metrics Master

        Task<GeneralMetricsMasterDto> AddGeneralMetricsMasterAsync(AddGeneralMetricsMasterDto addGeneralMetricsMasterDto);
        Task<GeneralMetricsMasterDto> EditGeneralMetricsMasterAsync(EditGeneralMetricsMasterDto editGeneralMetricsMasterDto);
        Task<List<GeneralMetricsMasterDto>> GetGeneralMetricsMasterListAsync();
        Task<GeneralMetricsMasterDto > GetGeneralMetricsMasterByIdAsync(int id);
        Task<List<MetricsMasterDto>> GetAllMetricsMasterListAsync();
    }
}
