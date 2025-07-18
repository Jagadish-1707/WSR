import { Component, OnInit, ViewChild } from '@angular/core';
import { CheckboxModule } from 'primeng/checkbox';
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
import { CardModule } from 'primeng/card';
import { TooltipModule } from 'primeng/tooltip';

import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
  ReactiveFormsModule,
  FormArray,
  AbstractControl,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SidebarModule } from 'primeng/sidebar';
import { CalendarModule } from 'primeng/calendar';
import { MessageService } from 'primeng/api';
import { TagModule } from 'primeng/tag';
import { MetricsService } from '../../services/metrics.service';
import { MetricsMasterService } from '../../services/metrics-master.service';
import { MetricsMaster } from '../../models/metricsMaster';
import { ProjectDetailsService } from '../../services/project-details.service';
import { TaskService } from '../../services/task.service';
import { SelectionDto, SelectionFieldDto } from '../../models/metricscolumnselection';
import { Task } from '../../models/task';
import { ChangeDetectorRef } from '@angular/core';
import { InputSwitchModule } from 'primeng/inputswitch'; 
import { Checkbox } from 'primeng/checkbox';
import { SortPipe } from '../../../shared/pipes/sort.pipe';
@Component({
  selector: 'app-metrics-projecttype-column-view',
  standalone: true,
  imports: [CardModule,
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
    CheckboxModule,
    TooltipModule,
    TagModule,InputSwitchModule,CheckboxModule,FormsModule,SortPipe,
  ],
  templateUrl: './metrics-projecttype-column-view.component.html',
  styleUrl: './metrics-projecttype-column-view.component.scss',
})
export class MetricsProjecttypeColumnViewComponent {
  visible: boolean = false;
  projectData: any[] = [];
  public selectedPId: number = 0;
  frm: FormGroup;
  editProjectData: any[] = [];
  masterColumnData: any[] = [];
  selectedMetrics: number[] = [];
  selectAllValue: boolean = false;
  MetricseOptions: any[] = [];
  btnlabel: string = '';
  HeaderName: string = '';
  metricsMaster: MetricsMaster[] = [];
  ProjectOptions: Task[] = [];
  projectType: string = '';
  isSelectAllChecked: boolean = false;
  selectedFields: { fieldColumnId: number, isMandatory: boolean }[] = [];
  recordToDelete: any;
  userDetails: any;
  userName: string = '';
  userId: string = '';
  selectAllIndeterminate: boolean = false;
  @ViewChild('selectAllCheckbox') selectAllCheckboxRef!: Checkbox;
  duplicateProjectError: boolean = false;
  isEditMode: boolean = false;
  selectedProjectId:number=0;
  selectedprojectdialog : string ='';
  displayEmpDialog: boolean = false;
  displayMetricsDialog: boolean = false;
  selectedMetricsName: any[] = [];
  selectedFieldsName: any[] = [];
projectTypeDropdownList: { label: string; value: number }[] = [];

  selectedProjectName!: Task | null;
  selectedProjectType!: any;
  filterProjectNames: Task[] = [];
  projectName: string = '';
  
  
  constructor(private fb: FormBuilder, private messageService: MessageService, private metricsMasterService: MetricsMasterService,
    private cdr: ChangeDetectorRef ,private projectDetailsService: ProjectDetailsService, public taskService: TaskService, private metricsService: MetricsService,) {
          this.userDetails = JSON.parse(localStorage.getItem('userLogin')!);
    this.userName = this.userDetails.data.userName;
    this.userId = this.userDetails.data.userId;
    this.frm = this.fb.group({
      projectId: ['', Validators.required],
      projectTypeId: ['', Validators.required],
      metricsIds: [[], Validators.required],
      selectedFields: this.fb.array([]) 
    });
  }

  ngOnInit() {
    this.getGridData();
    this.getMasterColums();
    this.getProject();    
  }

