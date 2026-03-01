import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock matchMedia for components like carousels that depend on it
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(), // deprecated
        removeListener: vi.fn(), // deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});

// Mock Next.js navigation
vi.mock('next/navigation', () => {
    return {
        useRouter: () => ({
            push: vi.fn(),
            replace: vi.fn(),
            prefetch: vi.fn(),
            back: vi.fn(),
            forward: vi.fn(),
            refresh: vi.fn(),
        }),
        useSearchParams: () => ({
            get: vi.fn(),
            set: vi.fn(),
        }),
        usePathname: () => '/',
    };
});
