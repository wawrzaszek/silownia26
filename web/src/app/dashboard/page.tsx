'use client';

import { useEffect, useState } from 'react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Activity } from 'lucide-react';
import { api } from '@/lib/api';
import { MetricCard } from '@/components/metric-card';
import { Toast, useToast } from '@/components/toast';

type Overview = { operations: number; processCount: number; efficiency: number };
type Point = { day: string; operations: number };
type ActivityRow = { id: string; operation_type: string; status: string; created_at: string };

const automations = [
  { title: 'Lead Capture -> CRM -> Slack', status: 'live', runs: 1421 },
  { title: 'Invoice Follow-up Sequence', status: 'paused', runs: 392 },
  { title: 'Onboarding Email Pipeline', status: 'live', runs: 877 }
];

export default function DashboardPage() {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [chart, setChart] = useState<Point[]>([]);
  const [activity, setActivity] = useState<ActivityRow[]>([]);
  const [aiPlan, setAiPlan] = useState<string[]>([]);
  const { message, setMessage } = useToast();

  useEffect(() => {
    Promise.all([
      api<Overview>('/dashboard/overview'),
      api<Point[]>('/dashboard/usage-chart'),
      api<ActivityRow[]>('/users/activity')
    ]).then(([o, c, a]) => {
      setOverview(o);
      setChart(c);
      setActivity(a);
    });
  }, []);

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem' }}>Command Center</h1>
          <div style={{ color: 'var(--muted)', fontSize: 14 }}>Podgląd automatyzacji, wydajności i bieżących runów</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost" onClick={() => setMessage('Wysłano testowego webhooka')}>Test webhook</button>
          <button className="btn btn-primary" onClick={() => setMessage('Utworzono nową automatyzację')}>Nowa automatyzacja</button>
        </div>
      </div>

      <div className="grid grid-3">
        <MetricCard title="Operacje 30 dni" value={overview?.operations ?? '-'} hint="Łączna liczba wykonań" />
        <MetricCard title="Aktywne procesy" value={overview?.processCount ?? '-'} hint="Procesy i scenariusze" />
        <MetricCard title="Health score" value={`${overview?.efficiency ?? 0}%`} hint="Skuteczność wykonania" />
      </div>

      <div className="split" style={{ marginTop: 14 }}>
        <div className="panel fade-in">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <strong>Execution Volume</strong>
            <span className="badge"><Activity size={12} /> Live telemetry</span>
          </div>
          <div style={{ width: '100%', height: 270 }}>
            <ResponsiveContainer>
              <AreaChart data={chart}>
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Area type="monotone" dataKey="operations" stroke="var(--brand)" fill="var(--brand)" fillOpacity={0.22} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="panel fade-in">
          <strong>Live automations</strong>
          <div style={{ marginTop: 10, display: 'grid', gap: 8 }}>
            {automations.map((item) => (
              <div key={item.title} style={{ border: '1px solid var(--border)', borderRadius: 12, padding: 10 }}>
                <div style={{ fontWeight: 700 }}>{item.title}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--muted)', fontSize: 13, marginTop: 6 }}>
                  <span>{item.runs} runów</span>
                  <span style={{ color: item.status === 'live' ? 'var(--success)' : 'var(--danger)' }}>{item.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="split" style={{ marginTop: 14 }}>
        <div className="panel fade-in">
          <strong>Activity Stream</strong>
          <div style={{ marginTop: 10, display: 'grid', gap: 7 }}>
            {activity.slice(0, 9).map((item) => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: 7 }}>
                <span>{item.operation_type}</span>
                <span style={{ color: item.status === 'success' ? 'var(--success)' : 'var(--danger)' }}>{item.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="panel fade-in">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <strong>AI Workflow Copilot</strong>
            <button
              className="btn btn-ghost"
              onClick={async () => {
                const result = await api<{ suggestion: { steps: string[] } }>('/ai/assistant', {
                  method: 'POST',
                  body: JSON.stringify({ objective: 'Zautomatyzuj kwalifikację leadów i follow-up' })
                });
                setAiPlan(result.suggestion.steps);
              }}
            >
              Generuj
            </button>
          </div>
          <div style={{ marginTop: 10, color: 'var(--muted)', fontSize: 14 }}>
            {aiPlan.length === 0 ? 'Wygeneruj szkic workflow gotowy do uruchomienia.' : aiPlan.join(' -> ')}
          </div>
        </div>
      </div>

      <Toast message={message} />
    </>
  );
}
