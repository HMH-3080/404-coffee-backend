const express = require("express");

const { chat } = require("./chat.controller");

const router = express.Router();

// ============================================================
// Chat with the AI assistant (public for customers; staff
// capabilities are enabled automatically when a valid staff
// token is provided in the Authorization header)
// ============================================================

router.post("/", chat);

module.exports = router;