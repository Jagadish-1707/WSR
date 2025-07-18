import { TestBed } from '@angular/core/testing';

import { MetricsMasterService } from './metrics-master.service';

describe('MetricsMasterService', () => {
  let service: MetricsMasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MetricsMasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
