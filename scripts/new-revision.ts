#!/usr/bin/env tsx
import path from "node:path";
import { parseArgs } from "node:util";
import { localToday, requireRecord, ROOT, runScaffold, writeRecord } from "./scaffold.js";

runScaffold(() => {
  const { values: { target, case: caseId } } = parseArgs({ options: { target: { type: "string" }, case: { type: "string" } } });
  const entry = requireRecord(["events", "syntheses"], target, "entry --target");
  if (caseId !== undefined) {
    const challenge = requireRecord(["challenges"], caseId, "challenge --case");
    if (challenge.data.target_claim_id !== target) throw new Error(`Challenge "${caseId}" does not target "${target}".`);
  }
  const summary = /(?:^|\n)## Summary[\t ]*\r?\n([\s\S]*?)(?=\r?\n#{1,2}[\t ]+|$)/.exec(entry.content)?.[1].trim();
  if (!summary) throw new Error(`Entry "${target}" has no non-empty Summary section for prior_version.`);
  const body = `## Scope\n\n<!-- TODO: Describe what this revision changes. -->\n\n## Event location and identity\n\nOriginal file: \`${path.relative(ROOT, entry.filename)}\`.\nEntry ID: \`${entry.data.id}\`.\n\n## Evidence\n\n<!-- TODO: Cite the evidence for the revised summary. -->\n\n## Original metadata\n\n\`\`\`yaml\n${entry.matter.trim()}\n\`\`\`\n`;
  const today = localToday();
  const filename = writeRecord("revisions", "sr", entry.data.id, today, {
    target_summary_id: entry.data.id,
    prior_version: summary,
    new_version: "",
    reason: "", // TODO: explain the revision; empty reason deliberately fails validation.
    changed_claim_ids: [],
    triggered_by_case_id: caseId ?? null,
    author: null,
    created_at: today,
  }, body);
  console.log(`Created ${filename}. Fill new_version, reason (TODO: empty), author (TODO: null), changed_claim_ids and the Scope and Evidence sections. Update the entry Summary to match new_version and its revision.last_reviewed where applicable; review state, confidence and contestation with the curator. Link this revision from resolution actions.summary_revision_id when resolving a case. Run npm run validate before submitting.`);
});
