'use client';

import { useEffect } from 'react';

export default function ConferenceError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Conference page error:', error);
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
            <i className="fas fa-calendar-times" style={{
                fontSize: '64px',
                color: 'var(--accent-color, #e74c3c)',
                marginBottom: '24px',
                opacity: 0.8,
            }}></i>
            <h1 style={{
                fontSize: '28px',
                fontWeight: 700,
                marginBottom: '12px',
                fontFamily: 'var(--font-heading, var(--font-playfair), serif)',
            }}>Conference not available</h1>
            <p style={{
                color: 'var(--text-secondary)',
                fontSize: '16px',
                maxWidth: '500px',
                marginBottom: '32px',
                lineHeight: 1.6,
            }}>
                We couldn&apos;t load this conference. It may have been removed or there was a temporary error.
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' as const, justifyContent: 'center' }}>
                <button
                    onClick={() => reset()}
                    className="btn btn-primary"
                    style={{ minWidth: '140px' }}
                >
                    <i className="fas fa-redo"></i> Try Again
                </button>
                <a href="/" className="btn btn-secondary" style={{ minWidth: '140px' }}>
                    <i className="fas fa-globe-americas"></i> All Conferences
                </a>
            </div>
        </div>
    );
}
