import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViatgeDetall } from './viatge-detall';

describe('ViatgeDetall', () => {
  let component: ViatgeDetall;
  let fixture: ComponentFixture<ViatgeDetall>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViatgeDetall]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViatgeDetall);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
