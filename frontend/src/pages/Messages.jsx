
import React, { useEffect, useState } from "react";
import DecisionModal from "../components/DecisionModal";

export default function Messages() {
    const [dataset, setDataset] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("ALL");
    const [humanFilter, setHumanFilter] = useState("ALL");
    const [selectedDecision, setSelectedDecision] = useState(null);

    const fetchMessages = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                "http://localhost:5000/api/triage"
            );

            if (!response.ok) {
                throw new Error("Failed to fetch messages");
            }

            const data = await response.json();

            /*
                Expected backend response:

                {
                    success: true,
                    count: 40,
                    messages: [...]
                }

                OR:

                {
                    result: [...]
                }
            */

            const messages =
                data.messages ||
                data.results ||
                data.result ||
                [];

            setDataset(messages);

        } catch (err) {
            console.error("Failed to load messages:", err);

            setError(
                "Unable to load messages from the server."
            );

        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // LOAD DATA WHEN PAGE OPENS
    // ==========================================

    useEffect(() => {
        fetchMessages();
    }, []);

    // ==========================================
    // FILTER DATA
    // ==========================================

    const filteredData = dataset.filter((item) => {

        const messageText =
            item.message ||
            item.text ||
            "";

        const matchesSearch =
            messageText
                .toLowerCase()
                .includes(search.toLowerCase());

        const matchesCategory =
            categoryFilter === "ALL" ||
            item.category === categoryFilter;

        const matchesHuman =
            humanFilter === "ALL" ||
            (humanFilter === "YES" &&
                item.needs_human === true) ||
            (humanFilter === "NO" &&
                item.needs_human === false);

        return (
            matchesSearch &&
            matchesCategory &&
            matchesHuman
        );
    });

    // ==========================================
    // LOADING STATE
    // ==========================================

    if (loading) {
        return (
            <div style={styles.stateContainer}>
                <div style={styles.loadingIcon}>
                    ⏳
                </div>

                <h3 style={styles.stateTitle}>
                    Loading messages...
                </h3>

                <p style={styles.stateText}>
                    Fetching customer messages from MongoDB.
                </p>
            </div>
        );
    }

    // ==========================================
    // ERROR STATE
    // ==========================================

    if (error) {
        return (
            <div style={styles.stateContainer}>

                <div style={styles.errorIcon}>
                    ⚠️
                </div>

                <h3 style={styles.stateTitle}>
                    Unable to load messages
                </h3>

                <p style={styles.stateText}>
                    {error}
                </p>

                <button
                    onClick={fetchMessages}
                    style={styles.retryButton}
                >
                    Retry
                </button>

            </div>
        );
    }

    return (
        <div style={styles.container}>

            {/* =====================================
                HEADER
            ====================================== */}

            <div style={styles.pageHeader}>

                <div>
                    <h2 style={styles.pageTitle}>
                        All Processed Messages
                    </h2>

                    <p style={styles.pageSubtitle}>
                        Customer support messages processed
                        by FrontlineIQ.
                    </p>
                </div>

                <div style={styles.messageCount}>
                    {dataset.length} Messages
                </div>

            </div>

            {/* =====================================
                FILTER BAR
            ====================================== */}

            <div style={styles.controlBar}>

                <input
                    type="text"
                    placeholder="🔍 Search customer messages..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                    style={styles.searchInput}
                />

                <select
                    value={categoryFilter}
                    onChange={(e) =>
                        setCategoryFilter(e.target.value)
                    }
                    style={styles.selectInput}
                >

                    <option value="ALL">
                        All Categories
                    </option>

                    <option value="payment">
                        Payment
                    </option>

                    <option value="account">
                        Account
                    </option>

                    <option value="order">
                        Order
                    </option>

                    <option value="refund">
                        Refund
                    </option>

                    <option value="technical">
                        Technical
                    </option>

                    <option value="general">
                        General
                    </option>

                    <option value="unclear">
                        Unclear
                    </option>

                    <option value="out_of_scope">
                        Out of Scope
                    </option>

                </select>

                <select
                    value={humanFilter}
                    onChange={(e) =>
                        setHumanFilter(e.target.value)
                    }
                    style={styles.selectInput}
                >

                    <option value="ALL">
                        All Escalation Statuses
                    </option>

                    <option value="YES">
                        Human Review Required
                    </option>

                    <option value="NO">
                        Automated Resolved
                    </option>

                </select>

                <button
                    onClick={fetchMessages}
                    style={styles.refreshButton}
                >
                    ↻ Refresh
                </button>

            </div>

            {/* =====================================
                RESULTS COUNT
            ====================================== */}

            <div style={styles.resultsInfo}>
                Showing{" "}
                <strong>
                    {filteredData.length}
                </strong>{" "}
                of{" "}
                <strong>
                    {dataset.length}
                </strong>{" "}
                messages
            </div>

            {/* =====================================
                TABLE
            ====================================== */}

            <div style={styles.tableCard}>

                <table style={styles.table}>

                    <thead>

                        <tr style={styles.trHeader}>

                            <th style={styles.th}>
                                Customer Message
                            </th>

                            <th style={styles.th}>
                                Category
                            </th>

                            <th style={styles.th}>
                                Priority
                            </th>

                            <th style={styles.th}>
                                Confidence
                            </th>

                            <th style={styles.th}>
                                Human Review
                            </th>

                            <th style={styles.th}>
                                Action
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {filteredData.length === 0 ? (

                            <tr>

                                <td
                                    colSpan="6"
                                    style={styles.emptyTd}
                                >
                                    No customer messages
                                    matched your filters.
                                </td>

                            </tr>

                        ) : (

                            filteredData.map(
                                (row, index) => {

                                    const messageText =
                                        row.message ||
                                        row.text ||
                                        "No message";

                                    const confidence =
                                        Number(
                                            row.confidence
                                        ) || 0;

                                    return (

                                        <tr
                                            key={
                                                row.message_id ||
                                                row._id ||
                                                row.id ||
                                                index
                                            }
                                            style={styles.trBody}
                                            onClick={() =>
                                                setSelectedDecision(
                                                    row
                                                )
                                            }
                                        >

                                            {/* MESSAGE */}

                                            <td
                                                style={
                                                    styles.tdMessage
                                                }
                                                title={
                                                    messageText
                                                }
                                            >
                                                {messageText}
                                            </td>

                                            {/* CATEGORY */}

                                            <td
                                                style={
                                                    styles.td
                                                }
                                            >

                                                <span
                                                    style={
                                                        styles.categoryTag
                                                    }
                                                >
                                                    {
                                                        row.category ||
                                                        "unclear"
                                                    }
                                                </span>

                                            </td>

                                            {/* PRIORITY */}

                                            <td
                                                style={
                                                    styles.td
                                                }
                                            >

                                                <span
                                                    style={{
                                                        ...styles.priorityBadge,

                                                        backgroundColor:
                                                            row.priority >=
                                                            8
                                                                ? "#FEE2E2"
                                                                : row.priority >=
                                                                  5
                                                                ? "#FEF3C7"
                                                                : "#DCFCE7",

                                                        color:
                                                            row.priority >=
                                                            8
                                                                ? "#B91C1C"
                                                                : row.priority >=
                                                                  5
                                                                ? "#B45309"
                                                                : "#15803D",
                                                    }}
                                                >
                                                    {row.priority ||
                                                        3}{" "}
                                                    / 10
                                                </span>

                                            </td>

                                            {/* CONFIDENCE */}

                                            <td
                                                style={
                                                    styles.td
                                                }
                                            >

                                                {Math.round(
                                                    confidence *
                                                        100
                                                )}
                                                %

                                            </td>

                                            {/* HUMAN REVIEW */}

                                            <td
                                                style={
                                                    styles.td
                                                }
                                            >

                                                {row.needs_human ? (

                                                    <span
                                                        style={
                                                            styles.humanYes
                                                        }
                                                    >
                                                        ⚠ Required
                                                    </span>

                                                ) : (

                                                    <span
                                                        style={
                                                            styles.humanNo
                                                        }
                                                    >
                                                        ✓ Automated
                                                    </span>

                                                )}

                                            </td>

                                            {/* ACTION */}

                                            <td
                                                style={
                                                    styles.td
                                                }
                                            >

                                                <button
                                                    style={
                                                        styles.viewBtn
                                                    }
                                                    onClick={(
                                                        e
                                                    ) => {

                                                        e.stopPropagation();

                                                        setSelectedDecision(
                                                            row
                                                        );

                                                    }}
                                                >
                                                    View Details
                                                </button>

                                            </td>

                                        </tr>

                                    );
                                }
                            )

                        )}

                    </tbody>

                </table>

            </div>

            {/* =====================================
                MODAL
            ====================================== */}

            {selectedDecision && (

                <DecisionModal
                    decision={
                        selectedDecision
                    }
                    onClose={() =>
                        setSelectedDecision(null)
                    }
                />

            )}

        </div>
    );
}

