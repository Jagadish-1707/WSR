import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WsrService } from '../master/services/wsr.service';
import { ZohoService } from '../master/services/zoho.service';
import { ZohoDataService } from '../master/services/zoho-data.service';
import { MessageService, SelectItem } from 'primeng/api';
import { WSRDropdownItem } from '../master/models/wsr-data.model';
import { ZohoClient } from '../master/models/ZohoClient';
import { ZohoProject } from '../master/models/ZohoProject';
import { ZohoEmp } from '../master/models/ZohoEmp';
import { MultiSelectModule } from 'primeng/multiselect';
import { PanelModule } from 'primeng/panel';
import { DialogModule } from 'primeng/dialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
import { WsrPayloadService } from '../utils/wsr-payload.service';


interface ProgressItem {
  sno?: number;
  task: string;
  status: string;
  remarks: string;
}

interface ResourceItem {
  zohoemp_id: string;
  resourcename: string;
  rating: number | null;
}
 

interface ProjectData {
  id: any;
  wsrReportDto: any;
  projectId?: string; // ✅ Add this line
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
  projectDescription?: string;
  

  progressData?: { task: string; TaskStatus: string; remarks: string }[];
  keyAchievements?: ProgressItem[];
  plannedActivities?: { task: string; TaskStatus: string; remarks: string }[];
  nextPeriodActivities?: ProgressItem[];

  resourceData?: ResourceItem[];
  resources?: ResourceItem[];

  startDate?: string;
  endDate?: string;
  manager?: string;
  teamSize?: string;
  technology?: string;
  projectType?: string;
  customerLocation?: string;
  businessDomain?: string;
  description?: string;

  keyIssues?: {
  type: string;
  functionalArea: string;
  description: string;
  ActionRequired: string;
  dateRaised: string;
  resolveBy: string;
  IssueOwner: string;
}[];
keyRisks?: {
  RiskDescription: string;
  mitigation: string;
  likelihood: string;
  RiskOwner: string;
  riskdate: string;
  riskresolvedate: string;
}[]
}

@Component({
  selector: 'app-wsr-details',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    DropdownModule,
    CalendarModule,
    TableModule,
    TooltipModule,
    MultiSelectModule,
    PanelModule,
    DialogModule,
    InputTextareaModule,
    InputTextModule,
    CheckboxModule,
    ToastModule
  ],
  templateUrl: './wsr-details.component.html',
  styleUrls: ['./wsr-details.component.scss']
})
export class WSRDetailsComponent implements OnInit {
  taskData: any[] = [];
  selectedMonth: Date = new Date(); 
  wsrData: any = [];
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
  zohoEmployees: ZohoEmp[] = [];
  zohoFullProjects: ZohoProject[] = [];
  resourceNames: { label: string; value: string }[] = [];
  resourceList: {
    zohoemp_id: string;
    resourcename: string;
    rating: number;
  }[] = [];
 

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
    description: '',
    statuses: {},
    resourceRating: null,
    measuresTaken: '',
    remarks: '',
    progressData: [],
  plannedActivities: [],
  keyIssues: [],
  keyRisks: [],
  };

  // Dropdown options
  clients: { label: string; value: string; }[] = [];

  // project = [{ label: 'Complete solar', value: 'Complete solar' }, { label: 'Sanmina', value: 'Sanmina' }];
  managers = [{ label: 'Alice Brown', value: 'Alice Brown' }, { label: 'Bob Johnson', value: 'Bob Johnson' }];
  teamSizes = [{ label: '5', value: '5' }, { label: '10', value: '10' }, { label: '15', value: '15' }];
  technologies = [{ label: 'Angular', value: 'Angular' }, { label: 'Node.js', value: 'Node.js' }, { label: 'Vue js', value: 'Vue js' }];
  locations = [{ label: 'New York', value: 'New York' }, { label: 'London', value: 'London' }];
  projectTypes: { label: string; value: string }[] = [];
  statusFields = ['Schedule', 'Financial', 'Resource', 'Quality', 'Scope', 'Overall Status'];
  statusOptions = [
    { label: 'Green', value: 'Green' },
    { label: 'Amber', value: 'Amber' },
    { label: 'Red', value: 'Red' }
  ];
  selectedStatuses: { [key: string]: string } = {};
  newProgress = { task: '', status: '', remarks: '' };
