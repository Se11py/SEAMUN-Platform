import { LRUCache } from 'lru-cache';
import { NextRequest } from 'next/server';

const rateLimitCache = new LRUCache<string, number>({
    max: 1000,
    ttl: 60000, // 1 minute window
});

/**
 * Validates whether the incoming request has exceeded the rate limit.
 * Uses a memory-backed LRU Cache.
 */
export async function checkRateLimit(request: NextRequest, limit: number = 60): Promise<boolean> {
    const ip = request.headers.get('x-forwarded-for') ?? (request as any).ip ?? '127.0.0.1';

    const tokenCount = rateLimitCache.get(ip) || 0;

    if (tokenCount >= limit) {
        return false; // Rate limit exceeded
    }

    rateLimitCache.set(ip, tokenCount + 1);
    return true; // Request allowed
}
