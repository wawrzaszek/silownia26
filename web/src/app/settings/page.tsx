'use client';

import { FormEvent, useEffect, useState } from 'react';
import { Sidebar } from '@/components/sidebar';
import { ThemeToggle } from '@/components/theme-toggle';
import { api } from '@/lib/api';

type Me = { full_name: string; email: string; plan: string; role: string };

export default function SettingsPage() {
  const [me, setMe] = useState<Me | null>(null);
  const [fullName, setFullName] = useState('');

  useEffect(() => {
    api<Me>('/auth/me').then((m) => {
      setMe(m);
      setFullName(m.full_name);
    });
  }, []);

  async function save(e: FormEvent) {
    e.preventDefault();
    await api('/users/profile', {
      method: 'PATCH',
      body: JSON.stringify({ fullName })
    });
    const refreshed = await api<Me>('/auth/me');
    setMe(refreshed);
  }

  async function exportCsv() {
    const csv = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/exports/operations.csv`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
    });
    const text = await csv.text();
    const blob = new Blob([text], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'operations.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="layout">
      <Sidebar />
      <main style={{ padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <h1>Ustawienia konta</h1>
          <ThemeToggle />
        </div>

        <div className="panel" style={{ maxWidth: 600 }}>
          <form onSubmit={save} className="grid">
            <label>
              Imię i nazwisko
              <input className="input" value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </label>
            <label>
              Email
              <input className="input" value={me?.email ?? ''} readOnly />
            </label>
            <div style={{ color: 'var(--muted)' }}>Plan: {me?.plan ?? '-'} | Rola: {me?.role ?? '-'}</div>
            <button className="btn btn-primary" type="submit">Zapisz profil</button>
          </form>
          <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button className="btn btn-ghost" onClick={exportCsv}>Eksport CSV</button>
            <a className="btn btn-ghost" href={`${process.env.NEXT_PUBLIC_API_URL}/reports/usage.pdf`} target="_blank">Raport PDF</a>
          </div>
        </div>
      </main>
    </div>
  );
}
