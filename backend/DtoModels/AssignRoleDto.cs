using backend.Models;

namespace backend.DtoModels
{
    public class AssignRoleDto : BaseModel
    {

        public int Id { get; set; }
        public string Role { get; set; } = "";
        public int? RoleId { get; set; }
        public string EmployeeId { get; set; } = "";
        public string Employee {  get; set; } = "";
        public string Department {  get; set; } = "";
        public string Remarks { get; set; } = "";
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }


    }

    public class AddAssignRoleDto
    {
        
        public string Role { get; set; } = "";
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string Remarks { get; set; } = "";
        public int UserId { get; set; }
        public int? RoleId { get; set; }
        public int Status { get; set; }
        public List<EmployeeDto> Employees { get; set; } = new List<EmployeeDto>();
    }

    public class EmployeeDto
    {
        public string EmployeeID { get; set; } = "";
        public string EmployeeName { get; set; } = "";
        public string Department { get; set; } = "";
    }


    public class EditAssignRoleDto
    {
        public string Role { get; set; } = "";
        
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string Remarks { get; set; } = "";
        public int UserId { get; set; }
        public int? RoleId { get; set; }
        public int Status { get; set; }
        public List<EmployeeDto> Employees { get; set; } = new List<EmployeeDto>();
    }
}
