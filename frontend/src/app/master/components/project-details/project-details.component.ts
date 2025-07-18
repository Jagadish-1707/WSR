import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { CommonModule, DatePipe } from '@angular/common';
import { ProjectDetails } from '../../models/projectDetails';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { HttpClientModule } from '@angular/common/http';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FileUploadModule } from 'primeng/fileupload';
import { MessageService } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';
import { ProjectDetailsService } from '../../services/project-details.service';
import { Client } from '../../models/client';
import { Projects } from '../../models/projects';
import { CardModule } from 'primeng/card';
import { SortPipe } from '../../../shared/pipes/sort.pipe';
import { TooltipModule } from 'primeng/tooltip';
import { ZohoClient } from '../../models/ZohoClient';
import { ZohoProject } from '../../models/ZohoProject';
import { ZohoService } from '../../services/zoho.service';
import { TaskService } from '../../services/task.service';
import { DateService } from '../../../shared/services/date.service';
@Component({
  selector: 'app-project-details',
  standalone: true,
  templateUrl: './project-details.component.html',
  styleUrl: './project-details.component.scss',
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
    CommonModule,
    FileUploadModule,
    MessagesModule,
    CardModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    HttpClientModule,
    CalendarModule,
    InputTextareaModule,
    SortPipe,
    TooltipModule,
  ],
})
export class ProjectDetailsComponent implements OnInit {
  projectData: ProjectDetails[] = [];
  editProjectData!: ProjectDetails;
  selectedProject: ProjectDetails | null = null;
  visible: boolean = false;
  userDetails: any;
  dialogVisible: boolean = false;
  isEditMode: boolean = false;
  projectForm: FormGroup;
  userName: string = '';
  userId: string = '';
  projectId: number = 0;
  projectName: string = '';
  clientId: number = 0;
  clientName: string = '';
  engagementMode: any[] = [];
  editDialog: boolean = false;
  projects: any[] = [];
  clients: Client[] = [];
  filteredProjects: ProjectDetails[] = []; //edit projects
  filteredProjectNames: ProjectDetails[] = [];
  filterProject!: ProjectDetails;
  isSubmitting: boolean = false;
  showWarningDialog: boolean = false;
  displayDeleteDialog: boolean = false;
showEditWarningDialog: boolean = false;
  zohoClients: ZohoClient[] = [];
  zohoProjects: ZohoProject[] = [];
  filteredZohoProjects: ZohoProject[] = [];

  table: any;
  minDate: any;

  tasksData: any;
  projNames: string[] = [];
  recordToDelete: any;

  constructor(
    private fb: FormBuilder,
    private projectDetailsService: ProjectDetailsService,
    private messageService: MessageService,
    private projectservice: ProjectDetailsService,
    private zohoService: ZohoService,
    private dateService: DateService,
    public taskService: TaskService
  ) {
    this.userDetails = JSON.parse(localStorage.getItem('userLogin')!);
    this.userName = this.userDetails.data.userName;

    this.userId = this.userDetails.data.userId;
    this.projects = [];
    this.clients = [];
    const today = new Date();
    const formattedDate = this.formatDate(today);
    this.projectForm = this.initializeForm();
  }

  initializeForm(): FormGroup {
    return this.fb.group({
      id: [0],
      client: ['', Validators.required],
      project: ['', Validators.required],
      customerId: [''],
      customerName: [''],
      projectId: [''],
      projectName: [''],
      currencyType: ['', Validators.required],
      engagementMode: ['', Validators.required],
      contractValue: [
        '',
        [Validators.required, Validators.min(1), Validators.max(1000000)],
      ],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      remarks: [''],
      estimatedHours: ['', Validators.required],
      active: [true],
      status: [1],
      createdOn: [this.formatDate(new Date())],
      createdBy: [this.userId],
      modifiedOn: [''],
      modifiedBy: [''],
    });
  }

