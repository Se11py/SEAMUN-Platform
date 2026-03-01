import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AttendanceButton from '@/components/AttendanceButton';
import * as actions from '@/lib/actions';

// Mock the actions module
vi.mock('@/lib/actions', () => ({
    toggleAttendance: vi.fn(),
}));

describe('AttendanceButton', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders with initial status saved', () => {
        render(<AttendanceButton conferenceId={1} initialStatus="saved" />);
        expect(screen.getByText('Saved')).toBeInTheDocument();
        expect(screen.getByText('Attend')).toBeInTheDocument();
    });

    it('renders with initial status attending', () => {
        render(<AttendanceButton conferenceId={1} initialStatus="attending" />);
        expect(screen.getByText('Save')).toBeInTheDocument();
        expect(screen.getByText('Attending')).toBeInTheDocument();
    });

    it('renders with initial status not-attending', () => {
        render(<AttendanceButton conferenceId={1} initialStatus="not-attending" />);
        expect(screen.getByText('Save')).toBeInTheDocument();
        expect(screen.getByText('Attend')).toBeInTheDocument();
    });

    it('calls toggleAttendance and updates state optimistically when Attend is clicked', async () => {
        vi.mocked(actions.toggleAttendance).mockResolvedValue({ success: true });
        render(<AttendanceButton conferenceId={1} initialStatus="not-attending" />);

        const attendBtn = screen.getByText('Attend');
        fireEvent.click(attendBtn);

        // Optimistic update
        expect(screen.getByText('Attending')).toBeInTheDocument();

        await waitFor(() => {
            expect(actions.toggleAttendance).toHaveBeenCalledWith(1, 'attending');
        });
    });

    it('reverts state if toggleAttendance fails', async () => {
        vi.mocked(actions.toggleAttendance).mockRejectedValue(new Error('Failed'));
        render(<AttendanceButton conferenceId={1} initialStatus="not-attending" />);

        const attendBtn = screen.getByText('Attend');
        fireEvent.click(attendBtn);

        // Optimistic update
        expect(screen.getByText('Attending')).toBeInTheDocument();

        await waitFor(() => {
            // Reverts to not-attending
            expect(screen.getByText('Attend')).toBeInTheDocument();
            expect(screen.queryByText('Attending')).not.toBeInTheDocument();
        });
    });

    it('toggles off when clicking the active button', async () => {
        vi.mocked(actions.toggleAttendance).mockResolvedValue({ success: true });
        render(<AttendanceButton conferenceId={1} initialStatus="attending" />);

        const attendingBtn = screen.getByText('Attending');
        fireEvent.click(attendingBtn);

        // Optimistic update
        expect(screen.getByText('Attend')).toBeInTheDocument();

        await waitFor(() => {
            expect(actions.toggleAttendance).toHaveBeenCalledWith(1, 'not-attending');
        });
    });
});
