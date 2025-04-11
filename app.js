const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();            // Load .env variables
connectDB();                // Connect to MongoDB

const app = express();
app.use(express.json());    // Middleware to parse JSON
// app.js (already mostly set up)

const jobRoutes = require('./routes/jobRoutes');
app.use('/api/jobs', jobRoutes);


// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/jobs", require("./routes/jobRoutes"));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
