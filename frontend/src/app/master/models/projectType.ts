export interface ProjectTypes{
  id: number | null;                   
  projectTypeName: string;
  description: string | null;
  startDate: number | null;
  endDate: number | null;
  remarks: string | null;
  active?: boolean;                   
  status: number;                     
  createdBy?: string |null;                 
  modifiedBy?: string|null; 
}
