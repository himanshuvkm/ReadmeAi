import axios from "axios";

export class GitHubService {
  constructor(accessToken = null) {
    this.accessToken = accessToken;
    this.baseURL = "https://api.github.com";
    this.headers = {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "Private-README-Generator/1.0",
    };
    if (accessToken) {
      this.headers.Authorization = `token ${accessToken}`;
    }
  }

  async getUserRepos(perPage = 100) {
    if (perPage < 1 || perPage > 100) throw new Error("perPage must be between 1 and 100");
    try {
      const response = await axios.get(`${this.baseURL}/user/repos`, {
        headers: this.headers,
        params: { sort: "updated", per_page: perPage, visibility: "all" },
      });
     
      return response.data.map((repo) => ({
        id: repo.id,
        name: repo.name,
        full_name: repo.full_name,
        owner: repo.owner?.login || null,
        description: repo.description || "",
        license: repo.license?.name || "No license specified",
        visibility: repo.private ? "Private" : "Public",
        updated_at: repo.updated_at,
        html_url: repo.html_url,
        default_branch: repo.default_branch,
      }));
    } catch (err) {
    throw new Error(`Github request failed: ${err.message}`);
  }
  }

  async getRepoDetails(owner, repo) {
    if (!owner || !repo) throw new Error("Owner and repo are required");
    try {
      const response = await axios.get(`${this.baseURL}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`, {
        headers: this.headers,
      });
      
      return response.data;
    } catch (err) {
    throw new Error(`Github request failed: ${err.message}`);
  }
  }

  async getRepoLanguages(owner, repo) {
    if (!owner || !repo) throw new Error("Owner and repo are required");
    try {
      const response = await axios.get(`${this.baseURL}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/languages`, {
        headers: this.headers,
      });
      
      return response.data;
    } catch (err) {
    throw new Error(`Github request failed: ${err.message}`);
  }
  }

  async getRepoFileTree(owner, repo, branch = null) {
    if (!owner || !repo) throw new Error("Owner and repo are required");
    try {
      const repoDetails = await this.getRepoDetails(owner, repo);
      const targetBranch = branch || repoDetails.default_branch || "main";
      const response = await axios.get(`${this.baseURL}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/git/trees/${encodeURIComponent(targetBranch)}?recursive=1`, {
        headers: this.headers,
      });
      return response.data;
    } catch (err) {
    throw new Error(`Github request failed: ${err.message}`);
  }
  }

  async getFileContent(owner, repo, path) {
    if (!owner || !repo || !path) throw new Error("Owner, repo, and path are required");
    try {
      const response = await axios.get(`${this.baseURL}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents/${encodeURIComponent(path)}`, {
        headers: this.headers,
      });
      const content = response.data?.content ? Buffer.from(response.data.content, "base64").toString("utf8") : "";
      return { data: content, status: "success", sha: response.data?.sha || null };
    } catch (err) {
    throw new Error(`Github request failed: ${err.message}`);
  }
  }
}