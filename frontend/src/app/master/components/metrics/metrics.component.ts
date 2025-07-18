import { Component, OnInit, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { CommonModule } from '@angular/common';
import { ProjectDetails } from '../../models/projectDetails';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Calendar, CalendarModule } from 'primeng/calendar';
import { HttpClientModule } from '@angular/common/http';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FileUploadModule } from 'primeng/fileupload';
import { MessageService } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';
import { ProjectDetailsService } from '../../services/project-details.service';
import { CardModule } from 'primeng/card';
import { TaskService } from '../../services/task.service';
import { UserService } from '../../services/user.service';
import {Task } from '../../models/task';
import { MultiSelectModule } from 'primeng/multiselect';
import { User } from '../../models/user';
import { PriorityService } from '../../services/priority.service';
import { DevelopmentMetrics, DevelopmentTaskDetails, EditDevelopmentMetrics, Metrics, TicketDetails } from '../../models/metrics';
import { ComplexityService } from '../../services/complexity.service';
import { MetricsService } from '../../services/metrics.service';
import { Complexity } from '../../models/complexity';
import { SortPipe } from '../../../shared/pipes/sort.pipe';
import moment from 'moment';
import { MetricsCalculationPipe } from '../../../shared/pipes/metrics-calculation.pipe';
@Component({
  selector: 'app-metrics',
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
    MultiSelectModule,
    SortPipe
  ],
  templateUrl: './metrics.component.html',
  styleUrl: './metrics.component.scss',
})
export class MetricsComponent implements OnInit {
  taskData: Task[] = [];
  priorityData: any[] = [];
  customerId: number = 0;
  selectedProjects: Task[] = [];
  projectType: string = '';
  editProjectType:string ='Support';
  filteredProjects: Task[] = [];
  EditFilteredProjects: any[]=[];
  filteredPriority:  { value: string; label: string }[]=[];
  filteredComplexity:{ value: string; label: string }[]=[];
  selectedProject!: string;
  clientSelected: boolean = false;
  supportForm!: FormGroup;
  editSpptFrm!:FormGroup;
  editMetricsData:Metrics[]=[];
  today: Date = new Date();
  complexityData: any[]=[];
  selectedMonthYear: Date = new Date();
  // userDetails!: User;
  users: { userId: number; userName: string; ticketAssignedToId:number; taskDetailsId: number }[] = [];
  options :string[] =  ['Yes', 'No'];
  onTime = [{lable:'Yes',value:true},{lable:'No',value:false}]
  ticketData:any;
  filteredCustomerNames!:any;
  editdevelopmentForm!: FormGroup;
  editDevMetrics:boolean = false;
  ticketOptions :string[] =  [
    'Open',
    'Work In Progress',
    'Pending',
    'Closed',
    'Hold',
    'Cancelled',
  ];
  taskStatus :string[] =  [
    'Completed',
    'In Progress',
    'Pending',
    'On Hold',
  ];
  metricsData: Metrics[]=[];
  devMetrics: DevelopmentMetrics[]=[];
  addMetrics: boolean = false;
  editMetrics:boolean = false;
  projectDropdownDisabled : boolean = true;
  selectedStartDate: Date = new Date();
  selectedEndDate: Date = new Date();
  projectData: ProjectDetails[]=[];
  metricsExist : boolean = false;
  maxDates: Date[] = [];
  minDates: Date[] = [];
  minAssignDates:Date[] = [];
  maxAssignDates: Date[] =[];
  disabledDates: Date[][] = [];
  weekStartDate!:Date;
  weekEndDate!:Date;
  maxEndDate:any;
  minEndDate: any;
  addDevelopmentMetrics: boolean = false;
  selectedClientSupport:any;
  selectedProjectSuppport:any
  developmentForm!: FormGroup;
  gridData!:any;
  @ViewChild('weekStartDateCalendar') weekStartDateCalendar!: Calendar;
  @ViewChild('weekEndDateCalendar') weekEndDateCalendar!: Calendar;
  editDevid!: number;
  editTaskId: any;
  editspptId!: number;
  editspptMetricsId!: number;
  plannedDurationValue!: number;
  selectedPlannedStartDate: any;
  selectedActualStartDate: any;
  actualDurationValue!: number;
  onTimeDeliveryValue!: string;
  expectedCompletionMonthValue!: number;
  actualEndDateValue: any;
  statusValue: any;
  taskToBeCompletedValue!: any;
  selectedProjectType: string | undefined;
  startDate!: Date;
  endDate!: Date;

  constructor(
    private fb: FormBuilder,
    public taskService: TaskService,
    private userService: UserService,
    private messageService: MessageService,
    private projectDetailsService: ProjectDetailsService,
    private priorityService: PriorityService,
    private complexityService : ComplexityService,
    private metricsService : MetricsService,
    private metricsCalculationPipe: MetricsCalculationPipe
  ) {
    const today = new Date();
    this.selectedMonthYear = new Date(today.getUTCFullYear(), today.getMonth(), 1);
  }

  ngOnInit(): void {
    this.ticketOptions = this.ticketOptions.slice().sort();
    this.options = this.options.slice().sort();
    this.metricsService.getAllMetrics().subscribe((Response:Metrics[])=>{
      this.metricsData = Response;
      console.log(this.metricsData,"Metrics DATA");
         
    });

    this.supportForm = this.fb.group({
      client:['', Validators.required],
      project:[{ value: '', disabled: true }, Validators.required],
      customerId: [''],
      customerName: [''],
      projectId: [''],
      projectName: [''],
      projectType: [''],
      monthYear: [null, Validators.required],
      weekStartDate: [{ value: null, disabled: true }, Validators.required],
      weekEndDate: [{ value: null, disabled: true }, Validators.required],
      ticketDetails: this.fb.array([
        this.newTicket()
      ]),
    }); 
    this.developmentForm = this.fb.group({
      client:[''],
      project:[{ value: '', disabled: true }, Validators.required],
      customerId: [''],
      customerName: [''],
      projectId: [''],
      projectName: [''],
      projectType: [''],
      monthYear: [null, Validators.required],
      weekStartDate: [{ value: null, disabled: true }, Validators.required],
      weekEndDate: [{ value: null, disabled: true }, Validators.required],
      developmentTasks: this.fb.array([
        this.newDevelopmentTicket()
      ]),
    }); 
    this.editdevelopmentForm = this.fb.group({
      client:[''],
      project:[{ value: '', disabled: true }, Validators.required],
      customerId: [''],
      customerName: [''],
      projectId: [''],
      projectName: [''],
      projectType: [''],
      monthYear: [null, Validators.required],
      weekStartDate: [{ value: null, disabled: true }, Validators.required],
      weekEndDate: [{ value: null, disabled: true }, Validators.required],
      editDevelopmentTasks: this.fb.array([
        this.editDevelopmentTicket()
      ]),
    });

    this.editSpptFrm = this.fb.group({
      id:[0],
      client:['', Validators.required],
      project:['', Validators.required],
      customerId: [''],
      customerName: [''],
      projectId: [''],
      projectName: [''],
      projectType: [''],
      monthYear: [null, Validators.required],
      weekStartDate: [{ value: null}, Validators.required],
      weekEndDate: [{ value: null }, Validators.required],
      ticketDetails: this.fb.array([
        this.newEditTicket()
      ]),
    }); 

    this.taskService.getAllTasks().subscribe(
      (response: Task[]) => {
        this.taskData = response;
        const seenProjectNames = new Set();
        this.taskData = response.filter(customer => {
          const duplicate = seenProjectNames.has(customer.customerName);
          seenProjectNames.add(customer.customerName);
          return !duplicate;
        });
        console.log(this.filteredCustomerNames,"cus");
        
      },
      (error: any) => {
        console.log('Error Happened', error);
      }
    );
    this.userService.getAllUser().subscribe((Response: any) => {
      this.users = Response.map((user: User) => ({
        userId: user.user_Id,
        userName: user.userName,
        ticketAssignedToId : user.ticketAssignedToId,
        ticketDetailsId : user.ticketDetailsId,
        workedById : user.workedById,
        closedById :user.closedById

      }));
      // .sort((a:any, b:any) => a.userName.localeCompare(b.userName));
    });
    // this.users.slice().sort();
    this.priorityService.getAllPriority().subscribe((response: any) => {
      if (response != null) {
        this.priorityData = this.filterByPriorityStatus(response, 1);
        console.log(this.priorityData,"priority");
      }
    });
    this.metricsService.getAllComplexity().subscribe(
      (response: Complexity[]) => {
        this.complexityData = this.filterByStatus(response, 1);
        console.log(this.complexityData, "complex");
      },
      (error: any) => {
        console.log('Error Happened', error);
      }
    );
  }
  filterByStatus(data: any[], status: number): any[] {
    return data.filter(item => item.status === status);
  }
  filterByPriorityStatus(data: any[], status: number): any[] {
    return data.filter(item => item.status === status);
  }
  removeDuplicates(tasks: Task[]): Task[] {
    // Remove duplicates by customerId
    const uniqueByCustomerId = tasks.filter((task, index, self) => 
      index === self.findIndex(t => t.customerId === task.customerId)
    );

    // Remove duplicates by projectId
    const uniqueByProjectId = uniqueByCustomerId.filter((task, index, self) => 
      index === self.findIndex(t => t.projectId === task.projectId)
    );
    return uniqueByProjectId;
  }

