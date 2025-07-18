export interface AssignRole {
  id?: number;
  role: string;
  employeeId: string;
  employee: string;
  department: string;
  remarks?: string;
  startDate: string | null;
  endDate: string | null;
  active: boolean;
  status: number;
  createdOn: string;
  createdBy: string;
  modifiedOn: string;
  modifiedBy: string;
  roleId?: number;
  employees: EmployeeDto[];
  employeeCount: number;
  deptId: string;
}

export interface EmployeeDto {
  employeeID: string;
  employeeName: string;
}