import { ISimulationEngine } from './types';

export const POINT_VALUES: Record<string, number> = {
    ROLL_CALL_PRESENT: 5,
    ROLL_CALL_PRESENT_VOTING: 10,
    OPENING_SPEECH: 15,
    RAISE_PLACARD: 3,
    RAISE_MOTION: 20,
    MOTION_PASSES: 15,
    MOTION_VOTE_YES: 5,
    MOTION_VOTE_NO: 3,
    MOTION_VOTE_ABSTAIN: 2,
    RAISE_POINT_PERSONAL_PRIVILEGE: 5,
    RAISE_POINT_PARLIAMENTARY_INQUIRY: 10,
    SPEAK_IN_MODERATED_CAUCUS: 12,
    SEND_NOTE: 2,
    RESOLUTION_VOTE_YES: 10,
    RESOLUTION_VOTE_NO: 5,
    RESOLUTION_VOTE_ABSTAIN: 3,
    PARTICIPATION_BONUS: 5,
    CRISIS_RESPONSE: 0,
};

export class PointSystem {
    private engine: ISimulationEngine;

    constructor(engine: ISimulationEngine) {
        this.engine = engine;
    }

    awardPoints(action: string, amount: number | null = null, reason: string = "") {
        const pts = amount !== null ? amount : (POINT_VALUES[action] || 0);
        if (pts === 0) return;
        this.engine.state.points += pts;
        if (this.engine.state.delegation) {
            this.engine.state.delegatePoints[this.engine.state.delegation] = (this.engine.state.delegatePoints[this.engine.state.delegation] || 0) + pts;
        }
        this.engine.state.pointsHistory.push({ action, points: pts, reason, timestamp: Date.now() });
        this.engine.emitChange();
    }

    addPointsToDelegate(name: string, pts: number) {
        this.engine.state.delegatePoints[name] = (this.engine.state.delegatePoints[name] || 0) + pts;
        this.engine.emitChange();
    }
}
