export interface ProjectDetails {
  clientId: number;
  id: number;
  customerId: string;
  customerName: string;
  projectId: string;
  projectName: string;
  engagementMode: number;
  currencyType: string;
  contractValue: number;
  startDate: Date;
  endDate: Date;
  remarks: string | null;
  active: boolean;
  status: number;
  createdOn: Date | null;
  createdBy: string | null;
  modifiedOn: Date | null;
  modifiedBy: string | null;
  estimatedHours: number;
}

export interface ProjectEngagementMode {
  id: number;
  engagementMode: string;
  remarks: string | null;
  status: number;
  createdOn: Date | null;
  createdBy: string | null;
  modifiedOn: Date | null;
  modifiedBy: string | null;
}
