																		/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Client {
  id:number;
  clientId: string;
  clientName: string;
}
import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { ProjectDetailsService } from '../../services/project-details.service';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { MenuItem, MessageService } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';
import { ToastModule } from 'primeng/toast';
import { CalendarModule } from 'primeng/calendar';
import moment, { Moment } from 'moment';
import { MomentFormatPipe } from '../../../shared/pipes/moment.pipe';
import { TimesheetService } from '../../services/timesheet.service';
import { TimesheetGrid, Timesheets, WeeklyTimesheetSummary } from '../../models/timesheet';
import { SortPipe } from '../../../shared/pipes/sort.pipe';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { response } from 'express';
import { ChangeDetectorRef } from '@angular/core';

export interface WeekRange {
  start: string;
  end: string;
}
import { DatePipe } from '@angular/common';
import { formatDate } from '@angular/common';
import { SplitButtonModule } from 'primeng/splitbutton';
import { Skeleton, SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-timesheets',
  standalone: true,
  imports: [
    TableModule,
    DropdownModule,
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    ToolbarModule,
    ReactiveFormsModule,
    MessagesModule,
    ToastModule,
    CalendarModule,
    MomentFormatPipe,
    SortPipe,SkeletonModule,
    DialogModule,
    RouterLink,
    RouterLinkActive,
    DatePipe,
    SplitButtonModule,
    ],
  templateUrl: './timesheets.component.html',
  styleUrl: './timesheets.component.scss',
  providers: [MessageService],
})

export class TimesheetsComponent implements OnInit {
  projects: any[] = [];
  selectedProject!: string;
  timesheetForm!: FormGroup;
  userDetails: any;
  userName: string = '';
  empId: string = '';
  gridView: boolean = true;
  timesheetWeely: any = [];
  currentWeekDates = [];
  weeklyRange: Array<Moment[]> = [];
  weekTimeLog: any;
  weekDaysShow: any[] = [];
  weekStartDate!: Date | Moment;
  weekEndDate!: Date | Moment;
  getTimesheets!: Timesheets[];
  editForm!: FormGroup;
  weekStatus:Array<WeekRange> = [];
  timesheetStatus:any[] = [];
  edittimesheetForm!: FormGroup;
  status:string[]=[];
  reloadMonth:any;
  hoursCalculation:[]= [];
  editHead:boolean = true;
  timesheetGrid!: TimesheetGrid[];
  formValidationGroup!:FormGroup;
  isReadOnly: boolean = false;
  clients: any;
  clientName!: string;
  currentDate: Date = new Date();
  selectedClientId!: Client[] ;
  client: any;
  selectedProjectId!: any[];
  selectedProjectName!: any[];
  selectedCustomerId!: any[];
  selectedCustomerName!: any[];
  users: any;
  totalBillableHours: number = 0;
  totalNonBillableHours: number = 0;
  weeklySummaryList: WeeklyTimesheetSummary[] = [];
  editMode: boolean = false;
  displayWithdrawDialog: boolean = false;
  displayApproveDialog: boolean = false;
  displayRejectDialog: boolean = false;
  selectedTimesheetStatus: string = '';
  reportingToId?: number;
  hasPreviousDayLogs: boolean = false;
  hasPreviousWeekData: boolean = false;

  // supportForm!:FormGroup;
  timesheetItems!: MenuItem[];
  constructor(
    private router: Router,
    private projectDetailsService: ProjectDetailsService,
    private messageService: MessageService,
    private fb: FormBuilder,
    private timesheetService: TimesheetService,
    private userService :  UserService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    
    this.reloadMonth = new Date();
  }
  billing :any[] =  [
    { label: 'Billable', value: 'billable' },
    { label: 'Non-Billable', value: 'non-billable' },
  ];
  site = [
    { label: 'Onsite', value: 'Onsite' },
    { label: 'Offshore', value: 'Offshore' },
  ];
  roleId: number = 0;
 
