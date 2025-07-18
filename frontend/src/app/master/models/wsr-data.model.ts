export interface WSRDropdownItem {
  projectId: string;
  projectName: string;
}



export interface ProjectData {
  projectName: string;
  schedule: string;
  resource: string;
  financial: string;
  quality: string;
  scope: string;
  overallStatus: string;
  plannedResource: number;
  actualResource: number;
  measureTaken: string;
  remarks: string;
  startDate: string;
  endDate: string;
  manager: string;
  teamSize: string;
  technology: string;
  projectType: string;
  customerLocation: string;
  businessDomain: string;
  description: string;
  progressData: {
    sno: number;
    task: string;
    status: string;
    remarks: string;
  }[];
  plannedActivities: {
    sno: number;
    task: string;
    status: string;
    remarks: string;
  }[];
  resourceData: {
    sno: number;
    resourceName: string;
    ratingOutOf5: number;
  }[];
  keyIssues: {
    type: string;
    functionalArea: string;
    description: string;
    actions: string;
    dateRaised: string;
    resolveBy: string;
    owner: string;
  }[];
  keyRisks: {
    description: string;
    mitigation: string;
    likelihood: string;
    owner: string;
    dateRaised: string;
    resolveBy: string;
  }[];
}
