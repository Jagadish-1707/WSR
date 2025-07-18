import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetricsProjecttypeColumnViewComponent } from './metrics-projecttype-column-view.component';

describe('MetricsProjecttypeColumnViewComponent', () => {
  let component: MetricsProjecttypeColumnViewComponent;
  let fixture: ComponentFixture<MetricsProjecttypeColumnViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MetricsProjecttypeColumnViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MetricsProjecttypeColumnViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
