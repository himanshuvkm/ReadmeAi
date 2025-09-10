import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ReadmeModal from "../components/ReadmeModal";
import {
  LogOut,
  Lock,
  Globe,
  AlertCircle,
  Loader2,
  GitBranch,
  Star,
  Eye,
  RefreshCw,
} from "lucide-react";
import axios from "axios";

function Dashboard() {
  const { user, token, logout ,githubToken } = useAuth(); 
  const navigate = useNavigate();
  const [repos, setRepos] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [readmeContent, setReadmeContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

useEffect(() => {
  const fetchRepos = async () => {
    try {
      setLoading(true);
      setError(null);

      const reposResponse = await axios.get(`${API_BASE_URL}/api/repos`, {
        headers: {
          Authorization: `Bearer ${token}`, 
          "x-github-token": githubToken,    
        },
        withCredentials: true,
      });

      const reposData = reposResponse.data;

      if (Array.isArray(reposData)) {
        console.log("Repos data received:", reposData);
        setRepos(reposData);
      } else {
        console.error("Unexpected repos response:", reposData);
        setRepos([]);
      }
    } catch (error) {
      console.error("Error fetching repos:", error);
      if (error.response?.status === 401) {
        await logout();
        navigate("/login");
        return;
      }
      setError(error.message || "Failed to fetch repositories");
      setRepos([]);
    } finally {
      setLoading(false);
    }
  };

  if (token && githubToken) fetchRepos(); 
}, [token, githubToken, logout, navigate]);

 const generateReadme = async (repo) => {
  setGenerating(true);
  try {
    const owner = repo.owner; 
    const repoName = repo.name;

    if (!owner || !repoName) {
      throw new Error(`Repository owner or name is missing. Owner: ${owner}, RepoName: ${repoName}`);
    }

    console.log("Generating README for:", { owner, repoName });

    const response = await axios.post(
      `${API_BASE_URL}/api/generate-readme-private`,
      { owner, repoName },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "x-github-token": githubToken,
        },
        withCredentials: true,
      }
    );

    const data = response.data;
    setReadmeContent(data.readme);
  } catch (error) {
    console.error("Error generating README:", error);

    let errorMessage =
      error.response?.data?.message || error.message || "Failed to generate README";

    if (error.message.includes("Failed to fetch")) {
      errorMessage =
        "Network error. Please check your connection and try again.";
    }

    const repoName = repo.name || "Unknown";
    const owner = repo.owner || "Unknown";

    setReadmeContent(
      `# ${repoName}\n\n## ❌ Error Generating README\n\n**Error:** ${errorMessage}\n\n### Possible Solutions:\n\n1. **Check your internet connection**\n2. **Try again later**\n3. **Verify repository access**\n4. **Contact support**\n\n---\n\n*This error occurred while trying to generate a README for "${owner}/${repoName}"*`
    );
  } finally {
    setGenerating(false);
  }
};


  const handleRepoClick = (repo) => {
    setSelectedRepo(repo);
    setReadmeContent("");
    generateReadme(repo);
  };

  const handleModalClose = () => {
    setSelectedRepo(null);
    setReadmeContent("");
    setGenerating(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="text-center relative z-10">
          <div className="flex items-center justify-center mb-6">
            <Loader2 className="animate-spin h-12 w-12 text-blue-500" />
          </div>
          <p className="text-white text-lg font-medium">
            Loading your repositories...
          </p>
          <p className="text-slate-400 text-sm mt-2">
            Please wait while we fetch your GitHub data
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center relative overflow-hidden px-4">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="text-center text-white max-w-md relative z-10">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
          <p className="text-red-400 mb-8 bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            {error}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="w-full sm:w-auto bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600 text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center transition-all duration-300 group border border-slate-600/50 hover:border-slate-500/50 shadow-lg hover:shadow-xl relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-600/0 to-blue-600/0 group-hover:from-blue-600/10 group-hover:via-blue-600/5 group-hover:to-blue-600/10 transition-all duration-300"></div>
              <Refresh className="mr-3 w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
              <span className="relative z-10">Retry</span>
            </button>

            <button
              onClick={handleLogout}
              className="w-full sm:w-auto bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600 text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center transition-all duration-300 group border border-slate-600/50 hover:border-slate-500/50 shadow-lg hover:shadow-xl relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-600/0 via-red-600/0 to-red-600/0 group-hover:from-red-600/10 group-hover:via-red-600/5 group-hover:to-red-600/10 transition-all duration-300"></div>
              <LogOut className="mr-3 w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
              <span className="relative z-10">Logout</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

   return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 p-4 sm:p-6 lg:p-8">
        {/* Profile Section */}
        {user && (
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 shadow-2xl p-6">
            <div className="flex items-center mb-4 sm:mb-0">
                <div className="relative">
                    <img
                    src={user.avatar || 'https://github.com/identicons/default.png'}
                    alt="Avatar"
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-full mr-4 sm:mr-6 border-2 border-white/20"
                    />
                    <div className="absolute -bottom-1 left-11 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900"></div>
                </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                  {user.username || user.displayName}
                </h2>
                <p className="text-slate-300 text-sm sm:text-base">Welcome back to your dashboard!</p>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="w-full sm:w-auto bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600 text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center transition-all duration-300 group border border-slate-600/50 hover:border-slate-500/50 shadow-lg hover:shadow-xl relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-600/0 via-red-600/0 to-red-600/0 group-hover:from-red-600/10 group-hover:via-red-600/5 group-hover:to-red-600/10 transition-all duration-300"></div>
              <LogOut className="mr-3 w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
              <span className="relative z-10">Logout</span>
            </button>
          </div>
        )}

        {/* Repository Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {repos.length > 0 ? (
            repos.map((repo) => (
              <div
                key={repo.id}
                onClick={() => handleRepoClick(repo)}
                className="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 shadow-xl p-6 cursor-pointer hover:bg-white/20 transition-all duration-300 group hover:scale-105 hover:shadow-2xl"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <GitBranch className="w-5 h-5 text-blue-400 mr-2 flex-shrink-0" />
                    <h3 className="text-lg font-semibold text-white truncate group-hover:text-purple-200 transition-colors">
                      {repo.name}
                    </h3>
                  </div>
                  {repo.visibility === 'Private' ? (
                    <Lock className="w-4 h-4 text-red-400 flex-shrink-0" />
                  ) : (
                    <Globe className="w-4 h-4 text-green-400 flex-shrink-0" />
                  )}
                </div>
                
                <p className="text-slate-300 text-sm mb-4 line-clamp-2">
                  {repo.description || 'No description available'}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    repo.visibility === 'Private' 
                      ? 'bg-red-500/20 text-red-300 border border-red-500/30' 
                      : 'bg-green-500/20 text-green-300 border border-green-500/30'
                  }`}>
                    {repo.visibility === 'Private' ? (
                      <>
                        <Lock className="w-3 h-3 mr-1" />
                        Private
                      </>
                    ) : (
                      <>
                        <Globe className="w-3 h-3 mr-1" />
                        Public
                      </>
                    )}
                  </span>
                  
                  <div className="flex items-center text-slate-400 text-xs">
                    <Eye className="w-3 h-3 mr-1" />
                    <span>{repo.owner}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full">
              <div className="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 shadow-2xl p-8 text-center">
                <div className="w-20 h-20 bg-slate-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <GitBranch className="w-10 h-10 text-slate-400" />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-4">No repositories found</h3>
                <p className="text-slate-400 text-base mb-6">
                  We couldn't find any repositories in your GitHub account.
                </p>
                
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-8">
                  <p className="text-blue-200 text-sm mb-3 font-medium">This could mean:</p>
                  <ul className="text-blue-200 text-sm space-y-2 text-left max-w-md mx-auto">
                    <li className="flex items-start">
                      <span className="text-blue-400 mr-2">•</span>
                      You don't have any repositories yet
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-400 mr-2">•</span>
                      There was an issue loading your repositories
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-400 mr-2">•</span>
                      Your GitHub token may have expired
                    </li>
                  </ul>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => window.location.reload()}
                    className="w-full sm:w-auto bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600 text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center transition-all duration-300 group border border-slate-600/50 hover:border-slate-500/50 shadow-lg hover:shadow-xl relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-600/0 to-blue-600/0 group-hover:from-blue-600/10 group-hover:via-blue-600/5 group-hover:to-blue-600/10 transition-all duration-300"></div>
                    <Refresh className="mr-3 w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                    <span className="relative z-10">Refresh</span>
                  </button>
                  
                  <button
                    onClick={handleLogout}
                    className="w-full sm:w-auto bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600 text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center transition-all duration-300 group border border-slate-600/50 hover:border-slate-500/50 shadow-lg hover:shadow-xl relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-red-600/0 via-red-600/0 to-red-600/0 group-hover:from-red-600/10 group-hover:via-red-600/5 group-hover:to-red-600/10 transition-all duration-300"></div>
                    <LogOut className="mr-3 w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                    <span className="relative z-10">Logout</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* README Modal Component */}
      <ReadmeModal
        selectedRepo={selectedRepo}
        readmeContent={readmeContent}
        generating={generating}
        onClose={handleModalClose}
      />
    </div>
  );
}

export default Dashboard;
