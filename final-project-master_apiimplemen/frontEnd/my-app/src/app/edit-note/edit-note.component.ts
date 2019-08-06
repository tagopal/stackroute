import { Component, OnInit,Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import { FormGroup,FormControl,FormGroupDirective,FormBuilder, NgForm, Validators } from '@angular/forms';
import { NoteTakeGetService } from '../services/note-take-get.service';
import { NotifierService } from 'angular-notifier';
import * as schedule from 'node-schedule'; 
import {MatSnackBar} from '@angular/material';
import { AuthenicateService } from '../services/authenicate.service';

@Component({
  selector: 'app-edit-note',
  templateUrl: './edit-note.component.html',
  styleUrls: ['./edit-note.component.css']
})
export class EditNoteComponent implements OnInit {
  removable = true;
  form: FormGroup;
  title: string;
  text: string;
  data: any;
  typesOfShoes: any = []; //friendslist
  friendNotesCheck: Array<boolean> = [];
  userShareIds: any;

    constructor(
        private snackBar: MatSnackBar,
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<EditNoteComponent>,
        @Inject(MAT_DIALOG_DATA) data, private NTGS: NoteTakeGetService,
        public notifier: NotifierService,
        private auth: AuthenicateService) {

        this.title = data.data.title;
        this.text = data.data.text;
        this.data = data;
        console.log(this.data);
    }

  ngOnInit() {
    this.form = this.fb.group({
            title: [this.title, [Validators.required]],
            text: [this.text, []],
    });
    this.auth.friendList.subscribe(res => {
      this.typesOfShoes = res;
      if (this.typesOfShoes.length == 0) {
        this.auth.getFriends();
      }
      if (this.typesOfShoes.length >0){
          this.sortCheckBox(this.data.index);
      }
    });
  }

  sortCheckBox(activeIndex){
    // let result=this.findInArray(this.dataNotes[activeIndex].sharedTo);
    this.typesOfShoes.forEach((each,fIndex)=>{  
        // console.log("friend._id :",friend._id);         
        // console.log("Each._id :",each._id);       
        let result=this.findInArray(this.data.data.sharedTo,each['_id']);
        // console.log("result boo :",result['boo']);
        // console.log("result 1index:",result['index']);
        if(result['boo']){
          this.friendNotesCheck[fIndex]=true;
        }else{
          this.friendNotesCheck[fIndex]=false;
        }        
      });
      console.log("this.friendNotesCheck :",this.friendNotesCheck);
  }

  findInArray(array,id){
    for(var i=0;i<array.length;i++){
      console.log("Array :",array)
      console.log("typeof array._id",(array[i]._id));
      console.log("typeof id",(id));
      if(id==array[i]._id){
        return {boo:true,index:i};
      }
    }
    return {boo:false};
  }

  //updates shared in db as well thro service and sockets connection
  onUpdate(index){
    // console.log("index value ;",index);
    // console.log("this.friendNotesCheck[index]; :",this.friendNotesCheck[index]);
    // console.log("this.typesOfShoes[index]._id :",this.typesOfShoes[index]);
    // console.log("this.dataNotes[this.activeNoteIndex].sharedTo",this.dataNotes[this.activeNoteIndex].sharedTo);
    let result=this.findInArray(this.data.data.sharedTo, this.typesOfShoes[index]._id);
    // console.log("result boo :",result['boo']);
    // console.log("result 1index:",result['index']);
    if(result['boo']){
      if(this.friendNotesCheck[index]){
        this.data.data.sharedTo[result['index']]=this.typesOfShoes[index];
      }else{
        this.data.data.sharedTo.splice(result['index'],1);         
      }
    }else{
      this.data.data.sharedTo.push(this.typesOfShoes[index]);  
    }
    this.userShareIds=this.data.data; //get id with .sharedTo and for notes to share get from title text
    console.log("this.userShareIds :",this.userShareIds);
    console.log("on update checkbox :",this.data.data);
  }

  share(){
    this.NTGS.shareSingle(this.data.data,this.userShareIds);
    this.snackBar.open('Shared to your friends','!!',{
      duration: 1200,
    });
    this.save();
  }

  save() {
    this.dialogRef.close(this.form.value);
  }

  close() {
      this.dialogRef.close();
  }

  remove(label,i){
    
  }

  favourite(index){
    //change in ui function
    this.NTGS.setfavourite(index);
  }

  reminderSet(dateTime,index){    
    dateTime=dateTime.setSeconds(0);

    var scheduleId=schedule.scheduleJob(dateTime, ()=>{
      // console.log("Reminder");
    this.NTGS.removeReminder(index);
    this.notifier.notify('default',"Title :"+this.title);  
    this.snackBar.open("Do this task","Title :"+this.title,{
      duration: 3000,
    });    
    });
    this.NTGS.setReminder(scheduleId,dateTime,index);
    console.log("dateTime  :",dateTime.toString()," type :",index);
    this.notifier.notify( 'default', 'Reminder is set' );  
  }

  removeReminder(index){
    console.log("inside remove reminder");
    this.NTGS.removeReminder(index);
    this.notifier.notify( 'default', 'Reminder is removed' );
  }

}
