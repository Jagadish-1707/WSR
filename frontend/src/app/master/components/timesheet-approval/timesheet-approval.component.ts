import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MessageService } from 'primeng/api';
import { TimesheetService } from '../../services/timesheet.service';
import { UserService } from '../../services/user.service';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { TableModule } from 'primeng/table';
import { CommonModule,formatDate } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import * as XLSX from 'xlsx';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // <-- import these
import { CalendarModule } from 'primeng/calendar'; 
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-timesheet-approval',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    TableModule,
    ToolbarModule,
    ButtonModule,
    CommonModule,
    DialogModule,ToastModule,
    InputTextModule,InputTextareaModule,
    FormsModule,ReactiveFormsModule,CalendarModule,
    ConfirmDialogModule,TagModule,TooltipModule,DropdownModule
  ],
  templateUrl: './timesheet-approval.component.html',
  styleUrls: ['./timesheet-approval.component.scss'],
})
export class TimesheetApprovalComponent implements OnInit {
  dailyTimesheets: DailyTimesheetEntry[] = [];
  managerUserId: string = '';
  loading: boolean = false;
  selectedTimesheets: DailyTimesheetEntry[] = [];
  displayApproveDialog: boolean = false;
  displayBulkApproveDialog: boolean = false;
  displayRejectDialog: boolean = false;
  displayBulkRejectDialog: boolean = false;
  managerEmail: string = '';
  managerName: string = '';
  rejectionComments: string = '';
  bulkRejectionComments: string = '';
  approvalComments: string = '';
  bulkApprovalComments: string = '';
  filteredTimesheets: DailyTimesheetEntry[] = [];
   filterLogDate: Date[] | undefined; 
  filterProject: any;
  filterCustomer: any;
  filterEmployeeName!: string;
  filterEmployeeId!: string;
  filterStatus!: string;
  filterBillingType!: string;

  projectOptions: any[] = [];
  customerOptions: any[] = [];
  employeeNames: any[] = [];
  employeeIds: any[] = [];
  statusOptions: string[] = ['Pending', 'Approved', 'Rejected', 'Withdrawn'];
  billingTypes: any[] = ['Billable', 'Non-Billable'];

  selectedTimesheetForAction: DailyTimesheetEntry | null = null;
  filtersVisible: boolean = true;

  constructor(
    private router: Router,
    private messageService: MessageService,
    private fb: FormBuilder,
    private timesheetService: TimesheetService,
    private userService: UserService,
    private confirmationService: ConfirmationService,
  ) {}

  ngOnInit(): void {
    const userDetails = JSON.parse(localStorage.getItem('userLogin') || '{}') as any;
    this.managerUserId = userDetails?.data?.user_Id ?? userDetails?.data?.userId ?? '';
    this.managerEmail = userDetails?.data?.email_Address ?? '';
    this.managerName = userDetails?.data?.userName ?? '';
    if (!this.managerUserId) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'User not logged in or user ID missing.',
      });
      return;
    }

    this.loadDailyTimesheets();
  }


  loadDailyTimesheets(): void {
  this.loading = true;
  this.timesheetService.getDailyTimesheetsDetailed(this.managerUserId).subscribe({
    next: (timesheets) => {
      console.log(timesheets);

      // Apply sorting
      this.dailyTimesheets = timesheets.sort((a, b) => {
        // Sorting logic for status and logDate
        const statusPriority = (status: string) => {
          switch (status?.toLowerCase()) {
            case 'pending':
              return 1;
            case 'approved':
              return 2;
            case 'rejected':
              return 3;
            case 'withdrawn':
              return 4;
            default:
              return 5;
          }
        };

        const priorityA = statusPriority(a.timesheetStatus);
        const priorityB = statusPriority(b.timesheetStatus);

        if (priorityA !== priorityB) {
          return priorityA - priorityB; // lower priority first
        }

        // If same status, sort by logDate descending
        const dateA = new Date(a.logDate).getTime();
        const dateB = new Date(b.logDate).getTime();
        return dateB - dateA;
      });

      this.filteredTimesheets = this.dailyTimesheets;

      // Extract distinct values for each field to populate dropdowns
      this.projectOptions = this.getUniqueValues(timesheets, 'projectName');
      this.customerOptions = this.getUniqueValues(timesheets, 'customerName');
      this.employeeNames = this.getUniqueValues(timesheets, 'employeeName');
      this.employeeIds = this.getUniqueValues(timesheets, 'employeeId');
      this.statusOptions = this.getUniqueValues(timesheets, 'timesheetStatus');
      this.billingTypes = this.getUniqueValues(timesheets, 'billingType');

      this.loading = false;
    },
    error: (error) => {
      this.loading = false;
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to load timesheets.',
      });
      console.error('Error loading daily timesheets:', error);
    },
  });
}

