import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteviewComponent } from './noteview.component';

describe('NoteviewComponent', () => {
  let component: NoteviewComponent;
  let fixture: ComponentFixture<NoteviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoteviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoteviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
