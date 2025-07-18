export interface SLA {
  slaId: number;
  customerId: string;
  customerName: string;
  projectId: string;
  projectName: string;
  priority: string;
  slaHours: number;
  remarks?: string;  
  active: boolean;
  status?: number;
  createdOn?: string;    
  createdBy?: string;
  modifiedOn?: string;
  modifiedBy?: string;
}
