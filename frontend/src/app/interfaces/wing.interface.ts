import { Society } from "./society.interface";

export interface Wing {
  id: number;
  name: string;
  wingAdminId: number;
  SocietyId: number;
  Society: Society;
  firstname?: string;
  lastname?: string;
}
