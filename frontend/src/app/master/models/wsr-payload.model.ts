export interface WSRResourceDto {
  zohoEmp_Id: number;
  emp_Name: string;
  rating: number;
  active: number;
}

export interface WSRReportDto {
  id: string;
  wsrName: string;
  projectId: string;
  customerName: string;
  reportStartDate?: string;
  reportEndDate?: string;
  createdOn: string;
  createdBy: string;
  updatedOn: string;
  updatedBy: string;
}

export interface WSRProjectStatusDto {
  id: string;
  projectId: string;
  overallStatus: string;
  schedule: string;
  financial: string;
  resource: string;
  quality: string;
  scope: string;
  plannedResource: number;
  actualResource: number;
  measureTaken: string;
  remarks: string;
  createdOn: string;
  createdBy: string;
  updatedOn: string;
  updatedBy: string;
}

export interface WSRProjectDetailsDto {
  id: string;
  projectId: string;
  managerName: string;
  teamSize: number;
  technology: string;
  customerLocation: string;
  businessDomain: string;
  projectType: string;
  projectStartDate?: string;
  projectEndDate?: string;
  projectDescription: string;
  resources: WSRResourceDto[];
  createdOn: string;
  createdBy: string;
  updatedOn: string;
  updatedBy: string;
}
export class WSRTaskDto {
  task!: string;
  status!: boolean;
  remarks!: string;
  createdBy!: string;
  createdOn!: string;
}

export interface WSRIssueDto {
  type: string;
  functionalArea: string;
  description: string;
  actionRequired: string;    
  dateReported: string;        
  resolveByDate: string;       
  issueOwner: string;          
  createdBy: string;
  createdOn: string;
}


export interface WSRKeyRiskDto {
  description: string;
  mitigation: string;
  likelihood: string;
  owner: string;
  dateRaised: string;
  resolveBy: string;
  createdBy: string;
  createdOn: string;
}


export interface WSRSubmissionPayload {
  WSRReportDto: WSRReportDto;
  WSRProjectStatusDto: WSRProjectStatusDto;
  WSRProjectDetailsDto: WSRProjectDetailsDto;
  wsrTaskDto: WSRTaskDto[];
  wsrIssueDto: WSRIssueDto[];
  wsrKeyRisksDto: WSRKeyRiskDto[];
}

// ✅ New type for consolidated/multi-project view
export interface ConsolidatedWSRData {
  wsrReportDto: WSRReportDto;
  wsrProjectStatusDto: WSRProjectStatusDto;
  wsrProjectDetailsDto: WSRProjectDetailsDto;
}
