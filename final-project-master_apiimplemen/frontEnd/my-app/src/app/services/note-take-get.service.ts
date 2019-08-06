import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthenicateService } from '../services/authenicate.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as schedule from 'node-schedule';
import { NotifierService } from 'angular-notifier';
import { WebsocketService } from '../services/websocket.service';

@Injectable({
  providedIn: 'root'
})
export class NoteTakeGetService {

  //selectnotes i.e for functions in the header
  selectedNotesArray: Array<any> = [];
  selectedNotesSubject = new BehaviorSubject<Array<any>>([]);
  selectedNotes = this.selectedNotesSubject.asObservable();

  //select notes highlight for highlight in the notes component
  multipleSelectArray: Array<any> = [];
  multipleSelectSubject = new BehaviorSubject<Array<any>>([]);
  multipleSelect = this.multipleSelectSubject.asObservable();

  //all notes
  notesDataArray: Array<any> = [];
  NotesSubject = new BehaviorSubject<Array<any>>([]);
  notesData = this.NotesSubject.asObservable();

  //user label common list
  userLabelArray: Array<any> = [];
  userLabelSubject = new BehaviorSubject<Array<any>>([]);
  userLabels = this.userLabelSubject.asObservable();

  // reminderSubject=new BehaviorSubject<any>(false)

  //selected notes labels list for header
  // selecteduserLabelArray:Array<any>=[];
  // selecteduserLabelSubject=new BehaviorSubject<Array<any>>([]);
  // selecteduserLabels=this.userLabelSubject.asObservable();



  constructor(private httpClient: HttpClient, private auth: AuthenicateService,
    public notifier: NotifierService, private websocket: WebsocketService) {
  }
  notesURL = environment.notesUrl; //notes url


  getAllNotes(_id) {
    return this.httpClient.get(this.notesURL + `${_id}`,
      { headers: new HttpHeaders().set(`Authorization`, `${this.auth.getBearerToken()}`) }
    ).subscribe(res => {
      this.notesDataArray = res['data'];
      this.NotesSubject.next(res['data']);
      console.log("this notes  :", this.NotesSubject);
      res['data'].forEach(value => {
        value.labels.forEach(label => {
          if (this.userLabelArray.includes(label)) {

          } else {
            this.userLabelArray.push(label);
          }
        });
      });
      this.userLabelSubject.next(this.userLabelArray);
    }, err => {
      this.NotesSubject.next([]);
    });
  }

  returnAllNotes(): BehaviorSubject<Array<any>> {
    return this.NotesSubject;
  }

  //selected note check
  addSelectedNote(value) {
    this.selectedNotesArray.push(value);
    this.selectedNotesSubject.next(this.selectedNotesArray);
    console.log("Inside addSelectedNOte  :", this.selectedNotesArray);

    //added select notes label function
    // this.selectedNotesArray.forEach(res=>{
    //   res.labels.forEach(label=>{
    //     if(!this.selecteduserLabelArray.includes(label)){
    //       this.selecteduserLabelArray.push(label);
    //     }
    //   });
    // });
    // this.selecteduserLabelSubject.next(this.selecteduserLabelArray);
  }

  //selected note uncheck
  removeSelectedNote(value) {
    console.log("Inside remove selected note  :", this.selectedNotesArray.indexOf(value));
    this.selectedNotesArray.splice(this.selectedNotesArray.indexOf(value), 1);
    console.log("this.selectedNotesArray in remove :", this.selectedNotesArray);
    this.selectedNotesSubject.next(this.selectedNotesArray);
  }

  //selected notes uncheck
  unSelectAll() {
    this.selectedNotesArray = [];
    this.selectedNotesSubject.next(this.selectedNotesArray);
    this.multipleSelectArray = [];
    this.multipleSelectSubject.next(this.multipleSelectArray);
  }

  returnSelectedNotes(): BehaviorSubject<Array<any>> {
    return this.selectedNotesSubject;
  }

  multiSelect(index, value) {
    this.multipleSelectArray[index] = value;
    console.log("this.multipleSelectArray :", this.multipleSelectArray);
    this.multipleSelectSubject.next(this.multipleSelectArray);
  }

  //value is particular label -common label for user
  userLabelAdd(value) {
    this.userLabelArray.push(value);
    this.userLabelSubject.next(this.userLabelArray);
  }

