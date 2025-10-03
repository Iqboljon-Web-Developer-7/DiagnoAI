"use client";

import React, { use, useState } from 'react';
import { useGetHospital } from "../api";
import { MapPin, Phone, Building2, Users, Clock, Award, Stethoscope, Heart, Navigation } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useAppStore } from '@/store/store';
import Image from 'next/image';
import { Circles } from "react-loader-spinner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslations } from 'next-intl';

function Page({ params }: { params: Promise<{ id: string; locale: string }> }) {
  const { id } = use(params);
  const { user } = useAppStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data: hospital, error, isLoading, isPending } = useGetHospital(id, user?.token);
  const t = useTranslations("hospitals.hospital");

  const handleCall = () => {
    window.location.href = `tel:${hospital?.phone_number}`;
  };

  const stats = [
    { label: t('beds'), value: hospital?.beds || 0, icon: Building2 },
    { label: t('doctors'), value: hospital?.doctors || 0, icon: Users },
    { label: t('yearsOfService'), value: '10+', icon: Award },
    { label: t('patientsPerYear'), value: '10K+', icon: Heart }
  ];

  if (isLoading || isPending) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-slate-200 dark:bg-slate-900'>
        <div className="flex items-center justify-center p-10 mt-10">
          <Circles
            height="80"
            width="80"
            color="#2563eb"
            ariaLabel="circles-loading"
            visible={true}
          />
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-8 text-red-600 dark:text-red-400">{(error as Error).message}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 pt-12">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="dark:bg-slate-800 dark:text-white">
          <DialogHeader>
            <DialogTitle>{t('confirmCall')}</DialogTitle>
            <DialogDescription>
              {t('confirmCallMessage', { name: hospital?.name, phone_number: hospital?.phone_number })}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center space-x-4 mt-4">
            <button
              onClick={() => setIsDialogOpen(false)}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-slate-700"
            >
              {t('cancel')}
            </button>
            <button
              onClick={handleCall}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              {t('callNow')}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="relative">
            {/* Hospital Image */}
            <div className="h-96 bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-900 dark:to-blue-950 relative overflow-hidden">
              <Image
                width={1200}
                height={400}
                src={`https://api.diagnoai.uz${hospital?.banner_image || ''}`}
                alt={hospital?.name}
                className="w-full h-full object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-900/50 to-blue-800/50"></div>
              {/* Hospital Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8">
                <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-4">
                  <div className="w-full lg:w-auto">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-4">
                      {hospital?.name}
                    </h1>
                    <div className="flex items-center space-x-2 mb-2 sm:mb-4">
                      <MapPin className="h-4 sm:h-5 w-4 sm:w-5 text-blue-200" />
                      <span className="text-blue-200 text-sm sm:text-base">{t('location')}</span>
                    </div>
                  </div>

                  <div className="flex flex-col xs:flex-row gap-2 sm:gap-3 w-full lg:w-auto flex-shrink-0">
                    <button
                      onClick={() => setIsDialogOpen(true)}
                      className="w-full xs:w-auto bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base"
                    >
                      <Phone className="h-4 sm:h-5 w-4 sm:w-5" />
                      <span>{t('callHospital')}</span>
                    </button>

                    <Link
                      href={`https://yandex.com/maps/?ll=${hospital?.longitude},${hospital?.latitude}&z=15&pt=${hospital?.longitude},${hospital?.latitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full xs:w-auto"
                    >
                      <button className="w-full border-2 border-white dark:border-slate-900 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 dark:hover:bg-slate-900 dark:hover:text-blue-400 transition-colors duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base">
                        <Navigation className="h-4 sm:h-5 w-4 sm:w-5" />
                        <span>{t('getDirections')}</span>
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-200">
              <stat.icon className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</div>
              <div className="text-gray-600 dark:text-gray-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Section */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                <Building2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                <span>{t('about')} {hospital?.name}</span>
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg mb-4">
                {hospital?.description}
              </p>
            </div>

            {/* Departments */}
            {hospital?.departments && hospital?.departments.length > 0 && (
              <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
                  <Stethoscope className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  <span>{t('medicalDepartments')}</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {hospital?.departments.map((name: string, index: number) => (
                    <div key={index} className="flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors duration-200 border border-gray-100 dark:border-gray-700">
                      <Stethoscope className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{name}</h3>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t('contactInformation')}</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-gray-500 dark:text-gray-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{t('address')}</p>
                    <p className="text-gray-600 dark:text-gray-300">{t('location')}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Coordinates: {hospital?.latitude}, {hospital?.longitude}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Phone className="h-5 w-5 text-gray-500 dark:text-gray-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{t('phone')}</p>
                    <p className="text-gray-600 dark:text-gray-300">{hospital?.phone_number}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-gray-500 dark:text-gray-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{t('emergency')}</p>
                    <p className="text-green-600 dark:text-green-400 font-medium">{t('available247')}</p>
                  </div>
                </div>
              </div>
            </div>
            <iframe
              src={`https://yandex.uz/map-widget/v1/?ll=${hospital?.longitude},${hospital?.latitude}&z=18&pt=${hospital?.longitude},${hospital?.latitude},pm2rdl`}
              width="100%"
              height="450"
              frameBorder="0"
              allowFullScreen
              style={{ position: 'relative', borderRadius: '0.75rem' }}
              className="dark:bg-slate-900"
            />

            {/* Quick Actions */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-900 dark:to-blue-950 rounded-xl shadow-lg p-6 text-white">
              <h3 className="text-xl font-bold mb-4">{t('needImmediateCare')}</h3>
              <p className="text-blue-100 dark:text-blue-300 mb-4">{t('emergencyDepartmentAvailable')}</p>
              <button
                onClick={() => setIsDialogOpen(true)}
                className="w-full bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 px-4 py-3 rounded-lg font-semibold hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <Phone className="h-5 w-5" />
                <span>{t('callEmergency')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
