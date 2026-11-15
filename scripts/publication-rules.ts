/**
 * Publication rules from editorial/evidence-standards.md and the daily scan's
 * editorial rules, enforced for events whose revision.created is on or after
 * PUBLICATION_RULES_FROM. CONTRIBUTING.md describes them for contributors.
 */

import { unpinnedArchive } from "./check-links.js";

export const PUBLICATION_RULES_FROM = "2026-11-15";

const AUTOMATIC_AUTHOR = "pedro-bright";

type Source = Record<string, unknown>;

const missing = (value: unknown) => value === undefined || value === null || value === "";

const primaryOrOfficial = (source: Source) =>
  typeof source.type === "string" && (source.type.startsWith("primary") || source.type === "official");

export function publicationRuleErrors(data: Record<string, unknown>): string[] {
  const revision = (data.revision ?? {}) as Record<string, unknown>;
  const created = revision.created;
  if (typeof created !== "string" || created < PUBLICATION_RULES_FROM) return [];

  const errors: string[] = [];
  const rule = (name: string, problem: string, fix: string) =>
    errors.push(`Publication rule "${name}": ${problem}. ${fix}`);

  const revisionFixes: Record<string, string> = {
    last_reviewed: "Add it as the YYYY-MM-DD date the entry was last checked against its sources.",
    final_author: "Add the id of the person responsible for the entry.",
    draft_assistance: "Add ai-assisted or human-only.",
  };
  for (const [field, fix] of Object.entries(revisionFixes)) {
    if (missing(revision[field])) rule("revision record", `revision.${field} is missing`, fix);
  }

  if (missing(data.state)) {
    rule("lifecycle state", "state is missing", "Add state: published, or another state listed in the event schema.");
  }

  const sources = (Array.isArray(data.sources) ? data.sources : []) as Source[];
  const sourceFixes: Record<string, string> = {
    publisher: "Add the organization or outlet that published it.",
    date: "Add its publication date as YYYY-MM-DD.",
    accessed: "Add the YYYY-MM-DD date you read it.",
  };
  sources.forEach((source, i) => {
    for (const [field, fix] of Object.entries(sourceFixes)) {
      if (missing(source[field])) rule("source details", `sources[${i}].${field} is missing`, fix);
    }
  });

  if (!sources.some(primaryOrOfficial) && sources.length < 2) {
    rule(
      "minimum sourcing",
      "sources has no primary or official source and fewer than two sources",
      "Add a source with type official or primary_*, or a second independent source.",
    );
  }

  sources.forEach((source, i) => {
    const archive = source.archive_url;
    if (primaryOrOfficial(source) && missing(archive)) {
      rule(
        "archived primary sources",
        `sources[${i}].archive_url is missing for a source of type ${source.type}`,
        "Add archive_url pointing to a preserved copy, such as https://web.archive.org/web/<14-digit timestamp>/<url>.",
      );
    }
    if (typeof archive === "string" && URL.canParse(archive) && unpinnedArchive(archive)) {
      rule(
        "fixed archive capture",
        `sources[${i}].archive_url is a Wayback link without a 14-digit capture timestamp`,
        "Replace it with the URL of a single capture, such as https://web.archive.org/web/20261115120000/<url>.",
      );
    }
  });

  if (revision.final_author === AUTOMATIC_AUTHOR && data.significance !== "notable") {
    rule(
      "automatic entries are notable",
      `significance is ${missing(data.significance) ? "missing" : `"${data.significance}"`} on an entry whose revision.final_author is ${AUTOMATIC_AUTHOR}`,
      "Set significance: notable; automatically published entries cannot carry a higher rating.",
    );
  }

  return errors;
}
