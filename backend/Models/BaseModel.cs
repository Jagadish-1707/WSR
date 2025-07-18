namespace backend.Models
{
    public class BaseModel
    {
        public bool Active { get; set; }
        public int? Status { get; set; }
        public DateTime? CreatedOn { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public string? ModifiedBy { get; set; }
    }
}
