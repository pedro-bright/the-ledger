/**
 * Consistency rules: checks that records agree with each other, run by
 * validate.ts over every parsed content file. Errors fail validation;
 * warnings are reported and never change the exit code.
 */

import path from "node:path";

export interface RecordFile {
  relativePath: string;
  type: string;
  data: Record<string, unknown>;
  content: string;
}

export interface Finding {
  file: string;
  message: string;
}

const ENTRY_SECTIONS = ["Summary", "What Happened", "Why It Matters"];
const MARKED_CONTESTED = ["contested", "unresolved"];
const OPEN_CHALLENGE = ["open", "under_review"];
const DECIDED_CHALLENGE = ["sustained", "dismissed", "partially_sustained"];
const NAMED_AFTER_ID = ["thread", "controversy", "actor", "challenge", "revision", "resolution"];
const KEBAB_CASE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

const list = (value: unknown) => (Array.isArray(value) ? value : []) as unknown[];
const record = (value: unknown) => (value && typeof value === "object" ? value : {}) as Record<string, unknown>;
const text = (value: unknown) => (typeof value === "string" && value !== "" ? value : undefined);
const isoDate = (value: unknown) => (typeof value === "string" && ISO_DATE.test(value) ? value : undefined);

function kebab(tag: string) {
  return tag.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export function consistencyFindings(files: RecordFile[]): { errors: Finding[]; warnings: Finding[] } {
  const errors: Finding[] = [];
  const warnings: Finding[] = [];
  const report = (into: Finding[]) => (file: RecordFile, name: string, problem: string, fix: string) =>
    into.push({ file: file.relativePath, message: `Consistency rule "${name}": ${problem}. ${fix}` });
  const error = report(errors);
  const warning = report(warnings);

  const of = (type: string) => files.filter((file) => file.type === type);
  const events = of("event");
  const challenges = of("challenge");
  const resolutions = of("resolution");
  const eventsById = new Map(events.map((file) => [file.data.id, file]));
  const resolutionsById = new Map(resolutions.map((file) => [file.data.id, file]));
  const challengeIds = new Set(challenges.map((file) => file.data.id));
  const revisionIds = new Set(of("revision").map((file) => file.data.id));
  const challengedIds = new Set(challenges.map((file) => file.data.target_claim_id));
  const resolvedCaseIds = new Set(resolutions.map((file) => file.data.case_id));

  for (const file of events) {
    const { data } = file;

    for (const section of ENTRY_SECTIONS) {
      if (!new RegExp(`^## ${section}[\\t ]*\\r?$`, "m").test(file.content)) {
        error(file, "entry sections", `body has no "## ${section}" heading`, `Add the "## ${section}" section; every entry has Summary, What Happened and Why It Matters.`);
      }
    }

    const sources = list(data.sources).map(record);
    const firstUse = new Map<string, number>();
    sources.forEach((source, i) => {
      const url = text(source.url);
      if (!url) return;
      const first = firstUse.get(url);
      if (first === undefined) firstUse.set(url, i);
      else error(file, "unique sources", `sources[${i}].url repeats sources[${first}].url (${url})`, "Remove the repeated source.");

      const published = isoDate(source.date);
      const accessed = isoDate(source.accessed);
      if (published && accessed && accessed < published) {
        error(
          file,
          "source dates",
          `sources[${i}].accessed (${accessed}) is earlier than sources[${i}].date (${published})`,
          "Correct whichever date is wrong; a source cannot be read before it was published.",
        );
      }
    });

    if (list(data.related).includes(data.id)) {
      error(file, "no self reference", `related lists the entry's own id "${data.id}"`, "Remove it from related.");
    }

    const contestation = text(record(data.contestation).status);
    if (contestation && MARKED_CONTESTED.includes(contestation) && !challengedIds.has(data.id)) {
      error(
        file,
        "contested entry has a challenge",
        `contestation.status is "${contestation}" and no challenge in content/challenges targets "${data.id}"`,
        "Add the challenge with npm run new-challenge, or set contestation.status to uncontested.",
      );
    }

    for (const [i, tag] of list(data.tags).entries()) {
      if (typeof tag === "string" && !KEBAB_CASE.test(tag)) {
        warning(file, "tag format", `tags[${i}] "${tag}" is not lower-case kebab-case`, `Use "${kebab(tag)}".`);
      }
    }
  }

  for (const file of challenges) {
    const { data } = file;
    const target = eventsById.get(data.target_claim_id);
    const status = text(record(target?.data.contestation).status);
    if (target && typeof data.status === "string" && OPEN_CHALLENGE.includes(data.status) && !(status && MARKED_CONTESTED.includes(status))) {
      error(
        file,
        "challenge target is marked",
        `target_claim_id "${data.target_claim_id}" names an entry whose contestation.status is ${status ? `"${status}"` : "missing"}`,
        `Set contestation.status to contested or unresolved in ${target.relativePath.split(path.sep).join("/")} while the challenge is ${data.status}; once the challenge is decided, the entry can take any contestation.status.`,
      );
    }

    const noteId = text(data.resolution_note_id);
    const note = noteId ? resolutionsById.get(noteId) : undefined;
    if (noteId && !note) {
      error(file, "challenge resolution link", `resolution_note_id "${noteId}" names no resolution`, "Correct the id, or add the resolution with npm run new-resolution.");
    } else if (note && note.data.case_id !== data.id) {
      error(
        file,
        "challenge resolution link",
        `resolution_note_id "${noteId}" names a resolution whose case_id is "${note.data.case_id}"`,
        `Point resolution_note_id at the resolution for "${data.id}".`,
      );
    }

    if (typeof data.status === "string" && DECIDED_CHALLENGE.includes(data.status) && !resolvedCaseIds.has(data.id)) {
      error(
        file,
        "decided challenge has a resolution",
        `status is "${data.status}" and no resolution in content/resolutions has case_id "${data.id}"`,
        `Add the resolution with npm run new-resolution -- --case ${data.id}, or set status to open or under_review.`,
      );
    }
  }

  for (const file of resolutions) {
    list(file.data.actions).map(record).forEach((action, i) => {
      const revisionId = text(action.summary_revision_id);
      if (revisionId && !revisionIds.has(revisionId)) {
        error(file, "resolution revision exists", `actions[${i}].summary_revision_id "${revisionId}" names no revision`, "Correct the id, or add the revision with npm run new-revision.");
      }
    });
  }

  for (const file of of("revision")) {
    const caseId = text(file.data.triggered_by_case_id);
    if (caseId && !challengeIds.has(caseId)) {
      error(file, "revision case exists", `triggered_by_case_id "${caseId}" names no challenge`, "Correct the id, or set it to null when no challenge triggered the revision.");
    }
  }

  for (const file of files) {
    if (!NAMED_AFTER_ID.includes(file.type) || typeof file.data.id !== "string") continue;
    const { name, ext } = path.parse(file.relativePath);
    if (name !== file.data.id) {
      error(file, "file named after id", `id "${file.data.id}" does not match the filename "${name}${ext}"`, `Rename the file to ${file.data.id}${ext}, or correct the id.`);
    }
  }

  for (const file of of("thread")) {
    const { data } = file;
    const started = isoDate(data.started);
    if (!started) continue;
    const listed = new Set(list(data.events));
    const earliest = events
      .filter((event) => listed.has(event.data.id) || list(event.data.threads).includes(data.id))
      .filter((event) => isoDate(event.data.date))
      .sort((a, b) => (a.data.date as string).localeCompare(b.data.date as string))[0];
    if (earliest && started > (earliest.data.date as string)) {
      warning(
        file,
        "thread start",
        `started (${started}) is later than its earliest entry, "${earliest.data.id}" (${earliest.data.date})`,
        `Set started to ${earliest.data.date} or earlier, or remove that entry from the thread.`,
      );
    }
  }

  return { errors, warnings };
}
