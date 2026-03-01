import type { Meta, StoryObj } from '@storybook/react';
import MunSimulation from './MunSimulation';

const meta = {
    title: 'App/MunSimulation',
    component: MunSimulation,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof MunSimulation>;

export default meta;
type Story = StoryObj<typeof meta>;

// This component includes complex state, a Navbar, and dynamic interactions
export const Default: Story = {};
