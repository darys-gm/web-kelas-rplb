import { useState, useEffect, useRef, useCallback } from 'react';
import { muridData, pengurusData, waliKelasData } from '../data/data';

// ============================================
// KONFIGURASI GAME
// ============================================
const GAME_DURATION = 60; // 60 detik
const PHOTO_DISPLAY_TIME = 3000; // 3 detik tampil foto
const POINTS_CORRECT = 10;
const POINTS_SKIP = -10;
const TOTAL_CHOICES = 4; // 4 pilihan jawaban

// ============================================
// GABUNGKAN SEMUA DATA (Murid + Pengurus + Guru)
// ============================================
const getAllPeople = () => {
    const allPeople = [];

    // Tambahkan Wali Kelas
    if (waliKelasData) {
        allPeople.push({
            id: 'guru-1',
            nama: waliKelasData.nama,
            foto: waliKelasData.foto,
            role: 'Guru',
        });
    }

    // Tambahkan Pengurus
    pengurusData.forEach((p) => {
        allPeople.push({
            id: `pengurus-${p.id}`,
            nama: p.nama,
            foto: p.foto,
            role: 'Pengurus',
        });
    });

    // Tambahkan Murid
    muridData.forEach((m) => {
        allPeople.push({
            id: `murid-${m.id}`,
            nama: m.nama,
            foto: m.foto,
            role: 'Murid',
        });
    });

    return allPeople;
};

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
// GET RANDOM CHOICES (4 pilihan: 1 benar + 3 salah)
// ============================================
const getRandomChoices = (correctPerson, allPeople) => {
    const wrongChoices = allPeople.filter(
        (p) => p.id !== correctPerson.id
    );
    const shuffledWrong = shuffleArray(wrongChoices);
    const selectedWrong = shuffledWrong.slice(0, TOTAL_CHOICES - 1);

    const choices = shuffleArray([
        correctPerson,
        ...selectedWrong,
    ]);

    return choices;
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
                        Baca dulu sebelum bertualang!
                    </p>
                </div>

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
                                    Tujuan Permainan
                                </h4>
                                <p className="text-white/70 text-xs sm:text-sm leading-relaxed">
                                    Tebak nama dari foto <span className="text-yellow-400 font-bold">Murid</span>,{' '}
                                    <span className="text-yellow-400 font-bold">Pengurus</span>, atau{' '}
                                    <span className="text-yellow-400 font-bold">Guru</span> yang ditampilkan!
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
                                    Waktu
                                </h4>
                                <p className="text-white/70 text-xs sm:text-sm leading-relaxed">
                                    Kamu punya <span className="text-red-400 font-bold">60 detik</span>. Foto hanya 
                                    ditampilkan <span className="text-yellow-400 font-bold">3 detik</span>, 
                                    setelah itu menjadi hitam!
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
                            <div
                                className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
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
                                        <span>Perhatikan foto dengan seksama (3 detik)</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-yellow-400">•</span>
                                        <span>Pilih 1 dari 4 nama yang tersedia</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-yellow-400">•</span>
                                        <span>Salah jawab? Coba terus sampai benar!</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-yellow-400">•</span>
                                        <span>Tekan <span className="font-bold">Skip</span> jika menyerah (poin -10)</span>
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
                            <div
                                className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
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
                                        <span>Jawaban benar: <span className="text-yellow-400 font-bold">+10 poin</span></span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-green-400">•</span>
                                        <span>Skip: <span className="text-red-400 font-bold">-10 poin</span></span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-green-400">•</span>
                                        <span>Salah: <span className="text-white/70">poin tidak berubah</span></span>
                                    </li>
                                </ul>
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
                    Siap Bermain!
                </button>
            </div>
        </div>
    );
};

