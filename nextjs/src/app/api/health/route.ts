import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
    const startTime = Date.now();
    let dbStatus = 'disconnected';
    let dbLatency = -1;

    try {
        const pool = getDb();
        const client = await pool.connect();
        const queryStart = Date.now();
        await client.query('SELECT 1');
        dbLatency = Date.now() - queryStart;
        client.release();
        dbStatus = 'connected';
    } catch (error) {
        console.error('Health Check DB Error:', error);
        dbStatus = 'error';
    }

    const totalLatency = Date.now() - startTime;

    return NextResponse.json(
        {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            uptime: Math.round(process.uptime()),
            database: {
                status: dbStatus,
                latencyMs: dbLatency > -1 ? dbLatency : null,
            },
            systemLatencyMs: totalLatency,
        },
        { status: dbStatus === 'connected' ? 200 : 503 }
    );
}
