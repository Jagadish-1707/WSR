using backend.Models;

namespace backend.DtoModels
{
    public class ContractorDetailsDto
    {
        public string? Consultant_Id { get; set; }
        public string? Consultant_First_Name { get; set; }
        public string? Consultant_Last_Name { get; set; }
        public string? Consultant_Start_Date { get; set; }
        public string? Consultant_End_Date { get; set; }
        public string? Client_Name { get; set; }
        public string? Project_Name { get; set; }
        public string? Consultant_email { get; set; }

    }

    public class Contractor
    {
        public string? ContractorId_Name { get; set; }
        public string? EndDate { get; set; }
    }

    public class ContractorClient
    {
        public string? ClientName { get; set; }
    }

    public class ContractorProject
    {
        public string? ProjectName { get; set; }
    }
}

