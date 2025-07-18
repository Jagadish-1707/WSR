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
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import * as XLSX from 'xlsx';
import { SidebarModule } from 'primeng/sidebar';
import { CalendarModule } from 'primeng/calendar';
import { AddTaskComponent } from '../add-task/add-task.component';
import { Router, RouterModule } from '@angular/router';
// import { Project } from '../../models/project';
@Component({
  selector: 'app-projects',
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
    AddTaskComponent,
    CalendarModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
})
export class ProjectsComponent implements OnInit {
exportProject() {
  const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.projectData);
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Users');
  XLSX.writeFile(wb, 'Task_Details.xlsx');
}
projectData: any[]=[];
editSidebar: boolean =false;
  projectForm: any[]=[];
addproject() {
  this.addSidebarVisible = true;
}

editProject() {
  this.addSidebarVisible=false;
  this.editSidebar = true;
}


dt: any;
addSidebarVisible: any;
status: any[]=[];
selectedStatus: any;
toggleFilterbar() {
throw new Error('Method not implemented.');
}
toggleSidebar() {
throw new Error('Method not implemented.');
}
selectedCalendarView: any[]=[];
projectOptions: any[]=[];
selectedProject: any[]=[];
closeDropdown() {
throw new Error('Method not implemented.');
}
openDropdown1() {
throw new Error('Method not implemented.');
}
projects: any[]=[];
dropdownOptions: any[]=[];
selectedOption: any[]=[];
Calendardropdown: any;
onSubmit() {
    
  console.log('Form submitted!', this.projectForm.values);
}
exportTask() {
  const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.projectData);
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Users');
  XLSX.writeFile(wb, 'Task_Details.xlsx');
}

constructor( private router: Router){}
  ngOnInit() {
    this.projectData =[
      {
        project_id: 1,
        project_name: "Blueshift",
        projecttype: "null",
        client_name: "Blueshift	",
        start_date: new Date("2024-03-25T17:00:00Z"),
        end_date: new Date("2024-03-25T17:00:00Z"),
        contract_value:" ",
        status:"Pending"
      },
	  {
        project_id: 2,
        project_name: "ACORD",
        projecttype: "null",
        client_name: "ACORD	",
        start_date: new Date("2024-03-24T18:00:00Z"),
        end_date: new Date("2024-03-24T18:00:00Z"),
        contract_value:" ",
        status:"In Progress"
      },
	  {
        project_id: 3,
        project_name: "California Institute for Regenerative Medicine",
        projecttype: "null",
        client_name: "California Institute for Regenerative Medicine	",
        start_date: new Date("2024-03-24T18:00:00Z"),
        end_date: new Date("2024-03-24T18:00:00Z"),
        contract_value:" ",
        status:"Pending"
      },
      {
        project_id: 4,
        project_name: "Eclipsys Solutions Inc",
        projecttype: "null",
        client_name: "Eclipsys Solutions Inc	",
        start_date: new Date("2024-03-15T18:00:00Z"),
        end_date: new Date("2024-03-18T18:00:00Z"),
        contract_value:" ",
        status:"Completed"
      },
    ]
  }

}
