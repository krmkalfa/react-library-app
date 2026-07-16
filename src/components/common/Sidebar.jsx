import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  FiGrid, 
  FiBook, 
  FiLayers, 
  FiUsers, 
  FiBookOpen, 
  FiRotateCcw, 
  FiAlertTriangle, 
  FiBookmark,
  FiKey
} from 'react-icons/fi';

export default function Sidebar() {
  const { user } = useAuth();

  const isAdmin = user && user.role === 'admin';
  const isMember = user && user.role === 'member';

  // Menu items for guest users (unauthenticated)
  const guestItems = [
    { path: '/dashboard', label: 'Dashboard', icon: FiGrid },
    { path: '/books', label: 'Kitaplar', icon: FiBook },
  ];

  // Menu items for library members
  const memberItems = [
    { path: '/dashboard', label: 'Dashboard', icon: FiGrid },
    { path: '/books', label: 'Kitaplar', icon: FiBook },
    { path: '/my-books', label: 'Kitaplarım', icon: FiBookmark },
    { path: '/change-password', label: 'Şifre Değiştir', icon: FiKey },
  ];

  // Full admin panel routes
  const adminItems = [
    { path: '/dashboard', label: 'Dashboard', icon: FiGrid },
    { path: '/books', label: 'Kitaplar', icon: FiBook },
    { path: '/categories', label: 'Kategoriler', icon: FiLayers },
    { path: '/members', label: 'Üyeler', icon: FiUsers },
    { path: '/loans', label: 'Ödünç İşlemleri', icon: FiBookOpen },
    { path: '/returns', label: 'İade İşlemleri', icon: FiRotateCcw },
    { path: '/overdue', label: 'Geciken Kitaplar', icon: FiAlertTriangle },
  ];

  // Determine active menu list based on auth role
  const menuItems = isAdmin ? adminItems : (isMember ? memberItems : guestItems);

  return (
    <aside style={styles.sidebar}>
      {/* Brand Header */}
      <div style={styles.brand}>
        <div style={styles.brandLogo}>L</div>
        <h2 style={styles.brandName}>BiblioTech</h2>
      </div>

      {/* Menu Navigation */}
      <nav style={styles.nav}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              style={({ isActive }) => ({
                ...styles.navLink,
                ...(isActive ? styles.activeNavLink : {}),
              })}
            >
              {({ isActive }) => (
                <>
                  <Icon style={{
                    ...styles.navIcon,
                    color: isActive ? 'var(--primary)' : 'var(--text-muted)'
                  }} />
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}

const styles = {
  sidebar: {
    gridArea: 'sidebar',
    display: 'flex',
    flexDirection: 'column',
    background: 'var(--bg-sidebar)',
    borderRight: '1px solid var(--border-light)',
    padding: '2rem 1.5rem',
    height: '100vh',
    boxSizing: 'border-box',
    transition: 'background var(--transition-normal), border var(--transition-normal)',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '3rem',
  },
  brandLogo: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, var(--primary), var(--accent))',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '1.2rem',
    boxShadow: '0 4px 10px var(--primary-glow)',
  },
  brandName: {
    fontSize: '1.3rem',
    fontWeight: '700',
    color: 'var(--text-main)',
    letterSpacing: '-0.5px',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    flex: 1,
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '0.85rem 1rem',
    borderRadius: '10px',
    color: 'var(--text-muted)',
    fontSize: '0.95rem',
    fontWeight: '500',
    textDecoration: 'none',
    transition: 'all var(--transition-fast)',
    cursor: 'pointer',
  },
  activeNavLink: {
    background: 'var(--primary-glow)',
    color: 'var(--primary)',
    fontWeight: '600',
  },
  navIcon: {
    fontSize: '1.15rem',
    transition: 'color var(--transition-fast)',
  },
};
