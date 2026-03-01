import type { Meta, StoryObj } from '@storybook/react';
import AttendanceButton from './AttendanceButton';

const meta = {
    title: 'Components/AttendanceButton',
    component: AttendanceButton,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        initialStatus: {
            control: 'radio',
            options: ['not-attending', 'saved', 'attending'],
        },
        conferenceId: {
            control: 'number',
        },
    },
} satisfies Meta<typeof AttendanceButton>;

export default meta;
type Story = StoryObj<typeof meta>;

// Helper to mock handleToggle if needed, but since it imports from @/lib/actions, 
// we might get errors in Storybook if Next.js server actions are called. 
// We will just let it be for now, but UI-wise it will render correctly.

export const Default: Story = {
    args: {
        conferenceId: 1,
        initialStatus: 'not-attending',
    },
};

export const Saved: Story = {
    args: {
        conferenceId: 1,
        initialStatus: 'saved',
    },
};

export const Attending: Story = {
    args: {
        conferenceId: 1,
        initialStatus: 'attending',
    },
};
