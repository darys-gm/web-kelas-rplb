import { useState, useEffect, useRef, useCallback } from 'react';

// ============================================
// KONFIGURASI GAME
// ============================================
const MAX_LIVES = 3;
const QUESTIONS_PER_LEVEL = 3;
const TIME_PER_QUESTION = 20;
const TOTAL_LEVELS = 8;

const POINTS = {
    CORRECT: 100,
    WRONG: -25,
    LEVEL_COMPLETE: 250,
    FAST_ANSWER: 50,
    PERFECT_LEVEL: 100,
};

// ============================================
// BANK SOAL
// ============================================
const QUESTION_BANK = {
    1: {
        title: 'HTML',
        subtitle: 'Pulau Dasar Website',
        color: '#E34F26',
        questions: [
            {
                question: 'Apa fungsi tag <form>?',
                options: [
                    'Untuk membuat formulir input data',
                    'Untuk membuat tabel',
                    'Untuk menyisipkan gambar',
                    'Untuk membuat link',
                ],
                correct: 0,
            },
            {
                question: 'Apa fungsi dari tag <img> pada HTML?',
                options: [
                    'Menampilkan video',
                    'Menampilkan gambar',
                    'Membuat paragraf',
                    'Membuat heading',
                ],
                correct: 1,
            },
            {
                question: 'Tag HTML yang digunakan untuk membuat heading paling besar adalah?',
                options: ['<h6>', '<heading>', '<h1>', '<head>'],
                correct: 2,
            },
        ],
    },
    2: {
        title: 'CSS',
        subtitle: 'Pulau Keindahan',
        color: '#264DE4',
        questions: [
            {
                question: 'Property CSS apa yang digunakan untuk mengubah warna teks?',
                options: ['background-color', 'color', 'font-color', 'text-color'],
                correct: 1,
            },
            {
                question: 'Bagaimana cara memilih elemen dengan class "header" pada CSS?',
                options: ['#header', '.header', 'header', '*header'],
                correct: 1,
            },
            {
                question: 'Property CSS yang digunakan untuk membuat layout fleksibel satu dimensi adalah?',
                options: ['display: grid', 'display: flex', 'display: block', 'display: inline'],
                correct: 1,
            },
        ],
    },
    3: {
        title: 'JavaScript',
        subtitle: 'Pulau Logika',
        color: '#F7DF1E',
        questions: [
            {
                question: 'Apa fungsi JavaScript pada website?',
                options: [
                    'Membuat struktur halaman',
                    'Membuat tampilan menarik',
                    'Membuat website menjadi interaktif',
                    'Menyimpan database',
                ],
                correct: 2,
            },
            {
                question: 'Keyword yang digunakan untuk mendeklarasikan variable yang tidak bisa diubah adalah?',
                options: ['var', 'let', 'const', 'static'],
                correct: 2,
            },
            {
                question: 'Method untuk memilih element HTML berdasarkan ID adalah?',
                options: [
                    'document.querySelector()',
                    'document.getElementById()',
                    'document.getElement()',
                    'document.findId()',
                ],
                correct: 1,
            },
        ],
    },
    4: {
        title: 'Laravel',
        subtitle: 'Pulau Framework',
        color: '#FF2D20',
        questions: [
            {
                question: 'Laravel menggunakan pola arsitektur apa?',
                options: ['MVVM', 'MVC', 'MVP', 'HMVC'],
                correct: 1,
            },
            {
                question: 'File yang digunakan untuk konfigurasi environment di Laravel adalah?',
                options: ['.config', '.env', 'config.php', 'settings.json'],
                correct: 1,
            },
            {
                question: 'Command Artisan untuk membuat controller di Laravel adalah?',
                options: [
                    'php artisan create:controller',
                    'php artisan make:controller',
                    'php artisan generate:controller',
                    'php artisan new:controller',
                ],
                correct: 1,
            },
        ],
    },
    5: {
        title: 'Database',
        subtitle: 'Pulau Penyimpanan',
        color: '#00758F',
        questions: [
            {
                question: 'Perintah SQL untuk mengambil data adalah?',
                options: ['GET', 'SELECT', 'FETCH', 'PICK'],
                correct: 1,
            },
            {
                question: 'Primary Key digunakan untuk?',
                options: [
                    'Menghubungkan dua tabel',
                    'Mengidentifikasi setiap baris secara unik',
                    'Menyimpan data',
                    'Membuat tabel',
                ],
                correct: 1,
            },
            {
                question: 'Perintah SQL untuk mengupdate data adalah?',
                options: ['MODIFY', 'CHANGE', 'UPDATE', 'SET'],
                correct: 2,
            },
        ],
    },
    6: {
        title: 'Hosting',
        subtitle: 'Pulau Server',
        color: '#4A90E2',
        questions: [
            {
                question: 'Apa fungsi hosting?',
                options: [
                    'Menyimpan file website agar dapat diakses online',
                    'Membuat desain website',
                    'Menulis kode program',
                    'Membuat database',
                ],
                correct: 0,
            },
            {
                question: 'SSL berfungsi untuk?',
                options: [
                    'Mempercepat loading',
                    'Mengenkripsi data antara server dan client',
                    'Memperbesar kapasitas',
                    'Mengubah domain',
                ],
                correct: 1,
            },
            {
                question: 'cPanel adalah?',
                options: [
                    'Bahasa pemrograman',
                    'Control panel untuk mengelola hosting',
                    'Framework PHP',
                    'Database',
                ],
                correct: 1,
            },
        ],
    },
    7: {
        title: 'Domain',
        subtitle: 'Pulau Alamat',
        color: '#9C27B0',
        questions: [
            {
                question: 'Apa yang dimaksud dengan domain?',
                options: [
                    'Nama unik yang digunakan untuk mengakses website',
                    'Ruang penyimpanan website',
                    'Bahasa pemrograman website',
                    'Desain website',
                ],
                correct: 0,
            },
            {
                question: 'DNS adalah singkatan dari?',
                options: [
                    'Domain Name System',
                    'Data Network System',
                    'Digital Name Server',
                    'Domain Network Service',
                ],
                correct: 0,
            },
            {
                question: 'Ekstensi domain untuk Indonesia adalah?',
                options: ['.id', '.in', '.ind', '.indo'],
                correct: 0,
            },
        ],
    },
    8: {
        title: 'Web Development',
        subtitle: 'Pulau Terakhir',
        color: '#FFD700',
        questions: [
            {
                question: 'HTML digunakan untuk struktur website, CSS digunakan untuk ..., sedangkan JavaScript digunakan untuk ....',
                options: [
                    'Database, Hosting',
                    'Tampilan dan interaksi, Logika dan interaktivitas',
                    'Hosting, Domain',
                    'Domain, Server',
                ],
                correct: 1,
            },
            {
                question: 'Urutan yang tepat dalam membuat website adalah?',
                options: [
                    'Database → HTML → CSS',
                    'Struktur (HTML) → Tampilan (CSS) → Logika (JS)',
                    'Hosting → Domain → Kode',
                    'CSS → HTML → Database',
                ],
                correct: 1,
            },
            {
                question: 'Framework PHP yang digunakan untuk membuat website modern adalah?',
                options: ['React', 'Vue', 'Laravel', 'Angular'],
                correct: 2,
            },
        ],
    },
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
// GENERATE QUESTIONS
// ============================================
const generateQuestionsForLevel = (levelNumber) => {
    const levelData = QUESTION_BANK[levelNumber];
    if (!levelData) return [];

    const shuffledQuestions = shuffleArray(levelData.questions);
    const selectedQuestions = shuffledQuestions.slice(0, QUESTIONS_PER_LEVEL);

    return selectedQuestions.map((q) => {
        const correctAnswer = q.options[q.correct];
        const shuffledOptions = shuffleArray(q.options);
        const newCorrectIndex = shuffledOptions.indexOf(correctAnswer);
        return {
            question: q.question,
            options: shuffledOptions,
            correct: newCorrectIndex,
        };
    });
};

// ============================================
// FORMAT TIME
// ============================================
const formatTotalTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) return `${secs}s`;
    return `${mins}m ${secs}s`;
};

