// components/Footer.jsx
import React from "react";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full text-white py-8 px-4 relative z-10">
      <div className="max-w-6xl mx-auto text-center">
        {/* Social Icons */}
        <div className="flex justify-center gap-6 mb-4">
          <a
            href="https://github.com/xAI"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-white transition-colors duration-200"
            aria-label="GitHub Profile"
          >
            <Github className="w-6 h-6" />
          </a>
          <a
            href="https://twitter.com/xAI"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-white transition-colors duration-200"
            aria-label="Twitter Profile"
          >
            <Twitter className="w-6 h-6" />
          </a>
          <a
            href="https://linkedin.com/company/xAI"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-white transition-colors duration-200"
            aria-label="LinkedIn Profile"
          >
            <Linkedin className="w-6 h-6" />
          </a>
          <a
            href="mailto:support@x.ai"
            className="text-slate-400 hover:text-white transition-colors duration-200"
            aria-label="Email Support"
          >
            <Mail className="w-6 h-6" />
          </a>
        </div>

        {/* Bottom Text */}
        <p className="text-sm text-slate-400">
          © {new Date().getFullYear()} xAI. All rights reserved. |{" "}
          <a
            href="/privacy"
            className="hover:text-slate-300 transition-colors duration-200"
          >
            Privacy Policy
          </a>{" "}
          |{" "}
          <a
            href="/terms"
            className="hover:text-slate-300 transition-colors duration-200"
          >
            Terms of Service
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
