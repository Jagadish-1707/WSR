import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { CalendarModule } from 'primeng/calendar';
import { PanelModule } from 'primeng/panel';
import { DialogModule } from 'primeng/dialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputTextModule } from 'primeng/inputtext';
import { SelectItem } from 'primeng/api';
import { WsrService } from '../../services/wsr.service';
import { ZohoClient } from '../../models/ZohoClient';
import { ZohoService } from '../../services/zoho.service';
import { ZohoProject } from '../../models/ZohoProject';
import { ZohoEmp } from '../../models/ZohoEmp';
import { ZohoDataService } from '../../services/zoho-data.service';
import { WSRDropdownItem } from '../../models/wsr-data.model';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Location } from '@angular/common';
import { WsrPayloadService } from '../../../utils/wsr-payload.service';
import { ActivatedRoute } from '@angular/router';
import { table } from 'console';
import PptxGenJS from 'pptxgenjs';
import { SplitButtonModule } from 'primeng/splitbutton';
import { MenuModule } from 'primeng/menu';
import { ConsolidatedWSRData } from '../../models/wsr-payload.model';



declare var pdfMake: any;

interface ProgressItem {
  sno?: number;
  task: string;
  active: boolean;
  taskStatus: string;
  remarks: string;
}

interface ResourceItem {
  sno?: number;
  emp_Name?: string;
  resourceName?: string;
  rating?: number;
  ratingOutOf5?: number;
}

interface ProjectData {
  id: any;
  wsrReportDto: any;
  projectId?: string;
  projectName: string;
  clientName?: string;
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
  reportStartDate?: string;
  reportEndDate?: string;
  projectStartDate?: string;
  projectEndDate?: string;
  emp_Name?: string;
  projectDescription?: string;

  progressData?: ProgressItem[];
  keyAchievements?: ProgressItem[];
  plannedActivities?: ProgressItem[];
  nextPeriodActivities?: ProgressItem[];

  resourceData?: ResourceItem[];
  resources?: ResourceItem[];

  startDate?: string;
  endDate?: string;
  managerName?: string;
  teamSize?: string;
  technology?: string;
  projectType?: string;
  customerLocation?: string;
  businessDomain?: string;
  description?: string;

  keyIssues?: {
    type?: string;
    functionalArea?: string;
    description?: string;
    actionRequired?: string;
    dateRaised?: string;
    resolveBy?: string;
    issueOwner?: string;
  }[];

  keyRisks?: {
    riskDescription?: string;
    mitigation?: string;
    likelihood?: string;
    riskOwner?: string;
    dateRaised?: string;
    resolveBy?: string;
  }[];
}

interface keyIssues {
  type?: string;
  functionalArea?: string;
  description?: string;
  actions?: string;
  dateRaised?: string;
  resolveBy?: string;
  owner?: string;
}

@Component({
  selector: 'app-wsr',
  standalone: true,
  imports: [
    ButtonModule,
    CommonModule,
    HttpClientModule,
    FormsModule,
    DropdownModule,
    MultiSelectModule,
    CalendarModule,
    PanelModule,
    DialogModule,
    InputTextareaModule,
    InputTextModule,
    ToastModule,
    SplitButtonModule,
    MenuModule
  ],
  templateUrl: './wsr.component.html',
  styleUrl: './wsr.component.scss',
})
export class WSRComponent implements OnInit {
  activeTab: string = 'overall';
  selectedStatus: string = '';
  projects: ProjectData[] = [];
  selectedProjects: ProjectData[] = [];
  showProjectView: boolean = true;
  project: SelectItem[] = [];
  projectDetails: any[] = [];
  zohoClients: ZohoClient[] = [];
  filteredZohoProjects: ZohoProject[] = [];
  zohoProjects: ZohoProject[] = [];
  selectedProject: ZohoProject | null = null;
  wsrReports: any[] = [];
  wsrprojects: WSRDropdownItem[] = [];
  wsrselectedProjects: WSRDropdownItem[] = [];
  progressDataBackup: any[] = [];
  plannedActivitiesBackup: any[] = [];
resourceList: {
    zohoemp_id: string;
    resourcename: string;
    rating: number;
  }[] = [];


  // ✅ Zoho Employees and Resources
  zohoEmployees: ZohoEmp[] = [];
  resourceNames: { label: string; value: string }[] = [];
  selectedResources: string[] | any = []; // This will store selected userNames or IDs

  // For Add Form dialog
  displayAddFormDialog = false;
  formModel: any = {
    manager: null,
    reportDates: null,
    teamSize: null,
    technology: [],
    customerLocation: null,
    businessDomain: '',
    projectType: null,
    projectDates: null,
    projectDescription: '', // ✅ rename from `description`
    statuses: {},
    resourceRating: null,
    measuresTaken: '',
    remarks: '',
  };


  // Dropdown options
  clients: { label: string; value: string }[] = [
    { label: 'Jeff', value: 'Jeff' },
    { label: 'Mark', value: 'Mark' },
  ];
  // project = [{ label: 'Complete solar', value: 'Complete solar' }, { label: 'Sanmina', value: 'Sanmina' }];
  managers = [
    { label: 'Alice Brown', value: 'Alice Brown' },
    { label: 'Bob Johnson', value: 'Bob Johnson' },
  ];
  teamSizes = [
    { label: '5', value: '5' },
    { label: '10', value: '10' },
    { label: '15', value: '15' },
  ];
  technologies = [
    { label: 'Angular', value: 'Angular' },
    { label: 'Node.js', value: 'Node.js' },
    { label: 'Vue js', value: 'Vue js' },
  ];
  locations = [
    { label: 'New York', value: 'New York' },
    { label: 'London', value: 'London' },
  ];
  projectTypes = [
    { label: 'Development', value: 'Development' },
    { label: 'Enhancement', value: 'Enhancement' },
  ];
  statusFields = [
    'Schedule',
    'Financial',
    'Resource',
    'Quality',
    'Scope',
    'Overall Status',
  ];
  statusOptions = [
    { label: 'Green', value: 'Green' },
    { label: 'Amber', value: 'Amber' },
    { label: 'Red', value: 'Red' },
  ];
  selectedStatuses: { [key: string]: string } = {};

  ratings = Array.from({ length: 51 }, (_, i) => {
    const value = i * 0.1;
    return { label: value.toFixed(1), value };
  });
  resourceCounts = Array.from({ length: 20 }, (_, i) => {
    const value = i + 1;
    return { label: value.toString(), value };
  });
  resourceRatings: { [resourceName: string]: number } = {};
  isFormValid: any;



  newProgressList: { task: string; status: string; remarks: string }[] = [
  { task: '', status: '', remarks: '' }
];

newPlannedList: { task: string; status: string; remarks: string }[] = [
  { task: '', status: '', remarks: '' }
];
newIssueList: {
  type: string;
  functionalArea: string;
  description: string;
  ActionRequired: string;
  dateRaised: string;
  resolveBy: string;
  IssueOwner: string;
}[] = [
  {
    type: '',
    functionalArea: '',
    description: '',
    ActionRequired: '',
    dateRaised: '',
    resolveBy: '',
    IssueOwner: ''
  }
];

newRiskList: {
  RiskDescription: string;
  mitigation: string;
  likelihood: string;
  RiskOwner: string;
  riskdate: string;
  riskresolvedate: string;
}[] = [
  {
    RiskDescription: '',
    mitigation: '',
    likelihood: '',
    RiskOwner: '',
    riskdate: '',
    riskresolvedate: ''
  }
];

isEditProgress: boolean = false;
editingProgressItem: any = null;

isEditPlanned: boolean = false;
isEditKeyIssue: boolean = false;
isEditKeyRisk: boolean = false;

selectedProjectForEdit: any = null;
progressItemToEdit: any = null;
plannedItemToEdit: any = null;
keyIssueToEdit: any = null;
keyRiskToEdit: any = null;

  showActivityInputs: { [projectId: string]: boolean } = {};

  toggleActivityInputs(projectId: string): void {
    this.showActivityInputs[projectId] = !this.showActivityInputs[projectId];
  }

  getProjectId(project: any): string {
    return project.projectId || project.id || project.name || 'default';
  }

  // addProgressItem(project: any): void {
  //   if (!this.newProgress.task || !this.newProgress.status) return;

  //   if (!project.progressData) project.progressData = [];

  //   project.progressData.push({
  //     task: this.newProgress.task,
  //     status: this.newProgress.status,
  //     remarks: this.newProgress.remarks,
  //     active: false
  //   });

  //   project.isProgress = true;
  //   project.isPlanned = false;

  //   this.progressDataBackup = [...project.progressData];
  //   this.newProgress = { task: '', status: '', remarks: '' };
  // }

  // addPlannedItem(project: any): void {
  //   if (!this.newPlanned.task || !this.newPlanned.status) return;

  //   if (!project.plannedActivities) project.plannedActivities = [];

  //   project.plannedActivities.push({
  //     task: this.newPlanned.task,
  //     status: this.newPlanned.status,
  //     remarks: this.newPlanned.remarks,
  //     active: true
  //   });

  //   project.isPlanned = true;
  //   project.isProgress = false;

  //   this.plannedActivitiesBackup = [...project.plannedActivities];
  //   this.newPlanned = { task: '', status: '', remarks: '' };
  // }

