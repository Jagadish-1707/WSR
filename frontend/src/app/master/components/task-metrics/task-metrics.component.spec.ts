import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskMetricsComponent } from './task-metrics.component';

describe('TaskMetricsComponent', () => {
  let component: TaskMetricsComponent;
  let fixture: ComponentFixture<TaskMetricsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskMetricsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TaskMetricsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
