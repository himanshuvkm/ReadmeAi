// components/ReadmeModal.jsx
import React, { useState, useEffect } from 'react';
import MarkdownPreview from './MarkdownPreview';
import { X, Copy, Download, Eye, FileText, Check, Loader2, AlertCircle } from 'lucide-react';

// Accept extra props for Home modal compatibility
const ReadmeModal = ({ 
  selectedRepo, 
  readmeContent, 
  generating, 
  onClose, 
  show, // for Home page
  error, // for Home page
  onCopy, 
  onDownload, 
  copySuccess, 
  setCopySuccess 
}) => {
  const [internalCopySuccess, setInternalCopySuccess] = useState(false);
  const [viewMode, setViewMode] = useState('raw'); // 'raw' or 'preview'
  const copyState = typeof copySuccess === 'boolean' ? copySuccess : internalCopySuccess;
  const setCopyState = setCopySuccess || setInternalCopySuccess;

  const copyToClipboard = async () => {
    if (onCopy) return onCopy();
    
    try {
      await navigator.clipboard.writeText(readmeContent);
      setCopyState(true);
      setTimeout(() => setCopyState(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = readmeContent;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopyState(true);
        setTimeout(() => setCopyState(false), 2000);
      } catch (fallbackError) {
        console.error('Fallback copy failed:', fallbackError);
      }
      document.body.removeChild(textArea);
    }
  };

  const downloadReadme = () => {
    if (onDownload) return onDownload();
    
    const blob = new Blob([readmeContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${selectedRepo.name}-README.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Only show modal if selectedRepo or show is true
  if (!selectedRepo && !show) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 shadow-2xl w-full max-w-6xl flex flex-col" style={{ height: '90vh' }}>
        {/* Header - Fixed */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 sm:p-6 border-b border-white/20 flex-shrink-0 gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-blue-400" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              {selectedRepo.name}
              <span className="text-slate-400 font-normal text-base sm:text-lg ml-2">README</span>
            </h3>
            
            {/* View Mode Toggle */}
            {!generating && readmeContent && (
              <div className="hidden sm:flex bg-slate-800/50 rounded-xl p-1 border border-slate-700/50">
                <button
                  onClick={() => setViewMode('raw')}
                  className={`px-4 py-2 text-sm rounded-lg transition-all duration-200 flex items-center gap-2 ${
                    viewMode === 'raw' 
                      ? 'bg-blue-500 text-white shadow-lg' 
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  Raw
                </button>
                <button
                  onClick={() => setViewMode('preview')}
                  className={`px-4 py-2 text-sm rounded-lg transition-all duration-200 flex items-center gap-2 ${
                    viewMode === 'preview' 
                      ? 'bg-blue-500 text-white shadow-lg' 
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  <Eye className="w-4 h-4" />
                  Preview
                </button>
              </div>
            )}
          </div>
          
          <button
            onClick={onClose}
            className="w-10 h-10 bg-slate-800/50 hover:bg-slate-700/50 rounded-xl flex items-center justify-center transition-colors duration-200 border border-slate-700/50 hover:border-slate-600/50 self-end sm:self-auto"
          >
            <X className="w-5 h-5 text-slate-400 hover:text-white transition-colors" />
          </button>
        </div>

        {/* Mobile View Mode Toggle */}
        {!generating && readmeContent && (
          <div className="flex sm:hidden bg-slate-800/50 rounded-xl p-1 border border-slate-700/50 mx-4 mb-4">
            <button
              onClick={() => setViewMode('raw')}
              className={`flex-1 py-2 text-sm rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                viewMode === 'raw' 
                  ? 'bg-blue-500 text-white shadow-lg' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <FileText className="w-4 h-4" />
              Raw
            </button>
            <button
              onClick={() => setViewMode('preview')}
              className={`flex-1 py-2 text-sm rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                viewMode === 'preview' 
                  ? 'bg-blue-500 text-white shadow-lg' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Eye className="w-4 h-4" />
              Preview
            </button>
          </div>
        )}
        
        {generating ? (
          <div className="flex justify-center items-center flex-1 p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Loader2 className="animate-spin h-8 w-8 text-blue-400" />
              </div>
              <h4 className="text-xl font-semibold text-white mb-2">Generating README with AI</h4>
              <p className="text-slate-300 mb-4">Please wait while we create your documentation...</p>
              
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 max-w-md mx-auto">
                <p className="text-blue-200 text-sm">
                  This process typically takes 10-30 seconds depending on repository complexity
                </p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Content - Scrollable */}
            <div className="flex-1 p-4 sm:p-6 overflow-hidden">
              <div className="h-full overflow-y-auto overflow-x-auto rounded-xl border border-slate-700/50" 
                   style={{ background: viewMode === 'preview' ? '#0d1117' : 'rgba(15, 23, 42, 0.8)' }}>
                {viewMode === 'raw' ? (
                  <pre className="text-slate-300 whitespace-pre-wrap p-4 sm:p-6 text-sm min-h-full font-mono leading-relaxed">
                    {readmeContent}
                  </pre>
                ) : (
                  <div className="p-4 sm:p-6">
                    <MarkdownPreview content={readmeContent} />
                  </div>
                )}
              </div>
            </div>
            
            {/* Footer - Fixed */}
            <div className="flex flex-col sm:flex-row gap-3 p-4 sm:p-6 border-t border-white/20 flex-shrink-0">
              <div className="flex flex-col sm:flex-row gap-3 flex-1">
                <button
                  onClick={copyToClipboard}
                  className="w-full sm:w-auto bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600 text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center transition-all duration-300 group border border-slate-600/50 hover:border-slate-500/50 shadow-lg hover:shadow-xl relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-600/0 to-blue-600/0 group-hover:from-blue-600/10 group-hover:via-blue-600/5 group-hover:to-blue-600/10 transition-all duration-300"></div>
                  {copyState ? (
                    <>
                      <Check className="mr-3 w-5 h-5 text-green-400 group-hover:scale-110 transition-transform duration-200" />
                      <span className="relative z-10">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="mr-3 w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                      <span className="relative z-10">Copy to Clipboard</span>
                    </>
                  )}
                </button>
                
                <button
                  onClick={downloadReadme}
                  className="w-full sm:w-auto bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600 text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center transition-all duration-300 group border border-slate-600/50 hover:border-slate-500/50 shadow-lg hover:shadow-xl relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-600/0 via-green-600/0 to-green-600/0 group-hover:from-green-600/10 group-hover:via-green-600/5 group-hover:to-green-600/10 transition-all duration-300"></div>
                  <Download className="mr-3 w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                  <span className="relative z-10">Download README.md</span>
                </button>
              </div>
              
              {/* View mode indicator */}
              <div className="hidden lg:flex items-center text-slate-400 text-sm bg-slate-800/30 px-4 py-3 rounded-xl border border-slate-700/50">
                {viewMode === 'preview' ? (
                  <>
                    <Eye className="w-4 h-4 mr-2" />
                    GitHub Preview
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4 mr-2" />
                    Raw Markdown
                  </>
                )}
              </div>
              
              <button
                onClick={onClose}
                className="w-full sm:w-auto bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600 text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center transition-all duration-300 group border border-slate-600/50 hover:border-slate-500/50 shadow-lg hover:shadow-xl relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-slate-600/0 via-slate-600/0 to-slate-600/0 group-hover:from-slate-600/10 group-hover:via-slate-600/5 group-hover:to-slate-600/10 transition-all duration-300"></div>
                <X className="mr-3 w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                <span className="relative z-10">Close</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReadmeModal;