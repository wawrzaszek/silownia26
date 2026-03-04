'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { saveToken } from '@/lib/auth';

export default function AuthCallbackPage() {
  const params = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const token = params.get('token');
    if (token) {
      saveToken(token);
      router.replace('/dashboard');
    }
  }, [params, router]);

  return <main style={{ padding: 40 }}>Logowanie przez Google...</main>;
}
