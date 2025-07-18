namespace backend.DtoModels
{
    public class DevMetricsDto
    {
        public int Id { get; set; }

        public int TaskId {  get; set; }
        public int TaskDetailsId { get; set; }
        public string DevMetricsName { get; set; } = "";
    }
}