newPlanned = { task: '', status: '', remarks: '' };
newIssue = { type: '', functionalArea: '', description: '', ActionRequired: '', dateRaised: '', resolveBy: '', IssueOwner: '' };
newRisk = { RiskDescription: '', mitigation: '', likelihood: '', RiskOwner: '', riskdate: '', riskresolvedate: '' };

// formModel = {
//   progressData: [],
//   plannedActivities: [],
//   keyIssues: [],
//   keyRisks: [],
//   // ... your other fields
// };

addProgressItemToForm() {
  if (this.newProgress.task && this.newProgress.status) {
    this.formModel.progressData.push({ ...this.newProgress });
    this.newProgress = { task: '', status: '', remarks: '' };
  }
}

addPlannedItemToForm() {
  if (this.newPlanned.task && this.newPlanned.status) {
    this.formModel.plannedActivities.push({ ...this.newPlanned });
    this.newPlanned = { task: '', status: '', remarks: '' };
  }
}

addKeyIssueToForm() {
  if (this.newIssue.description && this.newIssue.type) {
    this.formModel.keyIssues.push({ ...this.newIssue });
    this.newIssue = { type: '', functionalArea: '', description: '', ActionRequired: '', dateRaised: '', resolveBy: '', IssueOwner: '' };
  }
}

addKeyRiskToForm() {
  if (this.newRisk.RiskDescription && this.newRisk.mitigation) {
    this.formModel.keyRisks.push({ ...this.newRisk });
    this.newRisk = { RiskDescription: '', mitigation: '', likelihood: '', RiskOwner: '', riskdate: '', riskresolvedate: '' };
  }
}



  ratings = Array.from({ length: 51 }, (_, i) => {
    const value = i * 0.1;
    return { label: value.toFixed(1), value };
  });
  resourceCounts = Array.from({ length: 20 }, (_, i) => {
    const value = i + 1;
    return { label: value.toString(), value };
  });
  getAllZohoProjects: any;

  // Ratings keyed by resource name
  // resourceRatings: { [resourceName: string]: number } = {};
  isFormValid(): boolean {
  // Add your actual validation logic here
  return (
    !!this.formModel.projectId &&
    !!this.formModel.reportDates &&
    !!this.selectedProject &&
    Object.values(this.selectedStatuses).every(status => !!status)
  );
}
minReportDate: Date = new Date();

validateDateRange(): void {
  const dates = this.formModel?.reportDates;
  if (Array.isArray(dates) && dates.length === 2) {
    const [start, end] = dates;
    if (end < start) {
      this.formModel.reportDates = [start]; // Reset end date if it's before start
    }
  }
}

 constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private wsrService: WsrService,
    private zohoService: ZohoService,
    private zohoDataService: ZohoDataService,
    private messageService: MessageService,
    private wsrPayloadService: WsrPayloadService
  ) { }

  ngOnInit(): void {
    this.selectedMonth = new Date();

    this.wsrService.getAllZohoProjects().subscribe((projects: ZohoProject[]) => {
      this.zohoFullProjects = projects;
    });

    this.loadProjectTypes();
    this.getAllZohoClients();
    this.getAllUniqueCustomerProjects();
    this.fetchZohoEmployees();
    this.clients = this.getUniqueCustomerOptions();
    this.loadFilteredWSRData(); // Initial load
  }

  onMonthChanged(): void {
    this.loadFilteredWSRData();
  }

  clearFilters(): void {
    this.selectedProject = null;
    this.loadFilteredWSRData();
  }



