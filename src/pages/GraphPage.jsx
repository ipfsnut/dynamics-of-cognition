import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import VaultGraph from '../components/graph/VaultGraph';
import { buildGraphData } from '../utils/vaultParser';

export default function GraphPage() {
  const [vaultData, setVaultData] = useState(null);
  const [graphData, setGraphData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadVaultData = async () => {
      try {
        // Import the vault manifest
        const manifestModule = await import('../data/vault-manifest.json');
        const manifest = manifestModule.default;
        
        setVaultData(manifest);
        setGraphData(manifest.graph);
        setLoading(false);
      } catch (err) {
        console.error('Failed to load vault data:', err);
        setError('Failed to load knowledge graph data');
        setLoading(false);
      }
    };

    loadVaultData();
  }, []);

  const handleNodeClick = (nodeId) => {
    // Navigate to vault note page
    navigate(`/vault/${nodeId}`);
  };

  const handleBackToPaper = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-secondary">Loading knowledge graph...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold mb-2">Error Loading Graph</h1>
          <p className="text-secondary mb-4">{error}</p>
          <button 
            onClick={handleBackToPaper}
            className="px-4 py-2 bg-accent text-background rounded hover:bg-accent/80 transition-colors"
          >
            Back to Paper
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border bg-surface/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBackToPaper}
                className="flex items-center gap-2 text-sm text-secondary hover:text-foreground transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Paper
              </button>
              <h1 className="text-xl font-semibold text-foreground">Knowledge Graph</h1>
            </div>
            
            <div className="text-sm text-secondary">
              {vaultData?.stats?.totalNotes} notes • {vaultData?.stats?.totalLinks} connections
            </div>
          </div>
        </div>
      </div>

      {/* Graph Container */}
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Description */}
          <div className="mb-6 text-center max-w-3xl mx-auto">
            <p className="text-secondary leading-relaxed">
              Interactive visualization of the theoretical concepts and research in the Dynamics of Cognition project. 
              Each node represents a note, with connections showing relationships through wiki-links. 
              Click nodes to explore individual concepts.
            </p>
          </div>

          {/* Stats Bar */}
          <div className="mb-6 flex flex-wrap justify-center gap-6 text-sm text-secondary">
            {vaultData?.stats?.folders && Object.entries(vaultData.stats.folders).map(([folder, stats]) => (
              <div key={folder} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ background: getFolderColor(folder) }}
                ></div>
                <span className="capitalize">{folder}</span>
                <span className="text-xs">({stats.count})</span>
              </div>
            ))}
          </div>

          {/* Graph */}
          <div className="bg-surface/30 rounded-lg border border-border">
            <VaultGraph
              graphData={graphData}
              onNodeClick={handleNodeClick}
              width={1200}
              height={700}
              className="mx-auto"
            />
          </div>

          {/* Instructions */}
          <div className="mt-6 text-center text-sm text-secondary">
            <p>💡 <strong>Tip:</strong> Drag nodes to rearrange • Hover to see connections • Click to explore</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function import
function getFolderColor(folder) {
  const colors = {
    canonical: '#3b82f6',
    concepts: '#8b5cf6',
    research: '#10b981',
    evidence: '#f59e0b',
    meta: '#6b7280'
  };
  return colors[folder] || '#9ca3af';
}