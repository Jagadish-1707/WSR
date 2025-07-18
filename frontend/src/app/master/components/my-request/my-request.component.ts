import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { TimesheetService } from '../../services/timesheet.service';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { TooltipModule } from 'primeng/tooltip';
import { TableModule } from 'primeng/table';
import { Table } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DatePipe, CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { MessageService } from 'primeng/api';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import moment from 'moment';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-my-request',
  standalone: true,
  imports: [
    ButtonModule,
    DialogModule,
    InputTextModule,
    CheckboxModule,
    TooltipModule,
    TableModule,
    ToolbarModule,
    ReactiveFormsModule,
    ConfirmDialogModule,
    DropdownModule,
    FormsModule,
    DatePipe,
    CommonModule,
    CalendarModule,
    ProgressSpinnerModule,
    TagModule,
    FullCalendarModule,
  ],
  templateUrl: './my-request.component.html',
  styleUrls: ['./my-request.component.scss'],
})
export class MyRequestComponent implements OnInit {
  dailyTimesheetEntries: DailyTimesheetEntry[] = [];
  employeeId: string = 'ECPL0705';
  loading: boolean = false;
  errorMessage: string = '';
  selectedTimesheets: DailyTimesheetEntry[] = [];
  filteredTimesheets: DailyTimesheetEntry[] = [];
  filterLogDate: Date[] | undefined = [];
  filterProject: string | null = null;
  filterCustomer: string | null = null;
  filterEmployeeName: string = '';
  filterEmployeeId: string = '';
  filterStatus: string = '';
  filterBillingType: string = '';
  projectOptions: any[] = [];
  customerOptions: any[] = [];
  employeeNames: any[] = [];
  employeeIds: any[] = [];
  statusOptions: string[] = ['Pending', 'Approved', 'Rejected', 'Withdrawn'];
  billingTypes: any[] = ['Billable', 'Non-Billable'];
  filtersVisible: boolean = true;
  selectedTimesheet: DailyTimesheetEntry | null = null;
  timesheetDialogVisible: boolean = false;
  viewMode: 'list' | 'week' | 'month' = 'list'; // Track current view
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'timeGridWeek',
    initialDate: moment().startOf('isoWeek').toDate(),
    headerToolbar: false,
    weekNumbers: true,
    weekNumberCalculation: 'ISO',
    events: [],
    eventClick: this.onCalendarDateSelect.bind(this),
    eventContent: this.renderEventContent.bind(this),
  };
  @ViewChild('dt') dt: Table | undefined;
  @ViewChild('fullcalendar') fullcalendar: any;
  currentPeriodStart = moment().startOf('isoWeek'); // Renamed for clarity
  currentPeriodEnd = moment().endOf('isoWeek');

  constructor(
    private timesheetService: TimesheetService,
    private messageService: MessageService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const userDetails = JSON.parse(localStorage.getItem('userLogin') || '{}') as any;
    this.employeeId = userDetails?.data?.employee_ID ?? 'ECPL0705';
    this.getDailyTimesheets();
  }

  getDailyTimesheets(): void {
    this.loading = true;
    this.errorMessage = '';
    this.timesheetService.getTimesheetsByEmployeeId(this.employeeId).subscribe({
      next: (data) => {
        this.dailyTimesheetEntries = data
          .map((entry) => ({
            ...entry,
            logDate: moment(entry.logDate, ['YYYY-MM-DD', 'DD-MM-YYYY', moment.ISO_8601]).toDate(),
          }))
          .sort((a, b) => {
            const dateA = new Date(a.logDate).getTime();
            const dateB = new Date(b.logDate).getTime();
            return dateA - dateB;
          });
        this.populateDropdowns(data);
        this.filteredTimesheets = [...this.dailyTimesheetEntries];
        console.log('Filtered timesheets:', this.filteredTimesheets);
        this.prepareCalendarEvents();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = 'Failed to load timesheets. Please try again later.';
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: this.errorMessage,
        });
        console.error('Error fetching timesheets:', err);
        this.cdr.detectChanges();
      },
    });
  }

  prepareCalendarEvents(): void {
    this.calendarOptions.events = this.filteredTimesheets.map((entry) => ({
      title: `${entry.projectName} (${entry.activity})`,
      start: moment(entry.logDate).toDate(),
      end: moment(entry.logDate).toDate(),
      extendedProps: {
        hours: entry.logHours,
        status: entry.timesheetStatus,
        projectName: entry.projectName,
        activity: entry.activity,
      },
      backgroundColor: this.getEventColor(entry.timesheetStatus),
      borderColor: this.getEventColor(entry.timesheetStatus),
    }));
  }

  getEventColor(status: string): string {
    switch (status) {
      case 'Approved':
        return '#28a745';
      case 'Pending':
        return '#007bff';
      case 'Rejected':
        return '#dc3545';
      case 'Withdrawn':
        return '#6c757d';
      default:
        return '#6c757d';
    }
  }

  setViewMode(mode: 'list' | 'week' | 'month'): void {
    this.viewMode = mode;
    if (mode === 'week') {
      this.calendarOptions.initialView = 'timeGridWeek';
      this.currentPeriodStart = moment(this.currentPeriodStart).startOf('isoWeek');
      this.currentPeriodEnd = moment(this.currentPeriodStart).endOf('isoWeek');
    } else if (mode === 'month') {
      this.calendarOptions.initialView = 'dayGridMonth';
      this.currentPeriodStart = moment(this.currentPeriodStart).startOf('month');
      this.currentPeriodEnd = moment(this.currentPeriodStart).endOf('month');
    }
    this.calendarOptions.initialDate = this.currentPeriodStart.toDate();
    const calendarApi = this.fullcalendar?.getApi();
    if (calendarApi) {
      calendarApi.changeView(this.calendarOptions.initialView);
      calendarApi.gotoDate(this.currentPeriodStart.toDate());
    }
    this.cdr.detectChanges();
  }

  navigatePeriod(direction: number): void {
    if (this.viewMode === 'week') {
      this.currentPeriodStart = this.currentPeriodStart.clone().add(direction, 'weeks');
      this.currentPeriodEnd = this.currentPeriodStart.clone().endOf('isoWeek');
    } else if (this.viewMode === 'month') {
      this.currentPeriodStart = this.currentPeriodStart.clone().add(direction, 'months').startOf('month');
      this.currentPeriodEnd = this.currentPeriodStart.clone().endOf('month');
    }
    this.calendarOptions.initialDate = this.currentPeriodStart.toDate();
    const calendarApi = this.fullcalendar?.getApi();
    if (calendarApi) {
      calendarApi.gotoDate(this.currentPeriodStart.toDate());
    }
    this.cdr.detectChanges();
  }

  applyPeriodFilter(): void {
    if (!this.dailyTimesheetEntries || this.dailyTimesheetEntries.length === 0) {
      this.filteredTimesheets = [];
      this.calendarOptions.events = [];
      this.cdr.detectChanges();
      return;
    }
    const start = this.currentPeriodStart.clone().startOf('day');
    const end = this.currentPeriodEnd.clone().endOf('day');
    this.filteredTimesheets = this.dailyTimesheetEntries.filter((entry) => {
      const entryDate = moment(entry.logDate);
      return entryDate.isBetween(start, end, undefined, '[]');
    });
    this.prepareCalendarEvents();
    this.cdr.detectChanges();
  }

  onCalendarDateSelect(event: any): void {
    const selectedDateStr = moment(event.event.start).format('YYYY-MM-DD');
    this.filteredTimesheets = this.dailyTimesheetEntries.filter(
      (entry) => moment(entry.logDate).format('YYYY-MM-DD') === selectedDateStr
    );
    this.viewMode = 'list';
    this.cdr.detectChanges();
  }

  renderEventContent(eventInfo: any): any {
    if (this.viewMode === 'month') {
      // Simplified rendering for month view
      return {
        html: `
          <div class="custom-event-month" style="font-size: 12px; line-height: 1.2;">
            <strong>${eventInfo.event.title}</strong><br />
            ${this.formatHours(eventInfo.event.extendedProps.hours)}
          </div>
        `,
      };
    }
    // Default rendering for week view
    return {
      html: `
        <div class="custom-event">
          <strong>${eventInfo.event.title}</strong><br />
          ${this.formatHours(eventInfo.event.extendedProps.hours)}<br />
          Status: ${eventInfo.event.extendedProps.status}
        </div>
      `,
    };
  }

  onRowSelect(event: any): void {
    this.selectedTimesheet = event.data;
    this.timesheetDialogVisible = true;
    this.cdr.detectChanges();
  }

  formatHours(hours: number): string {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}:${m.toString().padStart(2, '0')}`;
  }

  populateDropdowns(timesheets: any[]): void {
    this.projectOptions = this.toInitCaseArray(this.getUniqueValues(timesheets, 'projectName'));
    this.customerOptions = this.toInitCaseArray(this.getUniqueValues(timesheets, 'customerName'));
    this.employeeNames = this.toInitCaseArray(this.getUniqueValues(timesheets, 'employeeName'));
    this.employeeIds = this.getUniqueValues(timesheets, 'employeeId');
    this.statusOptions = this.toInitCaseArray(this.getUniqueValues(timesheets, 'timesheetStatus'));
    this.billingTypes = this.toInitCaseArray(this.getUniqueValues(timesheets, 'billingType'));
  }

  toInitCaseArray(values: string[]): string[] {
    return values
      .filter((v) => !!v)
      .map((v) =>
        v
          .toLowerCase()
          .split(' ')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
      );
  }

  toInitCase(value: string): string {
    if (!value) return '';
    return value
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  getUniqueValues(timesheets: any[], field: string): any[] {
    return [...new Set(timesheets.map((item) => item[field]))];
  }

  formatDateTime(dateString: string | Date): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString(undefined, {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${formattedDate} ${hours}:${minutes} ${ampm}`;
  }

  applyFilters(): void {
    this.filteredTimesheets = this.dailyTimesheetEntries.filter((timesheet) => {
      const safeLower = (str?: string | null) => (str ? str.trim().toLowerCase() : '');
      const filterProject = safeLower(this.filterProject);
      const filterCustomer = safeLower(this.filterCustomer);
      const filterEmployeeName = safeLower(this.filterEmployeeName);
      const filterEmployeeId = safeLower(this.filterEmployeeId);
      const filterStatus = safeLower(this.filterStatus);
      const filterBillingType = safeLower(this.filterBillingType);
      const projectName = safeLower(timesheet.projectName);
      const customerName = safeLower(timesheet.customerName);
      const employeeName = safeLower(timesheet.employeeName);
      const employeeId = safeLower(timesheet.employeeId);
      const timesheetStatus = safeLower(timesheet.timesheetStatus);
      const billingType = safeLower(timesheet.billingType);
      let matchesLogDate = true;
      if (this.filterLogDate && this.filterLogDate.length === 2) {
        const [startDate, endDate] = this.filterLogDate;
        const logDate = this.stripTime(new Date(timesheet.logDate));
        const start = this.stripTime(startDate);
        const end = this.stripTime(endDate);
        matchesLogDate = logDate >= start && logDate <= end;
      }
      const matchesProject = !filterProject || projectName === filterProject;
      const matchesCustomer = !filterCustomer || customerName === filterCustomer;
      const matchesEmployeeName = !filterEmployeeName || employeeName.includes(filterEmployeeName);
      const matchesEmployeeId = !filterEmployeeId || employeeId === filterEmployeeId;
      const matchesStatus = !filterStatus || timesheetStatus === filterStatus;
      const matchesBillingType = !filterBillingType || billingType === filterBillingType;
      return (
        matchesLogDate &&
        matchesProject &&
        matchesCustomer &&
        matchesEmployeeName &&
        matchesEmployeeId &&
        matchesStatus &&
        matchesBillingType
      );
    });
    this.prepareCalendarEvents();
    this.cdr.detectChanges();
  }

  showFilters(): void {
    this.filtersVisible = false;
    this.cdr.detectChanges();
  }

  stripTime(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  onClearFilters(): void {
    this.filterLogDate = [];
    this.filterProject = null;
    this.filterCustomer = null;
    this.filterEmployeeName = '';
    this.filterEmployeeId = '';
    this.filterStatus = '';
    this.filterBillingType = '';
    this.filteredTimesheets = [...this.dailyTimesheetEntries];
    this.prepareCalendarEvents();
    this.filtersVisible = true;
    this.cdr.detectChanges();
  }

  getSeverity(status: string): string {
    switch (status) {
      case 'Approved':
        return 'success';
      case 'Pending':
        return 'info';
      case 'Rejected':
        return 'danger';
      case 'Withdrawn':
        return 'warning';
      default:
        return 'secondary';
    }
  }

  WeeklyTimeLog(): void {
    this.router.navigate(['/timesheets']);
  }
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