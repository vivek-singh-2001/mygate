import {
  AbstractControl,
  FormControl,
  ValidationErrors,
} from '@angular/forms';
import * as validator from 'validator';

export class CustomValidators {
  static noSpaceAllowed(control: FormControl) {
    if (control.value != null && control.value.indexOf(' ') != -1) {
      return { noSpaceAllowed: true };
    }
    return null;
  }

  static checkUserName(control: AbstractControl): Promise<{ checkUsername: boolean } | null> {
    return userNameAllowed(control.value);
  }

  static validEmail(control: AbstractControl): ValidationErrors | null {
    const emailValue = control.value;

    if (!emailValue) {
      return null;
    }

    if (!validator.isEmail(emailValue)) {
      return { invalidEmail: true };
    }

    return null;
  }
}

function userNameAllowed(username: string): Promise<{ checkUsername: boolean } | null> {
  const takenUserNames = ['johnsmith', 'manojjha', 'sarahking'];

  return new Promise((resolve) => {
    setTimeout(() => {
      if (takenUserNames.includes(username)) {
        resolve({ checkUsername: true });
      } else {
        resolve(null);
      }
    }, 5000);
  });
}
