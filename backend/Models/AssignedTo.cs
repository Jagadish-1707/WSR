using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class AssignedTo
    {
        [Key]
        public int AssignedToId { get; set;}

        [ForeignKey("TaskDetails")]
        public int TaskDetailsId { get; set; }
        public int userId { get; set; }
        public string UserName { get; set; }
    }
}