// ============================================
// KOMPONEN MODAL TUTORIAL
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
                        Baca dulu sebelum berpetualang!
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
                                    Buka kunci <span className="text-yellow-400 font-bold">8 pulau</span> dengan menjawab 
                                    soal seputar <span className="text-yellow-400 font-bold">Web Development</span>!
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
                                    Aturan Penting
                                </h4>
                                <ul className="text-white/70 text-xs sm:text-sm leading-relaxed space-y-1.5">
                                    <li className="flex items-start gap-2">
                                        <span className="text-yellow-400">•</span>
                                        <span>Kamu punya <span className="text-red-400 font-bold">3 nyawa</span></span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-yellow-400">•</span>
                                        <span>Jawaban salah = nyawa -1 & <span className="text-yellow-400 font-bold">ulangi level</span></span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-yellow-400">•</span>
                                        <span>Waktu <span className="text-red-400 font-bold">20 detik</span> per soal</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-yellow-400">•</span>
                                        <span>Jawab semua dengan <span className="text-green-400 font-bold">BENAR</span> untuk lolos level</span>
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
                                    Sistem Skor
                                </h4>
                                <ul className="text-white/70 text-xs sm:text-sm leading-relaxed space-y-1">
                                    <li className="flex items-center justify-between">
                                        <span>Jawaban benar</span>
                                        <span className="text-green-400 font-bold">+100</span>
                                    </li>
                                    <li className="flex items-center justify-between">
                                        <span>Jawaban salah</span>
                                        <span className="text-red-400 font-bold">-25</span>
                                    </li>
                                    <li className="flex items-center justify-between">
                                        <span>Selesai level</span>
                                        <span className="text-yellow-400 font-bold">+250</span>
                                    </li>
                                    <li className="flex items-center justify-between">
                                        <span>Jawab cepat (&gt;10s)</span>
                                        <span className="text-yellow-400 font-bold">+50</span>
                                    </li>
                                    <li className="flex items-center justify-between">
                                        <span>Perfect (0 salah)</span>
                                        <span className="text-yellow-400 font-bold">+100</span>
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
                    Mulai Petualangan!
                </button>
            </div>
        </div>
    );
};

