namespace backend.DtoModels
{
    public class ZohoProjectDto
    {
        public string projectName { get; set; }
        public string projectId { get; set; }
        public decimal? projectCost { get; set; }
        public string clientId { get; set; }
        public string clientName { get; set; }
        public string projectStatus { get; set; }
        public string ownerId { get; set; }
        public string ownerName { get; set; }
        public bool isDeleteAllowed { get; set; }
        public int? jobCount { get; set; }
        public int? projectUsersCount { get; set; }
        public ProjectHead projectHead { get; set; }
        public List<ProjectUser> projectManagers { get; set; }
        public List<ProjectUser> projectUsers { get; set; }
    }

    public class ProjectHead
    {
        public string empId { get; set; }
        public string erecno { get; set; }
        public decimal rate { get; set; }
        public string name { get; set; }
    }

    public class ProjectUser
    {
        public string empId { get; set; }
        public string erecno { get; set; }
        public decimal rate { get; set; }
        public string name { get; set; }
    }

    public class ZohoProjectApiResponse
    {
        public ZohoProjectResponse response { get; set; }
    }

    public class ZohoProjectResponse
    {
        public List<ZohoProjectDto> result { get; set; }
        public string message { get; set; }
        public string uri { get; set; }
        public int status { get; set; }
        public bool? isNextAvailable { get; set; }
    }


}
