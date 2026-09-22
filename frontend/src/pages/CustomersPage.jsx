import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createCustomer, getCustomers } from "../api/customers";
import { extractErrorMessage } from "../api/client";

const emptyForm = { name: "", pan: "", email: "", username: "", password: "" };

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const navigate = useNavigate();

  const loadCustomers = () => {
    setLoading(true);
    setLoadError("");
    getCustomers()
      .then(setCustomers)
      .catch((err) => setLoadError(extractErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(loadCustomers, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError("");
    createCustomer(form)
      .then((created) => {
        setForm(emptyForm);
        setShowForm(false);
        setCustomers((prev) => [...prev, created]);
      })
      .catch((err) => setFormError(extractErrorMessage(err)))
      .finally(() => setSubmitting(false));
  };

  return (
    <div className="max-w-4xl px-10 py-10">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl text-ink">Customers</h1>
          <p className="text-slate text-[15px] mt-1">
            Every customer on record, and the accounts opened against them.
          </p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="px-4 py-2 bg-ink text-paper text-[14px] rounded-sm hover:bg-ink-soft transition-colors"
        >
          {showForm ? "Cancel" : "+ New customer"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-9 border border-line bg-paper-raised px-6 py-6 rounded-sm"
        >
          <p className="font-display text-lg text-ink mb-4">New customer</p>
          <div className="grid grid-cols-3 gap-4">
            <Field label="Full name">
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input"
                placeholder="Raj Kumar"
              />
            </Field>
            <Field label="PAN">
              <input
                required
                value={form.pan}
                onChange={(e) =>
                  setForm({ ...form, pan: e.target.value.toUpperCase() })
                }
                className="input font-mono"
                placeholder="ABCDE1234F"
                maxLength={10}
              />
            </Field>
            <Field label="Email">
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="input"
                placeholder="raj@example.com"
              />
            </Field>
            <p className="font-display text-[15px] text-ink mt-6 mb-3">
              Portal login for this customer
            </p>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Username">
                <input
                  required
                  minLength={4}
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  className="input"
                  placeholder="raj.kumar"
                />
              </Field>
              <Field label="Temporary password">
                <input
                  required
                  minLength={6}
                  type="text"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="input font-mono"
                  placeholder="At least 6 characters"
                />
              </Field>
              </div>


          </div>

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
            {submitting ? "Saving…" : "Save customer"}
          </button>
        </form>
      )}

      {loading && <p className="text-slate text-[15px]">Loading customers…</p>}

      {loadError && (
        <p className="text-[14px] text-rust bg-rust-soft px-3 py-2 rounded-sm inline-block">
          {loadError}
        </p>
      )}

      {!loading && !loadError && customers.length === 0 && (
        <div className="border border-dashed border-line rounded-sm px-6 py-10 text-center">
          <p className="text-ink text-[15px]">No customers yet.</p>
          <p className="text-slate text-[14px] mt-1">
            Add the first one to start opening accounts against them.
          </p>
        </div>
      )}

      {!loading && !loadError && customers.length > 0 && (
        <table className="w-full text-[15px]">
          <thead>
            <tr className="border-b border-ink text-left text-[13px] text-slate">
              <th className="pb-2 font-medium">ID</th>
              <th className="pb-2 font-medium">Name</th>
              <th className="pb-2 font-medium">PAN</th>
              <th className="pb-2 font-medium">Email</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr
                key={c.id}
                onClick={() => navigate(`/customers/${c.id}`)}
                className="border-b border-line cursor-pointer hover:bg-ledger-soft/50 transition-colors"
              >
                <td className="py-3 font-mono text-slate">{c.id}</td>
                <td className="py-3 text-ink">{c.name}</td>
                <td className="py-3 font-mono text-ink-soft">{c.pan}</td>
                <td className="py-3 text-ink-soft">{c.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-[13px] text-slate mb-1">{label}</span>
      {children}
    </label>
  );
}