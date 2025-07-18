using backend.DtoModels;
using backend.Models;
using System.Data.Common;
using System.Threading.Tasks;

namespace backend.Common
{
    public partial class UnitOfWork : IDisposable
    {
        private readonly ApplicationDbContext _context;
        public ApplicationDbContext Context => _context;

        private GenericRepository<Organization> _organizationRepository;
        private GenericRepository<Role> _roleRepository;
        private GenericRepository<Roles> _rolesRepository;
        private GenericRepository<LoginOTP> _loginRepository;
        private GenericRepository<Users> _usersRepository;
        private GenericRepository<Projects> _projectsRepository;
        private GenericRepository<SLA> _slaRepository;
        private GenericRepository<ResponseSLA> _responseslaRepository;
        private GenericRepository<Tickettype> _ticketTypeRepository;
        private GenericRepository<ProjectDetails> _projectDetailsRepository;
        private GenericRepository<TaskDetails> _taskDetailsRepository;
        private GenericRepository<ProjectAttachment> _projectAttachmentRepository;
        private GenericRepository<TaskAttachment> _taskAttachmentRepository;
        private GenericRepository<MetricsDetails> _metricsDetailsRepository;
        private GenericRepository<MetricsDetailsFieldValues> _ticketDetailsRepository;
        private GenericRepository<TicketAssignedTo> _ticketAssignedToRepository;
        private GenericRepository<WorkedBy> _workedByRepository;
        private GenericRepository<ClosedBy> _closedByRepository;
        private GenericRepository<DevMetrics> _devMetricsRepository;
        private GenericRepository<GeneralMetrics> _generalMetricsRepository;
        private GenericRepository<SupportMetrics> _supportMetricsRepository;
        private GenericRepository<TestingMetrics> _testingMetricsRepository;
        private GenericRepository<AssignedTo> _assignedToRepository;
        private GenericRepository<Priviliges> _priviligesRepository;
        private GenericRepository<Priority> _priorityRepository;
        private GenericRepository<Client> _clientRepository;
        private GenericRepository<Complexity> _complexityRepository;
        private GenericRepository<Timesheets> _timesheetRepository;
        private GenericRepository<DevelopmentMetrics> _developmentMetricsRepository;
        private GenericRepository<DevelopmentTask> _developmentTaskRepository;
        private GenericRepository<DevelopmentMetricsDto> _updatedevelopmentMetricsRepository;
        //private GenericRepository<ResourceAllocation> _resourceAllocation;
        private GenericRepository<AssignRole> _assignRoleRepository;
        private GenericRepository<Departments> _departmentsRepository;
        private GenericRepository<RoleModels> _roleModleRepository;
        private GenericRepository<ProjectTypeMaster> _projectTypeMasterRepository;
        private GenericRepository<MetricsMaster> _metricsMasterRepository;
        private GenericRepository<ProjectMode> _projectengagementmodeRepository;
        private GenericRepository<GeneralMetricsMaster> _generalMetricsMasterRepository;

        private GenericRepository<MetricProjectColumns> _metricsprojectfieldRepository;
        private GenericRepository<ProjectTypeMetricSelection> _projectTypeMetricSelectionRepository;
        private GenericRepository<SelectionCheckBoxOption> _selectionCheckBoxOptionRepository;

        private GenericRepository<TaskMetrics> _taskMetricsRepository;
        private GenericRepository<WSRProjectDetails> _wsrProjectDetailsRepository;
        private GenericRepository<WSRProjectStatus> _wsrProjectStatusRepository;
        private GenericRepository<WSRReport> _wsrReportRepository;
        private GenericRepository<ZohoProject> _zohoProjectRepository;
        private GenericRepository<WSRTask> _wsrTasksRepository;
        private GenericRepository<WSRIssues> _wsrIssuesRepository;
        private GenericRepository<WSRKeyRisks> _wsrKeyRisksRepository;



        public UnitOfWork(IConfiguration configuration)
        {
            _context = new ApplicationDbContext(configuration);
        }

        public async Task SaveAsync()
        {
            await _context.SaveChangesAsync();
        }
        public GenericRepository<ProjectTypeMetricSelection> ProjectTypeMetricSelectionRepository
        {
            get
            {
                if (this._projectTypeMetricSelectionRepository == null)
                    this._projectTypeMetricSelectionRepository = new GenericRepository<ProjectTypeMetricSelection>(_context);
                return _projectTypeMetricSelectionRepository;
            }
        }

