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
import { Router } from '@angular/router';
import { Client } from '../../models/client';
import { ComplexityService } from '../../services/complexity.service';
import { MessageService } from 'primeng/api';
import { Projects } from '../../models/projects';
import { ProjectDetailsService } from '../../services/project-details.service';
import { SortPipe } from "../../../shared/pipes/sort.pipe";
import { ProjectDetails } from '../../models/projectDetails';
import { TagModule } from 'primeng/tag';
import { CamelCaseDirective, CaseSensitiveDirective, NoInitialSpaceDirective } from '../../../shared/components/camel-case.directive';

@Component({
    selector: 'app-complexity',
    standalone: true,
    templateUrl: './complexity.component.html',
    styleUrl: './complexity.component.scss',
    imports: [ButtonModule,
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
        AddTaskComponent,
        CalendarModule,
        ReactiveFormsModule, SortPipe,
        NoInitialSpaceDirective,
      CamelCaseDirective,
      CaseSensitiveDirective,
      TagModule
    ]
})
export class ComplexityComponent implements OnInit {

 
  visible:boolean =false; 
  // clients: Client[]=[];
  clients:any[]=[]
  projectName:string='';
  complexityData:any[]=[];
  editFrm:FormGroup; 
  complexityedit: boolean=false;
  public selectedPId:number=0;
  frm: FormGroup;
  projects!: any[];
  editDialog: boolean =false;
  rowData: any;
  data: any[]=[];
  editComplexityData: any[]=[];
  customerName!: string;
  projectData!: ProjectDetails[];
  customerId: any;
  projectId: any;
  complexity: string = '';
  editComplexityName: string = '';
 

    
  constructor(private fb: FormBuilder,
    private complexityService : ComplexityService,
    private router:Router,
    private messageService: MessageService,
    private projectService: ProjectDetailsService,
    private projectDetailsService: ProjectDetailsService){
  
      this.frm = this.fb.group({
        customerId:[],
        customer:['', Validators.required],
        projectId:[],
        project:[{value:'', disabled: true}, Validators.required],
        projectComplexity:[{value:'', disabled: true}, Validators.required],
        status:['',Validators.required],
        remarks:[''],
      }); 
      
      this.editFrm = this.fb.group({
        id: [''],
        customerId:[],
        customer:['', Validators.required],
        projectId:[],
        project:[{value:'', disabled: true}, Validators.required],
        projectComplexity:[{value:'', disabled: true}, Validators.required],
        status:['',Validators.required],
        remarks:[''],
        }); 
  }
  Status = [
    { label: 'Active', value: 1 },
    { label: 'Inactive', value: 0 },
    ];

