import React from "react";

export default function Analytics({ dataset = [] }) {
    // Aggregate category volumes dynamically
    const categoryCounts = dataset.reduce((acc, item) => {
        const cat = item.category || "unclear";
        acc[cat] = (acc[cat] || 0) + 1;
        return acc;
    }, {});

    const total = dataset.length || 1;

    // Aggregate priority tiers
    const highPriority = dataset.filter(
        (i) => i.priority >= 8
    ).length;

    const medPriority = dataset.filter(
        (i) => i.priority >= 5 && i.priority < 8
    ).length;

    const lowPriority = dataset.filter(
        (i) => i.priority < 5
    ).length;

    // Human escalation
    const humanReviewCount = dataset.filter(
        (i) => i.needs_human
    ).length;

    const humanEscalationRate = Math.round(
        (humanReviewCount / total) * 100
    );

    // Average confidence
    const averageConfidence =
        dataset.length > 0
            ? dataset.reduce(
                  (sum, item) =>
                      sum + (Number(item.confidence) || 0),
                  0
              ) / dataset.length
            : 0;

    const averageConfidencePercentage =
        Math.round(averageConfidence * 100);

    // Average latency if available
    const latencyValues = dataset
        .map((item) => Number(item.latency_ms))
        .filter((value) => !Number.isNaN(value) && value > 0);

    const averageLatency =
        latencyValues.length > 0
            ? Math.round(
                  latencyValues.reduce(
                      (sum, value) => sum + value,
                      0
                  ) / latencyValues.length
              )
            : 0;

    const categories = [
        {
            label: "Payment",
            key: "payment",
            color: "#4F46E5",
        },
        {
            label: "Order / Shipping",
            key: "order",
            color: "#3B82F6",
        },
        {
            label: "Account",
            key: "account",
            color: "#0EA5E9",
        },
        {
            label: "Refund",
            key: "refund",
            color: "#8B5CF6",
        },
        {
            label: "Technical",
            key: "technical",
            color: "#EC4899",
        },
        {
            label: "General",
            key: "general",
            color: "#14B8A6",
        },
        {
            label: "Unclear",
            key: "unclear",
            color: "#64748B",
        },
        {
            label: "Out of Scope",
            key: "out_of_scope",
            color: "#F97316",
        },
    ];

    return (
        <div style={styles.container}>

            {/* Page Header */}
            <div>
                <h2 style={styles.pageTitle}>
                    Analytics
                </h2>

                <p style={styles.pageSubtitle}>
                    Monitor FrontlineIQ AI triage performance,
                    reliability, and workload distribution.
                </p>
            </div>

            {/* Top Telemetry Summary Grid */}
            <div style={styles.kpiGrid}>

                <div style={styles.kpiCard}>
                    <span style={styles.kpiLabel}>
                        Human Escalation Rate
                    </span>

                    <span style={styles.kpiValue}>
                        {humanEscalationRate}%
                    </span>

                    <span style={styles.kpiSub}>
                        {humanReviewCount} cases routed to human review
                    </span>
                </div>

                <div style={styles.kpiCard}>
                    <span style={styles.kpiLabel}>
                        Average Model Confidence
                    </span>

                    <span style={styles.kpiValue}>
                        {averageConfidencePercentage}%
                    </span>

                    <span style={styles.kpiSub}>
                        Based on processed AI decisions
                    </span>
                </div>

                <div style={styles.kpiCard}>
                    <span style={styles.kpiLabel}>
                        Mean Response Latency
                    </span>

                    <span style={styles.kpiValue}>
                        {averageLatency > 0
                            ? `${averageLatency} ms`
                            : "N/A"}
                    </span>

                    <span style={styles.kpiSub}>
                        Average AI processing time
                    </span>
                </div>

            </div>

            {/* Dataset Summary */}
            <div style={styles.summaryCard}>

                <div>
                    <span style={styles.summaryLabel}>
                        Messages Processed
                    </span>

                    <strong style={styles.summaryValue}>
                        {dataset.length}
                    </strong>
                </div>

                <div>
                    <span style={styles.summaryLabel}>
                        High Priority
                    </span>

                    <strong style={styles.summaryValue}>
                        {highPriority}
                    </strong>
                </div>

                <div>
                    <span style={styles.summaryLabel}>
                        Medium Priority
                    </span>

                    <strong style={styles.summaryValue}>
                        {medPriority}
                    </strong>
                </div>

                <div>
                    <span style={styles.summaryLabel}>
                        Low Priority
                    </span>

                    <strong style={styles.summaryValue}>
                        {lowPriority}
                    </strong>
                </div>

            </div>

            {/* Visual Analytics Grid */}
            <div style={styles.chartsGrid}>

                {/* Category Breakdown */}
                <div style={styles.chartCard}>

                    <h4 style={styles.chartTitle}>
                        Category Volume Distribution
                    </h4>

                    <div style={styles.barList}>

                        {categories.map((cat) => {

                            const count =
                                categoryCounts[cat.key] || 0;

                            const percentage =
                                dataset.length > 0
                                    ? Math.round(
                                          (count /
                                              dataset.length) *
                                              100
                                      )
                                    : 0;

                            return (
                                <div
                                    key={cat.key}
                                    style={styles.barRow}
                                >

                                    <div
                                        style={
                                            styles.barMeta
                                        }
                                    >

                                        <span
                                            style={
                                                styles.barLabel
                                            }
                                        >
                                            {cat.label}
                                        </span>

                                        <span
                                            style={
                                                styles.barValue
                                            }
                                        >
                                            {count} ({percentage}%)
                                        </span>

                                    </div>

                                    <div
                                        style={styles.track}
                                    >

                                        <div
                                            style={{
                                                ...styles.fill,
                                                width:
                                                    count > 0
                                                        ? `${Math.max(
                                                              percentage,
                                                              8
                                                          )}%`
                                                        : "0%",
                                                backgroundColor:
                                                    cat.color,
                                            }}
                                        />

                                    </div>

                                </div>
                            );
                        })}

                    </div>
                </div>

                {/* Priority Severity Breakdown */}
                <div style={styles.chartCard}>

                    <h4 style={styles.chartTitle}>
                        Priority Distribution Breakdown
                    </h4>

                    <div style={styles.priorityList}>

                        {/* High */}
                        <div
                            style={styles.priorityCard}
                        >

                            <div
                                style={
                                    styles.priorityHeader
                                }
                            >

                                <span
                                    style={{
                                        ...styles.dot,
                                        backgroundColor:
                                            "#DC2626",
                                    }}
                                />

                                <strong
                                    style={
                                        styles.priorityLabel
                                    }
                                >
                                    High Priority (8 - 10)
                                </strong>

                            </div>

                            <span
                                style={
                                    styles.priorityCount
                                }
                            >
                                {highPriority} cases
                            </span>

                            <p
                                style={
                                    styles.prioritySub
                                }
                            >
                                Immediate triage and
                                potential human review.
                            </p>

                        </div>

                        {/* Medium */}
                        <div
                            style={styles.priorityCard}
                        >

                            <div
                                style={
                                    styles.priorityHeader
                                }
                            >

                                <span
                                    style={{
                                        ...styles.dot,
                                        backgroundColor:
                                            "#D97706",
                                    }}
                                />

                                <strong
                                    style={
                                        styles.priorityLabel
                                    }
                                >
                                    Medium Priority (5 - 7)
                                </strong>

                            </div>

                            <span
                                style={
                                    styles.priorityCount
                                }
                            >
                                {medPriority} cases
                            </span>

                            <p
                                style={
                                    styles.prioritySub
                                }
                            >
                                Standard processing
                                priority queue.
                            </p>

                        </div>

                        {/* Low */}
                        <div
                            style={styles.priorityCard}
                        >

                            <div
                                style={
                                    styles.priorityHeader
                                }
                            >

                                <span
                                    style={{
                                        ...styles.dot,
                                        backgroundColor:
                                            "#16A34A",
                                    }}
                                />

                                <strong
                                    style={
                                        styles.priorityLabel
                                    }
                                >
                                    Low Priority (3 - 4)
                                </strong>

                            </div>

                            <span
                                style={
                                    styles.priorityCount
                                }
                            >
                                {lowPriority} cases
                            </span>

                            <p
                                style={
                                    styles.prioritySub
                                }
                            >
                                Lower urgency support
                                requests.
                            </p>

                        </div>

                    </div>
                </div>

            </div>

        </div>
    );
}

