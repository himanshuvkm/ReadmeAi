import express from "express";
import session from "express-session";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./Routes/authRoutes.js";
import repoRoutes from "./Routes/repoRoutes.js";
import { initializeFirebaseAdmin } from "./Config/githubOAuth.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, ".env") });

initializeFirebaseAdmin();

const app = express();

app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === "production" },
  })
);


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


if (process.env.NODE_ENV === "development") {
  app.use((req, res, next) => {
    console.info(`${req.method} ${req.path}`);
    if (req.body && Object.keys(req.body).length > 0) {
      console.info("Body:", req.body);
    }
    next();
  });
}


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

  res.status(err.status || 500).json({
    status: "error",
    message: err.customMessage || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && {
      error: err.message,
      stack: err.stack,
    }),
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
