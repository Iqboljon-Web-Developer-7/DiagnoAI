// app/doctors/components/Specialties.tsx
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslations } from 'next-intl';

interface SpecialtiesProps {
    specialties: {
        name: string;
        icon: string;
        count: number;
    }[];
    onSpecialtySelect: (specialty: string) => void;
}

export function Specialties({ specialties, onSpecialtySelect }: SpecialtiesProps) {
    const translations = useTranslations('doctors');

    return (
        <Card className="mb-8">
            <CardHeader className="p-4 sm:p-6">
                <CardTitle className="flex items-center space-x-2">
                    <span>{translations('specialtiesTitle') || 'Medical Specialties'}</span>
                </CardTitle>
                <CardDescription>
                    {translations('specialtiesDescription') || 'Explore doctors by specialty'}
                </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
                <div className="grid md:grid-cols-5 gap-4">
                    {specialties.map((specialty, index) => (
                        <div
                            key={index}
                            className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => onSpecialtySelect(specialty.name.toLowerCase())}
                        >
                            <div className="text-2xl mb-2">{specialty.icon}</div>
                            <h3 className="font-semibold text-gray-900">{specialty.name}</h3>
                            <p className="text-sm text-gray-600">
                                {translations('count', { count: specialty.count }) || `${specialty.count} doctors`}
                            </p>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}