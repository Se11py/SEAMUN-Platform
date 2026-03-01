import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import MunSimulation from '@/app/munsimulation/MunSimulation';

vi.mock('@/components/Navbar', () => ({
    default: () => <nav>Navbar</nav>
}));

vi.mock('@/components/BackToHomeButton', () => ({
    default: () => <button>Back</button>
}));

describe('Simulation Game Flow (Integration)', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('allows a user to start a simulation setup and proceed', async () => {
        render(<MunSimulation />);

        // Ensure initial load
        expect(screen.getByText('Committee Setup')).toBeInTheDocument();

        // Select a committee (United Nations Security Council - unsc)
        const committeeSelect = screen.getByLabelText('Committee');
        fireEvent.change(committeeSelect, { target: { value: 'unsc' } });

        // Ensure topic updates (We use queryByText not.toBeInTheDocument for the placeholder)
        expect(screen.queryByText(/Select a committee to view the topic/i)).not.toBeInTheDocument();

        // Select a delegation
        const delegationSelect = screen.getByLabelText('Your Delegation');
        fireEvent.change(delegationSelect, { target: { value: 'United States' } });

        // Start button should be active now
        const startBtn = screen.getByText('Start Simulation');
        expect(startBtn).not.toBeDisabled();

        // Click Start Simulation
        fireEvent.click(startBtn);

        // Verification: Stage should immediately update to "Roll Call"
        expect(screen.getByText('Roll Call')).toBeInTheDocument();

        // Check that the continue overlay appears since the engine auto-triggers a log event
        const continueBtn = screen.getByText('Continue');
        expect(continueBtn).toBeInTheDocument();

        // Click continue
        fireEvent.click(continueBtn);
    });
});
