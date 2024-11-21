export interface Visitor {
  id: string;
  name: string;
  number: string;
  passcode: string;
  purpose: string;
  responsibleUser: string;
  houseId?: string | null;
  type: string;
  status: string;
  startDate: string;
  endDate: string;
  visitTime: string;
  createdAt: string;
  updatedAt: string;
  vehicleNumber?: string | null;
  image: string | null;
}