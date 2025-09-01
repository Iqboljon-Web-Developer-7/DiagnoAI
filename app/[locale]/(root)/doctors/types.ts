// app/doctors/types.ts
export interface Doctor {
    id: number;
    name: string;
    field: string;
    hospital: string;
    description: string;
    rating?: number;
    reviews?: number;
    distance?: string;
    availability?: string;
    price?: number;
    prize?:number;
    image?: string;
    experience?: string;
    longitude?: number;
    latitude?: number;
    phone_number?: string;

}

export interface Specialty {
    name: string;
    count: number;
    icon: string;
}