getUniqueValues(timesheets: any[], field: string): any[] {
  return [...new Set(timesheets.map((item) => item[field]))];
}

formatDateTime(dateString: string | Date): string {
  if (!dateString) return '';

  const date = new Date(dateString);

  // Format date: e.g. 28 Apr 2025
  const formattedDate = date.toLocaleDateString(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  // Format time: 12-hour with AM/PM
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 => 12

  const formattedTime = `${hours}:${minutes} ${ampm}`;

  return `${formattedDate} ${formattedTime}`;
}

applyFilters(): void {
  // If no date range selected, start with all timesheets
  if (!this.filterLogDate || this.filterLogDate.length !== 2) {
    this.filteredTimesheets = [...this.dailyTimesheets];
  } else {
    const [start, end] = this.filterLogDate;
    const startDate = this.stripTime(start);
    const endDate = this.stripTime(end);

    this.filteredTimesheets = this.dailyTimesheets.filter(timesheet => {
      const logDate = this.stripTime(new Date(timesheet.logDate));
      return logDate >= startDate && logDate <= endDate;
    });
  }

  // Normalize helper
  const safeLower = (str?: string | null) => (str ? str.trim().toLowerCase() : '');

  // Normalize filters once
  const filterProject = safeLower(this.filterProject);
  const filterCustomer = safeLower(this.filterCustomer);
  const filterEmployeeName = safeLower(this.filterEmployeeName);
  const filterEmployeeId = safeLower(this.filterEmployeeId);
  const filterStatus = safeLower(this.filterStatus);
  const filterBillingType = safeLower(this.filterBillingType);

  // Now filter based on other criteria on already date-filtered list
  this.filteredTimesheets = this.filteredTimesheets.filter(timesheet => {
    const projectName = safeLower(timesheet.projectName);
    const customerName = safeLower(timesheet.customerName);
    const employeeName = safeLower(timesheet.employeeName);
    const employeeId = safeLower(timesheet.employeeId);
    const timesheetStatus = safeLower(timesheet.timesheetStatus);
    const billingType = safeLower(timesheet.billingType);

    const matchesProject = !filterProject || projectName === filterProject;
    const matchesCustomer = !filterCustomer || customerName === filterCustomer;
    const matchesEmployeeName = !filterEmployeeName || employeeName.includes(filterEmployeeName);
    const matchesEmployeeId = !filterEmployeeId || employeeId === filterEmployeeId;
    const matchesStatus = !filterStatus || timesheetStatus === filterStatus;
    const matchesBillingType = !filterBillingType || billingType === filterBillingType;

    return (
      matchesProject &&
      matchesCustomer &&
      matchesEmployeeName &&
      matchesEmployeeId &&
      matchesStatus &&
      matchesBillingType
    );
  });
}

/** Utility to reset time part for date comparisons */
stripTime(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

   onClearFilters(): void {
  // Clear all filters
  this.filterLogDate = [];
  this.filterProject = null;
  this.filterCustomer = null;
  this.filterEmployeeName = '';
  this.filterEmployeeId = '';
  this.filterStatus = '';
  this.filterBillingType = '';

  // Apply filters (this will reset the timesheet data as well)
  this.applyFilters();
  this.filtersVisible = true;
}

showFilters(): void {
  this.filtersVisible = false;
}
getSeverity(status: string): string {
  switch (status) {
    case 'Approved':
      return 'success';  // Green for approved
    case 'Pending':
      return 'info';  
    case 'Rejected':
      return 'danger';   // Red for rejected
    case 'Withdrawn':
      return 'info';     // Blue for withdrawn
    default:
      return 'secondary'; // Default severity for any unknown status
  }
}

toInitCase(value: string): string {
  if (!value) return '';
  return value
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

formatHours(hours: number): string {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}:${m.toString().padStart(2, '0')}`;
  }
WeeklyTimeLog() {
    this.router.navigate(['/timesheets']);
  }

// Returns true if this timesheet is the first selected row in sequence
isFirstSelectedRow(index: number): boolean {
  if (this.selectedTimesheets.length === 0) return false;
  if (!this.isSelected(this.dailyTimesheets[index])) return false;

  if (index === 0) return true;

  // Previous row not selected => current is first selected in block
  return !this.isSelected(this.dailyTimesheets[index - 1]);
}

  openApproveDialog(timesheet: DailyTimesheetEntry): void {    
    this.selectedTimesheetForAction = timesheet;
    this.displayApproveDialog = true;
  }
  openBulkApproveDialog(timesheets: DailyTimesheetEntry[]): void {    
    this.selectedTimesheets = timesheets;
    this.displayBulkApproveDialog = true;
  }

  confirmApprove(): void {
  if (!this.selectedTimesheetForAction) return;

  this.loading = true;
  const logDate = formatDate(
    this.selectedTimesheetForAction.logDate,
    'yyyy-MM-dd',
    'en-US'
  );

  this.timesheetService
    .approveTimesheetDaily(
      this.selectedTimesheetForAction.timesheetId,
      logDate,
      this.selectedTimesheetForAction.employeeId,
      this.managerEmail,
      this.approvalComments
    )
    .subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Approved',
          detail: 'Timesheet approved.',
        });
        this.displayApproveDialog = false;
        this.approvalComments = '';
        this.selectedTimesheetForAction = null;
        this.loadDailyTimesheets();
        this.loading = false;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Approval failed.',
        });
        this.loading = false;
      },
    });
}

  cancelApprove(): void {
    this.displayApproveDialog = false;
    this.selectedTimesheetForAction = null;
  }
  cancelBulkApprove(): void {
    this.displayBulkApproveDialog = false;
    this.selectedTimesheets = [];
  }

  openRejectDialog(timesheet: DailyTimesheetEntry): void {
    this.selectedTimesheetForAction = timesheet;
    this.displayRejectDialog = true;
    this.rejectionComments = '';
  }
  openBulkRejectDialog(timesheets: DailyTimesheetEntry[]): void {
    this.selectedTimesheets = timesheets;
    this.displayBulkRejectDialog = true;
    this.rejectionComments = '';
  }

  confirmReject(): void {
    if (!this.selectedTimesheetForAction) return;
    console.log('Rejecting with comments:', this.rejectionComments);


    this.loading = true;
    const logDate = typeof this.selectedTimesheetForAction.logDate === 'string'
      ? this.selectedTimesheetForAction.logDate
      : (this.selectedTimesheetForAction.logDate as Date).toISOString();

    
    this.timesheetService
      .rejectTimesheetDaily(
        this.selectedTimesheetForAction.timesheetId,
        logDate,
        this.selectedTimesheetForAction.employeeId,
        this.rejectionComments, 
        this.managerEmail
      )
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Rejected',
            detail: 'Timesheet rejected.',
          });
          this.displayRejectDialog = false;
          this.rejectionComments = '';
          this.selectedTimesheetForAction = null;
          this.loadDailyTimesheets();
          this.loading = false;
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Rejection failed.',
          });
          this.loading = false;
        },
      });
  }

  cancelReject(): void {
    this.displayRejectDialog = false;
    this.selectedTimesheetForAction = null;
  }
  cancelBulkReject(): void {
    this.displayBulkRejectDialog = false;
    this.selectedTimesheets = [];
  }

 bulkApproveSelected(): void {  
  if (!this.selectedTimesheets?.length) {
    return;
  }

  const entries = this.selectedTimesheets
    .filter(entry => entry.timesheetStatus === 'Pending')
    .map(entry => ({
      timesheetId: entry.timesheetId,
      logDate: entry.logDate,
      employeeId: entry.employeeId,
    }));  
  const payload: BatchApproveDto = {
  entries,
  approvedBy: this.managerName,
  comments: this.bulkApprovalComments || ''
};

  this.loading = true;
  this.timesheetService.batchApproveTimesheets(payload).subscribe({
    next: (response) => {
      console.log('Batch approve response:', response);
      this.messageService.add({
        severity: 'success',
        summary: 'Approved',
        detail: 'Selected timesheets approved.'
      });
      this.bulkApprovalComments='';
      this.displayBulkApproveDialog = false;
      this.selectedTimesheets = [];
      this.loading = false;
      this.loadDailyTimesheets();
    },
    error: (error) => {
      console.error('Bulk approval error:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Bulk approval failed.'
      });
      this.loading = false;
    }
  });
}


bulkRejectSelected(): void {
  if (!this.selectedTimesheets?.length) {
    return;
  }

  const entries = this.selectedTimesheets
    .filter(entry => entry.timesheetStatus === 'Pending')
    .map(entry => ({
      timesheetId: entry.timesheetId,
      logDate: entry.logDate,
      employeeId: entry.employeeId,
      comments: this.bulkRejectionComments
    }));

    const payload: BatchRejectDto = {
  entries,
  rejectedBy: this.managerName,
  comments: this.bulkRejectionComments || ''
};

  this.loading = true;
  this.timesheetService.batchRejectTimesheets(payload).subscribe({
    next: (response) => {
      console.log('Batch reject response:', response);
      this.messageService.add({
        severity: 'success',
        summary: 'Rejected',
        detail: 'Selected timesheets rejected.'
      });
      this.bulkRejectionComments ='';
      this.displayBulkRejectDialog = false;
      this.selectedTimesheets = [];
      this.loading = false;
      this.loadDailyTimesheets();
    },
    error: (error) => {
      console.error('Bulk rejection error:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Bulk rejection failed.'
      });
      this.loading = false;
    }
  });
}


  exportToExcel(): void {
  if (!this.dailyTimesheets || this.dailyTimesheets.length === 0) {
    this.messageService.add({severity:'warn', summary: 'Warning', detail: 'No data to export'});
    return;
  }

  // Prepare worksheet from JSON data
  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.dailyTimesheets);

  // Create a new workbook and append worksheet
  const workbook: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Timesheets');

  // Generate buffer
  const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  
  // Save to file
  this.saveAsExcelFile(excelBuffer, 'Timesheet_Export');
}

private saveAsExcelFile(buffer: any, fileName: string): void {
  const data: Blob = new Blob([buffer], { type: 'application/octet-stream' });
  // saveAs(data, `${fileName}_${new Date().getTime()}.xlsx`);
}

isSelected(timesheet: DailyTimesheetEntry): boolean {
  return this.selectedTimesheets?.some(t => t.timesheetId === timesheet.timesheetId) ?? false;
}

}


export interface TimesheetActionEntry {
  timesheetId: number;         
  logDate?: string | Date;     
  employeeId?: string;         
}


export interface BatchApproveDto {
  entries: TimesheetActionEntry[];
  comments?: string;
  approvedBy: string;
}

export interface BatchRejectDto {
  entries: TimesheetActionEntry[];
  comments?: string;
  rejectedBy: string;
}

interface DailyTimesheetEntry { 
  timesheetId: number;
  logDate: string | Date;
  employeeId: string;
  employeeName: string;
  projectName: string;
  customerName: string;
  billingType: string;
  logHours: number;
  timesheetStatus: string;
  site: string;
  activity: string;
  remarks?: string;
  createdOn?: string | Date;
}
