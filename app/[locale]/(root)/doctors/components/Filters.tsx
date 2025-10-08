'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter, Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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

const FilterContent = ({
    searchTerm,
    setSearchTerm,
    selectedRating,
    setSelectedRating,
    onClearFilters,
    translations,
}: FiltersProps & { translations: any }) => (
    <div className="space-y-4">
        <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                {translations('filters.searchLabel') || 'Search'}
            </label>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                <Input
                    placeholder={translations('filters.searchPlaceholder') || 'Search doctors or specialties'}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 dark:bg-gray-900 dark:text-gray-100"
                />
            </div>
        </div>

        <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                {translations('filters.ratingLabel') || 'Rating'}
            </label>
            <Select value={selectedRating} onValueChange={setSelectedRating}>
                <SelectTrigger className="dark:bg-gray-900 dark:text-gray-100">
                    <SelectValue placeholder={translations('filters.ratingPlaceholder') || 'Select a rating'} />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-900 dark:text-gray-100">
                    <SelectItem value="4.5">4.5</SelectItem>
                    <SelectItem value="4.0">4.0</SelectItem>
                    <SelectItem value="3.5">3.5</SelectItem>
                </SelectContent>
            </Select>
        </div>

        <Button variant="outline" className="w-full dark:bg-gray-900 dark:text-gray-100" onClick={onClearFilters}>
            {translations('filters.clearFiltersButton') || 'Clear Filters'}
        </Button>
    </div>
);

function Filters(props: FiltersProps) {
    const translations = useTranslations('doctors');
    const isMobile = useIsMobile()

    if (isMobile) {
        return (
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline" className="fixed bottom-4 right-4 z-50 dark:bg-gray-900 dark:text-gray-100">
                        <Filter className="w-4 h-4 mr-2" />
                        {translations('filters.title') || 'Filters'}
                    </Button>
                </DialogTrigger>
                <DialogContent className="dark:bg-gray-900 dark:text-gray-100">
                    <DialogHeader>
                        <DialogTitle>{translations('filters.title') || 'Filters'}</DialogTitle>
                    </DialogHeader>
                    <FilterContent {...props} translations={translations} />
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Card className="sticky top-20 dark:bg-gray-900 dark:text-gray-100">
            <CardHeader className="p-4 pb-0 sm:pb-0 sm:p-6">
                <CardTitle className="flex items-center space-x-2">
                    <Filter className="w-5 h-5" />
                    <span>{translations('filters.title') || 'Filters'}</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
                <FilterContent {...props} translations={translations} />
            </CardContent>
        </Card>
    );
}

export default memo(Filters);
