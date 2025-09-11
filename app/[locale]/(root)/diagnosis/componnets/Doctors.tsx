"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MapPin, User } from "lucide-react";
import { getDoctors, handleDoctorClick, handleViewAllClick } from "../actions/actions";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

interface Doctor {
    id: number;
    name: string;
    translations?: {
        field?: string;
        description?: string;
    };
    hospital?: {
        name: string;
    };
}

interface DoctorsProps {
    token: string;
}

export default function Doctors({ token }: DoctorsProps) {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(true);
    const searchParams = useSearchParams();
    const doctorIdsParam = searchParams.get('doctorIds');
    const doctorIds = doctorIdsParam ? doctorIdsParam.split(',').map(Number) : [];

    console.log(doctorIds);
    console.log(doctors);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const data = await getDoctors(doctorIds, token);
                setDoctors(data);
            } catch (error) {
                console.error("Error fetching doctors:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDoctors();
    }, [doctorIds]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="w-80">
            <Card>
                <CardHeader>
                    <CardTitle>Recommended Specialists</CardTitle>
                </CardHeader>
                <CardContent>
                    {doctors.length > 0 ? (
                        doctors.map((doc) => (
                            <form
                                key={doc.id}
                                action={() => handleDoctorClick(doc.id)}
                                className="p-3 border rounded mb-3 cursor-pointer"
                            >
                                <button type="submit" className="w-full text-left">
                                    <div className="flex gap-3 items-start">
                                        <Avatar className="h-12 w-12">
                                            <AvatarFallback>
                                                {doc.name.split(" ").map((n) => n[0]).join("")}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <div className="font-semibold">{doc.name}</div>
                                            <div className="text-xs text-gray-500">
                                                {doc.translations?.field}
                                            </div>
                                            <div className="text-sm text-gray-600 line-clamp-2">
                                                {doc.translations?.description}
                                            </div>
                                            <div className="text-xs text-gray-500 flex items-center gap-1 mt-2">
                                                <MapPin className="h-3 w-3" />
                                                {doc.hospital?.name}
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            </form>
                        ))
                    ) : (
                        <div className="text-center p-6">
                            <div className="mb-3">
                                <User className="h-8 w-8 text-gray-400" />
                            </div>
                            <div className="text-sm text-gray-500">
                                Complete diagnosis to see recommendations
                            </div>
                        </div>
                    )}

                    <form action={handleViewAllClick}>
                        <Button className="w-full mt-4" type="submit">
                            View All Specialists
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