  showDailyDialog = false;
  ngOnInit() {

    const userData = JSON.parse(localStorage.getItem('userLogin') || '{}')?.data?.roleId;
    this.roleId = userData || 0;
    this.timesheetForm?.valueChanges.subscribe((res:any)=>{
      console.log(res,"resss");
     
    });
    this.projectDetailsService.getAllClients().subscribe((response:any)=>{
      this.clients = response;
    });    

    this.timesheetItems = [     
      {
        label: 'Daily Timesheet',
        command: () => this.openDailyTimesheetDialog()
      }
    ];

    this.userDetails = JSON.parse(localStorage.getItem('userLogin')!);
    this.userName = this.userDetails.data.userName;
    this.empId = this.userDetails.data.employee_ID;


  this.userService.getAllUser().subscribe(users => {

    const matchedUser = users.find(user => {
      return user.employee_ID === this.empId;
    });   
  }, error => {
    console.error('Error fetching users:', error);
  });



    this.timesheetService
      .getTimesheets(this.userName)
      .subscribe((Response: Timesheets[]) => {
        this.getTimesheets = Response;
      });

      

    this.timesheetForm = this.fb.group({
      employeeId: this.empId,
      employeeName: this.userName,
      doj: new Date(),      
      weeklyTimesheet: this.fb.array([]),
    });

    this.userService.getAllUser().subscribe((Response: any) => {
      console.log("Employeee data ", Response);
      
      this.users = Response.map((user: User) => ({
        userId: user.user_Id,
        userName: user.userName,
      }));
      console.log(this.users);
    });

    this.onMonthSelect(this.reloadMonth);
    
  }  

dailyTimesheetForm = this.fb.group({
  logDate: [new Date(), Validators.required],
  entries: this.fb.array([])  // Daily rows
});

get entries(): FormArray {
  return this.dailyTimesheetForm.get('entries') as FormArray;
}

addDailyRow() {
  this.entries.push(this.fb.group({
    customerId: [null, Validators.required],
    customerName: [''],
    projectId: [null, Validators.required],        
    projectName: ['', Validators.required],
    activity: ['', Validators.required],
    site: ['', Validators.required],
    billingType: ['', Validators.required],
    logHours: [null, [Validators.required, Validators.min(0.1), Validators.max(24)]]
  }));
}


removeDailyRow(index: number): void {
  if (this.entries.length <= 1) {
    this.messageService.add({
      severity: 'warn',
      summary: 'Cannot remove',
      detail: 'At least one entry row is required.'
    });
    return;
  }

  this.entries.removeAt(index);
}


openDailyTimesheetDialog(): void {
  this.showDailyDialog = true;

  const today = new Date();
  this.dailyTimesheetForm.get('logDate')?.setValue(today);
   const formattedDate = formatDate(today, 'yyyy-MM-dd', 'en-US');

  // Clear existing entries
  this.entries.clear();

  this.timesheetService.getDailyTimesheetLogs(formattedDate!, this.empId).subscribe({
    next: (logs: any[]) => {
      if (!logs || logs.length === 0) {
        this.messageService.add({
          severity: 'info',
          summary: 'No Previous Logs',
          detail: 'No previous logs recorded for today.'
        });
        this.addDailyRow(); // Ensure at least one row
        return;
      }

      logs.forEach((log, i) => {
        this.entries.push(this.fb.group({
          customerId: [log.customerId, Validators.required],
          customerName: [log.customerName],
          projectId: [log.projectId, Validators.required],
          projectName: [log.projectName],
          activity: [log.activity, Validators.required],
          site: [log.site, Validators.required],
          billingType: [log.billingType, Validators.required],
          logHours: [log.logHours, [Validators.required, Validators.min(0.1), Validators.max(24)]]
        }));

        // Load project options
        this.projectDetailsService.getAllAmsProject(log.customerId).subscribe(projects => {
          this.projects[i] = projects;
        });
      });
    },
    error: (err: any) => {      
      this.addDailyRow(); // fallback row
    }
  });
}




  getTimesheetsByUserName() {

    this.timesheetService.getTimesheetsByUserName(this.userName)
    .subscribe((summaryList: WeeklyTimesheetSummary[]) => {
      console.log(summaryList, "Weekly Summary List");
      this.weeklySummaryList = summaryList;
    });
  }

onClientSelected(event: any, idx: number) {
  this.selectedClientId = event;
  console.log("Selected Client ID:", this.selectedClientId);

  const selectedClient = this.clients.find((client: any) => client.id === event);

  if (selectedClient) {
    this.client = selectedClient.clientName;
    console.log('Selected Client Name:', this.client);

    this.projectDetailsService.getAllAmsProject(event).subscribe((data: any) => {

      // Store the projects for this row
      this.projects[idx] = data;

      // Trigger change detection to update the view
      this.changeDetectorRef.detectChanges();

      // Reset the project selection for this row
      const timesheetGroup = this.timesheets.at(idx) as FormGroup;
      const projectControl = timesheetGroup.get('projectName');
      if (projectControl) {
        projectControl.setValue(null); // Reset the project selection
      }
    });

    const timesheetGroup = this.timesheets.at(idx) as FormGroup;
    timesheetGroup.patchValue({
      customerId: this.selectedClientId,
      customerName: this.client,
    });

    console.log('Updated Form Values:', this.timesheetForm.value);
  } else {
    console.log('No client found with the selected ID.');
  }
}



