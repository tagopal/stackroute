import {Component, Inject, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { Note } from '../note';
import { NotesService } from '../services/notes.service';
import { RouterService } from '../services/router.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-edit-note-view',
  templateUrl: './edit-note-view.component.html',
  styleUrls: ['./edit-note-view.component.css']
})
export class EditNoteViewComponent implements OnInit {
    note: Note;
    states: Array<string> = ['not-started', 'started', 'completed'];
    errMessage: string;
    title :string;
    text :string;
    state :string;
    constructor(@Inject(MAT_DIALOG_DATA) public data: any, private notesService : NotesService) {
        this.note= data;
        this.title = data.title;
        this.text = data.text;
        this.state = data.state;
    }
    ngOnInit() {
    }

    onSave() {
        console.log("onSave");
        console.log(this.data);
        console.log("title"+this.title);
        this.note.title =this.title;
        this.note.text =this.text;
        this.note.state = this.state;
        // this.data.
        this.notesService.editNote([this.note]);
    }
}
