import { admin } from "../Config/githubOAuth.js";

export async function verifyFirebaseToken(req, res, next) {
  console.log("verifyFirebaseToken - Entering middleware.");
  try {
    const authHeader = req.headers.authorization || "";
    const idToken = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

    console.log("verifyFirebaseToken - Authorization Header:", authHeader ? "[HEADER_EXISTS]" : "[HEADER_MISSING]");
    console.log("verifyFirebaseToken - Extracted ID Token:", idToken ? "[TOKEN_EXISTS]" : "[TOKEN_MISSING]");

    if (!idToken) {
      console.error("verifyFirebaseToken error: Missing Authorization header with Firebase ID token.");
      return res.status(401).json({ error: "Missing Authorization header with Firebase ID token" });
    }

    const decoded = await admin.auth().verifyIdToken(idToken);
    req.firebaseUser = decoded; // uid, email, etc.
    console.log("verifyFirebaseToken - Firebase ID token successfully verified for user:", decoded.uid);
    next();
  } catch (err) {
    console.error("Firebase token verification error:", err.message || err);
    return res.status(401).json({ error: "Invalid or expired Firebase ID token" });
  }
}