  onProjectSelected(event: any, idx: number) {
  // Log the index of the selected row
  console.log("Index =>", idx);

  // Log the event to see the selected value (projectName)
  console.log("Selected Project Name from event:", event.value);

  // Find the selected project from the projects array
  const selectedProject = this.projects[idx]?.find(
    (project: any) => project.projectName === event.value
  );

  if (selectedProject) {
    // Log the selected project to verify the details
    console.log("Selected Project:", selectedProject);

    // Get the form group for the specific row (idx)
    const timesheetGroup = this.timesheets.at(idx) as FormGroup;

    // Log the form group before patching the value
    console.log("Form Group before patching:", timesheetGroup.value);

    // Patch the form group with the selected project details
    timesheetGroup.patchValue({
      projectId: selectedProject.id,
      projectName: selectedProject.projectName,
    });

    // Log the form group after patching the value
    console.log("Form Group after patching:", timesheetGroup.value);
  } else {
    // Log if no matching project is found
    console.warn('Selected project not found in the list.');
  }
}

onDailyClientSelected(clientId: number, idx: number): void {
  const selectedClient = this.clients.find((client: Client) => client.id === clientId);

  if (selectedClient) {
    if (!this.selectedClientId) {
  this.selectedClientId = [];
}
this.selectedClientId[idx] = selectedClient;


    console.log(`Selected Client at row ${idx}:`, this.selectedClientId[idx]);

    // Load related projects
    this.projectDetailsService.getAllAmsProject(clientId).subscribe((data: any[]) => {
      this.projects[idx] = data;
      this.changeDetectorRef.detectChanges();

      const entryGroup = this.entries.at(idx) as FormGroup;
      entryGroup.patchValue({
        projectId: 0,
        projectName: ''
      });
    });

    const entryGroup = this.entries.at(idx) as FormGroup;
    entryGroup.patchValue({
      customerId: selectedClient.id,
      customerName: selectedClient.clientName
    });

    console.log('Updated entry form row:', entryGroup.value);
  } else {
    console.warn('No client found with ID:', clientId);
  }
}




onDailyProjectSelected(projectId: number, idx: number) {
  console.log(`Project selected in row ${idx}: projectId =`, projectId);

  const selectedProject = this.projects[idx]?.find((p: any) => p.id === projectId);

  if (selectedProject) {
    console.log(`Full selected project:`, selectedProject);

    const entryGroup = this.entries.at(idx) as FormGroup;

    console.log(`Before patching formGroup at index ${idx}:`, entryGroup.value);

    entryGroup.patchValue({
      projectId: selectedProject.id,
      projectName: selectedProject.projectName
    });

    console.log(`After patching formGroup at index ${idx}:`, entryGroup.value);
  } else {
    console.warn(`Project with id ${projectId} not found in row ${idx}`);
  }
}



  goToTimesheetApproval() {
    this.router.navigate(['/timesheets-approval']);
  }

  goToTimesheetRequest() {
    this.router.navigate(['/timesheets-requests']);
  }

 selectedOption: string='';

  // Define actions for the split button dropdown
  dropdownOptions = [
    {
      label: 'My Requests',
      icon: 'pi pi-list',
      command: () => {
        this.goToTimesheetRequest();
      }
    },
    {
      label: 'My Approvals',
      icon: 'pi pi-check',
      command: () => {
        this.goToTimesheetApproval();
      }
    }
  ];

  onDropdownChange(event: any) {
    // This function will now be triggered by the main button click if needed
    // You can manage your selection if you need to track the selected item manually
    if (this.selectedOption === 'myRequests') {
      this.goToTimesheetRequest();
    } else if (this.selectedOption === 'myApprovals') {
      this.goToTimesheetApproval();
    }
  }
  
  newLogDate(log_date: string) {
    return this.fb.group({
      TimesheetStatus: [''],
      logHours: [''],
      logTs: log_date,
    });
  }
  get timesheets(): FormArray {
    return this.timesheetForm.get('weeklyTimesheet') as FormArray;
  }

  timesheetLog(idx: number): FormArray {
    return this.timesheetForm.get([
      'weeklyTimesheet',
      idx,
      'logs',
    ]) as FormArray;
  }

  appendLogDatesInForm(daysInRow: Moment[]) {
    this.formValidationGroup = this.fb.group({
      timesheetId: [3],
      customerId: [this.selectedCustomerId],
      customerName: [this.selectedCustomerName],
      projectId: [this.selectedProjectId],
      projectName: [this.selectedProjectName],
      activity: ['', Validators.required],
      site: ['', Validators.required],
      billingType: ['', Validators.required],
      weekStartDate: moment(this.weekStartDate).format('YYYY-MM-DDTHH:mm:ss'),
      weekEndDate: moment(this.weekEndDate).format('YYYY-MM-DDTHH:mm:ss'),
      logs: this.fb.array([]),
    });
    const logs = this.formValidationGroup.get('logs') as FormArray;

    for (const element of daysInRow) {
      console.log(daysInRow,"ghdhdghdghdga");
      
      logs.push(this.newLogDate(element.toISOString(true)));
    }

    this.timesheets.push(this.formValidationGroup);
    console.log(this.formValidationGroup,"tdyftgfyt");
    console.log(this.timesheetForm.value);
  } 

