import { expect, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';

// Helpers that find and target nodes drawn on the relationship graph's canvas.
type GraphRecord = { id: string; type: 'event' | 'thread' | 'controversy' | 'actor'; title: string };
export const graphRecords: GraphRecord[] = JSON.parse(readFileSync('../graph.json', 'utf8')).nodes;

export async function recordDrawing(page: Page) {
  await page.addInitScript(() => {
    const arcs: number[][] = [];
    const drawn = { frame: [] as number[][] };
    Object.assign(window, { graphArcs: arcs, graphDrawn: drawn });
    const { arc, clearRect } = CanvasRenderingContext2D.prototype;
    CanvasRenderingContext2D.prototype.clearRect = function(...args) {
      if (this.canvas.isConnected) drawn.frame = [];
      return clearRect.apply(this, args);
    };
    CanvasRenderingContext2D.prototype.arc = function(x, y, radius, ...rest) {
      if (this.canvas.isConnected && Number.isFinite(x) && Number.isFinite(y) && radius >= 3) {
        drawn.frame.push([x, y]);
        if (arcs.length < 4000) arcs.push([x, y]);
      }
      return arc.call(this, x, y, radius, ...rest);
    };
  });
}

export const drawnFrame = (page: Page) => page.evaluate(() => (window as any).graphDrawn.frame as number[][]);

export async function settledFrame(page: Page) {
  let previous = '';
  await expect.poll(async () => {
    const current = await drawnFrame(page);
    const stable = current.length > 0 && JSON.stringify(current) === previous;
    previous = JSON.stringify(current);
    return stable;
  }, { intervals: [1000], timeout: 30000 }).toBe(true);
  return drawnFrame(page);
}

// The renderer draws nodes in graph.json order. Pick the most isolated one so
// overlapping hit areas at overview scale cannot turn a node gesture into a pan.
export async function visibleNode(page: Page) {
  const frame = await drawnFrame(page);
  expect(frame).toHaveLength(graphRecords.length);
  const target = await page.locator('canvas').first().evaluate(async (canvas: HTMLCanvasElement, frame) => {
    const { a, d, e, f } = canvas.getContext('2d')!.getTransform();
    const inset = 40;
    const nodes = frame.map(([x, y], index) => ({
      index, x: (x * a + e) / devicePixelRatio, y: (y * d + f) / devicePixelRatio,
    }));
    const candidates = nodes
      .filter(({ x, y }) => x > inset && x < canvas.clientWidth - inset && y > inset && y < canvas.clientHeight - inset)
      .map((node) => ({
        ...node,
        clearance: Math.min(...nodes.filter((other) => other.index !== node.index).map((other) => Math.hypot(other.x - node.x, other.y - node.y))),
      }))
      .sort((left, right) => right.clearance - left.clearance || left.index - right.index);
    const node = candidates[0];
    if (!node) throw new Error('No drawn node is clear of the canvas edges');
    // Commit an integer scroll position before measuring the gesture's start.
    window.scrollTo(0, Math.round(scrollY + canvas.getBoundingClientRect().top + node.y - 300));
    await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
    const box = canvas.getBoundingClientRect();
    const point = { x: box.left + node.x, y: box.top + node.y };
    if (document.elementFromPoint(point.x, point.y) !== canvas) {
      throw new Error('The chosen node is covered by another element');
    }
    return { ...point, index: node.index };
  }, frame);
  const record = graphRecords[target.index];
  const directory = { event: 'events', thread: 'threads', controversy: 'controversies', actor: 'actors' }[record.type];
  return { x: target.x, y: target.y, label: `${record.title} (${record.type})`, route: `/${directory}/${record.id}` };
}
