import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileUserCdComponent } from './profile-user-cd.component';

describe('ProfileUserCdComponent', () => {
  let component: ProfileUserCdComponent;
  let fixture: ComponentFixture<ProfileUserCdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfileUserCdComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileUserCdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
