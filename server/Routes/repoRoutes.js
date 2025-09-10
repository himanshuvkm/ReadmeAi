import express from "express";
import { getRepos, generateRepoReadme, generatePublicReadme } from "../Controller/repoController.js";
import { verifyFirebaseToken } from "../middleware/authMiddleware.js";
import { attachGithubToken } from "../middleware/attachGithubToken.js";

const router = express.Router();

// 🔐 Protected GitHub endpoints (Firebase Auth required)
router.get("/repos", verifyFirebaseToken, attachGithubToken, getRepos);
router.post("/generate-readme-private", verifyFirebaseToken, attachGithubToken, generateRepoReadme);

// 🌐 Public endpoint (no auth required)
router.post("/generate-readme", generatePublicReadme);

export default router;