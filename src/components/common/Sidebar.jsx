import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  FiGrid, 
  FiBook, 
  FiUsers, 
  FiBookOpen, 
  FiRotateCcw, 
  FiAlertTriangle, 
  FiBookmark,
  FiKey,
  FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi';

export default function Sidebar({ collapsed, toggleCollapsed }) {
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

  // Full admin panel routes (excluding standalone Categories page)
  const adminItems = [
    { path: '/dashboard', label: 'Dashboard', icon: FiGrid },
    { path: '/books', label: 'Kitaplar', icon: FiBook },
    { path: '/members', label: 'Üyeler', icon: FiUsers },
    { path: '/loans', label: 'Ödünç İşlemleri', icon: FiBookOpen },
    { path: '/returns', label: 'İade İşlemleri', icon: FiRotateCcw },
    { path: '/overdue', label: 'Geciken Kitaplar', icon: FiAlertTriangle },
  ];

  // Determine active menu list based on auth role
  const menuItems = isAdmin ? adminItems : (isMember ? memberItems : guestItems);

  return (
    <aside style={{
      ...styles.sidebar,
      padding: collapsed ? '2rem 0.75rem' : '2rem 1.5rem',
    }}>
      {/* Brand Header with Collapsible Details */}
      <div style={{
        ...styles.brand,
        flexDirection: collapsed ? 'column' : 'row',
        gap: collapsed ? '1rem' : '0.75rem',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'space-between',
      }}>
        <div style={styles.brandLeft}>
          <div style={styles.brandLogo}>B</div>
          {!collapsed && <h2 style={styles.brandName}>BiblioTech</h2>}
        </div>
        
        {/* Toggle Button */}
        <button 
          onClick={toggleCollapsed} 
          style={styles.toggleBtn} 
          title={collapsed ? "Menüyü Genişlet" : "Menüyü Daralt"}
          type="button"
          aria-label="Toggle Sidebar Collapse"
        >
          {collapsed ? (
            <FiChevronRight style={styles.toggleIcon} />
          ) : (
            <FiChevronLeft style={styles.toggleIcon} />
          )}
        </button>
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
                justifyContent: collapsed ? 'center' : 'flex-start',
                padding: collapsed ? '0.85rem 0' : '0.85rem 1rem',
              })}
              title={collapsed ? item.label : undefined}
            >
              {({ isActive }) => (
                <>
                  <Icon style={{
                    ...styles.navIcon,
                    color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                    marginRight: collapsed ? '0' : '0.75rem'
                  }} />
                  {!collapsed && <span>{item.label}</span>}
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
    height: '100vh',
    boxSizing: 'border-box',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    overflow: 'hidden',
  },
  brand: {
    display: 'flex',
    marginBottom: '3rem',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  brandLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
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
    fontSize: '1.25rem',
    boxShadow: '0 4px 10px var(--primary-glow)',
  },
  brandName: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: 'var(--text-main)',
    letterSpacing: '-0.5px',
  },
  toggleBtn: {
    background: 'none',
    border: '1px solid var(--border-light)',
    borderRadius: '8px',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all var(--transition-fast)',
    boxShadow: 'none',
    padding: '0',
  },
  toggleIcon: {
    fontSize: '1rem',
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
    borderRadius: '10px',
    color: 'var(--text-muted)',
    fontSize: '0.95rem',
    fontWeight: '500',
    textDecoration: 'none',
    transition: 'all var(--transition-fast)',
    cursor: 'pointer',
    width: '100%',
  },
  activeNavLink: {
    background: 'var(--primary-glow)',
    color: 'var(--primary)',
    fontWeight: '600',
  },
  navIcon: {
    fontSize: '1.15rem',
    transition: 'margin var(--transition-fast)',
  },
};
