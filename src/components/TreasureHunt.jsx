import { useState, useEffect, useRef } from 'react';

// ============================================
// KONFIGURASI GAME
// ============================================
const GRID_SIZE = 4;
const TOTAL_BOXES = GRID_SIZE * GRID_SIZE;
const TOTAL_BOMBS = 6;
const TOTAL_TREASURE = 1;
const MAX_LIVES = 3;

// ============================================
// KOMPONEN HEART (NYAWA)
// ============================================
const Heart = ({ isActive }) => {
    return (
        <img
            src="/images/game1/nyawa.png"
            alt={isActive ? "Nyawa" : "Nyawa Hilang"}
            className={`w-7 h-7 sm:w-9 sm:h-9 object-contain transition-all duration-300 ${
                isActive 
                    ? 'scale-100 opacity-100' 
                    : 'scale-75 opacity-30 grayscale'
            }`}
            style={{
                filter: isActive 
                    ? 'drop-shadow(0 0 8px rgba(255, 0, 0, 0.9)) drop-shadow(0 0 15px rgba(255, 100, 100, 0.5))' 
                    : 'none',
            }}
        />
    );
};

// ============================================
// KOMPONEN KOTAK
// ============================================
const Box = ({ index, content, isFlipped, onFlip, disabled }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <button
            onClick={() => !disabled && !isFlipped && onFlip(index)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            disabled={disabled || isFlipped}
            className={`
                relative aspect-square rounded-lg transition-all duration-300
                ${isFlipped 
                    ? content === 'bomb' 
                        ? 'bg-red-900/50 border-2 border-red-500' 
                        : content === 'treasure'
                            ? 'bg-yellow-900/50 border-2 border-yellow-500'
                            : 'bg-stone-700/50 border-2 border-stone-500'
                    : 'cursor-pointer'
                }
                ${!isFlipped && !disabled ? 'hover:scale-105 active:scale-95' : ''}
            `}
            style={{
                perspective: '1000px',
                transformStyle: 'preserve-3d',
            }}
        >
            <div
                className="relative w-full h-full transition-transform duration-500"
                style={{
                    transformStyle: 'preserve-3d',
                    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}
            >
                {/* Sisi Depan (Belum dibuka) - Peti Kayu */}
                <div
                    className="absolute inset-0 rounded-lg flex items-center justify-center"
                    style={{
                        backfaceVisibility: 'hidden',
                        background: 'linear-gradient(135deg, #8B4513 0%, #654321 50%, #3E2723 100%)',
                        boxShadow: 'inset 0 2px 4px rgba(255, 255, 255, 0.2), inset 0 -2px 4px rgba(0, 0, 0, 0.3), 0 4px 8px rgba(0, 0, 0, 0.4)',
                        border: '2px solid #5D4037',
                    }}
                >
                    <div className="absolute inset-2 border-2 border-yellow-700/50 rounded-sm"></div>
                    <span 
                        className={`font-bold text-yellow-400 text-2xl sm:text-3xl md:text-4xl transition-transform duration-300 ${isHovered ? 'scale-125' : ''}`}
                        style={{
                            textShadow: '0 0 10px rgba(255, 215, 0, 0.8), 0 2px 4px rgba(0,0,0,0.5)',
                        }}
                    >
                        ?
                    </span>
                </div>

                {/* Sisi Belakang (Sudah dibuka) */}
                <div
                    className="absolute inset-0 rounded-lg flex items-center justify-center overflow-hidden"
                    style={{
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                    }}
                >
                    {content === 'bomb' && (
                        <div className="relative w-full h-full flex items-center justify-center p-2"
                            style={{
                                background: 'radial-gradient(circle, #7f1d1d 0%, #450a0a 100%)',
                            }}
                        >
                            <img
                                src="/images/game1/bom.png"
                                alt="Bom"
                                className="w-full h-full object-contain animate-[pulse_1s_ease-in-out_infinite]"
                            />
                        </div>
                    )}
                    {content === 'treasure' && (
                        <div className="relative w-full h-full flex items-center justify-center p-2"
                            style={{
                                background: 'radial-gradient(circle, #78350f 0%, #451a03 100%)',
                            }}
                        >
                            <img
                                src="/images/game1/HartaKarun.png"
                                alt="Harta Karun"
                                className="w-full h-full object-contain animate-[bounce_1s_ease-in-out_infinite]"
                                style={{
                                    filter: 'drop-shadow(0 0 20px rgba(255, 215, 0, 0.8))',
                                }}
                            />
                        </div>
                    )}
                    {content === 'empty' && (
                        <div className="relative w-full h-full flex items-center justify-center"
                            style={{
                                background: 'radial-gradient(circle, #44403c 0%, #1c1917 100%)',
                            }}
                        >
                            <img
                                src="/images/game1/coins.png"
                                alt="Kosong"
                                className="w-1/2 h-1/2 object-contain opacity-30"
                            />
                        </div>
                    )}
                </div>
            </div>
        </button>
    );
};

// ============================================
// KOMPONEN EFEK BOOM
// ============================================
const BoomEffect = ({ isActive, onComplete }) => {
    useEffect(() => {
        if (isActive) {
            const timer = setTimeout(() => {
                if (onComplete) onComplete();
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [isActive, onComplete]);

    if (!isActive) return null;

    return (
        <div className="fixed inset-0 z-[300] pointer-events-none flex items-center justify-center">
            <div 
                className="absolute inset-0 animate-[flash-red_1.5s_ease-out_forwards]"
                style={{
                    background: 'radial-gradient(circle, rgba(220, 38, 38, 0.85) 0%, rgba(127, 29, 29, 0.95) 100%)',
                }}
            />

            <div 
                className="relative z-10 animate-[boom-zoom_1.5s_ease-out_forwards]"
            >
                <h1 
                    className="font-display-hero text-[80px] sm:text-[120px] md:text-[180px] font-black text-white"
                    style={{
                        textShadow: '0 0 20px #FFD700, 0 0 40px #FF4500, 0 0 60px #FF0000, 0 8px 0 #7f1d1d',
                        letterSpacing: '4px',
                        transform: 'rotate(-5deg)',
                    }}
                >
                    BOOM!
                </h1>
            </div>

            <img
                src="/images/game1/bom.png"
                alt="Boom"
                className="absolute w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 object-contain animate-[explode_1.5s_ease-out_forwards]"
                style={{
                    filter: 'drop-shadow(0 0 30px rgba(255, 100, 0, 1))',
                }}
            />

            <style dangerouslySetInnerHTML={{
                __html: `
                    @keyframes flash-red {
                        0% { opacity: 0; }
                        8% { opacity: 1; }
                        16% { opacity: 0.6; }
                        24% { opacity: 1; }
                        40% { opacity: 0.8; }
                        100% { opacity: 0; }
                    }
                    @keyframes boom-zoom {
                        0% { transform: scale(0.3) rotate(-5deg); opacity: 0; }
                        15% { transform: scale(1.3) rotate(-5deg); opacity: 1; }
                        30% { transform: scale(1) rotate(-5deg); opacity: 1; }
                        75% { transform: scale(1) rotate(-5deg); opacity: 1; }
                        100% { transform: scale(1.5) rotate(-5deg); opacity: 0; }
                    }
                    @keyframes explode {
                        0% { transform: scale(0.5); opacity: 0; }
                        20% { transform: scale(1.5); opacity: 1; }
                        100% { transform: scale(3); opacity: 0; }
                    }
                `
            }} />
        </div>
    );
};

// ============================================
// KOMPONEN MODAL TUTORIAL
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
            className={`fixed inset-0 z-[260] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md transition-opacity duration-500 ${
                isVisible ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={onClose}
        >
            <div
                className={`relative max-w-md w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-2xl transition-all duration-500 ${
                    isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                }`}
                style={{
                    background: 'linear-gradient(135deg, rgba(30, 25, 20, 0.98) 0%, rgba(20, 15, 10, 0.98) 100%)',
                    border: '2px solid rgba(255, 215, 0, 0.4)',
                    boxShadow: '0 0 50px rgba(255, 215, 0, 0.3)',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Tombol Close */}
                <button
                    className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
                    onClick={onClose}
                >
                    <span className="material-symbols-outlined text-xl">close</span>
                </button>

                {/* Header */}
                <div className="text-center mb-6">
                    <h3 
                        className="font-display-hero text-2xl sm:text-3xl font-black text-yellow-400 mb-2"
                        style={{ textShadow: '0 0 20px rgba(255, 215, 0, 0.6)' }}
                    >
                        Cara Bermain
                    </h3>
                    <p className="text-white/60 text-xs sm:text-sm">
                        Baca dulu sebelum bertualang!
                    </p>
                </div>

                {/* Content */}
                <div className="space-y-4">
                    {/* Tujuan */}
                    <div 
                        className="p-4 rounded-xl"
                        style={{
                            background: 'rgba(255, 215, 0, 0.08)',
                            border: '1px solid rgba(255, 215, 0, 0.2)',
                        }}
                    >
                        <div className="flex items-start gap-3">
                            <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
                                style={{
                                    background: 'linear-gradient(135deg, #FFD700 0%, #DAA520 100%)',
                                    color: '#1a120e',
                                }}
                            >
                                1
                            </div>
                            <div className="flex-1">
                                <h4 className="text-yellow-400 font-bold text-sm mb-1">
                                    Tujuan Permainan
                                </h4>
                                <p className="text-white/70 text-xs sm:text-sm leading-relaxed">
                                    Temukan <span className="text-yellow-400 font-bold">1 harta karun</span> yang tersembunyi 
                                    di antara <span className="text-red-400 font-bold">6 bom</span> dalam grid 4x4.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Nyawa */}
                    <div 
                        className="p-4 rounded-xl"
                        style={{
                            background: 'rgba(220, 38, 38, 0.08)',
                            border: '1px solid rgba(220, 38, 38, 0.2)',
                        }}
                    >
                        <div className="flex items-start gap-3">
                            <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
                                style={{
                                    background: 'linear-gradient(135deg, #DC2626 0%, #991B1B 100%)',
                                    color: 'white',
                                }}
                            >
                                2
                            </div>
                            <div className="flex-1">
                                <h4 className="text-red-400 font-bold text-sm mb-1">
                                    Nyawa
                                </h4>
                                <p className="text-white/70 text-xs sm:text-sm leading-relaxed">
                                    Kamu punya <span className="text-red-400 font-bold">3 nyawa</span>. Setiap membuka bom 
                                    akan mengurangi 1 nyawa. Jika nyawa habis, game over!
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Cara Main */}
                    <div 
                        className="p-4 rounded-xl"
                        style={{
                            background: 'rgba(139, 69, 19, 0.15)',
                            border: '1px solid rgba(139, 69, 19, 0.3)',
                        }}
                    >
                        <div className="flex items-start gap-3">
                            <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
                                style={{
                                    background: 'linear-gradient(135deg, #8B4513 0%, #5D4037 100%)',
                                    color: 'white',
                                }}
                            >
                                3
                            </div>
                            <div className="flex-1">
                                <h4 className="text-yellow-600 font-bold text-sm mb-1">
                                    Cara Bermain
                                </h4>
                                <ul className="text-white/70 text-xs sm:text-sm leading-relaxed space-y-1.5">
                                    <li className="flex items-start gap-2">
                                        <span className="text-yellow-400">•</span>
                                        <span>Klik kotak peti untuk membukanya</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-yellow-400">•</span>
                                        <span>Setiap kotak bisa berisi bom, harta, atau kosong</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-yellow-400">•</span>
                                        <span>Posisi bom & harta <span className="font-bold">acak</span> setiap game</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Skor */}
                    <div 
                        className="p-4 rounded-xl"
                        style={{
                            background: 'rgba(34, 197, 94, 0.08)',
                            border: '1px solid rgba(34, 197, 94, 0.2)',
                        }}
                    >
                        <div className="flex items-start gap-3">
                            <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
                                style={{
                                    background: 'linear-gradient(135deg, #22C55E 0%, #15803D 100%)',
                                    color: 'white',
                                }}
                            >
                                4
                            </div>
                            <div className="flex-1">
                                <h4 className="text-green-400 font-bold text-sm mb-1">
                                    Skor
                                </h4>
                                <ul className="text-white/70 text-xs sm:text-sm leading-relaxed space-y-1.5">
                                    <li className="flex items-start gap-2">
                                        <span className="text-green-400">•</span>
                                        <span>Dapat harta karun: <span className="text-yellow-400 font-bold">+100 poin</span></span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-green-400">•</span>
                                        <span>Kotak kosong: <span className="text-yellow-400 font-bold">+5 poin</span></span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-green-400">•</span>
                                        <span>Bom: <span className="text-red-400 font-bold">-1 nyawa</span></span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Button OK */}
                <button
                    onClick={onClose}
                    className="w-full mt-6 px-6 py-3 rounded-xl font-bold text-sm transition-all hover:scale-105 active:scale-95"
                    style={{
                        background: 'linear-gradient(135deg, #FFD700 0%, #DAA520 100%)',
                        color: '#1a120e',
                        boxShadow: '0 4px 15px rgba(255, 215, 0, 0.4)',
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
const TreasureHunt = ({ onExit }) => {
    const [gameState, setGameState] = useState('idle');
    const [boxes, setBoxes] = useState([]);
    const [flippedBoxes, setFlippedBoxes] = useState([]);
    const [lives, setLives] = useState(MAX_LIVES);
    const [score, setScore] = useState(0);
    const [showBoom, setShowBoom] = useState(false);
    const [showWinModal, setShowWinModal] = useState(false);
    const [showLoseModal, setShowLoseModal] = useState(false);
    const [showResetConfirm, setShowResetConfirm] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showTutorial, setShowTutorial] = useState(false);

    // Audio Refs
    const boomSoundRef = useRef(null);
    const coinSoundRef = useRef(null);
    const winSoundRef = useRef(null);
    const overSoundRef = useRef(null);
    const bgMusicRef = useRef(null);

    // ============================================
    // INISIALISASI AUDIO
    // ============================================
    useEffect(() => {
        boomSoundRef.current = new Audio('/sounds/boom.mp3');
        coinSoundRef.current = new Audio('/sounds/coin.mp3');
        winSoundRef.current = new Audio('/sounds/win.mp3');
        overSoundRef.current = new Audio('/sounds/over.mp3');
        
        bgMusicRef.current = new Audio('/sounds/music-game.mp3');
        bgMusicRef.current.loop = true;
        bgMusicRef.current.volume = 0.3;
        
        if (boomSoundRef.current) boomSoundRef.current.volume = 0.7;
        if (coinSoundRef.current) coinSoundRef.current.volume = 0.5;
        if (winSoundRef.current) winSoundRef.current.volume = 0.6;
        if (overSoundRef.current) overSoundRef.current.volume = 0.6;
    }, []);

    // ============================================
    // PLAY / PAUSE BACKSOUND GAME
    // ============================================
    useEffect(() => {
        if (!bgMusicRef.current) return;

        if (gameState === 'playing') {
            const playPromise = bgMusicRef.current.play();
            if (playPromise !== undefined) {
                playPromise.catch(() => {
                    console.log('Autoplay blocked for bg music');
                });
            }
        } else {
            bgMusicRef.current.pause();
            bgMusicRef.current.currentTime = 0;
        }

        return () => {
            if (bgMusicRef.current) {
                bgMusicRef.current.pause();
                bgMusicRef.current.currentTime = 0;
            }
        };
    }, [gameState]);

    // Cleanup saat keluar game
    useEffect(() => {
        return () => {
            if (bgMusicRef.current) {
                bgMusicRef.current.pause();
                bgMusicRef.current.currentTime = 0;
            }
        };
    }, []);

    // ============================================
    // SHUFFLE ARRAY
    // ============================================
    const shuffleArray = (array) => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    // ============================================
    // INISIALISASI GAME
    // ============================================
    const initGame = () => {
        const contents = [
            ...Array(TOTAL_BOMBS).fill('bomb'),
            ...Array(TOTAL_TREASURE).fill('treasure'),
            ...Array(TOTAL_BOXES - TOTAL_BOMBS - TOTAL_TREASURE).fill('empty'),
        ];

        const shuffled = shuffleArray(contents);

        const newBoxes = shuffled.map((content, index) => ({
            id: index,
            content,
            isFlipped: false,
        }));

        setBoxes(newBoxes);
        setFlippedBoxes([]);
        setLives(MAX_LIVES);
        setScore(0);
        setGameState('playing');
        setIsProcessing(false);
    };

    // ============================================
    // HANDLE FLIP BOX
    // ============================================
    const handleFlip = (index) => {
        if (gameState !== 'playing' || isProcessing) return;

        const box = boxes[index];
        if (box.isFlipped) return;

        const newBoxes = [...boxes];
        newBoxes[index].isFlipped = true;
        setBoxes(newBoxes);
        setFlippedBoxes(prev => [...prev, index]);

        if (box.content === 'bomb') {
            setIsProcessing(true);

            if (boomSoundRef.current) {
                boomSoundRef.current.currentTime = 0;
                boomSoundRef.current.play().catch(() => {});
            }

            setShowBoom(true);

            const newLives = lives - 1;
            setLives(newLives);

            setTimeout(() => {
                setShowBoom(false);

                if (newLives <= 0) {
                    if (bgMusicRef.current) {
                        bgMusicRef.current.pause();
                    }
                    if (overSoundRef.current) {
                        overSoundRef.current.currentTime = 0;
                        overSoundRef.current.play().catch(() => {});
                    }
                    setGameState('lost');
                    setTimeout(() => setShowLoseModal(true), 300);
                } else {
                    setIsProcessing(false);
                }
            }, 1500);
        } else if (box.content === 'treasure') {
            if (coinSoundRef.current) {
                coinSoundRef.current.currentTime = 0;
                coinSoundRef.current.play().catch(() => {});
            }

            setScore(prev => prev + 100);

            setTimeout(() => {
                if (bgMusicRef.current) {
                    bgMusicRef.current.pause();
                }
                if (winSoundRef.current) {
                    winSoundRef.current.play().catch(() => {});
                }
                setGameState('won');
                setShowWinModal(true);
            }, 600);
        } else {
            setScore(prev => prev + 5);
        }
    };

    // ============================================
    // RESET GAME
    // ============================================
    const handlePlayAgain = () => {
        setShowWinModal(false);
        setShowLoseModal(false);
        setShowResetConfirm(false);
        initGame();
    };

    const handleExit = () => {
        setShowResetConfirm(true);
    };

    const confirmExit = () => {
        setShowResetConfirm(false);
        if (bgMusicRef.current) {
            bgMusicRef.current.pause();
            bgMusicRef.current.currentTime = 0;
        }
        if (onExit) onExit();
    };

    // ============================================
    // RENDER KOTAK-KOTAK GRID
    // ============================================
    const renderGrid = () => {
        return (
            <div className="grid grid-cols-4 gap-3 sm:gap-4 w-full max-w-md mx-auto">
                {boxes.map((box, index) => (
                    <Box
                        key={box.id}
                        index={index}
                        content={box.content}
                        isFlipped={box.isFlipped}
                        onFlip={handleFlip}
                        disabled={gameState !== 'playing' || isProcessing}
                    />
                ))}
            </div>
        );
    };

    // ============================================
    // RENDER NYAWA
    // ============================================
    const renderLives = () => {
        return (
            <div className="flex items-center gap-1">
                {Array(MAX_LIVES).fill(0).map((_, i) => (
                    <Heart key={i} isActive={i < lives} />
                ))}
            </div>
        );
    };

    // ============================================
    // RENDER UTAMA
    // ============================================
    return (
        <div className="w-full flex flex-col items-center gap-6">
            {/* Boom Effect */}
            <BoomEffect 
                isActive={showBoom} 
                onComplete={() => setShowBoom(false)} 
            />

            {/* Tutorial Modal */}
            <TutorialModal 
                isOpen={showTutorial} 
                onClose={() => setShowTutorial(false)} 
            />

            {/* ============================================
                HEADER - Stats
            ============================================ */}
            {gameState === 'playing' && (
                <div className="w-full max-w-md flex items-center justify-between gap-4 p-4 rounded-xl"
                    style={{
                        background: 'linear-gradient(135deg, rgba(139, 69, 19, 0.3) 0%, rgba(62, 39, 35, 0.3) 100%)',
                        border: '1px solid rgba(255, 215, 0, 0.3)',
                    }}
                >
                    <div className="flex flex-col items-start gap-1">
                        <span className="text-[10px] sm:text-xs text-yellow-400/80 uppercase tracking-wider font-bold">
                            Nyawa
                        </span>
                        {renderLives()}
                    </div>
                    
                    <div className="flex flex-col items-center">
                        <span className="text-[10px] sm:text-xs text-yellow-400/80 uppercase tracking-wider font-bold">
                            Skor
                        </span>
                        <span className="text-xl sm:text-2xl font-black text-yellow-400"
                            style={{ textShadow: '0 0 10px rgba(255, 215, 0, 0.6)' }}
                        >
                            {score}
                        </span>
                    </div>

                    <div className="flex flex-col items-end">
                        <span className="text-[10px] sm:text-xs text-yellow-400/80 uppercase tracking-wider font-bold">
                            Bom
                        </span>
                        <span className="text-xl sm:text-2xl font-black text-red-400"
                            style={{ textShadow: '0 0 10px rgba(255, 0, 0, 0.6)' }}
                        >
                            {TOTAL_BOMBS}
                        </span>
                    </div>
                </div>
            )}

            {/* ============================================
                AREA GRID / IDLE SCREEN
            ============================================ */}
            {gameState === 'idle' ? (
    <div className="w-full max-w-md flex flex-col items-center gap-4 sm:gap-6 pt-2">
        {/* Logo dari assets */}
        <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48">
            <div className="absolute inset-0 rounded-full animate-pulse"
                style={{
                    background: 'radial-gradient(circle, rgba(255, 215, 0, 0.5) 0%, transparent 70%)',
                    filter: 'blur(20px)',
                    transform: 'scale(1.4)',
                }} />
            <img src="/images/assets/game1.png" alt="Treasure Hunt"
                className="relative w-full h-full object-contain animate-[float_3s_ease-in-out_infinite] rounded-[22%]"
                style={{ filter: 'drop-shadow(0 0 30px rgba(255, 215, 0, 0.8))' }} />
        </div>

        <div className="text-center">
            <p className="text-white/70 text-sm sm:text-base max-w-sm mx-auto leading-relaxed">
                Temukan <span className="text-yellow-400 font-bold">1 harta karun</span> tersembunyi di antara <span className="text-red-400 font-bold">6 bom</span>!
                <br />
                Kamu punya <span className="text-red-400 font-bold">3 nyawa</span>. Hati-hati dengan bom!
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
                    {renderGrid()}
                </div>
            )}

            {/* ============================================
                TOMBOL EXIT (SAAT PLAYING)
            ============================================ */}
            {gameState === 'playing' && (
                <button
                    onClick={handleExit}
                    className="px-6 py-2 rounded-lg text-sm text-white/60 hover:text-white transition-all hover:bg-white/10 border border-white/20"
                >
                    ← Keluar Game
                </button>
            )}

            {/* ============================================
                MODAL MENANG
            ============================================ */}
            {showWinModal && (
                <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div 
                        className="relative max-w-md w-full p-6 sm:p-8 rounded-2xl text-center animate-[zoom-in_0.5s_ease-out]"
                        style={{
                            background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.15) 0%, rgba(218, 165, 32, 0.1) 100%)',
                            border: '2px solid rgba(255, 215, 0, 0.5)',
                            boxShadow: '0 0 50px rgba(255, 215, 0, 0.4)',
                        }}
                    >
                        <img
                            src="/images/game1/HartaKarun.png"
                            alt="Menang"
                            className="w-24 h-24 sm:w-32 sm:h-32 mx-auto object-contain mb-4 animate-bounce"
                            style={{ filter: 'drop-shadow(0 0 25px rgba(255, 215, 0, 0.9))' }}
                        />
                        <h3 className="font-display-hero text-3xl sm:text-4xl font-black text-yellow-400 mb-2"
                            style={{ textShadow: '0 0 20px rgba(255, 215, 0, 0.8)' }}
                        >
                            MENANG!
                        </h3>
                        <p className="text-white/80 text-sm sm:text-base mb-2">
                            Kamu berhasil menemukan harta karun!
                        </p>
                        <div className="py-3 px-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30 inline-block mb-6">
                            <span className="text-xs text-yellow-400/80 uppercase tracking-wider font-bold block">
                                Skor Akhir
                            </span>
                            <span className="text-2xl sm:text-3xl font-black text-yellow-400">
                                {score}
                            </span>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <button
                                onClick={handlePlayAgain}
                                className="px-6 py-3 rounded-xl font-bold transition-all hover:scale-105 active:scale-95"
                                style={{
                                    background: 'linear-gradient(135deg, #FFD700 0%, #DAA520 100%)',
                                    color: '#1a120e',
                                    boxShadow: '0 4px 15px rgba(255, 215, 0, 0.4)',
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

            {/* ============================================
                MODAL KALAH
            ============================================ */}
            {showLoseModal && (
                <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div 
                        className="relative max-w-md w-full p-6 sm:p-8 rounded-2xl text-center animate-[zoom-in_0.5s_ease-out]"
                        style={{
                            background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.2) 0%, rgba(127, 29, 29, 0.15) 100%)',
                            border: '2px solid rgba(220, 38, 38, 0.5)',
                            boxShadow: '0 0 50px rgba(220, 38, 38, 0.4)',
                        }}
                    >
                        <img
                            src="/images/game1/bom.png"
                            alt="Kalah"
                            className="w-24 h-24 sm:w-32 sm:h-32 mx-auto object-contain mb-4"
                            style={{ filter: 'drop-shadow(0 0 25px rgba(255, 0, 0, 0.9))' }}
                        />
                        <h3 className="font-display-hero text-3xl sm:text-4xl font-black text-red-500 mb-2"
                            style={{ textShadow: '0 0 20px rgba(255, 0, 0, 0.8)' }}
                        >
                            GAME OVER
                        </h3>
                        <p className="text-white/80 text-sm sm:text-base mb-2">
                            Nyawa habis! Kamu terlalu banyak membuka bom.
                        </p>
                        <div className="py-3 px-4 rounded-lg bg-red-500/10 border border-red-500/30 inline-block mb-6">
                            <span className="text-xs text-red-400/80 uppercase tracking-wider font-bold block">
                                Skor Akhir
                            </span>
                            <span className="text-2xl sm:text-3xl font-black text-red-400">
                                {score}
                            </span>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <button
                                onClick={handlePlayAgain}
                                className="px-6 py-3 rounded-xl font-bold transition-all hover:scale-105 active:scale-95"
                                style={{
                                    background: 'linear-gradient(135deg, #FFD700 0%, #DAA520 100%)',
                                    color: '#1a120e',
                                    boxShadow: '0 4px 15px rgba(255, 215, 0, 0.4)',
                                }}
                            >
                                Coba Lagi
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

            {/* ============================================
                MODAL KONFIRMASI EXIT
            ============================================ */}
            {showResetConfirm && (
                <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div 
                        className="relative max-w-sm w-full p-6 rounded-2xl text-center"
                        style={{
                            background: 'linear-gradient(135deg, rgba(30, 30, 30, 0.95) 0%, rgba(20, 20, 20, 0.95) 100%)',
                            border: '1px solid rgba(255, 215, 0, 0.3)',
                        }}
                    >
                        <h3 className="text-xl font-bold text-white mb-3">
                            Keluar dari Game?
                        </h3>
                        <p className="text-white/60 text-sm mb-6">
                            Progress saat ini akan hilang.
                        </p>
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

            {/* CSS Animation */}
            <style dangerouslySetInnerHTML={{
                __html: `
                    @keyframes float {
                        0%, 100% { transform: translateY(0px); }
                        50% { transform: translateY(-15px); }
                    }
                    @keyframes zoom-in {
                        0% { transform: scale(0.5); opacity: 0; }
                        100% { transform: scale(1); opacity: 1; }
                    }
                `
            }} />
        </div>
    );
};

export default TreasureHunt;