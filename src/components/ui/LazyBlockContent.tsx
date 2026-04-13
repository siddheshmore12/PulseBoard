import { Skeleton } from './Skeleton';

/**
 * PERFORMANCE NOTE:
 * This component is intentionally separated so it can be lazy-loaded 
 * using React.lazy() and Suspense if future block types become heavy 
 * (like heavy ECharts, AG-Grid tables, or Three.js WebGL canvas logic).
 */
export default function LazyBlockContent() {
  return (
    <div className="flex-1 w-full pointer-events-none">
      <Skeleton className="w-full h-full opacity-60" />
    </div>
  );
}
