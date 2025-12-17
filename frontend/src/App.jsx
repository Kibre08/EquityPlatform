import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import AdminPanel from "./pages/AdminPanel";
import StartupDashboard from "./pages/StartupDashboard";
import InvestorDashboard from "./pages/InvestorDashboard";
import Messaging from "./pages/Messaging";
import CampaignList from "./pages/CampaignList";
import StartupIP from "./pages/StartupIP";
import StartupContributions from "./pages/StartupContributions";
import InvestorAgreements from "./pages/InvestorAgreements";
import AdminIP from "./pages/AdminIP";
import IPAwareness from "./pages/IPAwareness";
import UserManagement from "./pages/UserManagement";
import ManageContent from "./pages/ManageContent";

import api from "./services/api";

import Landing from "./pages/Landing";

// Layout component to handle conditional Navbar
function Layout({ user, onLogout, children }) {
  const location = useLocation();
  const showNavbar = user && !["/", "/login", "/register"].includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar user={user} onLogout={onLogout} />}
      {children}
    </>
  );
}

function App() {
  // Initialize from localStorage to prevent flicker
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  });

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          // Verify token by fetching profile
          const res = await api.get("/startup/me");
          setUser(res.data.user);
          localStorage.setItem("user", JSON.stringify(res.data.user));
        } catch (e) {
          console.warn("Session expired", e);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
        }
      } else {
        // No token, ensure user is null
        setUser(null);
      }
    };
    checkAuth();
  }, []);

  // helper to refresh user when updated (profile edits, etc.)
  const refreshUser = () => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
    else setUser(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <Router>
      <Layout user={user} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login onLogin={refreshUser} />} />
          <Route path="/register" element={<Register />} />

          {/* Admin Routes */}
          <Route
            path="/admin-dashboard"
            element={
              <PrivateRoute>
                {user?.role === "admin" ? <AdminDashboard /> : <Navigate to="/login" />}
              </PrivateRoute>
            }
          />
          <Route
            path="/admin-panel"
            element={
              <PrivateRoute>
                {user?.role === "admin" ? <AdminPanel /> : <Navigate to="/login" />}
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/ip"
            element={
              <PrivateRoute>
                {user?.role === "admin" ? <AdminIP /> : <Navigate to="/login" />}
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <PrivateRoute>
                {user?.role === "admin" ? <UserManagement /> : <Navigate to="/login" />}
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/content"
            element={
              <PrivateRoute>
                {user?.role === "admin" ? <ManageContent /> : <Navigate to="/login" />}
              </PrivateRoute>
            }
          />

          {/* Startup Routes */}
          <Route
            path="/startup-dashboard"
            element={
              <PrivateRoute>
                {user?.role === "startup" ? <StartupDashboard /> : <Navigate to="/login" />}
              </PrivateRoute>
            }
          />
          <Route
            path="/startup/ip"
            element={
              <PrivateRoute>
                {user?.role === "startup" ? <StartupIP /> : <Navigate to="/login" />}
              </PrivateRoute>
            }
          />
          <Route
            path="/startup/contributions"
            element={
              <PrivateRoute>
                {user?.role === "startup" ? <StartupContributions /> : <Navigate to="/login" />}
              </PrivateRoute>
            }
          />
          <Route
            path="/ip-awareness"
            element={
              <PrivateRoute>
                <IPAwareness />
              </PrivateRoute>
            }
          />

          {/* Investor Routes */}
          <Route
            path="/investor-dashboard"
            element={
              <PrivateRoute>
                {user?.role === "investor" ? <InvestorDashboard /> : <Navigate to="/login" />}
              </PrivateRoute>
            }
          />
          <Route
            path="/investor/agreements"
            element={
              <PrivateRoute>
                {user?.role === "investor" ? <InvestorAgreements /> : <Navigate to="/login" />}
              </PrivateRoute>
            }
          />

          {/* Shared */}
          <Route
            path="/messages"
            element={
              <PrivateRoute>
                <Messaging />
              </PrivateRoute>
            }
          />
          <Route path="/campaigns" element={<CampaignList />} />

          {/* Default Redirect */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
