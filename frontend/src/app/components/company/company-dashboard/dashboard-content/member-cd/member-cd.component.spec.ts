import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberCdComponent } from './member-cd.component';

describe('MemberCdComponent', () => {
  let component: MemberCdComponent;
  let fixture: ComponentFixture<MemberCdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MemberCdComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MemberCdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
