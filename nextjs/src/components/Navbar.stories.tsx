import type { Meta, StoryObj } from '@storybook/react';
import Navbar from './Navbar';

const meta = {
    title: 'Components/Navbar',
    component: Navbar,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof Navbar>;

export default meta;
type Story = StoryObj<typeof meta>;

// Note: Clerk components (SignedIn, SignedOut, UserButton) might require ClerkProvider 
// to be set up in Storybook decorators for full functionality.

export const Default: Story = {};
