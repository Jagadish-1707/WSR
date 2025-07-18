export interface MetricsMaster {
  id: number | null;                  
  metricsName: string;                
  description: string | null;         
  startDate: string | null;             
  endDate: string | null;               
  remarks: string | null;             
  active?: boolean;                   
  status: number;                     
  createdBy?: string |null;                 
  modifiedBy?: string|null;                
}
