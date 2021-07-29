import { Component, OnInit, AfterViewInit,
  HostListener, OnDestroy, Output, EventEmitter } from '@angular/core'
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms'
import {
  ValidateWeldCenter,
  ValidateWeldWidth,
  ValidateXAxis,
  ValidateYSpeed,
  ValidatePWM,
  ValidIntegerNumber
} from './validators'
import { Subscription, timer } from 'rxjs'

import { RestAPIService } from '../../services/restapi.service'
import { SocketIOService } from '../../services/socketio.service'
import { Motors } from '../../classes/motors'
import { IOscillationParams } from 'src/app/interfaces/oscillation'
import { IPosition } from 'src/app/interfaces'
import { Controller } from 'src/app/classes/controller'


@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.css']
})
export class ControlsComponent implements OnInit, AfterViewInit, OnDestroy {
  
  @Output() infoMessage = new EventEmitter<string>()
  positionsReal = [
    {
      axis: 'x',
      value: undefined,
      speedLevel: () => this.motors.speedLevel.x
    },
    {
      axis: 'y',
      value: undefined,
      speedLevel: () => this.motors.speedLevel.y
    },
  ]

  displayedColumns: string[] = ['axis', 'value', 'speedLevel']
  infoMsg: string
  gamepadSubscription: Subscription
  motors: Motors
  joystick: Controller

  highlightStop: boolean = false
  highlightHome: boolean = false
  highlightSettings: boolean = false

  twoStroke: boolean = true
  relayPressed: boolean = false
  welding: boolean = false
  settingBounds: boolean = false

  oscillationType: 'LADDER' | 'CONCAVE' = 'LADDER'

  buttons = {
    relay: 0,
    stop: 1,
    down: 2,
    setBounds: 3,
    up: 4,
    toggleStep: 5,
    lock: 6,
    home: 7,
    zero: 8,
    twoStroke: 9,
    homeY: 10,
    homeX: 11,
  }

  form: FormGroup
  showImage = false
  formSubmitted = false
  imageXPos: number
  imageYPos: number
  startBound: number
  endBound: number
  integerNumberPattern = "/^-?[0-9][^\.]*$/";
  constructor(
    private restAPIService: RestAPIService,
    private socketIOService: SocketIOService,
    private formBuilder: FormBuilder
  ) {
    this.joystick = new Controller()

    this.motors = new Motors(restAPIService)
    const integerNumberPattern = "/^-?[0-9][^\.]*$/";
    // const integerNumberPattern = "/^[-+]?\d+$/;";
    // const integerNumberPattern = "(?<=\s|^)\d+(?=\s|$)";
    this.form = this.formBuilder.group({
      weldCenter: [null, [Validators.required, ValidateWeldCenter, ValidIntegerNumber]],
      weldWidth: [null, [ValidateWeldWidth]],
      xLen: [null, [Validators.required, ValidateXAxis]],
      xRev: [null, [Validators.required, ValidateXAxis]],
      YPointSpeed: [null, [Validators.required, ValidateYSpeed, ValidIntegerNumber]],
      pwmLen: [null, [Validators.required, ValidatePWM, ValidIntegerNumber]],
      pwmRev: [null, [Validators.required, ValidatePWM, ValidIntegerNumber]]
    })
  }

  ngOnInit() {
    this.restAPIService.getOscillationParams().subscribe(resp => {
      this.form.patchValue(resp)
    })
    this.initGamepad()
    this.socketIOService
      .getPosition()
      .subscribe((data: IPosition) => {
        console.log("POSITION PARAMS", data)
        
        if (data.x) {
          this.positionsReal[0].value = data.x
        }
        this.positionsReal[1].value = data.y - 500
      })
  }

  ngOnDestroy(): void {
    this.gamepadSubscription.unsubscribe()
  }

  ngAfterViewInit() {
    this.socketIOService.getOscillationParams().subscribe(resp => {
      console.log("OSCILLATION PARAMS", resp)
      this.form.patchValue(resp)
    })
  }

  @HostListener('window:gamepadconnected', ['$event'])
  onGamepadConnected(event): void {
    this.joystick.connected = true
  }

  @HostListener('window:gamepaddisconnected', ['$event'])
  onGamepadDisconnected(event): void {
    this.joystick.connected = false
  }

  get weldCenter(): AbstractControl {
    return this.form.get('weldCenter')
  }
  
  get weldWidth(): AbstractControl {
    return this.form.get('weldWidth')
  }

  get xLen(): AbstractControl {
    return this.form.get('xLen')
  }

  get xRev(): AbstractControl {
    return this.form.get('xRev')
  }

  get YPointSpeed(): AbstractControl {
    return this.form.get('YPointSpeed')
  }

  get pwmLen(): AbstractControl {
    return this.form.get('pwmLen')
  }

  get pwmRev(): AbstractControl {
    return this.form.get('pwmRev')
  }

  startOscillation() {
    if (this.form.dirty && !this.formSubmitted) {
      this.infoMsg = 'Zatwierdź nowe parametry oscylacji'
      setTimeout(() => this.infoMsg = '', 2600)
    } else {
      console.log(this.oscillationType)
      
      this.restAPIService.startOscillation(this.oscillationType).subscribe({
        error: (_err) => this.formSubmitted = false
      })
    }
  }
  
