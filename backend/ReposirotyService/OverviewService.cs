using backend.Common;
using backend.DtoModels;

namespace backend.ReposirotyService
{
    public class OverviewService
    {

        private readonly IConfiguration _configuration;
        private readonly UnitOfWork _unitOfWork;

        public OverviewService(IConfiguration configuration)
        {
            _configuration = configuration;
            _unitOfWork = new UnitOfWork(configuration);
        }
        public async Task<List<DevelopmentMetricsDto>> GetAllDevDetails()
        {
            try
            {
                // Fetching the metrics details
                //var metricsDtoList = _unitOfWork.MetricsDetailsRepository.GetAll()
                //    .OrderByDescending(s => s.Id)
                //    .Select(s => new MetricsDetailsDto
                //    {
                //        Id = s.Id,
                //        CustomerId = s.CustomerId,
                //        CustomerName = s.CustomerName,
                //        ProjectId = s.ProjectId,
                //        ProjectName = s.ProjectName,
                //        ProjectType = s.ProjectType,
                //        MonthYear = s.MonthYear,
                //        WeekStartDate = s.WeekStartDate,
                //        WeekEndDate = s.WeekEndDate,
                //        CreatedOn = s.CreatedOn,
                //        FlagType = "Support"
                //    });

                // Fetching the development metrics details
                var devMetricsDtoList = _unitOfWork.DevelopmentMetricsRepository.GetAll()
                    .OrderByDescending(s => s.DevelopmentMetricsId)
                    .Select(s => new DevelopmentMetricsDto
                    {
                        Id = s.DevelopmentMetricsId,
                        CustomerId = s.CustomerId,
                        CustomerName = s.CustomerName,
                        ProjectId = s.ProjectId,
                        ProjectName = s.ProjectName,
                        ProjectType = s.ProjectType,
                        MonthYear = s.MonthYear,
                        WeekStartDate = s.WeekStartDate,
                        WeekEndDate = s.WeekEndDate,
                        CreatedOn = s.CreatedOn,
                        FlagType = "Development",
                        DevelopmentTasks = s.DevelopmentTasks.Select(t => new DevelopmentTaskDto
                        {
                            TaskId = t.TaskId, // Assuming TaskId is the Id field of DevelopmentTask
                            MetricsId = t.DevelopmentMetricsId, // The foreign key reference
                            TaskName = t.TaskName,
                            CRNumber = t.CRNumber,
                            Priority = t.Priority,
                            PlannedStartDate = TimeZoneInfo.ConvertTimeFromUtc((DateTime)t.PlannedStartDate, TimeZoneInfo.FindSystemTimeZoneById("India Standard Time")),
                            PlannedEndDate = TimeZoneInfo.ConvertTimeFromUtc((DateTime)t.PlannedEndDate, TimeZoneInfo.FindSystemTimeZoneById("India Standard Time")),
                            PlannedDuration = t.PlannedDuration,
                            ActualStartDate = TimeZoneInfo.ConvertTimeFromUtc((DateTime)t.ActualStartDate, TimeZoneInfo.FindSystemTimeZoneById("India Standard Time")),
                            ActualEndDate = TimeZoneInfo.ConvertTimeFromUtc((DateTime)t.ActualEndDate, TimeZoneInfo.FindSystemTimeZoneById("India Standard Time")),
                            ActualDuration = t.ActualDuration,
                            OnTimeDelivery = t.OnTimeDelivery == true ? "Yes" : "No",
                            PlannedEffort = t.PlannedEffort,
                            ActualEffort = t.ActualEffort,
                            NumberOfDefects = t.NumberOfDefects,
                            ReworkEffort = t.ReworkEffort,
                            Status = t.Status,
                            Remarks = t.Remarks,
                            ExpectedCompletionMonth = t.ExpectedCompletionMonth,
                            TaskToBeCompletedThisMonth = t.TaskToBeCompletedThisMonth == true ? "Yes" : "No",
                        }).ToList()
                    });

                // Combining the two lists
                var combinedMetricsDtoList = devMetricsDtoList.OrderByDescending(s => s.CreatedOn).ToList();

                return combinedMetricsDtoList;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

    }
}
