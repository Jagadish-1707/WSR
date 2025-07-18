export interface Role {
  id: number;
  roleName: string;
  remarks: string;
  startDate: Date;
  endDate: Date;
  userId?: number;
  description: string;
  active: boolean;
  // status:number;
  // Active:boolean;
  // CreatedOn:Date;
  createdBy: string;
  // ModifiedOn:Date;
  // ModifiedBy:Date;
  // UserId:string;
}
