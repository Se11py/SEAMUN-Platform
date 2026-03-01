import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AttendanceButton from '@/components/AttendanceButton';
import { toggleAttendance } from '@/lib/actions';

// Mock Server Actions
vi.mock('@/lib/actions', () => ({
    toggleAttendance: vi.fn(),
}));

describe('Attendance Tracking Flow (Integration)', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('allows a user to toggle attendance', async () => {
        vi.mocked(toggleAttendance).mockResolvedValue({ success: true });

        // Initial render: not attending
        const { rerender } = render(<AttendanceButton conferenceId={1} initialStatus="not-attending" />);

        // Assert initial state "Attend"
        expect(screen.getByText('Attend')).toBeInTheDocument();
        expect(screen.getByText('Save')).toBeInTheDocument();

        // 1. User clicks "Attend"
        fireEvent.click(screen.getByText('Attend'));

        // Wait for server action to be called
        await waitFor(() => {
            expect(toggleAttendance).toHaveBeenCalledWith(1, 'attending');
        });

        // UI Optimistically updates to "Attending"
        expect(screen.getByText('Attending')).toBeInTheDocument();

        // 2. Click "Save"
        fireEvent.click(screen.getByText('Save'));

        // Wait for server action to be called
        await waitFor(() => {
            expect(toggleAttendance).toHaveBeenCalledWith(1, 'saved');
        });

        // UI Optimistically updates to "Saved"
        expect(screen.getByText('Saved')).toBeInTheDocument();
    });

    it('reverts optimistic update if server action fails', async () => {
        // Mock a failure
        vi.mocked(toggleAttendance).mockRejectedValue(new Error('Server Error'));

        render(<AttendanceButton conferenceId={1} initialStatus="not-attending" />);

        // Click Attend
        expect(screen.getByText('Attend')).toBeInTheDocument();
        fireEvent.click(screen.getByText('Attend'));

        // Optimistic update
        expect(screen.getByText('Attending')).toBeInTheDocument();

        // Expect it to revert back to Attend because the action failed
        await waitFor(() => {
            expect(screen.getByText('Attend')).toBeInTheDocument();
        });
    });
});
