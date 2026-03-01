import type { Meta, StoryObj } from '@storybook/react';
import ContentPage from './ContentPage';

const meta = {
    title: 'Components/ContentPage',
    component: ContentPage,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof ContentPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        title: 'Sample Content Page',
        children: (
            <div style={{ padding: '20px 0' }}>
                <p>This is a sample layout using the ContentPage component.</p>
                <p>It includes the Navbar, a Back To Home button, and a content area.</p>
            </div>
        ),
    },
};
