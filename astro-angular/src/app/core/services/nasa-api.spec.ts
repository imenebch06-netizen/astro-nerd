import { TestBed } from '@angular/core/testing';

import { NasaApi } from './nasa-api';

describe('NasaApi', () => {
  let service: NasaApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NasaApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
