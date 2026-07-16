import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../common/Navbar';
import Sidebar from '../common/Sidebar';

export default function MainLayout() {
  // Read initial collapse state from localStorage to ensure layout persistence
  const [isCollapsed, setIsCollapsed] = useState(() => {
    try {
      const saved = localStorage.getItem('sidebar_collapsed');
      return saved === 'true';
    } catch (e) {
      return false;
    }
  });

  const toggleCollapsed = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('sidebar_collapsed', String(next));
      } catch (e) {
        console.error('Failed to save sidebar collapsed state:', e);
      }
      return next;
    });
  };

  return (
    <div className={`app-layout ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Sidebar Panel with collapse props */}
      <Sidebar collapsed={isCollapsed} toggleCollapsed={toggleCollapsed} />
      
      {/* Top Navbar */}
      <Navbar />

      {/* Main Content Area with transition settings */}
      <main style={styles.content}>
        <div style={styles.scrollWrapper}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}

const styles = {
  content: {
    gridArea: 'content',
    background: 'var(--bg-app)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    transition: 'background var(--transition-normal), all 0.3s ease-in-out',
  },
  scrollWrapper: {
    flex: 1,
    overflowY: 'auto',
    position: 'relative',
    height: '100%',
    width: '100%',
  },
};
