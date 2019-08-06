import { Component, OnInit } from '@angular/core';
import { NotesService } from '../services/notes.service';
import { Note } from '../note';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-note-view',
  templateUrl: './note-view.component.html',
  styleUrls: ['./note-view.component.css']
})
export class NoteViewComponent implements OnInit {

  constructor(private notesService: NotesService){ }
  note: Note = new Note();
  notes: Array<Note>;
  errMessage: string;
  ngOnInit(){
   this.notesService.getNotes().subscribe(data=>{
       console.log("new notes");
       console.log(data);
       this.notes = data;
   })
  }

}

