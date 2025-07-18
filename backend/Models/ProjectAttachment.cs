using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace backend.Models
{
    [Table("ProjectAttachment")]
    public class ProjectAttachment
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("ProjectDetails")]
        public int ProjectDetailsId { get; set; }
        public string? FileName { get; set; }   
        public string? AttachmentUrl { get; set; }

    }
}
