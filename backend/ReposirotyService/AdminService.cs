using AutoMapper;
using backend.Common;
using backend.DtoModels;
using backend.Models;
using backend.RepositoryInterface;
using Microsoft.EntityFrameworkCore;

namespace backend.ReposirotyService
{
    public class AdminService:IAdminService
    {
        private readonly IConfiguration _configuration;
        private readonly UnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public AdminService(IConfiguration configuration, IMapper mapper)
        {
            _configuration = configuration;
            _unitOfWork = new UnitOfWork(configuration);
            _mapper = mapper;
        }

        public async Task<RoleDto> AddRoleAsync(AddRoleDto addRole)
        {
            
            try
            {
                int roleId = 0;

                Role role = new Role();

                using (var transaction = _unitOfWork.RoleRepository.Context.Database.BeginTransaction())
                {
                    role.RoleName = addRole.RoleName;
                        role.Remarks = addRole.Remarks;
                        role.StartDate = addRole.StartDate;
                        role.EndDate = addRole.EndDate;
                        role.Status = addRole.Status;
                        role.Active = true;
                        role.CreatedBy = addRole.UserId != 0 ? addRole.UserId.ToString() : null;
                        role.CreatedOn = DateTime.Now;

                        if (!string.IsNullOrEmpty(role.RoleName))
                        {
                            // Insert into Role table first
                            _unitOfWork.RoleRepository.Insert(role);
                            _unitOfWork.Save(); // Save to get Role.Id generated (primary key)

                            // Now create a new Roles entity
                            var rolesEntity = new Roles
                            {
                                roleId = role.Id, // use generated Id from Role
                                roleName = role.RoleName
                            };

                            // Insert into Roles table
                            _unitOfWork.RolesRepository.Insert(rolesEntity);
                            _unitOfWork.Save(); // Save Roles record

                            transaction.Commit();
                        }

                        roleId = role.Id; // Final output
                    }
                   
                if (roleId != 0)
                {
                    
                    return await GetRoleByIdAsync(roleId);
                    
                }
                else
                    return null;
            }
            catch (Exception e)
            {
                return null;
            }
            finally
            {
                
            }
        }

        public async Task<bool> DeleteRoleByIdAsync(int id, int userId)
        {
            try
            {
                var contextData = _unitOfWork.RoleRepository.Context;
                var role = _unitOfWork.RoleRepository.GetByID(id);
                if (role != null)
                {
                    using (var transaction = _unitOfWork.RoleRepository.Context.Database.BeginTransaction())
                    {
                        role.Active = false;
                        role.Status = 0;
                        role.ModifiedOn = DateTime.Now;
                        role.ModifiedBy = userId != 0 ? userId.ToString() : null;

                        _unitOfWork.RoleRepository.Update(role);
                        contextData.SaveChanges();
                        transaction.Commit();
                    }
                }
                return true;
            }
            catch (Exception e)
            {
                return false;
            }
        }

        public async Task<RoleDto> EditRoleAsync(EditRoleDto editRole)
        {
            try
            {
                var role = _unitOfWork.RoleRepository.GetNoTrackWithInclude(x => x.Id == editRole.Id).FirstOrDefault();
                if (role != null)
                {
                    using (var transaction = _unitOfWork.RoleRepository.Context.Database.BeginTransaction())
                    {
                        role.Id=editRole.Id;
                        role.RoleName = editRole.RoleName;
                        role.Remarks = editRole.Remarks;
                        role.StartDate = editRole.StartDate;
                        role.EndDate = editRole.EndDate;
                        role.Status = editRole.Status;
                        role.ModifiedBy = editRole.UserId != 0 ? editRole.UserId.ToString() : null;
                        role.ModifiedOn = DateTime.Now;

                        _unitOfWork.RoleRepository.Update(role);
                        _unitOfWork.Save();
                        transaction.Commit();
                    }
                    return await GetRoleByIdAsync(editRole.Id);
                }
                return null;
            }
            catch (Exception e)
            {
                return null;
            }
            finally
            {

            }
        }

        public async Task<List<Client>> GetClientListAsync()
        {
            try
            {
                var contextData = _unitOfWork.ClientRepository.Context;
                var client = await contextData.Client.Where(w => w.status.Equals(1)).Select(s => new Client
                {
                    client_id = s.client_id,
                    client_name = s.client_name,
                    status = s.status,
                    createdby = s.createdby,
                    createdon = s.createdon,
                    modifiedby = s.modifiedby,
                    modifiedon = s.modifiedon
                }).ToListAsync();
                if (client != null)
                {
                    return client;
                }
                else
                {
                    return null;
                }
            }
            catch (Exception e)
            {
                return null;
            }
        }

