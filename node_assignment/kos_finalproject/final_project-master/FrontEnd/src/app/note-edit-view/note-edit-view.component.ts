import { Component, OnInit } from '@angular/core';
import { NoteEditService } from '../services/note-edit.service';
import { Note } from '../note';
@Component({
  selector: 'app-note-edit-view',
  templateUrl: './note-edit-view.component.html',
  styleUrls: ['./note-edit-view.component.css']
})
export class NoteEditViewComponent implements OnInit {

    note : Note;
  constructor(private noteEditService : NoteEditService) { }

  ngOnInit() {
        this.noteEditService.getValue().subscribe(note=>{
            console.log("getvalueid");
            console.log(note);
            this.note = JSON.parse(JSON.stringify(note));
        })
  }

  close(){
      console.log("closed");
      this.noteEditService.setValue(null);
  }

  clicked(){
      console.log("clicked");
  }
}
