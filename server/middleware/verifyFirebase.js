import { admin } from "../Config/githubOAuth.js";

export async function verifyFirebaseToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";
    const idToken = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    if (!idToken) {
      return res.status(401).json({ error: "Missing Firebase ID token" });
    }

    const decoded = await admin.auth().verifyIdToken(idToken);
    req.firebaseUser = decoded;
    next();
  } catch (err) {
    console.error("Firebase token verification error:", err.message);
    return res.status(401).json({ error: "Invalid or expired Firebase ID token" });
  }
}