    ngOnInit() {
      this.complexityService.getAllComplexity().subscribe((response: any) => {
          this.complexityData = response;
      });
    
      // this.projectService.getAllClients().subscribe((response: any) => {
      //   const uniqueClientName = [...new Set(response.map((item: any) => item.clientName))];
      //   this.clients = uniqueClientName.sort(); 
      // });
      this.projectService.getAllClients().subscribe((Response: Client[]) => {
        this.clients = Response;
        console.log('Res', Response);
      });
    
      // this.projectService.getAllProjects().subscribe((response: any) => {
      //   const uniqueProjectName = [...new Set(response.map((item: any) => item.projectName))];
      //   this.projects = uniqueProjectName.sort();
      // });
    }
  showDialog() {
    this.visible = true;
    this.frm?.reset();
  }
  cancelEdit() {
    this.editDialog = false;
    this.editFrm?.reset();
  }
  onClientSelected(selectedClient: { clientName: string; id: number }) {
    // this.editFrm.reset();
    if (!selectedClient) return;
    // Enable and reset project controls
    const projectControl = this.frm.get('project');
    const editProjectControl = this.editFrm.get('project');
    projectControl?.enable();
    projectControl?.reset();
    editProjectControl?.enable();
    editProjectControl?.reset();
    // Set the customer name and patch forms
    this.customerName = selectedClient.clientName;
    this.customerId = selectedClient.id;

    // this.frm.patchValue({ customerId, customerName });
    // this.frm.patchValue({
    //     customerId: customerId,
    // });

    // this.editFrm.patchValue({

    //     customerId: customerId,
    //     customer: customerName,
    // });

    // Fetch projects and assign to this.projects
    this.projectService.getAllAmsProject(this.customerId)?.subscribe((data: any) => {
        this.projects = data;
    });
}
// onClientSelected(selectedClient: { clientName: string; id: number }) {
//   if (!selectedClient) return;

//   // Enable and reset project controls for both forms
//   const projectControl = this.frm.get('project');
//   const editProjectControl = this.editFrm.get('project');
//   projectControl?.enable();
//   projectControl?.reset();
//   editProjectControl?.enable();
//   editProjectControl?.reset();

//   // Set the customer name and ID
//   this.customerName = selectedClient.clientName;
//   this.customerId = selectedClient.id;

//   // Find the selected client object from the clients array
//   const selectedClientObj = this.clients.find(client => client.id === this.customerId);

//   // Patch the customer object to both forms
//   this.frm.patchValue({
//       customer: selectedClientObj  // Patch the entire object
//   });

//   this.editFrm.patchValue({
//       customer: selectedClientObj  // Patch the entire object
//   });

//   // Fetch projects for the selected customer
//   this.projectService.getAllAmsProject(this.customerId).subscribe((data: any) => {
//       this.projects = data;  // Update the projects list
//   });
// }
onProjectSelected(selectedProject: { projectName: string; id: number }) {
  // this.editFrm.reset();
    if (!selectedProject) return;
    // Patch project details
    this.projectId = selectedProject.id;
    this.projectName = selectedProject.projectName;
    const projectControl = this.frm.get('projectComplexity');
    const editProjectControl = this.editFrm.get('projectComplexity');
    projectControl?.enable();
    projectControl?.reset();
    editProjectControl?.enable();
    editProjectControl?.reset();
}
// onComplexityExist(){
//   this.complexityService.getAllComplexity().subscribe((response: any) => {
//     this.complexityData = response;
//     const complexityExist = this.complexityData.some(complexity =>
//       complexity.projectComplexity === this.complexity
//           );
//           if (complexityExist) {
//             console.log(complexityExist,"exist");
            
//             this.frm.get('projectComplexity')?.setErrors({ 'alreadyExists': true });
//                 }
// });
// }
onComplexityExist() {
  const customer = this.frm.get('customer')?.value;
  const project = this.frm.get('project')?.value;

  if (customer && project && this.complexity) {
    this.complexityService.getAllComplexity().subscribe((response: any) => {
      this.complexityData = response;

      // Check if the complexity exists for the same customer and project
      const complexityExist = this.complexityData.find(complexity => 
        complexity.projectComplexity === this.complexity &&
        complexity.customer === customer.clientName &&
        complexity.project === project.projectName
      );

      if (complexityExist) {
        console.log(complexityExist, "exist");
        this.frm.get('projectComplexity')?.setErrors({ 'alreadyExists': true });
      }
    });
  }
}
onEditComplexityExist() {
  const customer = this.editFrm.get('customer')?.value;
  const project = this.editFrm.get('project')?.value;

  if (customer && project && this.editComplexityName) {
    this.complexityService.getAllComplexity().subscribe((response: any) => {
      this.complexityData = response;

      // Check if the complexity exists for the same customer and project
      const complexityExist = this.complexityData.find(complexity => 
        complexity.projectComplexity === this.editComplexityName &&
        complexity.customer === customer.clientName &&
        complexity.project === project.projectName
      );

      if (complexityExist) {
        console.log(complexityExist, "exist");
        this.editFrm.get('projectComplexity')?.setErrors({ 'alreadyExists': true });
      }
    });
  }
}

// onProjectSelected(selectedProject: { projectName: string; id: number }) {
//   if (!selectedProject) return;

//   // Set project ID and Name
//   this.projectId = selectedProject.id;
//   this.projectName = selectedProject.projectName;

//   // Find the selected project object from the projects array
//   const selectedProjectObj = this.projects.find(project => project.id === this.projectId);

//   // Patch the project object to both forms
//   this.frm.patchValue({
//       project: selectedProjectObj  // Patch the entire object
//   });

//   this.editFrm.patchValue({
//       project: selectedProjectObj  // Patch the entire object
//   });

//   // Validate if project details already exist
//   const customerId = this.frm.get('customerId')?.value;
//   const editCustomerId = this.editFrm.get('customerId')?.value;

//   this.projectDetailsService.getAllProjectDetails().subscribe((Response: ProjectDetails[]) => {
//       this.projectData = Response;

//       // Check if project details already exist for both forms
//       const projectDetailsExist = this.projectData.some(project =>
//           project.customerId === customerId && project.projectId === this.projectId
//       );
//       const editProjectDetailsExist = this.projectData.some(project =>
//           project.customerId === editCustomerId && project.projectId === this.projectId
//       );

//       // Set form errors if project details already exist for 'frm'
//       if (projectDetailsExist) {
//           this.frm.get('customer')?.setErrors({ 'alreadyExists': true });
//           this.frm.get('project')?.setErrors({ 'alreadyExists': true });
//       }

//       // Set form errors if project details already exist for 'editFrm'
//       if (editProjectDetailsExist) {
//           this.editFrm.get('customer')?.setErrors({ 'alreadyExists': true });
//           this.editFrm.get('project')?.setErrors({ 'alreadyExists': true });
//       }
//   });
// }


  
  // onSave(frm: any) {
  //   console.log(frm);
  //   if (this.frm.valid) {
  //     const formData = new FormData();
  //    formData.append('Customer', this.frm.value.customer);
  //     formData.append('Project', this.frm.value.project);
  //     formData.append('ProjectComplexity', this.frm.value.projectComplexity);
  //     formData.append('Status', this.frm.value.status);   
  //     formData.append('Remarks', this.frm.value.remarks);
  //     formData.append('UserId', '1');
 
