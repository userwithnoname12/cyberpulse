import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import newsRoutes from "./routes/news.js";
import cveRoutes from "./routes/cve.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security headers
app.use(helmet());

// Restrict CORS to only our frontend's origin
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
app.use(
  cors({
    origin: FRONTEND_URL,
  })
);

app.use(express.json());

// Rate limiting: max 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});
app.use(limiter);

app.get("/", (req, res) => {
  res.send("CyberPulse backend is running.");
});

app.use("/api/news", newsRoutes);
app.use("/api/cve", cveRoutes);

app.listen(PORT, () => {
  console.log(`CyberPulse backend running on http://localhost:${PORT}`);
});