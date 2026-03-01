import { describe, it, expect } from 'vitest';
import { committees, crises, funFacts, procedureQuestions, flagMap } from '@/lib/simulation-data';

describe('Simulation Data Split Modules', () => {
    it('should properly export committees array', () => {
        expect(Array.isArray(committees)).toBe(true);
        expect(committees.length).toBeGreaterThan(0);

        // Verify key properties exist
        const firstCommittee = committees[0];
        expect(firstCommittee).toHaveProperty('id');
        expect(firstCommittee).toHaveProperty('name');
    });

    it('should properly export the crises object mapping', () => {
        expect(crises).toBeDefined();

        // Ensure known keys exist and are arrays
        expect(crises).toHaveProperty('hsc');
        expect(Array.isArray(crises.hsc)).toBe(true);
        expect(crises.hsc[0]).toHaveProperty('title');
    });

    it('should properly export the funFacts array', () => {
        expect(Array.isArray(funFacts)).toBe(true);
        expect(funFacts.length).toBeGreaterThan(0);
        expect(typeof funFacts[0]).toBe('string');
    });

    it('should properly export the procedureQuestions array', () => {
        expect(Array.isArray(procedureQuestions)).toBe(true);
        expect(procedureQuestions.length).toBeGreaterThan(0);

        const firstQ = procedureQuestions[0];
        expect(firstQ).toHaveProperty('phase');
        expect(firstQ).toHaveProperty('scenario');
    });

    it('should properly export the flagMap record', () => {
        expect(flagMap).toBeDefined();
        expect(typeof flagMap['France']).toBe('string');
        expect(flagMap['France']).toBe('🇫🇷');
    });
});
