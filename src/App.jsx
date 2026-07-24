import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Pages
import Homepage from './pages/Home';
import Dashboard from './pages/Dashboard';
import Books from './pages/Books';
import Members from './pages/Members';
import Loans from './pages/Loans';
import Returns from './pages/Returns';
import Overdue from './pages/Overdue';
import Login from './pages/Login';
import Register from './pages/Register';
import MyBooks from './pages/MyBooks';
import ChangePassword from './pages/ChangePassword';

function AppRouter() {
  const { loading, isLoading } = useAuth();

  // If session authorization is loading, prevent rendering any route layouts
  if (loading || isLoading) {
    return (
      <div style={styles.loaderContainer}>
        <div className="spinner" style={styles.spinner}></div>
        <p style={styles.loadingText}>Kütüphane Sistemi Yükleniyor...</p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Auth Entry Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Layout Shell */}
        <Route path="/" element={<MainLayout />}>
          {/* Default Home Page */}
          <Route index element={<Homepage />} />
          
          {/* Public Screen Route (Guest Accessible) */}
          <Route path="books" element={<Books />} />
          
          {/* Guarded Admin-Only Dashboard */}
          <Route 
            path="dashboard" 
            element={
              <ProtectedRoute adminOnly>
                <Dashboard />
              </ProtectedRoute>
            } 
          />

          {/* Guarded Admin-Only / Authenticated routes */}
          <Route 
            path="members" 
            element={
              <ProtectedRoute adminOnly>
                <Members />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="loans" 
            element={
              <ProtectedRoute adminOnly>
                <Loans />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="returns" 
            element={
              <ProtectedRoute adminOnly>
                <Returns />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="overdue" 
            element={
              <ProtectedRoute adminOnly>
                <Overdue />
              </ProtectedRoute>
            } 
          />

          {/* Member-Only Guarded Routes */}
          <Route 
            path="my-books" 
            element={
              <ProtectedRoute>
                <MyBooks />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="change-password" 
            element={
              <ProtectedRoute>
                <ChangePassword />
              </ProtectedRoute>
            } 
          />
        </Route>

        {/* Fallback Catch-All Route */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppRouter />
        {/* Global Toast Alert Notifications */}
        <ToastContainer 
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </AuthProvider>
    </ThemeProvider>
  );
}

const styles = {
  loaderContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    width: '100vw',
    background: 'var(--bg-app)',
    color: 'var(--text-main)',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '3px solid var(--border-light)',
    borderTop: '3px solid var(--primary)',
    borderRadius: '50%',
    marginBottom: '1rem',
  },
  loadingText: {
    fontSize: '0.95rem',
    fontWeight: '600',
    color: 'var(--text-muted)',
    letterSpacing: '0.5px',
  },
};

export default App;
