import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import DashboardOverview from './DashboardOverview';
import Triage from './Triage'
import Messages from './Messages';
import HumanReview from './HumanReview';
import Evaluation from './Evaluation';
import Analytics from './Analytics';

const sampleDataset = [
  { 
    id: 'm01', 
    message: "I was charged twice for the same order.", 
    category: "payment", 
    priority: 8, 
    confidence: 0.95, 
    needs_human: true,
    summary: "Customer reports a duplicate charge on their payment account.",
    suggested_action: "Verify payment logs and issue a full refund for the extra charge.",
    latency: 320,
    prompt_tokens: 142,
    completion_tokens: 68
  },
  { 
    id: 'm02', 
    message: "How do I reset my account password?", 
    category: "account", 
    priority: 4, 
    confidence: 0.98, 
    needs_human: false,
    summary: "Customer requesting password recovery instructions.",
    suggested_action: "Send automated password reset link to registered email.",
    latency: 210,
    prompt_tokens: 98,
    completion_tokens: 42
  },
  { 
    id: 'm03', 
    message: "My package has not arrived after 10 days.", 
    category: "order", 
    priority: 7, 
    confidence: 0.88, 
    needs_human: true,
    summary: "Delayed delivery report exceeding standard shipment SLAs.",
    suggested_action: "Escalate to logistics partner and update delivery status.",
    latency: 410,
    prompt_tokens: 180,
    completion_tokens: 75
  },
  { 
    id: 'm04', 
    message: "I want to request a refund for item X.", 
    category: "refund", 
    priority: 6, 
    confidence: 0.91, 
    needs_human: false,
    summary: "Item return and refund request submitted.",
    suggested_action: "Initiate standard 30-day return shipping label generation.",
    latency: 290,
    prompt_tokens: 130,
    completion_tokens: 52
  },
  { 
    id: 'm05', 
    message: "App crashes every time I click checkout.", 
    category: "technical", 
    priority: 9, 
    confidence: 0.85, 
    needs_human: true,
    summary: "Critical checkout crash preventing order completion.",
    suggested_action: "Forward device logs to engineering team for triage.",
    latency: 380,
    prompt_tokens: 165,
    completion_tokens: 84
  },
  { 
    id: 'm06', 
    message: "Can I update my shipping address?", 
    category: "order", 
    priority: 5, 
    confidence: 0.96, 
    needs_human: false,
    summary: "Inbound request for shipping address modification.",
    suggested_action: "Check fulfillment status; update address if unfulfilled.",
    latency: 240,
    prompt_tokens: 110,
    completion_tokens: 45
  }
];

export default function DashboardLayout() {
  const [currentTab, setCurrentTab] = useState('dashboard');

  const getTitle = () => {
    switch (currentTab) {
      case 'dashboard': return 'Dashboard Overview';
      case 'triage': return 'Live Support Triage';
      case 'messages': return 'All Processed Messages';
      case 'human-review': return 'Human Review Queue';
      case 'evaluation': return 'AI System Evaluation';
      case 'analytics': return 'Performance & Analytics';
      default: return 'Dashboard';
    }
  };

  return (
    <div style={styles.appWrapper}>
      <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />

      <div style={styles.mainCanvas}>
        <Header title={getTitle()} />

        <main style={styles.contentArea}>
          {currentTab === 'dashboard' && (
            <DashboardOverview dataset={sampleDataset} />
          )}

          {currentTab === 'triage' && <Triage />}

          {currentTab === 'messages' && (
            <Messages dataset={sampleDataset} />
          )}

          {currentTab === 'human-review' && (
            <HumanReview dataset={sampleDataset} />
          )}
          
          {currentTab === 'evaluation' && 
          <Evaluation dataset={sampleDataset}/>}

          {currentTab === 'analytics' && 
          <Analytics dataset={sampleDataset} />}

          

          {/* Placeholder for remaining views */}
          {currentTab !== 'dashboard' && currentTab !== 'messages' && currentTab !== 'human-review' && currentTab !== 'evaluation' &&
          currentTab !== 'analytics' && 
          (
            <div style={styles.placeholderCard}>
              <div style={styles.placeholderIcon}>🛠</div>
              <h3 style={styles.placeholderTitle}>{getTitle()} Module</h3>
              <p style={styles.placeholderText}>
                This section is ready for step-by-step implementation.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

const styles = {
  appWrapper: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#F8FAFC',
    fontFamily: "'Quicksand', sans-serif",
  },
  mainCanvas: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
  },
  contentArea: {
    marginLeft: '260px',
    padding: '32px',
    boxSizing: 'border-box',
    flex: 1,
  },
  placeholderCard: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: '16px',
    padding: '48px 24px',
    textAlign: 'center',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
  },
  placeholderIcon: {
    fontSize: '32px',
    marginBottom: '12px',
  },
  placeholderTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#0F172A',
    margin: '0 0 8px 0',
  },
  placeholderText: {
    fontSize: '14px',
    color: '#64748B',
    margin: 0,
    fontWeight: '500',
  },
};