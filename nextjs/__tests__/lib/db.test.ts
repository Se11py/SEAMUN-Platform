import { expect, test, describe, vi, afterEach } from 'vitest';
import * as serverless from '@neondatabase/serverless';

// Need to mock the module before importing getDb
vi.mock('@neondatabase/serverless', () => {
    return {
        Pool: vi.fn(),
    };
});

import { getDb } from '@/lib/db';

describe('Database Connection', () => {
    const originalEnv = process.env;

    afterEach(() => {
        vi.clearAllMocks();
        process.env = { ...originalEnv };
    });

    test('throws error if DATABASE_URL is not set', () => {
        delete process.env.DATABASE_URL;

        expect(() => getDb()).toThrow('DATABASE_URL environment variable is not set');
    });

    test('initializes pool with DATABASE_URL when set', () => {
        const testUrl = 'postgres://test:test@localhost:5432/test';
        process.env.DATABASE_URL = testUrl;

        // This will create a new Pool because we haven't called it yet in this isolate
        const pool = getDb();

        expect(serverless.Pool).toHaveBeenCalledWith({ connectionString: testUrl });
        expect(serverless.Pool).toHaveBeenCalledTimes(1);

        // Calling it again should return the same pool and not construct a new one
        const pool2 = getDb();
        expect(serverless.Pool).toHaveBeenCalledTimes(1);
        expect(pool).toBe(pool2);
    });
});