  filterTaskData() {
    if (this.selectedProjectName && this.selectedProjectType) {
      this.projectData = this.filterProjectNames.filter(
        (task) =>
          task.projectName == this.selectedProjectName?.projectName &&
          task.projectTypeName == this.selectedProjectType.label
      );
    } else if (this.selectedProjectName) {
      // Filter only by projectName
      this.projectData = this.filterProjectNames.filter(
        (task) => task.projectName == this.selectedProjectName?.projectName
      );
      // this.projectData = this.filterProjectNames;
    } else if (this.selectedProjectType) {
      console.log("filterProjectNames",this.filterProjectNames);
      this.projectData = this.filterProjectNames.filter(
        (task) =>
          task.projectTypeName == this.selectedProjectType.label 
      );
      // this.projectData = this.filterProjectNames;
    } else {
      // If neither is selected, show all tasks
      this.filterProjectNames = [...this.projectData];
    }
console.log("projectData",this.projectData);
  }

  
  onClear() {
    this.metricsService.getMetricsColumnList().subscribe((response: Task[]) => {
      this.projectData = response;
      this.filterProjectNames = this.projectData;
    });
    this.selectedProjectType = '';
    this.selectedProjectName = null;
  }

  updateSelectAllFromFormChanges(values: any[]): void {
  const totalCount = values.length;
  const selectedCount = values.filter(val => val.isSelected === true).length;
  
  const newSelectAllValue = totalCount > 0 && selectedCount === totalCount;
  
  if (this.selectAllValue !== newSelectAllValue) {
    this.selectAllValue = newSelectAllValue;
    console.log('Updated selectAllValue via subscription:', this.selectAllValue);
    this.cdr.detectChanges();
  }
}

  initializeSelectedFieldsArray() {
  const formArray = this.fb.array([]);
  
  this.masterColumnData.forEach(metric => {
    const formGroup = this.fb.group({
      id: [metric.id],
      fieldName: [metric.fieldName],
      isSelected: [false],
      isMandatory: [false]
    });
    
    // Since isSelected is false initially, disable the isMandatory control
    formGroup.get('isMandatory')?.disable();
    
    (formArray as FormArray).push(formGroup);
  });

  this.frm.setControl('selectedFields', formArray);
}

  showDialog(Id: any) {
    this.visible = true;
    if (Id > 0) {
      this.EditColumn(Id);
      this.HeaderName = 'Edit Columns for Metrics';
      this.btnlabel = 'UPDATE';
    } else {
      this.frm?.reset();
      this.initializeSelectedFieldsArray();
      this.HeaderName = "Add Fields for Project";
      this.btnlabel = "SAVE";
    }
    this.cdr.detectChanges();
  }

  
  
  // Updated method - changed event.value to event.checked for InputSwitch
  onMandatotyCheckboxChange(event: any, metric: any): void {
  const index = this.masterColumnData.findIndex(m => m.id === metric.id);
  const control = this.selectedFieldsArray.at(index) as FormGroup;

  // Only allow this to execute if the checkbox is selected
  if (control.get('isSelected')?.value) {
    control.patchValue({ isMandatory: event.checked });
  }
}

  getFieldFormGroup(index: number): FormGroup {
    return this.selectedFieldsArray.at(index) as FormGroup;
  }

  populateFormForEdit(data: any) {
    // Example of how to populate form for edit mode
    this.selectedFieldsArray.controls.forEach((control, index) => {
      const formGroup = control as FormGroup;
      const metric = this.masterColumnData[index];
      
      // Check if this field was previously selected
      const existingField = data.selectedFields?.find((f: any) => f.fieldColumnId === metric.id);
      
      if (existingField) {
        formGroup.patchValue({
          isSelected: true,
          isMandatory: existingField.isMandatory || true // Set to true for edit mode
        });
      }
    });
  }

