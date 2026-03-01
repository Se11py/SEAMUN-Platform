'use client';
import React from 'react';
import * as Sentry from '@sentry/nextjs';

interface Props {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error | undefined;
}

export default class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        // Log to error tracking service in the future (e.g. Sentry)
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        Sentry.captureException(error);
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback || (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '50vh',
                    padding: '2rem',
                    textAlign: 'center',
                    fontFamily: "'Inter', sans-serif",
                }}>
                    <div style={{
                        fontSize: '4rem',
                        marginBottom: '1rem',
                    }}>
                        😵
                    </div>
                    <h1 style={{
                        fontSize: '1.5rem',
                        fontWeight: 600,
                        marginBottom: '0.5rem',
                        color: '#1a1a2e',
                    }}>
                        Something went wrong
                    </h1>
                    <p style={{
                        fontSize: '1rem',
                        color: '#666',
                        marginBottom: '1.5rem',
                        maxWidth: '400px',
                    }}>
                        An unexpected error occurred. Please refresh the page or try again later.
                    </p>
                    <button
                        onClick={() => this.setState({ hasError: false, error: undefined })}
                        style={{
                            padding: '0.75rem 1.5rem',
                            fontSize: '0.95rem',
                            fontWeight: 500,
                            color: '#fff',
                            backgroundColor: '#3b82f6',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s',
                        }}
                        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#2563eb')}
                        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#3b82f6')}
                    >
                        Try Again
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
