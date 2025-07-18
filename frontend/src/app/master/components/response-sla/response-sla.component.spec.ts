import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponseSlaComponent } from './response-sla.component';

describe('ResponseSlaComponent', () => {
  let component: ResponseSlaComponent;
  let fixture: ComponentFixture<ResponseSlaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResponseSlaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ResponseSlaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
