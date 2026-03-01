import { vi } from 'vitest';
import * as a11yAddonAnnotations from "@storybook/addon-a11y/preview";
import { setProjectAnnotations } from '@storybook/nextjs-vite';
import * as projectAnnotations from './preview';

vi.mock('@/lib/actions', () => ({
    toggleAttendance: vi.fn(),
    syncUser: vi.fn(),
    getUserProfile: vi.fn(),
    updateProfile: vi.fn(),
    getTrackedConferences: vi.fn(),
    getConferenceAttendanceStatus: vi.fn(),
}));

// This is an important step to apply the right configuration when testing your stories.
// More info at: https://storybook.js.org/docs/api/portable-stories/portable-stories-vitest#setprojectannotations
setProjectAnnotations([a11yAddonAnnotations, projectAnnotations]);