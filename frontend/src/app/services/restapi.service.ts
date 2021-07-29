import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { IValue, IPosition, IPositionRecord } from '../interfaces'
import { IOscillationParams } from '../interfaces/oscillation'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class RestAPIService {

  baseUri: String

  constructor(private http: HttpClient) { }

  setMove(name: string, value: number, speedLevel: number = 0) {
    value = 250 * value
    return this.http.post<any>(`/api/move/${name}/${value}`, null)
  }

  setPosition(position: IPosition) {
    return this.http.post<IPosition>('/api/position', position)
  }

  getPosition(){
    return this.http.get<any>('/api/position')
  }

  testPosition(){
    return this.http.get<any>('/test/position')
  }

  setHome(axis: string) {
    return this.http.post<any>(`/api/home/${axis}`, null)
  }

  setMaxpos(axis: string) {
    return this.http.post<any>(`/api/maxpos/${axis}`, null)
  }

  getMaxpos(axis: string) {
    return this.http.get<IValue>(`/api/maxpos/${axis}`)
  }

  getEngineStep(axis: string) {
    return this.http.get<IValue>(`/api/enginestep/${axis}`)
  }

  setStop() {
    return this.http.post<any>('/api/stop', null)
  }

  setStep(value: number) {
    return this.http.post<any>(`/api/step/${value}`, null)
  }

  toggleStep() {
    return this.http.post<any>('/api/toggle_step', null)
  }

  setStartBound() {
    return this.http.post<any>('/api/bound_start', null)
  }

  setEndBound() {
    return this.http.post<any>('/api/bound_end', null)
  }

  setStepZero() {
    return this.http.post<any>('/api/step_zero', null)
  }

  setRelay(value: string) {
    return this.http.post<any>(`/api/set_relay/${value}`, null)
  }

  setOscillationParams(params: IOscillationParams) {
    return this.http.post<IOscillationParams>('/api/oscillation', params)
  }

  getOscillationParams(): Observable<IOscillationParams> {
    return this.http.get<IOscillationParams>('/api/oscillation')
  }

  startOscillation(oscillationType: string): Observable<any> {
    return this.http.post<any>(`/api/start_oscillation`, {oscillationType})
  }

}
