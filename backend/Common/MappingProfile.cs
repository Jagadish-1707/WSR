using AutoMapper;
using backend.DtoModels;
using backend.Models;

namespace backend.Common
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<AssignRole, AssignRoleDto>();
            CreateMap<Role, RoleDto>();
        }
    }
}
