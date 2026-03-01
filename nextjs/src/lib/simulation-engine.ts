import { committees, flagMap as importedFlagMap } from './simulation-data';
import { ISimulationEngine, SimulationState, LogEntry, Listener } from './engine/types';
import { PointSystem } from './engine/point-system';
import { CrisisManager } from './engine/crisis-manager';
import { VotingSystem } from './engine/voting-system';
import { DebateEngine, motionTemplates } from './engine/debate-engine';

export const flagMap = importedFlagMap;
export * from './engine/types';

export class SimulationEngine implements ISimulationEngine {
    state: SimulationState;
    listeners: Listener[] = [];
    actionQueue: (() => void)[] = [];
    timerInterval: any = null;
    funFactInterval: any = null;
    skipHandler: (() => void) | null = null;

    points: PointSystem;
    crisis: CrisisManager;
    voting: VotingSystem;
    debate: DebateEngine;

    constructor() {
        this.state = this.getInitialState();
        this.points = new PointSystem(this);
        this.crisis = new CrisisManager(this);
        this.voting = new VotingSystem(this);
        this.debate = new DebateEngine(this);
    }

    getInitialState(): SimulationState {
        return {
            committee: null,
            delegation: null,
            round: 0,
            stage: "Idle",
            timerRemaining: 0,
            timerTotal: 0,
            currentSpeaker: null,
            currentPlacard: null,
            raised: false,
            roundInProgress: false,
            votingStatus: "present",
            manualAdvanceEnabled: false,
            pendingContinues: 0,
            points: 0,
            pointsHistory: [],
            delegatePoints: {},
            activeCrisis: null,
            crisesTriggered: 0,
            log: [],
            modal: null,
            chairBubble: "Welcome delegates.",
            speechAddress: null,
            displayOrder: null,
            funFactIndex: 0,
            isSpeechAddressVisible: false,
            motionQueue: [],
            activeMotion: null,
        };
    }