  onArraySubmit(supportForm: FormGroup) {
    if (supportForm.valid) {
      const customerId = this.supportForm.get('client')?.value?.customerId;
      const projectId = this.supportForm.get('project')?.value?.projectId;
      const weekStartDate = new Date(this.supportForm.get('weekStartDate')?.value); 
      const weekEndDate = new Date(this.supportForm.get('weekEndDate')?.value); 
  
      this.metricsService.getAllMetrics().subscribe((response: Metrics[]) => {
        this.metricsData = response
      });
      
      const metricExists = this.metricsData.some(metric => 
        metric.customerId === customerId && 
        metric.projectId === projectId &&
        this.isSameDate(metric.weekStartDate, weekStartDate) && 
        this.isSameDate(metric.weekEndDate, weekEndDate)
      );
      if (metricExists) {
        this.metricsExist = true;
        this.messageService.add({
          severity: 'error',
          summary: 'Metrics already exist!',
          detail: `For the week (${weekStartDate.toDateString()} - ${weekEndDate.toDateString()})`,
        }); 
      } 
      else{
        this.metricsExist = false;
      }
      const metricsData = supportForm.value;
      console.log(metricsData,"ADDmetrics data");
      this.metricsService.addMetrics(metricsData).subscribe(
        (response) => {
          supportForm.reset();
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Metrics added successfully!!',
          });
          console.log('Task added successfully:', response);
          this.addMetrics = false;
          this.metricsService.getAllMetrics().subscribe((Response:Metrics[])=>{
            this.metricsData = Response;    
              console.log(this.metricsData,"Metrics Data");
          })  
        },
        (error) => {
          console.error('Error adding task:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Metrics not added.',
            detail: '',
          });
        }
      );
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Invalid Fields',
        detail: 'Metrics was not added!!!',
      });
    }
  }
  
  onDevelopmentSubmit(developmentForm: FormGroup) {
    console.log(developmentForm.value,"Dev Form");
    
    if (developmentForm.valid) {
      const customerId = this.developmentForm.get('client')?.value?.customerId;
      const projectId = this.developmentForm.get('project')?.value?.projectId;
      const weekStartDate = new Date(this.developmentForm.get('weekStartDate')?.value); 
      const weekEndDate = new Date(this.developmentForm.get('weekEndDate')?.value); 
  
      this.metricsService.getAllDevMetrics().subscribe((response: DevelopmentMetrics[]) => {
        this.devMetrics = response;
      });
      
      const metricExists = this.devMetrics.some(metric => 
        metric.customerId === customerId && 
        metric.projectId === projectId &&
        this.isSameDate(metric.weekStartDate, weekStartDate) && 
        this.isSameDate(metric.weekEndDate, weekEndDate)
      );
      if (metricExists) {
        this.metricsExist = true;
        this.messageService.add({
          severity: 'error',
          summary: 'Metrics already exist!',
          detail: `For the week (${weekStartDate.toDateString()} - ${weekEndDate.toDateString()})`,
        }); 
      } 
      else{
        this.metricsExist = false;
      }

      const devMetricsData = developmentForm.value;
      console.log(devMetricsData,"ADDdevmetrics data");
      this.metricsService.addDevMetrics(devMetricsData).subscribe(
        (response) => {
          console.log(response,"DevResponse");
          
          developmentForm.reset();
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Metrics added successfully!!',
          });
          console.log('Task added successfully:', response);
          this.addDevelopmentMetrics = false;
          this.addMetrics = false;
          this.metricsService.getAllMetrics().subscribe((Response:Metrics[])=>{
            this.metricsData = Response;      
          })  
        },
        (error) => {
          console.error('Error adding task:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Metrics not added.',
            detail: '',
          });
        }
      );
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Invalid Fields',
        detail: 'Metrics was not added!!!',
      });
    }
  }
  
  get tickets():FormArray  {
    return this.supportForm.get("ticketDetails") as FormArray
  }
  get developmentTickets():FormArray  {
    return this.developmentForm.get("developmentTasks") as FormArray
  }
  get editTickets():FormArray  {
    return this.editSpptFrm.get("ticketDetails") as FormArray
  }
  get editDevelopmentTickets():FormArray  {
    return this.editdevelopmentForm.get("editDevelopmentTasks") as FormArray
  }
  //Calculation methods
  plannedDatesCalc(e: any, idx: number) {
    console.log(e, this.developmentTickets.controls[idx].get('plannedStartDate')?.value, "planned dates");

    const plannedStartDate = this.developmentTickets.controls[idx].get('plannedStartDate')?.value;
    const plannedEndDate = e;

    if (plannedStartDate && plannedEndDate) {
        const duration = this.metricsCalculationPipe.transform(plannedStartDate, plannedEndDate);
        this.developmentTickets.controls[idx].get('plannedDuration')?.setValue(duration);
    }
    this.getPlannedMonth(plannedEndDate, idx);
}
editPlannedDatesCalc(e: any, idx: number) {
  console.log(e, this.editDevelopmentTickets.controls[idx].get('plannedStartDate')?.value, "planned dates");

  const plannedStartDate = this.editDevelopmentTickets.controls[idx].get('plannedStartDate')?.value;
  const plannedEndDate = e;

  if (plannedStartDate && plannedEndDate) {
      const duration = this.metricsCalculationPipe.transform(plannedStartDate, plannedEndDate);
      this.editDevelopmentTickets.controls[idx].get('plannedDuration')?.setValue(duration);
  }
  this.editGetPlannedMonth(plannedEndDate, idx);
}

actualDateCalc(e: any, idx: number) {

    const actualStartDate = this.developmentTickets.controls[idx].get('actualStartDate')?.value;
    const actualEndDate = e;

    if (actualStartDate && actualEndDate) {
        const duration = this.metricsCalculationPipe.transform(actualStartDate, actualEndDate);
        this.developmentTickets.controls[idx].get('actualDuration')?.setValue(duration);
    }
}
editActualDateCalc(e: any, idx: number) {
  console.log(e, this.editDevelopmentTickets.controls[idx].get('actualStartDate')?.value, "actual dates");

  const actualStartDate = this.editDevelopmentTickets.controls[idx].get('actualStartDate')?.value;
  const actualEndDate = e;

  if (actualStartDate && actualEndDate) {
      const duration = this.metricsCalculationPipe.transform(actualStartDate, actualEndDate);
      this.editDevelopmentTickets.controls[idx].get('actualDuration')?.setValue(duration);
  }
}

