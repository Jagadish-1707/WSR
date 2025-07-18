namespace backend.DtoModels
{
    public class RoleModelsDto
    {
        public int Id { get; set; }
        public int RoleId { get; set; }
        public string ModelName { get; set; } = string.Empty;
        public DateTime? CreatedOn { get; set; }
        public string? CreatedBy { get; set; }
    }
    public class AddRoleModelsDto
    {
        public int RoleId { get; set; }
        public List<string> ModelNames { get; set; } = new();
        public string? CreatedBy { get; set; }
    }
    public class ProjectModelsDto
    { 
        public int Id { get; set; }
        public string ModelName { get; set; }
        public bool? Active { get; set; }
    }
}
