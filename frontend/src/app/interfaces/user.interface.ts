import { House } from "./house.interface";
import { Wing } from "./wing.interface";

export interface User {
  dateofbirth: Date;
  email: string;
  firstname: string;
  lastname: string;
  number: string;
  id: number;
  passcode: string;
  isMember: boolean;
  isOwner: boolean;
  houseId?: number
  gender?: string
  house?: House
  wingDetails?: Wing
  role?: string
  photo?: string
}

export interface Gender {
  label: string;
  value: string;
}