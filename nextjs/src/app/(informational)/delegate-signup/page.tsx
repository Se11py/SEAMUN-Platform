import ContentPage from '@/components/ContentPage';
import Link from 'next/link';

export default function DelegateSignupPage() {
    return (
        <ContentPage title="✍️ Delegate Sign Up Guide">
            <p style={{ textAlign: 'center', marginBottom: '2rem', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                How you sign up depends on whether you are part of a school delegation or attending as an individual.
            </p>

            <div style={{ display: 'grid', gap: '2rem', textAlign: 'left' }}>
                <div style={{ background: 'rgba(255,255,255,0.6)', padding: '1.5rem', borderRadius: '16px' }}>
                    <h3 style={{ marginTop: 0, color: 'var(--text-primary)', fontFamily: "'Clash Display', sans-serif" }}>
                        🏫 Through a school
                    </h3>
                    <ul style={{ marginLeft: '1.5rem', marginBottom: 0 }}>
                        <li style={{ marginBottom: '0.5rem' }}>Your MUN advisor or teacher registers the school with the conference (advisor signup link on each conference's page).</li>
                        <li style={{ marginBottom: '0.5rem' }}>You are then added to the delegation; the advisor may assign countries/committees or ask for preferences.</li>
                        <li style={{ marginBottom: '0.5rem' }}>Complete any forms or fees your school requires and submit position papers by the conference deadline.</li>
                    </ul>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.6)', padding: '1.5rem', borderRadius: '16px' }}>
                    <h3 style={{ marginTop: 0, color: 'var(--text-primary)', fontFamily: "'Clash Display', sans-serif" }}>
                        👤 Individual delegates
                    </h3>
                    <ul style={{ marginLeft: '1.5rem', marginBottom: 0 }}>
                        <li style={{ marginBottom: '0.5rem' }}>Some conferences allow independent delegates. On the conference detail page, check "Independent delegates welcome" and use the <strong>individual signup link</strong> if provided.</li>
                        <li style={{ marginBottom: '0.5rem' }}>Follow the conference's instructions for payment, country/committee preferences, and position papers.</li>
                        <li style={{ marginBottom: '0.5rem' }}>See <Link href="/individual-delegates">Individual Delegates</Link> for more info.</li>
                    </ul>
                </div>
            </div>

            <p style={{ marginTop: '2rem', padding: '1rem', background: 'var(--bg-glass)', borderRadius: '8px', borderLeft: '4px solid var(--accent-blue)', color: 'var(--text-secondary)' }}>
                Find conferences on <Link href="/">Upcoming & Previous MUNs</Link>; open a conference to see registration deadlines, advisor and delegate links, and fees.
            </p>
        </ContentPage>
    );
}
