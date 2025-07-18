
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
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CalendarModule } from 'primeng/calendar';
import { HttpClientModule } from '@angular/common/http';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FileUploadModule } from 'primeng/fileupload';
import { MessageService } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';
import { SlaService } from '../../services/sla.service';
import { ProjectDetailsService } from '../../services/project-details.service';
import { TimesheetsComponent } from '../timesheets/timesheets.component';
import { SortPipe } from '../../../shared/pipes/sort.pipe';
import { TagModule } from 'primeng/tag';
import { ZohoClient } from '../../models/ZohoClient';
import { ZohoProject } from '../../models/ZohoProject';
import { ZohoService } from '../../services/zoho.service';
import { PriorityService } from '../../services/priority.service';
import { ProjectDetails } from '../../models/projectDetails';

interface selectedClient {
  id: any,
  clientName: string;
}
interface selectedProject {
  projectName: string,
  id: any
}

@Component({
  selector: 'app-response-sla',
  standalone: true,
  imports: [ButtonModule, DialogModule, TableModule, ToolbarModule, ToastModule, DropdownModule, InputTextModule,
    InputGroupAddonModule, InputGroupModule, CommonModule, FileUploadModule, MessagesModule,
    FormsModule, ReactiveFormsModule, CommonModule, HttpClientModule, CalendarModule, InputTextareaModule, TimesheetsComponent, SortPipe, TagModule],
  templateUrl: './response-sla.component.html',
  styleUrl: './response-sla.component.css'
})

export class ResponseSlaComponent implements OnInit {
  frm: FormGroup;
  projects: any[] = [];
  clients: any[] = [];
  SLA: any[] = [];
  visible: boolean = false;
  editDialog = false;
  editSLAData!: [];
  selectedId!: number;
  selectedClient!: selectedClient;
  selectedProject!: selectedProject;
  customerName!: string;
  customerId!: number;
  projectId!: number;
  projectName!: string;
  isEditMode: boolean = false;
  priorityData: any[] = [];
  zohoClients: ZohoClient[] = [];
  zohoProjects: ZohoProject[] = [];
  filteredZohoProjects: ZohoProject[] = [];
  filteredPriorityData: any[] = [];
  displayDeleteDialog: boolean = false;
  tableref: any;
  searchValue: any;
  projectData: ProjectDetails[] = [];
  filteredProjects: ProjectDetails[] = [];
  showWarningDialog: boolean = false;

  constructor(private fb: FormBuilder,
    private zohoService: ZohoService,
    private priorityService: PriorityService,
    private messageService: MessageService, private slaService: SlaService, private projectDetailsService: ProjectDetailsService) {
    this.frm = this.fb.group({
      id: [''],
      client: ['', Validators.required],
      project: ['', Validators.required],
      customerId: [''],
      customerName: ['', Validators.required],
      projectId: [''],
      projectName: ['', Validators.required],
      priorityId: ['', Validators.required],
      slaHours: ['', [Validators.required]],
      remarks: [''],
      active: [''],
      status: ['', Validators.required],

    });

    this.frm.get('slaHours')?.valueChanges.subscribe((slaValue) => {
      const projectId = this.frm.get('projectId')?.value;
      const priorityId = this.frm.get('priorityId')?.value;

      if (projectId && priorityId && slaValue !== null && slaValue !== '') {
        const isDuplicate = this.checkDuplicateSLA(projectId, priorityId, Number(slaValue));
        if (isDuplicate) {
          this.frm.get('slaHours')?.setErrors({ duplicate: true });
        } else {
          // Clean up 'duplicate' error only
          const control = this.frm.get('slaHours');
          const currentErrors = control?.errors;
          if (currentErrors && currentErrors['duplicate']) {
            delete currentErrors['duplicate'];
            if (Object.keys(currentErrors).length === 0) {
              control?.setErrors(null);
            } else {
              control?.setErrors(currentErrors);
            }
          }
        }
      }
    });

  }
  Status = [
    { label: 'Active', value: 1 },
    { label: 'Inactive', value: 0 }
  ];

