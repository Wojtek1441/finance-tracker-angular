import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function noFutureDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null; // Puste pole obsłuży Validators.required
    }

    const inputDate = new Date(control.value);
    const today = new Date();
    today.setHours(23, 59, 59, 999); // Pozwalamy na dzisiejszą datę

    return inputDate > today ? { futureDate: true } : null;
  };
}
