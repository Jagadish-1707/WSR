import { Routes } from '@angular/router';
import { ClientsComponent } from './master/components/clients/clients.component';
import { RoleComponent } from './master/components/role/role.component';
// import { RoledetailsComponent } from './master/components/roledetails/roledetails.component';
import { RoleeditComponent } from './master/components/roleedit/roleedit.component';
import { RoleeligibleComponent } from './master/components/roleeligible/roleeligible.component';
import { TasksComponent } from './master/components/tasks/tasks.component';
import { UserComponent } from './master/components/user/user.component';
import { LayoutComponent } from './shared/components/layout/layout.component';
import { LoginComponent } from './shared/components/login/login.component';
import { OverviewComponent } from './shared/components/overview/overview.component';
// import { AuthGuard } from './shared/services/auth.guard';
import { ProjectDetailsComponent } from './master/components/project-details/project-details.component';
import { PriorityComponent } from './master/components/priority/priority.component';
import { SlaComponent } from './master/components/sla/sla.component';
import { ComplexityComponent } from './master/components/complexity/complexity.component';
import { TimesheetsComponent } from './master/components/timesheets/timesheets.component';
import { ApprovalTimesheetComponent } from './master/components/approval-timesheet/approval-timesheet.component';
import { ManageUserComponent } from './master/components/manage-user/manage-user.component';
import { TimesheetApprovalComponent } from './master/components/timesheet-approval/timesheet-approval.component';
import { MyRequestComponent } from './master/components/my-request/my-request.component';
import { ProjectTypeComponent } from './master/components/project-type/project-type.component';
import { MetricsMasterComponent } from './master/components/metrics-master/metrics-master.component';
import { GeneralMetricsComponent } from './master/components/general-metrics/general-metrics.component';
import { MetricsProjecttypeColumnMasterComponent } from './master/components/metrics-projecttype-column-master/metrics-projecttype-column-master.component';
import { ProjectEngagementModeComponent } from './master/components/project-engagement-mode/project-engagement-mode.component';
import { MetricsProjecttypeColumnViewComponent } from './master/components/metrics-projecttype-column-view/metrics-projecttype-column-view.component';
import { MetricsMainPageComponent } from './master/components/metrics-main-page/metrics-main-page.component';
import { ResponseSlaComponent } from './master/components/response-sla/response-sla.component';
import { WSRComponent } from './master/components/wsr/wsr.component';
import { WSRDetailsComponent } from './wsr-details/wsr-details.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'dashboard', component: OverviewComponent },
      // { path: 'users', component: UserComponent },
      // { path: 'roles', component: RoleComponent },
      // { path: 'role', component: RoleComponent },
      // { path: 'manageuser', component: ManageUserComponent },
      // { path: 'roleedit/:id', component: RoleeditComponent },
      // { path: 'privilege/:id', component: RoleeligibleComponent },
      { path: 'project-configuration', component: TasksComponent },
      { path: 'engagement-mode', component: ProjectEngagementModeComponent },
      { path: 'priority', component: PriorityComponent },
      { path: 'projects', component: ProjectDetailsComponent },
      { path: 'resolution-sla', component: SlaComponent },
      { path: 'response-sla', component: ResponseSlaComponent },
      //{ path: 'complexity', component: ComplexityComponent },
      { path: 'metrics', component: MetricsMainPageComponent },
      { path: 'timesheets', component: TimesheetsComponent },
      { path: 'approval', component: ApprovalTimesheetComponent },
      { path: 'timesheets-approval', component: TimesheetApprovalComponent }, 
      { path: 'timesheets-requests', component: MyRequestComponent }, 
      { path: 'project-type', component: ProjectTypeComponent }, 
      { path: 'metrics-master', component: MetricsMasterComponent }, 
      { path: 'metrics-column', component: MetricsProjecttypeColumnMasterComponent},
      { path: 'fields-selection', component: MetricsProjecttypeColumnViewComponent},
      {path:'wsrreport',component:WSRDetailsComponent},
      {path: 'wsr/view/:id', component: WSRComponent},
      {
  path: 'wsr/view-multiple',
  component: WSRComponent
},

    ],
  },
];
