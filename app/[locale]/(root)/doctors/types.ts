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
    price?: string;
    image?: string;
    experience?: string;
    langitude?: number;
    latitude?: number;

}

export interface Specialty {
    name: string;
    count: number;
    icon: string;
}