  ngOnInit(): void {
    this.slaService.GetResponseSLAList().subscribe((Response: any) => {
      this.SLA = Response;
    });
    this.getAllProjectDetails();
    this.getAllZohoClients();
    this.getAllZohoProjects();
    this.getallProjectPriority();
  }

  getAllProjectDetails() {
    this.projectDetailsService
      .getAllProjectDetails()
      .subscribe((response: ProjectDetails[]) => {
        this.projectData = response;
      });
  }

  getPriorityLabel(priorityId: number): string {
  const found = this.priorityData.find(p => p.value === priorityId);
  return found ? found.label : priorityId.toString();
}


  getAllZohoProjects() {
    this.zohoService.getProjects().subscribe((projects: ZohoProject[]) => {
      this.zohoProjects = projects;
    });
  }

  getAllZohoClients() {
    this.zohoService.getClients().subscribe((clients: ZohoClient[]) => {
      this.zohoClients = clients;
    });
  }
  getallProjectPriority() {
    this.priorityService.getAllPriority().subscribe((response: any[]) => {
      if (response) {
        const activeItems = response.filter(item => item.active === true && item.status === 1);

        this.priorityData = activeItems.map(item => ({
          label: item.projectPriority?.trim(),  // clean up whitespace
          value: item.id,
          projectId: item.projectId
        }));
      } else {
        this.priorityData = [];
      }
    });
  }
  onClientSelected(selectedClient: ProjectDetails) {
    console.log("selected Client", selectedClient);

    if (selectedClient) {
      this.frm.patchValue({
        client: selectedClient,
        customerId: selectedClient.customerId,
        customerName: selectedClient.customerName,
      });
      const filteredProject = this.projectData.filter(
        (project) => project.customerId === selectedClient.customerId
      );
      this.filteredProjects = filteredProject;
      this.frm.get('project')?.setErrors(null);
      this.frm.get('priorityId')?.setErrors(null);
      this.frm.get('priorityId')?.reset();
      this.frm.get('project')?.reset();
    } else {
      this.filteredProjects = [];
    }
  }


  onProjectSelected(selectedProject: ZohoProject): void {
    if (selectedProject) {
      this.filteredPriorityData = this.priorityData.filter(
        (p) => p.projectId === selectedProject.projectId
      );

      console.log('Filtered priorities:', this.filteredPriorityData);

      // Patch the project fields
      this.frm.patchValue({
        projectId: selectedProject.projectId,
        projectName: selectedProject.projectName,
        priorityId: '' 
      });

      // Check if there are priorities available for the project
      const priorityControl = this.frm.get('priorityId');
      if (this.filteredPriorityData.length === 0) {
        priorityControl?.setErrors({ nopriority: true });
      } else {
        // Only remove 'nopriority' error, keep others if any
        const errors = priorityControl?.errors;
        if (errors && errors['nopriority']) {
          delete errors['nopriority'];
          if (Object.keys(errors).length === 0) {
            priorityControl?.setErrors(null);
          } else {
            priorityControl?.setErrors(errors);
          }
        }
      }

      this.frm.get('project')?.setErrors(null);
    } else {
      this.filteredPriorityData = [];
      this.frm.patchValue({
        projectId: '',
        projectName: '',
        priorityId: ''
      });
    }
  }



  onPrioritySelected(priorityId: number): void {

    const selected = this.filteredPriorityData.find(p => p.value === priorityId);
    const projectId = this.frm.get('projectId')?.value;

    this.frm.patchValue({
      priorityId: priorityId
    });
    
    const isDuplicate = this.SLA?.some(item =>
      item.projectId === projectId &&
      item.priorityId === priorityId &&
      item.slaId !== this.selectedId 
    );

    if (isDuplicate) {
      this.frm.get('priorityId')?.setErrors({ duplicate: true });
    } else {
      // Remove only the duplicate error if present
      const control = this.frm.get('priorityId');
      const currentErrors = control?.errors;
      if (currentErrors && currentErrors['duplicate']) {
        delete currentErrors['duplicate'];
        if (Object.keys(currentErrors).length === 0) {
          control?.setErrors(null);
        } else {
          control?.setErrors(currentErrors);
        }
      }
    }
  }


