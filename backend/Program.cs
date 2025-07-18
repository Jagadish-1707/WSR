using backend.Common;
using backend.ReposirotyService;
using backend.RepositoryInterface;
using backend.RepositoryService;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using AutoMapper;
using backend.Models;
using Microsoft.EntityFrameworkCore;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddCors();
builder.Services.AddAuthentication();
builder.Services.AddHttpClient();

builder.Services.AddScoped<UnitOfWork>();
builder.Services.AddTransient<IAdminService, AdminService>();
builder.Services.AddTransient<IEmailService, EmailService>();
builder.Services.AddTransient<IUserService, UserService>();
builder.Services.AddTransient<IProjectDetailsService, ProjectDetailsService>();
builder.Services.AddTransient<ISLAService, SLAService>();
builder.Services.AddTransient<IPriviligesService, PriviligesService>();
builder.Services.AddTransient<IPriorityService, PriorityService>();
builder.Services.AddTransient<ITasksService, TaskDetailsService>();
builder.Services.AddTransient<IMetricsService, MetricsService>();
builder.Services.AddTransient<IComplexityService, ComplexityService>();
builder.Services.AddTransient<ITimesheetService, TimesheetService>();
builder.Services.AddTransient<IDevelopmentMetricsService, DevelopmentMetricsService>();
builder.Services.AddTransient<IRoleModelRepository, RoleModelRepository>();
builder.Services.AddTransient<IMasterService, MasterService>();
builder.Services.AddTransient<OverviewService>();
builder.Services.AddTransient<IMetricsProjectColumnService, MetricsProjectColumnService>();
builder.Services.AddTransient<IWaytrackerService , WaytrackerService>();
builder.Services.AddTransient<ITaskMetricsService,TaskMetricsService >();
builder.Services.AddTransient<IWSRReportService, WSRReportService>();




builder.Services.Configure<ZohoAuthSettings>(builder.Configuration.GetSection("ZohoAuth"));

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddAutoMapper(typeof(MappingProfile));

var key = Encoding.ASCII.GetBytes("metrixmanagement@excelencia");

builder.Services.AddAuthentication(x =>
{
    x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(x =>
{
    x.ClaimsIssuer = "mms";
    x.SaveToken = true;
    x.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidIssuer = "mms",
        ValidAudience = "mms",
        RequireExpirationTime = false,
        ValidateLifetime = false,
        ClockSkew = TimeSpan.Zero
    };
    x.Events = new JwtBearerEvents
    {
        OnAuthenticationFailed = context =>
        {
            if (context.Exception.GetType() == typeof(SecurityTokenExpiredException))
            {
                context.Response.Headers.Add("Token-Expired", "true");

            }
            return Task.CompletedTask;
        }
    };
});
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("MySqlDatabase"),
        ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("MySqlDatabase"))
    ));

var app = builder.Build();

// Configure the HTTP request pipeline.
// Configure the HTTP request pipeline.

app.UseCors(x => x
              .AllowAnyMethod()
              .AllowAnyHeader()
              .SetIsOriginAllowed(origin => true) // allow any origin
              .AllowCredentials());

// Configure the HTTP request pipeline.

app.UseSwagger();
app.UseSwaggerUI();
app.UseAuthorization();
app.MapControllers();
app.Run();
