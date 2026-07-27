import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Just export the ValidatorFn directly — no outer wrapper needed
export const noFutureDateValidator: ValidatorFn = (control) => {
  if (!control.value) return null;
  const selected = new Date(control.value);
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return selected > today ? { futureDate: { value: control.value } } : null;
};

export function minLength(min: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const length = control ? control.value.length : 0;
    return length < min ? { minLength: { required: min, actual: length } } : null;
  };
}
