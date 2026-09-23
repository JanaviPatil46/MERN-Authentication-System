import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../api";
import AuthLayout from "../components/AuthLayout";
import Field from "../components/Field";
import SessionSelect from "../components/SessionSelect";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "", duration: "30m" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Enter your name";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter a valid email, like you@example.com";
    if (form.password.length < 8) next.password = "Use at least 8 characters";
    if (form.confirm !== form.password) next.confirm = "Passwords don't match";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;
    setSubmitting(true);
    try {
      await signup(form.name, form.email, form.password, form.duration);
      navigate("/dashboard");
    } catch (err) {
      setServerError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout title="Create your account" subtitle="It takes less than a minute.">
      <form onSubmit={onSubmit} noValidate>
        {serverError && <div className="alert" role="alert">{serverError}</div>}
        <Field label="Name" name="name" autoComplete="name"
          value={form.name} onChange={onChange} error={errors.name} />
        <Field label="Email" name="email" type="email" autoComplete="email"
          value={form.email} onChange={onChange} error={errors.email} />
        <Field label="Password" name="password" type="password" autoComplete="new-password"
          value={form.password} onChange={onChange} error={errors.password}
          hint="At least 8 characters" />
        <Field label="Confirm password" name="confirm" type="password" autoComplete="new-password"
          value={form.confirm} onChange={onChange} error={errors.confirm} />
        <SessionSelect value={form.duration} onChange={onChange} />
        <button className="primary" type="submit" disabled={submitting}>
          {submitting ? "Creating account…" : "Create account"}
        </button>
      </form>
      <p className="switch">
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </AuthLayout>
  );
}
