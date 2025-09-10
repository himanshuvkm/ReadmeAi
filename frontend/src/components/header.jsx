import React from 'react'
import { Github, Star } from 'lucide-react'

function Header() {
  return (
    <header className="fixed top-0 left-0 w-full bg-gradient-to-r from-slate-900/80 to-purple-900/50 backdrop-blur-sm  px-6 py-4 flex items-center justify-between z-50">

      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 text-transparent bg-clip-text leading-tight rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">AI</span>
        </div>
        <span className="text-lg font-semibold text-blue-400">README.ai</span>
      </div>


      <a
        href="https://github.com/himanshuvkm/Readme-Generator"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center space-x-2 text-gray-400 hover:text-gray-200 transition-colors duration-200 group"
      >
        <Star className="w-4 h-4 group-hover:text-yellow-400 transition-colors duration-200" />
        <span className="text-sm">Star on GitHub</span>
        <Github className="w-4 h-4" />
      </a>
    </header>
  )
}

export default Header
