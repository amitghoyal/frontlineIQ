const fs = require("fs");
const path = require("path");

require("dotenv").config();

const { analyzeBatch } = require("./services/batchAiService");

async function processBatch() {

    // 1. Locate dataset
    const datasetPath = path.join(
        __dirname,
        "../dataset/messages.json"
    );

    // 2. Read dataset
    const data = fs.readFileSync(
        datasetPath,
        "utf-8"
    );

    const messages = JSON.parse(data);

    console.log(`Found ${messages.length} messages.`);

    const testMessages = messages;

    console.log(
        `Testing with ${testMessages.length} messages.`
    );

    try {

        // 3. Send batch to Gemini
        const response = await analyzeBatch(
            testMessages
        );

        console.log("\nGemini response:");

        console.log(
            JSON.stringify(response, null, 2)
        );

        // 4. Check that Gemini returned results
        if (
            !response.results ||
            !Array.isArray(response.results)
        ) {

            throw new Error(
                "Gemini did not return a valid results array."
            );
        }

        // 5. Verify result count
        if (
            response.results.length !==
            testMessages.length
        ) {

            console.warn(
                `⚠️ Expected ${testMessages.length} results, but received ${response.results.length}.`
            );
        }

        // 6. Match results with original messages
        const finalResults = testMessages.map(
            message => {

                const aiResult =
                    response.results.find(
                        result =>
                            result.message_id ===
                            message.message_id
                    );

                if (!aiResult) {

                    return {
                        message_id:
                            message.message_id,

                        text: message.text,

                        test_group:
                            message.test_group,

                        result: {
                            category: "unclear",
                            priority: 3,
                            summary:
                                "No AI result was returned.",
                            suggested_action:
                                "Send this case for human review.",
                            needs_human: true,
                            confidence: 0
                        },

                        ai_failed: true
                    };
                }

                return {
                    message_id:
                        message.message_id,

                    text: message.text,

                    test_group:
                        message.test_group,

                    result: aiResult
                };
            }
        );

        // 7. Save results
        const outputPath = path.join(
            __dirname,
            "../dataset/batch-results.json"
        );

        fs.writeFileSync(
            outputPath,
            JSON.stringify(
                finalResults,
                null,
                2
            )
        );

        console.log(
            "\n✅ Batch processing completed."
        );

        console.log(
            `Results saved to: ${outputPath}`
        );

    } catch (error) {

        console.error(
            "\n❌ Batch processing failed:"
        );

        console.error(error.message);
    }
}

processBatch();