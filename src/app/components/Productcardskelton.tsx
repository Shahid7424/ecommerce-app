// src/app/components/ProductCardSkeleton.tsx
export default function ProductCardSkeleton() {
  return (
    <div className="rounded-2xl bg-white ring-1 ring-slate-200/80 overflow-hidden">
      <div className="aspect-square skeleton" />
      <div className="p-4 space-y-3">
        <div className="h-3 w-1/4 skeleton rounded" />
        <div className="h-4 w-3/4 skeleton rounded" />
        <div className="h-4 w-1/2 skeleton rounded" />
        <div className="h-6 w-1/3 skeleton rounded" />
        <div className="h-10 w-full skeleton rounded-xl mt-2" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}