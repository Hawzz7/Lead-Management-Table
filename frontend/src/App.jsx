import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "./services/api";

import LeadForm from "./pages/LeadForm";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  const checkAuth = async () => {
    try {
      await API.get("/admin/leads"); // test protected route
      setIsAuthenticated(true);
    } catch {
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return <div className="p-10 text-center">Checking authentication...</div>;
  }

  return (
    <Routes>
      {/* Public Route */}
      <Route path="/" element={<LeadForm />} />

      {/* Admin Login */}
      <Route
        path="/admin"
        element={
          isAuthenticated ? (
            <Navigate to="/admin/dashboard" />
          ) : (
            <AdminLogin refreshAuth={checkAuth} />
          )
        }
      />

      {/* Protected Dashboard */}
      <Route
        path="/admin/dashboard"
        element={
          isAuthenticated ? <AdminDashboard refreshAuth={checkAuth}/> : <Navigate to="/admin" />
        }
      />
    </Routes>
  );
}

export default App;
