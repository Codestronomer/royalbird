export default function BlogCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="relative overflow-hidden bg-slate-200 mb-4" style={{ aspectRatio: '3/4' }}>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-300/50 to-slate-300/70" />
      </div>
      
      <div className="space-y-3">
        {/* Title skeleton */}
        <div className="h-6 bg-slate-200 rounded w-3/4"></div>
        
        {/* Description skeleton */}
        <div className="space-y-2">
          <div className="h-4 bg-slate-200 rounded w-full"></div>
          <div className="h-4 bg-slate-200 rounded w-5/6"></div>
          <div className="h-4 bg-slate-200 rounded w-4/6"></div>
        </div>
        
        {/* Author and date skeleton */}
        <div className="flex items-center gap-3">
          <div className="h-4 bg-slate-200 rounded w-20"></div>
          <div className="h-1 w-1 rounded-full bg-slate-300"></div>
          <div className="h-4 bg-slate-200 rounded w-16"></div>
        </div>
      </div>
    </div>
  );
}