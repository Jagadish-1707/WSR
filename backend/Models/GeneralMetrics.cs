using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class GeneralMetrics
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("TaskDetails")] 
        public int TaskId { get; set; }

        public int TaskDetailsId { get; set; }


        public string? GeneralMetricsName { get; set; }

    }
}
