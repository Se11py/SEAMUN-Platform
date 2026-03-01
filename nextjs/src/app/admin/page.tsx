import { getDb } from '@/lib/db';
import Link from 'next/link';
import DeleteButton from './DeleteButton';

export const dynamic = 'force-dynamic'; // Prevent static generation for admin dashboard

export default async function AdminDashboard() {
    const db = getDb();

    const result = await db.query(`
    SELECT conference_id, name, organization, start_date, location, status 
    FROM conferences 
    ORDER BY start_date DESC
  `);
    const conferences = result.rows;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#0f172a' }}>Conferences</h1>
                <Link href="/admin/conferences/new" style={{
                    background: '#2563eb',
                    color: 'white',
                    padding: '0.6rem 1.2rem',
                    borderRadius: '0.375rem',
                    textDecoration: 'none',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    <i className="fas fa-plus"></i> Add New
                </Link>
            </div>

            <div style={{ background: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                        <tr>
                            <th style={{ padding: '1rem', fontWeight: '600', color: '#475569', fontSize: '0.875rem' }}>Name</th>
                            <th style={{ padding: '1rem', fontWeight: '600', color: '#475569', fontSize: '0.875rem' }}>Organization</th>
                            <th style={{ padding: '1rem', fontWeight: '600', color: '#475569', fontSize: '0.875rem' }}>Date</th>
                            <th style={{ padding: '1rem', fontWeight: '600', color: '#475569', fontSize: '0.875rem' }}>Status</th>
                            <th style={{ padding: '1rem', fontWeight: '600', color: '#475569', fontSize: '0.875rem' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {conferences.map((conf: any) => (
                            <tr key={conf.conference_id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                <td style={{ padding: '1rem', color: '#0f172a', fontWeight: '500' }}>{conf.name}</td>
                                <td style={{ padding: '1rem', color: '#475569' }}>{conf.organization}</td>
                                <td style={{ padding: '1rem', color: '#475569' }}>{new Date(conf.start_date).toLocaleDateString()}</td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{
                                        padding: '0.25rem 0.6rem',
                                        borderRadius: '9999px',
                                        fontSize: '0.75rem',
                                        fontWeight: '500',
                                        background: conf.status === 'upcoming' ? '#dcfce7' : '#f1f5f9',
                                        color: conf.status === 'upcoming' ? '#166534' : '#475569'
                                    }}>
                                        {conf.status}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <Link href={`/admin/conferences/${conf.conference_id}`} title="Edit" style={{ color: '#3b82f6', fontSize: '1.1rem' }}>
                                        <i className="fas fa-edit"></i>
                                    </Link>
                                    <DeleteButton id={conf.conference_id} />
                                </td>
                            </tr>
                        ))}
                        {conferences.length === 0 && (
                            <tr>
                                <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
                                    No conferences found. Click "Add New" to get started.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
