namespace backend.DtoModels
{
    public class MetricProjectColumnsDto
    {
        public int Id { get; set; }
        public string FieldName { get; set; }
        public string FieldType { get; set; }
        public int Status { get; set; }
        public string? IsMandatory { get; set; }
        public DateTime? CreatedOn { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public string? DropdownValues {get; set;}
        public string? Editable { get; set; }
        public int OrderBy { get; set; }
    }
    public class AddMetricProjectColumnsDto
    {
        public string FieldName { get; set; }
        public string FieldType { get; set; }
        public int Status { get; set; }
        public DateTime? CreatedOn { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public string? DropdownValues { get; set; }
        public string? Editable { get; set; }
        public int OrderBy { get; set; }
    }
    public class EditMetricProjectColumnsDto
    {
        public int Id { get; set; }
        public string FieldName { get; set; }
        public string FieldType { get; set; }
        public int Status { get; set; }
        public bool Active { get; set; }
        public DateTime? CreatedOn { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public string? DropdownValues { get; set; }
        public int OrderBy { get; set; }
    }

    //MetricColumnFieldSelection
    public class SelectionDto
    {
        public int Id { get; set; }
        public int ProjectId { get; set; }
        public string? ProjectName { get; set; }
        public int ProjectTypeId { get; set; }
        public string? ProjectTypeName { get; set; }
        public List<int>? MetricsIDs { get; set; }
        public List<string>? MetricName { get; set; }
        public List<string>? SelectedFieldNames { get; set; }
        public DateTime? CreatedOn { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public List<SelectionFieldDto> SelectedCheckBoxIds { get; set; }
        public List<SelectionFieldDto>? SelectedCheckBoxIdsName { get; set; }
        public int MetricsCount => MetricsIDs?.Count ?? 0;
        public int SelectedCheckBoxFieldCount => SelectedCheckBoxIds?.Count ?? 0;
    }

    public class SelectionFieldDto
    {
        public int FieldColumnId { get; set; }
        public string? FieldName { get; set; }
        public bool IsMandatory { get; set; } = false;
    }

    //getdropdown values for Metrics and Project Type from Project 
    public class ProjectMetricsDto
    {
        public int MetricId { get; set; }
        public string MetricName { get; set; }
        public int ProjectTypeId { get; set; }
        public string ProjectTypeName { get; set; }
    }

    //get grid data fieldname of project in metrics

    public class SelectedProjectFieldsDto
    {
        public int ProjectId { get; set; }
        public List<SelectedProjectFieldsDataDto> SelectedMetrics { get; set; }
    }

    public class SelectedProjectFieldsDataDto
    {
        public int FieldColumnId { get; set; }
        public string FieldName { get; set; }
        public string FieldType { get; set; }
        public bool IsMandatory { get; set; }
        public string? DDValue { get; set; }
        public int? OrderBy { get; set; }
    }

}
