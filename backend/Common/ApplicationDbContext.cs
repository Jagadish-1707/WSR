using backend.DtoModels;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Common
{
    public class ApplicationDbContext : DbContext
    {
        private readonly IConfiguration _configuration;

        public ApplicationDbContext(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        public virtual DbSet<Users> Users { get; set; }
        public virtual DbSet<LoginOTP> LoginOTPs { get; set; }
        public virtual DbSet<Organization> Organization { get; set; }
        public virtual DbSet<Role> Role { get; set; }
        public virtual DbSet<Roles> Roles { get; set; }
        public virtual DbSet<TaskDetails> Tasks { get; set; }
        public virtual DbSet<AssignedTo> AssignedTo { get; set; }
        public virtual DbSet<Priviliges> Priviliges { get; set; }
        public virtual DbSet<Priority> Priority { get; set; }
        public virtual DbSet<Tickettype> TicketType { get; set; }
        public virtual DbSet<Client> Client { get; set; }
        public virtual DbSet<ProjectDetails> ProjectDetails { get; set; }
        public virtual DbSet<MetricsDetails> MetricsDetails { get; set; }
        public DbSet<MetricsDetailsFieldValues> MetricsDetailsFieldValues { get; set; }
        public virtual DbSet<ClosedBy> ClosedBy { get; set; }
        public virtual DbSet<SLA> SLAs { get; set; }
        public virtual DbSet<ResponseSLA> ResponseSLA { get; set; }
        public virtual DbSet<Complexity> Complexitys { get; set; }
        public virtual DbSet<ProjectMode> ProjectEngagementMode { get; set; }
        public virtual DbSet<MetricProjectColumns> MetricsProjectField { get; set; }
        public virtual DbSet<ProjectAttachment> UploadedFiles { get; set; }
        public virtual DbSet<Timesheets> Timesheets { get; set; }
        public virtual DbSet<DevelopmentMetrics> DevelopmentMetrics { get; set; }
        public virtual DbSet<AssignRole> AssignRole { get; set; }
        public virtual DbSet<RoleModels> RoleModels { get; set; }
        public virtual DbSet<ProjectModels> ProjectModels { get; set; }
        public virtual DbSet<Departments> Departments { get; set; }
        public DbSet<ProjectTypeMaster> ProjectTypeMaster { get; set; }
        public DbSet<MetricsMaster> MetricsMaster { get; set; }
        public DbSet<GeneralMetricsMaster> GeneralMetricsMaster { get; set; }
        public DbSet<ProjectTypeMetricSelection> ProjectTypeMetricSelection { get; set; }
        public DbSet<SelectionCheckBoxOption> SelectionCheckBoxOption { get; set; }
        public DbSet<ZohoEmp> ZohoEmp { get; set; }
        public DbSet<ZohoClient> ZohoClient { get; set; }

        public DbSet<ZohoProject> ZohoProjects { get; set; }
        public DbSet<TaskMetrics> TaskMetrics{ get; set; }
        public DbSet<WSRProjectDetails> WSRProjectDetails { get; set; }
        public DbSet<WSRProjectStatus> WSRProjectStatus { get; set; }
        //public DbSet<WSRResource> WSRResources { get; set; }
        public DbSet<WSRReport> WSRReports { get; set; }
        public DbSet<WSRTask> WSRTask { get; set; }
        public DbSet<WSRIssues> WSRKeyIssues { get; set; }
        public DbSet<WSRKeyRisks> WSRKeyRisks { get; set; }



        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            string mySqldbConnectionString = _configuration["ConnectionStrings:MySqlDatabase"]; //Local Database
            optionsBuilder.UseMySql(mySqldbConnectionString, new MySqlServerVersion(new Version(8, 0, 28)));
        }

        
    }
}
