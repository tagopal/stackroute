import { TestBed, inject } from '@angular/core/testing';

import { NoteEditService } from './note-edit.service';

describe('NoteEditService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NoteEditService]
    });
  });

  it('should be created', inject([NoteEditService], (service: NoteEditService) => {
    expect(service).toBeTruthy();
  }));
});
