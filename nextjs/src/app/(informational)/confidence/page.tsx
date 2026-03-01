import ContentPage from '@/components/ContentPage';
import Link from 'next/link';

export default function ConfidencePage() {
    return (
        <ContentPage title="💪 Confidence Building">
            <div className="info-card" style={{ marginTop: '24px' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <i className="fas fa-link" style={{ color: 'var(--accent-green)' }}></i>
                    Practice Resources
                </h3>
                <div style={{ background: 'var(--bg-glass)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    <Link href="/munsimulation" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--accent-blue)', textDecoration: 'none', padding: '8px 12px', background: 'rgba(74, 144, 226, 0.1)', borderRadius: '6px', fontSize: '0.9em' }}>
                        <i className="fas fa-gamepad"></i>
                        MUN Simulation Game
                    </Link>
                </div>
            </div>
        </ContentPage>
    );
}
