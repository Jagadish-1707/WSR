export interface ProjectManager {
  name: string;
  rate: number;
  empId: string;
  erecno: string;
}

export interface ZohoProject {
  // WSR-Specific Fields — update these from `never[]` to their actual structure
  plannedActivities?: { task: string; status: string; remarks: string; planned: boolean }[];
  progressData?: { task: string; status: string; remarks: string; planned: boolean }[];
  keyIssues?: {
    type: string;
    functionalArea: string;
    description: string;
    actions: string;
    dateRaised: string;
    resolveBy: string;
    owner: string;
  }[];
  keyRisks?: {
    description: string;
    mitigation: string;
    likelihood: string;
    owner: string;
    dateRaised: string;
    resolveBy: string;
  }[];

  // Existing Fields
  currencyType: string;
  customerId: string;
  projectId: string;
  projectName: string;
  startDate: string;
  endDate: string;
  clientId: string;
  clientName: string;
  projectStatus: string;
  ownerId: string;
  ownerName: string;
  isDeleteAllowed: boolean;
  projectManagers: string;
  createdOn: string;

  // Optional: For form submission enhancements
  projectType?: string;
  projectDescription?: string;
}
