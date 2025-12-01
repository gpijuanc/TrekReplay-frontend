import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViatgeForm } from './viatge-form';

describe('ViatgeForm', () => {
  let component: ViatgeForm;
  let fixture: ComponentFixture<ViatgeForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViatgeForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViatgeForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
