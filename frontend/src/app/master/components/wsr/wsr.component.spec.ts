import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WSRComponent } from './wsr.component';

describe('WSRComponent', () => {
  let component: WSRComponent;
  let fixture: ComponentFixture<WSRComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WSRComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WSRComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
