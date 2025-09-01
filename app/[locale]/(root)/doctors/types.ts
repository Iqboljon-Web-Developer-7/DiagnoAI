export interface Doctor {
  id: string;
  name: string;
  field: string;
  hospital: string;
  description: string;
  rating?: number;
  reviews?: number;
  distance?: number;
  availability?: any;
  price?: number;
  prize?: number;
  image?: string;
  experience?: number;
  longitude?: number;
  latitude?: number;
  phone_number?: string;
}

export interface Booking {
  id: number;
  user: number;
  doctor: number;
  appointment_date: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  // Add other fields if needed, e.g., books: string;
}

export type BookingStatus = Booking['status'];