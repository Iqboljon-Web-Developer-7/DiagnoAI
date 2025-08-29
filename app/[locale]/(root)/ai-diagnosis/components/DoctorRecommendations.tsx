"use client";

import React from "react";
import Link from "next/link";
import { Stethoscope, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DoctorItem from "./DoctorItem";
import { Doctor } from "./types";
import { useRouter } from "@/i18n/navigation";

interface DoctorRecommendationsProps {
  doctors: Doctor[];
}

const DoctorRecommendations: React.FC<DoctorRecommendationsProps> = ({ doctors }) => {
  const router = useRouter();
  
  return (
    <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
            <Stethoscope className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg">Recommended Specialists</CardTitle>
            <CardDescription>Based on your symptoms</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {doctors && doctors.length > 0 ? (
          <div className="space-y-4">
            {doctors.map((doc) => (
              <DoctorItem key={doc.id} doctor={doc} router={router} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <User className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-sm">Complete your diagnosis to see recommended specialists</p>
          </div>
        )}

        <Link href="/recommended-providers" passHref>
          <Button className="w-full mt-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white">
            View All Specialists
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default DoctorRecommendations;