import { Component, OnInit } from '@angular/core';
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
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SidebarModule } from 'primeng/sidebar';
import { CalendarModule } from 'primeng/calendar';
import { AddTaskComponent } from '../add-task/add-task.component';
import { Router } from '@angular/router';
import { Client } from '../../models/client';
import { PriorityService } from '../../services/priority.service';
import { MessageService } from 'primeng/api';
import { TagModule } from 'primeng/tag';
import { Projects } from '../../models/projects';
import { ProjectDetailsService } from '../../services/project-details.service';
import { SortPipe } from '../../../shared/pipes/sort.pipe';
import {
  CamelCaseDirective,
  CaseSensitiveDirective,
  NoInitialSpaceDirective,
} from '../../../shared/components/camel-case.directive';
import { ZohoClient } from '../../models/ZohoClient';
import { ZohoService } from '../../services/zoho.service';
import { ZohoProject } from '../../models/ZohoProject';
import { ProjectDetails } from '../../models/projectDetails';
import { Priority } from '../../models/priority';
import { SlaService } from '../../services/sla.service';
@Component({
  selector: 'app-priority',
  standalone: true,
  templateUrl: './priority.component.html',
  styleUrl: './priority.component.scss',
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
    AddTaskComponent,
    CalendarModule,
    TagModule,
    ReactiveFormsModule,
    SortPipe,
    NoInitialSpaceDirective,
    CamelCaseDirective,
    CaseSensitiveDirective,
  ],
})
export class PriorityComponent implements OnInit {
  ProjectPriority = [
    { label: 'High', value: 'High' },
    { label: 'Medium', value: 'Medium' },
    { label: 'Low', value: 'Low' },
  ];
  visible: boolean = false;
  clients: any[] = [];
  projectName: string = '';
  priorityData: any[] = [];
  priorityFrm: FormGroup;
  priorityedit: boolean = false;
  // public selectedPId: number = 0;
  projects!: any[];

  editDialog: boolean = false;
  rowData: any;
  data: any[] = [];
  editPriorityData: any[] = [];
  customerName!: any;
  customerId!: any;
  projectId!: any;
  priority: any;
  editPriorityName: any;
  projectData: ProjectDetails[] = [];
  zohoClients: ZohoClient[] = [];
  filteredZohoProjects: ZohoProject[] = [];
  zohoProjects: ZohoProject[] = [];
  isEditMode: boolean = false;
  selectedPId: number | null = null;
  priorityDialogVisible: boolean = false;
  displayDeleteDialog: boolean = false;
  showEditWarningDialog: boolean = false;
  recordToDelete: any = null;
  userDetails: any;
  tableref: any;
  searchValue: any;
  originalPriorityName: string = '';
  slaData: any;
  priorityNames: any[] = [];
  showWarningDialog: boolean = false;

  constructor(
    private fb: FormBuilder,
    private priorityService: PriorityService,
    private messageService: MessageService,
    private zohoService: ZohoService,
    private slaService: SlaService
  ) {
    this.priorityFrm = this.fb.group({
      id: [],
      customer: ['', Validators.required],
      customerId: [],
      project: [{ value: '', disabled: true }, Validators.required],
      projectId: [],
      projectPriority: [{ value: '', disabled: true }, Validators.required],
      status: ['', Validators.required],
      remarks: [''],
    });
  }
  Status = [
    { label: 'Active', value: 1 },
    { label: 'Inactive', value: 0 },
  ];
  ngOnInit() {
    this.getAllZohoClients();
    this.getAllZohoProjects();
    this.getallsla();
    this.priorityService.getAllPriority().subscribe((response: any[]) => {
      if (response) {
        this.priorityData = response.sort((a, b) => {
          return (
            new Date(b.createdOn).getTime() - new Date(a.createdOn).getTime()
          );
        });
      } else {
        this.priorityData = [];
      }
    });
  }

  getallsla() {
    this.slaService.getAllSLA().subscribe((response: any) => {
      this.slaData = response;
      this.priorityNames = this.slaData
        .map((item: any) => item.priority)
        .flat();
      console.log(this.priorityNames, 'priorityNames');
    });
  }

