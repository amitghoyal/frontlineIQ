// ==========================================
// FRONTLINEIQ TRIAGE POLICY
// ==========================================

function applyTriagePolicy(result) {

    const finalResult = {
        ...result
    };


    // ==========================================
    // RULE 1: LOW CONFIDENCE
    // ==========================================

    if (finalResult.confidence < 0.60) {

        finalResult.needs_human = true;

        finalResult.suggested_action =
            "Send this case for human review.";
    }


    // ==========================================
    // RULE 2: UNCLEAR
    // ==========================================

    if (finalResult.category === "unclear") {

        finalResult.needs_human = true;

        finalResult.priority =
            Math.max(3, finalResult.priority);

        finalResult.suggested_action =
            "Send this case for human review and gather more information from the customer.";
    }


    // ==========================================
    // RULE 3: OUT OF SCOPE
    // ==========================================

    if (
        finalResult.category ===
        "out_of_scope"
    ) {

        finalResult.needs_human = true;

        finalResult.suggested_action =
            "Flag this case for human review and do not process it as a standard support request.";
    }


    // ==========================================
    // RULE 4: HIGH-RISK PAYMENT
    // ==========================================

    if (
        finalResult.category === "payment" &&
        finalResult.priority >= 8
    ) {

        finalResult.needs_human = true;
    }


    // ==========================================
    // RULE 5: CRITICAL PRIORITY
    // ==========================================

    if (finalResult.priority >= 9) {

        finalResult.needs_human = true;
    }


    // ==========================================
    // RULE 6: REPEATED SUPPORT FAILURE
    // ==========================================

    const summary =
        finalResult.summary?.toLowerCase() || "";

    const action =
        finalResult.suggested_action?.toLowerCase() || "";

    const combinedText =
        `${summary} ${action}`;


    const repeatedSupportIndicators = [

        "three times",

        "multiple times",

        "again and again",

        "already contacted",

        "contacted support",

        "nobody has fixed",

        "still not fixed",

        "still unresolved",

        "no one helped"
    ];


    const repeatedIssue =
        repeatedSupportIndicators.some(
            indicator =>
                combinedText.includes(indicator)
        );


    if (repeatedIssue) {

        finalResult.needs_human = true;

        if (finalResult.priority < 7) {

            finalResult.priority = 7;
        }
    }


    // ==========================================
    // RULE 7: PRIORITY RANGE
    // ==========================================

    if (finalResult.priority < 3) {

        finalResult.priority = 3;
    }

    if (finalResult.priority > 10) {

        finalResult.priority = 10;
    }


    // ==========================================
    // RULE 8: CONFIDENCE RANGE
    // ==========================================

    if (finalResult.confidence < 0) {

        finalResult.confidence = 0;
    }

    if (finalResult.confidence > 1) {

        finalResult.confidence = 1;
    }


    // ==========================================
    // FINAL SAFETY CHECK
    // ==========================================

    if (
        finalResult.confidence < 0.60 ||
        finalResult.category === "unclear" ||
        finalResult.category === "out_of_scope"
    ) {

        finalResult.needs_human = true;
    }


    return finalResult;
}


module.exports = {
    applyTriagePolicy
};