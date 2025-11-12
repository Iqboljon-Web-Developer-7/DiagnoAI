# Filter Component – Dark / Light Mode Ready (Slate + White Text in Dark)

```tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FilterIcon } from 'lucide-react';
import React from 'react';
import { FilterControls } from '../ClientHospitalPage';

const Filter: React.FC<{
  filters: any;
  handleFilterChange: (key: string, value: string) => void;
  clearFilters: () => void;
  t: (key: string) => string;
}> = ({ filters, handleFilterChange, clearFilters, t }) => {
  return (
    <div className="lg:col-span-1 relative hidden md:block">
      <Card
        className={`
          sticky top-20 shadow-xl border-0
          bg-slate-50/80 dark:bg-slate-900/80
          backdrop-blur-xs
          text-gray-900 dark:text-slate-200
          border-slate-300 dark:border-slate-700
        `}
      >
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-800 dark:to-blue-900 rounded-lg">
              <FilterIcon className="w-4 h-4 text-white" />
            </div>
            <span>{t ? t("filters.title") || "Filters" : ""}</span>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <FilterControls
            filters={filters}
            onChange={handleFilterChange}
            onClear={clearFilters}
            t={t}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Filter;