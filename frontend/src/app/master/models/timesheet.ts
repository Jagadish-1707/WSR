
export interface Timesheets {
    id?: number;
    employeeId: number;
    employeeName: string;    
    doj: Date;
    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
    weeklyTimesheet: WeeklyTimesheets[];
  }
  
  export interface WeeklyTimesheets {
    id: number;
    timesheetId: number;
    customerId: number;
    customerName: string;
    projectId: number;
    projectName: string;
    activity: string;
    site: string;
    billingType: string;
    weekStartDate?: Date;
    weekEndDate?: Date;
    logHours: LogHours[];
}

export interface LogHours{
  timesheetStatus:string;
  logTs: Date;
  logHours: number;
}

export interface TimesheetGrid {
  active: boolean;
  activity: string;
  billingType: string;
  createdOn?: Date;
  // createdBy?: string;
  // modifiedOn?: Date;
  // modifiedBy?: string;
  customerId: number;
  customerName: string;
  doj: Date;
  employeeId: number;
  employeeName: string;
  id: number;
  logHours: number;
  logTs: Date;
  projectId: number;
  projectName: string;
  timesheetStatus:string;
  site: string;
  status: number;
}

export interface WeeklyTimesheetSummary {
  weekStartDate: string;     // or Date if you parse it
  weekEndDate: string;       // or Date
  totalBillableHours: number;
  totalNonBillableHours: number;
  totalHolidayHours: number;
  totalHours: number;
}
