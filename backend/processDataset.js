const fs = require("fs");
const path = require("path");

require("dotenv").config();

const { analyzeMessage } = require("./services/aiService");

async function processDataset() {

    // Dataset location
    const datasetPath = path.join(
        __dirname,
        "../dataset/messages.json"
    );

    // Read dataset
    const data = fs.readFileSync(
        datasetPath,
        "utf-8"
    );

    const messages = JSON.parse(data).slice(0, 1);
    
    console.log(`Found ${messages.length} messages.`);

    const results = [];

    // Process messages one by one
    for (const item of messages) {

        console.log(`Processing ${item.message_id}...`);

        try {

            const result = await analyzeMessage(
                item.text
            );

            results.push({
                message_id: item.message_id,
                text: item.text,
                test_group: item.test_group,
                result: result
            });

            console.log(`✅ ${item.message_id} completed.`);

        } catch (error) {

            console.error(
                `❌ Failed to process ${item.message_id}:`,
                error.message
            );

            results.push({
                message_id: item.message_id,
                text: item.text,
                test_group: item.test_group,
                result: {
                    category: "unclear",
                    priority: 3,
                    summary: "Unable to process message.",
                    suggested_action: "Send this case for human review.",
                    needs_human: true,
                    confidence: 0
                }
            });
        }
    }

    // Save results
    const outputPath = path.join(
        __dirname,
        "../dataset/results.json"
    );

    fs.writeFileSync(
        outputPath,
        JSON.stringify(results, null, 2)
    );

    console.log("\n✅ Dataset processing completed.");
    console.log(`Results saved to: ${outputPath}`);
}

processDataset();