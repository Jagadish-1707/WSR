import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CheckboxModule } from 'primeng/checkbox';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CalendarModule } from 'primeng/calendar';
import { Role } from '../../models/role';
import { RoleService } from '../../services/role.service';
import { DropdownModule } from 'primeng/dropdown';
import { ToolbarModule } from 'primeng/toolbar';
import { DialogModule } from 'primeng/dialog';
import { MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { LoginService } from '../../../shared/services/login.service';
import { TagModule } from 'primeng/tag';


@Component({
  selector: 'app-role',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    HttpClientModule,
    CalendarModule,
    DropdownModule,
    ToolbarModule,
    DialogModule,
    CheckboxModule,
    TableModule,
    InputTextareaModule,
    InputTextModule,
    ToastModule,
    TagModule
  ],
  templateUrl: './role.component.html',
  styleUrl: './role.component.scss',
})
export class RoleComponent implements OnInit {
  frm!: FormGroup;
  roleModel: any[] = [];
  rolesList: Role[] = [];
  activeRolesList: any[] = [];
  selectedPermissions: { [key: string]: boolean } = {};
  isEditMode: boolean = false;
  editRoleId: number | null = null;
  visible: boolean = false;
  date: Date | undefined;
  rolesuccess: number = 0;
  roleOptions: { label: string; value?: number }[] = [];
  permissionsVisible = false;
  selectedRoleId: number | null = null;
  userName: string = "Adhin";
  userId: string = '';
  userDetails: any;
  status?: number;
  searchValue: any;
  dt: any;
  settingsEnabled: boolean = false;
  sidebarOrder: string[] = [
    "Dashboard", "Projects", "Tasks", "Metrics", "Timesheets",
    "Settings", // Just a label, no checkbox
    "Application Role", "Manage User", "Priority", "SLA", "Complexity"
  ];



  constructor(
    private fb: FormBuilder,
    private router: Router,
    private roleService: RoleService,
    private datePipe: DatePipe,
    private messageService: MessageService,
    private loginservice: LoginService
  ) { }

  ngOnInit(): void {

    if (localStorage.getItem('showPermissionSavedMessage') === 'true') {
      this.messageService.add({
        severity: 'success',
        summary: 'Permissions Saved',
        detail: 'Selected permissions have been saved successfully.'
      });
      localStorage.removeItem('showPermissionSavedMessage'); // clean up
    }

    this.frm = this.fb.group({
      // roleId: [{ value: '', disabled: true }],
      roleName: ['', Validators.required],
      remarks: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      userId: [null], // Optional
      status: [null, Validators.required]
    });
    // this.loadRoles();
    this.getAllRoleModels();
    this.getAllRoles();
  }

  settingsSubModules: string[] = [
    "Application Role", "Manage User", "Priority", "SLA", "Complexity"
  ];

  areAllSubmodulesUncheckedBySettings: boolean = false;

  filterTable() {
    this.dt.filterGlobal(this.searchValue, 'contains');
  }

  // Check if any submodule is selected
  isAnySubmoduleChecked(): boolean {
    return this.settingsSubModules.some(key => this.selectedPermissions[key]);
  }

  // Toggle all submodules when Settings is clicked
  toggleSettingsGroup(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;

    this.settingsSubModules.forEach(key => {
      this.selectedPermissions[key] = isChecked;
    });

    this.areAllSubmodulesUncheckedBySettings = !isChecked;
  }

