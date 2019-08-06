import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/catch';
// import 'rxjs/add/operator/throw';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Note } from '../note';
import {AuthenticationService} from './authentication.service';
import { Label } from '../model/label';
import * as io from 'socket.io-client';
import {MatSnackBar} from '@angular/material';

@Injectable()
export class NotesService {
    selectedNotes : Array<Note> =[];
    private selectedNotesSubject = new BehaviorSubject<Array<Note>>([]);
    selectedNotesObs = this.selectedNotesSubject.asObservable();

    notesListDefault :  Array<Note>;
    notes: Array<Note>;
    notesSubject = new BehaviorSubject<Array<Note>>([]);
    notesObs = this.notesSubject.asObservable();
    notesSubs : Array<Note>;

    labels: Array<Label>;
    labelsSubject = new BehaviorSubject<Array<Label>>([]);
    labelsObs = this.labelsSubject.asObservable();

    currLabel : string = '';
    currLabelSubject = new BehaviorSubject<string>('');
    currLabelObs = this.currLabelSubject.asObservable();

    favorite : Array<number> = [];
    favSubject = new BehaviorSubject<Array<number>>([]);
    favObs = this.favSubject.asObservable();

    socket: SocketIOClient.Socket;
        
    shareUserList : Array<string> = [];
    shareUserListSubject = new BehaviorSubject<Array<string>>([]);
    shareUserListObs = this.shareUserListSubject.asObservable();

    shareNotesList : Array<Note> = [];
    shareNotesListSubject = new BehaviorSubject<Array<Note>>([]);
    shareNotesListObs = this.shareNotesListSubject.asObservable();
  constructor(private http: HttpClient, private auth_Service: AuthenticationService,private snackBar: MatSnackBar){  
    this.notesSubject = new BehaviorSubject<Array<Note>>([]); }
    favViewActive : string = 'note';
    favViewActiveSubject= new BehaviorSubject<string>('note');
    favViewActiveObs = this.favViewActiveSubject.asObservable();

    getFavView() : Observable<string>{
        return this.favViewActiveObs;
    }
  fetchNotesFromServer() {
      console.log("fetchNotesFromServer");
    // ,{'id':0,'name':'one','labels':[0,1,2]},{'id':0,'name':'one','labels':[0,1,2]}
    //   this.labels = [{'name':'one','noteIds':[11,12,13,14,15]},{'name':'two','noteIds':[11,12,13,14,15]},{'name':'three','noteIds':[11,13]}];
    //   this.labelsSubject.next(this.labels);
      this.favorite = [];
      this.favSubject.next(this.favorite);
      this.currLabelObs.subscribe(label=>{
          this.currLabel = label;
      })
      this.notesObs.subscribe(notes=>{
          this.notesSubs = notes;
      })
      this.socketSetup();
     this.http.get<Note[]>(`http://localhost:3000/api/v1/notes?userId=${this.auth_Service.getUserId()}`, {headers: new HttpHeaders().set('Authorization', `Bearer ${this.auth_Service.getBearerToken()}`)
      }).subscribe((res) => {
          console.log("initial notes")
          console.log(res);
        this.notesListDefault = res;
      this.notes = res;
      console.log(this.notesListDefault);
                console.log(this.notes);
      this.notesSubject.next(this.notes);
      console.log("subbed");
      console.log(this.notesSubs);
    });

    this.http.get<any>(`http://localhost:3000/api/v1/userInfo?userId=${this.auth_Service.getUserId()}`, {headers: new HttpHeaders().set('Authorization', `Bearer ${this.auth_Service.getBearerToken()}`)
      }).subscribe((res) => {
          console.log("userInfo");
          console.log(res);
          if(res.length>0){
              this.favorite = res[0].favorites;
              this.favSubject.next(this.favorite);
              this.labels = res[0].labels;
              this.labelsSubject.next(this.labels);
              this.shareUserList = res[0].shareUserList;
              this.shareUserListSubject.next(this.shareUserList);
              this.shareNotesList = res[0].sharedNoteList;
              this.shareNotesListSubject.next(this.shareNotesList);
          }
          else{
            this.favorite = [];
            this.favSubject.next(this.favorite);
            this.labels = [];
            this.labelsSubject.next(this.labels);
            this.shareUserList = [];
              this.shareUserListSubject.next(this.shareUserList);
              this.shareNotesList = [];
              this.shareNotesListSubject.next(this.shareNotesList);
          }
    });
  }

