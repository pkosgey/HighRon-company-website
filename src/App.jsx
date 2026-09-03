import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import "./index.css";
import OwlsecInspiredLanding from "./components/OwlsecInspiredLanding";
import WelcomePage from "./components/WelcomePage";
import CreateAccount from "./components/CreateAccount";
import ResourcesPage from './components/ResourcesPage';
import NotificationsPage from './components/NotificationsPage';
import Login from "./components/Login";
import JoinServer from "./components/JoinServer";
import Dashboard from "./components/Dashboard";

// Protected Route Component - Strictly requires an active logged-in session
function ProtectedRoute({ children }) {
  const location = useLocation();
  const sessionUser = localStorage.getItem("session_user");
  const isAuthenticated = Boolean(sessionUser);

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname, message: "Please log in to access this page." }} replace />;
  }

  return children;
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<OwlsecInspiredLanding />} />
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route 
          path="/resources" 
          element={
            <ProtectedRoute>
              <ResourcesPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/notifications" 
          element={
            <ProtectedRoute>
              <NotificationsPage />
            </ProtectedRoute>
          } 
        />
        <Route path="/join-server" element={<JoinServer />} />
        <Route path="/login" element={<Login />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<OwlsecInspiredLanding />} />
      </Routes>
    </Router>
  );
}