import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleeligibleComponent } from './roleeligible.component';

describe('RoleeligibleComponent', () => {
  let component: RoleeligibleComponent;
  let fixture: ComponentFixture<RoleeligibleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoleeligibleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RoleeligibleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