onTimeDeliveryCalc(e: any, idx: number){
  this.statusValue = e.value;
  const actualEndDate = this.developmentTickets.controls[idx].get('actualEndDate')?.value;
  this.actualEndDateValue = actualEndDate
  const plannedEndDate = this.developmentTickets.controls[idx].get('plannedEndDate')?.value;
  if(actualEndDate && e.value){
    this.onTimeDeliveryValue = this.metricsCalculationPipe.onTimeDeliveryTransform(e.value, plannedEndDate, actualEndDate);
    this.developmentTickets.controls[idx].get('onTimeDelivery')?.setValue(this.onTimeDeliveryValue);
    console.log(this.onTimeDeliveryValue,"onTime");
    this.taskToBeCompletedValue = this.metricsCalculationPipe.taskToBeCompletedThisMonth(this.actualEndDateValue, this.statusValue,this.expectedCompletionMonthValue);
    this.developmentTickets.controls[idx].get('taskToBeCompletedThisMonth')?.setValue(this.taskToBeCompletedValue);
  }
}

editOnTimeDeliveryCalc(e: any, idx: number){
  this.statusValue = e.value;
  const actualEndDate = this.editDevelopmentTickets.controls[idx].get('actualEndDate')?.value;
  this.actualEndDateValue = actualEndDate
  const plannedEndDate = this.editDevelopmentTickets.controls[idx].get('plannedEndDate')?.value;
  if(actualEndDate && e.value){
    this.onTimeDeliveryValue = this.metricsCalculationPipe.onTimeDeliveryTransform(e.value, plannedEndDate, actualEndDate);
    this.editDevelopmentTickets.controls[idx].get('onTimeDelivery')?.setValue(this.onTimeDeliveryValue);
    console.log(this.onTimeDeliveryValue,"onTime");
    this.taskToBeCompletedValue = this.metricsCalculationPipe.taskToBeCompletedThisMonth(this.actualEndDateValue, this.statusValue,this.expectedCompletionMonthValue);
    this.editDevelopmentTickets.controls[idx].get('taskToBeCompletedThisMonth')?.setValue(this.taskToBeCompletedValue);
  }
}

getPlannedMonth(plannedEndDate: Date | string, idx:number): number {
  if (typeof plannedEndDate === 'string') {
      plannedEndDate = new Date(plannedEndDate);
  }
  this.expectedCompletionMonthValue = plannedEndDate.getMonth() + 1;
  this.developmentTickets.controls[idx].get('expectedCompletionMonth')?.setValue(this.expectedCompletionMonthValue);
  return this.expectedCompletionMonthValue;
}

editGetPlannedMonth(plannedEndDate: Date | string, idx:number): number {
  if (typeof plannedEndDate === 'string') {
      plannedEndDate = new Date(plannedEndDate);
  }
  this.expectedCompletionMonthValue = plannedEndDate.getMonth() + 1;
  this.editDevelopmentTickets.controls[idx].get('expectedCompletionMonth')?.setValue(this.expectedCompletionMonthValue);
  return this.expectedCompletionMonthValue;
}

  newTicket(): FormGroup {
    return this.fb.group({           
      ticketNo: ['', Validators.required],
      ticketDesc: [''],
      createDate: [null, Validators.required],
      createdBy: [''],
      ticketAssignedTo: [[]],
      assignedDate: [null, Validators.required],
      assignedBy: [''],
      priorityId: [0],
      priority: ['', Validators.required],
      complexityId: [0],
      complexity: ['',  Validators.required],
      expectedClosureDate: [null],
      expectedClosureEffort: [null],
      actualResolvedDate: [null, Validators.required],
      actualResolutionEffort: [null, Validators.required],
      workedBy: [[], Validators.required],
      closedBy: [[], Validators.required],
      reopened: ['', Validators.required],
      reopenedDate: [{ value: '', disabled: true }],
      ticketStatus: ['', Validators.required],
      slaMet: ['', Validators.required],
    });
  }
  newDevelopmentTicket(): FormGroup {
    return this.fb.group({           
      taskName: ['', Validators.required],
      crNumber: [''],
      priority: [''],
      plannedStartDate:[null,Validators.required],
      plannedEndDate:[{value:'',  disabled: true}, Validators.required],
      plannedDuration:[''],
      actualStartDate:[null,Validators.required],
      actualEndDate: [{value:'',  disabled: true}, Validators.required],
      actualDuration:[''],
      onTimeDelivery:[''],
      plannedEffort:['', Validators.required],
      actualEffort:['', Validators.required],
      numberOfDefects:['',Validators.required],
      reworkEffort: [''],
      status:['', Validators.required],
      remarks:[''],
      expectedCompletionMonth:['', Validators.required],
      taskToBeCompletedThisMonth:['', Validators.required],
    });
  }
  editDevelopmentTicket(): FormGroup {
    return this.fb.group({    
      id:[0],
      metricsId:[0],     
      taskName: ['', Validators.required],
      crNumber: [''],
      priority: [''],
      plannedStartDate:[null,Validators.required],
      plannedEndDate:[null, Validators.required],
      plannedDuration:[''],
      actualStartDate:[null,Validators.required],
      actualEndDate: [null, Validators.required],
      actualDuration:[''],
      onTimeDelivery:[''],
      plannedEffort:['', Validators.required],
      actualEffort:['', Validators.required],
      numberOfDefects:['',Validators.required],
      reworkEffort: [''],
      status:['', Validators.required],
      remarks:[''],
      expectedCompletionMonth:['', Validators.required],
      taskToBeCompletedThisMonth:['', Validators.required],
    });
  }
  newEditTicket(): FormGroup {
    return this.fb.group({
      ticketDetailsId: [0],
      metricsId:[],
      metricsDetailsId:[],
      ticketNo: ['', Validators.required],
      ticketDesc: [''],
      createDate: [null, Validators.required],
      createdBy: [''],
      ticketAssignedTo: [[]],
      assignedDate: [null, Validators.required],
      assignedBy: [''],
      priorityId: [0],
      priority: [{value:''}, Validators.required],
      complexityId: [0],
      complexity: [{value:''}, Validators.required],
      expectedClosureDate: [null],
      expectedClosureEffort: [null],
      actualResolvedDate: [null, Validators.required],
      actualResolutionEffort: [null, Validators.required],
      workedBy: [[], Validators.required],
      closedBy: [[], Validators.required],
      reopened: ['', Validators.required],
      reopenedDate: [{ value: null, disabled: true }],
      ticketStatus: ['', Validators.required],
      slaMet: ['', Validators.required],
    });
  }
  enableActualEndDate(idx:any){
    const enableEndate = this.developmentTickets.controls[idx].get('actualEndDate');
    enableEndate?.enable();
  }
  enablePlannedEndDate(idx:any){
    const enableEndate = this.developmentTickets.controls[idx].get('plannedEndDate');
    enableEndate?.enable();
  }
  
  addRow(): void {
    if (this.tickets.length < 10) {
        this.tickets.push(this.newTicket());
    } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Cannot add more rows. Maximum limit reached.',
          detail: '',
        });
    }
}
addDevRow(): void {
  if (this.developmentTickets.length < 10) {
      this.developmentTickets.push(this.newDevelopmentTicket());
  } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Cannot add more rows. Maximum limit reached.',
        detail: '',
      });
  }
}
addEditRow(): void {
  if (this.editTickets.length < 10) {
      this.editTickets.push(this.newEditTicket());
  } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Cannot add more rows. Maximum limit reached.',
        detail: '',
      });
  }
}
  removeRow(idx: number): void {
    if (this.tickets.length > 1) {
      this.tickets.removeAt(idx);
  } else {
    this.messageService.add({
      severity: 'error',
      summary: 'Atleast one row should be there!',
      detail: '',
    });
  } 
 }
 removeDevRow(idx: number): void {
  if (this.developmentTickets.length > 1) {
    this.developmentTickets.removeAt(idx);
} else {
  this.messageService.add({
    severity: 'error',
    summary: 'Atleast one row should be there!',
    detail: '',
  });
} 
}
 removeEditRow(idx: number): void {
  if (this.editTickets.length > 1) {
    this.editTickets.removeAt(idx);
} else {
  this.messageService.add({
    severity: 'error',
    summary: 'Atleast one row should be there!',
    detail: '',
  });
} 
}
addDevEditRow(): void {
  if (this.editDevelopmentTickets.length < 10) {
      this.editDevelopmentTickets.push(this.editDevelopmentTicket());
  } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Cannot add more rows. Maximum limit reached.',
        detail: '',
      });
  }
}
removeDevEditRow(idx: number): void {
  if (this.editDevelopmentTickets.length > 1) {
    this.editDevelopmentTickets.removeAt(idx);
} else {
  this.messageService.add({
    severity: 'error',
    summary: 'Atleast one row should be there!',
    detail: '',
  });
} 
}

