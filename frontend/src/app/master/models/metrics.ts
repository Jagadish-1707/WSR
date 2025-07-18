export interface Metrics {
    id: number;
    customerId: number;
    customerName: string;
    projectId?: number;
    projectName?: string;
    projectType: string;
    monthYear : string;
    weekStartDate: Date;
    weekEndDate: Date;
    flagType?:string;
    ticketDetails: TicketDetails[];
}
export interface DevelopmentMetrics {
  id: number;
  customerId: number;
  customerName: string;
  projectId?: number;
  projectName?: string;
  projectType: string;
  monthYear : string;
  weekStartDate: Date;
  weekEndDate: Date;
  flagType?:string;
  developmentTasks: DevelopmentTaskDetails[];
}
export interface EditDevelopmentMetrics {
  id: number;
  customerId: number;
  customerName: string;
  projectId?: number;
  projectName?: string;
  projectType: string;
  monthYear : string;
  weekStartDate: Date;
  weekEndDate: Date;
  flagType?:string;
  developmentTasks: DevelopmentTaskDetails[];
}

export interface TicketDetails {
  ticketDetailsId: number;
  metricsId: number;
  metricsDetailsId: number;
  ticketNo: string;
  ticketDesc: string;
  createDate: Date;
  createdBy: string;
  ticketAssignedTo: TicketAssignedTo[];
  assignedDate: Date;
  assignedBy: string;
  priorityId: number;
  priority: string;
  complexityId: number;
  complexity: string;
  expectedClosureDate: Date;
  expectedClosureEffort: number;
  actualResolvedDate: Date;
  actualResolutionEffort: number;
  workedBy: WorkedBy[];
  closedBy: ClosedBy[];
  reopened: string;
  reopenedDate: Date;
  ticketStatus: string;
  slaMet: string;
}
export interface DevelopmentTaskDetails {
  taskId: number | null;
  metricsId: number| null;
  actualDuration: number | null;
  actualEffortHrs: number | null;
  actualEndDate: Date | null;
  actualStartDate: Date | null;
  crNumber: string | null;
  expectedCompletionMonth: number | null;
  noOfDefects: number | null;
  onTimeDelivery: boolean | null;
  plannedDuration: number | null;
  plannedEffortHrs: number | null;
  plannedEndDate: Date | null;
  plannedStartDate: Date | null;
  priority: string | null;
  reWorkEffortsHrs: number | null;
  remarks: string | null;
  status: string | null;
  taskNameRticketNo: string | null;
  taskToCompleteMonth: boolean | null;
}

  
  
  export interface TicketAssignedTo {
    ticketAssignedToId: number;
    ticketDetailsId: number;
    userId: number;
    userName: string;
  }

  export interface WorkedBy {
    workedById: number;
    ticketDetailsId: number;
    userId: number;
    userName: string;
  }

  export interface ClosedBy {
    closedById: number;
    ticketDetailsId: number;
    userId: number;
    userName: string;
  }
  