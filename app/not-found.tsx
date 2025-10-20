import React from 'react';
import { Home } from 'lucide-react';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

import { cookies } from 'next/headers';

export default async function NotFound() {
  const cookieStore = await cookies();
  const locale = cookieStore.get('locale')?.value || 'en';

  const t = await getTranslations({ locale, namespace: 'notFound' });

  return (
    <html>
      <body>
        <div className="min-h-screen bg-linear-to-br from-slate-50 to-gray-100 flex items-center justify-center p-6">
          <div className="text-center max-w-lg mx-auto">
            <div className="mb-8">
              <h1 className="text-9xl md:text-[12rem] font-light text-gray-200 leading-none select-none">
                4
                <span className="inline-block animate-pulse text-gray-300">0</span>
                4
              </h1>
            </div>

            {/* Content */}
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl md:text-3xl font-light text-gray-800 tracking-tight">
                  {t('title')}
                </h2>
                <p className="text-gray-500 text-lg font-light leading-relaxed max-w-md mx-auto">
                  {t('description')}
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-4">
                <Link
                  href={'/uz'}
                  className="group flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all duration-200 font-medium shadow-xs hover:shadow-md"
                >
                  <Home className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                  {t('actions.home')}
                </Link>
              </div>
            </div>

            {/* Subtle decorative element */}
            <div className="mt-16 flex justify-center">
              <div className="w-px h-12 bg-linear-to-b from-gray-200 to-transparent"></div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
