import { Component, OnInit } from '@angular/core';
import { Note } from '../note';
import { NotesService } from '../services/notes.service';
import { NoteComponent } from '../note/note.component';
import { Observable } from 'rxjs/Observable';


@Component({
  selector: 'app-list-view',
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.css']
})
export class ListViewComponent implements OnInit {

    notStartedNotes: Array<Note>;
    startedNotes: Array<Note>;
    completedNotes: Array<Note>;
    errMessage: string;
    constructor(private noteService: NotesService) {}
    ngOnInit() {
      this.noteService.getNotes()
       .subscribe((data) => {
          this.notStartedNotes = data.filter(i => i.state === 'not-started');
          this.startedNotes = data.filter(i => i.state === 'started');
          this.completedNotes = data.filter(i => i.state === 'completed' );
       }, err => {
            this.errMessage = 'HttpErrorResponse: ' + err.message;
            return Observable.throw(this.errMessage);
       });
    }
}
