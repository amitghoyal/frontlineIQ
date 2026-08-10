require("dotenv").config();

const { analyzeMessage } =
    require("./services/aiService");


// ==========================================
// TEST MESSAGE
// ==========================================

const testMessage =
    "I was charged twice for the same order.";


// ==========================================
// RUN TEST
// ==========================================

async function testGemini() {

    console.log("\n================================");
    console.log("       FRONTLINEIQ AI TEST");
    console.log("================================\n");

    console.log("Customer message:");
    console.log(testMessage);

    console.log(
        "\nProcessing with Gemini...\n"
    );


    try {

        const result =
            await analyzeMessage(
                testMessage
            );


        console.log(
            "================================"
        );

        console.log(
            "          AI RESULT"
        );

        console.log(
            "================================\n"
        );


        console.log(
            JSON.stringify(
                result,
                null,
                2
            )
        );


        // ======================================
        // PERFORMANCE INFORMATION
        // ======================================

        console.log(
            "\n================================"
        );

        console.log(
            "       PERFORMANCE"
        );

        console.log(
            "================================\n"
        );


        console.log(
            `Latency      : ${result.latency_ms} ms`
        );

        console.log(
            `Input tokens : ${result.usage.input_tokens}`
        );

        console.log(
            `Output tokens: ${result.usage.output_tokens}`
        );

        console.log(
            `Total tokens : ${result.usage.total_tokens}`
        );


        console.log(
            "\n================================\n"
        );


    } catch (error) {

        console.error(
            "\n❌ Test failed:"
        );

        console.error(error);
    }
}


testGemini();