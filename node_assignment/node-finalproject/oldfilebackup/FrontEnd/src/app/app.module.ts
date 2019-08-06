import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatCardModule} from '@angular/material/card';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import { MatListModule, MatDialogModule, MatSelectModule, MatIconModule, MAT_DIALOG_DATA,MatSnackBar  } from '@angular/material';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {FormsModule} from '@angular/forms';
import { NoteComponent } from './note/note.component';
import {NotesService} from './services/notes.service';
import {AuthenticationService} from './services/authentication.service';
import { HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NoteTakerComponent } from './note-taker/note-taker.component';
import { NoteViewComponent } from './note-view/note-view.component';
import { ListViewComponent } from './list-view/list-view.component';
import { ReactiveFormsModule } from '@angular/forms';
import {RouterService} from './services/router.service';
import { NoteEditService } from './services/note-edit.service';
import {CanActivateRouteGuard} from './can-activate-route.guard';
import { EditNoteOpenerComponent } from './edit-note-opener/edit-note-opener.component';
import { EditNoteViewComponent } from './edit-note-view/edit-note-view.component';

import {RouterModule, Routes} from '@angular/router';
import { NoteEditViewComponent } from './note-edit-view/note-edit-view.component';
import { SidePanelComponent } from './side-panel/side-panel.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
const appRoutes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: '',  redirectTo: '/dashboard', pathMatch: 'full'},
  {path: 'dashboard', component: DashboardComponent, children: [
      {
        path: 'view/noteview',
        component: NoteViewComponent,
        canActivate: [CanActivateRouteGuard]
      }, {
        path: '',
        redirectTo: 'view/noteview',
        pathMatch: 'full',
        canActivate: [CanActivateRouteGuard]
      }, {
        path: 'view/listview',
        component: ListViewComponent,
        canActivate: [CanActivateRouteGuard]
      },
    //   { path: 'note/:noteId/edit',
    //     component: EditNoteOpenerComponent,
    //     outlet: 'noteEditOutlet',
    //     canActivate: [CanActivateRouteGuard]
    //   }
    ],canActivate: [CanActivateRouteGuard]},
];

@NgModule({
  declarations: [AppComponent,
    HeaderComponent,
    LoginComponent,
    DashboardComponent,
    NoteTakerComponent,
    NoteViewComponent,
    ListViewComponent,
    NoteComponent,
    EditNoteOpenerComponent,
    EditNoteViewComponent,
    NoteEditViewComponent,
    SidePanelComponent
    ],
  imports: [ BrowserModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatCardModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatSelectModule,
    FormsModule,
    MatListModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatMenuModule,
    MatIconModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    MatSnackBarModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    RouterModule.forRoot(appRoutes) ],
  providers: [NotesService, AuthenticationService, RouterService, CanActivateRouteGuard,NoteEditService ],
   bootstrap: [AppComponent],
  entryComponents: [EditNoteViewComponent ]
})

export class AppModule { }
