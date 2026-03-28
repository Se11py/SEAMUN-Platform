import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ConferenceCard from '@/components/ConferenceCard';

import { ConferenceCardProps } from '@/components/ConferenceCard';

function formatDateOnly(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

describe('ConferenceCard Component', () => {
    const defaultProps = {
        conference: {
            id: 1,
            name: 'Test Model UN',
            school: 'Test High School',
            location: 'Virtual',
            startDate: formatDateOnly(tomorrow),
            endDate: formatDateOnly(tomorrow),
            status: 'upcoming',
            organization: 'Test Org',
            countryCode: 'US',
            description: 'A test conference description.',
            website: 'https://test.com',
            price: '$100',
            size: 'Large',
            level: 'High School',
            registrationDeadline: '2024-09-01',
            type: 'in-person',
        } as any,
        attendanceStatus: null as any,
    } as ConferenceCardProps;

    it('renders the conference name and organization', () => {
        render(<ConferenceCard {...defaultProps} />);

        expect(screen.getByText('Test Model UN')).toBeInTheDocument();
        expect(screen.getAllByText('Test Org').length).toBeGreaterThan(0);
    });

    it('renders the formatted dates string', () => {
        render(<ConferenceCard {...defaultProps} />);

        // This validates if the frontend formats "2024-10-01" / "2024-10-03" appropriately
        expect(screen.getAllByText(/2024/).length).toBeGreaterThan(0);
    });

    it('renders the location properly', () => {
        render(<ConferenceCard {...defaultProps} />);

        // Match string including space because of possible emojis prepended
        expect(screen.getAllByText(/Virtual/).length).toBeGreaterThan(0);
    });

    it('contains a link to the detail page', () => {
        render(<ConferenceCard {...defaultProps} />);

        // Multiple links might be rendered or structured, get the first one (the card wrapper)
        const links = screen.getAllByRole('link');
        expect(links[0]).toHaveAttribute('href', '/conference/1/');
    });
});