    subscribe(listener: Listener) {
        this.listeners.push(listener);
        listener(this.state);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    emitChange() {
        this.listeners.forEach(l => l(this.state));
    }

    // --- Helpers ---

    logEvent(message: string, tags: { label: string; variant: string }[] = []) {
        const entry: LogEntry = {
            id: Math.random().toString(36).substr(2, 9),
            message,
            tags,
            timestamp: Date.now()
        };
        this.state.log = [entry, ...this.state.log];
        this.requireContinue();
        this.emitChange();
    }

    setChairBubble(text: string) {
        this.state.chairBubble = text;
        this.requireContinue();
        this.emitChange();
    }

    setStage(label: string) {
        this.state.stage = label;
        this.emitChange();
    }

    // --- Queue System ---

    queueAction(action: () => void) {
        this.actionQueue.push(action);
        this.flushActionQueue();
    }

    flushActionQueue() {
        if (this.state.pendingContinues > 0) return;
        while (this.state.pendingContinues === 0 && this.actionQueue.length > 0) {
            const action = this.actionQueue.shift();
            if (action) action();
        }
    }

    requireContinue() {
        if (!this.state.manualAdvanceEnabled) return;
        this.state.pendingContinues = 1;
        this.emitChange();
    }

    handleContinue() {
        if (this.state.pendingContinues > 0) {
            this.state.pendingContinues -= 1;
        }
        this.flushActionQueue();
        this.emitChange();
    }

    // --- Logic Methods ---

    reset() {
        this.clearTimer();
        this.actionQueue = [];
        this.state = this.getInitialState();
        this.emitChange();
    }

    selectCommittee(committeeId: string) {
        const selected = committees.find(c => c.id === committeeId);
        if (!selected) {
            this.state.committee = null;
        } else if (selected.fantasy) {
            if (selected.universes && selected.universes.length > 0) {
                const universe = selected.universes[Math.floor(Math.random() * selected.universes.length)];
                const allTopics = universe.topicGroups.flat();
                const topic = allTopics[Math.floor(Math.random() * allTopics.length)];
                this.state.committee = {
                    ...selected,
                    name: `${selected.name} — ${universe.name}`,
                    universeName: universe.name,
                    members: universe.members,
                    topic,
                    topicGroups: universe.topicGroups,
                    subIssues: universe.subIssues
                };
            } else {
                this.state.committee = selected;
            }
        } else {
            const committee = { ...selected };
            if (committee.topicGroups) {
                const allTopics = committee.topicGroups.flat() as string[];
                if (!committee.topic) {
                    committee.topic = allTopics[Math.floor(Math.random() * allTopics.length)] || "General Session Debate";
                }
            }
            this.state.committee = committee;
        }

        if (this.state.committee && this.state.delegation) {
            const members = this.state.committee.members || [];
            if (!members.includes(this.state.delegation)) {
                this.state.delegation = null;
            }
        }

        this.state.delegatePoints = {};
        if (this.state.committee) {
            this.state.committee.members.forEach((m: string) => {
                this.state.delegatePoints[m] = 0;
            });
            this.state.displayOrder = this.shuffleArray([...this.state.committee.members]);
        }
        this.emitChange();
    }

    selectDelegation(name: string) {
        this.state.delegation = name;
        this.emitChange();
    }

    shuffleDelegation() {
        if (!this.state.committee || !this.state.committee.members) return;
        const members = this.state.committee.members;
        const randomMember = members[Math.floor(Math.random() * members.length)];
        this.selectDelegation(randomMember);
    }

    shuffleTopic() {
        if (!this.state.committee) return;
        const currentCommitteeId = this.state.committee.id;
        this.selectCommittee(currentCommitteeId);
    }

    sendNote(to: string, content: string) {
        if (!this.state.delegation) return;
        this.logEvent(`Note passed to ${to}: "${content}"`, [
            { label: "Note", variant: "info" },
            { label: `To: ${to}`, variant: "neutral" }
        ]);
        setTimeout(() => {
            this.handleNoteReply(to, content);
        }, 2000 + Math.random() * 2000);
    }

    handleNoteReply(from: string, originalContent: string) {
        let reply = "";
        const lowerContent = originalContent.toLowerCase();
        if (lowerContent.includes("bloc") || lowerContent.includes("alliance") || lowerContent.includes("team")) {
            const positive = Math.random() > 0.3;
            reply = positive ? "That sounds like a great idea. Let's discuss during the next unmoderated caucus." : "I need to consult with my other partners first, but I'm open to it.";
        } else if (lowerContent.includes("speech") || lowerContent.includes("point")) {
            reply = "Great points raised. I agree with your stance on this.";
        } else if (lowerContent.includes("break") || lowerContent.includes("lunch") || lowerContent.includes("tired")) {
            reply = "Tell me about it. This session is dragging on forever.";
        } else if (lowerContent.includes("merge") || lowerContent.includes("combine") || lowerContent.includes("paper")) {
            reply = "Send your draft over, I'll take a look.";
        } else if (lowerContent.includes("vote") || lowerContent.includes("support")) {
            reply = "I can support that if you back my amendment.";
        } else {
            const genericReplies = ["Received, thanks.", "Interesting, let's talk more later.", "I'll keep that in mind.", "Can you clarify what you mean?", "Noted."];
            reply = genericReplies[Math.floor(Math.random() * genericReplies.length)] || "Noted.";
        }
        this.logEvent(`Reply from ${from}: "${reply}"`, [
            { label: "Reply", variant: "success" },
            { label: `From: ${from}`, variant: "neutral" }
        ]);
        this.emitChange();
    }

    startSimulation() {
        if (!this.state.committee || !this.state.delegation) return;
        this.state.manualAdvanceEnabled = true;
        this.state.points = 0;
        this.state.pointsHistory = [];
        this.voting.runRollCall();
    }

    destroy() {
        this.clearTimer();
        if (this.funFactInterval) clearInterval(this.funFactInterval);
        this.listeners = [];
    }

    togglePlacard() {
        this.state.raised = !this.state.raised;
        this.emitChange();

        if (!this.state.raised) {
            this.logEvent(`${this.state.delegation} lowers placard.`, [{ label: "Placard", variant: "system" }]);
            return;
        }

        this.logEvent(`${this.state.delegation} raises placard.`, [{ label: "Placard", variant: "system" }]);
        this.points.awardPoints("RAISE_PLACARD", null, "Raised placard");

        this.openModal(
            "You raised your placard. What would you like to do?",
            "Choose an action:",
            [
                {
                    label: "Raise a motion",
                    className: "primary",
                    onClick: () => {
                        this.closeModal();
                        if (this.state.stage !== "Floor Open") {
                            this.logEvent("The floor is not open for motions yet.", [{ label: "Motion", variant: "motion" }]);
                            return;
                        }
                        this.openModal("Raise a Motion", "Select a motion to raise.", motionTemplates.map((motion) => ({
                            label: this.formatMotionLabel(motion),
                            className: "primary",
                            onClick: () => this.debate.userRaisesMotion(motion),
                        })));
                    }
                },
                {
                    label: "Raise a point",
                    onClick: () => {
                        this.closeModal();
                        const personalPrivilegeOptions = [
                            { text: "Point of Personal Privilege: Aircon temperature change.", short: "Aircon temp change" },
                            { text: "Point of Personal Privilege: Bathroom trip.", short: "Bathroom trip" },
                            { text: "Point of Personal Privilege: Water bottle refill.", short: "Water bottle refill" },
                            { text: "Point of Personal Privilege: Charger, getting up to plug in a device.", short: "Charger" },
                        ];
                        this.openModal(
                            "Raise a point",
                            "Choose type of point:",
                            [
                                {
                                    label: "Point of Personal Privilege",
                                    onClick: () => {
                                        this.openModal("Point of Personal Privilege", "Choose one:", personalPrivilegeOptions.map(opt => ({
                                            label: opt.short,
                                            onClick: () => {
                                                this.logEvent(`${this.state.delegation} raises ${opt.text}`, [{ label: "Point", variant: "point" }]);
                                                this.setChairBubble("Point acknowledged.");
                                                this.points.awardPoints("RAISE_POINT_PERSONAL_PRIVILEGE");
                                            }
                                        })));
                                    }
                                },
                                {
                                    label: "Point of Parliamentary Inquiry",
                                    onClick: () => {
                                        this.logEvent(`${this.state.delegation} raises Inquiry.`, [{ label: "Point", variant: "point" }]);
                                        this.setChairBubble("Refer to ROP.");
                                        this.points.awardPoints("RAISE_POINT_PARLIAMENTARY_INQUIRY");
                                    }
                                }
                            ]
                        );
                    }
                }
            ]
        );
    }

    // --- Core Utilities ---

    startTimer(seconds: number, onTick: any, onComplete: any) {
        this.clearTimer();
        this.state.timerRemaining = seconds;
        this.state.timerTotal = seconds;
        this.emitChange();

        this.timerInterval = setInterval(() => {
            this.state.timerRemaining--;
            if (onTick) onTick(this.state.timerRemaining);
            this.emitChange();

            if (this.state.timerRemaining <= 0) {
                this.clearTimer();
                if (onComplete) onComplete();
            }
        }, 1000 * 0.05); // TIME_SCALE
    }

    clearTimer() {
        if (this.timerInterval) clearInterval(this.timerInterval);
        this.timerInterval = null;
        this.state.timerRemaining = 0;
        this.emitChange();
    }

    openModal(title: string, body: string | null, actions: any[]) {
        this.state.modal = { title, ...(body ? { body } : {}), actions };
        this.emitChange();
    }

    closeModal() {
        this.state.modal = null;
        this.emitChange();
    }

    setCurrentSpeaker(name: string | null, usePodium: boolean) {
        this.state.currentSpeaker = name;
        this.state.currentPlacard = usePodium ? name : null;
        this.emitChange();
    }

    returnPlacardHome() {
        this.state.currentPlacard = null;
        this.emitChange();
    }

    showSpeechAddress(delegation: string | null, context: string, topicLine: string = "") {
        if (!delegation) return;
        this.state.isSpeechAddressVisible = true;
        if (context === "opening") {
            this.state.speechAddress = `Honorable chairs, esteemed delegates. The delegation of ${delegation} would like to thank the dais for this opportunity...`;
        } else {
            this.state.speechAddress = `Honorable chairs... The delegation of ${delegation} would like to speak on ${topicLine}...`;
        }
        this.emitChange();
    }

    clearSpeechAddress() {
        this.state.isSpeechAddressVisible = false;
        this.state.speechAddress = null;
        this.emitChange();
    }

    shuffleArray(arr: any[]) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    randomMember() {
        const members = this.state.committee?.members || [];
        if (members.length === 0) return "Delegate";
        return members[Math.floor(Math.random() * members.length)];
    }

    formatMotionLabel(m: any) {
        if (m.type === "moderated") return `Moderated Caucus (${m.durationMinutes}m, ${m.speakerSeconds}s/speaker)`;
        if (m.type === "unmoderated") return `Unmoderated Caucus (${m.durationMinutes}m)`;
        if (m.type === "consultation") return `Consultation of the Whole (${m.durationMinutes}m)`;
        return m.label;
    }

    buildVoteActions(onVote: (v: string) => void) {
        return [
            { label: "Vote Yes", className: "primary", onClick: () => { this.closeModal(); onVote('yes'); } },
            { label: "Vote No", onClick: () => { this.closeModal(); onVote('no'); } },
            { label: "Abstain", onClick: () => { this.closeModal(); onVote('abstain'); } }
        ];
    }

    randBetween(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    isCrisisCommittee() {
        if (!this.state.committee) return false;
        return this.state.committee.fantasy || ['hsc', 'unsc'].includes(this.state.committee.id);
    }
}
