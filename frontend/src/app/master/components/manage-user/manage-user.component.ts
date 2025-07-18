/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';
import { MultiSelectModule } from 'primeng/multiselect';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ManageUserService } from '../../services/manage-user.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CalendarModule } from 'primeng/calendar';
import { ProjectDetailsService } from '../../services/project-details.service';
import { UserService } from '../../services/user.service';
import { AssignRole } from '../../models/assignRole';
import { Role } from '../../models/role';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputTextModule } from 'primeng/inputtext';
import { User } from '../../models/user';


@Component({
  selector: 'app-manage-user',
  standalone: true,
  imports: [
    ToolbarModule,
    ButtonModule,
    DialogModule,
    ReactiveFormsModule,
    CommonModule,
    DropdownModule,
    ToastModule,
    CalendarModule,
    TableModule,
    InputTextModule,
    InputTextareaModule,
    TagModule,
    MultiSelectModule
  ],
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.scss'],
})
export class ManageUserComponent implements OnInit {
  visible: boolean = false;
  frm!: FormGroup;
  departments: { label: string; value: { departmentId: number; departmentName: string } }[] = [];
  roleOptions: { label: string, value: { roleName: string, roleId: number } }[] = [];
  usersList: any[] = [];
  employeeOptions: { label: string; value: string }[] = [];
  employeeIdOptions: { label: string; value: string }[] = [];
  isEditMode: boolean = false;
  editRoleId: number | null = null;
  mappedRoles: AssignRole[] = [];
  filteredRoles: AssignRole[] = [];
  mappedUser: User[] = [];
  mappedRole: DetailedAssignRole[] = [];
  displayDialog: boolean = false;
  selectedEmployees: { employeeId: string; department: string; employee: string }[] = [];
  selectedRoleName: string = '';
  filteredUsersList: User[] = [];
  status?: number;
  searchValue: any;
  dt: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    private manageUserService: ManageUserService,
    private projectService: ProjectDetailsService,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.frm = this.fb.group({
      Role: [null, Validators.required],
      Department: ['', Validators.required],
      Employee: [[], Validators.required],
      StartDate: [new Date(), Validators.required],
      EndDate: [new Date(), Validators.required],
      Remarks: [''],
      userId: [null],
      status: [null, Validators.required]
    });

