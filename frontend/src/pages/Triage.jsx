import React, { useState } from 'react';

// IMPORTANT:
// Change this if your backend runs somewhere else.
const API_URL = 'http://localhost:5000/api';

export default function Triage() {

  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);


  // ==========================================
  // ANALYZE MESSAGE
  // ==========================================

  const handleAnalyze = async (e) => {

    e.preventDefault();

    if (!inputMessage.trim()) {

      setError(
        'Please enter a customer message to analyze.'
      );

      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const startTime = performance.now();

    try {

      // ========================================
      // CALL EXPRESS API
      // ========================================

      const response = await fetch(
        `${API_URL}/triage`,
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json'
          },

          body: JSON.stringify({
            message: inputMessage.trim()
          })
        }
      );


      // ========================================
      // MEASURE LATENCY
      // ========================================

      const endTime = performance.now();

      const measuredLatency =
        Math.round(endTime - startTime);


      // ========================================
      // CHECK HTTP STATUS
      // ========================================

      if (!response.ok) {

        let errorMessage =
          `Server returned HTTP ${response.status}`;

        try {

          const errorData =
            await response.json();

          if (errorData?.error) {
            errorMessage = errorData.error;
          }

        } catch {

          // Ignore JSON parsing error
        }

        throw new Error(errorMessage);
      }


      // ========================================
      // READ RESPONSE
      // ========================================

      const data = await response.json();

      console.log(
        'FrontlineIQ API Response:',
        data
      );


      // ========================================
      // VALIDATE RESPONSE
      // ========================================

      if (
        !data.success ||
        !data.result
      ) {

        throw new Error(
          data.error ||
          'Invalid response structure received from API.'
        );
      }


      // ========================================
      // EXTRACT RESULT
      // ========================================

      const apiResult = data.result;


      // ========================================
      // NORMALIZE DATA FOR FRONTEND
      // ========================================

      const normalizedResult = {

        ...apiResult,

        // Database ID
        message_id:
          apiResult.message_id || null,

        // Backend latency preferred
        latency:
          apiResult.latency_ms ||
          measuredLatency ||
          0,

        // Token usage
        prompt_tokens:
          apiResult.usage?.input_tokens ||
          0,

        completion_tokens:
          apiResult.usage?.output_tokens ||
          0,

        total_tokens:
          apiResult.usage?.total_tokens ||
          0

      };


      console.log(
        'Normalized Triage Result:',
        normalizedResult
      );


      // ========================================
      // DISPLAY RESULT
      // ========================================

      setResult(normalizedResult);

    }

    catch (err) {

      console.error(
        'Triage Error:',
        err
      );

      setError(
        err.message ||
        'Unable to complete AI triage. Please try again.'
      );

    }

    finally {

      setLoading(false);

    }

  };


  // ==========================================
  // HUMAN REVIEW STATUS
  // ==========================================

  const isHumanRequired =
    result?.needs_human === true;


  // ==========================================
  // RENDER
  // ==========================================

  return (

    <div style={styles.container}>

      {/* ======================================
          INPUT CARD
      ====================================== */}

      <div style={styles.inputCard}>

        <h3 style={styles.cardTitle}>
          Live AI Support Triage Console
        </h3>

        <p style={styles.cardSub}>
          Simulate inbound customer communications
          to evaluate Gemini AI schema validation,
          policy rules, and escalation logic in real time.
        </p>


        <form
          onSubmit={handleAnalyze}
          style={styles.form}
        >

          <div style={styles.inputGroup}>

            <label style={styles.label}>
              Customer Message Input
            </label>

            <textarea
              rows="4"

              placeholder="e.g., I was charged twice for order #84920 and need an immediate refund."

              value={inputMessage}

              onChange={(e) => {

                setInputMessage(
                  e.target.value
                );

                if (error) {
                  setError(null);
                }

              }}

              style={styles.textarea}

              disabled={loading}
            />

          </div>


          {/* ERROR */}

          {error && (

            <div style={styles.errorBox}>
              {error}
            </div>

          )}


          <div style={styles.actionRow}>

            <button
              type="button"

              onClick={() => {

                setInputMessage(
                  'I was charged twice for the same order.'
                );

                setError(null);
                setResult(null);

              }}

              style={styles.presetBtn}

              disabled={loading}
            >
              Paste Test Example
            </button>


            <button
              type="submit"

              style={{
                ...styles.submitBtn,

                backgroundColor:
                  loading
                    ? '#94A3B8'
                    : '#4F46E5',

                cursor:
                  loading
                    ? 'not-allowed'
                    : 'pointer'
              }}

              disabled={loading}
            >

              {loading
                ? '⚡ Running Gemini Triage Policy...'
                : 'Analyze Message →'
              }

            </button>

          </div>

        </form>

      </div>


      {/* ======================================
          RESULT CARD
      ====================================== */}

      {result && (

        <div style={styles.resultCard}>

          {/* HEADER */}

          <div style={styles.resultHeader}>

            <div>

              <span style={styles.resultTag}>

                API Endpoint: POST /api/triage

              </span>

              <h4 style={styles.resultTitle}>
                Structured Triage Result
              </h4>

            </div>


            {isHumanRequired ? (

              <span style={styles.escalationBadge}>
                ⚠ Escalation Flagged
              </span>

            ) : (

              <span style={styles.resolvedBadge}>
                ✓ Automated Resolution
              </span>

            )}

          </div>


          {/* ==================================
              MESSAGE ID
          ================================== */}

          {result.message_id && (

            <div style={styles.messageId}>
              Record ID: <strong>{result.message_id}</strong>
            </div>

          )}


          {/* ==================================
              METRICS
          ================================== */}

          <div style={styles.badgeGrid}>

            <div style={styles.badgeItem}>

              <span style={styles.badgeLabel}>
                Category
              </span>

              <span style={styles.badgeVal}>
                {result.category
                  ?.toUpperCase() ||
                  'UNCLEAR'}
              </span>

            </div>


            <div style={styles.badgeItem}>

              <span style={styles.badgeLabel}>
                Priority Score
              </span>

              <span style={styles.badgeVal}>
                {result.priority ?? 3} / 10
              </span>

            </div>


            <div style={styles.badgeItem}>

              <span style={styles.badgeLabel}>
                Confidence
              </span>

              <span style={styles.badgeVal}>
                {Math.round(
                  (result.confidence ?? 0) * 100
                )}%
              </span>

            </div>


            <div style={styles.badgeItem}>

              <span style={styles.badgeLabel}>
                Human Review
              </span>

              <span
                style={{
                  ...styles.badgeVal,

                  color:
                    isHumanRequired
                      ? '#D97706'
                      : '#16A34A'
                }}
              >

                {isHumanRequired
                  ? 'REQUIRED'
                  : 'NO'
                }

              </span>

            </div>

          </div>


          {/* ==================================
              SUMMARY
          ================================== */}

          <div style={styles.outputSection}>

            <label style={styles.sectionLabel}>
              Executive Summary
            </label>

            <p style={styles.summaryText}>
              {result.summary ||
                'No summary available.'}
            </p>

          </div>


          {/* ==================================
              SUGGESTED ACTION
          ================================== */}

          <div style={styles.outputSection}>

            <label style={styles.sectionLabel}>
              Suggested Action Policy
            </label>

            <div style={styles.actionBox}>
              {result.suggested_action ||
                'No suggested action available.'
              }
            </div>

          </div>


          {/* ==================================
              TELEMETRY
          ================================== */}

          <div style={styles.telemetryBox}>

            <h5 style={styles.telemetryTitle}>
              Processing Performance Telemetry
            </h5>

            <div style={styles.telemetryGrid}>

              <div>
                Latency:
                <strong>
                  {' '}
                  {result.latency || 0} ms
                </strong>
              </div>

              <div>
                Input Tokens:
                <strong>
                  {' '}
                  {result.prompt_tokens || 0}
                </strong>
              </div>

              <div>
                Output Tokens:
                <strong>
                  {' '}
                  {result.completion_tokens || 0}
                </strong>
              </div>

              <div>
                Total Tokens:
                <strong>
                  {' '}
                  {result.total_tokens || 0}
                </strong>
              </div>

            </div>

          </div>

        </div>

      )}

    </div>

  );
}


