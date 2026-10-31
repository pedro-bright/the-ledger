import matter from "gray-matter";

const rejectFrontmatterLanguage = () => {
  throw new Error("Only YAML frontmatter is allowed.");
};

// A content file can name its frontmatter language on the opening delimiter, and
// gray-matter runs `---js` through eval. Replace that engine so the code never
// runs, then refuse every other language the file asked for.
export function parseFrontmatter(raw: string) {
  const file = matter(raw, {
    engines: { javascript: rejectFrontmatterLanguage },
  });
  if (!/^ya?ml$/i.test(file.language)) rejectFrontmatterLanguage();
  return file;
}
