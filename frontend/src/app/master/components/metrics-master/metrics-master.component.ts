import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MetricsMasterService } from '../../services/metrics-master.service';
import { MetricsMaster } from '../../models/metricsMaster';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TagModule } from 'primeng/tag';
import { MessageService } from 'primeng/api';
import { MetricsService } from '../../services/metrics.service';
import { transformFirstWordCaps } from '../../services/inputcasesensitive';

@Component({
  standalone: true,
  selector: 'app-metrics-master',
  templateUrl: './metrics-master.component.html',
  styleUrls: ['./metrics-master.component.scss'],
  imports: [
    CommonModule,
    ButtonModule,
    DialogModule,
    TableModule,
    ToolbarModule,
    ToastModule,
    DropdownModule,
    InputTextModule,
    CalendarModule,
    InputTextareaModule,
    TagModule,
    ReactiveFormsModule,
  ],
})
export class MetricsMasterComponent implements OnInit {
  visible: boolean = false;
  displayDeleteDialog: boolean = false;
  frm!: FormGroup;
  metricsList: MetricsMaster[] = [];
  selectedMetricsMaster!: MetricsMaster;
  projectTypes: {
    label: string;
    value: { projectTypeId: number; projectTypeName: string };
  }[] = [];
  isEditMode: boolean = false;
  editMetricsId: number | null = null;
  userDetails: any;
  userName: string = '';
  userId: string = '';
  filteredMasterNames: MetricsMaster[] = [];
  recordToDelete: any;
  metricsData: any;
  metricNames: string[] = [];
  showWarningDialog: boolean = false;
  searchValue: any;
  dt: any;
  showEditWarningDialog: boolean = false;
  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private metricsMasterService: MetricsMasterService,
    private metricsService: MetricsService
  ) {
    this.userDetails = JSON.parse(localStorage.getItem('userLogin')!);
    this.userName = this.userDetails.data.userName;
    this.userId = this.userDetails.data.user_Id;
  }

  ngOnInit(): void {
    this.frm = this.fb.group({
      metricsName: ['', Validators.required],
      description: [''],
      // projectTypeId: ['', Validators.required],
      startDate: [new Date(), Validators.required],
      endDate: [new Date(), Validators.required],
      remarks: [''],
      status: [1, Validators.required],
    });
    // this.isProjectTypesLoaded = false;
    // this.loadProjectTypes();
    this.loadMetricsMasterList();
    this.getGridMetricData();
  }

  getGridMetricData() {
    this.metricsService.getMetricsColumnList().subscribe((response: any) => {
      this.metricsData = response;
      this.metricNames = this.metricsData
        .map((item: any) => item.metricName)
        .flat();
    });
  }

  isProjectTypesLoaded: boolean = false;

  loadMetricsMasterList(): void {
    this.metricsMasterService
      .getAllMetricsMasterList()
      .subscribe((response: MetricsMaster[]) => {
        this.metricsList = response;
        const seenMasterName = new Set();
        this.filteredMasterNames = response.filter((master) => {
          const duplicate = seenMasterName.has(master.metricsName);
          seenMasterName.add(master.metricsName);
          return !duplicate;
        });
      });
  }
  filterTable() {
    this.dt.filterGlobal(this.searchValue, 'contains');
  }
  // Load list of MetricsMaster from the service
  // loadMetricsMasterList(): void {
  //   this.metricsMasterService.getMetricsMasterList().subscribe({
  //     next: (data: MetricsMaster[]) => {
  //       this.metricsList = data.map(metrics => {
  //         const matchedProjectType = this.projectTypes.find(
  //           pt => pt.value.projectTypeId
  //         );

  //         return {
  //           ...metrics,
  //           projectTypeName: matchedProjectType ? matchedProjectType.value.projectTypeName : 'Unknown'
  //         };
  //       });
  //     },
  //     error: (err) => {
  //       console.error('Failed to fetch metrics list', err);
  //       this.messageService.add({
  //         severity: 'error',
  //         summary: 'Error',
  //         detail: 'Failed to load metrics list'
  //       });
  //     }
  //   });
  // }

  // Load project types for dropdown
  // loadProjectTypes(): void {
  //         this.projectTypeService.getAllProjectTypeDetails().subscribe({
  //           next: (res: ProjectTypes[]) => {
  //             this.projectTypes = res
  //         .filter(pt => pt.id !== null)
  //         .map(pt => ({
  //           label: pt.projectTypeName,
  //           value: { projectTypeId: pt.id as number, projectTypeName: pt.projectTypeName }
  //         }));

  //       this.isProjectTypesLoaded = true;

  //       this.loadMetricsMasterList();
  //     },
  //     error: (err) => {
  //       console.error('Failed to fetch project types', err);
  //       this.messageService.add({
  //         severity: 'error',
  //         summary: 'Error',
  //         detail: 'Failed to load project types'
  //       });
  //     }
  //   });
  // }

  checkForDuplicates(): void {
    const metricsControl = this.frm.get('metricsName');
    const metricsName = metricsControl?.value?.trim().toLowerCase();

    // Clear previous errors
    metricsControl?.setErrors(null);

    if (!metricsName) {
      return;
    }

    const duplicate = this.metricsList.some((metric) => {
      if (!metric || !metric.metricsName) return false;

      const existingName = metric.metricsName.trim().toLowerCase();

      // In edit mode, skip the current record by ID
      if (this.isEditMode) {
        return existingName === metricsName && metric.id !== this.editMetricsId;
      }

      // In add mode, just check if name exists
      return existingName === metricsName;
    });

    if (duplicate) {
      metricsControl?.setErrors({ duplicate: true });
    }
  }

  // Show dialog for adding new metrics
  showDialog(): void {
    this.frm.reset();
    this.visible = true;
    this.isEditMode = false;
    this.editMetricsId = null;
  }

  // Cancel and close dialog
  cancelAdd(): void {
    this.visible = false;
    this.frm.reset();
    this.isEditMode = false;
    this.editMetricsId = null;
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

  // Save metrics (add or edit)
  // Utility function to convert local date to UTC
  convertToUTC(date: Date): string {
    return new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    ).toISOString();
  }

  onSave(): void {
    // Check if the form is valid, mark all fields as touched to show validation errors
    if (this.frm.invalid) {
      Object.keys(this.frm.controls).forEach((key) => {
        this.frm.get(key)?.markAsTouched();
      });
      return;
    }
    const metricsName = this.frm.value.metricsName?.trim();
    // Check if metricsName is null or empty
    if (!metricsName) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Metrics Name is required.',
      });
      return; // Prevent submission if metricsName is empty
    }

    const selectedProjectType = this.frm.value.projectTypeId;
    const userId: string = this.userId ? this.userId.toString() : '';

    const startDateUTC = this.convertToUTC(this.frm.value.startDate);
    const endDateUTC = this.convertToUTC(this.frm.value.endDate);

    //For Add
    if (!this.isEditMode) {
      const formDataAdd: MetricsMaster = {
        id: null,
        metricsName: transformFirstWordCaps(this.frm.value.metricsName),
        description: this.frm.value.description || null,
        // projectTypeId: 0,
        startDate: startDateUTC,
        endDate: endDateUTC,
        remarks: this.frm.value.remarks || null,
        status: this.frm.value.status,
        createdBy: userId,
      };

      this.metricsMasterService.addMetricsMaster(formDataAdd).subscribe({
        next: () => {
          this.frm.reset();
          this.visible = false;
          this.loadMetricsMasterList();
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Metrics added successfully!',
          });
        },
        error: (err) => {
          console.error('Error adding metrics:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to add metrics',
          });
        },
      });
    } else {
      const formDataEdit: MetricsMaster = {
        id: this.editMetricsId,
        metricsName: transformFirstWordCaps(this.frm.value.metricsName),
        description: this.frm.value.description || null,
        // projectTypeId: 0,
        startDate: startDateUTC,
        endDate: endDateUTC,
        remarks: this.frm.value.remarks || null,
        status: this.frm.value.status,
        active: true,
        modifiedBy: userId,
      };

      this.metricsMasterService.editMetricsMaster(formDataEdit).subscribe({
        next: () => {
          this.visible = false;
          this.frm.reset();
          this.loadMetricsMasterList();
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Metrics updated successfully!',
          });
        },
        error: (err) => {
          console.error('Error updating metrics:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update metrics',
          });
        },
      });
    }
  }

  deleteTask() {
    this.userDetails = JSON.parse(localStorage.getItem('userLogin')!);
    this.userDetails = this.userDetails.data;
    const userId = this.userDetails.user_Id;
    this.recordToDelete.active = false;
    this.recordToDelete.ModifiedBy = userId.toString();
    this.metricsMasterService
      .editMetricsMaster(this.recordToDelete)
      .subscribe((result) => {
        if (result) {
          this.displayDeleteDialog = false;
          this.ngOnInit();
          this.messageService.add({
            severity: 'success',
            detail: 'metric deleted successfully',
          });
        }
      });
  }

  onEditMetrics(id: number): void {
    const metrics = this.metricsList.find((m) => m.id === id);
    if (metrics) {
       if (this.metricNames && this.metricNames.includes(metrics.metricsName)) {
      this.showEditWarningDialog = true;
      return; 
    }
      this.visible = true;
      this.isEditMode = true;
      this.editMetricsId = id;

      // Convert startDate and endDate to Date objects if they are strings
      const startDate = metrics.startDate ? new Date(metrics.startDate) : null;
      const endDate = metrics.endDate ? new Date(metrics.endDate) : null;

      // Find matching project type
      // const matchedProjectType = this.projectTypes.find(
      //   pt => pt.value.projectTypeId === metrics.projectTypeId
      // );

      // Patch form with the data
      this.frm.patchValue({
        metricsName: metrics.metricsName,
        description: metrics.description,
        // projectTypeId: matchedProjectType?.value || null,
        startDate: startDate,
        endDate: endDate,
        remarks: metrics.remarks,
        status: metrics.status,
      });

      // Check for duplicates after loading data into the form
      setTimeout(() => {
        this.checkForDuplicates();
      });
    }
  }

  getStartDate() {
    const startDateValue = this.frm.get('startDate')?.value;
    if (startDateValue && !(startDateValue instanceof Date)) {
      // If it's not a Date, try converting it to a Date
      return new Date(startDateValue);
    }
    return startDateValue || new Date(); // Return the valid date or current date if not set
  }

  confirmDelete(data: any) {
    if (data) {
      this.recordToDelete = { ...data };
      if (this.recordToDelete) {
        const metricNameToDelete = this.recordToDelete.metricsName;
        if (this.metricNames && this.metricNames.includes(metricNameToDelete)) {
          this.showWarningDialog = true;
          this.displayDeleteDialog = false;
          return;
        }
        this.displayDeleteDialog = true;
      }
    }
  }
}
