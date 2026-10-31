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

// Wiki-native palette, balanced for the pale page-bg (#FAFAF7) canvas.
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
  const fgRef = useRef<any>(undefined);
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);
  const [hidden, setHidden] = useState<Set<string>>(new Set());
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [gesturesEnabled, setGesturesEnabled] = useState(false);
  const nodes = useMemo(() => data.nodes.map((node) => ({ ...node })), [data]);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const resize = () => {
      setSize({ width: container.clientWidth, height: container.clientHeight });
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(mq.matches);
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const cancel = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setGesturesEnabled(false);
    };
    window.addEventListener('keydown', cancel);
    return () => window.removeEventListener('keydown', cancel);
  }, []);

  const markReady = () => {
    const wrapper = containerRef.current?.closest<HTMLElement>('.graph-wrap');
    if (wrapper && wrapper.dataset.graphState !== 'ready') wrapper.dataset.graphState = 'ready';
  };

  const pan = (x: number, y: number) => {
    const graph = fgRef.current;
    if (!graph) return;
    const center = graph.centerAt();
    graph.centerAt(center.x + x / graph.zoom(), center.y + y / graph.zoom(), 0);
  };

  const filteredData = useMemo(() => {
    const visibleNodes = nodes.filter((n) => !hidden.has(n.type));
    const visibleIds = new Set(visibleNodes.map((n) => n.id));
    const visibleEdges = data.edges
      .filter((edge) => visibleIds.has(edge.source) && visibleIds.has(edge.target))
      .map((edge) => ({ ...edge }));
    return { nodes: visibleNodes, links: visibleEdges };
  }, [data, nodes, hidden]);

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
    (window as any).posthog?.capture('graph_node_clicked', {
      node_type: node.type,
      node_id: node.id,
      node_title: node.title,
    });
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

  return (
    <div className="graph-client" data-gestures={gesturesEnabled ? 'enabled' : 'disabled'}>
      <div className="graph-tools">
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
                onClick={() => {
                  toggleType(type);
                  (window as any).posthog?.capture('graph_type_toggled', {
                    node_type: type,
                    action: isHidden ? 'shown' : 'hidden',
                  });
                }}
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

        <div className="graph-navigation" role="group" aria-label="Graph navigation">
          <button type="button" aria-pressed={gesturesEnabled} onClick={() => setGesturesEnabled(!gesturesEnabled)}>
            {gesturesEnabled ? 'Disable graph gestures' : 'Enable graph gestures'}
          </button>
          <button type="button" aria-label="Zoom in" onClick={() => fgRef.current?.zoom(fgRef.current.zoom() * 1.25, 0)}>+</button>
          <button type="button" aria-label="Zoom out" onClick={() => fgRef.current?.zoom(fgRef.current.zoom() / 1.25, 0)}>-</button>
          <button type="button" onClick={() => fgRef.current?.zoomToFit(0, 30)}>Fit graph</button>
          <span className="graph-pan" role="group" aria-label="Pan graph">
            <button type="button" aria-label="Pan left" onClick={() => pan(-80, 0)}>←</button>
            <button type="button" aria-label="Pan right" onClick={() => pan(80, 0)}>→</button>
            <button type="button" aria-label="Pan up" onClick={() => pan(0, -80)}>↑</button>
            <button type="button" aria-label="Pan down" onClick={() => pan(0, 80)}>↓</button>
          </span>
        </div>
      </div>

      <div
        ref={containerRef}
        role="img"
        aria-label={`Relationship graph of ${filteredData.nodes.length} visible records. Typed connections are available in the relationship browser below.`}
        aria-describedby="graph-help"
        className="graph-canvas border border-rule-strong rounded-sm overflow-hidden"
        style={{ background: '#FAFAF7' }}
      >
        {size && <ForceGraph2D
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
          warmupTicks={reducedMotion ? 100 : 0}
          d3AlphaDecay={0.0228}
          onEngineTick={markReady}
          onEngineStop={() => {
            if (containerRef.current?.closest<HTMLElement>('.graph-wrap')?.dataset.graphState !== 'ready') {
              fgRef.current?.zoomToFit(0, 30);
            }
            markReady();
          }}
          enableNodeDrag={gesturesEnabled && !reducedMotion}
          enablePanInteraction={gesturesEnabled}
          enableZoomInteraction={(event: Event) => gesturesEnabled && event.type !== 'wheel'}
        />}
      </div>

      <p id="graph-help" className="text-[12px] text-ink-faint font-mono">
        Click a node to open its record. Use the buttons to pan or zoom.
        Enable graph gestures to drag or pinch; disable them or press Escape to scroll the page.
        <a href="#graph-relationships"> Browse relationships as text.</a>
      </p>
    </div>
  );
}
