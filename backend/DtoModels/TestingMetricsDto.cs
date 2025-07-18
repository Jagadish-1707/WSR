namespace backend.DtoModels
{
    public class TestingMetricsDto
    {
        public int Id { get; set; }
        public int TaskDetailsId { get; set; }
        public int TaskId { get; set; }
        public string TestingMetricsName { get; set; } = "";
    }
}
