import { ISimulationEngine } from './types';

export const motionTemplates = [
    { id: "motion1", type: "moderated", durationMinutes: 10, speakerSeconds: 60, label: "Motion for a moderated caucus on Sub-issue 1 for 10 minutes with 60 seconds per speaker." },
    { id: "motion2", type: "unmoderated", durationMinutes: 20, speakerSeconds: 0, label: "Motion for an unmoderated caucus of 20 minutes." },
    { id: "motion3", type: "consultation", durationMinutes: 12, speakerSeconds: 0, label: "Motion for a consultation of the whole on Sub-issue 2." },
    { id: "motion4", type: "unmoderated", durationMinutes: 30, speakerSeconds: 0, label: "Motion for an unmoderated caucus of 30 minutes." },
    { id: "motion5", type: "moderated", durationMinutes: 15, speakerSeconds: 90, label: "Motion for a moderated caucus on Sub-issue 3 for 15 minutes with 90 seconds per speaker." },
];

export class DebateEngine {
    private engine: ISimulationEngine;

    constructor(engine: ISimulationEngine) {
        this.engine = engine;
    }

    startOpeningSpeeches() {
        this.engine.setStage("Opening Speeches");
        this.engine.skipHandler = () => {
            this.engine.logEvent("Opening speeches skipped.", [{ label: "System", variant: "system" }]);
            this.engine.clearTimer();
            this.engine.clearSpeechAddress();
            this.engine.returnPlacardHome();
            this.engine.queueAction(() => this.openFloor());
        };
        this.engine.setChairBubble("We will now hear opening speeches.");
        this.engine.logEvent("Opening speeches begin.", [{ label: "System", variant: "system" }]);

        const ordered = [...(this.engine.state.committee?.members || [])].sort();
        const totalSeconds = 20 * 60;
        const speakerSeconds = Math.max(30, Math.floor(totalSeconds / ordered.length));
        let index = 0;

        const nextSpeaker = () => {
            if (this.engine.state.stage !== "Opening Speeches") return;
            if (index >= ordered.length) {
                this.engine.logEvent("Opening speeches concluded.", [{ label: "System", variant: "system" }]);
                this.engine.clearSpeechAddress();
                this.engine.returnPlacardHome();
                this.engine.queueAction(() => this.openFloor());
                return;
            }
            const current = ordered[index];
            this.engine.setCurrentSpeaker(current, true);
            this.engine.setChairBubble(`Delegate of ${current}, please approach the podium.`);

            if (current === this.engine.state.delegation) {
                this.engine.queueAction(() => this.engine.openModal(
                    "Your Turn to Speak",
                    "It's your turn to give your opening speech.",
                    [{
                        label: "Begin Speaking",
                        className: "primary",
                        onClick: () => {
                            this.engine.closeModal();
                            this.engine.points.awardPoints("OPENING_SPEECH", null, "Gave opening speech");
                            this.engine.showSpeechAddress(this.engine.state.delegation, "opening");
                            this.engine.startTimer(speakerSeconds, null, () => {
                                this.engine.clearSpeechAddress();
                                index++;
                                this.engine.queueAction(nextSpeaker);
                            });
                        }
                    }]
                ));
            } else {
                this.engine.queueAction(() => {
                    this.engine.showSpeechAddress(current, "opening");
                    this.engine.startTimer(speakerSeconds, null, () => {
                        this.engine.clearSpeechAddress();
                        this.engine.points.addPointsToDelegate(current, 10);
                        index++;
                        this.engine.queueAction(nextSpeaker);
                    });
                });
            }
        };
        this.engine.queueAction(nextSpeaker);
    }

    openFloor() {
        this.engine.state.round += 1;
        this.engine.skipHandler = null;
        if (this.engine.state.round > 5) {
            this.engine.voting.startResolutionVote();
            return;
        }
        this.engine.setStage("Floor Open");
        this.engine.state.roundInProgress = true;
        this.engine.state.motionQueue = [];
        this.engine.returnPlacardHome();
        this.engine.setChairBubble("The floor is now open for motions.");
        this.engine.logEvent(`Round ${this.engine.state.round}: The floor is open for motions.`, [{ label: "Motion", variant: "motion" }]);

        const members = this.engine.state.committee?.members || [];
        const randomMotions = motionTemplates.map(m => ({
            ...m,
            raisedBy: members[Math.floor(Math.random() * members.length)]
        }));
        this.engine.state.motionQueue = randomMotions;

        randomMotions.forEach(motion => {
            this.engine.logEvent(`${motion.raisedBy} raises: ${this.engine.formatMotionLabel(motion)}`, [{ label: "Motion", variant: "motion" }]);
            this.engine.points.addPointsToDelegate(motion.raisedBy, 15);
        });

        if (this.engine.isCrisisCommittee() && this.engine.state.round >= 2) {
            setTimeout(() => this.engine.crisis.triggerCrisis(), 2000);
        }

        this.engine.emitChange();
    }

