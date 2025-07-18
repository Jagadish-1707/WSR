  import { Moment } from "moment";

  export interface Task {
    id: number;
    customerId: string;
    customerName: string;
    projectId?: string;
    projectName?: string;
    projectType: string;
    assignedTo?: AssignedTo[];
    assignmentStartDate: Moment;
    assignmentEndDate: Moment;
    assignmentPercent: number;
    billingType: string;    
    remarks: string | null;
    projectTypeName?: string;
    projectAttachment: string | null;
    active: number;
    status: number;
  }

  export interface AssignedTo {
    userId: number;
    userName: string;
  }

   export interface metricsMaster {
    taskId: number;
    generalMetricsName: string;
  }
