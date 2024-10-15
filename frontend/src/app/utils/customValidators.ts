import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
} from '@angular/forms';
import * as validator from 'validator';
import { AddressService } from '../services/address/address.service';
import { catchError, map, of } from 'rxjs';

export class CustomValidators {
  static noSpaceAllowed(control: FormControl) {
    if (control.value != null && control.value.indexOf(' ') != -1) {
      return { noSpaceAllowed: true };
    }
    return null;
  }

  static checkUserName(control: AbstractControl): Promise<any> {
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

  static postalCodeValidator(addressService: AddressService) {
    console.log(':ljebnkjfbejkv');

    return (control: AbstractControl) => {
      const pincode = control.value;

      if (!pincode || pincode.toString().length !== 6) {
        return of(null);
      }

      return addressService.getStateByPincode(pincode).pipe(
        map((response) => {
          console.log('ress', response);

          if (response && response[0].Status === 'Success') {
            const postOffice = response[0].PostOffice[0];

            console.log('postt', postOffice);

            const formGroup = control.parent as FormGroup;
            console.log("wewfw", formGroup);
            
            if (formGroup) {

              formGroup.patchValue({
                address: {
                  city: postOffice.District,
                  state: postOffice.State,
                  country: postOffice.Country,
                },
              });
            }

            return null;
          } else {
            return { invalidPostalCode: true };
          }
        }),
        catchError(() => {
          return of({ invalidPostalCode: true });
        })
      );
    };
  }
}

function userNameAllowed(username: string) {
  const takenUserNames = ['johnsmith', 'manojjha', 'sarahking'];

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (takenUserNames.includes(username)) {
        resolve({ checkUsername: true });
      } else {
        resolve(null);
      }
    }, 5000);
  });
}