  userLabelRemove(value) {
    this.userLabelArray.splice(this.userLabelArray.indexOf(value), 1);
    this.userLabelSubject.next(this.userLabelArray);
  }

  //removes from each note
  removeLabelFromUser(label, index) {
    this.notesDataArray[index].labels.splice(this.notesDataArray[index].labels.indexOf(label), 1);
    this.NotesSubject.next(this.notesDataArray);
    this.websocket.getSocket().emit('dbupdateAll', this.notesDataArray);
  }


  changeLabel(label, headerNotes, rmAdd) {
    headerNotes.forEach((editNote, index) => {
      this.notesDataArray.forEach((mainNote, i) => {
        if (mainNote._id == editNote._id) {
          if (!mainNote.labels.includes(label)) {
            if (rmAdd) {
              mainNote.labels.push(label);
            }
          } else {
            if (!rmAdd) {
              mainNote.labels.splice(mainNote.labels.indexOf(label), 1);
            }
          }
        }
      });
    });
    console.log(" this.notesDataArray changelabel  :", this.notesDataArray);
    this.NotesSubject.next(this.notesDataArray);
    this.websocket.getSocket().emit('dbupdateAll', this.notesDataArray);
  }

  //Post note

  addNote(value): Observable<any> {
    return this.httpClient.post<any>(this.notesURL, value, {
      headers: new HttpHeaders().set(`Authorization`, `${this.auth.getBearerToken()}`)
    }).pipe(tap(addedNote => {
      console.log("added : ", addedNote);
      this.notesDataArray.push(addedNote['data']);
      this.NotesSubject.next(this.notesDataArray);
    }));
  }


  deleteNote(notes) {
    let newArray = this.notesDataArray;
    notes.forEach((value, index) => {
      console.log("index  :", index);
      this.notesDataArray.forEach((each, i) => {
        if (each._id == value._id) {
          console.log("Inside deleteSelected service :", each._id);
          console.log("Inside deleteSelected service :", value._id);
          newArray.splice(i, 1);
        }
      });
    });
    this.notesDataArray = newArray;
    console.log("Inside deleteSelected service", this.notesDataArray);
    this.NotesSubject.next(this.notesDataArray);
    this.websocket.getSocket().emit('deleteNotes', notes);
    // this.unSelectAll();
    // return resolve(true);
  }

  setReminder(scheduleId, time, index) {
    this.notesDataArray[index].reminder = time;
    this.notesDataArray[index].reminderId = scheduleId;
    this.NotesSubject.next(this.notesDataArray);
    this.websocket.getSocket().emit('dbupdateAll', this.notesDataArray);
  }

  removeReminder(index) {
    this.notesDataArray[index].reminder = null;
    this.notesDataArray[index].reminderId.cancel();
    this.notesDataArray[index].reminderId = null;
    this.NotesSubject.next(this.notesDataArray);
    this.websocket.getSocket().emit('dbupdateAll', this.notesDataArray);
  }

  setfavourite(index) {
    console.log("inside set favourite ", index);
    this.notesDataArray[index].favourite = !this.notesDataArray[index].favourite;
    this.NotesSubject.next(this.notesDataArray);
    this.websocket.getSocket().emit('dbupdateAll', this.notesDataArray);
  }

  groupSetFavourite(headerNotes, favBoo) {
    headerNotes.forEach((value, hIndex) => {
      this.notesDataArray.forEach((noteValue, Nindex) => {
        if (value._id == noteValue._id) {
          noteValue.favourite = favBoo;
        }
      });
    });
    this.websocket.getSocket().emit('dbupdateAll', this.notesDataArray);
    this.NotesSubject.next(this.notesDataArray);
  }

  shareSingle(eachArray, usershareId) {
    this.notesDataArray.forEach((value, index) => {
      if (value._id == eachArray._id) {
        this.notesDataArray[index] = eachArray;
        this.NotesSubject.next(this.notesDataArray);
        this.websocket.getSocket().emit('dbupdateAll', this.notesDataArray);
        return;
      }
    });

  }
  //bulk value share
  shareUpdate(arrayValue, usershareId) {
    console.log("inside share update", usershareId);
      this.notesDataArray = arrayValue;
      this.NotesSubject.next(this.notesDataArray);

      this.websocket.getSocket().emit('dbupdateAll', this.notesDataArray);
      this.websocket.getSocket().emit('sharetoUser', usershareId);

  }



}