  // Re-evaluate parent checkbox (Settings) when any submodule is changed
  onSubmoduleChange(): void {
    // If at least one submodule is checked, allow Settings to be re-checkable
    if (this.isAnySubmoduleChecked()) {
      this.areAllSubmodulesUncheckedBySettings = false;
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

  onRoleSelected(event: any): void {
    // 'event.value' will contain the object with roleName and roleId
    const selectedRole = event.value;

    // Update form values with role name and role id
    this.frm.patchValue({
      Role: selectedRole.roleName,
      RoleId: selectedRole.roleId
    });

    console.log('Selected Role:', selectedRole);
  }




  cancelAdd() {
    this.visible = false;
    this.frm.reset();
  }
  showDialog() {
    this.frm.reset();
    this.isEditMode = false;
    this.visible = true;
  }

  hidePermissionsDialog(): void {
    this.permissionsVisible = false;
    this.selectedRoleId = null;
  }
  savePermissions(): void {

    if (this.selectedRoleId === null) {
      console.error('No role selected for permission saving.');
      return;
    }

    const modelNames = Object.keys(this.selectedPermissions).filter(
      (key) => this.selectedPermissions[key]
    );

    const requestBody = {
      roleId: this.selectedRoleId,
      modelNames: modelNames,
      createdBy: this.userName
    };

    this.roleService.savePermissions(requestBody).subscribe({
      next: () => {
        this.hidePermissionsDialog();
        localStorage.setItem('showPermissionSavedMessage', 'true');
        window.location.reload();
      },
      error: (err) => {
        console.error('Error saving permissions:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Save Failed',
          detail: 'An error occurred while saving permissions.'
        });
      }
    });
  }

  showPermissionsDialog(roleId: number): void {
    this.selectedRoleId = roleId;
    this.permissionsVisible = true;

    Object.keys(this.selectedPermissions).forEach(key => {
      this.selectedPermissions[key] = false;
    });

    this.roleService.getPermissionsByRoleId(roleId).subscribe({
      next: (res: any[]) => {
        // Sort the response based on sidebarOrder
        const orderedRes = this.sidebarOrder
          .map(name => res.find(entry => entry.modelName === name))
          .filter(entry => entry); // remove undefined if any

        orderedRes.forEach(entry => {
          this.selectedPermissions[entry.modelName] = true;
        });

        // Optional: Update your roleModel list if used in UI iteration
        this.roleModel = this.sidebarOrder
          .map(name => ({ modelName: name }))
          .filter(role => true); // adjust if needed based on real structure
      },
      error: (err) => {
        console.error('Error loading permissions for role:', err);
      }
    });
  }


  //roles for grid
  getAllRoles(): void {
    this.roleService.getAllRoles().subscribe({
      next: (res: Role[]) => {
        this.rolesList = res;
        console.log('Roles List:', this.rolesList);
      },
      error: (err) => {
        console.error('Error fetching roles:', err);
      },
    });
  }

  getAllRoleModels(): void {
    this.roleService.getAllRoleModels().subscribe({
      next: (res: any[]) => {
        this.roleModel = res;
        res.forEach(item => {
          if (!(item.modelName in this.selectedPermissions)) {
            this.selectedPermissions[item.modelName] = false;
          }
        });
      },
      error: (err) => {
        console.error('Error fetching roles:', err);
      }
    });
  }


  onEditRole(id: number): void {
    this.roleService.getRoleById(id).subscribe({
      next: (role: Role) => {
        this.visible = true;
        this.isEditMode = true;
        this.editRoleId = role.id ?? null;

        this.frm.patchValue({
          // id: role.id,
          roleName: role.roleName,
          remarks: role.remarks,
          startDate: role.startDate ? new Date(role.startDate) : null,
          endDate: role.endDate ? new Date(role.endDate) : null,
          // userId: role.createdBy ?? 0, // Use modifiedBy if needed
          userId: role.createdBy ? +role.createdBy : null,
          status: (role as any).status !== undefined && (role as any).status !== null ? (role as any).status : 1,

        });
      },
      error: (err) => {
        console.error('Error fetching role by ID:', err);
      },
    });
  }

  //Save for create and update role
  onSave() {
    if (this.frm.invalid) {
      return;
    }
    const formData: any = {
      roleName: this.frm.value.roleName,
      remarks: this.frm.value.remarks,
      startDate: this.frm.value.startDate?.toISOString(),
      endDate: this.frm.value.endDate?.toISOString(),
      status: this.frm.value.status
    };
    if (this.frm.value.userId) {
      formData.userId = this.frm.value.userId;
    }
    console.log('Form Data to be sent:', formData);
    if (this.isEditMode && this.editRoleId) {
      //edit roles
      formData.id = this.editRoleId;
      formData.status = 1;
      this.roleService.editRole(formData).subscribe({
        next: () => {
          this.visible = false;
          this.frm.reset();
          this.getAllRoles();
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Role updated successfully!',
          });
        },
        error: (err) => {
          console.error('Error updating role:', err);
        },
      });
    } else {
      //add role
      this.roleService.addRole(formData).subscribe({
        next: () => {
          this.frm.reset();
          this.visible = false;
          this.getAllRoles();
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Role added successfully!',
          });
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to add role',
          });
          console.error('Error while adding role:', err);
        },
      });


    }
  }

  displayDeleteDialog: boolean = false;
  roleToDeleteId!: number;  // Rename to roleToDeleteId for consistency

  // Method to confirm deletion, setting the ID of the role to be deleted
  confirmDelete(roleId: number): void {
    this.roleToDeleteId = roleId;
    this.displayDeleteDialog = true;
  }

  // Method to delete the role
  deleteRole(): void {
    this.displayDeleteDialog = false;

    // Retrieve the user details from local storage
    const stored = localStorage.getItem("userLogin");
    if (!stored) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'User details not found in local storage.'
      });
      return;
    }

    const userDetails = JSON.parse(stored);
    const userId = userDetails?.data?.user_Id?.toString();

    // Ensure both roleId and userId are valid
    if (!userId || !this.roleToDeleteId) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Missing user ID or role ID'
      });
      return;
    }

    // Call the service to delete the role
    this.roleService.deleteRole(this.roleToDeleteId, userId).subscribe({
      next: (result) => {
        console.log('Delete Response:', result);
        if (result) {
          this.messageService.add({
            severity: 'success',
            summary: 'Deleted',
            detail: 'Role deleted successfully.'
          });
          this.getAllRoles();  // Refresh the roles list
        }
      },
      error: (err) => {
        console.error('Error deleting role:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Failed',
          detail: 'Could not delete the role.'
        });
      }
    });
  }



}