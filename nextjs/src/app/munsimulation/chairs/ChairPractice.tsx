'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import BackToHomeButton from '@/components/BackToHomeButton';
import styles from '../MunSimulation.module.css';
import chairStyles from './ChairPractice.module.css';
import { procedureQuestions, funFacts } from '@/lib/simulation-data';

interface ProcedureQuestion {
    phase: string;
    scenario: string;
    options: string[];
    correctIndex: number;
    narratives: {
        wrong: string;
        correct: string;
    };
}

export default function ChairPractice() {
    // Game State
    const [started, setStarted] = useState(false);
    const [finished, setFinished] = useState(false);
    const [questionCount, setQuestionCount] = useState(50);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [shuffledQuestions, setShuffledQuestions] = useState<ProcedureQuestion[]>([]);

    // Feedback State
    const [feedbackVisible, setFeedbackVisible] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);

    // Fun Fact
    const [randomFact, setRandomFact] = useState("Loading...");

    // Initialize random fact on mount
    useEffect(() => {
        setRandomFact(funFacts[Math.floor(Math.random() * funFacts.length)] || "Did you know...");
    }, []);

    // Helper: Shuffle Array
    const shuffleArray = <T,>(array: T[]): T[] => {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = newArray[i] as T;
            newArray[i] = newArray[j] as T;
            newArray[j] = temp;
        }
        return newArray;
    };

    const startGame = () => {
        const shuffled = shuffleArray(procedureQuestions).slice(0, questionCount);
        setShuffledQuestions(shuffled);
        setCurrentQuestionIndex(0);
        setScore(0);
        setStarted(true);
        setFinished(false);
        setFeedbackVisible(false);
        setSelectedOption(null);
    };

    const handleAnswer = (optionIndex: number) => {
        if (feedbackVisible) return; // Prevent multiple clicks

        const currentQuestion = shuffledQuestions[currentQuestionIndex];
        if (!currentQuestion) return;
        const correct = optionIndex === currentQuestion.correctIndex;

        setIsCorrect(correct);
        setSelectedOption(optionIndex);
        setFeedbackVisible(true);

        if (correct) {
            setScore(prev => prev + 1);
            // Trigger confetti if we had a confetti library, skipping for now
        }
    };

    const nextQuestion = () => {
        if (currentQuestionIndex + 1 < shuffledQuestions.length) {
            setCurrentQuestionIndex(prev => prev + 1);
            setFeedbackVisible(false);
            setSelectedOption(null);
            // Update fun fact occasionally?
            setRandomFact(funFacts[Math.floor(Math.random() * funFacts.length)] || "Fun fact!");
        } else {
            setFinished(true);
        }
    };

    const restartGame = () => {
        setStarted(false);
        setFinished(false);
        setFeedbackVisible(false);
        setScore(0);
        setCurrentQuestionIndex(0);
    };

    const currentQuestion = shuffledQuestions[currentQuestionIndex] || {
        phase: '', scenario: '', options: [], correctIndex: 0, narratives: { wrong: '', correct: '' }
    };

    // Determine phase based on index (simplified logic from original script if needed, or just generic)
    // Original script had specific phases but simulation-data might not capture that fully per question unless we add it. 
    // For now we'll stick to generic progress.
    const progress = ((currentQuestionIndex) / shuffledQuestions.length) * 100;

    return (
        <div className={styles.container}>
            <header className={styles['app-header']}>
                <div className={styles['header-brand']}>
                    <div style={{ marginRight: '1rem' }}>
                        <BackToHomeButton />
                    </div>
                    <Link href="/" className={styles['site-logo-link']}>
                        {/* Assuming logo.png is in public/logo.png, update path if needed */}
                        {/* Next.js Image requires width/height. Using values from CSS or approximation */}
                        <Image src="/logo.png" alt="MUN Simulation" className={styles['site-logo']} width={200} height={50} />
                    </Link>
                    <div>
                        <h1>Chair{`'`}s Role</h1>
                        <p className={styles.subtitle}>
                            Procedure practice — run the committee | <a href="https://seamuns.site" target="_blank" rel="noopener noreferrer" className={styles['site-link']}>seamuns.site</a>
                        </p>
                    </div>
                </div>
                <div className={styles['header-actions']}>
                    <Link href="/munsimulation" className={`${styles.linkAsButton} ${styles.primary}`}>Delegate Sim</Link>
                    {started && !finished && (
                        <div className={chairStyles['chair-meta']}>
                            <span className={chairStyles.label}>Question</span>
                            <span className={chairStyles.value}>{currentQuestionIndex + 1} / {shuffledQuestions.length}</span>
                        </div>
                    )}
                </div>
            </header>

            <main className={`${styles['app-layout']} ${chairStyles['chairs-layout']}`}>
                <section className={`${styles['room-panel']} ${chairStyles['chair-panel']}`}>
                    <div className={chairStyles['chair-session-header']}>
                        <h2>Committee Session</h2>
                        <p className={chairStyles['session-phase']}>
                            {/* We could map questions to phases if data supports it, otherwise generic */}
                            Simulating Procedure...
                        </p>
                        <div className={`${styles.progress} ${styles['progress-large']}`}>
                            <div
                                className={styles['progress-bar']}
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                    </div>

                    {!started && !finished ? (
                        // Placeholder for layout consistency, though overlay covers it.
                        // Actually, we can show the first question in background or just empty state.
                        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                            Waiting for session to begin...
                        </div>
                    ) : finished ? (
                        <div className={chairStyles['chair-content-block']}>
                            {/* Finished state handled by overlay, but can also show here */}
                            <h2>Session Complete</h2>
                        </div>
                    ) : (
                        <>
                            <div className={`${chairStyles['scenario-block']} ${chairStyles['chair-content-block']}`}>
                                <h3>Scenario</h3>
                                <div className={chairStyles['scenario-text']}>
                                    {currentQuestion.scenario}
                                </div>
                                <p className={chairStyles['prompt-label']}>💭 What do you do?</p>
                                <div className={chairStyles['options-list']}>
                                    {currentQuestion.options.map((option, idx) => (
                                        <button
                                            key={idx}
                                            className={`${chairStyles['procedure-option']} ${feedbackVisible
                                                ? idx === currentQuestion.correctIndex
                                                    ? chairStyles['option-correct']
                                                    : idx === selectedOption
                                                        ? chairStyles['option-incorrect']
                                                        : ''
                                                : ''
                                                }`}
                                            onClick={() => handleAnswer(idx)}
                                            disabled={feedbackVisible}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {feedbackVisible && (
                                <div className={`${chairStyles['feedback-block']} ${chairStyles['chair-content-block']}`}>
                                    <div className={chairStyles['feedback-header']}>
                                        <span className={`${chairStyles['feedback-icon']} ${isCorrect ? chairStyles.correct : chairStyles.incorrect}`}>
                                            {isCorrect ? '✓' : '✗'}
                                        </span>
                                        <span className={chairStyles['feedback-title']}>
                                            {isCorrect ? 'Correct!' : 'Not quite...'}
                                        </span>
                                    </div>
                                    <p className={chairStyles['feedback-body']}>
                                        {isCorrect ? currentQuestion.narratives.correct : currentQuestion.narratives.wrong}
                                    </p>

                                    {!isCorrect && (
                                        <div className={chairStyles['correct-answer-box']}>
                                            <p className={chairStyles['correct-label']}>✅ Correct answer</p>
                                            <p className={chairStyles['correct-answer-text']}>
                                                {currentQuestion.options[currentQuestion.correctIndex]}
                                            </p>
                                        </div>
                                    )}

                                    <p className={`${chairStyles['narrative-outcome']} ${isCorrect ? chairStyles['correct-narrative'] : chairStyles['wrong-narrative']}`}>
                                        {isCorrect ? currentQuestion.narratives.correct : currentQuestion.narratives.wrong}
                                    </p>

                                    <button onClick={nextQuestion} className={`${styles.primary} ${chairStyles['continue-btn']}`}>
                                        Continue
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </section>

                <aside className={chairStyles['chair-sidebar']}>
                    <div className={styles['panel-section']}>
                        <h3>Score</h3>
                        <p className={chairStyles['score-display']}>
                            {score} / {started ? shuffledQuestions.length : 0}
                        </p>
                    </div>
                    <div className={`${styles['panel-section']} ${chairStyles['fun-facts-section']} ${chairStyles['chair-fun-facts']}`}>
                        <h3>Did You Know? <span className={styles.help} title="Procedure & crisis committee facts.">?</span></h3>
                        <div className={`${styles['fun-fact']} ${chairStyles['chair-fun-fact']}`} onClick={() => setRandomFact(funFacts[Math.floor(Math.random() * funFacts.length)] || "Fun fact!")}>
                            <p className={`${styles['fun-fact-text']} ${chairStyles['chair-fun-fact-text']}`}>
                                {randomFact}
                            </p>
                        </div>
                    </div>
                </aside>
            </main>

            {/* Welcome Overlay */}
            {!started && !finished && (
                <div className={chairStyles['welcome-overlay']}>
                    <div className={chairStyles['welcome-card']}>
                        <h2>Chair{`'`}s Procedure Practice</h2>
                        <p>You will run a short committee session. At each step, choose how you would handle the situation. You{`'`}ll get feedback on procedure — the simulation continues either way.</p>
                        <label className={chairStyles['chair-question-count-label']}>
                            Number of questions
                            <select
                                className={chairStyles['chair-question-count-select']}
                                value={questionCount}
                                onChange={(e) => setQuestionCount(Number(e.target.value))}
                            >
                                <option value="5">5</option>
                                <option value="10">10</option>
                                <option value="15">15</option>
                                <option value="20">20</option>
                                <option value="25">25</option>
                                <option value="30">30</option>
                                <option value="35">35</option>
                                <option value="40">40</option>
                                <option value="45">45</option>
                                <option value="50">50</option>
                            </select>
                        </label>
                        <button onClick={startGame} className={`${styles.primary} ${chairStyles.primary}`}>Begin Session</button>
                    </div>
                </div>
            )}

            {/* End Overlay */}
            {finished && (
                <div className={chairStyles['welcome-overlay']}>
                    <div className={chairStyles['welcome-card']}>
                        <h2>Session Complete</h2>
                        <p className={chairStyles['end-message']}>
                            You scored {score} out of {shuffledQuestions.length} ({Math.round(score / shuffledQuestions.length * 100)}%).
                        </p>
                        <p className={chairStyles['end-note']}>
                            {score === shuffledQuestions.length
                                ? <span className={chairStyles['end-note-best']}>Perfect specific procedural mastery!</span>
                                : score > shuffledQuestions.length * 0.7
                                    ? <span className={chairStyles['end-note-best']}>Great chairing!</span>
                                    : <span className={chairStyles['end-note-try']}>Keep practicing your procedure!</span>
                            }
                        </p>
                        <div className={chairStyles['end-actions']}>
                            <button onClick={restartGame} className={`${styles.linkAsButton} ${styles.secondary}`}>Practice Again</button>
                            <Link href="/munsimulation" className={`${styles.linkAsButton} ${styles.primary}`}>Back to Delegate Sim</Link>
                        </div>
                    </div>
                </div>
            )}

            <footer className={`${styles['app-footer']} ${styles['procedure-links-footer']}`}>
                <h3>Official procedure resources</h3>
                <ul className={styles['procedure-links-list']}>
                    <li><a href="https://www.nmun.org/assets/documents/nmun-rules.pdf" target="_blank" rel="noopener noreferrer">NMUN Rules of Procedure (PDF)</a></li>
                    <li><a href="https://www.un.org/en/model-united-nations/rules-procedure" target="_blank" rel="noopener noreferrer">UN Model UN — Rules of Procedure</a></li>
                    <li><a href="https://bestdelegate.com/un4mun/" target="_blank" rel="noopener noreferrer">UN4MUN procedure (Best Delegate)</a></li>
                </ul>
            </footer>
        </div>
    );
}
