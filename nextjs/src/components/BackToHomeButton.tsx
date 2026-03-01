'use client';

import Link from 'next/link';

export default function BackToHomeButton() {
    return (
        <Link
            href="/"
            className="back-to-home-btn"
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                fontSize: '0.95rem',
                fontWeight: 500,
                marginBottom: '1.5rem',
                transition: 'all 0.2s ease',
                padding: '8px 16px',
                borderRadius: '50px',
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                border: '1px solid var(--border-color)',
                width: 'fit-content'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--bg-primary)';
                e.currentTarget.style.transform = 'translateX(-4px)';
                e.currentTarget.style.color = 'var(--accent-color)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.color = 'var(--text-secondary)';
            }}
        >
            <i className="fas fa-arrow-left"></i>
            <span>Back to Home</span>
        </Link>
    );
}
