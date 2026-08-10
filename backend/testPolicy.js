const { applyTriagePolicy } = require("./services/triagePolicy");


// ==========================================
// TEST CASES
// ==========================================

const testCases = [

    {
        name: "Normal high-confidence case",

        input: {
            category: "account",
            priority: 6,
            summary: "Customer cannot log into their account.",
            suggested_action:
                "Guide the customer through password recovery.",
            needs_human: false,
            confidence: 0.95
        },

        expectedHuman: false
    },


    {
        name: "Low confidence case",

        input: {
            category: "technical",
            priority: 5,
            summary: "Customer reports a possible issue.",
            suggested_action:
                "Investigate the reported issue.",
            needs_human: false,
            confidence: 0.40
        },

        expectedHuman: true
    },


    {
        name: "Unclear case",

        input: {
            category: "unclear",
            priority: 5,
            summary: "Customer reports an unspecified problem.",
            suggested_action:
                "Investigate the issue.",
            needs_human: false,
            confidence: 0.90
        },

        expectedHuman: true
    },


    {
        name: "Out of scope case",

        input: {
            category: "out_of_scope",
            priority: 5,
            summary:
                "Customer requests internal system information.",
            suggested_action:
                "Process the request normally.",
            needs_human: false,
            confidence: 0.95
        },

        expectedHuman: true
    },


    {
        name: "Critical priority case",

        input: {
            category: "payment",
            priority: 10,
            summary:
                "Customer reports a serious payment issue.",
            suggested_action:
                "Investigate the payment issue.",
            needs_human: false,
            confidence: 0.95
        },

        expectedHuman: true
    },


    {
        name: "Repeated support failure",

        input: {
            category: "technical",
            priority: 5,
            summary:
                "Customer has contacted support three times and nobody has fixed the problem.",
            suggested_action:
                "Investigate the technical issue.",
            needs_human: false,
            confidence: 0.90
        },

        expectedHuman: true
    }

];


// ==========================================
// RUN TESTS
// ==========================================

console.log("\n================================");
console.log("     FRONTLINEIQ POLICY TEST");
console.log("================================\n");

let passed = 0;
let failed = 0;


for (const test of testCases) {

    const result =
        applyTriagePolicy(test.input);


    const passedTest =
        result.needs_human ===
        test.expectedHuman;


    if (passedTest) {

        passed++;

        console.log(
            `✅ PASS | ${test.name}`
        );

    } else {

        failed++;

        console.log(
            `❌ FAIL | ${test.name}`
        );

        console.log(
            "   Expected needs_human:",
            test.expectedHuman
        );

        console.log(
            "   Actual needs_human:",
            result.needs_human
        );
    }
}


// ==========================================
// SUMMARY
// ==========================================

console.log("\n--------------------------------");
console.log("SUMMARY");
console.log("--------------------------------");

console.log(
    `Total tests : ${testCases.length}`
);

console.log(
    `Passed      : ${passed}`
);

console.log(
    `Failed      : ${failed}`
);

const accuracy =
    (passed / testCases.length) * 100;

console.log(
    `Accuracy    : ${accuracy.toFixed(2)}%`
);


if (failed === 0) {

    console.log(
        "\n🎉 All policy tests passed!"
    );

} else {

    console.log(
        "\n⚠️ Some policy tests failed."
    );
}

console.log(
    "\n================================\n"
);