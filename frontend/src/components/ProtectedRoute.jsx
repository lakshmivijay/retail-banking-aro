import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ roles }) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (roles && !roles.includes(user.role)) {
    return (
      <div className="px-10 py-10">
        <p className="text-[14px] text-rust bg-rust-soft px-3 py-2 rounded-sm inline-block">
          You don't have access to this page.
        </p>
      </div>
    );
  }

  return <Outlet />;
}
