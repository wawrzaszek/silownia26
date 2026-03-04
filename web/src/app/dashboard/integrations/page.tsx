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
      body: JSON.stringify({ provider, config: { mode: 'oauth', connectedAt: new Date().toISOString() } })
    });
    await load();
  }

  return (
    <div className="grid" style={{ gap: 14 }}>
      <div className="panel">
        <h2 style={{ marginTop: 0 }}>Integrations Hub</h2>
        <p style={{ color: 'var(--muted)', marginTop: 0 }}>Podłącz kanały wykonawcze dla workflow: API, Sheets, Zapier, Slack.</p>
        <form onSubmit={create} style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <select className="input" style={{ maxWidth: 280 }} value={provider} onChange={(e) => setProvider(e.target.value)}>
            <option value="google_sheets">Google Sheets</option>
            <option value="zapier">Zapier</option>
            <option value="slack">Slack</option>
            <option value="custom_api">Custom API</option>
          </select>
          <button className="btn btn-primary" type="submit">Połącz integrację</button>
        </form>
      </div>

      <div className="grid grid-3">
        {list.map((item) => (
          <article key={item.id} className="panel fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong>{item.provider}</strong>
              <span className="badge" style={{ color: item.is_active ? 'var(--success)' : 'var(--muted)' }}>
                {item.is_active ? 'connected' : 'inactive'}
              </span>
            </div>
            <div style={{ color: 'var(--muted)', marginTop: 8, fontSize: 14 }}>
              Kanał gotowy do użycia w triggerach i akcjach workflow.
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