  toggleEdit(weekSummary: any, rowIndex: number) {
    console.log("Row Index=>",rowIndex);
    
    // Toggle the readonly state of the form
    this.isReadOnly = !this.isReadOnly;
    this.timesheets.controls.forEach(group => {
      Object.keys((group as FormGroup).controls).forEach(key => {
        const control = (group as FormGroup).get(key);
        if (this.isReadOnly) {
          control?.disable();
        } else {
          control?.enable();
        }
      });
    });
  
    // Prepare request body for withdraw
    const weekStartDate = weekSummary.weekStartDate;  // Week start date
    const weekEndDate = weekSummary.weekEndDate;  // Week end date
    const employeeId = this.empId;  // Get employeeId from your current user session or data  
    // Log the request body that is being sent to the server
    console.log('Withdraw request body:', { weekStartDate, weekEndDate, employeeId });
  
    // Call the service to withdraw the timesheet
    this.timesheetService.withdrawTimesheet(weekStartDate, weekEndDate, employeeId).subscribe(
      (response) => {
        // Handle success response
        console.log('API Response:', response); // Log the full response from the API
        this.messageService.add({
          severity: 'success',
          summary: 'Timesheet Withdrawn Successfully',
          detail: 'The timesheet has been withdrawn successfully.',
        });
        console.log('Timesheet successfully withdrawn:', response);
  
        // Optionally, reset the form and any UI states here
        this.onMonthSelect(this.reloadMonth);  // For example, you can refresh the month view
        this.gridView = true;
        this.timesheetForm.reset();
      },
      (error) => {
        // Handle error response
        console.error('Error during withdraw request:', error); // Log the full error object
        this.messageService.add({
          severity: 'error',
          summary: 'Failed to Withdraw Timesheet',
          detail: 'There was an error withdrawing the timesheet. Please try again.',
        });
  
        // Log the detailed error response from the backend
        if (error.status === 400) {
          console.error('Bad Request Error:', error.error);  // Log error details from the response
        } else {
          console.error('Unexpected Error:', error.message);  // Log unexpected errors
        }
      }
    );
  }
  



  reject(timesheet: any, rowIndex: number) {
  console.log("Rejecting row:", rowIndex);  
}


  onLogDateSelect(date: Date): void {
    this.checkPreviousDayLogsAvailability(date);
  if (!this.empId || !date) {
    return;
  }

  const formattedDate = formatDate(date, 'yyyy-MM-dd', 'en-US'); // Adjust format if needed

  this.timesheetService.getDailyTimesheetLogs(formattedDate, this.empId).subscribe({
  next: (logs: any[]) => {
    this.entries.clear(); // Clear current rows

    if (!logs || logs.length === 0) {
      this.messageService.add({
        severity: 'info',
        summary: 'No Previous Logs',
        detail: 'No previous logs recorded for the selected date.'
      });

      // Add a blank row for user input
      this.addDailyRow(); 
      return;
    }

    logs.forEach(log => {
      this.entries.push(this.fb.group({
        customerId: [log.customerId, Validators.required],
        customerName: [log.customerName],
        projectId: [log.projectId, Validators.required],
        projectName: [log.projectName],
        activity: [log.activity, Validators.required],
        site: [log.site, Validators.required],
        billingType: [log.billingType, Validators.required],
        logHours: [log.logHours, [Validators.required, Validators.min(0.1), Validators.max(24)]]
      }));

      // Optional: Load project list
      this.projectDetailsService.getAllAmsProject(log.customerId).subscribe(projects => {
        this.projects.push(projects);
      });
    });

    console.log('Loaded daily logs from backend:', logs);
  },

  error: (err: any) => {
    this.entries.clear();
    this.addDailyRow(); 
    this.messageService.add({
        severity: 'info',
        summary: 'No Previous Logs',
        detail: 'No previous logs recorded for the selected date.'
      });
  }
});

}


  WeeklyTimeLog() {
    this.timesheetForm.get('customerId')?.reset();
    this.gridView = true;
  }

  addRow(): void {
    if (this.timesheets.length < 10 ) {
      this.appendLogDatesInForm(this.weekDaysShow);
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Unable to add more rows; maximum limit reached.',
        detail: '',
      });
    }
  }
  removeRow(idx: number): void {
    if (this.timesheets.length > 1) {
      this.timesheets.removeAt(idx);
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'At least one row should be present',
        detail: '',
      });
    }
  }
  customRangeValidator(min: number, max: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (value && (isNaN(value) || value < min || value > max)) {
        return { rangeError: true }; // Custom error key
      }
      return null;
    };
  }
 
  get showClearSite(): boolean {
    return this.formValidationGroup.get('site')?.value !== '';
  }
    
  showClearBillingType(idx: number): boolean {    
    const control = this.formValidationGroup.get('billingType')?.get(idx.toString())?.get('billingType');
    return this.billing.some(item => item.billing === control?.value); // Example logic
  }

  goToPreviousMonth(): void {
  const prev = new Date(this.reloadMonth);
  prev.setMonth(prev.getMonth() - 1);
  this.onMonthSelect(prev);
}

