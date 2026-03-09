#!/usr/bin/env tsx
/**
 * build-graph.ts — Build a JSON graph of event → thread → controversy relationships.
 * Detects orphaned events (not connected to any thread).
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import yaml from "js-yaml";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CONTENT_DIR = path.join(ROOT, "content");

interface GraphNode {
  id: string;
  type: "event" | "thread" | "controversy" | "actor";
  title: string;
  date?: string;
  category?: string;
  significance?: string;
  state?: string;
}

interface GraphEdge {
  source: string;
  target: string;
  type: "belongs_to_thread" | "has_controversy" | "related_event" | "involves_actor" | "references_thread";
}

interface Graph {
  nodes: GraphNode[];
  edges: GraphEdge[];
  stats: {
    events: number;
    threads: number;
    controversies: number;
    actors: number;
    edges: number;
    orphaned_events: string[];
  };
  generated_at: string;
}

function walkDir(dir: string): string[] {
  const results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkDir(fullPath));
    } else if (
      entry.name !== ".gitkeep" &&
      (entry.name.endsWith(".md") || entry.name.endsWith(".yml") || entry.name.endsWith(".yaml"))
    ) {
      results.push(fullPath);
    }
  }
  return results;
}

function parseFile(filePath: string): Record<string, unknown> {
  const ext = path.extname(filePath);
  const raw = fs.readFileSync(filePath, "utf-8");

  if (ext === ".yml" || ext === ".yaml") {
    return (yaml.load(raw) as Record<string, unknown>) ?? {};
  }
  return matter(raw).data;
}

function getContentType(relativePath: string): string | null {
  const dir = relativePath.split(path.sep)[0];
  const mapping: Record<string, string> = {
    events: "event",
    threads: "thread",
    controversies: "controversy",
    actors: "actor",
  };
  return mapping[dir] ?? null;
}

function main() {
  console.log("🕸️  The Ledger — Building relationship graph...\n");

  const files = walkDir(CONTENT_DIR);
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];

  const eventIds = new Set<string>();
  const threadIds = new Set<string>();
  const eventsInThreads = new Set<string>();

  // Parse all relevant content
  for (const filePath of files) {
    const relativePath = path.relative(CONTENT_DIR, filePath);
    const type = getContentType(relativePath);
    if (!type) continue;

    const data = parseFile(filePath);
    const id = data.id as string | undefined;
    if (!id) continue;

    // Create node
    const node: GraphNode = {
      id,
      type: type as GraphNode["type"],
      title: (data.title as string) ?? (data.name as string) ?? id,
    };

    if (data.date) node.date = String(data.date);
    if (data.category) node.category = String(data.category);
    if (data.significance) node.significance = String(data.significance);
    if (data.state) node.state = String(data.state);

    nodes.push(node);

    if (type === "event") {
      eventIds.add(id);

      // Event → Thread edges
      const threads = data.threads as string[] | undefined;
      if (threads) {
        for (const threadId of threads) {
          edges.push({
            source: id,
            target: threadId,
            type: "belongs_to_thread",
          });
          eventsInThreads.add(id);
        }
      }

      // Event → Related Event edges
      const related = data.related as string[] | undefined;
      if (related) {
        for (const relId of related) {
          edges.push({
            source: id,
            target: relId,
            type: "related_event",
          });
        }
      }

      // Event → Actor edges
      const actors = data.actors as Array<{ id: string }> | undefined;
      if (actors) {
        for (const actor of actors) {
          edges.push({
            source: id,
            target: actor.id,
            type: "involves_actor",
          });
        }
      }
    }

    if (type === "thread") {
      threadIds.add(id);

      // Thread → Event edges (from thread's event list)
      const events = data.events as string[] | undefined;
      if (events) {
        for (const eventId of events) {
          eventsInThreads.add(eventId);
          // Don't duplicate — the event→thread edge is canonical
        }
      }

      // Thread → Controversy edges
      const controvs = data.controversies as string[] | undefined;
      if (controvs) {
        for (const cId of controvs) {
          edges.push({
            source: id,
            target: cId,
            type: "has_controversy",
          });
        }
      }
    }

    if (type === "controversy") {
      const threadId = data.thread as string | undefined;
      if (threadId) {
        edges.push({
          source: id,
          target: threadId,
          type: "references_thread",
        });
      }
    }
  }

  // Detect orphaned events
  const orphanedEvents = Array.from(eventIds).filter((id) => !eventsInThreads.has(id));

  const graph: Graph = {
    nodes,
    edges,
    stats: {
      events: nodes.filter((n) => n.type === "event").length,
      threads: nodes.filter((n) => n.type === "thread").length,
      controversies: nodes.filter((n) => n.type === "controversy").length,
      actors: nodes.filter((n) => n.type === "actor").length,
      edges: edges.length,
      orphaned_events: orphanedEvents,
    },
    generated_at: new Date().toISOString(),
  };

  // Write graph
  const outputPath = path.join(ROOT, "graph.json");
  fs.writeFileSync(outputPath, JSON.stringify(graph, null, 2), "utf-8");

  // Report
  console.log("  Graph Statistics:");
  console.log(`    Events:         ${graph.stats.events}`);
  console.log(`    Threads:        ${graph.stats.threads}`);
  console.log(`    Controversies:  ${graph.stats.controversies}`);
  console.log(`    Actors:         ${graph.stats.actors}`);
  console.log(`    Edges:          ${graph.stats.edges}`);
  console.log();

  if (orphanedEvents.length > 0) {
    console.log(`  ⚠️  ${orphanedEvents.length} orphaned event(s) (not in any thread):`);
    for (const id of orphanedEvents) {
      console.log(`    - ${id}`);
    }
    console.log();
  } else {
    console.log("  ✅ No orphaned events.\n");
  }

  console.log(`📄 Graph written to graph.json\n`);
}

main();
