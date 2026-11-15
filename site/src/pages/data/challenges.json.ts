import { dataResponse } from '../../lib/data-export';

export function GET() {
  return dataResponse('challenges.json');
}