        public GenericRepository<SelectionCheckBoxOption> SelectionCheckBoxOptionRepository
        {
            get
            {
                if (this._selectionCheckBoxOptionRepository == null)
                    this._selectionCheckBoxOptionRepository = new GenericRepository<SelectionCheckBoxOption>(_context);
                return _selectionCheckBoxOptionRepository;
            }
        }

        public GenericRepository<ProjectMode> ProjectengagementmodeRepository
        {
            get
            {
                if (this._projectengagementmodeRepository == null)
                    this._projectengagementmodeRepository = new GenericRepository<ProjectMode>(_context);
                return _projectengagementmodeRepository;
            }
        }
        public GenericRepository<MetricProjectColumns> MetricsprojectfieldRepository
        {
            get
            {
                if (this._metricsprojectfieldRepository == null)
                    this._metricsprojectfieldRepository = new GenericRepository<MetricProjectColumns>(_context);
                return _metricsprojectfieldRepository;
            }
        }

        public GenericRepository<Organization> OrganizationRepository
        {
            get
            {
                if (this._organizationRepository == null)
                    this._organizationRepository = new GenericRepository<Organization>(_context);
                return _organizationRepository;
            }
        }

        public GenericRepository<RoleModels> RoleModelsRepository
        {
            get
            {
                if (this._roleModleRepository == null)
                    this._roleModleRepository = new GenericRepository<RoleModels>(_context);
                return _roleModleRepository;
            }
        }

        public GenericRepository<Role> RoleRepository
        {
            get
            {
                if (this._roleRepository == null)
                    this._roleRepository = new GenericRepository<Role>(_context);
                return _roleRepository;
            }
        }

        public GenericRepository<Roles> RolesRepository
        {
            get
            {
                if (this._rolesRepository == null)
                    this._rolesRepository = new GenericRepository<Roles>(_context);
                return _rolesRepository;
            }
        }

        public GenericRepository<Departments> DepartmentsRepository
        {
            get
            {
                if (this._departmentsRepository == null)
                    this._departmentsRepository = new GenericRepository<Departments>(_context);
                return _departmentsRepository;
            }
        }
        public GenericRepository<LoginOTP> LoginRepository
        {
            get
            {
                if (this._loginRepository == null)
                    this._loginRepository = new GenericRepository<LoginOTP>(_context);
                return _loginRepository;
            }
        }
        public GenericRepository<Users> UsersRepository
        {
            get
            {
                if (this._usersRepository == null)
                    this._usersRepository = new GenericRepository<Users>(_context);
                return _usersRepository;
            }
        }
        public GenericRepository<Projects> ProjectsRepository
        {
            get
            {
                if (this._projectsRepository == null)
                    this._projectsRepository = new GenericRepository<Projects>(_context);
                return _projectsRepository;
            }
        }
        public GenericRepository<SLA> SLARepository
        {
            get
            {
                if (this._slaRepository == null)
                    this._slaRepository = new GenericRepository<SLA>(_context);
                return _slaRepository;
            }
        }
        
        public GenericRepository<Tickettype> TicketTypeRepository
        {
            get
            {
                if (this._ticketTypeRepository == null)
                    this._ticketTypeRepository = new GenericRepository<Tickettype>(_context);
                return _ticketTypeRepository;
            }
        }

        public GenericRepository<ResponseSLA> ResponseSLARepository
        {
            get
            {
                if (this._responseslaRepository == null)
                    this._responseslaRepository = new GenericRepository<ResponseSLA>(_context);
                return _responseslaRepository;
            }
        }
        
        public GenericRepository<ProjectDetails> ProjectDetailsRepository
        {
            get
            {
                if (this._projectDetailsRepository == null)
                    this._projectDetailsRepository = new GenericRepository<ProjectDetails>(_context);
                return _projectDetailsRepository;
            }
        }