    socketSetup(){
        console.log("socketSetup");
        if(this.auth_Service.getUserId()){
            this.socket = io.connect("http://localhost:3000");
            this.socket.emit("register",{userName:localStorage.getItem("userName")})
            this.socket.on('notification',(data)=>{
            if(data!=null){
                // this.fetchNotesFromServer();
                // this.notificationSubject.next(data);
            }
            })
            this.socket.on('connect',()=>{
                console.log("connected to the socket server")
            })
            this.socket.on('sendMsg',(data)=>{
                console.log("sendMsg");
                console.log(data);
                data.notes.forEach(newNote=>{
                    var flag=0;
                    this.shareNotesList.forEach(listNote=>{
                        if(newNote._id==listNote._id){
                            flag=1;
                        }
                    })
                    if(flag==0){
                        this.shareNotesList.push(newNote);
                    }
                })
                // this.shareNotesList.push;
                this.shareNotesListSubject.next(this.shareNotesList);
                this.snackBar.open('New note shared with you', 'Dismiss', {
                    duration: 10000,
                });
                
            })
        }
    }

    setReminder(date : Date){
        this.socket.emit("reminder",{date:date});
    }
    //share notes
    shareNote(userName:string,notes : Array<Note>){
        console.log("shareNote");
        this.socket.emit("share",{userName:userName,notes:notes,sender:{userId:this.auth_Service.getUserId(),userName:localStorage.getItem("userName")}});
    }

    getShareUser(): Observable<Array<String>> {
        return this.shareUserListObs;
    }

    addShareUser(userName:string){
        console.log(userName);
        this.shareUserList.push(userName);
        this.shareUserListSubject.next(this.shareUserList);
        this.socket.emit("addShareUser",{userId:this.auth_Service.getUserId(),shareUserName:userName});
    }

    shareView(){
        console.log("shareView");
        this.notes = this.shareNotesList;
        this.notesSubject.next(this.notes);
        this.favViewActive = 'share';
        this.favViewActiveSubject.next('share');
        this.currLabel="";
        this.currLabelSubject.next(this.currLabel);
        this.clearSelected();
    }
    //notes functionality
    addNote(note: Note){
        console.log("addNote");
        return this.http.post<Note>(`http://localhost:3000/api/v1/notes?userId=${this.auth_Service.getUserId()}`, note, {
            headers: new HttpHeaders()
            .set('Authorization', `Bearer ${this.auth_Service.getBearerToken()}`)
        }).toPromise().then(res=>{
                console.log("res");
                console.log(res);
                console.log(this.notesListDefault);
                console.log(this.notes);
                this.notesListDefault.push(res);
                console.log(this.notesListDefault);
                this.notesSubject.next(this.notesListDefault);
        }).catch(this.errorHandler);
        
    }

    getNotes(): BehaviorSubject<Array<Note>> {
        return this.notesSubject;
    }

    editNote(notes: Array<Note>) {
        console.log("editNote")
        console.log(notes);
        return this.http.put<Array<Note>>(`http://localhost:3000/api/v1/notes`, notes, {
            headers: new HttpHeaders()
            .set('Authorization', `Bearer ${this.auth_Service.getBearerToken()}`)
        }).toPromise().then(res=>{
            console.log(res);
            this.notesListDefault.forEach(defNote=>{
                res.forEach(note=>{
                    if(note._id==defNote._id){
                        defNote = note;
                    }
                })
            })
        }).catch(this.errorHandler);
    }

    getNoteById(noteId): Note {
        return this.notes.find(i => i._id === noteId);
     }

