import { Component, OnInit, Input, Inject } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material';
import { EditNoteViewComponent } from '../edit-note-view/edit-note-view.component';
import { Note } from '../note';
import { RouterService } from '../services/router.service';
import { NoteEditService } from '../services/note-edit.service';
import { NotesService } from '../services/notes.service';
import { FormControl } from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.css']
})
export class NoteComponent implements OnInit {

  @Input() note: Note;
  selected : boolean = false;
  favDisable : boolean = false;
  favorite : boolean = false;
  favorites : Array<number>=[];
  filteredOptions: Observable<String[]>;
  myControl = new FormControl('');
  shareUserList : Array<String> = [];
  indeterminate:  Array<boolean> = []
  dateTime : Date;
  constructor(public dialog:MatDialog,private routerService: RouterService, private noteEditService:NoteEditService, private notesService:NotesService) { }

  ngOnInit() {
      this.favorite = this.note.favorite;
    //   this.notesService.getNotes().subscribe(notes=>{
    //       notes.forEach(note=>{
    //           if(this.note._id==note._id){
    //               console.log("fav");
    //               console.log(note)
    //               this.favorite=note.favorite;
    //           }
    //       })
    //   })
      this.notesService.getSelected().subscribe(selectedNotes=>{
        // console.log(selectedNotes);
        // console.log(selectedNotes.length);
        if(selectedNotes.length){
            this.favDisable = true;
        }
        else{
            this.favDisable = false;
        }
        var flag=false;
        selectedNotes.forEach(note=>{
            if(note._id==this.note._id){
                flag=true;
            }
        })
        if(flag){
            this.selected = true;
        }
        else{
            this.selected = false;
        }
      },
        err=>{
            
        })
        this.notesService.getFav().subscribe(favs=>{
            var flag=false;
            favs.forEach(favItem=>{
                if(favItem==this.note._id){
                    flag = true;
                }
            })
            if(flag){
                this.favorite = true;
            }
            else{
                this.favorite = false;
            }
        })
        this.filteredOptions = this.myControl.valueChanges.pipe(
            startWith(''),
            map(value => this._filter(value))
        );

        this.notesService.getShareUser().subscribe(userList=>{
            console.log("share list");
            console.log(userList);
            this.shareUserList = userList;
            this.myControl.setValue('');
        })
  }
  private _filter(value: string): String[] {
    const filterValue = value.toLowerCase();

    return this.shareUserList.filter(userName => userName.toLowerCase().indexOf(filterValue) === 0);
    }

    addNewUser(){
        event.stopPropagation();
      console.log(this.myControl.value);
      this.notesService.addShareUser(this.myControl.value);
    }

    shareNote(){
      this.notesService.shareNote(this.myControl.value,[this.note]);
    }
  openDialog(){
      var dialogRef = this.dialog.open(EditNoteViewComponent,{data:this.note});

      dialogRef.afterClosed().subscribe(result=>{
          console.log(`after close result ${result}`);
      })
  }
  editNote() {
    // this.routerService.routeToEditNoteView(noteId);
    console.log("editnote "+this.note);
    this.noteEditService.setValue(this.note);
  }

  selectToggle(){
      console.log("selected "+this.note._id);
      this.selected = !this.selected;
      if(this.selected){
        this.notesService.addSelected(this.note);
      }
      else{
        this.notesService.removeSelected(this.note);
      }
  }

  favoriteToggle(){
    //   this.favorite = !this.favorite;
    this.notesService.updateFavoriteList([this.note],!this.favorite);
  }

  deleteLabel(label){
      console.log(label);
    this.note.labels.splice(this.note.labels.indexOf(label),1);
    this.notesService.updateLabels(label,[this.note],false);
  }

  labelSelect(title){
      this.notesService.labelSelected(title);
  }

}
