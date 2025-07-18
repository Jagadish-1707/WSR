import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetricsMasterComponent } from './metrics-master.component';

describe('MetricsMasterComponent', () => {
  let component: MetricsMasterComponent;
  let fixture: ComponentFixture<MetricsMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MetricsMasterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MetricsMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
