import Link from 'next/link';

const terminalRows = [
  'slopax % npm run auto:repair',
  'Pipeline: lint -> test -> deploy',
  'Status: Running checks for 12 workspaces',
  '2 automatyzacje wymagają decyzji',
  'Tryb planowania aktywny (shift+tab)'
];

export default function Home() {
  return (
    <main className="hero-shell">
      <header className="hero-topbar">
        <strong>Real Day in the Life of an Automation Engineer</strong>
      </header>

      <section className="hero-scene fade-in">
        <div className="hero-phone-card">
          <div className="hero-phone-notch" />
          <div className="hero-phone-content">
            <div className="hero-phone-head">
              <span>SLOPAX</span>
              <span className="hero-points">2</span>
            </div>
            <div className="hero-streak">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                <div key={`${d}-${i}`} className={`hero-streak-dot ${i > 2 && i < 5 ? 'ok' : 'off'}`}>
                  {d}
                </div>
              ))}
            </div>
            <div className="hero-workout">
              <div style={{ fontWeight: 800 }}>Day 3 - Deadlift & Back</div>
              <div style={{ color: 'var(--muted)', fontSize: 12 }}>Zadania i automatyzacje dnia zsynchronizowane z workflow.</div>
            </div>
            <div className="hero-mini-grid">
              <div className="hero-mini-box">465/2880 kcal</div>
              <div className="hero-mini-box">Progress 68%</div>
              <div className="hero-mini-box">23g protein</div>
            </div>
          </div>
        </div>

        <div className="hero-editor">
          <div className="hero-editor-head">
            <div className="hero-lights">
              <span />
              <span />
              <span />
            </div>
            <div className="hero-editor-search">slopax</div>
          </div>
          <div className="hero-editor-body">
            <div className="hero-editor-sidebar">
              <div>EXPLORER</div>
              <div>SLOPAX</div>
              <div>OUTLINE</div>
              <div>TIMELINE</div>
            </div>
            <div className="hero-editor-terminal">
              {terminalRows.map((row) => (
                <div key={row} className="hero-row">{row}</div>
              ))}

              <div className="hero-actions">
                <Link className="btn btn-primary" href="/dashboard">Otwórz dashboard</Link>
                <Link className="btn btn-ghost" href="/register">Załóż konto</Link>
                <Link className="btn btn-ghost" href="/login">Zaloguj</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
