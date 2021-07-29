import { Injectable } from '@angular/core'
import { Socket } from 'ngx-socket-io'
import { Observable } from 'rxjs'
import { IPosition } from '../interfaces'
import { IOscillationParams } from '../interfaces/oscillation'

@Injectable({
  providedIn: 'root'
})
export class SocketIOService extends Socket {

  constructor() {
    super({ url: '/', options: {} });
  }

  getPosition(): Observable<IPosition> {
    return this.fromEvent<IPosition>('position');
  }

  getOscillationParams(): Observable<IOscillationParams> {
    return this.fromEvent<IOscillationParams>('parameters');
  }

}
