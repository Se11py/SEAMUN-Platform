import type { Meta, StoryObj } from '@storybook/react';
import ConferenceCard from './ConferenceCard';
import { Conference } from '@/lib/conferences-data';

const meta = {
    title: 'Components/ConferenceCard',
    component: ConferenceCard,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        attendanceStatus: {
            control: 'radio',
            options: [undefined, 'not-attending', 'saved', 'attending'],
        },
    },
} satisfies Meta<typeof ConferenceCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockUpcomingConference = {
    id: 1,
    name: 'Global Model UN 2026',
    organization: 'Global MUN Society',
    location: 'Bangkok, Thailand',
    countryCode: 'TH',
    startDate: '2026-10-15',
    endDate: '2026-10-18',
    registrationDeadline: '2026-09-01',
    description: 'Join us for the largest Model UN conference in South East Asia. Engage in rigorous debate and tackle pressing global issues.',
    status: 'upcoming',
} as Conference;

const mockPastConference = {
    ...mockUpcomingConference,
    name: 'Asia Pacific MUN 2025',
    startDate: '2025-05-10',
    endDate: '2025-05-12',
    registrationDeadline: '2025-04-01',
    status: 'previous',
} as Conference;

export const UpcomingDefault: Story = {
    args: {
        conference: mockUpcomingConference,
    },
};

export const UpcomingSaved: Story = {
    args: {
        conference: mockUpcomingConference,
        attendanceStatus: 'saved',
    },
};

export const UpcomingAttending: Story = {
    args: {
        conference: mockUpcomingConference,
        attendanceStatus: 'attending',
    },
};

export const PastConference: Story = {
    args: {
        conference: mockPastConference,
    },
};