        public async Task<List<Projects>> GetProjectsListAsync(int clientid)
        {
            try
            {
                var contextData=_unitOfWork.ProjectsRepository.Context;
                //var projects = await contextData.Projects.Where(w => w.client_id.Equals(clientid)).Select(s => new Projects
                //{
                //    client_id = s.client_id,
                //    project_code = s.project_code,
                //    project_name = s.project_name,
                //    project_id = s.project_id,
                //    project_owner = s.project_owner,
                //    alias_name = s.alias_name,
                //    bu_id = s.bu_id,
                //    start_date = s.start_date,
                //    end_date = s.end_date,
                //    status = s.status,
                //    createdby = s.createdby,
                //    createdon = s.createdon,
                //    modifiedby = s.modifiedby,
                //    modifiedon = s.modifiedon,
                //    description = s.description
                //}).ToListAsync();
                //if (projects == null)
                //{
                //    return null;
                //}
                //else
                //{
                //    return projects;
                //}
            }
            catch (Exception e)
            {
                return null;
            }
            return null;
        }

        public async Task<RoleDto> GetRoleByIdAsync(int id)
        {
            try
            {
                var contextData = _unitOfWork.RoleRepository.Context;
                var assignRoleEntity = await contextData.Role.FirstOrDefaultAsync(w => w.Id == id);

                if (assignRoleEntity == null)
                {
                    return null;
                }

                var roleDto = _mapper.Map<RoleDto>(assignRoleEntity);
                return roleDto;
            }
            catch (Exception ex)
            {
                // Optionally log ex.ToString()
                return null;
            }
        }

        public async Task<List<RolesDto>> GetRolesAsync()
        {
            try
            {
                var contextData = _unitOfWork.RolesRepository.Context;

                var roles = await contextData.Roles
                    .Select(r => new RolesDto
                    {
                        roleId = r.roleId,  
                        roleName = r.roleName
                    })
                    .ToListAsync();

                return roles;
            }
            catch (Exception ex)
            {
               
                throw; // Rethrow the exception so the caller knows something went wrong
            }
        }

        public async Task<List<RoleDto>> GetRolesListAsync()
        {
            try
            {
                var contextData = _unitOfWork.RoleRepository.Context;
                var assignRole = await contextData.Role
                    .Where(w => w.Active == true)
                    .ToListAsync(); // Fetch the entities first

                if (assignRole == null || !assignRole.Any())
                {
                    return null;
                }

                var roleDtos = _mapper.Map<List<RoleDto>>(assignRole); // Map to DTOs
                return roleDtos;
            }
            catch (Exception ex)
            {
                // Optionally log ex.ToString()
                return null;
            }
        }

        public async Task<List<AssignRoleDto>> AddAssignRoleAsync(AddAssignRoleDto addAssignRole)
        {
            var assignedRoles = new List<AssignRoleDto>();

            using (var transaction = _unitOfWork.AssignRoleRepository.Context.Database.BeginTransaction())
            {
                try
                {
                    foreach (var emp in addAssignRole.Employees)
                    {
                        var existingRoles = _unitOfWork.AssignRoleRepository.GetAll()
                        .Where(r => r.EmployeeId == emp.EmployeeID && r.Active == true && r.Status == 1)
                        .ToList();

                        foreach (var existing in existingRoles)
                        {
                            existing.Active = false;
                            existing.Status =  0;
                            existing.ModifiedBy = addAssignRole.UserId.ToString();
                            existing.ModifiedOn = DateTime.Now;
                            _unitOfWork.AssignRoleRepository.Update(existing);
                        }
                        _unitOfWork.Save();

                        var role = new AssignRole
                        {
                            EmployeeId = emp.EmployeeID,
                            Employee = emp.EmployeeName,
                            Role = addAssignRole.Role,
                            RoleId = addAssignRole.RoleId,
                            Department = emp.Department,
                            Remarks = addAssignRole.Remarks,
                            StartDate = addAssignRole.StartDate,
                            EndDate = addAssignRole.EndDate,
                            Status = addAssignRole.Status,
                            Active = true,
                            CreatedBy = addAssignRole.UserId != 0 ? addAssignRole.UserId.ToString() : null,
                            CreatedOn = DateTime.Now
                        };

                        _unitOfWork.AssignRoleRepository.Insert(role);
                        _unitOfWork.Save();

                        var user = _unitOfWork.UsersRepository
                        .GetAll()
                        .FirstOrDefault(u => u.Employee_ID == emp.EmployeeID);

                        if (user != null && addAssignRole.RoleId.HasValue) // Assuming you're passing RoleId
                        {
                            user.RoleId = addAssignRole.RoleId;
                            user.Role = addAssignRole.Role;
                            user.Profile = addAssignRole.Role;
                            _unitOfWork.UsersRepository.Update(user);
                            _unitOfWork.Save();
                        }

                        var dto = await GetAssignRoleByIdAsync(role.Id);
                        if (dto != null)
                            assignedRoles.Add(dto);
                    }

                    transaction.Commit();
                    return assignedRoles;
                }
                catch (Exception)
                {
                    transaction.Rollback();
                    return null;
                }
            }
        }

