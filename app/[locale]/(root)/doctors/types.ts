
export interface Doctor {
  id: number;
  name: string;
  hospital: {
    id: number;
    name: string;
    image: string;
    banner_image: string;
    phone_number: string;
    latitude: number;
    longitude: number;
    beds: number;
    doctors: number;
    description: string;
    departments: string[];
  };
  prize: string;
  image: string;
  tags: string[];
  translations: {
    field: string;
    description: string;
    fieldDescription:string;
  };
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