import { ISimulationEngine } from './types';
import { crises } from '../simulation-data';

export class CrisisManager {
    private engine: ISimulationEngine;

    constructor(engine: ISimulationEngine) {
        this.engine = engine;
    }

    triggerCrisis() {
        if (!this.engine.state.committee) return;
        const list = (crises as any)[this.engine.state.committee.id];
        if (!list || list.length === 0) return;
        if (this.engine.state.crisesTriggered >= 2) return;

        const crisis = list[Math.floor(Math.random() * list.length)];
        this.engine.state.activeCrisis = crisis;
        this.engine.state.crisesTriggered++;

        this.engine.logEvent(`🚨 CRISIS: ${crisis.title}`, [{ label: "Crisis", variant: "System" }]);
        this.engine.setChairBubble(`Breaking: ${crisis.title}`);

        this.engine.queueAction(() => this.engine.openModal(
            `🚨 Crisis: ${crisis.title}`,
            crisis.description,
            crisis.options.map((opt: any, idx: number) => ({
                label: opt.text,
                className: idx === 0 ? "primary" : "",
                onClick: () => {
                    this.engine.closeModal();
                    this.engine.points.awardPoints("CRISIS_RESPONSE", opt.points);
                    this.engine.logEvent(`Crisis Response: ${opt.text}`, [{ label: "Response", variant: "system" }]);
                    this.engine.logEvent(`Outcome: ${opt.outcome}`, [{ label: "Outcome", variant: "system" }]);
                    this.engine.setChairBubble(opt.outcome);
                    this.engine.state.activeCrisis = null;
                }
            }))
        ));
    }
}
