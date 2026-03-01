import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ConferenceForm from '@/components/ConferenceForm';

// Mock Router
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
    useRouter: () => ({ push: mockPush }),
}));

describe('Admin Conference Creation Flow (Integration)', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('submits valid data successfully and redirects', async () => {
        const mockAction = vi.fn().mockResolvedValue({ success: true });

        const { container } = render(<ConferenceForm action={mockAction} />);

        // Fill out required fields
        fireEvent.change(container.querySelector('input[name="name"]')!, { target: { name: 'name', value: 'Test Conference' } });
        fireEvent.change(container.querySelector('input[name="organization"]')!, { target: { name: 'organization', value: 'Test Org' } });
        fireEvent.change(container.querySelector('input[name="location"]')!, { target: { name: 'location', value: 'Test City' } });
        fireEvent.change(container.querySelector('input[name="start_date"]')!, { target: { name: 'start_date', value: '2026-05-01' } });
        fireEvent.change(container.querySelector('input[name="end_date"]')!, { target: { name: 'end_date', value: '2026-05-03' } });

        const submitBtn = screen.getByText('Save Conference');
        expect(submitBtn).not.toBeDisabled();

        // Use click to trigger the form submission
        fireEvent.click(screen.getByRole('button', { name: 'Save Conference' }));

        await waitFor(() => {
            expect(mockAction).toHaveBeenCalled();
            expect(mockPush).toHaveBeenCalledWith('/admin');
        });
    });

    it('shows validation errors for invalid data and prevents submission', async () => {
        const mockAction = vi.fn();

        const { container } = render(<ConferenceForm action={mockAction} />);

        // Trigger validation by blurring an invalid short name
        const nameInput = container.querySelector('input[name="name"]')!;
        fireEvent.change(nameInput, { target: { name: 'name', value: 'A' } });
        fireEvent.blur(nameInput, { target: { name: 'name', value: 'A' } });

        // Await the state update that renders the error text
        await screen.findByText('Conference Name must be at least 3 characters.');

        const submitBtn = screen.getByRole('button', { name: 'Save Conference' });
        expect(submitBtn).toBeDisabled();

        await waitFor(() => {
            expect(mockAction).not.toHaveBeenCalled();
        });
    });
});
