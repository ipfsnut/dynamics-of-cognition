/**
 * ConfidentialBanner - Persistent pre-publication notice
 * 
 * Displays a subtle but visible reminder that this content
 * is not yet public and should not be shared.
 */
export function ConfidentialBanner() {
  return (
    <div className="confidential-banner">
      <span className="confidential-icon">◈</span>
      <span className="confidential-text">
        PRE-PUBLICATION — NOT FOR DISTRIBUTION
      </span>
      <span className="confidential-icon">◈</span>
    </div>
  );
}