// calculateBusinessDays(startDate: Date, endDate: Date): number 
// { 
//   let businessDaysCount = 0; 
//   const currentDate = new Date(startDate);
//    while (currentDate <= endDate) 
//     { const dayOfWeek = currentDate.getDay(); 
//     if (dayOfWeek !== 0 && dayOfWeek !== 6) {
//        // 0 is Sunday, 6 is Saturday 
//        businessDaysCount++; 
//        } 
//        currentDate.setDate(currentDate.getDate() + 1); 
//        } 
//        return businessDaysCount;
//        }





onCreateDateChange(event: any, idx: number): void {
  const createDate = moment(event);
  if (createDate.isValid()) {
    const endOfMonth = createDate.clone().endOf('day').toDate();
    this.maxDates[idx] = endOfMonth;
    this.minDates[idx] = createDate.startOf('day').toDate();
  }
}
onAssignedDateChange(event: any, idx: number): void {
  const createDate = moment(event);
  if (createDate.isValid()) {
    const endOfMonth = createDate.clone().endOf('day').toDate();
    this.maxAssignDates[idx] = endOfMonth;
    this.minAssignDates[idx] = createDate.startOf('day').toDate();
  }
}


  editTask(id: number, flagType:string) {
    // this.metricsService.getMetricsById(id).subscribe((response:any)=>{      
      // const selectedClient = this.getClientById(response.projectId);
      // this.selectedProject = response.projectName;
      // this.projectType = response.projectType;
      // console.log(response,"ressss");
      this.projectType = flagType;
      this.editDevid = id;
    if(flagType === "Support"){
      this.editMetrics = true;
      this.addMetrics = false;
      this.metricsService.getMetricsById(id).subscribe((response:any)=>{      
        const selectedClient = this.getClientById(response.projectId);
        this.selectedProject = response.projectName;
        
        this.editSpptFrm.patchValue({
          id:response.id,
          client: selectedClient,
          project: selectedClient,
          customerId: response.customerId,
          customerName: response.customerName,
          projectId: response.projectId,
          projectName: response.projectName,
          projectType: response.projectType,
          monthYear: new Date(response.monthYear),
          weekStartDate: new Date(response.weekStartDate),
          weekEndDate: new Date(response.weekEndDate),
          flagType : flagType
        });
        
        this.priorityService.getAllPriority().subscribe((response: any) => {
          if (response != null) {
            this.priorityData = response;
          }
        });
  
        const filteredPriorities = this.priorityData.filter(
          (priority) =>
            priority.customer === response.customerName &&
            priority.project === response.projectName
        );
    
        this.filteredPriority = filteredPriorities.map((priority) => ({
          label: priority.projectPriority,
          value: priority.projectPriority
        }));
  
        const filteredComplexities = this.complexityData.filter(
          (complexity) =>
            complexity.customer === response.customerName &&
            complexity.project === response.projectName
        );
    
        this.filteredComplexity = filteredComplexities.map((complexity) => ({
          label: complexity.projectComplexity,
          value: complexity.projectComplexity
        }));
        
  
        const ticketDetailsFormArray = this.editSpptFrm.get('ticketDetails') as FormArray;
        ticketDetailsFormArray.clear();
        response.ticketDetails.forEach((ticket: TicketDetails) => { 
          this.editspptId = ticket.ticketDetailsId;
          this.editspptMetricsId = ticket.metricsDetailsId;
          const ticketFormGroup = this.newEditTicket();
          const ticketAssignedToValue = this.getTicketAssignedTo(ticket.ticketAssignedTo);
          const closedByValue = this.getClosedBy(ticket.closedBy);
          const workedByValue = this.getWorkedBy(ticket.workedBy);
          this.filteredPriority = [{ label: ticket.priority, value: ticket.priority }];
          this.filteredComplexity =[{ label: ticket.complexity, value: ticket.complexity }];
          const assignUserNames = ticketAssignedToValue.map(user =>user.userName);
          console.log(assignUserNames,"usernamedsab");
          
          const closedByUserNames = closedByValue.map(user =>user.userName);
          const workedByUserNames = workedByValue.map(user =>user.userName);

          ticketFormGroup.patchValue({
            ticketDetailsId : ticket.ticketDetailsId,
            metricsId: ticket.metricsId,
            metricsDetailsId: ticket.metricsDetailsId,
            ticketNo: ticket.ticketNo,
            ticketDesc: ticket.ticketDesc,
            createDate: new Date(ticket.createDate), 
            createdBy: ticket.createdBy,
            ticketAssignedTo: assignUserNames,
            assignedDate: new Date(ticket.assignedDate), 
            assignedBy: ticket.assignedBy,
            priorityId: ticket.priorityId,
            priority: ticket.priority,
            complexityId: ticket.complexityId,
            complexity:  ticket.complexity,
            expectedClosureDate: new Date(ticket.expectedClosureDate), 
            expectedClosureEffort: ticket.expectedClosureEffort,
            actualResolvedDate: new Date(ticket.actualResolvedDate), 
            actualResolutionEffort: ticket.actualResolutionEffort,
            workedBy: workedByUserNames,
            closedBy: closedByUserNames,
            reopened: ticket.reopened,
            reopenedDate: new Date(ticket.reopenedDate), 
            ticketStatus: ticket.ticketStatus,
            slaMet: ticket.slaMet,
          });
  
          ticketDetailsFormArray.push(ticketFormGroup);
        });
        
      });
    }
    if(flagType === "Development"){
      this.editMetrics = false;
      this.editDevMetrics = true;
      this.addMetrics = false;
    this.addDevelopmentMetrics = false;

    
    this.metricsService.getDevMetricsById(id).subscribe((response:any)=>{      
        const selectedClient = this.getClientById(response.projectId);
        this.selectedProject = response.projectName;
        console.log(response, "Development Metrics Response");

        this.editdevelopmentForm.patchValue({
            id: response.id,
            client: selectedClient,
            project: selectedClient,
            customerId: response.customerId,
            customerName: response.customerName,
            projectId: response.projectId,
            projectName: response.projectName,
            projectType: response.projectType,
            monthYear: new Date(response.monthYear),
            weekStartDate: new Date(response.weekStartDate),
            weekEndDate: new Date(response.weekEndDate),
            flagType : flagType
        });

        this.priorityService.getAllPriority().subscribe((response: any) => {
            if (response != null) {
                this.priorityData = response;
            }
        });

        const filteredPriorities = this.priorityData.filter(
            (priority) =>
                priority.customer === response.customerName &&
                priority.project === response.projectName
        );

        this.filteredPriority = filteredPriorities.map((priority) => ({
            label: priority.projectPriority,
            value: priority.projectPriority
        }));

        const editTaskDevDetailsFormArray = this.editdevelopmentForm.get('editDevelopmentTasks') as FormArray;
        editTaskDevDetailsFormArray.clear();

        response.developmentTasks.forEach((task: any) => {
          this.editTaskId = task.id;
          console.log(response.developmentTasks,"devvvvvvvvvv");
          
            const edittaskFormGroup = this.editDevelopmentTicket();
            edittaskFormGroup.patchValue({
                id: task.taskId,
                metricsId: task.metricsId,
                taskName: task.taskName,
                crNumber: task.crNumber,
                priority: task.priority,
                plannedStartDate: new Date(task.plannedStartDate),
                plannedEndDate: new Date(task.plannedEndDate),
                plannedDuration: task.plannedDuration,
                actualStartDate: new Date(task.actualStartDate),
                actualEndDate: new Date(task.actualEndDate),
                actualDuration: task.actualDuration,
                onTimeDelivery: task.onTimeDelivery? "Yes": "No",
                plannedEffort: task.plannedEffort,
                actualEffort: task.actualEffort,
                numberOfDefects: task.numberOfDefects,
                reworkEffort: task.reworkEffort,
                status: task.status,
                remarks: task.remarks,
                expectedCompletionMonth: task.expectedCompletionMonth,
                taskToBeCompletedThisMonth: task.taskToBeCompletedThisMonth
            });
            editTaskDevDetailsFormArray.push(edittaskFormGroup);
            console.log(editTaskDevDetailsFormArray,"editTaskArry")
        });
    });
    }
  // });
   
  }
  onUpdate(editSpptFrm: FormGroup){
    if(editSpptFrm.valid){

      const metricsData = {
        ...editSpptFrm.value,
        ticketDetails: this.attachMetricsIdToTicketDetails(editSpptFrm.get('ticketDetails')?.value)
    };
      console.log(metricsData,"metricsData   ddd");
      // const metricsData = editSpptFrm.value;
      this.metricsService.editMetrics(metricsData).subscribe(()=>{
        this.messageService.add({
          severity: 'success',
          summary: 'Metrics Updated!',
        });
        this.editMetrics= false;
        this.metricsService.getAllMetrics().subscribe((Response:Metrics[])=>{
          this.metricsData = Response;      
        })   

      },
       () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Validation Failed',
          detail: 'Metrics not updated',
        });
      })
    }
    else{
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Failed',
        detail: '',
      });
    }
  }
  onUpdateDev(editDevForm: FormGroup){
    if(editDevForm.valid){
      console.log(editDevForm.value);
      // const devMetricsData = editDevForm.value;
      const devMetricsData: EditDevelopmentMetrics = {
        id: this.editDevid,
        customerId: editDevForm.get('customerId')?.value,
        customerName: editDevForm.get('customerName')?.value,
        projectId: editDevForm.get('projectId')?.value,
        projectName: editDevForm.get('projectName')?.value,
        projectType: editDevForm.get('projectType')?.value,
        monthYear: editDevForm.get('monthYear')?.value,
        weekStartDate: editDevForm.get('weekStartDate')?.value,
        weekEndDate: editDevForm.get('weekEndDate')?.value,
        flagType: editDevForm.get('flagType')?.value || '', // Optional field
        // developmentTasks: editDevForm.get('editDevelopmentTasks')?.value,
        developmentTasks: this.attachIdsToDevelopmentTasks(editDevForm.get('editDevelopmentTasks')?.value)
      };
    console.log(devMetricsData,"devMetricsData   aa");
      this.metricsService.editDevMetrics(devMetricsData).subscribe((response:any)=>{
        this.messageService.add({
          severity: 'success',
          summary: 'Metrics Updated!',
        });
       
        this.editMetrics= false;
        this.metricsService.getAllMetrics().subscribe((Response:Metrics[])=>{
          this.metricsData = Response;      
        })

      },
       () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Validation Failed',
          detail: 'Development Metrics not updated',
        });
      })
    }
    else{
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Failed',
        detail: '',
      });
    }
  }
  attachMetricsIdToTicketDetails(tickets: TicketDetails[]): TicketDetails[] {
    return tickets.map(ticket => ({
        ...ticket,
        metricsId: this.editspptMetricsId,
        ticketDetailsId: this.editspptId,
        metricsDetailsId: this.editspptMetricsId, // Assign the ticketDetailsId (assumed to be the same as `id` of the ticket)

        // Map and assign ticketDetailsId for TicketAssignedTo, WorkedBy, and ClosedBy
        ticketAssignedTo: ticket.ticketAssignedTo.map(assignedTo => ({
            ...assignedTo,
            ticketDetailsId: this.editTaskId // Assign the task ID to the ticketDetailsId
        })),
        workedBy: ticket.workedBy.map(worked => ({
            ...worked,
            ticketDetailsId: this.editTaskId // Assign the task ID to the ticketDetailsId
        })),
        closedBy: ticket.closedBy.map(closed => ({
            ...closed,
            ticketDetailsId: this.editTaskId // Assign the task ID to the ticketDetailsId
        }))
    }));
}
  attachIdsToDevelopmentTasks(tasks: DevelopmentTaskDetails[]): DevelopmentTaskDetails[] {
    return tasks.map(task => ({
        ...task,
        taskId: this.editTaskId,// Assign a static or dynamically generated taskId
        metricsId: this.editDevid // Assign the metricsId (assumed to be the same as `id` of the dev metrics)
    }));
}
  NumericOnly(e: any) {
    if (+e.charCode > 45 && +e.charCode < 58) {
      return true;
    }
    return false;
  }
  AlpahabetOnly(e: any) {
    if (+e.charCode > 64 && +e.charCode < 91)  
      {
      return true;
    } if((e.charCode >= 97 && e.charCode <= 122) ){
      return true
    }
    return false;
  }

  getClientById(projectId: number): Task | null {    
    for (const task of this.taskData) {
      if (projectId == task.projectId) {
        const filteredProject = this.taskData.filter(
          (project) =>
            project.projectId === projectId  
        );
        
        this.filteredProjects = filteredProject;
        return task;
      }
    }
    return null;
  }

  getTicketAssignedTo(ticketAssignedTo: { userId: number, userName: string ,ticketAssignedToId: number, ticketDetailsId: number }[] | null | undefined) {
    if (ticketAssignedTo === null || ticketAssignedTo === undefined) return []; 
    const ticketAssignedToValues = ticketAssignedTo.map(user => ({
      userId: user.userId,
      userName: user.userName,
      ticketAssignedToId: user.ticketAssignedToId,
      ticketDetailsId: user.ticketDetailsId
    }));
    console.log(ticketAssignedToValues);
    
    return ticketAssignedToValues;
  }
  getWorkedBy(workedBy: { userId: number, userName: string, workedById: number, ticketDetailsId: number }[] | null | undefined) {
    if (workedBy === null || workedBy === undefined) return []; 
    const workedByValues = workedBy.map(user => ({
      userId: user.userId,
      userName: user.userName,
      workedById: user.workedById,
      ticketDetailsId: user.ticketDetailsId
    }));
    return workedByValues;
  }
  getClosedBy(closedBy: { userId: number, userName: string, closedById: number, ticketDetailsId: number }[] | null | undefined) {
    if (closedBy === null || closedBy === undefined) return []; 
    const closedByToValues = closedBy.map(user => ({
      userId: user.userId,
      userName: user.userName,
      closedById: user.closedById,
      ticketDetailsId: user.ticketDetailsId
    }));
    return closedByToValues;
  }
  
  onAddMetrics() {
    const ticketDetailsArray = this.supportForm.get('ticketDetails') as FormArray;
    const ticketDevelopmentArray = this.developmentForm.get('developmentTasks') as FormArray;
    // const reopenedControl = ticketDetailsArray.at(idx).get('reopenedDate');
    this.supportForm.reset();
    this.developmentForm.reset();
    ticketDetailsArray.reset();
    ticketDevelopmentArray.reset();
    const createDate = this.supportForm.get('createDate')?.value;
    const assignedDate = this.supportForm.get('assignedDate')?.value;
    const expectedClosureDate = this.supportForm.get('expectedClosureDate')?.value;
    const actualResolvedDate = this.supportForm.get('actualResolvedDate')?.value;
    const reopenedDate = this.supportForm.get('reopenedDate')?.value;
    createDate?.clear();
    assignedDate?.clear();
    expectedClosureDate?.clear();
    actualResolvedDate?.clear();
    reopenedDate?.reset();
    this.addMetrics = true;
    this.addDevelopmentMetrics = true;
    this.editMetrics = false;
    this.editSpptFrm.reset();
    const projectControl = this.supportForm.get('project');
    projectControl?.disable();
    const devProject = this.developmentForm.get('project');
    devProject?.disable();
    this.projectType='';
    const endDateControl = this.supportForm.get('weekEndDate');
    const startDateControl = this.supportForm.get('weekStartDate');
    const startDevDateControl = this.developmentForm.get('weekStartDate');
    const enDevDateControl = this.developmentForm.get('weekEndDate');
    endDateControl?.disable();
    startDateControl?.disable();
    startDevDateControl?.disable();
    enDevDateControl?.disable();
  }
  backToMetricsGrid() {
    this.addMetrics = false;
    this.metricsExist = false;
    this.editMetrics = false;
    this.addDevelopmentMetrics = false;
    this.editDevMetrics = false;
  }

  onEndDateSelected(selectedDate:Date){
    const customerId = this.supportForm.get('client')?.value?.customerId;
    const projectId = this.supportForm.get('project')?.value?.projectId;
    const weekStartDate = new Date(this.supportForm.get('weekStartDate')?.value); 
  const weekEndDate = new Date(selectedDate);   

  const customerIdEdit = this.editSpptFrm.get('client')?.value?.customerId;
    const projectIdEdit = this.editSpptFrm.get('project')?.value?.projectId;
    const weekStartDateEdit = new Date(this.editSpptFrm.get('weekStartDate')?.value);
  const weekEndDateEdit = new Date(selectedDate); 

    this.metricsService.getAllMetrics().subscribe((Response:Metrics[])=>{
      this.metricsData = Response;      
    });
    const metricExists = this.metricsData.some(metric => 
      metric.customerId === customerId && 
      metric.projectId === projectId &&
      this.isSameDate(metric.weekStartDate, weekStartDate) && 
      this.isSameDate(metric.weekEndDate, weekEndDate)
    );
    const metricExistsEdit = this.metricsData.some(metric => 
      metric.customerId === customerIdEdit && 
      metric.projectId === projectIdEdit &&
      this.isSameDate(metric.weekStartDate, weekStartDateEdit) && 
      this.isSameDate(metric.weekEndDate, weekEndDateEdit)
    );
    if (metricExists) {
      this.metricsExist = true;
      this.messageService.add({
        severity: 'error',
        summary: 'Metrics already exist!',
        detail: `For the week (${weekStartDate.toDateString()} - ${weekEndDate.toDateString()})`,
      }); 
    } 
    else{
      this.metricsExist = false;
    }
    if (metricExistsEdit) {
      this.editMetrics = true;
      this.messageService.add({
        severity: 'error',
        summary: 'Metrics already exist!',
        detail: `For the week (${weekStartDate.toDateString()} - ${weekEndDate.toDateString()})`,
      }); 
    } 
    else{
      this.metricsExist = false;
    }
  }
  onEndDateDevSelected(selectedDate:Date){
    const customerId = this.developmentForm.get('client')?.value?.customerId;
    const projectId = this.developmentForm.get('project')?.value?.projectId;
    const weekStartDate = new Date(this.developmentForm.get('weekStartDate')?.value); 
  const weekEndDate = new Date(selectedDate);   

  const customerIdEdit = this.editSpptFrm.get('client')?.value?.customerId;
    const projectIdEdit = this.editSpptFrm.get('project')?.value?.projectId;
    const weekStartDateEdit = new Date(this.editSpptFrm.get('weekStartDate')?.value); 
  const weekEndDateEdit = new Date(selectedDate); 

    this.metricsService.getAllMetrics().subscribe((Response:Metrics[])=>{
      this.metricsData = Response;      
    });
    const metricExists = this.metricsData.some(metric => 
      metric.customerId === customerId && 
      metric.projectId === projectId &&
      this.isSameDate(metric.weekStartDate, weekStartDate) && 
      this.isSameDate(metric.weekEndDate, weekEndDate)
    );
    const metricExistsEdit = this.metricsData.some(metric => 
      metric.customerId === customerIdEdit && 
      metric.projectId === projectIdEdit &&
      this.isSameDate(metric.weekStartDate, weekStartDateEdit) && 
      this.isSameDate(metric.weekEndDate, weekEndDateEdit)
    );
    if (metricExists) {
      this.metricsExist = true;
      this.messageService.add({
        severity: 'error',
        summary: 'Metrics already exist!',
        detail: `For the week (${weekStartDate.toDateString()} - ${weekEndDate.toDateString()})`,
      }); 
    } 
    else{
      this.metricsExist = false;
    }
    if (metricExistsEdit) {
      this.editMetrics = true;
      this.messageService.add({
        severity: 'error',
        summary: 'Metrics already exist!',
        detail: `For the week (${weekStartDate.toDateString()} - ${weekEndDate.toDateString()})`,
      }); 
    } 
    else{
      this.metricsExist = false;
    }
  }
  isSameDate(date1: any, date2: Date): boolean {
    if (typeof date1 === 'string') {
      date1 = new Date(date1);
    }
  
    if (!(date1 instanceof Date && !isNaN(date1.valueOf()))) {
      console.error('date1 is not a valid Date object:', date1);
      return false;
    }
  
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  }


  onClientSelected(selectedClient: Task) {
    console.log(selectedClient,"select");
    
    if (selectedClient) {
      this.projectType='';  
      this.clientSelected = true;
      this.projectDropdownDisabled = false;
      
      const filteredProjects = this.taskData.filter(
        (task) => task.customerId === selectedClient.customerId
       
      );
      console.log(this.filteredProjects);
      this.filteredProjects = filteredProjects;
      
    } else {
      this.filteredProjects = [];
    }
  }
 
  onProjectSelected(selectedProject: Task) {
    // this.supportForm.reset();
    // this.developmentForm.reset();
    this.projectDetailsService
    .getAllProjectDetails()
    .subscribe((response: ProjectDetails[]) => {
      console.log(response,"project");
      
      const projectStartDate = response.find(project => project.projectId === selectedProject?.projectId);
      if (projectStartDate?.startDate) {
        // Convert startDate to a Date object if necessary
        this.startDate = new Date(projectStartDate.startDate);  // Ensuring it's a Date object
      }
      if(projectStartDate?.endDate){
        this.endDate = new Date(projectStartDate.endDate);
      } else {
        console.error('Project start date not found');
      }
    }, error => {
      console.error('Error fetching project details', error);
    });
    console.log(selectedProject,"selected project");
    
    if (selectedProject) {
      this.projectType = selectedProject.projectType;
      this.selectedProject = selectedProject.projectName || '';

      this.supportForm.patchValue({
        customerId: selectedProject.customerId,
        customerName: selectedProject.customerName,
        projectId: selectedProject.projectId,
        projectName: selectedProject.projectName,
        projectType: selectedProject.projectType
      });
      this.developmentForm.patchValue({
        customerId: selectedProject.customerId,
        customerName: selectedProject.customerName,
        projectId: selectedProject.projectId,
        projectName: selectedProject.projectName,
        projectType: selectedProject.projectType
      });
      this.editSpptFrm.patchValue({
        customerId: selectedProject.customerId,
        customerName: selectedProject.customerName,
        projectId: selectedProject.projectId,
        projectName: selectedProject.projectName,
        projectType: selectedProject.projectType
      }); 
      this.editdevelopmentForm.patchValue({
        customerId: selectedProject.customerId,
        customerName: selectedProject.customerName,
        projectId: selectedProject.projectId,
        projectName: selectedProject.projectName,
        projectType: selectedProject.projectType
      });    

      const filteredPriorities = this.priorityData.filter(
        (priority) =>
          priority.customer === selectedProject.customerName &&
          priority.project === selectedProject.projectName &&
          priority.status == 1
      );
  
      this.filteredPriority = filteredPriorities.map((priority) => ({
        label: priority.projectPriority,
        value: priority.projectPriority
      }));

      const filteredComplexities = this.complexityData.filter(
        (complexity) =>
          complexity.customer === selectedProject.customerName &&
          complexity.project === selectedProject.projectName
      );
  
      this.filteredComplexity = filteredComplexities.map((complexity) => ({
        label: complexity.projectComplexity,
        value: complexity.projectComplexity
      }));

       this.selectedProjectType = this.taskData.find(
        (task) =>
          task.customerId === selectedProject.customerId &&
          task.projectId === selectedProject.projectId
      )?.projectType;
      
      if (this.selectedProjectType !== undefined) {
        this.projectType = this.selectedProjectType;
        this.messageService.add({
          severity: 'success',
          summary: 'Project Type is ',
          detail: this.selectedProjectType,
        });
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Please select Project',
          detail: '',
        });
      }   

    }
    else {
      console.error('No project selected');
      this.messageService.add({
        severity: 'error',
        summary: 'Please select Project',
        detail: '',
      });

    }

  }
  onDevelopmentClientSelected(selectedClient: Task) {
    console.log(selectedClient,"select");
    
    if (selectedClient) {
      this.projectType='';  
      this.clientSelected = true;
      this.projectDropdownDisabled = false;
      
      const filteredProjects = this.taskData.filter(
        (task) => task.customerId === selectedClient.customerId
       
        
      );
      console.log(this.filteredProjects);
      this.filteredProjects = filteredProjects;
      
    } else {
      this.filteredProjects = [];
    }
  }
  onDevelopmentProjectSelected(selectedProject: Task) {
   
    if (selectedProject) {
      this.projectType = selectedProject.projectType;
      this.selectedProject = selectedProject.projectName || '';

      this.developmentForm.patchValue({
        customerId: selectedProject.customerId,
        customerName: selectedProject.customerName,
        projectId: selectedProject.projectId,
        projectName: selectedProject.projectName,
        projectType: selectedProject.projectType
      });     

      const filteredPriorities = this.priorityData.filter(
        (priority) =>
          priority.customer === selectedProject.customerName &&
          priority.project === selectedProject.projectName &&
          priority.status == 1
      );
  
      this.filteredPriority = filteredPriorities.map((priority) => ({
        label: priority.projectPriority,
        value: priority.projectPriority
      }));

      const filteredComplexities = this.complexityData.filter(
        (complexity) =>
          complexity.customer === selectedProject.customerName &&
          complexity.project === selectedProject.projectName
      );
  
      this.filteredComplexity = filteredComplexities.map((complexity) => ({
        label: complexity.projectComplexity,
        value: complexity.projectComplexity
      }));

      const selectedProjectType = this.taskData.find(
        (task) =>
          task.customerId === selectedProject.customerId &&
          task.projectId === selectedProject.projectId
      )?.projectType;
      
      if (selectedProjectType !== undefined) {
        this.projectType = selectedProjectType;
        this.messageService.add({
          severity: 'success',
          summary: 'Project Type is ',
          detail: selectedProjectType,
        });
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Please select Project',
          detail: '',
        });
      }   
    }
    else {
      console.error('No project selected');
      this.messageService.add({
        severity: 'error',
        summary: 'Please select Project',
        detail: '',
      });

    }

  }
  

  onCustomerChange(){
    const projectControl = this.supportForm.get('project');
    const editProjectControl = this.editSpptFrm.get('project');
    const editDevProjectControl = this.editdevelopmentForm.get('project');
    const editPriorityControl = this.editSpptFrm.get('priority');
    const clientValue = this.supportForm.get('client')?.value;
    const editClientValue = this.editSpptFrm.get('client')?.value;
    // const ClientDevValue = this.developmentForm.get('client')?.value;
  
    if (clientValue) {
      projectControl?.enable();
      // ClientDevValue?.enable();
    }
    else {
      projectControl?.reset();
      projectControl?.disable();
      // ClientDevValue?.reset();
      // ClientDevValue?.disable();
    }
    if(editClientValue){
      editPriorityControl?.reset();
      editProjectControl?.reset();
    }
    if(editDevProjectControl){
      editDevProjectControl?.reset();
      editDevProjectControl?.enable();
    }
  }
  reopenedMetrics(event: any, idx: number) {
    const ticketDetailsArray = this.supportForm.get('ticketDetails') as FormArray;
    const reopenedControl = ticketDetailsArray.at(idx).get('reopenedDate');
    const editticketArray = this.editSpptFrm.get('ticketDetails') as FormArray;
    const editReopenedControl = editticketArray.at(idx).get('reopenedDate');

    if (event.value === 'Yes') {
      reopenedControl?.enable();
      editReopenedControl?.enable();
    } else {
      reopenedControl?.reset();
      reopenedControl?.disable();
      editReopenedControl?.disable();
    }
  }
  editReopenedMetrics(event: any, idx: number) {
    const editticketArray = this.editSpptFrm.get('ticketDetails') as FormArray;
    const editReopenedControl = editticketArray.at(idx).get('reopenedDate');
    if (event.value === 'Yes') {
      editReopenedControl?.enable();
    } else {
      editReopenedControl?.reset();
      editReopenedControl?.disable();
    }
  }

  //   updateWeekCalendars(selectedDate: Date) {
