import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn } from '@angular/forms';

@Directive({
  selector: '[noSpaces]',
  standalone: true,
  providers: [{ provide: NG_VALIDATORS, useExisting: NoSpacesValidatorDirective, multi: true }]
})
export class NoSpacesValidatorDirective implements Validator {
  validate(control: AbstractControl): ValidationErrors | null {
    return NoSpacesValidatorDirective.noSpacesValidator()(control);
  }

  static noSpacesValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value || '';

      if (typeof value !== 'string') {
        return null;
      }

      if (value.trim().length === 0) {
        return { whitespaceOnly: true };
      }

      return null;
    };
  }
}
