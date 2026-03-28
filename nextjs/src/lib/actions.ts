'use server';

import { getDb } from './db';
import { currentUser } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { getConferenceStatus } from './conferences-data';

export interface User {
    user_id: string;
    email: string;
    name: string;
    pronouns?: string;
    profile_picture?: string;
    banner?: string;
    auth_provider?: string;
    created_at?: Date;
    updated_at?: Date;
}

export interface TrackedConference {
    conference_id: number;
    name: string;
    organization: string;
    location: string;
    start_date: string;
    end_date: string;
    description: string;
    status: string; // Conference status (upcoming etc)
    attendance_status: 'saved' | 'attending' | 'not-attending';
    attendance_updated_at: Date;
    [key: string]: any;
}

// User Operations

export async function syncUser(): Promise<string | null> {
    const user = await currentUser();
    if (!user) return null;

    const sql = getDb();

    try {
        await sql.query(`
            INSERT INTO users (user_id, email, name, profile_picture, auth_provider)
            VALUES ($1, $2, $3, $4, 'clerk')
            ON CONFLICT (user_id) DO UPDATE SET
                email = EXCLUDED.email,
                name = EXCLUDED.name,
                profile_picture = EXCLUDED.profile_picture,
                updated_at = CURRENT_TIMESTAMP
        `, [user.id, user.emailAddresses[0]?.emailAddress, `${user.firstName} ${user.lastName}`, user.imageUrl]);
        return user.id;
    } catch (error) {
        console.error('Error syncing user:', error);
        return null;
    }
}

export async function getUserProfile(): Promise<User | null> {
    const user = await currentUser();
    if (!user) return null;

    const sql = getDb();
    const result = await sql.query(`SELECT * FROM users WHERE user_id = $1`, [user.id]);

    if ((result.rowCount ?? 0) === 0) {
        // Try to sync if not found
        await syncUser();
        const newResult = await sql.query(`SELECT * FROM users WHERE user_id = $1`, [user.id]);
        return (newResult.rows[0] as User) || null;
    }

    return (result.rows[0] as User);
}

export async function updateProfile(formData: FormData) {
    const user = await currentUser();
    if (!user) throw new Error('Not authenticated');

    const pronouns = formData.get('pronouns') as string;

    const sql = getDb();

    try {
        await sql.query(`
            UPDATE users 
            SET pronouns = $1, updated_at = CURRENT_TIMESTAMP
            WHERE user_id = $2
        `, [pronouns, user.id]);
        revalidatePath('/profile');
        return { success: true };
    } catch (error) {
        console.error('Error updating profile:', error);
        return { success: false, error: 'Failed to update profile' };
    }
}

// Conference Operations

export async function toggleAttendance(conferenceId: number, status: 'saved' | 'attending' | 'not-attending') {
    const user = await currentUser();
    if (!user) throw new Error('Not authenticated');

    // Ensure user exists in our DB
    await syncUser();

    const sql = getDb();

    try {
        if (status === 'not-attending') {
            await sql.query(`
                DELETE FROM attendance 
                WHERE user_id = $1 AND conference_id = $2
            `, [user.id, conferenceId]);
        } else {
            await sql.query(`
                INSERT INTO attendance (user_id, conference_id, status)
                VALUES ($1, $2, $3)
                ON CONFLICT (user_id, conference_id) 
                DO UPDATE SET status = $3, updated_at = CURRENT_TIMESTAMP
            `, [user.id, conferenceId, status]);
        }
        revalidatePath('/profile');
        revalidatePath(`/conference/${conferenceId}`);
        // Revalidate the home page too if needed, but profile is main
        return { success: true };
    } catch (error) {
        console.error('Error toggling attendance:', error);
        return { success: false, error: 'Failed to update attendance' };
    }
}

export async function getTrackedConferences(): Promise<TrackedConference[]> {
    const user = await currentUser();
    if (!user) return [];

    const sql = getDb();

    const result = await sql.query(`
        SELECT 
            c.*, 
            a.status as attendance_status,
            a.updated_at as attendance_updated_at
        FROM attendance a
        JOIN conferences c ON a.conference_id = c.conference_id
        WHERE a.user_id = $1
        ORDER BY a.updated_at DESC
    `, [user.id]);

    return result.rows.map((conference) => ({
        ...conference,
        status: getConferenceStatus({
            endDate: conference.end_date,
            status: conference.status,
        }),
    })) as TrackedConference[];
}

export async function getConferenceAttendanceStatus(conferenceId: number): Promise<'saved' | 'attending' | 'not-attending' | null> {
    const user = await currentUser();
    if (!user) return null;

    const sql = getDb();
    const result = await sql.query(`
        SELECT status FROM attendance 
        WHERE user_id = $1 AND conference_id = $2
    `, [user.id, conferenceId]);

    return (result.rowCount ?? 0) > 0 ? (result.rows[0].status as 'saved' | 'attending' | 'not-attending') : null;
}
