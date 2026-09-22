import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { extractErrorMessage } from "../api/client";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    login(username, password)
      .then((authState) => {
        const from =
          location.state?.from?.pathname ||
          (authState.role === "STAFF" ? "/customers" : "/my-accounts");
        navigate(from, { replace: true });
      })
      .catch((err) => setError(extractErrorMessage(err)))
      .finally(() => setSubmitting(false));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="font-display text-3xl text-ink">Retail Bank</p>
          <p className="text-slate text-[15px] mt-1">Sign in to your account</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="border border-line bg-paper-raised px-6 py-6 rounded-sm"
        >
          <label className="block mb-4">
            <span className="block text-[13px] text-slate mb-1">Username</span>
            <input
              required
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input"
              placeholder="staff1"
            />
          </label>

          <label className="block mb-5">
            <span className="block text-[13px] text-slate mb-1">Password</span>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              placeholder="••••••••"
            />
          </label>

          {error && (
            <p className="mb-4 text-[14px] text-rust bg-rust-soft px-3 py-2 rounded-sm">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full px-4 py-2 bg-ink text-paper text-[14px] rounded-sm hover:bg-ink-soft transition-colors disabled:opacity-50"
          >
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="text-[13px] text-slate text-center mt-5">
          Bank staff and customers use the same sign-in page — what you see
          next depends on your account.
        </p>
      </div>
    </div>
  );
}
