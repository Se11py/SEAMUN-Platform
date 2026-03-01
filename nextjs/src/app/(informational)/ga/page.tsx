import ContentPage from '@/components/ContentPage';

export default function GAPage() {
    return (
        <ContentPage title="🌐 General Assembly">
            <p style={{ textAlign: 'center', marginBottom: '2rem', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                The General Assembly (GA) is the main plenary body of the UN. In MUN, GA committees (e.g. DISEC, SPECPOL, UNHRC) follow similar procedure: large size, formal debate, speakers' lists, and resolutions.
            </p>

            <div style={{ background: 'rgba(255,255,255,0.6)', padding: '2rem', borderRadius: '16px', textAlign: 'left' }}>
                <h3 style={{ marginTop: 0, color: 'var(--text-primary)', fontFamily: "'Clash Display', sans-serif" }}>
                    📜 Typical GA procedure
                </h3>
                <ol style={{ marginLeft: '1.5rem', marginBottom: '2rem' }}>
                    <li style={{ marginBottom: '0.75rem' }}>Roll call and opening formalities.</li>
                    <li style={{ marginBottom: '0.75rem' }}>Setting the agenda (if more than one topic).</li>
                    <li style={{ marginBottom: '0.75rem' }}>General speakers' list; delegates speak in order.</li>
                    <li style={{ marginBottom: '0.75rem' }}>Moderated and unmoderated caucuses to discuss and negotiate.</li>
                    <li style={{ marginBottom: '0.75rem' }}>Introduction and debate of draft resolutions.</li>
                    <li style={{ marginBottom: '0.75rem' }}>Voting procedure: amendments, then resolution as a whole.</li>
                </ol>

                <p style={{ margin: 0, padding: '1rem', background: 'var(--bg-glass)', borderRadius: '8px', borderLeft: '4px solid var(--accent-blue)', color: 'var(--text-secondary)' }}>
                    Speak clearly, stay on topic, and follow the chair's directions. For crisis or small committees, procedure may differ—see the conference's rules.
                </p>
            </div>
        </ContentPage>
    );
}
