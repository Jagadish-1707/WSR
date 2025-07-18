import { TestBed } from '@angular/core/testing';

import { ZohoDataService } from './zoho-data.service';

describe('ZohoDataService', () => {
  let service: ZohoDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ZohoDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
