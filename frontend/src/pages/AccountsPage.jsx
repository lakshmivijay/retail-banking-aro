import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllAccounts, getCustomerAccounts } from "../api/accounts";
import { extractErrorMessage } from "../api/client";
import { formatCurrency } from "../lib/format";

export default function AccountsPage() {
  const navigate = useNavigate();

  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [customerId, setCustomerId] = useState("");
  const [filtering, setFiltering] = useState(false);

  const loadAll = () => {
    setLoading(true);
    setLoadError("");
    setFiltering(false);
    setCustomerId("");
    getAllAccounts()
      .then(setAccounts)
      .catch((err) => setLoadError(extractErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(loadAll, []);

  const handleFilter = (e) => {
    e.preventDefault();
    setLoading(true);
    setLoadError("");
    setFiltering(true);
    getCustomerAccounts(customerId)
      .then(setAccounts)
      .catch((err) => setLoadError(extractErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  return (
    <div className="max-w-4xl px-10 py-10">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl text-ink">Accounts</h1>
          <p className="text-slate text-[15px] mt-1">
            Every account across all customers.
          </p>
        </div>
        <form onSubmit={handleFilter} className="flex gap-2">
          <input
            type="number"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            placeholder="Filter by customer ID"
            className="input font-mono w-48"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-ink text-paper text-[14px] rounded-sm hover:bg-ink-soft transition-colors whitespace-nowrap"
          >
            Filter
          </button>
          {filtering && (
            <button
              type="button"
              onClick={loadAll}
              className="px-4 py-2 border border-line text-ink text-[14px] rounded-sm hover:bg-ledger-soft/50 transition-colors whitespace-nowrap"
            >
              Clear
            </button>
          )}
        </form>
      </div>

      {loading && <p className="text-slate text-[15px]">Loading accounts…</p>}

      {loadError && (
        <p className="text-[14px] text-rust bg-rust-soft px-3 py-2 rounded-sm inline-block">
          {loadError}
        </p>
      )}

      {!loading && !loadError && accounts.length === 0 && (
        <div className="border border-dashed border-line rounded-sm px-6 py-10 text-center">
          <p className="text-ink text-[15px]">No accounts found.</p>
        </div>
      )}

      {!loading && !loadError && accounts.length > 0 && (
        <table className="w-full text-[15px]">
          <thead>
            <tr className="border-b border-ink text-left text-[13px] text-slate">
              <th className="pb-2 font-medium">Account number</th>
              <th className="pb-2 font-medium">Customer ID</th>
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
                <td className="py-3 font-mono text-slate">{a.customerId}</td>
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