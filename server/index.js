const express = require("express");
const app = express();
const dotenv = require("dotenv");
const database = require("./config/database");
const cors = require("cors");
const routes = require("./routes/route");

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 4000;

// Allowed origins for CORS
const allowedOrigins = ['http://localhost:5173'];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

// Connect to the database
database.connect();


// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/v1", routes);

// Default route
require("./cron/scheduler");

app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Your server is up and running....",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