  resetProgressTable(project: any): void {
    project.progressData = [...this.progressDataBackup];
  }

  resetPlannedTable(project: any): void {
    project.plannedActivities = [...this.plannedActivitiesBackup];
  }
 editProgressItem(project: any, item: any) {
  this.isEditProgress = true;
  this.editingProgressItem = { ...item };
  this.selectedProject = project;
}


editPlannedItem(project: any, item: any): void {
  this.isEditPlanned = true;
  this.selectedProjectForEdit = project;
  this.plannedItemToEdit = { ...item };
}

editKeyIssue(project: any, issue: any): void {
  this.isEditKeyIssue = true;
  this.selectedProjectForEdit = project;
  this.keyIssueToEdit = { ...issue };
}

editKeyRisk(project: any, risk: any): void {
  this.isEditKeyRisk = true;
  this.selectedProjectForEdit = project;
  this.keyRiskToEdit = { ...risk };
}

onCancelEdit(): void {
  this.isEditProgress = false;
  this.isEditPlanned = false;
  this.isEditKeyIssue = false;
  this.isEditKeyRisk = false;
  this.selectedProjectForEdit = null;
  this.progressItemToEdit = null;
  this.plannedItemToEdit = null;
  this.keyIssueToEdit = null;
  this.keyRiskToEdit = null;
}



  // Input field model bindings 
  newIssue = {
    type: '',
    functionalArea: '',
    description: '',
    actions: '',
    dateRaised: '',
    resolveBy: '',
    owner: ''
  };

  newRisk = {
    description: '',
    mitigation: '',
    likelihood: '',
    owner: '',
    dateRaised: '',
    resolveBy: ''
  };

  // Map to track which project's issue/risk input should be shown
  showIssueInputs: { [projectId: string]: boolean } = {};

  // Toggle visibility of issue/risk input section for a specific project
  toggleIssueInputs(projectId: string): void {
    this.showIssueInputs[projectId] = !this.showIssueInputs[projectId];
  }

  // Add a new issue to the selected project
  addKeyIssue(project: any): void {
    if (!this.newIssue.type || !this.newIssue.description) return;

    if (!project.keyIssues) project.keyIssues = [];

    project.keyIssues.push({ ...this.newIssue });

    this.newIssue = {
      type: '',
      functionalArea: '',
      description: '',
      actions: '',
      dateRaised: '',
      resolveBy: '',
      owner: ''
    };
  }

  // Add a new risk to the selected project
  addKeyRisk(project: any): void {
    if (!this.newRisk.description || !this.newRisk.mitigation) return;

    if (!project.keyRisks) project.keyRisks = [];

    project.keyRisks.push({ ...this.newRisk });

    this.newRisk = {
      description: '',
      mitigation: '',
      likelihood: '',
      owner: '',
      dateRaised: '',
      resolveBy: ''
    };
  }
  addProgressItemToForm() {
  this.newProgressList.forEach((item) => {
    if (item.task && item.status) {
      this.formModel.progressData.push({ ...item });
    }
  });

  // Reset to a single empty row for further input
  this.newProgressList = [{ task: '', status: '', remarks: '' }];
}

addPlannedItemToForm() {
  this.newPlannedList.forEach((item) => {
    if (item.task && item.status) {
      this.formModel.plannedActivities.push({ ...item });
    }
  });

  // Reset to a single empty row for further input
  this.newPlannedList = [{ task: '', status: '', remarks: '' }];
}


addKeyIssueToForm() {
  this.newIssueList.forEach((item) => {
    if (item.description && item.type) {
      this.formModel.keyIssues.push({ ...item });
    }
  });

  // Reset for next input
  this.newIssueList = [
    {
      type: '', functionalArea: '', description: '',
      ActionRequired: '', dateRaised: '', resolveBy: '', IssueOwner: ''
    }
  ];
}

addKeyRiskToForm() {
  this.newRiskList.forEach((item) => {
    if (item.RiskDescription && item.mitigation) {
      this.formModel.keyRisks.push({ ...item });
    }
  });

  // Reset for next input
  this.newRiskList = [
    {
      RiskDescription: '', mitigation: '', likelihood: '',
      RiskOwner: '', riskdate: '', riskresolvedate: ''
    }
  ];
}


  exportOptions = [
    {
      label: 'Download PDF',
      icon: 'pi pi-file-pdf',
      command: () => this.downloadPDF()
    },
    {
      label: 'Download PPT',
      icon: 'pi pi-file',
      command: () => this.downloadPPT()
    }
  ];





  constructor(
    private http: HttpClient,
    private wsrService: WsrService,
    private zohoService: ZohoService,
    private zohoDataService: ZohoDataService,
    private messageService: MessageService,
    private location: Location,
    private wsrPayloadService: WsrPayloadService,
    private route: ActivatedRoute
  ) { }

  goBack(): void {
    window.history.back();
  }

  ngOnInit(): void {
    this.loadWSRReports();
    this.getAllZohoClients();
    this.getAllZohoProjects();
    this.fetchZohoEmployees();

    this.route.queryParams.subscribe((params) => {
      const idsParam = params['ids'];
      const ids = idsParam ? idsParam.split(',') : [];

      if (ids.length > 0) {
        this.wsrService.getConsolidatedReports(ids).subscribe({
          next: (data: ConsolidatedWSRData[]) => {
            this.selectedProjects = data.map((item: ConsolidatedWSRData) =>
              this.mapWSRDataToProject(item)
            );
            this.activeTab = 'overall';
          },
          error: (err) => {
            console.error('❌ Error loading consolidated WSR reports:', err);
          }
        });

      } else {
        this.route.paramMap.subscribe((params) => {
          const wsrId = params.get('id');
          if (wsrId) {
            this.wsrService.getWSRReportById(wsrId).subscribe({
              next: (data) => {
                console.log('Before Loaded single WSR report:', data);
                this.selectedProjects = [this.mapWSRDataToProject(data)];
                console.log('Loaded single WSR report:', this.selectedProjects);
                this.activeTab = 'overall';
              },
              error: (err) => {
                console.error('❌ Error loading single WSR report:', err);
              },
            });
          }
        });
      }
    });
  }





  // ✅ Normalize API response for tab rendering
  private mapWSRDataToProject(data: any): ProjectData {
    const report = data.wsrReportDto || {};
    const status = data.wsrProjectStatusDto || {};
    const details = data.wsrProjectDetailsDto || {};

    // Optional: Normalize date fields (for p-calendar compatibility)
    const keyIssues = (data.wsrIssueDto || []).map((issue: any) => ({
      ...issue,
      dateRaised: issue.dateReported ? new Date(issue.dateReported) : null,
      resolveBy: issue.resolveByDate ? new Date(issue.resolveByDate) : null,
    }));

    const keyRisks = (data.wsrKeyRisksDto || []).map((risk: any) => ({
      ...risk,
      dateRaised: risk.dateRaised ? new Date(risk.dateRaised) : null,
      resolveBy: risk.resolveByDate ? new Date(risk.resolveByDate) : null,
    }));

    return {
      ...report,
      ...status,
      ...details,

      resourceData: details.resourceData || [],
      progressData: data.wsrTaskDto || [],
      plannedActivities: data.wsrTaskDto || [],
      keyIssues,
      keyRisks,
      resources: details.resources || [],

      // Optional: ensure projectName and projectId exist
      projectName: report.projectName || status.projectName || 'Unnamed Project',
      projectId: report.projectId || status.projectId || details.projectId || '',
    };
  }



  loadWSRReports(): void {
    this.wsrService.getAllWSRReports().subscribe({
      next: (data) => {
        this.wsrReports = data;
        this.wsrprojects = data.map((report: any) => ({
          ...report,
          projectId: report.id,
          projectName: report.wsrName,
        }));
      },
    });
  }

  onProjectSelectionChange(): void {
    const selectedIds = this.wsrselectedProjects.map((p) => p.projectId);
    this.selectedProjects = [];

    selectedIds.forEach((id) => {
      this.wsrService.getWSRReportById(id).subscribe({
        next: (projectData) => {
          this.selectedProjects.push(this.mapWSRDataToProject(projectData));
        },
        error: (err) => {
          console.error(`Error fetching project ${id}`, err);
        },
      });
    });
  }

  getAllZohoClients(): void {
    this.zohoService.getClients().subscribe((clients: ZohoClient[]) => {
      this.zohoClients = clients;
      this.clients = [
        ...new Map(clients.map((item) => [item.clientId, item])).values(),
      ].map((client) => ({
        label: client.clientName,
        value: client.clientId,
      }));
    });
  }

  getAllZohoProjects(): void {
    this.zohoService.getProjects().subscribe((projects: ZohoProject[]) => {
      this.zohoProjects = projects;
    });
  }

  fetchZohoEmployees(): void {
    this.zohoDataService.getAllZohoEmployees().subscribe((res: ZohoEmp[]) => {
      this.zohoEmployees = res;
      const sorted = [...res].sort((a, b) =>
        a.userName.localeCompare(b.userName)
      );
      this.resourceNames = sorted.map((emp) => ({
        label: emp.userName,
        value: emp.userName,
      }));
    });
  }

