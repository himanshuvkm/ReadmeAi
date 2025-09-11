import express from "express";
import session from "express-session";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./Routes/authRoutes.js";
import repoRoutes from "./Routes/repoRoutes.js";
import { initializeFirebaseAdmin } from "./Config/githubOAuth.js";


dotenv.config();

initializeFirebaseAdmin();

const app = express();


app.use(
  cors({
    origin: process.env.FRONTEND_URL || "https://readmegen-pz8j.vercel.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-github-token"],
    exposedHeaders: ["x-ratelimit-remaining"],
  })
);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/auth", authRoutes);
app.use("/api", repoRoutes);

app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});


app.use((err, req, res, next) => {
  console.error("Internal Server Error:", {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    user: req.firebaseUser?.uid || "anonymous",
    timestamp: new Date().toISOString(),
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
