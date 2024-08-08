import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterCdComponent } from './footer-cd.component';

describe('FooterCdComponent', () => {
  let component: FooterCdComponent;
  let fixture: ComponentFixture<FooterCdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FooterCdComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FooterCdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
