import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LogHours, TimesheetGrid, Timesheets, WeeklyTimesheetSummary } from '../models/timesheet';
import { Observable, map } from 'rxjs';
import { baseUrl } from '../../commons/global.common';
import { Moment } from 'moment';
import { BatchApproveDto, BatchRejectDto } from '../components/timesheet-approval/timesheet-approval.component';

@Injectable({
  providedIn: 'root',
})
export class TimesheetService {
  weeklyTimesheet : any;
  
  constructor(private httpClient: HttpClient) {}

  // Add new timesheet
  addTimesheet(timesheet: Timesheets): Observable<Timesheets> {
    return this.httpClient.post<Timesheets>(baseUrl + '/Timesheet/AddTimesheet', timesheet);
  }

  // Get timesheets by employee name
  getTimesheetsByUserName(employeeName: string): Observable<WeeklyTimesheetSummary[]> {
    return this.httpClient.get<WeeklyTimesheetSummary[]>(baseUrl + '/Timesheet/GetAllTimesheet/' + employeeName)
      .pipe();
  }

  // Get timesheets by employee name
  getTimesheets(employeeName: string): Observable<Timesheets[]> {
    return this.httpClient.get<TimesheetGrid[]>(baseUrl + '/Timesheet/GetAllTimesheet/' + employeeName)
      .pipe(
        map((timesheetGrid: TimesheetGrid[]) => this.transformApiData(timesheetGrid))
      );
  }

  // Transform raw API data into structured Timesheets model
  private transformApiData(apiData: TimesheetGrid[]): Timesheets[] {
    const timesheetsMap = new Map<number, Timesheets>();

    apiData.forEach(item => {
      let timesheet = timesheetsMap.get(item.employeeId);
      
      if (!timesheet) {
        timesheet = {
          id: item.id,
          employeeId: item.employeeId,
          employeeName: item.employeeName,
          doj: item.doj,
          weeklyTimesheet: []
        };
        timesheetsMap.set(item.employeeId, timesheet);
      }
      
      const logHours: LogHours = {
        timesheetStatus: item.timesheetStatus,
        logTs: item.logTs,
        logHours: item.logHours
      };

      let weeklyTimesheet = timesheet.weeklyTimesheet.find(ws => ws.projectId === item.projectId && ws.activity === item.activity && ws.site === item.site);
      
      if (!weeklyTimesheet) {
        weeklyTimesheet = {
          id: item.id,
          timesheetId: item.id,
          customerId: item.customerId,
          customerName: item.customerName,
          projectId: item.projectId,
          projectName: item.projectName,
          activity: item.activity,
          site: item.site,
          billingType: item.billingType,
          logHours: []
        };
        timesheet.weeklyTimesheet.push(weeklyTimesheet);
      }
      
      weeklyTimesheet.logHours.push(logHours);
    });
    
    return Array.from(timesheetsMap.values());
  }

  // Get timesheets by date range
  getTimesheetsByDateRange(weekStartDate: Moment, weekEndDate: Moment, employeeName: string): Observable<Timesheets[]> {
    return this.httpClient.get<any[]>(`${baseUrl}/Timesheet/GetTimesheetsByDateRange/${weekStartDate.format("YYYY-MM-DDTHH:mm:ss")}/${weekEndDate.format("YYYY-MM-DDTHH:mm:ss")}/${employeeName}`)
      .pipe(
        map((apiData: any[]) => this.transformApiData(apiData))
      );
  }

  // Get timesheet status for a range of dates
  getTimesheetsStatus(DateRanges: Array<{ start: string; end: string }>, employeeId: string): Observable<any[]> {
    return this.httpClient.post<any[]>(baseUrl + '/Timesheet/GetTimesheetsStatus', { DateRanges, employeeId });
  }

  // Get timesheet log hours for a range of dates
  getTimesheetsLogHours(DateRanges: Array<{ start: string; end: string }>, employeeId: string): Observable<any[]> {
    return this.httpClient.post<any[]>(baseUrl + '/Timesheet/GetTimesheetsLogHours', { DateRanges, employeeId });
  }

  // Edit timesheet data
  EditTimesheets(timesheet: Timesheets, startOfWeek: string, endOfWeek: string): Observable<Timesheets> {
    return this.httpClient.put<Timesheets>(
      `${baseUrl}/Timesheet/EditTimesheet?startOfWeek=${startOfWeek}&endOfWeek=${endOfWeek}`,
      timesheet  
    );
  }
  getDailyTimesheetLogs(logDate: string, employeeId: string): Observable<any[]> {
  return this.httpClient.get<any[]>(
    `${baseUrl}/Timesheet/GetDailyTimesheetLogs/${logDate}/${employeeId}`
  );
}

  withdrawTimesheet(weekStartDate: string, weekEndDate: string, employeeId: string): Observable<any> {
    const requestBody = {
      weekStartDate,
      weekEndDate,
      employeeId
      };
  
    return this.httpClient.post<any>(`${baseUrl}/Timesheet/WithdrawTimesheet`, requestBody);
  }

  approveTimesheetDaily(timesheetId:number,logDate: string, employeeId: string, approvedBy?: string,comments?:string): Observable<any> {
  const requestBody = {
    timesheetId,
    logDate, 
    employeeId,
    approvedBy: approvedBy || localStorage.getItem('userEmail') || '',
    comments
  };
  return this.httpClient.post<any>(`${baseUrl}/Timesheet/ApproveDailyTimeSheet`, requestBody);
}


  // Updated to match C# backend expectations
  rejectTimesheetDaily(timesheetId:number,logDate: string, employeeId: string, comments: string, rejectedBy?: string): Observable<any> {
    const requestBody = {
      timesheetId,
      logDate: new Date(logDate), 
      employeeId,
      rejectedBy: rejectedBy || localStorage.getItem('userEmail') || '', 
      comments: comments 
    };
    console.log('Sending rejection request:', requestBody);
    return this.httpClient.post<any>(`${baseUrl}/Timesheet/RejectDailyTimeSheet`, requestBody);
  }

  // Add daily timesheet (multiple logs on a single day)
    addDailyTimesheet(payload: any): Observable<any> {
  return this.httpClient.post(`${baseUrl}/Timesheet/AddDailyTimesheet`, payload, {
    responseType: 'text'
  });
}


getDailyTimesheetsDetailed(managerEmployeeId: string): Observable<DailyTimesheetEntry[]> {
  return this.httpClient.get<DailyTimesheetEntry[]>(`${baseUrl}/Timesheet/GetDailyTimesheetsDetailed/${managerEmployeeId}`);
}

getTimesheetsByEmployeeId(employeeId: string): Observable<DailyTimesheetEntry[]> {
    return this.httpClient
      .get<DailyTimesheetEntry[]>(`${baseUrl}/Timesheet/GetTimesheetsByEmployeeId/${employeeId}`);      
  }

batchApproveTimesheets(payload: BatchApproveDto): Observable<any> {
  return this.httpClient.post(`${baseUrl}/Timesheet/ApproveBatchTimeSheet`, payload);
}

batchRejectTimesheets(payload: BatchRejectDto): Observable<any> {
  return this.httpClient.post(`${baseUrl}/Timesheet/RejectBatchTimeSheet`, payload);
}


}

export interface DailyTimesheetEntry {
  timesheetId: number;
  logDate: string;       
  employeeId: string;
  employeeName: string;
  projectName: string;
  customerName: string;
  billingType: string;
  logHours: number;
  timesheetStatus: string;
  site: string;
  activity: string;
  remarks?: string;
  createdOn?: string;     
}

