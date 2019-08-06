import { Component, OnInit } from '@angular/core';
import { NotesService } from '../services/notes.service';
import { Label } from '../model/label';
@Component({
  selector: 'app-side-panel',
  templateUrl: './side-panel.component.html',
  styleUrls: ['./side-panel.component.css']
})
export class SidePanelComponent implements OnInit {

    labelList: Array<Label>;
    currLabel: string;
    favViewActive : string;
  constructor(private notesService : NotesService) { }

  ngOnInit() {
      this.notesService.getLabels().subscribe(labels=>{
          console.log(labels);
          this.labelList = labels;
      })

      this.notesService.getCurrLabel().subscribe(currLabel=>{
          console.log("currLabel");
          console.log(currLabel);
        this.currLabel = currLabel;
      })

      this.notesService.getFavView().subscribe(state=>{
        this.favViewActive = state;
      })
  }

  labelView(index){
      console.log("labelView");
      console.log(this.labelList);
      console.log(this.labelList[index]);
    //   this.currLabel = index;
      this.notesService.labelView(this.labelList[index].name,this.labelList[index].noteIds);
      this.notesService.clearSelected();
  }

  clearLabel(){
      console.log("clearLabel");
  }

  removeLabel(index){
    this.notesService.removeLabel(this.labelList[index]);
  }
  notesView(){
      this.notesService.defaultView();
      this.notesService.clearSelected();
  }

  favView(){
      this.notesService.favView();
  }

  shareView(){
      this.notesService.shareView();
  }

}
