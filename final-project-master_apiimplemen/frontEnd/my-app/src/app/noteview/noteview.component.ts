import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { AuthenicateService } from '../services/authenicate.service';
import { RouterService } from '../services/router.service';
import { NoteTakeGetService } from '../services/note-take-get.service';
import { FilternotesService } from '../services/filternotes.service';
import { WebsocketService } from '../services/websocket.service';
import { MatSnackBar } from '@angular/material';
import * as schedule from 'node-schedule';
import { NotifierService } from 'angular-notifier';
import { MatDialog, MatDialogConfig } from "@angular/material";
import { EditNoteComponent } from '../edit-note/edit-note.component';


@Component({
  selector: 'app-noteview',
  templateUrl: './noteview.component.html',
  styleUrls: ['./noteview.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class NoteviewComponent implements OnInit {

  activeNoteIndex: any = 0;
  typesOfShoes: any = []; // friendslist
  term: String;
  dataNotes: any;
  favorite: any = '';
  removable = true; // for chips removable
  multipleSelect: any = [];
  labelList: any;
  friendNotesCheck: any = [];
  userShareIds: any;
  notesSharedMe: any;
  isNotesSharedMe = true;

  constructor(private snackBar: MatSnackBar, private filterSrv: FilternotesService,
    private NTGS: NoteTakeGetService, public notifier: NotifierService,
    private dialog: MatDialog, private websocket: WebsocketService,
    private auth: AuthenicateService) {

    this.websocket.getSocket().emit('getShare', this.auth.getUserId());
    this.websocket.getSocket().on('getShare', (data) => {
      if (data !== false && data.notes.length > 0) {
        this.notesSharedMe = data.notes;
      }
    });
  }

  ngOnInit() {
    console.log("dataNotes  in noteview  :", this.dataNotes);
    // call filter service for displaying sorting order
    this.filterSrv.getFavorite().subscribe(res => {
      console.log("getting favorite function :", res);
      this.favorite = res;
      if (this.favorite === 'not show') {
        this.isNotesSharedMe = true;
      } else {
        this.isNotesSharedMe = false;
      }
    }, err => {
      console.log("getting favorite function :", err);
    });
    this.NTGS.multipleSelect.subscribe(res => {
      this.multipleSelect = res;
      console.log("multipleSelect  highlight:", res);
    });
    this.NTGS.returnAllNotes().subscribe(res => {
      console.log("All notes from db in dashboard :", res);
      this.dataNotes = res;
    }, err => {
      console.log("Error All notes from db in dashboard :", err);
    });
    this.auth.friendList.subscribe(res => {
      this.typesOfShoes = res;
      if (this.typesOfShoes.length == 0) {
        this.auth.getFriends();
      }
      console.log("typesOfShoes  :", this.typesOfShoes);
      if (this.typesOfShoes.length > 0 && this.dataNotes.length > 0) {
        // tick for share notes not select for unshared user
        console.log("This.dataNotes in friendlist", this.dataNotes);
        this.sortCheckBox(this.activeNoteIndex);
      }
    });
  }

  openDialog(index) {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      data: this.dataNotes[index],
      index: index
    };
    this.dialog.open(EditNoteComponent, dialogConfig).
      afterClosed().subscribe(
        data => console.log("Dialog output:", data)
      );

  }



  // editNote(index){
  //   console.log("inside edit note : ",this.dataNotes[index]);
  // }

  favourite(index) {
    this.NTGS.setfavourite(index);
    //change in ui function
    // this.dataNotes[index].favourite=!this.dataNotes[index].favourite;
  }

  addNewUser(word) {
    this.typesOfShoes.push(word);
    this.term = '';
  }

  share(note: any) {
    this.NTGS.shareUpdate(this.dataNotes, this.userShareIds);
    console.log("On share :", this.userShareIds);
    this.snackBar.open('Shared to your friends', '!!', {
      duration: 1200,
    });
  }

  //changes highlight and trigger header thro services
  multiSelect(index) {
    if (this.multipleSelect[index]) {
      this.NTGS.multiSelect(index, false);
      this.NTGS.removeSelectedNote(this.dataNotes[index]);
    } else {
      // this.multipleSelect[index]=true;
      this.NTGS.multiSelect(index, true);
      this.NTGS.addSelectedNote(this.dataNotes[index]);
    }
  }

  // each label remove
  remove(label, index) {
    //index is for dataNotes array not for label array
    this.NTGS.removeLabelFromUser(label, index);
  }

  reminderSet(dateTime, index) {
    console.log("dateTime  :", dateTime.setSeconds(0), " type :", index);
    // var date = dateTime.toString().split(' ');
    // console.log("date  :",date);

    // console.log("scheduleId  :",scheduleId,"type  :",typeof(scheduleId));
    dateTime = dateTime.setSeconds(0);
    var scheduleId = schedule.scheduleJob(dateTime, () => {
      // console.log("Reminder");
      this.notifier.notify('default', this.dataNotes[index].title);
      this.snackBar.open("Do this task", this.dataNotes[index].title, {
        duration: 3000,
      });
    });
    this.NTGS.setReminder(scheduleId, dateTime, index);
    this.notifier.notify('default', 'Reminder is set');
    // console.log("this.dataNotes[index] :",this.dataNotes[index]);

  }

  removeReminder(index) {
    console.log("inside remove reminder");
    this.NTGS.removeReminder(index);
    this.notifier.notify('default', 'Reminder is removed');
    this.snackBar.open("Reminder removed for this title", this.dataNotes[index].title, {
      duration: 3000,
    });
  }

  sortCheckBox(activeIndex) {
    // let result=this.findInArray(this.dataNotes[activeIndex].sharedTo);
    this.typesOfShoes.forEach((each, fIndex) => {
      // console.log("friend._id :",friend._id);
      console.log("Each._id :", each._id);
      let result = this.findInArray(this.dataNotes[activeIndex].sharedTo, each._id);
      // console.log("result boo :",result['boo']);
      // console.log("result 1index:",result['index']);
      if (result['boo']) {
        this.friendNotesCheck[fIndex] = true;
      } else {
        this.friendNotesCheck[fIndex] = false;
      }
    });
    console.log("this.friendNotesCheck :", this.friendNotesCheck);
  }

  activenote(index) {
    console.log("inside active note");
    this.activeNoteIndex = index;
    this.sortCheckBox(this.activeNoteIndex);
  }

  findInArray(array, id) {
    for (var i = 0; i < array.length; i++) {
      console.log("Array :", array)
      console.log("typeof array._id", (array[i]._id));
      console.log("typeof id", (id));
      if (id == array[i]._id) {
        return { boo: true, index: i };
      }
    }
    return { boo: false };
  }

  //updates shared in db as well thro service and sockets connection
  onUpdate(index) {
    // console.log("index value ;",index);
    // console.log("this.friendNotesCheck[index]; :",this.friendNotesCheck[index]);
    // console.log("this.typesOfShoes[index]._id :",this.typesOfShoes[index]);
    // console.log("this.dataNotes[this.activeNoteIndex].sharedTo",this.dataNotes[this.activeNoteIndex].sharedTo);
    let result = this.findInArray(this.dataNotes[this.activeNoteIndex].sharedTo, this.typesOfShoes[index]._id);
    // console.log("result boo :",result['boo']);
    // console.log("result 1index:",result['index']);
    if (result['boo']) {
      if (this.friendNotesCheck[index]) {
        this.dataNotes[this.activeNoteIndex].sharedTo[result['index']] = this.typesOfShoes[index];
      } else {
        this.dataNotes[this.activeNoteIndex].sharedTo.splice(result['index'], 1);
      }
    } else {
      this.dataNotes[this.activeNoteIndex].sharedTo.push(this.typesOfShoes[index]);
    }
    this.userShareIds = this.dataNotes[this.activeNoteIndex]; //get id with .sharedTo and for notes to share get from title text
    console.log("on update checkbox :", this.userShareIds);
  }




}



