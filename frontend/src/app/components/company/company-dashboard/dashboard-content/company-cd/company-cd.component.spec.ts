import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyCdComponent } from './company-cd.component';

describe('CompanyCdComponent', () => {
  let component: CompanyCdComponent;
  let fixture: ComponentFixture<CompanyCdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompanyCdComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyCdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
