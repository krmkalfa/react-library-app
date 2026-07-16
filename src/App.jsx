import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Pages
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

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Auth Entry Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Layout Shell */}
            <Route path="/" element={<MainLayout />}>
              {/* Default Redirect to Dashboard */}
              <Route index element={<Navigate to="/dashboard" replace />} />
              
              {/* Public Screen Route (Guest Accessible) */}
              <Route path="books" element={<Books />} />
              <Route path="dashboard" element={<Dashboard />} />

              {/* Guarded Admin-Only / Authenticated routes */}
              <Route 
                path="members" 
                element={
                  <ProtectedRoute>
                    <Members />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="loans" 
                element={
                  <ProtectedRoute>
                    <Loans />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="returns" 
                element={
                  <ProtectedRoute>
                    <Returns />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="overdue" 
                element={
                  <ProtectedRoute>
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

export default App;
