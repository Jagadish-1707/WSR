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
import { CommonModule, DatePipe } from '@angular/common';
import { ProjectDetails } from '../../models/projectDetails'; // Assuming this exists
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
  FormControl, // Import FormControl
  AbstractControl
} from '@angular/forms';
import { Calendar, CalendarModule } from 'primeng/calendar';
import { HttpClientModule } from '@angular/common/http';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FileUploadModule } from 'primeng/fileupload';
import { MessageService } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';
import { ProjectDetailsService } from '../../services/project-details.service'; // Assuming this exists
import { CardModule } from 'primeng/card';
import { TaskService } from '../../services/task.service'; // Assuming this exists
import { UserService } from '../../services/user.service'; // Assuming this exists
import { Task } from '../../models/task'; // Assuming this exists
import { MultiSelectModule } from 'primeng/multiselect';
import { User } from '../../models/user'; // Assuming this exists
import { PriorityService } from '../../services/priority.service'; // Assuming this exists
// import { DevelopmentMetrics, DevelopmentTaskDetails, EditDevelopmentMetrics, Metrics, TicketDetails } from '../../models/metrics'; // Keep if you use these elsewhere
import { ComplexityService } from '../../services/complexity.service'; // Assuming this exists
import { MetricsService } from '../../services/metrics.service'; // Your custom service
import { Complexity } from '../../models/complexity'; // Assuming this exists
import { SortPipe } from '../../../shared/pipes/sort.pipe'; // Assuming this exists
import moment from 'moment'; // Ensure moment is installed (npm install moment)
import { MetricsCalculationPipe } from '../../../shared/pipes/metrics-calculation.pipe'; // Assuming this exists
import { ProjectTypeService } from '../../services/project-type.service'; // Assuming this exists
import { ProjectTypes } from '../../models/projectType';
import { MomentFormatPipe } from "../../../shared/pipes/moment.pipe"; // Assuming this exists
import { TooltipModule } from 'primeng/tooltip';
import { DateService } from '../../../shared/services/date.service';
import { ZohoDataService } from '../../services/zoho-data.service';


// --- DTO Interfaces (Match your Backend DTOs) ---
interface MetricsDto {
  id: number; // MetricsData.Id
  projectId: string; // Task.Id
  customerId: string;
  projectTypeId: number;
  monthYear: Date;
  weekStartDate: Date;
  weekEndDate: Date;
  //FieldValues: MetricsFieldValueDto[]; // Actual stored dynamic field values
  dynamicFieldRows: MetricsDataRowDto[];
  customerName: string;
  projectName: string;
  projectType: string;

}

interface MetricsDataRowDto {
  fieldsInRow: MetricsFieldValueDto[];
}

interface MetricsFieldValueDto {
  fieldColumnId: number;
  fieldName: string;
  fieldType: 'text' | 'date' | 'dropdown' | 'textarea';
  isMandatory: boolean;
  fieldValue: string; // The stored value
}

interface SaveMetricsDto {
  id: number;
  projectId: string;
  customerId: string;
  projectTypeId: number;
  monthYear: Date;
  weekStartDate: Date;
  weekEndDate: Date;
  fieldValues: SaveMetricsFieldValueDto[];
}

interface SaveMetricsFieldValueDto {
  fieldColumnId: number;
  fieldValue: string;
  rowNumber?: number;
}

interface SelectionDto {
  projectId: number;
  selectedMetrics: SelectedProjectFieldsDataDto[];
}

interface SelectedProjectFieldsDataDto {
  fieldColumnId: number;
  fieldName: string;
  fieldType: 'text' | 'date' | 'dropdown' | 'textarea'; // Add other types as needed
  isMandatory: boolean;
}

@Component({
  selector: 'app-metrics-main-page',
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
    CalendarModule,
    InputTextareaModule,
    MultiSelectModule,
    SortPipe, // Make sure SortPipe is imported correctly
    HttpClientModule,
    MomentFormatPipe,
    TooltipModule,
    SortPipe
  ],
  templateUrl: './metrics-main-page.component.html',
  styleUrl: './metrics-main-page.component.scss'
})
export class MetricsMainPageComponent implements OnInit {
  @ViewChild('weekStartDateCalendar') weekStartDateCalendar!: Calendar;
  @ViewChild('weekEndDateCalendar') weekEndDateCalendar!: Calendar;

  selectedMonthYear: Date = new Date();
  selectedMonthYears: Date | null = null;