        public GenericRepository<ProjectAttachment> ProjectAttachmentRepository
        {
            get
            {
                if (_projectAttachmentRepository == null)
                    _projectAttachmentRepository = new GenericRepository<ProjectAttachment>(_context);
                return _projectAttachmentRepository;
            }
        }
        public GenericRepository<TaskDetails> TaskDetailsRepository
        {
            get
            {
                if (this._taskDetailsRepository == null)
                    this._taskDetailsRepository = new GenericRepository<TaskDetails>(_context);
                return _taskDetailsRepository;
            }
        }
        public GenericRepository<Timesheets> TimesheetRepository
        {
            get
            {
                if (this._timesheetRepository == null)
                    this._timesheetRepository = new GenericRepository<Timesheets>(_context);
                return _timesheetRepository;
            }
        }
        public GenericRepository<DevelopmentMetrics> DevelopmentMetricsRepository
        {
            get
            {
                if (this._developmentMetricsRepository == null)
                    this._developmentMetricsRepository = new GenericRepository<DevelopmentMetrics>(_context);
                return _developmentMetricsRepository;
            }
        }
        public GenericRepository<DevelopmentMetricsDto> UpdateDevelopmentMetricsRepository
        {
            get
            {
                if (this._updatedevelopmentMetricsRepository == null)
                    this._updatedevelopmentMetricsRepository = new GenericRepository<DevelopmentMetricsDto>(_context);
                return _updatedevelopmentMetricsRepository;
            }
        }
        public GenericRepository<DevelopmentTask> DevelopmentTaskRepository
        {
            get
            {
                if (this._developmentTaskRepository == null)
                    this._developmentTaskRepository = new GenericRepository<DevelopmentTask>(_context);
                return _developmentTaskRepository;
            }
        }


        public GenericRepository<TaskAttachment> TaskAttachmentRepository
        {
            get
            {
                if (this._taskAttachmentRepository == null)
                    this._taskAttachmentRepository = new GenericRepository<TaskAttachment>(_context);
                return _taskAttachmentRepository;
            }
        }
        public GenericRepository<DevMetrics> DevMetricsRepository
        {
            get
            {
                if (this._devMetricsRepository == null)
                    this._devMetricsRepository = new GenericRepository<DevMetrics>(_context);
                return _devMetricsRepository;
            }
        }
        public GenericRepository<SupportMetrics> SupportMetricsRepository
        {
            get
            {
                if (this._supportMetricsRepository == null)
                    this._supportMetricsRepository = new GenericRepository<SupportMetrics>(_context);
                return _supportMetricsRepository;
            }
        }
        public GenericRepository<TestingMetrics> TestingMetricsRepository
        {
            get
            {
                if (this._testingMetricsRepository == null)
                    this._testingMetricsRepository = new GenericRepository<TestingMetrics>(_context);
                return _testingMetricsRepository;
            }
        }
        public GenericRepository<GeneralMetrics> GeneralMetricsRepository
        {
            get
            {
                if (this._generalMetricsRepository == null)
                    this._generalMetricsRepository = new GenericRepository<GeneralMetrics>(_context);
                return _generalMetricsRepository;
            }
        }
        public GenericRepository<AssignedTo> AssignedToRepository
        {
            get
            {
                if (this._assignedToRepository == null)
                    this._assignedToRepository = new GenericRepository<AssignedTo>(_context);
                return _assignedToRepository;
            }
        }
        public GenericRepository<MetricsDetails> MetricsDetailsRepository
        {
            get
            {
                if (this._metricsDetailsRepository == null)
                    this._metricsDetailsRepository = new GenericRepository<MetricsDetails>(_context);
                return _metricsDetailsRepository;
            }
        }
        public GenericRepository<MetricsDetailsFieldValues> TicketDetailsRepository
        {
            get
            {
                if (this._ticketDetailsRepository == null)
                    this._ticketDetailsRepository = new GenericRepository<MetricsDetailsFieldValues>(_context);
                return _ticketDetailsRepository;
            }
        }
        public GenericRepository<TicketAssignedTo> TicketAssignedToRepository
        {
            get
            {
                if (this._ticketAssignedToRepository == null)
                    this._ticketAssignedToRepository = new GenericRepository<TicketAssignedTo>(_context);
                return _ticketAssignedToRepository;
            }
        }
        public GenericRepository<ClosedBy> ClosedByRepository
        {
            get
            {
                if (this._closedByRepository == null)
                    this._closedByRepository = new GenericRepository<ClosedBy>(_context);
                return _closedByRepository;
            }
        }


        public GenericRepository<WorkedBy> WorkedByRepository
        {
            get
            {
                if (this._workedByRepository == null)
                    this._workedByRepository = new GenericRepository<WorkedBy>(_context);
                return _workedByRepository;
            }
        }

        public GenericRepository<Priviliges> PriviligesRepository
        {
            get
            {
                if (this._priviligesRepository == null)
                    this._priviligesRepository = new GenericRepository<Priviliges>(_context);
                return _priviligesRepository;
            }
        }

        public GenericRepository<Priority> PriorityRepository
        {
            get
            {
                if (this._priorityRepository == null)
                    this._priorityRepository = new GenericRepository<Priority>(_context);
                return _priorityRepository;
            }
        }
        public GenericRepository<Complexity> ComplexityRepository
        {
            get
            {
                if (this._complexityRepository == null)
                    this._complexityRepository = new GenericRepository<Complexity>(_context);
                return _complexityRepository;
            }
        }

