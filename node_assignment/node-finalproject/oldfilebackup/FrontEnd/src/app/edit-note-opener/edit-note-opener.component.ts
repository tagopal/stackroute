import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { EditNoteViewComponent } from '../edit-note-view/edit-note-view.component';
import { NotesService } from '../services/notes.service';

@Component({
  selector: 'app-edit-note-opener',
  templateUrl: './edit-note-opener.component.html',
  styleUrls: ['./edit-note-opener.component.css']
})
export class EditNoteOpenerComponent implements OnInit {
  constructor(private activatedRoute: ActivatedRoute, private notesService: NotesService,
    public dialog: MatDialog) {
  }

  ngOnInit() {
    const noteId = +this.activatedRoute.snapshot.paramMap.get('noteId');
    this.dialog.open(EditNoteViewComponent, { width: '250px', data: noteId })
      .afterClosed()
      .subscribe(result => {
        console.log('The dialog was closed');
        this.notesService.fetchNotesFromServer();
      });
  }
}