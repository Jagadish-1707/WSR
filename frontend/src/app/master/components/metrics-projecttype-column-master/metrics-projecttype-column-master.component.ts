import { Component } from '@angular/core';
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
import { MessageService } from 'primeng/api';
import { SortPipe } from '../../../shared/pipes/sort.pipe';
import { TagModule } from 'primeng/tag';
import {
  CamelCaseDirective,
  CaseSensitiveDirective,
  NoInitialSpaceDirective,
} from '../../../shared/components/camel-case.directive';
import { MetricsService } from '../../services/metrics.service';
import { transformFirstWordCaps } from '../../services/inputcasesensitive';
import { InputTextareaModule } from 'primeng/inputtextarea';

@Component({
  selector: 'app-metrics-projecttype-column-master',
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
    InputTextareaModule,
    InputGroupModule,
    MultiSelectModule,
    FormsModule,
    CommonModule,
    SidebarModule,
    CalendarModule,
    ReactiveFormsModule,
    
    TagModule,
  ],
  templateUrl: './metrics-projecttype-column-master.component.html',
  styleUrl: './metrics-projecttype-column-master.component.scss',
})
export class MetricsProjecttypeColumnMasterComponent {
  visible: boolean = false;
  projectData: any[] = [];
  isEditMode: boolean = false;
  public selectedPId: number = 0;
  frm: FormGroup;
  editProjectData: any[] = [];
  actualfieldName: string = '';
  actualorder : number =0;
  recordToDelete: any;
  userDetails: any;
  userName: string = '';
  userId: string = '';
  selectedFieldType: string | null = null;
  status: any = [];
  fieldData: any;
  fieldNames: string[] = [];
  showWarningDialog: boolean = false;
   displayDeleteDialog: boolean = false;
    searchValue: any;
  dt: any;
  showEditWarningDialog: boolean = false;
  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private metricsService: MetricsService
  ) {
    this.userDetails = JSON.parse(localStorage.getItem('userLogin')!);
    this.userName = this.userDetails.data.userName;
    this.userId = this.userDetails.data.userId;
    this.status = [
      { label: 'Active', value: 1 },
      { label: 'Inactive', value: 0 },
    ];

    this.frm = this.fb.group({
      id: [''],
      fieldName: ['', Validators.required],
      status: [1, Validators.required],
      fieldType: ['', Validators.required],
      orderBy: ['', Validators.required],
      active: [true],
      dropdownValues: [''],
    });  
  }

  fieldTypeOptions = [
    { label: 'Text', value: 'text' },
    { label: 'Dropdown', value: 'dropdown' },
    { label: 'Date', value: 'date' },
    { label: 'Textarea', value: 'textarea' },
  ];

  ngOnInit() {
    this.getGridData();
    this.getMastercolumnData();

    this.frm.get('fieldName')?.valueChanges.subscribe(() => {
      this.validateFieldNameTypeCombo();
    });

    this.frm.get('fieldType')?.valueChanges.subscribe(() => {
      this.validateFieldNameTypeCombo();
});
  }

  filterTable() {
    this.dt.filterGlobal(this.searchValue, 'contains');
  }

  getGridData() {
    this.metricsService
      .getAllMetricProjectColumns()
      .subscribe((response: any) => {
        this.projectData = response;
        console.log("Grid=>",this.projectData);
        
      });
  }

  getMastercolumnData() {
  this.metricsService.getMetricsColumnList().subscribe((response: any) => {
    this.fieldData = response;
    this.fieldNames = this.fieldData.flatMap((item: any) => 
      item.selectedCheckBoxIdsName.map((checkbox: any) => checkbox.fieldName)
    );
  });
}

  showDialog() {
    this.isEditMode = false;
    this.visible = true;
    this.selectedFieldType = '';
    this.frm.reset();
    this.frm.patchValue({
      status: 1,
      active: true
    });
}

  cancelEdit() {
    this.visible = false;
    this.frm?.reset();
    this.frm.patchValue({
      status: 1,
      active: true,
    });
  }

  validateFieldNameTypeCombo(): void {
  const nameCtrl = this.frm.get('fieldName');
  const typeCtrl = this.frm.get('fieldType');

  const fieldName = nameCtrl?.value;
  const fieldType = typeCtrl?.value;

  if (fieldName && fieldType) {
    const isDuplicate = this.checkDuplicateField(fieldName, fieldType, this.frm.get('id')?.value);
    if (isDuplicate) {
      nameCtrl?.setErrors({ duplicateCombo: true });
    } else {
      // Clean only 'duplicateCombo' error
      const errors = nameCtrl?.errors;
      if (errors?.['duplicateCombo']) {
        delete errors['duplicateCombo'];
        if (Object.keys(errors).length === 0) {
          nameCtrl?.setErrors(null);
        } else {
          nameCtrl?.setErrors(errors);
        }
      }
    }
  }
}


  checkDuplicateField(fieldName: string, fieldType: string | { label: string; value: string }, currentId?: number): boolean {
  const normalizedFieldName = fieldName?.trim().toLowerCase();

  // Safely extract string value from fieldType
  const rawFieldType = typeof fieldType === 'string' ? fieldType : fieldType?.value;
  const normalizedFieldType = rawFieldType?.trim().toLowerCase();

  return this.projectData?.some(item =>
    item.fieldName?.trim().toLowerCase() === normalizedFieldName &&
    item.fieldType?.trim().toLowerCase() === normalizedFieldType &&
    item.id !== currentId
  );
}




  //Order Exist
   onOrderExist(event: any) {
    this.getGridData();
    const control = this.frm.get('orderBy');
    const enteredValue = event.target.value;

    if (enteredValue) {
      const modeExist = this.projectData.find(
        (data) => data.orderBy === enteredValue
      );

      if (modeExist) {
        control?.setErrors({
          ...control.errors,
          alreadyExists: true,
        });
      } else {
        if (control?.errors) {
          delete control.errors['alreadyExists']; // remove only this error
          if (Object.keys(control.errors).length === 0) {
            control.setErrors(null); // no more errors
          } else {
            control.setErrors(control.errors); // keep other errors intact
          }
        }
      }
    }
  }

  onEditOrderExist(event: any) {
    this.getGridData();
    const control = this.frm.get('orderBy');
    const enteredValue = event.target.value;

    if (!enteredValue) return;

    const isDuplicate = this.projectData.some(
      (data) =>
        data.orderBy === enteredValue &&
        enteredValue !== this.actualorder
    );

    if (isDuplicate) {
      control?.setErrors({
        ...control.errors,
        alreadyExists: true,
      });
    } else {
      if (control?.errors) {
        delete control.errors['alreadyExists'];
        if (Object.keys(control.errors).length === 0) {
          control.setErrors(null);
        } else {
          control.setErrors(control.errors);
        }
      }
    }
  }


  onSaveOrUpdate() {
  if (this.frm.invalid) {
    this.messageService.add({
      severity: 'error',
      summary: 'Form Invalid',
      detail: 'Fill necessary details.',
    });
    return;
  }

  const formValue = this.frm.value;
  const payload = {
    id: formValue.id,
    fieldName: transformFirstWordCaps(formValue.fieldName),
    status: formValue.status,
    orderBy: formValue.orderBy,
    fieldType: formValue.fieldType?.value || formValue.fieldType,
    dropdownValues: formValue.dropdownValues || null,
    active: true
  };

  if (this.isEditMode) {
    this.metricsService.editMetricProjectColumns(payload).subscribe(() => {
      this.visible = false;
      this.frm.reset();
      this.getGridData();
      this.messageService.add({
        severity: 'success',
        summary: 'Field Updated!',
      });
    });
  } else {
    this.metricsService.addMetricProjectColumns(payload).subscribe(() => {
      this.visible = false;
      this.frm.reset();
      this.getGridData();
      this.messageService.add({
        severity: 'success',
        summary: 'Field Type Added!',
      });
    });
  }
}

  
  editProject(id: number) {
  this.selectedPId = id;
   this.metricsService.getMetricProjectColumnsById(id).subscribe((response: any) => {
        if (this.fieldNames && this.fieldNames.includes(response.fieldName)) {
      this.showEditWarningDialog = true;
      return; 
    }

  this.isEditMode = true;
  this.visible = true;
    const fieldType = response.fieldType?.toLowerCase();
    this.selectedFieldType = fieldType;
    const matchedFieldType =
      this.fieldTypeOptions.find(opt => opt.value === fieldType) || null;

    this.frm.patchValue({
      id: response.id,
      fieldName: response.fieldName,
      status: response.status,
      orderBy : response.orderBy,
      fieldType: matchedFieldType,
      dropdownValues: response.dropdownValues || '',
    });
  });
}



  onFieldTypeChange(event: any, formType: 'add' | 'edit') {
    const selectedValue = event?.value;

    if (selectedValue) {
      if (formType === 'add') {
        this.frm.get('fieldType')?.setValue(selectedValue);
        this.selectedFieldType = selectedValue.value;

        const dropdownCtrl = this.frm.get('dropdownValues');

        if (selectedValue.value === 'dropdown') {
          dropdownCtrl?.setValidators([Validators.required]);
        } else {
          dropdownCtrl?.clearValidators();
          dropdownCtrl?.setValue(null);
        }
        dropdownCtrl?.updateValueAndValidity();
      }

      if (formType === 'edit') {
        this.frm.get('fieldType')?.setValue(selectedValue);
        this.selectedFieldType = selectedValue.value;

        const dropdownCtrl = this.frm.get('dropdownValues');

        if (selectedValue.value === 'dropdown') {
          dropdownCtrl?.setValidators([Validators.required]);
        } else {
          dropdownCtrl?.clearValidators();
          dropdownCtrl?.setValue(null);
        }
        dropdownCtrl?.updateValueAndValidity();
      }
    } else {
      console.warn('Dropdown selection is missing or invalid', event);
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
        const metricNameToDelete = this.recordToDelete.fieldName;
        if (this.fieldNames && this.fieldNames.includes(metricNameToDelete)) {
          this.showWarningDialog = true;
          this.displayDeleteDialog = false;
          return;
        }
        this.displayDeleteDialog = true;
      }
    }
  }

  deleteProjectColumn() {
    this.userDetails = JSON.parse(localStorage.getItem('userLogin')!);
    this.userDetails = this.userDetails.data;
    const userId = this.userDetails.user_Id;
    if (this.recordToDelete) {
      this.recordToDelete.active = false;
      this.metricsService
        .editMetricProjectColumns(this.recordToDelete)
        .subscribe((result) => {
          if (result) {
            this.displayDeleteDialog = false;
            this.ngOnInit();
            this.messageService.add({
              severity: 'success',
              detail: 'Metrics Column deleted successfully.',
            });

            this.ngOnInit();
          }
        });
    }
  }
}
