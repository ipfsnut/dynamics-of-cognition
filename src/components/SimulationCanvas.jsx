import { useState, useRef, useEffect, useCallback } from 'react';

/**
 * SimulationCanvas - Container for interactive simulations
 * Provides responsive sizing and consistent styling
 * On mobile: Shows preview that expands to fullscreen on tap
 */
export function SimulationCanvas({ 
  title, 
  description, 
  children,
  aspectRatio = 16/10,
  minHeight = 300,
  maxHeight = 500,
}) {
  const containerRef = useRef(null);
  const fullscreenRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 600, height: 375 });
  const [isMobile, setIsMobile] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenDimensions, setFullscreenDimensions] = useState({ 
    width: typeof window !== 'undefined' ? window.innerWidth : 800, 
    height: typeof window !== 'undefined' ? window.innerHeight : 600 
  });

  // Check if device is mobile/tablet
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768 || ('ontouchstart' in window);
      setIsMobile(mobile);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Update regular dimensions
  useEffect(() => {
    const updateDimensions = () => {
      if (!containerRef.current) return;
      
      const containerWidth = containerRef.current.offsetWidth;
      
      // Calculate height based on aspect ratio, clamped to min/max
      let height = containerWidth / aspectRatio;
      height = Math.max(minHeight, Math.min(maxHeight, height));
      
      // On mobile, use a fixed preview height
      if (isMobile) {
        height = Math.min(250, height); // Smaller preview on mobile
      }
      
      setDimensions({
        width: containerWidth,
        height: Math.round(height),
      });
    };

    updateDimensions();
    
    const resizeObserver = new ResizeObserver(updateDimensions);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    
    return () => resizeObserver.disconnect();
  }, [aspectRatio, minHeight, maxHeight, isMobile]);

  // Update fullscreen dimensions
  useEffect(() => {
    const updateFullscreenDimensions = () => {
      // Account for safe areas on mobile
      const safeAreaTop = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sat') || '0');
      const safeAreaBottom = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sab') || '0');
      
      setFullscreenDimensions({
        width: window.innerWidth,
        height: window.innerHeight - safeAreaTop - safeAreaBottom,
      });
    };

    if (isFullscreen) {
      updateFullscreenDimensions();
      window.addEventListener('resize', updateFullscreenDimensions);
      window.addEventListener('orientationchange', updateFullscreenDimensions);
      
      // Prevent body scroll when fullscreen
      document.body.style.overflow = 'hidden';
      
      return () => {
        window.removeEventListener('resize', updateFullscreenDimensions);
        window.removeEventListener('orientationchange', updateFullscreenDimensions);
        document.body.style.overflow = '';
      };
    }
  }, [isFullscreen]);

  // Enter fullscreen mode
  const enterFullscreen = useCallback(() => {
    // Calculate dimensions immediately
    const safeAreaTop = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sat') || '0');
    const safeAreaBottom = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sab') || '0');
    
    setFullscreenDimensions({
      width: window.innerWidth,
      height: window.innerHeight - safeAreaTop - safeAreaBottom,
    });
    
    setIsFullscreen(true);
    
    // Try to use native fullscreen API if available (for better experience)
    if (fullscreenRef.current && fullscreenRef.current.requestFullscreen) {
      fullscreenRef.current.requestFullscreen().catch(() => {
        // Fallback to our fullscreen implementation if native fails
      });
    }
  }, []);

  // Exit fullscreen mode
  const exitFullscreen = useCallback(() => {
    setIsFullscreen(false);
    
    // Exit native fullscreen if active
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
  }, []);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isFullscreen) {
        exitFullscreen();
      }
    };
    
    if (isFullscreen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isFullscreen, exitFullscreen]);

  // Render fullscreen overlay
  if (isFullscreen) {
    return (
      <div 
        ref={fullscreenRef}
        className="fixed inset-0 z-[9999] bg-void flex flex-col simulation-fullscreen"
        style={{ touchAction: 'none' }}
      >
        {/* Fullscreen header */}
        <div className="flex items-center justify-between p-4 border-b border-border/50">
          <div className="flex-1">
            {title && (
              <h4 className="font-display text-lg text-text">{title}</h4>
            )}
            {description && (
              <p className="text-xs text-muted mt-1">{description}</p>
            )}
          </div>
          <button
            onClick={exitFullscreen}
            className="ml-4 p-2 -mr-2 text-muted hover:text-text transition-colors"
            aria-label="Exit fullscreen"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Fullscreen simulation */}
        <div className="flex-1 relative overflow-hidden">
          {fullscreenDimensions.width > 0 && fullscreenDimensions.height > 80 ? (
            children({
              width: fullscreenDimensions.width,
              height: fullscreenDimensions.height - 80, // Account for header
              isMobile,
              isFullscreen: true,
            })
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-muted">Loading...</div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="my-8">
      {/* Header */}
      {(title || description) && !isMobile && (
        <div className="mb-3">
          {title && (
            <h4 className="font-display text-lg text-text mb-1">{title}</h4>
          )}
          {description && (
            <p className="text-sm text-muted">{description}</p>
          )}
        </div>
      )}
      
      {/* Canvas container */}
      <div 
        ref={containerRef}
        className={`simulation-container relative ${isMobile ? 'cursor-pointer' : ''}`}
        style={{ height: dimensions.height }}
        onClick={isMobile ? enterFullscreen : undefined}
      >
        {/* Mobile: Show overlay prompt */}
        {isMobile && (
          <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
            <div className="bg-void/90 backdrop-blur-sm rounded-lg px-4 py-3 flex items-center gap-3 shadow-lg">
              <svg className="w-5 h-5 text-glow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0 0l-5-5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
              <span className="text-sm font-medium text-text">Tap to explore</span>
            </div>
          </div>
        )}
        
        {/* Simulation preview */}
        <div className={isMobile ? 'opacity-50 pointer-events-none' : ''}>
          {children({
            width: dimensions.width,
            height: dimensions.height,
            isMobile,
            isFullscreen: false,
          })}
        </div>
      </div>
      
      {/* Mobile: Show title below */}
      {(title || description) && isMobile && (
        <div className="mt-3">
          {title && (
            <h4 className="font-display text-base text-text mb-1">{title}</h4>
          )}
          {description && (
            <p className="text-xs text-muted">{description}</p>
          )}
        </div>
      )}
    </div>
  );
}