  onClientSelected(selectedClientId: string): void {
    if (selectedClientId) {
      this.filteredZohoProjects = this.zohoProjects.filter(
        (project) => project.clientId === selectedClientId
      );
      this.formModel.projectName = '';
    } else {
      this.filteredZohoProjects = [];
      this.formModel.clientName = '';
      this.formModel.customerId = '';
      this.formModel.currencyType = '';
    }
  }

  onProjectSelected(selectedProject: ZohoProject): void {
    if (selectedProject) {
      const alreadyExists = this.projectDetails.some(
        (proj) =>
          proj.projectId === selectedProject.projectId &&
          proj.id !== this.formModel.id
      );
      if (alreadyExists) {
        console.error('Error: Project already exists!');
      } else {
        this.formModel.projectId = selectedProject.projectId.toString();
        this.formModel.projectName = selectedProject.projectName;

        if (selectedProject.projectManagers) {
          try {
            const parsed = JSON.parse(selectedProject.projectManagers);
            this.formModel.manager =
              Array.isArray(parsed) && parsed[0]?.name ? parsed[0].name : '';
          } catch (e) {
            console.error('Error parsing projectManagers', e);
            this.formModel.manager = '';
          }
        } else {
          this.formModel.manager = '';
        }
      }
    } else {
      this.formModel.projectId = '';
      this.formModel.projectName = '';
      this.formModel.manager = '';
    }
  }

  getSymbol(status: string): string {
    switch (status) {
      case 'Green':
        return '↑';
      case 'Amber':
        return '→';
      case 'Red':
        return '↓';
      default:
        return '';
    }
  }

  
addProgressRow() {
  this.newProgressList.push({ task: '', status: '', remarks: '' });
}

addPlannedRow() {
  this.newPlannedList.push({ task: '', status: '', remarks: '' });
}
addIssueRow() {
  this.newIssueList.push({
    type: '',
    functionalArea: '',
    description: '',
    ActionRequired: '',
    dateRaised: '',
    resolveBy: '',
    IssueOwner: ''
  });
}

addRiskRow() {
  this.newRiskList.push({
    RiskDescription: '',
    mitigation: '',
    likelihood: '',
    RiskOwner: '',
    riskdate: '',
    riskresolvedate: ''
  });
}

  toggleProjectView(): void {
    this.showProjectView = !this.showProjectView;
  }

  isEditProjectStatus = false;
  isEditProjectDetails = false;
  isEditMode = false;
  editModeType: 'add' | 'project' | 'status' = 'add';
  // Save Project Details
  onEditProjectDetailsSave() {
    console.log('Saving Project Details...');

    const wsrId = this.formModel.id || ''; // ID from your existing form data

    const payload = {
      wsrReportDto: {
        // Populate WSRReportDto fields from formModel
        id: this.formModel.id,
        projectId: this.formModel.projectId,
        activity: this.formModel.activity,
        progress: this.formModel.progress,
        owner: this.formModel.owner,
        remarks: this.formModel.remarks,
        createdOn: new Date().toISOString(),
        createdBy: 'admin' // or dynamic user
      },
      wsrProjectDetailsDto: {
        teamSize: this.formModel.teamSize,
        technology: this.formModel.technology.join(','),
        customerLocation: this.formModel.customerLocation,
        businessDomain: this.formModel.businessDomain,
        projectType: this.formModel.projectType,
        projectStartDate: this.formModel.projectDates?.[0],
        projectEndDate: this.formModel.projectDates?.[1],
        description: this.formModel.description
      },
      wsrProjectStatusDto: null // only sending details in this case
    };

    this.wsrService.updateWSRReport(wsrId, payload).subscribe({
      next: (res) => {
        console.log('✅ Project Details Updated:', res);
        this.messageService.add({ severity: 'success', summary: 'Updated', detail: res.message || 'Project details updated successfully.' });
      },
      error: (err) => {
        console.error('❌ Error updating project details:', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update project details.' });
      },
      complete: () => {
        this.isEditMode = false;
        this.editModeType = 'add';
        this.displayAddFormDialog = false;
      }
    });
  }


  onEditProjectStatusSave() {
    console.log('Saving Project Status...');

    const wsrId = this.formModel.wsrReportId || ''; // ✅ make sure this is the WSRReport ID


    const payload = {
      wsrReportDto: null,
      wsrProjectDetailsDto: null,
      wsrProjectStatusDto: {
        id: wsrId, // If needed
        projectId: this.formModel.projectId || '',
        schedule: this.selectedStatuses['Schedule'],
        financial: this.selectedStatuses['Financial'],
        resource: this.selectedStatuses['Resource'],
        quality: this.selectedStatuses['Quality'],
        scope: this.selectedStatuses['Scope'],
        overallStatus: this.selectedStatuses['Overall Status'],
        plannedResource: this.formModel.plannedResource || 0,
        actualResource: this.formModel.actualResource || 0,
        measureTaken: this.formModel.measuresTaken,
        remarks: this.formModel.remarks,
        createdOn: new Date().toISOString(),
        createdBy: 'admin', // replace with logged-in user
        updatedOn: new Date().toISOString(),
        updatedBy: 'admin'  // replace with logged-in user
      }
    };

    this.wsrService.updateWSRReport(wsrId, payload).subscribe({
      next: (res) => {
        console.log('✅ Project Status Updated:', res);
        this.messageService.add({
          severity: 'success',
          summary: 'Updated',
          detail: res.message || 'Project status updated successfully.'
        });
      },
      error: (err) => {
        console.error('❌ Error updating project status:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update project status.'
        });
      },
      complete: () => {
        this.isEditMode = false;
        this.editModeType = 'add';
        this.displayAddFormDialog = false;
      }
    });
  }




  openAddFormDialog() {
    this.isEditProjectStatus = false;
    this.isEditProjectDetails = false;
    this.displayAddFormDialog = true;
  }

  editProjectDetails(project: any): void {
    this.isEditProjectDetails = true;
    this.isEditProjectStatus = false;

    // Pre-fill formModel from the selected project
    this.formModel.id = project.id;
    this.formModel.projectId = project.projectId;
    this.formModel.projectName = project.projectName;
    this.formModel.teamSize = project.teamSize;
    this.formModel.technology = project.technology?.split(',') || [];
    this.formModel.customerLocation = project.customerLocation;
    this.formModel.businessDomain = project.businessDomain;
    this.formModel.projectType = project.projectType;
    this.formModel.projectDates = [
      new Date(project.projectStartDate),
      new Date(project.projectEndDate)
    ];
    this.formModel.description = project.description;

    this.displayAddFormDialog = true;
  }


  editProjectStatus(project: any): void {
    this.isEditProjectStatus = true;
    this.isEditProjectDetails = false;

    this.formModel.id = project.statusId; // status ID (if you need it)
    this.formModel.wsrReportId = project.id; // ✅ the actual report ID
    this.formModel.projectId = project.projectId;

    this.formModel.measuresTaken = project.measureTaken;
    this.formModel.remarks = project.remarks;
    this.formModel.plannedResource = project.plannedResource;
    this.formModel.actualResource = project.actualResource;

    this.selectedStatuses = {
      'Schedule': project.schedule,
      'Financial': project.financial,
      'Resource': project.resource,
      'Quality': project.quality,
      'Scope': project.scope,
      'Overall Status': project.overallStatus
    };

    this.displayAddFormDialog = true;
  }






