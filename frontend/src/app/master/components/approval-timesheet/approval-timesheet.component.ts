import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import {  DropdownModule } from 'primeng/dropdown';
import { ToolbarModule } from 'primeng/toolbar';
import { ProjectDetailsService } from '../../services/project-details.service';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { Client } from '../../models/client';
import { Projects } from '../../models/projects';
import { ToastModule } from 'primeng/toast';
import { CalendarModule } from 'primeng/calendar';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { TimesheetService } from '../../services/timesheet.service';
import { Timesheets } from '../../models/timesheet';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ConfirmPopupModule } from 'primeng/confirmpopup';

@Component({
  selector: 'app-approval-timesheet',
  standalone: true,
  imports: [
    ButtonModule,
    ToolbarModule,
    DropdownModule,
    DialogModule,
    ToastModule,
    FileUploadModule,
    InputTextareaModule,
    CalendarModule,
    TableModule,
    CommonModule,
    ConfirmPopupModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './approval-timesheet.component.html',
  styleUrl: './approval-timesheet.component.scss'
})
export class ApprovalTimesheetComponent implements OnInit{


  status: SelectItem[]=[];
  projects: Projects[] = [];
  clients: Client[] = [];
  tableView: boolean = false;
  selectedStatus:string;
  timesheetData: any;
  timesheetMonth : string ='';
  editDialog : boolean = false;
  filteredTimesheetData: Timesheets[] = [];

  constructor(
    private confirmationService: ConfirmationService,
    private projectDetailsService: ProjectDetailsService,
    private messageService: MessageService,
    private timesheetService : TimesheetService
  ){
    this.status = [
      { label: 'All', value: 'All' },
      { label: 'Pending', value: 'Pending' },
      { label: 'Approved', value: 'Approved' },
      { label: 'Rejected', value: 'Rejected' },
      { label: 'Withdrawn', value: 'Withdrawn' },
    ];

    this.selectedStatus = 'Pending';
  }

  ngOnInit(): void {
    
   this.projectDetailsService
      .getAllProjects()
      .subscribe((Response: any) => {
        this.projects = Response;
      });      

      this.projectDetailsService
      .getAllClients()
      .subscribe((Response: any) => {
        this.clients = Response;
      });

      this.timesheetService.getTimesheets('Adhin').subscribe(
        (response: Timesheets[]) => {
          this.timesheetData = response;
          this.filterTimesheets();
          console.log(this.timesheetData); 
        },
        (error) => {
          console.error('Error fetching timesheets', error);
        }
      );
      
      
  }

  openDialog(){
    this.editDialog = true;
  }
  onStatusChange(event: any) {
    this.selectedStatus = event.value;
    this.filterTimesheets();
  }

  filterTimesheets() {
    if (this.selectedStatus === 'All') {
      this.filteredTimesheetData = this.timesheetData;
    } else {
      this.filteredTimesheetData = this.timesheetData.filter((timesheet: { timesheetStatus: string; }) => timesheet.timesheetStatus === this.selectedStatus);
    }
  }

  confirm1() {
    this.messageService.add({
      severity: 'success',
      summary: 'Timesheet Approved!',
      detail: '',
    });
    this.editDialog = !this.editDialog;


}

confirm2() {
  this.messageService.add({
    severity: 'success',
    summary: 'Timesheet Rejected!',
    detail: '',
  });
  this.editDialog = !this.editDialog;
}

  onSearchClick(){
    this.tableView=true;
  }
}