loadProjectTypes(): void {
  this.wsrService.getAllProjectTypeDetails().subscribe({
    next: (response: any[]) => {
      // Assuming response is an array of objects with fields: id and name
      this.projectTypes = response.map(type => ({
        label: type.projectTypeName || type.name, // adapt to actual API field
        value: type.projectTypeName || type.name
      }));
    },
    error: (err) => {
      console.error('❌ Error loading project types', err);
    }
  });
}


   getUniqueCustomerOptions(): { label: string; value: string }[] {
    const customerMap = new Map<string, string>();

    this.sortedProjects?.forEach(project => {
      if (project.customerName && project.customerId) {
        customerMap.set(project.customerId, project.customerName);
      }
    });

    return Array.from(customerMap.entries()).map(([value, label]) => ({
      label,
      value
    }));
  }
  
  loadFilteredWSRData(): void {
    const month = this.selectedMonth.getMonth() + 1;
    const year = this.selectedMonth.getFullYear();
    this.wsrData = [];
    var projectId = '';
    if (this.selectedProject) {
      projectId = this.selectedProject.projectId;
    }
      this.wsrService.getFilteredWSRReports(projectId, month, year).subscribe({
        next: (data) => {
          this.wsrData = data;
          console.log('✅ Loaded filtered WSR data:', data);
        },
        error: (err) => {
          console.error('❌ Error loading filtered WSR data', err);
        }
      });
    // } 
    // else {
    //   this.wsrService.getAllWSRReports().subscribe({
    //     next: (data) => {
    //       this.wsrData = data.filter((r: any) => {
    //         const start = new Date(r.reportStartDate);
    //         return start.getMonth() + 1 === month && start.getFullYear() === year;
    //       });
    //       console.log(`✅ Loaded WSRs for ${month}-${year}:`, this.wsrData);
    //     },
    //     error: (err) => {
    //       console.error('❌ Error loading all WSR reports', err);
    //     }
    //   });
    // }
  }

  
   addResource(): void {
  this.resourceList.push({
    zohoemp_id: '',
    resourcename: '',
    rating: 0
  });
}

// Remove a row
removeResource(index: number): void {
  this.resourceList.splice(index, 1);
}

// Handle dropdown selection and update zohoemp_id
onResourceChange(index: number, selectedName: string): void {
  const emp = this.zohoEmployees.find(e => e.userName === selectedName);
  if (emp) {
    this.resourceList[index].zohoemp_id = emp.zohoEmp_Id.toString();
    this.resourceList[index].resourcename = emp.userName;
  }
}
 

loadWSRReports(): void {
  this.wsrService.getAllWSRReports().subscribe({
    next: (data) => {
      this.wsrReports = data;

      this.wsrprojects = data.map((report: any) => ({
        ...report,
        projectId: report.id,
        projectName: report.wsrName
      }));

      // ✅ Set clients dynamically from sortedProjects
      this.clients = this.getUniqueCustomerOptions();
    }
  });
}


onProjectSelectionChange(event?: any): void {
  const selectedMonthString = this.formatMonthYear(this.selectedMonth);
console.log('this is called')
  // Clear previous data
  this.wsrData = [];

  if (event && event.value?.id) {
    // 🔷 If a specific project is selected
    const selectedProject = this.sortedProjects.find(p => p.id == event.value.id);

    if (selectedProject) {
      this.wsrService.getFilteredWSRReports(
        selectedProject.id,
        this.selectedMonth.getMonth() + 1,
        this.selectedMonth.getFullYear()
      ).subscribe({
        next: (reports) => {
          if (Array.isArray(reports) && reports.length > 0) {
            this.wsrData = reports;
            console.log(`✅ Data found for ${selectedProject.projectName}:`, reports);
          } else {
            console.warn('⚠️ No data found for selected project and month');
          }
        },
        error: (err) => {
          console.error(`❌ Error fetching WSR reports for ${selectedProject.projectName}`, err);
        }
      });
    }
  } else {
    // 🔶 No project selected → Fetch all reports and filter by reportMonth
    this.wsrService.getAllWSRReports().subscribe({
      next: (data) => {
        this.wsrData = data.filter((r: any) => r.reportMonth === selectedMonthString);
        console.log(`✅ Loaded all WSRs for ${selectedMonthString}:`, this.wsrData);
      },
      error: (err) => {
        console.error('❌ Error loading all WSR reports', err);
      }
    });
  }
}






getAllZohoClients(): void {
  this.wsrService.getAllUniqueCustomerProjectDetails().subscribe((projects: any[]) => {
    this.zohoProjects = projects;

    const customerMap = new Map<string, string>();
    projects.forEach(p => {
      if (p.customerId && p.customerName) {
        customerMap.set(p.customerId, p.customerName);
      }
    });

    this.clients = Array.from(customerMap.entries()).map(([value, label]) => ({
      label,
      value
    }));
  });
}



