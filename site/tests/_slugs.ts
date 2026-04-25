// Real content slugs used by the test suite.
// Verified to exist under /content at test-authoring time. If a slug disappears,
// failing tests will point at this file rather than scatter.
export const SLUGS = {
  event: 'gpt-4-release',
  thread: 'scaling-laws-debate',
  controversy: 'scaling-laws-plateau',
  actor: 'openai',
} as const;
