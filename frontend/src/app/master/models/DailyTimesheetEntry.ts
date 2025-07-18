interface DailyTimesheetEntry {
  timesheetId: number;
  logDate: string | Date;
  employeeId: string;
  employeeName: string;
  projectName: string;
  customerName: string;
  billingType: string;
  logHours: number;
  timesheetStatus: string;
  site: string;
  activity: string;
  remarks?: string;
  createdOn?: string | Date;
}