//     const monthYearValue = this.supportForm.get('monthYear')?.value;
//     const endDateControl = this.supportForm.get('weekEndDate');
//     const startDateControl = this.supportForm.get('weekStartDate');

//     if (monthYearValue) {
//         startDateControl?.enable();
//         endDateControl?.reset();
//         startDateControl?.reset();
//     } else {
//         endDateControl?.reset();
//         endDateControl?.disable();
//         startDateControl?.reset();
//         startDateControl?.disable();
//     }

//     if (this.weekStartDateCalendar && this.weekEndDateCalendar) {
//         const year = selectedDate.getUTCFullYear();
//         const month = selectedDate.getUTCMonth(); // Use getUTCMonth() for zero-based month

//         const firstDayOfMonth = new Date(Date.UTC(year, month+1));
//         const lastDayOfMonth = new Date(Date.UTC(year, month + 2));  // Correct calculation of the last day of the month

//         this.weekStartDateCalendar.minDate = firstDayOfMonth;
//         this.weekStartDateCalendar.maxDate = lastDayOfMonth;
//         this.weekEndDateCalendar.minDate = firstDayOfMonth;
//         this.weekEndDateCalendar.maxDate = lastDayOfMonth;
//     }
// }
updateWeekCalendars(selectedDate: Date) {
  const endDateControl = this.supportForm.get('weekEndDate');
  const startDateControl = this.supportForm.get('weekStartDate');
  const startDevDateControl = this.developmentForm.get('weekStartDate');

  if (selectedDate) {
      startDateControl?.enable();
      endDateControl?.reset();
      startDateControl?.reset();
      startDevDateControl?.enable();
     

  } else {
      endDateControl?.reset();
      endDateControl?.disable();
      startDateControl?.reset();
      startDateControl?.disable();
  }
  
}
updateDevWeekCalendars() {
  const monthYearDevValue = this.developmentForm.get('monthYear')?.value;
  const endDateDevControl = this.developmentForm.get('weekEndDate');
  const startDateDevControl = this.developmentForm.get('weekStartDate');
  const editMonthYearDevValue = this.editdevelopmentForm.get('monthYear')?.value;
  const editEndDateDevControl = this.editdevelopmentForm.get('weekEndDate');
  const editStartDateDevControl = this.editdevelopmentForm.get('weekStartDate');
  if(monthYearDevValue){
    startDateDevControl?.enable();
    endDateDevControl?.reset();
    startDateDevControl?.reset();
  } 
  if(editMonthYearDevValue){
    editEndDateDevControl?.reset();
    editStartDateDevControl?.reset();
    editStartDateDevControl?.enable();
    editEndDateDevControl?.enable();

  }
  else {
      startDateDevControl?.reset();
      // startDateDevControl?.disable();
      endDateDevControl?.reset();
      endDateDevControl?.reset();
      // editStartDateDevControl?.reset();
      // editStartDateDevControl?.disable();
      // editEndDateDevControl?.reset();
      // editEndDateDevControl?.reset();
  }
}
// onStartDateClick() {
//   const monthYearValue = this.supportForm.get('monthYear')?.value;
//   const endDateControl = this.supportForm.get('weekEndDate');

