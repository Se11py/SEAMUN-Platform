import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CopyButton from '@/components/CopyButton';

// Mock clipboard API
Object.assign(navigator, {
    clipboard: {
        writeText: vi.fn().mockImplementation(() => Promise.resolve()),
    },
});

// Polyfill execCommand for fallback testing
document.execCommand = vi.fn().mockReturnValue(true);

describe('CopyButton', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders with text', () => {
        render(<CopyButton text="hello@example.com" />);
        expect(screen.getByText(/hello@example.com/)).toBeInTheDocument();
    });

    it('renders email icon when isEmail is true', () => {
        const { container } = render(<CopyButton text="hello@example.com" isEmail={true} />);
        expect(container.querySelector('.fa-envelope')).toBeInTheDocument();
    });

    it('renders instagram icon when isInstagram is true', () => {
        const { container } = render(<CopyButton text="@seamuns" isInstagram={true} />);
        expect(container.querySelector('.fa-instagram')).toBeInTheDocument();
    });

    it('calls navigator.clipboard.writeText on click', async () => {
        render(<CopyButton text="copy-this" />);
        const button = screen.getByTitle('Copy copy-this');

        fireEvent.click(button);

        expect(navigator.clipboard.writeText).toHaveBeenCalledWith('copy-this');
        expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(1);
    });

    it('shows copied state temporarily', async () => {
        vi.useFakeTimers();
        render(<CopyButton text="test-text" />);
        const button = screen.getByTitle('Copy test-text');

        expect(button.className).not.toContain('copied');
        expect(screen.getByTitle('Copy test-text').querySelector('.fa-copy')).toBeInTheDocument();

        fireEvent.click(button);

        await waitFor(() => {
            expect(button.className).toContain('copied');
            expect(screen.getByTitle('Copy test-text').querySelector('.fa-check')).toBeInTheDocument();
        });

        vi.advanceTimersByTime(2100);

        await waitFor(() => {
            expect(button.className).not.toContain('copied');
        });

        vi.useRealTimers();
    });
});