  handleSubmit(params: IOscillationParams) {
    if (this.form.valid) {
      console.log(params);
      
      this.restAPIService.setOscillationParams(params).subscribe(
        () => {
          this.infoMsg = 'Zapisano pomyślnie'
          setTimeout(() => this.infoMsg = '', 2600)
        },
        (err) => {
          console.error(err)
          this.infoMsg = 'Wystąpił błąd'
          setTimeout(() => this.infoMsg = '', 2600)
        },
        () => this.formSubmitted = true
      )
    } else {
      this.infoMsg = 'Wypełnij wszystkie pola'
      setTimeout(() => this.infoMsg = '', 2600)
    }
  }

  onMouseOver(event: MouseEvent) {
    this.imageXPos = event.clientX
    this.imageYPos = event.clientY
    this.showImage = true
  }

  changeOscillationType(oscillationType: 'LADDER' | 'CONCAVE') {
    this.oscillationType = oscillationType
  }

  private initGamepad() {
    this.joystick.gamepadApi = ('getGamepads' in navigator)
    this.gamepadSubscription = this.createGamepadSub()
  }

  private createGamepadSub(): Subscription {
    return timer(0, 150).subscribe(_ => this.controllerLoop())
  }

  private controllerLoop() {
    if (!this.joystick.gamepadApi){
      alert('GamepadAPI not supported.')
      return
    }

    if (!this.joystick.connected) {
      return
    }

    const controller = this.getController()
    if (controller === undefined) {
      alert('No gamepad.')
      return
    }

    this.joystick.updateAxes(controller)
    
    // ------------------ button handlers ------------------
    const button = this.buttons

    if (controller.buttons[button.stop].pressed) {
      this.onStopClick()
      return
    }

    /* Not implemented */
    // if (controller.buttons[button.home].pressed) {
    //   this.onHomeClick()
    //   return
    // }

    if (controller.buttons[button.relay].pressed) {
      this.relayPress()
      return
    } else {
      if (this.relayPressed) {
        this.relayRelease()
        return
      }
    }

    /* Not implemented */
    // if (controller.buttons[button.zero].pressed) {
    //   this.motors.setStepZero()
    //   return
    // }

    if (controller.buttons[button.toggleStep].pressed) {
      this.motors.toggleStep()
      return
    }

    if (controller.buttons[button.setBounds].pressed) {
      this.onSetBoundsClick()
      return
    }

    if (controller.buttons[button.up].pressed) {
      this.motors.setStep(10)
      return
    }

    if (controller.buttons[button.down].pressed) {
      this.motors.setStep(-10)
      return
    }

    /* Not implemented */
    // if (controller.buttons[button.homeX].pressed) {
    //     this.motors.setHome('x')
    //     return
    // }
    
    /* Not implemented */
    // if (controller.buttons[button.homeY].pressed) {
    //     this.motors.setHome('y')
    //     return
    // }

    if (controller.buttons[button.lock].pressed) {
      this.motors.toggleLockSpeeds()
      return
    }

    if (controller.buttons[button.twoStroke].pressed) {
      this.twoStroke = !this.twoStroke
      return
    }
    
    this.motors.setMove('x', -this.joystick.axes['x'], -this.joystick.axes['x'])
    this.motors.setMove('y', -this.joystick.axes['y'], -this.joystick.axes['y'])
  }

  private getController(): Gamepad {
    if (navigator.getGamepads) {
      return navigator.getGamepads()[0]
    }
  }

  private relayPress() {
    this.relayPressed = true

    if (this.twoStroke && !this.welding) {
      this.startWelding()
    }
  }

  private relayRelease() {
    this.relayPressed = false

    if (this.twoStroke) {
      if (this.welding) {
        this.stopWelding()
      }
    } else {
      if (!this.welding) {
        this.startWelding()
      } else {
        this.stopWelding()
      }
    }
  }

  private startWelding() {
    this.motors.setRelay('on')
    this.welding = true
  }

  private stopWelding() {
    this.motors.setRelay('off')
    this.welding = false
  }

  private onSetBoundsClick() {
    if (!this.settingBounds) {
      this.motors.setStartBound()
      this.startBound = this.positionsReal[1].value
      this.infoMessage.emit("Ustaw drugą granice spawu")
    } else {
      this.infoMessage.emit("")
      this.motors.setEndBound()
      this.endBound = this.positionsReal[1].value
      this.calculateWeldParams()
    }
    this.settingBounds = !this.settingBounds
  }

  calculateWeldParams() {
    const weldCenter: number = Math.floor((this.startBound + this.endBound) / 2)
    this.weldCenter.patchValue(weldCenter)
    
    const weldWidth = Math.abs(this.endBound - this.startBound) * 0.125
    this.weldWidth.patchValue(weldWidth)
  }

  onStopClick() {
    this.highlightStop = true
    timer(500).subscribe(() => {
      this.highlightStop = false
    })
    this.motors.setStop()
  }

  onHomeClick() {
    this.highlightHome = true
    timer(500).subscribe(() => {
      this.highlightHome = false
    })
    this.motors.setHome()
  }
}
