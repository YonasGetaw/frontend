import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { AuthLayout } from "./layouts/AuthLayout";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { AdminLayout } from "./layouts/AdminLayout";
import { RequireAuth } from "./routes/RequireAuth";
import { RequireRole } from "./routes/RequireRole";

import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";
import { ForgotPasswordPage } from "./pages/auth/ForgotPasswordPage";
import { ResetPasswordPage } from "./pages/auth/ResetPasswordPage";

import { UserHomePage } from "./pages/user/UserHomePage";
import { UserProductsPage } from "./pages/user/UserProductsPage";
import { UserOrdersPage } from "./pages/user/UserOrdersPage";
import { UserAccountPage } from "./pages/user/UserAccountPage";
import { UserWithdrawPage } from "./pages/user/UserWithdrawPage";
import { UserWithdrawPasswordPage } from "./pages/user/UserWithdrawPasswordPage";
import { UserSendMoneyPage } from "./pages/user/UserSendMoneyPage";
import { UserReferralBonusesPage } from "./pages/user/UserReferralBonusesPage";
import { UserRechargePage } from "./pages/user/UserRechargePage";
import { UserTeamPage } from "./pages/user/UserTeamPage";
import { UserTransactionsPage } from "./pages/user/UserTransactionsPage";
import { UserChangePasswordPage } from "./pages/user/UserChangePasswordPage";
import { UserCouponsPage } from "./pages/user/UserCouponsPage";
import { UserGiftPage } from "./pages/user/UserGiftPage";
import { UserOnlineServicePage } from "./pages/user/UserOnlineServicePage";

import { AdminDashboardPage } from "./pages/admin/AdminDashboardPage";
import { AdminProductsPage } from "./pages/admin/AdminProductsPage";
import { AdminOrdersPage } from "./pages/admin/AdminOrdersPage";
import { AdminUsersPage } from "./pages/admin/AdminUsersPage";
import { AdminPaymentsPage } from "./pages/admin/AdminPaymentsPage";
import { AdminWithdrawalsPage } from "./pages/admin/AdminWithdrawalsPage";

import { useAuthStore } from "./state/auth";

export function App() {
  const hydrate = useAuthStore((s) => s.hydrate);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Route>

      <Route
        path="/"
        element={
          <RequireAuth>
            <RoleRedirect />
          </RequireAuth>
        }
      />

      <Route
        path="/app"
        element={
          <RequireAuth>
            <RequireRole role="USER">
              <DashboardLayout />
            </RequireRole>
          </RequireAuth>
        }
      >
        <Route index element={<Navigate to="home" replace />} />
        <Route path="home" element={<UserHomePage />} />
        <Route path="products" element={<UserProductsPage />} />
        <Route path="orders" element={<UserOrdersPage />} />
        <Route path="account" element={<UserAccountPage />} />
        <Route path="withdraw" element={<UserWithdrawPage />} />
        <Route path="withdraw-password" element={<UserWithdrawPasswordPage />} />
        <Route path="send-money" element={<UserSendMoneyPage />} />
        <Route path="recharge" element={<UserRechargePage />} />
        <Route path="team" element={<UserTeamPage />} />
        <Route path="transactions" element={<UserTransactionsPage />} />
        <Route path="change-password" element={<UserChangePasswordPage />} />
        <Route path="coupons" element={<UserCouponsPage />} />
        <Route path="gift" element={<UserGiftPage />} />
        <Route path="online-service" element={<UserOnlineServicePage />} />
        <Route path="referral-bonuses" element={<UserReferralBonusesPage />} />
      </Route>

      <Route
        path="/admin"
        element={
          <RequireAuth>
            <RequireRole role="ADMIN">
              <AdminLayout />
            </RequireRole>
          </RequireAuth>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="products" element={<AdminProductsPage />} />
        <Route path="orders" element={<AdminOrdersPage />} />
        <Route path="payments" element={<AdminPaymentsPage />} />
        <Route path="withdrawals" element={<AdminWithdrawalsPage />} />
        <Route path="users" element={<AdminUsersPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function RoleRedirect() {
  const user = useAuthStore((s) => s.user);
  if (!user) return <Navigate to="/login" replace />;
  return user.role === "ADMIN" ? <Navigate to="/admin" replace /> : <Navigate to="/app" replace />;
}
