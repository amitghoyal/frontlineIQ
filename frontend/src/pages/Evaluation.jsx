import React from 'react';

export default function Evaluation() {
  // Ground truth evaluation dataset based on 10 hand-labeled benchmark messages
  const evaluationData = {
    totalEvaluated: 10,
    correctCount: 8,
    incorrectCount: 2,
    categoryAccuracy: 80,
    failures: [
      {
        id: 'm03',
        message: 'My package has not arrived after 10 days.',
        expectedCategory: 'order',
        predictedCategory: 'unclear',
        reason: 'Low classifier confidence triggered fallback category.'
      },
      {
        id: 'm08',
        message: 'Can I get my money back for this accidental purchase?',
        expectedCategory: 'refund',
        predictedCategory: 'unclear',
        reason: 'Ambiguous phrase overlapped with general inquiry policy rules.'
      }
    ],
    groundTruthList: [
      { id: 'm01', message: 'I was charged twice for the same order.', expected: 'payment', predicted: 'payment', match: true },
      { id: 'm02', message: 'How do I reset my account password?', expected: 'account', predicted: 'account', match: true },
      { id: 'm03', message: 'My package has not arrived after 10 days.', expected: 'order', predicted: 'unclear', match: false },
      { id: 'm04', message: 'I want to request a refund for item X.', expected: 'refund', predicted: 'refund', match: true },
      { id: 'm05', message: 'App crashes every time I click checkout.', expected: 'technical', predicted: 'technical', match: true },
      { id: 'm06', message: 'Can I update my shipping address?', expected: 'order', predicted: 'order', match: true },
      { id: 'm07', message: 'Where can I find my invoice history?', expected: 'account', predicted: 'account', match: true },
      { id: 'm08', message: 'Can I get my money back for this accidental purchase?', expected: 'refund', predicted: 'unclear', match: false },
      { id: 'm09', message: 'Is my credit card information secure on this app?', expected: 'payment', predicted: 'payment', match: true },
      { id: 'm10', message: 'I received a damaged product in the mail.', expected: 'order', predicted: 'order', match: true }
    ]
  };

  return (
    <div style={styles.container}>
      {/* Top Banner Overview */}
      <div style={styles.banner}>
        <div>
          <h3 style={styles.bannerTitle}>Ground-Truth Benchmark Evaluation</h3>
          <p style={styles.bannerSub}>
            Performance validation across 10 hand-labeled test cases measuring model fidelity.
          </p>
        </div>
        <div style={styles.accuracyBadge}>
          {evaluationData.categoryAccuracy}% Category Accuracy
        </div>
      </div>

      {/* Accuracy Metric Cards */}
      <div style={styles.kpiGrid}>
        <div style={styles.kpiCard}>
          <span style={styles.kpiLabel}>Messages Evaluated</span>
          <span style={styles.kpiValue}>{evaluationData.totalEvaluated}</span>
        </div>
        <div style={styles.kpiCard}>
          <span style={styles.kpiLabel}>Correct Classification</span>
          <span style={{ ...styles.kpiValue, color: '#16A34A' }}>{evaluationData.correctCount}</span>
        </div>
        <div style={styles.kpiCard}>
          <span style={styles.kpiLabel}>Failure Cases</span>
          <span style={{ ...styles.kpiValue, color: '#DC2626' }}>{evaluationData.incorrectCount}</span>
        </div>
      </div>

      {/* Failure Cases Breakdown Section */}
      <div style={styles.sectionCard}>
        <h4 style={styles.sectionTitle}>Failure Cases Analysis</h4>
        <div style={styles.failureGrid}>
          {evaluationData.failures.map((item) => (
            <div key={item.id} style={styles.failureCard}>
              <div style={styles.failureHeader}>
                <span style={styles.failureId}>ID: {item.id}</span>
                <span style={styles.mismatchTag}>Mismatch</span>
              </div>
              <p style={styles.failureMessage}>"{item.message}"</p>
              <div style={styles.comparisonBox}>
                <div>
                  <span style={styles.compLabel}>Expected Category:</span>
                  <span style={styles.expectedText}>{item.expectedCategory}</span>
                </div>
                <div>
                  <span style={styles.compLabel}>Predicted Category:</span>
                  <span style={styles.predictedText}>{item.predictedCategory}</span>
                </div>
              </div>
              <div style={styles.reasonText}>
                <strong>Root Cause:</strong> {item.reason}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Complete Ground Truth Benchmark Table */}
      <div style={styles.sectionCard}>
        <h4 style={styles.sectionTitle}>Detailed Benchmark Log (10 Test Cases)</h4>
        <table style={styles.table}>
          <thead>
            <tr style={styles.trHeader}>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Customer Message</th>
              <th style={styles.th}>Ground Truth (Expected)</th>
              <th style={styles.th}>AI Prediction</th>
              <th style={styles.th}>Match Status</th>
            </tr>
          </thead>
          <tbody>
            {evaluationData.groundTruthList.map((row) => (
              <tr key={row.id} style={styles.trBody}>
                <td style={styles.tdId}>{row.id}</td>
                <td style={styles.tdMsg}>{row.message}</td>
                <td style={styles.td}>{row.expected}</td>
                <td style={styles.td}>{row.predicted}</td>
                <td style={styles.td}>
                  {row.match ? (
                    <span style={styles.matchPass}>✓ Pass</span>
                  ) : (
                    <span style={styles.matchFail}>✕ Fail</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  banner: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: '12px',
    padding: '20px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bannerTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#0F172A',
    margin: '0 0 4px 0',
  },
  bannerSub: {
    fontSize: '13px',
    color: '#64748B',
    margin: 0,
  },
  accuracyBadge: {
    backgroundColor: '#EEF2FF',
    color: '#4F46E5',
    fontWeight: '700',
    fontSize: '13px',
    padding: '8px 16px',
    borderRadius: '20px',
    border: '1px solid #E0E7FF',
  },
  kpiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
  },
  kpiCard: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: '12px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  kpiLabel: {
    fontSize: '12px',
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
  },
  kpiValue: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#0F172A',
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: '12px',
    padding: '24px',
  },
  sectionTitle: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#0F172A',
    margin: '0 0 16px 0',
  },
  failureGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '16px',
  },
  failureCard: {
    backgroundColor: '#FEF2F2',
    border: '1px solid #FECACA',
    borderRadius: '10px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  failureHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  failureId: {
    fontSize: '12px',
    fontWeight: '700',
    color: '#991B1B',
  },
  mismatchTag: {
    backgroundColor: '#DC2626',
    color: '#FFFFFF',
    fontSize: '10px',
    fontWeight: '700',
    padding: '2px 8px',
    borderRadius: '4px',
  },
  failureMessage: {
    fontSize: '13px',
    color: '#7F1D1D',
    fontWeight: '600',
    margin: 0,
  },
  comparisonBox: {
    backgroundColor: '#FFFFFF',
    padding: '10px',
    borderRadius: '6px',
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '12px',
  },
  compLabel: {
    color: '#64748B',
    marginRight: '6px',
  },
  expectedText: {
    fontWeight: '700',
    color: '#16A34A',
  },
  predictedText: {
    fontWeight: '700',
    color: '#DC2626',
  },
  reasonText: {
    fontSize: '12px',
    color: '#991B1B',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
    fontSize: '13px',
  },
  trHeader: {
    backgroundColor: '#F8FAFC',
    borderBottom: '1px solid #E2E8F0',
  },
  th: {
    padding: '12px 16px',
    color: '#64748B',
    fontWeight: '700',
    fontSize: '12px',
  },
  trBody: {
    borderBottom: '1px solid #F1F5F9',
  },
  tdId: {
    padding: '12px 16px',
    fontWeight: '700',
    color: '#64748B',
  },
  tdMsg: {
    padding: '12px 16px',
    color: '#0F172A',
    fontWeight: '500',
  },
  td: {
    padding: '12px 16px',
    color: '#334155',
  },
  matchPass: {
    backgroundColor: '#DCFCE7',
    color: '#15803D',
    padding: '4px 8px',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: '700',
  },
  matchFail: {
    backgroundColor: '#FEE2E2',
    color: '#B91C1C',
    padding: '4px 8px',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: '700',
  },
};