export interface TaskMetrics {
  id: number;
  taskId: number;
  metricsId: number;
}

export interface AddTaskMetricsDto {
  taskId: number;
  metricsIds: number[] |null;
}

export interface EditTaskMetricsDto {
  taskId: number;
  metricsIds: number[]|null; 
}

export interface TaskMetricsResponse {
  id: number;
  taskId: number;
  metricsId: number;
}
