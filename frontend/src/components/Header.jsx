import React from 'react';

export default function Header({ title }) {
  return (
    <header style={styles.header}>
      <div>
        <h2 style={styles.title}>{title}</h2>
      </div>

      <div style={styles.userProfile}>
        <div style={styles.avatar}>A</div>
        <div>
          <div style={styles.userName}>FrontlineIQ Admin</div>
          <div style={styles.userRole}>Operations Lead</div>
        </div>
      </div>
    </header>
  );
}

const styles = {
  header: {
    height: '70px',
    backgroundColor: '#FFFFFF',
    borderBottom: '1px solid #E2E8F0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 32px',
    marginLeft: '260px',
    boxSizing: 'border-box',
  },
  title: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#0F172A',
    margin: 0,
  },
  userProfile: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  avatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: '#E0E7FF',
    color: '#4F46E5',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
  },
  userName: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#0F172A',
  },
  userRole: {
    fontSize: '11px',
    color: '#64748B',
    fontWeight: '500',
  },
};