import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { dump } from "js-yaml";
import { parseFrontmatter } from "./frontmatter.js";

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export function localToday() {
  const now = new Date();
  return [now.getFullYear(), String(now.getMonth() + 1).padStart(2, "0"), String(now.getDate()).padStart(2, "0")].join("-");
}

export function readRecords(folder: string) {
  const dir = path.join(ROOT, "content", folder);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { recursive: true, withFileTypes: true }).flatMap((entry) => {
    if (!entry.isFile() || !entry.name.endsWith(".md")) return [];
    const filename = path.join(entry.parentPath, entry.name);
    const parsed = parseFrontmatter(fs.readFileSync(filename, "utf8"));
    return [{ filename, data: parsed.data, content: parsed.content, matter: parsed.matter }];
  });
}

export function requireRecord(folders: string[], id: string | undefined, label: string) {
  if (!id) throw new Error(`Provide ${label}.`);
  const record = folders.flatMap(readRecords).find((record) => record.data.id === id);
  if (!record) throw new Error(`Unknown ${label}: "${id}".`);
  return record;
}

export function recordSchema(name: string) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, `schema/${name}.schema.json`), "utf8"));
}

export function writeScaffold(filename: string, data: object, body: string) {
  fs.mkdirSync(path.dirname(filename), { recursive: true });
  fs.writeFileSync(filename, `---\n${dump(data)}---\n\n${body}`, { flag: "wx" });
  return path.relative(ROOT, filename);
}

export function writeRecord(folder: string, prefix: string, target: string, today: string, data: object, body: string) {
  const base = `${prefix}-${target}-${today.replaceAll("-", "")}`;
  const ids = new Set(readRecords(folder).map((record) => record.data.id));
  let id = base;
  let suffix = 2;
  const filename = () => path.join(ROOT, "content", folder, `${id}.md`);
  while (ids.has(id) || fs.existsSync(filename())) id = `${base}-${suffix++}`;
  return writeScaffold(filename(), { id, ...data }, body);
}

export function runScaffold(main: () => void) {
  try {
    main();
  } catch (error) {
    console.error((error instanceof Error ? error.message : String(error)).replace(/\s*\r?\n\s*/g, " "));
    process.exitCode = 1;
  }
}
