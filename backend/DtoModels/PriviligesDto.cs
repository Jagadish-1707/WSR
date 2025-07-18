using backend.Models;

namespace backend.DtoModels
{
    public class PriviligesDto:BaseModel
    {
        public int Id { get; set; }
        public string ModelName { get; set; }
        public int RoleId { get; set; }
        public bool AddPriviliges { get; set; }
        public bool ViewPriviliges { get; set; }
        public bool EditPriviliges { get; set; }
        public bool DeletePriviliges { get; set; }
    }

    public class AddPriviligesDto
    {
        public string ModelName { get; set; }
        public int RoleId { get; set; }
        public bool AddPriviliges { get; set; }
        public bool ViewPriviliges { get; set; }
        public bool EditPriviliges { get; set; }
        public bool DeletePriviliges { get; set; }
        public int UserId { get; set; }
    }

    public class EditPriviligesDto
    {
        public int Id { get; set; }
        public string ModelName { get; set; }
        public int RoleId { get; set; }
        public bool AddPriviliges { get; set; }
        public bool ViewPriviliges { get; set; }
        public bool EditPriviliges { get; set; }
        public bool DeletePriviliges { get; set; }
        public int UserId { get; set; }
        public int Status { get; set; }
    }
}
