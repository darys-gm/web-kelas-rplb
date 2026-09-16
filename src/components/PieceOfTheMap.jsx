import { useState, useEffect, useRef, useCallback } from 'react';

// ============================================
// KONFIGURASI LEVEL
// ============================================
const LEVELS = [
    { id: 1, image: '/images/game5/map1.png', cols: 3, rows: 2, name: 'Pulau Kecil' },
    { id: 2, image: '/images/game5/map2.png', cols: 3, rows: 3, name: 'Pulau Karang' },
    { id: 3, image: '/images/game5/map3.png', cols: 4, rows: 3, name: 'Laut Dalam' },
    { id: 4, image: '/images/game5/map4.png', cols: 4, rows: 4, name: 'Samudera Luas' },
    { id: 5, image: '/images/game5/map5.png', cols: 5, rows: 4, name: 'Perairan Berbahaya' },
    { id: 6, image: '/images/game5/map6.png', cols: 5, rows: 5, name: 'Harta Legendaris' },
];

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
// FORMAT TIME
// ============================================
const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) return `${secs}s`;
    return `${mins}m ${secs}s`;
};

// ============================================
// KOMPONEN ANIMASI HUJAN KOIN EMAS
// ============================================
const CoinShower = ({ isActive }) => {
    const [coins, setCoins] = useState([]);

    useEffect(() => {
        if (!isActive) {
            setCoins([]);
            return;
        }

        const newCoins = Array.from({ length: 40 }, (_, i) => ({
            id: i,
            left: Math.random() * 100,
            delay: Math.random() * 2,
            duration: 2 + Math.random() * 2,
            size: 30 + Math.random() * 40,
            rotation: Math.random() * 360,
            opacity: 0.7 + Math.random() * 0.3,
            xOffset: (Math.random() - 0.5) * 150,
        }));

        setCoins(newCoins);
    }, [isActive]);

    if (!isActive) return null;

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-[300]">
            <style dangerouslySetInnerHTML={{
                __html: `
                    @keyframes coinShowerFall {
                        0% { transform: translateY(-15vh) rotate(0deg) scale(0.3); opacity: 0; }
                        10% { opacity: 1; transform: translateY(-5vh) rotate(45deg) scale(1); }
                        90% { opacity: 1; }
                        100% { transform: translateY(115vh) rotate(720deg) scale(0.8); opacity: 0.3; }
                    }
                    @keyframes coinShowerSway {
                        0%, 100% { transform: translateX(0px); }
                        50% { transform: translateX(var(--sway)); }
                    }
                    .coin-shower-item {
                        position: absolute;
                        top: -15vh;
                        animation: coinShowerFall var(--duration) ease-in var(--delay) forwards;
                    }
                    .coin-shower-item .coin-shower-inner {
                        animation: coinShowerSway 1.5s ease-in-out infinite;
                        --sway: calc(var(--x-offset) * 1px);
                    }
                `
            }} />

            {coins.map((coin) => (
                <div
                    key={coin.id}
                    className="coin-shower-item"
                    style={{
                        left: `${coin.left}%`,
                        '--duration': `${coin.duration}s`,
                        '--delay': `${coin.delay}s`,
                        '--x-offset': coin.xOffset,
                    }}
                >
                    <div className="coin-shower-inner" style={{ '--sway': `${coin.xOffset}px` }}>
                        <img
                            src="/images/game2/KoinEmas.png"
                            alt="Coin"
                            style={{
                                width: `${coin.size}px`,
                                height: `${coin.size}px`,
                                opacity: coin.opacity,
                                transform: `rotate(${coin.rotation}deg)`,
                                filter: 'drop-shadow(0 0 15px rgba(255, 215, 0, 0.9)) drop-shadow(0 0 25px rgba(255, 200, 0, 0.6))',
                            }}
                            className="object-contain select-none"
                        />
                    </div>
                </div>
            ))}
        </div>
    );
};

