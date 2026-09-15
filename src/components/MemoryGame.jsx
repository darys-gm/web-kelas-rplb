import { useState, useEffect, useRef, useCallback } from 'react';

// ============================================
// KONFIGURASI GAME
// ============================================
const GAME_DURATION = 60; // 60 detik
const CARD_PAIRS = 8; // 8 pasang = 16 kartu
const FLIP_BACK_DELAY = 1000; // 1 detik untuk flip back

// Kartu-kartu tersedia
const CARD_IMAGES = [
    { id: 'burung', src: '/images/game2/Burung.png', name: 'Burung' },
    { id: 'hartakarun', src: '/images/game2/HartaKarun.png', name: 'Harta Karun' },
    { id: 'kapal', src: '/images/game2/Kapal.png', name: 'Kapal' },
    { id: 'kapten', src: '/images/game2/Kapten.png', name: 'Kapten' },
    { id: 'koinemas', src: '/images/game2/KoinEmas.png', name: 'Koin Emas' },
    { id: 'kraken', src: '/images/game2/Kraken.png', name: 'Kraken' },
    { id: 'putriduyung', src: '/images/game2/PutriDuyung.png', name: 'Putri Duyung' },
    { id: 'meriam', src: '/images/game2/Meriam.png', name: 'Meriam' },
];

