import type { APIRoute } from 'astro';
import { loadEvents, type EventData } from '../../../lib/content';
import { eventCard, pngResponse } from '../../../lib/og';

export function getStaticPaths() {
  return loadEvents().map((event) => ({ params: { id: event.slug }, props: { event } }));
}

export const GET: APIRoute<{ event: EventData }> = async ({ props }) => pngResponse(await eventCard(props.event));