  metricsData: MetricsDto[] = []; // Changed to MetricsDto[] for the main table
  supportForm!: FormGroup;
  startDate!: Date | undefined;
  endDate!: Date;
  // selectedProjectType: string | undefined;
  addMetrics: boolean = false;
  filteredProjects: Task[] = [];
  taskData: Task[] = [];
  selectedProject: string | undefined;
  ProjectTypeOption: ProjectTypes[] = [];
  projectType: string = "";
  MetricsHeader: string = "Add Metrics";
  onWeekSelected: boolean = false;
  selectedColumnDefinitions: SelectedProjectFieldsDataDto[] = [];
  onProjectselect: boolean = false;
  selectedMetricsConfig!: SelectionDto;
  editingMetricsId: number | null = null;
  editMetrics: boolean = false;
  dropdownOptions: { [key: string]: { name: string, code: string }[] } = {};
  activeWeekIndex!: number;
  reloadMonth: any;
  selectedProjectName!: Task | null;
  filterProjectNames: MetricsDto[] = [];
  selectedProjecttype!: any;
  slaOptions: any[] = [];
  priorityOptions: any[] = [];
  empOptions: any[] = [];
  projectTypeDropdownList: { label: string; value: string }[] = [];

  constructor(
    private fb: FormBuilder,
    private projectTypeService: ProjectTypeService,
    public datePipe: DatePipe,
    private dateService: DateService,
    public taskService: TaskService,
    private messageService: MessageService,
    private projectDetailsService: ProjectDetailsService,
    private metricsService: MetricsService,
    private zohoDataService: ZohoDataService
  ) {
    const today = new Date();
    this.selectedMonthYear = new Date(today.getUTCFullYear(), today.getMonth(), 1);
  }

  ngOnInit(): void {
    this.initForm(); // Initialize form here
    this.getCustomer();
    this.getProjectType();
    this.getAllMetricsData();
    //this.loadDropdownOptions(this.selectedMetricsConfig.selectedMetrics);
    this.reloadMonth = new Date();
    this.endDate = new Date(); // Current date
    this.startDate = new Date();
    this.startDate.setFullYear(this.startDate.getFullYear() - 2);
    
    
  }

  initForm(): void {
    this.supportForm = this.fb.group({
      id: 0,
      customerId: ['', Validators.required],
      projectId: ['', Validators.required],
      projectTypeId: ['', Validators.required],
      monthYear: [null, Validators.required],
      weekStartDate: [{ value: null, disabled: true }, Validators.required],
      weekEndDate: [{ value: null, disabled: true }, Validators.required],
      selectedMetricsArray: this.fb.array([]) // Dynamic fields FormArray
    });

    // Subscribe to ProjectId changes to re-fetch dynamic columns
    this.supportForm.get('projectId')?.valueChanges.subscribe(projectId => {
      if (projectId) {
        this.getGridColumn(projectId);
      } else {
        this.selectedColumnDefinitions = [];
        this.selectedMetricsArray.clear();
      }
    });
  }

  loadDropdownOptions(selectedMetricsConfig: any[]): void {
    this.dropdownOptions = {}; // Reset

    selectedMetricsConfig.forEach((metric: any) => {
      if (metric.fieldType === 'dropdown' && metric.ddValue) {
        const options = metric.ddValue.split(',').map((val: any) => ({
          name: val.trim(),
          code: val.trim()
        }));

        this.dropdownOptions[metric.fieldName] = options;
      }
    });

    // Add SLA options to dropdownOptions
    this.dropdownOptions['SLA'] = this.slaOptions;
    this.dropdownOptions['Priority'] = this.priorityOptions;
    this.dropdownOptions['Assigned To'] = this.empOptions;
  }

filterTaskData() {
  const dataToFilter = [...this.filterProjectNames]; // Always start from full data

  this.metricsData = dataToFilter.filter((MetricsDto) => {
    const matchesProjectName =
      !this.selectedProjectName ||
      MetricsDto.projectName === this.selectedProjectName.projectName;

    const matchesProjectType =
      !this.selectedProjecttype ||
      MetricsDto.projectType === this.selectedProjecttype.projectTypeName;
    console.log("Selected Pro type",this.selectedProjecttype);
    console.log("matchesProjectType",matchesProjectType);
    
    let matchesMonthYear = true;
    if (this.selectedMonthYears) {
  const selectedMonth = this.selectedMonthYears.getMonth();
  const selectedYear = this.selectedMonthYears.getFullYear();

  const dataMonth = new Date(MetricsDto.monthYear).getMonth();
  const dataYear = new Date(MetricsDto.monthYear).getFullYear();

  matchesMonthYear = selectedMonth === dataMonth && selectedYear === dataYear;
}


    return matchesProjectName && matchesProjectType && matchesMonthYear;
  });
}









onClear() {
  this.metricsService.getAllMetrics().subscribe((response: any[]) => {
    this.metricsData = response;
    this.filterProjectNames = this.metricsData;
  });
  this.selectedProjecttype = '';
  this.selectedProjectName = null;
  this.selectedMonthYears = null; // RESET month-year
}


