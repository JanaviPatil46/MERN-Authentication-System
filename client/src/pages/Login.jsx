import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../api";
import AuthLayout from "../components/AuthLayout";
import Field from "../components/Field";
import SessionSelect from "../components/SessionSelect";

export default function Login() {
  const { login, sessionEnded } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", duration: "30m" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const next = {};
    if (!form.email.trim()) next.email = "Enter your email";
    if (!form.password) next.password = "Enter your password";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;
    setSubmitting(true);
    try {
      await login(form.email, form.password, form.duration);
      navigate("/dashboard");
    } catch (err) {
      setServerError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout title="Sign in" subtitle="Welcome back. Enter your details to continue.">
      <form onSubmit={onSubmit} noValidate>
        {sessionEnded && !serverError && (
          <div className="notice" role="status">Your session ended. Sign in again to continue.</div>
        )}
        {serverError && <div className="alert" role="alert">{serverError}</div>}
        <Field label="Email" name="email" type="email" autoComplete="email"
          value={form.email} onChange={onChange} error={errors.email} />
        <Field label="Password" name="password" type="password" autoComplete="current-password"
          value={form.password} onChange={onChange} error={errors.password} />
        <SessionSelect value={form.duration} onChange={onChange} />
        <button className="primary" type="submit" disabled={submitting}>
          {submitting ? "Signing in…" : "Sign in"}
        </button>
      </form>
      <p className="switch">
        New here? <Link to="/signup">Create an account</Link>
      </p>
    </AuthLayout>
  );
}
