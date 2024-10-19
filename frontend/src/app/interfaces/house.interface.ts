import { Wing } from "./wing.interface";

export interface House {
  id: string;
  house_no: string;
  WingId: number;
  Wing: Wing;
}
