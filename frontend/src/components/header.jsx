import React from 'react'
import { Github, Star } from 'lucide-react'

function Header() {
  return (
    <header className="fixed top-0 left-0 w-full bg-[#f6f6f1]/85 backdrop-blur-xl px-5 sm:px-8 py-4 flex items-center justify-between z-50 border-b border-[#e4e8e0]">

      <div className="flex items-center space-x-2">
        <div className="w-9 h-9 bg-[#173b29] rounded-xl flex items-center justify-center">
          <span className="text-[#d9edb4] font-bold text-xs tracking-tight">R/</span>
        </div>
        <span className="text-base font-semibold tracking-tight text-[#1b2920]">README<span className="text-emerald-800">.ai</span></span>
      </div>


      <a
        href="https://github.com/himanshuvkm/ReadmeAi"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center space-x-2 text-[#68766d] hover:text-[#173b29] transition-colors duration-200 group"
      >
        <Star className="w-4 h-4 group-hover:text-yellow-400 transition-colors duration-200" />
        <span className="text-sm">Star on GitHub</span>
        <Github className="w-4 h-4" />
      </a>
    </header>
  )
}

export default Header
