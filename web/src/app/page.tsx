import Link from 'next/link';

export default function Home() {
  return (
    <main style={{ maxWidth: 1080, margin: '0 auto', padding: '40px 20px' }}>
      <section className="panel fade-in" style={{ textAlign: 'center', padding: 40 }}>
        <h1 style={{ fontSize: 'clamp(2rem, 3vw, 3.2rem)', marginTop: 0 }}>FlowPilot: SaaS do procesów i automatyzacji</h1>
        <p style={{ color: 'var(--muted)', maxWidth: 720, margin: '0 auto 20px' }}>
          Zarządzaj workflow, webhookami, integracjami i raportami w jednym panelu. Model subskrypcji Free / Pro / Enterprise.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link className="btn btn-primary" href="/register">Załóż konto</Link>
          <Link className="btn btn-ghost" href="/login">Zaloguj się</Link>
          <Link className="btn btn-ghost" href="/dashboard">Demo dashboard</Link>
        </div>
      </section>
    </main>
  );
}
