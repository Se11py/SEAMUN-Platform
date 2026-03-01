import { expect, test, describe, vi, beforeEach } from 'vitest';
import {
    syncUser,
    getUserProfile,
    updateProfile,
    toggleAttendance,
    getTrackedConferences,
    getConferenceAttendanceStatus
} from '@/lib/actions';
import { getDb } from '@/lib/db';
import { currentUser } from '@clerk/nextjs/server';

// Mock dependecies
vi.mock('@clerk/nextjs/server', () => ({
    currentUser: vi.fn(),
}));

vi.mock('next/cache', () => ({
    revalidatePath: vi.fn(),
}));

vi.mock('@/lib/db', () => ({
    getDb: vi.fn(),
}));

describe('Actions (Server)', () => {
    let mockQuery: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        vi.clearAllMocks();
        mockQuery = vi.fn();
        vi.mocked(getDb).mockReturnValue({
            query: mockQuery
        } as any);
    });

    describe('getUserProfile', () => {
        test('returns null if no currentUser', async () => {
            vi.mocked(currentUser).mockResolvedValue(null);
            const profile = await getUserProfile();
            expect(profile).toBeNull();
        });

        test('returns profile if user exists in db', async () => {
            vi.mocked(currentUser).mockResolvedValue({ id: 'user_123' } as any);
            mockQuery.mockResolvedValueOnce({
                rowCount: 1,
                rows: [{ user_id: 'user_123', name: 'Test User' }]
            });

            const profile = await getUserProfile();
            expect(profile).toEqual({ user_id: 'user_123', name: 'Test User' });
            expect(mockQuery).toHaveBeenCalledWith(expect.any(String), ['user_123']);
        });

        test('syncs user if not found in db initially', async () => {
            vi.mocked(currentUser).mockResolvedValue({
                id: 'user_123',
                emailAddresses: [{ emailAddress: 'test@example.com' }],
                firstName: 'Test',
                lastName: 'User',
                imageUrl: 'http://example.com/img.jpg'
            } as any);

            // First call to get profile (not found)
            mockQuery.mockResolvedValueOnce({ rowCount: 0, rows: [] });
            // Call to insert/sync
            mockQuery.mockResolvedValueOnce({ rowCount: 1 });
            // Second call to get profile (now found)
            mockQuery.mockResolvedValueOnce({
                rowCount: 1,
                rows: [{ user_id: 'user_123', name: 'Test User' }]
            });

            const profile = await getUserProfile();
            expect(profile).toEqual({ user_id: 'user_123', name: 'Test User' });
            expect(mockQuery).toHaveBeenCalledTimes(3);
        });
    });

    describe('toggleAttendance', () => {
        test('throws if not authenticated', async () => {
            vi.mocked(currentUser).mockResolvedValue(null);
            await expect(toggleAttendance(1, 'attending')).rejects.toThrow('Not authenticated');
        });

        test('deletes attendance if status is not-attending', async () => {
            vi.mocked(currentUser).mockResolvedValue({ id: 'user_123', emailAddresses: [] } as any);
            mockQuery.mockResolvedValue({ rowCount: 1, rows: [] }); // default successful queries

            const res = await toggleAttendance(1, 'not-attending');
            expect(res).toEqual({ success: true });

            // Should see a DELETE query
            const deleteCall = mockQuery.mock.calls.find(call => call[0].includes('DELETE FROM attendance'));
            expect(deleteCall).toBeDefined();
            expect(deleteCall![1]).toEqual(['user_123', 1]);
        });

        test('upserts attendance if status is attending', async () => {
            vi.mocked(currentUser).mockResolvedValue({ id: 'user_123', emailAddresses: [] } as any);
            mockQuery.mockResolvedValue({ rowCount: 1, rows: [] });

            const res = await toggleAttendance(1, 'attending');
            expect(res).toEqual({ success: true });

            // Should see an INSERT query
            const insertCall = mockQuery.mock.calls.find(call => call[0].includes('INSERT INTO attendance'));
            expect(insertCall).toBeDefined();
            expect(insertCall![1]).toEqual(['user_123', 1, 'attending']);
        });
    });
});
