import { Component, OnInit } from '@angular/core'
import { SocketIOService } from './services/socketio.service'
import { IPosition } from './interfaces'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  infoMessage: string;
  constructor() {}

  ngOnInit(): void {
  }

  getInfoMessage(message: string): void {
    this.infoMessage = message;
  }
}
