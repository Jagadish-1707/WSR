import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { StyleClassModule } from 'primeng/styleclass';
import { LoginService } from '../../services/login.service';
import { RoleService } from '../../../master/services/role.service';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    CommonModule,
    DialogModule,
    StyleClassModule,
  ],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
})
export class NavigationComponent implements OnInit {
  @Input() sidebarCollapsed = false;
  userRole: string = 'Manager';
  userDetails: any;
  roleModel: any[] = [];
  roleId!: number;
  selectedPermissions: { [key: string]: boolean } = {};
  expandedItems: { [key: string]: boolean } = {};

  menu: MenuItem[] = [];

  constructor(private router: Router,
    private loginservice: LoginService,
    private roleService: RoleService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    // const userRole = localStorage.getItem('role');    

    this.menu = [
      { label: 'Dashboard', path: 'dashboard', icon: 'dashboard' },
      { label: 'Projects', path: 'projects', icon: 'work' },
      { label: 'Project Configuration', path: 'project-configuration', icon: 'folder_managed' },
      { label: 'Metrics', path: 'metrics', icon: 'analytics' },
      //{ label: 'Timesheets', path: 'timesheets', icon: 'pending_actions' }, 
      {label: 'WSR',path:'wsrreport',icon:'analytics'},
      {
        label: 'Settings',
        icon: 'settings',
        children: [
          // { name: 'Application Role', path: 'roles', icon: 'security' },
          // { name: 'Manage User', path: 'manageuser', icon: 'person_search'},
          { label: 'Resolution SLA', path: 'resolution-sla', icon: 'contract' },
          { label: 'Response SLA', path: 'response-sla', icon: 'contract' },
          { label: 'Priority', path: 'priority', icon: 'low_priority' },
          { label: 'Project type', path: 'project-type', icon: 'category' },
          { label: 'Engagement Mode', path: 'engagement-mode', icon: 'format_list_bulleted' },
          { label: 'Metrics Master', path: 'metrics-master', icon: 'assessment' },
          { label: 'Metrics Column', path: 'metrics-column', icon: 'add_chart' },
          { label: 'Fields Selection', path: 'fields-selection', icon: 'checklist', },
        ],
        path: '',
      },
    ]

    this.userDetails = JSON.parse(localStorage.getItem("userLogin")!);
    this.userDetails = this.userDetails.data;
    this.roleId = this.userDetails.roleId;
    const currentPath = this.router.url.replace('/', '').toLowerCase();
    for (const item of this.menu) {
      if (item.children?.some(child => child.path?.toLowerCase() === currentPath)) {
        this.expandedItems[item.label] = true;
      }
    }

    this.cdr.detectChanges();
  }

  toggleExpand(label: string): void {
    this.expandedItems[label] = !this.expandedItems[label];
    console.log('Expanded Items:', this.expandedItems);
  }


  hasVisibleChildren(children?: MenuItem[]): boolean {
    if (!children) return false;
    return children.some(child => this.selectedPermissions[child.label]);
  }


  navigateToRoute(menu: MenuItem, event: Event) {
    if (menu.path !== '' && typeof menu.path === 'string') {
      const fullPath = menu.path.startsWith('/') ? menu.path : `/${menu.path}`;
      this.router.navigateByUrl(fullPath);
    }
  }

}

interface MenuItem {
  label: string;
  path?: string;
  icon?: string;
  external?: boolean;
  children?: MenuItem[];
  childCount?: any;
}
