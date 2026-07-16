import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { FiSun, FiMoon, FiUser, FiLogOut, FiLogIn, FiUserPlus } from 'react-icons/fi';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/'); // Redirect user directly to the public visitor dashboard landing page
  };

  return (
    <nav className="navbar-container" style={styles.navbar}>
      <div className="navbar-logo" style={styles.logoGroup}>
        <span style={{
          ...styles.badge,
          color: user ? 'var(--primary)' : 'var(--text-muted)',
          background: user ? 'var(--primary-glow)' : 'var(--border-light)'
        }}>
          {user ? (user.role === 'admin' ? 'Yönetici Modu' : 'Üye Modu') : 'Ziyaretçi Modu'}
        </span>
      </div>

      <div className="navbar-actions" style={styles.actions}>
        {/* Dark/Light Mode Toggle */}
        <button
          onClick={toggleTheme}
          style={styles.themeToggle}
          title={theme === 'light' ? 'Koyu Tema' : 'Açık Tema'}
          aria-label="Toggle Theme"
        >
          {theme === 'light' ? (
            <FiMoon style={styles.icon} />
          ) : (
            <FiSun style={styles.icon} />
          )}
        </button>

        {/* Auth Actions Conditional Display */}
        {user ? (
          /* Authenticated Card Layout */
          <div style={styles.authGroup}>
            <div style={styles.profileCard}>
              <div style={{
                ...styles.avatar,
                background: user.role === 'admin' 
                  ? 'linear-gradient(135deg, var(--primary), var(--accent))' 
                  : 'linear-gradient(135deg, #10b981, #059669)'
              }}>
                <FiUser style={styles.avatarIcon} />
              </div>
              <div style={styles.userInfo}>
                <span style={styles.username}>{user.username}</span>
                <span style={styles.role}>
                  {user.role === 'admin' ? 'Sistem Yöneticisi' : 'Kütüphane Üyesi'}
                </span>
              </div>
            </div>
            
            {/* Styled Logout action button in Header Navbar with icon and text */}
            <button 
              onClick={handleLogout} 
              style={styles.navbarLogoutBtn} 
              title="Çıkış Yap"
              aria-label="Sign Out"
            >
              <FiLogOut style={styles.logoutIcon} />
              <span>Çıkış Yap</span>
            </button>
          </div>
        ) : (
          /* Guest Actions Menu Buttons */
          <div style={styles.guestGroup}>
            <button 
              onClick={() => navigate('/login')} 
              style={styles.loginBtn}
            >
              <FiLogIn style={styles.btnIcon} />
              <span>Giriş Yap</span>
            </button>
            <button 
              onClick={() => navigate('/register')} 
              style={styles.registerBtn}
            >
              <FiUserPlus style={styles.btnIcon} />
              <span>Kayıt Ol</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    gridArea: 'navbar',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 2rem',
    background: 'var(--bg-sidebar)',
    borderBottom: '1px solid var(--border-light)',
    backdropFilter: 'blur(10px)',
    zIndex: 10,
    transition: 'background var(--transition-normal), border var(--transition-normal)',
  },
  logoGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  badge: {
    padding: '0.25rem 0.75rem',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: '600',
    letterSpacing: '0.5px',
    border: '1px solid var(--border-light)',
    transition: 'all var(--transition-normal)',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
  },
  themeToggle: {
    background: 'none',
    border: 'none',
    padding: '0.5rem',
    borderRadius: '50%',
    cursor: 'pointer',
    color: 'var(--text-main)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background var(--transition-fast), color var(--transition-fast)',
    boxShadow: 'none',
    width: '40px',
    height: '40px',
    border: '1px solid var(--border-light)',
  },
  icon: {
    fontSize: '1.2rem',
  },
  authGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  profileCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    paddingLeft: '1rem',
    borderLeft: '1px solid var(--border-light)',
  },
  avatar: {
    width: '38px',
    height: '38px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff',
    transition: 'background var(--transition-normal)',
  },
  avatarIcon: {
    fontSize: '1.1rem',
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  username: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: 'var(--text-main)',
  },
  role: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
  },
  navbarLogoutBtn: {
    background: 'rgba(239, 68, 68, 0.08)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    borderRadius: '8px',
    color: 'var(--error)',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    fontSize: '0.85rem',
    fontWeight: '600',
    transition: 'all var(--transition-fast)',
    boxShadow: 'none',
  },
  logoutIcon: {
    fontSize: '0.95rem',
  },
  guestGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  loginBtn: {
    background: 'none',
    border: '1px solid var(--border-light)',
    color: 'var(--text-main)',
    padding: '0.5rem 1rem',
    fontSize: '0.85rem',
    fontWeight: '600',
    borderRadius: '8px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    cursor: 'pointer',
    boxShadow: 'none',
  },
  registerBtn: {
    background: 'var(--primary)',
    color: '#ffffff',
    border: '1px solid transparent',
    padding: '0.5rem 1rem',
    fontSize: '0.85rem',
    fontWeight: '600',
    borderRadius: '8px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    cursor: 'pointer',
    transition: 'all var(--transition-fast)',
  },
  btnIcon: {
    fontSize: '0.95rem',
  },
};
