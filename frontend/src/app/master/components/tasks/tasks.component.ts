import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputGroupModule } from 'primeng/inputgroup';
import { MultiSelectModule } from 'primeng/multiselect';
import { DatePipe } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  Task,
} from '../../models/task';
import { CommonModule } from '@angular/common';
import { SidebarModule } from 'primeng/sidebar';
import { CalendarModule } from 'primeng/calendar';
import { ProgressBarModule } from 'primeng/progressbar';
import { AddTaskComponent } from '../add-task/add-task.component';
import { TagModule } from 'primeng/tag';
import { TaskService } from '../../services/task.service';
import { EditorModule } from 'primeng/editor';
import { ProjectDetails } from '../../models/projectDetails';
import { Client } from '../../models/client';
import { UserService } from '../../services/user.service';
import { MessageService } from 'primeng/api';
import { ProjectDetailsService } from '../../services/project-details.service';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { Projects } from '../../models/projects';
import { SortPipe } from '../../../shared/pipes/sort.pipe';
import { TooltipModule } from 'primeng/tooltip';
import moment from 'moment';
import { ProjectTypeService } from '../../services/project-type.service';
import { ProjectTypes } from '../../models/projectType';
import { MetricsMaster } from '../../models/metricsMaster';
import { MetricsMasterService } from '../../services/metrics-master.service';
import { GeneralMetricsService } from '../../services/general-metrics.service';
import { generalMetrics } from '../../models/generalMetrics';
import { ZohoEmp } from '../../models/ZohoEmp';
import { ZohoDataService } from '../../services/zoho-data.service';
import { TaskMetricsComponent } from '../task-metrics/task-metrics.component';
import { MetricsService } from '../../services/metrics.service';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [
    ButtonModule,
    DialogModule,
    TableModule,
    ToolbarModule,
    ToastModule,
    DropdownModule,
    InputTextModule,
    InputGroupAddonModule,
    InputGroupModule,
    MultiSelectModule,
    FormsModule,
    CommonModule,
    SidebarModule,
    CalendarModule,
    ReactiveFormsModule,
    ProgressBarModule,
    TagModule,
    EditorModule,
    FileUploadModule,
    InputTextareaModule,
    SortPipe,
    TooltipModule,
    DatePipe, TaskMetricsComponent,
  ],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss',
})
export class TasksComponent implements OnInit {
  taskData: Task[] = [];
  filteredTaskData: Task[] = [];
  editTaskData: Task[] = [];
  selectedTask: unknown;
  filteredProjects: ProjectDetails[] = [];
  filterProjectNames: Task[] = [];
  editModalVisible: boolean = false;
  projects: Projects[] = [];
  addedTask!: Task;
  projectId: number = 0;
  projectData: ProjectDetails[] = [];
  projectName: string = '';
  clients: Client[] = [];
  selectedProject: { projectName: string; projectId: number }[] = [];
  users: { userId: number; userName: string }[] = [];
  zohoEmployees: ZohoEmp[] = [];
  selectedProjectType!: any;
  editFrm: FormGroup;
  filteredProject!: any;
  selectedProjectName!: Task | null;
  taskDeleteId : number = 0;
  
  projectType: ProjectTypes[] = [];
  projectTypeDropdownList: { label: string; value: number | null }[] = [];
  selectedTaskId: number = 0;
  billingType = [
    { label: 'Non-billable', value: 'Non-billable' },
    { label: 'Billable', value: 'Billable' },
  ];
  filteredProjectNames!: any;
  optionDropdown: { label: string; value: number }[] = [];
  dialogVisible: boolean = false;
  showEditWarningDialog: boolean = false;
  //@ViewChild('addTaskComponent') addTaskComponent!: AddTaskComponent;

