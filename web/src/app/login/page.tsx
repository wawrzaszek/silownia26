'use client';

import { FormEvent, useState } from 'react';
import { API_URL, api } from '@/lib/api';
import { saveToken } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('user@demo.com');
  const [password, setPassword] = useState('Password123!');
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    try {
      const data = await api<{ accessToken: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      saveToken(data.accessToken);
      router.push('/dashboard');
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <main style={{ maxWidth: 460, margin: '5vh auto', padding: 20 }}>
      <div className="panel fade-in">
        <h1>Logowanie</h1>
        <form onSubmit={onSubmit} className="grid">
          <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
          <input
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Hasło"
          />
          <button className="btn btn-primary" type="submit">Zaloguj</button>
        </form>
        <a className="btn btn-ghost" href={`${API_URL}/auth/google`} style={{ display: 'inline-block', marginTop: 10 }}>Kontynuuj przez Google</a>
        {error ? <p style={{ color: 'var(--danger)' }}>{error}</p> : null}
      </div>
    </main>
  );
}
