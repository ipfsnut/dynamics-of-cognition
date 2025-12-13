// Utility functions for simulations

/**
 * Calculate a scale factor for mobile responsiveness
 * @param {number} width - Current canvas width
 * @param {number} baseWidth - Reference width (usually 600-800)
 * @returns {number} Scale factor (clamped between 0.5 and 1)
 */
export function getScale(width, baseWidth = 600) {
  return Math.max(0.5, Math.min(1, width / baseWidth));
}

/**
 * Check if the current viewport is mobile-sized
 * @param {number} width - Current canvas width
 * @returns {boolean}
 */
export function isMobileWidth(width) {
  return width < 500;
}

/**
 * Safe hex alpha - ensures alpha values are clamped and formatted correctly
 * @param {number} alpha - Alpha value (0-1 or 0-255)
 * @param {boolean} isNormalized - If true, alpha is 0-1; if false, 0-255
 * @returns {string} Two-character hex string
 */
export function safeHexAlpha(alpha, isNormalized = true) {
  const value = isNormalized ? alpha * 255 : alpha;
  const clamped = Math.max(0, Math.min(255, Math.floor(value)));
  return clamped.toString(16).padStart(2, '0');
}
