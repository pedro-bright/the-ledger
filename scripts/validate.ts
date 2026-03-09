#!/usr/bin/env tsx
/**
 * validate.ts — Read all content/ files, parse YAML frontmatter,
 * validate against JSON schemas, check cross-references.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import matter from "gray-matter";
import yaml from "js-yaml";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CONTENT_DIR = path.join(ROOT, "content");
const SCHEMA_DIR = path.join(ROOT, "schema");

// --------------- Schema Loading ---------------

function loadSchema(name: string): object {
  const filePath = path.join(SCHEMA_DIR, `${name}.schema.json`);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Schema not found: ${filePath}`);
  }
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function createValidator() {
  const ajv = new Ajv({
    allErrors: true,
    strict: false,
    allowUnionTypes: true,
  });
  addFormats(ajv);

  // Load all schemas so $ref works
  const schemaNames = [
    "event", "thread", "controversy", "synthesis",
    "challenge", "revision", "memo", "resolution",
    "actor", "source", "claim-status",
  ];

  for (const name of schemaNames) {
    const schema = loadSchema(name);
    ajv.addSchema(schema, `${name}.schema.json`);
  }

  return ajv;
}

// --------------- File Discovery ---------------

type ContentType =
  | "event" | "thread" | "controversy" | "synthesis"
  | "challenge" | "revision" | "memo" | "resolution"
  | "actor" | "perspective";

interface ContentFile {
  path: string;
  relativePath: string;
  type: ContentType;
  data: Record<string, unknown>;
  content: string;
}

function getContentType(relativePath: string): ContentType | null {
  const parts = relativePath.split(path.sep);
  const dir = parts[0];
  const mapping: Record<string, ContentType> = {
    events: "event",
    threads: "thread",
    controversies: "controversy",
    syntheses: "synthesis",
    challenges: "challenge",
    revisions: "revision",
    memos: "memo",
    resolutions: "resolution",
    actors: "actor",
    perspectives: "perspective",
  };
  return mapping[dir] ?? null;
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

/**
 * Recursively convert Date objects to ISO date strings.
 * YAML parsers auto-convert date-like strings (2024-03-14) to Date objects,
 * but our JSON schemas expect strings.
 */
function normalizeDates(obj: unknown): unknown {
  if (obj instanceof Date) {
    return obj.toISOString().slice(0, 10);
  }
  if (Array.isArray(obj)) {
    return obj.map(normalizeDates);
  }
  if (obj && typeof obj === "object") {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      result[key] = normalizeDates(value);
    }
    return result;
  }
  return obj;
}

function parseFile(filePath: string): { data: Record<string, unknown>; content: string } {
  const ext = path.extname(filePath);
  const raw = fs.readFileSync(filePath, "utf-8");

  if (ext === ".yml" || ext === ".yaml") {
    const data = yaml.load(raw) as Record<string, unknown>;
    return { data: normalizeDates(data ?? {}) as Record<string, unknown>, content: "" };
  }

  // Markdown — parse frontmatter
  const { data, content } = matter(raw);
  return { data: normalizeDates(data) as Record<string, unknown>, content };
}

// --------------- Validation ---------------

interface ValidationError {
  file: string;
  message: string;
}

