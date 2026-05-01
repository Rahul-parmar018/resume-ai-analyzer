import React from 'react';

const SkeletonBlock = ({ className }) => (
  <div className={`animate-pulse bg-white/5 rounded-2xl ${className}`}></div>
);

const LandingSkeleton = () => {
  return (
    <div className="min-h-screen bg-[#020202] text-white overflow-hidden">
      {/* 1. HERO SKELETON */}
      <section className="px-6 pt-32 pb-20 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20">
        <div className="flex-1 space-y-8">
          <SkeletonBlock className="h-4 w-32 !rounded-full" /> {/* Pill */}
          <div className="space-y-4">
            <SkeletonBlock className="h-16 w-[90%]" />
            <SkeletonBlock className="h-16 w-[70%]" />
          </div>
          <SkeletonBlock className="h-6 w-[80%]" />
          <div className="flex gap-4">
            <SkeletonBlock className="h-14 w-40 !rounded-full" />
            <SkeletonBlock className="h-14 w-40 !rounded-full opacity-50" />
          </div>
        </div>
        <div className="w-[300px] h-[600px] lg:w-[400px]">
          <SkeletonBlock className="w-full h-full !rounded-[3rem] border border-white/10" />
        </div>
      </section>

      {/* 2. FEATURES GRID SKELETON */}
      <section className="px-6 py-20 max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <SkeletonBlock className="h-4 w-24 mx-auto !rounded-full" />
          <SkeletonBlock className="h-10 w-64 mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="p-8 space-y-6 border border-white/5 rounded-3xl bg-white/[0.02]">
              <SkeletonBlock className="w-12 h-12 !rounded-xl" />
              <div className="space-y-3">
                <SkeletonBlock className="h-6 w-1/2" />
                <SkeletonBlock className="h-4 w-full" />
                <SkeletonBlock className="h-4 w-[80%]" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. HORIZONTAL JOURNEY SKELETON */}
      <section className="py-20 bg-white/[0.01]">
        <div className="px-6 max-w-7xl mx-auto mb-12">
          <SkeletonBlock className="h-12 w-64" />
        </div>
        <div className="flex gap-8 px-6 overflow-hidden">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="min-w-[400px] h-[400px] p-10 border border-white/5 rounded-[2.5rem] bg-white/[0.02] flex-shrink-0">
               <SkeletonBlock className="w-10 h-10 !rounded-full mb-8" />
               <div className="space-y-4">
                  <SkeletonBlock className="h-8 w-2/3" />
                  <SkeletonBlock className="h-4 w-full" />
                  <SkeletonBlock className="h-4 w-full" />
                  <SkeletonBlock className="h-4 w-1/2" />
               </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. FAQ SKELETON */}
      <section className="px-6 py-20 max-w-3xl mx-auto space-y-4">
        <SkeletonBlock className="h-8 w-48 mb-8" />
        {[1, 2, 3, 4, 5].map((i) => (
          <SkeletonBlock key={i} className="h-16 w-full !rounded-xl" />
        ))}
      </section>
    </div>
  );
};

export default LandingSkeleton;
