import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import ReadmeModal from "../components/ReadmeModal";
import {
  ArrowRight,
  Zap,
  Bot,
  Shield,
  FileText,
  Loader2,
  Github,
  AlertCircle,
  Lock,
} from "lucide-react";
import Footer from "../components/Footer";

function Home() {
  const navigate = useNavigate();

  const [repoUrl, setRepoUrl] = useState("");
  const [readmeContent, setReadmeContent] = useState("");
  const [selectedRepoName, setSelectedRepoName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

  const parseGitHubUrl = (url) => {
    try {
      const pattern = /github\.com\/(?:repos\/)?([^\/]+)\/([^\/]+)(?:\.git|$)/i;
      const match = url.match(pattern);
      if (!match) return null;
      return { owner: match[1], repoName: match[2] };
    } catch (_) {
      return null;
    }
  };

 const handleGenerateREADME = async () => {
  setError(null);
  setReadmeContent("");
  setLoading(true);

  const parsed = parseGitHubUrl(repoUrl.trim());
  if (!parsed) {
    setError("Please enter a valid GitHub repository URL, e.g., https://github.com/owner/repo");
    setLoading(false);
    setShowModal(true);
    setSelectedRepoName("");
    setReadmeContent("");
    return;
  }

  const { owner, repoName } = parsed;
  setSelectedRepoName(`${owner}/${repoName}`);
  setShowModal(true);

  try {
  
    const response = await fetch(`${API_BASE_URL}/api/generate-readme`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ owner, repoName }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.readme) {
        setReadmeContent(data.readme);
        return;
      }
    }

   
    const ghRes = await fetch(`https://api.github.com/repos/${owner}/${repoName}`);
    console.log(`Fetching languages from: https://api.github.com/repos/${owner}/${repoName}/languages`);
    
    if (!ghRes.ok) throw new Error("README not found on GitHub or rate limit exceeded");
    const ghData = await ghRes.json();
    const content = window.atob(ghData.content);
    setReadmeContent(`# ${repoName}\n\n${content}`);
  } catch (err) {
    console.error("Error generating README:", err);
    let errorMessage = err.message;
    if (err.message.includes("Failed to fetch")) {
      errorMessage = "Network error. Please check your connection and try again.";
    } else if (err.message.includes("rate limit")) {
      errorMessage = "GitHub API rate limit exceeded. Try again later or use a personal access token.";
    } else if (err.message === "Owner and repo are required") {
      errorMessage = "Invalid repository URL. Please ensure the URL includes both owner and repository name.";
    }
    setReadmeContent(
      `# ${repoName}\n\n## ❌ Error Generating README\n\n**Error:** ${errorMessage}\n\n### Possible Solutions:\n\n1. **Check your internet connection**\n2. **Try again in a few moments** - The service might be temporarily busy\n3. **Use a valid public repository URL**\n4. **Contact support** if the problem persists\n\n---\n\n*This error occurred while trying to generate a README for the repository "${owner}/${repoName}"*`
    );
  } finally {
    setLoading(false);
  }
};

  const copyToClipboard = async () => {
    if (!readmeContent) return;
    try {
      await navigator.clipboard.writeText(readmeContent);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
    }
  };

  const downloadReadme = () => {
    if (!readmeContent) return;
    const blob = new Blob([readmeContent], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${selectedRepoName.split("/")[1]}-README.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex flex-col justify-between relative px-4 overflow-hidden transition-all duration-300`}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <Header />

      <main className="flex-1 text-center max-w-6xl w-full mx-auto pt-24 sm:pt-28 relative z-10">
        <div className="mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 text-transparent bg-clip-text leading-tight">
            Generate Professional READMEs in Seconds
          </h1>
          <p className="text-slate-400 mb-8 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            Leverage AI to create well-structured documentation. Paste any public GitHub repository URL below.
          </p>
        </div>

        <div className="mb-12 sm:mb-16">
          <div className="flex flex-col sm:flex-row items-center justify-center mb-6 gap-3 max-w-3xl mx-auto">
            <div className="relative flex items-center w-full sm:flex-1">
              <Github className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-200 z-10" />
              <input
                type="text"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/owner/repo"
                className="pl-12 pr-4 py-4 rounded-xl bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 text-white w-full focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 text-sm sm:text-base"
                aria-label="GitHub repository URL"
              />
            </div>
            <button
              onClick={handleGenerateREADME}
              disabled={loading}
              className="w-full sm:w-auto bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600 disabled:from-slate-800 disabled:to-slate-800 text-white font-semibold py-4 px-8 rounded-xl flex items-center justify-center transition-all duration-300 border border-slate-600/50 hover:border-slate-500/50 shadow-lg hover:shadow-xl relative disabled:opacity-60 disabled:cursor-not-allowed"
              aria-label="Generate README"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-3 w-5 h-5 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                < >
                  <Zap className="mr-3 w-5 h-5 group-hover:scale-110 transition-transform duration-200 cursor-pointer" />
                  <span className="cursor-pointer">Generate README</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 max-w-2xl mx-auto flex items-center">
              <AlertCircle className="w-5 h-5 text-red-400 mr-3" />
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}
        </div>

        <div className="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 shadow-2xl p-6 sm:p-8 mb-12 sm:mb-16 max-w-2xl mx-auto">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
              <Lock className="w-6 h-6 text-green-400" />
            </div>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold mb-4 text-white">Need Private Repository Access?</h3>
          <p className="text-slate-300 text-sm sm:text-base mb-6 leading-relaxed">
            Login with GitHub to access your <span className="text-green-400 font-semibold">private repositories</span> and generate professional READMEs.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="w-full sm:w-auto bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600 text-white font-semibold py-3 px-8 rounded-xl flex items-center justify-center transition-all duration-300 group border border-slate-600/50 hover:border-slate-500/50 shadow-lg hover:shadow-xl relative overflow-hidden mx-auto disabled:opacity-60"
            aria-label="Connect GitHub Account"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-600/0 via-green-600/0 to-green-600/0 group-hover:from-green-600/10 group-hover:via-green-600/5 group-hover:to-green-600/10 transition-all duration-300 cursor-pointer"></div>
            <Github className="mr-3 w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
            <span className="relative z-10 cursor-pointer">Go to login Page</span>
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto mb-12 sm:mb-16">
          {[
            { icon: Bot, title: "AI-Powered Content", description: "Gemini generates missing file features and usage documentation.", color: "text-purple-400" },
            { icon: Shield, title: "Secure & Private", description: "We use GitHub OAuth and never expose your tokens or private data.", color: "text-green-400" },
            { icon: FileText, title: "Professional Templates", description: "Clean, standardized Markdown output that follows best practices.", color: "text-blue-400" },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-slate-800/30 backdrop-blur-lg rounded-2xl p-6 border border-slate-700/40 shadow-lg hover:scale-105 transition-all duration-300"
            >
              <div className="w-16 h-16 bg-slate-800/50 rounded-2xl flex items-center justify-center mx-auto mb-6 hover:scale-110 transition-transform duration-300">
                <feature.icon className={`w-8 h-8 ${feature.color}`} />
              </div>
              <h3 className="text-lg font-semibold mb-3 text-white">{feature.title}</h3>
              <p className="text-slate-300 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </main>

      {(showModal) && (
        <ReadmeModal
          show={showModal}
          selectedRepo={{ name: selectedRepoName }}
          readmeContent={readmeContent}
          generating={loading}
          error={error}
          onClose={() => {
            setShowModal(false);
            setReadmeContent("");
            setError(null);
          }}
          onCopy={copyToClipboard}
          onDownload={downloadReadme}
          copySuccess={copySuccess}
          setCopySuccess={setCopySuccess}
        />
      )}

      <Footer />
    </div>
  );
}

export default Home;