goToNextMonth(): void {
  const next = new Date(this.reloadMonth);
  next.setMonth(next.getMonth() + 1);
  this.onMonthSelect(next);
}

  onMonthSelect(event: any) {  
  this.reloadMonth = event;
  moment.updateLocale('en', {
    week: {
      dow: 1, // Monday
      doy: 7, // Sunday
    },
  });

  const selectedDate: Moment = moment(event);
  this.weeklyRange = [];
  this.weekStatus = [];
  const startOfMonth = selectedDate.clone().startOf('month');
  const endOfMonth = selectedDate.clone().endOf('month');

  const currentWeekStart = startOfMonth.clone().startOf('week');

  while (currentWeekStart.isBefore(endOfMonth)) {
    const currentWeekEnd = currentWeekStart.clone().endOf('week');
    const weekDates = [];

    for (
      let currentDay = currentWeekStart.clone();
      currentDay.isBefore(currentWeekEnd);
      currentDay.add(1, 'day')
    ) {
      if (
        currentDay.isSameOrAfter(startOfMonth) &&
        currentDay.isSameOrBefore(endOfMonth)
      ) {
        weekDates.push(currentDay.clone());
      }
    }

    this.weeklyRange.push(weekDates);
    currentWeekStart.add(1, 'week');
  }

  this.weeklyRange.map((dates) => {
    this.weekStatus.push({
      start: moment(dates[0]).format('YYYY-MM-DD'),
      end: moment(dates.at(-1)).format('YYYY-MM-DD')
    });
  });

  // Fetch the status
  this.timesheetService.getTimesheetsStatus(this.weekStatus, this.empId).subscribe((res: any) => {
    this.timesheetStatus = [];
    for (const result of res) {
      this.timesheetStatus.push(result.data);
    }
    console.log(this.timesheetStatus, " this.timesheetStatus");
    console.log(res, "status response");
  });

  // Fetch the log hours and update weeklySummaryList
  this.timesheetService.getTimesheetsLogHours(this.weekStatus, this.empId).subscribe((res: any) => {
    console.log(res, "logHours");
  
    // Assign the fetched weekly summaries
    this.weeklySummaryList = res.map((weekData: any) => {
      let totalBillable = 0;
      let totalNonBillable = 0;
  
      if (Array.isArray(weekData.data)) {
        weekData.data.forEach((entry: any) => {
          if (entry.billingType === 'billable') {
            totalBillable += entry.logHours || 0;
          } else if (entry.billingType === 'non-billable') {
            totalNonBillable += entry.logHours || 0;
          }
        });
      }
      const currentWeekStart = moment().startOf('week'); // Monday of the current week
      const weekStart = moment(weekData.start).startOf('week');
      const isFutureWeek = weekStart.isAfter(currentWeekStart);
  
      return {
        weekStartDate: weekData.start,
        weekEndDate: weekData.end,
        totalBillableHours: totalBillable,
        totalNonBillableHours: totalNonBillable,
        totalHolidayHours: weekData.totalHolidayHours ?? 0,
        totalHours: totalBillable + totalNonBillable + (weekData.totalHolidayHours ?? 0),
        isFutureWeek
      };
    });
  });
}

navigateWeek(direction: number) {
  // Calculate new start date by adding or subtracting 7 days
  let newStartDate = moment(this.weekStartDate).add(direction * 7, 'days').startOf('isoWeek');
  let newEndDate = newStartDate.clone().endOf('isoWeek');

  // Check to prevent navigating into future weeks
  const today = moment();
  if (newStartDate.isAfter(today, 'day')) {
    console.warn('Cannot navigate to future weeks.');
    return;
  }

  this.openSelectedWeek([newStartDate, newEndDate], []);
}

cloneLastWeek() {
  const lastWeekStart = moment(this.weekStartDate).subtract(7, 'days').startOf('isoWeek');
  const lastWeekEnd = lastWeekStart.clone().endOf('isoWeek');

  this.timesheetService
    .getTimesheetsByDateRange(lastWeekStart, lastWeekEnd, this.userName)
    .subscribe((response) => {
      if (response.length > 0) {
        const timesheetData = response[0].weeklyTimesheet;

        this.timesheets.clear();

        timesheetData.forEach((timesheet: any, index: number) => {
          const clientId = timesheet.customerId;

          this.projectDetailsService.getAllAmsProject(clientId).subscribe((projectsRes: any) => {
            this.projects[index] = projectsRes;

            const group = this.fb.group({
              customerId: [timesheet.customerId || null],
              customerName: [timesheet.customerName || null],
              projectId: [timesheet.projectId || null],
              projectName: [timesheet.projectName || ''],
              activity: [timesheet.activity || ''],
              site: [timesheet.site || ''],
              billingType: [timesheet.billingType || ''],
              weekStartDate: moment(this.weekStartDate).format('YYYY-MM-DDTHH:mm:ss'),
              weekEndDate: moment(this.weekEndDate).format('YYYY-MM-DDTHH:mm:ss'),
              logs: this.fb.array([]),
            });

            const logs = group.get('logs') as FormArray;

            // Match log hours based on weekday
            this.weekDaysShow.forEach((day) => {
              const logForDay = timesheet.logHours.find((entry: any) =>
                moment(entry.logTs).isoWeekday() === day.isoWeekday()
              );

              logs.push(this.fb.group({
                TimesheetStatus: ['Pending'],
                logHours: logForDay ? logForDay.logHours : null,
                logTs: day.clone().startOf('day').format('YYYY-MM-DDTHH:mm:ss'),
              }));
            });

            this.timesheets.push(group);
          });
        });

        this.messageService.add({
          severity: 'success',
          summary: 'Cloned',
          detail: 'Previous week timesheet has been cloned successfully.'
        });

      } else {
        this.messageService.add({
          severity: 'warn',
          summary: 'No Data',
          detail: 'No timesheet data available for the previous week.'
        });
      }
    },
    (error) => {
      console.error('Error cloning last week:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'An error occurred while cloning timesheet data.'
      });
    });
}
checkPreviousWeekDataAvailability(currentWeekStart: Moment) {
  const prevWeekStart = currentWeekStart.clone().subtract(7, 'days').startOf('isoWeek');
  const prevWeekEnd = prevWeekStart.clone().endOf('isoWeek');

  this.timesheetService.getTimesheetsByDateRange(prevWeekStart, prevWeekEnd, this.userName).subscribe({
    next: (response: any[]) => {
      this.hasPreviousWeekData = response && response.length > 0;
    },
    error: () => {
      this.hasPreviousWeekData = false;
    }
  });
}

