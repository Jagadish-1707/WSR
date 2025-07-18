using backend.Common;
using backend.DtoModels;
using backend.Models;
using backend.RepositoryInterface;
using Microsoft.EntityFrameworkCore;
using System;

namespace backend.RepositoryService
{
    public class RoleModelRepository : IRoleModelRepository
    {
        private readonly IConfiguration _configuration;
        private readonly UnitOfWork _unitOfWork;

        public RoleModelRepository(IConfiguration configuration)
        {
            _configuration = configuration;
            _unitOfWork = new UnitOfWork(configuration);
        }

        // Get list of models for a given RoleId
        public async Task<IEnumerable<RoleModelsDto>> GetModelsByRoleIdAsync(int roleId)
        {
            try
            {

                return await _unitOfWork.RoleModelsRepository.Context.RoleModels
                    .Where(rm => rm.RoleId == roleId)
                    .Select(rm => new RoleModelsDto
                    {
                        Id = rm.Id,
                        RoleId = rm.RoleId,
                        ModelName = rm.ModelName,
                        CreatedOn = rm.CreatedOn,
                        CreatedBy = rm.CreatedBy
                    })
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        // Add multiple role models (bulk insert)
        //public async Task AddRoleModelsAsync(AddRoleModelsDto dto)
        //{
        //    var existingModels = _unitOfWork.RoleModelsRepository.Context.RoleModels
        //    .Where(rm => rm.RoleId == dto.RoleId);

        //    _unitOfWork.RoleModelsRepository.Context.RoleModels.RemoveRange(existingModels);

        //    var entities = dto.ModelNames.Select(modelName => new RoleModels
        //    {
        //        RoleId = dto.RoleId,
        //        ModelName = modelName,
        //        CreatedOn = DateTime.UtcNow,
        //        CreatedBy = dto.CreatedBy
        //    });

        //    _unitOfWork.RoleModelsRepository.Context.RoleModels.AddRange(entities);
        //    _unitOfWork.Save();
        //}

        public async Task AddRoleModelsAsync(AddRoleModelsDto dto)
        {
            var context = _unitOfWork.RoleModelsRepository.Context;

            // Check if models already exist for the RoleId
            var existingModels = context.RoleModels.Where(rm => rm.RoleId == dto.RoleId).ToList();

            if (existingModels.Any())
            {
                // Remove existing ones
                context.RoleModels.RemoveRange(existingModels);
            }

            // Add new ones
            var newModels = dto.ModelNames.Select(modelName => new RoleModels
            {
                RoleId = dto.RoleId,
                ModelName = modelName,
                CreatedOn = DateTime.UtcNow,
                CreatedBy = dto.CreatedBy
            });

            context.RoleModels.AddRange(newModels);

            _unitOfWork.Save();
        }


        public async Task<List<string>> GetModelNamesByRoleNameAsync(string roleName)
        {
            var role = await _unitOfWork.RoleModelsRepository.Context.RoleModels.FirstOrDefaultAsync(r => r.ModelName == roleName);

            if (role == null)
                return new List<string>();

            return await _unitOfWork.RoleModelsRepository.Context.RoleModels
                .Where(rm => rm.RoleId == role.Id)
                .Select(rm => rm.ModelName)
                .ToListAsync();
        }

        public async Task<IEnumerable<ProjectModelsDto>> GetModelsAsync()
        {
            try
            {
                return await _unitOfWork.RoleModelsRepository.Context.ProjectModels
                    .Select(pm => new ProjectModelsDto
                    {
                        Id = pm.Id,
                        ModelName = pm.ModelName,
                        Active = pm.Active
                    })
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                return Enumerable.Empty<ProjectModelsDto>();
            }
        }

    }
}
