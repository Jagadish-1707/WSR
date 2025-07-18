using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    [Table("Roles")]
    public class Roles
    {
        [Key]
        public int roleId { get; set; }
        public string roleName { get; set; } = "";

    }
}
