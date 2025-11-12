'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Filter, Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import useIsMobile from '@/components/useIsMobile';
import { memo } from 'react';

interface FiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedSpecialty?: string;
  setSelectedSpecialty?: (value: string) => void;
  selectedRating: string;
  setSelectedRating: (value: string) => void;
  onClearFilters: () => void;
}

/* -------------------------------------------------------------------------- */
/*  Re-usable filter UI – uses slate-200 / slate-900 (or any colour you want) */
/* -------------------------------------------------------------------------- */
const FilterContent = ({
  searchTerm,
  setSearchTerm,
  selectedRating,
  setSelectedRating,
  onClearFilters,
  translations,
}: FiltersProps & { translations: any }) => (
  <div className="space-y-4">
    {/* ---- Search ---- */}
    <div>
      <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
        {translations('filters.searchLabel') || 'Search'}
      </label>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
        <Input
          placeholder={
            translations('filters.searchPlaceholder') ||
            'Search doctors or specialties'
          }
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-700"
        />
      </div>
    </div>

    {/* ---- Rating ---- */}
    <div>
      <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
        {translations('filters.ratingLabel') || 'Rating'}
      </label>
      <Select value={selectedRating} onValueChange={setSelectedRating}>
        <SelectTrigger className="bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-700">
          <SelectValue
            placeholder={
              translations('filters.ratingPlaceholder') || 'Select a rating'
            }
          />
        </SelectTrigger>
        <SelectContent className="bg-slate-100 dark:bg-slate-900">
          <SelectItem value="4.5">4.5</SelectItem>
          <SelectItem value="4.0">4.0</SelectItem>
          <SelectItem value="3.5">3.5</SelectItem>
        </SelectContent>
      </Select>
    </div>

    {/* ---- Clear ---- */}
    <Button
      variant="outline"
      className="w-full bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-700"
      onClick={onClearFilters}
    >
      {translations('filters.clearFiltersButton') || 'Clear Filters'}
    </Button>
  </div>
);

/* -------------------------------------------------------------------------- */
/*  Main component – decides between Dialog (mobile) and Card (desktop)      */
/* -------------------------------------------------------------------------- */
function Filters(props: FiltersProps) {
  const t = useTranslations('doctors');
  const isMobile = useIsMobile();

  /* ---- Mobile: Dialog ---- */
  if (isMobile) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="fixed bottom-4 right-4 z-50 bg-slate-200 dark:bg-slate-800"
          >
            <Filter className="w-4 h-4 mr-2" />
            {t('filters.title') || 'Filters'}
          </Button>
        </DialogTrigger>

        <DialogContent className="bg-slate-50 dark:bg-slate-900">
          <DialogHeader>
            <DialogTitle>{t('filters.title') || 'Filters'}</DialogTitle>
          </DialogHeader>
          <FilterContent {...props} translations={t} />
        </DialogContent>
      </Dialog>
    );
  }

  /* ---- Desktop: Card ---- */
  return (
    <Card className="sticky top-20 bg-slate-50 dark:bg-slate-900 animate-fade-in-down opacity-0 delay-200 border-slate-300 dark:border-slate-700">
      <CardHeader className="p-4 pb-0 sm:p-6 sm:pb-0">
        <CardTitle className="flex items-center gap-2">
          <Filter className="w-5 h-5" />
          <span>{t('filters.title') || 'Filters'}</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-4 sm:p-6">
        <FilterContent {...props} translations={t} />
      </CardContent>
    </Card>
  );
}

export default memo(Filters);