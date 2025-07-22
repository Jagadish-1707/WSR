import { Injectable } from '@angular/core';
import {
  WSRProjectDetailsDto,
  WSRProjectStatusDto,
  WSRReportDto,
  WSRResourceDto,
  WSRSubmissionPayload,
  WSRTaskDto,
  WSRIssueDto,
  WSRKeyRiskDto
} from '../master/models/wsr-payload.model';

@Injectable({
  providedIn: 'root'
})
export class WsrPayloadService {
  constructor() { }

  buildPayload(
    formModel: any,
    resourceList: {
      zohoemp_id: string;
      resourcename: string;
      rating: number;
    }[],
    selectedStatuses: { [key: string]: string | { value: string } },
    zohoEmployees: { userName: string; zohoEmp_Id: number }[]
  ): WSRSubmissionPayload {
    const now = new Date().toISOString(); // Declare once at the top
    const createdBy = 'system';
    const [reportStartDate, reportEndDate] = formModel.reportDates || [];

    const getValue = (status: string | { value: string }): string =>
      typeof status === 'string' ? status : status?.value || '';

    const resources: WSRResourceDto[] = resourceList.map((user) => ({
      zohoEmp_Id: Number(user.zohoemp_id),
      emp_Name: user.resourcename,
      rating: Math.round(user.rating),
      active: 1
    }));

    const wsrReportDto: WSRReportDto = {
      id: '0',
      wsrName: formModel.wsrName || `WSR - ${formModel.projectName || 'Untitled'}`,
      projectId: formModel.projectId || '',
      customerName: formModel.customerName || '',
      reportStartDate: reportStartDate ? new Date(reportStartDate).toISOString() : now,
      reportEndDate: reportEndDate ? new Date(reportEndDate).toISOString() : now,
      createdOn: now,
      createdBy,
      updatedOn: now,
      updatedBy: createdBy
    };

    const wsrProjectStatusDto: WSRProjectStatusDto = {
      id: '0',
      projectId: formModel.projectId || '',
      overallStatus: getValue(selectedStatuses['Overall Status']),
      schedule: getValue(selectedStatuses['Schedule']),
      financial: getValue(selectedStatuses['Financial']),
      resource: getValue(selectedStatuses['Resource']),
      quality: getValue(selectedStatuses['Quality']),
      scope: getValue(selectedStatuses['Scope']),
      plannedResource: Number(formModel.plannedResource) || 0,
      actualResource: Number(formModel.actualResource) || 0,
      measureTaken: formModel.measuresTaken || '',
      remarks: formModel.remarks || '',
      createdOn: now,
      createdBy,
      updatedOn: now,
      updatedBy: createdBy
    };

    const wsrProjectDetailsDto: WSRProjectDetailsDto = {
      id: '0',
      projectId: formModel.projectId || '',
      managerName: formModel.manager || '',
      teamSize: Number(formModel.teamSize) || 0,
      technology: formModel.technology || '',
      customerLocation: formModel.customerLocation || '',
      businessDomain: formModel.businessDomain || '',
      projectType: formModel.projectType || '',
      projectStartDate: reportStartDate ? new Date(reportStartDate).toISOString() : now,
      projectEndDate: reportEndDate ? new Date(reportEndDate).toISOString() : now,
      projectDescription: formModel.description || '',
      resources,
      createdOn: now,
      createdBy,
      updatedOn: now,
      updatedBy: createdBy
    };

    const wsrTaskList: WSRTaskDto[] = [];
    if (formModel.progressData.length > 0) {
      console.log('progressData', formModel.progressData);
      formModel.progressData.forEach((item: any) => {
        // if (item.task) {
        wsrTaskList.push({
          task: item.task,
          taskStatus: item.status,
          remarks: item.remarks,
          createdBy,
          createdOn: now,
          active: false
        });
        // }
      });
    }

    if (formModel.plannedActivities.length > 0) {
      formModel.plannedActivities.forEach((item: any) => {
        // if (item.task) {
        wsrTaskList.push({
          task: item.task,
          taskStatus: item.status,
          remarks: item.remarks,
          createdBy,
          createdOn: now,
          active: true
        });
        // }
      });
    }

    formModel.wsrTaskDto = wsrTaskList;



    const newIssueList: WSRIssueDto[] = [];
    if (formModel.keyIssues.length > 0) {
      console.log('keyIssues', formModel.keyIssues);
      formModel.keyIssues.forEach((item: any) => {

        newIssueList.push({
          type: item.type || '',
          functionalArea: item.functionalArea || '',
          description: item.description || '',
          ActionRequired: item.ActionRequired || '',
          dateReported: item.dateRaised ? new Date(item.dateRaised).toISOString() : now,
          resolveByDate: item.resolveBy ? new Date(item.resolveBy).toISOString() : now,
          IssueOwner: item.IssueOwner || '',
          createdBy,
          createdOn: now
        });
      });
    }

     const newRiskList: WSRKeyRiskDto[] = [];
    if (formModel.keyRisks.length > 0) {
      console.log('keyRisks', formModel.keyRisks);
      formModel.keyRisks.forEach((item: any) => {

        newRiskList.push({
         RiskDescription: item.RiskDescription || '',
      mitigation: item.mitigation || '',
      likelihood: item.likelihood || '',
      RiskOwner: item.RiskOwner || '',
      dateRaised: item.dateRaised ? new Date(item.dateRaised).toISOString() : now,
      ResolveByDate: item.ResolveByDate ? new Date(item.ResolveByDate).toISOString() : now,
      createdBy,
      createdOn: now
        });
      });
    }






    //   const wsrIssueDto: WSRIssueDto[] = (formModel.keyIssues || []).map((item: any) => ({
    //   type: item.type || '',
    //   functionalArea: item.functionalArea || '',
    //   description: item.description || '',
    //   ActionRequired: item.ActionRequired || '',
    //   dateReported: item.dateRaised ? new Date(item.dateRaised).toISOString() : now,
    //   resolveByDate: item.resolveBy ? new Date(item.resolveBy).toISOString() : now,
    //   IssueOwner: item.IssueOwner || '',
    //   createdBy,
    //   createdOn: now
    // }));


    // const wsrKeyRisksDto: WSRKeyRiskDto[] = (formModel.keyRisks || []).map((item: any) => ({
    //   RiskDescription: item.RiskDescription || '',
    //   mitigation: item.mitigation || '',
    //   likelihood: item.likelihood || '',
    //   RiskOwner: item.RiskOwner || '',
    //   dateRaised: item.dateRaised ? new Date(item.dateRaised).toISOString() : now,
    //   ResolveByDate: item.ResolveByDate ? new Date(item.ResolveByDate).toISOString() : now,
    //   createdBy,
    //   createdOn: now
    // }));

    return {
      WSRReportDto: wsrReportDto,
      WSRProjectStatusDto: wsrProjectStatusDto,
      WSRProjectDetailsDto: wsrProjectDetailsDto,
      wsrTaskDto: wsrTaskList,
      wsrIssueDto: newIssueList,
      wsrKeyRisksDto: newRiskList
    };
  }
}
