import React, { useState, useRef, useEffect } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  RotateCcw, 
  Layers, 
  ShieldAlert, 
  Building2, 
  Shuffle, 
  HelpCircle,
  ArrowRight,
  Filter
} from 'lucide-react';
import { GraphNode, GraphEdge, NodeType, RiskLevel } from '../types';

interface ForensicsGraphProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  onSelectNode: (node: GraphNode) => void;
  onSelectEdge: (edge: GraphEdge) => void;
  traceInterrupted?: any;
  crossChainMovement?: any;
}

export const ForensicsGraph: React.FC<ForensicsGraphProps> = ({
  nodes,
  edges,
  onSelectNode,
  onSelectEdge,
  traceInterrupted,
  crossChainMovement
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  
  // Filters
  const [selectedHopFilter, setSelectedHopFilter] = useState<number | 'ALL'>('ALL');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<NodeType | 'ALL'>('ALL');

  // Filtered nodes & edges
  const filteredNodes = nodes.filter(n => {
    if (selectedHopFilter !== 'ALL' && n.hop > selectedHopFilter) return false;
    if (selectedTypeFilter !== 'ALL' && n.type !== selectedTypeFilter) return false;
    return true;
  });

  const nodeIds = new Set(filteredNodes.map(n => n.id));
  const filteredEdges = edges.filter(e => nodeIds.has(e.source) && nodeIds.has(e.target));

  // Compute layered positions based on hop depth
  const hopGroups: Record<number, GraphNode[]> = {};
  filteredNodes.forEach(node => {
    const h = node.hop || 0;
    if (!hopGroups[h]) hopGroups[h] = [];
    hopGroups[h].push(node);
  });

  const nodePositions = new Map<string, { x: number; y: number }>();
  const totalHops = Math.max(...filteredNodes.map(n => n.hop), 0) + 1;
  const colSpacing = 280;
  const startX = 120;

  Object.entries(hopGroups).forEach(([hopStr, groupNodes]) => {
    const hop = Number(hopStr);
    const x = startX + hop * colSpacing;
    const totalInGroup = groupNodes.length;
    const rowSpacing = 140;
    const startY = 220 - ((totalInGroup - 1) * rowSpacing) / 2;

    groupNodes.forEach((node, idx) => {
      const y = Math.max(80, startY + idx * rowSpacing);
      nodePositions.set(node.id, { x, y });
    });
  });

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoom = (delta: number) => {
    setZoom(prev => Math.min(Math.max(prev + delta, 0.4), 2.2));
  };

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const getNodeColor = (type: NodeType, risk: RiskLevel) => {
    if (type === 'REPORTED WALLET') return { border: '#e11d48', bg: '#fff1f2', text: '#9f1239' };
    if (type === 'EXCHANGE / VASP') return { border: '#2563eb', bg: '#eff6ff', text: '#1e40af' };
    if (type === 'MIXER / TUMBLER') return { border: '#dc2626', bg: '#fef2f2', text: '#991b1b' };
    if (type === 'BRIDGE') return { border: '#0d9488', bg: '#f0fdfa', text: '#115e59' };
    if (risk === 'CRITICAL' || risk === 'HIGH') return { border: '#f59e0b', bg: '#fffbeb', text: '#92400e' };
    return { border: '#64748b', bg: '#f8fafc', text: '#334155' };
  };

  return (
    <div className="relative w-full h-[620px] bg-slate-900 rounded border border-slate-800 overflow-hidden select-none flex flex-col">
      {/* Top Toolbar */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-2 bg-slate-800/90 backdrop-blur-md border border-slate-700/80 rounded p-1.5 shadow-lg text-xs">
        <div className="flex items-center gap-1 border-r border-slate-700 pr-2">
          <Layers className="w-3.5 h-3.5 text-blue-400" />
          <span className="font-mono text-[11px] text-slate-300">Hop:</span>
          {[1, 2, 3, 'ALL'].map((h) => (
            <button
              key={String(h)}
              onClick={() => setSelectedHopFilter(h as any)}
              className={`px-2 py-0.5 rounded font-mono text-[10px] font-semibold transition-colors ${
                selectedHopFilter === h
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'
              }`}
            >
              {h === 'ALL' ? 'All' : `≤${h}`}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={selectedTypeFilter}
            onChange={(e) => setSelectedTypeFilter(e.target.value as any)}
            className="bg-slate-900 text-slate-300 text-[11px] rounded border border-slate-700 px-2 py-0.5 outline-none font-mono"
          >
            <option value="ALL">All Node Types</option>
            <option value="REPORTED WALLET">Reported Wallets</option>
            <option value="INTERMEDIARY">Intermediaries</option>
            <option value="EXCHANGE / VASP">Exchanges / VASPs</option>
            <option value="BRIDGE">Bridges</option>
            <option value="MIXER / TUMBLER">Mixers</option>
          </select>
        </div>
      </div>

      {/* Zoom / Pan Controls */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-slate-800/90 backdrop-blur-md border border-slate-700/80 rounded p-1 shadow-lg">
        <button
          onClick={() => handleZoom(0.15)}
          className="p-1.5 rounded text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleZoom(-0.15)}
          className="p-1.5 rounded text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={resetView}
          className="p-1.5 rounded text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
          title="Reset View"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Graph Area */}
      <div
        ref={containerRef}
        className="flex-1 w-full h-full cursor-grab active:cursor-grabbing overflow-hidden"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <svg
          className="w-full h-full"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: '0 0',
            transition: isDragging ? 'none' : 'transform 0.1s ease-out'
          }}
        >
          <defs>
            <marker
              id="arrow-default"
              viewBox="0 0 10 10"
              refX="22"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
            </marker>
            <marker
              id="arrow-critical"
              viewBox="0 0 10 10"
              refX="22"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
            </marker>
            <marker
              id="arrow-vasp"
              viewBox="0 0 10 10"
              refX="22"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
            </marker>
          </defs>

          {/* Grid Background Lines */}
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.5" />
          </pattern>
          <rect width="3000" height="3000" fill="url(#grid)" />

          {/* Hop Column Separators */}
          {[0, 1, 2, 3, 4].map(hop => {
            const x = startX + hop * colSpacing;
            return (
              <g key={`hop-col-${hop}`} opacity="0.3">
                <line x1={x} y1="20" x2={x} y2="800" stroke="#334155" strokeDasharray="4 4" />
                <text x={x} y="40" fill="#94a3b8" fontSize="11" fontFamily="monospace" textAnchor="middle">
                  {hop === 0 ? 'ORIGIN (HOP 0)' : `HOP ${hop}`}
                </text>
              </g>
            );
          })}

          {/* Edges */}
          {filteredEdges.map(edge => {
            const srcPos = nodePositions.get(edge.source);
            const tgtPos = nodePositions.get(edge.target);
            if (!srcPos || !tgtPos) return null;

            const isVasp = tgtPos.x > srcPos.x && edge.hop >= 3;
            const midX = (srcPos.x + tgtPos.x) / 2;
            const midY = (srcPos.y + tgtPos.y) / 2;

            return (
              <g
                key={edge.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectEdge(edge);
                }}
                className="cursor-pointer group"
              >
                {/* Curve line */}
                <path
                  d={`M ${srcPos.x} ${srcPos.y} Q ${midX} ${midY - 15} ${tgtPos.x} ${tgtPos.y}`}
                  fill="none"
                  stroke={isVasp ? '#3b82f6' : '#64748b'}
                  strokeWidth="2"
                  markerEnd={isVasp ? 'url(#arrow-vasp)' : 'url(#arrow-default)'}
                  className="group-hover:stroke-amber-400 group-hover:stroke-[3] transition-all"
                />

                {/* Edge Label Pill */}
                <rect
                  x={midX - 38}
                  y={midY - 26}
                  width="76"
                  height="18"
                  rx="4"
                  fill="#0f172a"
                  stroke="#334155"
                  strokeWidth="1"
                  className="group-hover:stroke-amber-400"
                />
                <text
                  x={midX}
                  y={midY - 14}
                  fill="#f1f5f9"
                  fontSize="9.5"
                  fontWeight="600"
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  {edge.amount} {edge.asset}
                </text>
              </g>
            );
          })}

          {/* Nodes */}
          {filteredNodes.map(node => {
            const pos = nodePositions.get(node.id);
            if (!pos) return null;
            const colors = getNodeColor(node.type, node.risk);

            return (
              <g
                key={node.id}
                transform={`translate(${pos.x}, ${pos.y})`}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectNode(node);
                }}
                className="cursor-pointer group"
              >
                {/* Outer Glow on hover */}
                <rect
                  x="-85"
                  y="-34"
                  width="170"
                  height="68"
                  rx="6"
                  fill={colors.bg}
                  stroke={colors.border}
                  strokeWidth={node.isReported ? '2.5' : '1.5'}
                  className="group-hover:stroke-blue-400 group-hover:shadow-lg transition-all"
                />

                {/* Node Type Top Tag */}
                <rect
                  x="-80"
                  y="-30"
                  width="160"
                  height="14"
                  rx="3"
                  fill="#1e293b"
                />
                <text
                  x="0"
                  y="-20"
                  fill="#94a3b8"
                  fontSize="8.5"
                  fontWeight="700"
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  {node.type}
                </text>

                {/* Main Label */}
                <text
                  x="0"
                  y="-2"
                  fill="#0f172a"
                  fontSize="10"
                  fontWeight="700"
                  fontFamily="sans-serif"
                  textAnchor="middle"
                >
                  {node.entityName ? (node.entityName.length > 22 ? `${node.entityName.slice(0, 20)}...` : node.entityName) : node.label}
                </text>

                {/* Wallet Address snippet */}
                <text
                  x="0"
                  y="14"
                  fill="#64748b"
                  fontSize="9"
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  {node.id.slice(0, 6)}...{node.id.slice(-4)}
                </text>

                {/* Balance indicator */}
                {node.balance !== undefined && (
                  <text
                    x="0"
                    y="27"
                    fill="#334155"
                    fontSize="8.5"
                    fontWeight="600"
                    fontFamily="monospace"
                    textAnchor="middle"
                  >
                    Bal: {node.balance} {node.asset || 'ETH'}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Bottom Callouts (Trace Interruption & Cross Chain) */}
      <div className="bg-slate-950/90 border-t border-slate-800 p-2.5 px-4 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-slate-300 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            <span>Reported / Interrupted</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            <span>VASP Deposit</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-teal-500"></span>
            <span>Bridge Router</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span>Mule Layer</span>
          </div>
        </div>

        {traceInterrupted && (
          <div className="flex items-center gap-1.5 text-rose-400 text-[11px]">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Trace Interrupted at Privacy Mixer</span>
          </div>
        )}
      </div>
    </div>
  );
};