  filterTable() {
    this.tableref.filterGlobal(this.searchValue, 'contains');
  }

  getAllZohoClients() {
    this.zohoService.getClients().subscribe((clients: ZohoClient[]) => {
      this.zohoClients = clients;
    });
  }

  getAllZohoProjects() {
    this.zohoService.getProjects().subscribe((projects: ZohoProject[]) => {
      this.zohoProjects = projects;
    });
  }

  cancel(): void {
    this.priorityDialogVisible = false;
    this.priorityFrm.reset();
    this.originalPriorityName = '';
  }

  showDialog(): void {
    this.isEditMode = false;
    this.priorityFrm.reset();
    this.priorityFrm.get('project')?.disable();
    this.priorityFrm.get('projectPriority')?.disable();
    this.priorityDialogVisible = true;
    this.originalPriorityName = '';
  }

  onClientSelected(selectedClient: ZohoClient): void {
    if (selectedClient && selectedClient.clientId) {
      // Update filteredZohoProjects with projects belonging to the selected client
      this.filteredZohoProjects = this.zohoProjects.filter(
        (project) => project.clientId === selectedClient.clientId
      );

      // After filtering projects, we can proceed to patch the client info in the form
      this.priorityFrm.patchValue({
        customerId: selectedClient.clientId.toString(),
        customerName: selectedClient.clientName,
      });
      // Enable the Project dropdown
      this.priorityFrm.get('project')?.enable();
      this.priorityFrm.get('project')?.setErrors(null);

      if (
        !this.isEditMode ||
        this.priorityFrm.get('project')?.value?.clientId !==
          selectedClient.clientId
      ) {
        this.priorityFrm.patchValue({ project: null, projectId: '' });
        this.priorityFrm.get('projectPriority')?.disable();
      }
      this.clearPriorityError();
    } else {
      this.filteredZohoProjects = [];
      this.priorityFrm.patchValue({
        customerId: '',
        customerName: '',
        project: null,
        projectId: '',
      });
      this.priorityFrm.get('project')?.disable();
      this.priorityFrm.get('projectPriority')?.disable();
      this.clearPriorityError();
    }
  }

  onProjectSelected(selectedProject: ZohoProject): void {
    console.log('Hits');
    if (selectedProject) {
      const projectExists = this.projectData.some(
        (project) =>
          project.projectId === selectedProject.projectId &&
          project.id !== this.priorityFrm.get('id')?.value
      );
      if (projectExists) {
        this.priorityFrm.get('project')?.setErrors({ alreadyExists: true });
        this.priorityFrm.get('projectPriority')?.disable();
      } else {
        this.priorityFrm.patchValue({
          projectId: selectedProject.projectId.toString(),
          projectName: selectedProject.projectName,
        });
        this.priorityFrm.get('project')?.setErrors(null);
        // Enable ProjectPriority dropdown
        this.priorityFrm.get('projectPriority')?.enable();
      }
      if (this.isEditMode && this.priorityFrm.get('projectPriority')?.value) {
        this.onEditPriorityExist();
        setTimeout(() => {
          this.validatePriorityAfterProjectChange();
        }, 100);
      }
    } else {
      this.priorityFrm.patchValue({ projectId: '', projectName: '' });
      this.priorityFrm.get('projectPriority')?.disable();
      this.clearPriorityError();
    }
  }

  onPriorityExist() {
    const customer = this.priorityFrm.get('customer')?.value;
    const project = this.priorityFrm.get('project')?.value;
    const priority = this.priorityFrm.get('projectPriority')?.value;

    if (customer && project && priority) {
      this.priorityService.getAllPriority().subscribe((response: any) => {
        this.priorityData = response;

        const duplicate = this.priorityData.find(
          (item) =>
            item.projectPriority?.trim().toLowerCase() ===
              priority.trim().toLowerCase() &&
            item.customer === customer.clientName &&
            item.project === project.projectName
        );

        const control = this.priorityFrm.get('projectPriority');

        if (duplicate) {
          control?.setErrors({ alreadyExists: true });
        }
      });
    }
  }

