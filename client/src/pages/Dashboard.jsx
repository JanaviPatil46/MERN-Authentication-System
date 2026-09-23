import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user, expiresAt, logout } = useAuth();
  const endsAt = expiresAt
    ? new Date(expiresAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
    : null;
  const navigate = useNavigate();

  const onLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="dash">
      <header className="dash-top">
        <span className="brand">Keystone</span>
        <button className="ghost" onClick={onLogout}>Sign out</button>
      </header>
      <main className="dash-body">
        <h1>Hello, {user.name}</h1>
        <p className="subtitle">You're signed in. This page is only visible to signed-in users.</p>
        <dl className="details">
          <div><dt>Email</dt><dd>{user.email}</dd></div>
          <div><dt>Account ID</dt><dd>{user.id}</dd></div>
          {endsAt && <div><dt>Session ends</dt><dd>{endsAt}</dd></div>}
        </dl>
      </main>
    </div>
  );
}
