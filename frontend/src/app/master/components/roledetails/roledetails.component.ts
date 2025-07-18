// import { CommonModule } from '@angular/common';
// import { HttpClientModule } from '@angular/common/http';
// import { Component, OnInit } from '@angular/core';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { Router, RouterModule } from '@angular/router';
// import { ButtonModule } from 'primeng/button';
// import { ToolbarModule } from 'primeng/toolbar';
// import { TableModule } from 'primeng/table';
// import { RoleService } from '../../services/role.service';
// import { SidebarModule } from 'primeng/sidebar';
// import { RoleComponent } from '../role/role.component';
// import { RoleeditComponent } from '../roleedit/roleedit.component';

// @Component({
//   selector: 'app-roledetails',
//   standalone: true,
//   imports: [CommonModule,FormsModule,ReactiveFormsModule,SidebarModule,RoleeditComponent,
//   RouterModule,HttpClientModule,TableModule,ButtonModule,ToolbarModule,RoleComponent
//   ],
//   templateUrl: './roledetails.component.html',
//   styleUrl: './roledetails.component.scss'
// })
// export class RoledetailsComponent implements OnInit {
//   roles: any[] = [];
//   addSidebarVisible: boolean = false;
//   editSidebarVisible: boolean = false;
//   userId:number=0;
//   constructor(private router:Router,private roleService:RoleService){}

//   ngOnInit(): void {
//     this.userId=1;
//     this.roleService.getAllRole().subscribe(
//       (response: any) => {
//         this.roles = response;
//       },
//       (error: any) => { console.log(error) }
//     );
//   }
//   addRole(){
//     this.addSidebarVisible = true;
//     // this.router.navigateByUrl("/role");
//   }
//   onEligible(id:any){

//     this.router.navigateByUrl("/privilege/"+id);
//   }
//   editRole(id:any){
//     this.editSidebarVisible = true;
//     this.router.navigateByUrl("/roleedit/"+id);

//   }
//   viewRole(id:any){
//     alert("View Id is "+ id);
//   }
//   onDelete(id: number, userId: number): void {
//     this.roleService.deleteRole(id, userId).subscribe(
//       response => {
//         console.log('Delete successful', response);
//         this.roleService.getAllRole().subscribe(
//           (response: any) => {
//             // console.log(response);
//             this.roles = response;
//           },
//           (error: any) => { console.log(error) }
//         );
//       },
//       error => {
//         console.error('Error occurred while deleting', error);
//       }
//     );
//   }
// }
