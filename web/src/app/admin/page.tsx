'use client';

import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/sidebar';
import { ThemeToggle } from '@/components/theme-toggle';
import { api } from '@/lib/api';

type UserRow = { id: string; email: string; role: string; plan: string; is_blocked: boolean };

export default function AdminPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [stats, setStats] = useState<{ users: number; workspaces: number; operationsLast30Days: number } | null>(null);

  async function load() {
    const [s, u] = await Promise.all([api<{ users: number; workspaces: number; operationsLast30Days: number }>('/admin/stats'), api<UserRow[]>('/admin/users')]);
    setStats(s);
    setUsers(u);
  }

  useEffect(() => {
    load();
  }, []);

  async function block(id: string) {
    await api(`/admin/users/${id}/block`, { method: 'PATCH' });
    await load();
  }

  return (
    <div className="layout">
      <Sidebar />
      <main style={{ padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <h1>Panel Administratora</h1>
          <ThemeToggle />
        </div>

        <div className="grid grid-3">
          <div className="panel"><div>Użytkownicy</div><div className="kpi">{stats?.users ?? '-'}</div></div>
          <div className="panel"><div>Workspace</div><div className="kpi">{stats?.workspaces ?? '-'}</div></div>
          <div className="panel"><div>Operacje 30d</div><div className="kpi">{stats?.operationsLast30Days ?? '-'}</div></div>
        </div>

        <div className="panel" style={{ marginTop: 16 }}>
          <h3>Zarządzanie użytkownikami</h3>
          {users.map((u) => (
            <div key={u.id} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', padding: '10px 0' }}>
              <div>
                <strong>{u.email}</strong>
                <div style={{ color: 'var(--muted)', fontSize: 12 }}>{u.role} • {u.plan}</div>
              </div>
              <button className="btn btn-ghost" onClick={() => block(u.id)} disabled={u.is_blocked}>Blokuj</button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
