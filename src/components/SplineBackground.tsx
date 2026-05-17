import { lazy, Suspense } from 'react';

const Spline = lazy(() => import('@splinetool/react-spline'));

export default function SplineBackground() {
  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}
    >
      <Suspense fallback={<div className="absolute inset-0 bg-[#0a0a0a]" />}>
        <Spline
          scene="https://prod.spline.design/Slk6b8kz3LRlKiyk/scene.splinecode"
          className="w-full h-full"
        />
      </Suspense>
      <div className="absolute inset-0 bg-black/40" />
    </div>
  );
}