clonePreviousDayLogs(): void {
  const selectedDate = this.dailyTimesheetForm.get('logDate')?.value;

  if (!selectedDate || !this.empId) {
    this.messageService.add({
      severity: 'warn',
      summary: 'Missing Data',
      detail: 'Please select a log date before cloning.'
    });
    return;
  }

  const previousDay = moment(selectedDate).subtract(1, 'day').format('YYYY-MM-DD');

  this.timesheetService.getDailyTimesheetLogs(previousDay, this.empId).subscribe({
    next: (logs: any[]) => {
      this.entries.clear();

      if (!logs || logs.length === 0) {
        this.messageService.add({
          severity: 'info',
          summary: 'No Logs Found',
          detail: 'No logs available to clone from the previous day.'
        });
        this.addDailyRow();  // Provide an empty row for input
        return;
      }

      logs.forEach((log, index) => {
        const entryGroup = this.fb.group({
          customerId: [log.customerId, Validators.required],
          customerName: [log.customerName],
          projectId: [log.projectId, Validators.required],
          projectName: [log.projectName],
          activity: [log.activity, Validators.required],
          site: [log.site, Validators.required],
          billingType: [log.billingType, Validators.required],
          logHours: [log.logHours, [Validators.required, Validators.min(0.1), Validators.max(24)]]
        });

        this.entries.push(entryGroup);

        // Load projects into dropdown for each entry
        this.projectDetailsService.getAllAmsProject(log.customerId).subscribe(projects => {
          this.projects[index] = projects;
        });
      });

      this.messageService.add({
        severity: 'success',
        summary: 'Logs Cloned',
        detail: 'Previous day logs cloned successfully.'
      });
    },
    error: (err: any) => {
      console.error('Error cloning logs:', err);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to clone previous day logs.'
      });
    }
  });
}
checkPreviousDayLogsAvailability(date: Date): void {
  if (!date || !this.empId) {
    this.hasPreviousDayLogs = false;
    return;
  }

  const previousDay = moment(date).subtract(1, 'day').format('YYYY-MM-DD');

  this.timesheetService.getDailyTimesheetLogs(previousDay, this.empId).subscribe({
    next: (logs: any[]) => {
      this.hasPreviousDayLogs = logs && logs.length > 0;
    },
    error: () => {
      this.hasPreviousDayLogs = false;
    }
  });
}


