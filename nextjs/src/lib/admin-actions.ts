'use server';
import { getDb } from './db';
import { currentUser } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { userHasAdminEmail } from './admin-auth';
import { getConferenceStatus } from './conferences-data';

async function requireAdmin() {
    const user = await currentUser();
    if (!user) throw new Error('Unauthorized');
    if (!userHasAdminEmail(user)) throw new Error('Forbidden');

    return user;
}

async function runInTransaction<T>(callback: (client: any) => Promise<T>): Promise<T> {
    const client = await getDb().connect();

    try {
        await client.query('BEGIN');
        const result = await callback(client);
        await client.query('COMMIT');
        return result;
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}

type CommitteeInput = {
    name: string;
    topic: string | null;
    chairInfo: string | null;
};

type CommitteeChairInput = {
    role: string;
    contact: string;
};

const STANDARD_CHAIR_ROLES = ['Head Chair', 'Deputy Chair', 'Back Room Chair', 'Front Room Chair'] as const;
const PRESS_CHAIR_ROLES = ['Chief Editor', 'Editor'] as const;

function normalizeOptionalString(value: FormDataEntryValue | null) {
    const normalized = typeof value === 'string' ? value.trim() : '';
    return normalized || null;
}

function normalizeStringArray(values: FormDataEntryValue[]) {
    return values
        .map((value) => typeof value === 'string' ? value.trim() : '')
        .filter(Boolean);
}

function isPressCommittee(name: string) {
    return /press\s*corps?/i.test(name);
}

function normalizeChairRole(role: string, committeeName: string, index: number) {
    const allowedRoles = isPressCommittee(committeeName) ? [...PRESS_CHAIR_ROLES] : [...STANDARD_CHAIR_ROLES];
    if (allowedRoles.includes(role as typeof allowedRoles[number])) {
        return role;
    }

    if (isPressCommittee(committeeName)) {
        return index === 0 ? 'Chief Editor' : 'Editor';
    }

    return index === 0 ? 'Head Chair' : 'Deputy Chair';
}

function parseCommitteeChairs(value: FormDataEntryValue | null, committeeName: string) {
    if (typeof value !== 'string' || !value.trim()) {
        return [];
    }

    try {
        const parsed = JSON.parse(value);
        if (!Array.isArray(parsed)) {
            return [];
        }

        return parsed
            .map((chair, index) => ({
                role: normalizeChairRole(typeof chair?.role === 'string' ? chair.role.trim() : '', committeeName, index),
                contact: typeof chair?.contact === 'string' ? chair.contact.trim() : '',
            }))
            .filter((chair) => chair.contact);
    } catch {
        return [];
    }
}

function serializeCommitteeChairs(chairs: CommitteeChairInput[]) {
    return chairs
        .map((chair) => `${chair.role}: ${chair.contact}`)
        .join(' | ');
}

function deriveStoredStatus(endDate: string) {
    return getConferenceStatus({
        endDate,
        status: 'upcoming',
    });
}

function parseCommittees(formData: FormData): CommitteeInput[] {
    const committeeNames = formData.getAll('committee_name');
    const committeeTopics = formData.getAll('committee_topic');
    const committeeChairs = formData.getAll('committee_chairs');

    return committeeNames
        .map((value, index) => {
            const name = typeof value === 'string' ? value.trim() : '';
            const chairs = parseCommitteeChairs(committeeChairs[index] ?? null, name);

            if (name && chairs.length < 2) {
                throw new Error(`Committee "${name}" must have at least 2 chair contacts.`);
            }

            return {
                name,
                topic: normalizeOptionalString(committeeTopics[index] ?? null),
                chairInfo: chairs.length > 0 ? serializeCommitteeChairs(chairs) : null,
            };
        })
        .filter((committee) => committee.name);
}

async function replaceConferenceRelations(
    db: { query: (queryText: string, params?: any[]) => Promise<any> },
    conferenceId: number,
    {
        uniqueTopics,
        allocations,
        committees,
    }: {
        uniqueTopics: string[];
        allocations: string[];
        committees: CommitteeInput[];
    }
) {
    await db.query('DELETE FROM unique_topics WHERE conference_id = $1', [conferenceId]);
    await db.query('DELETE FROM allocations WHERE conference_id = $1', [conferenceId]);
    await db.query('DELETE FROM committees WHERE conference_id = $1', [conferenceId]);

    for (const topic of uniqueTopics) {
        await db.query('INSERT INTO unique_topics (conference_id, topic) VALUES ($1, $2)', [conferenceId, topic]);
    }

    for (const country of allocations) {
        await db.query('INSERT INTO allocations (conference_id, country) VALUES ($1, $2)', [conferenceId, country]);
    }

    for (const committee of committees) {
        await db.query(`
            INSERT INTO committees (conference_id, name, topic, chair_info)
            VALUES ($1, $2, $3, $4)
        `, [conferenceId, committee.name, committee.topic, committee.chairInfo]);
    }
}

export async function deleteConference(id: number) {
    await requireAdmin();
    await runInTransaction(async (db) => {
        await db.query('DELETE FROM allocations WHERE conference_id = $1', [id]);
        await db.query('DELETE FROM available_awards WHERE conference_id = $1', [id]);
        await db.query('DELETE FROM unique_topics WHERE conference_id = $1', [id]);
        await db.query('DELETE FROM committees WHERE conference_id = $1', [id]);
        await db.query('DELETE FROM attendance WHERE conference_id = $1', [id]);
        await db.query('DELETE FROM conferences WHERE conference_id = $1', [id]);
    });

    revalidatePath('/admin');
    revalidatePath('/');
}

export async function createConference(formData: FormData) {
    await requireAdmin();

    const name = formData.get('name') as string;
    const organization = formData.get('organization') as string;
    const location = formData.get('location') as string;
    const country_code = (formData.get('country_code') as string) || null;
    const start_date = formData.get('start_date') as string;
    const end_date = formData.get('end_date') as string;
    const status = deriveStoredStatus(end_date);
    const size = (formData.get('size') as string) || null;
    const description = (formData.get('description') as string) || null;
    const website = (formData.get('website') as string) || null;
    const registration_deadline = normalizeOptionalString(formData.get('registration_deadline'));
    const position_paper_deadline = normalizeOptionalString(formData.get('position_paper_deadline'));
    const general_email = normalizeOptionalString(formData.get('general_email'));
    const mun_account = normalizeOptionalString(formData.get('mun_account'));
    const price = (formData.get('price_per_delegate') as string) || null;
    const uniqueTopics = normalizeStringArray(formData.getAll('unique_topics'));
    const allocations = normalizeStringArray(formData.getAll('allocations'));
    const committees = parseCommittees(formData);

    const conferenceId = await runInTransaction(async (db) => {
        const result = await db.query(`
        INSERT INTO conferences (
          name, organization, location, country_code, start_date, end_date, 
          status, size, description, website, price_per_delegate,
          registration_deadline, position_paper_deadline, general_email, mun_account
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        RETURNING conference_id
      `, [
            name, organization, location, country_code, start_date, end_date, status, size, description, website, price,
            registration_deadline, position_paper_deadline, general_email, mun_account
        ]);

        const newConferenceId = result.rows[0].conference_id;
        await replaceConferenceRelations(db, newConferenceId, { uniqueTopics, allocations, committees });
        return newConferenceId;
    });

    revalidatePath('/admin');
    revalidatePath('/');
    return { success: true, conferenceId, notice: 'Conference saved successfully.' };
}

export async function updateConference(id: number, formData: FormData) {
    await requireAdmin();

    const name = formData.get('name') as string;
    const organization = formData.get('organization') as string;
    const location = formData.get('location') as string;
    const country_code = (formData.get('country_code') as string) || null;
    const start_date = formData.get('start_date') as string;
    const end_date = formData.get('end_date') as string;
    const status = deriveStoredStatus(end_date);
    const size = (formData.get('size') as string) || null;
    const description = (formData.get('description') as string) || null;
    const website = (formData.get('website') as string) || null;
    const price = (formData.get('price_per_delegate') as string) || null;
    const registration_deadline = normalizeOptionalString(formData.get('registration_deadline'));
    const position_paper_deadline = normalizeOptionalString(formData.get('position_paper_deadline'));
    const general_email = normalizeOptionalString(formData.get('general_email'));
    const mun_account = normalizeOptionalString(formData.get('mun_account'));
    const uniqueTopics = normalizeStringArray(formData.getAll('unique_topics'));
    const allocations = normalizeStringArray(formData.getAll('allocations'));
    const committees = parseCommittees(formData);

    await runInTransaction(async (db) => {
        await db.query(`
        UPDATE conferences SET
          name=$1, organization=$2, location=$3, country_code=$4, start_date=$5, end_date=$6,
          status=$7, size=$8, description=$9, website=$10, price_per_delegate=$11,
          registration_deadline=$12, position_paper_deadline=$13, general_email=$14, mun_account=$15
        WHERE conference_id = $16
      `, [
            name, organization, location, country_code, start_date, end_date, status, size, description, website, price,
            registration_deadline, position_paper_deadline, general_email, mun_account, id
        ]);

        await replaceConferenceRelations(db, id, { uniqueTopics, allocations, committees });
    });

    revalidatePath('/admin');
    revalidatePath(`/admin/conferences/${id}`);
    revalidatePath(`/conference/${id}`);
    revalidatePath('/');
    return { success: true, conferenceId: id, notice: 'Conference saved successfully.' };
}

export async function duplicateConference(id: number) {
    await requireAdmin();

    const duplicateId = await runInTransaction(async (db) => {
        const sourceResult = await db.query('SELECT * FROM conferences WHERE conference_id = $1', [id]);
        if (sourceResult.rows.length === 0) {
            throw new Error('Conference not found.');
        }

        const source = sourceResult.rows[0];
        const duplicateName = `${source.name} (Copy)`;
        const status = deriveStoredStatus(source.end_date);

        const insertResult = await db.query(`
            INSERT INTO conferences (
                name, organization, location, country_code, start_date, end_date,
                description, website, registration_deadline, position_paper_deadline,
                status, size, general_email, mun_account, advisor_account,
                sec_gen_accounts, parliamentarian_accounts, price_per_delegate,
                independent_dels_welcome, independent_signup_link, advisor_signup_link,
                disabled_suitable, sensory_suitable, schedule, venue_guide, extra_notes
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
                $11, $12, $13, $14, $15, $16, $17, $18,
                $19, $20, $21, $22, $23, $24, $25, $26
            )
            RETURNING conference_id
        `, [
            duplicateName, source.organization, source.location, source.country_code, source.start_date, source.end_date,
            source.description, source.website, source.registration_deadline, source.position_paper_deadline,
            status, source.size, source.general_email, source.mun_account, source.advisor_account,
            source.sec_gen_accounts, source.parliamentarian_accounts, source.price_per_delegate,
            source.independent_dels_welcome, source.independent_signup_link, source.advisor_signup_link,
            source.disabled_suitable, source.sensory_suitable, source.schedule, source.venue_guide, source.extra_notes
        ]);

        const newConferenceId = insertResult.rows[0].conference_id;

        await db.query(`
            INSERT INTO committees (conference_id, name, topic, chair_info)
            SELECT $1, name, topic, chair_info
            FROM committees
            WHERE conference_id = $2
        `, [newConferenceId, id]);

        await db.query(`
            INSERT INTO unique_topics (conference_id, topic)
            SELECT $1, topic
            FROM unique_topics
            WHERE conference_id = $2
        `, [newConferenceId, id]);

        await db.query(`
            INSERT INTO allocations (conference_id, country)
            SELECT $1, country
            FROM allocations
            WHERE conference_id = $2
        `, [newConferenceId, id]);

        await db.query(`
            INSERT INTO available_awards (conference_id, award_name)
            SELECT $1, award_name
            FROM available_awards
            WHERE conference_id = $2
        `, [newConferenceId, id]);

        return newConferenceId;
    });

    revalidatePath('/admin');
    revalidatePath('/');
    return { success: true, conferenceId: duplicateId, notice: 'Conference duplicated successfully.' };
}