const styles = {

    container: {
        display: "flex",
        flexDirection: "column",
        gap: "24px",
    },

    pageTitle: {
        margin: 0,
        fontSize: "28px",
        fontWeight: "700",
        color: "#0F172A",
    },

    pageSubtitle: {
        marginTop: "6px",
        marginBottom: 0,
        fontSize: "14px",
        color: "#64748B",
    },

    kpiGrid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "16px",
    },

    kpiCard: {
        backgroundColor: "#FFFFFF",
        border: "1px solid #E2E8F0",
        borderRadius: "12px",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "6px",
    },

    kpiLabel: {
        fontSize: "12px",
        fontWeight: "700",
        color: "#64748B",
        textTransform: "uppercase",
    },

    kpiValue: {
        fontSize: "28px",
        fontWeight: "700",
        color: "#0F172A",
    },

    kpiSub: {
        fontSize: "12px",
        color: "#94A3B8",
        fontWeight: "500",
    },

    summaryCard: {
        backgroundColor: "#FFFFFF",
        border: "1px solid #E2E8F0",
        borderRadius: "12px",
        padding: "20px",
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fit, minmax(150px, 1fr))",
        gap: "20px",
    },

    summaryLabel: {
        display: "block",
        fontSize: "12px",
        color: "#64748B",
        marginBottom: "6px",
    },

    summaryValue: {
        fontSize: "22px",
        color: "#0F172A",
    },

    chartsGrid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fit, minmax(360px, 1fr))",
        gap: "20px",
    },

    chartCard: {
        backgroundColor: "#FFFFFF",
        border: "1px solid #E2E8F0",
        borderRadius: "12px",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
    },

    chartTitle: {
        fontSize: "15px",
        fontWeight: "700",
        color: "#0F172A",
        margin: 0,
    },

    barList: {
        display: "flex",
        flexDirection: "column",
        gap: "16px",
    },

    barRow: {
        display: "flex",
        flexDirection: "column",
        gap: "6px",
    },

    barMeta: {
        display: "flex",
        justifyContent: "space-between",
        fontSize: "13px",
        fontWeight: "600",
        color: "#334155",
    },

    barLabel: {
        color: "#0F172A",
    },

    barValue: {
        color: "#64748B",
    },

    track: {
        height: "10px",
        backgroundColor: "#F1F5F9",
        borderRadius: "6px",
        overflow: "hidden",
    },

    fill: {
        height: "100%",
        borderRadius: "6px",
        transition: "width 0.4s ease-in-out",
    },

    priorityList: {
        display: "flex",
        flexDirection: "column",
        gap: "12px",
    },

    priorityCard: {
        backgroundColor: "#F8FAFC",
        border: "1px solid #E2E8F0",
        borderRadius: "10px",
        padding: "14px 16px",
        display: "flex",
        flexDirection: "column",
        gap: "4px",
    },

    priorityHeader: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
    },

    dot: {
        width: "8px",
        height: "8px",
        borderRadius: "50%",
    },

    priorityLabel: {
        fontSize: "13px",
        color: "#0F172A",
    },

    priorityCount: {
        fontSize: "14px",
        fontWeight: "700",
        color: "#4F46E5",
        marginLeft: "16px",
    },

    prioritySub: {
        fontSize: "11px",
        color: "#64748B",
        margin: "2px 0 0 16px",
    },
};
