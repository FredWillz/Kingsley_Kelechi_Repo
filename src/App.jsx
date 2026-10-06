import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage.jsx";
import UserLogin from "./pages/UserLogin.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ErrorPage from "./pages/ErrorPage.jsx";
import RequireAuth from "./components/auth/RequireAuth.jsx";
import DashboardLayout from "./components/Dashboard/DashboardLayout.jsx";
import DashboardHome from "./pages/dashboard/DashboardHome.jsx";
import Profile from "./pages/dashboard/Profile.jsx";
import TransactionHistory from "./pages/dashboard/TransactionHistory.jsx";
import UserGuide from "./pages/dashboard/UserGuide.jsx";
// import AdminConsole from "./pages/dashboard/AdminConsole.jsx";
import TransferFunds from "./pages/dashboard/TransferFunds.jsx"; 
import AllCustomers from "./pages/dashboard/admin/AllCustomers.jsx";
import AddCustomer from "./pages/dashboard/admin/AddCustomer.jsx";
import CustomerProfile from "./pages/dashboard/admin/CustomerProfile.jsx";
import CustomerStatement from "./pages/dashboard/admin/CustomerStatement.jsx";
import EditCustomer from "./pages/dashboard/admin/EditCustomer.jsx";
import AccountRequisitions from "./pages/dashboard/profile/AccountRequisitions.jsx";
import AddBeneficiary from "./pages/dashboard/profile/AddBeneficiary.jsx";
import ChangePassword from "./pages/dashboard/profile/ChangePassword.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<UserLogin />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/login/forgot-password" element={<ForgotPassword />} />

      <Route element={<RequireAuth />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="transfer-funds" element={<TransferFunds />} />
          <Route path="profile" element={<Profile />} />
          <Route
            path="profile/account-requisitions"
            element={<AccountRequisitions />}
          />
          <Route path="profile/add-beneficiary" element={<AddBeneficiary />} />
          <Route path="profile/change-password" element={<ChangePassword />} />
          <Route path="transaction-history" element={<TransactionHistory />} />
          <Route path="user-guide" element={<UserGuide />} />

          <Route element={<RequireAuth role="admin" />}>
            {/* <Route path="admin" element={<AdminConsole />} /> */}
            <Route path="admin/customers" element={<AllCustomers />} />
            <Route path="admin/customers/add" element={<AddCustomer />} />
            <Route path="admin/customers/:uid" element={<CustomerProfile />} />
            <Route path="admin/customers/:uid/statement" element={<CustomerStatement />} />
            <Route path="admin/customers/:uid/edit" element={<EditCustomer />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
}

export default App;
