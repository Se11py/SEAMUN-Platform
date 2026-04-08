import { currentUser } from '@clerk/nextjs/server';
import { listPositionPapers } from '@/lib/position-paper-actions';
import Navbar from '@/components/Navbar';
import BackToHomeButton from '@/components/BackToHomeButton';
import Breadcrumbs from '@/components/Breadcrumbs';
import PositionPaperArchiveClient from './PositionPaperArchiveClient';
import { Metadata } from 'next';
import { getDb } from '@/lib/db';

export const metadata: Metadata = {
    title: 'Position Paper Archive - SEAMUNs',
    description: 'Browse real position paper examples shared by the MUN community. Get inspired for your next conference.',
};

export default async function PositionPaperArchivePage() {
    const [user, papers] = await Promise.all([currentUser(), listPositionPapers()]);

    // Attach a has_file flag without sending base64 data to the client
    const db = getDb();
    const fileRows = papers.length
        ? await db.query(
              `SELECT paper_id FROM position_papers WHERE paper_id = ANY($1::int[]) AND file_data IS NOT NULL`,
              [papers.map((p) => p.paper_id)]
          )
        : { rows: [] as { paper_id: number }[] };
    const fileSet = new Set(fileRows.rows.map((r) => r.paper_id));

    const papersWithFlags = papers.map((p) => ({
        ...p,
        created_at: p.created_at as unknown as Date,
        updated_at: p.updated_at as unknown as Date,
        has_file: fileSet.has(p.paper_id),
    }));

    return (
        <>
            <Navbar />
            <main className="main">
                <div style={{ maxWidth: '860px', margin: '0 auto', paddingTop: 'var(--space-4xl, 2.5rem)', paddingBottom: 'var(--space-2xl, 2rem)' }}>
                    <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Position Paper Archive' }]} />
                    <BackToHomeButton />
                    <PositionPaperArchiveClient
                        initialPapers={papersWithFlags}
                        isSignedIn={!!user}
                    />
                </div>
            </main>
        </>
    );
}
