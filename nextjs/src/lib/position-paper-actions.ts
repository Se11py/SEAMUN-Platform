'use server';

import { getDb } from './db';
import { currentUser } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { syncUser } from './actions';

export interface PositionPaper {
    paper_id: number;
    title: string;
    committee_name: string | null;
    conference_name: string | null;
    topic: string | null;
    link: string | null;
    file_name: string | null;
    file_type: string | null;
    best_paper_tag: 'committee' | 'overall' | 'none';
    created_at: Date;
    updated_at: Date;
    is_own?: boolean;
}

export interface PositionPaperWithData extends PositionPaper {
    file_data: string | null;
}

const MAX_FILE_SIZE_BYTES = 3 * 1024 * 1024; // 3 MB

export async function listPositionPapers(): Promise<PositionPaper[]> {
    const db = getDb();
    const user = await currentUser();

    const result = await db.query(`
        SELECT
            paper_id, title, committee_name, conference_name, topic,
            link, file_name, file_type, best_paper_tag, created_at, updated_at,
            user_id
        FROM position_papers
        ORDER BY created_at DESC
    `);

    return result.rows.map((row) => ({
        paper_id: row.paper_id,
        title: row.title,
        committee_name: row.committee_name,
        conference_name: row.conference_name,
        topic: row.topic,
        link: row.link,
        file_name: row.file_name,
        file_type: row.file_type,
        best_paper_tag: row.best_paper_tag ?? 'none',
        created_at: row.created_at,
        updated_at: row.updated_at,
        is_own: user ? row.user_id === user.id : false,
    }));
}

export async function getPositionPaperFile(paperId: number): Promise<PositionPaperWithData | null> {
    const db = getDb();
    const result = await db.query(
        'SELECT * FROM position_papers WHERE paper_id = $1',
        [paperId]
    );
    if ((result.rowCount ?? 0) === 0) return null;
    const row = result.rows[0];
    return {
        paper_id: row.paper_id,
        title: row.title,
        committee_name: row.committee_name,
        conference_name: row.conference_name,
        topic: row.topic,
        link: row.link,
        file_data: row.file_data,
        file_name: row.file_name,
        file_type: row.file_type,
        best_paper_tag: row.best_paper_tag ?? 'none',
        created_at: row.created_at,
        updated_at: row.updated_at,
    };
}

export async function submitPositionPaper(formData: FormData): Promise<{ success: boolean; error?: string; paper_id?: number }> {
    const user = await currentUser();
    if (!user) return { success: false, error: 'Not authenticated' };

    await syncUser();

    const title = (formData.get('title') as string)?.trim();
    if (!title) return { success: false, error: 'Title is required' };

    const ownWorkRaw = formData.get('own_work_confirmed');
    if (!ownWorkRaw) return { success: false, error: 'You must confirm this is your own work' };

    const committee_name = (formData.get('committee_name') as string)?.trim() || null;
    const conference_name = (formData.get('conference_name') as string)?.trim() || null;
    const topic = (formData.get('topic') as string)?.trim() || null;
    const best_paper_tag = (formData.get('best_paper_tag') as string) || 'none';
    const link = (formData.get('link') as string)?.trim() || null;

    if (link && !link.startsWith('https://')) {
        return { success: false, error: 'Link must start with https://' };
    }

    const allowedTags = ['committee', 'overall', 'none'];
    if (!allowedTags.includes(best_paper_tag)) {
        return { success: false, error: 'Invalid tag' };
    }

    let file_data: string | null = null;
    let file_name: string | null = null;
    let file_type: string | null = null;

    const file = formData.get('file') as File | null;
    if (file && file.size > 0) {
        const allowedTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ];
        if (!allowedTypes.includes(file.type)) {
            return { success: false, error: 'Only PDF and Word (.doc, .docx) files are supported' };
        }
        if (file.size > MAX_FILE_SIZE_BYTES) {
            return { success: false, error: 'File must be smaller than 3 MB' };
        }
        const buffer = await file.arrayBuffer();
        file_data = Buffer.from(buffer).toString('base64');
        file_name = file.name;
        file_type = file.type;
    }

    if (!link && !file_data) {
        return { success: false, error: 'Please provide a link or upload a file' };
    }

    const db = getDb();
    try {
        const result = await db.query(`
            INSERT INTO position_papers
                (user_id, title, committee_name, conference_name, topic, link, file_data, file_name, file_type, best_paper_tag, own_work_confirmed)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, TRUE)
            RETURNING paper_id
        `, [user.id, title, committee_name, conference_name, topic, link, file_data, file_name, file_type, best_paper_tag]);

        revalidatePath('/position-paper-archive');
        return { success: true, paper_id: result.rows[0].paper_id };
    } catch (error) {
        console.error('Error submitting position paper:', error);
        return { success: false, error: 'Failed to save paper' };
    }
}

