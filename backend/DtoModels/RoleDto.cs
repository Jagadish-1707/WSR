using backend.Models;

namespace backend.DtoModels
{
    public class RoleDto:BaseModel
    {
        public int Id { get; set; }
        public string RoleName { get; set; } = "";
        public string Remarks { get; set; } = "";
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }

    }

    public class AddRoleDto
    {
        public string RoleName { get; set; } = "";
        public string Remarks { get; set; } = "";
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public int UserId { get; set; }
        public int Status { get; set; }
    }

    public class EditRoleDto
    {
        public int Id { get; set; }
        public string RoleName { get; set; } = "";
        public string Remarks { get; set; } = "";
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public int UserId { get; set; }
        public int Status { get; set; }
    }

    public class RolesDto
    {
        public int roleId { get; set; }
        public string roleName { get; set; } = "";
    }

    public class DepartmentDto
    {
        public int departmentId { get; set; }
        public string departmentName { get; set; } = "";
    }
}