openSelectedWeek(weekRange: Moment[], status: string[]) {
  this.checkPreviousWeekDataAvailability(moment(weekRange[0]));

  this.weekStartDate = moment(weekRange[0]);
  this.weekEndDate = moment(weekRange[1]);
  this.gridView = false;
  this.editMode = true; 
  this.selectedTimesheetStatus = (status && status.length) ? status[0].toLowerCase() : '';

  // Generate full week from start to end date
  this.weekDaysShow = [];
  const current = this.weekStartDate.clone();
  while (current.isSameOrBefore(this.weekEndDate)) {
    this.weekDaysShow.push(current.clone());
    current.add(1, 'day');
  }

  console.log(this.weekDaysShow, 'full week dates');

  this.timesheets.clear();
  // this.appendLogDatesInForm(this.weekDaysShow);
  for (let i = 0; i < 1; i++) {
  this.appendLogDatesInForm(this.weekDaysShow); // pass the full week to each row
}

  this.timesheetService
    .getTimesheetsByDateRange(
      moment(this.weekStartDate),
      moment(this.weekEndDate),
      this.userName
    )
    .subscribe(
      (response) => {
        if (response.length !== 0) {
          this.editHead = false;
          const timesheetData = response[0].weeklyTimesheet;

          console.log('TimeSheetData', timesheetData);

          this.timesheets.clear();
          this.timesheetForm.patchValue({
            id: response[0].id,           
            doj: response[0].doj,
            employeeId: response[0].employeeId,
            employeeName: response[0].employeeName,
          });

          timesheetData.forEach((timesheet: any, index: number) => {
            console.log(timesheet, "timesheet");
    
            const clientId = timesheet.customerId; // Assuming `customerId` represents the clientId for this row
    
            this.projectDetailsService.getAllAmsProject(clientId).subscribe((projectsRes: any) => {
              this.projects[index] = projectsRes; // This will store the projects for the specific row
    
              const group = this.fb.group({
                customerId: [timesheet.customerId || null],
                customerName: [timesheet.customerName || null],
                projectId: [timesheet.projectId || null],  // Patch the projectId
                projectName: [timesheet.projectName || ''],
                activity: [timesheet.activity || ''],
                site: [timesheet.site || ''],
                billingType: [timesheet.billingType || ''],
                weekStartDate: moment(this.weekStartDate).format('YYYY-MM-DDTHH:mm:ss'),
                weekEndDate: moment(this.weekEndDate).format('YYYY-MM-DDTHH:mm:ss'),
                logs: this.fb.array([]),
              });

              const logs = group.get('logs') as FormArray;

              this.weekDaysShow.forEach((day) => {
                const logForDay = timesheet.logHours.find((entry: any) =>
                  moment(entry.logTs).isSame(day, 'day')
                );

                logs.push(this.fb.group({
                  TimesheetStatus: ['Pending'],
                  logHours: logForDay ? logForDay.logHours : null,
                  logTs: day.clone().startOf('day').format('YYYY-MM-DDTHH:mm:ss'),
                }));                
              });

              this.timesheets.push(group);
            });

            console.log('Timesheets by user:', this.getTimesheets);
            console.log(this.timesheetForm);
          });
        } else {
          this.editHead = true;
          this.editMode = false;
          console.log('Enter Your Timesheets');
        }
      },
      (error) => {
        console.error('Error:', error);
      }
    );

  console.log('Editing row:', this.weekStartDate, this.weekEndDate);
}

  checkLogHours(timesheets: any[]): { [key: string]: number } {
    const hoursPerDate: { [key: string]: number } = {};

    timesheets.forEach(timesheet => {
      timesheet.logs.forEach((log:any) => {
        const date = moment(log.logTs).format('YYYY-MM-DDTHH:mm:ss');
        if (!hoursPerDate[date]) {
          hoursPerDate[date] = 0;
        }
        hoursPerDate[date] += log.logHours;
      });
    });

    const datesExceeding: { [key: string]: number } = {};

    for (const date in hoursPerDate) {
      if (hoursPerDate[date] > 24) {
        datesExceeding[date] = hoursPerDate[date];
      }
    }

    return datesExceeding;
  }
  
  displaySubmitConfirmDialog: boolean = false;

openConfirmDialog() {
  this.displaySubmitConfirmDialog = true;
}

