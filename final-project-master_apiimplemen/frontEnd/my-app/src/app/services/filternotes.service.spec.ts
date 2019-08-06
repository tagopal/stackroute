import { TestBed } from '@angular/core/testing';

import { FilternotesService } from './filternotes.service';

describe('FilternotesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FilternotesService = TestBed.get(FilternotesService);
    expect(service).toBeTruthy();
  });
});
