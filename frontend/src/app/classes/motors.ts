import { RestAPIService } from '../services/restapi.service';


/*
klasa sterująca ruchem silników, komunikująca się z api serwera
*/
export class Motors {

  axes: Array<String>
  lastMoveCommand: Object
  lockSpeeds: Boolean = false

  engineStep = {
    x: undefined,
    y: undefined,
    z: undefined
  }

  maxPos = {
    x: undefined,
    y: undefined,
    z: undefined
  }

  speedLevel = {
    x: 0,
    y: 0,
    z: 0
  }

  constructor(private restAPIService: RestAPIService) {
    this.lastMoveCommand = {
      'x': {
        value: '',
        counter: 0
      },
      'y': {
        value: '',
        counter: 0
      },
      'z': {
        value: '',
        counter: 0
      }
    }   
  }

  toggleLockSpeeds(value = undefined) {
    this.lockSpeeds = (value == undefined) ? !this.lockSpeeds : value
  }

  prevVals = {
    x: -1,
    y: -1,
  }

  setMove(axis: string, value: number, speedLevel: number = 1) {
    if (this.lockSpeeds || isNaN(value) 
        || (value === 0 && this.prevVals[axis] === 0)) {
      return;
    }

    if ('move' + value + speedLevel == this.lastMoveCommand[axis].value){
      if (this.lastMoveCommand[axis].counter < 2) {
        this.lastMoveCommand[axis].counter++
        return
      }      
    }
    
    this.prevVals[axis] = value

    this.lastMoveCommand[axis] = {
      value: 'move' + value + speedLevel,
      counter: 0
    }
    this.speedLevel[axis] = Math.abs(speedLevel)
    this.restAPIService.setMove(axis, value, speedLevel).subscribe(null,
      error => console.log('error move:', error)
    )
  }

  setStop() {
    this.toggleLockSpeeds(false)
    this.speedLevel = {
      x: 0,
      y: 0,
      z: 0
    }
    this.restAPIService.setStop().subscribe(null,
      error => console.error('error stop:', error)
    )
  }

  setHome(axis: string = undefined): void {
    if (axis === 'x' || axis == undefined) 
      this.restAPIService.setHome('x').subscribe(null,
        error => console.error(error.toString())
      )

    if (axis === 'y' || axis == undefined)
      this.restAPIService.setHome('y').subscribe(null,
        error => console.error(error.toString())
      )
  }

  setStep(value: number) {
    this.restAPIService.setStep(value).subscribe(null,
      error => console.error(error.toString())  
    )
  }

  toggleStep() {
    this.restAPIService.toggleStep().subscribe(null,
      error => console.error(error.toString())  
    )
  }

  setStepZero() {
    this.restAPIService.setStepZero().subscribe(null,
      error => console.error(error.toString())  
    )
  }

  setRelay(value: string) {
    this.restAPIService.setRelay(value).subscribe(null,
      error => console.error(error.toString())  
    )
  }

  setStartBound() {
    this.restAPIService.setStartBound().subscribe(null,
      error => console.error(error.toString())
    )
  }

  setEndBound() {
    this.restAPIService.setEndBound().subscribe(null,
      error => console.error(error.toString())
    )
  }
}
