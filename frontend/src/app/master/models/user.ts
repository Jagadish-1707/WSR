export interface User {
  costPerHour: number;
  createdTime: string;
  email_Address: string;
  employee_ID: string;
  lastAccessedOn: string;
  lastModifiedTime: string;
  password: string;
  profile: string;
  role: string;
  status: string;
  user_Id: number;
  userName: string;
  ticketAssignedToId?:number;
  ticketDetailsId?:number;
  workedById?:number;
  closedById: number;
  roleId : number;
  deptId : number;
  reporting_To : number;

}
