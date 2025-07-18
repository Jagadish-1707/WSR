using System;
using System.Collections.Generic;
using backend.Models;

namespace backend.DtoModels
{
    public class MetricsDetailsDto : BaseModel
    {
        public int Id { get; set; }
        public string? CustomerId { get; set; }
        public string? CustomerName { get; set; }
        public string? ProjectId { get; set; }
        public string? ProjectName { get; set; }
        public int? ProjectTypeId { get; set; }
        public DateTime? MonthYear { get; set; }
        public DateTime? WeekStartDate { get; set; }
        public DateTime? WeekEndDate { get; set; }
        public string FlagType { get; set; }
        public List<MetricsFieldValueDto> MetricsFieldValue { get; set; } = new List<MetricsFieldValueDto>();

    }
    public class TicketDetailsDto
    {
        public int FieldColumnId { get; set; }
        public string? FieldValue { get; set; } // Store all values as string for flexibility
    }

    // This is what the GET API will return
    public class MetricsDto
    {
        public int Id { get; set; } // MetricsData.Id
        public string ProjectId { get; set; } // Task.Id
        public string CustomerId { get; set; }
        public DateTime? MonthYear { get; set; }
        public DateTime? WeekStartDate { get; set; }
        public DateTime? WeekEndDate { get; set; }
        public int? ProjectTypeId { get; set; }
        public List<MetricsDataRowDto> DynamicFieldRows { get; set; }
        //public List<MetricsFieldValueDto> FieldValues { get; set; } = new List<MetricsFieldValueDto>();
        public string? CustomerName { get; set; }
        public string? ProjectName { get; set; }
        public string? ProjectType { get; set; }
    }

    public class MetricsDataRowDto
    {
        public List<MetricsFieldValueDto> FieldsInRow { get; set; }
    }

    public class MetricsFieldValueDto
    { 
        public int FieldColumnId { get; set; }
        public string FieldValue { get; set; }
        public int? RowNumber { get; set; }
    }

    public class AddMetricsDetailsDto
    {
        public string? CustomerId { get; set; }
        public string? ProjectId { get; set; }
        public int? ProjectTypeId { get; set; }
        public DateTime? MonthYear { get; set; }
        public DateTime? WeekStartDate { get; set; }
        public DateTime? WeekEndDate { get; set; }
        public List<MetricsFieldValueDto> FieldValues { get; set; }



    }

    public class EditMetricsDetailsDto
    {
        public int Id { get; set; }
        public string? CustomerId { get; set; }
        public string? ProjectId { get; set; }
        public int? ProjectTypeId { get; set; }
        public DateTime? MonthYear { get; set; }
        public DateTime? WeekStartDate { get; set; }
        public DateTime? WeekEndDate { get; set; }
        public List<MetricsFieldValueDto> FieldValues { get; set; }

    }

    public class ChartTicketClosedDto
    {
        public string labels { get; set; }
        public string ticketstatus { get; set; }
        public int count { get; set; }
        //public int data { get; set; }
    }

    public class GroupedUserDataDto
    {
        public string? Username {  get; set; }
        public int count {  set; get; }

    }

    public class ChartTicketClosedComplexityDto
    {
        public string labels { get; set; }
        public string ticketstatus { get; set; }
        public string complexity { get; set; }
        public int count { get; set; }
        //public int data { get; set; }
    }

    public class GroupedUserDataComplexDto
    {
        public string? Username { get; set; }
        public string? complexity { get; set; }
        public int count { set; get; }

    }
}
