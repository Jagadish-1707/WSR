using backend.Models;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace backend.DtoModels
{
    public class WSRProjectDetailsDto
    {
            [Key]
            public int Id { get; set; }
            public string? ProjectId { get; set; }
            public string? WSRId { get; set; }
            public string? ManagerName { get; set; }
            public int? TeamSize { get; set; }
            public string? Technology { get; set; }
            public string? CustomerLocation { get; set; }
            public string? BusinessDomain { get; set; }
            public string? ProjectType { get; set; }
            public List<ResourceDto>? Resources { get; set; }
            public DateTime? CreatedOn { get; set; }
            public string? CreatedBy { get; set; }
            public DateTime? UpdatedOn { get; set; }
            public string? UpdatedBy { get; set; }
            public DateTime? ProjectStartDate { get; set; }
            public DateTime? ProjectEndDate { get; set; }
            public string? ProjectDescription { get; set; }

    }

    public class ResourceDto
    {
        public int ZohoEmp_Id { get; set; }
        public string Emp_Name { get; set; }
        public int Rating { get; set; }
    }

}

