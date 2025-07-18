namespace backend.DtoModels
{
    public class SupportMetricsDto
    {
        public int Id { get; set; }
        public int TaskId { get; set; }
        public int TaskDetailsId { get; set; }
        public string SupportMetricsName { get; set; } = "";
    }
}
