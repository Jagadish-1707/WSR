import { TestBed } from '@angular/core/testing';

import { WsrPayloadService } from './wsr-payload.service';

describe('WsrPayloadService', () => {
  let service: WsrPayloadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WsrPayloadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
