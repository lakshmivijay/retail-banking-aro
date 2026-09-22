import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import CustomersPage from "./pages/CustomersPage";
import CustomerDetailPage from "./pages/CustomerDetailPage";
import AccountsPage from "./pages/AccountsPage";
import AccountDetailPage from "./pages/AccountDetailPage";
import MyAccountsPage from "./pages/MyAccountsPage";
import { useAuth } from "./context/AuthContext";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginRoute />} />

      <Route element={<ProtectedRoute roles={["STAFF"]} />}>
        <Route element={<Layout />}>
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/customers/:id" element={<CustomerDetailPage />} />
          <Route path="/accounts" element={<AccountsPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute roles={["CUSTOMER"]} />}>
        <Route element={<Layout />}>
          <Route path="/my-accounts" element={<MyAccountsPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute roles={["STAFF", "CUSTOMER"]} />}>
        <Route element={<Layout />}>
          <Route path="/accounts/:id" element={<AccountDetailPage />} />
        </Route>
      </Route>

      <Route path="/" element={<HomeRedirect />} />
      <Route path="*" element={<HomeRedirect />} />
    </Routes>
  );
}

function LoginRoute() {
  const { isAuthenticated, isStaff } = useAuth();
  if (isAuthenticated) {
    return <Navigate to={isStaff ? "/customers" : "/my-accounts"} replace />;
  }
  return <LoginPage />;
}

function HomeRedirect() {
  const { isAuthenticated, isStaff } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Navigate to={isStaff ? "/customers" : "/my-accounts"} replace />;
}
