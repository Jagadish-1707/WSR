using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    [Table("Metricsprojectfield")]
    public class MetricProjectColumns
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string FieldName { get; set; }
        [Required]
        public string FieldType { get; set; }
        public int Status { get; set; }
        public bool Active { get; set; }
        public string? IsMandatory { get; set; }
        public DateTime? CreatedOn { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public string? Editable { get; set; }
        public string? DropdownValues { get; set; }
        public int OrderBy { get; set; } = 0;
    }

    [Table("MetricsProjecttypeColumnSelection")]
    public class ProjectTypeMetricSelection
    {
        public int Id { get; set; }
        [Required]
        public int ProjectId { get; set; }
        [Required]
        public int ProjectTypeId { get; set; }
        public DateTime? CreatedOn { get; set; }
        //public bool Active { get; set; }
        public DateTime? ModifiedOn { get; set; }
        [Required]
        public ICollection<SelectionCheckBoxOption> CheckBoxOptions { get; set; }
    }

    [Table("MetricsProjectSelectedColumns")]
    public class SelectionCheckBoxOption
    {
        public int Id { get; set; }
        [Required]
        public int ProjectTypeMetricSelectionId { get; set; }
        [Required]
        public int MetricsId { get; set; }
        [Required]
        public int FieldColumnId { get; set; }
        public bool IsMandatory { get; set; }
        public ProjectTypeMetricSelection ProjectTypeMetricSelection { get; set; }
    }
}