export async function updatePositionPaper(paperId: number, formData: FormData): Promise<{ success: boolean; error?: string }> {
    const user = await currentUser();
    if (!user) return { success: false, error: 'Not authenticated' };

    const db = getDb();
    const ownership = await db.query(
        'SELECT user_id FROM position_papers WHERE paper_id = $1',
        [paperId]
    );
    if ((ownership.rowCount ?? 0) === 0) return { success: false, error: 'Not found' };
    if (ownership.rows[0].user_id !== user.id) return { success: false, error: 'Not authorised' };

    const title = (formData.get('title') as string)?.trim();
    if (!title) return { success: false, error: 'Title is required' };

    const committee_name = (formData.get('committee_name') as string)?.trim() || null;
    const conference_name = (formData.get('conference_name') as string)?.trim() || null;
    const topic = (formData.get('topic') as string)?.trim() || null;
    const best_paper_tag = (formData.get('best_paper_tag') as string) || 'none';
    const link = (formData.get('link') as string)?.trim() || null;

    if (link && !link.startsWith('https://')) {
        return { success: false, error: 'Link must start with https://' };
    }

    const allowedTags = ['committee', 'overall', 'none'];
    if (!allowedTags.includes(best_paper_tag)) {
        return { success: false, error: 'Invalid tag' };
    }

    // Handle optional new file upload
    let updateFileFields = '';
    const params: any[] = [title, committee_name, conference_name, topic, link, best_paper_tag];

    const file = formData.get('file') as File | null;
    if (file && file.size > 0) {
        const allowedTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ];
        if (!allowedTypes.includes(file.type)) {
            return { success: false, error: 'Only PDF and Word files are supported' };
        }
        if (file.size > MAX_FILE_SIZE_BYTES) {
            return { success: false, error: 'File must be smaller than 3 MB' };
        }
        const buffer = await file.arrayBuffer();
        params.push(Buffer.from(buffer).toString('base64'), file.name, file.type);
        updateFileFields = `, file_data = $${params.length - 2}, file_name = $${params.length - 1}, file_type = $${params.length}`;
    }

    params.push(paperId);

    try {
        await db.query(`
            UPDATE position_papers SET
                title = $1,
                committee_name = $2,
                conference_name = $3,
                topic = $4,
                link = $5,
                best_paper_tag = $6
                ${updateFileFields},
                updated_at = CURRENT_TIMESTAMP
            WHERE paper_id = $${params.length}
        `, params);

        revalidatePath('/position-paper-archive');
        return { success: true };
    } catch (error) {
        console.error('Error updating position paper:', error);
        return { success: false, error: 'Failed to update paper' };
    }
}

export async function deletePositionPaper(paperId: number): Promise<{ success: boolean; error?: string }> {
    const user = await currentUser();
    if (!user) return { success: false, error: 'Not authenticated' };

    const db = getDb();
    const ownership = await db.query(
        'SELECT user_id FROM position_papers WHERE paper_id = $1',
        [paperId]
    );
    if ((ownership.rowCount ?? 0) === 0) return { success: false, error: 'Not found' };
    if (ownership.rows[0].user_id !== user.id) return { success: false, error: 'Not authorised' };

    try {
        await db.query('DELETE FROM position_papers WHERE paper_id = $1', [paperId]);
        revalidatePath('/position-paper-archive');
        return { success: true };
    } catch (error) {
        console.error('Error deleting position paper:', error);
        return { success: false, error: 'Failed to delete paper' };
    }
}
