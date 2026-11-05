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
  const [showModal, setShowModal] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://readmegen-vert.vercel.app";

  const parseGitHubUrl = (url) => {
    try {
      const parsedUrl = new URL(url);
      if (parsedUrl.hostname.toLowerCase() !== "github.com") return null;
      const segments = parsedUrl.pathname.split("/").filter(Boolean);
      const [owner, rawRepoName] = segments[0]?.toLowerCase() === "repos"
        ? segments.slice(1, 3)
        : segments;
      if (!owner || !rawRepoName) return null;
      const repoName = rawRepoName.replace(/\.git$/i, "");
      return repoName ? { owner, repoName } : null;
    } catch {
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

  return (
    <div className="min-h-screen bg-[#f6f6f1] text-[#18231d] flex flex-col relative overflow-hidden selection:bg-emerald-200">
      <Header />

      <main className="flex-1 max-w-6xl w-full mx-auto px-5 sm:px-8 pt-32 sm:pt-40 relative z-10">
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-900/10 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-800 mb-8 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            From repository to README
          </div>
          <h1 className="max-w-4xl mx-auto text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-[-0.055em] mb-6 leading-[1.02] text-[#17221b]">
            Good projects deserve <span className="text-emerald-700">clear docs.</span>
          </h1>
          <p className="text-[#66736a] mb-8 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            Turn a GitHub repository into a thoughtful, editable README. Start with any public project URL.
          </p>
        </div>

        <div className="mb-16 sm:mb-24">
          <div className="flex flex-col sm:flex-row items-center justify-center mb-4 gap-3 max-w-3xl mx-auto rounded-2xl bg-white p-2 border border-[#dfe5dd] shadow-[0_20px_70px_-35px_rgba(26,57,37,.3)]">
            <div className="relative flex items-center w-full sm:flex-1">
              <Github className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#819087] z-10" />
              <input
                type="text"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/owner/repo"
                onKeyDown={(event) => event.key === "Enter" && handleGenerateREADME()}
                className="pl-12 pr-4 py-4 rounded-xl bg-transparent text-[#1b2920] placeholder:text-[#9aa59c] w-full focus:outline-none text-sm sm:text-base"
                aria-label="GitHub repository URL"
              />
            </div>
            <button
              onClick={handleGenerateREADME}
              disabled={loading}
              className="w-full sm:w-auto bg-[#173b29] hover:bg-[#205237] text-white font-semibold py-4 px-7 rounded-xl flex items-center justify-center transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
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
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 max-w-2xl mx-auto flex items-center text-left">
              <AlertCircle className="w-5 h-5 text-red-600 mr-3 shrink-0" />
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}
        </div>

        <div className="bg-[#e9eee6] rounded-3xl border border-[#dce4d9] p-7 sm:p-9 mb-16 sm:mb-24 max-w-3xl mx-auto text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
              <Lock className="w-5 h-5 text-emerald-800" />
            </div>
          </div>
          <h3 className="text-xl sm:text-2xl font-semibold tracking-tight mb-3 text-[#1b2920]">Working on a private repository?</h3>
          <p className="text-[#66736a] text-sm sm:text-base mb-6 leading-relaxed max-w-xl mx-auto">
            Connect GitHub to browse your repositories and generate documentation from your private projects.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="group w-full sm:w-auto bg-white hover:bg-[#f8faf7] text-[#1b3928] font-semibold py-3 px-6 rounded-xl flex items-center justify-center transition-all duration-200 border border-[#cfdbd0] shadow-sm mx-auto"
            aria-label="Connect GitHub Account"
          >
            <Github className="mr-3 w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
            <span className="relative z-10">Connect GitHub</span>
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5 max-w-5xl mx-auto mb-20 sm:mb-28">
          {[
            { icon: Bot, title: "Grounded in your code", description: "README content is shaped by repository metadata and its file structure.", color: "text-emerald-800", number: "01" },
            { icon: Shield, title: "Your repos, your access", description: "Use public repositories directly or connect GitHub for private projects.", color: "text-emerald-800", number: "02" },
            { icon: FileText, title: "Ready to refine", description: "Preview the Markdown, copy it, or download it as README.md.", color: "text-emerald-800", number: "03" },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-white/70 rounded-2xl p-6 sm:p-7 border border-[#e3e8df] shadow-[0_10px_40px_-30px_rgba(26,57,37,.35)] hover:-translate-y-1 transition-all duration-200 text-left"
            >
              <div className="flex items-center justify-between mb-8">
                <feature.icon className={`w-8 h-8 ${feature.color}`} />
                <span className="text-xs font-mono text-[#98a49b]">{feature.number}</span>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-[#1b2920]">{feature.title}</h3>
              <p className="text-[#6c786f] text-sm leading-relaxed">{feature.description}</p>
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
          
        />
      )}

      <Footer />
    </div>
  );
}

export default Home;
