import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const staffNavItems = [
  { to: "/customers", label: "Customers" },
  { to: "/accounts", label: "Accounts" },
];

const customerNavItems = [{ to: "/my-accounts", label: "My accounts" }];

export default function Layout() {
  const { user, isStaff, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = isStaff ? staffNavItems : customerNavItems;

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 shrink-0 bg-ink text-paper flex flex-col justify-between">
        <div>
          <div className="px-7 pt-9 pb-8">
            <p className="font-display text-2xl tracking-tight">Retail Bank</p>
            <p className="text-[13px] text-paper/60 mt-1 leading-snug">
              {isStaff ? "Customer & account ledger" : "Your accounts"}
            </p>
          </div>
          <nav className="px-3">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `block px-4 py-2.5 text-[15px] rounded-sm mb-1 transition-colors ${
                    isActive
                      ? "bg-paper/10 text-paper"
                      : "text-paper/70 hover:text-paper hover:bg-paper/5"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="px-7 py-6 border-t border-paper/10">
          <p className="text-[13px] text-paper/80">{user?.name}</p>
          <p className="text-[12px] text-paper/45 mt-0.5">
            {isStaff ? "Bank staff" : "Customer"}
          </p>
          <button
            onClick={handleLogout}
            className="mt-3 text-[13px] text-paper/70 hover:text-paper transition-colors"
          >
            Sign out
          </button>
          <p className="text-[12px] text-paper/45 mt-4 leading-relaxed">
            customer-service • :8081
            <br />
            account-service • :8082
          </p>
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        <Outlet />
      </main>
    </div>
  );
}
