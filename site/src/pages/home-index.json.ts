import { loadEvents } from '../lib/content';
import { buildHomeIndex } from '../lib/home';

export function GET() {
  return new Response(JSON.stringify(buildHomeIndex(loadEvents())), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
