const express = require("express");
const { analyzeMessage } = require("../services/aiService");
const TriageResult = require("../models/TriageResult");

const router = express.Router();

router.post("/triage", async (req, res) => {

    try {

        const { message } = req.body;

        if (
            !message ||
            typeof message !== "string" ||
            !message.trim()
        ) {

            return res.status(400).json({

                success: false,

                error: "A valid message is required."

            });

        }


        const startTime = Date.now();

        const result = await analyzeMessage(
            message.trim()
        );

        const latency = Date.now() - startTime;

        const triageRecord = new TriageResult({

            message_id:
                `m-${Date.now()}`,

            message:
                message.trim(),

            category:
                result.category,

            priority:
                result.priority,

            summary:
                result.summary,

            suggested_action:
                result.suggested_action,

            needs_human:
                result.needs_human,

            confidence:
                result.confidence,

            latency_ms:
                result.latency_ms || latency,

            usage: {

                input_tokens:
                    result.usage?.input_tokens || 0,

                output_tokens:
                    result.usage?.output_tokens || 0,

                total_tokens:
                    result.usage?.total_tokens || 0

            }

        });


        const savedRecord =
            await triageRecord.save();


        console.log(
            ` Triage saved: ${savedRecord.message_id}`
        );

        res.status(201).json({

            success: true,

            result: {

                message_id:
                    savedRecord.message_id,

                message:
                    savedRecord.message,

                category:
                    savedRecord.category,

                priority:
                    savedRecord.priority,

                summary:
                    savedRecord.summary,

                suggested_action:
                    savedRecord.suggested_action,

                needs_human:
                    savedRecord.needs_human,

                confidence:
                    savedRecord.confidence,

                latency_ms:
                    savedRecord.latency_ms,

                usage:
                    savedRecord.usage,

                created_at:
                    savedRecord.createdAt

            }

        });

    }

    catch (error) {

        console.error(
            "Triage processing failed:",
            error
        );


        res.status(500).json({

            success: false,

            error:
                "Unable to process customer message."

        });

    }

});


module.exports = router;
