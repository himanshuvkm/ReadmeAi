import { GitHubService } from "../Services/githubService.js";
import { generateReadme } from "../Services/geminiService.js";

const getGitHubService = (req) => {
  const token = req.headers["x-github-token"] || req.githubToken;
  console.log("getGitHubService - token:", token ? "[TOKEN_EXISTS]" : "[TOKEN_MISSING]");
  if (!token) {
    console.error("getGitHubService error: Missing GitHub token");
    throw new Error("Missing GitHub token");
  }
  return new GitHubService(token);
};

export const getRepos = async (req, res) => {
  console.log("getRepos - Request received.");
  try {
    const service = getGitHubService(req);
    console.log("getRepos - GitHubService initialized.");
    const repos = await service.getUserRepos();
    console.log("getRepos - Fetched repositories successfully.");
    res.json(repos);
  } catch (error) {
    console.error("getRepos error:", error);
    if (error.message.includes("401")) {
      return res.status(401).json({ message: "Invalid or expired GitHub token" });
    }
    res.status(500).json({ message: `Failed to fetch repositories: ${error.message}` });
  }
};

export const generateRepoReadme = async (req, res) => {
  try {
    const { owner, repoName } = req.body;
    if (!owner || !repoName) {
      return res.status(400).json({ message: "Owner and repoName are required" });
    }

    const service = getGitHubService(req);

    const [repoDetails, languages, fileTree] = await Promise.all([
      service.getRepoDetails(owner, repoName),
      service.getRepoLanguages(owner, repoName),
      service.getRepoFileTree(owner, repoName),
    ]);

    if (!repoDetails) return res.status(404).json({ message: "Repository details not found" });

    const fileList = (fileTree?.tree || [])
      .filter((file) => file.type === "blob")
      .map((file) => file.path)
      .slice(0, 30)
      .join("\n");

    const repoData = {
      repoName,
      owner,
      description: repoDetails.description || "No description",
      languages: Object.keys(languages).join(", ") || "Not specified",
      fileStructure: fileList,
    };

    let readmeContent = await generateReadme(repoData);

    readmeContent = (readmeContent || "")
      .replace(/^```(?:markdown)?\s*/i, "")
      .replace(/```$/, "")
      .trim();

    res.json({ readme: readmeContent });
  } catch (error) {
    console.error("generateRepoReadme error:", error);
    if (error.message.includes("401")) {
      return res.status(401).json({ message: "Invalid GitHub token" });
    }
    if (error.message.includes("rate limit")) {
      return res.status(429).json({ message: "GitHub API rate limit exceeded" });
    }
    res.status(500).json({ message: `Failed to generate README: ${error.message}` });
  }
};

export const generatePublicReadme = async (req, res) => {
  try {
    const { owner, repoName } = req.body;
    if (!owner || !repoName) {
      return res.status(400).json({ readme: null, error: "Owner and repoName are required" });
    }

    const token = req.headers["x-github-token"] || process.env.GITHUB_ACCESS_TOKEN || null;
    const service = new GitHubService(token);

    const [repoDetails, languages, fileTree] = await Promise.all([
      service.getRepoDetails(owner, repoName),
      service.getRepoLanguages(owner, repoName),
      service.getRepoFileTree(owner, repoName),
    ]);

    if (!repoDetails) {
      return res.status(404).json({ readme: null, error: "Repository details not found" });
    }

    const fileList = (fileTree?.tree || [])
      .filter((file) => file.type === "blob")
      .map((file) => file.path)
      .slice(0, 50)
      .join("\n");

    const repoData = {
      repoName,
      owner,
      description: repoDetails.description || "No description",
      languages: Object.keys(languages).join(", ") || "Not specified",
      fileStructure: fileList,
    };

    let readmeContent = await generateReadme(repoData);

    readmeContent = (readmeContent || "")
      .replace(/^```(?:markdown)?\s*/i, "")
      .replace(/```$/, "")
      .trim();

    res.json({ readme: readmeContent, error: null });
  } catch (error) {
    console.error("generatePublicReadme error:", error);
    if (error.message.includes("rate limit")) {
      return res.status(429).json({ readme: null, error: "GitHub API rate limit exceeded" });
    }
    res.status(500).json({ readme: null, error: `Failed to generate README: ${error.message}` });
  }
};
