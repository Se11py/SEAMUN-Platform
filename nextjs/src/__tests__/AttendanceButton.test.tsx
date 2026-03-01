import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AttendanceButton from '@/components/AttendanceButton';
import * as actions from '@/lib/actions';

// Mock the server action to prevent actual DB hits during tests
vi.mock('@/lib/actions', () => ({
    toggleAttendance: vi.fn(),
}));

describe('AttendanceButton Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the initial state as not-attending', () => {
        render(<AttendanceButton conferenceId={1} initialStatus="not-attending" />);

        const saveBtn = screen.getByRole('button', { name: /save/i });
        const attendBtn = screen.getByRole('button', { name: /attend/i });

        expect(saveBtn).toHaveTextContent('Save');
        expect(attendBtn).toHaveTextContent('Attend');
    });

    it('renders the initial state as saved', () => {
        render(<AttendanceButton conferenceId={1} initialStatus="saved" />);

        const saveBtn = screen.getByRole('button', { name: /saved/i });
        expect(saveBtn).toHaveTextContent('Saved');
    });

    it('renders the initial state as attending', () => {
        render(<AttendanceButton conferenceId={1} initialStatus="attending" />);

        const attendBtn = screen.getByRole('button', { name: /attending/i });
        expect(attendBtn).toHaveTextContent('Attending');
    });

    it('optimistically updates to saved when clicked', async () => {
        // @ts-expect-error - Mocking server action return
        vi.mocked(actions.toggleAttendance).mockResolvedValueOnce({ success: true, status: 'saved' });

        render(<AttendanceButton conferenceId={1} initialStatus="not-attending" />);

        const saveBtn = screen.getByRole('button', { name: /save/i });
        fireEvent.click(saveBtn);

        // Optimistic UI update should show 'Saved' immediately
        expect(screen.getByRole('button', { name: /saved/i })).toBeInTheDocument();

        await waitFor(() => {
            expect(actions.toggleAttendance).toHaveBeenCalledWith(1, 'saved');
        });
    });

    it('reverts state if server action fails', async () => {
        // Mock a failure response
        // @ts-expect-error - Mocking server action return
        vi.mocked(actions.toggleAttendance).mockResolvedValueOnce({ success: false, status: 'not-attending' });

        render(<AttendanceButton conferenceId={1} initialStatus="not-attending" />);

        const saveBtn = screen.getByRole('button', { name: /save/i });
        fireEvent.click(saveBtn);

        // Should immediately switch to Saved
        expect(saveBtn).toHaveTextContent('Saved');

        // Wait for the failed promise to resolve and revert the state
        await waitFor(() => {
            expect(saveBtn).toHaveTextContent('Save');
        });
    });

    it('disables buttons while loading', async () => {
        // Mock a delayed response to keep it in a loading state for the assertion
        let resolvePromise: (value: any) => void;
        const promise = new Promise<{ success: boolean; status: string }>((resolve) => {
            resolvePromise = resolve;
        });

        vi.mocked(actions.toggleAttendance).mockReturnValueOnce(promise);

        render(<AttendanceButton conferenceId={1} initialStatus="not-attending" />);

        const attendBtn = screen.getByRole('button', { name: /attend/i });
        const saveBtn = screen.getByRole('button', { name: /save/i });

        fireEvent.click(attendBtn);

        // Both buttons should be disabled during the flight
        expect(attendBtn).toBeDisabled();
        expect(saveBtn).toBeDisabled();

        // Resolve the promise to clean up the test state
        resolvePromise!({ success: true, status: 'attending' });

        await waitFor(() => {
            expect(attendBtn).not.toBeDisabled();
        });
    });
});
