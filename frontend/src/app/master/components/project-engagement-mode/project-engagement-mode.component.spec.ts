import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectEngagementModeComponent } from './project-engagement-mode.component';

describe('ProjectEngagementModeComponent', () => {
  let component: ProjectEngagementModeComponent;
  let fixture: ComponentFixture<ProjectEngagementModeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectEngagementModeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProjectEngagementModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
