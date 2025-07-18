using backend.Common;
using backend.Models;
using Newtonsoft.Json;

namespace backend.DtoModels
{
    public class SLADto :BaseModel
    {
        public long SLAId { get; set; }
        public string CustomerId { get; set; }
        public string CustomerName { get; set; }
        public string ProjectId { get; set; }
        public string ProjectName { get; set; }
        public string Priority { get; set; }
        public double SLAHours { get; set; }
        public string? Remarks { get; set; }
    }
    public class AddSLADto
    {
        public string CustomerId { get; set; }
        public string CustomerName { get; set; }
        public string ProjectId { get; set; }
        public string ProjectName { get; set; }
        public string Priority { get; set; }
        public double SLAHours { get; set; }
        public string? Remarks { get; set; }
        public int Status { get; set; }
    }
    public class EditSLADto
    {
        public long SLAId { get; set; }
        public string CustomerId { get; set; }
        public string CustomerName { get; set; }
        public string ProjectId { get; set; }
        public string ProjectName { get; set; }
        public string Priority { get; set; }
        public double SLAHours { get; set; }
        public int Status { get; set; }
        public string? Remarks { get; set; }
    }

    //Response SLA
    public class ResponseSLADto : BaseModel
    {
        public long Id { get; set; }
        public string CustomerId { get; set; }
        public string CustomerName { get; set; }
        public string ProjectId { get; set; }
        public string ProjectName { get; set; }
        public int PriorityId { get; set; }
        public double SLAHours { get; set; }
        public string? Remarks { get; set; }
    }
    public class AddResponseSLADto
    {
        public string CustomerId { get; set; }
        public string CustomerName { get; set; }
        public string ProjectId { get; set; }
        public string ProjectName { get; set; }
        public int PriorityId { get; set; }
        public double SLAHours { get; set; }
        public string? Remarks { get; set; }
        public int Status { get; set; }
    }
    public class EditResponseSLADto
    {
        public long Id { get; set; }
        public string CustomerId { get; set; }
        public string CustomerName { get; set; }
        public string ProjectId { get; set; }
        public string ProjectName { get; set; }
        public int PriorityId { get; set; }
        public double SLAHours { get; set; }
        public int Status { get; set; }
        public string? Remarks { get; set; }
        public bool Active { get; set; }
    }


}
