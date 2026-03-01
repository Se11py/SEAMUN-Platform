import ContentPage from '@/components/ContentPage';
import Link from 'next/link';

export default function CommitteesPage() {
    return (
        <ContentPage title="🏛️ Committees">
            <p style={{ textAlign: 'center', marginBottom: '2rem', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                MUN conferences use committees to simulate different UN and international bodies. Each committee has a specific topic and rules of procedure.
            </p>

            <div style={{ display: 'grid', gap: '2rem', textAlign: 'left' }}>
                <div style={{ background: 'rgba(255,255,255,0.6)', padding: '1.5rem', borderRadius: '16px' }} id="traditional">
                    <h3 style={{ marginTop: 0, color: 'var(--text-primary)', fontFamily: "'Clash Display', sans-serif" }}>
                        📋 Traditional committees
                    </h3>
                    <ul style={{ marginLeft: '1.5rem', marginBottom: 0 }}>
                        <li style={{ marginBottom: '0.5rem' }}><strong>UNGA (General Assembly)</strong> — Plenary body; broad topics, large size.</li>
                        <li style={{ marginBottom: '0.5rem' }}><strong>UNSC (Security Council)</strong> — Peace and security; 15 members, veto power.</li>
                        <li style={{ marginBottom: '0.5rem' }}><strong>UNHRC (Human Rights Council)</strong> — Human rights and humanitarian issues.</li>
                        <li style={{ marginBottom: '0.5rem' }}><strong>DISEC (Disarmament & International Security)</strong> — Arms control, security.</li>
                        <li style={{ marginBottom: '0.5rem' }}><strong>ECOSOC (Economic and Social)</strong> — Development, health, environment.</li>
                        <li style={{ marginBottom: '0.5rem' }}><strong>SPECPOL (Special Political & Decolonization)</strong> — Decolonization, special political.</li>
                        <li style={{ marginBottom: '0.5rem' }}><strong>UNEP / WHO / UNESCO</strong> — Specialized agencies on environment, health, culture.</li>
                    </ul>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.6)', padding: '1.5rem', borderRadius: '16px' }} id="special">
                    <h3 style={{ marginTop: 0, color: 'var(--text-primary)', fontFamily: "'Clash Display', sans-serif" }}>
                        ⭐ Special committees
                    </h3>
                    <ul style={{ marginLeft: '1.5rem', marginBottom: 0 }}>
                        <li style={{ marginBottom: '0.5rem' }}><strong>ICJ (International Court of Justice)</strong> — Legal simulation; cases, judges, counsel.</li>
                        <li style={{ marginBottom: '0.5rem' }}><strong>Crisis committees</strong> — Fast-paced, directives, cabinet/regional scenarios.</li>
                        <li style={{ marginBottom: '0.5rem' }}><strong>Joint cabinets / historical</strong> — Multi-committee crisis or historical re-enactment.</li>
                        <li style={{ marginBottom: '0.5rem' }}><strong>Press Corps</strong> — Journalists; coverage, interviews, articles.</li>
                    </ul>
                </div>
            </div>

            <p style={{ marginTop: '2rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.95em' }}>
                Check each conference's committee list for topics, chairs, and size. Use <Link href="/">Upcoming & Previous MUNs</Link> to browse conferences.
            </p>
        </ContentPage>
    );
}
