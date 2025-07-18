/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
// import { ConfirmationService } from 'primeng/api/confirmationservice';
import * as XLSX from 'xlsx';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';




@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    ButtonModule,DialogModule,TableModule,ToolbarModule,ToastModule,DropdownModule,InputTextModule,
    InputGroupAddonModule,InputGroupModule,
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
  providers: [ConfirmationService, MessageService]
})
export class UserComponent implements OnInit{

  items: MenuItem[]=[];
  userData : User[]=[];
  users:User[]=[];
  user!: User;
  selectedUser!: User[] | null;
  submitted: boolean = false;
  statuses!: any[];
  role!: any[];
  profile!: any[];
  userDialog: boolean = true;
  newUserDialog: boolean=false;
  selectedUserRole!: string;
  selectedUserProfile! :string;
  selectedUserStatus! :string;

  constructor( private userService : UserService,
    private router: Router,
    private messageService: MessageService, 
    private confirmationService: ConfirmationService)
    {
      this.statuses = [
        { label: 'ACTIVE', value: 1 },
        { label: 'INACTIVE', value: 2 },
    ];
    this.role=[
      {label:'Administrator',value:'1'},
      {label:'Manager',value:2},
      {label:'Employee',value:3}
    ];
    this.profile=[
      {label:'Admin',value:1},
      {label:'Admin Portal',value:2},
      {label:'Employee',value:3},
      {label:'Manager',value:4}
    ]
    }

    ngOnInit() {

      this.userService.getAllUser().subscribe((Response:any)=>{
          this.userData = Response;        
        });
}

exportUser() {
  const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.userData);
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Users');
  XLSX.writeFile(wb, 'users.xlsx');
}

getFirstLetters(userName:string): string {
  const nameParts = userName.split(' ');
  const firstLetterFirstWord = nameParts[0]?.charAt(0).toUpperCase();
  let secondLetterFirstWord = nameParts[0]?.charAt(1)?.toUpperCase();

  if (nameParts.length > 1) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    secondLetterFirstWord = nameParts[1]?.charAt(0).toUpperCase();
  }

  return firstLetterFirstWord +'.'+secondLetterFirstWord ;
}



}


