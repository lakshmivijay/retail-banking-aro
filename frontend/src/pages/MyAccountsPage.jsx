import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCustomerAccounts } from "../api/accounts";
import { extractErrorMessage } from "../api/client";
import { formatCurrency } from "../lib/format";
import { useAuth } from "../context/AuthContext";

export default function MyAccountsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    setLoading(true);
    setLoadError("");
    getCustomerAccounts(user.customerId)
      .then(setAccounts)
      .catch((err) => setLoadError(extractErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [user.customerId]);

  return (
    <div className="max-w-4xl px-10 py-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl text-ink">Welcome, {user.name}</h1>
        <p className="text-slate text-[15px] mt-1">
          Your accounts. Open one to deposit, withdraw, or see recent activity.
        </p>
      </div>

      {loading && <p className="text-slate text-[15px]">Loading your accounts…</p>}

      {loadError && (
        <p className="text-[14px] text-rust bg-rust-soft px-3 py-2 rounded-sm inline-block">
          {loadError}
        </p>
      )}

      {!loading && !loadError && accounts.length === 0 && (
        <div className="border border-dashed border-line rounded-sm px-6 py-10 text-center">
          <p className="text-ink text-[15px]">No accounts yet.</p>
          <p className="text-slate text-[14px] mt-1">
            Visit a branch to have one opened against your profile.
          </p>
        </div>
      )}

      {!loading && !loadError && accounts.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {accounts.map((a) => (
            <button
              key={a.id}
              onClick={() => navigate(`/accounts/${a.id}`)}
              className="text-left border border-line bg-paper-raised rounded-sm px-5 py-5 hover:bg-ledger-soft/40 transition-colors"
            >
              <p className="text-[13px] text-slate font-mono">{a.accountNumber}</p>
              <p className="font-display text-lg text-ink mt-1">
                {a.accountType.charAt(0) + a.accountType.slice(1).toLowerCase()} account
              </p>
              <p className="font-mono text-2xl text-ink mt-3">
                {formatCurrency(a.balance)}
              </p>
              <p className="text-[12px] text-slate mt-1">
                {a.status.charAt(0) + a.status.slice(1).toLowerCase()}
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
