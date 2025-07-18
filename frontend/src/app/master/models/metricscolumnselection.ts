export interface SelectionDto {
  id?: number;
  projectId: number;
  projectName?: string;
  projectTypeId: number;
  projectTypeName?: string;
  metricsIDs: number[];
  selectedCheckBoxIds: SelectionFieldDto[];
}

export interface SelectionFieldDto {
  fieldColumnId: number;
  isMandatory: boolean;
}