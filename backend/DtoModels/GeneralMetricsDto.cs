namespace backend.DtoModels
{
    public class GeneralMetricsDto
    {
        public int Id { get; set; }
        public int TaskId { get; set; }
        public int TaskDetailsId { get; set; }
        public string GeneralMetricsName { get; set; } = "";
    }
}
