#!/usr/bin/env tsx
import { parseArgs } from "node:util";
import { localToday, recordSchema, requireRecord, runScaffold, writeRecord } from "./scaffold.js";

runScaffold(() => {
  const { values: { target, allegation, issue } } = parseArgs({
    options: { target: { type: "string" }, allegation: { type: "string", multiple: true }, issue: { type: "string" } },
  });
  const entry = requireRecord(["events", "syntheses"], target, "entry --target");
  const allowed = recordSchema("challenge").properties.allegations.items.enum as string[];
  if (!allegation?.length || allegation.some((value) => !allowed.includes(value))) {
    throw new Error(`Provide --allegation as one of: ${allowed.join(", ")}`);
  }
  if (issue !== undefined && !/^[1-9]\d*$/.test(issue)) throw new Error("Provide --issue as a positive issue number.");
  const body = `${issue ? `Issue: https://github.com/pedro-bright/the-ledger/issues/${issue}\n\n` : ""}## Challenged assertion\n\n<!-- TODO: Quote the assertion being challenged. -->\n\n## Basis\n\n<!-- TODO: Explain the allegations and cite supporting sources. -->\n\n## Procedural status\n\n<!-- TODO: Record the review status and next steps. -->\n`;
  const today = localToday();
  const filename = writeRecord("challenges", "cc", entry.data.id, today, {
    target_claim_id: entry.data.id,
    allegations: allegation,
    status: "open",
    opened_at: today,
    opened_by: null, // TODO: identify the filer; null deliberately fails validation.
    resolution_note_id: null,
  }, body);
  console.log(`Created ${filename}. Fill opened_by (TODO: null) and the Challenged assertion, Basis and Procedural status sections. Update entry state and contestation as appropriate for the challenge; record any confidence change. Run npm run validate before submitting.`);
});
