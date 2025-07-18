using System.Collections.Generic;
using System.Threading.Tasks;
using backend.DtoModels;
using backend.Models;

namespace backend.RepositoryInterface
{
    public interface IProjectDetailsService
    {
        Task<ProjectDetailsDto> AddProjectDetailsAsync(AddProjectDetailsDto addProjectDetailsDto);
        Task<ProjectDetailsDto> EditProjectDetailsAsync(EditProjectDetailsDto editProjectDetailsDto);
        Task<ProjectDetailsDto> GetProjectDetailsByIdAsync(int Id);
        Task<List<ProjectDetails>> GetProjectDetailsList();
        Task<List<ProjectDetailsDto>> GetProjectDetailsListAsync();
        Task<bool> DeleteProjectDetailsByIdAsync(int Id, int userId);
        //Project Engagement Mode
        Task<ProjectEngagementModeDto> AddEngagmentModeAsync(AddEngagementModeDto addMode);
        Task<ProjectEngagementModeDto> EditEngagementModeAsync(EditEngagementModeDto editMode);
        Task<List<ProjectEngagementModeDto>> GetAllEngagementModeAsync();
        Task<ProjectEngagementModeDto> GetEngagmentModeByIdAsync(int id);
    }
}
