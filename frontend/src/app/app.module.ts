import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout'
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatDialogModule,
  MatGridListModule,
  MatFormFieldModule,
  MatInputModule,
  MatTableModule,
  MatProgressBarModule,
  MatCardModule
} from '@angular/material';
import { MatIconModule } from '@angular/material/icon'
import { MatListModule } from '@angular/material/list'
import { RestAPIService } from './services/restapi.service'
import { HttpClientModule } from '@angular/common/http';
import { ControlsComponent } from './components/controls/controls.component';
import { CamerafeedComponent } from './components/camerafeed/camerafeed.component'
import { SocketIOService } from './services/socketio.service'
import { SocketIoModule } from 'ngx-socket-io'
import { MatSelectModule } from '@angular/material/select';
@NgModule({
  declarations: [
    AppComponent,
    ControlsComponent,
    CamerafeedComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    FlexLayoutModule,
    HttpClientModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatGridListModule,
    MatInputModule,
    MatTableModule,
    MatIconModule,
    MatListModule,
    MatProgressBarModule,
    MatCardModule,
    MatSelectModule,
    ReactiveFormsModule,
    SocketIoModule
  ],
  entryComponents: [
    ControlsComponent
  ],
  providers: [RestAPIService, SocketIOService],
  bootstrap: [AppComponent]
})
export class AppModule {}