// ============================================
// KOMPONEN MODAL PREVIEW TARGET PETA
// ============================================
const TargetPreviewModal = ({ isOpen, onClose, image, levelName }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => setIsVisible(true), 50);
            document.body.style.overflow = 'hidden';
        } else {
            setIsVisible(false);
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    // Handle ESC key untuk close
    useEffect(() => {
        if (!isOpen) return;
        const handleKey = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className={`fixed inset-0 z-[400] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md transition-opacity duration-500 ${
                isVisible ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={onClose}
        >
            {/* Tombol Close */}
            <button
                className="absolute top-4 right-4 sm:top-6 sm:right-6 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all backdrop-blur-sm border border-white/20 hover:scale-110 active:scale-95"
                onClick={onClose}
                aria-label="Tutup preview"
            >
                <span className="material-symbols-outlined text-2xl sm:text-3xl">close</span>
            </button>

            {/* Konten Modal */}
            <div
                className={`relative flex flex-col items-center justify-center max-w-[95vw] max-h-[95vh] transition-all duration-700 ease-out ${
                    isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                }`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header Title */}
                <div className="mb-4 sm:mb-6 text-center px-4">
                    <span className="font-label-nav-coordinates text-yellow-400 uppercase tracking-wider block text-[10px] sm:text-xs mb-1">
                        Target Puzzle
                    </span>
                    <h3
                        className="font-display-hero text-white font-bold text-lg sm:text-2xl md:text-3xl drop-shadow-lg"
                        style={{ textShadow: '0 0 20px rgba(255, 215, 0, 0.6)' }}
                    >
                        {levelName}
                    </h3>
                </div>

                {/* Gambar Preview */}
                <div
                    className="relative rounded-2xl overflow-hidden shadow-2xl"
                    style={{
                        border: '4px solid rgba(255, 215, 0, 0.6)',
                        boxShadow:
                            '0 0 60px rgba(255, 215, 0, 0.5), 0 0 100px rgba(255, 200, 0, 0.3), inset 0 0 30px rgba(0, 0, 0, 0.5)',
                        background: 'linear-gradient(135deg, rgba(139, 69, 19, 0.3) 0%, rgba(62, 39, 35, 0.3) 100%)',
                        maxWidth: 'min(90vw, 800px)',
                        maxHeight: '75vh',
                    }}
                >
                    <img
                        src={image}
                        alt={`Preview ${levelName}`}
                        className="block w-full h-full object-contain select-none"
                        style={{
                            filter: 'drop-shadow(0 0 20px rgba(255, 215, 0, 0.4))',
                            maxHeight: '75vh',
                        }}
                        draggable={false}
                    />
                </div>

                {/* Hint di bawah */}
                <div
                    className="mt-4 sm:mt-6 text-center px-4 py-2 rounded-full backdrop-blur-sm"
                    style={{
                        background: 'rgba(0, 0, 0, 0.5)',
                        border: '1px solid rgba(255, 215, 0, 0.3)',
                    }}
                >
                    <p className="text-white/70 text-[10px] sm:text-xs font-label-code">
                        Susun potongan di papan sesuai gambar ini
                    </p>
                </div>
            </div>
        </div>
    );
};

// ============================================
// KOMPONEN TUTORIAL MODAL
// ============================================
const TutorialModal = ({ isOpen, onClose }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) setTimeout(() => setIsVisible(true), 50);
        else setIsVisible(false);
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
                <button
                    className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
                    onClick={onClose}
                >
                    <span className="material-symbols-outlined text-xl">close</span>
                </button>

                <div className="text-center mb-6">
                    <h3
                        className="font-display-hero text-2xl sm:text-3xl font-black text-yellow-400 mb-2"
                        style={{ textShadow: '0 0 20px rgba(255, 215, 0, 0.6)' }}
                    >
                        Cara Bermain
                    </h3>
                    <p className="text-white/60 text-xs sm:text-sm">
                        Susun peta untuk membuka harta karun!
                    </p>
                </div>

                <div className="space-y-4">
                    <div
                        className="p-4 rounded-xl"
                        style={{
                            background: 'rgba(255, 215, 0, 0.08)',
                            border: '1px solid rgba(255, 215, 0, 0.2)',
                        }}
                    >
                        <div className="flex items-start gap-3">
                            <div
                                className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
                                style={{
                                    background: 'linear-gradient(135deg, #FFD700 0%, #DAA520 100%)',
                                    color: '#1a120e',
                                }}
                            >
                                1
                            </div>
                            <div className="flex-1">
                                <h4 className="text-yellow-400 font-bold text-sm mb-1">
                                    Tujuan
                                </h4>
                                <p className="text-white/70 text-xs sm:text-sm leading-relaxed">
                                    Susun <span className="text-yellow-400 font-bold">potongan peta</span> menjadi 
                                    gambar utuh untuk membuka harta karun!
                                </p>
                            </div>
                        </div>
                    </div>

                    <div
                        className="p-4 rounded-xl"
                        style={{
                            background: 'rgba(220, 38, 38, 0.08)',
                            border: '1px solid rgba(220, 38, 38, 0.2)',
                        }}
                    >
                        <div className="flex items-start gap-3">
                            <div
                                className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
                                style={{
                                    background: 'linear-gradient(135deg, #DC2626 0%, #991B1B 100%)',
                                    color: 'white',
                                }}
                            >
                                2
                            </div>
                            <div className="flex-1">
                                <h4 className="text-red-400 font-bold text-sm mb-1">
                                    Cara Bermain
                                </h4>
                                <ul className="text-white/70 text-xs sm:text-sm leading-relaxed space-y-1.5">
                                    <li className="flex items-start gap-2">
                                        <span className="text-yellow-400">•</span>
                                        <span>Klik 2 potongan untuk <span className="font-bold">swap</span> posisi</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-yellow-400">•</span>
                                        <span>Susun sampai gambar peta utuh</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-yellow-400">•</span>
                                        <span>Klik <span className="text-yellow-400 font-bold">preview target</span> untuk melihat peta lebih besar</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-yellow-400">•</span>
                                        <span>6 level dengan tingkat kesulitan berbeda</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-yellow-400">•</span>
                                        <span>Tidak ada batas waktu, santai saja!</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div
                        className="p-4 rounded-xl"
                        style={{
                            background: 'rgba(34, 197, 94, 0.08)',
                            border: '1px solid rgba(34, 197, 94, 0.2)',
                        }}
                    >
                        <div className="flex items-start gap-3">
                            <div
                                className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
                                style={{
                                    background: 'linear-gradient(135deg, #22C55E 0%, #15803D 100%)',
                                    color: 'white',
                                }}
                            >
                                3
                            </div>
                            <div className="flex-1">
                                <h4 className="text-green-400 font-bold text-sm mb-1">
                                    Harta Karun
                                </h4>
                                <p className="text-white/70 text-xs sm:text-sm leading-relaxed">
                                    Setelah menyelesaikan semua puzzle, <span className="text-yellow-400 font-bold">tekan 
                                    dan tahan peti</span> selama 5 detik untuk membukanya!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <button
                    onClick={onClose}
                    className="w-full mt-6 px-6 py-3 rounded-xl font-bold text-sm transition-all hover:scale-105 active:scale-95"
                    style={{
                        background: 'linear-gradient(135deg, #FFD700 0%, #DAA520 100%)',
                        color: '#1a120e',
                        boxShadow: '0 4px 15px rgba(255, 215, 0, 0.4)',
                    }}
                >
                    Mulai Menyusun!
                </button>
            </div>
        </div>
    );
};

// ============================================
// KOMPONEN PETA & PUZZLE
// ============================================
const PuzzleBoard = ({ level, onComplete, onPieceClick, onSwap }) => {
    const totalPieces = level.cols * level.rows;
    const [pieces, setPieces] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [isCompleted, setIsCompleted] = useState(false);
    const [showPreview, setShowPreview] = useState(false);

    // Inisialisasi pieces (acak)
    useEffect(() => {
        const initial = Array.from({ length: totalPieces }, (_, i) => i);

        let shuffled = shuffleArray(initial);
        let attempts = 0;
        while (
            shuffled.every((val, idx) => val === idx) &&
            attempts < 10
        ) {
            shuffled = shuffleArray(initial);
            attempts++;
        }

        setPieces(shuffled);
        setSelectedIndex(null);
        setIsCompleted(false);
    }, [level.id, totalPieces]);

    // Cek apakah puzzle selesai
    useEffect(() => {
        if (pieces.length === 0) return;
        const completed = pieces.every((val, idx) => val === idx);
        if (completed && !isCompleted) {
            setIsCompleted(true);
            setTimeout(() => onComplete(), 500);
        }
    }, [pieces, isCompleted, onComplete]);

    // Handle klik potongan
    const handlePieceClick = (index) => {
        if (isCompleted) return;

        if (selectedIndex === null) {
            setSelectedIndex(index);
            onPieceClick && onPieceClick();
        } else if (selectedIndex === index) {
            setSelectedIndex(null);
        } else {
            const newPieces = [...pieces];
            [newPieces[selectedIndex], newPieces[index]] = [newPieces[index], newPieces[selectedIndex]];
            setPieces(newPieces);
            setSelectedIndex(null);
            onSwap && onSwap();
        }
    };

    // Render potongan
    const renderPiece = (pieceIndex, position) => {
        const row = Math.floor(pieceIndex / level.cols);
        const col = pieceIndex % level.cols;

        const isSelected = selectedIndex === position;
        const isCorrect = pieceIndex === position;

        const bgPosX = level.cols > 1 ? (col / (level.cols - 1)) * 100 : 0;
        const bgPosY = level.rows > 1 ? (row / (level.rows - 1)) * 100 : 0;

        return (
            <button
                key={position}
                onClick={() => handlePieceClick(position)}
                disabled={isCompleted}
                className={`
                    relative overflow-hidden transition-all duration-300
                    ${isCompleted ? 'cursor-default' : 'cursor-pointer hover:scale-[1.03]'}
                    ${isSelected ? 'ring-4 ring-yellow-400 z-10 scale-105' : ''}
                `}
                style={{
                    aspectRatio: '1',
                    boxShadow: isSelected
                        ? '0 0 20px rgba(255, 215, 0, 0.9)'
                        : '0 2px 6px rgba(0, 0, 0, 0.4)',
                    border: isSelected
                        ? '2px solid #FFD700'
                        : '1px solid rgba(255, 215, 0, 0.3)',
                }}
            >
                <div
                    className="w-full h-full transition-all duration-300"
                    style={{
                        backgroundImage: `url(${level.image})`,
                        backgroundSize: `${level.cols * 100}% ${level.rows * 100}%`,
                        backgroundPosition: `${bgPosX}% ${bgPosY}%`,
                        filter: isCompleted
                            ? 'brightness(1.1)'
                            : isCorrect
                                ? 'brightness(1.05)'
                                : 'brightness(0.9)',
                    }}
                />

                {isCorrect && !isCompleted && (
                    <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-green-400 shadow-lg animate-pulse" />
                )}

                {isCompleted && (
                    <div className="absolute inset-0 bg-yellow-400/20 animate-pulse" />
                )}
            </button>
        );
    };

    return (
        <div className="w-full flex flex-col items-center gap-4">
            {/* ============================================ */}
            {/* Preview target - BISA DIKLIK */}
            {/* ============================================ */}
            <div className="flex items-center gap-3">
                <span className="text-white/60 text-xs sm:text-sm">Target:</span>
                <button
                    onClick={() => setShowPreview(true)}
                    className="group relative w-16 h-12 sm:w-20 sm:h-16 rounded-md overflow-hidden border-2 border-yellow-500/50 shadow-lg transition-all duration-300 hover:scale-110 hover:border-yellow-400 hover:shadow-[0_0_25px_rgba(255,215,0,0.7)] active:scale-95 cursor-pointer"
                    aria-label="Lihat preview target lebih besar"
                >
                    <img
                        src={level.image}
                        alt="Target"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />

                    {/* Overlay hint saat hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                        <span className="material-symbols-outlined text-white text-lg sm:text-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg">
                            zoom_in
                        </span>
                    </div>

                    {/* Ping effect untuk hint */}
                    <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-yellow-400 animate-ping opacity-75" />
                    <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-yellow-400" />
                </button>
            </div>

            {/* ============================================ */}
            {/* Modal Preview Target */}
            {/* ============================================ */}
            <TargetPreviewModal
                isOpen={showPreview}
                onClose={() => setShowPreview(false)}
                image={level.image}
                levelName={level.name}
            />

            {/* Grid Puzzle */}
            <div
                className="relative w-full max-w-md mx-auto rounded-lg overflow-hidden shadow-2xl"
                style={{
                    background: 'rgba(0, 0, 0, 0.3)',
                    border: '3px solid rgba(255, 215, 0, 0.5)',
                    boxShadow: '0 0 40px rgba(255, 215, 0, 0.3)',
                }}
            >
                <div
                    className="grid gap-1 p-1"
                    style={{
                        gridTemplateColumns: `repeat(${level.cols}, 1fr)`,
                        gridTemplateRows: `repeat(${level.rows}, 1fr)`,
                    }}
                >
                    {pieces.map((pieceIndex, position) => renderPiece(pieceIndex, position))}
                </div>
            </div>

            {/* Info progress */}
            <div className="text-white/60 text-xs sm:text-sm">
                {isCompleted ? (
                    <span className="text-green-400 font-bold animate-pulse">
                        ✓ Puzzle Selesai!
                    </span>
                ) : (
                    <span>
                        {pieces.filter((val, idx) => val === idx).length} / {totalPieces} potongan benar
                    </span>
                )}
            </div>
        </div>
    );
};

// ============================================
// KOMPONEN PETA HARTA KARUN
// ============================================
const TreasureChest = ({ onUnlock, onHoldStart, onHoldEnd }) => {
    const [holdProgress, setHoldProgress] = useState(0);
    const [isHolding, setIsHolding] = useState(false);
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [shakeKey, setShakeKey] = useState(0);

    const progressIntervalRef = useRef(null);

    const HOLD_DURATION = 5000;
    const INTERVAL = 50;

    const startHold = () => {
        if (isUnlocked) return;

        setIsHolding(true);
        setShakeKey((prev) => prev + 1);

        if (onHoldStart) onHoldStart();

        let elapsed = 0;

        progressIntervalRef.current = setInterval(() => {
            elapsed += INTERVAL;
            const progress = Math.min(elapsed / HOLD_DURATION, 1);
            setHoldProgress(progress);

            if (progress >= 1) {
                clearInterval(progressIntervalRef.current);
                setIsHolding(false);
                setIsUnlocked(true);
                if (onUnlock) onUnlock();
            }
        }, INTERVAL);
    };

    const stopHold = () => {
        if (isUnlocked) return;

        setIsHolding(false);
        if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
        }
        setHoldProgress(0);

        if (onHoldEnd) onHoldEnd();
    };

    useEffect(() => {
        return () => {
            if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
        };
    }, []);

    return (
        <div className="w-full flex flex-col items-center gap-6">
            <div className="text-center">
                <h3
                    className="font-display-hero text-2xl sm:text-3xl font-bold text-yellow-400 mb-2"
                    style={{ textShadow: '0 0 20px rgba(255, 215, 0, 0.6)' }}
                >
                    {isUnlocked ? 'Harta Karun Terbuka!' : 'Tekan & Tahan Peti 5 Detik'}
                </h3>
                <p className="text-white/60 text-xs sm:text-sm">
                    {isUnlocked
                        ? 'Selamat! Kamu berhasil membuka harta karun!'
                        : 'Tahan terus peti selama 5 detik untuk membukanya'}
                </p>
            </div>

            <div className="relative flex items-center justify-center">
                <button
                    key={shakeKey}
                    onMouseDown={startHold}
                    onMouseUp={stopHold}
                    onMouseLeave={stopHold}
                    onTouchStart={(e) => {
                        e.preventDefault();
                        startHold();
                    }}
                    onTouchEnd={(e) => {
                        e.preventDefault();
                        stopHold();
                    }}
                    disabled={isUnlocked}
                    className={`relative transition-transform duration-200 ${
                        isUnlocked ? 'cursor-default' : 'cursor-pointer active:scale-95'
                    } ${isHolding ? 'animate-[shake_0.3s_ease-in-out_infinite]' : ''}`}
                    style={{
                        filter: isUnlocked
                            ? 'drop-shadow(0 0 40px rgba(255, 215, 0, 1))'
                            : 'drop-shadow(0 0 20px rgba(255, 150, 0, 0.6))',
                    }}
                >
                    <img
                        src={
                            isUnlocked
                                ? '/images/game5/HartaKarun.png'
                                : '/images/game5/harta-tertutup.png'
                        }
                        alt="Harta Karun"
                        className={`object-contain select-none pointer-events-none transition-all duration-500 ${
                            isUnlocked
                                ? 'w-56 h-56 sm:w-72 sm:h-72 animate-[bounce_1.5s_ease-in-out_infinite]'
                                : 'w-48 h-48 sm:w-64 sm:h-64'
                        }`}
                        draggable={false}
                    />
                </button>
            </div>

            {!isUnlocked && (
                <div className="w-full max-w-xs">
                    <div
                        className="w-full h-3 rounded-full overflow-hidden"
                        style={{
                            background: 'rgba(0, 0, 0, 0.5)',
                            border: '1px solid rgba(255, 215, 0, 0.3)',
                        }}
                    >
                        <div
                            className="h-full transition-all duration-100"
                            style={{
                                width: `${holdProgress * 100}%`,
                                background: holdProgress >= 0.8
                                    ? 'linear-gradient(90deg, #FFD700 0%, #FFA500 100%)'
                                    : 'linear-gradient(90deg, #22C55E 0%, #FFD700 100%)',
                                boxShadow: '0 0 15px rgba(255, 215, 0, 0.8)',
                            }}
                        />
                    </div>
                    <div className="text-center mt-2 text-yellow-400 text-xs font-bold">
                        {Math.ceil((1 - holdProgress) * 5)}s
                    </div>
                </div>
            )}

            {isUnlocked && (
                <div
                    className="py-3 px-6 rounded-xl text-center animate-[bounce_1s_ease-in-out_infinite]"
                    style={{
                        background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.3) 0%, rgba(218, 165, 32, 0.2) 100%)',
                        border: '2px solid rgba(255, 215, 0, 0.6)',
                    }}
                >
                    <div className="text-yellow-400 font-black text-xl sm:text-2xl">
                        HARTA KARUN DITEMUKAN!
                    </div>
                </div>
            )}

            <style dangerouslySetInnerHTML={{
                __html: `
                    @keyframes shake {
                        0%, 100% { transform: translateX(0) rotate(0deg); }
                        25% { transform: translateX(-8px) rotate(-2deg); }
                        75% { transform: translateX(8px) rotate(2deg); }
                    }
                    @keyframes bounce {
                        0%, 100% { transform: translateY(0); }
                        50% { transform: translateY(-10px); }
                    }
                `
            }} />
        </div>
    );
};

// ============================================
// KOMPONEN GAME UTAMA
// ============================================
const PieceOfTheMap = ({ onExit }) => {
    const [gameState, setGameState] = useState('idle');
    const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
    const [showTutorial, setShowTutorial] = useState(false);
    const [showResetConfirm, setShowResetConfirm] = useState(false);
    const [showMidStats, setShowMidStats] = useState(false);
    const [showAllStats, setShowAllStats] = useState(false);
    const [showCoinShower, setShowCoinShower] = useState(false);
    const [levelStats, setLevelStats] = useState([]);

    const levelStartTimeRef = useRef(null);
    const [elapsedTime, setElapsedTime] = useState(0);

    const clickSoundRef = useRef(null);
    const swapSoundRef = useRef(null);
    const coinSoundRef = useRef(null);
    const levelCompleteSoundRef = useRef(null);
    const unlockSoundRef = useRef(null);
    const bgMusicRef = useRef(null);

    const currentLevel = LEVELS[currentLevelIndex];

    useEffect(() => {
        clickSoundRef.current = new Audio('/sounds/click.mp3');
        swapSoundRef.current = new Audio('/sounds/click.mp3');
        coinSoundRef.current = new Audio('/sounds/coin.mp3');
        levelCompleteSoundRef.current = new Audio('/sounds/win.mp3');
        unlockSoundRef.current = new Audio('/sounds/coin.mp3');
        bgMusicRef.current = new Audio('/sounds/music-game.mp3');
        bgMusicRef.current.loop = true;
        bgMusicRef.current.volume = 0.25;

        if (clickSoundRef.current) clickSoundRef.current.volume = 0.3;
        if (swapSoundRef.current) swapSoundRef.current.volume = 0.4;
        if (coinSoundRef.current) coinSoundRef.current.volume = 0.6;
        if (levelCompleteSoundRef.current) levelCompleteSoundRef.current.volume = 0.5;
        if (unlockSoundRef.current) unlockSoundRef.current.volume = 0.7;
    }, []);

    useEffect(() => {
        if (!bgMusicRef.current) return;
        if (gameState === 'playing' || gameState === 'treasure') {
            bgMusicRef.current.play().catch(() => {});
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

    useEffect(() => {
        if (gameState !== 'playing' || !levelStartTimeRef.current) return;

        const interval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - levelStartTimeRef.current) / 1000);
            setElapsedTime(elapsed);
        }, 1000);

        return () => clearInterval(interval);
    }, [gameState, currentLevelIndex]);

    const initGame = () => {
        setCurrentLevelIndex(0);
        setLevelStats([]);
        setGameState('playing');
        levelStartTimeRef.current = Date.now();
        setElapsedTime(0);
        setShowCoinShower(false);
    };

    const handleLevelComplete = useCallback(() => {
        const timeSpent = Math.floor((Date.now() - levelStartTimeRef.current) / 1000);

        if (coinSoundRef.current) {
            coinSoundRef.current.currentTime = 0;
            coinSoundRef.current.play().catch(() => {});
        }

        setTimeout(() => {
            if (levelCompleteSoundRef.current) {
                levelCompleteSoundRef.current.currentTime = 0;
                levelCompleteSoundRef.current.play().catch(() => {});
            }
        }, 300);

        const newStat = {
            levelId: currentLevel.id,
            levelName: currentLevel.name,
            timeSpent,
            pieces: currentLevel.cols * currentLevel.rows,
        };

        setLevelStats((prev) => [...prev, newStat]);
        setGameState('complete');

        if (currentLevelIndex === LEVELS.length - 1) {
            setTimeout(() => setShowAllStats(true), 500);
        } else {
            setTimeout(() => setShowMidStats(true), 500);
        }
    }, [currentLevel, currentLevelIndex]);

    const nextLevel = () => {
        setShowMidStats(false);
        setCurrentLevelIndex((prev) => prev + 1);
        setGameState('playing');
        levelStartTimeRef.current = Date.now();
        setElapsedTime(0);
    };

    const goToTreasure = () => {
        setShowAllStats(false);
        setGameState('treasure');
    };

    const handleTreasureUnlocked = () => {
        if (unlockSoundRef.current) {
            unlockSoundRef.current.currentTime = 0;
            unlockSoundRef.current.play().catch(() => {});
        }

        setTimeout(() => {
            setShowCoinShower(true);
        }, 100);
    };

    const handleExit = () => {
        if (gameState === 'playing' || gameState === 'complete') {
            setShowResetConfirm(true);
        } else {
            confirmExit();
        }
    };

    const confirmExit = () => {
        setShowResetConfirm(false);
        if (bgMusicRef.current) {
            bgMusicRef.current.pause();
            bgMusicRef.current.currentTime = 0;
        }
        if (onExit) onExit();
    };

    const getTotalTime = () => {
        return levelStats.reduce((sum, s) => sum + s.timeSpent, 0);
    };

    const renderIdle = () => (
        <div className="w-full max-w-md flex flex-col items-center gap-4 sm:gap-6 pt-2">
            <div className="relative w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56">
                <div className="absolute inset-0 rounded-full animate-pulse"
                    style={{
                        background: 'radial-gradient(circle, rgba(245, 158, 11, 0.5) 0%, transparent 70%)',
                        filter: 'blur(20px)',
                        transform: 'scale(1.4)',
                    }} />
                <img src="/images/assets/game5.png" alt="Piece of the Map"
                    className="relative w-full h-full object-contain animate-[float_3s_ease-in-out_infinite] rounded-[22%]"
                    style={{ filter: 'drop-shadow(0 0 30px rgba(245, 158, 11, 0.8))' }} />
            </div>

            <div className="text-center px-4">
                <p className="text-white/70 text-sm sm:text-base max-w-sm mx-auto leading-relaxed">
                    Susun <span className="text-yellow-400 font-bold">potongan peta</span> untuk membuka harta karun yang terkunci!
                    <br />
                    6 level dengan tingkat kesulitan berbeda.
                </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto px-4">
                <button onClick={() => setShowTutorial(true)}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm sm:text-base transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
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
                    className="w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-sm sm:text-base transition-all hover:scale-105 active:scale-95"
                    style={{
                        background: 'linear-gradient(135deg, #FFD700 0%, #DAA520 100%)',
                        color: '#1a120e',
                        boxShadow: '0 4px 20px rgba(255, 215, 0, 0.5)',
                    }}>
                    Mulai Menyusun
                </button>
            </div>
        </div>
    );

    const renderGame = () => (
        <div className="w-full max-w-2xl flex flex-col items-center gap-4">
            <div
                className="w-full flex items-center justify-between gap-3 p-3 rounded-xl"
                style={{
                    background: 'linear-gradient(135deg, rgba(139, 69, 19, 0.3) 0%, rgba(62, 39, 35, 0.3) 100%)',
                    border: '1px solid rgba(255, 215, 0, 0.3)',
                }}
            >
                <div className="flex flex-col items-start">
                    <span className="text-[9px] sm:text-[10px] text-yellow-400/80 uppercase tracking-wider font-bold">
                        Level
                    </span>
                    <span className="text-sm sm:text-base font-black text-yellow-400">
                        {currentLevelIndex + 1} / {LEVELS.length}
                    </span>
                </div>

                <div className="flex flex-col items-center">
                    <span className="text-[9px] sm:text-[10px] text-yellow-400/80 uppercase tracking-wider font-bold">
                        {currentLevel.name}
                    </span>
                    <span className="text-xs sm:text-sm font-black text-white">
                        {currentLevel.cols * currentLevel.rows} Potongan
                    </span>
                </div>

                <div className="flex flex-col items-end">
                    <span className="text-[9px] sm:text-[10px] text-yellow-400/80 uppercase tracking-wider font-bold">
                        Waktu
                    </span>
                    <span className="text-sm sm:text-base font-black text-cyan-400">
                        {formatTime(elapsedTime)}
                    </span>
                </div>
            </div>

            <div className="w-full flex items-center gap-1 sm:gap-1.5">
                {LEVELS.map((lvl, i) => (
                    <div
                        key={lvl.id}
                        className="flex-1 h-1.5 sm:h-2 rounded-full transition-all duration-300"
                        style={{
                            background: i < currentLevelIndex
                                ? 'linear-gradient(90deg, #22C55E 0%, #15803D 100%)'
                                : i === currentLevelIndex
                                    ? 'linear-gradient(90deg, #FFD700 0%, #DAA520 100%)'
                                    : 'rgba(255, 255, 255, 0.1)',
                            boxShadow: i === currentLevelIndex
                                ? '0 0 10px rgba(255, 215, 0, 0.6)'
                                : 'none',
                        }}
                    />
                ))}
            </div>

            <PuzzleBoard
                level={currentLevel}
                onComplete={handleLevelComplete}
                onPieceClick={() => {
                    if (clickSoundRef.current) {
                        const s = clickSoundRef.current.cloneNode();
                        s.volume = 0.2;
                        s.play().catch(() => {});
                    }
                }}
                onSwap={() => {
                    if (swapSoundRef.current) {
                        const s = swapSoundRef.current.cloneNode();
                        s.volume = 0.3;
                        s.play().catch(() => {});
                    }
                }}
            />

            <button
                onClick={handleExit}
                className="px-4 sm:px-6 py-2 rounded-lg text-xs sm:text-sm text-white/60 hover:text-white transition-all hover:bg-white/10 border border-white/20"
            >
                ← Keluar Game
            </button>
        </div>
    );

    const renderTreasure = () => (
        <div className="w-full max-w-2xl flex flex-col items-center gap-6">
            <TreasureChest onUnlock={handleTreasureUnlocked} />

            <button
                onClick={handleExit}
                className="px-4 sm:px-6 py-2 rounded-lg text-xs sm:text-sm text-white/60 hover:text-white transition-all hover:bg-white/10 border border-white/20"
            >
                ← Keluar Game
            </button>
        </div>
    );

    return (
        <div className="w-full flex flex-col items-center gap-4 sm:gap-6 py-4 sm:py-6">
            <CoinShower isActive={showCoinShower} />

            <TutorialModal isOpen={showTutorial} onClose={() => setShowTutorial(false)} />

            {gameState === 'idle' && renderIdle()}
            {(gameState === 'playing' || gameState === 'complete') && renderGame()}
            {gameState === 'treasure' && renderTreasure()}

            {showMidStats && (
                <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
                    <div
                        className="relative max-w-md w-full p-5 sm:p-6 md:p-8 rounded-2xl text-center animate-[zoom-in_0.5s_ease-out] my-auto"
                        style={{
                            background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.15) 0%, rgba(218, 165, 32, 0.08) 100%)',
                            border: '2px solid rgba(255, 215, 0, 0.5)',
                            boxShadow: '0 0 50px rgba(255, 215, 0, 0.4)',
                        }}
                    >
                        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                            <span
                                className="material-symbols-outlined text-yellow-400"
                                style={{
                                    fontSize: 'clamp(48px, 10vw, 80px)',
                                    filter: 'drop-shadow(0 0 25px rgba(255, 215, 0, 0.9))',
                                }}
                            >
                                extension
                            </span>
                        </div>
                        <h3
                            className="font-display-hero text-xl sm:text-2xl md:text-3xl font-black text-yellow-400 mb-2"
                            style={{ textShadow: '0 0 20px rgba(255, 215, 0, 0.8)' }}
                        >
                            LEVEL {currentLevelIndex + 1} SELESAI!
                        </h3>
                        <p className="text-white/80 text-xs sm:text-sm md:text-base mb-4">
                            Kamu menyelesaikan <span className="text-yellow-400 font-bold">{currentLevel.name}</span>!
                        </p>

                        <div className="py-3 px-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30 inline-block mb-3">
                            <div className="text-[10px] sm:text-xs text-yellow-400/80 uppercase tracking-wider font-bold mb-1">
                                Waktu Level Ini
                            </div>
                            <div className="text-xl sm:text-2xl md:text-3xl font-black text-yellow-400">
                                {formatTime(levelStats[levelStats.length - 1]?.timeSpent || 0)}
                            </div>
                        </div>

                        <div className="py-2 px-3 rounded-lg bg-white/5 border border-white/10 inline-block mb-4 ml-2">
                            <div className="text-[10px] text-white/60 uppercase tracking-wider font-bold">
                                Total Waktu
                            </div>
                            <div className="text-lg font-black text-cyan-400">
                                {formatTime(getTotalTime())}
                            </div>
                        </div>

                        <div className="text-left bg-black/30 rounded-lg p-3 mb-4 max-h-32 overflow-y-auto">
                            <div className="text-[10px] text-white/60 uppercase tracking-wider font-bold mb-2">
                                Progress:
                            </div>
                            {levelStats.map((stat, idx) => (
                                <div key={idx} className="flex justify-between items-center py-1 border-b border-white/5 last:border-0">
                                    <span className="text-xs text-white/70">
                                        Lv {idx + 1}: {stat.levelName}
                                    </span>
                                    <span className="text-xs font-bold text-cyan-400">
                                        {formatTime(stat.timeSpent)}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
                            <button
                                onClick={nextLevel}
                                className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold text-sm sm:text-base transition-all hover:scale-105 active:scale-95"
                                style={{
                                    background: 'linear-gradient(135deg, #FFD700 0%, #DAA520 100%)',
                                    color: '#1a120e',
                                    boxShadow: '0 4px 15px rgba(255, 215, 0, 0.4)',
                                }}
                            >
                                Level {currentLevelIndex + 2} →
                            </button>
                            <button
                                onClick={handleExit}
                                className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold text-sm sm:text-base transition-all hover:scale-105 active:scale-95 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 border border-white/20"
                            >
                                Keluar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showAllStats && (
                <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
                    <div
                        className="relative max-w-md w-full p-5 sm:p-6 md:p-8 rounded-2xl text-center animate-[zoom-in_0.5s_ease-out] my-auto"
                        style={{
                            background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.2) 0%, rgba(218, 165, 32, 0.1) 100%)',
                            border: '2px solid rgba(255, 215, 0, 0.6)',
                            boxShadow: '0 0 50px rgba(255, 215, 0, 0.5)',
                        }}
                    >
                        <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                            <span
                                className="material-symbols-outlined text-yellow-400"
                                style={{
                                    fontSize: 'clamp(60px, 12vw, 100px)',
                                    filter: 'drop-shadow(0 0 30px rgba(255, 215, 0, 1))',
                                }}
                            >
                                map
                            </span>
                        </div>
                        <h3
                            className="font-display-hero text-2xl sm:text-3xl md:text-4xl font-black text-yellow-400 mb-2"
                            style={{ textShadow: '0 0 20px rgba(255, 215, 0, 0.8)' }}
                        >
                            PETA LENGKAP!
                        </h3>
                        <p className="text-white/80 text-xs sm:text-sm md:text-base mb-4">
                            Kamu berhasil menyusun semua potongan peta!
                        </p>

                        <div className="py-3 px-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30 inline-block mb-4">
                            <div className="text-[10px] sm:text-xs text-yellow-400/80 uppercase tracking-wider font-bold mb-1">
                                Total Waktu Pengerjaan
                            </div>
                            <div className="text-2xl sm:text-3xl md:text-4xl font-black text-yellow-400">
                                {formatTime(getTotalTime())}
                            </div>
                        </div>

                        <div className="text-left bg-black/30 rounded-lg p-3 mb-4 max-h-40 overflow-y-auto">
                            <div className="text-[10px] text-white/60 uppercase tracking-wider font-bold mb-2">
                                Detail Per Level:
                            </div>
                            {levelStats.map((stat, idx) => (
                                <div key={idx} className="flex justify-between items-center py-1.5 border-b border-white/5 last:border-0">
                                    <div>
                                        <div className="text-xs text-white/80 font-bold">
                                            Lv {idx + 1}: {stat.levelName}
                                        </div>
                                        <div className="text-[10px] text-white/50">
                                            {stat.pieces} potongan
                                        </div>
                                    </div>
                                    <span className="text-sm font-bold text-cyan-400">
                                        {formatTime(stat.timeSpent)}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={goToTreasure}
                                className="px-6 py-3 rounded-xl font-bold text-sm sm:text-base transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                                style={{
                                    background: 'linear-gradient(135deg, #FFD700 0%, #DAA520 100%)',
                                    color: '#1a120e',
                                    boxShadow: '0 4px 20px rgba(255, 215, 0, 0.6)',
                                }}
                            >
                                <span className="material-symbols-outlined">lock_open</span>
                                <span>Buka Peti Harta Karun</span>
                            </button>
                            <button
                                onClick={handleExit}
                                className="px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all hover:scale-105 active:scale-95 text-white/60 hover:text-white bg-white/5 hover:bg-white/10 border border-white/20"
                            >
                                Keluar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showResetConfirm && (
                <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
                    <div
                        className="relative max-w-md w-full p-5 sm:p-6 rounded-2xl text-center my-auto"
                        style={{
                            background: 'linear-gradient(135deg, rgba(30, 30, 30, 0.98) 0%, rgba(20, 20, 20, 0.98) 100%)',
                            border: '1px solid rgba(255, 215, 0, 0.3)',
                        }}
                    >
                        <h3 className="text-lg sm:text-xl font-bold text-white mb-3">
                            Keluar dari Game?
                        </h3>

                        {levelStats.length > 0 && (
                            <div className="mb-4 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                                <div className="text-[10px] text-yellow-400/80 uppercase tracking-wider font-bold mb-2">
                                    Puzzle Selesai: {levelStats.length} / {LEVELS.length}
                                </div>
                                <div className="text-xs text-white/70 mb-2">
                                    Total Waktu: <span className="text-cyan-400 font-bold">{formatTime(getTotalTime())}</span>
                                </div>
                                <div className="text-left max-h-24 overflow-y-auto">
                                    {levelStats.map((stat, idx) => (
                                        <div key={idx} className="flex justify-between text-[10px] py-0.5">
                                            <span className="text-white/60">Lv {idx + 1}</span>
                                            <span className="text-cyan-400 font-bold">{formatTime(stat.timeSpent)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <p className="text-white/60 text-xs sm:text-sm mb-6">
                            Progress saat ini akan hilang.
                        </p>

                        <div className="flex gap-2 sm:gap-3 justify-center">
                            <button
                                onClick={() => setShowResetConfirm(false)}
                                className="px-4 sm:px-5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all hover:scale-105 bg-white/10 hover:bg-white/20 text-white border border-white/20"
                            >
                                Batal
                            </button>
                            <button
                                onClick={confirmExit}
                                className="px-4 sm:px-5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all hover:scale-105"
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
                    @keyframes shake {
                        0%, 100% { transform: translateX(0) rotate(0deg); }
                        25% { transform: translateX(-8px) rotate(-2deg); }
                        75% { transform: translateX(8px) rotate(2deg); }
                    }
                    @keyframes bounce {
                        0%, 100% { transform: translateY(0); }
                        50% { transform: translateY(-10px); }
                    }
                `
            }} />
        </div>
    );
};

export default PieceOfTheMap;