const express = require("express");
const cors = require("cors");

const app = express();

// middleware
app.use(cors());
app.use(express.json());


// test route
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "404 Coffee API is running",
  });
});

module.exports = app;