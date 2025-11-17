import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { venedorGuard } from './venedor-guard';

describe('venedorGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => venedorGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
