import { Component, OnInit } from '@angular/core';
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
import { ProjectDetailsService } from '../../services/project-details.service';
import { SortPipe } from '../../../shared/pipes/sort.pipe';
import { TagModule } from 'primeng/tag';
import {
  CamelCaseDirective,
  CaseSensitiveDirective,
  NoInitialSpaceDirective,
} from '../../../shared/components/camel-case.directive';
import { transformFirstWordCaps } from '../../services/inputcasesensitive';


@Component({
  selector: 'app-project-engagement-mode',
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
    MultiSelectModule,
    FormsModule,
    CommonModule,
    SidebarModule,
    CalendarModule,
    ReactiveFormsModule,
    CaseSensitiveDirective,
    TagModule,
  ],
  templateUrl: './project-engagement-mode.component.html',
  styleUrl: './project-engagement-mode.component.scss',
})
export class ProjectEngagementModeComponent {
  visible: boolean = false;
  projectData: any[] = [];
  public selectedPId: number = 0;
  frm: FormGroup;
  editDialog: boolean = false;
  editProjectData: any[] = [];
  originalEngagementMode = '';
  recordToDelete: any;
  userDetails: any;
  userName: string = '';
  userId: string = '';
  projectsData: any;
  modeNames: string[] = [];
  showWarningDialog: boolean = false;
searchValue: any;
isEditMode: boolean = false;
showEditWarningDialog: boolean = false;

  dt: any;
  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private projectService: ProjectDetailsService
  ) {
    this.userDetails = JSON.parse(localStorage.getItem('userLogin')!);
    this.userName = this.userDetails.data.userName;
    this.userId = this.userDetails.data.userId;
    this.frm = this.fb.group({
      projectEngagementMode: ['', Validators.required],
      status: ['', Validators.required],
      remarks: [''],
    });   
  }
  Status = [
    { label: 'Active', value: 1 },
    { label: 'Inactive', value: 0 },
  ];

  ngOnInit() {
    this.getGridData();
    this.allProjectDetails();
  }

  allProjectDetails() {
  this.projectService.getAllProjectDetails()
    .subscribe((response: any) => {
        this.projectsData = response;
      this.modeNames = this.projectsData
        .map((item: any) => item.modeName)
        .flat();
      });
}

  getGridData() {
    this.projectService.getAllEngagementMode().subscribe((response: any) => {
      this.projectData = response;
    });
  }
  showDialog() {
  this.isEditMode = false; // Set mode to Add
  this.frm?.reset();       // Clear form
  this.visible = true;     // Open dialog
}

  cancelEdit() {
    this.editDialog = false;
    this.frm?.reset();
  }
  onProjectExist(event: any) {
    this.getGridData();
    const control = this.frm.get('projectEngagementMode');
    const enteredValue = event.target.value?.trim();

    if (enteredValue) {
      const modeExist = this.projectData.find(
        (data) =>
          data.projectEngagementMode?.toLowerCase() ===
          enteredValue.toLowerCase()
      );

      if (modeExist) {
        control?.setErrors({
          ...control.errors, // preserve existing errors
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

  onEditProjectExist(event: any) {
    this.getGridData();
    const control = this.frm.get('projectEngagementMode');
    const enteredValue = event.target.value?.trim().toLowerCase();

    if (!enteredValue) return;

    const isDuplicate = this.projectData.some(
      (data) =>
        data.projectEngagementMode?.toLowerCase() === enteredValue &&
        enteredValue !== this.originalEngagementMode // skip current value
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

  filterTable() {
    this.dt.filterGlobal(this.searchValue, 'contains');
  }

  
  editProject(id: number) {
  this.selectedPId = id;
  this.projectService.getEngagmentModeById(id).subscribe((response: any) => {
       if (this.modeNames && this.modeNames.includes(response.projectEngagementMode)) {
        this.showEditWarningDialog = true;
          return;
        }
         this.isEditMode = true;
  this.visible = true;
    this.frm.patchValue({
      id: response.id,
      projectEngagementMode: response.projectEngagementMode,
      status: response.status,
      remarks: response.remarks || null,
    });
  });
}

  onSaveOrUpdate() {
  if (this.frm.invalid) {
    this.messageService.add({
      severity: 'error',
      summary: 'Form Invalid',
      detail: 'Fill necessary details!!!',
    });
    return;
  }

  const formData = this.frm.value;
  formData.projectEngagementMode = transformFirstWordCaps(formData.projectEngagementMode);

  if (this.isEditMode) {
    // Update logic
    const data = {
      id: this.selectedPId,
      projectEngagementMode: transformFirstWordCaps(formData.projectEngagementMode),
      remarks: formData.remarks,
      status: formData.status,
      active:true
    };
    this.projectService.editEngagementMode(data).subscribe(() => {
      this.frm.reset();
      this.getGridData();
      this.visible = false;
      this.messageService.add({
        severity: 'success',
        summary: 'Engagement Mode Updated',
      });
    });
  } else {
    // Add logic
    this.projectService.addEngagmentMode(formData).subscribe(() => {
      this.getGridData();
      this.messageService.add({
        severity: 'success',
        summary: 'Engagement Mode Added!',
      });
      this.visible = false;
      this.frm.reset();
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

  displayDeleteDialog: boolean = false;

   confirmDelete(data: any) {
    if (data) {
      this.recordToDelete = { ...data };
      if (this.recordToDelete) {
        const projectNameToDelete = this.recordToDelete.projectEngagementMode;
        if (this.modeNames && this.modeNames.includes(projectNameToDelete)) {
          this.showWarningDialog = true;
          this.displayDeleteDialog = false;
          return;
        }
        this.displayDeleteDialog = true;
      }
    }
  }

  deleteTask() {
    this.userDetails = JSON.parse(localStorage.getItem('userLogin')!);
    this.userDetails = this.userDetails.data;
    const userId = this.userDetails.user_Id;
    if (this.recordToDelete) {
      this.recordToDelete.active = false;
      this.recordToDelete.ModifiedBy = userId.toString();
      this.projectService
        .editEngagementMode(this.recordToDelete)
        .subscribe((result) => {
          if (result) {
            this.displayDeleteDialog = false;
            this.ngOnInit();
            this.messageService.add({
              severity: 'success',
              detail: 'Engagement Mode Deleted.',
            });

            this.ngOnInit();
          }
        });
    }
  }

  openAddDialog() {
  this.frm.reset();
  this.isEditMode = false;
  this.visible = true;
}
}