  // Helper to get the FormArray
  get selectedMetricsArray(): FormArray {
    return this.supportForm.get('selectedMetricsArray') as FormArray;
  }

  // Helper to get a specific form control for validation/access within the dynamic rows
  getFormControl(rowIndex: number, fieldColumnId: number): FormControl | null {
    const rowGroup = this.selectedMetricsArray.at(rowIndex) as FormGroup;
    // Important: formControlName uses string, so ensure consistency
    return rowGroup.get(fieldColumnId.toString()) as FormControl;
  }

  // Helper to get dropdown options for a specific fieldColumnId
  getDropdownOptions(fieldName: string): { name: string, code: string }[] {
    return this.dropdownOptions[fieldName] || []; // Return empty array if no options found
  }

  populateDynamicFormControls(dynamicFieldRows: MetricsDataRowDto[] = []): void {
    console.log('Populating dynamic form controls with rows:', dynamicFieldRows); // Is this array correct?
    console.log('Current selectedColumnDefinitions:', this.selectedColumnDefinitions); // Is this still correct here?

    this.selectedMetricsArray.clear();

    if (this.selectedColumnDefinitions.length === 0) {
      console.warn('Cannot populate dynamic form controls: selectedColumnDefinitions is empty.');
      return;
    }

    if (dynamicFieldRows.length > 0) {
      // If in edit mode with existing data, create and push populated rows
      dynamicFieldRows.forEach(row => {
        const populatedRowGroup = this.createDynamicFormGroup(row.fieldsInRow);
        this.selectedMetricsArray.push(populatedRowGroup);
      });
    } else {
      // For a new entry, create and push a single empty row
      const emptyRowGroup = this.createDynamicFormGroup();
      this.selectedMetricsArray.push(emptyRowGroup);
    }
  }

  addRow(): void {
    if (this.selectedColumnDefinitions.length === 0) {
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Please select a project first to load column definitions.' });
      return;
    }
    const newRowGroup = this.createDynamicFormGroup(); // Creates an empty row
    this.selectedMetricsArray.push(newRowGroup); // Add it to the FormArray
  }

  private createDynamicFormGroup(FieldValues: MetricsFieldValueDto[] = []): FormGroup {
  const newRowGroup = this.fb.group({});

  const isValidDate = (value: any): boolean => {
    const d = new Date(value);
    return value && !isNaN(d.getTime());
  };

  this.selectedColumnDefinitions.forEach(metric => {
    const fieldColumnId = metric.fieldColumnId.toString();
    const validators = metric.isMandatory ? [Validators.required] : [];

    let initialValue: any = '';
    const existingFieldValue = FieldValues.find(fv => fv.fieldColumnId === metric.fieldColumnId)?.fieldValue;

    if (existingFieldValue !== undefined && existingFieldValue !== null && existingFieldValue !== '') {
      if (metric.fieldType === 'date') {
        initialValue = isValidDate(existingFieldValue) ? new Date(existingFieldValue) : null;

      } else if (metric.fieldType === 'dropdown') {
        const fieldName = metric.fieldName?.trim();
        const options = this.dropdownOptions[fieldName] || [];

        const matchedOption = options.find(opt => opt.code === existingFieldValue);
        initialValue = matchedOption ? matchedOption.code : null;

      } else {
        initialValue = existingFieldValue;
      }
    } else {
      initialValue = metric.fieldType === 'date' ? null : '';
    }

    newRowGroup.addControl(fieldColumnId, this.fb.control(initialValue, validators));
  });

  return newRowGroup;
}



  // New method to remove a row
  removeRow(index: number): void {
    if (this.selectedMetricsArray.length > 1) { // Prevent removing the last row (optional)
      this.selectedMetricsArray.removeAt(index);
    } else {
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Cannot remove the last row.' });
    }
  }


