import type { Meta, StoryObj } from '@storybook/react';
import ConferenceForm from './ConferenceForm';

const meta = {
    title: 'Components/ConferenceForm',
    component: ConferenceForm,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof ConferenceForm>;

export default meta;
type Story = StoryObj<typeof meta>;

// Mock server action for Storybook
const mockAction = async (_formData: FormData) => {
    return new Promise((resolve) => setTimeout(() => resolve({ success: true }), 1000));
};

export const DefaultNewForm: Story = {
    args: {
        action: mockAction,
    },
};

export const EditExistingForm: Story = {
    args: {
        initialData: {
            name: 'South East Asia MUN',
            organization: 'SEAMUN Society',
            location: 'Bangkok',
            country_code: 'TH',
            status: 'upcoming',
            start_date: '2026-11-01',
            end_date: '2026-11-03',
            size: '500+',
            price_per_delegate: '$100',
            website: 'https://seamun.org',
            description: 'An exciting conference for all high school students.',
        },
        action: mockAction,
    },
};
