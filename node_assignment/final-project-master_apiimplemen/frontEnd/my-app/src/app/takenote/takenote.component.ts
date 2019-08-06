import { Component, OnInit } from '@angular/core';
import { FormControl,FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { NoteTakeGetService } from '../services/note-take-get.service';
import { AuthenicateService } from '../services/authenicate.service';

@Component({
  selector: 'app-takenote',
  templateUrl: './takenote.component.html',
  styleUrls: ['./takenote.component.css']
})
export class TakenoteComponent implements OnInit {


  // public note : Note= new Note();
  public notes : Array<any>= [];
  public errMessage : boolean=true;
  expansionToggle=false;
  fav_value:boolean=false;
  title = new FormControl('',[Validators.required]);
  text = new FormControl('',[Validators.required]);


  constructor(private NTGS : NoteTakeGetService,private auth : AuthenicateService) { }

  ngOnInit() {
  }

  takeNotes(){
    console.log("inside takenotes")
    let postNote={
      title:this.title.value,
      text:this.text.value,
      favourite:this.fav_value,
      ownerId:this.auth.getUserId(),
      ownerName:this.auth.getUserName()
    };
    this.NTGS.addNote(postNote).subscribe(res=>{
      console.log("response from post :",res);
      this.title.reset();
      this.text.reset();
      this.fav_value=false;
      this.expansionToggle=!this.expansionToggle;   
    },err=>{
      // this.errMessage = err;
    });    
  }

  _favourite(){
    console.log("inside favourite note", this.fav_value)
    this.fav_value=!this.fav_value;
  }

}
