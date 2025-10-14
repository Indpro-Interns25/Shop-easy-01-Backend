const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");

const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
dotenv.config();

const app = express();

// Configure CORS to allow frontend connection
app.use(cors({
  origin: "http://localhost:5173", // Vite frontend URL
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend connected successfully!', timestamp: new Date().toISOString() });
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
