"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/auth/register/');
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-cyan-50 to-blue-50">
      <div className="text-center">
        <Loader2 className="w-12 h-12 animate-spin text-cyan-600 mx-auto mb-4" />
        <p className="text-gray-600">Redirigiendo...</p>
      </div>
    </div>
  );
}