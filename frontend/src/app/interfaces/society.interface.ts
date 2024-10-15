import { User } from "./user.interface";

export interface Society {
  id: number;
  name: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  status:string;
  csvData:string;
  societyAdminId: number | null;
  User?:User;
  numberOfHouses?:string;
  numberOfUsers?:string;

}
