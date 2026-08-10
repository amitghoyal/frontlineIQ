import React from 'react';

export default function DecisionModal({ decision, onClose }) {
  if (!decision) return null;

  const isHumanRequired = decision.needs_human;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div style={styles.header}>
          <div>
            <span style={styles.modalSub}>Message ID: {decision.id || 'm-raw'}</span>
            <h3 style={styles.title}>AI Decision Breakdown</h3>
          </div>
          <button style={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div style={styles.body}>
          {/* Escalation Warning Banner */}
          {isHumanRequired && (
            <div style={styles.warningBanner}>
              <span style={{ fontSize: '18px' }}>⚠</span>
              <div>
                <strong>HUMAN REVIEW REQUIRED</strong>
                <p style={styles.warningText}>
                  This case fell below confidence thresholds or matched high-risk escalation policy rules.
                </p>
              </div>
            </div>
          )}

          {/* Raw Customer Input */}
          <div style={styles.section}>
            <label style={styles.label}>Customer Message</label>
            <div style={styles.messageBox}>{decision.message}</div>
          </div>

          {/* Key Metric Badges */}
          <div style={styles.badgeGrid}>
            <div style={styles.badgeCard}>
              <span style={styles.badgeLabel}>Category</span>
              <span style={styles.badgeValue}>{decision.category?.toUpperCase() || 'UNCLEAR'}</span>
            </div>
            <div style={styles.badgeCard}>
              <span style={styles.badgeLabel}>Priority Score</span>
              <span style={styles.badgeValue}>{decision.priority || 5} / 10</span>
            </div>
            <div style={styles.badgeCard}>
              <span style={styles.badgeLabel}>Confidence</span>
              <span style={styles.badgeValue}>{Math.round((decision.confidence || 0.9) * 100)}%</span>
            </div>
            <div style={styles.badgeCard}>
              <span style={styles.badgeLabel}>Human Escalation</span>
              <span style={{ 
                ...styles.badgeValue, 
                color: isHumanRequired ? '#D97706' : '#16A34A' 
              }}>
                {isHumanRequired ? 'REQUIRED' : 'NO'}
              </span>
            </div>
          </div>

          {/* AI Analysis Outputs */}
          <div style={styles.section}>
            <label style={styles.label}>Executive Summary</label>
            <p style={styles.summaryText}>{decision.summary || 'Summary unavailable.'}</p>
          </div>

          <div style={styles.section}>
            <label style={styles.label}>Suggested Action</label>
            <p style={styles.actionText}>{decision.suggested_action || 'No suggested action provided.'}</p>
          </div>

          {/* Telemetry / Technical Metrics */}
          <div style={styles.telemetryBox}>
            <h5 style={styles.telemetryTitle}>System Performance & Telemetry</h5>
            <div style={styles.telemetryGrid}>
              <div><span>Latency:</span> <strong>{decision.latency || 320} ms</strong></div>
              <div><span>Input Tokens:</span> <strong>{decision.prompt_tokens || 142}</strong></div>
              <div><span>Output Tokens:</span> <strong>{decision.completion_tokens || 68}</strong></div>
              <div><span>Total Tokens:</span> <strong>{(decision.prompt_tokens || 142) + (decision.completion_tokens || 68)}</strong></div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div style={styles.footer}>
          <button style={styles.secondaryBtn} onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    backdropFilter: 'blur(2px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    width: '90%',
    maxWidth: '650px',
    maxHeight: '90vh',
    overflowY: 'auto',
    border: '1px solid #E2E8F0',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  },
  header: {
    padding: '20px 24px',
    borderBottom: '1px solid #E2E8F0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalSub: {
    fontSize: '12px',
    color: '#64748B',
    fontWeight: '600',
  },
  title: {
    margin: '2px 0 0 0',
    fontSize: '18px',
    fontWeight: '700',
    color: '#0F172A',
  },
  closeBtn: {
    border: 'none',
    background: 'none',
    fontSize: '18px',
    color: '#64748B',
    cursor: 'pointer',
  },
  body: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  warningBanner: {
    backgroundColor: '#FEF3C7',
    border: '1px solid #FDE68A',
    color: '#92400E',
    padding: '12px 16px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '13px',
  },
  warningText: {
    margin: '2px 0 0 0',
    fontSize: '12px',
    color: '#B45309',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '12px',
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  messageBox: {
    backgroundColor: '#F8FAFC',
    border: '1px solid #E2E8F0',
    borderRadius: '10px',
    padding: '12px 16px',
    fontSize: '14px',
    color: '#0F172A',
    fontWeight: '500',
  },
  badgeGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '12px',
  },
  badgeCard: {
    backgroundColor: '#F8FAFC',
    border: '1px solid #E2E8F0',
    padding: '10px',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  badgeLabel: {
    fontSize: '10px',
    color: '#64748B',
    fontWeight: '700',
  },
  badgeValue: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#0F172A',
  },
  summaryText: {
    fontSize: '14px',
    color: '#334155',
    margin: 0,
    lineHeight: '1.5',
  },
  actionText: {
    fontSize: '14px',
    color: '#334155',
    margin: 0,
    backgroundColor: '#EEF2FF',
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid #E0E7FF',
    lineHeight: '1.5',
  },
  telemetryBox: {
    backgroundColor: '#F8FAFC',
    border: '1px solid #E2E8F0',
    borderRadius: '10px',
    padding: '14px 16px',
  },
  telemetryTitle: {
    margin: '0 0 10px 0',
    fontSize: '12px',
    fontWeight: '700',
    color: '#475569',
  },
  telemetryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '8px',
    fontSize: '12px',
    color: '#64748B',
  },
  footer: {
    padding: '16px 24px',
    borderTop: '1px solid #E2E8F0',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  secondaryBtn: {
    padding: '8px 18px',
    borderRadius: '8px',
    border: '1px solid #CBD5E1',
    backgroundColor: '#FFFFFF',
    color: '#334155',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '13px',
  },
};