  onCheckboxChange(event: any, metric: any, rowIndex: number): void {
  
  // Use rowIndex directly - more reliable than finding by ID
  const control = this.selectedFieldsArray.at(rowIndex) as FormGroup;
  console.log('Control before update:', control.value);

  // Update the form control
  control.patchValue({ isSelected: event.checked });

  if (!event.checked) {
    control.patchValue({ isMandatory: false });
  }
  // Update select all state
  //this.updateSelectAllState();

  this.updateSelectAllCheckbox();
}


updateSelectAllCheckbox(): void {
  console.log('=== updateSelectAllCheckbox ===');
  
  const controls = this.selectedFieldsArray.controls;
  const totalControls = controls.length;
  
  if (totalControls === 0) {
    this.selectAllValue = false;
    return;
  }

  const selectedCount = controls.filter((control: AbstractControl) => {
    const formGroup = control as FormGroup;
    return formGroup.get('isSelected')?.value === true;
  }).length;

  console.log('Total controls:', totalControls);
  console.log('Selected count:', selectedCount);
  console.log('Current selectAllValue:', this.selectAllValue);

  const newSelectAllValue = selectedCount === totalControls;
  
  if (this.selectAllValue !== newSelectAllValue) {
    this.selectAllValue = newSelectAllValue;
    console.log('New selectAllValue:', this.selectAllValue);

    // FIXED: Use writeValue instead of checked property
    if (this.selectAllCheckboxRef) {
      this.selectAllCheckboxRef.writeValue(this.selectAllValue);
      console.log('Updated PrimeNG checkbox using writeValue');
    }

    this.cdr.detectChanges();
  }
}

onSelectAllChange(event: any): void {
  console.log('=== onSelectAllChange ===');
  console.log('Select all event checked:', event.checked);
  
  // Update all form controls
  this.selectedFieldsArray.controls.forEach((control: AbstractControl) => {
    const formGroup = control as FormGroup;
    
    formGroup.patchValue({ 
      isSelected: event.checked,
      isMandatory: event.checked ? formGroup.get('isMandatory')?.value : false
    });
  });
  
  // Update the selectAllValue
  this.selectAllValue = event.checked;
  console.log('Updated selectAllValue to:', this.selectAllValue);
  
  // Trigger change detection
  this.cdr.detectChanges();
}


updateSelectAllState(): void {
  console.log('=== updateSelectAllState ===');
  
  const controls = this.selectedFieldsArray.controls;
  const totalControls = controls.length;
  
  if (totalControls === 0) {
    this.selectAllValue = false;
    return;
  }

  const selectedCount = controls.filter((control: AbstractControl) => {
    const formGroup = control as FormGroup;
    const isSelected = formGroup.get('isSelected')?.value;
    return isSelected === true;
  }).length;

  console.log('Total controls:', totalControls);
  console.log('Selected count:', selectedCount);
  console.log('Current selectAllValue:', this.selectAllValue);

  // Update selectAllValue
  const newSelectAllValue = selectedCount === totalControls;
  
  if (this.selectAllValue !== newSelectAllValue) {
    this.selectAllValue = newSelectAllValue;
    console.log('Updated selectAllValue to:', this.selectAllValue);
    
    // Trigger change detection
    this.cdr.detectChanges();
  }
}