getAllUniqueCustomerProjects() {
  this.wsrService.getAllUniqueCustomerProjectDetails().subscribe((projects: any[]) => {
    this.zohoProjects = projects;

    this.taskData = projects.map(project => ({
      id: project.projectId,
      projectName: project.projectName
    }));
  });
}


  fetchZohoEmployees(): void {
    this.zohoDataService.getAllZohoEmployees().subscribe((res: ZohoEmp[]) => {
      console.log('Zoho Employees Response:', res); // ✅ Log original response

      // Store raw Zoho employees
      this.zohoEmployees = res;

      // Sort by userName before mapping
      const sortedEmployees = [...res].sort((a, b) =>
        a.userName.localeCompare(b.userName)
      );

      // Prepare options for multi-select using userName
 this.resourceNames = this.zohoEmployees.map(e => ({ label: e.userName, value: e.userName }));
 


      console.log('Mapped resourceNames:', this.resourceNames); // ✅ Confirm options
    });
  }
  

onClientSelected(selectedCustomerId: string): void {
  if (selectedCustomerId) {
    // Filter projects for selected customerId
    this.filteredZohoProjects = this.zohoProjects.filter(
      project => project.customerId === selectedCustomerId
    );

    console.log('✅ Filtered Projects:', this.filteredZohoProjects);

    // Reset form fields related to project
    this.selectedProject = null;
    this.formModel.projectName = '';
    this.formModel.projectId = '';
    this.formModel.currencyType = this.filteredZohoProjects[0]?.currencyType || '';
    this.formModel.customerId = selectedCustomerId;
  } else {
    this.filteredZohoProjects = [];
    this.selectedProject = null;
    this.formModel.projectName = '';
    this.formModel.projectId = '';
    this.formModel.currencyType = '';
    this.formModel.customerId = '';
  }
}