 submitForm(): void {

  if (!this.selectedProject) {
    console.error('❌ No project selected.');
    return;
  }

  if (!this.isFormValid()) {
    this.messageService.add({
      severity: 'warn',
      summary: 'Validation Error',
      detail: 'Please fill all required fields before submitting.'
    });
    return;
  }

  // 👉 Only push if values are valid (optional)
 if (this.newIssueList.length > 0) this.formModel.keyIssues = this.newIssueList;
if (this.newRiskList.length > 0) this.formModel.keyRisks = this.newRiskList;

   if (this.newProgressList.length > 0) this.formModel.progressData = this.newProgressList;
  if (this.newPlannedList.length > 0) this.formModel.plannedActivities = this.newPlannedList;

  const payload = {
    ...this.wsrPayloadService.buildPayload(
      this.formModel,
      this.resourceList,
      this.selectedStatuses,
      this.zohoEmployees
    ),
    projectType: this.formModel.projectType,
    projectDescription: this.formModel.projectDescription
  };

  console.log('📦 Submitting payload:', payload);

  this.wsrService.submitWSRReport(payload).subscribe({
    next: (res) => {
      console.log('✅ WSR submitted successfully');

      const alreadyExists = this.selectedProjects.some(
        p => p.projectName === this.selectedProject?.projectName
      );

      if (!alreadyExists && this.selectedProject) {
        this.selectedProjects.push({
          projectName: this.selectedProject.projectName,
          schedule: '',
          resource: '',
          financial: '',
          quality: '',
          scope: '',
          overallStatus: '',
          plannedResource: this.formModel.plannedResource,
          actualResource: this.formModel.actualResource,
          measureTaken: this.formModel.measuresTaken,
          remarks: this.formModel.remarks,
          projectDescription: this.formModel.projectDescription,
          progressData: this.formModel.progressData,
          plannedActivities: this.formModel.plannedActivities,
          keyIssues: this.formModel.keyIssues,
          keyRisks: this.formModel.keyRisks,
          id: undefined,
          wsrReportDto: undefined
        });
      }

      // ✅ Reset temporary form inputs to clear form
      this.newProgressList.push({ task: '', status: '', remarks: '' });
      this.newPlannedList.push({ task: '', status: '', remarks: '' });
      this.newIssueList = [{
  type: '',
  functionalArea: '',
  description: '',
  ActionRequired: '',
  dateRaised: '',
  resolveBy: '',
  IssueOwner: ''
}];

this.newRiskList = [{
  RiskDescription: '',
  mitigation: '',
  likelihood: '',
  RiskOwner: '',
  riskdate: '',
  riskresolvedate: ''
}];

      this.resetForm(); // Clear the full form if needed
      this.displayAddFormDialog = false;

      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: res?.message || 'Project added successfully!'
      });

      this.loadWSRReports?.();
    },
    error: (err) => {
      console.error('❌ WSR submission failed', err);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to add project.'
      });
    }
  });
}





  getProjectTypeId(label: string): number {
    const index = this.projectTypes.findIndex((pt) => pt.label === label);
    return index >= 0 ? index + 1 : 0;
  }

  resetForm(): void {
    this.formModel = {
      manager: null,
      reportDates: null,
      teamSize: null,
      technology: [],
      customerLocation: null,
      businessDomain: '',
      projectType: null,
      projectDates: null,
      projectDescription: '', // ✅ match name
      statuses: {},
      resourceRating: null,
      measuresTaken: '',
      remarks: '',
    };
    this.selectedResources = [];
    this.resourceRatings = {};
    this.selectedStatuses = {};
    this.selectedProject = null;
  }


  formatDateCustom(date: any): string {
    if (!date) return '';
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }

  async downloadPPT(): Promise<void> {
    const pptx = new PptxGenJS();

    pptx.layout = 'LAYOUT_WIDE';

    pptx.defineSlideMaster({
      title: 'MASTER_SLIDE',
      objects: [
        {
          text: {
            text: 'Page <#> of <#slideCount>',
            options:
            {
              x: 4.5, y: 6.8, fontSize: 9, align: 'center'
            }
          }
        },
        {
          image: {
            data: await this.convertImageToBase64('../assets/images/excelencia.png'),
            x: 9, y: 6.7, w: 0.6
          }
        }
      ]
    });


    const coverSlide = pptx.addSlide();
    coverSlide.background = { fill: 'ffffff' };

    coverSlide.addImage({
      data: await this.convertImageToBase64('../assets/images/Picture2.png'),
      x: 6.85, y: 0, w: 6.5, h: 3
    });

    coverSlide.addImage({
      data: await this.convertImageToBase64('../assets/images/Picture1.png'),
      x: 0, y: 4.5, w: 6.5, h: 3
    });


    coverSlide.addImage({
      data: await this.convertImageToBase64('../assets/images/excelencia.png'),
      x: 0.5, y: 0.7, w: 3, h: 0.8 // logo
    });

    coverSlide.addText('Digital Engineering Services - WSR', {
      x: 1.5, y: 3.3, w: '90%', fontFace: 'Lato', fontSize: 40, bold: true, color: '003366'
    });

    coverSlide.addText('RAG | Summary | Key Issues & Risks', {
      x: 1.5, y: 3.8, w: '90%', fontFace: 'Lato', fontSize: 24, color: '333333'
    });

    coverSlide.addText(this.getFormattedDate(new Date()), {
      x: 1.5, y: 4.2, w: '90%', fontFace: 'Lato', fontSize: 18, color: '555555'
    });

    // Utility to format table data with bold header
    const formatTableData = (table: string[][]) => {
      return table.map((row, idx) =>
        row.map(cell => ({
          text: cell,
          options: idx === 0 ? { bold: true } : {},
        }))
      );
    };

    // 1. Summary Slide
    const summarySlide = pptx.addSlide();

    const projectNames = this.selectedProjects
      .map(p => p?.projectName || 'Unnamed Project')
      .join(', ');

    summarySlide.addText(` ${projectNames}- Project Summary`, {
      x: 0.3, y: 1, fontSize: 24, fontFace: 'Lato', bold: true, w: '90%', color: '003366'
    });


    const summaryTable = [
      ['Project Name', 'Schedule', 'Resource', 'Financial', 'Quality', 'Scope', 'Overall Status', 'Planned Resource', 'Actual Resource', 'Measure Taken', 'Remarks'],
      ...this.selectedProjects.map(project => [
        project?.projectName ?? 'N/A',
        project?.schedule ?? 'N/A',
        project?.resource ?? 'N/A',
        project?.financial ?? 'N/A',
        project?.quality ?? 'N/A',
        project?.scope ?? 'N/A',
        project?.overallStatus ?? 'N/A',
        project?.plannedResource?.toString() ?? '0',
        project?.actualResource?.toString() ?? '0',
        project?.measureTaken ?? 'N/A',
        project?.remarks ?? 'N/A'
      ])
    ];

    summarySlide.addTable(
      formatTableData(summaryTable),
      {
        x: 0.5, y: 1.5, w: 9,
        colW: [1.2, 1, 1, 1, 1, 1, 1.1, 1, 1, 1.5, 1.5],
        border: { type: 'solid', color: '888888', pt: 1 },
        fontSize: 12, align: 'left'
      }
    );

    summarySlide.addImage({
      data: await this.convertImageToBase64('../assets/images/Picture4.png'),
      x: 10.85, y: 0, w: 2.5
    });

    summarySlide.addImage({
      data: await this.convertImageToBase64('../assets/images/Picture3.png'),
      w: 2.5, x: 0, y: 6.5
    });

    // 2. Project Slides
    for (const project of this.selectedProjects) {

      // Project Details Slide

      const slide = pptx.addSlide();

      // Slide Title
      slide.addText(`${project.projectName ?? 'Unnamed Project'} - Project Details`, {
        x: 0.3, y: 0.8, fontSize: 24, bold: true, w: '90%', color: '003366'
      });

      // 🔹 Project Metadata Table
      slide.addTable([
        [
          { text: 'Report Start Date', options: { color: '003366' } },
          { text: this.formatDate(project?.reportStartDate ?? ''), options: { color: '003366' } },
          { text: 'Report End Date', options: { color: '003366' } },
          { text: this.formatDate(project?.reportEndDate ?? ''), options: { color: '003366' } }
        ],
        [
          { text: 'Manager' },
          { text: project?.managerName ?? 'N/A', options: { color: '003366' } },
          { text: 'Team Size' },
          { text: project?.teamSize?.toString() ?? 'N/A', options: { color: '003366' } }
        ],
        [
          { text: 'Technology' },
          { text: project?.technology ?? 'N/A', options: { color: '003366' } },
          { text: 'Project Type' },
          { text: project?.projectType ?? 'N/A', options: { color: '003366' } }
        ],
        [
          { text: 'Customer Location' },
          { text: project?.customerLocation ?? 'N/A', options: { color: '003366' } },
          { text: 'Business Domain' },
          { text: project?.businessDomain ?? 'N/A', options: { color: '003366' } }
        ],
      ], {
        x: 0.4, y: 1.2,
        colW: [1.4, 2.1, 1.4, 1.5],
        border: { pt: 1, color: '4343f3' },
        fontSize: 12,
        fontFace: 'Lato'
      });

      // 🔹 Traffic Light & Status Table
      slide.addTable([
        [
          { text: 'Traffic Lights' },
          { text: '🔴 RED', options: { color: 'ff0000', border: [{ type: 'solid' }, { type: 'solid' }, { type: 'solid', color: 'FFA500', pt: 1.5 }, { type: 'none' }] } }, //top,bottom,left,right
          { text: '🟠 AMBER', options: { color: 'ff7300', border: [{ type: 'solid' }, { type: 'solid' }, { type: 'none' }, { type: 'none' }] } },
          { text: '🟢 GREEN', options: { color: '1c8003', border: [{ type: 'solid' }, { type: 'solid' }, { type: 'none' }, { type: 'none' }] } },
          { text: '⚪ NA', options: { color: '#9a9c9a', border: [{ type: 'solid' }, { type: 'solid' }, { type: 'none' }, { type: 'solid' }] } }
        ],
        [
          { text: 'Overall Project Status ↑' },
          { text: 'Schedule' + (project.schedule ?? 'N/A') },
          { text: 'Financial' + (project.financial ?? 'N/A') },
          { text: 'Resource' + (project.resource ?? 'N/A') },
          { text: 'Quality' + (project.quality ?? 'N/A') }
        ],
        [
          { text: '' },
          { text: 'Scope' + (project.scope ?? 'N/A') },
          { text: '' },
          { text: '' },
          { text: '' }
        ]
      ], {
        x: 7.2, y: 1.2,
        colW: [1.3, 1.1, 1.1, 1.1, 1.1],
        border: { pt: 1, color: 'AAAAAA' },
        fontSize: 12,
        fontFace: 'Lato'
      });
      // 🔹 Project Description Table

      slide.addTable(
        [
          [
            {
              text: 'Project (What we do / Description)',
              options: { bold: true, fontSize: 11, color: '003366', align: 'left', valign: 'top' }
            },
            {
              text: 'Project Start Date',
              options: { bold: true, fontSize: 11, color: '003366', align: 'center' }
            },
            {
              text: 'Project End Date',
              options: { bold: true, fontSize: 11, color: '003366', align: 'center' }
            }
          ],
          [
            {
              text: project.projectDescription || 'NA',
              options: { fontSize: 10, color: '333333', align: 'left', valign: 'top' }
            },
            {
              text: project.projectStartDate
                ? new Date(project.projectStartDate).toLocaleDateString('en-GB')
                : 'NA',
              options: { fontSize: 10, color: '333333', align: 'center' }
            },
            {
              text: project.projectEndDate
                ? new Date(project.projectEndDate).toLocaleDateString('en-GB')
                : 'NA',
              options: { fontSize: 10, color: '333333', align: 'center' }
            }
          ]
        ],
        {
          x: 0.5,
          y: 4.0,
          w: 8.5,
          colW: [5.5, 1.5, 1.5], // Adjust widths proportionally
          border: { pt: 1, color: 'AAAAAA' },
          fontFace: 'Lato',
          fontSize: 10,
          align: 'left',
          valign: 'top'
        }
      );






      // 🔹 Resource Ratings Header
      slide.addText('Resource Ratings', {
        x: 0.5, y: 5.2, fontSize: 12, bold: true, color: '003366'
      });

      // 🔹 Build table rows
      const resourceTableBody: PptxGenJS.TableRow[] = [
        [
          {
            text: 'Sl No', options: {
              bold: true, fontSize: 11, align: 'center', fill: { color: 'F2F2F2' }  // ✅ Correct
            }
          },
          {
            text: 'Resource Name', options: {
              bold: true, fontSize: 11, align: 'left', fill: { color: 'F2F2F2' }  // ✅ Correct
            }
          },
          {
            text: 'Rating Out of 5', options: {
              bold: true, fontSize: 11, align: 'center', fill: { color: 'F2F2F2' }  // ✅ Correct
            }
          }
        ]
      ];

      if (Array.isArray(project.resources) && project.resources.length > 0) {
        project.resources.forEach((item, index) => {
          const fillColor = index % 2 === 1 ? 'F2F2F2' : 'FFFFFF';
          resourceTableBody.push([
            {
              text: (item.sno ?? index + 1).toString(), options: {
                align: 'center', fill: { color: 'F2F2F2' }  // ✅ Correct
              }
            },
            {
              text: item.emp_Name || item.resourceName || 'N/A', options: {
                align: 'left', fill: { color: 'F2F2F2' }  // ✅ Correct
              }
            },
            {
              text: (item.rating ?? item.ratingOutOf5 ?? 'N/A').toString(), options: {
                align: 'center', fill: { color: 'F2F2F2' }  // ✅ Correct
              }
            }
          ]);
        });
      } else {
        resourceTableBody.push([
          { text: '-', options: { align: 'center' } },
          { text: 'No resource data available', options: { align: 'center', colspan: 2 } },
          {} // Empty cell because of colspan
        ]);
      }

      // 🔹 Add Table to Slide
      slide.addTable(resourceTableBody, {
        x: 0.5,
        y: 5.5,
        colW: [1.0, 5.5, 2.0],
        border: { pt: 1, color: 'AAAAAA' },  // ✅ Correct object (pt as number)

        fontSize: 10,
        align: 'left',
      });

      slide.addImage({
        data: await this.convertImageToBase64('../assets/images/Picture4.png'),
        x: 10.85, y: 0, w: 2.5
      });

      slide.addImage({
        data: await this.convertImageToBase64('../assets/images/Picture3.png'),
        w: 2.5, x: 0, y: 6.5
      });
      // Progress Slide
      const progressSlide = pptx.addSlide();
      progressSlide.addText(`${project.projectName} - Progress Report`, {
        x: 0.5, y: 0.3, fontSize: 18, bold: true, align: 'center', w: '90%', color: '003366'
      });

      if (project.progressData?.length) {
        const progressTable = [
          ['Sl No', 'Task', 'Status', 'Remarks'],
          ...project.progressData.filter(x => !x.active).map((item, index) => [
            (item.sno || index + 1).toString(),
            item.task || '',
            item.taskStatus || '',
            item.remarks || '',
          ])
        ];
        progressSlide.addText('Progress since last report & Key Achievements:', { x: 0.5, y: 1, fontSize: 14, bold: true });
        progressSlide.addTable(
          progressTable.map(row => row.map(cell => ({ text: cell }))),
          {
            x: 0.5, y: 1.4,
            colW: [1, 4, 2, 3],
            border: { pt: 1, color: 'AAAAAA' }
          }
        );
      }

      if (project.plannedActivities?.length) {
        const planTable = [
          ['Sl No', 'Task', 'Status', 'Remarks'],
          ...project.plannedActivities.filter(x => x.active).map((item, index) => [
            (item.sno || index + 1).toString(),
            item.task || '',
            item.taskStatus || '',
            item.remarks || ''
          ])
        ];
        progressSlide.addText('Activities Planned for Next Period:', { x: 0.5, y: 4.5, fontSize: 14, bold: true });
        progressSlide.addTable(
          planTable.map(row => row.map(cell => ({ text: cell }))),
          {
            x: 0.5, y: 4.9,
            colW: [1, 4, 2, 3],
            border: { pt: 1, color: 'AAAAAA' }
          }
        );
      }
      progressSlide.addImage({
        data: await this.convertImageToBase64('../assets/images/Picture4.png'),
        x: 10.85, y: 0, w: 2.5
      });

      progressSlide.addImage({
        data: await this.convertImageToBase64('../assets/images/Picture3.png'),
        w: 2.5, x: 0, y: 6.5
      });

      // 🔹 Key Issues & Key Risks Slide
      const issueSlide = pptx.addSlide();
      issueSlide.addImage({
        data: await this.convertImageToBase64('../assets/images/Picture4.png'),
        x: 10.85, y: 0, w: 2.5
      });

      issueSlide.addImage({
        data: await this.convertImageToBase64('../assets/images/Picture3.png'),
        w: 2.5, x: 0, y: 6.5
      });
      issueSlide.addText(`${project.projectName} - Key Issues & Key Risks`, {
        x: 0.5, y: 0.3, fontSize: 18, bold: true, align: 'center', w: '90%', color: '003366'
      });

      if (project.keyIssues?.length) {
        const issueTable = [
          ['Sl. No', 'Type', 'Functional Area', 'Issue Description', 'Actions', 'Raised On', 'Resolve By', 'Owner'],
          ...project.keyIssues.map((item, index) => [
            (index + 1).toString(),
            item.type || '',
            item.functionalArea || '',
            item.description || '',
            item.actionRequired || '',
            this.formatDateCustom(item.dateRaised),
            this.formatDateCustom(item.resolveBy),
            item.issueOwner || ''
          ])
        ];
        issueSlide.addText('Key Issues:', { x: 0.5, y: 1, fontSize: 14, bold: true });
        issueSlide.addTable(
          issueTable.map(row => row.map(cell => ({ text: cell }))),
          {
            x: 0.5, y: 1.4,
            colW: [0.8, 1.2, 1.5, 2, 1.8, 1.2, 1.2, 1.3],
            border: { pt: 1, color: 'AAAAAA' }
          }
        );
      }

      if (project.keyRisks?.length) {
        const riskTable = [
          ['Sl. No', 'Description', 'Mitigation', 'Likelihood', 'Owner', 'Raised On', 'Resolve By'],
          ...project.keyRisks.map((item, index) => [
            (index + 1).toString(),
            item.riskDescription || '',
            item.mitigation || '',
            item.likelihood || '',
            item.riskOwner || '',
            this.formatDateCustom(item.dateRaised),
            this.formatDateCustom(item.resolveBy),
          ])
        ];
        issueSlide.addText('Key Risks:', { x: 0.5, y: 5.8, fontSize: 14, bold: true });
        issueSlide.addTable(
          riskTable.map(row => row.map(cell => ({ text: cell }))),
          {
            x: 0.5, y: 6.2,
            colW: [0.8, 2, 2, 1.2, 1.2, 1.2, 1.2],
            border: { pt: 1, color: 'AAAAAA' }
          }
        );
      }
    }


    // 🔚 Thank You Slide
    const thanksSlide = pptx.addSlide();
    thanksSlide.addImage({
      data: await this.convertImageToBase64('../assets/images/Picture4.png'),
      x: 10.85, y: 0, w: 2.5
    });

    thanksSlide.addImage({
      data: await this.convertImageToBase64('../assets/images/Picture3.png'),
      w: 2.5, x: 0, y: 6.5
    });
    thanksSlide.addText('Thank You', {
      x: 0.5, y: 3.5, fontSize: 36, bold: true, align: 'center', w: '90%'
    });


    await pptx.writeFile({ fileName: `WSR_Report_${new Date().getTime()}.pptx` });
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    const d = new Date(dateString);
    return d.toLocaleDateString('en-GB');
  }



  async downloadPDF() {
    const body: any[][] = [
      [
        { text: 'Project Name', style: 'tableHeader' },
        { text: 'Schedule', style: 'tableHeader' },
        { text: 'Resource', style: 'tableHeader' },
        { text: 'Financial', style: 'tableHeader' },
        { text: 'Quality', style: 'tableHeader' },
        { text: 'Scope', style: 'tableHeader' },
        { text: 'Overall Status', style: 'tableHeader' },
        { text: 'Planned Resource', style: 'tableHeader' },
        { text: 'Actual Resource', style: 'tableHeader' },
        { text: 'Measure Taken', style: 'tableHeader' },
        { text: 'Remarks', style: 'tableHeader' },
      ],
    ];

    this.selectedProjects.forEach((project, index) => {
      const row: any[] = [
        { text: project?.projectName ?? 'N/A' },
        this.getStatusCell(project?.schedule ?? 'N/A'),
        this.getStatusCell(project?.resource ?? 'N/A'),
        this.getStatusCell(project?.financial ?? 'N/A'),
        this.getStatusCell(project?.quality ?? 'N/A'),
        this.getStatusCell(project?.scope ?? 'N/A'),
        this.getStatusCell(project?.overallStatus ?? 'N/A'),
        {
          text: project?.plannedResource?.toString() ?? '0',
          alignment: 'center',
        },
        {
          text: project?.actualResource?.toString() ?? '0',
          alignment: 'center',
        },
        { text: project?.measureTaken ?? 'N/A' },
        { text: project?.remarks ?? 'N/A' },
      ];

      // Alternate row background color
      if (index % 2 === 1) {
        for (let i = 0; i < row.length; i++) {
          if (typeof row[i] === 'object') {
            row[i].fillColor = '#f2f2f2';
          }
        }
      }

      body.push(row);
    });

    const logoBase64 = await this.convertImageToBase64(
      './assets/images/excelencia.png'
    );

    const individualProjectPages = this.selectedProjects.map((project) => {
      const progressData: ProgressItem[] =
        project?.progressData || project?.keyAchievements || [];
      const plannedActivities: ProgressItem[] =
        project?.plannedActivities || project?.nextPeriodActivities || [];
      const resourceData: ResourceItem[] =
        project?.resourceData || project?.resources || [];
      console.log('ResourceData inside PDF:', resourceData);
      const TableLayoutStyle = {
        hLineWidth: () => 0.5,
        vLineWidth: () => 0.5,
        hLineColor: () => '#aaa',
        vLineColor: () => '#aaa',
        paddingLeft: () => 8,
        paddingRight: () => 8,
        paddingTop: () => 6,
        paddingBottom: () => 6,
      };
      return [
        //  Progress Report
        {
          pageBreak: 'before',
          stack: [

            {
              image: 'Top2Design',
              width: 150, // 👈 Smaller image width
              absolutePosition: { x: 700, y: 0 } // 👈 Push image to bottom of A4 (842 - image height)
            },
            // Title
            {
              text: project.projectName + ' - Project Details',
              style: 'projectTitleHeader',
              alignment: 'center',
              margin: [0, 0, 0, 20],
            },

            // Project Information Table
            {
              columns: [
                {
                  width: '50%',
                  table: {
                    widths: ['25%', '25%', '25%', '25%'],
                    body: [
                      [
                        { text: 'Report Start Date', style: 'infoLabel' },
                        {
                          text: project.reportStartDate
                            ? new Date(project.reportStartDate).toLocaleDateString('en-GB') // or use custom formatter
                            : 'N/A',
                          style: 'infoValue',
                        },
                        { text: 'Report End Date', style: 'infoLabel' },
                        {
                          text: project.reportEndDate
                            ? new Date(project.reportEndDate).toLocaleDateString('en-GB')
                            : 'N/A',
                          style: 'infoValue',
                        },
                      ],

                      [
                        { text: 'Manager', style: 'infoLabel' },
                        { text: project.managerName || 'N/A', style: 'infoValue', color: '#0066cc' },
                        { text: 'Team Size', style: 'infoLabel' },
                        { text: project.teamSize || 'N/A', style: 'infoValue', color: '#0066cc' },
                      ],
                      [
                        { text: 'Technology', style: 'infoLabel' },
                        { text: project.technology || 'N/A', style: 'infoValue', color: '#0066cc' },
                        { text: 'Project Type', style: 'infoLabel' },
                        { text: project.projectType || 'N/A', style: 'infoValue', color: '#0066cc' },
                      ],
                      [
                        { text: 'Customer Location', style: 'infoLabel' },
                        { text: project.customerLocation || 'N/A', style: 'infoValue', color: '#0066cc' },
                        { text: 'Business Domain', style: 'infoLabel' },
                        { text: project.businessDomain || 'N/A', style: 'infoValue', color: '#0066cc' },
                      ],
                    ],
                  },
                  layout: TableLayoutStyle,
                  margin: [0, 0, 5, 0],
                },

                // Traffic Light Status Table

                {
                  table: {
                    widths: ['20%', '20%', '20%', '20%', '20%'],
                    body: [
                      // Row 1: Legend Header
                      [
                        { text: 'Traffic Lights', style: 'infoLabel', fillColor: '#e6e6e6', alignment: 'center', margin: [0, 5, 0, 0] },
                        { text: '🔴 RED', style: 'infoLabel', color: 'red', alignment: 'center', margin: [0, 5, 0, 0] },
                        { text: '🟠 AMBER', style: 'infoLabel', color: 'orange', alignment: 'center', margin: [0, 5, 0, 0] },
                        { text: '🟢 GREEN', style: 'infoLabel', color: 'green', alignment: 'center', margin: [0, 5, 0, 0] },
                        { text: '⚪ NA', style: 'infoLabel', alignment: 'center', margin: [0, 5, 0, 0] },
                      ],

                      // Row 2: First set of ratings with only colored emojis
                      [
                        { text: 'Overall Project Status ↑', style: 'trafficCell', bold: true, alignment: 'center', border: [true, true, true, false], margin: [0, 7, 0, 0] },
                        { text: '🟢', style: 'trafficCell', alignment: 'center', border: [true, true, false, false], margin: [0, 7, 0, 0] },  // Financial
                        { text: '🟢', style: 'trafficCell', alignment: 'center', border: [false, true, false, false], margin: [0, 7, 0, 0] }, // Schedule
                        { text: '🟠', style: 'trafficCell', alignment: 'center', border: [false, true, false, false], margin: [0, 7, 0, 0] }, // Resource
                        { text: '🔴', style: 'trafficCell', alignment: 'center', border: [false, true, true, false], margin: [0, 7, 0, 0] },  // Quality
                      ],

                      // Row 3: Continuation with only symbols
                      [
                        { text: '', style: 'trafficCell', border: [true, false, false, true] },
                        { text: '⚪', style: 'trafficCell', alignment: 'center', border: [true, false, false, true], margin: [0, 0, 0, 7] }, // Scope
                        { text: '', style: 'trafficCell', border: [false, false, false, true] },
                        { text: '', style: 'trafficCell', border: [false, false, false, true] },
                        { text: '', style: 'trafficCell', border: [false, false, true, true] }
                      ],
                    ]
                  },
                  layout: {
                    hLineWidth: (): number => 0.5,
                    vLineWidth: (): number => 0.5,
                    hLineColor: (): string => '#aaa',
                    vLineColor: (): string => '#aaa',
                  },
                  margin: [0, 10, 0, 10],
                },


              ],
            },

            // Project Description
            {
              columns: [
                {
                  width: '100%',
                  table: {
                    widths: ['70%', '15%', '15%'],
                    body: [
                      [
                        { text: 'Project (What we do / Description)', style: 'infoLabel' },
                        { text: 'Project Start Date', style: 'infoLabel' },
                        { text: 'Project End Date', style: 'infoLabel' },
                      ],
                      [
                        { text: project.projectDescription || 'NA', style: 'infoValue' },
                        {
                          text: project.projectStartDate
                            ? new Date(project.projectStartDate).toLocaleDateString('en-GB') // or 'en-US'
                            : 'NA',
                          style: 'infoValue',
                        },
                        {
                          text: project.projectEndDate
                            ? new Date(project.projectEndDate).toLocaleDateString('en-GB')
                            : 'NA',
                          style: 'infoValue',
                        },
                      ],

                    ],
                  },
                  layout: TableLayoutStyle,
                  margin: [0, 10, 0, 0],
                },
              ],
            },

            // Resource Ratings Table
            {
              text: 'Resource Ratings',
              style: 'sectionHeader',
              margin: [0, 20, 0, 8],
            },
            {
              table: {
                headerRows: 1,
                widths: [40, 400, 40],
                body: [
                  [
                    { text: 'Sl No', style: 'resourceTableHeader' },
                    { text: 'Resource Name', style: 'resourceTableHeader' },
                    { text: 'Rating Out of 5', style: 'resourceTableHeader' },
                  ],
                  ...(
                    Array.isArray(project.resources) && project.resources.length > 0
                      ? project.resources.map((item: ResourceItem, index: number) => [
                        {
                          text: (item.sno || index + 1).toString(),
                          alignment: 'center',
                          fillColor: index % 2 === 1 ? '#f2f2f2' : null,
                        },
                        {
                          text: item.emp_Name || item.resourceName || 'N/A',
                          fillColor: index % 2 === 1 ? '#f2f2f2' : null,
                        },
                        {
                          text: (
                            item.rating !== undefined
                              ? item.rating
                              : item.ratingOutOf5 || 'N/A'
                          ).toString(),
                          alignment: 'center',
                          fillColor: index % 2 === 1 ? '#f2f2f2' : null,
                        },
                      ])
                      : [[
                        { text: '-', alignment: 'center' },
                        { text: 'No resource data available', colSpan: 2, alignment: 'center' },
                        {},
                      ]]
                  ),
                ],
              },
              layout: {
                hLineWidth: (): number => 0.5,
                vLineWidth: (): number => 0.5,
                hLineColor: (): string => '#aaa',
                vLineColor: (): string => '#aaa',
                paddingLeft: (): number => 6,
                paddingRight: (): number => 6,
                paddingTop: (): number => 5,
                paddingBottom: (): number => 5,
              },

            },
            {
              image: 'Bottom2Design',
              width: 150, // 👈 Smaller image width
              absolutePosition: { x: 0, y: 515 } // 👈 Push image to bottom of A4 (842 - image height)
            },
          ],

        },


        // Page 2: Project Details (Aligned with HTML view)
        {
          pageBreak: 'before',
          stack: [
            {
              image: 'Top2Design',
              width: 150, // 👈 Smaller image width
              absolutePosition: { x: 700, y: 0 } // 👈 Push image to bottom of A4 (842 - image height)
            },
            {
              columns: [
                { text: '', style: 'companyHeader', width: '*' },
                { text: '', width: 100 },
              ],
              margin: [0, 0, 0, 10],
            },
            {
              text: project.projectName + ' - Progress Report',
              style: 'projectTitleHeader',
              alignment: 'center',
              margin: [0, 0, 0, 20],
            },

            // Progress Table
            ...(progressData?.length > 0
              ? [
                {
                  text: 'Progress since last report & Key Achievements:',
                  style: 'sectionHeader',
                  margin: [0, 0, 0, 10],
                },
                {
                  table: {
                    headerRows: 1,
                    widths: [30, '*', 80, 100],
                    body: [
                      [
                        { text: 'Sl No', style: 'progressTableHeader' },
                        { text: 'Task', style: 'progressTableHeader' },
                        { text: 'Status', style: 'progressTableHeader' },
                        { text: 'Remarks', style: 'progressTableHeader' },
                      ],
                      ...progressData.filter(x =>!x.active).map((item, index) => [
                        {
                          text: (item.sno || index + 1).toString(),
                          alignment: 'center',
                          fillColor: index % 2 ? '#e6f3ff' : 'white',
                        },
                        {
                          text: item.task || '',
                          fillColor: index % 2 ? '#e6f3ff' : 'white',
                        },
                        {
                          text: item.taskStatus || '',
                          alignment: 'center',
                          fillColor: index % 2 ? '#e6f3ff' : 'white',
                        },
                        {
                          text: item.remarks || '',
                          fillColor: index % 2 ? '#e6f3ff' : 'white',
                        },
                      ]),
                    ],
                  },
                  layout: {
                    hLineWidth: (): number => 0.5,
                    vLineWidth: (): number => 0.5,
                    hLineColor: (): string => '#aaa',
                    vLineColor: (): string => '#aaa',
                    paddingLeft: (): number => 8,
                    paddingRight: (): number => 8,
                    paddingTop: (): number => 6,
                    paddingBottom: (): number => 6,
                  },
                  margin: [0, 0, 0, 30],
                },
              ]
              : []),

            // Planned Activities Table
            ...(plannedActivities?.length > 0
              ? [
                {
                  text: 'Activities Planned for Next Period:',
                  style: 'sectionHeader',
                  margin: [0, 0, 0, 10],
                },
                {
                  table: {
                    headerRows: 1,
                    widths: [30, '*', 80, 100],
                    body: [
                      [
                        { text: 'Sl No', style: 'progressTableHeader' },
                        { text: 'Task', style: 'progressTableHeader' },
                        { text: 'Status', style: 'progressTableHeader' },
                        { text: 'Remarks', style: 'progressTableHeader' },
                      ],
                      ...plannedActivities.filter(x => x.active).map((item, index) => [
                        {
                          text: (item.sno || index + 1).toString(),
                          alignment: 'center',
                          fillColor: index % 2 ? '#e6f3ff' : 'white',
                        },
                        {
                          text: item.task || '',
                          fillColor: index % 2 ? '#e6f3ff' : 'white',
                        },
                        {
                          text: item.taskStatus || '',
                          alignment: 'center',
                          fillColor: index % 2 ? '#e6f3ff' : 'white',
                        },
                        {
                          text: item.remarks || '',
                          fillColor: index % 2 ? '#e6f3ff' : 'white',
                        },
                      ]),
                    ],
                  },
                  layout: {
                    hLineWidth: (): number => 0.5,
                    vLineWidth: (): number => 0.5,
                    hLineColor: (): string => '#aaa',
                    vLineColor: (): string => '#aaa',
                    paddingLeft: (): number => 8,
                    paddingRight: (): number => 8,
                    paddingTop: (): number => 6,
                    paddingBottom: (): number => 6,
                  },
                },
              ]
              : []),
            {
              image: 'Bottom2Design',
              width: 150, // 👈 Smaller image width
              absolutePosition: { x: 0, y: 515 } // 👈 Push image to bottom of A4 (842 - image height)
            },
          ],
        },
        // Page 3: Key Issues & Key Risks (Aligned with HTML view)
        {
          pageBreak: 'before',
          stack: [
            {
              image: 'Top2Design',
              width: 150, // 👈 Smaller image width
              absolutePosition: { x: 700, y: 0 } // 👈 Push image to bottom of A4 (842 - image height)
            },
            // Header
            {
              columns: [
                { text: '', style: 'companyHeader', width: '*' },
                { text: '', width: 100 },
              ],
              margin: [0, 0, 0, 10],
            },

            // Title
            {
              text: `${project.projectName || 'Project'
                } - Key Issues & Key Risks`,
              style: 'projectTitleHeader',
              alignment: 'center',
              margin: [0, 0, 0, 20],
            },

            // Key Issues Section
            ...(project.keyIssues?.length
              ? [
                {
                  text: 'Key Issues:',
                  style: 'sectionHeader',
                  margin: [0, 0, 0, 10],
                },
                {
                  table: {
                    headerRows: 1,
                    widths: [30, '*', '*', '*', '*', '*', '*', '*'],
                    body: [
                      [
                        { text: 'Sl. No', style: 'progressTableHeader' },
                        { text: 'Type', style: 'progressTableHeader' },
                        {
                          text: 'Functional Area Impacted',
                          style: 'progressTableHeader',
                        },
                        {
                          text: 'Issue including description of Impact',
                          style: 'progressTableHeader',
                        },
                        {
                          text: 'Actions required to resolve Issue',
                          style: 'progressTableHeader',
                        },
                        {
                          text: 'Date that Issue was raised',
                          style: 'progressTableHeader',
                        },
                        {
                          text: 'To be resolved by when?',
                          style: 'progressTableHeader',
                        },
                        { text: 'Issue Owner', style: 'progressTableHeader' },
                      ],
                      ...project.keyIssues.map((item, index) => [
                        {
                          text: (index + 1).toString(),
                          alignment: 'center',
                          fillColor: index % 2 ? '#e6f3ff' : 'white',
                        },
                        {
                          text: item.type || '',
                          fillColor: index % 2 ? '#e6f3ff' : 'white',
                        },
                        {
                          text: item.functionalArea || '',
                          fillColor: index % 2 ? '#e6f3ff' : 'white',
                        },
                        {
                          text: item.description || '',
                          fillColor: index % 2 ? '#e6f3ff' : 'white',
                        },
                        {
                          text: item.actionRequired || '',
                          fillColor: index % 2 ? '#e6f3ff' : 'white',
                        },
                        {
                          text: this.formatDateCustom(item.dateRaised),
                          fillColor: index % 2 ? '#e6f3ff' : 'white',
                        },
                        {
                          text: this.formatDateCustom(item.resolveBy),
                          fillColor: index % 2 ? '#e6f3ff' : 'white',
                        },

                        {
                          text: item.issueOwner || '',
                          fillColor: index % 2 ? '#e6f3ff' : 'white',
                        },
                      ]),
                    ],
                  },
                  layout: {
                    hLineWidth: (): number => 0.5,
                    vLineWidth: (): number => 0.5,
                    hLineColor: (): string => '#aaa',
                    vLineColor: (): string => '#aaa',
                    paddingLeft: (): number => 8,
                    paddingRight: (): number => 8,
                    paddingTop: (): number => 6,
                    paddingBottom: (): number => 6,
                  },
                  margin: [0, 0, 0, 20],
                               },
              ]
              : []),

            // Key Risks Section
            ...(project.keyRisks?.length
              ? [
                {
                  text: 'Key Risks:',
                  style: 'sectionHeader',
                  margin: [0, 0, 0, 10],
                },
                {
                  table: {
                    headerRows: 1,
                    widths: [30, '*', '*', 80, '*', '*', '*'],
                    body: [
                      [
                        { text: 'Sl. No', style: 'progressTableHeader' },
                        {
                          text: 'Risk Description',
                          style: 'progressTableHeader',
                        },
                        { text: 'Mitigation', style: 'progressTableHeader' },
                        {
                          text: 'Likelihood of Occurrence (VH - VL)',
                          style: 'progressTableHeader',
                        },
                        { text: 'Risk Owner', style: 'progressTableHeader' },
                        { text: 'Date Raised', style: 'progressTableHeader' },
                        {
                          text: 'Date to be resolved',
                          style: 'progressTableHeader',
                        },
                      ],
                      ...project.keyRisks.map((item, index) => [
                        {
                          text: (index + 1).toString(),
                          alignment: 'center',
                          fillColor: index % 2 ? '#e6f3ff' : 'white',
                        },
                        {
                          text: item.riskDescription || '',
                          fillColor: index % 2 ? '#e6f3ff' : 'white',
                        },
                        {
                          text: item.mitigation || '',
                          fillColor: index % 2 ? '#e6f3ff' : 'white',
                        },
                        {
                          text: item.likelihood || '',
                          alignment: 'center',
                          fillColor: index % 2 ? '#e6f3ff' : 'white',
                        },
                        {
                          text: item.riskOwner || '',
                          fillColor: index % 2 ? '#e6f3ff' : 'white',
                        },
                        {
                          text: this.formatDateCustom(item.dateRaised),
                          fillColor: index % 2 ? '#e6f3ff' : 'white',
                        },
                        {
                          text: this.formatDateCustom(item.resolveBy),
                          fillColor: index % 2 ? '#e6f3ff' : 'white',
                        },

                      ]),
                    ],
                  },
                  layout: {
                    hLineWidth: (): number => 0.5,
                    vLineWidth: (): number => 0.5,
                    hLineColor: (): string => '#aaa',
                    vLineColor: (): string => '#aaa',
                    paddingLeft: (): number => 8,
                    paddingRight: (): number => 8,
                    paddingTop: (): number => 6,
                    paddingBottom: (): number => 6,
                  },
                },
              ]
              : []),
            {
              image: 'Bottom2Design',
              width: 150, // 👈 Smaller image width
              absolutePosition: { x: 0, y: 515 } // 👈 Push image to bottom of A4 (842 - image height)
            },
          ],
        },

        // Page 4: Thank You Page (Aligned with HTML view)
        {
          pageBreak: 'before',
          stack: [
            {
              image: 'TopDesign',
              width: 432,
              absolutePosition: { x: 415, y: 0 },
              // adjust Y for true bottom
            },
            {
              columns: [
                {
                  text: '', // No company name
                  style: 'companyHeader',
                  width: '*',
                },
                {
                  text: '', // Placeholder for logo
                  width: 100,
                },
              ],
              margin: [0, 0, 0, 10],
            },
            {
              text: 'Thank You',
              style: 'projectTitleHeader',
              alignment: 'center',
              margin: [0, 150, 0, 10],
            },
            {
              image: 'bottomDesign',
              width: 432,
              absolutePosition: { x: 0, y: 365 },
              // adjust Y for true bottom
            },
          ],
        },
      ];
    });



    const docDefinition: any = {
      background: (
        _currentPage: number,
        pageSize: { width: number; height: number }
      ) => {
        return {
          text: 'Confidential',
          color: '#e0e0e0',
          opacity: 0.2,
          bold: true,
          fontSize: 60,
          alignment: 'center',
          rotation: -45,
          margin: [0, pageSize.height / 2 - 50],
        };
      },

      footer: (currentPage: number, pageCount: number) => {
        if (currentPage === 1) return '';
        return {
          columns: [
            { text: '' },
            {
              text: `Page ${currentPage} of ${pageCount}`,
              alignment: 'center',
              fontSize: 9,
            },
            {
              image: 'logo',
              width: 50,
              alignment: 'right',
              margin: [0, 0, 10, 0],
            },
          ],
          margin: [10, 5],
        };
      },

      images: {
        logo: await this.convertImageToBase64(
          '../assets/images/excelencia.png'
        ),
        bottomDesign: await this.convertImageToBase64(
          '../assets/images/Picture1.png'
        ),
        TopDesign: await this.convertImageToBase64(
          '../assets/images/Picture2.png'
        ),
        Bottom2Design: await this.convertImageToBase64(
          '../assets/images/Picture3.png'
        ),
        Top2Design: await this.convertImageToBase64(
          '../assets/images/Picture4.png'
        )
      },

      pageOrientation: 'Landscape',
      pageMargins: [40, 60, 40, 60],

      content: [
        // 🎯 COVER PAGE
        {
          stack: [
            {
              image: 'TopDesign',
              width: 432,
              absolutePosition: { x: 415, y: 0 },
              // adjust Y for true bottom
            },
            {
              image: 'logo',
              width: 120,
              alignment: 'left',
              margin: [0, 0, 0, 20],
            },

            {
              text: 'Digital Engineering Services - WSR',
              style: 'coverTitle',
              alignment: 'center',
              margin: [0, 60, 0, 10],
            },
            {
              text: 'RAG | Summary | Key Issues & Risks',
              style: 'coverSubtitle',
              alignment: 'center',
            },
            {
              text: this.getFormattedDate(new Date()), // ✅ Correct usage
              style: 'coverDate',
              alignment: 'center',
              margin: [0, 10, 0, 0],
            },
            {
              image: 'bottomDesign',
              width: 432,
              absolutePosition: { x: 0, y: 365 },
              // adjust Y for true bottom
            },
          ],
          // alignment: 'center', // Center the whole stack
          pageBreak: 'after',
        },

        // 🎯 REPORT STARTS HERE
        {
          stack: [

            {
              image: 'Top2Design',
              width: 150, // 👈 Smaller image width
              absolutePosition: { x: 700, y: 0 } // 👈 Push image to bottom of A4 (842 - image height)
            },
            {
              text: 'Project Status Report',
              style: 'projectTitleHeader',
              alignment: 'center',
              margin: [0, 0, 0, 15],
            },
            {
              table: {
                headerRows: 1,
                widths: [70, 50, 50, 50, 50, 50, 50, 60, 55, 55, 65, 65],
                body: body,
              },
              layout: {
                fillColor: (rowIndex: number) => {
                  return rowIndex === 0
                    ? '#003366'
                    : rowIndex % 2 === 0
                      ? '#f8f9fa'
                      : null;
                },
                paddingLeft: () => 6,
                paddingRight: () => 6,
                paddingTop: () => 4,
                paddingBottom: () => 4,
                hLineWidth: () => 0.5,
                vLineWidth: () => 0.5,
                hLineColor: () => '#ccc',
                vLineColor: () => '#ccc',
              },
              margin: [30, 0, 30, 20],
            },
            {
              image: 'Bottom2Design',
              width: 150, // 👈 Smaller image width
              absolutePosition: { x: 0, y: 515 } // 👈 Push image to bottom of A4 (842 - image height)
            },


          ],
        },

        // 🎯 Project-specific pages
        ...individualProjectPages.flat(),
      ],

      styles: {
        coverTitle: {
          fontSize: 28,
          bold: true,
          color: '#003366',
        },
        coverSubtitle: {
          fontSize: 16,
          color: '#333',
          margin: [0, 10, 0, 0],
        },
        coverDate: {
          fontSize: 12,
          italics: true,
          color: '#555',
        },
        header: {
          fontSize: 20,
          bold: true,
          margin: [0, 0, 0, 12],
        },
        vibrantHeader: {
          fontSize: 20,
          bold: true,
          color: '#1F4E79',
          margin: [0, 20, 0, 8],
          decoration: 'underline',
        },
        projectTitleHeader: {
          fontSize: 16,
          bold: true,
          color: '#003366',
          margin: [0, 0, 0, 10],
        },
        sectionHeader: {
          fontSize: 12,
          bold: true,
          margin: [0, 10, 0, 5],
        },
        tableHeader: {
          fillColor: '#003366',
          color: 'white',
          bold: true,
          fontSize: 11,
          alignment: 'center',
        },
        progressTableHeader: {
          fillColor: '#4472C4',
          color: 'white',
          bold: true,
          fontSize: 10,
          alignment: 'center',
        },
        resourceTableHeader: {
          fillColor: '#4472C4',
          color: 'white',
          bold: true,
          fontSize: 9,
          alignment: 'center',
        },
        infoLabel: {
          fontSize: 9,
          bold: true,
          margin: [0, 2, 0, 2],
        },
        infoValue: {
          fontSize: 9,
          margin: [0, 2, 0, 2],
        },
        defaultStyle: {
          fontSize: 9,
          wordBreak: 'break-word',
        },
        styles: {
          infoLabel: {
            fontSize: 10,
            bold: true,
            margin: [2, 4, 2, 4],
          },
          trafficHeader: {
            fontSize: 12,
            bold: true,
            fillColor: '#f5f5f5',
          },
          trafficCell: {
            fontSize: 11,
            alignment: 'center',
            margin: [0, 6, 0, 6],
          },
        },

        green: { color: 'green' },
        red: { color: 'red' },
        amber: { color: 'orange' },
      },
    };

    pdfMake.createPdf(docDefinition).download('Project-Status-Report.pdf');
  }
  getFormattedDate(date: Date | string): string {
    const d = new Date(date);
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    };
    return d.toLocaleDateString('en-GB', options); // e.g., "13 June 2025"
  }

  getStatusCell(status: string) {
    const styleMap: Record<string, string> = {
      green: 'green',
      red: 'red',
      amber: 'orange',
    };
    return {
      text: status?.toUpperCase() || '',
      style: styleMap[status?.toLowerCase()] || '',
    };
  }

  convertImageToBase64(imagePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      // To handle CORS if needed
      img.crossOrigin = 'anonymous';
      img.src = imagePath;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Unable to get canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL('image/png');
        resolve(dataURL);
      };
      img.onerror = (error) => {
        reject(new Error(`Image load error for path: ${imagePath}`));
      };
    });
  }
}
