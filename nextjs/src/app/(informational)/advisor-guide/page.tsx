import ContentPage from '@/components/ContentPage';
import Link from 'next/link';

export default function AdvisorGuidePage() {
    return (
        <ContentPage title="👩‍🏫 Advisor Guide">
            <p style={{ textAlign: 'center', marginBottom: '2rem', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                MUN advisors support their school's delegation before and during conferences. This page gives a short overview of your role and how to use SEAMUNs.
            </p>

            <div style={{ display: 'grid', gap: '2rem', textAlign: 'left' }}>
                <div style={{ background: 'rgba(255,255,255,0.6)', padding: '1.5rem', borderRadius: '16px' }}>
                    <h3 style={{ marginTop: 0, color: 'var(--text-primary)', fontFamily: "'Clash Display', sans-serif" }}>
                        📅 Before the conference
                    </h3>
                    <ul style={{ marginLeft: '1.5rem', marginBottom: 0 }}>
                        <li style={{ marginBottom: '0.5rem' }}>Choose conferences that fit your students' level and your school calendar—browse <Link href="/">Upcoming & Previous MUNs</Link>.</li>
                        <li style={{ marginBottom: '0.5rem' }}>Register your delegation using each conference's advisor signup link (shown on the conference's detail page).</li>
                        <li style={{ marginBottom: '0.5rem' }}>Help delegates with country assignments, position papers, and procedure (use <Link href="/how-to-prep">How to Prep</Link> and resource pages).</li>
                        <li style={{ marginBottom: '0.5rem' }}>Submit any required forms (delegate lists, fees, dietary/access needs) by the deadlines.</li>
                    </ul>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.6)', padding: '1.5rem', borderRadius: '16px' }}>
                    <h3 style={{ marginTop: 0, color: 'var(--text-primary)', fontFamily: "'Clash Display', sans-serif" }}>
                        🏫 At the conference
                    </h3>
                    <ul style={{ marginLeft: '1.5rem', marginBottom: 0 }}>
                        <li style={{ marginBottom: '0.5rem' }}>Be the main point of contact for the secretariat and your school.</li>
                        <li style={{ marginBottom: '0.5rem' }}>Support delegates with logistics, conduct, and well-being; escalate issues to the conference staff when needed.</li>
                    </ul>
                </div>
            </div>
        </ContentPage>
    );
}
