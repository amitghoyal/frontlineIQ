const fs = require("fs");
const path = require("path");

// ==========================================
// FILE PATHS
// ==========================================

const groundTruthPath = path.join(
    __dirname,
    "groundTruth.json"
);

const resultsPath = path.join(
    __dirname,
    "../dataset/batch-results.json"
);


// ==========================================
// READ FILES
// ==========================================

if (!fs.existsSync(groundTruthPath)) {
    console.error(
        "❌ groundTruth.json not found."
    );
    process.exit(1);
}

if (!fs.existsSync(resultsPath)) {
    console.error(
        "❌ batch-results.json not found."
    );
    process.exit(1);
}

const groundTruth = JSON.parse(
    fs.readFileSync(
        groundTruthPath,
        "utf-8"
    )
);

const results = JSON.parse(
    fs.readFileSync(
        resultsPath,
        "utf-8"
    )
);


// ==========================================
// HANDLE DIFFERENT RESULT STRUCTURES
// ==========================================

let processedResults = results;

// If batch-results.json has:
// { "results": [...] }

if (
    !Array.isArray(results) &&
    Array.isArray(results.results)
) {
    processedResults = results.results;
}


// ==========================================
// METRICS
// ==========================================

let correctCategory = 0;
let incorrectCategory = 0;

let humanCorrect = 0;
let humanEvaluated = 0;

let lowConfidenceCount = 0;
let missingCount = 0;

const failures = [];


// ==========================================
// EVALUATION
// ==========================================

console.log("\n================================");
console.log("       FRONTLINEIQ EVALUATION");
console.log("================================\n");

for (const expected of groundTruth) {

    const actual = processedResults.find(
        item =>
            item.message_id ===
            expected.message_id
    );


    // ======================================
    // MISSING RESULT
    // ======================================

    if (!actual) {

        missingCount++;
        incorrectCategory++;

        console.log(
            `❌ ${expected.message_id} | Missing result`
        );

        failures.push({
            message_id: expected.message_id,
            expected: expected.expected_category,
            predicted: "missing"
        });

        continue;
    }


    // ======================================
    // GET RESULT
    // ======================================

    const result = actual.result || actual;

    const predictedCategory =
        result.category;

    const predictedHuman =
        result.needs_human;

    const confidence =
        Number(result.confidence);


    // ======================================
    // CATEGORY ACCURACY
    // ======================================

    if (
        predictedCategory ===
        expected.expected_category
    ) {

        correctCategory++;

        console.log(
            `✅ ${expected.message_id} | ` +
            `Expected: ${expected.expected_category} | ` +
            `Predicted: ${predictedCategory}`
        );

    } else {

        incorrectCategory++;

        console.log(
            `❌ ${expected.message_id} | ` +
            `Expected: ${expected.expected_category} | ` +
            `Predicted: ${predictedCategory}`
        );

        failures.push({
            message_id: expected.message_id,
            expected: expected.expected_category,
            predicted: predictedCategory
        });
    }


    // ======================================
    // HUMAN ESCALATION AGREEMENT
    // ======================================

    if (
        predictedHuman ===
        expected.expected_needs_human
    ) {

        humanCorrect++;
    }

    humanEvaluated++;


    // ======================================
    // LOW CONFIDENCE
    // ======================================

    if (
        !Number.isNaN(confidence) &&
        confidence < 0.5
    ) {

        lowConfidenceCount++;
    }
}


// ==========================================
// CALCULATE METRICS
// ==========================================

const totalMessages =
    groundTruth.length;

const categoryAccuracy =
    totalMessages > 0
        ? (correctCategory / totalMessages) * 100
        : 0;

const humanAgreement =
    humanEvaluated > 0
        ? (humanCorrect / humanEvaluated) * 100
        : 0;


// ==========================================
// SUMMARY
// ==========================================

console.log("\n--------------------------------");
console.log("SUMMARY");
console.log("--------------------------------");

console.log(
    `Messages evaluated        : ${totalMessages}`
);

console.log(
    `Correct categories        : ${correctCategory}`
);

console.log(
    `Incorrect categories      : ${incorrectCategory}`
);

console.log(
    `Category accuracy         : ${categoryAccuracy.toFixed(2)}%`
);

console.log(
    `Human escalation agreement: ${humanAgreement.toFixed(2)}%`
);

console.log(
    `Low-confidence cases      : ${lowConfidenceCount}`
);

console.log(
    `Missing results           : ${missingCount}`
);


// ==========================================
// FAILURE CASES
// ==========================================

console.log("\n--------------------------------");
console.log("FAILURE CASES");
console.log("--------------------------------");

if (failures.length === 0) {

    console.log("🎉 No category failures!");

} else {

    failures.forEach(failure => {

        console.log(
            `${failure.message_id} | ` +
            `Expected: ${failure.expected} | ` +
            `Predicted: ${failure.predicted}`
        );

    });
}


// ==========================================
// FINAL
// ==========================================

console.log("\n================================");
console.log("Evaluation completed.");
console.log("================================\n");