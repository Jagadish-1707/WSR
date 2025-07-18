import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { RoleService } from '../../services/role.service';

@Component({
  selector: 'app-roleedit',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    CalendarModule,
    HttpClientModule,
    DropdownModule,
  ],
  templateUrl: './roleedit.component.html',
  styleUrl: './roleedit.component.scss',
})
export class RoleeditComponent implements OnInit {
  date: Date | undefined;
  rolesuccess: number = 0;
  roleData: any;
  apiDatetime: string = '';
  public roleStatus: string = '';
  public startDate: Date = new Date();
  public endDate: Date = new Date();
  public id: number = 0;
  initialStatus: string = ''; // Initial status, you can set it to 'active' or 'inactive'
  options: any[] = [
    { label: 'Active', value: '1' },
    { label: 'In Active', value: '0' },
  ];

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private roleService: RoleService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get(
      'id'
    ) as unknown as number;
    // alert(this.id);
    this.roleService.getRoleById(this.id).subscribe((response: any) => {
      this.roleData = response;
      // if(this.roleData.status==1){
      //   this.roleStatus='Active';
      // }else{
      //   this.roleStatus='In Active';
      // }
      this.initialStatus = this.roleData.status;
      this.roleStatus = this.initialStatus;
      this.apiDatetime = response.startDate;
      this.startDate = new Date(this.apiDatetime);
      this.apiDatetime = response.endDate;
      this.endDate = new Date(this.apiDatetime);

      // alert(this.endDate);
    });
  }

  frm: FormGroup = new FormGroup({
    Id: new FormControl('', Validators.required),
    RoleName: new FormControl('', Validators.required),
    Description: new FormControl('', Validators.required),
    StartDate: new FormControl('', Validators.required),
    EndDate: new FormControl('', Validators.required),
    Status: new FormControl('', Validators.required),
    // UserId: new FormControl("",Validators.required)
  });
  public get Id(): FormControl {
    return this.frm.get('Id') as FormControl;
  }
  public get RoleName(): FormControl {
    return this.frm.get('RoleName') as FormControl;
  }
  public get Description(): FormControl {
    return this.frm.get('Description') as FormControl;
  }
  public get StartDate(): FormControl {
    return this.frm.get('StartDate') as FormControl;
  }
  public get EndDate(): FormControl {
    return this.frm.get('EndDate') as FormControl;
  }
  public get Status(): FormControl {
    return this.frm.get('Status') as FormControl;
  }
  // public get user():FormControl{
  //   return this.frm.get("user") as FormControl;
  // }

  onback() {
    this.router.navigateByUrl('/roledetail');
  }
  onSave() {
    // if (this.frm.value.Status.value==null){
    //   alert("Please Select Status");
    // }
    // else
    // {
    // const addtype = new FormData();
    // addtype.append('Id', this.frm.value.Id);
    // addtype.append('RoleName', this.frm.value.RoleName);
    // addtype.append('Description', this.frm.value.Description);
    // addtype.append('UserId', "1");
    // if (this.frm.value.Status.value == "1") {
    //   addtype.append('Status', "1");
    // } else {
    //   addtype.append('Status', "0");
    // }
    // addtype.append('StartDate',
    //   this.frm.value.StartDate != null
    //     ? this.datePipe.transform(
    //       this.frm.value.StartDate.toUTCString()
    //     )
    //     : this.frm.value.StartDate.toUTCString()
    // );
    // addtype.append('EndDate',
    //   this.frm.value.EndDate != null
    //     ? this.datePipe.transform(
    //       this.frm.value.EndDate.toUTCString()
    //     ) || ''
    //     : ''
    // );
    // this.roleService.editRole(addtype).subscribe(() => {
    //   this.rolesuccess = 1;
    //   this.router.navigateByUrl("/roledetail");
    // },
    //   () => {
    //     this.rolesuccess = 2;
    //   });
    // }
  }
}