//   if (monthYearValue) {
//     endDateControl?.enable();

//     const selectedDate = new Date(monthYearValue);
//     const dayOfWeek = selectedDate.getUTCDay();
//     const daysToMonday = (dayOfWeek === 0 ? -6 : 1) - dayOfWeek;

//     const startDate = new Date(selectedDate);
//     startDate.setUTCDate(selectedDate.getUTCDate() + daysToMonday);

//     this.supportForm.get('weekStartDate')?.setValue(startDate);
//     this.weekStartDate = startDate;
//     this.minEndDate = startDate;
//     this.maxEndDate = new Date(startDate);
//     this.maxEndDate.setUTCDate(this.maxEndDate.getUTCDate() + 6); // Sunday of the same week

//     endDateControl?.setValue(null); // Clear previous value
//     endDateControl?.updateValueAndValidity(); // Update validation
//   } else {
//     endDateControl?.reset();
//     // endDateControl?.disable();
//   }
// }
onStartDateClick() {
  const monthYearValue = this.supportForm.get('monthYear')?.value;
  const endDateControl = this.supportForm.get('weekEndDate');
  if (monthYearValue) {
    endDateControl?.enable();
      const year = monthYearValue.getUTCFullYear();
      const month = monthYearValue.getUTCMonth();
      const selectedDate = new Date(Date.UTC(year, month+1));
      this.supportForm.get('weekStartDate')?.setValue(selectedDate);
      this.weekStartDate = selectedDate;
  }
  else {
          endDateControl?.reset();
          // endDateControl?.disable();
      } 
}