getUniqueProjectNames(): string[] {
  return Array.from(
    new Set(
      this.wsrData
        .map((r: any) => (r.projectName ?? '').toString().trim())
        .filter((name: string) => !!name && name !== 'Unnamed Project')
    )
  );
}

  formatMonthYear(date: Date): string {
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${month}-${year}`;
  }

onProjectSelected(selectedProject: any): void {
  if (selectedProject) {
    const projectExists = this.projectDetails.some(
      (project) =>
        project.projectId === selectedProject.projectId && project.id !== this.formModel.id
    );

    if (projectExists) {
      console.error('Error: Project already exists!');
    } else {
      this.formModel.projectId = selectedProject.projectId.toString();
      this.formModel.projectName = selectedProject.projectName;

      // ✅ Auto-fill Start and End Dates
      if (selectedProject.startDate && selectedProject.endDate) {
        this.formModel.projectDates = [
          new Date(selectedProject.startDate),
          new Date(selectedProject.endDate),
        ];
      } else {
        this.formModel.projectDates = null;
      }

      // ✅ Get manager from zohoFullProjects (instead of zohoProjects)
      const matchedZohoProject = this.zohoFullProjects.find(
        (zp) => zp.projectId.toString() === selectedProject.projectId.toString()
      );

      if (matchedZohoProject?.projectManagers) {
        try {
          const parsedManagers = JSON.parse(matchedZohoProject.projectManagers);
          if (Array.isArray(parsedManagers) && parsedManagers.length > 0) {
            this.formModel.manager = parsedManagers[0]?.name ?? '';
          } else {
            this.formModel.manager = '';
          }
        } catch (error) {
          console.error('Error parsing Zoho project managers:', error);
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
    this.formModel.projectDates = null;
  }
}






  getSymbol(status: string): string {
    switch (status) {
      case 'Green': return '↑';
      case 'Amber': return '→';
      case 'Red': return '↓';
      default: return '';
    }
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
    // 👇 Put your save logic here (call your service, update data, etc.)
    this.isEditMode = false;
    this.editModeType = 'add';
    this.displayAddFormDialog = false; // if needed
  }

  onEditProjectStatusSave() {
    console.log('Saving Project Status...');
    this.isEditMode = false;
    this.editModeType = 'add';
    this.displayAddFormDialog = false;
  }

  openAddFormDialog() {
    this.isEditProjectStatus = false;
    this.isEditProjectDetails = false;
    this.displayAddFormDialog = true;
  }

  editProjectDetails() {
    this.isEditProjectDetails = true;
    this.isEditProjectStatus = false;
    this.displayAddFormDialog = true;
  }

  editProjectStatus() {
    this.isEditProjectStatus = true;
    this.isEditProjectDetails = false;
    this.displayAddFormDialog = true;
  }
  
submitForm(): void {
  console.log('newPlanned', this.newPlanned);

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
  if (this.newProgress?.task) this.formModel.progressData.push(this.newProgress);
  if (this.newPlanned?.task) this.formModel.plannedActivities.push(this.newPlanned);
  if (this.newIssue?.description) this.formModel.keyIssues.push(this.newIssue);
  if (this.newRisk?.RiskDescription) this.formModel.keyRisks.push(this.newRisk);

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
      this.newProgress = { task: '', status: '', remarks: '' };
      this.newPlanned = { task: '', status: '', remarks: '' };
      this.newIssue = {
        type: '', functionalArea: '', description: '', ActionRequired: '',
        dateRaised: '', resolveBy: '', IssueOwner: ''
      };
      this.newRisk = {
        RiskDescription: '', mitigation: '', likelihood: '',
        RiskOwner: '', riskdate: '', riskresolvedate: ''
      };

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







  onClear(): void {
    this.selectedProject = null;
    this.selectedMonth = new Date();

  }

  get sortedProjects() {
    return this.taskData?.slice().sort((a, b) =>
      a.projectName.localeCompare(b.projectName)
    );
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
    description: '',
    statuses: {},
    resourceRating: null,
    measuresTaken: '',
    remarks: '',
    progressData: [],
    plannedActivities: [],
    keyIssues: [],
    keyRisks: []
  };

  this.newProgress = { task: '', status: '', remarks: '' };
  this.newPlanned = { task: '', status: '', remarks: '' };
  this.newIssue = {
    type: '', functionalArea: '', description: '', ActionRequired: '',
    dateRaised: '', resolveBy: '', IssueOwner: ''
  };
  this.newRisk = {
    RiskDescription: '', mitigation: '', likelihood: '',
    RiskOwner: '', riskdate: '', riskresolvedate: ''
  };
}


 
  loadDummyWSRData(): void {
    this.wsrData = [
      {
        id: 'WSR001',
        customerName: 'Acme Corp',
        projectName: 'Apollo CRM',
        monthYear: '07-2025',
        weekStartDate: '2025-06-30',
        weekEndDate: '2025-07-06',
        flagType: 'green'
      },
      {
        id: 'WSR002',
        customerName: 'Globex Inc.',
        projectName: 'Neptune HRMS',
        monthYear: '07-2025',
        weekStartDate: '2025-07-01',
        weekEndDate: '2025-07-07',
        flagType: 'yellow'
      },
      {
        id: 'WSR003',
        customerName: 'Soylent Systems',
        projectName: 'Orion Billing',
        monthYear: '07-2025',
        weekStartDate: '2025-07-02',
        weekEndDate: '2025-07-08',
        flagType: 'red'
      }
    ];
  }

  onAddMetrics(): void {
    this.router.navigate(['/wsr/add']);
  }
  onSelectionChange() {
  this.selectedProjects = this.wsrData.filter((record: { selected: any; }) => record.selected);
}


viewSelectedProjects(): void {
  if (this.selectedProjects.length === 1) {
    const wsrId = this.selectedProjects[0].wsrReportDto?.id || this.selectedProjects[0].id;
    this.router.navigate(['/wsr/view', wsrId]);
  } else if (this.selectedProjects.length > 1) {
    const ids = this.selectedProjects
      .map(p => p.wsrReportDto?.id || p.id)
      .filter(id => !!id)
      .join(',');

    this.router.navigate(['/wsr/view-multiple'], {
      queryParams: { ids }
    });
  }
}



  deleteRecord(): void {
    console.log('Deleting record...');
  }

  editTask(id: string, flagType: string): void {
    this.router.navigate(['/wsr/edit', id], {
      queryParams: { type: flagType }
    });
  }
}