// ============================================
// KOMPONEN GAME UTAMA
// ============================================
const PirateCodeQuest = ({ onExit }) => {
    const [gameState, setGameState] = useState('idle'); // 'idle', 'map', 'playing', 'levelComplete', 'won', 'lost'
    const [currentLevel, setCurrentLevel] = useState(1);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [questions, setQuestions] = useState([]);
    const [lives, setLives] = useState(MAX_LIVES);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [wrongAnswersInLevel, setWrongAnswersInLevel] = useState(0);
    const [showWinModal, setShowWinModal] = useState(false);
    const [showLoseModal, setShowLoseModal] = useState(false);
    const [showResetConfirm, setShowResetConfirm] = useState(false);
    const [showTutorial, setShowTutorial] = useState(false);
    const [showLevelComplete, setShowLevelComplete] = useState(false);
    const [showLevelFailed, setShowLevelFailed] = useState(false);
    const [unlockedLevels, setUnlockedLevels] = useState(1);

    // Ref untuk track jawaban salah
    const wrongAnswersRef = useRef(0);

    // Total waktu
    const [totalTimeSpent, setTotalTimeSpent] = useState(0);
    const totalTimeRef = useRef(0);

    const [stats, setStats] = useState({
        totalCorrect: 0,
        totalWrong: 0,
        totalTimeouts: 0,
        fastAnswers: 0,
        perfectLevels: 0,
        levelsCompleted: 0,
    });

    // Audio
    const correctSoundRef = useRef(null);
    const wrongSoundRef = useRef(null);
    const levelCompleteSoundRef = useRef(null);
    const winSoundRef = useRef(null);
    const overSoundRef = useRef(null);
    const bgMusicRef = useRef(null);

    // Timer
    const timerRef = useRef(null);

    // ============================================
    // INISIALISASI AUDIO
    // ============================================
    useEffect(() => {
        correctSoundRef.current = new Audio('/sounds/coin.mp3');
        wrongSoundRef.current = new Audio('/sounds/boom.mp3');
        levelCompleteSoundRef.current = new Audio('/sounds/win.mp3');
        winSoundRef.current = new Audio('/sounds/win.mp3');
        overSoundRef.current = new Audio('/sounds/over.mp3');
        bgMusicRef.current = new Audio('/sounds/music-game.mp3');
        bgMusicRef.current.loop = true;
        bgMusicRef.current.volume = 0.25;

        if (correctSoundRef.current) correctSoundRef.current.volume = 0.5;
        if (wrongSoundRef.current) wrongSoundRef.current.volume = 0.4;
        if (levelCompleteSoundRef.current) levelCompleteSoundRef.current.volume = 0.5;
        if (winSoundRef.current) winSoundRef.current.volume = 0.6;
        if (overSoundRef.current) overSoundRef.current.volume = 0.6;
    }, []);

    // ============================================
    // BACKSOUND
    // ============================================
    useEffect(() => {
        if (!bgMusicRef.current) return;
        if (gameState === 'playing' || gameState === 'levelComplete') {
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

    // ============================================
    // TIMER SOAL
    // ============================================
    useEffect(() => {
        if (gameState !== 'playing' || isAnswered) return;

        timerRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    handleTimeout();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [gameState, currentQuestionIndex, isAnswered]);

    // ============================================
    // HANDLE TIMEOUT
    // ============================================
    const handleTimeout = useCallback(() => {
        setIsAnswered(true);

        totalTimeRef.current += TIME_PER_QUESTION;
        setTotalTimeSpent(totalTimeRef.current);

        if (wrongSoundRef.current) {
            wrongSoundRef.current.currentTime = 0;
            wrongSoundRef.current.play().catch(() => {});
        }

        const newLives = lives - 1;
        setLives(newLives);
        setScore((prev) => prev + POINTS.WRONG);
        setStats((prev) => ({
            ...prev,
            totalTimeouts: prev.totalTimeouts + 1,
        }));

        setWrongAnswersInLevel((prev) => prev + 1);
        wrongAnswersRef.current += 1;

        setTimeout(() => {
            if (newLives <= 0) {
                endGame('lost');
            } else {
                goToNextQuestion();
            }
        }, 1500);
    }, [lives]);

    // ============================================
    // HANDLE ANSWER
    // ============================================
    const handleAnswer = (index) => {
        if (isAnswered) return;

        setIsAnswered(true);
        setSelectedAnswer(index);

        if (timerRef.current) clearInterval(timerRef.current);

        const timeUsed = TIME_PER_QUESTION - timeLeft;
        totalTimeRef.current += timeUsed;
        setTotalTimeSpent(totalTimeRef.current);

        const currentQuestion = questions[currentQuestionIndex];
        const isCorrect = index === currentQuestion.correct;

        if (isCorrect) {
            if (correctSoundRef.current) {
                correctSoundRef.current.currentTime = 0;
                correctSoundRef.current.play().catch(() => {});
            }

            let pointsEarned = POINTS.CORRECT;
            if (timeLeft > 10) {
                pointsEarned += POINTS.FAST_ANSWER;
                setStats((prev) => ({
                    ...prev,
                    fastAnswers: prev.fastAnswers + 1,
                }));
            }

            setScore((prev) => prev + pointsEarned);
            setStats((prev) => ({
                ...prev,
                totalCorrect: prev.totalCorrect + 1,
            }));

            setTimeout(() => {
                goToNextQuestion();
            }, 1200);
        } else {
            if (wrongSoundRef.current) {
                wrongSoundRef.current.currentTime = 0;
                wrongSoundRef.current.play().catch(() => {});
            }

            const newLives = lives - 1;
            setLives(newLives);
            setScore((prev) => prev + POINTS.WRONG);
            setStats((prev) => ({
                ...prev,
                totalWrong: prev.totalWrong + 1,
            }));

            setWrongAnswersInLevel((prev) => prev + 1);
            wrongAnswersRef.current += 1;

            setTimeout(() => {
                if (newLives <= 0) {
                    endGame('lost');
                } else {
                    goToNextQuestion();
                }
            }, 1500);
        }
    };

    // ============================================
    // GO TO NEXT QUESTION
    // ============================================
    const goToNextQuestion = () => {
        if (currentQuestionIndex + 1 < QUESTIONS_PER_LEVEL) {
            setCurrentQuestionIndex((prev) => prev + 1);
            setTimeLeft(TIME_PER_QUESTION);
            setSelectedAnswer(null);
            setIsAnswered(false);
        } else {
            completeLevel();
        }
    };

    // ============================================
    // COMPLETE LEVEL
    // ============================================
    const completeLevel = () => {
        const hasWrongAnswers = wrongAnswersRef.current > 0;

        if (hasWrongAnswers) {
            if (wrongSoundRef.current) {
                wrongSoundRef.current.currentTime = 0;
                wrongSoundRef.current.play().catch(() => {});
            }
            setGameState('levelComplete');
            setShowLevelFailed(true);
            return;
        }

        let levelPoints = POINTS.LEVEL_COMPLETE;
        levelPoints += POINTS.PERFECT_LEVEL;
        setStats((prev) => ({
            ...prev,
            perfectLevels: prev.perfectLevels + 1,
        }));

        setScore((prev) => prev + levelPoints);
        setStats((prev) => ({
            ...prev,
            levelsCompleted: prev.levelsCompleted + 1,
        }));

        if (levelCompleteSoundRef.current) {
            levelCompleteSoundRef.current.currentTime = 0;
            levelCompleteSoundRef.current.play().catch(() => {});
        }

        setGameState('levelComplete');
        setShowLevelComplete(true);
    };

    // ============================================
    // RETRY LEVEL
    // ============================================
    const retryLevel = () => {
        setShowLevelFailed(false);
        const newQuestions = generateQuestionsForLevel(currentLevel);
        setQuestions(newQuestions);
        setCurrentQuestionIndex(0);
        setWrongAnswersInLevel(0);
        wrongAnswersRef.current = 0;
        setTimeLeft(TIME_PER_QUESTION);
        setSelectedAnswer(null);
        setIsAnswered(false);
        setGameState('playing');
    };

    // ============================================
    // NEXT LEVEL
    // ============================================
    const nextLevel = () => {
        setShowLevelComplete(false);

        if (currentLevel >= TOTAL_LEVELS) {
            endGame('won');
        } else {
            const nextLvl = currentLevel + 1;
            const newQuestions = generateQuestionsForLevel(nextLvl);

            setCurrentLevel(nextLvl);
            setUnlockedLevels((prev) => Math.max(prev, nextLvl));
            setQuestions(newQuestions);
            setCurrentQuestionIndex(0);
            setWrongAnswersInLevel(0);
            wrongAnswersRef.current = 0;
            setTimeLeft(TIME_PER_QUESTION);
            setSelectedAnswer(null);
            setIsAnswered(false);
            setGameState('playing');
        }
    };

    // ============================================
    // END GAME
    // ============================================
    const endGame = (result) => {
        if (bgMusicRef.current) bgMusicRef.current.pause();

        if (result === 'won') {
            if (winSoundRef.current) {
                winSoundRef.current.currentTime = 0;
                winSoundRef.current.play().catch(() => {});
            }
            setGameState('won');
            setTimeout(() => setShowWinModal(true), 300);
        } else {
            if (overSoundRef.current) {
                overSoundRef.current.currentTime = 0;
                overSoundRef.current.play().catch(() => {});
            }
            setGameState('lost');
            setTimeout(() => setShowLoseModal(true), 300);
        }
    };

    // ============================================
    // START LEVEL
    // ============================================
    const startLevel = (levelNumber) => {
        const newQuestions = generateQuestionsForLevel(levelNumber);

        setCurrentLevel(levelNumber);
        setQuestions(newQuestions);
        setCurrentQuestionIndex(0);
        setWrongAnswersInLevel(0);
        wrongAnswersRef.current = 0;
        setTimeLeft(TIME_PER_QUESTION);
        setSelectedAnswer(null);
        setIsAnswered(false);
        setGameState('playing');
    };

    // ============================================
    // INIT GAME
    // ============================================
    const initGame = () => {
        setLives(MAX_LIVES);
        setScore(0);
        setCurrentLevel(1);
        setUnlockedLevels(1);
        setTotalTimeSpent(0);
        totalTimeRef.current = 0;
        setStats({
            totalCorrect: 0,
            totalWrong: 0,
            totalTimeouts: 0,
            fastAnswers: 0,
            perfectLevels: 0,
            levelsCompleted: 0,
        });
        wrongAnswersRef.current = 0;
        startLevel(1);
    };

    // ============================================
    // HANDLERS
    // ============================================
    const handlePlayAgain = () => {
        setShowWinModal(false);
        setShowLoseModal(false);
        setShowResetConfirm(false);
        setShowLevelComplete(false);
        setShowLevelFailed(false);
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
    // RENDER LIVES
    // ============================================
    const renderLives = () => {
        return (
            <div className="flex items-center gap-1">
                {Array(MAX_LIVES).fill(0).map((_, i) => (
                    <img
                        key={i}
                        src="/images/game4/nyawa.png"
                        alt="Nyawa"
                        className={`w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 object-contain transition-all duration-300 ${
                            i < lives ? 'opacity-100 scale-100' : 'opacity-30 scale-75 grayscale'
                        }`}
                        style={{
                            filter: i < lives
                                ? 'drop-shadow(0 0 6px rgba(255, 0, 0, 0.9))'
                                : 'none',
                        }}
                    />
                ))}
            </div>
        );
    };

    // ============================================
    // RENDER PROGRESS BAR
    // ============================================
    const renderProgressBar = () => {
        return (
            <div className="w-full flex items-center gap-1 sm:gap-1.5">
                {Array(TOTAL_LEVELS).fill(0).map((_, i) => {
                    const levelNum = i + 1;
                    const isCompleted = levelNum < currentLevel;
                    const isCurrent = levelNum === currentLevel;

                    return (
                        <div
                            key={i}
                            className="flex-1 h-1.5 sm:h-2 rounded-full transition-all duration-300"
                            style={{
                                background: isCompleted
                                    ? 'linear-gradient(90deg, #22C55E 0%, #15803D 100%)'
                                    : isCurrent
                                        ? 'linear-gradient(90deg, #FFD700 0%, #DAA520 100%)'
                                        : 'rgba(255, 255, 255, 0.1)',
                                boxShadow: isCurrent
                                    ? '0 0 10px rgba(255, 215, 0, 0.6)'
                                    : 'none',
                            }}
                        />
                    );
                })}
            </div>
        );
    };

    // ============================================
    // RENDER IDLE SCREEN (BARU)
    // ============================================
    const renderIdle = () => (
        <div className="w-full max-w-md flex flex-col items-center gap-4 sm:gap-6 pt-2">
            {/* Logo dari assets */}
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48">
                <div className="absolute inset-0 rounded-full animate-pulse"
                    style={{
                        background: 'radial-gradient(circle, rgba(147, 51, 234, 0.5) 0%, transparent 70%)',
                        filter: 'blur(20px)',
                        transform: 'scale(1.4)',
                    }} />
                <img src="/images/assets/game4.png" alt="Pirate Code Quest"
                    className="relative w-full h-full object-contain animate-[float_3s_ease-in-out_infinite] rounded-[22%]"
                    style={{ filter: 'drop-shadow(0 0 30px rgba(147, 51, 234, 0.8))' }} />
            </div>

            <div className="text-center px-4">
                <p className="text-white/70 text-sm sm:text-base max-w-sm mx-auto leading-relaxed">
                    Buka <span className="text-yellow-400 font-bold">8 pulau</span> dengan menjawab soal seputar <span className="text-yellow-400 font-bold">Web Development</span>!
                    <br />
                    Kamu punya <span className="text-red-400 font-bold">3 nyawa</span>. Jawab semua dengan benar untuk lanjut!
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
                <button onClick={() => setGameState('map')}
                    className="w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-base transition-all hover:scale-105 active:scale-95"
                    style={{
                        background: 'linear-gradient(135deg, #FFD700 0%, #DAA520 100%)',
                        color: '#1a120e',
                        boxShadow: '0 4px 20px rgba(255, 215, 0, 0.5)',
                    }}>
                    Mulai dari Level 1
                </button>
            </div>
        </div>
    );

    // ============================================
    // RENDER MAP SCREEN (PETA 8 LEVEL)
    // ============================================
    const renderMap = () => {
        return (
            <div className="w-full max-w-3xl flex flex-col items-center gap-4 sm:gap-6 pt-2">
                {/* Tombol Kembali */}
                <div className="w-full flex justify-start">
                    <button
                        onClick={() => setGameState('idle')}
                        className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm text-white/60 hover:text-white transition-all hover:bg-white/10 border border-white/20"
                    >
                        ← Kembali
                    </button>
                </div>

                <div className="text-center px-4">
                    <h2 className="font-display-hero text-2xl sm:text-3xl md:text-4xl font-black text-yellow-400 mb-2"
                        style={{ textShadow: '0 0 20px rgba(255, 215, 0, 0.6)' }}>
                        Pilih Level
                    </h2>
                    <p className="text-white/60 text-xs sm:text-sm md:text-base">
                        Buka 8 pulau dengan menguasai dunia coding!
                    </p>
                </div>

                <div
                    className="relative w-full aspect-[4/3] sm:aspect-[16/10] md:aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl"
                    style={{
                        background: 'linear-gradient(135deg, #1a3a5c 0%, #2c5f8a 50%, #4a90c2 100%)',
                        border: '3px solid rgba(255, 215, 0, 0.5)',
                        boxShadow: '0 0 40px rgba(255, 215, 0, 0.3)',
                    }}>
                    <img src="/images/game4/harta-tertutup.png" alt="Peta"
                        className="absolute inset-0 w-full h-full object-contain opacity-30 p-4 sm:p-8"
                        style={{ filter: 'brightness(0.6)' }} />
                    <div className="absolute inset-0 bg-black/40"></div>

                    <div className="absolute inset-0 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 md:gap-4 p-3 sm:p-4 md:p-6">
                        {Object.entries(QUESTION_BANK).map(([levelNum, levelData]) => {
                            const level = parseInt(levelNum);
                            const isUnlocked = level <= unlockedLevels;

                            return (
                                <button key={level} onClick={() => isUnlocked && startLevel(level)} disabled={!isUnlocked}
                                    className={`relative rounded-lg sm:rounded-xl p-2 sm:p-3 transition-all duration-300 ${isUnlocked ? 'cursor-pointer hover:scale-105 active:scale-95' : 'cursor-not-allowed'}`}
                                    style={{
                                        background: isUnlocked
                                            ? `linear-gradient(135deg, ${levelData.color}40 0%, ${levelData.color}20 100%)`
                                            : 'rgba(30, 30, 30, 0.8)',
                                        border: isUnlocked ? `2px solid ${levelData.color}` : '2px solid rgba(100, 100, 100, 0.5)',
                                        boxShadow: isUnlocked ? `0 0 20px ${levelData.color}60` : 'none',
                                    }}>
                                    {isUnlocked ? (
                                        <>
                                            <div className="text-[8px] sm:text-[10px] font-bold uppercase tracking-wider mb-0.5 sm:mb-1"
                                                style={{ color: levelData.color }}>Level {level}</div>
                                            <div className="text-white font-bold text-[10px] sm:text-xs md:text-sm mb-0.5 sm:mb-1 leading-tight">
                                                {levelData.title}
                                            </div>
                                            <div className="text-white/50 text-[7px] sm:text-[9px] md:text-[10px] leading-tight">
                                                {levelData.subtitle}
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center gap-0.5 h-full">
                                            <span className="material-symbols-outlined text-gray-500" style={{ fontSize: '20px' }}>lock</span>
                                            <span className="text-gray-500 text-[8px] sm:text-[9px] md:text-[10px] font-bold">Terkunci</span>
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    };

    // ============================================
    // RENDER QUESTION SCREEN
    // ============================================
    const renderQuestion = () => {
        if (!questions[currentQuestionIndex]) return null;

        const currentQuestion = questions[currentQuestionIndex];
        const levelData = QUESTION_BANK[currentLevel];

        return (
            <div className="w-full max-w-3xl flex flex-col items-center gap-3 sm:gap-4 px-2 sm:px-0">
                <div
                    className="w-full flex items-center justify-between gap-2 sm:gap-4 p-2.5 sm:p-3 rounded-xl"
                    style={{
                        background: 'linear-gradient(135deg, rgba(139, 69, 19, 0.3) 0%, rgba(62, 39, 35, 0.3) 100%)',
                        border: '1px solid rgba(255, 215, 0, 0.3)',
                    }}
                >
                    <div className="flex flex-col items-start gap-0.5 sm:gap-1">
                        <span className="text-[9px] sm:text-[10px] md:text-xs text-yellow-400/80 uppercase tracking-wider font-bold">
                            Nyawa
                        </span>
                        {renderLives()}
                    </div>

                    <div className="flex flex-col items-center">
                        <span className="text-[9px] sm:text-[10px] md:text-xs text-yellow-400/80 uppercase tracking-wider font-bold">
                            Level {currentLevel}
                        </span>
                        <span
                            className="text-xs sm:text-sm md:text-base font-black"
                            style={{ color: levelData.color }}
                        >
                            {levelData.title}
                        </span>
                    </div>

                    <div className="flex flex-col items-end">
                        <span className="text-[9px] sm:text-[10px] md:text-xs text-yellow-400/80 uppercase tracking-wider font-bold">
                            Skor
                        </span>
                        <span
                            className="text-sm sm:text-lg md:text-xl font-black text-yellow-400"
                            style={{ textShadow: '0 0 10px rgba(255, 215, 0, 0.6)' }}
                        >
                            {score}
                        </span>
                    </div>
                </div>

                <div className="w-full">{renderProgressBar()}</div>

                <div className="w-full flex items-center gap-2 sm:gap-3">
                    <span className="material-symbols-outlined text-yellow-400 text-base sm:text-xl">
                        timer
                    </span>
                    <div
                        className="flex-1 h-2 sm:h-3 rounded-full overflow-hidden"
                        style={{ background: 'rgba(255, 255, 255, 0.1)' }}
                    >
                        <div
                            className="h-full transition-all duration-1000"
                            style={{
                                width: `${(timeLeft / TIME_PER_QUESTION) * 100}%`,
                                background: timeLeft <= 5
                                    ? 'linear-gradient(90deg, #DC2626 0%, #991B1B 100%)'
                                    : timeLeft <= 10
                                        ? 'linear-gradient(90deg, #F59E0B 0%, #D97706 100%)'
                                        : 'linear-gradient(90deg, #22C55E 0%, #15803D 100%)',
                            }}
                        />
                    </div>
                    <span
                        className={`text-sm sm:text-lg md:text-xl font-black min-w-[36px] text-right ${
                            timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-yellow-400'
                        }`}
                    >
                        {timeLeft}s
                    </span>
                </div>

                <div className="text-white/60 text-[10px] sm:text-xs md:text-sm font-bold">
                    Soal {currentQuestionIndex + 1} / {QUESTIONS_PER_LEVEL}
                </div>

                <div
                    className="w-full p-3.5 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl"
                    style={{
                        background: `linear-gradient(135deg, ${levelData.color}20 0%, ${levelData.color}10 100%)`,
                        border: `2px solid ${levelData.color}60`,
                        boxShadow: `0 0 30px ${levelData.color}30`,
                    }}
                >
                    <p className="text-white font-bold text-sm sm:text-base md:text-lg leading-relaxed text-center">
                        {currentQuestion.question}
                    </p>
                </div>

                <div className="w-full grid grid-cols-1 gap-2 sm:gap-2.5">
                    {currentQuestion.options.map((option, index) => {
                        const isSelected = selectedAnswer === index;
                        const isCorrect = index === currentQuestion.correct;

                        let bgColor = 'rgba(139, 69, 19, 0.4)';
                        let borderColor = 'rgba(255, 215, 0, 0.3)';
                        let textColor = 'white';
                        let shadow = 'none';

                        if (isAnswered) {
                            if (isCorrect) {
                                bgColor = 'linear-gradient(135deg, rgba(34, 197, 94, 0.8) 0%, rgba(21, 128, 61, 0.8) 100%)';
                                borderColor = '#22C55E';
                                textColor = 'white';
                                shadow = '0 0 20px rgba(34, 197, 94, 0.6)';
                            } else if (isSelected) {
                                bgColor = 'linear-gradient(135deg, rgba(220, 38, 38, 0.8) 0%, rgba(153, 27, 27, 0.8) 100%)';
                                borderColor = '#DC2626';
                                textColor = 'white';
                                shadow = '0 0 20px rgba(220, 38, 38, 0.6)';
                            }
                        }

                        return (
                            <button
                                key={index}
                                onClick={() => handleAnswer(index)}
                                disabled={isAnswered}
                                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3.5 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm md:text-base text-left transition-all flex items-center gap-2 sm:gap-3 ${
                                    !isAnswered
                                        ? 'hover:scale-[1.02] active:scale-95 cursor-pointer'
                                        : 'cursor-default'
                                }`}
                                style={{
                                    background: bgColor,
                                    border: `2px solid ${borderColor}`,
                                    color: textColor,
                                    boxShadow: shadow,
                                }}
                            >
                                <span
                                    className="shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center font-black text-[10px] sm:text-xs"
                                    style={{
                                        background: 'rgba(0, 0, 0, 0.3)',
                                        color: '#FFD700',
                                    }}
                                >
                                    {String.fromCharCode(65 + index)}
                                </span>
                                <span className="flex-1">{option}</span>
                                {isAnswered && isCorrect && (
                                    <span className="material-symbols-outlined text-white text-base sm:text-lg">
                                        check_circle
                                    </span>
                                )}
                                {isAnswered && isSelected && !isCorrect && (
                                    <span className="material-symbols-outlined text-white text-base sm:text-lg">
                                        cancel
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                <button
                    onClick={handleExit}
                    className="px-4 sm:px-6 py-2 rounded-lg text-xs sm:text-sm text-white/60 hover:text-white transition-all hover:bg-white/10 border border-white/20"
                >
                    ← Keluar Game
                </button>
            </div>
        );
    };

    // ============================================
    // RENDER UTAMA
    // ============================================
    return (
        <div className="w-full flex flex-col items-center gap-4 sm:gap-6 py-4 sm:py-6">
            <TutorialModal
                isOpen={showTutorial}
                onClose={() => setShowTutorial(false)}
            />

            {gameState === 'idle' && renderIdle()}
            {gameState === 'map' && renderMap()}
            {(gameState === 'playing' || gameState === 'levelComplete') && renderQuestion()}

            {/* MODAL LEVEL COMPLETE */}
            {showLevelComplete && (
                <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
                    <div
                        className="relative max-w-md w-full p-5 sm:p-6 md:p-8 rounded-2xl text-center animate-[zoom-in_0.5s_ease-out] my-auto"
                        style={{
                            background: `linear-gradient(135deg, ${QUESTION_BANK[currentLevel].color}30 0%, ${QUESTION_BANK[currentLevel].color}15 100%)`,
                            border: `2px solid ${QUESTION_BANK[currentLevel].color}`,
                            boxShadow: `0 0 50px ${QUESTION_BANK[currentLevel].color}60`,
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
                                lock_open
                            </span>
                        </div>
                        <h3
                            className="font-display-hero text-xl sm:text-2xl md:text-3xl font-black text-yellow-400 mb-2"
                            style={{ textShadow: '0 0 20px rgba(255, 215, 0, 0.8)' }}
                        >
                            LEVEL {currentLevel} SELESAI!
                        </h3>
                        <p className="text-white/80 text-xs sm:text-sm md:text-base mb-4">
                            Kamu berhasil membuka kunci{' '}
                            <span className="text-yellow-400 font-bold">
                                {QUESTION_BANK[currentLevel].title}
                            </span>
                            !
                        </p>

                        <div className="py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30 inline-block mb-3">
                            <span className="text-[10px] sm:text-xs text-yellow-400/80 uppercase tracking-wider font-bold block">
                                Skor Sekarang
                            </span>
                            <span className="text-xl sm:text-2xl md:text-3xl font-black text-yellow-400">
                                {score}
                            </span>
                        </div>

                        <div className="py-1.5 sm:py-2 px-3 rounded-lg bg-green-500/10 border border-green-500/30 inline-block mb-3 ml-2">
                            <span className="text-[10px] sm:text-xs text-green-400 font-bold">
                                PERFECT +{POINTS.PERFECT_LEVEL}
                            </span>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center mt-3 sm:mt-4">
                            <button
                                onClick={nextLevel}
                                className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold text-sm sm:text-base transition-all hover:scale-105 active:scale-95"
                                style={{
                                    background: 'linear-gradient(135deg, #FFD700 0%, #DAA520 100%)',
                                    color: '#1a120e',
                                    boxShadow: '0 4px 15px rgba(255, 215, 0, 0.4)',
                                }}
                            >
                                {currentLevel >= TOTAL_LEVELS
                                    ? 'Lihat Hasil Akhir'
                                    : `Level ${currentLevel + 1} →`}
                            </button>
                            <button
                                onClick={confirmExit}
                                className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold text-sm sm:text-base transition-all hover:scale-105 active:scale-95 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 border border-white/20"
                            >
                                Keluar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL LEVEL FAILED */}
            {showLevelFailed && (
                <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
                    <div
                        className="relative max-w-md w-full p-5 sm:p-6 md:p-8 rounded-2xl text-center animate-[zoom-in_0.5s_ease-out] my-auto"
                        style={{
                            background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.3) 0%, rgba(127, 29, 29, 0.2) 100%)',
                            border: '2px solid rgba(220, 38, 38, 0.6)',
                            boxShadow: '0 0 50px rgba(220, 38, 38, 0.5)',
                        }}
                    >
                        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                            <span
                                className="material-symbols-outlined text-red-500"
                                style={{
                                    fontSize: 'clamp(48px, 10vw, 80px)',
                                    filter: 'drop-shadow(0 0 25px rgba(255, 0, 0, 0.9))',
                                }}
                            >
                                replay
                            </span>
                        </div>
                        <h3
                            className="font-display-hero text-xl sm:text-2xl md:text-3xl font-black text-red-500 mb-2"
                            style={{ textShadow: '0 0 20px rgba(255, 0, 0, 0.8)' }}
                        >
                            ULANGI LEVEL {currentLevel}!
                        </h3>
                        <p className="text-white/80 text-xs sm:text-sm md:text-base mb-4 leading-relaxed">
                            Kamu harus menjawab{' '}
                            <span className="text-green-400 font-bold">
                                SEMUA soal dengan BENAR
                            </span>{' '}
                            untuk membuka level berikutnya.
                            <br />
                            <span className="text-yellow-400 font-bold">
                                Nyawa tersisa: {lives}
                            </span>
                        </p>

                        <div className="py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg bg-red-500/10 border border-red-500/30 inline-block mb-4">
                            <span className="text-[10px] sm:text-xs text-red-400/80 uppercase tracking-wider font-bold block">
                                Jawaban Salah
                            </span>
                            <span className="text-xl sm:text-2xl font-black text-red-400">
                                {wrongAnswersRef.current}
                            </span>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
                            <button
                                onClick={retryLevel}
                                className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold text-sm sm:text-base transition-all hover:scale-105 active:scale-95"
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
                                className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold text-sm sm:text-base transition-all hover:scale-105 active:scale-95 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 border border-white/20"
                            >
                                Keluar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL MENANG */}
            {showWinModal && (
                <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
                    <div
                        className="relative max-w-md w-full p-5 sm:p-6 md:p-8 rounded-2xl text-center animate-[zoom-in_0.5s_ease-out] my-auto"
                        style={{
                            background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.2) 0%, rgba(218, 165, 32, 0.1) 100%)',
                            border: '2px solid rgba(255, 215, 0, 0.6)',
                            boxShadow: '0 0 50px rgba(255, 215, 0, 0.5)',
                        }}
                    >
                        <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                            <img
                                src="/images/game4/HartaKarun.png"
                                alt="Harta Karun"
                                className="w-full h-full object-contain animate-bounce"
                                style={{
                                    filter: 'drop-shadow(0 0 30px rgba(255, 215, 0, 1))',
                                }}
                            />
                        </div>
                        <h3
                            className="font-display-hero text-2xl sm:text-3xl md:text-4xl font-black text-yellow-400 mb-2"
                            style={{ textShadow: '0 0 20px rgba(255, 215, 0, 0.8)' }}
                        >
                            KAPTEN KODE!
                        </h3>
                        <p className="text-white/80 text-xs sm:text-sm md:text-base mb-4">
                            Kamu berhasil membuka semua 8 pulau!
                        </p>

                        <div className="grid grid-cols-2 gap-2 mb-4">
                            <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                                <div className="text-[10px] sm:text-xs text-white/60">Benar</div>
                                <div className="text-base sm:text-lg font-black text-green-400">
                                    {stats.totalCorrect}
                                </div>
                            </div>
                            <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                                <div className="text-[10px] sm:text-xs text-white/60">Salah</div>
                                <div className="text-base sm:text-lg font-black text-red-400">
                                    {stats.totalWrong}
                                </div>
                            </div>
                            <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                                <div className="text-[10px] sm:text-xs text-white/60">Perfect</div>
                                <div className="text-base sm:text-lg font-black text-yellow-400">
                                    {stats.perfectLevels}
                                </div>
                            </div>
                            <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                                <div className="text-[10px] sm:text-xs text-white/60">Total Waktu</div>
                                <div className="text-base sm:text-lg font-black text-cyan-400">
                                    {formatTotalTime(totalTimeSpent)}
                                </div>
                            </div>
                        </div>

                        <div className="py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30 inline-block mb-4">
                            <span className="text-[10px] sm:text-xs text-yellow-400/80 uppercase tracking-wider font-bold block">
                                Skor Akhir
                            </span>
                            <span className="text-xl sm:text-2xl md:text-3xl font-black text-yellow-400">
                                {score}
                            </span>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
                            <button
                                onClick={handlePlayAgain}
                                className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold text-sm sm:text-base transition-all hover:scale-105 active:scale-95"
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
                                className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold text-sm sm:text-base transition-all hover:scale-105 active:scale-95 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 border border-white/20"
                            >
                                Keluar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL KALAH */}
            {showLoseModal && (
                <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
                    <div
                        className="relative max-w-md w-full p-5 sm:p-6 md:p-8 rounded-2xl text-center animate-[zoom-in_0.5s_ease-out] my-auto"
                        style={{
                            background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.2) 0%, rgba(127, 29, 29, 0.15) 100%)',
                            border: '2px solid rgba(220, 38, 38, 0.5)',
                            boxShadow: '0 0 50px rgba(220, 38, 38, 0.4)',
                        }}
                    >
                        <img
                            src="/images/game4/harta-tertutup.png"
                            alt="Kalah"
                            className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 mx-auto object-contain mb-3 sm:mb-4 opacity-70"
                            style={{ filter: 'drop-shadow(0 0 25px rgba(255, 0, 0, 0.9))' }}
                        />
                        <h3
                            className="font-display-hero text-2xl sm:text-3xl md:text-4xl font-black text-red-500 mb-2"
                            style={{ textShadow: '0 0 20px rgba(255, 0, 0, 0.8)' }}
                        >
                            TENGGELAM!
                        </h3>
                        <p className="text-white/80 text-xs sm:text-sm md:text-base mb-4">
                            Nyawa habis di Level {currentLevel}!
                        </p>

                        <div className="grid grid-cols-2 gap-2 mb-4">
                            <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                                <div className="text-[10px] sm:text-xs text-white/60">Benar</div>
                                <div className="text-base sm:text-lg font-black text-green-400">
                                    {stats.totalCorrect}
                                </div>
                            </div>
                            <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                                <div className="text-[10px] sm:text-xs text-white/60">Salah</div>
                                <div className="text-base sm:text-lg font-black text-red-400">
                                    {stats.totalWrong + stats.totalTimeouts}
                                </div>
                            </div>
                            <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                                <div className="text-[10px] sm:text-xs text-white/60">Level</div>
                                <div className="text-base sm:text-lg font-black text-yellow-400">
                                    {stats.levelsCompleted}/8
                                </div>
                            </div>
                            <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                                <div className="text-[10px] sm:text-xs text-white/60">Total Waktu</div>
                                <div className="text-base sm:text-lg font-black text-cyan-400">
                                    {formatTotalTime(totalTimeSpent)}
                                </div>
                            </div>
                        </div>

                        <div className="py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg bg-red-500/10 border border-red-500/30 inline-block mb-4">
                            <span className="text-[10px] sm:text-xs text-red-400/80 uppercase tracking-wider font-bold block">
                                Skor Akhir
                            </span>
                            <span className="text-xl sm:text-2xl md:text-3xl font-black text-red-400">
                                {score}
                            </span>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
                            <button
                                onClick={handlePlayAgain}
                                className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold text-sm sm:text-base transition-all hover:scale-105 active:scale-95"
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
                                className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold text-sm sm:text-base transition-all hover:scale-105 active:scale-95 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 border border-white/20"
                            >
                                Keluar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL KONFIRMASI EXIT */}
            {showResetConfirm && (
                <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div
                        className="relative max-w-sm w-full p-5 sm:p-6 rounded-2xl text-center"
                        style={{
                            background: 'linear-gradient(135deg, rgba(30, 30, 30, 0.95) 0%, rgba(20, 20, 20, 0.95) 100%)',
                            border: '1px solid rgba(255, 215, 0, 0.3)',
                        }}
                    >
                        <h3 className="text-lg sm:text-xl font-bold text-white mb-3">
                            Keluar dari Game?
                        </h3>
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

export default PirateCodeQuest;