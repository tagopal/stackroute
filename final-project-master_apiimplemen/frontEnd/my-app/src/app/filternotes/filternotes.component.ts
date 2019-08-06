import { Component, OnInit, Input } from '@angular/core';
import { NoteTakeGetService } from '../services/note-take-get.service';
import { FilternotesService } from '../services/filternotes.service';
@Component({
  selector: 'app-filternotes',
  templateUrl: './filternotes.component.html',
  styleUrls: ['./filternotes.component.css']
})
export class FilternotesComponent implements OnInit {


  links = ['Notes', 'Favourites', 'Shared with me'];
  faces = ['note', 'favorite', 'share'];
  noteviewTrigger = ['', 'true', 'not show', 'no show'];
  userLabels: Array<any> = [];
  // badge=[",",",","10"];
  // first normal second labels index
  activeIndex = [0, null];
  // filterNotes:any;
  constructor(private NTGS: NoteTakeGetService, private filterSrv: FilternotesService) { }

  ngOnInit() {
    this.NTGS.userLabels.subscribe(res => {
      console.log('common userLabels from db in filter :', res);
      this.userLabels = res;
    }, err => {
      console.log('common All userLabels from db in filter :', err);
    });

  }

  activeClick(currentIndex) {
    this.activeIndex[0] = currentIndex;
    this.filterSrv.favoriteTrigger(this.noteviewTrigger[currentIndex]);
    this.activeIndex[1] = null;
  }

  eachLabel(index) {
    this.activeIndex[1] = index;
    this.activeIndex[0] = null;
    this.filterSrv.favoriteTrigger(this.userLabels[index]);

  }

}
