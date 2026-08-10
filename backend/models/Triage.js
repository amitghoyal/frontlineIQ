const mongoose = require("mongoose");

const triageSchema = new mongoose.Schema(
    {
        message_id: {
            type: String,
            required: true,
            unique: true,
            index: true
        },

        message: {
            type: String,
            required: true
        },

        category: {
            type: String,
            required: true,
            enum: [
                "payment",
                "account",
                "order",
                "technical",
                "refund",
                "general",
                "out_of_scope",
                "unclear"
            ]
        },

        priority: {
            type: Number,
            required: true,
            min: 3,
            max: 10
        },

        summary: {
            type: String,
            required: true
        },

        suggested_action: {
            type: String,
            required: true
        },

        needs_human: {
            type: Boolean,
            required: true
        },

        confidence: {
            type: Number,
            required: true,
            min: 0,
            max: 1
        },

        latency_ms: {
            type: Number,
            default: 0
        },

        input_tokens: {
            type: Number,
            default: 0
        },

        output_tokens: {
            type: Number,
            default: 0
        },

        total_tokens: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Triage", triageSchema);