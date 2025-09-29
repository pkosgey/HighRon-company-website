import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import OwlsecInspiredLanding from "./components/OwlsecInspiredLanding";
import WelcomePage from "./components/WelcomePage";
import CreateAccount from "./components/CreateAccount";
import ResourcesPage from './components/ResourcesPage';
import NotificationsPage from './components/NotificationsPage';
import Login from "./components/Login";
import JoinServer from "./components/JoinServer";
import Dashboard from "./components/Dashboard";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<OwlsecInspiredLanding />} />
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/join-server" element={<JoinServer />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Add catch-all route for 404 handling */}
        <Route path="*" element={<OwlsecInspiredLanding />} />
      </Routes>
    </Router>
  );
}