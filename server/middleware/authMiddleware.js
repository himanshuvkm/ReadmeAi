export function requireGitHubToken(req, res, next) {
 
  const token =
    req.headers["x-github-token"] ||
    req.body?.githubToken ||
    req.query?.githubToken ||
    null;
   
  if (!token) {
    return res.status(401).json({ error: "Missing GitHub token" });
  }

  req.githubToken = token;
  next();
}