        public GenericRepository<Client> ClientRepository
        {
            get
            {
                if (this._clientRepository == null)
                    this._clientRepository = new GenericRepository<Client>(_context);
                return _clientRepository;
            }
        }

        public GenericRepository<AssignRole> AssignRoleRepository
        {
            get
            {
                if (this._assignRoleRepository == null)
                    this._assignRoleRepository = new GenericRepository<AssignRole>(_context);
                return _assignRoleRepository;
            }
        }

        public GenericRepository<ProjectTypeMaster> ProjectTypeMasterRepository
        {
            get
            {
                if (this._projectTypeMasterRepository == null)
                    this._projectTypeMasterRepository = new GenericRepository<ProjectTypeMaster>(_context);
                return _projectTypeMasterRepository;
            }
        }

        public GenericRepository<MetricsMaster> MetricsMasterRepository
        {
            get
            {
                if (this._metricsMasterRepository == null)
                    this._metricsMasterRepository = new GenericRepository<MetricsMaster>(_context);
                return _metricsMasterRepository;
            }
        }
        public GenericRepository<GeneralMetricsMaster> GeneralMetricsMasterRepository
        {
            get
            {
                if (this._generalMetricsMasterRepository == null)
                    this._generalMetricsMasterRepository = new GenericRepository<GeneralMetricsMaster>(_context);
                return _generalMetricsMasterRepository;
            }
        }

        public GenericRepository<TaskMetrics> TaskMetricsRepository
        {
            get
            {
                if (this._taskMetricsRepository == null)
                    this._taskMetricsRepository = new GenericRepository<TaskMetrics>(_context);
                return _taskMetricsRepository;
            }
        }

        public GenericRepository<WSRProjectDetails> WSRProjectDetailsRepository
        {
            get
            {
                if (_wsrProjectDetailsRepository == null)
                    _wsrProjectDetailsRepository = new GenericRepository<WSRProjectDetails>(_context);
                return _wsrProjectDetailsRepository;
            }
        }

        public GenericRepository<WSRProjectStatus> WSRProjectStatusRepository
        {
            get
            {
                if (_wsrProjectStatusRepository == null)
                    _wsrProjectStatusRepository = new GenericRepository<WSRProjectStatus>(_context);
                return _wsrProjectStatusRepository;
            }
        }

        public GenericRepository<WSRReport> WSRReportRepository
        {
            get
            {
                if (_wsrReportRepository == null)
                    _wsrReportRepository = new GenericRepository<WSRReport>(_context);
                return _wsrReportRepository;
            }
        }

        public GenericRepository<ZohoProject> ZohoProjectRepository
        {
            get
            {
                if (this._zohoProjectRepository == null)
                    this._zohoProjectRepository = new GenericRepository<ZohoProject>(_context);
                return _zohoProjectRepository;
            }
        }

        public GenericRepository<WSRTask> WSRTaskRepository
        {
            get
            {
                if (this._wsrTasksRepository == null)
                    this._wsrTasksRepository = new GenericRepository<WSRTask>(_context);
                return _wsrTasksRepository;
            }
        }

        public GenericRepository<WSRIssues> WSRIssuesRepository
        {
            get
            {
                if (this._wsrIssuesRepository == null)
                    this._wsrIssuesRepository = new GenericRepository<WSRIssues>(_context);
                return _wsrIssuesRepository;
            }
        }

        public GenericRepository<WSRKeyRisks> WSRKeyRisksRepository
        {
            get
            {
                if (this._wsrKeyRisksRepository == null)
                    this._wsrKeyRisksRepository = new GenericRepository<WSRKeyRisks>(_context);
                return _wsrKeyRisksRepository;
            }
        }




        #region Public member methods...
        /// <summary>
        /// Save method.
        /// </summary>
        public void Save()
        {
            try
            {
                _context.SaveChanges();
            }
            catch (DbException e)
            {
                throw e;
            }

        }


        #endregion

        #region Implementing IDiosposable...

        #region private dispose variable declaration...
        private bool disposed = false;
        #endregion
        protected virtual void Dispose(bool disposing)
        {
            if (!this.disposed)
            {
                if (disposing)
                {
                    _context.Dispose();
                    _organizationRepository = null;
                }
            }
            this.disposed = true;
        }
        /// <summary>
        /// Dispose method
        /// </summary>
        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }
        #endregion
    }
}