  //metricsMaster: MetricsMaster[] = [];
  // generalOptions: generalMetrics[] = [];
  selectedprojectdialog: string | undefined;
  displayEmpDialog: boolean = false;
  displayMetricsDialog: boolean = false;
  selectedMetrics: any[] = [];
  selectedEmployees: any[] = [];
  metricsMaster: MetricsMaster[] = [];
  filteredMetricsList: MetricsMaster[] = [];
  loading: boolean = true;
  minStartDate: Date | null = null;
  maxEndDate!: Date;
  userDetails: any;
  projectTypeMap: { [key: number]: string } = {};
  filteredMasterNames: any;
  projectTypes: {
    label: string;
    value: { projectTypeId: number; projectTypeName: string };
  }[] = [];
  isProjectTypesLoaded: boolean = false;
  metricColumnData: any;
  metricColumnName: string[] = [];
  recordToDelete: any;
  showWarningDialog: boolean = false;
  displayDeleteDialog: boolean = false;
  constructor(
    private fb: FormBuilder,
    public taskService: TaskService,
    private userService: UserService,
    private messageService: MessageService,
    private projectDetailsService: ProjectDetailsService,
    private projectTypeService: ProjectTypeService,
    private metricsService: MetricsMasterService,
    private metricService: MetricsService,
    private generalMetricsService: GeneralMetricsService,
    private zohoDataService: ZohoDataService,
    
  ) {
    this.projects = [];
    this.clients = [];
    const today = new Date();
    const toDate = this.formatDate(today);


    if (taskService.addModalVisible == false) {
      this.taskService.getAllTasks().subscribe(
        (response: Task[]) => {
          this.taskData = response.filter((task) => task.assignedTo?.length);
          this.filterProjectNames = this.taskData;
        },
        (error: unknown) => {
          console.log('Error Happened', error);
        }
      );
    }

    this.editFrm = this.fb.group({
      id: [0],
      client: ['', Validators.required],
      project: ['', Validators.required],
      customerId: [''],
      customerName: [''],
      projectId: [''],
      projectName: [''],
      projectType: ['', Validators.required],
      assignedTo: [null, Validators.required],
      // devMetrics: [[], Validators.required],
      assignmentStartDate: [{ value: '' }, Validators.required],
      assignmentEndDate: [{ value: '', disabled: true }, Validators.required],
      assignmentPercent: [
        '',
        [Validators.min(1), Validators.max(100), Validators.required],
      ],
      billingType: ['', Validators.required],
      // generalMetrics: [[]],
      remarks: [''],
      options: '',
      projectAttachment: [null],
      modifiedOn: [toDate],
      modifiedBy: [''],
    });
  }

  ngOnInit() {
    this.projectTypeDropdownOptions();
    this.loadProjectTypes();
    this.getMasterColums();
    this.loadMetricsList();
    // this.loadGeneralMetrics();
    this.fetchZohoEmployees();
    this.projectDetailsService
      .getAllUniqueCustomerProjectDetails()
      .subscribe((response: ProjectDetails[]) => {
        this.projectData = response;
        const seenProjectNames = new Set();
        this.filteredProjectNames = response.filter((project) => {
          const duplicate = seenProjectNames.has(project.projectName);
          seenProjectNames.add(project.projectName);
          return !duplicate;
        });
        this.projectData = this.filteredProjectNames;
      });

    this.userService.getAllUser().subscribe((Response: any) => {
      this.users = Response.map((user: any) => ({
        userId: user.user_Id,
        userName: user.userName,
      }));
    });
    this.projectDetailsService.getAllClients().subscribe((Response: any) => {
      this.clients = Response;
    });
  }

  