  getAllMetricsData(): void {
    this.metricsService.getAllMetrics().subscribe(
      (response: any[]) => {
        console.log(response);
        
        this.metricsData = response;
        this.filterProjectNames = this.metricsData;
        const uniqueProjectTypes = Array.from(
          new Set(
            response
              .filter((item: any) => item.projectType) // Filter out items without projectType
              .map((item: any) => item.projectType) // Extract projectType values
          )
        ).map((projectType: string) => ({
          label: projectType,
          value: projectType // Since projectTypeId is null, use projectType as value
        }));

        this.projectTypeDropdownList = uniqueProjectTypes;

        console.log("Unique Project Types:", uniqueProjectTypes);
      }
    );
  }

  getProjectType(): void {
    this.projectTypeService
      .getAllProjectTypeDetails()
      .subscribe((response: ProjectTypes[]) => {
        this.ProjectTypeOption = response.filter((item: any) => item.status == 1);
        console.log("Project Types", this.ProjectTypeOption);
      });
  }

  getCustomer(): void {
    this.taskService.getAllTasks().subscribe(
      (response: Task[]) => {
        console.log("Task=>",response);
        

        // Ensure unique customers for the dropdown
        const uniqueCustomers = new Map<string, Task>();
        response.forEach(task => {
          if (!uniqueCustomers.has(task.customerName)) {
            uniqueCustomers.set(task.customerName, task);
          }
        });
        this.taskData = Array.from(uniqueCustomers.values());
      },
      (error: any) => {
        console.error('Error fetching tasks (customers):', error);
      }
    );
  }

