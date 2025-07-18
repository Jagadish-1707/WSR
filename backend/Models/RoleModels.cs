namespace backend.Models
{
    public class RoleModels
    {
            public int Id { get; set; }
            public int RoleId { get; set; }
            public string ModelName { get; set; } = string.Empty;
            public DateTime? CreatedOn { get; set; }
            public string? CreatedBy { get; set; }
            public Role? Role { get; set; }
        
    }
}
