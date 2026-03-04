'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Blocks, Bot, CreditCard, Gauge, Network, Settings, Shield, Waypoints, Zap } from 'lucide-react';

const links = [
  { href: '/dashboard', label: 'Command Center', icon: Gauge },
  { href: '/dashboard/processes', label: 'Procesy', icon: Blocks },
  { href: '/dashboard/workflows', label: 'Workflow Studio', icon: Waypoints },
  { href: '/dashboard/integrations', label: 'Integracje', icon: Network },
  { href: '/billing', label: 'Subskrypcja', icon: CreditCard },
  { href: '/settings', label: 'Ustawienia', icon: Settings },
  { href: '/admin', label: 'Admin', icon: Shield }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <div className="brand-head">
        <div className="brand-icon"><Zap size={16} /></div>
        <div>
          <div className="brand-title">Slopax Core</div>
          <div className="brand-sub">Automation OS</div>
        </div>
      </div>

      <div className="nav-label">Workspace</div>
      <div style={{ display: 'grid', gap: 8, marginBottom: 18 }}>
        {links.map((link) => {
          const active = pathname.startsWith(link.href);
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-link ${active ? 'active' : ''}`}
            >
              <Icon size={16} />
              {link.label}
            </Link>
          );
        })}
      </div>

      <div className="panel" style={{ marginTop: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <Bot size={16} />
          <strong>AI Copilot</strong>
        </div>
        <div style={{ color: 'var(--muted)', fontSize: 13 }}>2 sugestie nowych automatyzacji czekają na akceptację.</div>
      </div>
    </aside>
  );
}
