using Org.BouncyCastle.Bcpg.OpenPgp;

namespace backend.DtoModels
{
    public class AssignedToDto
    {
        public int AssignedToId { get; set; }
        public int TaskDetailsId { get; set; }
        public int userId { get; set; }
        public string UserName { get; set; } = "";
        public string? EmployeeName { get; set; }
        public string? EmployeeId { get; set; }
        public string? Department { get; set;}
        public string? EmployeeId_Name { get; set; }

    }
}
