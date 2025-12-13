import { useState, useEffect } from 'react';

/**
 * CollapsiblePanel - Minimizable UI panel for simulations
 * 
 * Use this to wrap info boxes, control panels, etc. so users
 * can minimize them to see the full simulation canvas.
 * Adapts to fullscreen mode with larger touch targets on mobile.
 */
export function CollapsiblePanel({ 
  title, 
  children, 
  defaultOpen = true, 
  position = 'top-left',
  className = '',
  width = 'max-w-xs',
  isFullscreen = false
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || ('ontouchstart' in window));
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Adjust position for fullscreen mode
  const positionClasses = isFullscreen ? {
    'top-left': 'top-16 left-4',     // Account for fullscreen header
    'top-right': 'top-16 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
  } : {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
  };
  
  // Larger touch targets on mobile
  const buttonSize = isMobile ? 'w-12 h-12' : 'w-8 h-8';
  const iconSize = isMobile ? 'w-6 h-6' : 'w-4 h-4';
  
  if (!isOpen) {
    return (
      <div className={`absolute ${positionClasses[position]} z-10`}>
        <button
          onClick={() => setIsOpen(true)}
          className={`bg-void/90 backdrop-blur-sm rounded ${buttonSize} flex items-center justify-center text-muted hover:text-glow transition-colors`}
          title={`Show ${title || 'panel'}`}
        >
          <svg className={iconSize} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    );
  }
  
  return (
    <div className={`absolute ${positionClasses[position]} z-10`}>
      <div className={`bg-void/90 backdrop-blur-sm rounded ${isMobile ? 'p-4' : 'p-3'} ${isMobile ? 'text-sm' : 'text-xs'} ${width} relative ${className}`}>
        <button
          onClick={() => setIsOpen(false)}
          className={`absolute ${isMobile ? 'top-2 right-2 w-8 h-8' : 'top-1.5 right-1.5 w-5 h-5'} flex items-center justify-center text-muted hover:text-text transition-colors rounded hover:bg-white/10`}
          title="Minimize"
        >
          <svg className={isMobile ? 'w-4 h-4' : 'w-3 h-3'} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>
        {title && <div className={`font-mono text-glow ${isMobile ? 'mb-2 pr-10' : 'mb-1 pr-5'}`}>{title}</div>}
        {children}
      </div>
    </div>
  );
}

/**
 * CollapsibleControlPanel - Larger panel variant for controls
 * Has more padding and a fixed width suitable for sliders/inputs
 */
export function CollapsibleControlPanel({
  title,
  children,
  defaultOpen = true,
  position = 'bottom-left',
  panelWidth = 'w-64',
  isFullscreen = false
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || ('ontouchstart' in window));
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Adjust position for fullscreen mode
  const positionClasses = isFullscreen ? {
    'top-left': 'top-16 left-4',     // Account for fullscreen header
    'top-right': 'top-16 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
  } : {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
  };
  
  // Mobile responsive panel width
  const responsivePanelWidth = isMobile ? 'w-80 max-w-[calc(100vw-2rem)]' : panelWidth;
  const buttonSize = isMobile ? 'w-12 h-12' : 'w-8 h-8';
  const iconSize = isMobile ? 'w-6 h-6' : 'w-4 h-4';
  
  if (!isOpen) {
    return (
      <div className={`absolute ${positionClasses[position]} z-10`}>
        <button
          onClick={() => setIsOpen(true)}
          className={`bg-void/90 backdrop-blur-sm rounded ${buttonSize} flex items-center justify-center text-muted hover:text-glow transition-colors`}
          title={`Show ${title || 'controls'}`}
        >
          <svg className={iconSize} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
        </button>
      </div>
    );
  }
  
  return (
    <div className={`absolute ${positionClasses[position]} z-10`}>
      <div className={`bg-void/90 backdrop-blur-sm rounded ${isMobile ? 'p-5' : 'p-4'} ${responsivePanelWidth} relative`}>
        <button
          onClick={() => setIsOpen(false)}
          className={`absolute ${isMobile ? 'top-3 right-3 w-8 h-8' : 'top-2 right-2 w-5 h-5'} flex items-center justify-center text-muted hover:text-text transition-colors rounded hover:bg-white/10`}
          title="Minimize"
        >
          <svg className={isMobile ? 'w-4 h-4' : 'w-3 h-3'} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>
        {title && (
          <div className={`font-mono ${isMobile ? 'text-sm' : 'text-xs'} text-muted ${isMobile ? 'mb-3 pr-12' : 'mb-2 pr-8'}`}>{title}</div>
        )}
        {children}
      </div>
    </div>
  );
}
