import { dataResponse } from '../../lib/data-export';

export function GET() {
  return dataResponse('revisions.json');
}
