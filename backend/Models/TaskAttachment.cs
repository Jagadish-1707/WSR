using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class TaskAttachment
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("TaskDetails")]
        public int TaskId { get; set; }
        public string? FileName { get; set; }
        public string? AttachmentUrl { get; set; }
    }
}
