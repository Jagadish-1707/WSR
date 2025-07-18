using backend.DtoModels;
using backend.Models;
using static backend.DtoModels.TimesheetsDto;
using static backend.ReposirotyService.TimesheetService;

namespace backend.RepositoryInterface
{
    public interface ITimesheetService
    {
        Task<bool> AddTimesheetDetailsAsync(AddTimesheetDetailsDto addTimesheetDetailsDto);
        Task<bool> EditTimesheetAsync(EditTimesheetDetailsDto editTimesheetDetailsDto, DateTime startOfWeek, DateTime endOfWeek);
        //Task<TimesheetDetailsDto> GetByIdAsync(long Id);
        List<WeeklyTimesheetSummary> GetWeeklyTimesheetSummaryByEmployeeName(string employeeName);

        List<Timesheets> GetTimesheetsByDateRange(DateTime weekStartDate, DateTime weekEndDate);
        List<Timesheets> GetTimesheetsByDateRange(DateTime weekStartDate, DateTime weekEndDate, string employeeName);
        Task<bool> WeeklyTimesheetsWithDrawAsync(WeeklyTimesheetsWithdrawDto weeklyTimesheetsWithdrawDto);
        Task<bool> SaveDailyTimesheetAsync(AddTimesheetDetailsDto addTimesheetDetailsDto);
        Task<List<Timesheets>> GetDailyLogsByDateAsync(DateTime logDate, string employeeId);
        public Task<bool> DailyTimeSheetApproveAsync(DailyTimesheetApproveDto dto);
        Task<bool> DailyTimeSheetRejectAsync(DailyTimesheetRejectDto dto);
        List<string> GetTimesheetsStatus(DateTime weekStartDate, DateTime weekEndDate, string employeeName);
        List<TimesheetData> GetTimesheetsHours(DateTime weekStartDate, DateTime weekEndDate, string employeeId);        
        public List<DailyTimesheetEntryDto> GetDailyTimesheetsDetailedForManager(int managerEmployeeId);
        public List<DailyTimesheetEntryDto> GetTimesheetsByEmployeeId(string employeeId);
        Task<bool> BatchApproveTimesheetsAsync(BatchApproveDto dto);
        Task<bool> BatchRejectTimesheetsAsync(BatchRejectDto dto);
    }
}
