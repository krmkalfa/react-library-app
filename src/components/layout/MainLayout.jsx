import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../common/Navbar';
import Sidebar from '../common/Sidebar';

export default function MainLayout() {
  return (
    <div className="app-layout">
      {/* Sidebar Panel */}
      <Sidebar />
      
      {/* Top Navbar */}
      <Navbar />

      {/* Main Content Area */}
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
    transition: 'background var(--transition-normal)',
  },
  scrollWrapper: {
    flex: 1,
    overflowY: 'auto',
    position: 'relative',
    height: '100%',
    width: '100%',
  },
};
