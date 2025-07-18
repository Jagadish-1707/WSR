/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from '@angular/core';
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
import { ProjectTypes } from '../../models/projectType';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { HttpClientModule } from '@angular/common/http';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FileUploadModule } from 'primeng/fileupload';
import { MessageService } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';
import { CardModule } from 'primeng/card';
import { TooltipModule } from 'primeng/tooltip';
import { ProjectTypeService } from '../../services/project-type.service';
import { TagModule } from 'primeng/tag';
import { TaskService } from '../../services/task.service';
import { transformFirstWordCaps } from '../../services/inputcasesensitive';

function cannotStartWithNumber(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (value && /^\d/.test(value)) {
    return { startsWithNumber: true };
  }
  return null;
}

@Component({
  selector: 'app-project-type',
  standalone: true,
  templateUrl: './project-type.component.html',
  styleUrl: './project-type.component.scss',
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
    TagModule,
    TooltipModule,
  ],
})
export class ProjectTypeComponent {
  projectType: ProjectTypes[] = [];
  editProjectData!: ProjectTypes;
  selectedProject: ProjectTypes | null = null;
  visible: boolean = false;
  frm: FormGroup;
  editFrm: FormGroup;
  userDetails: any;
  userName: string = '';
  userId: string = '';
  projecttypename: string = '';
  editDialog: boolean = false;
  filteredProjectTypeNames: ProjectTypes[] = [];
  minDate: any;
  recordToDelete: any;
  projectTypeNameInput = '';
  isEditMode: boolean = false;
  projTypeName: any;
  projectTypeNames: string[] = [];
  showWarningDialog: boolean = false;
  searchValue: any;
  dt: any;
  showEditWarningDialog: boolean = false;
  constructor(
    private fb: FormBuilder,
    private projectTypeService: ProjectTypeService,
    private messageService: MessageService,
    private taskService: TaskService
  ) {
    this.userDetails = JSON.parse(localStorage.getItem('userLogin')!);
    this.userName = this.userDetails.data.userName;
    this.userId = this.userDetails.data.userId;
    const today = new Date();
    const formattedDate = this.formatDate(today);

    this.frm = this.fb.group({
      id: [null],
      projecttypename: ['', [Validators.required, cannotStartWithNumber]],
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
      projecttypename: ['', Validators.required, cannotStartWithNumber],
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
    this.projectTypeService
      .getAllProjectTypeDetails()
      .subscribe((response: ProjectTypes[]) => {
        this.projectType = response;
        const seenProjectTypeNames = new Set();
        this.filteredProjectTypeNames = response.filter((project) => {
          const duplicate = seenProjectTypeNames.has(project.projectTypeName);
          seenProjectTypeNames.add(project.projectTypeName);
          return !duplicate;
        });
      });
    this.getAllTasks();
  }

 onDateSelect(event: any, controlName: string) {
  if (event) {
    const selectedDate = new Date(event);
    selectedDate.setHours(12, 0, 0, 0);
    this.frm.get(controlName)?.setValue(selectedDate);
    if (this.editFrm) {
      this.editFrm.get(controlName)?.setValue(selectedDate);
    }
  }
}

onStartDateSelect(event: any) {
  if (event) {
    const selectedDate = new Date(event);
    selectedDate.setHours(12, 0, 0, 0);
    this.frm.get('startDate')?.setValue(selectedDate);
    
    if (this.editFrm) {
      this.editFrm.get('startDate')?.setValue(selectedDate);
    }
  }
}
// onEndDateSelect(event: any) {
//   if (event) {
//     const selectedDate = new Date(event);
//     selectedDate.setHours(12, 0, 0, 0);
//     this.frm.get('endDate')?.setValue(selectedDate);
    
//     if (this.editFrm) {
//       this.editFrm.get('endDate')?.setValue(selectedDate);
//     }
//   }
// }
  getAllTasks() {
    this.taskService.getAllTasks().subscribe((response: any) => {
      this.projTypeName = response;
      this.projectTypeNames = this.projTypeName
        .map((item: any) => item.projectType)
        .flat();
    });
  }

  checkDuplicateName(): void {
    const control = this.frm.get('projecttypename');
    const inputValue = control?.value?.trim().toLowerCase();

    if (!control || !inputValue) {
      this.clearDuplicateError(control);
      return;
    }

    const currentId = this.frm.get('id')?.value; // ID in form if editing

    const isDuplicate = this.projectType.some(
      (item) =>
        item.projectTypeName.trim().toLowerCase() === inputValue &&
        item.id !== currentId // ignore current record during edit
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
      control.setErrors(
        Object.keys(remainingErrors).length ? remainingErrors : null
      );
    }
  }

  openDialog(isEdit: boolean, data?: ProjectTypes) {
    this.isEditMode = isEdit;
    this.visible = true;
    if (isEdit && data) {
      this.frm.patchValue({
        id: data.id,
        projecttypename: data.projectTypeName,
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

    const projectTypeData = this.frm.value;
    projectTypeData.projecttypename = transformFirstWordCaps(projectTypeData.projecttypename);
    if (this.isEditMode) {
      this.projectTypeService.editProjectTypeDetails(projectTypeData).subscribe(
        () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Project Type updated.',
          });
          this.ngOnInit();
        },
        (error: unknown) => {
          console.log(error);
          this.messageService.add({
            severity: 'error',
            summary: 'Update Failed',
            detail: 'Project Type failed to update!',
          });
        }
      );
    } else {
      this.projectTypeService.addProjectTypeDetails(projectTypeData).subscribe(
        () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Project Type Added!',
          });
          this.ngOnInit();
        },
        (error: string) => {
          console.log(error);
          this.messageService.add({
            severity: 'error',
            summary: 'Save Failed',
            detail: 'Project Type failed to Add!',
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

  addProjecttype() {
    this.openDialog(false);
    const projectControl = this.frm.get('projecttypename');
    projectControl?.enable();
    this.frm.reset();
  }

  clearAddForm() {
    const projectControl = this.frm.get('projecttypename');
    projectControl?.reset();
    projectControl?.disable();
    this.frm.reset();
  }

  clearEditForm() {
    const projectControl = this.editFrm.get('projecttypename');
    projectControl?.reset();
    projectControl?.disable();
    this.editFrm.reset();
  }

  editProjectType(id: number) {
     if (this.projectTypeNames  && this.projectTypeNames) {
    this.showWarningDialog = true;
    return; 
  }
    this.projectTypeService
      .getProjectTypeDetailsById(id)
      .subscribe((response: ProjectTypes) => {
        this.openDialog(true, response);
      });
  }

  onClear() {
    this.projectTypeService
      .getAllProjectTypeDetails()
      .subscribe((response: ProjectTypes[]) => {
        this.filteredProjectTypeNames = response;
      });
    this.selectedProject = null;
  }

  reloadProjects() {
    return new Promise((resolve) => {
      this.projectTypeService.getAllProjectTypeDetails().subscribe((res) => {
        resolve(res);
      });
    });
  }

  /*onSave() {
    if (this.frm.valid) {
      this.frm.markAllAsTouched();
      const projectTypeData = this.frm.value;
      console.log("data", projectTypeData);
      projectTypeData.projecttypename = transformFirstWordCaps(projectTypeData.projecttypename);
      this.projectTypeService.addProjectTypeDetails(projectTypeData).subscribe(
        () => {
          this.frm.reset();
          this.ngOnInit();
          this.visible = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Project Type Added!',
          });
        },

        (error: string) => {
          console.log(error);
          this.messageService.add({
            severity: 'error',
            summary: 'Project type already exists!',
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
  }*/

  /*onUpdate(editFrm: FormGroup) {
    if (this.editFrm.valid) {
      this.editFrm.markAllAsTouched();
      const projectTypeData = this.editFrm.value;
     
      this.projectTypeService.editProjectTypeDetails(projectTypeData).subscribe(
        () => {
          this.editFrm.reset();
          this.ngOnInit();
          this.editDialog = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Project type Updated.',
          });
        },
        (error: unknown) => {
          console.log(error);
          this.messageService.add({
            severity: 'error',
            summary: 'Project type already exists!!!',
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
  }*/

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
      if (this.recordToDelete) {
        const projecttypeToDelete = this.recordToDelete.id;
        if (this.projectTypeNames && this.projectTypeNames.includes(projecttypeToDelete)) {
          this.showWarningDialog = true;
          this.displayDeleteDialog = false;
          return;
        }
        this.displayDeleteDialog = true;
      }
    }
  }

  filterTable() {
    this.dt.filterGlobal(this.searchValue, 'contains');
  }

  deleteTask() {
    this.userDetails = JSON.parse(localStorage.getItem('userLogin')!);
    this.userDetails = this.userDetails.data;
    const userId = this.userDetails.user_Id;
    if (this.recordToDelete) {
      this.recordToDelete.active = false;
      this.recordToDelete.ModifiedBy = userId.toString();
      this.projectTypeService
        .editProjectTypeDetails(this.recordToDelete)
        .subscribe((result) => {
          if (result) {
            this.displayDeleteDialog = false;
            this.ngOnInit();
            this.messageService.add({
              severity: 'success',
              detail: 'Project type deleted successfully.',
            });

            this.ngOnInit();
          }
        });
    }
  }
}