// ============================================
// KOMPONEN KARTU
// ============================================
const MemoryCard = ({ card, isFlipped, isMatched, onClick, disabled }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <button
            onClick={() => !disabled && !isFlipped && !isMatched && onClick(card)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            disabled={disabled || isFlipped || isMatched}
            className={`
                relative aspect-square rounded-lg transition-all duration-300
                ${isMatched ? 'cursor-default' : 'cursor-pointer'}
                ${!isFlipped && !isMatched && !disabled ? 'hover:scale-105 active:scale-95' : ''}
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
                    transform: isFlipped || isMatched ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}
            >
                {/* Sisi Depan (Tertutup) - Belakang Kartu */}
                <div
                    className="absolute inset-0 rounded-lg flex items-center justify-center"
                    style={{
                        backfaceVisibility: 'hidden',
                        background: 'linear-gradient(135deg, #8B4513 0%, #654321 50%, #3E2723 100%)',
                        boxShadow: 'inset 0 2px 4px rgba(255, 255, 255, 0.2), inset 0 -2px 4px rgba(0, 0, 0, 0.3), 0 4px 8px rgba(0, 0, 0, 0.4)',
                        border: '2px solid #5D4037',
                    }}
                >
                    {/* Ornamen Kartu */}
                    <div className="absolute inset-1.5 border-2 border-yellow-700/50 rounded-sm"></div>
                    
                    {/* Icon Jangkar */}
                    <div 
                        className={`transition-transform duration-300 ${isHovered && !disabled ? 'scale-125 rotate-12' : ''}`}
                    >
                        <span 
                            className="material-symbols-outlined text-yellow-400 text-2xl sm:text-3xl md:text-4xl"
                            style={{
                                textShadow: '0 0 10px rgba(255, 215, 0, 0.8), 0 2px 4px rgba(0,0,0,0.5)',
                            }}
                        >
                            anchor
                        </span>
                    </div>
                </div>

                {/* Sisi Belakang (Terbuka) - Gambar Kartu */}
                <div
                    className="absolute inset-0 rounded-lg flex items-center justify-center overflow-hidden"
                    style={{
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                    }}
                >
                    {isMatched ? (
                        // Kartu yang sudah cocok - dengan efek hijau
                        <div 
                            className="relative w-full h-full flex items-center justify-center p-1.5"
                            style={{
                                background: 'radial-gradient(circle, rgba(34, 197, 94, 0.4) 0%, rgba(21, 128, 61, 0.6) 100%)',
                                border: '2px solid #22C55E',
                            }}
                        >
                            <img
                                src={card.src}
                                alt={card.name}
                                className="w-full h-full object-contain"
                                style={{
                                    filter: 'drop-shadow(0 0 10px rgba(34, 197, 94, 0.8))',
                                }}
                            />
                        </div>
                    ) : (
                        // Kartu yang sedang dibuka - normal
                        <div 
                            className="relative w-full h-full flex items-center justify-center p-1.5"
                            style={{
                                background: 'radial-gradient(circle, #78350f 0%, #451a03 100%)',
                                border: '2px solid rgba(255, 215, 0, 0.4)',
                            }}
                        >
                            <img
                                src={card.src}
                                alt={card.name}
                                className="w-full h-full object-contain"
                            />
                        </div>
                    )}
                </div>
            </div>
        </button>
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
                                    Temukan <span className="text-yellow-400 font-bold">8 pasang</span> gambar yang sama 
                                    dengan membuka kartu satu per satu.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Waktu */}
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
                                    Waktu
                                </h4>
                                <p className="text-white/70 text-xs sm:text-sm leading-relaxed">
                                    Kamu hanya punya <span className="text-red-400 font-bold">60 detik</span> untuk 
                                    menyelesaikan semua pasangan. Jika waktu habis, game over!
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
                                        <span>Klik kartu untuk membukanya</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-yellow-400">•</span>
                                        <span>Buka 2 kartu, jika gambar sama → kartu terbuka</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-yellow-400">•</span>
                                        <span>Jika gambar beda → kartu tertutup kembali</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-yellow-400">•</span>
                                        <span>Posisi kartu <span className="font-bold">acak</span> setiap game</span>
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
                                    Skor & Bonus
                                </h4>
                                <ul className="text-white/70 text-xs sm:text-sm leading-relaxed space-y-1.5">
                                    <li className="flex items-start gap-2">
                                        <span className="text-green-400">•</span>
                                        <span>Pasangan cocok: <span className="text-yellow-400 font-bold">+50 poin</span></span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-green-400">•</span>
                                        <span>Sisa waktu: <span className="text-yellow-400 font-bold">+5 poin/detik</span></span>
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
const MemoryGame = ({ onExit }) => {
    const [gameState, setGameState] = useState('idle'); // 'idle', 'playing', 'won', 'lost'
    const [cards, setCards] = useState([]);
    const [flippedCards, setFlippedCards] = useState([]);
    const [matchedCards, setMatchedCards] = useState([]);
    const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
    const [score, setScore] = useState(0);
    const [isChecking, setIsChecking] = useState(false);
    const [showWinModal, setShowWinModal] = useState(false);
    const [showLoseModal, setShowLoseModal] = useState(false);
    const [showResetConfirm, setShowResetConfirm] = useState(false);
    const [showTutorial, setShowTutorial] = useState(false);

    // Audio Refs
    const flipSoundRef = useRef(null);
    const matchSoundRef = useRef(null);
    const wrongSoundRef = useRef(null);
    const winSoundRef = useRef(null);
    const overSoundRef = useRef(null);
    const bgMusicRef = useRef(null);

    // ============================================
    // INISIALISASI AUDIO
    // ============================================
    useEffect(() => {
        flipSoundRef.current = new Audio('/sounds/click.mp3');
        matchSoundRef.current = new Audio('/sounds/coin.mp3');
        wrongSoundRef.current = new Audio('/sounds/boom.mp3');
        winSoundRef.current = new Audio('/sounds/win.mp3');
        overSoundRef.current = new Audio('/sounds/over.mp3');
        
        bgMusicRef.current = new Audio('/sounds/music-game.mp3');
        bgMusicRef.current.loop = true;
        bgMusicRef.current.volume = 0.9;
        
        if (flipSoundRef.current) flipSoundRef.current.volume = 0.3;
        if (matchSoundRef.current) matchSoundRef.current.volume = 0.5;
        if (wrongSoundRef.current) wrongSoundRef.current.volume = 0.4;
        if (winSoundRef.current) winSoundRef.current.volume = 0.6;
        if (overSoundRef.current) overSoundRef.current.volume = 0.6;
    }, []);

    // ============================================
    // PLAY / PAUSE BACKSOUND
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

    // ============================================
    // TIMER
    // ============================================
    useEffect(() => {
        if (gameState !== 'playing') return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    // Waktu habis = kalah
                    if (bgMusicRef.current) bgMusicRef.current.pause();
                    if (overSoundRef.current) {
                        overSoundRef.current.currentTime = 0;
                        overSoundRef.current.play().catch(() => {});
                    }
                    setGameState('lost');
                    setTimeout(() => setShowLoseModal(true), 300);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [gameState]);

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
        // Buat pasangan kartu (setiap gambar ada 2x)
        const pairedCards = [];
        CARD_IMAGES.forEach((img, idx) => {
            pairedCards.push({ ...img, pairId: idx, uniqueId: `${img.id}-a` });
            pairedCards.push({ ...img, pairId: idx, uniqueId: `${img.id}-b` });
        });

        // Shuffle posisi kartu
        const shuffled = shuffleArray(pairedCards);

        setCards(shuffled);
        setFlippedCards([]);
        setMatchedCards([]);
        setTimeLeft(GAME_DURATION);
        setScore(0);
        setGameState('playing');
        setIsChecking(false);
    };

    // ============================================
    // HANDLE KLIK KARTU
    // ============================================
    const handleCardClick = useCallback((card) => {
        if (gameState !== 'playing') return;
        if (isChecking) return;
        if (flippedCards.length >= 2) return;
        if (flippedCards.find(c => c.uniqueId === card.uniqueId)) return;

        // Play flip sound
        if (flipSoundRef.current) {
            flipSoundRef.current.currentTime = 0;
            flipSoundRef.current.play().catch(() => {});
        }

        const newFlipped = [...flippedCards, card];
        setFlippedCards(newFlipped);

        // Jika sudah 2 kartu terbuka, cek apakah cocok
        if (newFlipped.length === 2) {
            setIsChecking(true);
            const [first, second] = newFlipped;

            if (first.pairId === second.pairId) {
                // COCOK!
                setTimeout(() => {
                    if (matchSoundRef.current) {
                        matchSoundRef.current.currentTime = 0;
                        matchSoundRef.current.play().catch(() => {});
                    }
                    setMatchedCards(prev => [...prev, first.uniqueId, second.uniqueId]);
                    setScore(prev => prev + 50);
                    setFlippedCards([]);
                    setIsChecking(false);
                }, 400);
            } else {
                // TIDAK COCOK - flip back setelah 1 detik
                setTimeout(() => {
                    if (wrongSoundRef.current) {
                        wrongSoundRef.current.currentTime = 0;
                        wrongSoundRef.current.play().catch(() => {});
                    }
                    setFlippedCards([]);
                    setIsChecking(false);
                }, FLIP_BACK_DELAY);
            }
        }
    }, [gameState, isChecking, flippedCards]);

    // ============================================
    // CEK MENANG
    // ============================================
    useEffect(() => {
        if (gameState !== 'playing') return;
        if (matchedCards.length === CARD_PAIRS * 2) {
            // MENANG!
            if (bgMusicRef.current) bgMusicRef.current.pause();
            if (winSoundRef.current) {
                winSoundRef.current.currentTime = 0;
                winSoundRef.current.play().catch(() => {});
            }
            // Bonus skor dari sisa waktu
            const timeBonus = timeLeft * 5;
            setScore(prev => prev + timeBonus);
            setGameState('won');
            setTimeout(() => setShowWinModal(true), 500);
        }
    }, [matchedCards, gameState, timeLeft]);

    // ============================================
    // RESET / EXIT
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
    // FORMAT TIME
    // ============================================
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    // ============================================
    // RENDER GRID
    // ============================================
    const renderGrid = () => {
        return (
            <div className="grid grid-cols-4 gap-2 sm:gap-3 w-full max-w-md mx-auto">
                {cards.map((card) => (
                    <MemoryCard
                        key={card.uniqueId}
                        card={card}
                        isFlipped={flippedCards.some(c => c.uniqueId === card.uniqueId)}
                        isMatched={matchedCards.includes(card.uniqueId)}
                        onClick={handleCardClick}
                        disabled={isChecking || gameState !== 'playing'}
                    />
                ))}
            </div>
        );
    };

    // ============================================
    // RENDER UTAMA
    // ============================================
    return (
        <div className="w-full flex flex-col items-center gap-6">
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
                    {/* Timer */}
                    <div className="flex flex-col items-start gap-1">
                        <span className="text-[10px] sm:text-xs text-yellow-400/80 uppercase tracking-wider font-bold">
                            Waktu
                        </span>
                        <span 
                            className={`text-xl sm:text-2xl font-black ${
                                timeLeft <= 10 ? 'text-red-500' : 'text-yellow-400'
                            }`}
                            style={{ 
                                textShadow: timeLeft <= 10 
                                    ? '0 0 10px rgba(255, 0, 0, 0.8)' 
                                    : '0 0 10px rgba(255, 215, 0, 0.6)',
                                animation: timeLeft <= 10 ? 'pulse 1s ease-in-out infinite' : 'none',
                            }}
                        >
                            {formatTime(timeLeft)}
                        </span>
                    </div>

                    {/* Progress */}
                    <div className="flex flex-col items-center">
                        <span className="text-[10px] sm:text-xs text-yellow-400/80 uppercase tracking-wider font-bold">
                            Pasangan
                        </span>
                        <span className="text-xl sm:text-2xl font-black text-yellow-400"
                            style={{ textShadow: '0 0 10px rgba(255, 215, 0, 0.6)' }}
                        >
                            {matchedCards.length / 2}/{CARD_PAIRS}
                        </span>
                    </div>

                    {/* Score */}
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] sm:text-xs text-yellow-400/80 uppercase tracking-wider font-bold">
                            Skor
                        </span>
                        <span className="text-xl sm:text-2xl font-black text-yellow-400"
                            style={{ textShadow: '0 0 10px rgba(255, 215, 0, 0.6)' }}
                        >
                            {score}
                        </span>
                    </div>
                </div>
            )}

            {/* ============================================
                IDLE SCREEN / GRID
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
            <img src="/images/assets/game2.png" alt="Memory Card"
                className="relative w-full h-full object-contain animate-[float_3s_ease-in-out_infinite] rounded-[22%]"
                style={{ filter: 'drop-shadow(0 0 30px rgba(255, 215, 0, 0.8))' }} />
        </div>

        <div className="text-center">
            <p className="text-white/70 text-sm sm:text-base max-w-sm mx-auto leading-relaxed">
                Temukan <span className="text-yellow-400 font-bold">8 pasang kartu</span> dalam waktu <span className="text-red-400 font-bold">60 detik</span>!
                <br />
                Klik 2 kartu, jika gambarnya sama akan terbuka!
            </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto px-4">
            <button onClick={() => setShowTutorial(true)}
                className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-base transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                style={{
                    background: 'linear-gradient(135deg, rgba(139, 69, 19, 0.8) 0%, rgba(93, 64, 55, 0.8) 100%)',
                    color: '#FFD700',
                    border: '2px solid rgba(255, 215, 0, 0.4)',
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

            {/* Tombol Exit */}
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
                            src="/images/game2/KoinEmas.png"
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
                            Kamu berhasil menemukan semua pasangan!
                        </p>
                        <div className="py-3 px-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30 inline-block mb-3">
                            <span className="text-xs text-yellow-400/80 uppercase tracking-wider font-bold block">
                                Skor Akhir
                            </span>
                            <span className="text-2xl sm:text-3xl font-black text-yellow-400">
                                {score}
                            </span>
                        </div>
                        <div className="text-white/50 text-xs mb-6">
                            Waktu tersisa: {formatTime(timeLeft)} • Bonus: +{timeLeft * 5}
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
                        <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-4 flex items-center justify-center">
                            <span 
                                className="material-symbols-outlined text-red-500"
                                style={{ 
                                    fontSize: '120px',
                                    filter: 'drop-shadow(0 0 25px rgba(255, 0, 0, 0.9))',
                                }}
                            >
                                timer_off
                            </span>
                        </div>
                        <h3 className="font-display-hero text-3xl sm:text-4xl font-black text-red-500 mb-2"
                            style={{ textShadow: '0 0 20px rgba(255, 0, 0, 0.8)' }}
                        >
                            WAKTU HABIS
                        </h3>
                        <p className="text-white/80 text-sm sm:text-base mb-2">
                            Kamu belum menemukan semua pasangan!
                        </p>
                        <div className="py-3 px-4 rounded-lg bg-red-500/10 border border-red-500/30 inline-block mb-3">
                            <span className="text-xs text-red-400/80 uppercase tracking-wider font-bold block">
                                Skor Akhir
                            </span>
                            <span className="text-2xl sm:text-3xl font-black text-red-400">
                                {score}
                            </span>
                        </div>
                        <div className="text-white/50 text-xs mb-6">
                            Pasangan ditemukan: {matchedCards.length / 2}/{CARD_PAIRS}
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
                    @keyframes pulse {
                        0%, 100% { opacity: 1; }
                        50% { opacity: 0.6; }
                    }
                `
            }} />
        </div>
    );
};

export default MemoryGame;