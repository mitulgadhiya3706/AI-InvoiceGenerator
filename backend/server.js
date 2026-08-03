require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const connectDB = require('./config/database');
const { METHODS } = require("http");

const authRoutes = require("./routes/auth.routes");
const aiRoutes = require("./routes/ai.routes");
const invoiceRoutes = require("./routes/invoice.routes");

const app = express();

app.use(cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"],
}));


connectDB();

app.use(express.json());

app.use(authRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/invoice", invoiceRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}...`);
});