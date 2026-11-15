#!/usr/bin/env tsx
import fs from "node:fs";
import path from "node:path";
import { parseArgs } from "node:util";
import { localToday, readRecords, recordSchema, ROOT, runScaffold, writeScaffold } from "./scaffold.js";

const EVENTS = path.join(ROOT, "content/events");

function main() {
  const { values: { id, date, category } } = parseArgs({
    options: { id: { type: "string" }, date: { type: "string" }, category: { type: "string" } },
  });
  const schema = recordSchema("event");
  if (!id || !new RegExp(schema.properties.id.pattern).test(id)) {
    throw new Error("Provide --id as an event slug matching the event schema.");
  }
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(Date.parse(date)) || new Date(date).toISOString().slice(0, 10) !== date) {
    throw new Error("Provide --date as a valid YYYY-MM-DD date.");
  }
  if (!schema.properties.category.enum.includes(category)) {
    throw new Error(`Provide --category as one of: ${schema.properties.category.enum.join(", ")}`);
  }
  for (const { data } of readRecords("events")) {
    if (data.id === id) throw new Error(`Event id "${id}" already exists.`);
  }
  const yearDir = path.join(EVENTS, date.slice(0, 4));
  const numbers = fs.existsSync(yearDir)
    ? fs.readdirSync(yearDir).flatMap((name) => {
        const match = /^(\d{2,3})-.*\.md$/.exec(name);
        return match ? [Number(match[1])] : [];
      })
    : [];
  const number = Math.max(0, ...numbers) + 1;
  if (number > 999) throw new Error("Event numbers must have two or three digits; this year is full.");
  const filename = path.join(yearDir, `${String(number).padStart(2, "0")}-${id}.md`);
  const today = localToday();
  writeScaffold(filename, {
    id,
    title: "Untitled event",
    date,
    category,
    sources: [{ url: "", title: "" }],
    revision: { created: today, last_reviewed: today },
  }, "## Summary\n\n## What Happened\n\n## Why It Matters\n");
  console.log(`Created ${path.relative(ROOT, filename)}. Fill in the title, source and body before submitting.`);
}

runScaffold(main);
