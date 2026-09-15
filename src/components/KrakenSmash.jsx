import { useState, useEffect, useRef, useCallback } from 'react';

// ============================================
// KONFIGURASI GAME
// ============================================
const HOLE_COUNT = 6; // 6 lubang (2 baris x 3 kolom)
const GAME_DURATION = 60; // 60 detik

// Tipe Kraken
const KRAKEN_TYPES = {
    normal: {
        name: 'normal',
        points: 10,
        duration: { min: 1200, max: 1800 },
        image: '/images/game6/kraken-biasa.png',
        probability: 60,
        color: '#4ade80',
    },
    fast: {
        name: 'fast',
        points: 30,
        duration: { min: 600, max: 900 },
        image: '/images/game6/kraken-biasa.png',
        probability: 20,
        color: '#f87171',
    },
    gold: {
        name: 'gold',
        points: 50,
        duration: { min: 1000, max: 1500 },
        image: '/images/game6/kraken-emas.png',
        probability: 10,
        color: '#facc15',
    },
    bomb: {
        name: 'bomb',
        points: -20,
        duration: { min: 1300, max: 1800 },
        image: '/images/game6/bom.png',
        probability: 10,
        color: '#1f2937',
    },
};

// ============================================
// KOMPONEN HOLE (LUBANG)
// ============================================
const Hole = ({ index, kraken, onHit }) => {
    const [isHit, setIsHit] = useState(false);
    const [hitEffect, setHitEffect] = useState(null);

    const handleClick = () => {
        if (!kraken || !kraken.isVisible || kraken.isHit) return;

        setIsHit(true);
        setHitEffect(kraken.type);

        onHit(index, kraken);

        setTimeout(() => {
            setIsHit(false);
            setHitEffect(null);
        }, 400);
    };

    const krakenVisible = kraken && kraken.isVisible && !kraken.isHit;

    return (
        <div className="relative w-full aspect-square">
            {/* Lubang kayu */}
            <div
                className="absolute inset-0 rounded-full cursor-pointer transition-transform duration-150 active:scale-95"
                onClick={handleClick}
                style={{
                    background: 'radial-gradient(ellipse at center, #0a0a0a 0%, #1a0f05 60%, #4a2c14 100%)',
                    boxShadow:
                        'inset 0 8px 20px rgba(0,0,0,0.9), inset 0 -4px 10px rgba(60,30,10,0.5), 0 4px 12px rgba(0,0,0,0.6), 0 0 0 6px #6b4423, 0 0 0 8px #3d2612',
                }}
            >
                <div
                    className="absolute inset-3 rounded-full"
                    style={{
                        background: 'radial-gradient(ellipse at center, #000000 0%, #0a0500 70%, #1a0a00 100%)',
                        boxShadow: 'inset 0 6px 15px rgba(0,0,0,1)',
                    }}
                />

                <div
                    className="absolute bottom-3 left-3 right-3 h-1/3 rounded-b-full opacity-40"
                    style={{
                        background: 'linear-gradient(to top, #0c4a6e 0%, transparent 100%)',
                        filter: 'blur(4px)',
                    }}
                />
            </div>

            {/* Tentakel Kraken */}
            {krakenVisible && (
                <div
                    className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
                    style={{
                        bottom: '15%',
                        zIndex: 10,
                        animation: 'krakenPop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    }}
                >
                    <img
                        src={kraken.type.image}
                        alt={kraken.type.name}
                        className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 object-contain select-none"
                        draggable={false}
                        style={{
                            filter: `drop-shadow(0 0 20px ${kraken.type.color})
                                     drop-shadow(0 0 35px ${kraken.type.color}80)`,
                            animation: 'krakenWiggle 0.8s ease-in-out infinite',
                        }}
                    />
                </div>
            )}

            {/* Efek hit */}
            {hitEffect && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-20">
                    <div
                        className="text-3xl sm:text-4xl md:text-5xl font-black animate-[hitPop_0.4s_ease-out_forwards]"
                        style={{
                            color: hitEffect === 'bomb' ? '#f87171' : '#facc15',
                            textShadow: '0 0 20px currentColor, 0 0 40px currentColor',
                        }}
                    >
                        {hitEffect === 'bomb' ? '-20' : `+${hitEffect.points}`}
                    </div>
                </div>
            )}
        </div>
    );
};

// ============================================
// KOMPONEN EFEK HIT TEXT
// ============================================
const FloatingText = ({ text, color, x, y }) => {
    return (
        <div
            className="fixed pointer-events-none font-black text-2xl sm:text-3xl z-[300]"
            style={{
                left: x,
                top: y,
                color,
                textShadow: '0 0 20px currentColor, 0 0 40px currentColor, 2px 2px 0 #000',
                animation: 'floatUp 0.8s ease-out forwards',
                transform: 'translate(-50%, 0)',
            }}
        >
            {text}
        </div>
    );
};

// ============================================
// KOMPONEN TUTORIAL MODAL
// ============================================
const TutorialModal = ({ isOpen, onClose }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => setIsVisible(true), 50);
        } else {
            setIsVisible(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div
            className={`fixed inset-0 z-[400] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md transition-opacity duration-500 ${
                isVisible ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={onClose}
        >
            <div
                className={`relative max-w-md w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-2xl transition-all duration-500 ${
                    isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                }`}
                style={{
                    background: 'linear-gradient(135deg, rgba(10, 40, 70, 0.98) 0%, rgba(5, 20, 40, 0.98) 100%)',
                    border: '2px solid rgba(56, 189, 248, 0.4)',
                    boxShadow: '0 0 50px rgba(56, 189, 248, 0.3)',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
                    onClick={onClose}
                >
                    <span className="material-symbols-outlined text-xl">close</span>
                </button>

                <div className="text-center mb-6">
                    <h3
                        className="font-display-hero text-2xl sm:text-3xl font-black text-cyan-400 mb-2"
                        style={{ textShadow: '0 0 20px rgba(56, 189, 248, 0.6)' }}
                    >
                        Cara Bermain
                    </h3>
                    <p className="text-white/60 text-xs sm:text-sm">Pukul Kraken sebelum dia kabur!</p>
                </div>

                <div className="space-y-4">
                    <div className="p-4 rounded-xl" style={{ background: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                        <div className="flex items-start gap-3">
                            <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm" style={{ background: 'linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%)', color: 'white' }}>1</div>
                            <div className="flex-1">
                                <h4 className="text-cyan-400 font-bold text-sm mb-1">Tujuan</h4>
                                <p className="text-white/70 text-xs sm:text-sm leading-relaxed">
                                    Pukul tentakel Kraken yang muncul dari <span className="text-cyan-400 font-bold">6 lubang</span> dalam <span className="text-cyan-400 font-bold">60 detik</span>!
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 rounded-xl" style={{ background: 'rgba(250, 204, 21, 0.08)', border: '1px solid rgba(250, 204, 21, 0.2)' }}>
                        <div className="flex items-start gap-3">
                            <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm" style={{ background: 'linear-gradient(135deg, #facc15 0%, #a16207 100%)', color: '#1a120e' }}>2</div>
                            <div className="flex-1">
                                <h4 className="text-yellow-400 font-bold text-sm mb-1">Jenis Kraken</h4>
                                <ul className="text-white/70 text-xs sm:text-sm leading-relaxed space-y-1.5">
                                    <li className="flex items-start gap-2"><span className="text-green-400">🟢</span><span>Kraken biasa: <span className="text-yellow-400 font-bold">+10</span></span></li>
                                    <li className="flex items-start gap-2"><span className="text-red-400">🔴</span><span>Kraken cepat: <span className="text-yellow-400 font-bold">+30</span></span></li>
                                    <li className="flex items-start gap-2"><span className="text-yellow-400">🟡</span><span>Kraken emas: <span className="text-yellow-400 font-bold">+50</span></span></li>
                                    <li className="flex items-start gap-2"><span>⚫</span><span>Bom (jangan dipukul!): <span className="text-red-400 font-bold">-20</span></span></li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 rounded-xl" style={{ background: 'rgba(34, 197, 94, 0.08)', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
                        <div className="flex items-start gap-3">
                            <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm" style={{ background: 'linear-gradient(135deg, #22C55E 0%, #15803D 100%)', color: 'white' }}>3</div>
                            <div className="flex-1">
                                <h4 className="text-green-400 font-bold text-sm mb-1">Combo</h4>
                                <p className="text-white/70 text-xs sm:text-sm leading-relaxed">
                                    Pukul berturut-turut untuk <span className="text-green-400 font-bold">combo bonus</span>!
                                    <br />
                                    <span className="text-xs opacity-80">x5 → +50 • x10 → +150 • kelipatan 10 → +250</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 rounded-xl" style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                        <div className="flex items-start gap-3">
                            <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm" style={{ background: 'linear-gradient(135deg, #ef4444 0%, #991b1b 100%)', color: 'white' }}>4</div>
                            <div className="flex-1">
                                <h4 className="text-red-400 font-bold text-sm mb-1">Combo Reset</h4>
                                <p className="text-white/70 text-xs sm:text-sm leading-relaxed">
                                    Combo akan <span className="text-red-400 font-bold">hilang</span> jika Kraken kabur tanpa dipukul atau kamu memukul bom!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <button
                    onClick={onClose}
                    className="w-full mt-6 px-6 py-3 rounded-xl font-bold text-sm transition-all hover:scale-105 active:scale-95"
                    style={{
                        background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
                        color: 'white',
                        boxShadow: '0 4px 15px rgba(56, 189, 248, 0.4)',
                    }}
                >
                    Siap Bermain!
                </button>
            </div>
        </div>
    );
};

// ============================================
// KOMPONEN GAME UTAMA
// ============================================
const KrakenSmash = ({ onExit }) => {
    const [gameState, setGameState] = useState('idle');
    const [holes, setHoles] = useState(Array(HOLE_COUNT).fill(null));
    const [score, setScore] = useState(0);
    const [combo, setCombo] = useState(0);
    const [maxCombo, setMaxCombo] = useState(0);
    const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
    const [showTutorial, setShowTutorial] = useState(false);
    const [showResetConfirm, setShowResetConfirm] = useState(false);
    const [floatingTexts, setFloatingTexts] = useState([]);
    const [comboPopup, setComboPopup] = useState(null);

    const hitSoundRef = useRef(null);
    const goldSoundRef = useRef(null);
    const bombSoundRef = useRef(null);
    const escapeSoundRef = useRef(null);
    const winSoundRef = useRef(null);
    const bgMusicRef = useRef(null);
    const comboSoundRef = useRef(null);

    const gameLoopRef = useRef(null);
    const timerRef = useRef(null);
    const holesRef = useRef(holes);
    const comboRef = useRef(combo);

    useEffect(() => { holesRef.current = holes; }, [holes]);
    useEffect(() => { comboRef.current = combo; }, [combo]);

    // Inisialisasi audio
    useEffect(() => {
        hitSoundRef.current = new Audio('/sounds/hit.mp3');
        goldSoundRef.current = new Audio('/sounds/coin.mp3');
        bombSoundRef.current = new Audio('/sounds/boom.mp3');
        escapeSoundRef.current = new Audio('/sounds/miss.mp3');
        winSoundRef.current = new Audio('/sounds/win.mp3');
        comboSoundRef.current = new Audio('/sounds/combo.mp3');
        bgMusicRef.current = new Audio('/sounds/music-game.mp3');
        bgMusicRef.current.loop = true;
        bgMusicRef.current.volume = 0.45;

        if (hitSoundRef.current) hitSoundRef.current.volume = 0.6;
        if (goldSoundRef.current) goldSoundRef.current.volume = 0.7;
        if (bombSoundRef.current) bombSoundRef.current.volume = 0.7;
        if (escapeSoundRef.current) escapeSoundRef.current.volume = 0.5;
        if (winSoundRef.current) winSoundRef.current.volume = 0.6;
        if (comboSoundRef.current) comboSoundRef.current.volume = 0.7;

        return () => {
            [hitSoundRef, goldSoundRef, bombSoundRef, escapeSoundRef, winSoundRef, comboSoundRef, bgMusicRef].forEach(ref => {
                if (ref.current) {
                    ref.current.pause();
                    ref.current.currentTime = 0;
                }
            });
        };
    }, []);

    useEffect(() => {
        if (!bgMusicRef.current) return;

        if (gameState === 'playing') {
            bgMusicRef.current.play().catch(() => {});
        } else {
            bgMusicRef.current.pause();
            bgMusicRef.current.currentTime = 0;
        }
    }, [gameState]);

    const playSound = (ref) => {
        if (ref.current) {
            try {
                ref.current.currentTime = 0;
                ref.current.play().catch(() => {});
            } catch (e) {}
        }
    };

    const addFloatingText = (text, color, event) => {
        const id = Date.now() + Math.random();
        const x = event?.clientX || window.innerWidth / 2;
        const y = event?.clientY || window.innerHeight / 2;

        setFloatingTexts(prev => [...prev, { id, text, color, x, y }]);

        setTimeout(() => {
            setFloatingTexts(prev => prev.filter(t => t.id !== id));
        }, 800);
    };

    const pickRandomKrakenType = () => {
        const rand = Math.random() * 100;
        let cumulative = 0;

        const entries = Object.values(KRAKEN_TYPES);
        for (const type of entries) {
            cumulative += type.probability;
            if (rand <= cumulative) return type;
        }
        return KRAKEN_TYPES.normal;
    };

    const pickRandomEmptyHole = () => {
        const emptyHoles = [];
        holesRef.current.forEach((h, i) => {
            if (!h || !h.isVisible) emptyHoles.push(i);
        });
        if (emptyHoles.length === 0) return -1;
        return emptyHoles[Math.floor(Math.random() * emptyHoles.length)];
    };

    const spawnKraken = useCallback(() => {
        if (gameState !== 'playing') return;

        const holeIndex = pickRandomEmptyHole();
        if (holeIndex === -1) return;

        const type = pickRandomKrakenType();
        const duration = type.duration.min + Math.random() * (type.duration.max - type.duration.min);

        const newKraken = {
            id: Date.now() + Math.random(),
            type,
            isVisible: true,
            isHit: false,
        };

        setHoles(prev => {
            const next = [...prev];
            next[holeIndex] = newKraken;
            return next;
        });

        setTimeout(() => {
            setHoles(prev => {
                const target = prev[holeIndex];
                if (!target || target.id !== newKraken.id || target.isHit) {
                    return prev;
                }

                if (type.name !== 'bomb') {
                    setCombo(0);
                    playSound(escapeSoundRef);
                }

                const next = [...prev];
                next[holeIndex] = null;
                return next;
            });
        }, duration);
    }, [gameState]);

    useEffect(() => {
        if (gameState !== 'playing') return;

        const getSpawnInterval = () => {
            const elapsed = GAME_DURATION - timeLeft;
            const baseInterval = 1100;
            const minInterval = 400;
            const reduction = (elapsed / GAME_DURATION) * (baseInterval - minInterval);
            return Math.max(minInterval, baseInterval - reduction);
        };

        const tick = () => {
            spawnKraken();
            const nextInterval = getSpawnInterval() + Math.random() * 300;
            gameLoopRef.current = setTimeout(tick, nextInterval);
        };

        gameLoopRef.current = setTimeout(tick, 300);

        return () => {
            if (gameLoopRef.current) clearTimeout(gameLoopRef.current);
        };
    }, [gameState, spawnKraken, timeLeft]);

    useEffect(() => {
        if (gameState !== 'playing') return;

        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    if (bgMusicRef.current) bgMusicRef.current.pause();
                    playSound(winSoundRef);
                    setGameState('won');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [gameState]);

    const initGame = () => {
        setHoles(Array(HOLE_COUNT).fill(null));
        setScore(0);
        setCombo(0);
        setMaxCombo(0);
        setTimeLeft(GAME_DURATION);
        setFloatingTexts([]);
        setComboPopup(null);
        setGameState('playing');
    };

    const handleHit = (holeIndex, kraken, event) => {
        if (gameState !== 'playing') return;

        const type = kraken.type;

        setHoles(prev => {
            const next = [...prev];
            if (next[holeIndex] && next[holeIndex].id === kraken.id) {
                next[holeIndex] = { ...next[holeIndex], isHit: true, isVisible: false };
            }
            return next;
        });

        setTimeout(() => {
            setHoles(prev => {
                const next = [...prev];
                if (next[holeIndex] && next[holeIndex].id === kraken.id) {
                    next[holeIndex] = null;
                }
                return next;
            });
        }, 200);

        if (type.name === 'bomb') {
            playSound(bombSoundRef);
            setScore(prev => Math.max(0, prev + type.points));
            setCombo(0);
            addFloatingText(`${type.points}`, '#f87171', event);
        } else {
            if (type.name === 'gold') {
                playSound(goldSoundRef);
            } else {
                playSound(hitSoundRef);
            }

            const newCombo = comboRef.current + 1;
            setCombo(newCombo);
            setMaxCombo(prev => Math.max(prev, newCombo));

            let bonus = 0;
            if (newCombo === 5) bonus = 50;
            else if (newCombo === 10) bonus = 150;
            else if (newCombo > 0 && newCombo % 10 === 0) bonus = 250;

            const totalPoints = type.points + bonus;
            setScore(prev => prev + totalPoints);

            addFloatingText(`+${type.points}`, type.color, event);

            if (bonus > 0) {
                setComboPopup({ combo: newCombo, bonus });
                playSound(comboSoundRef);
                setTimeout(() => setComboPopup(null), 1500);
            }
        }
    };

    const confirmExit = () => {
        setShowResetConfirm(false);
        if (bgMusicRef.current) {
            bgMusicRef.current.pause();
            bgMusicRef.current.currentTime = 0;
        }
        if (gameLoopRef.current) clearTimeout(gameLoopRef.current);
        if (timerRef.current) clearInterval(timerRef.current);
        if (onExit) onExit();
    };

    useEffect(() => {
        return () => {
            if (gameLoopRef.current) clearTimeout(gameLoopRef.current);
            if (timerRef.current) clearInterval(timerRef.current);
            [hitSoundRef, goldSoundRef, bombSoundRef, escapeSoundRef, winSoundRef, comboSoundRef, bgMusicRef].forEach(ref => {
                if (ref.current) {
                    ref.current.pause();
                    ref.current.currentTime = 0;
                }
            });
        };
    }, []);

    return (
        <div className="w-full flex flex-col items-center gap-6">
            {/* CSS */}
            <style dangerouslySetInnerHTML={{
                __html: `
                    @keyframes krakenPop {
                        0% { transform: translateY(100%) scale(0.5); opacity: 0; }
                        60% { transform: translateY(-10%) scale(1.1); opacity: 1; }
                        100% { transform: translateY(0%) scale(1); opacity: 1; }
                    }
                    @keyframes krakenWiggle {
                        0%, 100% { transform: rotate(-3deg); }
                        50% { transform: rotate(3deg); }
                    }
                    @keyframes hitPop {
                        0% { transform: scale(0.5); opacity: 0; }
                        50% { transform: scale(1.3); opacity: 1; }
                        100% { transform: scale(1); opacity: 0; }
                    }
                    @keyframes floatUp {
                        0% { transform: translate(-50%, 0) scale(0.8); opacity: 0; }
                        20% { transform: translate(-50%, -20px) scale(1.2); opacity: 1; }
                        100% { transform: translate(-50%, -80px) scale(1); opacity: 0; }
                    }
                    @keyframes float {
                        0%, 100% { transform: translateY(0px); }
                        50% { transform: translateY(-15px); }
                    }
                    @keyframes zoom-in {
                        0% { transform: scale(0.5); opacity: 0; }
                        100% { transform: scale(1); opacity: 1; }
                    }
                    @keyframes comboBounce {
                        0% { transform: scale(0.5) rotate(-10deg); opacity: 0; }
                        40% { transform: scale(1.3) rotate(5deg); opacity: 1; }
                        60% { transform: scale(1) rotate(-2deg); opacity: 1; }
                        100% { transform: scale(1.2) rotate(0deg); opacity: 0; }
                    }
                    @keyframes waveMove {
                        0%, 100% { transform: translateX(0); }
                        50% { transform: translateX(-20px); }
                    }
                    .combo-popup {
                        animation: comboBounce 1.5s ease-out forwards;
                    }
                `
            }} />

            {/* Floating Texts */}
            {floatingTexts.map(ft => (
                <FloatingText key={ft.id} text={ft.text} color={ft.color} x={ft.x} y={ft.y} />
            ))}

            {/* Combo Popup */}
            {comboPopup && (
                <div className="fixed inset-0 z-[300] flex items-center justify-center pointer-events-none">
                    <div className="combo-popup text-center">
                        <div
                            className="text-5xl sm:text-6xl md:text-7xl font-black text-orange-400"
                            style={{
                                textShadow: '0 0 30px #ff6b00, 0 0 60px #ff4500, 4px 4px 0 #7c2d12',
                                transform: 'rotate(-5deg)',
                            }}
                        >
                            COMBO x{comboPopup.combo}
                        </div>
                        <div
                            className="text-3xl sm:text-4xl md:text-5xl font-black text-yellow-300 mt-2"
                            style={{
                                textShadow: '0 0 20px #facc15, 0 0 40px #eab308, 3px 3px 0 #7c2d12',
                            }}
                        >
                            +{comboPopup.bonus} BONUS!
                        </div>
                    </div>
                </div>
            )}

            {/* Tutorial Modal */}
            <TutorialModal isOpen={showTutorial} onClose={() => setShowTutorial(false)} />

            {/* Header Stats */}
            {gameState === 'playing' && (
                <div className="w-full max-w-md flex items-center justify-between gap-4 p-4 rounded-xl"
                    style={{
                        background: 'linear-gradient(135deg, rgba(12, 74, 110, 0.3) 0%, rgba(2, 6, 23, 0.3) 100%)',
                        border: '1px solid rgba(56, 189, 248, 0.3)',
                    }}
                >
                    <div className="flex flex-col items-start gap-1">
                        <span className="text-[10px] sm:text-xs text-cyan-400/80 uppercase tracking-wider font-bold">
                            Skor
                        </span>
                        <span className="text-xl sm:text-2xl font-black text-yellow-400"
                            style={{ textShadow: '0 0 10px rgba(255, 215, 0, 0.6)' }}
                        >
                            {score}
                        </span>
                    </div>

                    <div className="flex flex-col items-center">
                        <span className="text-[10px] sm:text-xs text-cyan-400/80 uppercase tracking-wider font-bold">
                            Combo
                        </span>
                        <span className={`text-xl sm:text-2xl font-black ${combo >= 5 ? 'text-orange-400' : 'text-white'}`}
                            style={{ textShadow: combo >= 5 ? '0 0 10px rgba(251, 146, 60, 0.6)' : 'none' }}
                        >
                            x{combo}
                        </span>
                    </div>

                    <div className="flex flex-col items-end">
                        <span className="text-[10px] sm:text-xs text-cyan-400/80 uppercase tracking-wider font-bold">
                            Waktu
                        </span>
                        <span className={`text-xl sm:text-2xl font-black ${timeLeft <= 10 ? 'text-red-400 animate-pulse' : 'text-cyan-300'}`}
                            style={{ textShadow: timeLeft <= 10 ? '0 0 10px rgba(255, 0, 0, 0.6)' : '0 0 10px rgba(56, 189, 248, 0.6)' }}
                        >
                            {timeLeft}s
                        </span>
                    </div>
                </div>
            )}

            {/* Area Grid / Idle Screen */}
            {gameState === 'idle' ? (
                <div className="w-full max-w-md flex flex-col items-center gap-4 sm:gap-6 pt-2">
                    {/* Logo */}
                    <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48">
                        <div className="absolute inset-0 rounded-full animate-pulse"
                            style={{
                                background: 'radial-gradient(circle, rgba(56, 189, 248, 0.5) 0%, transparent 70%)',
                                filter: 'blur(20px)',
                                transform: 'scale(1.4)',
                            }} />
                        <img
                            src="/images/assets/game6.png"
                            alt="Kraken Smash"
                            className="relative w-full h-full object-contain animate-[float_3s_ease-in-out_infinite] rounded-[22%]"
                            style={{ filter: 'drop-shadow(0 0 30px rgba(56, 189, 248, 0.8))' }}
                        />
                    </div>

                    <div className="text-center">
                        <p className="text-white/70 text-sm sm:text-base max-w-sm mx-auto leading-relaxed">
                            Pukul <span className="text-cyan-400 font-bold">tentakel Kraken</span> yang muncul dari lubang!
                            <br />
                            Hati-hati dengan <span className="text-red-400 font-bold">bom</span>!
                            <br />
                            <span className="text-cyan-400 font-bold">60 detik</span> untuk skor tertinggi!
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto px-4">
                        <button onClick={() => setShowTutorial(true)}
                            className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-base transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                            style={{
                                background: 'linear-gradient(135deg, rgba(139, 69, 19, 0.8) 0%, rgba(93, 64, 55, 0.8) 100%)',
                                color: '#FFD700',
                                border: '2px solid rgba(255, 215, 0, 0.4)',
                                boxShadow: '0 4px 15px rgba(139, 69, 19, 0.4)',
                            }}>
                            <span className="material-symbols-outlined text-xl">menu_book</span>
                            <span>Tutorial</span>
                        </button>
                        <button onClick={initGame}
                            className="w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-base transition-all hover:scale-105 active:scale-95"
                            style={{
                                background: 'linear-gradient(135deg, #FFD700 0%, #DAA520 100%)',
                                color: '#1a120e',
                                boxShadow: '0 4px 20px rgba(255, 215, 0, 0.5)',
                            }}>
                            Mulai Bermain
                        </button>
                    </div>
                </div>
            ) : (
                <div className="w-full max-w-md">
                    {/* Arena */}
                    <div
                        className="relative rounded-2xl p-4 sm:p-6"
                        style={{
                            background: 'linear-gradient(180deg, #0c4a6e 0%, #082f49 100%)',
                            border: '3px solid #6b4423',
                            boxShadow: 'inset 0 0 40px rgba(0, 0, 0, 0.7), 0 8px 30px rgba(0, 0, 0, 0.5), 0 0 0 6px #3d2612',
                        }}
                    >
                        {/* Ombak */}
                        <div
                            className="absolute top-0 left-0 right-0 h-8 rounded-t-2xl overflow-hidden"
                            style={{
                                background: 'linear-gradient(180deg, rgba(56, 189, 248, 0.4) 0%, transparent 100%)',
                            }}
                        >
                            <div
                                className="absolute inset-0"
                                style={{
                                    background: 'repeating-linear-gradient(90deg, transparent 0%, rgba(56, 189, 248, 0.3) 50%, transparent 100%)',
                                    animation: 'waveMove 3s ease-in-out infinite',
                                }}
                            />
                        </div>

                        {/* Grid Lubang */}
                        <div className="grid grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                            {holes.map((kraken, index) => (
                                <Hole
                                    key={index}
                                    index={index}
                                    kraken={kraken}
                                    onHit={handleHit}
                                />
                            ))}
                        </div>

                        {/* Dekorasi bawah */}
                        <div
                            className="absolute bottom-0 left-0 right-0 h-3 rounded-b-2xl"
                            style={{
                                background: 'linear-gradient(180deg, transparent 0%, #3d2612 100%)',
                            }}
                        />
                    </div>
                </div>
            )}

            {/* Tombol Exit */}
            {gameState === 'playing' && (
                <button
                    onClick={() => setShowResetConfirm(true)}
                    className="px-6 py-2 rounded-lg text-sm text-white/60 hover:text-white transition-all hover:bg-white/10 border border-white/20"
                >
                    ← Keluar Game
                </button>
            )}

            {/* Modal Selesai */}
            {gameState === 'won' && (
                <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div
                        className="relative max-w-md w-full p-6 sm:p-8 rounded-2xl text-center animate-[zoom-in_0.5s_ease-out]"
                        style={{
                            background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.15) 0%, rgba(14, 165, 233, 0.1) 100%)',
                            border: '2px solid rgba(56, 189, 248, 0.5)',
                            boxShadow: '0 0 50px rgba(56, 189, 248, 0.4)',
                        }}
                    >
                        <img
                            src="/images/assets/game6.png"
                            alt="Selesai"
                            className="w-24 h-24 sm:w-32 sm:h-32 mx-auto object-contain mb-4 animate-bounce"
                            style={{ filter: 'drop-shadow(0 0 25px rgba(56, 189, 248, 0.9))' }}
                        />
                        <h3 className="font-display-hero text-3xl sm:text-4xl font-black text-cyan-400 mb-2"
                            style={{ textShadow: '0 0 20px rgba(56, 189, 248, 0.8)' }}
                        >
                            TIME'S UP!
                        </h3>
                        <p className="text-white/80 text-sm sm:text-base mb-4">
                            Sesi 1 menit selesai! 🎉
                        </p>
                        <div className="grid grid-cols-2 gap-2 mb-6">
                            <div className="py-3 px-4 rounded-lg bg-cyan-500/10 border border-cyan-500/30 inline-block">
                                <span className="text-xs text-cyan-400/80 uppercase tracking-wider font-bold block">
                                    Skor Akhir
                                </span>
                                <span className="text-2xl sm:text-3xl font-black text-cyan-400">
                                    {score}
                                </span>
                            </div>
                            <div className="py-3 px-4 rounded-lg bg-orange-500/10 border border-orange-500/30 inline-block">
                                <span className="text-xs text-orange-400/80 uppercase tracking-wider font-bold block">
                                    Max Combo
                                </span>
                                <span className="text-2xl sm:text-3xl font-black text-orange-400">
                                    x{maxCombo}
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <button
                                onClick={initGame}
                                className="px-6 py-3 rounded-xl font-bold transition-all hover:scale-105 active:scale-95"
                                style={{
                                    background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
                                    color: 'white',
                                    boxShadow: '0 4px 15px rgba(56, 189, 248, 0.4)',
                                }}
                            >
                                Main Lagi
                            </button>
                            <button
                                onClick={confirmExit}
                                className="px-6 py-3 rounded-xl font-bold transition-all hover:scale-105 active:scale-95 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 border border-white/20"
                            >
                                Keluar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Konfirmasi Exit */}
            {showResetConfirm && (
                <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div
                        className="relative max-w-sm w-full p-6 rounded-2xl text-center"
                        style={{
                            background: 'linear-gradient(135deg, rgba(30, 30, 30, 0.95) 0%, rgba(20, 20, 20, 0.95) 100%)',
                            border: '1px solid rgba(56, 189, 248, 0.3)',
                        }}
                    >
                        <h3 className="text-xl font-bold text-white mb-3">Keluar dari Game?</h3>
                        <p className="text-white/60 text-sm mb-6">Progress saat ini akan hilang.</p>
                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={() => setShowResetConfirm(false)}
                                className="px-5 py-2 rounded-lg text-sm font-bold transition-all hover:scale-105 bg-white/10 hover:bg-white/20 text-white border border-white/20"
                            >
                                Batal
                            </button>
                            <button
                                onClick={confirmExit}
                                className="px-5 py-2 rounded-lg text-sm font-bold transition-all hover:scale-105"
                                style={{
                                    background: 'linear-gradient(135deg, #DC2626 0%, #991B1B 100%)',
                                    color: 'white',
                                }}
                            >
                                Ya, Keluar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default KrakenSmash;