        public async Task<List<AssignRoleDto>> GetAssignRoleByRoleIdAsync(int roleId)
        {
            try
            {
                var contextData = _unitOfWork.AssignRoleRepository.Context;
                var assignRoleEntity = await contextData.AssignRole
                    .Where(w => w.RoleId == roleId && w.Status == 1)
                    .ToListAsync(); 

                if (assignRoleEntity == null)
                {
                    return null;
                }

                var roleDto = _mapper.Map<List<AssignRoleDto>>(assignRoleEntity);
                return roleDto;
            }
            catch (Exception ex)
            {
                // Optionally log ex.ToString()
                return null;
            }
        }

        public async Task<AssignRoleDto> GetAssignRoleByIdAsync(int Id)
        {
            try
            {
                var contextData = _unitOfWork.AssignRoleRepository.Context;
                var assignRoleEntity = await contextData.AssignRole
                    .Where(w => w.Id == Id && w.Status == 1)
                    .FirstOrDefaultAsync();

                if (assignRoleEntity == null)
                {
                    return null;
                }

                var roleDto = _mapper.Map<AssignRoleDto>(assignRoleEntity);
                return roleDto;
            }
            catch (Exception ex)
            {
                // Optionally log ex.ToString()
                return null;
            }
        }

        public async Task<List<AssignRoleDto>> GetAssignRolesListAsync()
        {
            try
            {
                var contextData = _unitOfWork.AssignRoleRepository.Context;
                var assignRole = await contextData.AssignRole
                    .Where(w => w.Active == true)
                    .ToListAsync(); // Fetch the entities first

                if (assignRole == null || !assignRole.Any())
                {
                    return null;
                }

                var roleDtos = _mapper.Map<List<AssignRoleDto>>(assignRole); // Map to DTOs
                return roleDtos;
            }
            catch (Exception ex)
            {
                // Optionally log ex.ToString()
                return null;
            }
        }


        //public async Task<AssignRoleDto> EditAssignRoleAsync(EditAssignRoleDto editRole)
        //{
        //    try
        //    {
        //        var role = _unitOfWork.AssignRoleRepository.GetNoTrackWithInclude(x => x.Id == editRole.Id).FirstOrDefault();
        //        if (role != null)
        //        {
        //            using (var transaction = _unitOfWork.AssignRoleRepository.Context.Database.BeginTransaction())
        //            {
        //                role.Id = editRole.Id;
        //                role.Role = editRole.Role;
        //                role.Employee=editRole.Employee;
        //                role.EmployeeId=editRole.EmployeeID;
        //                role.Department=editRole.Department;
        //                role.Remarks = editRole.Remarks;
        //                role.StartDate = editRole.StartDate;
        //                role.EndDate = editRole.EndDate;
        //                role.Status = editRole.Status;
        //                role.ModifiedBy = editRole.UserId != 0 ? editRole.UserId.ToString() : null;
        //                role.ModifiedOn = DateTime.Now;

        //                _unitOfWork.AssignRoleRepository.Update(role);
        //                _unitOfWork.Save();
        //                transaction.Commit();
        //            }
        //            return (await GetAssignRoleByIdAsync(editRole.Id));
        //        }
        //        return null;
        //    }
        //    catch (Exception e)
        //    {
        //        return null;
        //    }
        //    finally
        //    {

