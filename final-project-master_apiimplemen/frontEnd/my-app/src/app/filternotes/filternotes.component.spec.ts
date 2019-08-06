import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilternotesComponent } from './filternotes.component';

describe('FilternotesComponent', () => {
  let component: FilternotesComponent;
  let fixture: ComponentFixture<FilternotesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilternotesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilternotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
