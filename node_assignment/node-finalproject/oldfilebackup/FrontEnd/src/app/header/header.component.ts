import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterService } from '../services/router.service';
import { NotesService } from '../services/notes.service';
import { AuthenticationService } from '../services/authentication.service';
import { Label } from '../model/label';
import { FormControl } from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { Note } from '../note';
import { Location } from '@angular/common';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  isNoteView = true;
  selectedNoteId : Array<Note> = [];
  labelList : Array<Label>=[{'name':'one','noteIds':[11,12,13,14,15]},{'name':'two','noteIds':[11,12,13,14,15]},{'name':'three','noteIds':[11,13]}];
    // labelList : Array<string> = ['one','two',"three"];
    indeterminate : Array<boolean> = [];
  selectedLabels = [];
  slab = new FormControl([]);
  options: string[] = ['One', 'Two', 'Three'];
  form: FormGroup;
  orders = [];
//   labelName : string;
  myControl = new FormControl('');
  noteSearch = new FormControl('');
  filteredOptions: Observable<Label[]>;
  favorite : boolean = null;
  route : string 
  constructor(private router: Router, private location: Location,private routerService: RouterService, private notesService: NotesService, 
    private formBuilder: FormBuilder, private authenticationService:AuthenticationService) {
    if (this.router.url === 'dashboard/view/listview') {
      this.isNoteView = false;
    } else {
      this.isNoteView = true;
    }
  }
    ngOnInit() {
        this.router.events.subscribe((val) => {
            console.log(this.location.path());
            this.route=this.location.path();
            // if(this.location.path() != ''){
            //   this.route = this.location.path();
            // } else {
            //   this.route = 'Home'
            // }
          });
        this.notesService.getSelected().subscribe(data=>{
            console.log(this.selectedNoteId);
            console.log("noteIds");
            console.log(data);
            this.favorite = null;
            this.selectedNoteId = data;
            this.selectedLabels = [];
            this.checkLabelState();
        })
        this.filteredOptions = this.myControl.valueChanges.pipe(
            startWith(''),
            map(value => this._filter(value))
        );
        this.notesService.getLabels().subscribe(labels=>{
            this.labelList = labels;
        })
        this.noteSearch.valueChanges.subscribe(data=>{
            this.searchNotes()
        })
    }
    private _filter(value: string): Label[] {
        const filterValue = value.toLowerCase();
    
        return this.labelList.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
    }

  routeSet(view: string): void {
    if (view === 'list') {
        this.routerService.routeToListView();
        this.isNoteView = false;
    } else {
        this.routerService.routeToNoteView();
        this.isNoteView = true;
    }
  }

  closeHeader(){
      console.log("closed header");
      this.indeterminate = [];
      this.selectedLabels = [];
      this.notesService.clearSelected();
  }
  labelMenuToggle(){
      console.log("label");
  }

  submit() {
      console.log("submit")
      var t=[];
      for(var i=0;i<this.selectedLabels.length;i++){
        console.log(i);
        console.log(this.selectedLabels[i]);
        if(this.selectedLabels[i]){
            t.push(this.labelList[i]);
        }
      }
      console.log(t);
      this.notesService.updateLabel(this.selectedNoteId,t);
      this.closeHeader();
    // console.log(this.form.value);
  }

  addNewLabel(){
        event.stopPropagation();
      console.log(this.myControl.value);
    //   this.labelList.push(this.myControl.value);
      this.notesService.addNewLabel(this.myControl.value,this.selectedNoteId);
      this.selectedLabels[this.labelList.length-1] = true;
      this.indeterminate[this.labelList.length-1] = false;
      this.myControl.setValue('');
  }

  checkLabelState(){
      
      for(var i=0;i<this.labelList.length;i++){
          var count=0;
          for(var j=0;j<this.selectedNoteId.length;j++){
              if(this.selectedNoteId[j].labels.includes(this.labelList[i].name)){
                  count++;
              }
          }
          if(count==this.selectedNoteId.length){
              this.selectedLabels[i] = true;
              this.indeterminate[i]=false;
          }
          else if(count>0){
                this.selectedLabels[i] = false;
              this.indeterminate[i]=true;
          }
          else{
              this.selectedLabels[i]=false;
              this.indeterminate[i]=false;
          }
      }
      console.log(this.selectedLabels);
  }

  searchNotes(){
      console.log("searchnotes");
      console.log(this.noteSearch.value);
      this.notesService.searchNoteTitle(this.noteSearch.value);
  }

  checkBoxChange(event,index,title){
      console.log(title,this.selectedNoteId);
    //   this.checkLabelState();
    //   if(this.selectedLabels[index].value){
    //       this.indeterminate[index]=false;
    //   }
      this.notesService.updateLabels(title,this.selectedNoteId,this.selectedLabels[index]);
  }

  favoriteToggle(){
    //   this.notesService.favoriteToggle()
    if(this.favorite==null){
        this.favorite= true;
    }
    else{
        this.favorite = !this.favorite;
    }
    console.log(this.favorite);
    this.notesService.updateFavoriteList(this.selectedNoteId,this.favorite);
  }

  deleteNotes(){
      console.log("deleteNotes");
      this.notesService.deleteNotes(this.selectedNoteId);
  }

  signOut(){
      console.log("signOut");
      this.authenticationService.removeBearerToken();
      this.authenticationService.removeUserDetails();
  }

  share(){
      // this.notesService.shareNote("");
  }
}
