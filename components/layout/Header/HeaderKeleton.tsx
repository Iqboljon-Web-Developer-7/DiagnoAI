import { Skeleton } from '@/components/ui/skeleton';

export function HeaderSkeleton() {
  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="absolute inset-0 bg-white/80 backdrop-blur-md border-b border-white/20" />
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo skeleton */}
          <div className="flex-shrink-0">
            <Skeleton className="h-8 w-32 rounded-lg" />
          </div>

          {/* Navigation skeleton */}
          <div className="hidden lg:flex space-x-1">
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-20 rounded-lg" />
            ))}
          </div>

          {/* Mobile menu skeleton */}
          <div className="lg:hidden">
            <Skeleton className="h-10 w-10 rounded-lg" />
          </div>

          {/* Right side actions skeleton */}
          <div className="flex items-center space-x-2">
            <Skeleton className="h-9 w-24 rounded-lg" />
            <Skeleton className="h-9 w-9 rounded-full" />
          </div>
        </div>
      </div>
    </header>
  );
}