import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketTypeMasterComponent } from './ticket-type-master.component';

describe('TicketTypeMasterComponent', () => {
  let component: TicketTypeMasterComponent;
  let fixture: ComponentFixture<TicketTypeMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketTypeMasterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TicketTypeMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
