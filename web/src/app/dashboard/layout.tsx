import { Sidebar } from '@/components/sidebar';
import { ThemeToggle } from '@/components/theme-toggle';
import { Search } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="layout">
      <Sidebar />
      <main className="main-shell">
        <div className="topbar">
          <div className="command">
            <Search size={16} />
            <input placeholder="Szukaj procesów, workflow, logów... (⌘K)" />
          </div>
          <ThemeToggle />
        </div>
        {children}
      </main>
    </div>
  );
}
