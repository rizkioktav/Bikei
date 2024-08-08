import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderCdComponent } from './header-cd.component';

describe('HeaderCdComponent', () => {
  let component: HeaderCdComponent;
  let fixture: ComponentFixture<HeaderCdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeaderCdComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderCdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
