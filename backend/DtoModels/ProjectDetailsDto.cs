using backend.Models;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;

namespace backend.DtoModels
{
    public class ProjectDetailsDto : BaseModel
    {
        public int Id { get; set; }

        public string? CustomerId { get; set; }
        public string? CustomerName { get; set; }

        public string? ProjectId { get; set; }
        public string? ProjectName { get; set; }

        public string? CurrencyType { get; set; }
        public int? EngagementMode { get; set; }
        public decimal? ContractValue { get; set; }

        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }

        public string? Remarks { get; set; }
        public decimal? EstimatedHours { get; set; }

        public string? ModeName { get; set; }
    }

    public class AddProjectDetailsDto
    {
        public string? CustomerId { get; set; }
        public string? CustomerName { get; set; }

        public string? ProjectId { get; set; }
        public string? ProjectName { get; set; }

        public int? EngagementMode { get; set; }
        public string? CurrencyType { get; set; }
        public decimal? ContractValue { get; set; }

        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }

        public string? Remarks { get; set; }
        public decimal? EstimatedHours { get; set; }
    }

    public class EditProjectDetailsDto
    {
        public int Id { get; set; }

        public string? CustomerId { get; set; }
        public string? CustomerName { get; set; }

        public string? ProjectId { get; set; }
        public string? ProjectName { get; set; }

        public string? CurrencyType { get; set; }
        public int? EngagementMode { get; set; }
        public decimal? ContractValue { get; set; }

        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }

        public string? Remarks { get; set; }
        public decimal? EstimatedHours { get; set; }

        public bool Active { get; set; }
    }
}
