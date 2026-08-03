const express= require("express");

const { parseInvoiceFromText, generateRemainderEmail, getDashboardSummary } = require("../controllers/ai.controller");

const protect = require("../middlewares/auth.middleware");
const router = express.Router();



router.post("/parse-text", protect, parseInvoiceFromText);
router.post("/generate-remainder", protect, generateRemainderEmail);
router.post("/dashboard-summary", protect, getDashboardSummary);

module.exports = router;