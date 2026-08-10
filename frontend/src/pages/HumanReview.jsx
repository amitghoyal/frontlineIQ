import React, { useState } from 'react';
import DecisionModal from '../components/DecisionModal';

export default function HumanReview({ dataset = [] }) {
  const [selectedDecision, setSelectedDecision] = useState(null);

  // Filter ONLY cases requiring human intervention
  const humanQueue = dataset.filter((item) => item.needs_human);

  return (
    <div style={styles.container}>
      {/* Alert Header Box */}
      <div style={styles.alertHeader}>
        <div style={styles.alertIcon}>⚠️</div>
        <div>
          <h3 style={styles.alertTitle}>Human Escalation Queue</h3>
          <p style={styles.alertSub}>
            Cases flagged due to low AI confidence, high priority, or specific triage safety rules.
          </p>
        </div>
        <div style={styles.badgeCount}>
          {humanQueue.length} Pending Review
        </div>
      </div>

      {/* Review Queue Cards */}
      <div style={styles.queueGrid}>
        {humanQueue.length === 0 ? (
          <div style={styles.emptyCard}>
            <span style={{ fontSize: '28px' }}>🎉</span>
            <h4 style={styles.emptyTitle}>Queue Cleared!</h4>
            <p style={styles.emptySub}>No messages currently require human escalation.</p>
          </div>
        ) : (
          humanQueue.map((item) => (
            <div key={item.id} style={styles.caseCard}>
              <div style={styles.cardHeader}>
                <div style={styles.categoryBadge}>{item.category?.toUpperCase() || 'UNCLEAR'}</div>
                <div style={styles.priorityBadge}>Priority {item.priority} / 10</div>
              </div>

              <div style={styles.messageBox}>
                <span style={styles.label}>Customer Message</span>
                <p style={styles.messageText}>"{item.message}"</p>
              </div>

              <div style={styles.reasonBox}>
                <span style={styles.reasonLabel}> Escalation Reason</span>
                <p style={styles.reasonText}>
                  {item.priority >= 8 
                    ? 'High priority operational severity flagged for manual oversight.'
                    : `Confidence score (${Math.round((item.confidence || 0.8) * 100)}%) fell below automatic response threshold.`}
                </p>
              </div>

              <div style={styles.cardFooter}>
                <div style={styles.confidenceText}>
                  Confidence: <strong>{Math.round((item.confidence || 0.8) * 100)}%</strong>
                </div>
                <button 
                  style={styles.reviewBtn}
                  onClick={() => setSelectedDecision(item)}
                >
                  Review Case →
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal View */}
      {selectedDecision && (
        <DecisionModal
          decision={selectedDecision}
          onClose={() => setSelectedDecision(null)}
        />
      )}
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  alertHeader: {
    backgroundColor: '#FEF3C7',
    border: '1px solid #FDE68A',
    borderRadius: '12px',
    padding: '20px 24px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  alertIcon: {
    fontSize: '24px',
  },
  alertTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#92400E',
    margin: '0 0 4px 0',
  },
  alertSub: {
    fontSize: '13px',
    color: '#B45309',
    margin: 0,
    fontWeight: '500',
  },
  badgeCount: {
    marginLeft: 'auto',
    backgroundColor: '#D97706',
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: '12px',
    padding: '6px 14px',
    borderRadius: '20px',
  },
  queueGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
    gap: '20px',
  },
  caseCard: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: '12px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryBadge: {
    backgroundColor: '#F1F5F9',
    color: '#475569',
    fontSize: '11px',
    fontWeight: '700',
    padding: '4px 8px',
    borderRadius: '6px',
  },
  priorityBadge: {
    backgroundColor: '#FEE2E2',
    color: '#B91C1C',
    fontSize: '11px',
    fontWeight: '700',
    padding: '4px 8px',
    borderRadius: '6px',
  },
  messageBox: {
    backgroundColor: '#F8FAFC',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #E2E8F0',
  },
  label: {
    fontSize: '10px',
    fontWeight: '700',
    color: '#94A3B8',
    textTransform: 'uppercase',
  },
  messageText: {
    fontSize: '13px',
    color: '#0F172A',
    fontWeight: '600',
    margin: '4px 0 0 0',
  },
  reasonBox: {
    backgroundColor: '#FFFBEB',
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #FDE68A',
  },
  reasonLabel: {
    fontSize: '11px',
    fontWeight: '700',
    color: '#B45309',
  },
  reasonText: {
    fontSize: '12px',
    color: '#78350F',
    margin: '2px 0 0 0',
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '8px',
    borderTop: '1px solid #F1F5F9',
  },
  confidenceText: {
    fontSize: '12px',
    color: '#64748B',
  },
  reviewBtn: {
    backgroundColor: '#4F46E5',
    color: '#FFFFFF',
    border: 'none',
    padding: '8px 14px',
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: '700',
    cursor: 'pointer',
  },
  emptyCard: {
    gridColumn: '1 / -1',
    backgroundColor: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: '12px',
    padding: '48px',
    textAlign: 'center',
  },
  emptyTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#0F172A',
    margin: '8px 0 4px 0',
  },
  emptySub: {
    fontSize: '13px',
    color: '#64748B',
    margin: 0,
  },
};