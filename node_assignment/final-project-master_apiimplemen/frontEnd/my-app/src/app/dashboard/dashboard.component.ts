import { Component, OnInit } from '@angular/core';
import { NoteTakeGetService } from '../services/note-take-get.service';
import { AuthenicateService } from '../services/authenicate.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  dataNotes:any;

  constructor(private NTGS : NoteTakeGetService,private auth : AuthenicateService) { }

  ngOnInit() {
    this.NTGS.getAllNotes(this.auth.getUserId());    
  }

}