  getSeverity(status: number): string {
    switch (status) {
      case 1:
        return 'success';
      case 0:
        return 'danger';
      default:
        return 'danger';
    }
  }

  confirmDelete(data: any) {
    if (data) {
      this.recordToDelete = { ...data };
      if (this.recordToDelete) {
        console.log('del', this.recordToDelete);
        const priorityToDelete = String(this.recordToDelete.id);
        console.log(priorityToDelete, 'priorityToDelete');
        if (
          this.priorityNames &&
          this.priorityNames.includes(priorityToDelete)
        ) {
          this.showWarningDialog = true;
          this.displayDeleteDialog = false;
          return;
        }
        this.displayDeleteDialog = true;
      }
    }
  }

  onEditPriorityExist() {
    const customer = this.priorityFrm.get('customer')?.value;
    const project = this.priorityFrm.get('project')?.value;
    const currentPriority = this.priorityFrm
      .get('projectPriority')
      ?.value?.trim();

    if (customer && project && currentPriority) {
      if (currentPriority === this.originalPriorityName) {
        this.clearPriorityError();
        return;
      }
      this.priorityService.getAllPriority().subscribe((response: any) => {
        this.priorityData = response;
        // Check if the priority exists for the same customer and project
        const priorityExist = this.priorityData.find(
          (priority) =>
            priority.projectPriority?.trim().toLowerCase() ===
              currentPriority.toLowerCase() &&
            priority.customer === customer.clientName &&
            priority.project === project.projectName &&
            priority.id !== this.selectedPId
        );
        console.log(priorityExist, 'priot');
        if (priorityExist) {
          console.log(priorityExist, 'exist');
          this.priorityFrm
            .get('projectPriority')
            ?.setErrors({ alreadyExists: true });
        } else {
          this.clearPriorityError();
        }
      });
    }
  }

