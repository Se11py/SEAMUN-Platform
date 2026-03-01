'use client';

import { useEffect } from 'react';

export default function SimulationError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Simulation error:', error);
    }, [error]);

    return (
        <div className="error-page" style={{
            display: 'flex',
            flexDirection: 'column' as const,
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            padding: '40px 24px',
            textAlign: 'center' as const,
        }}>
            <i className="fas fa-gamepad" style={{
                fontSize: '64px',
                color: 'var(--accent-color, #e74c3c)',
                marginBottom: '24px',
                opacity: 0.8,
            }}></i>
            <h1 style={{
                fontSize: '28px',
                fontWeight: 700,
                marginBottom: '12px',
                fontFamily: 'var(--font-heading, "Clash Display", sans-serif)',
            }}>Simulation Error</h1>
            <p style={{
                color: 'var(--text-secondary)',
                fontSize: '16px',
                maxWidth: '500px',
                marginBottom: '32px',
                lineHeight: 1.6,
            }}>
                Something went wrong with the MUN simulation. Try restarting or go back to the homepage.
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' as const, justifyContent: 'center' }}>
                <button
                    onClick={() => reset()}
                    className="btn btn-primary"
                    style={{ minWidth: '160px' }}
                >
                    <i className="fas fa-redo"></i> Restart Simulation
                </button>
                <a href="/" className="btn btn-secondary" style={{ minWidth: '140px' }}>
                    <i className="fas fa-home"></i> Go Home
                </a>
            </div>
        </div>
    );
}