  ngOnInit(): void {
    this.getengagemetmode();
    this.getAllZohoClients();
    this.getAllZohoProjects();
    this.getalltasks();
    this.projectDetailsService
      .getAllProjectDetails()
      .subscribe((response: ProjectDetails[]) => {
        this.projectData = response;
        const seenProjectNames = new Set();
        this.filteredProjectNames = response.filter((project) => {
          const duplicate = seenProjectNames.has(project.projectName);
          seenProjectNames.add(project.projectName);
          return !duplicate;
        });
        this.projectData = this.filteredProjectNames;
        this.filteredProjectNames = response;
      });
  }

  getAllZohoClients() {
    this.zohoService.getClients().subscribe((clients: ZohoClient[]) => {
      this.zohoClients = clients;
    });
  }

  getalltasks() {
    this.taskService.getAllTasks().subscribe((response: any) => {
      this.tasksData = response;
      this.projNames = this.tasksData
        .map((item: any) => item.projectName)
        .flat();
    });
  }

  getAllZohoProjects() {
    this.zohoService.getProjects().subscribe((projects: ZohoProject[]) => {
      this.zohoProjects = projects;
    });
  }

  filterProjects() {
    if (this.selectedProject) {
      // Filter the project based on the selected project
      this.filteredProjectNames = this.projectData.filter(
        (project) => project.id === this.selectedProject?.id
      );
    } else {
      // If no project is selected, display all projects
      this.filteredProjectNames = this.projectData;
    }
  }

  getengagemetmode() {
    this.projectservice.getAllEngagementMode().subscribe((response: any) => {
      this.engagementMode = response.filter((item: any) => item.status == 1);
    });
  }

  onClientSelected(selectedClient: ZohoClient): void {
    if (selectedClient && selectedClient.clientId) {
      // Update filteredZohoProjects with projects belonging to the selected client
      this.filteredZohoProjects = this.zohoProjects.filter(
        (project) => project.clientId === selectedClient.clientId
      );

      // After filtering projects, we can proceed to patch the client info in the form
      this.projectForm.patchValue({
        customerId: selectedClient.clientId.toString(),
        customerName: selectedClient.clientName,
        currencyType: selectedClient.currencyCode,
      });
      this.projectForm.get('project')?.setErrors(null);

      // Log the updated filtered projects
      console.log('Filtered Projects:', this.filteredZohoProjects);
    } else {
      this.filteredZohoProjects = [];
      this.projectForm.patchValue({ customerId: '', customerName: '' });
    }
  }

  onProjectSelected(selectedProject: ZohoProject): void {
    if (selectedProject) {
      // Exclude the selected project if it's the same as the currently edited project
      const projectExists = this.projectData.some(
        (project) =>
          project.projectId === selectedProject.projectId &&
          project.id !== this.projectForm.get('id')?.value
      );

      if (projectExists) {
        // Show an error if the project already exists
        this.projectForm.get('project')?.setErrors({ alreadyExists: true });
      } else {
        // Patch values if project doesn't exist
        this.projectForm.patchValue({
          projectId: selectedProject.projectId.toString(),
          projectName: selectedProject.projectName,
        });
        // Clear errors if project is valid
        this.projectForm.get('project')?.setErrors(null);
      }
    } else {
      this.projectForm.patchValue({ projectId: '', projectName: '' });
    }
  }

  addProject(): void {
    this.isEditMode = false;
    this.projects = [];
    this.projectForm = this.initializeForm();
    this.dialogVisible = true;
  }

  clearAddForm() {
    const projectControl = this.projectForm.get('project');
    projectControl?.reset();
    projectControl?.disable();
    this.projectForm.reset();
  }
  clearEditForm() {
    const projectControl = this.projectForm.get('project');
    projectControl?.reset();
    projectControl?.disable();
    this.projectForm.reset();
    setTimeout(() => {
      this.isSubmitting = false;
    }, 2000);
  }

