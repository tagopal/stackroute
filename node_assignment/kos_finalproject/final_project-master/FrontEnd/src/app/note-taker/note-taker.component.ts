import { Component, OnInit } from '@angular/core';
import { Note } from '../note';
import { NotesService } from '../services/notes.service';
import { Observable } from 'rxjs/Observable';


@Component({
  selector: 'app-note-taker',
  templateUrl: './note-taker.component.html',
  styleUrls: ['./note-taker.component.css']
})
export class NoteTakerComponent {

  notes: Array<Note> = [];
  note: Note = new Note();
  errMessage: string;
  constructor(private notesService: NotesService) {

  }
 takeNotes () {
    if (this.note.title === '' || this.note.text === '') {
      this.errMessage = 'Title and Text both are required fields';
         return Observable.throw(this.errMessage);
    }else {
        console.log("takeNotes");
        //   this.notes.push(this.note);
          this.notesService.addNote(this.note);
        //   this.notesService.addNote(this.note).subscribe(
        //     data => {},
        //     err => {
        //       this.errMessage = err.message;
        //       const index: number = this.notes.findIndex(note => note.title === this.note.title);
        //       this.notes.splice(index, 1);
        //       return Observable.throw(this.errMessage);
        //     }
        //   );
          this.note = new Note();
        }
    }
   ngOnInit() {
  }

}
