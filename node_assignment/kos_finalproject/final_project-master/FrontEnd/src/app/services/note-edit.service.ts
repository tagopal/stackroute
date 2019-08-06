import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { Note } from '../note';

@Injectable()
export class NoteEditService {
    private currentNote = new BehaviorSubject<Note>(null);
    currentNoteObs = this.currentNote.asObservable();

    constructor() { }

    getValue() : Observable<Note>{
        return this.currentNoteObs;
    }

    setValue(note : Note){
        console.log("setting_edit_note_id")
        this.currentNote.next(note);
    }
}
