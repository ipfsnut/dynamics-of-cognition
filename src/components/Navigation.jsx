import { useState } from 'react';
import { SECTIONS } from '../data/sections';

/**
 * Navigation - Sidebar navigation for section pages
 */
export function Navigation({ currentSection, onNavigate, onReadPaper }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  
  return (
    <>
      {/* Mobile header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-void/95 backdrop-blur border-b border-border">
        <div className="flex items-center justify-between px-4 h-14">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 -ml-2 text-muted hover:text-text"
            aria-label="Open menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <span className="font-display text-sm text-muted truncate px-4">
            {currentSection?.title || 'Dynamics of Cognition'}
          </span>
          
          <button
            onClick={onReadPaper}
            className="p-2 -mr-2 text-muted hover:text-glow"
            aria-label="Read paper"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <nav className={`
        fixed top-0 left-0 bottom-0 z-50 w-72 bg-void border-r border-border
        transform transition-transform duration-300 ease-out
        lg:translate-x-0
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo / Title */}
          <div className="p-6 border-b border-border">
            <h1 className="font-display text-lg text-text leading-tight">
              Dynamics of Cognition
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-muted font-mono">
                v0.1 · Working Draft
              </span>
              <span className="text-xs px-2 py-0.5 bg-glow/20 text-glow rounded-full font-mono">
                BETA
              </span>
            </div>
          </div>

          {/* Section links */}
          <div className="flex-1 overflow-y-auto py-4 px-3">
            <div className="space-y-1">
              {SECTIONS.map((section) => {
                const isActive = currentSection?.id === section.id;
                
                return (
                  <button
                    key={section.id}
                    onClick={() => {
                      onNavigate(section);
                      setMobileOpen(false);
                    }}
                    className={`nav-link w-full text-left ${isActive ? 'active' : ''}`}
                  >
                    <span className="nav-number">
                      {section.number ? section.number.toString().padStart(2, '0') : '·'}
                    </span>
                    <span className="truncate">{section.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Paper link */}
          <div className="p-4 border-t border-border">
            <button
              onClick={onReadPaper}
              className="btn btn-ghost w-full"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Read Full Paper
            </button>
          </div>
        </div>
        
        {/* Close button (mobile) */}
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden absolute top-4 right-4 p-2 text-muted hover:text-text"
          aria-label="Close menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </nav>
    </>
  );
}
