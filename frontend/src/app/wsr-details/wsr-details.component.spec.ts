import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WSRDetailsComponent } from './wsr-details.component';

describe('WsrDetailsComponent', () => {
  let component: WSRDetailsComponent;
  let fixture: ComponentFixture<WSRDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WSRDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WSRDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
