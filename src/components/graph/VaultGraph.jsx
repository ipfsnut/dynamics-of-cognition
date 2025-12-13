import { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { getFolderColor } from '../../utils/vaultParser';
import './VaultGraph.css';

export default function VaultGraph({ 
  graphData, 
  onNodeClick, 
  highlightNode = null,
  width = 800,
  height = 600,
  className = ''
}) {
  const svgRef = useRef(null);
  const simulationRef = useRef(null);
  const [hoveredNode, setHoveredNode] = useState(null);

  useEffect(() => {
    if (!graphData?.nodes?.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Create container with zoom behavior
    const g = svg.append('g');
    
    const zoom = d3.zoom()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });
    
    svg.call(zoom);

    // Create copies of data for D3 (D3 mutates the data)
    const nodes = graphData.nodes.map(d => ({ ...d }));
    const edges = graphData.edges.map(d => ({ ...d }));

    // Force simulation
    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(edges)
        .id(d => d.id)
        .distance(120)
        .strength(0.5))
      .force('charge', d3.forceManyBody().strength(-400))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(25));

    simulationRef.current = simulation;

    // Draw edges
    const links = g.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(edges)
      .enter()
      .append('line')
      .attr('stroke', '#444')
      .attr('stroke-opacity', 0.4)
      .attr('stroke-width', d => d.weight || 1);

    // Draw nodes
    const nodeSelection = g.append('g')
      .attr('class', 'nodes')
      .selectAll('circle')
      .data(nodes)
      .enter()
      .append('circle')
      .attr('r', d => 8 + Math.min(d.linkCount * 2, 15))
      .attr('fill', d => getFolderColor(d.folder))
      .attr('stroke', d => d.id === highlightNode ? '#fff' : '#333')
      .attr('stroke-width', d => d.id === highlightNode ? 3 : 1)
      .attr('opacity', d => d.id === highlightNode ? 1 : 0.9)
      .style('cursor', 'pointer')
      .call(createDragBehavior(simulation));

    // Node labels
    const labels = g.append('g')
      .attr('class', 'labels')
      .selectAll('text')
      .data(nodes)
      .enter()
      .append('text')
      .text(d => {
        const title = d.title || d.id;
        return title.length > 20 ? title.slice(0, 17) + '...' : title;
      })
      .attr('font-size', 11)
      .attr('font-family', 'ui-sans-serif, system-ui, sans-serif')
      .attr('fill', '#ccc')
      .attr('text-anchor', 'middle')
      .attr('dy', 35)
      .style('pointer-events', 'none')
      .style('user-select', 'none');

    // Node interactions
    nodeSelection
      .on('click', (event, d) => {
        event.stopPropagation();
        onNodeClick?.(d.id);
      })
      .on('mouseenter', (event, d) => {
        setHoveredNode(d);
        
        // Highlight connected elements
        const connectedNodeIds = new Set();
        edges.forEach(edge => {
          if (edge.source.id === d.id) connectedNodeIds.add(edge.target.id);
          if (edge.target.id === d.id) connectedNodeIds.add(edge.source.id);
        });
        
        // Dim non-connected elements
        nodeSelection.attr('opacity', n => 
          n.id === d.id || connectedNodeIds.has(n.id) ? 1 : 0.2
        );
        
        links.attr('stroke-opacity', edge => 
          edge.source.id === d.id || edge.target.id === d.id ? 0.8 : 0.1
        );
      })
      .on('mouseleave', () => {
        setHoveredNode(null);
        
        // Restore normal opacity
        nodeSelection.attr('opacity', 0.9);
        links.attr('stroke-opacity', 0.4);
      });

    // Simulation tick function
    simulation.on('tick', () => {
      links
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);
      
      nodeSelection
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);
      
      labels
        .attr('x', d => d.x)
        .attr('y', d => d.y);
    });

    // Cleanup on unmount
    return () => {
      if (simulationRef.current) {
        simulationRef.current.stop();
      }
    };
  }, [graphData, highlightNode, width, height, onNodeClick]);

  // Drag behavior factory
  function createDragBehavior(simulation) {
    return d3.drag()
      .on('start', (event, d) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on('drag', (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on('end', (event, d) => {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });
  }

  // Restart simulation with new temperature
  const reheatSimulation = () => {
    if (simulationRef.current) {
      simulationRef.current.alpha(0.3).restart();
    }
  };

  return (
    <div className={`vault-graph-container ${className}`}>
      <div className="vault-graph-controls">
        <button 
          onClick={reheatSimulation}
          className="reheat-button"
          title="Restart physics simulation"
        >
          ⚡ Reheat
        </button>
        {hoveredNode && (
          <div className="graph-tooltip">
            <div className="tooltip-header">
              <strong>{hoveredNode.title}</strong>
              <span 
                className="folder-badge" 
                style={{ background: getFolderColor(hoveredNode.folder) }}
              >
                {hoveredNode.folder}
              </span>
            </div>
            <div className="tooltip-stats">
              {hoveredNode.linkCount} connections • {hoveredNode.wordCount} words
            </div>
          </div>
        )}
      </div>
      
      <svg 
        ref={svgRef} 
        width={width} 
        height={height}
        className="vault-graph-svg"
        viewBox={`0 0 ${width} ${height}`}
      />
      
      <div className="graph-legend">
        <div className="legend-item">
          <div className="legend-dot" style={{ background: getFolderColor('canonical') }}></div>
          <span>Paper Sections</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot" style={{ background: getFolderColor('concepts') }}></div>
          <span>Key Concepts</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot" style={{ background: getFolderColor('research') }}></div>
          <span>Deep Research</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot" style={{ background: getFolderColor('evidence') }}></div>
          <span>Evidence</span>
        </div>
      </div>
    </div>
  );
}