  onSubmit() {
    if (this.priorityFrm.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Form Invalid',
        detail: 'Fill necessary details!',
      });
      return;
    }

    const form = this.priorityFrm.value;
    const payload: Priority = {
      id: form.id,
      customerId: form.customer.clientId.toString(),
      customer: form.customer.clientName,
      projectId: form.project.projectId.toString(),
      project: form.project.projectName,
      projectPriority: form.projectPriority,
      status: form.status,
      remarks: form.remarks || null,
    };

    if (this.isEditMode) {
      this.priorityService.editPriority(payload).subscribe(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Priority Updated',
        });
        this.priorityDialogVisible = false;
        this.ngOnInit();
      });
    } else {
      this.priorityService.addPriority(payload).subscribe(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Priority Added',
        });
        this.priorityDialogVisible = false;
        this.ngOnInit();
      });
    }

    this.priorityFrm.reset();
  }

  private clearPriorityError() {
    const currentErrors = this.priorityFrm.get('projectPriority')?.errors;
    if (currentErrors?.['alreadyExists']) {
      delete currentErrors['alreadyExists'];
      const hasOtherErrors = Object.keys(currentErrors).length > 0;
      this.priorityFrm
        .get('projectPriority')
        ?.setErrors(hasOtherErrors ? currentErrors : null);
    }
  }

  editPriority(id: number): void {
    this.selectedPId = id;
    this.priorityService.getPriorityById(id).subscribe((response: any) => {
      const priorityIdToCheck = String(response.id);
      if (this.priorityNames && this.priorityNames.includes(priorityIdToCheck)) {
        this.showEditWarningDialog = true;
        return;
      }
      this.isEditMode = true;
      this.visible = true;
      this.priorityDialogVisible = true;
      this.originalPriorityName = response.projectPriority;
      this.filteredZohoProjects = this.zohoProjects.filter(
        (p) => p.clientId === response.customerId
      );
      const projectObj = this.filteredZohoProjects.find(
        (p) => p.projectId === response.projectId
      );
      const clientObj = this.zohoClients.find(
        (c) => c.clientId === response.customerId
      );

      this.priorityFrm.patchValue({
        id: response.id,
        customer: clientObj,
        customerId: response.customerId,
        project: projectObj,
        projectId: response.projectId,
        projectPriority: response.projectPriority,
        status: response.status,
        remarks: response.remarks || null,
      });

      this.priorityFrm.get('project')?.enable();
      this.priorityFrm.get('projectPriority')?.enable();
    });
  }

  getClientById(id: number): Client | null {
    if (!id || typeof id !== 'number') {
      console.error('Invalid ID provided to getClientById:', id);
      return null;
    }

    for (const client of this.clients) {
      if (id === client.id) {
        return client;
      }
    }
    return { id: 0, clientId: '', clientName: '' };
  }

  getProjectById(id: number): Projects {
    for (const project of this.projects) {
      if (id === project.id) {
        return project; // Return the correct client object
      }
    }
    return { id: 0, clientId: '', projectId: '', projectName: '' };
  }

  deleteTask() {
    this.userDetails = JSON.parse(localStorage.getItem('userLogin')!);
    this.userDetails = this.userDetails.data;
    const userId = this.userDetails.user_Id;
    console.log(this.recordToDelete, 'recordToDelete');
    this.recordToDelete.active = false;
    this.recordToDelete.ModifiedBy = userId.toString();
    this.priorityService
      .editPriority(this.recordToDelete)
      .subscribe((result) => {
        if (result) {
          this.displayDeleteDialog = false;
          this.ngOnInit();
          this.messageService.add({
            severity: 'success',
            detail: 'priority deleted successfully.',
          });
        }
      });
  }

  validatePriorityForSelectedProject() {
    const customer = this.priorityFrm.get('customer')?.value;
    const project = this.priorityFrm.get('project')?.value;
    const currentPriority = this.priorityFrm
      .get('projectPriority')
      ?.value?.trim();

    if (customer && project && currentPriority) {
      this.priorityService.getAllPriority().subscribe((response: any) => {
        this.priorityData = response;

        // Check if the priority exists for the newly selected customer and project (excluding current record)
        const priorityExists = this.priorityData.find(
          (priority) =>
            priority.projectPriority?.trim().toLowerCase() ===
              currentPriority.toLowerCase() &&
            priority.customer === customer.clientName &&
            priority.project === project.projectName &&
            priority.id !== this.selectedPId // Exclude current record
        );

        if (priorityExists) {
          this.priorityFrm
            .get('projectPriority')
            ?.setErrors({ alreadyExists: true });
        } else {
          this.clearPriorityError();
        }
      });
    } else {
      // Clear error if any required field is missing
      this.clearPriorityError();
    }
  }

  // Unified method to validate priority after project change (works for both edit and add mode)
  validatePriorityAfterProjectChange() {
    const customer = this.priorityFrm.get('customer')?.value;
    const project = this.priorityFrm.get('project')?.value;
    const currentPriority = this.priorityFrm.get('projectPriority')?.value;

    console.log('Validating priority after project change:', {
      customer: customer?.clientName,
      project: project?.projectName,
      priority: currentPriority,
      isEditMode: this.isEditMode,
      selectedPId: this.selectedPId,
    });

    if (customer && project && currentPriority && currentPriority.trim()) {
      this.priorityService.getAllPriority().subscribe((response: any) => {
        this.priorityData = response;

        // Check if the priority exists for the selected customer and project
        const priorityExists = this.priorityData.find((priority) => {
          const matches =
            priority.projectPriority?.trim().toLowerCase() ===
              currentPriority.trim().toLowerCase() &&
            priority.customer === customer.clientName &&
            priority.project === project.projectName;

          // In edit mode, exclude the current record
          if (this.isEditMode && this.selectedPId) {
            return matches && priority.id !== this.selectedPId;
          }

          // In add mode, check all records
          return matches;
        });

        console.log('Priority exists check:', priorityExists);

        if (priorityExists) {
          console.log('Setting alreadyExists error');
          this.priorityFrm
            .get('projectPriority')
            ?.setErrors({ alreadyExists: true });
        } else {
          console.log('Clearing priority error');
          this.clearPriorityError();
        }
      });
    } else {
      // Clear error if any required field is missing
      this.clearPriorityError();
    }
  }
}
