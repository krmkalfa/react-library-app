import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PublicHomepage from './PublicHomepage';
import MemberHomepage from './MemberHomepage';

export default function HomeWrapper() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user && user.role === 'admin') {
      navigate('/dashboard', { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div style={styles.loaderContainer}>
        <div className="spinner" style={styles.spinner}></div>
        <p style={styles.loadingText}>Oturum Kontrol Ediliyor...</p>
      </div>
    );
  }

  if (user && user.role === 'admin') {
    return null; // Will redirect via useEffect
  }

  // Sadece 'member' rolü için özel ana sayfayı göster
  if (user && user.role === 'member') {
    return <MemberHomepage />;
  }

  // Ziyaretçiler için genel tanıtım sayfasını göster
  return <PublicHomepage />;
}

const styles = {
  loaderContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
    width: '100%',
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
