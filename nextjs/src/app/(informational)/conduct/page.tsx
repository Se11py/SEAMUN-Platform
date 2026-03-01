import ContentPage from '@/components/ContentPage';

export default function ConductPage() {
    return (
        <ContentPage title="⚖️ Conduct & Decorum">
            <p>Professional behavior keeps debate fair and productive. Follow these guidelines at SEAMUNs conferences.</p>

            <h3 style={{ fontFamily: "'Clash Display', sans-serif", fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
                🏛️ In committee
            </h3>
            <ul style={{ paddingLeft: '1.5rem', marginBottom: '2rem' }}>
                <li style={{ marginBottom: '0.5rem' }}>Address the chair and other delegates formally (e.g. "Honorable Chair," "the delegate of...").</li>
                <li style={{ marginBottom: '0.5rem' }}>No personal attacks; criticize positions, not people.</li>
                <li style={{ marginBottom: '0.5rem' }}>Follow the rules of procedure and the chair's rulings.</li>
                <li style={{ marginBottom: '0.5rem' }}>Raise your placard for points and motions; wait to be recognized before speaking.</li>
                <li style={{ marginBottom: '0.5rem' }}>No use of electronic devices for unauthorized communication during formal debate, unless the conference allows it.</li>
            </ul>

            <h3 style={{ fontFamily: "'Clash Display', sans-serif", fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
                👔 General
            </h3>
            <ul style={{ paddingLeft: '1.5rem', marginBottom: '2rem' }}>
                <li style={{ marginBottom: '0.5rem' }}>Be on time and dressed in business or business-casual attire as required.</li>
                <li style={{ marginBottom: '0.5rem' }}>Respect the venue, staff, and other delegates.</li>
                <li style={{ marginBottom: '0.5rem' }}>Report any harassment or safety concerns to the secretariat or advisors.</li>
            </ul>

            <p style={{ marginTop: '2rem', padding: '1rem', background: 'var(--bg-glass)', borderRadius: '8px', borderLeft: '4px solid var(--accent-blue)' }}>
                Specific rules may vary by conference; check the conference's code of conduct or rules pack.
            </p>
        </ContentPage>
    );
}