function validateAll(): ValidationError[] {
  const errors: ValidationError[] = [];
  const ajv = createValidator();

  const files = walkDir(CONTENT_DIR);
  const contentFiles: ContentFile[] = [];

  // Parse all files
  for (const filePath of files) {
    const relativePath = path.relative(CONTENT_DIR, filePath);
    const type = getContentType(relativePath);
    if (!type) {
      errors.push({ file: relativePath, message: `Unknown content type for directory` });
      continue;
    }

    try {
      const { data, content } = parseFile(filePath);
      contentFiles.push({ path: filePath, relativePath, type, data, content });
    } catch (e) {
      errors.push({
        file: relativePath,
        message: `Parse error: ${e instanceof Error ? e.message : String(e)}`,
      });
    }
  }

  // Collect known IDs for cross-reference checking
  const ids: Record<ContentType, Set<string>> = {
    event: new Set(),
    thread: new Set(),
    controversy: new Set(),
    synthesis: new Set(),
    challenge: new Set(),
    revision: new Set(),
    memo: new Set(),
    resolution: new Set(),
    actor: new Set(),
    perspective: new Set(),
  };

  // First pass: collect IDs
  for (const file of contentFiles) {
    const id = file.data.id as string | undefined;
    if (id) {
      if (ids[file.type].has(id)) {
        errors.push({ file: file.relativePath, message: `Duplicate ${file.type} ID: "${id}"` });
      }
      ids[file.type].add(id);
    }
  }

  // Second pass: schema validation + cross-reference checks
  for (const file of contentFiles) {
    // Skip perspectives (no schema — they're freeform editorial)
    if (file.type === "perspective") continue;

    // Schema validation
    const schemaRef = `${file.type}.schema.json`;
    const validate = ajv.getSchema(schemaRef);
    if (!validate) {
      // No schema for this type, skip
      continue;
    }

    const valid = validate(file.data);
    if (!valid && validate.errors) {
      for (const err of validate.errors) {
        errors.push({
          file: file.relativePath,
          message: `Schema: ${err.instancePath || "/"} ${err.message}${
            err.params ? ` (${JSON.stringify(err.params)})` : ""
          }`,
        });
      }
    }

    // Date sanity checks
    const date = file.data.date as string | undefined;
    if (date) {
      const d = new Date(date);
      if (isNaN(d.getTime())) {
        errors.push({ file: file.relativePath, message: `Invalid date: "${date}"` });
      } else if (d.getFullYear() < 2000 || d > new Date(Date.now() + 7 * 86400000)) {
        errors.push({
          file: file.relativePath,
          message: `Date out of range (2000–now+7d): "${date}"`,
        });
      }
    }

    const endDate = file.data.end_date as string | undefined;
    if (endDate && date) {
      if (new Date(endDate) < new Date(date)) {
        errors.push({
          file: file.relativePath,
          message: `end_date "${endDate}" is before date "${date}"`,
        });
      }
    }

    // Cross-reference checks
    if (file.type === "event") {
      // Check actor references
      const actors = file.data.actors as Array<{ id: string }> | undefined;
      if (actors) {
        for (const actor of actors) {
          if (!ids.actor.has(actor.id)) {
            errors.push({
              file: file.relativePath,
              message: `Actor reference not found: "${actor.id}"`,
            });
          }
        }
      }

      // Check thread references
      const threads = file.data.threads as string[] | undefined;
      if (threads) {
        for (const threadId of threads) {
          if (!ids.thread.has(threadId)) {
            errors.push({
              file: file.relativePath,
              message: `Thread reference not found: "${threadId}"`,
            });
          }
        }
      }

      // Check related event references
      const related = file.data.related as string[] | undefined;
      if (related) {
        for (const relId of related) {
          if (!ids.event.has(relId)) {
            errors.push({
              file: file.relativePath,
              message: `Related event not found: "${relId}"`,
            });
          }
        }
      }
    }

    if (file.type === "thread") {
      // Check event references in thread
      const events = file.data.events as string[] | undefined;
      if (events) {
        for (const eventId of events) {
          if (!ids.event.has(eventId)) {
            errors.push({
              file: file.relativePath,
              message: `Event reference not found in thread: "${eventId}"`,
            });
          }
        }
      }

      // Check controversy references
      const controvs = file.data.controversies as string[] | undefined;
      if (controvs) {
        for (const cId of controvs) {
          if (!ids.controversy.has(cId)) {
            errors.push({
              file: file.relativePath,
              message: `Controversy reference not found: "${cId}"`,
            });
          }
        }
      }
    }

    if (file.type === "controversy") {
      // Check thread reference
      const threadId = file.data.thread as string | undefined;
      if (threadId && !ids.thread.has(threadId)) {
        errors.push({
          file: file.relativePath,
          message: `Controversy thread reference not found: "${threadId}"`,
        });
      }
    }

    if (file.type === "synthesis") {
      // Check thread reference
      const threadId = file.data.thread as string | undefined;
      if (threadId && !ids.thread.has(threadId)) {
        errors.push({
          file: file.relativePath,
          message: `Synthesis thread reference not found: "${threadId}"`,
        });
      }
    }

    if (file.type === "challenge") {
      // target_claim_id could reference events or specific claims
      const target = file.data.target_claim_id as string | undefined;
      if (target && !ids.event.has(target) && !ids.synthesis.has(target)) {
        // It's OK — could be a claim ID within an event. Just warn.
        // We don't enforce this strictly since claim IDs are embedded.
      }
    }

    if (file.type === "resolution") {
      // Check challenge case reference
      const caseId = file.data.case_id as string | undefined;
      if (caseId && !ids.challenge.has(caseId)) {
        errors.push({
          file: file.relativePath,
          message: `Resolution references unknown challenge case: "${caseId}"`,
        });
      }
    }
  }

  return errors;
}

// --------------- Main ---------------

function main() {
  console.log("🔍 The Ledger — Validating content...\n");

  const errors = validateAll();

  if (errors.length === 0) {
    console.log("✅ All content is valid.\n");
    process.exit(0);
  }

  console.log(`❌ Found ${errors.length} validation error(s):\n`);
  for (const err of errors) {
    console.log(`  ${err.file}`);
    console.log(`    → ${err.message}\n`);
  }

  process.exit(1);
}

main();