    deleteNotes(noteList){
        var notes = [];
        var tempNoteIdList = [];
        this.http.post<Note>(`http://localhost:3000/api/v1/notes/remove`, noteList, {
            headers: new HttpHeaders()
            .set('Authorization', `Bearer ${this.auth_Service.getBearerToken()}`)
        }).toPromise().then(res=>{
            console.log(res);
        }).catch(this.errorHandler);
        noteList.forEach(selNote=>{
            tempNoteIdList.push(selNote._id);
        })
        //remove from favorite list
        this.favorite = this.favorite.filter(favItem=>{
            return !tempNoteIdList.includes(favItem);
        })
        //remove from default list
        this.notesListDefault.forEach(note=>{
            if(!tempNoteIdList.includes(note._id)){
                notes.push(note);
            }
        })
        this.notesListDefault = notes;
        //update view
        if(this.currLabel||this.favViewActive){
            notes=[];
            this.notes.forEach(note=>{
                if(!tempNoteIdList.includes(note._id)){
                    notes.push(note);
                }
            })
            this.notes=notes;
            this.notesSubject.next(notes);
        }
        else{
            this.notesSubject.next(this.notesListDefault);
        }
        //remove selection header
        this.clearSelected();
    }

    //Label Functionality

    addNewLabel(title,notes){
        console.log(title+'added');
        console.log(notes);
        this.updateLabels(title,notes,true);
        var noteIds=[];
        notes.forEach(note=>{
            noteIds.push(note._id);
        })
        var newLabel = {name:title,noteIds:noteIds}
        this.labels.push(newLabel);
        this.labelsSubject.next(this.labels);
        console.log(this.labels);
    }

    removeLabel(label){
        console.log("remove label");
        console.log(label);
        this.socket.emit("removeLabel",{label:label,userId:this.auth_Service.getUserId()});
        //remove label from notes in main default list
        label.noteIds.forEach(id=>{
            this.notesListDefault.forEach(note=>{
                if(note._id==id){
                    console.log("true");
                    console.log(note.labels);
                    note.labels = note.labels.filter(noteLabel=>noteLabel!=label.name);
                    console.log(note.labels);
                }
            })
        })
        this.notesSubject.next(this.notesListDefault);
        if(this.currLabel==label.name){
            this.defaultView();
        }

        //remove label from label list
        this.labels.forEach(labelObj=>{
            this.labels = this.labels.filter(labelObj => labelObj.name!=label.name);
        })
        this.labelsSubject.next(this.labels);
    }

    updateLabels(title,selectedNoteIds,state){
        //modifying labels in main array
        this.socket.emit("updateLabel",{notes:selectedNoteIds,state:state,label:title,userId:this.auth_Service.getUserId()});
        this.notesListDefault.forEach(note=>{
          selectedNoteIds.forEach(newNote=>{
              if(note.id==newNote.id){
                  console.log("before");
                  console.log(note);
                  if(state&&!note.labels.includes(title)){
                      console.log("added");
                      note.labels.push(title)
                  }
                  else if(!state&&note.labels.includes(title)){
                      console.log("removed");
                      note.labels = note.labels.filter(label=>label!=title);
                  }
                  console.log("after");
                  console.log(note);
              }
          })
        })
      //   this.notesSubject.next(this.notesListDefault);
        //updating id array in label list
        this.labels.forEach(label=>{
            if(label.name==title){
                selectedNoteIds.forEach(note=>{
                  if(state&&!label.noteIds.includes(note._id)){
                      label.noteIds.push(note._id)
                  }
                  else if(!state&&label.noteIds.includes(note._id)){
                      label.noteIds = label.noteIds.filter(id=>id!=note._id);
                  }
                })
            }
        })
        //update view
        console.log("out update view")
        console.log(this.currLabel);
        console.log(title);
        if(this.currLabel==title&&!state){
            console.log("update view");
            console.log(selectedNoteIds);
            console.log(this.notes);
              var tempNotes = [];
              selectedNoteIds.forEach(selNote=>{
                  this.notes.forEach(note=>{
                      if(selNote._id!=note._id){
                          tempNotes.push(note);
                      }
                  })
              })
              this.notes = tempNotes;
              this.notesSubject.next(this.notes);
        }
    }

    getLabels(): Observable<Array<Label>> {
        return this.labelsObs;
    }
    getCurrLabel() : Observable<string>{
        return this.currLabelObs;
    }

    updateLabel(noteIdList,labelList){
        console.log("updateLabel");
      console.log(noteIdList);
      console.log(labelList);
    }
  