  // Fetches the dynamic column definitions for the selected project
  getGridColumn(projectIdString: string | undefined): void {
    this.metricsService.getMetricsGridColumSelected(projectIdString)
      .subscribe({
        next: (response: SelectionDto) => {
          this.selectedMetricsConfig = response;
          //sla and priority dd
          this.metricsService.getSLAMetricsList().subscribe(
            (response: any) => {
              const filteredSLAs = response.filter((item: any) => item.projectId === projectIdString);
              this.slaOptions = filteredSLAs.map((item: any) => ({
                name: item.slaHours.toString(),
                code: item.slaHours.toString()
              }));
            },
            (error) => {
              console.error('Error fetching metrics:', error);
            }
          );
          this.metricsService.getMetricsPriorityList().subscribe(
            (response: any) => {
              const filteredpriority = response.filter((item: any) => item.projectId === projectIdString);
              this.priorityOptions = filteredpriority.map((item: any) => ({
                name: item.projectPriority,
                code: item.projectPriority
              }));
            },
            (error) => {
              console.error('Error fetching metrics:', error);
            }
          );

          this.metricsService.getMetricsAssignedEmployee(projectIdString).subscribe((res) => {
            this.empOptions = res.map((item: any) => ({
                name: item.employeeId_Name,
                code: item.employeeId_Name
              }));
          });

          this.selectedColumnDefinitions = response.selectedMetrics;

          // Add your hardcoded fields
          const staticFields: SelectedProjectFieldsDataDto[] = [
            { fieldColumnId: 1, fieldName: 'Ticket No.', fieldType: 'text', isMandatory: true },
            { fieldColumnId: 2, fieldName: 'Ticket Description', fieldType: 'text', isMandatory: true },
            { fieldColumnId: 3, fieldName: 'Priority', fieldType: 'dropdown', isMandatory: false },
            { fieldColumnId: 4, fieldName: 'SLA', fieldType: 'dropdown', isMandatory: false },
            { fieldColumnId: 5, fieldName: 'Assigned To', fieldType: 'dropdown', isMandatory: true },
          ];

          // Concatenate the API response fields with your static fields
          this.selectedColumnDefinitions = [...staticFields, ...this.selectedColumnDefinitions];

          this.loadDropdownOptions(this.selectedMetricsConfig.selectedMetrics);
          this.dropdownOptions['SLA'] = this.slaOptions;
          this.dropdownOptions['Priority'] = this.priorityOptions;
          this.dropdownOptions['Assigned To'] = this.empOptions;
          this.populateDynamicFormControls();
        },
        error: (error) => {
          console.error('Error fetching dynamic grid columns:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load project-specific fields.' });
          this.selectedColumnDefinitions = []; // Clear if error
          this.selectedMetricsArray.clear(); // Clear dynamic form controls
        }
      });
  }

  /*populateDynamicFormControls(fieldValues: MetricsFieldValueDto[] = []): void {
    // Clear existing controls (important for re-populating, e.g., on project change)
    this.selectedMetricsArray.clear();

    // Only proceed if we have column definitions to build controls for
    if (this.selectedColumnDefinitions.length > 0) {
      const newRowGroup = this.fb.group({});

      this.selectedColumnDefinitions.forEach(metric => {
        const validators = metric.isMandatory ? [Validators.required] : [];

        let initialValue: any = '';
        const existingFieldValue = fieldValues.find(fv => fv.fieldColumnId === metric.fieldColumnId)?.fieldValue;
        if (existingFieldValue !== undefined && existingFieldValue !== null) {
          if (metric.fieldType === 'date') {
            // Assuming ISO 8601 string from backend
            initialValue = new Date(existingFieldValue);
          } else {
            initialValue = existingFieldValue;
          }
        }
        // Use toString() for formControlName as fieldColumnId is number
        newRowGroup.addControl(metric.fieldColumnId.toString(), this.fb.control(initialValue, validators));
      });

      // This is crucial: Push the newly created FormGroup to the FormArray
      this.selectedMetricsArray.push(newRowGroup);
    }
  }*/

  // --- Form Logic and Event Handlers ---
  onClientSelected(selectedCustomerId: string): void {
    if (selectedCustomerId) {
      const projects = this.taskData.filter(task => task.customerId === selectedCustomerId);
      this.filteredProjects = projects;
      this.supportForm.get('projectId')?.reset();
      this.supportForm.get('projectTypeId')?.reset(); // Reset project dropdown      
    } else {
      this.filteredProjects = [];
    }
  }

  onProjectSelected(selectedProjectId: string): void {
    const projectTasks = this.taskData.filter(task => task.projectId === selectedProjectId);

    // Get assignment start and end dates
    const projectStartDates = projectTasks.map(task => task.assignmentStartDate);
    const projectEndDates = projectTasks.map(task => task.assignmentEndDate);

    console.log('Project assignment start dates:', projectStartDates);
    console.log('Project assignment end dates:', projectEndDates);


    const projectControl = this.supportForm.get('projectId');
    const startControl = this.supportForm.get('weekStartDate');
    const endControl = this.supportForm.get('weekEndDate');   
    const startControlDate = startControl?.value ? moment(startControl.value) : null;
    const endControlDate = endControl?.value ? moment(endControl.value) : null;

    const isWithinAssignment = projectTasks.some(task =>
      startControlDate &&
      endControlDate &&
      startControlDate.isSameOrAfter(task.assignmentStartDate) &&
      endControlDate.isSameOrBefore(task.assignmentEndDate)
    );

    if (!isWithinAssignment) {
      projectControl?.setErrors({ outOfAssignmentRange: true });
      projectControl?.markAsTouched();
      return;
    }

    const project = this.filteredProjects.find(p => p.projectId === selectedProjectId);

    if (!project || !startControl?.value || !endControl?.value) {
      console.warn('Project or week dates are missing.');
      return;
    }

    const normalizedStart = this.getLocalDateString(startControl.value);
    const normalizedEnd = this.getLocalDateString(endControl.value);

    const exists = this.metricsData.some(entry => {
      const entryStart = this.getLocalDateString(entry.weekStartDate);
      const entryEnd = this.getLocalDateString(entry.weekEndDate);
      console.log(`Checking: projectId=${entry.projectId}, start=${entryStart}, end=${entryEnd}`);
      return entry.projectId === selectedProjectId &&
        entryStart === normalizedStart &&
        entryEnd === normalizedEnd;
    });

    if (exists) {
      projectControl?.setErrors({ duplicateWeek: true });
      projectControl?.markAsTouched();
      return;
    } else {
      // Clear only the custom error
      if (projectControl?.hasError('duplicateWeek')) {
        const currentErrors = projectControl.errors;
        if (currentErrors) {
          delete currentErrors['duplicateWeek'];
          if (Object.keys(currentErrors).length === 0) {
            projectControl.setErrors(null);
          } else {
            projectControl.setErrors(currentErrors);
          }
        }
      }
    }

    // Set selected project name
    this.selectedProject = project.projectName;
    this.onProjectselect = true;

    this.metricsService.getProjectTypeByProjectId(selectedProjectId).subscribe((data: any[]) => {
      this.projectType = data[0].projectTypeName;
      this.supportForm.get('projectTypeId')?.setValue(data[0].id);
    });

    this.getGridColumn(project.projectId);

    this.projectDetailsService.getAllProjectDetails().subscribe((response: ProjectDetails[]) => {
      const detail = response.find(p => p.projectId === project.projectId);
      this.startDate = detail?.startDate ? new Date(detail.startDate) : undefined;
      this.endDate = detail?.endDate
        ? new Date(detail.endDate)
        : new Date(new Date().setFullYear(new Date().getFullYear() + 5));
    }, error => {
      console.error('Error fetching project details:', error);
    });

    this.selectedColumnDefinitions = [];
    this.selectedMetricsArray.clear();
  }




  onAddMetrics(): void {
    this.onProjectselect = false;
    this.onWeekSelected = false;
    this.editMetrics = false;
    this.supportForm.get('monthYear')?.enable();
    this.supportForm.get('monthYear')?.reset();
    this.reloadMonth = new Date();
    this.supportForm.get('projectId')?.enable();
    this.supportForm.get('customerId')?.enable();
    this.addMetrics = true;
    this.editingMetricsId = null; // Clear editing state for new entry
    this.supportForm.reset(); // Reset the form for new entry
    this.selectedColumnDefinitions = []; // Clear dynamic columns
    this.selectedMetricsArray.clear(); // Clear dynamic form array
  }

  backToMetricsGrid(): void {
    this.addMetrics = false;
    this.editingMetricsId = null; // Reset editing state
    this.supportForm.reset(); // Reset form
    this.getAllMetricsData(); // Refresh the main grid
  }

  editTask(metricsDataId: number, flagType: string): void {
    this.editMetrics = true;
    this.editingMetricsId = metricsDataId;
    this.addMetrics = true;
    this.MetricsHeader = "Edit Metrics";

    this.metricsService.getMetricsById(metricsDataId).subscribe((data: MetricsDto) => {
      console.log("Data", data);

      // Patch form values correctly, ensuring that date fields are correctly parsed
      this.supportForm.patchValue({
        id: data.id,
        customerId: data.customerId,
        projectId: data.projectId,
        projectTypeId: data.projectTypeId,
        monthYear: new Date(data.monthYear),  // Ensure monthYear is a valid Date object
        weekStartDate: data.weekStartDate ? new Date(data.weekStartDate) : null,
        weekEndDate: data.weekEndDate ? new Date(data.weekEndDate) : null
      });


      // Fetch project-related data
      const projects = this.taskData.filter(task => task.customerId === data.customerId);
      this.filteredProjects = projects;
      this.supportForm.get('projectId')?.setValue(data.projectId);

      this.supportForm.get('projectId')?.disable();
      this.supportForm.get('customerId')?.disable();
      this.supportForm.get('monthYear')?.disable();

      // Get project type for the projectId
      this.metricsService.getProjectTypeByProjectId(data.projectId).subscribe((data: any[]) => {
        this.projectType = data[0].projectTypeName;
        this.supportForm.get('projectTypeId')?.setValue(data[0].id);
      });

      // Get dynamic columns for the project
      const currentProjectId = data.projectId;
      this.metricsService.getMetricsGridColumSelected(currentProjectId.toString()).subscribe(config => {
        this.selectedMetricsConfig = config;
        //this.loadDropdownOptions(this.selectedMetricsConfig.selectedMetrics);
        this.selectedColumnDefinitions = config.selectedMetrics;

        // Add your hardcoded fields
        const staticFields: SelectedProjectFieldsDataDto[] = [
          { fieldColumnId: 1, fieldName: 'Ticket No.', fieldType: 'text', isMandatory: true },
          { fieldColumnId: 2, fieldName: 'Ticket Description', fieldType: 'text', isMandatory: true },
          { fieldColumnId: 3, fieldName: 'Priority', fieldType: 'dropdown', isMandatory: false },
          { fieldColumnId: 4, fieldName: 'SLA', fieldType: 'dropdown', isMandatory: false },
          { fieldColumnId: 5, fieldName: 'Assigned To', fieldType: 'dropdown', isMandatory: true },
        ];

        // Concatenate the API response fields with your static fields
        this.selectedColumnDefinitions = [...staticFields, ...this.selectedColumnDefinitions];

        this.loadDropdownOptions(this.selectedMetricsConfig.selectedMetrics);
        this.dropdownOptions['SLA'] = this.slaOptions;
        this.dropdownOptions['Priority'] = this.priorityOptions;
        this.dropdownOptions['Assigned To'] = this.empOptions;

        // Populate dynamic form controls based on the fetched data
        this.populateDynamicFormControls(data.dynamicFieldRows);
      }, error => {
        console.error('Error fetching dynamic grid columns during edit:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load project-specific fields for edit.' });
        this.selectedColumnDefinitions = [];
        this.selectedMetricsArray.clear();
      });
    });
  }


  // --- Delete functionality ---
  /*deleteMetrics(id: number): void {
      this.metricsService.deleteMetrics(id).subscribe({
          next: () => {
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Metrics deleted successfully!' });
              this.getAllMetricsData(); // Refresh the main grid after deletion
          },
          error: (error) => {
              console.error('Error deleting metrics:', error);
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete metrics.' });
          }
      });
  }*/

  onArraySubmit(): void {
    if (this.supportForm.invalid) {
      this.messageService.add({ severity: 'error', summary: 'Validation Error', detail: 'Please fill all required fields.' });
      this.supportForm.markAllAsTouched();
      return;
    }

    const formValue = this.supportForm.value;
    console.log(formValue);

    // Collect all field values from ALL rows in the FormArray
    const allFieldValues: SaveMetricsFieldValueDto[] = [];
    this.selectedMetricsArray.controls.forEach((rowGroup: AbstractControl, rowIndex: number) => {
      if (rowGroup instanceof FormGroup) {
        for (const controlName in rowGroup.controls) {
          if (rowGroup.controls.hasOwnProperty(controlName)) {
            const control = rowGroup.get(controlName);
            if (control) {
              let fieldValue = control.value;

              const metricDef = this.selectedColumnDefinitions.find(m => m.fieldColumnId.toString() === controlName);
              if (metricDef && metricDef.fieldType === 'date' && fieldValue instanceof Date) {
                fieldValue = fieldValue.toISOString();
              }

              allFieldValues.push({
                rowNumber: rowIndex + 1,
                fieldColumnId: parseInt(controlName, 10),
                fieldValue: fieldValue?.toString() || ''
              });
            }
          }
        }
      }
    });

    const saveDto: SaveMetricsDto = {
      id: formValue.id,
      projectId: this.supportForm.get('projectId')?.value,
      projectTypeId: formValue.projectTypeId,
      customerId: this.supportForm.get('customerId')?.value,
      monthYear: this.supportForm.get('monthYear')?.value,
      weekStartDate: this.supportForm.get('weekStartDate')?.value,  // Keep as Date
      weekEndDate: this.supportForm.get('weekEndDate')?.value,
      fieldValues: allFieldValues
    };

    console.log("Before",saveDto);
    const saveDtoForBackend = {
      ...saveDto,
      weekStartDate: this.getLocalDateString(this.supportForm.get('weekStartDate')?.value),
      weekEndDate: this.getLocalDateString(this.supportForm.get('weekEndDate')?.value),
    };

    console.log("saveDtoForBackend", saveDtoForBackend);
    if (this.editingMetricsId) {
      this.metricsService.editMetrics(saveDtoForBackend).subscribe({
        next: (response) => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Metrics updated successfully!' });
          this.backToMetricsGrid();
        },
        error: (error) => {
          console.error('Error updating metrics:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update metrics.' });
        }
      });
    } else {
      this.metricsService.addMetrics(saveDtoForBackend).subscribe({
        next: (response) => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Metrics saved successfully!' });
          this.backToMetricsGrid();
        },
        error: (error) => {
          console.error('Error saving metrics:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to save metrics.' });
        }
      });
    }
  }

  getLocalDateString(date: any): string {
  const d = new Date(date);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}


  private isDate(value: any): value is Date {
    return value instanceof Date && !isNaN(value.getTime());
  }


  onselectEndDate() {
    const startDateValue = this.supportForm.get('weekStartDate')?.value;
    // Set End Date to the last day of the week or a reasonable default
    if (startDateValue) {
      const endDateControl = this.supportForm.get('weekEndDate');
      const startMoment = moment(startDateValue);
      const endOfWeek = startMoment.endOf('week').toDate();
      // Ensure endOfWeek is not past the project's end date if one exists
      const maxDate = this.endDate ? this.endDate : endOfWeek;
      const finalEndDate = endOfWeek > maxDate ? maxDate : endOfWeek;

      endDateControl?.setValue(finalEndDate);
      //endDateControl?.enable();
    }
  }

  onEndDateSelected(selectedDate: Date) {
    // You can add any additional logic here if needed after end date is selected
  }



  weeklyRange: moment.Moment[][] = [];
  weekStatus: any[] = [];
  selectedMonth: Date | null = null;

  updateWeekCalendars(selectedDate: Date) {
    if (!selectedDate) return;

    this.selectedMonth = selectedDate;
    this.onWeekSelected = false;
    // Configure moment locale for Monday as first day of week
    moment.updateLocale('en', {
      week: {
        dow: 1, // Monday
        doy: 7, // Sunday
      },
    });

    const selectedMoment = moment(selectedDate);
    this.weeklyRange = [];
    this.weekStatus = [];

    const startOfMonth = selectedMoment.clone().startOf('month');
    const endOfMonth = selectedMoment.clone().endOf('month');
    const currentWeekStart = startOfMonth.clone().startOf('week');

    while (currentWeekStart.isBefore(endOfMonth) || currentWeekStart.isSame(endOfMonth)) {
      const currentWeekEnd = currentWeekStart.clone().endOf('week');
      const weekDates: moment.Moment[] = [];

      for (
        let currentDay = currentWeekStart.clone();
        currentDay.isSameOrBefore(currentWeekEnd);
        currentDay.add(1, 'day')
      ) {
        if (
          currentDay.isSameOrAfter(startOfMonth) &&
          currentDay.isSameOrBefore(endOfMonth)
        ) {
          weekDates.push(currentDay.clone());
        }
      }

      if (weekDates.length > 0) {
        this.weeklyRange.push(weekDates);
      }

      currentWeekStart.add(1, 'week');
    }

    // Create week status array with start and end dates
    this.weeklyRange.forEach((dates) => {
      this.weekStatus.push({
        start: moment(dates[0]).format('YYYY-MM-DD'),
        end: moment(dates[dates.length - 1]).format('YYYY-MM-DD')
      });
    });

    console.log('Weekly Range:', this.weeklyRange);
    console.log('Week Status:', this.weekStatus);
  }

  goToPreviousMonth() {
    if (this.reloadMonth) {
      this.reloadMonth = moment(this.reloadMonth).subtract(1, 'month').toDate();
      this.updateWeekCalendars(this.reloadMonth); // This will update the weekly range and status
    }
  }

  goToNextMonth() {
    if (this.reloadMonth) {
      this.reloadMonth = moment(this.reloadMonth).add(1, 'month').toDate();
      this.updateWeekCalendars(this.reloadMonth); // This will update the weekly range and status
    }
  }

  onStartDateClick() {
    // Handle focus event if needed
    console.log('Calendar focused');
  }

  formatWeekRange(weekSummary: any): string {
    const startDate = moment(weekSummary.start).format('DD MMM YYYY');
    const endDate = moment(weekSummary.end).format('DD MMM YYYY');
    return `${startDate} - ${endDate}`;
  }

  weekDaysShow: string[] = [];  // Array to hold all week days

  onWeekSelect(weekSummary: any, index: number) {
    // Convert string dates to Date objects
    const startDate = moment(weekSummary.start);
    const endDate = moment(weekSummary.end);
    this.onWeekSelected = true;
    this.supportForm.get('monthYear')?.enable();
    this.supportForm.get('weekStartDate')?.enable();
    this.supportForm.get('weekEndDate')?.enable();
    // Update form controls with selected week dates
    this.supportForm.patchValue({
      weekStartDate: startDate.toDate(),
      weekEndDate: endDate.toDate()
    });

    // Store the active week index
    this.activeWeekIndex = index + 1;

    // Clear the week status
    this.weekStatus.length = 0;

    // Populate the weekDaysShow array with the days between the start and end date
    this.weekDaysShow = [];
    let currentDay = startDate.clone();
    while (currentDay.isBefore(endDate) || currentDay.isSame(endDate, 'day')) {
      this.weekDaysShow.push(currentDay.format('DD-MMM-YYYY'));
      currentDay.add(1, 'day');
    }

    // Make the start and end date fields readonly after selection
    this.supportForm.get('weekStartDate')?.disable();
    this.supportForm.get('weekEndDate')?.disable();
    this.supportForm.get('monthYear')?.disable();

  }




}