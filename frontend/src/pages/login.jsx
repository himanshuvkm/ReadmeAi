// pages/Login.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Github, Shield, Lock, User, GitBranch, Eye, ArrowRight, CheckCircle } from "lucide-react";
import Header from "../components/header";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();

 const { loginWithGitHub } = useAuth();

  const handlePublicAccess = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center text-white relative px-4 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <Header />
      
      {/* Main Content */}
      <main className="text-center w-full max-w-lg relative z-10">
        <h1 className="text-4xl font-bold mb-4">
          Connect Your GitHub Account
        </h1>

        <p className="text-gray-400 mb-8">
          This application requires access to certain information from your
          GitHub account to function properly.
        </p>

        <div className="bg-gray-800 p-6 rounded-lg mb-6 text-left">
          <h2 className="text-lg font-semibold mb-4">Required permissions</h2>
          <ul className="space-y-2">
            <li className="flex items-center">
              <CheckCircle className="text-green-500 mr-2 w-4 h-4" />
              Read access to private repositories
            </li>
            <li className="flex items-center">
              <CheckCircle className="text-green-500 mr-2 w-4 h-4" />
              Read access to user profile information (email)
            </li>
            <li className="flex items-center">
              <CheckCircle className="text-green-500 mr-2 w-4 h-4" />
              Read access to repository metadata (branches, commits, pulls)
            </li>
          </ul>
        </div>

        <p className="text-gray-400 mb-8">
          Your private data remains secure. We only access the information
          necessary for the application's core features.
        </p>

          <button
            onClick={loginWithGitHub}
            className="w-full bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600 text-white font-semibold py-4 px-6 rounded-xl flex items-center justify-center transition-all duration-300 group border border-slate-600/50 hover:border-slate-500/50 shadow-lg hover:shadow-xl mb-6 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-600/0 to-purple-600/0 group-hover:from-purple-600/10 group-hover:via-purple-600/5 group-hover:to-purple-600/10 transition-all duration-300"></div>
            <Github className="mr-3 w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
            <span className="relative z-10">Authorize with GitHub</span>
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
          </button>
        
        <p className="text-gray-400">
          Only want to access public repositories?{" "}
          <button 
            onClick={handlePublicAccess}
            className="text-blue-400 hover:text-blue-300 underline cursor-pointer"
          >
            Click here
          </button>{" "}
          to proceed without authorization.
        </p>
      </main>

      {/* Footer */}
      <footer className="absolute bottom-2 sm:bottom-4 text-gray-500 text-xs sm:text-sm text-center w-full px-4">
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-1 sm:mb-2">
          <a href="#" className="hover:text-gray-400">About Us</a>
          <a href="#" className="hover:text-gray-400">Contact</a>
          <a href="#" className="hover:text-gray-400">Terms of Service</a>
          <a href="#" className="hover:text-gray-400">Privacy Policy</a>
        </div>
        <p>&copy; 2025 README Generator</p>
      </footer>
    </div>
  );
}

export default Login;