// ============================================
// KOMPONEN GAME UTAMA
// ============================================
const MemoryOfTheSea = ({ onExit }) => {
    const [gameState, setGameState] = useState('idle'); // 'idle', 'playing', 'ended'
    const [allPeople, setAllPeople] = useState([]);
    const [currentPerson, setCurrentPerson] = useState(null);
    const [choices, setChoices] = useState([]);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
    const [photoVisible, setPhotoVisible] = useState(true);
    const [answeredPeople, setAnsweredPeople] = useState([]); // orang yang sudah dijawab benar
    const [wrongAnswerId, setWrongAnswerId] = useState(null); // untuk animasi salah
    const [correctAnswerId, setCorrectAnswerId] = useState(null); // untuk animasi benar
    const [showWinModal, setShowWinModal] = useState(false);
    const [showLoseModal, setShowLoseModal] = useState(false);
    const [showResetConfirm, setShowResetConfirm] = useState(false);
    const [showTutorial, setShowTutorial] = useState(false);

    // Audio
    const correctSoundRef = useRef(null);
    const wrongSoundRef = useRef(null);
    const skipSoundRef = useRef(null);
    const winSoundRef = useRef(null);
    const overSoundRef = useRef(null);
    const bgMusicRef = useRef(null);

    // Timer Refs
    const photoTimerRef = useRef(null);

    // ============================================
    // INISIALISASI AUDIO
    // ============================================
    useEffect(() => {
        correctSoundRef.current = new Audio('/sounds/coin.mp3');
        wrongSoundRef.current = new Audio('/sounds/wrong.mp3');
        skipSoundRef.current = new Audio('/sounds/click.mp3');
        winSoundRef.current = new Audio('/sounds/win.mp3');
        overSoundRef.current = new Audio('/sounds/over.mp3');

        bgMusicRef.current = new Audio('/sounds/music-game.mp3');
        bgMusicRef.current.loop = true;
        bgMusicRef.current.volume = 0.3;

        if (correctSoundRef.current) correctSoundRef.current.volume = 0.5;
        if (wrongSoundRef.current) wrongSoundRef.current.volume = 0.4;
        if (skipSoundRef.current) skipSoundRef.current.volume = 0.3;
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
                playPromise.catch(() => {});
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
    // TIMER UTAMA (60 detik)
    // ============================================
    useEffect(() => {
        if (gameState !== 'playing') return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    if (bgMusicRef.current) bgMusicRef.current.pause();
                    if (overSoundRef.current) {
                        overSoundRef.current.currentTime = 0;
                        overSoundRef.current.play().catch(() => {});
                    }
                    setGameState('ended');
                    setTimeout(() => setShowLoseModal(true), 300);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [gameState]);

    // ============================================
    // HANDLE FOTO TIMER (3 detik foto → hitam)
    // ============================================
    useEffect(() => {
        if (gameState !== 'playing' || !currentPerson) return;

        setPhotoVisible(true);

        // Setelah 3 detik, foto jadi hitam
        photoTimerRef.current = setTimeout(() => {
            setPhotoVisible(false);
        }, PHOTO_DISPLAY_TIME);

        return () => {
            if (photoTimerRef.current) {
                clearTimeout(photoTimerRef.current);
            }
        };
    }, [currentPerson, gameState]);

    // ============================================
    // NEXT QUESTION
    // ============================================
    const nextQuestion = useCallback((remainingPeople, answeredIds) => {
        // Filter orang yang belum dijawab
        const available = remainingPeople.filter(
            (p) => !answeredIds.includes(p.id)
        );

        if (available.length === 0) {
            // Semua sudah dijawab, game berakhir (menang)
            if (bgMusicRef.current) bgMusicRef.current.pause();
            if (winSoundRef.current) {
                winSoundRef.current.currentTime = 0;
                winSoundRef.current.play().catch(() => {});
            }
            setGameState('ended');
            setShowWinModal(true);
            return;
        }

        // Pilih orang random dari yang belum dijawab
        const randomPerson = available[Math.floor(Math.random() * available.length)];
        setCurrentPerson(randomPerson);

        // Generate 4 pilihan jawaban
        const newChoices = getRandomChoices(randomPerson, allPeople);
        setChoices(newChoices);

        // Reset state animasi
        setWrongAnswerId(null);
        setCorrectAnswerId(null);
    }, [allPeople]);

    // ============================================
    // INISIALISASI GAME
    // ============================================
    const initGame = () => {
        const people = getAllPeople();
        const shuffledPeople = shuffleArray(people);

        setAllPeople(shuffledPeople);
        setScore(0);
        setTimeLeft(GAME_DURATION);
        setAnsweredPeople([]);
        setWrongAnswerId(null);
        setCorrectAnswerId(null);
        setGameState('playing');

        // Pilih orang pertama
        const firstPerson = shuffledPeople[0];
        setCurrentPerson(firstPerson);
        setChoices(getRandomChoices(firstPerson, shuffledPeople));
    };

    // ============================================
    // HANDLE JAWABAN
    // ============================================
    const handleAnswer = (choice) => {
        if (gameState !== 'playing') return;
        if (!currentPerson) return;

        // Jika jawaban benar
        if (choice.id === currentPerson.id) {
            // Play correct sound
            if (correctSoundRef.current) {
                correctSoundRef.current.currentTime = 0;
                correctSoundRef.current.play().catch(() => {});
            }

            // Set animasi benar
            setCorrectAnswerId(choice.id);

            // Update score
            setScore((prev) => prev + POINTS_CORRECT);

            // Tambahkan ke answered
            const newAnswered = [...answeredPeople, currentPerson.id];
            setAnsweredPeople(newAnswered);

            // Delay sebelum next question
            setTimeout(() => {
                nextQuestion(allPeople, newAnswered);
            }, 500);
        } else {
            // Jawaban salah - play wrong sound + animasi
            if (wrongSoundRef.current) {
                wrongSoundRef.current.currentTime = 0;
                wrongSoundRef.current.play().catch(() => {});
            }

            setWrongAnswerId(choice.id);
            setTimeout(() => setWrongAnswerId(null), 500);
        }
    };

    // ============================================
    // HANDLE SKIP
    // ============================================
    const handleSkip = () => {
        if (gameState !== 'playing') return;
        if (!currentPerson) return;

        // Play skip sound
        if (skipSoundRef.current) {
            skipSoundRef.current.currentTime = 0;
            skipSoundRef.current.play().catch(() => {});
        }

        // Kurangi poin (boleh minus)
        setScore((prev) => prev + POINTS_SKIP);

        // Lanjut ke pertanyaan berikutnya tanpa menambah answered
        nextQuestion(allPeople, answeredPeople);
    };

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
                <div
                    className="w-full max-w-md flex items-center justify-between gap-4 p-4 rounded-xl"
                    style={{
                        background: 'linear-gradient(135deg, rgba(139, 69, 19, 0.3) 0%, rgba(62, 39, 35, 0.3) 100%)',
                        border: '1px solid rgba(255, 215, 0, 0.3)',
                    }}
                >
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
                            }}
                        >
                            {formatTime(timeLeft)}
                        </span>
                    </div>

                    <div className="flex flex-col items-center">
                        <span className="text-[10px] sm:text-xs text-yellow-400/80 uppercase tracking-wider font-bold">
                            Terjawab
                        </span>
                        <span className="text-xl sm:text-2xl font-black text-yellow-400">
                            {answeredPeople.length}
                        </span>
                    </div>

                    <div className="flex flex-col items-end">
                        <span className="text-[10px] sm:text-xs text-yellow-400/80 uppercase tracking-wider font-bold">
                            Skor
                        </span>
                        <span
                            className={`text-xl sm:text-2xl font-black ${
                                score < 0 ? 'text-red-400' : 'text-yellow-400'
                            }`}
                            style={{
                                textShadow: score < 0
                                    ? '0 0 10px rgba(255, 0, 0, 0.6)'
                                    : '0 0 10px rgba(255, 215, 0, 0.6)',
                            }}
                        >
                            {score}
                        </span>
                    </div>
                </div>
            )}

            {/* ============================================
                IDLE SCREEN / GAME SCREEN
            ============================================ */}
            {gameState === 'idle' ? (
    <div className="w-full max-w-md flex flex-col items-center gap-4 sm:gap-6 pt-2">
        {/* Logo dari assets */}
        <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48">
            <div className="absolute inset-0 rounded-full animate-pulse"
                style={{
                    background: 'radial-gradient(circle, rgba(59, 130, 246, 0.5) 0%, transparent 70%)',
                    filter: 'blur(20px)',
                    transform: 'scale(1.4)',
                }} />
            <img src="/images/assets/game3.png" alt="Memory of the Sea"
                className="relative w-full h-full object-contain animate-[float_3s_ease-in-out_infinite] rounded-[22%]"
                style={{ filter: 'drop-shadow(0 0 30px rgba(59, 130, 246, 0.8))' }} />
        </div>

        <div className="text-center">
            <p className="text-white/70 text-sm sm:text-base max-w-sm mx-auto leading-relaxed">
                Tebak nama <span className="text-yellow-400 font-bold">Murid</span>, <span className="text-yellow-400 font-bold">Pengurus</span>, atau <span className="text-yellow-400 font-bold">Guru</span> dari fotonya!
                <br />
                Foto hanya muncul <span className="text-red-400 font-bold">3 detik</span>!
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
                /* ============================================
                    GAME SCREEN
                ============================================ */
                <div className="w-full max-w-md flex flex-col items-center gap-4">
                    {/* Foto Container */}
                    <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-2xl overflow-hidden shadow-2xl"
                        style={{
                            border: '4px solid rgba(255, 215, 0, 0.6)',
                            boxShadow: '0 0 40px rgba(255, 215, 0, 0.5)',
                        }}
                    >
                        {/* Foto Orang */}
                        <img
                            src={currentPerson?.foto}
                            alt={photoVisible ? currentPerson?.nama : 'Mystery'}
                            className="w-full h-full object-cover transition-all duration-500"
                            style={{
                                filter: photoVisible
                                    ? 'brightness(1)'
                                    : 'brightness(0)',
                                transform: photoVisible ? 'scale(1)' : 'scale(1.05)',
                            }}
                        />

                        {/* Overlay Status */}
                        {!photoVisible && (
                            <div className="absolute top-2 left-2 right-2 flex justify-center">
                                <div
                                    className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                                    style={{
                                        background: 'rgba(0, 0, 0, 0.7)',
                                        color: '#FFD700',
                                        border: '1px solid rgba(255, 215, 0, 0.4)',
                                    }}
                                >
                                    Siapa dia?
                                </div>
                            </div>
                        )}

                        {/* Countdown Overlay */}
                        {photoVisible && (
                            <div className="absolute bottom-2 left-2 right-2 flex justify-center">
                                <div
                                    className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider animate-pulse"
                                    style={{
                                        background: 'rgba(220, 38, 38, 0.9)',
                                        color: 'white',
                                        border: '1px solid rgba(255, 255, 255, 0.3)',
                                    }}
                                >
                                    Ingat baik-baik!
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Pilihan Jawaban - Hanya muncul setelah foto jadi hitam */}
                    {!photoVisible && (
                        <div className="w-full flex flex-col gap-2 animate-[fade-in_0.5s_ease-out]">
                            {choices.map((choice) => {
                                const isWrong = wrongAnswerId === choice.id;
                                const isCorrect = correctAnswerId === choice.id;

                                return (
                                    <button
                                        key={choice.id}
                                        onClick={() => handleAnswer(choice)}
                                        className="w-full px-4 py-3 rounded-xl font-bold text-sm sm:text-base transition-all hover:scale-[1.02] active:scale-95 text-left"
                                        style={{
                                            background: isCorrect
                                                ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.9) 0%, rgba(21, 128, 61, 0.9) 100%)'
                                                : isWrong
                                                    ? 'linear-gradient(135deg, rgba(220, 38, 38, 0.9) 0%, rgba(153, 27, 27, 0.9) 100%)'
                                                    : 'linear-gradient(135deg, rgba(139, 69, 19, 0.6) 0%, rgba(93, 64, 55, 0.6) 100%)',
                                            color: isCorrect || isWrong ? 'white' : '#FFD700',
                                            border: isCorrect
                                                ? '2px solid #22C55E'
                                                : isWrong
                                                    ? '2px solid #DC2626'
                                                    : '2px solid rgba(255, 215, 0, 0.4)',
                                            boxShadow: isCorrect
                                                ? '0 0 20px rgba(34, 197, 94, 0.6)'
                                                : isWrong
                                                    ? '0 0 20px rgba(220, 38, 38, 0.6)'
                                                    : '0 2px 10px rgba(0, 0, 0, 0.3)',
                                            transform: isWrong ? 'translateX(-5px)' : 'none',
                                        }}
                                    >
                                        {choice.nama}
                                    </button>
                                );
                            })}

                            {/* Tombol Skip */}
                            <button
                                onClick={handleSkip}
                                className="w-full px-4 py-3 rounded-xl font-bold text-sm sm:text-base transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 mt-2"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(30, 30, 30, 0.8) 0%, rgba(20, 20, 20, 0.8) 100%)',
                                    color: 'rgba(255, 255, 255, 0.7)',
                                    border: '2px dashed rgba(255, 215, 0, 0.4)',
                                }}
                            >
                                <span className="material-symbols-outlined text-xl">skip_next</span>
                                <span>Skip (-10 poin)</span>
                            </button>
                        </div>
                    )}

                    {/* Info Role */}
                    <div className="text-center">
                        <p className="text-white/40 text-xs">
                            {currentPerson?.role && `Kategori: ${currentPerson.role}`}
                        </p>
                    </div>
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
                        <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-4 flex items-center justify-center">
                            <span
                                className="material-symbols-outlined text-yellow-400"
                                style={{
                                    fontSize: '120px',
                                    filter: 'drop-shadow(0 0 25px rgba(255, 215, 0, 0.9))',
                                }}
                            >
                                emoji_events
                            </span>
                        </div>
                        <h3
                            className="font-display-hero text-3xl sm:text-4xl font-black text-yellow-400 mb-2"
                            style={{ textShadow: '0 0 20px rgba(255, 215, 0, 0.8)' }}
                        >
                            LUAR BIASA!
                        </h3>
                        <p className="text-white/80 text-sm sm:text-base mb-2">
                            Kamu berhasil menebak semua orang!
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
                            Waktu tersisa: {formatTime(timeLeft)}
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
                MODAL KALAH (Waktu Habis)
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
                        <h3
                            className="font-display-hero text-3xl sm:text-4xl font-black text-red-500 mb-2"
                            style={{ textShadow: '0 0 20px rgba(255, 0, 0, 0.8)' }}
                        >
                            WAKTU HABIS
                        </h3>
                        <p className="text-white/80 text-sm sm:text-base mb-2">
                            Waktu kamu sudah habis!
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
                            Berhasil menebak: {answeredPeople.length} orang
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
                    @keyframes fade-in {
                        0% { opacity: 0; transform: translateY(10px); }
                        100% { opacity: 1; transform: translateY(0); }
                    }
                `
            }} />
        </div>
    );
};

export default MemoryOfTheSea;