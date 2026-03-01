import { expect, test, describe, vi, beforeEach } from 'vitest';
import { SimulationEngine } from '@/lib/simulation-engine';

describe('SimulationEngine', () => {
    let engine: SimulationEngine;

    beforeEach(() => {
        engine = new SimulationEngine();
    });

    test('initializes with default state', () => {
        const state = engine.state;
        expect(state.committee).toBeNull();
        expect(state.delegation).toBeNull();
        expect(state.round).toBe(0);
        expect(state.stage).toBe('Idle');
        expect(state.points).toBe(0);
    });

    test('selectCommittee populates committee state and display order', () => {
        // ID 1 corresponds to UN Security Council in the initial data
        engine.selectCommittee('unsc');

        expect(engine.state.committee).toBeDefined();
        expect(engine.state.committee?.id).toBe('unsc');

        // Ensure delegates points are initialized to 0
        const members = engine.state.committee?.members || [];
        expect(members.length).toBeGreaterThan(0);
        members.forEach(member => {
            expect(engine.state.delegatePoints[member]).toBe(0);
        });

        // Ensure display order is set
        expect(engine.state.displayOrder?.length).toBe(members.length);
    });

    test('selectDelegation sets the delegation', () => {
        engine.selectDelegation('United States');
        expect(engine.state.delegation).toBe('United States');
    });

    test('isCrisisCommittee returns true for crisis committees', () => {
        engine.selectCommittee('unsc');
        expect(engine.isCrisisCommittee()).toBe(true);

        engine.selectCommittee('hsc'); // Historic Security Council
        expect(engine.isCrisisCommittee()).toBe(true);

        engine.selectCommittee('who'); // World Health Organization
        expect(engine.isCrisisCommittee()).toBe(false);
    });

    test('subscribe and emitChange notifies listeners', () => {
        const listener = vi.fn();
        const unsubscribe = engine.subscribe(listener);

        // Should be called immediately on subscribe
        expect(listener).toHaveBeenCalledTimes(1);
        expect(listener).toHaveBeenCalledWith(engine.state);

        // Should be called on emit
        engine.setStage('Testing');
        // The above triggers emitChange
        expect(listener).toHaveBeenCalledTimes(2);

        // Unsubscribe should work
        unsubscribe();
        engine.setStage('Testing 2');
        expect(listener).toHaveBeenCalledTimes(2); // Should not increase
    });
});
