'use client';

import { useEffect, useState } from 'react';

export function useToast() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(null), 2500);
    return () => clearTimeout(t);
  }, [message]);

  return { message, setMessage };
}

export function Toast({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div
      style={{
        position: 'fixed',
        right: 20,
        bottom: 20,
        background: 'var(--text)',
        color: 'var(--bg)',
        padding: '10px 14px',
        borderRadius: 10,
        zIndex: 50
      }}
    >
      {message}
    </div>
  );
}
