using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    [Table("Departments")]
    public class Departments
    {
        [Key]
        public int departmentId { get; set; }
        public string departmentName { get; set; } = "";
    }
}