  EditColumn(id: number): void {
    this.isEditMode = true;
    this.selectedPId = id;
const selectedProject = this.projectData.find(project => project.id === this.selectedPId);

  // Check if the selected project exists
  if (selectedProject) {
    this.selectedProjectId = selectedProject.projectId; // Assign the projectId
  } else {
    console.error('Project not found for selectedPId:', this.selectedPId);
  }    this.visible = true;
    if (this.masterColumnData.length === 0) {
      this.metricsService.getAllMetricProjectColumns().subscribe((masterResponse: any) => {
        this.masterColumnData = masterResponse.filter((item: any) => item.status == 1 && item.editable == 'Yes');
        this.setFieldControls();
        this.fetchAndPatchSelection(id);
      });
    } else {
      this.fetchAndPatchSelection(id);
    }
  }
  private fetchAndPatchSelection(id: number): void {
    this.metricsService.getMetricsColumnById(id).subscribe((data: SelectionDto) => {
      
      this.metricsService.getTaskMetricsByProjectId(data.projectId).toPromise().then((metricsData: any[]) => {
        this.metricsMaster = metricsData; // Populate the metrics options for the dropdown
        console.log("=>",this.metricsMaster);
        
        //this.selectedProjectId = metricsData.id;
        if (metricsData && metricsData.length > 0) {
          this.projectType = metricsData[0].projectTypeName;
        } else {
          this.projectType = '';
        }
      }).catch(err => {
        console.error('Error loading project metrics:', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load project metrics.' });
      });

      // 4. Now that metricsMaster is populated, patch the selected metrics IDs
      this.frm.get('metricsIds')?.patchValue(data.metricsIDs);


      this.frm.patchValue({
        projectId: data.projectId,
        projectTypeId: data.projectTypeId,
        metricsIDs: data.metricsIDs // Ensure this matches the form control name
      });


      this.selectedFieldsArray.controls.forEach((control: AbstractControl) => {
        if (control instanceof FormGroup) {
          const fieldColumnId = control.get('fieldColumnId')?.value;

          const foundSelectedField = data.selectedCheckBoxIds.find(
            (selectedField: SelectionFieldDto) => selectedField.fieldColumnId === fieldColumnId
          );

          if (foundSelectedField) {
            control.patchValue({
              isSelected: true,
              isMandatory: foundSelectedField.isMandatory
            });
          } else {
            control.patchValue({
              isSelected: false,
              isMandatory: false
            });
          }
        }
      });
      console.log("Selected fields after patching:", this.selectedFieldsArray.value);
      this.cdr.detectChanges();
    });
  }

  getGridData() {
  this.metricsService.getMetricsColumnList().subscribe((response: any[]) => {
    this.projectData = response;
    this.filterProjectNames = this.projectData; // Initialize filterProjectNames with all projects
    const uniqueProjectTypes = Array.from(
      new Map(
        response
          .filter(project => project.projectTypeId && project.projectTypeName)
          .map(project => [
            project.projectTypeId, // Use ID as key to remove duplicates
            {
              label: project.projectTypeName,
              value: project.projectTypeId
            }
          ])
      ).values()
    );

    this.projectTypeDropdownList = uniqueProjectTypes;
    console.log("projectTypeDropdownList",this.projectTypeDropdownList)
  });
}


  getMasterColums() {
    this.metricsService
      .getAllMetricProjectColumns()
      .subscribe((response: any) => {
        this.masterColumnData = response.filter((item: any) => item.status == 1 && item.editable == 'Yes');

        this.setFieldControls();
      });
  }
  getProject() {
    this.taskService.getAllTasks()
      .subscribe((response: Task[]) => {
        this.ProjectOptions = response;
      });
  }
  loadMetricsList(): void {
    this.metricsMasterService.getMetricsMasterList()
      .subscribe((data: MetricsMaster[]) => {
        this.metricsMaster = data;
      });
  }

  onProjectSelected(projectId: number) {
  // Set the selected project ID in the form control
  this.frm.get('projectId')?.setValue(projectId);

  console.log("this.selectedPId",this.selectedPId);
  console.log("iseditmode",this.isEditMode);
  
  // Check if the form is in Edit Mode and if the selected project is the one currently being edited
  if (this.isEditMode && this.selectedProjectId === projectId) {
    console.log("Editing existing project, skipping duplicate check for the current project");
    return; // Skip the duplicate check for the current project
  }

  const duplicateProject = this.projectData.find(
    (project) => project.projectId === projectId
  );

  if (duplicateProject) {
    this.frm.get('projectId')?.setErrors({ alreadyExists: true });
    console.log("Duplicate project found:", duplicateProject);
  } else {
    this.frm.get('projectId')?.setErrors(null);

    this.metricsService.getTaskMetricsByProjectId(projectId).subscribe(
      (data: any[]) => {
        console.log("Fetched Metrics Data: ", data);

        this.metricsMaster = data;
        if (data.length > 0) {
          this.projectType = data[0]?.projectTypeName;
          this.frm.get('projectTypeId')?.setValue(data[0]?.projectTypeId);
        } else {
          console.log("No metrics data found for the selected project.");
        }
      },
      (error) => {
        console.error("Error fetching task metrics data:", error);
      }
    );
  }
}





  get selectedFieldsArray(): FormArray {
    return this.frm.get('selectedFields') as FormArray;
  }
  onSave(): void {
  if (this.frm.invalid) {
    this.frm.markAllAsTouched();
    this.messageService.add({
      severity: 'error',
      summary: 'Validation Error',
      detail: 'Please fill in all required fields.',
      life: 3000,
    });
    return;
  }

  const selectedFieldsForSave: SelectionFieldDto[] = [];
  
  // Loop through all master columns and check which fields have been selected
  this.masterColumnData.forEach((masterField, index) => {
    const control = this.selectedFieldsArray.at(index) as FormGroup;

    if (control.get('isSelected')?.value === true) {
      selectedFieldsForSave.push({
        fieldColumnId: masterField.id, // Get the original numeric ID from masterField
        isMandatory: control.get('isMandatory')?.value || false,
      });
    }
  });

  if (selectedFieldsForSave.length === 0) {
    this.messageService.add({
      severity: 'warn',
      summary: 'Validation Error',
      detail: 'Please select at least one field.',
      life: 3000,
    });
    return;
  }

  const payload: SelectionDto = {
    id: this.selectedPId, // Will be 0 for add, actual ID for edit
    projectId: this.frm.get('projectId')?.value,
    projectTypeId: this.frm.get('projectTypeId')?.value,
    metricsIDs: this.frm.get('metricsIds')?.value,
    selectedCheckBoxIds: selectedFieldsForSave,
  };

  this.metricsService.addMetricsColumn(payload).subscribe(
    () => {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: this.selectedPId > 0 ? 'Columns updated successfully' : 'Columns added successfully',
        life: 3000,
      });
      this.closeDialog();
      this.getGridData();
    },
    (error) => {
      console.error('Save error:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to save columns.',
        life: 3000,
      });
    }
  );
}


  setFieldControls() {
  // Clear existing controls if any, especially important when re-calling this
  while (this.selectedFieldsArray.length !== 0) {
    this.selectedFieldsArray.removeAt(0);
  }
  
  this.masterColumnData.forEach((field) => {
    const formGroup = this.fb.group({
      fieldColumnId: [field.id],
      isSelected: [false], // Initially unselected for new entries
      isMandatory: [false], // Initially not mandatory for new entries
    });
    
    // Since isSelected is false initially, disable the isMandatory control
    formGroup.get('isMandatory')?.disable();
    
    this.selectedFieldsArray.push(formGroup);
  });
  
  console.log("set control", this.selectedFieldsArray);
}

 showFieldsDialogs(id: number): void {
    this.selectedFieldsName = this.projectData.filter((task) => task.id === id);
    this.selectedprojectdialog =  this.selectedFieldsName[0].projectName;
    this.selectedFieldsName = this.selectedFieldsName[0].selectedCheckBoxIdsName;
    this.displayEmpDialog = true;
    this.displayMetricsDialog = false;
  }


  showMetricsDialogs(id: number): void {
     this.selectedMetricsName = this.projectData.filter((task) => task.id === id);
    this.selectedprojectdialog =  this.selectedMetricsName[0].projectName;
    this.selectedMetricsName = this.selectedMetricsName[0].metricName;
    console.log("metrics name", this.selectedMetricsName);
    this.displayEmpDialog = false;
    this.displayMetricsDialog = true;
  }



  closeDialog() {
    this.visible = false;
    this.clearFormAndFields();
  }
  clearFormAndFields() {
    this.frm.reset();
    // Clear projectType and metricsMaster specific to the dialog's state
    this.projectType = '';
    this.metricsMaster = [];
    this.selectAllValue = false;

    // Manually clear all controls in the FormArray
    while (this.selectedFieldsArray.length !== 0) {
      this.selectedFieldsArray.removeAt(0);
    }
    // Re-populate with master column data, but initially unchecked
    this.setFieldControls();
  }

  displayDeleteDialog: boolean = false;
  confirmDelete(data: any) {
    if (data) {
      this.recordToDelete = { ...data };
      console.log('Data to delete:', this.recordToDelete);
      this.displayDeleteDialog = true;
    }
  }

  deleteMeticsColumn() {
    this.userDetails = JSON.parse(localStorage.getItem('userLogin')!);
    this.userDetails = this.userDetails.data;
    const userId = this.userDetails.user_Id;
    if (this.recordToDelete) {
      this.recordToDelete.active = false;
      this.metricsService
        .addMetricsColumn(this.recordToDelete)
        .subscribe((result) => {
          if (result) {
            this.displayDeleteDialog = false;
            this.ngOnInit();
            this.messageService.add({
              severity: 'success',
              detail: 'Metrics column deleted successfully.',
            });

            this.ngOnInit();
          }
        });
    }
  }
}
