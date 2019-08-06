import { Component, OnInit } from '@angular/core';
import { trigger, transition, animate, style } from '@angular/animations'
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { AuthenicateService } from '../services/authenicate.service';
import { RouterService } from '../services/router.service';
import { NoteTakeGetService } from '../services/note-take-get.service';
import { FilternotesService } from '../services/filternotes.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateY(-100%)' }),
        animate('500ms ease-in', style({ transform: 'translateY(0%)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ transform: 'translateY(-100%)' }))
      ])
    ])
  ]
})
export class HeaderComponent implements OnInit {

  titleTerm: String;
  loginDashState: any;
  editHeader: Array<any> = [];
  labelHeader: Array<any> = [];
  labelTerm: String;
  selecteduserLabels: any;
  indeterminate = [];
  checkValue = [];
  favHeader: boolean;
  favHeaderIN: boolean;
  myControl = new FormControl();
  // @ViewChild('deletetrash') colorElem : ElementRef;
  constructor(private NTGS: NoteTakeGetService, private auth: AuthenicateService, private router: RouterService, private filterSrv: FilternotesService) { }

  ngOnInit() {
    this.auth.dataLoginReg.subscribe(res => {
      console.log("response from check :", res);
      this.loginDashState = res; //true => token available //false => no token
    });
    this.NTGS.selectedNotes.subscribe(res => {
      this.editHeader = res;
      console.log("edit header column selected notes :", this.editHeader);
      this.onChangeSelected();
      this.favHeaderInitial();
    });
    this.NTGS.userLabels.subscribe(res => {
      this.labelHeader = res;
      this.onChangeSelected();
    });
    // this.NTGS.selecteduserLabels.subscribe(res=>{
    //   this.selecteduserLabels=res;
    // });

  }

  //   ngAfterViewInit() {
  //     this.colorElem.nativeElement.addEventListener('click', 
  //     (event)=>{
  //       console.log("delete");
  //         // handle click here
  //     });
  // }

  favHeaderInitial() {
    let count = 0;
    this.editHeader.forEach(value => {
      if (value.favourite) {
        count += 1;
      }
    });
    if (count == this.editHeader.length) {
      this.favHeader = true;
    } else {
      if (count > 0) {
        this.favHeaderIN = true;
      }
      this.favHeader = false;
    }
  }

  logOut() {
    this.loginDashState = false;
    this.auth.removeBearerToken();
    this.auth.removeFriends();
    this.auth.removeUserDetails();
    this.router.routeToLogin();
  }

  unSelectAll() {
    this.NTGS.unSelectAll();
  }

  // delete selcted notes i.e checked notes
  deleteSelected() {
    console.log("Inside deleteSelected");
    this.NTGS.deleteNote(this.editHeader);
    this.NTGS.unSelectAll();
  }


  onChangeSelected() {
    // this.editHeader.forEach((note,i)=>{
    //   //value lable header
    //   let boo:Array=[null];
    //   this.selecteduserLabels.forEach((value,labelIndex)=>{
    //     //note editheader notes
    //     // console.log("label Indx :",labelIndex);
    //     if(note.labels.includes(value)){
    //       // console.log("Inside true");
    //       boo.push(true);
    //     }else{
    //       // console.log("Inside false");
    //       boo.push(false);
    //     }
    //   });
    //   if(boo.includes(false)){
    //     this.indeterminate[i]=true;
    //     this.checkValue[i]=false;
    //   }else{
    //     this.indeterminate[i]=false;
    //     this.checkValue[i]=true;
    //   }      
    // });
    for (var i = 0; i < this.labelHeader.length; i++) {
      var count = 0;
      for (var j = 0; j < this.editHeader.length; j++) {
        if (this.editHeader[j].labels.includes(this.labelHeader[i])) {
          count++;
        }
      }
      if (count == this.editHeader.length) {
        this.checkValue[i] = true;
        this.indeterminate[i] = false;
      }
      else if (count > 0) {
        this.checkValue[i] = false;
        this.indeterminate[i] = true;
      }
      else {
        this.checkValue[i] = false;
        this.indeterminate[i] = false;
      }
    }
    // console.log("indeterminate  :",this.indeterminate);
  }

  onUpdate(index) {
    this.NTGS.changeLabel(this.labelHeader[index], this.editHeader, this.checkValue[index]);
    //value for selected notes
    //all selected notes

  }

  addNewLabel(labelTerm) {
    this.labelHeader.push(labelTerm);
  }

  headerfavourite() {
    // this.favHeaderInitial();
    console.log("Inside Header favourite", this.favHeader);
    this.NTGS.groupSetFavourite(this.editHeader, this.favHeader);
  }

  SearchTitle() {
    console.log('Inside SearchTitle  :', this.titleTerm);
    this.filterSrv.favoriteTrigger(this.titleTerm);
  }


}
