import { TestBed } from '@angular/core/testing';

import { Cosmos } from './cosmos';

describe('Cosmos', () => {
  let service: Cosmos;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Cosmos);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
