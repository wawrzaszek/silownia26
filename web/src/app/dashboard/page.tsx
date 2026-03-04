'use client';

import { useEffect, useState } from 'react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { api } from '@/lib/api';
import { MetricCard } from '@/components/metric-card';
import { Toast, useToast } from '@/components/toast';

type Overview = { operations: number; processCount: number; efficiency: number };
type Point = { day: string; operations: number };
type Activity = { id: string; operation_type: string; status: string; created_at: string };

export default function DashboardPage() {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [chart, setChart] = useState<Point[]>([]);
  const [activity, setActivity] = useState<Activity[]>([]);
  const [aiPlan, setAiPlan] = useState<string[]>([]);
  const { message, setMessage } = useToast();

  useEffect(() => {
    Promise.all([
      api<Overview>('/dashboard/overview'),
      api<Point[]>('/dashboard/usage-chart'),
      api<Activity[]>('/users/activity')
    ]).then(([o, c, a]) => {
      setOverview(o);
      setChart(c);
      setActivity(a);
    });
  }, []);

  return (
    <>
      <div className="grid grid-3">
        <MetricCard title="Operacje (30 dni)" value={overview?.operations ?? '-'} hint="Aktywność zespołu" />
        <MetricCard title="Procesy" value={overview?.processCount ?? '-'} hint="Wszystkie procesy" />
        <MetricCard title="Efektywność" value={`${overview?.efficiency ?? 0}%`} hint="Skuteczność automatyzacji" />
      </div>

      <div className="panel fade-in" style={{ marginTop: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <strong>Wykorzystanie</strong>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-primary" onClick={() => setMessage('Nowy proces utworzony')}>Dodaj proces</button>
            <button className="btn btn-ghost" onClick={() => setMessage('Nowe zadanie utworzone')}>Dodaj zadanie</button>
          </div>
        </div>
        <div style={{ width: '100%', height: 280 }}>
          <ResponsiveContainer>
            <AreaChart data={chart}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="operations" stroke="var(--brand)" fill="var(--brand)" fillOpacity={0.18} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="panel fade-in" style={{ marginTop: 16 }}>
        <strong>Historia aktywności</strong>
        <div style={{ marginTop: 10, display: 'grid', gap: 8 }}>
          {activity.slice(0, 8).map((item) => (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: 6 }}>
              <span>{item.operation_type}</span>
              <span style={{ color: item.status === 'success' ? 'var(--brand-2)' : 'var(--danger)' }}>{item.status}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="panel fade-in" style={{ marginTop: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <strong>AI Assistant (Premium)</strong>
          <button
            className="btn btn-ghost"
            onClick={async () => {
              const result = await api<{ suggestion: { steps: string[] } }>('/ai/assistant', {
                method: 'POST',
                body: JSON.stringify({ objective: 'Automatyzacja onboardingu leadów B2B' })
              });
              setAiPlan(result.suggestion.steps);
            }}
          >
            Wygeneruj plan
          </button>
        </div>
        <div style={{ marginTop: 10, color: 'var(--muted)' }}>
          {aiPlan.length === 0 ? 'Generowanie sugestii workflow przez AI.' : aiPlan.join(' -> ')}
        </div>
      </div>

      <Toast message={message} />
    </>
  );
}
