import React from 'react';

export default function Sidebar({ currentTab, setCurrentTab }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'triage', label: 'Live Triage', icon: '⚡' },
    { id: 'messages', label: 'Messages', icon: '💬' },
    { id: 'human-review', label: 'Human Review Queue', icon: '⚠' },
    { id: 'evaluation', label: 'Evaluation', icon: '🎯' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
  ];

  return (
    <aside style={styles.sidebar}>
      <div style={styles.brandSection}>
        <div style={styles.logoBadge}>FIQ</div>
        <div>
          <h1 style={styles.brandName}>FrontlineIQ</h1>
          <span style={styles.brandSub}>AI Operations Command Center</span>
        </div>
      </div>

      <nav style={styles.navGroup}>
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              style={{
                ...styles.navButton,
                ...(isActive ? styles.navButtonActive : {}),
              }}
            >
              <span style={styles.icon}>{item.icon}</span>
              {item.label}
            </button>
          );
        })}
      </nav>

      <div style={styles.footerSection}>
        <div style={styles.statusBox}>
          <span style={styles.statusDot}></span>
          <span style={styles.statusText}>AI System Operational</span>
        </div>
      </div>
    </aside>
  );
}

const styles = {
  sidebar: {
    width: '260px',
    height: '100vh',
    backgroundColor: '#FFFFFF',
    borderRight: '1px solid #E2E8F0',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    left: 0,
    top: 0,
    boxSizing: 'border-box',
    padding: '24px 16px',
  },
  brandSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '32px',
    paddingLeft: '8px',
  },
  logoBadge: {
    width: '38px',
    height: '38px',
    backgroundColor: '#4F46E5',
    color: '#FFFFFF',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '14px',
  },
  brandName: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#0F172A',
    margin: 0,
    lineHeight: '1.2',
  },
  brandSub: {
    fontSize: '11px',
    color: '#64748B',
    fontWeight: '500',
  },
  navGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    flex: 1,
  },
  navButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 14px',
    borderRadius: '10px',
    border: 'none',
    backgroundColor: 'transparent',
    color: '#475569',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.15s ease-in-out',
  },
  navButtonActive: {
    backgroundColor: '#EEF2FF',
    color: '#4F46E5',
  },
  icon: {
    fontSize: '16px',
  },
  footerSection: {
    borderTop: '1px solid #F1F5F9',
    paddingTop: '16px',
  },
  statusBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#F0FDF4',
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid #DCFCE7',
  },
  statusDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#16A34A',
  },
  statusText: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#15803D',
  },
};