import { Component} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
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
import { generalMetrics } from '../../models/generalMetrics';
import { GeneralMetricsService } from '../../services/general-metrics.service';

function cannotStartWithNumber(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (value && /^\d/.test(value)) {
    return { startsWithNumber: true };
  }
  return null;
}

@Component({
  selector: 'app-general-metrics',
  standalone: true,
  templateUrl: './general-metrics.component.html',
  styleUrls: ['./general-metrics.component.scss'],
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
export class GeneralMetricsComponent {
  visible: boolean = false;
  selectedGeneralMetric: generalMetrics | null = null;
  frm: FormGroup;
  editFrm: FormGroup;
  generalmetricsList: generalMetrics[] = [];
  isEditMode: boolean = false;
  editGeneralMetricsId: number | null = null;
  userDetails: any;
  userName: string = '';
  userId: string = '';
  generalMetricTypeNameInput = '';
  editDialog: boolean = false;
  recordToDelete: any;
  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private generalMetricService: GeneralMetricsService
  ) {
    this.userDetails = JSON.parse(localStorage.getItem('userLogin')!);
    this.userName = this.userDetails.data.userName;
    this.userId = this.userDetails.data.userId;
    const today = new Date();
    const formattedDate = this.formatDate(today);

    this.frm = this.fb.group({
      id: [null],
      generalMetricsName: ['', [Validators.required, cannotStartWithNumber]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      remarks: [''],
      status: ['', Validators.required],
      createdOn: [formattedDate],
      createdBy: [this.userId],
      active: [true],
    });

    this.editFrm = this.fb.group({
      id: [null],
      generalMetricsName: ['', Validators.required,cannotStartWithNumber],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      remarks: [''],
      status: ['', Validators.required],
      modifiedBy: [''],
      createdBy: [''],
      active: [true],
      description: [''],
    });
  }
  

  ngOnInit(): void {
    this.generalMetricService
      .getGeneralMetricsList()
      .subscribe((response: generalMetrics[]) => {
        this.generalmetricsList = response;
        const seenProjectTypeNames = new Set();
        this.generalmetricsList = response.filter((generalMetric) => {
          const duplicate = seenProjectTypeNames.has(
            generalMetric.generalMetricsName
          );
          seenProjectTypeNames.add(generalMetric.generalMetricsName);
          return !duplicate;
        });
      });
  }

 checkDuplicateName(): void {
  const control = this.frm.get('generalMetricsName');
  const inputValue = control?.value?.trim().toLowerCase();

  if (!control || !inputValue) {
    this.clearDuplicateError(control);
    return;
  }

  const currentId = this.frm.get('id')?.value; // assumes your form includes the 'id' of the metric

  const isDuplicate = this.generalmetricsList.some(item =>
    item.generalMetricsName.trim().toLowerCase() === inputValue &&
    item.id !== currentId // ignore the same item during edit
  );

  const currentErrors = control.errors || {};

  if (isDuplicate) {
    control.setErrors({ ...currentErrors, duplicate: true });
  } else if (currentErrors['duplicate']) {
    this.clearDuplicateError(control);
  }
}

private clearDuplicateError(control: AbstractControl | null): void {
  if (control?.hasError('duplicate')) {
    const { duplicate, ...remainingErrors } = control.errors || {};
    control.setErrors(Object.keys(remainingErrors).length ? remainingErrors : null);
  }
}



  openDialog(isEdit: boolean, data?: generalMetrics) {
    this.isEditMode = isEdit;
    this.visible = true;

    if (isEdit && data) {
      this.frm.patchValue({
        id: data.id,
        generalMetricsName: data.generalMetricsName,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
        remarks: data.remarks,
        status: data.status,
        modifiedBy: this.userId,
        active: true,
        createdBy: data.createdBy,
      });
    } else {
      this.frm.reset({ createdBy: this.userId, active: true });
    }
  }

  // Cancel and close dialog
  cancelAdd(): void {
    this.visible = false;
    this.frm.reset();
    this.isEditMode = false;
  }

  onSaveOrUpdate() {
    if (this.frm.invalid) {
      this.frm.markAllAsTouched();
      this.messageService.add({
        severity: 'error',
        summary: 'Form Invalid',
        detail: 'Fill necessary details!',
      });
      return;
    }

    const generalMetricData = this.frm.value;
    if (this.isEditMode) {
      this.generalMetricService
        .editGeneralMetricsMaster(generalMetricData)
        .subscribe(
          () => {
            this.messageService.add({
              severity: 'success',
              summary: 'General Metric Type Updated.',
            });
            this.ngOnInit();
          },
          (error: unknown) => {
            console.log(error);
            this.messageService.add({
              severity: 'error',
              summary: 'Update Failed',
              detail: 'General Metric Type failed to Update!',
            });
          }
        );
    } else {
      this.generalMetricService
        .addGeneralMetricsMaster(generalMetricData)
        .subscribe(
          () => {
            this.messageService.add({
              severity: 'success',
              summary: 'General Metric type Added!',
            });
            this.ngOnInit();
          },
          (error: string) => {
            console.log(error);
            this.messageService.add({
              severity: 'error',
              summary: 'Save Failed',
              detail: 'General Metric type failed to Add!',
            });
          }
        );
    }

    this.visible = false;
  }
  Status = [
    { label: 'Active', value: 1 },
    { label: 'Inactive', value: 0 },
  ];

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

  addGeneralMetrictype() {
    this.openDialog(false);
    const projectControl = this.frm.get('generalMetricsName');
    projectControl?.enable();
    this.frm.reset();
  }

  clearAddForm() {
    const projectControl = this.frm.get('generalMetricsName');
    projectControl?.reset();
    projectControl?.disable();
    this.frm.reset();
  }

  clearEditForm() {
    const projectControl = this.editFrm.get('generalMetricsName');
    projectControl?.reset();
    projectControl?.disable();
    this.editFrm.reset();
  }

  editGeneralMetricType(id: number) {
    this.generalMetricService
      .getGeneralMetricsById(id)
      .subscribe((response: generalMetrics) => {
        this.openDialog(true, response);
      });
  }

  onClear() {
    this.generalMetricService
      .getGeneralMetricsList()
      .subscribe((response: generalMetrics[]) => {
        this.generalmetricsList = response;
      });
    this.selectedGeneralMetric = null;
  }

  reloadProjects() {
    return new Promise((resolve) => {
      this.generalMetricService.getGeneralMetricsList().subscribe((res) => {
        resolve(res);
      });
    });
  }

  onSave() {
    if (this.frm.valid) {
      this.frm.markAllAsTouched();
      const GeneralMetricTypeData = this.frm.value;
      this.generalMetricService
        .addGeneralMetricsMaster(GeneralMetricTypeData)
        .subscribe(
          () => {
            this.frm.reset();
            this.ngOnInit();
            this.visible = false;
            this.messageService.add({
              severity: 'success',
              summary: 'General Metric type Added!',
            });
          },

          (error: string) => {
            console.log(error);
            this.messageService.add({
              severity: 'error',
              summary: 'General Metric type already exists!',
              detail: 'Try again!',
            });
          }
        );
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Form Invalid',
        detail: 'Fill necessary details!',
      });
    }
  }

  onUpdate(editFrm: FormGroup) {
    if (this.editFrm.valid) {
      this.editFrm.markAllAsTouched();
      const projectTypeData = this.editFrm.value;
      this.generalMetricService
        .editGeneralMetricsMaster(projectTypeData)
        .subscribe(
          () => {
            this.editFrm.reset();
            this.ngOnInit();
            this.editDialog = false;
            this.messageService.add({
              severity: 'success',
              summary: 'General Metric type Updated.',
            });
          },
          (error: unknown) => {
            console.log(error);
            this.messageService.add({
              severity: 'error',
              summary: 'General Metric type already exists!!!',
              detail: 'Try again!!',
            });
          }
        );
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Form Invalid',
        detail: 'Fill necessary details!!!',
      });
    }
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

  displayDeleteDialog: boolean = false;

  confirmDelete(data: any) {
    if (data) {
      this.recordToDelete = { ...data };
      this.displayDeleteDialog = true;
    }
  }

  deleteTask() {
    this.userDetails = JSON.parse(localStorage.getItem('userLogin')!);
    this.userDetails = this.userDetails.data;
    const userId = this.userDetails.user_Id;
    if (this.recordToDelete) {
      this.recordToDelete.active = false;
      this.recordToDelete.ModifiedBy = userId.toString();
      this.generalMetricService
        .editGeneralMetricsMaster(this.recordToDelete)
        .subscribe((result) => {
          if (result) {
            this.displayDeleteDialog = false;
            this.ngOnInit();
            this.messageService.add({
              severity: 'success',
              detail: 'General Metric type deleted successfully.',
            });

            this.ngOnInit();
          }
        });
    }
  }
}