    this.loadRoles();
    this.loadDepartments();
    this.loadUsers();
    this.getAllAssignedRoles();
  }
  filterTable() {
    this.dt.filterGlobal(this.searchValue, 'contains');
  }

  // employee ID and employee names for dropdown
  public loadUsers(): void {
    this.userService.getAllUser().subscribe((res: User[]) => {
      this.mappedUser = res;
      this.usersList = res;

      // Initially show all users or none
      this.filteredUsersList = [];
      // If needed elsewhere
      this.employeeOptions = this.usersList.map((u) => ({
        label: `${u.userName} (ID: ${u.employee_ID})`,
        value: u.userName,
      }));
    });
  }


  getSeverity(status: number): string {
    switch (status) {
      case 1:
        return 'success';
      case 0:
        return 'warning';
      default:
        return 'danger';
    }
  }

  // Assuming you have access to today's date
  getStatusBasedOnEndDate(emp: any): { status: string, severity: string } {
    const today = new Date();
    const endDate = new Date(emp.endDate);

    // If today's date is greater than the end date, mark as Inactive
    if (today > endDate) {
      return { status: 'Inactive', severity: 'danger' }; // Inactive with "danger" severity
    } else {
      // Otherwise, keep the status as Active
      return { status: 'Active', severity: 'success' }; // Active with "success" severity
    }
  }



  // to get employee ID when employee name is selected
  onEmployeeSelected(event: any): void {
    const selectedUserName = event.value; // The value is userName from the dropdown
    const selectedUser = this.usersList.find(
      (user) => user.userName === selectedUserName
    );

    if (selectedUser) {
      this.frm.patchValue({ EmployeeID: selectedUser.employee_ID });
    }
  }

  // departments for dropdown
  loadDepartments(): void {
    this.manageUserService.getDepartments().subscribe({
      next: (res) => {
        this.departments = res.map(d => ({
          label: d.departmentName,
          value: { departmentId: d.departmentId, departmentName: d.departmentName }
        }));
      },
      error: (err) => {
        console.error('Failed to fetch departments', err);
      }
    });
  }

  loadRoles(): void {
    this.manageUserService.getRoles().subscribe((roles: any[]) => {
      this.roleOptions = roles
        .filter(role => role.active === true) // Only active roles
        .map((role) => ({
          label: role.roleName,
          value: {
            roleName: role.roleName,
            roleId: role.id,
          }
        }));

    });
  }

  cancelAdd() {
    this.visible = false;
    this.frm.reset();
  }

  showDialog() {
    this.frm.reset();
    this.visible = true;
    this.isEditMode = false;
  }

  showDialogs(role: string): void {
    this.selectedRoleName = role;

    this.manageUserService.getAllAssignRoles().subscribe((res: any[]) => {
      this.selectedEmployees = res
        .filter(emp => emp.role === role)
        .map(emp => ({
          employeeId: emp.employeeId,
          department: emp.department,
          employee: emp.employee,
          status: emp.status,
          startDate: emp.startDate,
          endDate: emp.endDate,

        }));

      this.displayDialog = true;
    });
  }

  getAllAssignedRoles(): void {
    this.manageUserService.getAllAssignRoles().subscribe({
      next: (res: any[]) => {
        if (Array.isArray(res)) {
          const groupedMap = new Map<string, DetailedAssignRole>();

          // Get active role names from `roleOptions`
          const activeRoleNames = this.roleOptions.map(r => r.label);

          // Filter assigned roles based on active role names
          const activeRoles = res.filter(item =>
            item.active === true && activeRoleNames.includes(item.role)
          );

          activeRoles.forEach((item) => {
            if (!groupedMap.has(item.role)) {
              groupedMap.set(item.role, {
                id: item.id,
                role: item.role,
                employeeCount: 1,
                status: item.status,
                employeeId: item.employeeId,
                employee: item.employee,
                department: item.department,
                startDate: item.startDate,
                endDate: item.endDate
              });
            } else {
              const existing = groupedMap.get(item.role)!;
              existing.employeeCount += 1;
            }
          });

          this.mappedRole = Array.from(groupedMap.values());
        } else {
          console.error('Invalid response:', res);
        }
      },
      error: (err) => {
        console.error('Error fetching assigned roles:', err);
      }
    });
  }

  onDepartmentChange(selectedDepts: any[]): void {
    if (!Array.isArray(selectedDepts)) {
      selectedDepts = [selectedDepts];
    }

    const selectedDeptIds = selectedDepts.map(d => d.departmentId);
    const selectedDeptMap = new Map(
      selectedDepts.map(d => [d.departmentId, d.departmentName])
    );

    this.filteredUsersList = this.usersList
      .filter(user => selectedDeptIds.includes(user.deptId))
      .map(user => ({
        ...user,
        department: selectedDeptMap.get(user.deptId) || 'Unknown'
      }));

    this.frm.get('Employee')?.setValue([]);
  }


  onSave() {
    if (this.frm.invalid) {
      return;
    }

    const selectedRole = this.frm.value.Role;

    const formData: any = {
      role: selectedRole?.roleName || '',
      roleId: selectedRole?.roleId || 0,
      startDate: this.frm.value.StartDate
        ? new Date(this.frm.value.StartDate).toISOString()
        : '',
      endDate: this.frm.value.EndDate
        ? new Date(this.frm.value.EndDate).toISOString()
        : '',
      remarks: this.frm.value.Remarks || '',
      userId: this.frm.value.userId || 0,
      employees: [],
      status: this.frm.value.status
    };

    const selectedEmployees = this.frm.value.Employee;        // array of users
    const selectedDepts = this.frm.value.Department || [];    // array of dept objects

    formData.employees = selectedEmployees.map((emp: any) => {
      const matchingDept = selectedDepts.find(
        (dept: any) => dept.departmentId === emp.deptId
      );

      return {
        employeeID: emp.employee_ID || emp.EmployeeID,
        employeeName: emp.userName || emp.EmployeeName,
        department: matchingDept?.departmentName || 'Unknown'
      };
    });


    if (this.isEditMode && this.editRoleId) {
      formData.id = this.editRoleId;
      //formData.status = 1;
      console.log(" Edit=>", formData);

      this.manageUserService.editAssignRole(formData).subscribe({
        next: () => {
          this.visible = false;
          this.frm.reset();
          this.getAllAssignedRoles();
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Assigned role updated successfully!',
          });
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update assigned role',
          });
        },
      });
    } else {
      console.log("Form Data=>", formData);

      this.manageUserService.addAssignRole(formData).subscribe({
        next: () => {
          this.frm.reset();
          this.visible = false;
          this.getAllAssignedRoles();
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Assigned role successfully!',
          });
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to add assigned role',
          });
        },
      });
    }
  }




  onEditAssignedRole(id: number): void {
    this.manageUserService.GetAssignRoleById(id).subscribe({
      next: (assignedRole: AssignRole) => {
        this.visible = true;
        this.isEditMode = true;
        this.editRoleId = assignedRole.id ?? null;

        const matchedRole = this.roleOptions.find(
          (r) => r.value.roleName === assignedRole.role
        );

        const assignedRoleId = matchedRole?.value.roleId;

        // Get all roles with same roleId to find all employees under this role
        this.manageUserService.getAllAssignRoles().subscribe((allRoles: AssignRole[]) => {
          const matchingRoles = allRoles.filter(r => r.roleId === assignedRoleId);

          // Extract distinct departments used in this role assignment
          const matchedDepartments = this.departments
            .filter(dept => matchingRoles.some(r => r.department === dept.label))
            .map(dept => dept.value); // array of { departmentId, departmentName }

          // Patch Role & Departments
          this.frm.patchValue({
            Role: matchedRole?.value || null,
            Department: matchedDepartments,
            StartDate: assignedRole.startDate ? new Date(assignedRole.startDate) : null,
            EndDate: assignedRole.endDate ? new Date(assignedRole.endDate) : null,
            Remarks: assignedRole.remarks,
            userId: assignedRole.createdBy ? +assignedRole.createdBy : null,
            status: (assignedRole as any).status !== undefined && (assignedRole as any).status !== null ? (assignedRole as any).status : 1,
          });


          this.onDepartmentChange(matchedDepartments);


          setTimeout(() => {
            const selectedEmployees = this.filteredUsersList.filter(user =>
              matchingRoles.some(r =>
                r.employeeId === user.employee_ID && r.employee === user.userName
              )
            );

            this.frm.patchValue({
              Employee: selectedEmployees
            });
          }, 0);
        });
      },
      error: (err) => {
        console.error('Error fetching assigned role by ID:', err);
      }
    });
  }

}

export interface DetailedAssignRole {
  id?: number;
  role: string;
  employeeCount: number;
  status: number;
  employeeId: string;
  department: string;
  employee: string;
  startDate: Date;
  endDate: Date;
}