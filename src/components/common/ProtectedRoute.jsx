import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading, isLoading } = useAuth();

  // If session authorization is loading, render a premium placeholder loader
  if (loading || isLoading) {
    return (
      <div style={styles.loaderContainer}>
        <div className="spinner" style={styles.spinner}></div>
        <p style={styles.loadingText}>Oturum Kontrol Ediliyor...</p>
      </div>
    );
  }

  // Redirect to login if user is not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect non-admins to their own books if page is admin-only
  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/my-books" replace />;
  }

  return children;
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
    transition: 'background var(--transition-normal)',
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