  //   this.complexityService.addComplexity(formData).subscribe((data:any)=>{
  //     this.frm.reset();
  //     this.ngOnInit();
  //     this.visible = false;
  //   },
  // );
  
  //     this.messageService.add({ severity: 'success', summary: 'Complexity Added' });
  //     this.visible = false;
  //   }
  //   else{
  //     this.messageService.add({ severity: 'error', summary: 'Form Invalid', detail: 'Fill necessary details!!!' });
  //   }
    
  // }
  onSave(frm: any) {
    console.log(frm);
    if (this.frm.valid) {
        const formData = new FormData();
        // Append customer and project data along with their IDs
        formData.append('CustomerId', this.customerId);  // Assuming 'customerId' holds the ID
        formData.append('Customer', this.customerName);
        formData.append('ProjectId', this.projectId);  // Assuming 'projectId' holds the ID
        formData.append('Project', this.projectName);
        formData.append('ProjectComplexity', this.frm.value.projectComplexity);
        formData.append('Status', this.frm.value.status);
        formData.append('Remarks', this.frm.value.remarks);

        this.complexityService.addComplexity(formData).subscribe(() => {
            this.frm.reset();
            this.ngOnInit();
            this.visible = false;
        });
        this.messageService.add({ severity: 'success', summary: 'Complexity Added' });
        this.visible = false;
    } else {
        this.messageService.add({ severity: 'error', summary: 'Form Invalid', detail: 'Fill necessary details!!!' });
    }
}


  editComplexity(id: number){
    console.log(id,"Comp ID");
    this.selectedPId = id;
    this.editDialog= true;
    this.complexityService.getComplexityById(id).subscribe((response: any) => {
      this.editComplexityData = response;
      this.customerId = response.customerId
      this.projectId = response.projectId
      console.log(this.customerId, this.projectId,"projectUvgv");
      
      console.log(response,"respoooo");
      console.log(this.clients.find(c => c.id === this.customerId),"idClientMatch");
     
      this.projectService.getAllAmsProject(this.customerId).subscribe((data: any) => {
        this.projects = data;  // Update the projects list
  
    console.log(this.projects?.find(c => c.id === this.projectId),"IdProjectMatch");
    this.editFrm.patchValue({
      id: response.id,
      customerId: this.customerId,
      customer: this.clients?.find(c => c.id === this.customerId),
      projectId: this.projectId,
      project: this.projects?.find(c => c.id === this.projectId),
      projectComplexity: response.projectComplexity,
      status: response.status,
      remarks: response.remarks == 'null' ? '': response.remarks
    });
       });
    this.editDialog = true;
  }
)}
    
  onUpdate(editFrm: FormGroup) {
    console.log(editFrm,"editform");
    if (this.editFrm.valid) {
      console.log(this.editFrm.value,"editform")
      const data = {
        "id": this.selectedPId,
        'customer': this.editFrm.value.customer.clientName,
        'customerId': this.customerId,
        'projectId': this.projectId,
        'project': this.editFrm.value.project.projectName,
        'projectComplexity': this.editFrm.value.projectComplexity,
        'remarks': this.editFrm.value.remarks,
        'status': this.editFrm.value.status
      }
      console.log(data,"dsata");
      
      this.complexityService.editComplexity(data).subscribe(() => {
        this.editFrm.reset();
        this.ngOnInit();
        this.editDialog = false;
        this.messageService.add({ severity: 'success', summary: 'Complexity Updated.' });
      });
    }
    else {
      this.messageService.add({ severity: 'error', summary: 'Form Invalid', detail: 'Fill necessary details.' });
    }
  }
  getClientById(id: number): Client | null {
    if (!id || typeof id !== 'number') {
      console.error('Invalid ID provided to getClientById:', id);
      return null;
    }
  
    for (const client of this.clients) {
      if (id === client.id) {
        return client;
      }
    }
  return { id:0, clientId: '', clientName: '' };
}

getProjectById(id: number): Projects {
for (const project of this.projects) {
  if (id === project.id) { 
    
      return project; // Return the correct client object
  }
}
return { id:0, clientId: '', projectId:'',projectName: '' };
}

getSeverity(status: number):string {
    switch (status) {
        case 1:
            return 'success';
        case 0:
            return 'danger';
        default:
      return 'danger';
    }
}

}