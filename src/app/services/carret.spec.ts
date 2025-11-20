import { TestBed } from '@angular/core/testing';

import { Carret } from './carret';

describe('Carret', () => {
  let service: Carret;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Carret);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
