import { useState, useRef, useEffect } from 'react';

/**
 * SimulationCanvas - Container for interactive simulations
 * Provides responsive sizing and consistent styling
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
  const [dimensions, setDimensions] = useState({ width: 600, height: 375 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateDimensions = () => {
      if (!containerRef.current) return;
      
      const containerWidth = containerRef.current.offsetWidth;
      const mobile = containerWidth < 500;
      setIsMobile(mobile);
      
      // Calculate height based on aspect ratio, clamped to min/max
      let height = containerWidth / aspectRatio;
      height = Math.max(minHeight, Math.min(maxHeight, height));
      
      // On mobile, prefer a bit more vertical space
      if (mobile) {
        height = Math.min(height * 1.1, maxHeight);
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
  }, [aspectRatio, minHeight, maxHeight]);

  return (
    <div className="my-8">
      {/* Header */}
      {(title || description) && (
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
        className="simulation-container"
        style={{ height: dimensions.height }}
      >
        {children({
          width: dimensions.width,
          height: dimensions.height,
          isMobile,
        })}
      </div>
    </div>
  );
}
