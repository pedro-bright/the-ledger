import { defaultCard, pngResponse } from '../../lib/og';

export const GET = async () => pngResponse(await defaultCard());