// =================================================
// STYLES
// =================================================

const styles = {

    container: {
        display: "flex",
        flexDirection: "column",
        gap: "20px",
    },

    pageHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
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

    messageCount: {
        backgroundColor: "#EEF2FF",
        color: "#4F46E5",
        padding: "8px 14px",
        borderRadius: "8px",
        fontSize: "13px",
        fontWeight: "700",
    },

    controlBar: {
        display: "flex",
        gap: "12px",
        backgroundColor: "#FFFFFF",
        padding: "16px",
        borderRadius: "12px",
        border: "1px solid #E2E8F0",
    },

    searchInput: {
        flex: 1,
        padding: "10px 14px",
        borderRadius: "8px",
        border: "1px solid #CBD5E1",
        fontSize: "14px",
        outline: "none",
    },

    selectInput: {
        padding: "10px 14px",
        borderRadius: "8px",
        border: "1px solid #CBD5E1",
        backgroundColor: "#FFFFFF",
        fontSize: "13px",
        fontWeight: "600",
        color: "#334155",
        cursor: "pointer",
    },

    refreshButton: {
        padding: "10px 16px",
        borderRadius: "8px",
        border: "none",
        backgroundColor: "#4F46E5",
        color: "#FFFFFF",
        fontWeight: "700",
        cursor: "pointer",
    },

    resultsInfo: {
        fontSize: "13px",
        color: "#64748B",
    },

    tableCard: {
        backgroundColor: "#FFFFFF",
        border: "1px solid #E2E8F0",
        borderRadius: "12px",
        overflow: "hidden",
    },

    table: {
        width: "100%",
        borderCollapse: "collapse",
        textAlign: "left",
        fontSize: "13px",
    },

    trHeader: {
        backgroundColor: "#F8FAFC",
        borderBottom: "1px solid #E2E8F0",
    },

    th: {
        padding: "14px 18px",
        color: "#64748B",
        fontWeight: "700",
        fontSize: "12px",
    },

    trBody: {
        borderBottom: "1px solid #F1F5F9",
        cursor: "pointer",
    },

    tdMessage: {
        padding: "14px 18px",
        fontWeight: "600",
        color: "#0F172A",
        maxWidth: "300px",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
    },

    td: {
        padding: "14px 18px",
        color: "#334155",
    },

    emptyTd: {
        padding: "40px",
        textAlign: "center",
        color: "#64748B",
        fontWeight: "500",
    },

    categoryTag: {
        backgroundColor: "#F1F5F9",
        padding: "4px 8px",
        borderRadius: "6px",
        fontSize: "11px",
        fontWeight: "700",
        color: "#475569",
        textTransform: "uppercase",
    },

    priorityBadge: {
        padding: "4px 8px",
        borderRadius: "6px",
        fontSize: "11px",
        fontWeight: "700",
    },

    humanYes: {
        backgroundColor: "#FEF3C7",
        color: "#B45309",
        padding: "4px 8px",
        borderRadius: "6px",
        fontSize: "11px",
        fontWeight: "700",
    },

    humanNo: {
        backgroundColor: "#DCFCE7",
        color: "#15803D",
        padding: "4px 8px",
        borderRadius: "6px",
        fontSize: "11px",
        fontWeight: "700",
    },

    viewBtn: {
        padding: "6px 12px",
        borderRadius: "6px",
        border: "1px solid #E2E8F0",
        backgroundColor: "#FFFFFF",
        color: "#4F46E5",
        fontWeight: "700",
        fontSize: "11px",
        cursor: "pointer",
    },

    stateContainer: {
        minHeight: "400px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        backgroundColor: "#FFFFFF",
        border: "1px solid #E2E8F0",
        borderRadius: "12px",
    },

    loadingIcon: {
        fontSize: "32px",
        marginBottom: "12px",
    },

    errorIcon: {
        fontSize: "32px",
        marginBottom: "12px",
    },

    stateTitle: {
        margin: "0 0 8px",
        color: "#0F172A",
    },

    stateText: {
        margin: 0,
        color: "#64748B",
    },

    retryButton: {
        marginTop: "16px",
        padding: "10px 18px",
        border: "none",
        borderRadius: "8px",
        backgroundColor: "#4F46E5",
        color: "#FFFFFF",
        fontWeight: "700",
        cursor: "pointer",
    },
};
