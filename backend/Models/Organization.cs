using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    [Table("Organization")]
    public class Organization:BaseModel
    {
        [Key]
        public int Id { get; set; }
        public string OrganizationId { get; set; }
        public string OrganizationName { get; set; }
        public string Address { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
    }
}
