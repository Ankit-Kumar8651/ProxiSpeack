import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { EmployeeProvider } from './context/EmployeeContext';

import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute, { GuestRoute } from './components/common/ProtectedRoute';

import HomePage from './pages/HomePage';
import FeaturesPage from './pages/FeaturesPage';
import HowItWorksPage from './pages/HowItWorksPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import OfficePage from './pages/OfficePage';
import EmployeesPage from './pages/EmployeesPage';
import AppearancePage from './pages/AppearancePage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

import './styles/theme.css';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <EmployeeProvider>
          <BrowserRouter>
            <div className="app-container">
              <Navbar />
              <main className="main-content">
                <Routes>
                  {/* Only these two pages are reachable without logging in */}
                  <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
                  <Route path="/signup" element={<GuestRoute><SignupPage /></GuestRoute>} />

                  {/* Everything else requires login (admin AND regular users) */}
                  <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
                  <Route path="/features" element={<ProtectedRoute><FeaturesPage /></ProtectedRoute>} />
                  <Route path="/how-it-works" element={<ProtectedRoute><HowItWorksPage /></ProtectedRoute>} />
                  <Route path="/appearance" element={<ProtectedRoute><AppearancePage /></ProtectedRoute>} />
                  <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                  <Route path="/office/:roomId" element={<ProtectedRoute><OfficePage /></ProtectedRoute>} />
                  <Route path="/employees" element={<ProtectedRoute><EmployeesPage /></ProtectedRoute>} />
                  <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                  <Route path="*" element={<ProtectedRoute><NotFoundPage /></ProtectedRoute>} />
                </Routes>
              </main>
              <Footer />
            </div>
          </BrowserRouter>
        </EmployeeProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
