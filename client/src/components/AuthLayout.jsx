export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="auth-shell">
      <aside className="auth-side">
        <span className="brand">Keystone</span>
        <p className="side-line">One account for everything you build here.</p>
      </aside>
      <main className="auth-main">
        <div className="auth-card">
          <h1>{title}</h1>
          <p className="subtitle">{subtitle}</p>
          {children}
        </div>
      </main>
    </div>
  );
}
