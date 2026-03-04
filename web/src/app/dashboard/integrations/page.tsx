'use client';

import { FormEvent, useEffect, useState } from 'react';
import { api } from '@/lib/api';

type Integration = { id: string; provider: string; is_active: boolean };

export default function IntegrationsPage() {
  const [provider, setProvider] = useState('google_sheets');
  const [list, setList] = useState<Integration[]>([]);

  async function load() {
    setList(await api<Integration[]>('/integrations'));
  }

  useEffect(() => {
    load();
  }, []);

  async function create(e: FormEvent) {
    e.preventDefault();
    await api('/integrations', {
      method: 'POST',
      body: JSON.stringify({ provider, config: { demo: true } })
    });
    await load();
  }

  return (
    <div className="grid" style={{ gap: 16 }}>
      <div className="panel">
        <h2>Integracje API / Zapier / Sheets</h2>
        <form onSubmit={create} style={{ display: 'flex', gap: 8 }}>
          <select className="input" value={provider} onChange={(e) => setProvider(e.target.value)}>
            <option value="google_sheets">Google Sheets</option>
            <option value="zapier">Zapier</option>
            <option value="slack">Slack</option>
            <option value="custom_api">Custom API</option>
          </select>
          <button className="btn btn-primary" type="submit">Dodaj</button>
        </form>
      </div>
      <div className="panel">
        {list.map((item) => (
          <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
            <span>{item.provider}</span>
            <span style={{ color: item.is_active ? 'var(--brand-2)' : 'var(--muted)' }}>{item.is_active ? 'aktywna' : 'wyłączona'}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
