// middleware/attachGithubToken.js
export function attachGithubToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    req.githubAccessToken = authHeader.split(" ")[1];
    console.log("attachGithubToken - GitHub token extracted from Authorization header.");
  } else if (req.session?.user?.github?.token) {
    req.githubAccessToken = req.session.user.github.token;
    console.log("attachGithubToken - GitHub token extracted from session.");
  } else {
    console.log("attachGithubToken - No GitHub token found in header or session.");
  }
  next();
}