// ==========================================
// STYLES
// ==========================================

const styles = {

  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },

  inputCard: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: '12px',
    padding: '24px'
  },

  cardTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#0F172A',
    margin: '0 0 4px 0'
  },

  cardSub: {
    fontSize: '13px',
    color: '#64748B',
    margin: '0 0 20px 0',
    fontWeight: '500'
  },

  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },

  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },

  label: {
    fontSize: '12px',
    fontWeight: '700',
    color: '#475569',
    textTransform: 'uppercase'
  },

  textarea: {
    padding: '14px',
    borderRadius: '10px',
    border: '1px solid #CBD5E1',
    fontSize: '14px',
    fontFamily: "'Quicksand', sans-serif",
    color: '#0F172A',
    outline: 'none',
    resize: 'vertical',
    boxSizing: 'border-box',
    width: '100%'
  },

  errorBox: {
    backgroundColor: '#FEE2E2',
    border: '1px solid #FCA5A5',
    color: '#B91C1C',
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600'
  },

  actionRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  presetBtn: {
    backgroundColor: '#F1F5F9',
    border: '1px solid #CBD5E1',
    color: '#475569',
    padding: '8px 14px',
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer'
  },

  submitBtn: {
    color: '#FFFFFF',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '700',
    transition: 'background-color 0.15s ease'
  },

  resultCard: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: '12px',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },

  resultHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #F1F5F9',
    paddingBottom: '16px'
  },

  resultTag: {
    fontSize: '11px',
    fontWeight: '700',
    color: '#64748B'
  },

  resultTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#0F172A',
    margin: '2px 0 0 0'
  },

  messageId: {
    fontSize: '12px',
    color: '#64748B',
    backgroundColor: '#F8FAFC',
    border: '1px solid #E2E8F0',
    padding: '8px 12px',
    borderRadius: '8px'
  },

  escalationBadge: {
    backgroundColor: '#FEF3C7',
    color: '#B45309',
    fontWeight: '700',
    fontSize: '12px',
    padding: '6px 12px',
    borderRadius: '20px',
    border: '1px solid #FDE68A'
  },

  resolvedBadge: {
    backgroundColor: '#DCFCE7',
    color: '#15803D',
    fontWeight: '700',
    fontSize: '12px',
    padding: '6px 12px',
    borderRadius: '20px',
    border: '1px solid #DCFCE7'
  },

  badgeGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '12px'
  },

  badgeItem: {
    backgroundColor: '#F8FAFC',
    border: '1px solid #E2E8F0',
    borderRadius: '8px',
    padding: '10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },

  badgeLabel: {
    fontSize: '10px',
    fontWeight: '700',
    color: '#64748B'
  },

  badgeVal: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#0F172A'
  },

  outputSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },

  sectionLabel: {
    fontSize: '11px',
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase'
  },

  summaryText: {
    fontSize: '14px',
    color: '#334155',
    margin: 0,
    lineHeight: '1.5',
    fontWeight: '500'
  },

  actionBox: {
    backgroundColor: '#EEF2FF',
    border: '1px solid #E0E7FF',
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: '13px',
    color: '#334155',
    lineHeight: '1.5',
    fontWeight: '500'
  },

  telemetryBox: {
    backgroundColor: '#F8FAFC',
    border: '1px solid #E2E8F0',
    borderRadius: '8px',
    padding: '12px 16px'
  },

  telemetryTitle: {
    fontSize: '11px',
    fontWeight: '700',
    color: '#64748B',
    margin: '0 0 8px 0'
  },

  telemetryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '12px',
    fontSize: '12px',
    color: '#475569'
  }

};
