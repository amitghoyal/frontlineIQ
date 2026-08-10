
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const triageRoutes = require("./routes/triageRoutes");

const app = express();

app.use(cors());
app.use(express.json());

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("✅ MongoDB connected successfully");
    })
    .catch((error) => {
        console.error("❌ MongoDB connection failed:", error);
    });


app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "FrontlineIQ API is running"
    });
});

app.use("/api", triageRoutes);

app.use("/api", messageRoutes);

app.use((err, req, res, next) => {
    console.error("❌ Server Error:", err);

    res.status(500).json({
        success: false,
        error: "Internal server error"
    });
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log("=================================");
    console.log("🚀 FrontlineIQ Backend Started");
    console.log(`🌐 Server: http://localhost:${PORT}`);
    console.log(`📊 API: http://localhost:${PORT}/api`);
    console.log(`📋 Triage: http://localhost:${PORT}/api/triage`);
    console.log("=================================");
});
