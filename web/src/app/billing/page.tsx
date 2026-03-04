'use client';

import { Sidebar } from '@/components/sidebar';
import { ThemeToggle } from '@/components/theme-toggle';
import { api } from '@/lib/api';

export default function BillingPage() {
  async function checkout(interval: 'monthly' | 'yearly') {
    const data = await api<{ url: string }>('/billing/checkout', {
      method: 'POST',
      body: JSON.stringify({ plan: 'pro', interval })
    });

    if (data.url) {
      window.location.href = data.url;
    }
  }

  return (
    <div className="layout">
      <Sidebar />
      <main style={{ padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <h1>Subskrypcja i płatności</h1>
          <ThemeToggle />
        </div>

        <div className="grid grid-3">
          <div className="panel">
            <h3>Free</h3>
            <p>0$/miesiąc</p>
            <p style={{ color: 'var(--muted)' }}>Podstawowe limity.</p>
          </div>
          <div className="panel">
            <h3>Pro</h3>
            <p>49$/miesiąc</p>
            <p style={{ color: 'var(--muted)' }}>Scheduler, webhooki, raporty PDF.</p>
            <button className="btn btn-primary" onClick={() => checkout('monthly')}>Start 7-dniowego triala</button>
          </div>
          <div className="panel">
            <h3>Enterprise</h3>
            <p>Kontakt</p>
            <p style={{ color: 'var(--muted)' }}>Multi-workspace, AI, zaawansowane SLA.</p>
            <button className="btn btn-ghost">Skontaktuj sprzedaż</button>
          </div>
        </div>
      </main>
    </div>
  );
}