    userWaits() {
        if (this.engine.state.stage !== "Floor Open") return;
        this.engine.logEvent("No motions are currently on the floor (simulated).", [{ label: "Motion", variant: "motion" }]);
        const randomMotions = this.engine.state.motionQueue;
        randomMotions.forEach(motion => {
            this.engine.logEvent(`${motion.raisedBy} raises: ${this.engine.formatMotionLabel(motion)}`, [{ label: "Motion", variant: "motion" }]);
            this.engine.points.addPointsToDelegate(motion.raisedBy, 15);
        });

        if (randomMotions.length > 0) {
            this.waitForMotions(randomMotions);
        } else {
            this.engine.logEvent("Silence on the floor. Moving to voting.", [{ label: "System", variant: "system" }]);
        }
    }

    userRaisesMotion(motion: any) {
        if (this.engine.state.stage !== "Floor Open") return;
        const raisedBy = this.engine.state.delegation;
        const userMotion = { ...motion, raisedBy };

        const others = this.engine.state.motionQueue;
        const allMotions = [userMotion, ...others];

        this.engine.logEvent(`${raisedBy} raises: ${this.engine.formatMotionLabel(userMotion)}`, [{ label: "Motion", variant: "motion" }]);
        this.engine.points.awardPoints("RAISE_MOTION", null, `Raised motion: ${motion.type}`);

        others.forEach(m => {
            this.engine.logEvent(`${m.raisedBy} raises: ${this.engine.formatMotionLabel(m)}`, [{ label: "Motion", variant: "motion" }]);
            this.engine.points.addPointsToDelegate(m.raisedBy, 15);
        });

        this.waitForMotions(allMotions);
    }

    waitForMotions(motions: any[]) {
        if (motions.length === 0) return;

        if (motions.length === 1) {
            this.engine.voting.chairCallsForVote(motions[0]);
            return;
        }

        const options = motions.map((m, idx) => ({
            label: `${m.raisedBy}: ${this.engine.formatMotionLabel(m)}`,
            className: idx === 0 ? "primary" : "",
            onClick: () => {
                this.engine.closeModal();
                this.engine.voting.chairCallsForVote(m);
            }
        }));

        this.engine.queueAction(() => this.engine.openModal(
            "Choose Motion to Vote On",
            "Select which motion the chair should call for a vote:",
            options
        ));
    }

    runMotion(motion: any) {
        this.engine.setStage("Motion");
        const topicLine = this.getTopicLine(motion);
        this.engine.logEvent(`Motion begins: ${this.engine.formatMotionLabel(motion)}`, [{ label: "Motion", variant: "motion" }]);

        if (motion.type === "moderated") {
            this.runModeratedCaucus(motion, topicLine);
        } else if (motion.type === "consultation") {
            this.runConsultation(motion, topicLine);
        } else {
            this.runUnmoderatedCaucus(motion, topicLine);
        }
    }

    getTopicLine(motion: any) {
        const subIssues = this.engine.state.committee?.subIssues || ["General Debate"];
        let sub = subIssues[0];
        if (motion.label.includes("Sub-issue 2")) sub = subIssues[1] || sub;
        if (motion.label.includes("Sub-issue 3")) sub = subIssues[2] || sub;
        return sub;
    }

