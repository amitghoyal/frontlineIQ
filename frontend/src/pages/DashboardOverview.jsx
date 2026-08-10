import React from "react";
import StatCard from "../components/StatCard";

export default function DashboardOverview({ dataset = [] }) {
  // =========================================================
  // BASIC DATA
  // =========================================================

  const totalMessages = dataset.length;

  // =========================================================
  // AI DECISIONS
  // Every successfully processed dataset item has a result.
  // =========================================================

  const aiDecisions = dataset.filter(
    (item) => item.category || item.result?.category
  ).length;

  // =========================================================
  // HUMAN REVIEW
  // =========================================================

  const humanReviewCount = dataset.filter((item) => {
    const result = item.result || item;
    return result.needs_human === true;
  }).length;

  const humanReviewRate =
    totalMessages > 0
      ? Math.round((humanReviewCount / totalMessages) * 100)
      : 0;

  // =========================================================
  // AVERAGE CONFIDENCE
  // =========================================================

  const confidenceValues = dataset
    .map((item) => {
      const result = item.result || item;
      return Number(result.confidence);
    })
    .filter((value) => Number.isFinite(value));

  const avgConfidence =
    confidenceValues.length > 0
      ? Math.round(
          (confidenceValues.reduce((sum, value) => sum + value, 0) /
            confidenceValues.length) *
            100
        )
      : 0;

  // =========================================================
  // CATEGORY ACCURACY
  //
  // Works if evaluation data contains:
  //
  // expected_category
  //
  // OR:
  //
  // expectedCategory
  //
  // OR:
  //
  // expected
  //
  // Otherwise show "N/A" instead of inventing accuracy.
  // =========================================================

  const evaluatedItems = dataset.filter((item) => {
    const expected =
      item.expected_category ??
      item.expectedCategory ??
      item.expected;

    const predicted =
      item.category ??
      item.result?.category;

    return expected !== undefined && predicted !== undefined;
  });

  const correctItems = evaluatedItems.filter((item) => {
    const expected =
      item.expected_category ??
      item.expectedCategory ??
      item.expected;

    const predicted =
      item.category ??
      item.result?.category;

    return expected === predicted;
  }).length;

  const categoryAccuracy =
    evaluatedItems.length > 0
      ? Math.round((correctItems / evaluatedItems.length) * 100)
      : null;

  // =========================================================
  // LATENCY
  //
  // Looks for:
  // latency_ms
  // OR result.latency_ms
  // =========================================================

  const latencyValues = dataset
    .map((item) => {
      return Number(item.latency_ms ?? item.result?.latency_ms);
    })
    .filter((value) => Number.isFinite(value));

  const avgLatency =
    latencyValues.length > 0
      ? Math.round(
          latencyValues.reduce((sum, value) => sum + value, 0) /
            latencyValues.length
        )
      : null;

  // =========================================================
  // CONFIDENCE LEVEL
  // =========================================================

  let confidenceBadge = "No Data";

  if (avgConfidence >= 85) {
    confidenceBadge = "High";
  } else if (avgConfidence >= 60) {
    confidenceBadge = "Medium";
  } else if (avgConfidence > 0) {
    confidenceBadge = "Low";
  }

  // =========================================================
  // RELIABILITY COUNTS
  // =========================================================

  const fallbackCases = dataset.filter((item) => {
    const result = item.result || item;

    return (
      result.confidence === 0 &&
      result.needs_human === true
    );
  }).length;

  const lowConfidenceCases = dataset.filter((item) => {
    const result = item.result || item;

    return (
      typeof result.confidence === "number" &&
      result.confidence < 0.7
    );
  }).length;

  const outOfScopeCases = dataset.filter((item) => {
    const result = item.result || item;

    return result.category === "out_of_scope";
  }).length;

  // =========================================================
  // DISPLAY VALUES
  // =========================================================

  const accuracyDisplay =
    categoryAccuracy !== null
      ? `${categoryAccuracy}%`
      : "N/A";

  const latencyDisplay =
    avgLatency !== null
      ? `${avgLatency} ms`
      : "N/A";

  return (
    <div style={styles.container}>

      {/* =====================================================
          TOP SYSTEM BANNER
      ====================================================== */}

      <div style={styles.banner}>
        <div>
          <h3 style={styles.bannerTitle}>
            FrontlineIQ Operational Command
          </h3>

          <p style={styles.bannerText}>
            Real-time monitoring for AI-powered customer-support
            triage and human escalation.
          </p>
        </div>

        <div style={styles.liveIndicator}>
          <span style={styles.pulseDot}></span>

          {totalMessages > 0
            ? "Live Dataset Mode"
            : "Waiting for Dataset"}
        </div>
      </div>

      {/* =====================================================
          KPI GRID
      ====================================================== */}

      <div style={styles.grid}>

        <StatCard
          title="Messages Processed"
          value={totalMessages}
          subtext="Total inbound requests"
          icon="📩"
        />

        <StatCard
          title="AI Automated Decisions"
          value={aiDecisions}
          subtext={
            totalMessages > 0
              ? `${Math.round(
                  (aiDecisions / totalMessages) * 100
                )}% successfully classified`
              : "No messages processed"
          }
          icon="🤖"
          badge={aiDecisions > 0 ? "Active" : "Idle"}
          badgeType={aiDecisions > 0 ? "success" : "warning"}
        />

        <StatCard
          title="Human Review Queue"
          value={humanReviewCount}
          subtext="Cases requiring human attention"
          icon="⚠️"
          badge={`${humanReviewRate}% Rate`}
          badgeType={
            humanReviewRate > 30
              ? "warning"
              : "success"
          }
        />

        <StatCard
          title="Average Confidence"
          value={`${avgConfidence}%`}
          subtext="Model output certainty"
          icon="🎯"
          badge={confidenceBadge}
          badgeType={
            avgConfidence >= 85
              ? "success"
              : avgConfidence >= 60
              ? "warning"
              : "danger"
          }
        />

        <StatCard
          title="Category Accuracy"
          value={accuracyDisplay}
          subtext={
            evaluatedItems.length > 0
              ? `${correctItems}/${evaluatedItems.length} ground-truth cases correct`
              : "Ground-truth data not available"
          }
          icon="📊"
        />

        <StatCard
          title="Average Latency"
          value={latencyDisplay}
          subtext={
            latencyValues.length > 0
              ? `${latencyValues.length} AI requests measured`
              : "Latency data not available"
          }
          icon="⚡"
        />

      </div>

      {/* =====================================================
          AI RELIABILITY PANEL
      ====================================================== */}

      <div style={styles.reliabilityCard}>

        <div style={styles.reliabilityHeader}>
          <div>
            <h4 style={styles.reliabilityTitle}>
              AI Reliability & Safety Guardrails
            </h4>

            <p style={styles.reliabilityDescription}>
              Runtime checks designed to prevent unsafe or
              overconfident automated decisions.
            </p>
          </div>

          <div style={styles.reliabilityBadge}>
            {totalMessages > 0
              ? "MONITORING"
              : "STANDBY"}
          </div>
        </div>

        <div style={styles.reliabilityGrid}>

          {/* Structured Output */}

          <div style={styles.reliabilityItem}>
            <span style={styles.checkIcon}>✓</span>

            <div>
              <strong>
                Structured Output Validation
              </strong>

              <p style={styles.itemDescription}>
                AI responses are validated against the
                required triage schema before being accepted.
              </p>
            </div>
          </div>

          {/* Prompt Injection */}

          <div style={styles.reliabilityItem}>
            <span style={styles.checkIcon}>✓</span>

            <div>
              <strong>
                Prompt Injection Protection
              </strong>

              <p style={styles.itemDescription}>
                Customer messages are treated as untrusted
                data and cannot override system instructions.
              </p>
            </div>
          </div>

          {/* Human Escalation */}

          <div style={styles.reliabilityItem}>
            <span style={styles.checkIcon}>✓</span>

            <div>
              <strong>
                Human Escalation Policy
              </strong>

              <p style={styles.itemDescription}>
                {humanReviewCount} case
                {humanReviewCount !== 1 ? "s" : ""} currently
                flagged for human review.
              </p>
            </div>
          </div>

          {/* Fallback */}

          <div style={styles.reliabilityItem}>
            <span style={styles.checkIcon}>✓</span>

            <div>
              <strong>
                Graceful AI Fallback
              </strong>

              <p style={styles.itemDescription}>
                {fallbackCases > 0
                  ? `${fallbackCases} fallback case${
                      fallbackCases !== 1 ? "s" : ""
                    } detected.`
                  : "Fallback policy is available when the AI service fails."}
              </p>
            </div>
          </div>

          {/* Evaluation */}

          <div style={styles.reliabilityItem}>
            <span style={styles.checkIcon}>✓</span>

            <div>
              <strong>
                Evaluation Tracking
              </strong>

              <p style={styles.itemDescription}>
                {evaluatedItems.length > 0
                  ? `${evaluatedItems.length} ground-truth case${
                      evaluatedItems.length !== 1 ? "s" : ""
                    } evaluated.`
                  : "No ground-truth evaluation data loaded."}
              </p>
            </div>
          </div>

          {/* Priority */}

          <div style={styles.reliabilityItem}>
            <span style={styles.checkIcon}>✓</span>

            <div>
              <strong>
                Priority Policy Engine
              </strong>

              <p style={styles.itemDescription}>
                Triage priority is constrained to the
                operational 3–10 range.
              </p>
            </div>
          </div>

        </div>

        {/* =================================================
            LIVE SAFETY METRICS
        ================================================== */}

        <div style={styles.safetyMetrics}>

          <div style={styles.safetyMetric}>
            <span style={styles.metricNumber}>
              {lowConfidenceCases}
            </span>

            <span style={styles.metricLabel}>
              Low Confidence
            </span>
          </div>

          <div style={styles.safetyMetric}>
            <span style={styles.metricNumber}>
              {fallbackCases}
            </span>

            <span style={styles.metricLabel}>
              AI Fallbacks
            </span>
          </div>

          <div style={styles.safetyMetric}>
            <span style={styles.metricNumber}>
              {outOfScopeCases}
            </span>

            <span style={styles.metricLabel}>
              Out of Scope
            </span>
          </div>

          <div style={styles.safetyMetric}>
            <span style={styles.metricNumber}>
              {humanReviewRate}%
            </span>

            <span style={styles.metricLabel}>
              Human Escalation
            </span>
          </div>

        </div>

      </div>
    </div>
  );
}


