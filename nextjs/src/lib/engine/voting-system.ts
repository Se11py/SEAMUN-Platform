import { ISimulationEngine } from './types';

export class VotingSystem {
    private engine: ISimulationEngine;

    constructor(engine: ISimulationEngine) {
        this.engine = engine;
    }

    runRollCall() {
        this.engine.setStage("Roll Call");
        this.engine.skipHandler = null;
        this.engine.setChairBubble("Roll call will be taken alphabetically. Please state your presence.");
        this.engine.logEvent("Roll call begins in alphabetical order.", [{ label: "System", variant: "system" }]);

        const ordered = [...(this.engine.state.committee?.members || [])].sort();
        let index = 0;

        const advance = () => {
            if (index >= ordered.length) {
                this.engine.logEvent("Roll call concluded.", [{ label: "System", variant: "system" }]);
                this.engine.queueAction(() => this.engine.debate.startOpeningSpeeches());
                return;
            }
            const current = ordered[index];
            this.engine.setCurrentSpeaker(current, false);
            this.engine.setChairBubble(`Delegate of ${current}, please state your presence.`);

            if (current === this.engine.state.delegation) {
                this.engine.queueAction(() => this.engine.openModal(
                    "Roll Call",
                    `${current}, please respond.`,
                    [
                        {
                            label: "Present and Voting",
                            className: "primary",
                            onClick: () => {
                                this.engine.closeModal();
                                this.engine.state.votingStatus = "present_and_voting";
                                this.engine.logEvent(`${current} is present and voting.`, [{ label: "System", variant: "system" }]);
                                this.engine.points.awardPoints("ROLL_CALL_PRESENT_VOTING", null, "Responded 'Present and Voting'");
                                index++;
                                this.engine.queueAction(advance);
                            }
                        },
                        {
                            label: "Present",
                            onClick: () => {
                                this.engine.closeModal();
                                this.engine.state.votingStatus = "present";
                                this.engine.logEvent(`${current} is present.`, [{ label: "System", variant: "system" }]);
                                this.engine.points.awardPoints("ROLL_CALL_PRESENT", null, "Responded 'Present'");
                                index++;
                                this.engine.queueAction(advance);
                            }
                        }
                    ]
                ));
            } else {
                this.engine.logEvent(`${current} is present.`, [{ label: "System", variant: "system" }]);
                this.engine.points.addPointsToDelegate(current, 3);
                index++;
                this.engine.queueAction(advance);
            }
        };
        this.engine.queueAction(advance);
    }

    chairCallsForVote(motion: any) {
        this.engine.setStage("Motion Vote");
        this.engine.skipHandler = null;
        this.engine.setChairBubble(`We will now vote on the motion raised by ${motion.raisedBy}.`);
        this.engine.logEvent(`Voting on motion: ${this.engine.formatMotionLabel(motion)}`, [{ label: "Motion", variant: "motion" }]);

        this.engine.queueAction(() => this.engine.openModal(
            "Motion Vote",
            `${motion.raisedBy} moves: ${this.engine.formatMotionLabel(motion)} Vote?`,
            this.engine.buildVoteActions((vote: string) => this.resolveMotionVote(motion, vote))
        ));
    }

    resolveMotionVote(motion: any, vote: string) {
        let yesPercent = 50;
        if (vote === "yes") {
            yesPercent = this.engine.randBetween(55, 80);
            this.engine.points.awardPoints("MOTION_VOTE_YES", null, "Voted 'Yes'");
        } else if (vote === "no") {
            yesPercent = this.engine.randBetween(25, 45);
            this.engine.points.awardPoints("MOTION_VOTE_NO", null, "Voted 'No'");
        } else {
            yesPercent = this.engine.randBetween(45, 55);
            this.engine.points.awardPoints("MOTION_VOTE_ABSTAIN", null, "Abstained");
        }
        const passes = yesPercent >= 50;
        this.engine.logEvent(`Motion vote: ${yesPercent}% in favor. ${passes ? "Passes" : "Fails"}.`, [{ label: passes ? "Passed" : "Failed", variant: "motion" }]);

        if (passes) {
            if (motion.raisedBy === this.engine.state.delegation) {
                this.engine.points.awardPoints("MOTION_PASSES", null, "Your motion passed!");
            }
            this.engine.queueAction(() => this.engine.debate.runMotion(motion));
        } else {
            this.engine.logEvent("The chair entertains new motions.");
            this.engine.queueAction(() => this.engine.debate.openFloor());
        }
    }

    startResolutionVote() {
        this.engine.setStage("Resolution Vote");
        this.engine.skipHandler = null;
        this.engine.setChairBubble("Moving into voting procedure.");
        this.engine.logEvent("Voting on draft resolutions.", [{ label: "System", variant: "system" }]);
        this.engine.queueAction(() => this.engine.openModal(
            "Draft Resolutions",
            "Draft Resolution A/1 is before the committee.",
            [{
                label: "Proceed to Vote",
                className: "primary",
                onClick: () => {
                    this.engine.closeModal();
                    this.engine.queueAction(() => this.engine.openModal(
                        "Resolution Vote",
                        "Vote on Draft Resolution A/1.",
                        this.engine.buildVoteActions((vote: string) => {
                            let yes = 50;
                            if (vote === 'yes') { yes = this.engine.randBetween(55, 85); this.engine.points.awardPoints("RESOLUTION_VOTE_YES"); }
                            else if (vote === 'no') { yes = this.engine.randBetween(25, 45); this.engine.points.awardPoints("RESOLUTION_VOTE_NO"); }
                            else { yes = this.engine.randBetween(45, 55); this.engine.points.awardPoints("RESOLUTION_VOTE_ABSTAIN"); }

                            const passed = yes >= 50;
                            this.engine.logEvent(`Resolution result: ${yes}% Yes. ${passed ? "PASSED" : "FAILED"}`, [{ label: "Vote", variant: "system" }]);
                            this.engine.setChairBubble(passed ? "Clapping is in order." : "Clapping is not in order.");
                            this.engine.setStage("Awaiting Adjournment");
                            this.engine.skipHandler = () => this.engine.debate.adjourn();
                            this.engine.emitChange();
                        })
                    ));
                }
            }]
        ));
    }
}
