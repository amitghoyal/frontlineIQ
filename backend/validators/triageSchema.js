const { z } = require("zod");

const triageSchema = z.object({
    category: z.enum([
        "payment",
        "account",
        "order",
        "technical",
        "refund",
        "general",
        "out_of_scope",
        "unclear"
    ]),

    priority: z.number()
        .int()
        .min(3)
        .max(10),

    summary: z.string()
        .min(1),

    suggested_action: z.string()
        .min(1),

    needs_human: z.boolean(),

    confidence: z.number()
        .min(0)
        .max(1)
});

module.exports = triageSchema;