import type { User } from '@clerk/nextjs/server';

export function getAdminEmailAllowlist(): string[] {
    return (
        process.env.ADMIN_EMAILS?.split(',')
            .map((e) => e.trim().toLowerCase())
            .filter(Boolean) ?? []
    );
}

/** True if any of the user's verified emails is listed in ADMIN_EMAILS. */
export function userHasAdminEmail(user: User): boolean {
    const allow = getAdminEmailAllowlist();
    if (allow.length === 0) return false;
    const emails = user.emailAddresses.map((e) => e.emailAddress.toLowerCase());
    return emails.some((e) => allow.includes(e));
}
