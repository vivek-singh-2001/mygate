import { House } from "./house.interface";
import { Wing } from "./wing.interface";

export interface User {
  dateofbirth: Date;
  email: string;
  firstname: string;
  lastname: string;
  number: string;
  id: string;
  passcode?: string;
  isMember?: boolean;
  isOwner: boolean;
  houseId?: string
  gender?: string
  house?: House
  wingDetails?: Wing
  role?: string
  photo?: string;
  data?:[]
  unreadMessageCount?:number
}

export interface Gender {
  label: string;
  value: string;
}