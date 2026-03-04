'use client';

import { FormEvent, useEffect, useState } from 'react';
import { api } from '@/lib/api';

type Process = { id: string; name: string; description: string; status: string };

export default function ProcessesPage() {
  const [list, setList] = useState<Process[]>([]);
  const [name, setName] = useState('Nowy proces');

  async function load() {
    setList(await api<Process[]>('/processes'));
  }

  useEffect(() => {
    load();
  }, []);

  async function create(e: FormEvent) {
    e.preventDefault();
    await api('/processes', { method: 'POST', body: JSON.stringify({ name, status: 'draft' }) });
    setName('');
    await load();
  }

  return (
    <div className="grid" style={{ gap: 16 }}>
      <div className="panel">
        <h2>Procesy</h2>
        <form onSubmit={create} style={{ display: 'flex', gap: 8 }}>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
          <button className="btn btn-primary" type="submit">Dodaj</button>
        </form>
      </div>
      <div className="panel">
        {list.map((p) => (
          <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
            <span>{p.name}</span>
            <span style={{ color: 'var(--muted)' }}>{p.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
