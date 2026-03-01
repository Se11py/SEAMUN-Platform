import { expect, test, describe } from 'vitest';
import { checkRateLimit } from './rate-limit';
import { NextRequest } from 'next/server';

describe('Rate Limiter', () => {
    test('Allows requests under the limit', async () => {
        const req = new NextRequest('http://localhost:3000/api/test', {
            headers: new Headers({ 'x-forwarded-for': '192.168.1.1' }),
        });

        const isAllowed = await checkRateLimit(req, 5);
        expect(isAllowed).toBe(true);
    });

    test('Blocks requests over the limit', async () => {
        const req = new NextRequest('http://localhost:3000/api/test', {
            headers: new Headers({ 'x-forwarded-for': '10.0.0.1' }),
        });

        // Exhaust the limit
        await checkRateLimit(req, 2);
        await checkRateLimit(req, 2);

        // Next request should be blocked
        const isAllowed = await checkRateLimit(req, 2);
        expect(isAllowed).toBe(false);
    });
});
