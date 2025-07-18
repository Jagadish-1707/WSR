using backend.DtoModels;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    [Table("MetricsDetails")]
    public class MetricsDetails
    {
        [Key]
        public int Id { get; set; }
        public string? CustomerId { get; set; }
        public string? ProjectId { get; set; }
        public int? ProjectTypeId { get; set; }
        public DateTime? MonthYear { get; set; }
        public DateTime? WeekStartDate { get; set; }
        public DateTime? WeekEndDate { get; set; }
        public DateTime? CreatedOn { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public string? ModifiedBy { get; set; }
        public ICollection<MetricsDetailsFieldValues> MetricsFieldValues { get; set; }
    }

    // Models/MetricsFieldValue.cs
    public class MetricsDetailsFieldValues
    {
        public int Id { get; set; }
        public int? MetricsDetailsId { get; set; }
        public int FieldColumnId { get; set; }
        public string FieldValue { get; set; }
        public int? RowNumber { get; set; }
        public MetricsDetails MetricsData { get; set; }
    }
}
