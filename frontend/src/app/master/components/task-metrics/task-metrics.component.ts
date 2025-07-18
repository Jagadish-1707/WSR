import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TaskMetricsService } from '../../services/task-metrics.service';
import { MessageService } from 'primeng/api';
import { AddTaskMetricsDto, EditTaskMetricsDto } from '../../models/TaskMetrics';
import { ToolbarModule } from 'primeng/toolbar';
import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { MetricsMasterService } from '../../services/metrics-master.service';
import { MetricsMaster } from '../../models/metricsMaster';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-task-metrics',
  templateUrl: './task-metrics.component.html',
  styleUrls: ['./task-metrics.component.scss'],
  standalone: true,
  imports: [
    ToolbarModule, TableModule, CheckboxModule, ButtonModule, DialogModule, FormsModule, InputTextModule
  ]
})
export class TaskMetricsComponent implements OnInit {
  selectedMetrics: number[] = []; // Will hold the selected metricIds
  selectAllValue: boolean = false;
  isEditMode: boolean = false;
  @Input() taskId: number = 0;
  metricsList: MetricsMaster[] = [];
  filteredMasterNames: MetricsMaster[] = [];
  @Input() dialogVisible: boolean = false;
  @Output() dialogVisibleChange = new EventEmitter<boolean>();
  globalFilterValue: string = '';
  btnlabel: string = "SAVE";

  constructor(
    private taskMetricsService: TaskMetricsService,
    private metricsMasterService: MetricsMasterService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    if (this.taskId) {
      this.getTaskMetrics();
      this.loadMetricsMasterList();
    }
  }

  // Get existing task metrics by TaskId
  getTaskMetrics() {
    this.taskMetricsService.getTaskMetricsByTaskId(this.taskId).subscribe(
      (metrics) => {
        console.log(metrics);
        this.selectedMetrics = metrics.map((metric) => metric.metricsId);
        this.isEditMode = this.selectedMetrics.length > 0;
        if (this.isEditMode) {
          this.btnlabel = "UPDATE";
        }
        else {
          this.btnlabel = "SAVE";
        }
        this.updateSelectAllState();
      },
      (error) => {
        console.error('Error fetching task metrics:', error);
      }
    );
  }

  loadMetricsMasterList(): void {
    this.metricsMasterService
      .getMetricsMasterList()
      .subscribe((response: MetricsMaster[]) => {
        this.metricsList = response;
        const seenMasterName = new Set();
        this.filteredMasterNames = response.filter((master) => {
          const duplicate = seenMasterName.has(master.metricsName);
          seenMasterName.add(master.metricsName);
          return !duplicate;
        });
        // Update select all state after loading metrics
        this.updateSelectAllState();
        console.log(this.filteredMasterNames);
      });
  }

  // Check if a metric is selected
  isMetricSelected(metricId: number | null): boolean {
    if (metricId === null) return false;
    return this.selectedMetrics.includes(metricId);
  }

  // Handle individual checkbox change
  onCheckboxChange(event: any, metric: MetricsMaster) {
    // Check if metric.id is not null
    if (metric.id === null || metric.id === undefined) {
      console.warn('Metric ID is null or undefined');
      return;
    }

    if (event.checked) {
      // Add to selected metrics if not already present
      if (!this.selectedMetrics.includes(metric.id)) {
        this.selectedMetrics.push(metric.id);
      }
    } else {
      // Remove from selected metrics
      this.selectedMetrics = this.selectedMetrics.filter(id => id !== metric.id);
    }

    // Update select all checkbox state
    this.updateSelectAllState();

    console.log('Selected metrics:', this.selectedMetrics);
  }

  // Handle select all checkbox
  onSelectAllChange(event: any) {
    this.selectAllValue = event.checked;
    if (event.checked) {
      // Select all metrics (filter out null IDs)
      this.selectedMetrics = this.metricsList
        .filter(metric => metric.id !== null && metric.id !== undefined)
        .map(metric => metric.id as number);
    } else {
      // Deselect all metrics
      this.selectedMetrics = [];
    }
    console.log('Selected metrics after select all:', this.selectedMetrics);
  }

  // Update select all checkbox state when individual checkboxes change
  updateSelectAllState() {
    const validMetrics = this.metricsList.filter(metric => metric.id !== null && metric.id !== undefined);
    if (this.selectedMetrics.length === validMetrics.length && validMetrics.length > 0) {
      this.selectAllValue = true;
    } else {
      this.selectAllValue = false;
    }
  }

  closeDialog(): void {
    this.dialogVisible = false;
    this.dialogVisibleChange.emit(false);
  }

  saveMetrics() {
    // Validation checks
    if (!this.taskId || this.taskId <= 0) {
      console.error('Invalid Project ID:', this.taskId);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Invalid task ID!',
      });
      return;
    }

    if (!this.selectedMetrics || this.selectedMetrics.length === 0) {
      console.warn('No metrics selected');
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please select at least one Metric!',
      });
      return;
    }

    // Ensure selectedMetrics contains only valid numbers
    const validMetrics = this.selectedMetrics.filter(id => id != null && !isNaN(id) && id > 0);

    if (validMetrics.length === 0) {
      console.error('No valid metric IDs found:', this.selectedMetrics);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No valid metrics selected!',
      });
      return;
    }

    const taskMetricsDto: AddTaskMetricsDto | EditTaskMetricsDto = {
      taskId: this.taskId,
      metricsIds: validMetrics,
    };

    if (this.isEditMode) {
      console.log('Calling editTaskMetrics API...');
      this.taskMetricsService.editTaskMetrics(taskMetricsDto).subscribe({
        next: (response) => {
          console.log('Edit API Response:', response);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Project Metrics updated successfully!',
          });
          this.closeDialog();
        },
        error: (error) => {
          console.error('Error updating Project Metrics:', error);
          console.error('Error details:', {
            status: error.status,
            statusText: error.statusText,
            message: error.message,
            error: error.error
          });
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error?.message || 'Failed to update Project Metrics!',
          });
        }
      });
    } else {
      this.taskMetricsService.addTaskMetrics(taskMetricsDto).subscribe({
        next: (response) => {
          console.log('Add API Response:', response);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Project Metrics added successfully!',
          });
          this.closeDialog();
        },
        error: (error) => {
          console.error('Error adding Project Metrics:', error);
          console.error('Error details:', {
            status: error.status,
            statusText: error.statusText,
            message: error.message,
            error: error.error
          });
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error?.message || 'Failed to add Project Metrics!',
          });
        }
      });
    }
  }
}