import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getCustomer } from "../api/customers";
import { createAccount, getCustomerAccounts } from "../api/accounts";
import { extractErrorMessage } from "../api/client";
import { formatCurrency } from "../lib/format";

const accountTypes = ["SAVINGS", "CURRENT"];

export default function CustomerDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [accountType, setAccountType] = useState(accountTypes[0]);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const load = () => {
    setLoading(true);
    setLoadError("");
    Promise.all([getCustomer(id), getCustomerAccounts(id)])
      .then(([customerData, accountData]) => {
        setCustomer(customerData);
        setAccounts(accountData);
      })
      .catch((err) => setLoadError(extractErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(load, [id]);

  const handleCreateAccount = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError("");
    createAccount({ customerId: Number(id), accountType })
      .then((created) => {
        setShowForm(false);
        setAccounts((prev) => [...prev, created]);
      })
      .catch((err) => setFormError(extractErrorMessage(err)))
      .finally(() => setSubmitting(false));
  };

  if (loading) {
    return <div className="px-10 py-10 text-slate text-[15px]">Loading…</div>;
  }

  if (loadError) {
    return (
      <div className="px-10 py-10">
        <p className="text-[14px] text-rust bg-rust-soft px-3 py-2 rounded-sm inline-block">
          {loadError}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl px-10 py-10">
      <Link to="/customers" className="text-[13px] text-slate hover:text-ink">
        ← All customers
      </Link>

      <div className="flex items-start justify-between mt-4 mb-8">
        <div>
          <h1 className="font-display text-3xl text-ink">{customer.name}</h1>
          <p className="text-slate text-[14px] mt-1 font-mono">
            {customer.pan} · {customer.email}
          </p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="px-4 py-2 bg-ink text-paper text-[14px] rounded-sm hover:bg-ink-soft transition-colors"
        >
          {showForm ? "Cancel" : "+ New account"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreateAccount}
          className="mb-9 border border-line bg-paper-raised px-6 py-6 rounded-sm"
        >
          <p className="font-display text-lg text-ink mb-4">Open a new account</p>
          <label className="block max-w-xs">
            <span className="block text-[13px] text-slate mb-1">Account type</span>
            <select
              value={accountType}
              onChange={(e) => setAccountType(e.target.value)}
              className="input"
            >
              {accountTypes.map((t) => (
                <option key={t} value={t}>
                  {t.charAt(0) + t.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </label>

          {formError && (
            <p className="mt-4 text-[14px] text-rust bg-rust-soft px-3 py-2 rounded-sm">
              {formError}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-5 px-4 py-2 bg-ledger text-paper text-[14px] rounded-sm hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {submitting ? "Opening…" : "Open account"}
          </button>
        </form>
      )}

      <p className="font-display text-xl text-ink mb-3">Accounts</p>

      {accounts.length === 0 && (
        <div className="border border-dashed border-line rounded-sm px-6 py-10 text-center">
          <p className="text-ink text-[15px]">No accounts opened yet.</p>
        </div>
      )}

      {accounts.length > 0 && (
        <table className="w-full text-[15px]">
          <thead>
            <tr className="border-b border-ink text-left text-[13px] text-slate">
              <th className="pb-2 font-medium">Account number</th>
              <th className="pb-2 font-medium">Type</th>
              <th className="pb-2 font-medium">Status</th>
              <th className="pb-2 font-medium text-right">Balance</th>
              <th className="pb-2 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((a) => (
              <tr
                key={a.id}
                onClick={() => navigate(`/accounts/${a.id}`)}
                className="border-b border-line cursor-pointer hover:bg-ledger-soft/50 transition-colors"
              >
                <td className="py-3 font-mono text-ink">{a.accountNumber}</td>
                <td className="py-3 text-ink-soft">
                  {a.accountType.charAt(0) + a.accountType.slice(1).toLowerCase()}
                </td>
                <td className="py-3">
                  <span
                    className={`text-[12px] px-2 py-0.5 rounded-sm ${
                      a.status === "ACTIVE"
                        ? "bg-ledger-soft text-ledger"
                        : "bg-rust-soft text-rust"
                    }`}
                  >
                    {a.status}
                  </span>
                </td>
                <td className="py-3 font-mono text-right text-ink">
                  {formatCurrency(a.balance)}
                </td>
                <td
                  className="py-3 text-right space-x-3"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => navigate(`/accounts/${a.id}#deposit`)}
                    className="text-[13px] text-ledger hover:underline"
                  >
                    Deposit
                  </button>
                  <button
                    onClick={() => navigate(`/accounts/${a.id}#withdraw`)}
                    className="text-[13px] text-rust hover:underline"
                  >
                    Withdraw
                  </button>
                  <button
                    onClick={() => navigate(`/accounts/${a.id}#transactions`)}
                    className="text-[13px] text-slate hover:underline"
                  >
                    History
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}