  editProject(id: number): void {
    // Fetch the project details by ID
    this.projectDetailsService.getProjectDetailsById(id).subscribe(
      (project: any) => {
        if (project) {
          if (this.projNames.includes(project.projectName)) {
           this.showEditWarningDialog = true;
            return;
          }
          this.isEditMode = true;
          this.dialogVisible = true;
          const selectedClient = this.zohoClients.find(
            (client) => client.clientId === project.customerId
          );

          // Update filteredZohoProjects based on the selected client
          this.filteredZohoProjects = this.zohoProjects.filter(
            (project) => project.clientId === selectedClient?.clientId
          );

          // Find the selected project from filtered projects list
          const selectedProject = this.filteredZohoProjects.find(
            (proj) => proj.projectId === project.projectId
          );

          if (!selectedClient) {
            console.error('Selected client not found.');
          }

          if (!selectedProject) {
            console.error('Selected project not found.');
          }

          // Patch the full client and project objects into the form
          this.projectForm.patchValue({
            id: project.id,
            client: selectedClient || null,
            project: selectedProject || null,
            customerId: project.customerId,
            customerName: project.customerName,
            projectId: project.projectId,
            projectName: project.projectName,
            currencyType: project.currencyType,
            engagementMode: project.engagementMode,
            contractValue: project.contractValue,
            estimatedHours: project.estimatedHours,
            startDate: new Date(project.startDate),
            endDate: new Date(project.endDate),
            remarks: project.remarks,
            active: true,
            status: project.status,
            createdOn: project.createdOn,
            createdBy: project.createdBy,
            modifiedOn: project.modifiedOn,
            modifiedBy: project.modifiedBy,
          });
        } else {
          console.log('No project data found for ID:', id);
        }
      },
      (error) => {
        console.error('Error fetching project:', error);
      }
    );
  }

  onSubmit(): void {
    if (this.projectForm.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Form Invalid',
        detail: 'Please fill all required fields correctly.',
      });
      return;
    }

    const payload = {
      ...this.projectForm.value,
      startDate: this.dateService.getLocalDateString(
        this.projectForm.get('startDate')?.value
      ),
      endDate: this.dateService.getLocalDateString(
        this.projectForm.get('endDate')?.value
      ),
    };

    if (this.isEditMode) {
      this.projectDetailsService.editProjectDetails(payload).subscribe(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Project Updated',
        });
        this.dialogVisible = false;
        this.ngOnInit();
      });
    } else {
      this.projectDetailsService.addProjectDetails(payload).subscribe(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Project Added',
        });
        this.dialogVisible = false;
        this.ngOnInit();
      });
    }
  }

  getClientById(id: number): Client | null {
    if (!id || typeof id !== 'number') {
      console.error('Invalid ID provided to getClientById:', id);
      return null;
    }

    return this.clients.find((client) => client.id === id) || null;
  }

  getProjectById(id: number): ProjectDetails | null {
    return this.projectData.find((project) => project.id === id) || null;
  }

  NumericOnly(e: any) {
    if (+e.charCode > 45 && +e.charCode < 58) {
      return true;
    }
    return false;
  }

  onClear() {
    this.projectDetailsService
      .getAllProjectDetails()
      .subscribe((response: ProjectDetails[]) => {
        this.filteredProjectNames = response;
      });
    this.selectedProject = null;
  }
  reloadProjects() {
    return new Promise((resolve) => {
      this.projectDetailsService.getAllProjectDetails().subscribe((res) => {
        resolve(res);
      });
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

  confirmDelete(data: any) {
    if (data) {
      this.recordToDelete = { ...data };
      if (this.recordToDelete) {
        const projNameToDelete = this.recordToDelete.projectName;
        if (this.projNames && this.projNames.includes(projNameToDelete)) {
          this.showWarningDialog = true;
          this.displayDeleteDialog = false;
          return;
        }
        this.displayDeleteDialog = true;
      }
    }
  }

  deleteTask() {
    this.displayDeleteDialog = false;
    this.userDetails = JSON.parse(localStorage.getItem('userLogin')!);
    this.userDetails = this.userDetails.data;
    const userId = this.userDetails.user_Id;
    this.recordToDelete.active = false;
    this.recordToDelete.ModifiedBy = userId.toString();
    this.projectDetailsService
      .editProjectDetails(this.recordToDelete)
      .subscribe((result) => {
        if (result) {
          this.displayDeleteDialog = false;
          this.ngOnInit();
          this.messageService.add({
            severity: 'success',
            detail: 'Project Deleted Successfully.',
          });
        }
      });
  }

  onCancel(): void {
    this.dialogVisible = false;
  }
}
