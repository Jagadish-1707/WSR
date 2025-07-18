import { TestBed } from '@angular/core/testing';

import { TaskMetricsService } from './task-metrics.service';

describe('TaskMetricsService', () => {
  let service: TaskMetricsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskMetricsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