  loadProjectTypes(): void {
    this.projectTypeService.getAllProjectTypeDetails().subscribe({
      next: (res: ProjectTypes[]) => {
        this.projectTypes = res
          .filter((pt) => pt.id !== null && pt.active == true)
          .map((pt) => ({
            label: pt.projectTypeName,
            value: {
              projectTypeId: pt.id as number,
              projectTypeName: pt.projectTypeName,
            },
          }));

        this.projectTypeMap = res.reduce((acc, pt) => {
          if (pt.id !== null) {
            acc[pt.id] = pt.projectTypeName;
          }
          return acc;
        }, {} as { [key: number]: string });

        this.isProjectTypesLoaded = true;
        this.getAllTasks();
      },
      error: (err) => {
        console.error('Failed to fetch project types', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load project types',
        });
      },
    });
  }

  fetchZohoEmployees(): void {
    this.zohoDataService.getAllZohoEmployees().subscribe((res) => {
      this.zohoEmployees = res.map(emp => ({
        ...emp,
        label: `${emp.userName} - ${emp.employee_Id}`,
        userId: emp.zohoEmp_Id,
        userName: emp.userName
      }));
    });
  }

  projectTypeDropdownOptions(): void {
  this.projectTypeService
    .getAllProjectTypeDetails()
    .subscribe((response: ProjectTypes[]) => {
      console.log(response);
      
      const seenProjectTypeNames = new Set<string>();

      const uniqueProjectTypes = response.filter((project) => {
        const isDuplicate = seenProjectTypeNames.has(project.projectTypeName);
        const isActive = project.status === 1; // Filter condition: status === 1

        if (!isDuplicate && isActive) {
          seenProjectTypeNames.add(project.projectTypeName);
          return true;
        }

        return false;
      });

      this.projectType = uniqueProjectTypes;

      this.projectTypeDropdownList = uniqueProjectTypes.map((project) => ({
        label: project.projectTypeName,
        value: project.id,
      }));
    });
}


  loadMetricsList(): void {
    this.metricsService
      .getMetricsMasterList()
      .subscribe((data: MetricsMaster[]) => {
        this.metricsMaster = data;
      });
  }

  addMetrics(taskId: number): void {
    this.dialogVisible = true; // Open the dialog
    this.selectedTaskId = taskId; // Store the selected task ID
  }

  onDialogVisibleChange(visible: boolean): void {
    this.dialogVisible = visible;
    this.ngOnInit();
  }

  onProjectTypeChange(projectTypeId: number): void {
    // this.metricsService
    //   .getMetricsMasterList()
    //   .subscribe((data: MetricsMaster[]) => {
    //     // this.metricsMaster = data.filter(
    //       // (metric) => metric.projectTypeId === projectTypeId
    //     );
    //   });
    this.metricsService
      .getMetricsMasterList()
      .subscribe((response: MetricsMaster[]) => {
        this.metricsMaster = response;
        const seenMasterName = new Set();
        this.filteredMasterNames = response.filter((master) => {
          const duplicate = seenMasterName.has(master.metricsName);
          seenMasterName.add(master.metricsName);
          return !duplicate;
        });
      });
  }

  getAllTasks() {
    this.taskService.getAllTasks().subscribe((response: Task[]) => {
      this.taskData = response;
      this.filterProjectNames = this.taskData;
    });
  }

    getMasterColums() {
    this.metricService
      .getMetricsColumnList()
      .subscribe((response: any) => {
        this.metricColumnData = response;
      this.metricColumnName = this.metricColumnData
        .map((item: any) => item.projectName)
        .flat();
    });
  }

  formatDate(date: any) {
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: 'Asia/Kolkata',
    };
    return date.toLocaleString('en-IN', options);
  }
  addtask() {
    //this.taskService.addModalVisible = true;
    this.editFrm.reset();
    this.editFrm.patchValue({ id: 0 });
    this.editModalVisible = true;
  }

  onClear() {
    this.taskService.getAllTasks().subscribe((response: Task[]) => {
      this.taskData = response;
      this.filterProjectNames = this.taskData;
    });
    this.selectedProjectType = '';
    this.selectedProjectName = null;
  }
  onStartDateChange() {
    const endDateControl = this.editFrm.get('assignmentEndDate');
    const startDateValue = this.editFrm.get('assignmentStartDate')?.value;
    if (startDateValue) {
      this.minStartDate = startDateValue ? new Date(startDateValue) : null;;
      // endDateControl?.reset();
      endDateControl?.enable();
    } else {
      // endDateControl?.reset();
      endDateControl?.disable();
    }
  }

  editTask(id: number) {
    this.taskService.getTaskById(id).subscribe((response: any) => {
      if (this.metricColumnName && this.metricColumnName.includes(response.projectName)) {
      this.showEditWarningDialog = true;
      return; 
    }
    this.editModalVisible = true;
      const selectedClient = this.getProjectDetailsById(response.customerId);

      const assignedToValue = this.getAssignedTo(response.assignedTo);
      const parsedOptions = response.options
        ? JSON.parse(response.options)
        : {};

      const projectObj = this.getProjectById(response.projectId);

      this.editFrm.patchValue({
        id: response.id,
        client: selectedClient,
        project: projectObj,
        customerId: response.customerId,
        customerName: response.customerName,
        projectId: response.projectId,
        projectName: response.projectName,
        projectType: parseInt(response.projectType, 10),
        assignmentStartDate: new Date(response.assignmentStartDate),
        assignmentEndDate: new Date(response.assignmentEndDate),
        assignmentPercent: response.assignmentPercent,
        billingType: response.billingType,
        remarks: response.remarks,
        assignedTo: assignedToValue,
        options: parsedOptions?.value || '',
      });

      this.onProjectSelected(projectObj!);
    });
  }

  updateFilteredProjects(custId: string) {
    this.filteredProjects = this.projectData.filter(
      (project) => project.customerId === custId
    );
  }
  getProjectById(projectId: string): ProjectDetails | null {
    return (
      this.projectData.find((project) => project.projectId === projectId) ||
      null
    );
  }
  getAssignedTo(assignedToArray: any[]): any[] {
    if (!Array.isArray(assignedToArray)) return [];

    return assignedToArray.map((assigned: any) => {
      // Find the original matching Zoho employee from the loaded list
      const match = this.zohoEmployees.find(
        emp => emp.zohoEmp_Id === assigned.userId
      );

      // Return the matched employee object, or a fallback with label
      return match ?? {
        userId: assigned.userId,
        userName: assigned.userName,
        label: `${assigned.userName} - ${assigned.userId}`
      };
    });
  }

  submitTask() {
    const formValue = this.editFrm.value;

    const isEditMode = formValue.id !== 0;
    const adjustedStartDate = moment(formValue.assignmentStartDate)
      .startOf('day')
      .toISOString();
    const adjustedEndDate = moment(formValue.assignmentEndDate)
      .endOf('day')
      .toISOString();
    const defaultArrayFields = [
      'assignedTo',
    ];
    defaultArrayFields.forEach((field) => {
      if (!formValue[field]) {
        formValue[field] = [];
      }
    });

    const taskPayload: any = {
      id: formValue.id,
      customerId: formValue.customerId,
      customerName: formValue.customerName,
      projectId: formValue.projectId,
      projectName: formValue.projectName,
      projectType: String(formValue.projectType),
      assignedTo: Array.isArray(formValue.assignedTo)
        ? formValue.assignedTo.map((user: any) => ({
          assignedToId: 0,
          taskDetailsId: 0,
          userId: user.userId,
          userName: user.userName,
        }))
        : [],
      assignmentStartDate: adjustedStartDate,
      assignmentEndDate: adjustedEndDate,
      assignmentPercent: formValue.assignmentPercent,
      billingType: formValue.billingType,
      remarks: formValue.remarks || '',
      options: formValue.options,
    };

    const apiCall = isEditMode
      ? this.taskService.editTask(taskPayload)
      : this.taskService.addTask(taskPayload);

    apiCall.subscribe(
      () => {
        this.messageService.add({
          severity: 'success',
          summary: isEditMode ? 'Project Configuration Updated!' : 'Project Configuration Added!',
        });

        this.getAllTasks();
        this.editModalVisible = false;
        this.taskService.addModalVisible = false;
        this.editFrm.reset();
      },
      (error: any) => {
        console.error('API Error:', error);
        this.messageService.add({
          severity: 'error',
          summary: isEditMode ? 'Project Configuration not updated.' : 'Project Configuration not added.',
          detail: 'Error occurred!',
        });
      }
    );
  }

  onProjectSelected(selectedProject: ProjectDetails) {
    // Check if the selected project is the same as the current task's project
    const isEditingSameProject = this.editFrm.get('projectId')?.value === selectedProject.projectId;

    // If the project is the same as the existing one for editing, skip the validation
    if (!isEditingSameProject) {
      // Check if the project already exists in taskData for the selected client
      const projectExists = this.taskData.some(
        (task) => task.projectId === selectedProject.projectId && task.customerId === selectedProject.customerId
      );

      if (projectExists) {
        // Set form error if the project already exists for this client
        this.editFrm.get('project')?.setErrors({ alreadyExists: true });
        console.log("Project already exists for this customer");
      } else {
        // Patch the values to the form if the project doesn't already exist
        this.editFrm.patchValue({
          projectId: selectedProject.projectId,
          projectName: selectedProject.projectName,
          options: selectedProject.id.toString() // Assuming `options` is used to store the project ID
        });
        // Clear the error if the project is valid
        this.editFrm.get('project')?.setErrors(null);
        console.log("Project patched to the form: ", selectedProject);
      }
    } else {
      // If editing the same project, just patch the values without checking for duplicates
      this.editFrm.patchValue({
        projectId: selectedProject.projectId,
        projectName: selectedProject.projectName,
        options: selectedProject.id.toString()
      });
    }

    // Set the minimum start and maximum end date based on the selected project
    if (selectedProject) {
      this.minStartDate = new Date(selectedProject.startDate);
      this.maxEndDate = new Date(selectedProject.endDate);
    }
  }



  onClientSelected(selectedClient: ProjectDetails) {
    if (selectedClient) {
      this.editFrm.patchValue({
        customerId: selectedClient.customerId,
        customerName: selectedClient.customerName,
      });
      const filteredProject = this.projectData.filter(
        (project) => project.customerId === selectedClient.customerId
      );
      this.filteredProjects = filteredProject;
      this.editFrm.get('project')?.setErrors(null);
    } else {
      this.filteredProjects = [];
    }
  }

  getProjectDetailsById(custId: string): ProjectDetails | null {
    for (const projectDetails of this.projectData) {
      if (custId == projectDetails.customerId) {
        const filteredProject = this.projectData.filter(
          (project) => project.customerId === custId
        );
        this.filteredProjects = filteredProject;
        return projectDetails;
      }
    }
    return null;
  }

  fileSelected(event: unknown) {

    this.messageService.add({
      severity: 'info',
      summary: 'File Selected',
      detail: '  ',
    });
  }

  filterTaskData() {
    if (this.selectedProjectName && this.selectedProjectType) {
      // Filter based on both projectName and projectType
      this.filterProjectNames = this.taskData.filter(
        (task) =>
          task.projectName === this.selectedProjectName?.projectName &&
          task.projectType == this.selectedProjectType.value
      );
    } else if (this.selectedProjectName && !this.selectedProjectType) {
      // Filter only by projectName
      this.filterProjectNames = this.taskData.filter(
        (task) => task.projectName === this.selectedProjectName?.projectName
      );
    } else if (!this.selectedProjectName && this.selectedProjectType) {
      // Filter only by projectType
      this.filterProjectNames = this.taskData.filter(
        (task) =>
          task.projectType == this.selectedProjectType.value
          
      );
    } else {
      // If neither is selected, show all tasks
      this.filterProjectNames = [...this.taskData];
    }

  }

 

 confirmDelete(data: any) {
    if (data) {
      this.recordToDelete = { ...data };
      if (this.recordToDelete) {
        const projectNameToDelete = this.recordToDelete.projectName;
        if (this.metricColumnName && this.metricColumnName.includes(projectNameToDelete)) {
          this.showWarningDialog = true;
          this.displayDeleteDialog = false;
          return;
        }
        this.displayDeleteDialog = true;
        this.taskDeleteId = this.recordToDelete.id;
      }
    }
  }


  deleteTask() {
    this.userDetails = JSON.parse(localStorage.getItem('userLogin')!);
    this.userDetails = this.userDetails.data;
    const userId = this.userDetails.user_Id;
    this.taskService
      .deleteTask(this.taskDeleteId, userId)
      .subscribe((result) => {
        if (result) {
          this.displayDeleteDialog = false;
          this.ngOnInit();
          this.messageService.add({
            severity: 'success',
            detail: 'Metrics Deleted Successfully.',
          });
        }
      });
  }

  closeDialog(): void {
    this.dialogVisible = false;
  }

  showEmployeeDialogs(id: number): void {
    this.taskService.getAssignedEmployee(id).subscribe((res: any[]) => {
      this.selectedEmployees = res
    });
    this.selectedprojectdialog =  this.filterProjectNames[0].projectName;
    this.displayEmpDialog = true;
    this.displayMetricsDialog = false;
  }


  showMetricsDialogs(id: number): void {
    this.taskService.getAssignedMetrics(id).subscribe((res: any[]) => {
      this.selectedMetrics = res
    });
    this.selectedprojectdialog =  this.filterProjectNames[0].projectName;
    this.displayEmpDialog = false;
    this.displayMetricsDialog = true;
  }
}