/* ============================================================
   STYLES
============================================================ */

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },

  banner: {
    backgroundColor: "#FFFFFF",
    border: "1px solid #E2E8F0",
    borderRadius: "12px",
    padding: "20px 24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
  },

  bannerTitle: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#0F172A",
    margin: "0 0 4px 0",
  },

  bannerText: {
    fontSize: "13px",
    color: "#64748B",
    margin: 0,
  },

  liveIndicator: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "12px",
    fontWeight: "600",
    color: "#15803D",
    backgroundColor: "#F0FDF4",
    padding: "6px 12px",
    borderRadius: "20px",
    border: "1px solid #DCFCE7",
    whiteSpace: "nowrap",
  },

  pulseDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    backgroundColor: "#16A34A",
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "16px",
  },

  reliabilityCard: {
    backgroundColor: "#FFFFFF",
    border: "1px solid #E2E8F0",
    borderRadius: "12px",
    padding: "24px",
  },

  reliabilityHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "20px",
    marginBottom: "20px",
  },

  reliabilityTitle: {
    fontSize: "15px",
    fontWeight: "700",
    color: "#0F172A",
    margin: "0 0 5px 0",
  },

  reliabilityDescription: {
    fontSize: "12px",
    color: "#64748B",
    margin: 0,
  },

  reliabilityBadge: {
    fontSize: "10px",
    fontWeight: "700",
    color: "#15803D",
    backgroundColor: "#F0FDF4",
    border: "1px solid #DCFCE7",
    borderRadius: "20px",
    padding: "6px 10px",
    letterSpacing: "0.5px",
    whiteSpace: "nowrap",
  },

  reliabilityGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "16px",
  },

  reliabilityItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
    fontSize: "13px",
    color: "#334155",
    lineHeight: "1.4",
  },

  checkIcon: {
    color: "#16A34A",
    fontWeight: "700",
    fontSize: "14px",
    flexShrink: 0,
  },

  itemDescription: {
    fontSize: "11px",
    color: "#64748B",
    margin: "4px 0 0 0",
    lineHeight: "1.5",
  },

  safetyMetrics: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(130px, 1fr))",
    gap: "12px",
    marginTop: "20px",
    paddingTop: "20px",
    borderTop: "1px solid #E2E8F0",
  },

  safetyMetric: {
    backgroundColor: "#F8FAFC",
    border: "1px solid #E2E8F0",
    borderRadius: "10px",
    padding: "14px",
    display: "flex",
    flexDirection: "column",
    gap: "3px",
  },

  metricNumber: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#0F172A",
  },

  metricLabel: {
    fontSize: "10px",
    fontWeight: "600",
    color: "#64748B",
    textTransform: "uppercase",
    letterSpacing: "0.3px",
  },
};