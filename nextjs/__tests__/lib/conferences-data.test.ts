import { expect, test, describe } from 'vitest';
import {
    getConferenceById,
    getUpcomingConferences,
    getPreviousConferences,
    getAllCommittees,
    getAllLocations
} from '@/lib/conferences-data';

describe('Conferences Data Utilities', () => {
    test('getConferenceById finds an existing conference', () => {
        const conf = getConferenceById(1);
        expect(conf).toBeDefined();
        expect(conf?.name).toBe('MUN07 IV');
    });

    test('getConferenceById returns undefined for non-existing id', () => {
        const conf = getConferenceById(999);
        expect(conf).toBeUndefined();
    });

    test('getUpcomingConferences returns only upcoming conferences', () => {
        const confs = getUpcomingConferences();
        expect(confs.length).toBeGreaterThan(0);
        confs.forEach(c => expect(c.status).toBe('upcoming'));
    });

    test('getPreviousConferences returns only previous conferences', () => {
        const confs = getPreviousConferences();
        expect(confs.length).toBeGreaterThan(0);
        confs.forEach(c => expect(c.status).toBe('previous'));
    });

    test('getAllCommittees extracts distinct committee acronyms sorted alphabetically', () => {
        const committees = getAllCommittees();
        expect(committees).toContain('UNHRC');
        expect(committees).toContain('UNSC');
        expect(committees).toContain('WHO');

        // Ensure sorted
        const sorted = [...committees].sort();
        expect(committees).toEqual(sorted);

        // Ensure distinct (no duplicates)
        const unique = new Set(committees);
        expect(committees.length).toBe(unique.size);
    });

    test('getAllLocations extracts distinct locations sorted alphabetically', () => {
        const locations = getAllLocations();
        expect(locations.length).toBeGreaterThan(0);
        expect(locations).toContain('Bangkok, Thailand');

        // Ensure sorted
        const sorted = [...locations].sort();
        expect(locations).toEqual(sorted);

        // Ensure distinct
        const unique = new Set(locations);
        expect(locations.length).toBe(unique.size);
    });
});
