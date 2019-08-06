import { TestBed } from '@angular/core/testing';

import { NoteTakeGetService } from './note-take-get.service';

describe('NoteTakeGetService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NoteTakeGetService = TestBed.get(NoteTakeGetService);
    expect(service).toBeTruthy();
  });
});
