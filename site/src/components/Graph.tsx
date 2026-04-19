import { useEffect, useRef, useState, useMemo } from 'react';
import ForceGraph2D from 'react-force-graph-2d';

type GraphNode = {
  id: string;
  type: 'event' | 'thread' | 'controversy' | 'actor';
  title: string;
  date?: string;
  category?: string;
  significance?: string;
  // Filled by force-graph
  x?: number; y?: number; vx?: number; vy?: number;
};

type GraphEdge = {
  source: string;
  target: string;
  type: string;
};

type Props = {
  data: { nodes: GraphNode[]; edges: GraphEdge[] };
};

const NODE_COLORS: Record<string, string> = {
  event: '#6366F1',       // indigo (policy color, used as event default)
  thread: '#8B5CF6',      // violet
  controversy: '#EF4444', // red
  actor: '#06B6D4',       // cyan
};

const TYPE_LABELS: Record<string, string> = {
  event: 'Events',
  thread: 'Threads',
  controversy: 'Controversies',
  actor: 'Actors',
};

export default function Graph({ data }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const fgRef = useRef<any>();
  const [size, setSize] = useState({ width: 800, height: 600 });
  const [hidden, setHidden] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!containerRef.current) return;
    const resize = () => {
      const rect = containerRef.current!.getBoundingClientRect();
      setSize({ width: rect.width, height: Math.max(500, window.innerHeight - 280) });
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  const filteredData = useMemo(() => {
    const visibleNodes = data.nodes.filter((n) => !hidden.has(n.type));
    const visibleIds = new Set(visibleNodes.map((n) => n.id));
    const visibleEdges = data.edges.filter(
      (e) => visibleIds.has(typeof e.source === 'string' ? e.source : (e.source as any).id) &&
             visibleIds.has(typeof e.target === 'string' ? e.target : (e.target as any).id)
    );
    return { nodes: visibleNodes, links: visibleEdges };
  }, [data, hidden]);

  const toggleType = (type: string) => {
    setHidden((prev) => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  };

  const handleNodeClick = (node: any) => {
    const route =
      node.type === 'event' ? `/events/${node.id}` :
      node.type === 'thread' ? `/threads/${node.id}` :
      node.type === 'controversy' ? `/controversies/${node.id}` :
      `/actors/${node.id}`;
    window.location.href = route;
  };

  const types = ['event', 'thread', 'controversy', 'actor'];
  const counts = types.reduce<Record<string, number>>((acc, t) => {
    acc[t] = data.nodes.filter((n) => n.type === t).length;
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {types.map((type) => {
          const isHidden = hidden.has(type);
          return (
            <button
              key={type}
              onClick={() => toggleType(type)}
              className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded-full border transition-all ${
                isHidden
                  ? 'border-ledger-border text-ledger-text-dim bg-transparent opacity-50'
                  : 'border-ledger-border-light text-ledger-text bg-ledger-surface'
              }`}
              style={!isHidden ? { borderColor: NODE_COLORS[type], color: NODE_COLORS[type] } : {}}
            >
              {TYPE_LABELS[type]} ({counts[type]})
            </button>
          );
        })}
      </div>

      <div
        ref={containerRef}
        className="border border-ledger-border rounded-lg bg-ledger-surface/30 overflow-hidden"
      >
        <ForceGraph2D
          ref={fgRef}
          graphData={filteredData}
          width={size.width}
          height={size.height}
          nodeColor={(node: any) => NODE_COLORS[node.type] || '#888'}
          nodeRelSize={4}
          nodeLabel={(node: any) => `${node.title} (${node.type})`}
          linkColor={() => 'rgba(255,255,255,0.1)'}
          linkWidth={1}
          onNodeClick={handleNodeClick}
          backgroundColor="rgba(0,0,0,0)"
          cooldownTicks={100}
        />
      </div>

      <p className="text-xs text-ledger-text-dim font-mono">
        Click a node to open. Drag to pan, scroll to zoom. Toggle types above to filter.
      </p>
    </div>
  );
}
