/**
 * Skeleton Loading Components
 * Use these for Suspense fallbacks to prevent layout shift and improve perceived performance
 */

export function HeroSkeleton() {
  return (
    <div className="h-screen w-full animate-pulse bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black">
      <div className="max-w-7xl mx-auto px-4 pt-32 space-y-8">
        {/* Main heading */}
        <div className="space-y-4">
          <div className="h-16 bg-gray-200 dark:bg-gray-800 rounded-xl w-3/4 mx-auto" />
          <div className="h-16 bg-gray-200 dark:bg-gray-800 rounded-xl w-2/3 mx-auto" />
        </div>
        
        {/* Description */}
        <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded-lg w-1/2 mx-auto" />
        
        {/* Buttons */}
        <div className="flex gap-4 justify-center pt-8">
          <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded-xl w-48" />
          <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded-xl w-48" />
        </div>
      </div>
    </div>
  );
}

export function FeaturesSkeleton() {
  return (
    <section className="py-24 px-4 bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto animate-pulse">
        {/* Section header */}
        <div className="text-center mb-16 space-y-4">
          <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded-lg w-96 mx-auto" />
          <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-2/3 mx-auto" />
        </div>
        
        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-4 p-6">
              <div className="h-16 w-16 bg-gray-300 dark:bg-gray-700 rounded-2xl" />
              <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded-lg w-3/4" />
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full" />
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TestimonialsSkeleton() {
  return (
    <section className="py-24 px-4 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto animate-pulse">
        {/* Section header */}
        <div className="text-center mb-16 space-y-4">
          <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded-lg w-80 mx-auto" />
          <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-96 mx-auto" />
        </div>
        
        {/* Testimonial cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl p-8 space-y-4">
              {/* Avatar and name */}
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 bg-gray-300 dark:bg-gray-700 rounded-full" />
                <div className="space-y-2 flex-1">
                  <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-32" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-24" />
                </div>
              </div>
              
              {/* Quote */}
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full" />
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full" />
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-4/5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function DoctorCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg animate-pulse">
      {/* Image */}
      <div className="h-64 bg-gray-300 dark:bg-gray-700" />
      
      {/* Content */}
      <div className="p-6 space-y-4">
        <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded-lg w-3/4" />
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full" />
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-4/5" />
        </div>
        <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded-xl w-full mt-4" />
      </div>
    </div>
  );
}

export function DoctorListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: count }, (_, i) => (
        <DoctorCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function PartnersSkeleton() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-7xl mx-auto animate-pulse">
        {/* Section header */}
        <div className="text-center mb-16 space-y-4">
          <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded-lg w-96 mx-auto" />
          <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-2/3 mx-auto" />
        </div>
        
        {/* Partner logos */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-20 bg-gray-200 dark:bg-gray-800 rounded-xl" />
          ))}
        </div>
      </div>
    </section>
  );
}

export function CTASkeleton() {
  return (
    <section className="py-24 px-4 bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="max-w-4xl mx-auto text-center animate-pulse space-y-8">
        <div className="h-12 bg-white/20 rounded-lg w-3/4 mx-auto" />
        <div className="h-6 bg-white/20 rounded w-1/2 mx-auto" />
        <div className="flex gap-4 justify-center pt-4">
          <div className="h-12 bg-white/30 rounded-xl w-48" />
          <div className="h-12 bg-white/20 rounded-xl w-48" />
        </div>
      </div>
    </section>
  );
}

export function PageLoadingSkeleton() {
  return (
    <div className="min-h-screen">
      <HeroSkeleton />
      <FeaturesSkeleton />
      <TestimonialsSkeleton />
      <CTASkeleton />
    </div>
  );
}

// Compact skeleton for navigation/quick transitions
export function CompactSkeleton() {
  return (
    <div className="min-h-[400px] flex items-center justify-center animate-pulse">
      <div className="space-y-4 w-full max-w-md px-4">
        <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded-lg w-3/4 mx-auto" />
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2 mx-auto" />
      </div>
    </div>
  );
}
