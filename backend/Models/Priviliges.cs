using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class Priviliges:BaseModel
    {
        [Key]
        public int Id { get; set; }
        public string ModelName { get; set; }
        public int RoleId { get; set; }
        public bool AddPriviliges { get; set; }
        public bool ViewPriviliges { get; set; }
        public bool EditPriviliges { get; set; }
        public bool DeletePriviliges { get; set; }
    }
}
