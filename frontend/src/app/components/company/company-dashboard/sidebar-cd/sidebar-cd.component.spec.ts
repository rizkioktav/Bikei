import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarCdComponent } from './sidebar-cd.component';

describe('SidebarCdComponent', () => {
  let component: SidebarCdComponent;
  let fixture: ComponentFixture<SidebarCdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SidebarCdComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidebarCdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
