using backend.Models;

namespace backend.DtoModels
{
    public class TaskMetricsDto
    {
        public int Id { get; set; }
        public int TaskId { get; set; }
        public int MetricsId { get; set; }
        public string? MetricsName { get; set; }
    }

    public class AddTaskMetricsDto
    {
        public int TaskId { get; set; }
        public List<int> MetricsIds { get; set; } // List of selected metrics ids
    }

    public class EditTaskMetricsDto
    {
        public int TaskId { get; set; }
        public List<int> MetricsIds { get; set; } // List of MetricIds for editing
    }
}
