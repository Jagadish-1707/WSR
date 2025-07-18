import { TestBed } from '@angular/core/testing';

import { GeneralMetricsService } from './general-metrics.service';

describe('GeneralMetricsService', () => {
  let service: GeneralMetricsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeneralMetricsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
