
export class Controller {
  gamepadApi: boolean = false
  connected: boolean = false
  
  axes = {
    x: 0,
    y: 0,
    z: 0
  }
  
  private config = {
    axisX: 1,
    axisY: 0,
    axisZ: 5,
  }

  /**
   * Update axes state based on given gamepad object
   * @param gamepad current gamepad object
   */
  updateAxes(gamepad: Gamepad) {
    this.axes = {
      'x': this.c2d(gamepad.axes[this.config['axisX']]),
      'y': this.c2d(gamepad.axes[this.config['axisY']]),
      'z': this.c2d(gamepad.axes[this.config['axisZ']])
    }
  }
  
  /**
   * Continuous to discrete converter 
   * @param v value in range [-1;1]
   */
  private c2d(v: number) {  
    let idx = 0
    let levels = [0.0, 0.4, 0.55, 0.7, 0.85, 1.2]
    while (levels[idx + 1] < Math.abs(v)) {
      idx++
    }
    return idx * Math.sign(v)
  }
}