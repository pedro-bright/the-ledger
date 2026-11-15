#!/usr/bin/env tsx
import { parseArgs } from "node:util";
import { localToday, recordSchema, requireRecord, runScaffold, writeRecord } from "./scaffold.js";

runScaffold(() => {
  const { values: { case: caseId, disposition } } = parseArgs({ options: { case: { type: "string" }, disposition: { type: "string" } } });
  const challenge = requireRecord(["challenges"], caseId, "challenge --case");
  const entry = requireRecord(["events", "syntheses"], challenge.data.target_claim_id, "entry --target");
  const allowed = recordSchema("resolution").properties.disposition.enum as string[];
  if (!disposition || !allowed.includes(disposition)) throw new Error(`Provide --disposition as one of: ${allowed.join(", ")}`);
  const body = "## Decision\n\n<!-- TODO: Explain the curator-approved disposition. -->\n\n## Evidence\n\n<!-- TODO: Cite sources supporting each finding. -->\n\n## Review\n\n<!-- TODO: Record the curator's approval and any drafting assistance. -->\n";
  const today = localToday();
  const filename = writeRecord("resolutions", "rn", entry.data.id, today, {
    case_id: challenge.data.id,
    disposition,
    findings: [], // TODO: supply findings; the empty array deliberately fails validation.
    actions: null,
    decided_by: [null],
    issued_at: today,
  }, body);
  console.log(`Created ${filename}. Fill findings (TODO: empty), actions (TODO: null), decided_by (TODO: null) and the Decision, Evidence and Review sections. Include actions.summary_revision_id for any summary_revision_created action; use no_action only when approved. The curator approves every disposition. Update challenge status and resolution_note_id, then entry state, confidence, contestation, Summary and revision.last_reviewed as the approved actions require. Run npm run validate before submitting.`);
});
