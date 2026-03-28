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
            expect(mockPush).toHaveBeenCalledWith('/admin?notice=Conference%20saved%20successfully.');
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

    it('submits deadlines, contact details, topics, allocations, and committees', async () => {
        const mockAction = vi.fn().mockResolvedValue({ success: true });
        const { container } = render(<ConferenceForm action={mockAction} />);

        fireEvent.change(container.querySelector('input[name="name"]')!, { target: { name: 'name', value: 'Advanced Conference' } });
        fireEvent.change(container.querySelector('input[name="organization"]')!, { target: { name: 'organization', value: 'Advanced School' } });
        fireEvent.change(container.querySelector('input[name="location"]')!, { target: { name: 'location', value: 'Bangkok' } });
        fireEvent.change(container.querySelector('input[name="start_date"]')!, { target: { name: 'start_date', value: '2026-06-10' } });
        fireEvent.change(container.querySelector('input[name="end_date"]')!, { target: { name: 'end_date', value: '2026-06-12' } });
        fireEvent.change(container.querySelector('input[name="registration_deadline"]')!, { target: { name: 'registration_deadline', value: '2026-05-20' } });
        fireEvent.change(container.querySelector('input[name="position_paper_deadline"]')!, { target: { name: 'position_paper_deadline', value: '2026-05-30' } });
        fireEvent.change(container.querySelector('input[name="general_email"]')!, { target: { name: 'general_email', value: 'info@example.com' } });
        fireEvent.change(container.querySelector('input[name="mun_account"]')!, { target: { name: 'mun_account', value: '@advancedmun' } });
        fireEvent.change(container.querySelector('input[name="unique_topics"]')!, { target: { name: 'unique_topics', value: 'Climate Justice' } });
        fireEvent.change(container.querySelector('input[name="allocations"]')!, { target: { name: 'allocations', value: 'Thailand' } });
        fireEvent.change(container.querySelector('input[name="committee_name"]')!, { target: { name: 'committee_name', value: 'UNHRC' } });
        fireEvent.change(container.querySelector('textarea[name="committee_topic"]')!, { target: { name: 'committee_topic', value: 'The Question of Refugee Protection' } });
        const chairContacts = container.querySelectorAll('input[placeholder="e.g. Ana (@anachair)"]');
        fireEvent.change(chairContacts[0]!, { target: { value: 'Ana (@anachair)' } });
        fireEvent.change(chairContacts[1]!, { target: { value: 'Ben (@benchair)' } });

        fireEvent.click(screen.getByRole('button', { name: 'Save Conference' }));

        await waitFor(() => {
            expect(mockAction).toHaveBeenCalledTimes(1);
        });

        const submittedFormData = mockAction.mock.calls[0][0] as FormData;
        expect(submittedFormData.get('registration_deadline')).toBe('2026-05-20');
        expect(submittedFormData.get('position_paper_deadline')).toBe('2026-05-30');
        expect(submittedFormData.get('general_email')).toBe('info@example.com');
        expect(submittedFormData.get('mun_account')).toBe('@advancedmun');
        expect(submittedFormData.getAll('unique_topics')).toContain('Climate Justice');
        expect(submittedFormData.getAll('allocations')).toContain('Thailand');
        expect(submittedFormData.getAll('committee_name')).toContain('UNHRC');
        expect(submittedFormData.getAll('committee_topic')).toContain('The Question of Refugee Protection');
        const serializedChairs = submittedFormData.getAll('committee_chairs') as string[];
        expect(serializedChairs[0]).toContain('"role":"Head Chair"');
        expect(serializedChairs[0]).toContain('"contact":"Ana (@anachair)"');
        expect(serializedChairs[0]).toContain('"role":"Deputy Chair"');
        expect(serializedChairs[0]).toContain('"contact":"Ben (@benchair)"');
    });

    it('defaults to two chairs and uses editor roles for Press Corps', async () => {
        const mockAction = vi.fn().mockResolvedValue({ success: true });
        const { container } = render(<ConferenceForm action={mockAction} />);

        expect(screen.getByDisplayValue('Head Chair')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Deputy Chair')).toBeInTheDocument();

        fireEvent.change(container.querySelector('input[name="name"]')!, { target: { name: 'name', value: 'Press Test Conference' } });
        fireEvent.change(container.querySelector('input[name="organization"]')!, { target: { name: 'organization', value: 'Press School' } });
        fireEvent.change(container.querySelector('input[name="location"]')!, { target: { name: 'location', value: 'Bangkok' } });
        fireEvent.change(container.querySelector('input[name="start_date"]')!, { target: { name: 'start_date', value: '2026-07-01' } });
        fireEvent.change(container.querySelector('input[name="end_date"]')!, { target: { name: 'end_date', value: '2026-07-02' } });
        fireEvent.change(container.querySelector('input[name="committee_name"]')!, { target: { name: 'committee_name', value: 'Press Corps' } });

        await waitFor(() => {
            expect(screen.getByDisplayValue('Chief Editor')).toBeInTheDocument();
            expect(screen.getByDisplayValue('Editor')).toBeInTheDocument();
        });
    });
});
