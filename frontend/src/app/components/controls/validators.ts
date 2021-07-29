import { AbstractControl } from "@angular/forms";

type ValidControl = {[key: string]: any} | null;

export function ValidateWeldCenter(control: AbstractControl): ValidControl {
  if (control.value && (control.value < -500 || control.value > 500)) {
    return {'weldCenterInvalid': true};
  }
  return null;
}

export function ValidateWeldWidth(control: AbstractControl): ValidControl {
  if (control.value && (control.value < 1 || control.value > 124)) {
    return { 'weldWidthInvalid': true };
  }
  return null;
}

export function ValidateXAxis(control: AbstractControl): ValidControl {
  if (control.value && (control.value < 1 || control.value > 49)) {
    return { 'xAxisInvalid': true };
  }
  return null;
}

export function ValidateYSpeed(control: AbstractControl): ValidControl {
  if (control.value && (control.value < 1 || control.value > 10)) {
    return { 'YSpeedInvalid': true };
  }
  return null;
}

export function ValidatePWM(control: AbstractControl): ValidControl {
  if (control.value && (control.value < 1 || control.value > 999)) {
    return { 'pwmInvalid': true };
  }
  return null;
}

export function ValidIntegerNumber(control: AbstractControl): ValidControl {
  if (!Number.isInteger(control.value)) {
    return { 'notIntegerNumber': true }
  }
  return null;
}