onStartDateDevClick(){
  const monthYearValue = this.developmentForm.get('monthYear')?.value;
  const endDateControl = this.developmentForm.get('weekEndDate');
  if (monthYearValue) {
    endDateControl?.enable();
      const year = monthYearValue.getUTCFullYear();
      const month = monthYearValue.getUTCMonth();
      const selectedDate = new Date(Date.UTC(year, month+1));
      this.developmentForm.get('weekStartDate')?.setValue(selectedDate);
      this.weekStartDate = selectedDate;
      const weekStartDateValue = this.developmentForm.get('weekStartDate')?.value;
      if (weekStartDateValue) {
        // Dynamically set minDate for weekEndDate based on the weekStartDate value
        endDateControl?.setValidators(null); // Remove existing validators if any
        endDateControl?.setValidators([Validators.required]); // Add any required validators here if needed
        endDateControl?.updateValueAndValidity(); // Trigger validation update
      }
  }
  else {
          endDateControl?.reset();
          // endDateControl?.disable();
      } 
}
//New Code chages for onStartDateDevClick and onselectDevEndDate methods..................
// onStartDateDevClick() { 
//   const monthYearValue = this.developmentForm.get('monthYear')?.value;
//   const endDateControl = this.developmentForm.get('weekEndDate');
  
