'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { api } from '@/lib/api';

type Process = { id: string; name: string; description: string; status: 'draft' | 'active' | 'paused' };

const columns: Array<{ key: Process['status']; label: string }> = [
  { key: 'draft', label: 'Backlog' },
  { key: 'active', label: 'In Execution' },
  { key: 'paused', label: 'Paused' }
];

export default function ProcessesPage() {
  const [list, setList] = useState<Process[]>([]);
  const [name, setName] = useState('Automatyzacja leadów');
  const [draggedId, setDraggedId] = useState<string | null>(null);

  async function load() {
    setList(await api<Process[]>('/processes'));
  }

  useEffect(() => {
    load();
  }, []);

  async function create(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    await api('/processes', { method: 'POST', body: JSON.stringify({ name, status: 'draft' }) });
    setName('');
    await load();
  }

  async function moveProcess(processId: string, nextStatus: Process['status']) {
    setList((prev) => prev.map((p) => (p.id === processId ? { ...p, status: nextStatus } : p)));
    await api(`/processes/${processId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: nextStatus })
    });
  }

  const grouped = useMemo(() => {
    return {
      draft: list.filter((p) => p.status === 'draft'),
      active: list.filter((p) => p.status === 'active'),
      paused: list.filter((p) => p.status === 'paused')
    };
  }, [list]);

  return (
    <div className="grid" style={{ gap: 14 }}>
      <div className="panel">
        <h2 style={{ marginTop: 0 }}>Procesy i pipeline</h2>
        <p style={{ color: 'var(--muted)', marginTop: 0 }}>Przeciągnij kartę między kolumnami, aby zmienić status.</p>
        <form onSubmit={create} style={{ display: 'flex', gap: 8, marginTop: 10 }}>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nazwa procesu" />
          <button className="btn btn-primary" type="submit">Dodaj proces</button>
        </form>
      </div>

      <div className="kanban">
        {columns.map((col) => (
          <section
            key={col.key}
            className="kanban-col"
            onDragOver={(ev) => ev.preventDefault()}
            onDrop={async () => {
              if (!draggedId) return;
              await moveProcess(draggedId, col.key);
              setDraggedId(null);
            }}
          >
            <strong>{col.label}</strong>
            {grouped[col.key].map((p) => (
              <article
                key={p.id}
                draggable
                onDragStart={() => setDraggedId(p.id)}
                className="kanban-card fade-in"
              >
                <div style={{ fontWeight: 700 }}>{p.name}</div>
                <div style={{ color: 'var(--muted)', fontSize: 13, marginTop: 5 }}>{p.description || 'Brak opisu'}</div>
              </article>
            ))}
          </section>
        ))}
      </div>
    </div>
  );
}