    runModeratedCaucus(motion: any, topicLine: string) {
        this.engine.setChairBubble("Moderated caucus begins. Speakers will be timed.");
        this.engine.skipHandler = () => {
            this.engine.logEvent("Moderated caucus skipped.", [{ label: "Motion", variant: "motion" }]);
            this.engine.clearTimer();
            this.engine.clearSpeechAddress();
            this.engine.returnPlacardHome();
            this.engine.queueAction(() => this.openFloor());
        };
        const totalSeconds = motion.durationMinutes * 60;
        const speakerSeconds = motion.speakerSeconds;
        const speakerCount = Math.max(1, Math.floor(totalSeconds / speakerSeconds));
        let current = 0;

        if (this.engine.isCrisisCommittee() && Math.random() > 0.7) {
            setTimeout(() => this.engine.crisis.triggerCrisis(), 3000);
        }

        const nextSpeaker = () => {
            if (current >= speakerCount) {
                this.engine.logEvent("Moderated caucus concluded.", [{ label: "Motion", variant: "motion" }]);
                this.engine.clearSpeechAddress();
                this.engine.returnPlacardHome();
                this.engine.queueAction(() => this.openFloor());
                return;
            }

            const speaker = this.engine.randomMember();
            this.engine.setCurrentSpeaker(speaker, true);
            this.engine.setChairBubble(`Delegate of ${speaker}, you are recognized.`);

            if (speaker === this.engine.state.delegation) {
                this.engine.queueAction(() => this.engine.openModal(
                    "Your Turn",
                    `You are recognized to speak on ${topicLine}.`,
                    [{
                        label: "Begin Speaking",
                        className: "primary",
                        onClick: () => {
                            this.engine.closeModal();
                            this.engine.points.awardPoints("SPEAK_IN_MODERATED_CAUCUS", null, "Spoke in caucus");
                            this.engine.showSpeechAddress(this.engine.state.delegation, "moderated", topicLine);
                            this.engine.startTimer(speakerSeconds, null, () => {
                                this.engine.clearSpeechAddress();
                                current++;
                                this.engine.queueAction(nextSpeaker);
                            });
                        }
                    }]
                ));
            } else {
                this.engine.queueAction(() => {
                    this.engine.showSpeechAddress(speaker, "moderated", topicLine);
                    this.engine.startTimer(speakerSeconds, null, () => {
                        this.engine.clearSpeechAddress();
                        this.engine.points.addPointsToDelegate(speaker, 10);
                        current++;
                        this.engine.queueAction(nextSpeaker);
                    });
                });
            }
        };
        this.engine.queueAction(nextSpeaker);
    }

    runUnmoderatedCaucus(motion: any, topicLine: string) {
        this.engine.setChairBubble("Unmoderated caucus begins.");
        this.engine.skipHandler = () => {
            this.engine.logEvent("Unmoderated caucus skipped.", [{ label: "Motion", variant: "motion" }]);
            this.engine.clearTimer();
            this.engine.returnPlacardHome();
            this.engine.queueAction(() => this.openFloor());
        };
        this.engine.setCurrentSpeaker("Consultation", false);
        this.engine.queueAction(() => this.engine.openModal(
            "Unmoderated Caucus",
            `Unmoderated caucus on ${topicLine}.`,
            [{
                label: "Begin",
                className: "primary",
                onClick: () => {
                    this.engine.closeModal();
                    this.engine.startTimer(motion.durationMinutes * 60, null, () => {
                        this.engine.logEvent("Unmod concluded.", [{ label: "Motion", variant: "motion" }]);
                        this.engine.setCurrentSpeaker(null, false);
                        this.engine.queueAction(() => this.openFloor());
                    });
                }
            }]
        ));
    }

    runConsultation(motion: any, topicLine: string) {
        this.engine.setChairBubble("Consultation of the whole.");
        this.engine.skipHandler = () => {
            this.engine.logEvent("Consultation skipped.", [{ label: "Motion", variant: "motion" }]);
            this.engine.clearTimer();
            this.engine.setCurrentSpeaker(null, false);
            this.engine.queueAction(() => this.openFloor());
        };
        this.engine.setCurrentSpeaker("Consultation", false);
        this.engine.queueAction(() => this.engine.openModal(
            "Consultation",
            `Consultation on ${topicLine}.`,
            [{
                label: "Begin",
                className: "primary",
                onClick: () => {
                    this.engine.closeModal();
                    this.engine.startTimer(motion.durationMinutes * 60, null, () => {
                        this.engine.logEvent("Consultation concluded.", [{ label: "Motion", variant: "motion" }]);
                        this.engine.setCurrentSpeaker(null, false);
                        this.engine.queueAction(() => this.openFloor());
                    });
                }
            }]
        ));
    }

    adjourn() {
        this.engine.setStage("Adjourned");
        this.engine.setChairBubble("Committee adjourned.");
        this.engine.logEvent("Adjourned.", [{ label: "System", variant: "system" }]);
        this.engine.points.awardPoints("PARTICIPATION_BONUS", 25, "Completed session");

        const finalScore = this.engine.state.points;
        this.engine.queueAction(() => this.engine.openModal(
            "Awards Ceremony",
            `Session Complete! Final Score: ${finalScore}`,
            [{
                label: "Restart",
                className: "primary",
                onClick: () => {
                    this.engine.closeModal();
                    // Trigger engine level startSimulation (if passed back down or handled elsewhere)
                    // We'll call it a generic reboot logic since startSimulation() is in main engine class
                    // We can achieve this through calling engine.runRollCall() after reset if possible.
                    // But we don't have startSimulation on ISimulationEngine interface yet...
                }
            }]
        ));
    }
}