        //    }
        //}

        public async Task<List<AssignRoleDto>> EditAssignRolesAsync(EditAssignRoleDto editAssignRole)
        {
            var updatedRoles = new List<AssignRoleDto>();

            using (var transaction = _unitOfWork.AssignRoleRepository.Context.Database.BeginTransaction())
            {
                try
                {
                    foreach (var emp in editAssignRole.Employees)
                    {
                        var existingRole = _unitOfWork.AssignRoleRepository
                            .GetAll()
                            .FirstOrDefault(r => r.EmployeeId == emp.EmployeeID && r.Active == true);

                        if (existingRole != null)
                        {
                            // Update existing role
                            existingRole.Employee = emp.EmployeeName;
                            existingRole.Role = editAssignRole.Role;
                            existingRole.RoleId = editAssignRole.RoleId;
                            existingRole.Department = emp.Department;
                            existingRole.Remarks = editAssignRole.Remarks;
                            existingRole.StartDate = editAssignRole.StartDate;
                            existingRole.EndDate = editAssignRole.EndDate;
                            existingRole.ModifiedBy = editAssignRole.UserId.ToString();
                            existingRole.ModifiedOn = DateTime.Now;
                            existingRole.Status = editAssignRole.Status;

                            _unitOfWork.AssignRoleRepository.Update(existingRole);
                            _unitOfWork.Save();
                        }
                        else
                        {
                            // Insert new role assignment
                            var newRole = new AssignRole
                            {
                                EmployeeId = emp.EmployeeID,
                                Employee = emp.EmployeeName,
                                Role = editAssignRole.Role,
                                RoleId = editAssignRole.RoleId,
                                Department = emp.Department,
                                Remarks = editAssignRole.Remarks,
                                StartDate = editAssignRole.StartDate,
                                EndDate = editAssignRole.EndDate,
                                CreatedBy = editAssignRole.UserId.ToString(),
                                CreatedOn = DateTime.Now,
                                Active = true,
                                Status = editAssignRole.Status
                            };

                            _unitOfWork.AssignRoleRepository.Insert(newRole);
                            _unitOfWork.Save();

                            existingRole = newRole; // So it can be used below to get DTO
                        }

                        // Update user if necessary
                        var user = _unitOfWork.UsersRepository
                            .GetAll()
                            .FirstOrDefault(u => u.Employee_ID == emp.EmployeeID);

                        if (user != null && editAssignRole.RoleId.HasValue)
                        {
                            user.RoleId = editAssignRole.RoleId;
                            user.Role = editAssignRole.Role;
                            user.Profile = editAssignRole.Role;
                            _unitOfWork.UsersRepository.Update(user);
                            _unitOfWork.Save();
                        }

                        var dto = await GetAssignRoleByIdAsync(existingRole.Id);
                        if (dto != null)
                            updatedRoles.Add(dto);
                    }

                    transaction.Commit();
                    return updatedRoles;
                }
                catch (Exception)
                {
                    transaction.Rollback();
                    return null;
                }
            }
        }


        public async Task<bool> DeleteAssignRoleByIdAsync(int id, int userId)
        {
            try
            {
                var contextData = _unitOfWork.AssignRoleRepository.Context;
                var role = _unitOfWork.AssignRoleRepository.GetByID(id);
                if (role != null)
                {
                    using (var transaction = _unitOfWork.AssignRoleRepository.Context.Database.BeginTransaction())
                    {
                        role.Active = false;
                        role.Status = 0;
                        role.ModifiedOn = DateTime.Now;
                        role.ModifiedBy = userId != 0 ? userId.ToString() : null;

                        _unitOfWork.AssignRoleRepository.Update(role);
                        contextData.SaveChanges();
                        transaction.Commit();
                    }
                }
                return true;
            }
            catch (Exception e)
            {
                return false;
            }
        }

        public async Task<List<DepartmentDto>> GetDepartmentsAsync()
        {
            try
            {
                var contextData = _unitOfWork.DepartmentsRepository.Context;

                var departments = await contextData.Departments
                    .Select(r => new DepartmentDto
                    {
                        departmentId = r.departmentId,
                        departmentName = r.departmentName,
                    })
                    .ToListAsync();

                return departments;
            }
            catch (Exception ex)
            {

                throw; // Rethrow the exception so the caller knows something went wrong
            }
        }

    }
}