  checkDuplicateSLA(projectId: string, priorityId: number, slaHours: number): boolean {
    return this.SLA?.some((item: any) =>
      item.projectId === projectId &&
      item.priorityId === priorityId &&
      item.slaHours === slaHours &&
      item.slaId !== this.selectedId  // exclude the one being edited
    );
  }


  addSLA() {
    this.isEditMode = false;
    this.visible = true;
    this.frm.reset();
  }

  cancelEdit() {
    this.editDialog = false;
    this.frm.reset();
  }

  editSLA(id: number) {
    this.isEditMode = true;
    this.visible = true;
    this.selectedId = id;

    this.slaService.GetResponseSLAById(id).subscribe((response: any) => {
      console.log(response);

      const selectedClient = this.projectData.find(
        item => item.customerId === response.customerId
      );

      this.filteredProjects = this.projectData.filter(
        proj => proj.customerId === selectedClient?.customerId
      );

      const selectedProject = this.filteredProjects.find(
        proj => proj.projectId === response.projectId
      );

      this.filteredPriorityData = this.priorityData.filter(
        p => p.projectId === response.projectId
      );

      const selectedPriority = this.filteredPriorityData.find(
        p => p.value === response.priorityId
      );

      this.frm.patchValue({
        slaId: response.slaId,
        client: selectedClient,
        project: selectedProject,
        customerId: response.customerId,
        customerName: response.customerName,
        projectId: response.projectId,
        projectName: response.projectName,
        priorityId: selectedPriority?.value,
        slaHours: response.slaHours,
        remarks: response.remarks,
        status: response.status,
      });
    });
  }



  onSubmit() {
    console.log('Submit triggered');
    console.log('Form validity:', this.frm.valid);
    console.log('Form value:', this.frm.value);

    if (this.frm.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Form Invalid',
        detail: 'Fill necessary details!'
      });
      return;
    }

    const values = this.frm.value;

    const selectedPriorityObj = this.filteredPriorityData.find(
      p => p.value === values.priorityId
    );

    const payload = {
      slaId: values.slaId,
      customerId: values.client?.customerId,
      customerName: values.client?.customerName,
      projectId: values.project?.projectId,
      projectName: values.project?.projectName,
      priorityId: selectedPriorityObj?.value,
      slaHours: +values.slaHours,
      remarks: values.remarks,
      status: +values.status,
      active: true
    };

    console.log('Final payload to submit:', payload);

    if (this.isEditMode) {
      this.slaService.EditResponseSLA(payload).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Response SLA Updated Successfully' });
          this.visible = false;
          this.frm.reset();
          this.ngOnInit();
        },
        error: (err) => {
          console.error('Error during SLA update:', err);
        }
      });
    } else {
      this.slaService.AddResponseSLA(payload).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Response SLA Added Successfully' });
          this.visible = false;
          this.frm.reset();
          this.ngOnInit();
        },
        error: (err) => {
          console.error('Error during SLA add:', err);
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

  userDetails: any;
  recordToDelete: any;

  confirmDelete(data: any) {
    if (data) {
      this.recordToDelete = { ...data };
      if (this.recordToDelete) {
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
    this.slaService
      .EditResponseSLA(this.recordToDelete)
      .subscribe((result) => {
        if (result) {
          this.displayDeleteDialog = false;
          this.ngOnInit();
          console.log(this.recordToDelete);

          this.messageService.add({
            severity: 'success',
            detail: 'Response SLA Deleted Successfully.',
          });
        }
      });
  }

  filterTable() {
    this.tableref.filterGlobal(this.searchValue, 'contains');
  }

}
