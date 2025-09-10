import express from "express";
import { getRepos, generateRepoReadme, generatePublicReadme } from "../Controller/repoController.js";
import { verifyFirebaseToken } from "../middleware/verifyFirebase.js";
import { requireGitHubToken } from "../middleware/authMiddleware.js";

const router = express.Router();


router.get("/repos", verifyFirebaseToken, requireGitHubToken, getRepos);
router.post("/generate-readme-private", verifyFirebaseToken, requireGitHubToken, generateRepoReadme);


router.post("/generate-readme", generatePublicReadme);

export default router;
