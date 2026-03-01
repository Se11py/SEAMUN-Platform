import ContentPage from '@/components/ContentPage';
import { getDb } from '@/lib/db';

async function getParticipatingSchools() {
    try {
        const pool = getDb();
        const client = await pool.connect();
        const result = await client.query('SELECT DISTINCT organization FROM conferences WHERE organization IS NOT NULL ORDER BY organization ASC');
        client.release();
        return result.rows.map(row => row.organization).filter(org => org.trim() !== '');
    } catch (error) {
        console.error('Error fetching participating schools:', error);
        return [];
    }
}

export default async function ParticipatingSchoolsPage() {
    const schools = await getParticipatingSchools();

    return (
        <ContentPage title="🎓 Participating Schools">
            <p style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 2rem auto', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                Schools that have hosted or participated in MUN conferences listed on SEAMUNs. This list is built from our PostgreSQL active database and updates dynamically as new conferences are added.
            </p>
            <div className="info-card" style={{ marginTop: '1rem', padding: '1.25rem', borderRadius: '12px', background: 'rgba(255,255,255,0.5)', border: '1px solid var(--border-color)' }}>
                {schools.length === 0 ? (
                    <p style={{ margin: 0, color: 'var(--text-muted)', textAlign: 'center' }}>No participating schools in the database yet. Check back after conferences are added.</p>
                ) : (
                    <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                        {schools.map((school, index) => (
                            <li key={index} style={{ marginBottom: '0.35rem' }}>
                                {school}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </ContentPage>
    );
}
