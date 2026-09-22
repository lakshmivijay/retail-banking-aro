import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  deposit,
  getAccount,
  getTransactions,
  withdraw,
} from "../api/accounts";
import { extractErrorMessage } from "../api/client";
import { formatCurrency, formatDateTime } from "../lib/format";

export default function AccountDetailPage() {
  const { id } = useParams();
  const { isStaff } = useAuth();
  const [account, setAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [depositBusy, setDepositBusy] = useState(false);
  const [withdrawBusy, setWithdrawBusy] = useState(false);
  const [depositError, setDepositError] = useState("");
  const [withdrawError, setWithdrawError] = useState("");

  const load = () => {
    setLoading(true);
    setLoadError("");
    Promise.all([getAccount(id), getTransactions(id)])
      .then(([accountData, txData]) => {
        setAccount(accountData);
        setTransactions(txData);
      })
      .catch((err) => setLoadError(extractErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(load, [id]);

  useEffect(() => {
    if (!loading && window.location.hash) {
      const el = document.querySelector(window.location.hash);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [loading]);

  const refreshAccountAndTransactions = () =>
    Promise.all([getAccount(id), getTransactions(id)]).then(
      ([accountData, txData]) => {
        setAccount(accountData);
        setTransactions(txData);
      }
    );

  const handleDeposit = (e) => {
    e.preventDefault();
    setDepositBusy(true);
    setDepositError("");
    deposit(id, Number(depositAmount))
      .then(() => {
        setDepositAmount("");
        return refreshAccountAndTransactions();
      })
      .catch((err) => setDepositError(extractErrorMessage(err)))
      .finally(() => setDepositBusy(false));
  };

  const handleWithdraw = (e) => {
    e.preventDefault();
    setWithdrawBusy(true);
    setWithdrawError("");
    withdraw(id, Number(withdrawAmount))
      .then(() => {
        setWithdrawAmount("");
        return refreshAccountAndTransactions();
      })
      .catch((err) => setWithdrawError(extractErrorMessage(err)))
      .finally(() => setWithdrawBusy(false));
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
      <Link
        to={isStaff ? `/customers/${account.customerId}` : "/my-accounts"}
        className="text-[13px] text-slate hover:text-ink"
      >
        {isStaff ? "← Back to customer" : "← Back to my accounts"}
      </Link>


      <div className="mt-4 mb-9 flex items-end justify-between">
        <div>
          <p className="text-[13px] text-slate font-mono">{account.accountNumber}</p>
          <p className="font-display text-2xl text-ink mt-1">
            {account.accountType.charAt(0) + account.accountType.slice(1).toLowerCase()}{" "}
            account
          </p>
        </div>
        <div className="text-right">
          <p className="text-[13px] text-slate">Balance</p>
          <p className="font-mono text-3xl text-ink">
            {formatCurrency(account.balance)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-10">
        <form
          id="deposit"
          onSubmit={handleDeposit}
          className="border border-line bg-paper-raised rounded-sm px-5 py-5 scroll-mt-6"
        >
          <p className="font-display text-lg text-ledger mb-3">Deposit</p>
          <div className="flex gap-2">
            <input
              required
              type="number"
              min="0.01"
              step="0.01"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              placeholder="Amount"
              className="input font-mono"
            />
            <button
              type="submit"
              disabled={depositBusy}
              className="px-4 py-2 bg-ledger text-paper text-[14px] rounded-sm hover:opacity-90 transition-opacity disabled:opacity-50 whitespace-nowrap"
            >
              {depositBusy ? "…" : "Deposit"}
            </button>
          </div>
          {depositError && (
            <p className="mt-3 text-[13px] text-rust bg-rust-soft px-3 py-2 rounded-sm">
              {depositError}
            </p>
          )}
        </form>

        <form
          id="withdraw"
          onSubmit={handleWithdraw}
          className="border border-line bg-paper-raised rounded-sm px-5 py-5 scroll-mt-6"
        >
          <p className="font-display text-lg text-rust mb-3">Withdraw</p>
          <div className="flex gap-2">
            <input
              required
              type="number"
              min="0.01"
              step="0.01"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              placeholder="Amount"
              className="input font-mono"
            />
            <button
              type="submit"
              disabled={withdrawBusy}
              className="px-4 py-2 bg-ink text-paper text-[14px] rounded-sm hover:bg-ink-soft transition-colors disabled:opacity-50 whitespace-nowrap"
            >
              {withdrawBusy ? "…" : "Withdraw"}
            </button>
          </div>
          {withdrawError && (
            <p className="mt-3 text-[13px] text-rust bg-rust-soft px-3 py-2 rounded-sm">
              {withdrawError}
            </p>
          )}
        </form>
      </div>

      <p id="transactions" className="font-display text-xl text-ink mb-3 scroll-mt-6">
        Transaction history
      </p>

      {transactions.length === 0 && (
        <div className="border border-dashed border-line rounded-sm px-6 py-10 text-center">
          <p className="text-ink text-[15px]">No transactions yet.</p>
        </div>
      )}

      {transactions.length > 0 && (
        <table className="w-full text-[15px]">
          <thead>
            <tr className="border-b border-ink text-left text-[13px] text-slate">
              <th className="pb-2 font-medium">When</th>
              <th className="pb-2 font-medium">Type</th>
              <th className="pb-2 font-medium text-right">Amount</th>
              <th className="pb-2 font-medium text-right">Balance after</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t.id} className="border-b border-line">
                <td className="py-3 text-ink-soft">
                  {formatDateTime(t.transactionTime)}
                </td>
                <td className="py-3">
                  <span
                    className={`text-[12px] px-2 py-0.5 rounded-sm ${
                      t.transactionType === "DEPOSIT"
                        ? "bg-ledger-soft text-ledger"
                        : "bg-rust-soft text-rust"
                    }`}
                  >
                    {t.transactionType}
                  </span>
                </td>
                <td className="py-3 font-mono text-right text-ink">
                  {t.transactionType === "WITHDRAWAL" ? "−" : "+"}
                  {formatCurrency(t.amount)}
                </td>
                <td className="py-3 font-mono text-right text-ink-soft">
                  {formatCurrency(t.balanceAfter)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
