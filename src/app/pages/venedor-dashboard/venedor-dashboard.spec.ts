import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VenedorDashboard } from './venedor-dashboard';

describe('VenedorDashboard', () => {
  let component: VenedorDashboard;
  let fixture: ComponentFixture<VenedorDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VenedorDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VenedorDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
