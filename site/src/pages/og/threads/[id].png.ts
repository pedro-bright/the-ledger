import type { APIRoute } from 'astro';
import { getThreadEvents, loadEvents, loadThreads, type ThreadData } from '../../../lib/content';
import { pngResponse, threadCard } from '../../../lib/og';

export function getStaticPaths() {
  const events = loadEvents();
  return loadThreads().map((thread) => ({
    params: { id: thread.slug },
    props: { thread, entries: getThreadEvents(thread, events).length },
  }));
}

export const GET: APIRoute<{ thread: ThreadData; entries: number }> = async ({ props }) =>
  pngResponse(await threadCard(props.thread, props.entries));