//   if (monthYearValue) {
//     endDateControl?.enable();
    
//     const year = monthYearValue.getUTCFullYear();
//     const month = monthYearValue.getUTCMonth();
    
//     // Set the first date of the month as the default for weekStartDate
//     const selectedDate = new Date(Date.UTC(year, month, 1)); // First day of the month
    
//     this.developmentForm.get('weekStartDate')?.setValue(selectedDate);
//     this.weekStartDate = selectedDate;
//   } else {
//     endDateControl?.reset();
//   }
// }


onselectEndDate(){
  const startDateValue = this.supportForm.get('weekStartDate')?.value;
  // const date = monthYearValue.getUTCDate();
  // const selectedDate = new Date(Date.UTC(year, month+1));
  
  const year = startDateValue.getUTCFullYear();
  const month = startDateValue.getUTCMonth();
  const date = startDateValue.getUTCDate();
  const selectedDate = new Date(Date.UTC(year, month, date+1));
  this.supportForm.get('weekEndDate')?.setValue(selectedDate);
}

onselectDevEndDate() {
  const startDateValue = this.developmentForm.get('weekStartDate')?.value;
  // const date = monthYearValue.getUTCDate();
  // const selectedDate = new Date(Date.UTC(year, month+1));
  
  const year = startDateValue.getUTCFullYear();
  const month = startDateValue.getUTCMonth();
  const date = startDateValue.getUTCDate();
  const selectedDate = new Date(Date.UTC(year, month, date+1));
  this.developmentForm.get('weekEndDate')?.setValue(selectedDate);
  }
// onselectDevEndDate() {
//   const startDateValue = this.developmentForm.get('weekStartDate')?.value;
  
//   if (startDateValue) {
//     const year = startDateValue.getUTCFullYear();
//     const month = startDateValue.getUTCMonth();
    
//     // Set minDate to the weekStartDate (start date can't be after end date)
//     const minDate = new Date(Date.UTC(year, month, startDateValue.getUTCDate()));
    
//     // Set maxDate to the last day of the selected month
//     const maxDate = new Date(Date.UTC(year, month + 1, 0)); // 0 gets the last day of the previous month
    
//     // Dynamically set the min and max dates for weekEndDate
//     this.developmentForm.get('weekEndDate')?.setValidators([Validators.required]);
//     this.developmentForm.get('weekEndDate')?.updateValueAndValidity();
    
//     // Now set these min and max dates as limits on the calendar
//     this.weekEndDateCalendar.minDate = minDate;
//     this.weekEndDateCalendar.maxDate = maxDate;
//   }
// }

}