confirmSubmit() {
  this.displaySubmitConfirmDialog = false;
  this.save(this.timesheetForm.value);
}

 submitDailyTimesheet() {
  if (this.dailyTimesheetForm.invalid) {
    console.warn('Form is invalid. Cannot submit.');
    return;
  }

  const logDate = this.dailyTimesheetForm.value.logDate;
  console.log('Log Date selected:', logDate);

  console.log('Raw form values:', this.entries.value);

  const entries = (this.entries.value as {
    customerId: number;
    customerName: string;
    projectId: number;
    projectName: string;
    activity: string;
    site: string;
    billingType: string;
    logHours: number;
  }[]).map((entry, idx) => {
    console.log(`Mapping row ${idx} =>`, entry);

    return {
      customerId: entry.customerId,
      customerName: entry.customerName,
      projectId: entry.projectId,
      projectName: entry.projectName,
      activity: entry.activity,
      site: entry.site,
      billingType: entry.billingType,
      weekStartDate: logDate,
      weekEndDate: logDate,
      logs: [{
        logTs: logDate,
        logHours: entry.logHours,
        timesheetStatus: 'Pending'
      }]
    };
  });

  // Debug: log mapped entries
  console.log('Mapped entries array:', entries);

  const totalHours = entries.reduce((sum: number, e) => sum + (e.logs?.[0]?.logHours || 0), 0);
  console.log('Total hours for the day:', totalHours);

  if (totalHours > 24) {
    this.messageService.add({
      severity: 'error',
      summary: `Total log hours (${totalHours}) exceed 24 hours for ${moment(logDate).format('DD-MMM-YYYY')}.`
    });
    return;
  }

  const dailyPayload = {
    id: 0,
    employeeId: this.empId,
    employeeName: this.userName,
    doj: this.currentDate,
    weeklyTimesheet: entries
  };

  console.log('Final payload to submit:', JSON.stringify(dailyPayload, null, 2));

  this.timesheetService.addDailyTimesheet(dailyPayload).subscribe({
    next: () => {
      this.messageService.add({
        severity: 'success',
        summary: 'Timesheet Submitted',
        detail: 'Daily timesheet saved successfully'
      });
      this.showDailyDialog = false;
      this.onMonthSelect(this.reloadMonth);
      this.dailyTimesheetForm.reset();
      this.entries.clear();
      this.addDailyRow();
    },
    error: (err) => {
      console.error('Error saving daily timesheet:', err);
      this.messageService.add({
        severity: 'error',
        summary: 'Submission Failed',
        detail: 'Could not save daily timesheet. Try again.'
      });
    }
  });
}



  save(timesheetFormValue: Timesheets) {
    console.log('Starting to save timesheet:', timesheetFormValue);
  
    // Check if any log hours exceed 24 hours
    const datesExceeding24Hours = this.checkLogHours(timesheetFormValue.weeklyTimesheet);  
    console.log('Log hours exceeding 24 hours:', datesExceeding24Hours);
  
    // If any date exceeds 24 hours, display an error message and stop the process
    for (const date in datesExceeding24Hours) {
      this.messageService.add({
        severity: 'error',
        summary: `Date ${date} has total log hours of ${datesExceeding24Hours[date]}, which exceeds 24 hours.`,
      });
      console.log(`Error: Log hours for ${date} exceed 24 hours: ${datesExceeding24Hours[date]}`);
      return;
    }
  
    // Sanitize the form before sending it to the service
    const sanitizedForm = this.sanitizeTimesheetForm(timesheetFormValue);
    console.log('Sanitized form:', sanitizedForm);
  
    // Get the start and end of the week from the timesheet
    const startOfWeek = moment(timesheetFormValue.weeklyTimesheet[0]?.weekStartDate).format('YYYY-MM-DD');
    const endOfWeek = moment(timesheetFormValue.weeklyTimesheet[0]?.weekEndDate).format('YYYY-MM-DD');
    console.log(`Start of week: ${startOfWeek}, End of week: ${endOfWeek}`);
  
    // Determine if it's an edit or add operation based on the `editMode` flag
    const request = this.editMode
      ? this.timesheetService.EditTimesheets(sanitizedForm, startOfWeek, endOfWeek)
      : this.timesheetService.addTimesheet(sanitizedForm);
  
    // Handle the service response
    request.subscribe(
      (response) => {
        if (typeof response === 'string') {
          // Log success response if it's a string
          console.log('Success: Timesheet updated:', response);
          this.messageService.add({
            severity: 'success',
            summary: 'Timesheet Updated',
            detail: response,  
          });
        } else {
          // Log success response if it's an object
          console.log('Success: Timesheet updated successfully');
          this.messageService.add({
            severity: 'success',
            summary: 'Timesheet Updated',
            detail: 'Timesheet updated successfully',
          });
        }
  
        // After successful save, trigger the month selection and reset the form
        this.onMonthSelect(this.reloadMonth);
        this.gridView = true;
        this.timesheetForm.reset();
        console.log('Form has been reset and gridView set to true');
      },
      (error) => {
        // Log error response if the request fails
        console.error('Error during request:', error);
        this.messageService.add({
          severity: 'error',
          summary: this.editMode ? 'Failed to update timesheet!' : 'Failed to add timesheet!',
          detail: 'Try again!',
        });
        console.log('Error message displayed to the user:', error);
      }
    );
  }
  
  
  

  sanitizeTimesheetForm(form: Timesheets): any {
    return {
      employeeId: form.employeeId,
      employeeName: form.employeeName,
      doj: form.doj,
      weeklyTimesheet: form.weeklyTimesheet.map((ts: any) => ({
        customerId: ts.customerId,
        customerName: ts.CustomerName,
        projectId: Number(ts.projectId),
        projectName: ts.projectName,
        activity: ts.activity,
        site: ts.site,
        billingType: ts.billingType,
        weekStartDate: ts.weekStartDate,
        weekEndDate: ts.weekEndDate,
        logs: ts.logs.map((log: any) => ({
          timesheetStatus: log.TimesheetStatus || 'Pending',
          logHours: log.logHours === '' || isNaN(log.logHours) ? null : Number(log.logHours),
          logTs: log.logTs,
        })),
      })),
    };
  }
  
  
  backToGrid() {
    this.gridView = true;
    this.editMode = false;
    this.timesheetForm.reset();
    this.timesheets.clear();
  }

weekSummaryToWithdraw: any;
rowIndexToWithdraw: number =0;
weekSummaryToAct: any;
rowIndexToAct: number=0;


  showWithdrawDialog(weekSummary: any, rowIndex: number) {
  this.weekSummaryToWithdraw = weekSummary;
  this.rowIndexToWithdraw = rowIndex;
  this.displayWithdrawDialog = true;
}

  showDialog() {  
  this.displayWithdrawDialog = true;
}

cancelWithdrawal() {
  this.displayWithdrawDialog = false;
}

confirmWithdrawal() {
  this.toggleEdit(this.weekSummaryToWithdraw, this.rowIndexToWithdraw);
  this.displayWithdrawDialog = false;
}

showApproveDialog(weekSummary: any, rowIndex: number) {
  this.weekSummaryToAct = weekSummary;
  this.rowIndexToAct = rowIndex;
  this.displayApproveDialog = true;
}

cancelApprove() {
  this.displayApproveDialog = false;
}

confirmApprove() {
  
  this.displayApproveDialog = false;
}

showRejectDialog(weekSummary: any, rowIndex: number) {
  this.weekSummaryToAct = weekSummary;
  this.rowIndexToAct = rowIndex;
  this.displayRejectDialog = true;
}

cancelReject() {
  this.displayRejectDialog = false;
}

confirmReject() {
  this.reject(this.weekSummaryToAct, this.rowIndexToAct);
  this.displayRejectDialog = false;
}

  }
  
  