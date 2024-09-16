export interface Society {
  id: number;
  name: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  societyAdminId: number | null;
}
