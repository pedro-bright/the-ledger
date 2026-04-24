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

// Wiki-native palette — balanced for the pale page-bg (#FAFAF7) canvas.
const NODE_COLORS: Record<string, string> = {
  event: '#0645AD',       // wiki-link blue
  thread: '#B45309',      // category-models amber
  controversy: '#B91C1C', // category-safety red
  actor: '#047857',       // category-research emerald
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
  const [reducedMotion, setReducedMotion] = useState(false);

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

  // Respect prefers-reduced-motion: freeze physics simulation quickly to avoid continuous motion.
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener?.('change', update);
    return () => mq.removeEventListener?.('change', update);
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

  const handleNodeClick = (node: any, event: MouseEvent) => {
    const route =
      node.type === 'event' ? `/events/${node.id}` :
      node.type === 'thread' ? `/threads/${node.id}` :
      node.type === 'controversy' ? `/controversies/${node.id}` :
      `/actors/${node.id}`;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button === 1) {
      window.open(route, '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = route;
    }
  };

  const types = ['event', 'thread', 'controversy', 'actor'];
  const counts = types.reduce<Record<string, number>>((acc, t) => {
    acc[t] = data.nodes.filter((n) => n.type === t).length;
    return acc;
  }, {});

  // Accessible fallback: flat node list grouped by type, with route links
  // identical to the canvas click handler. Screen readers + keyboard users
  // get the same navigation affordances as the pointer interaction.
  const fallbackRoute = (n: GraphNode) =>
    n.type === 'event' ? `/events/${n.id}` :
    n.type === 'thread' ? `/threads/${n.id}` :
    n.type === 'controversy' ? `/controversies/${n.id}` :
    `/actors/${n.id}`;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="label-eyebrow mr-1">Show</span>
        {types.map((type) => {
          const isHidden = hidden.has(type);
          const base =
            'inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-sans rounded-sm border transition-colors duration-150 min-h-[32px]';
          const visible = 'bg-wiki-surface-strong text-ink font-semibold';
          const hiddenCls =
            'bg-page-bg border-rule-strong text-ink hover:bg-wiki-surface';
          return (
            <button
              key={type}
              type="button"
              onClick={() => toggleType(type)}
              aria-pressed={!isHidden}
              aria-label={`${isHidden ? 'Show' : 'Hide'} ${TYPE_LABELS[type].toLowerCase()}`}
              className={`${base} ${isHidden ? hiddenCls : visible}`}
              style={!isHidden ? { borderColor: NODE_COLORS[type] } : undefined}
            >
              <span>{TYPE_LABELS[type]}</span>
              <span className="font-mono text-[11px] tabular-nums text-ink-faint">
                ({counts[type]})
              </span>
            </button>
          );
        })}
      </div>

      <div
        ref={containerRef}
        role="img"
        aria-label={`Relational graph of ${data.nodes.length} nodes — events, threads, controversies, and actors linked by shared references. A text list follows for keyboard and screen-reader navigation.`}
        className="border border-rule-strong rounded-sm overflow-hidden"
        style={{ background: '#FAFAF7' }}
      >
        <ForceGraph2D
          ref={fgRef}
          graphData={filteredData}
          width={size.width}
          height={size.height}
          nodeColor={(node: any) => NODE_COLORS[node.type] || '#7A7368'}
          nodeRelSize={4}
          nodeLabel={(node: any) => `${node.title} (${node.type})`}
          linkColor={() => 'rgba(201, 192, 174, 0.5)'}
          linkWidth={1}
          onNodeClick={handleNodeClick}
          backgroundColor="#FAFAF7"
          cooldownTicks={reducedMotion ? 0 : 100}
          d3AlphaDecay={reducedMotion ? 0.5 : 0.0228}
          enableNodeDrag={!reducedMotion}
        />
      </div>

      <p className="text-[12px] text-ink-faint font-mono">
        Click a node to open. Drag to pan, scroll to zoom. Toggle types above to filter.
      </p>

      {/* Accessible text-list equivalent of the graph. Keyboard and screen-reader
          users can navigate the full node set; pointer users can ignore it. */}
      <details className="graph-fallback">
        <summary className="graph-fallback__summary">
          All {data.nodes.length} nodes as a linked list
        </summary>
        <div className="graph-fallback__body">
          {types.map((type) => {
            const nodes = filteredData.nodes.filter((n: any) => n.type === type);
            if (nodes.length === 0) return null;
            return (
              <section key={type} className="graph-fallback__section" aria-labelledby={`graph-fallback-${type}`}>
                <h3 id={`graph-fallback-${type}`} className="graph-fallback__heading">
                  <span
                    className="graph-fallback__dot"
                    aria-hidden="true"
                    style={{ background: NODE_COLORS[type] }}
                  />
                  {TYPE_LABELS[type]}
                  <span className="graph-fallback__count font-mono tabular-nums">
                    ({nodes.length})
                  </span>
                </h3>
                <ul className="graph-fallback__list">
                  {nodes
                    .slice()
                    .sort((a: any, b: any) =>
                      (b.date || '').localeCompare(a.date || '') || a.title.localeCompare(b.title)
                    )
                    .map((n: any) => (
                      <li key={n.id}>
                        <a href={fallbackRoute(n)}>{n.title}</a>
                        {n.date && (
                          <time className="graph-fallback__date font-mono" dateTime={n.date}>
                            {' '}— {n.date}
                          </time>
                        )}
                      </li>
                    ))}
                </ul>
              </section>
            );
          })}
        </div>
      </details>
    </div>
  );
}
