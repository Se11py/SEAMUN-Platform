'use server';
import { getDb } from './db';
import { currentUser } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

async function requireAdmin() {
    const user = await currentUser();
    if (!user) throw new Error('Unauthorized');

    const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(e => e.trim().toLowerCase()) || [];
    const userEmail = user.emailAddresses[0]?.emailAddress?.toLowerCase();

    if (!userEmail || !adminEmails.includes(userEmail)) {
        throw new Error('Forbidden');
    }

    return user;
}

export async function deleteConference(id: number) {
    await requireAdmin();
    const db = getDb();

    // Safe deletion covering all related tables
    await db.query('DELETE FROM allocations WHERE conference_id = $1', [id]);
    await db.query('DELETE FROM available_awards WHERE conference_id = $1', [id]);
    await db.query('DELETE FROM unique_topics WHERE conference_id = $1', [id]);
    await db.query('DELETE FROM committees WHERE conference_id = $1', [id]);
    await db.query('DELETE FROM attendance WHERE conference_id = $1', [id]);
    await db.query('DELETE FROM conferences WHERE conference_id = $1', [id]);

    revalidatePath('/admin');
    revalidatePath('/');
}

export async function createConference(formData: FormData) {
    await requireAdmin();
    const db = getDb();

    const name = formData.get('name') as string;
    const organization = formData.get('organization') as string;
    const location = formData.get('location') as string;
    const country_code = (formData.get('country_code') as string) || null;
    const start_date = formData.get('start_date') as string;
    const end_date = formData.get('end_date') as string;
    const status = formData.get('status') as string;
    const size = (formData.get('size') as string) || null;
    const description = (formData.get('description') as string) || null;
    const website = (formData.get('website') as string) || null;

    const price = (formData.get('price_per_delegate') as string) || null;

    const result = await db.query(`
    INSERT INTO conferences (
      name, organization, location, country_code, start_date, end_date, 
      status, size, description, website, price_per_delegate
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    RETURNING conference_id
  `, [name, organization, location, country_code, start_date, end_date, status, size, description, website, price]);

    revalidatePath('/admin');
    revalidatePath('/');
    return result.rows[0].conference_id;
}

export async function updateConference(id: number, formData: FormData) {
    await requireAdmin();
    const db = getDb();

    const name = formData.get('name') as string;
    const organization = formData.get('organization') as string;
    const location = formData.get('location') as string;
    const country_code = (formData.get('country_code') as string) || null;
    const start_date = formData.get('start_date') as string;
    const end_date = formData.get('end_date') as string;
    const status = formData.get('status') as string;
    const size = (formData.get('size') as string) || null;
    const description = (formData.get('description') as string) || null;
    const website = (formData.get('website') as string) || null;
    const price = (formData.get('price_per_delegate') as string) || null;

    await db.query(`
    UPDATE conferences SET
      name=$1, organization=$2, location=$3, country_code=$4, start_date=$5, end_date=$6,
      status=$7, size=$8, description=$9, website=$10, price_per_delegate=$11
    WHERE conference_id = $12
  `, [name, organization, location, country_code, start_date, end_date, status, size, description, website, price, id]);

    revalidatePath('/admin');
    revalidatePath(`/admin/conferences/${id}`);
    revalidatePath(`/conference/${id}`);
    revalidatePath('/');
}
