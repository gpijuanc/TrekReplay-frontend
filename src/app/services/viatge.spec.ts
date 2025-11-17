import { TestBed } from '@angular/core/testing';

import { Viatge } from './viatge';

describe('Viatge', () => {
  let service: Viatge;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Viatge);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
