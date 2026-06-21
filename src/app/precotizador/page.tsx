'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function RedirectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const params = searchParams.toString();
    const target = params ? `/?${params}#cotizador` : '/#cotizador';
    router.replace(target);
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-brand-black flex flex-col items-center justify-center text-brand-gray-light font-mono text-xs space-y-4">
      <div className="w-8 h-8 rounded-full border-2 border-brand-cyan border-t-transparent animate-spin" />
      <span>Redirigiendo al cotizador...</span>
    </div>
  );
}

export default function PrecotizadorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-brand-black flex items-center justify-center text-brand-gray-light font-mono text-xs">
        Cargando...
      </div>
    }>
      <RedirectContent />
    </Suspense>
  );
}
