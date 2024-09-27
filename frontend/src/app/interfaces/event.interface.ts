export interface Event {
  id: number;
  title: string;
  description: string;
  event_type: string | null;
  start_date: string;
  end_date: string | null;
  SocietyId: number
}