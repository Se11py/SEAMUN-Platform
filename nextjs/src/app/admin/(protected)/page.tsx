import { getDb } from '@/lib/db';
import Link from 'next/link';
import DeleteButton from './DeleteButton';
import DuplicateButton from './DuplicateButton';
import { getConferenceStatus } from '@/lib/conferences-data';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard({
    searchParams,
}: {
    searchParams?: Promise<{ notice?: string }>;
}) {
    const resolvedSearchParams = searchParams ? await searchParams : {};
    const notice = resolvedSearchParams.notice;
    const db = getDb();

    const result = await db.query(`
    SELECT conference_id, name, organization, start_date, end_date, location, status
    FROM conferences 
    ORDER BY start_date DESC
  `);
    const conferences = result.rows.map((conf: any) => ({
        ...conf,
        status: getConferenceStatus({
            endDate: conf.end_date,
            status: conf.status,
        }),
    }));
    const upcomingCount = conferences.filter((conf: { status: string }) => conf.status === 'upcoming').length;
    const previousCount = conferences.filter((conf: { status: string }) => conf.status === 'previous').length;

    return (
        <>
            {/* Header */}
            <div className="adm-page-header">
                <div>
                    <h1>Conferences</h1>
                    <p>Create, edit, duplicate, and manage all registered conferences.</p>
                </div>
                <Link href="/admin/conferences/new" className="adm-btn adm-btn-primary">
                    <i className="fas fa-plus"></i> New Conference
                </Link>
            </div>

            {notice && (
                <div className="adm-notice">
                    <i className="fas fa-check-circle"></i>
                    {notice}
                </div>
            )}

            {/* Stat Cards */}
            <div className="adm-stats">
                <div className="adm-stat-card">
                    <p className="adm-stat-label">Total</p>
                    <p className="adm-stat-value">{conferences.length}</p>
                </div>
                <div className="adm-stat-card">
                    <p className="adm-stat-label">Upcoming</p>
                    <p className="adm-stat-value upcoming">{upcomingCount}</p>
                </div>
                <div className="adm-stat-card">
                    <p className="adm-stat-label">Previous</p>
                    <p className="adm-stat-value previous">{previousCount}</p>
                </div>
            </div>

            {/* Table */}
            <div className="adm-section-header">
                <h2>All Conferences</h2>
            </div>

            <div className="adm-table-wrap">
                <table className="adm-table">
                    <thead>
                        <tr>
                            <th>Conference</th>
                            <th>School</th>
                            <th>Location</th>
                            <th>Dates</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {conferences.map((conf: any) => (
                            <tr key={conf.conference_id}>
                                <td className="cell-name">{conf.name}</td>
                                <td>{conf.organization}</td>
                                <td>{conf.location}</td>
                                <td>
                                    {new Date(conf.start_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    {conf.start_date !== conf.end_date && (
                                        <> &ndash; {new Date(conf.end_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</>
                                    )}
                                </td>
                                <td>
                                    <span className={`adm-badge ${conf.status}`}>
                                        {conf.status}
                                    </span>
                                </td>
                                <td>
                                    <div className="cell-actions">
                                        <Link href={`/admin/conferences/${conf.conference_id}`} className="adm-btn adm-btn-ghost" title="Edit">
                                            <i className="fas fa-pen"></i>
                                        </Link>
                                        <DuplicateButton id={conf.conference_id} />
                                        <DeleteButton id={conf.conference_id} />
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {conferences.length === 0 && (
                            <tr>
                                <td colSpan={6} className="adm-table-empty">
                                    No conferences found. Click &ldquo;New Conference&rdquo; to create your first one.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
}
