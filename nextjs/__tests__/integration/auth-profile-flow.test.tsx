import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ProfilePage from '@/app/profile/page';
import { currentUser } from '@clerk/nextjs/server';
import { getUserProfile, getTrackedConferences, updateProfile } from '@/lib/actions';
import { redirect } from 'next/navigation';

vi.mock('@clerk/nextjs/server', () => ({
    currentUser: vi.fn(),
}));

vi.mock('next/navigation', () => ({
    redirect: vi.fn(),
    useRouter: () => ({ push: vi.fn(), refresh: vi.fn(), back: vi.fn() }),
    usePathname: () => '/profile',
    useSearchParams: () => new URLSearchParams(),
}));

vi.mock('@/lib/actions', () => ({
    getUserProfile: vi.fn(),
    getTrackedConferences: vi.fn(),
    updateProfile: vi.fn(),
}));

// Mock Link
vi.mock('next/link', () => ({
    __esModule: true,
    default: ({ children, href, className }: any) => <a href={href} className={className}>{children}</a>,
}));

// Mock Navbar
vi.mock('@/components/Navbar', () => ({
    __esModule: true,
    default: () => <nav>Navbar</nav>
}));

// Mock BackToHomeButton
vi.mock('@/components/BackToHomeButton', () => ({
    __esModule: true,
    default: () => <button>Back to Home</button>
}));

// Mock Image
vi.mock('next/image', () => ({
    __esModule: true,
    default: ({ src, alt }: any) => <img src={src} alt={alt} />,
}));

describe('Auth & Profile Flow (Integration)', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('redirects to sign-in if no user is found', async () => {
        vi.mocked(currentUser).mockResolvedValue(null);
        vi.mocked(redirect).mockImplementation(() => { throw new Error('redirect'); });

        await expect(ProfilePage()).rejects.toThrow('redirect');
        expect(redirect).toHaveBeenCalledWith('/sign-in');
    });

    it('renders profile details and conferences for an authenticated user', async () => {
        vi.mocked(currentUser).mockResolvedValue({
            firstName: 'Integration',
            lastName: 'User',
            emailAddresses: [{ emailAddress: 'integration@example.com' }],
            createdAt: new Date('2026-01-01').getTime(),
            imageUrl: 'image.jpg'
        } as any);

        vi.mocked(getUserProfile).mockResolvedValue({
            user_id: '1',
            name: 'Integration User',
            email: 'integration@example.com',
            pronouns: 'they/them'
        });

        vi.mocked(getTrackedConferences).mockResolvedValue([
            {
                conference_id: 1,
                name: 'Integration Test Conf',
                location: 'Test City',
                start_date: '2026-03-01',
                end_date: '2026-03-02',
                organization: 'Test Org',
                description: 'Desc',
                status: 'upcoming',
                attendance_status: 'attending',
                attendance_updated_at: new Date()
            }
        ]);

        const PageContent = await ProfilePage();
        render(PageContent);

        // Name is rendered
        expect(screen.getByText('Integration User')).toBeInTheDocument();
        expect(screen.getByText('integration@example.com')).toBeInTheDocument();

        // Pronouns are rendered
        const pronounsInput = screen.getByPlaceholderText('e.g. they/them');
        expect(pronounsInput).toHaveValue('they/them');

        // Tracked conf is rendered
        expect(screen.getByText('Integration Test Conf')).toBeInTheDocument();
        expect(screen.getByText('Attending')).toBeInTheDocument();
    });
});
