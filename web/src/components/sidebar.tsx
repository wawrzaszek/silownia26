'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/dashboard/processes', label: 'Procesy' },
  { href: '/dashboard/workflows', label: 'Workflow' },
  { href: '/dashboard/integrations', label: 'Integracje' },
  { href: '/billing', label: 'Billing' },
  { href: '/settings', label: 'Ustawienia' },
  { href: '/admin', label: 'Admin' }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <div style={{ fontSize: 22, fontWeight: 900, marginBottom: 24 }}>FlowPilot SaaS</div>
      <div style={{ display: 'grid', gap: 8 }}>
        {links.map((link) => {
          const active = pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              style={{
                padding: '10px 12px',
                borderRadius: 10,
                background: active ? 'var(--brand)' : 'transparent',
                color: active ? 'white' : 'var(--text)',
                fontWeight: 700
              }}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
