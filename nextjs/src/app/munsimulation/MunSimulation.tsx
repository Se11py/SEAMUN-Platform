'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import styles from './MunSimulation.module.css'; // Verify path
import Navbar from '@/components/Navbar';
import BackToHomeButton from '@/components/BackToHomeButton';
import { SimulationEngine, SimulationState, flagMap } from '@/lib/simulation-engine'; // Verify export of flagMap
import { committees } from '@/lib/simulation-data';
import { motionTemplates } from '@/lib/engine/debate-engine';

export default function MunSimulation() {
    const engineRef = useRef<SimulationEngine | null>(null);
    // Initialize with default state to avoid hydration mismatch, though content is mostly client-only
    const [state, setState] = useState<SimulationState | null>(null);
    const logContainerRef = useRef<HTMLDivElement>(null);
    const [noteRecipient, setNoteRecipient] = useState<string>("");
    const [customNote, setCustomNote] = useState<string>("");

    useEffect(() => {
        const engine = new SimulationEngine();
        engineRef.current = engine;
        setState(engine.state); // Set initial state
        const unsubscribe = engine.subscribe((newState) => {
            setState({ ...newState }); // Force re-render with new object or just pass state
        });
        return () => {
            unsubscribe();
            engine.destroy();
        };
    }, []);

    // Auto-scroll logs
    useEffect(() => {
        if (logContainerRef.current) {
            logContainerRef.current.scrollTop = 0; // Prepend logic in generic JS meant top, but flex-col-reverse or similar? 
            // script.js used prepend, so newest is at top. 
            // So scrollTop 0 is correct if overflow-y auto.
        }
    }, [state?.log]);

    if (!state) return <div className={styles.loading}>Loading Simulation...</div>;

    const {
        committee, delegation, stage, round,
        timerRemaining, timerTotal,
        currentSpeaker, currentPlacard,
        points,
        chairBubble,
        log, modal
    } = state;

    // Helpers
    const getProgressPercent = () => {
        const perRound = 12;
        let percent = 0;
        if (stage === "Roll Call") percent = 5;
        if (stage === "Opening Speeches") percent = 15;
        if (stage === "Floor Open" || stage === "Motion Vote" || stage === "Motion") {
            const roundIndex = Math.max(0, round - 1);
            const base = 15 + roundIndex * perRound;
            const stageBonus = stage === "Floor Open" ? 2 : stage === "Motion Vote" ? 4 : 8;
            percent = base + stageBonus;
        }
        if (stage === "Resolution Vote") percent = 85;
        if (stage === "Awaiting Adjournment") percent = 95;
        if (stage === "Adjourned") percent = 100;
        return Math.min(100, Math.max(0, Math.round(percent)));
    };

    const getTimerPercent = () => {
        if (!timerTotal) return 0;
        return Math.max(0, Math.min(100, ((timerTotal - timerRemaining) / timerTotal) * 100));
    };

    const handleCommitteeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        engineRef.current?.selectCommittee(e.target.value);
    };

    const handleDelegationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        engineRef.current?.selectDelegation(e.target.value);
    };

    // Render Methods

    return (
        <div className={styles.container}> {/* Assuming MunSimulation.module.css has .container */}
            <Navbar />


            <main className={styles['app-layout']}>
                <section className={styles['room-panel']}>
                    <div className={styles['integrated-header']}>
                        <div className={styles['header-content']}>
                            <div style={{ marginBottom: '1rem' }}>
                                <BackToHomeButton />
                            </div>
                            <h1>MUN Simulation Game</h1>
                            <p className={styles['header-subtitle']}>Single-player committee flow simulator | <a href="https://seamuns.site" target="_blank" rel="noopener noreferrer" className={styles['site-link']}>seamuns.site</a></p>
                        </div>
                        <div className={styles['header-actions']}>
                            <Link href="/munsimulation/chairs" className={`${styles.secondary} ${styles['link-as-button']}`}>Chair{`'`}s Role</Link>
                            <button
                                className={styles.primary}
                                disabled={!committee || !delegation || state.manualAdvanceEnabled}
                                onClick={() => engineRef.current?.startSimulation()}
                            >
                                Start Simulation
                            </button>
                            <button onClick={() => engineRef.current?.reset()} className={styles.secondary}>Reset</button>
                        </div>
                    </div>
                    <div className={styles['room-header']}>
                        <div>
                            <h2>Committee Room</h2>
                            {committee?.universeName && (
                                <p className={styles['universe-label']}>Universe: {committee.universeName}</p>
                            )}
                            <p className={styles.topic}>
                                {committee?.topic || "Select a committee to view the topic."}
                            </p>
                        </div>
                        <div className={styles['room-meta']}>
                            <div>
                                <span className={styles.label}>Stage</span>
                                <span className={styles.value}>{stage}</span>
                            </div>
                            <div>
                                <span className={styles.label}>Round</span>
                                <span className={styles.value}>{round} / 5</span>
                            </div>
                            <div className={styles['points-display']}>
                                <span className={styles.label}>Points</span>
                                <span key={points} className={`${styles.value} ${styles['points-value']}`}>{points}</span>
                            </div>
                        </div>
                    </div>

                    <div className={styles['conference-progress']}>
                        <div className={styles['progress-meta']}>
                            <span className={styles.label}>Conference Progress</span>
                            <span className={styles.value}>{getProgressPercent()}%</span>
                        </div>
                        <div className={`${styles.progress} ${styles['progress-large']}`}>
                            <div
                                className={styles['progress-bar']}
                                style={{ width: `${getProgressPercent()}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className={`${styles['setup-bar']} ${styles['panel-section']}`}>
                        <h3>Committee Setup</h3>
                        <label className={styles.field} title="Pick a starting committee.">
                            Committee
                            <select value={committee?.id || ""} onChange={handleCommitteeChange} disabled={state.manualAdvanceEnabled}>
                                <option value="">Select a committee</option>
                                {committees.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label className={styles.field} title="Choose your delegation.">
                            Your Delegation
                            <select value={delegation || ""} onChange={handleDelegationChange} disabled={state.manualAdvanceEnabled}>
                                <option value="">Select a delegation</option>
                                {/* Render options based on committee members */}
                                {committee?.members?.map((m: string) => (
                                    <option key={m} value={m}>{m}</option>
                                ))}
                            </select>
                        </label>
                        {committee?.subIssues && (
                            <div className={styles.subissues}>
                                <p className={styles.label}>Sub-issues</p>
                                <ul>
                                    {committee.subIssues.map((issue: string, i: number) => (
                                        <li key={i}>{issue}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {/* Shuffle Buttons */}
                        <div className={styles['setup-actions']}>
                            <button
                                className={styles.shuffle_btn}
                                onClick={() => engineRef.current?.shuffleDelegation()}
                                disabled={!committee || state.manualAdvanceEnabled}
                            >
                                Shuffle allocations
                            </button>
                            <button
                                className={styles.shuffle_btn}
                                onClick={() => engineRef.current?.shuffleTopic()}
                                disabled={!committee || state.manualAdvanceEnabled}
                            >
                                Shuffle topic / universe
                            </button>
                        </div>
                    </div>

                    <div className={styles['room-layout']}>
                        <div className={styles.room}>
                            <div className={styles['chair-row']}>
                                <div className={`${styles.chair} ${styles.seat} ${styles['chair-seat']}`}>
                                    <div className={styles['seat-label']}>Chair</div>
                                </div>
                                <div className={`${styles.chair} ${styles.seat} ${styles['chair-seat']}`}>
                                    <div className={styles['seat-label']}>Chair</div>
                                </div>
                            </div>

                            <div className={styles.podium}>
                                <div className={styles['podium-label']}>Podium</div>
                                {currentPlacard && (
                                    <div className={`${styles.placard} ${styles['at-podium']}`}>
                                        {(flagMap as any)[currentPlacard] || currentPlacard[0]}
                                    </div>
                                )}
                            </div>

                            <div className={styles['delegate-ring']}>
                                {(state.displayOrder || []).map(name => (
                                    <div key={name} className={`${styles['delegate-seat']} ${currentSpeaker === name && !currentPlacard ? styles.highlight : ''}`}>
                                        <div className={styles['delegate-name']} title={name}>{name}</div>
                                        {currentPlacard !== name && (
                                            <div className={`${styles.placard} ${state.raised && delegation === name ? styles.highlight : ''}`}>
                                                {(flagMap as any)[name] || name[0]}
                                            </div>
                                        )}
                                        <div className={styles['delegate-points']}>{state.delegatePoints[name] || 0} pts</div>
                                    </div>
                                ))}
                            </div>

                            <div className={styles['chair-bubble']}>{chairBubble}</div>

                            {state.isSpeechAddressVisible && (
                                <div className={styles['speech-address']}>
                                    <p className={styles['speech-address-text']}>{state.speechAddress}</p>
                                </div>
                            )}
                        </div>

                        <div className={`${styles['control-panel']} ${styles['actions-panel']}`}>
                            <div className={styles['panel-section']}>
                                <h3>Controls</h3>
                                <div className={styles['button-grid']}>
                                    <button onClick={() => {
                                        engineRef.current?.togglePlacard();
                                    }} disabled={!state.manualAdvanceEnabled}>Raise Placard</button>
                                    <button onClick={() => {
                                        engineRef.current?.openModal(
                                            "Propose a Motion",
                                            "Select a motion to propose to the committee. It will be voted on against others.",
                                            [
                                                ...motionTemplates.map(m => ({
                                                    label: m.label,
                                                    className: "primary",
                                                    onClick: () => {
                                                        engineRef.current?.closeModal();
                                                        engineRef.current?.debate.userRaisesMotion(m);
                                                    }
                                                })),
                                                { label: "Cancel", onClick: () => engineRef.current?.closeModal() }
                                            ]
                                        );
                                    }} disabled={stage !== "Floor Open"}>Raise Motion</button>
                                    <button onClick={() => engineRef.current?.debate.userWaits()} disabled={stage !== "Floor Open"}>Wait</button>
                                    <button className={styles.secondary} onClick={() => engineRef.current?.skipHandler?.()}>Skip</button>
                                    <button className={styles.danger} disabled={stage !== "Awaiting Adjournment"} onClick={() => engineRef.current?.debate.adjourn()}>Adjourn</button>
                                </div>
                                <div className={styles['status-card']}>
                                    <p className={styles.label}>Now Speaking</p>
                                    <p>{currentSpeaker || "None"}</p>
                                    <div className={styles.progress}>
                                        <div className={styles['progress-bar']} style={{ width: `${getTimerPercent()}%` }}></div>
                                    </div>
                                    <p className={styles['progress-label']}>{timerRemaining > 0 ? `${Math.ceil(timerRemaining / 60)}m remaining` : "No active timer"}</p>
                                </div>
                            </div>

                            <div className={styles['panel-section']}>
                                <h3>Event Log</h3>
                                <div className={styles.log} ref={logContainerRef}>
                                    {log.map(entry => (
                                        <div key={entry.id} className={styles['log-entry']}>
                                            <div className={styles['log-tags']}>
                                                {entry.tags.map((tag, i) => (
                                                    <span key={i} className={`${styles.tag} ${styles[tag.variant] || ''}`}>{tag.label}</span>
                                                ))}
                                            </div>
                                            <div className={styles['log-message']}>{entry.message}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Note Passing */}
                            <div className={styles['panel-section']}>
                                <h3>Notes to Pass</h3>
                                {(!committee || !delegation) ? (
                                    <p className={styles.label}>Select a committee and delegation to start passing notes.</p>
                                ) : (
                                    <div className={styles['note-panel']}>
                                        <div className={styles['note-sender']}>
                                            <label className={styles.label}>Send to</label>
                                            <select
                                                value={noteRecipient}
                                                onChange={(e) => setNoteRecipient(e.target.value)}
                                            >
                                                <option value="">Select a delegate</option>
                                                {committee.members
                                                    .filter((m: string) => m !== delegation)
                                                    .map((m: string) => <option key={m} value={m}>{m}</option>)
                                                }
                                            </select>
                                        </div>

                                        <div className={styles['preset-notes']}>
                                            {[
                                                "Let's form a bloc!",
                                                "Awesome speech, seems like we have a lot of the same stances on sub-issues",
                                                "I can't wait for break"
                                            ].map(note => (
                                                <button
                                                    key={note}
                                                    className={styles['preset-note-btn']}
                                                    disabled={!noteRecipient}
                                                    onClick={() => engineRef.current?.sendNote(noteRecipient, note)}
                                                >
                                                    "{note}"
                                                </button>
                                            ))}
                                        </div>

                                        <div className={styles['note-input-row']}>
                                            <input
                                                type="text"
                                                className={styles['note-input']}
                                                placeholder="Custom message..."
                                                value={customNote}
                                                onChange={(e) => setCustomNote(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' && noteRecipient && customNote) {
                                                        engineRef.current?.sendNote(noteRecipient, customNote);
                                                        setCustomNote('');
                                                    }
                                                }}
                                            />
                                            <button
                                                className={styles['note-send-btn']}
                                                disabled={!noteRecipient || !customNote}
                                                onClick={() => {
                                                    if (noteRecipient && customNote) {
                                                        engineRef.current?.sendNote(noteRecipient, customNote);
                                                        setCustomNote('');
                                                    }
                                                }}
                                            >
                                                Send
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Modal */}
            {modal && (
                <div className={styles.modal}>
                    <div className={styles['modal-content']}>
                        <h3>{modal.title}</h3>
                        {modal.body && <p>{modal.body}</p>}
                        {modal.htmlBody && <div className={styles['modal-body-html']} dangerouslySetInnerHTML={{ __html: modal.htmlBody }} />}
                        <div className={styles['modal-actions']}>
                            {modal.actions.map((action, i) => (
                                <button key={i} className={action.className === 'primary' ? styles.primary : ''} onClick={action.onClick}>
                                    {action.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Continue Overlay */}
            {state.pendingContinues > 0 && (
                <div className={styles['continue-overlay']} onClick={() => engineRef.current?.handleContinue()}>
                    <button className={styles.primary}>Continue</button>
                </div>
            )}


        </div >
    );
}
