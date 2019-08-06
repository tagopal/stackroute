import { Component, OnInit, OnChanges } from '@angular/core';
import { NotesService } from '../services/notes.service';
import { NoteTakerComponent } from '../note-taker/note-taker.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnChanges {

  constructor(private noteService: NotesService) {
    this.noteService.fetchNotesFromServer();
  }

  ngOnInit() {
    this.noteService.fetchNotesFromServer();
  }

  ngOnChanges() {
    this.noteService.fetchNotesFromServer();
  }
}

