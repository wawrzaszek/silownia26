'use client';

import { FormEvent, useState } from 'react';
import { api } from '@/lib/api';
import { saveToken } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('Nowy Użytkownik');
  const [email, setEmail] = useState('new@demo.com');
  const [password, setPassword] = useState('Password123!');

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const data = await api<{ accessToken: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, fullName })
    });
    saveToken(data.accessToken);
    router.push('/dashboard');
  }

  return (
    <main style={{ maxWidth: 460, margin: '5vh auto', padding: 20 }}>
      <div className="panel fade-in">
        <h1>Rejestracja</h1>
        <form onSubmit={onSubmit} className="grid">
          <input className="input" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Imię i nazwisko" />
          <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
          <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Hasło" />
          <button className="btn btn-primary" type="submit">Załóż konto</button>
        </form>
      </div>
    </main>
  );
}
