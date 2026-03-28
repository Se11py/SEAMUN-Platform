import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ConferenceCard from '@/components/ConferenceCard';
import { Conference } from '@/lib/conferences-data';

function formatDateOnly(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

const twoDaysAgo = new Date();
twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

// Mock the Link component since we're testing Next.js Link
vi.mock('next/link', () => {
    return {
        default: ({ children, href, className }: { children: React.ReactNode, href: string, className: string }) => {
            return <a href={href} className={className}>{children}</a>;
        }
    };
});

const mockConference: Conference = {
    id: 1,
    name: "MUN07 IV",
    organization: "St Andrews International School, Sukhumvit 107",
    location: "Bangkok, Thailand",
    countryCode: "TH",
    startDate: formatDateOnly(tomorrow),
    endDate: formatDateOnly(tomorrow),
    description: "The fourth annual MUN07 conference.",
    website: "https://mun07.org",
    registrationDeadline: formatDateOnly(tomorrow),
    positionPaperDeadline: formatDateOnly(tomorrow),
    status: "upcoming",
    size: "250+ attendees",
    generalEmail: "mun07sta@gmail.com",
    munAccount: "@mun07",
    advisorAccount: "mun07sta@gmail.com",
    secGenAccounts: "PJ",
    parliamentarianAccounts: "Contact via email",
    pricePerDelegate: "900 THB",
    independentDelsWelcome: true,
    independentSignupLink: "link",
    advisorSignupLink: "link",
    disabledSuitable: true,
    sensorySuitable: true,
    committees: ["UNHRC"],
    uniqueTopics: ["Human Rights Abuses"],
    chairsPages: "link",
    allocations: ["Thailand"],
    availableAwards: ["Best Delegate"],
    previousWinners: [],
    schedule: "Schedule",
    venueGuide: "Venue",
    extraNotes: "Notes"
};

describe('ConferenceCard', () => {
    it('renders conference name and details', () => {
        render(<ConferenceCard conference={mockConference} />);

        expect(screen.getByText('MUN07 IV')).toBeInTheDocument();
        expect(screen.getByText('St Andrews International School, Sukhumvit 107')).toBeInTheDocument();
        expect(screen.getByText(/Bangkok, Thailand/)).toBeInTheDocument();
        expect(screen.getByText('The fourth annual MUN07 conference.')).toBeInTheDocument();
        expect(
            screen.getAllByText(new RegExp(`${tomorrow.getMonth() + 1}/${tomorrow.getDate()}/${tomorrow.getFullYear()}`)).length
        ).toBeGreaterThan(0);
    });

    it('displays the UPCOMING badge for conferences whose dates are still ahead', () => {
        render(<ConferenceCard conference={mockConference} />);
        expect(screen.getByText('UPCOMING')).toBeInTheDocument();
    });

    it('displays PREVIOUS badge for past conferences even if stored status is stale', () => {
        const pastConf = {
            ...mockConference,
            startDate: formatDateOnly(twoDaysAgo),
            endDate: formatDateOnly(twoDaysAgo),
            status: 'upcoming' as const,
        };
        render(<ConferenceCard conference={pastConf} />);
        expect(screen.getByText('PREVIOUS')).toBeInTheDocument();
    });

    it('shows Thailand flag when country code is TH', () => {
        render(<ConferenceCard conference={mockConference} />);
        expect(screen.getByLabelText('Thailand Flag')).toBeInTheDocument();
    });

    it('displays attendance status correctly when provided', () => {
        const { rerender } = render(<ConferenceCard conference={mockConference} attendanceStatus="attending" />);
        expect(screen.getByText(/ATTENDING/)).toBeInTheDocument();

        rerender(<ConferenceCard conference={mockConference} attendanceStatus="saved" />);
        expect(screen.getByText(/SAVED/)).toBeInTheDocument();

        rerender(<ConferenceCard conference={mockConference} attendanceStatus="not-attending" />);
        expect(screen.getByText(/NOT ATTENDING/)).toBeInTheDocument();
    });

    it('links to the correct conference detail page', () => {
        render(<ConferenceCard conference={mockConference} />);
        const link = screen.getByRole('link');
        expect(link).toHaveAttribute('href', '/conference/1/');
    });
});
