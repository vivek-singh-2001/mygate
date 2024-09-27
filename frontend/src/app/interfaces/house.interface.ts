import { Wing } from "./wing.interface";

export interface House {
  id: number;
  house_no: string;
  WingId: number;
  Wing: Wing;
}
