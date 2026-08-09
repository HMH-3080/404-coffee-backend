const express = require("express");
const cors = require("cors");

const userRoutes = require("./routes/user.routes");

const authRoutes = require("./routes/auth.routes");


const rawMaterialRoutes = require("./routes/raw-material.routes");




const errorHandler = require("./middlewares/error.middleware");


const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// test route
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "404 Coffee API is running",
  });
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

app.use("/api/raw-materials", rawMaterialRoutes)

// app.use("/api/test", testRoutes);


// Error handler must be after routes
app.use(errorHandler);


module.exports = app;