    //Favorite Functionality
    getFav() : Observable<Array<number>>{
        return this.favObs;
    }
    updateFavorite(noteId,state){
        this.notesListDefault.forEach(note=>{
            if(note._id==noteId){
                if(state&&!this.favorite.includes(noteId)){
                    console.log(`adding ${note._id}`)
                    this.favorite.push(noteId);
                    this.favSubject.next(this.favorite);
                    note.favorite = state;
                }
                else if(!state&&this.favorite.includes(noteId)){
                    console.log(`removing ${note._id}`)
                    this.favorite = this.favorite.filter(item=>item!=noteId);
                    this.favSubject.next(this.favorite);
                    note.favorite = state;
                    // note.labels = note.labels.filter(label=>label!=title);
                }
                // note.favorite = state;
            }
        })
        console.log(this.favorite);
        if(this.favViewActive=="fav"){
            this.favView();
        }
    }
    updateFavoriteList(noteList : Array<Note>,state : boolean){
        console.log('updateFavoriteList');
        console.log(noteList);
        console.log(state);
        console.log(this.favorite);
        this.socket.emit('updateFav',{notes:noteList,state:state,userId:this.auth_Service.getUserId()})
        noteList.forEach(note=>{
            this.updateFavorite(note._id,state);
        })
    }
  

    //Selected Functionality
    addSelected(note){
        this.selectedNotes.push(note);
        console.log("selectedNotes");
        console.log(this.selectedNotes);
        this.selectedNotesSubject.next(this.selectedNotes);
    }

    removeSelected(note){
        this.selectedNotes = this.selectedNotes.filter(function(e) { return e !== note })
        console.log(this.selectedNotes);
        this.selectedNotesSubject.next(this.selectedNotes);
    }
    clearSelected(){
        this.selectedNotes = [];
        this.selectedNotesSubject.next(this.selectedNotes);
    }

    getSelected() : Observable<Array<Note>> {
        return this.selectedNotesObs;
    }

    labelSelected(title){
        for(var i=0;i<this.labels.length;i++){
            if(this.labels[i].name.toLowerCase()==title.toLowerCase()){
                this.labelView(title,this.labels[i].noteIds);
                break;
            }
        }
    }
    //Search Functionality 

    searchNoteTitle(searchTitle){
        console.log(this.notesListDefault);
        console.log(this.notesListDefault.filter(note => note.title.toLowerCase().indexOf(searchTitle) === 0));
        this.notes= [];
        this.notesListDefault.forEach(note=>{
            console.log(note.title.toLowerCase());
            console.log(searchTitle.toLowerCase());
            if(note.title.toLowerCase().includes(searchTitle.toLowerCase())){
                console.log("works");
                this.notes.push(note);
            }
        })
        this.notesSubject.next(this.notes);
      }


    //Views Functionality
    labelView(title,noteIds){
        this.clearSelected();
        console.log(noteIds);
        this.notes= [];
        noteIds.forEach(noteId=>{
            this.notesListDefault.forEach(note=>{
                if(noteId == note._id){
                    this.notes.push(note);
                }
            })
        })
        this.currLabelSubject.next(title);
        this.notesSubject.next(this.notes);
        this.favViewActive = '';
        this.favViewActiveSubject.next('');
        // this.currLabel="";
        // this.currLabelSubject.next(this.currLabel);
        this.clearSelected();
    }
    
    defaultView(){
        this.notesSubject.next(this.notesListDefault);
        this.currLabelSubject.next('');
        this.clearSelected();
        this.favViewActive = 'note';
        this.favViewActiveSubject.next('note');
        this.currLabel="";
        this.currLabelSubject.next(this.currLabel);
    }
    
    favView(){
        this.notes = [];
        for(var i=0;i<this.favorite.length;i++){
            for(var j=0;j<this.notesListDefault.length;j++){
                if(this.favorite[i]==this.notesListDefault[j]._id){
                    this.notes.push(this.notesListDefault[j]);
                    break;
                }
            }
        }
        this.notesSubject.next(this.notes);
        this.favViewActive = 'fav';
        this.favViewActiveSubject.next('fav');
        this.clearSelected();
    }


    errorHandler(error: HttpErrorResponse){
        return Observable.throw(error.message||"Server Error");
    }  
}
