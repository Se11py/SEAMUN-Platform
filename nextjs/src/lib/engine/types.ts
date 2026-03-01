export interface SimulationState {
    committee: any | null;
    delegation: string | null;
    round: number;
    stage: string;
    timerRemaining: number;
    timerTotal: number;
    currentSpeaker: string | null;
    currentPlacard: string | null;
    raised: boolean;
    roundInProgress: boolean;
    votingStatus: 'present' | 'present_and_voting';
    manualAdvanceEnabled: boolean;
    pendingContinues: number;
    points: number;
    pointsHistory: any[];
    delegatePoints: Record<string, number>;
    activeCrisis: any | null;
    crisesTriggered: number;
    log: LogEntry[];
    modal: ModalState | null;
    chairBubble: string;
    speechAddress: string | null;
    displayOrder: string[] | null;
    funFactIndex: number;
    isSpeechAddressVisible: boolean;
    motionQueue: any[];
    activeMotion: any | null;
}

export interface LogEntry {
    id: string;
    message: string;
    tags: { label: string; variant: string }[];
    timestamp: number;
}

export interface ModalState {
    title: string;
    body?: string;
    htmlBody?: string;
    actions: { label: string; className?: string; onClick: () => void }[];
}

export type Listener = (state: SimulationState) => void;

export interface ISimulationEngine {
    state: SimulationState;
    emitChange: () => void;
    queueAction: (action: () => void) => void;
    logEvent: (message: string, tags?: { label: string; variant: string }[]) => void;
    setChairBubble: (text: string) => void;
    setStage: (label: string) => void;
    startSimulation: () => void;
    openModal: (title: string, body: string | null, actions: any[]) => void;
    closeModal: () => void;
    startTimer: (seconds: number, onTick: any, onComplete: any) => void;
    clearTimer: () => void;
    setCurrentSpeaker: (name: string | null, usePodium: boolean) => void;
    returnPlacardHome: () => void;
    showSpeechAddress: (delegation: string | null, context: string, topicLine?: string) => void;
    clearSpeechAddress: () => void;
    shuffleArray: (arr: any[]) => any[];
    randomMember: () => string;
    randBetween: (min: number, max: number) => number;
    formatMotionLabel: (m: any) => string;
    buildVoteActions: (onVote: (vote: string) => void) => any[];
    skipHandler: (() => void) | null;
    isCrisisCommittee: () => boolean;

    // Feature modules
    points: any;
    crisis: any;
    voting: any;
    debate: any;
}
