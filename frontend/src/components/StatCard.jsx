import React from 'react';

export default function StatCard({ title, value, subtext, icon, badge, badgeType = 'neutral' }) {
  const getBadgeStyle = () => {
    switch (badgeType) {
      case 'success':
        return { backgroundColor: '#DCFCE7', color: '#15803D' };
      case 'warning':
        return { backgroundColor: '#FEF3C7', color: '#B45309' };
      case 'danger':
        return { backgroundColor: '#FEE2E2', color: '#B91C1C' };
      default:
        return { backgroundColor: '#F1F5F9', color: '#475569' };
    }
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <span style={styles.title}>{title}</span>
        {icon && <span style={styles.icon}>{icon}</span>}
      </div>

      <div style={styles.valueRow}>
        <span style={styles.value}>{value}</span>
        {badge && (
          <span style={{ ...styles.badge, ...getBadgeStyle() }}>
            {badge}
          </span>
        )}
      </div>

      {subtext && <div style={styles.subtext}>{subtext}</div>}
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: '12px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  title: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#64748B',
    letterSpacing: '0.2px',
  },
  icon: {
    fontSize: '18px',
  },
  valueRow: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '10px',
  },
  value: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: '1.1',
  },
  badge: {
    fontSize: '11px',
    fontWeight: '700',
    padding: '3px 8px',
    borderRadius: '12px',
  },
  subtext: {
    fontSize: '12px',
    color: '#94A3B8',
    marginTop: '8px',
    fontWeight: '500',
  },
};