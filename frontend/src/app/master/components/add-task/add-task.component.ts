
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { EditorModule } from 'primeng/editor';
import { MultiSelectModule } from 'primeng/multiselect';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { TaskService } from '../../services/task.service';
import { ToastModule } from 'primeng/toast';
import { MessagesModule } from 'primeng/messages';
import { MessageService } from 'primeng/api';
import { User } from '../../models/user';
import { ChangeDetectorRef } from '@angular/core';
import { Client } from '../../models/client';
import { Project } from '../../models/project';
import { FileUploadModule } from 'primeng/fileupload';
import { ProjectDetailsService } from '../../services/project-details.service';
import { ProjectDetails } from '../../models/projectDetails';
import { MessageModule } from 'primeng/message';
import { SortPipe } from "../../../shared/pipes/sort.pipe";
import moment from 'moment';

@Component({
  selector: 'app-add-task',
  standalone: true,
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss'],
  imports: [
    ButtonModule,
    DropdownModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    InputTextareaModule,
    EditorModule,
    MultiSelectModule,
    CalendarModule,
    InputTextModule,
    RouterModule,
    ToastModule,
    MessagesModule,
    MessageModule,
    FileUploadModule,
    SortPipe,
    FormsModule
  ]
})
export class AddTaskComponent implements OnInit {
  frm: FormGroup;
  filteredProjects!: any;
  userDetails!: User;
  projectId: number = 0;
  projectData: ProjectDetails[] = [];
  projectName: string = '';
  clients: Client[] = [];
  selectedProject: { projectName: string; projectId: number }[] = [];
  projects: Project[] = [];
  projectDropdownDisabled: boolean = true;
  users: { userId: number; userName: string }[] = [];
  optionDropdown: any[] = [];


  @Output() refreshTaskGrid = new EventEmitter<void>();

  billingType = [
    { label: 'Non-billable', value: 'Non-billable' },
    { label: 'Billable', value: 'Billable' },
  ];
  
  
  options = [
    { value: 'Development & Maintenance' },
    { value: 'Testing' },
    { value: 'Support' },
  ];

  minStartDate!: Date;
  maxEndDate!: Date;
  
  constructor(

    private fb: FormBuilder,
    private userService: UserService,
    public taskService: TaskService,
    private messageService: MessageService,
    private projectDetailsService: ProjectDetailsService,
    private datePipe: DatePipe,
    private cdr: ChangeDetectorRef
  ) {
    this.userDetails = JSON.parse(localStorage.getItem('userLogin')!);
    const userId = this.userDetails.user_Id;

    this.frm = this.fb.group({
      id: [0],
      client: ['', Validators.required],
      project: [{ value: '', disabled: true }, Validators.required],
      customerId: [''],
      customerName: [''],
      projectId: [''],
      projectName: [''],
      projectType: ['', Validators.required],
      assignedTo: [[], Validators.required],
      assignmentStartDate: ['', Validators.required],
      assignmentEndDate: [{ value: (new Date()).toISOString(), disabled: true }, Validators.required],
      assignmentPercent: ['', [Validators.required]],
      billingType: ['', Validators.required],
      generalMetrics: [null],
      options: [null, Validators.required],
      remarks: [''],
      taskAttachment: [null],
      createdBy: [userId],
    });
  }

  ngOnInit() {
    this.taskService.getAllProjectUniqueCustomer().subscribe((response: ProjectDetails[]) => {
      this.projectData = response.sort((a, b) => a.customerName.localeCompare(b.customerName));
    });
  
    this.userService.getAllUser().subscribe((Response: any) => {
      this.users = Response.map((user: User) => ({
        userId: user.user_Id,
        userName: user.userName,
      }));
    });
  
    this.projectDetailsService.getAllClients().subscribe((Response: Client[]) => {
      this.clients = Response;
    });
  
    this.projectDetailsService.getAllProjects().subscribe((Response: any) => {
      this.projects = Response;
    });

  }
  
  

  onCustomerChange() {
    const projectControl = this.frm.get('project');
    const clientValue = this.frm.get('client')?.value;

    if (clientValue) {
      projectControl?.enable();
    } else {
      projectControl?.reset();
      projectControl?.disable();
    }
  }

  addTaskClear() {
    this.frm.reset();
    this.taskService.addModalVisible = false;
  }

  onStartDateChange() {
    const endDateControl = this.frm.get('assignmentEndDate');
    const startDateValue = this.frm.get('assignmentStartDate')?.value;

    if (startDateValue) {
      endDateControl?.reset();
      endDateControl?.enable();
    } else {
      endDateControl?.reset();
      endDateControl?.disable();
    }
  }

  onSubmit(frm: any) {
    if (this.frm.valid) {
      const adjustedStartDate = moment.utc(frm.assignmentStartDate);
      const adjustedEndDate = moment.utc(frm.assignmentEndDate);
      const updatedTaskData = {
        id: frm.id,
        assignedTo: frm.assignedTo,
        assignmentStartDate: adjustedStartDate,
        assignmentEndDate: adjustedEndDate,
        assignmentPercent: frm.assignmentPercent,
        billingType: frm.billingType,
        client: frm.client,
        createdBy: frm.createdBy,
        customerId: frm.customerId,
        customerName: frm.customerName,
        generalMetrics: Array.isArray(frm.generalMetrics)
        ? frm.generalMetrics.map((metric: any) => ({
            id: 0,
            taskId: metric.taskId,
            taskDetailsId: 0,
            generalMetricsName: metric.generalMetricsName
          }))
        : [],      
        project: frm.project,
        projectId: frm.projectId,
        projectName: frm.projectName,
        projectType: frm.projectType,
        remarks: frm.remarks,
        supportMetrics: frm.supportMetrics,
        devMetrics: frm.devMetrics,
        testingMetrics: frm.testingMetrics,
        projectAttachment: frm.projectAttachment,
        taskAttachment: frm.taskAttachment,
        active: 1,
        status: 1,
        options: JSON.stringify(frm.options),
        
      };

      this.taskService.addTask(updatedTaskData).subscribe(
        () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Task added successfully!',
          });
          this.refreshTaskGrid.emit();
          this.frm.reset();
          this.taskService.addModalVisible = false;
        },
        (error) => {
          console.error('Error adding task:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Task not added.',
            detail: 'Customer & Project already exists!',
          });
        }
      );
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Invalid Fields',
        detail: 'Task was not added!',
      });
    }
  }

  onProjectSelected(selectedProject: ProjectDetails) {
    this.minStartDate = new Date(selectedProject.startDate);
    this.maxEndDate = new Date(selectedProject.endDate);
    if (selectedProject) {
      this.frm.patchValue({
        projectId: selectedProject.projectId,
        projectName: selectedProject.projectName,
      });
    }
  }

  onClientSelected(selectedClient: ProjectDetails) {
    if (selectedClient) {
      this.projectDropdownDisabled = false;
      this.frm.patchValue({
        customerId: selectedClient.customerId,
        customerName: selectedClient.customerName,
      });

      this.taskService.getAllProjectByCustomerId(selectedClient.customerId).subscribe((response: ProjectDetails) => {
        this.filteredProjects = response;
      });
    } else {
      this.filteredProjects = [];
    }
  }

  onProjectTypeSelected(projectType: string) {
    console.log('Project Type Selected:', projectType);
    this.frm.get('metrics')?.reset();
    this.frm.get('options')?.reset();   
  }
}
