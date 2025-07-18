import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetricsProjecttypeColumnMasterComponent } from './metrics-projecttype-column-master.component';

describe('MetricsProjecttypeColumnMasterComponent', () => {
  let component: MetricsProjecttypeColumnMasterComponent;
  let fixture: ComponentFixture<MetricsProjecttypeColumnMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MetricsProjecttypeColumnMasterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MetricsProjecttypeColumnMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
