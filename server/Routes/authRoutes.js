import express from "express";
import { admin } from "../Config/githubOAuth.js";
import fetch from "node-fetch";
import { verifyFirebaseToken } from "../middleware/authMiddleware.js";
import { getAuthStatus } from "../Controller/authController.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { githubAccessToken, firebaseToken } = req.body;

    if (!firebaseToken) {
      return res.status(400).json({ message: "Firebase token missing" });
    }

    // Verify Firebase token
    const decodedToken = await admin.auth().verifyIdToken(firebaseToken);

    // Optionally fetch GitHub profile to verify access token
    let githubProfile = null;
    if (githubAccessToken) {
      const ghRes = await fetch("https://api.github.com/user", {
        headers: { Authorization: `token ${githubAccessToken}` },
      });
      if (ghRes.ok) {
        githubProfile = await ghRes.json();
      } else {
        throw new Error("Invalid GitHub access token");
      }
    }

    // Store session
    req.session.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      github: {
        ...githubProfile,
        token: githubAccessToken,
      },
    };

    res.json({ message: "Login successful", user: req.session.user });
  } catch (error) {
    console.error("Login error:", error);
    res.status(401).json({ message: `Authentication failed: ${error.message}` });
  }
});

router.get("/user", verifyFirebaseToken, getAuthStatus);

router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.status(500).json({ message: "Failed to logout" });
    }
    res.json({ message: "Logged out (client should also sign out of Firebase)" });
  });
});

export default router;
