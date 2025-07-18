import { TestBed } from '@angular/core/testing';
import { ComplexityService } from './complexity.service';

describe('ComplexityService', () => {
  let service: ComplexityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComplexityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
