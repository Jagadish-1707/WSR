import { TestBed } from '@angular/core/testing';

import { WsrService } from './wsr.service';

describe('WsrService', () => {
  let service: WsrService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WsrService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
