import { Link } from 'react-router-dom';
import { useEffect, useState, useRef, useCallback } from 'react';
import {
    waliKelasData,
    pengurusData,
    muridData,
    galleryData,
    projectsData
} from '../data/data';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Virtual, Autoplay, EffectCoverflow } from 'swiper/modules';

import { DraggableContainer, GridBody, GridItem } from '../components/DragGallery';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

import TreasureHunt from '../components/TreasureHunt';
import MemoryGame from '../components/MemoryGame';
import MemoryOfTheSea from '../components/MemoryOfTheSea';
import PirateCodeQuest from '../components/PirateCodeQuest';
import PieceOfTheMap from '../components/PieceOfTheMap';
import KrakenSmash from '../components/KrakenSmash';
import KataKataBuku from '../components/KataKataBuku';

// ============================================
// KOMPONEN SCROLL REVEAL
// ============================================
const ScrollReveal = ({
    children,
    animation = 'fade-up',
    delay = 0,
    duration = 800,
    threshold = 0.15,
    className = '',
    as: Tag = 'div'
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold, rootMargin: '0px 0px -50px 0px' }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [threshold]);

    const getAnimationStyle = () => {
        const base = {
            opacity: isVisible ? 1 : 0,
            transition: `opacity ${duration}ms cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms`,
        };
        switch (animation) {
            case 'fade-up':
                return { ...base, transform: isVisible ? 'translateY(0)' : 'translateY(40px)' };
            case 'fade-down':
                return { ...base, transform: isVisible ? 'translateY(0)' : 'translateY(-40px)' };
            case 'fade-left':
                return { ...base, transform: isVisible ? 'translateX(0)' : 'translateX(40px)' };
            case 'fade-right':
                return { ...base, transform: isVisible ? 'translateX(0)' : 'translateX(-40px)' };
            case 'zoom-in':
                return { ...base, transform: isVisible ? 'scale(1)' : 'scale(0.92)' };
            case 'zoom-out':
                return { ...base, transform: isVisible ? 'scale(1)' : 'scale(1.08)' };
            case 'flip-up':
                return {
                    ...base,
                    transform: isVisible ? 'perspective(1000px) rotateX(0deg)' : 'perspective(1000px) rotateX(20deg)',
                    transformOrigin: 'center bottom',
                };
            case 'fade':
            default:
                return base;
        }
    };

    return (
        <Tag ref={ref} className={className} style={getAnimationStyle()}>
            {children}
        </Tag>
    );
};

// ============================================
// SCROLL INDICATOR — 🔥 DIPERBESAR UNTUK MOBILE & TABLET
// ============================================
const ScrollIndicator = () => {
    const [activeSection, setActiveSection] = useState('home');
    const [isVisible, setIsVisible] = useState(false);

    const sections = [
        { id: 'home', label: 'Beranda', icon: 'home' },
        { id: 'struktur-wrapper', label: 'Struktur', icon: 'account_tree' },
        { id: 'murid', label: 'Daftar Murid', icon: 'groups' },
        { id: 'projects', label: 'Projects', icon: 'code' },
        { id: 'social', label: 'Social Media', icon: 'share' },
        { id: 'gallery', label: 'Gallery', icon: 'photo_library' },
        { id: 'kata-kata', label: 'Kata Kata', icon: 'auto_stories' },
    ];

    useEffect(() => {
        const handleScroll = () => {
            setIsVisible(window.scrollY > 200);
        };
        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: '-40% 0px -50% 0px',
            threshold: 0,
        };

        const handleIntersect = (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        };

        const observer = new IntersectionObserver(handleIntersect, observerOptions);

        sections.forEach((section) => {
            const el = document.getElementById(section.id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    const scrollToSection = (id) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div
            className={`fixed right-2.5 xs:right-3 sm:right-4 md:right-5 lg:right-6 top-24 xs:top-28 sm:top-32 md:top-32 z-[80] transition-all duration-500 ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8 pointer-events-none'
            }`}
        >
            <div
                className="relative flex flex-col items-center gap-2.5 xs:gap-3 sm:gap-3 md:gap-3 py-3 xs:py-3.5 sm:py-3.5 md:py-3 px-1.5 xs:px-2 sm:px-2 md:px-2 rounded-full backdrop-blur-md"
                style={{
                    background: 'linear-gradient(180deg, rgba(30, 20, 12, 0.85) 0%, rgba(20, 12, 8, 0.85) 100%)',
                    border: '1.5px solid rgba(212, 168, 83, 0.4)',
                    boxShadow:
                        '0 0 20px rgba(212, 168, 83, 0.2), inset 0 0 15px rgba(212, 168, 83, 0.08)',
                }}
            >
                {/* Tali dekoratif atas */}
                <div
                    className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-6 xs:w-7 sm:w-7 h-[2px] rounded-full"
                    style={{
                        background: 'linear-gradient(90deg, transparent, #d4a853, transparent)',
                    }}
                />

                {/* Dots */}
                {sections.map((section) => {
                    const isActive = activeSection === section.id;
                    return (
                        <button
                            key={section.id}
                            onClick={() => scrollToSection(section.id)}
                            className="group relative flex items-center justify-center transition-all duration-300 p-0.5"
                            aria-label={`Scroll ke ${section.label}`}
                        >
                            {/* Tooltip Label — hanya di lg ke atas */}
                            <div
                                className="absolute right-full mr-3 xs:mr-4 sm:mr-4 px-2.5 xs:px-3 sm:px-3 py-1 xs:py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300 pointer-events-none hidden lg:block"
                                style={{
                                    background:
                                        'linear-gradient(135deg, #2e261b 0%, #1e1a15 100%)',
                                    border: '1px solid rgba(212, 168, 83, 0.5)',
                                    boxShadow:
                                        '0 4px 15px rgba(0, 0, 0, 0.5), 0 0 15px rgba(212, 168, 83, 0.2)',
                                }}
                            >
                                <div className="flex items-center gap-1.5">
                                    <span
                                        className="material-symbols-outlined text-[14px]"
                                        style={{ color: '#d4a853' }}
                                    >
                                        {section.icon}
                                    </span>
                                    <span
                                        className="font-serif text-[11px] tracking-wider uppercase font-bold"
                                        style={{ color: '#e5be6d' }}
                                    >
                                        {section.label}
                                    </span>
                                </div>
                                <div
                                    className="absolute left-full top-1/2 -translate-y-1/2 w-0 h-0"
                                    style={{
                                        borderTop: '5px solid transparent',
                                        borderBottom: '5px solid transparent',
                                        borderLeft: '5px solid rgba(212, 168, 83, 0.5)',
                                    }}
                                />
                            </div>

                            {/* 🔥 Dot — DIPERBESAR di mobile & tablet, normal di desktop */}
                            <span
                                className={`block rounded-full transition-all duration-500 relative ${
                                    isActive
                                        ? 'w-5 h-5 xs:w-5 xs:h-5 sm:w-5 sm:h-5 md:w-5 md:h-5 lg:w-4 lg:h-4'
                                        : 'w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-3.5 sm:h-3.5 md:w-3.5 md:h-3.5 lg:w-2.5 lg:h-2.5'
                                }`}
                                style={{
                                    background: isActive
                                        ? 'radial-gradient(circle at 30% 30%, #ffe88a 0%, #ffd700 50%, #d4a853 100%)'
                                        : 'rgba(212, 168, 83, 0.35)',
                                    boxShadow: isActive
                                        ? '0 0 12px rgba(255, 215, 0, 0.9), 0 0 20px rgba(255, 215, 0, 0.5), inset 0 0 5px rgba(255, 255, 255, 0.5)'
                                        : 'none',
                                    border: isActive
                                        ? '1px solid rgba(255, 232, 138, 0.8)'
                                        : '1px solid rgba(212, 168, 83, 0.5)',
                                }}
                            >
                                {isActive && (
                                    <span
                                        className="absolute inset-[-3px] xs:inset-[-4px] sm:inset-[-4px] rounded-full border animate-[spin_4s_linear_infinite]"
                                        style={{
                                            borderColor: 'rgba(212, 168, 83, 0.6)',
                                            borderTopColor: 'transparent',
                                            borderLeftColor: 'transparent',
                                        }}
                                    />
                                )}
                            </span>
                        </button>
                    );
                })}

                {/* Tali dekoratif bawah */}
                <div
                    className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-6 xs:w-7 sm:w-7 h-[2px] rounded-full"
                    style={{
                        background: 'linear-gradient(90deg, transparent, #d4a853, transparent)',
                    }}
                />
            </div>
        </div>
    );
};

// ============================================
// LAZY IMAGE
// ============================================
const LazyImage = ({ src, alt, className, loading = 'lazy', ...props }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const imgRef = useRef(null);
    const placeholderRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsInView(true);
                        observer.disconnect();
                    }
                });
            },
            { rootMargin: '200px', threshold: 0.01 }
        );
        if (placeholderRef.current) observer.observe(placeholderRef.current);
        return () => observer.disconnect();
    }, []);

    const handleLoad = useCallback(() => { setIsLoaded(true); }, []);

    return (
        <div ref={placeholderRef} className="relative w-full h-full">
            {!isLoaded && (
                <div className="absolute inset-0 bg-surface-container-high animate-pulse rounded-lg" />
            )}
            {isInView && (
                <img
                    ref={imgRef}
                    src={src}
                    alt={alt}
                    className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}
                    loading="lazy"
                    onLoad={handleLoad}
                    {...props}
                />
            )}
        </div>
    );
};

// ============================================
// LAZY TIKTOK EMBED
// ============================================
const LazyTikTokEmbed = ({ videoId, title, className = '' }) => {
    const [isInView, setIsInView] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsInView(true);
                        observer.disconnect();
                    }
                });
            },
            { rootMargin: '200px', threshold: 0.1 }
        );
        if (containerRef.current) observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    const handleIframeLoad = useCallback(() => { setIsLoaded(true); }, []);

    return (
        <div
            ref={containerRef}
            className={`bg-surface-container rounded-xl p-3 shadow-sm overflow-hidden w-full ${className}`}
        >
            <div className="relative w-full" style={{ paddingBottom: '177.78%' }}>
                {!isLoaded && isInView && (
                    <div className="absolute inset-0 bg-surface-container-high animate-pulse rounded-lg flex items-center justify-center">
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-12 h-12 rounded-full bg-secondary/20 animate-bounce" />
                            <span className="text-on-surface-variant/60 text-sm font-label-code">
                                Loading TikTok...
                            </span>
                        </div>
                    </div>
                )}
                {isInView && (
                    <iframe
                        src={`https://www.tiktok.com/embed/v2/${videoId}?loop=1&autoplay=0`}
                        className={`absolute top-0 left-0 w-full h-full rounded-lg transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                        frameBorder="0"
                        scrolling="no"
                        allowFullScreen
                        allow="autoplay; encrypted-media; fullscreen"
                        title={title}
                        loading="lazy"
                        onLoad={handleIframeLoad}
                    />
                )}
            </div>
        </div>
    );
};

// ============================================
// LAZY VIDEO BACKGROUND
// ============================================
const LazyVideoBackground = ({ src, poster, className = '', children }) => {
    const [isInView, setIsInView] = useState(false);
    const videoRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsInView(true);
                        observer.disconnect();
                    }
                });
            },
            { rootMargin: '50px', threshold: 0.01 }
        );
        if (containerRef.current) observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (isInView && videoRef.current) {
            videoRef.current.play().catch(() => {
                console.log('Autoplay blocked, waiting for user interaction');
            });
        }
    }, [isInView]);

    return (
        <div ref={containerRef} className={`relative ${className}`}>
            {isInView ? (
                <video
                    ref={videoRef}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                    poster={poster}
                >
                    <source src={src} type="video/mp4" />
                </video>
            ) : (
                <div className="w-full h-full bg-surface-container-high animate-pulse" />
            )}
            {children}
        </div>
    );
};

// ============================================
// 🔥 FLOATING GAME BUTTON — DIPERBESAR UNTUK MOBILE & TABLET
// ============================================
const FloatingGameButton = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="fixed bottom-5 right-4 xs:bottom-6 xs:right-5 sm:bottom-7 sm:right-6 md:bottom-8 md:right-7 lg:bottom-8 lg:right-8 z-[90] group cursor-pointer"
            aria-label="Buka Mini Games"
        >
            <div
                className="absolute inset-0 rounded-full animate-pulse"
                style={{
                    background: 'radial-gradient(circle, rgba(255, 215, 0, 0.6) 0%, rgba(255, 215, 0, 0.3) 40%, transparent 70%)',
                    filter: 'blur(20px)',
                    transform: 'scale(2)',
                }}
            />
            <div
                className="absolute inset-0 rounded-full"
                style={{
                    background: 'radial-gradient(circle, rgba(255, 215, 0, 0.8) 0%, rgba(255, 180, 0, 0.4) 50%, transparent 80%)',
                    filter: 'blur(12px)',
                    transform: 'scale(1.6)',
                    animation: 'pulse-glow 2s ease-in-out infinite',
                }}
            />
            <div
                className="absolute inset-0 rounded-full border-4 border-yellow-400/50"
                style={{
                    transform: 'scale(1.3)',
                    animation: 'spin-slow 4s linear infinite',
                    borderTopColor: 'transparent',
                    borderLeftColor: 'transparent',
                }}
            />
            {/* 🔥 Tombol diperbesar di mobile & tablet, normal di desktop */}
            <div className="relative w-18 h-18 xs:w-20 xs:h-20 sm:w-20 sm:h-20 md:w-20 md:h-20 lg:w-20 lg:h-20 flex items-center justify-center">
                <div
                    className="absolute inset-0 rounded-full"
                    style={{
                        background: 'radial-gradient(circle at 30% 30%, #FFE88A 0%, #FFD700 40%, #DAA520 70%, #B8860B 100%)',
                        boxShadow: '0 0 20px rgba(255, 215, 0, 0.8), 0 0 40px rgba(255, 215, 0, 0.5), inset 0 0 15px rgba(255, 255, 255, 0.3)',
                    }}
                />
                <img
                    src="/images/assets/coin.png"
                    alt="Mini Games"
                    className="relative w-full h-full object-contain p-2 drop-shadow-2xl group-hover:scale-110 transition-transform duration-300 group-active:scale-95"
                    style={{ filter: 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.8))' }}
                />
            </div>
            <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap hidden sm:block">
                <div
                    className="px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide"
                    style={{
                        background: 'linear-gradient(135deg, #FFD700 0%, #DAA520 100%)',
                        color: '#1a120e',
                        boxShadow: '0 4px 15px rgba(255, 215, 0, 0.5)',
                    }}
                >
                    Main Mini Games
                </div>
            </div>
            <style dangerouslySetInnerHTML={{
                __html: `
                    @keyframes pulse-glow {
                        0%, 100% { opacity: 0.6; transform: scale(1.6); }
                        50% { opacity: 1; transform: scale(1.8); }
                    }
                    @keyframes spin-slow {
                        0% { transform: scale(1.3) rotate(0deg); }
                        100% { transform: scale(1.3) rotate(360deg); }
                    }
                `
            }} />
        </button>
    );
};

// ============================================
// GOLD AURA EFFECT
// ============================================
const GoldAuraEffect = ({ isActive, onFinish, duration = 10000 }) => {
    const [isFadingOut, setIsFadingOut] = useState(false);
    const [coins, setCoins] = useState([]);
    const [piratePosition, setPiratePosition] = useState(null);
    const [pirateVisible, setPirateVisible] = useState(false);
    const [shipVisible, setShipVisible] = useState(false);
    const [shipKey, setShipKey] = useState(0);

    const shipSoundRef = useRef(null);
    const shipDurationSeconds = duration / 700;

    useEffect(() => {
        if (!shipSoundRef.current) {
            shipSoundRef.current = new Audio('/sounds/kapal-berlayar.mp3');
            shipSoundRef.current.volume = 0.7;
            shipSoundRef.current.loop = true;
        }
        return () => {
            if (shipSoundRef.current) {
                shipSoundRef.current.pause();
                shipSoundRef.current.currentTime = 0;
            }
        };
    }, []);

    useEffect(() => {
        if (isActive) {
            const coinCount = window.innerWidth < 640 ? 50 : 100;
            const newCoins = Array.from({ length: coinCount }, (_, i) => ({
                id: i,
                left: Math.random() * 100,
                delay: Math.random() * 3,
                duration: 3.5 + Math.random() * 3,
                size: 18 + Math.random() * 30,
                rotation: Math.random() * 360,
                opacity: 0.55 + Math.random() * 0.45,
                xOffset: (Math.random() - 0.5) * 100,
            }));
            setCoins(newCoins);
            setIsFadingOut(false);
        } else {
            setCoins([]);
            setIsFadingOut(false);
            setPiratePosition(null);
            setPirateVisible(false);
            setShipVisible(false);
        }
    }, [isActive]);

    useEffect(() => {
        if (!isActive) return;
        const sides = ['top', 'left', 'right'];
        let currentSide = null;
        let cycleTimer = null;
        let hideTimer = null;

        const showNextPirate = () => {
            let nextSide;
            do {
                nextSide = sides[Math.floor(Math.random() * sides.length)];
            } while (nextSide === currentSide && sides.length > 1);
            currentSide = nextSide;
            setPiratePosition({ side: nextSide, key: Date.now() });
            setPirateVisible(true);
            hideTimer = setTimeout(() => {
                setPirateVisible(false);
                cycleTimer = setTimeout(() => showNextPirate(), 300);
            }, 1500);
        };

        const startTimer = setTimeout(showNextPirate, 200);
        return () => {
            clearTimeout(startTimer);
            clearTimeout(hideTimer);
            clearTimeout(cycleTimer);
        };
    }, [isActive]);

    useEffect(() => {
        if (!isActive) return;
        const shipStartTimer = setTimeout(() => {
            setShipKey(prev => prev + 1);
            setShipVisible(true);
            if (shipSoundRef.current) {
                shipSoundRef.current.currentTime = 0;
                shipSoundRef.current.loop = true;
                shipSoundRef.current.play().catch(() => { });
            }
        }, 400);
        const shipEndTimer = setTimeout(() => {
            setShipVisible(false);
            if (shipSoundRef.current) {
                shipSoundRef.current.pause();
                shipSoundRef.current.currentTime = 0;
            }
        }, duration);
        return () => {
            clearTimeout(shipStartTimer);
            clearTimeout(shipEndTimer);
        };
    }, [isActive, duration]);

    useEffect(() => {
        if (!isActive) return;
        const fadeTimer = setTimeout(() => setIsFadingOut(true), duration - 800);
        const finishTimer = setTimeout(() => {
            if (onFinish) onFinish();
            setIsFadingOut(false);
        }, duration);
        return () => {
            clearTimeout(fadeTimer);
            clearTimeout(finishTimer);
        };
    }, [isActive, duration, onFinish]);

    useEffect(() => {
        if (!isActive && shipSoundRef.current) {
            shipSoundRef.current.pause();
            shipSoundRef.current.currentTime = 0;
        }
    }, [isActive]);

    if (!isActive) return null;

    const getPirateConfig = (side) => {
        const size = 'w-[140px] sm:w-[180px] md:w-[120px] lg:w-[160px]';
        switch (side) {
            case 'top':
                return {
                    wrapperStyle: { top: 0, left: '50%', marginLeft: '-70px' },
                    imgStyle: { transform: 'translateY(-50%) rotate(180deg)', transformOrigin: 'center center' },
                    sizeClass: size,
                };
            case 'right':
                return {
                    wrapperStyle: { right: 0, top: '50%', marginTop: '-70px' },
                    imgStyle: { transform: 'translateX(50%) rotate(-90deg)', transformOrigin: 'center center' },
                    sizeClass: size,
                };
            case 'left':
                return {
                    wrapperStyle: { left: 0, top: '50%', marginTop: '-70px' },
                    imgStyle: { transform: 'translateX(-50%) rotate(90deg)', transformOrigin: 'center center' },
                    sizeClass: size,
                };
            default:
                return { wrapperStyle: {}, imgStyle: {}, sizeClass: size };
        }
    };

    const pirateConfig = piratePosition ? getPirateConfig(piratePosition.side) : null;

    return (
        <div
            className={`fixed inset-0 z-[200] pointer-events-none overflow-hidden transition-opacity duration-700 ease-out ${isFadingOut ? 'opacity-0' : 'opacity-100'}`}
        >
            <style dangerouslySetInnerHTML={{
                __html: `
                    @keyframes coinFall {
                        0% { transform: translateY(-15vh) rotate(0deg) scale(0.4); opacity: 0; }
                        10% { opacity: 1; transform: translateY(-5vh) rotate(45deg) scale(1); }
                        90% { opacity: 1; }
                        100% { transform: translateY(115vh) rotate(720deg) scale(0.9); opacity: 0; }
                    }
                    @keyframes coinSway {
                        0%, 100% { transform: translateX(0px); }
                        50% { transform: translateX(var(--sway)); }
                    }
                    .coin-rain-item {
                        position: absolute;
                        top: -15vh;
                        animation: coinFall var(--duration) ease-in var(--delay) infinite;
                        will-change: transform;
                    }
                    .coin-rain-item .coin-inner {
                        animation: coinSway 2s ease-in-out infinite;
                        --sway: calc(var(--x-offset) * 1px);
                    }
                    @keyframes auraTop {
                        0%, 100% { opacity: 0.7; filter: blur(30px) brightness(1); }
                        50%      { opacity: 1;   filter: blur(45px) brightness(1.7); }
                    }
                    @keyframes auraBottom {
                        0%, 100% { opacity: 0.7; filter: blur(30px) brightness(1); }
                        50%      { opacity: 1;   filter: blur(45px) brightness(1.7); }
                    }
                    @keyframes auraLeft {
                        0%, 100% { opacity: 0.6; filter: blur(25px) brightness(1); }
                        50%      { opacity: 0.95; filter: blur(40px) brightness(1.6); }
                    }
                    @keyframes auraRight {
                        0%, 100% { opacity: 0.6; filter: blur(25px) brightness(1); }
                        50%      { opacity: 0.95; filter: blur(40px) brightness(1.6); }
                    }
                    @keyframes shimmerSweepHorizontal {
                        0%   { transform: translateX(-100%); }
                        100% { transform: translateX(100%); }
                    }
                    @keyframes shimmerSweepVertical {
                        0%   { transform: translateY(-100%); }
                        100% { transform: translateY(100%); }
                    }
                    .aura-shimmer-h { animation: shimmerSweepHorizontal 3.5s ease-in-out infinite; }
                    .aura-shimmer-v { animation: shimmerSweepVertical 3.5s ease-in-out infinite; }
                    @keyframes piratePop {
                        0% { opacity: 0; }
                        100% { opacity: 1; }
                    }
                    .pirate-img {
                        animation: piratePop 0.4s ease-out;
                        transition: opacity 0.3s ease-out;
                        filter: drop-shadow(0 0 25px rgba(255, 215, 0, 0.9))
                                drop-shadow(0 0 50px rgba(255, 180, 0, 0.5));
                    }
                    @keyframes shipMoveX {
                        0% { transform: translateX(100vw); opacity: 0; }
                        5% { opacity: 1; }
                        95% { opacity: 1; }
                        100% { transform: translateX(-120vw); opacity: 0; }
                    }
                    @keyframes shipBob {
                        0%, 100% { transform: translateY(0px) rotate(-1deg); }
                        25% { transform: translateY(-6px) rotate(0.5deg); }
                        50% { transform: translateY(-3px) rotate(1.5deg); }
                        75% { transform: translateY(-4px) rotate(0.5deg); }
                    }
                    .ship-sail {
                        animation: shipMoveX var(--ship-duration, 10s) linear forwards;
                        will-change: transform;
                        filter: drop-shadow(0 0 30px rgba(255, 215, 0, 0.7))
                                drop-shadow(0 0 60px rgba(255, 180, 0, 0.4));
                    }
                    .ship-sail img, .ship-sail .ship-inner {
                        animation: shipBob 5s ease-in-out infinite;
                    }
                `
            }} />

            <div
                className="absolute top-0 left-0 right-0 h-40 sm:h-52 overflow-hidden"
                style={{
                    background: 'linear-gradient(to bottom, rgba(255, 215, 0, 0.9) 0%, rgba(255, 200, 0, 0.5) 30%, rgba(255, 180, 0, 0.2) 60%, transparent 100%)',
                    animation: 'auraTop 2.5s ease-in-out infinite',
                }}
            >
                <div className="absolute inset-0 aura-shimmer-h" style={{
                    background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.6) 50%, transparent 100%)',
                    mixBlendMode: 'overlay',
                }} />
            </div>

            <div
                className="absolute bottom-0 left-0 right-0 h-40 sm:h-52 overflow-hidden"
                style={{
                    background: 'linear-gradient(to top, rgba(255, 215, 0, 0.9) 0%, rgba(255, 200, 0, 0.5) 30%, rgba(255, 180, 0, 0.2) 60%, transparent 100%)',
                    animation: 'auraBottom 2.8s ease-in-out infinite',
                }}
            >
                <div className="absolute inset-0 aura-shimmer-h" style={{
                    background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.6) 50%, transparent 100%)',
                    mixBlendMode: 'overlay',
                    animationDelay: '0.5s',
                }} />
            </div>

            <div
                className="absolute top-0 bottom-0 left-0 w-32 sm:w-44 overflow-hidden"
                style={{
                    background: 'linear-gradient(to right, rgba(255, 215, 0, 0.9) 0%, rgba(255, 200, 0, 0.45) 40%, transparent 100%)',
                    animation: 'auraLeft 3s ease-in-out infinite',
                }}
            >
                <div className="absolute inset-0 aura-shimmer-v" style={{
                    background: 'linear-gradient(180deg, transparent 0%, rgba(255, 255, 255, 0.6) 50%, transparent 100%)',
                    mixBlendMode: 'overlay',
                    animationDelay: '0.3s',
                }} />
            </div>

            <div
                className="absolute top-0 bottom-0 right-0 w-32 sm:w-44 overflow-hidden"
                style={{
                    background: 'linear-gradient(to left, rgba(255, 215, 0, 0.9) 0%, rgba(255, 200, 0, 0.45) 40%, transparent 100%)',
                    animation: 'auraRight 3s ease-in-out infinite',
                }}
            >
                <div className="absolute inset-0 aura-shimmer-v" style={{
                    background: 'linear-gradient(180deg, transparent 0%, rgba(255, 255, 255, 0.6) 50%, transparent 100%)',
                    mixBlendMode: 'overlay',
                    animationDelay: '0.8s',
                }} />
            </div>

            <div className="absolute inset-0 overflow-hidden">
                {coins.map((coin) => (
                    <div
                        key={coin.id}
                        className="coin-rain-item"
                        style={{
                            left: `${coin.left}%`,
                            '--duration': `${coin.duration}s`,
                            '--delay': `${coin.delay}s`,
                            '--x-offset': coin.xOffset,
                        }}
                    >
                        <div className="coin-inner" style={{ '--sway': `${coin.xOffset}px` }}>
                            <img
                                src="/images/assets/coin.png"
                                alt="Koin"
                                style={{
                                    width: `${coin.size}px`,
                                    height: `${coin.size}px`,
                                    opacity: coin.opacity,
                                    transform: `rotate(${coin.rotation}deg)`,
                                    filter: 'drop-shadow(0 0 12px rgba(255, 215, 0, 0.6))',
                                }}
                                className="object-contain select-none"
                                draggable={false}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {shipVisible && (
                <div
                    key={shipKey}
                    className="ship-sail absolute left-0 right-0 pointer-events-none"
                    style={{
                        bottom: '-30px',
                        '--ship-duration': `${shipDurationSeconds}s`,
                        zIndex: 5,
                    }}
                >
                    <div className="ship-inner">
                        <img
                            src="/images/assets/kapal.png"
                            alt="Kapal Bajak Laut"
                            className="w-[300px] sm:w-[280px] md:w-[340px] lg:w-[380px] xl:w-[420px] h-auto object-contain select-none"
                            draggable={false}
                        />
                    </div>
                </div>
            )}

            {piratePosition && pirateConfig && (
                <div
                    key={piratePosition.key}
                    className="absolute transition-opacity duration-300 ease-out"
                    style={{
                        ...pirateConfig.wrapperStyle,
                        opacity: pirateVisible ? 1 : 0,
                    }}
                >
                    <img
                        src="/images/assets/bajak-laut.png"
                        alt="Chibi Bajak Laut"
                        className={`pirate-img ${pirateConfig.sizeClass} h-auto object-contain select-none`}
                        draggable={false}
                        style={pirateConfig.imgStyle}
                    />
                </div>
            )}
        </div>
    );
};

// ============================================
// DARK KRAKEN EFFECT
// ============================================
const DarkKrakenEffect = ({ isActive, onFinish, duration = 10000 }) => {
    const [isFadingOut, setIsFadingOut] = useState(false);
    const [krakenVisible, setKrakenVisible] = useState(false);

    const krakenSoundRef = useRef(null);
    const shipSoundRef = useRef(null);
    const lightningPoolRef = useRef([]);
    const lightningPoolIndexRef = useRef(0);

    const krakenVideoRef = useRef(null);

    useEffect(() => {
        if (!krakenSoundRef.current) {
            krakenSoundRef.current = new Audio('/sounds/kraken.mp3');
            krakenSoundRef.current.volume = 0.75;
            krakenSoundRef.current.loop = true;
        }
        if (!shipSoundRef.current) {
            shipSoundRef.current = new Audio('/sounds/kapal-berlayar.mp3');
            shipSoundRef.current.volume = 0.4;
            shipSoundRef.current.loop = true;
        }
        if (lightningPoolRef.current.length === 0) {
            lightningPoolRef.current = Array.from({ length: 6 }, () => {
                const audio = new Audio('/sounds/petir.mp3');
                audio.volume = 0.65;
                audio.loop = false;
                return audio;
            });
        }
        return () => {
            if (krakenSoundRef.current) {
                krakenSoundRef.current.pause();
                krakenSoundRef.current.currentTime = 0;
            }
            if (shipSoundRef.current) {
                shipSoundRef.current.pause();
                shipSoundRef.current.currentTime = 0;
            }
            lightningPoolRef.current.forEach(audio => {
                audio.pause();
                audio.currentTime = 0;
            });
        };
    }, []);

    useEffect(() => {
        if (isActive) {
            setIsFadingOut(false);
            const timer = setTimeout(() => {
                setKrakenVisible(true);
                if (shipSoundRef.current) {
                    shipSoundRef.current.currentTime = 0;
                    shipSoundRef.current.loop = true;
                    shipSoundRef.current.play().catch(() => { });
                }
                if (krakenSoundRef.current) {
                    krakenSoundRef.current.currentTime = 0;
                    krakenSoundRef.current.loop = true;
                    krakenSoundRef.current.play().catch(() => { });
                }
            }, 200);
            return () => clearTimeout(timer);
        } else {
            setKrakenVisible(false);
            setIsFadingOut(false);
            if (krakenSoundRef.current) {
                krakenSoundRef.current.pause();
                krakenSoundRef.current.currentTime = 0;
            }
            if (shipSoundRef.current) {
                shipSoundRef.current.pause();
                shipSoundRef.current.currentTime = 0;
            }
            lightningPoolRef.current.forEach(audio => {
                audio.pause();
                audio.currentTime = 0;
            });
            if (krakenVideoRef.current) {
                krakenVideoRef.current.pause();
                krakenVideoRef.current.currentTime = 0;
            }
        }
    }, [isActive]);

    useEffect(() => {
        if (krakenVisible && krakenVideoRef.current) {
            krakenVideoRef.current.currentTime = 0;
            krakenVideoRef.current.play().catch((err) => {
                console.log('Video kraken gagal autoplay:', err);
            });
        }
    }, [krakenVisible]);

    useEffect(() => {
        if (!isActive) return;
        let lightningTimer = null;

        const playLightningSound = () => {
            const pool = lightningPoolRef.current;
            if (pool.length === 0) return;
            const idx = lightningPoolIndexRef.current % pool.length;
            lightningPoolIndexRef.current += 1;
            const audio = pool[idx];
            if (audio) {
                audio.volume = 0.5 + Math.random() * 0.3;
                audio.play().catch(() => { });
            }
        };

        const triggerLightningSound = () => {
            playLightningSound();
            const nextDelay = 700 + Math.random() * 800;
            lightningTimer = setTimeout(triggerLightningSound, nextDelay);
        };

        lightningTimer = setTimeout(triggerLightningSound, 400);
        return () => clearTimeout(lightningTimer);
    }, [isActive]);

    useEffect(() => {
        if (!isActive) return;
        const fadeTimer = setTimeout(() => setIsFadingOut(true), duration - 800);
        const finishTimer = setTimeout(() => {
            if (onFinish) onFinish();
            setIsFadingOut(false);
            if (krakenSoundRef.current) {
                krakenSoundRef.current.pause();
                krakenSoundRef.current.currentTime = 0;
            }
            if (shipSoundRef.current) {
                shipSoundRef.current.pause();
                shipSoundRef.current.currentTime = 0;
            }
            lightningPoolRef.current.forEach(audio => {
                audio.pause();
                audio.currentTime = 0;
            });
            if (krakenVideoRef.current) {
                krakenVideoRef.current.pause();
                krakenVideoRef.current.currentTime = 0;
            }
        }, duration);
        return () => {
            clearTimeout(fadeTimer);
            clearTimeout(finishTimer);
        };
    }, [isActive, duration, onFinish]);

    if (!isActive) return null;

    return (
        <div
            className={`fixed inset-0 z-[200] pointer-events-none overflow-hidden transition-opacity duration-700 ease-out ${isFadingOut ? 'opacity-0' : 'opacity-100'}`}
            style={{
                background: 'radial-gradient(ellipse at center, rgba(5, 15, 40, 0.9) 0%, rgba(0, 0, 10, 0.98) 100%)',
            }}
        >
            <style dangerouslySetInnerHTML={{
                __html: `
                    @keyframes darkAuraTop {
                        0%, 100% { opacity: 0.7; filter: blur(35px) brightness(1); }
                        50%      { opacity: 1;   filter: blur(55px) brightness(1.6); }
                    }
                    @keyframes darkAuraBottom {
                        0%, 100% { opacity: 0.7; filter: blur(35px) brightness(1); }
                        50%      { opacity: 1;   filter: blur(55px) brightness(1.6); }
                    }
                    @keyframes darkAuraLeft {
                        0%, 100% { opacity: 0.6; filter: blur(30px) brightness(1); }
                        50%      { opacity: 0.95; filter: blur(50px) brightness(1.5); }
                    }
                    @keyframes darkAuraRight {
                        0%, 100% { opacity: 0.6; filter: blur(30px) brightness(1); }
                        50%      { opacity: 0.95; filter: blur(50px) brightness(1.5); }
                    }
                    @keyframes krakenFadeIn {
                        0% { opacity: 0; }
                        100% { opacity: 1; }
                    }
                    .kraken-fade-in {
                        animation: krakenFadeIn 1.5s ease-in-out forwards;
                    }
                    @keyframes krakenRampage {
                        0%   { transform: translateY(0px) rotate(0deg) scale(1); }
                        25%  { transform: translateY(-10px) rotate(1.5deg) scale(1.025); }
                        50%  { transform: translateY(-16px) rotate(-1deg) scale(1.04); }
                        75%  { transform: translateY(-8px) rotate(-1.8deg) scale(1.02); }
                        100% { transform: translateY(0px) rotate(0deg) scale(1); }
                    }
                    .kraken-rampage {
                        animation: krakenRampage 2.8s cubic-bezier(0.45, 0, 0.55, 1) infinite;
                    }
                    @keyframes krakenShake {
                        0%, 100% { transform: translateX(0px) rotate(0deg); }
                        20%      { transform: translateX(-4px) rotate(-0.4deg); }
                        40%      { transform: translateX(4px) rotate(0.4deg); }
                        60%      { transform: translateX(-3px) rotate(-0.3deg); }
                        80%      { transform: translateX(3px) rotate(0.3deg); }
                    }
                    .kraken-shake {
                        animation: krakenShake 1.8s ease-in-out infinite;
                    }
                    @keyframes krakenGlow {
                        0%, 100% {
                            filter: drop-shadow(0 0 30px rgba(120, 0, 0, 0.9))
                                    drop-shadow(0 0 60px rgba(180, 20, 20, 0.5))
                                    brightness(1);
                        }
                        50% {
                            filter: drop-shadow(0 0 60px rgba(255, 0, 0, 1))
                                    drop-shadow(0 0 120px rgba(255, 30, 30, 0.8))
                                    brightness(1.15);
                        }
                    }
                    .kraken-glow {
                        animation: krakenGlow 2.2s ease-in-out infinite;
                    }
                    .kraken-video {
                        display: block;
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100vw;
                        height: 100vh;
                        object-fit: cover;
                        background: transparent;
                        pointer-events: none;
                        user-select: none;
                    }
                    .kraken-vignette {
                        position: absolute;
                        inset: 0;
                        background: radial-gradient(
                            ellipse at center,
                            transparent 0%,
                            transparent 35%,
                            rgba(5, 15, 40, 0.4) 70%,
                            rgba(0, 0, 10, 0.85) 100%
                        );
                        pointer-events: none;
                        z-index: 3;
                    }
                `
            }} />

            <div
                className="absolute top-0 left-0 right-0 h-40 sm:h-52 overflow-hidden"
                style={{
                    background: 'linear-gradient(to bottom, rgba(20, 40, 110, 0.9) 0%, rgba(10, 25, 70, 0.5) 30%, rgba(5, 15, 40, 0.2) 60%, transparent 100%)',
                    animation: 'darkAuraTop 2.5s ease-in-out infinite',
                    zIndex: 4,
                }}
            >
                <div
                    className="absolute inset-0"
                    style={{
                        background: 'linear-gradient(90deg, transparent 0%, rgba(80, 120, 255, 0.4) 50%, transparent 100%)',
                        mixBlendMode: 'overlay',
                        animation: 'shimmerSweepHorizontal 3.5s ease-in-out infinite',
                    }}
                />
            </div>

            <div
                className="absolute bottom-0 left-0 right-0 h-40 sm:h-52 overflow-hidden"
                style={{
                    background: 'linear-gradient(to top, rgba(20, 40, 110, 0.9) 0%, rgba(10, 25, 70, 0.5) 30%, rgba(5, 15, 40, 0.2) 60%, transparent 100%)',
                    animation: 'darkAuraBottom 2.8s ease-in-out infinite',
                    zIndex: 4,
                }}
            >
                <div
                    className="absolute inset-0"
                    style={{
                        background: 'linear-gradient(90deg, transparent 0%, rgba(80, 120, 255, 0.4) 50%, transparent 100%)',
                        mixBlendMode: 'overlay',
                        animation: 'shimmerSweepHorizontal 3.5s ease-in-out infinite',
                        animationDelay: '0.5s',
                    }}
                />
            </div>

            <div
                className="absolute top-0 bottom-0 left-0 w-32 sm:w-44 overflow-hidden"
                style={{
                    background: 'linear-gradient(to right, rgba(20, 40, 110, 0.9) 0%, rgba(10, 25, 70, 0.45) 40%, transparent 100%)',
                    animation: 'darkAuraLeft 3s ease-in-out infinite',
                    zIndex: 4,
                }}
            >
                <div
                    className="absolute inset-0"
                    style={{
                        background: 'linear-gradient(180deg, transparent 0%, rgba(80, 120, 255, 0.4) 50%, transparent 100%)',
                        mixBlendMode: 'overlay',
                        animation: 'shimmerSweepVertical 3.5s ease-in-out infinite',
                        animationDelay: '0.3s',
                    }}
                />
            </div>

            <div
                className="absolute top-0 bottom-0 right-0 w-32 sm:w-44 overflow-hidden"
                style={{
                    background: 'linear-gradient(to left, rgba(20, 40, 110, 0.9) 0%, rgba(10, 25, 70, 0.45) 40%, transparent 100%)',
                    animation: 'darkAuraRight 3s ease-in-out infinite',
                    zIndex: 4,
                }}
            >
                <div
                    className="absolute inset-0"
                    style={{
                        background: 'linear-gradient(180deg, transparent 0%, rgba(80, 120, 255, 0.4) 50%, transparent 100%)',
                        mixBlendMode: 'overlay',
                        animation: 'shimmerSweepVertical 3.5s ease-in-out infinite',
                        animationDelay: '0.8s',
                    }}
                />
            </div>

            {krakenVisible && (
                <div
                    className="absolute inset-0 kraken-fade-in"
                    style={{ zIndex: 2 }}
                >
                    <div className="kraken-rampage absolute inset-0">
                        <div className="kraken-shake absolute inset-0">
                            <video
                                ref={krakenVideoRef}
                                src="/videos/kraken.mp4"
                                autoPlay
                                loop
                                muted
                                playsInline
                                preload="auto"
                                className="kraken-glow kraken-video"
                            />
                        </div>
                    </div>
                </div>
            )}

            <div className="kraken-vignette" style={{ zIndex: 3 }} />
        </div>
    );
};

// ============================================
// PENGURUS MODAL
// ============================================
const PengurusModal = ({ isOpen, onClose, data, type }) => {
    if (!isOpen || !data) return null;

    const getJabatan = () => {
        if (type === 'walikelas') return 'Wali Kelas';
        if (type === 'ketua') return 'Ketua Kelas';
        if (type === 'wakil') return 'Wakil Ketua Kelas';
        if (type === 'sekretaris') return data.jabatan || 'Sekretaris';
        if (type === 'bendahara') return data.jabatan || 'Bendahara';
        if (type === 'seksi') return data.jabatan || 'Seksi';
        return data.jabatan || '';
    };

    const isWaliKelas = type === 'walikelas';

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
        >
            <div className="relative max-w-md w-full" onClick={(e) => e.stopPropagation()}>
                <div
                    className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden"
                    style={{
                        backgroundImage: 'url("/images/assets/modal-murid.png")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                    }}
                >
                    <button
                        className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-all backdrop-blur-sm border border-white/20"
                        onClick={onClose}
                    >
                        <span className="material-symbols-outlined text-2xl">close</span>
                    </button>

                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6">
                        <div className="relative w-[150px] sm:w-[180px] aspect-[2/3] mb-4">
                            <LazyImage
                                alt="Bingkai Foto Pengurus"
                                className="pointer-events-none absolute inset-0 w-full h-full object-contain z-10 select-none"
                                src="/images/assets/bingkai-pengurus.png"
                            />
                            <div className="absolute inset-[8%_12%_14%_12%] overflow-hidden rounded-[4px] bg-[#1a120b] shadow-inner flex items-center justify-center z-0">
                                <LazyImage className="w-full h-full object-cover object-center" src={data.foto} alt={data.nama} />
                            </div>
                        </div>

                        <h3 className="font-headline-md text-headline-md text-white text-center font-bold mb-1 drop-shadow-lg">{data.nama}</h3>

                        <div className="px-3 py-1 rounded-full bg-[#d4a853] text-[#1a120e] font-label-nav-coordinates text-xs tracking-wider uppercase font-semibold shadow-xs mb-3">
                            {getJabatan()}
                        </div>

                        {!isWaliKelas && (
                            <div className="flex items-center gap-3 mt-1 flex-wrap justify-center max-w-[280px]">
                                <a href={data.instagram || '#'} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-orange-400 text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg" title="Instagram">
                                    <i className="fab fa-instagram text-lg"></i>
                                </a>
                                {data.tiktok && (
                                    <a href={data.tiktok} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg border border-white/20" style={{ boxShadow: '0 0 15px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)' }} title="TikTok">
                                        <i className="fab fa-tiktok text-lg"></i>
                                    </a>
                                )}
                                {data.linkedin && (
                                    <a href={data.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#0A66C2] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg" title="LinkedIn">
                                        <i className="fab fa-linkedin-in text-lg"></i>
                                    </a>
                                )}
                                {data.github && (
                                    <a href={data.github} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#333] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg" title="GitHub">
                                        <i className="fab fa-github text-lg"></i>
                                    </a>
                                )}
                                {data.youtube && (
                                    <a href={data.youtube} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg" title="YouTube">
                                        <i className="fab fa-youtube text-lg"></i>
                                    </a>
                                )}
                                {data.steam && (
                                    <a href={data.steam} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#1b2838] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg" title="Steam">
                                        <i className="fab fa-steam text-lg"></i>
                                    </a>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// ============================================
// MURID MODAL
// ============================================
const MuridModal = ({ isOpen, onClose, data }) => {
    if (!isOpen || !data) return null;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
        >
            <div className="relative max-w-md w-full" onClick={(e) => e.stopPropagation()}>
                <div
                    className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden"
                    style={{
                        backgroundImage: 'url("/images/assets/modal-murid.png")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                    }}
                >
                    <button
                        className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-all backdrop-blur-sm border border-white/20"
                        onClick={onClose}
                    >
                        <span className="material-symbols-outlined text-2xl">close</span>
                    </button>

                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6">
                        <div className="relative w-[150px] sm:w-[180px] aspect-[2/3] mb-4">
                            <LazyImage
                                alt="Bingkai Foto Murid"
                                className="pointer-events-none absolute inset-0 w-full h-full object-contain z-10 select-none"
                                src="/images/assets/bingkai-murid.png"
                            />
                            <div className="absolute inset-[8%_12%_14%_12%] overflow-hidden rounded-[4px] bg-[#1a120b] shadow-inner flex items-center justify-center z-0">
                                <LazyImage className="w-full h-full object-cover object-center" src={data.foto} alt={data.nama} />
                            </div>
                        </div>

                        <h3 className="font-headline-md text-headline-md text-white text-center font-bold mb-1 drop-shadow-lg">{data.nama}</h3>

                        <div className="flex items-center gap-3 mt-2 flex-wrap justify-center max-w-[280px]">
                            {data.instagram && (
                                <a href={data.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-orange-400 text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg" title="Instagram">
                                    <i className="fab fa-instagram text-lg"></i>
                                </a>
                            )}
                            {data.tiktok && (
                                <a href={data.tiktok} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg border border-white/20" style={{ boxShadow: '0 0 15px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)' }} title="TikTok">
                                    <i className="fab fa-tiktok text-lg"></i>
                                </a>
                            )}
                            {data.linkedin && (
                                <a href={data.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#0A66C2] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg" title="LinkedIn">
                                    <i className="fab fa-linkedin-in text-lg"></i>
                                </a>
                            )}
                            {data.github && (
                                <a href={data.github} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#333] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg" title="GitHub">
                                    <i className="fab fa-github text-lg"></i>
                                </a>
                            )}
                            {data.youtube && (
                                <a href={data.youtube} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg" title="YouTube">
                                    <i className="fab fa-youtube text-lg"></i>
                                </a>
                            )}
                            {data.steam && (
                                <a href={data.steam} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#1b2838] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg" title="Steam">
                                    <i className="fab fa-steam text-lg"></i>
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ============================================
// GALLERY MODAL
// ============================================
const GalleryModal = ({ isOpen, onClose, data }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isImageLoaded, setIsImageLoaded] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => setIsVisible(true), 50);
            document.body.style.overflow = 'hidden';
        } else {
            setIsVisible(false);
            setIsImageLoaded(false);
            document.body.style.overflow = 'auto';
        }
        return () => { document.body.style.overflow = 'auto'; };
    }, [isOpen]);

    if (!isOpen || !data) return null;

    return (
        <div
            className={`fixed inset-0 z-[150] flex items-center justify-center bg-black/95 backdrop-blur-md transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
            onClick={onClose}
        >
            <button
                className="absolute top-4 right-4 sm:top-6 sm:right-6 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all backdrop-blur-sm border border-white/20"
                onClick={onClose}
            >
                <span className="material-symbols-outlined text-2xl sm:text-3xl">close</span>
            </button>

            <div
                className={`relative flex flex-col items-center justify-center w-full h-full pt-16 sm:pt-20 pb-8 px-4 sm:px-8 transition-all duration-700 ease-out ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                onClick={(e) => e.stopPropagation()}
            >
                {!isImageLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-12 h-12 rounded-full border-4 border-secondary/30 border-t-secondary animate-spin" />
                            <span className="text-white/60 text-sm font-label-code">Memuat foto...</span>
                        </div>
                    </div>
                )}

                <div className="relative max-w-[90vw] max-h-[75vh] sm:max-w-[80vw] sm:max-h-[75vh] rounded-lg overflow-hidden shadow-2xl">
                    <img
                        src={data.foto}
                        alt={data.deskripsi}
                        className={`w-full h-full object-contain transition-opacity duration-500 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
                        onLoad={() => setIsImageLoaded(true)}
                        onError={() => setIsImageLoaded(true)}
                    />
                </div>

                <div className="mt-4 sm:mt-6 text-center z-20 px-4">
                    <span className="font-label-nav-coordinates text-label-nav-coordinates text-secondary-fixed uppercase tracking-wider block text-[10px] sm:text-xs mb-1">
                        {data.judul}
                    </span>
                    <h3 className="font-headline-md text-headline-md text-white font-bold text-base sm:text-xl drop-shadow-lg">
                        {data.deskripsi}
                    </h3>
                </div>
            </div>
        </div>
    );
};

// ============================================
// GALLERY SWIPER
// ============================================
const GallerySwiper = ({ galleryData, openGalleryModal, LazyImage }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const swiperRef = useRef(null);

    const totalSlides = galleryData.length;

    const handlePrev = () => { if (swiperRef.current) swiperRef.current.slidePrev(); };
    const handleNext = () => { if (swiperRef.current) swiperRef.current.slideNext(); };
    const handleSlideChange = (swiper) => { setActiveIndex(swiper.realIndex); };

    return (
        <div className="relative w-full overflow-hidden">
            <Swiper
                modules={[Navigation, Pagination, Virtual, Autoplay, EffectCoverflow]}
                onSwiper={(swiper) => { swiperRef.current = swiper; }}
                onSlideChange={handleSlideChange}
                effect="coverflow"
                coverflowEffect={{ rotate: 45, stretch: 0, depth: 200, modifier: 1, slideShadows: true }}
                grabCursor={true}
                centeredSlides={true}
                slidesPerView="auto"
                spaceBetween={0}
                autoplay={{ delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true }}
                loop={true}
                className="gallery-swiper-panorama"
                breakpoints={{
                    320: { slidesPerView: 1.1, spaceBetween: 0 },
                    480: { slidesPerView: 1.3, spaceBetween: 0 },
                    640: { slidesPerView: 1.8, spaceBetween: 0 },
                    768: { slidesPerView: 2.2, spaceBetween: 0 },
                    1024: { slidesPerView: 2.8, spaceBetween: 0 },
                    1280: { slidesPerView: 3.2, spaceBetween: 0 }
                }}
            >
                {galleryData.map((item, index) => (
                    <SwiperSlide key={item.id} virtualIndex={index}>
                        <div className="group relative bg-surface-container rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 mx-2 cursor-pointer" onClick={() => openGalleryModal(item)}>
                            <div className="relative h-56 md:h-64 w-full overflow-hidden bg-surface-container-high">
                                <LazyImage src={item.foto} alt={item.judul} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent"></div>
                                <div className="absolute bottom-3 left-3 right-3 text-on-primary">
                                    <span className="font-label-nav-coordinates text-label-nav-coordinates text-secondary-fixed uppercase tracking-wider block text-[10px]">{item.judul}</span>
                                    <h3 className="font-headline-sm text-headline-sm font-bold text-surface-bright text-sm">{item.deskripsi}</h3>
                                </div>
                            </div>
                            <div className="p-3 flex items-center justify-between bg-surface-container-low">
                                <img src="/images/assets/galery-logo.png" alt="Gallery Logo" className="w-15 h-10 object-contain drop-shadow-md" />
                                <span className="font-headline-sm text-label-nav-coordinates text-secondary-fixed uppercase tracking-wider block text-[10px]">XII RPL B 23'</span>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            <div className="mt-6 sm:mt-8 flex items-center justify-center gap-3 sm:gap-4 md:gap-6">
                <button onClick={handlePrev} aria-label="Gambar Sebelumnya" className="group flex-shrink-0 w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-primary-container/90 hover:bg-primary-container text-secondary-container flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm border border-secondary/20 hover:scale-110 active:scale-95">
                    <span className="material-symbols-outlined text-xl sm:text-2xl md:text-3xl group-hover:-translate-x-0.5 transition-transform">chevron_left</span>
                </button>

                <div className="flex items-center gap-1 sm:gap-1.5 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-primary-container/90 backdrop-blur-sm border border-secondary/20 shadow-lg min-w-[80px] sm:min-w-[100px] md:min-w-[120px] justify-center">
                    <span className="font-headline-sm text-lg sm:text-xl md:text-2xl font-bold text-secondary-fixed tabular-nums" style={{ textShadow: '0 0 10px rgba(212, 168, 83, 0.3)' }}>{activeIndex + 1}</span>
                    <span className="text-secondary-fixed/60 text-lg sm:text-xl md:text-2xl font-bold">/</span>
                    <span className="text-secondary-fixed/60 text-sm sm:text-base md:text-lg font-bold tabular-nums">{totalSlides}</span>
                </div>

                <button onClick={handleNext} aria-label="Gambar Selanjutnya" className="group flex-shrink-0 w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-primary-container/90 hover:bg-primary-container text-secondary-container flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm border border-secondary/20 hover:scale-110 active:scale-95">
                    <span className="material-symbols-outlined text-xl sm:text-2xl md:text-3xl group-hover:translate-x-0.5 transition-transform">chevron_right</span>
                </button>
            </div>
        </div>
    );
};

// ============================================
// MINI GAMES MODAL
// ============================================
const MiniGamesModal = ({ isOpen, onClose }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [activeGame, setActiveGame] = useState(null);
    const menuMusicRef = useRef(null);

    useEffect(() => {
        if (!menuMusicRef.current) {
            menuMusicRef.current = new Audio('/sounds/music-awal.mp3');
            menuMusicRef.current.loop = true;
            menuMusicRef.current.volume = 0.9;
        }
        if (isOpen && activeGame === null) {
            const playPromise = menuMusicRef.current.play();
            if (playPromise !== undefined) {
                playPromise.catch(() => { console.log('Autoplay blocked, waiting for user interaction'); });
            }
        } else {
            if (menuMusicRef.current) {
                menuMusicRef.current.pause();
                menuMusicRef.current.currentTime = 0;
            }
        }
        return () => {
            if (menuMusicRef.current) {
                menuMusicRef.current.pause();
                menuMusicRef.current.currentTime = 0;
            }
        };
    }, [isOpen, activeGame]);

    useEffect(() => {
        if (!isOpen && menuMusicRef.current) {
            menuMusicRef.current.pause();
            menuMusicRef.current.currentTime = 0;
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => setIsVisible(true), 50);
            document.body.style.overflow = 'hidden';
        } else {
            setIsVisible(false);
            setActiveGame(null);
            document.body.style.overflow = 'auto';
        }
        return () => { document.body.style.overflow = 'auto'; };
    }, [isOpen]);

    if (!isOpen) return null;

    const gamesList = [
        { id: 'treasure', name: 'Treasure Hunt', subtitle: 'Cari harta', logo: '/images/assets/game1.png' },
        { id: 'memory', name: 'Memory Card', subtitle: 'Cocokkan kartu', logo: '/images/assets/game2.png' },
        { id: 'sea', name: 'Memory of the Sea', subtitle: 'Tebak nama', logo: '/images/assets/game3.png' },
        { id: 'codequest', name: 'Pirate Code Quest', subtitle: 'Jawab soal', logo: '/images/assets/game4.png' },
        { id: 'map', name: 'Piece of the Map', subtitle: 'Susun peta', logo: '/images/assets/game5.png' },
        { id: 'kraken', name: 'Kraken Smash', subtitle: 'Pukul tentakel', logo: '/images/assets/game6.png' },
    ];

    return (
        <div className={`fixed inset-0 z-[180] bg-black/95 backdrop-blur-md transition-opacity duration-500 overflow-y-auto ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <div className={`relative flex flex-col items-center w-full min-h-screen py-8 sm:py-12 px-4 sm:px-6 md:px-8 transition-all duration-700 ease-out ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                {activeGame === null && (
                    <>
                        <div className="text-center mb-8 sm:mb-12 px-2 w-full">
                            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 backdrop-blur-sm rounded-full border border-yellow-500/30 mb-3 sm:mb-4">
                                <img src="/images/assets/coin.png" alt="Coin" className="w-4 h-4 sm:w-5 sm:h-5 object-contain" />
                                <span className="font-label-nav-coordinates text-yellow-400 uppercase tracking-widest text-[9px] sm:text-xs font-bold">Mini Games Area</span>
                            </div>
                            <h2 className="font-display-hero text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold drop-shadow-2xl mb-2">Mini Games</h2>
                            <p className="font-body-lg text-white/60 max-w-md mx-auto text-xs sm:text-sm md:text-base">Pilih game favoritmu dan mulai petualangan!</p>
                        </div>

                        <div className="w-full max-w-4xl">
                            <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-6 sm:gap-y-8 md:gap-y-10 gap-x-3 sm:gap-x-6 md:gap-x-8 justify-items-center">
                                {gamesList.map((game) => (
                                    <button key={game.id} onClick={() => setActiveGame(game.id)} className="group flex flex-col items-center gap-2 sm:gap-3 w-full max-w-[100px] sm:max-w-[120px] md:max-w-[130px] cursor-pointer transition-all duration-300 active:scale-95">
                                        <div className="relative w-full aspect-square">
                                            <div className="absolute inset-0 rounded-[22%] opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'radial-gradient(circle, rgba(255, 215, 0, 0.5) 0%, transparent 70%)', filter: 'blur(15px)', transform: 'scale(1.3)' }} />
                                            <div className="relative w-full h-full rounded-[22%] overflow-hidden transition-all duration-300 group-hover:scale-105 group-active:scale-95" style={{ boxShadow: '0 6px 20px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 215, 0, 0.2)' }}>
                                                <img src={game.logo} alt={game.name} className="w-full h-full object-cover" />
                                            </div>
                                        </div>
                                        <div className="text-center w-full">
                                            <h3 className="text-yellow-400 font-bold text-[11px] sm:text-xs md:text-sm leading-tight line-clamp-2 px-1">{game.name}</h3>
                                            <p className="text-white/40 text-[9px] sm:text-[10px] mt-0.5 leading-tight line-clamp-1">{game.subtitle}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="mt-10 sm:mt-14 w-full flex justify-center">
                            <button onClick={onClose} className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl font-bold text-sm sm:text-base transition-all hover:scale-105 active:scale-95 text-white/80 hover:text-white bg-white/5 hover:bg-white/10 border border-white/20">
                                ← Keluar Mini Games
                            </button>
                        </div>
                    </>
                )}

                {activeGame === 'treasure' && (
                    <div className="w-full max-w-2xl animate-[zoom-in_0.5s_ease-out]">
                        <div className="text-center mb-4 sm:mb-6">
                            <button onClick={() => setActiveGame(null)} className="mb-3 sm:mb-4 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm text-white/60 hover:text-white transition-all hover:bg-white/10 border border-white/20">← Kembali ke Menu</button>
                            <h2 className="font-display-hero text-xl sm:text-2xl md:text-3xl font-bold text-yellow-400 mb-1" style={{ textShadow: '0 0 20px rgba(255, 215, 0, 0.6)' }}>Treasure Hunt</h2>
                        </div>
                        <TreasureHunt onExit={() => setActiveGame(null)} />
                    </div>
                )}

                {activeGame === 'memory' && (
                    <div className="w-full max-w-2xl animate-[zoom-in_0.5s_ease-out]">
                        <div className="text-center mb-4 sm:mb-6">
                            <button onClick={() => setActiveGame(null)} className="mb-3 sm:mb-4 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm text-white/60 hover:text-white transition-all hover:bg-white/10 border border-white/20">← Kembali ke Menu</button>
                            <h2 className="font-display-hero text-xl sm:text-2xl md:text-3xl font-bold text-yellow-400 mb-1" style={{ textShadow: '0 0 20px rgba(255, 215, 0, 0.6)' }}>Memory Card Game</h2>
                        </div>
                        <MemoryGame onExit={() => setActiveGame(null)} />
                    </div>
                )}

                {activeGame === 'sea' && (
                    <div className="w-full max-w-2xl animate-[zoom-in_0.5s_ease-out]">
                        <div className="text-center mb-4 sm:mb-6">
                            <button onClick={() => setActiveGame(null)} className="mb-3 sm:mb-4 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm text-white/60 hover:text-white transition-all hover:bg-white/10 border border-white/20">← Kembali ke Menu</button>
                            <h2 className="font-display-hero text-xl sm:text-2xl md:text-3xl font-bold text-yellow-400 mb-1" style={{ textShadow: '0 0 20px rgba(255, 215, 0, 0.6)' }}>Memory of the Sea</h2>
                        </div>
                        <MemoryOfTheSea onExit={() => setActiveGame(null)} />
                    </div>
                )}

                {activeGame === 'codequest' && (
                    <div className="w-full max-w-2xl animate-[zoom-in_0.5s_ease-out]">
                        <div className="text-center mb-4 sm:mb-6">
                            <button onClick={() => setActiveGame(null)} className="mb-3 sm:mb-4 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm text-white/60 hover:text-white transition-all hover:bg-white/10 border border-white/20">← Kembali ke Menu</button>
                            <h2 className="font-display-hero text-xl sm:text-2xl md:text-3xl font-bold text-yellow-400 mb-1" style={{ textShadow: '0 0 20px rgba(255, 215, 0, 0.6)' }}>Pirate Code Quest</h2>
                        </div>
                        <PirateCodeQuest onExit={() => setActiveGame(null)} />
                    </div>
                )}

                {activeGame === 'map' && (
                    <div className="w-full max-w-3xl animate-[zoom-in_0.5s_ease-out]">
                        <div className="text-center mb-4 sm:mb-6">
                            <button onClick={() => setActiveGame(null)} className="mb-3 sm:mb-4 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm text-white/60 hover:text-white transition-all hover:bg-white/10 border border-white/20">← Kembali ke Menu</button>
                            <h2 className="font-display-hero text-xl sm:text-2xl md:text-3xl font-bold text-yellow-400 mb-1" style={{ textShadow: '0 0 20px rgba(255, 215, 0, 0.6)' }}>Piece of the Map</h2>
                        </div>
                        <PieceOfTheMap onExit={() => setActiveGame(null)} />
                    </div>
                )}

                {activeGame === 'kraken' && (
                    <div className="w-full max-w-3xl animate-[zoom-in_0.5s_ease-out]">
                        <div className="text-center mb-4 sm:mb-6">
                            <button onClick={() => setActiveGame(null)} className="mb-3 sm:mb-4 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm text-white/60 hover:text-white transition-all hover:bg-white/10 border border-white/20">← Kembali ke Menu</button>
                            <h2 className="font-display-hero text-xl sm:text-2xl md:text-3xl font-bold text-cyan-400 mb-1" style={{ textShadow: '0 0 20px rgba(56, 189, 248, 0.6)' }}>Kraken Smash</h2>
                        </div>
                        <KrakenSmash onExit={() => setActiveGame(null)} />
                    </div>
                )}
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                    @keyframes zoom-in {
                        0% { transform: scale(0.8); opacity: 0; }
                        100% { transform: scale(1); opacity: 1; }
                    }
                    .fixed::-webkit-scrollbar { width: 8px; }
                    .fixed::-webkit-scrollbar-track { background: rgba(0, 0, 0, 0.3); }
                    .fixed::-webkit-scrollbar-thumb { background: rgba(255, 215, 0, 0.5); border-radius: 4px; }
                    .fixed::-webkit-scrollbar-thumb:hover { background: rgba(255, 215, 0, 0.8); }
                `
            }} />
        </div>
    );
};

// ============================================
// KOMPONEN UTAMA HOME
// ============================================
const Home = () => {
    const [currentTime, setCurrentTime] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDay, setSelectedDay] = useState('Senin');
    const [filterDay, setFilterDay] = useState('all');
    const [activeFilter, setActiveFilter] = useState('all');
    const [likes, setLikes] = useState({});
    const [selectedMurid, setSelectedMurid] = useState(null);
    const [isMuridModalOpen, setIsMuridModalOpen] = useState(false);
    const [selectedPengurus, setSelectedPengurus] = useState(null);
    const [isPengurusModalOpen, setIsPengurusModalOpen] = useState(false);
    const [pengurusModalType, setPengurusModalType] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const [selectedGallery, setSelectedGallery] = useState(null);
    const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
    const [isMiniGamesModalOpen, setIsMiniGamesModalOpen] = useState(false);

    const [activeEffect, setActiveEffect] = useState(null);
    const nextEffectRef = useRef('v1');

    const topRackNames = [
        'AFRIZA ABIYU HANIF',
        'ARYA RENALDI',
        'DINO HERLAMBANG',
        'FARREL RIZKAR OBAMA SUTANYO',
        'HAIDAR LUHUR WIJAYA',
        'MUHAMMAD ATTA FAWAZ',
        'MUHAMMAD DHAFA ABDUL GHANI',
        'MUHAMMAD GILAR',
        'MUHAMMAD SULAEMAN AL JAZULI',
        'NAZWA AUDRY MAHESWARI'
    ];

    const bottomRackNames = [
        'NURRAFI AHMAD KASYFAYAIL',
        'RAFI IRFANSYAH',
        'RAZAN FACHRI RAMADHAN',
        'RICKY RAMADHAN',
        'RIDHO ABDUL HAFIZ',
        'RIFQI MUHAMMAD FAIZ',
        'SHARA AGUSTINA',
        'SITI SARAH NURANIAH',
        'SUCI ANDRIYANI',
        'WAFI NAUFAL HAFIDZ'
    ];

    useEffect(() => {
        const timer = setTimeout(() => { setIsVisible(true); }, 100);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const updateClock = () => {
            const now = new Date();
            const hrs = String(now.getHours()).padStart(2, '0');
            const mins = String(now.getMinutes()).padStart(2, '0');
            const secs = String(now.getSeconds()).padStart(2, '0');
            setCurrentTime(`${hrs}:${mins}:${secs} WIB`);
        };
        updateClock();
        const interval = setInterval(updateClock, 1000);
        return () => clearInterval(interval);
    }, []);

    const normalizeName = (str) => {
        if (!str) return '';
        return str.toString().trim().replace(/\s+/g, ' ').toUpperCase();
    };

    const filteredMurid = muridData.filter(murid => {
        const matchesSearch = normalizeName(murid.nama).includes(normalizeName(searchTerm));
        return matchesSearch;
    });

    const ketua = pengurusData.find(p => p.jabatan === 'Ketua Kelas');
    const wakil = pengurusData.find(p => p.jabatan === 'Wakil Ketua');
    const sekretaris = pengurusData.filter(p => p.jabatan === 'Sekretaris1' || p.jabatan === 'Sekretaris2');
    const bendahara = pengurusData.filter(p => p.jabatan === 'Bendahara1' || p.jabatan === 'Bendahara2');
    const seksi = pengurusData.filter(p => p.jabatan === 'Seksi Kebersihan' || p.jabatan === 'Seksi Rohani');

    const frameImage = '/images/assets/bingkai-pengurus.png';

    const triggerEffect = () => {
        const next = nextEffectRef.current;
        setActiveEffect(null);
        setTimeout(() => {
            setActiveEffect(next);
            nextEffectRef.current = next === 'v1' ? 'v2' : 'v1';
        }, 50);
    };

    const handleEffectFinish = useCallback(() => { setActiveEffect(null); }, []);

    const openMuridModal = (murid) => {
        setSelectedMurid(murid);
        setIsMuridModalOpen(true);
        document.body.style.overflow = 'hidden';
    };
    const closeMuridModal = () => {
        setIsMuridModalOpen(false);
        setSelectedMurid(null);
        document.body.style.overflow = 'auto';
    };
    const openPengurusModal = (pengurus, type) => {
        setSelectedPengurus(pengurus);
        setPengurusModalType(type);
        setIsPengurusModalOpen(true);
        document.body.style.overflow = 'hidden';
    };
    const closePengurusModal = () => {
        setIsPengurusModalOpen(false);
        setSelectedPengurus(null);
        setPengurusModalType('');
        document.body.style.overflow = 'auto';
    };
    const openGalleryModal = (gallery) => {
        setSelectedGallery(gallery);
        setIsGalleryModalOpen(true);
        document.body.style.overflow = 'hidden';
    };
    const closeGalleryModal = () => {
        setIsGalleryModalOpen(false);
        setSelectedGallery(null);
        document.body.style.overflow = 'auto';
    };
    const openMiniGamesModal = () => {
        setIsMiniGamesModalOpen(true);
        document.body.style.overflow = 'hidden';
    };
    const closeMiniGamesModal = () => {
        setIsMiniGamesModalOpen(false);
        document.body.style.overflow = 'auto';
    };

    const topRackStudents = topRackNames.map(name =>
        filteredMurid.find(m => normalizeName(m.nama) === normalizeName(name))
    ).filter(Boolean);

    const bottomRackStudents = bottomRackNames.map(name =>
        filteredMurid.find(m => normalizeName(m.nama) === normalizeName(name))
    ).filter(Boolean);

    useEffect(() => {
        const allNames = [...topRackNames, ...bottomRackNames];
        const notFound = allNames.filter(name =>
            !filteredMurid.find(m => normalizeName(m.nama) === normalizeName(name))
        );
        if (notFound.length > 0) {
            console.warn('⚠️ Murid tidak ditemukan di muridData:', notFound);
        }
    }, [filteredMurid]);

    return (
        <div className={`w-full bg-surface min-h-screen overflow-x-hidden transition-opacity duration-700 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <GoldAuraEffect isActive={activeEffect === 'v1'} onFinish={handleEffectFinish} duration={10000} />
            <DarkKrakenEffect isActive={activeEffect === 'v2'} onFinish={handleEffectFinish} duration={10000} />

            <ScrollIndicator />

            {/* HERO SECTION */}
            <section id="home" className="w-full relative overflow-hidden min-h-screen flex items-center pt-16 lg:pt-20">
                <div className="absolute inset-0 w-full h-full z-0">
                    <LazyVideoBackground src="/videos/hero-bg.mp4" poster="/images/hero-poster.webp" className="w-full h-full">
                        <img src="/images/logo-kelas.webp" alt="Background" className="w-full h-full object-cover" />
                    </LazyVideoBackground>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/60 to-primary/40"></div>
                </div>

                <div className="max-w-[1280px] mx-auto relative z-10 px-gutter-mobile lg:px-gutter-desktop w-full py-16 md:py-20">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center">
                        <div className="lg:col-span-5 flex flex-col items-center justify-center relative mb-6 lg:mb-0">
                            <div className="relative w-40 h-40 sm:w-30 sm:h-30 md:w-64 md:h-64 lg:w-80 lg:h-80 p-3 sm:p-4 rounded-full bg-white/10 backdrop-blur-sm shadow-xl flex items-center justify-center border border-white/20 cursor-pointer hover:scale-105 transition-transform duration-500 group" onClick={triggerEffect}>
                                <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#7b5807]/30 pointer-events-none animate-[spin_60s_linear_infinite]"></div>
                                <div className="absolute inset-0 rounded-full bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                                <div className="w-full h-full rounded-full overflow-hidden bg-black/20 p-2 shadow-inner flex items-center justify-center">
                                    <LazyImage alt="XI RPL B Logo" className="w-full h-full object-contain rounded-full transform hover:scale-105 transition-transform duration-500" src="/images/logo-kelas.webp" />
                                </div>
                                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                                    <span className="text-xs text-white/60 font-label-code bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">Klik untuk kejutan ✨</span>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-7 flex flex-col gap-space-md text-white text-center lg:text-left">
                            <div className="inline-flex items-center gap-1 w-max px-4 py-1 bg-white/10 backdrop-blur-sm rounded-full shadow-sm border border-white/20 mx-auto lg:mx-0">
                                <span className="material-symbols-outlined text-[#7b5807] text-sm">anchor</span>
                                <span className="font-label-nav-coordinates text-label-nav-coordinates text-white uppercase tracking-widest text-xs">RPL B • ANGKATAN 23</span>
                            </div>
                            <div className="space-y-1">
                                <h1 className="font-display-hero text-display-hero tracking-tight leading-tight text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
                                    Selamat Datang di Kelas <span className="text-[#7b5807] italic">RPL B 23'</span>
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white/50 animate-bounce">
                    <span className="text-xs font-label-code">SCROLL</span>
                    <span className="material-symbols-outlined text-xl">keyboard_arrow_down</span>
                </div>
            </section>

            <FloatingGameButton onClick={openMiniGamesModal} />

            <MiniGamesModal isOpen={isMiniGamesModalOpen} onClose={closeMiniGamesModal} />

            {/* SECTION STRUKTUR */}
            <div className="relative z-20" id="struktur-wrapper">
                <ScrollReveal animation="fade-up" duration={800}>
                    <div className="w-full py-4 px-gutter-mobile lg:px-gutter-desktop bg-surface-container-low/70 border-b border-outline-variant/30">
                        <div className="max-w-[1280px] mx-auto">
                            <h2 className="font-headline-lg text-headline-lg text-primary tracking-tight">Struktur Kelas XII RPL B 23'</h2>
                            <p className="font-body-md text-body-md text-on-surface-variant">Hierarki kelas XII RPL B 23'</p>
                        </div>
                    </div>
                </ScrollReveal>

                <div
                    className="max-w-[1280px] w-full mx-auto px-gutter-mobile lg:px-gutter-desktop py-space-2xl flex flex-col items-center bg-surface-container-low/70 relative"
                    style={{
                        backgroundImage: 'url("/images/assets/bg-struktur.webp")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        backgroundAttachment: 'fixed',
                        minHeight: '100vh'
                    }}
                >
                    <div className="absolute inset-0 bg-[#1a120e]/60 pointer-events-none"></div>

                    <div className="relative z-10 w-full flex flex-col items-center">
                        {/* Wali Kelas */}
                        <ScrollReveal animation="fade-up" delay={100} duration={800}>
                            <div className="flex flex-col items-center w-full">
                                <div className="flex items-center gap-space-xs mb-3">
                                    <span className="material-symbols-outlined text-[#d4a853] text-sm">stars</span>
                                    <span className="font-label-nav-coordinates text-label-nav-coordinates text-[#d4a853] tracking-widest uppercase font-bold">Wali Kelas</span>
                                    <span className="material-symbols-outlined text-[#d4a853] text-sm">stars</span>
                                </div>
                                <div className="relative w-[230px] sm:w-[250px] h-[345px] sm:h-[375px] group transition-transform duration-300 hover:scale-[1.02] cursor-pointer" onClick={() => openPengurusModal(waliKelasData, 'walikelas')}>
                                    <LazyImage alt="Bingkai Emas Bajak Laut" className="absolute inset-0 w-full h-full object-contain pointer-events-none z-20 drop-shadow-md" src={frameImage} />
                                    <div className="absolute inset-[4%_14%_16%_16%] h-[320px] z-10 flex flex-col items-center justify-center text-center px-1 bg-[#2c1f16] rounded-lg shadow-xl">
                                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-[#d4a853] shadow-md mb-2 shrink-0 bg-[#3d2b1f]">
                                            <LazyImage className="w-full h-full object-cover" src={waliKelasData.foto} alt={waliKelasData.nama} />
                                        </div>
                                        <h3 className="font-headline-sm text-sm sm:text-[15px] font-bold text-[#d4a853] leading-tight line-clamp-2 px-1">{waliKelasData.nama}</h3>
                                        <div className="mt-1.5 px-2 py-0.5 rounded-full bg-[#d4a853] text-[#1a120e] font-label-nav-coordinates text-[10px] tracking-wider uppercase font-semibold shadow-xs">Wali Kelas XI RPL B</div>
                                    </div>
                                </div>
                            </div>
                        </ScrollReveal>

                        <div className="flex flex-col items-center my-0 w-full">
                            <div className="w-1 h-10 bg-[#d4a853] shadow-sm"></div>
                            <div className="w-3.5 h-3.5 rounded-full bg-[#3d2b1f] border-2 border-[#d4a853] flex items-center justify-center -my-1 z-10">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#d4a853]"></div>
                            </div>
                            <div className="w-1 h-6 bg-[#d4a853] shadow-sm"></div>
                        </div>

                        {/* Ketua & Wakil */}
                        <ScrollReveal animation="fade-up" delay={200} duration={800}>
                            <div className="flex flex-col items-center w-full">
                                <div className="flex items-center gap-space-xs mb-3">
                                    <span className="material-symbols-outlined text-[#d4a853] text-sm">sailing</span>
                                    <span className="font-label-nav-coordinates text-label-nav-coordinates text-[#d4a853] tracking-widest uppercase font-bold">Ketua &amp; Wakil Ketua Kelas</span>
                                    <span className="material-symbols-outlined text-[#d4a853] text-sm">sailing</span>
                                </div>
                                <div className="w-full max-w-lg hidden sm:flex flex-col items-center mb-1">
                                    <div className="w-[58%] border-t-[3px] border-[#d4a853] relative">
                                        <div className="absolute -left-1 -top-1 w-2.5 h-2.5 rounded-full bg-[#d4a853]"></div>
                                        <div className="absolute -right-1 -top-1 w-2.5 h-2.5 rounded-full bg-[#d4a853]"></div>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-14 w-full">
                                    {ketua && (
                                        <div className="flex flex-col items-center">
                                            <div className="w-0.5 h-4 bg-[#d4a853] hidden sm:block"></div>
                                            <div className="relative w-[215px] sm:w-[235px] h-[325px] sm:h-[355px] group transition-transform duration-300 hover:scale-[1.02] cursor-pointer" onClick={() => openPengurusModal(ketua, 'ketua')}>
                                                <LazyImage alt="Bingkai Emas Bajak Laut" className="absolute inset-0 w-full h-full object-contain pointer-events-none z-20 drop-shadow-md" src={frameImage} />
                                                <div className="absolute inset-[2%_14%_16%_16%] h-[320px] z-10 flex flex-col items-center justify-center text-center px-1 bg-[#2c1f16] rounded-lg shadow-xl border border-[#d4a853]/30">
                                                    <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full overflow-hidden border-2 border-[#d4a853] shadow-md mb-2 shrink-0 bg-[#3d2b1f]">
                                                        <LazyImage className="w-full h-full object-cover" src={ketua.foto} alt={ketua.nama} />
                                                    </div>
                                                    <h3 className="font-headline-sm text-sm sm:text-[15px] font-bold text-[#d4a853] leading-tight line-clamp-2 px-1">{ketua.nama}</h3>
                                                    <div className="mt-1.5 px-2.5 py-0.5 rounded-full bg-[#d4a853] text-[#1a120e] font-label-nav-coordinates text-[10px] tracking-wider uppercase font-semibold shadow-xs">Ketua Kelas</div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {wakil && (
                                        <div className="flex flex-col items-center">
                                            <div className="w-0.5 h-4 bg-[#d4a853] hidden sm:block"></div>
                                            <div className="relative w-[215px] sm:w-[235px] h-[325px] sm:h-[355px] group transition-transform duration-300 hover:scale-[1.02] cursor-pointer" onClick={() => openPengurusModal(wakil, 'wakil')}>
                                                <LazyImage alt="Bingkai Emas Bajak Laut" className="absolute inset-0 w-full h-full object-contain pointer-events-none z-20 drop-shadow-md" src={frameImage} />
                                                <div className="absolute inset-[2%_14%_16%_16%] h-[320px] z-10 flex flex-col items-center justify-center text-center px-1 bg-[#2c1f16] rounded-lg shadow-xl border border-[#d4a853]/30">
                                                    <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full overflow-hidden border-2 border-[#d4a853] shadow-md mb-2 shrink-0 bg-[#3d2b1f]">
                                                        <LazyImage className="w-full h-full object-cover" src={wakil.foto} alt={wakil.nama} />
                                                    </div>
                                                    <h3 className="font-headline-sm text-sm sm:text-[15px] font-bold text-[#d4a853] leading-tight line-clamp-2 px-1">{wakil.nama}</h3>
                                                    <div className="mt-1.5 px-2.5 py-0.5 rounded-full bg-[#d4a853] text-[#1a120e] font-label-nav-coordinates text-[10px] tracking-wider uppercase font-semibold shadow-xs">Wakil Ketua Kelas</div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </ScrollReveal>

                        <div className="flex flex-col items-center my-0 w-full">
                            <div className="w-1 h-10 bg-[#d4a853] shadow-sm"></div>
                            <div className="w-3.5 h-3.5 rounded-full bg-[#3d2b1f] border-2 border-[#d4a853] flex items-center justify-center -my-1 z-10">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#d4a853]"></div>
                            </div>
                            <div className="w-1 h-6 bg-[#d4a853] shadow-sm"></div>
                        </div>

                        {/* Sekretaris & Bendahara */}
                        <ScrollReveal animation="fade-up" delay={300} duration={800}>
                            <div className="flex flex-col items-center w-full">
                                <div className="flex items-center gap-space-xs mb-3">
                                    <span className="material-symbols-outlined text-[#d4a853] text-sm">assignment</span>
                                    <span className="font-label-nav-coordinates text-label-nav-coordinates text-[#d4a853] tracking-widest uppercase font-bold">Sekretaris &amp; Bendahara</span>
                                    <span className="material-symbols-outlined text-[#d4a853] text-sm">assignment</span>
                                </div>
                                <div className="w-full max-w-5xl hidden md:flex flex-col items-center mb-1">
                                    <div className="w-[78%] border-t-[3px] border-[#d4a853] relative">
                                        <div className="absolute -left-1 -top-1 w-2.5 h-2.5 rounded-full bg-[#d4a853]"></div>
                                        <div className="absolute left-[33%] -top-1 w-2.5 h-2.5 rounded-full bg-[#d4a853]"></div>
                                        <div className="absolute left-[66%] -top-1 w-2.5 h-2.5 rounded-full bg-[#d4a853]"></div>
                                        <div className="absolute -right-1 -top-1 w-2.5 h-2.5 rounded-full bg-[#d4a853]"></div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 w-full max-w-5xl justify-items-center">
                                    {sekretaris[0] && (
                                        <div className="flex flex-col items-center w-full">
                                            <div className="w-0.5 h-4 bg-[#d4a853] hidden md:block"></div>
                                            <div className="relative w-[210px] h-[315px] group transition-transform duration-300 hover:scale-[1.02] cursor-pointer" onClick={() => openPengurusModal(sekretaris[0], 'sekretaris')}>
                                                <LazyImage alt="Bingkai Emas Bajak Laut" className="absolute inset-0 w-full h-full object-contain pointer-events-none z-20 drop-shadow-md" src={frameImage} />
                                                <div className="absolute inset-[2%_14%_16%_16%] h-[280px] z-10 flex flex-col items-center justify-center text-center px-1 bg-[#2c1f16] rounded-lg shadow-xl border border-[#d4a853]/30">
                                                    <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full overflow-hidden border-2 border-[#d4a853] shadow-md mb-2 shrink-0 bg-[#3d2b1f]">
                                                        <LazyImage className="w-full h-full object-cover" src={sekretaris[0].foto} alt={sekretaris[0].nama} />
                                                    </div>
                                                    <h3 className="font-headline-sm text-sm font-bold text-[#d4a853] leading-tight line-clamp-2 px-1">{sekretaris[0].nama}</h3>
                                                    <div className="mt-1.5 px-2.5 py-0.5 rounded-full bg-[#d4a853] text-[#1a120e] font-label-nav-coordinates text-[10px] tracking-wider uppercase font-semibold shadow-xs">Sekretaris 1</div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {sekretaris[1] && (
                                        <div className="flex flex-col items-center w-full">
                                            <div className="w-0.5 h-4 bg-[#d4a853] hidden md:block"></div>
                                            <div className="relative w-[210px] h-[315px] group transition-transform duration-300 hover:scale-[1.02] cursor-pointer" onClick={() => openPengurusModal(sekretaris[1], 'sekretaris')}>
                                                <LazyImage alt="Bingkai Emas Bajak Laut" className="absolute inset-0 w-full h-full object-contain pointer-events-none z-20 drop-shadow-md" src={frameImage} />
                                                <div className="absolute inset-[2%_14%_16%_16%] h-[280px] z-10 flex flex-col items-center justify-center text-center px-1 bg-[#2c1f16] rounded-lg shadow-xl border border-[#d4a853]/30">
                                                    <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full overflow-hidden border-2 border-[#d4a853] shadow-md mb-2 shrink-0 bg-[#3d2b1f]">
                                                        <LazyImage className="w-full h-full object-cover" src={sekretaris[1].foto} alt={sekretaris[1].nama} />
                                                    </div>
                                                    <h3 className="font-headline-sm text-sm font-bold text-[#d4a853] leading-tight line-clamp-2 px-1">{sekretaris[1].nama}</h3>
                                                    <div className="mt-1.5 px-2.5 py-0.5 rounded-full bg-[#d4a853] text-[#1a120e] font-label-nav-coordinates text-[10px] tracking-wider uppercase font-semibold shadow-xs">Sekretaris 2</div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {bendahara[0] && (
                                        <div className="flex flex-col items-center w-full">
                                            <div className="w-0.5 h-4 bg-[#d4a853] hidden md:block"></div>
                                            <div className="relative w-[210px] h-[315px] group transition-transform duration-300 hover:scale-[1.02] cursor-pointer" onClick={() => openPengurusModal(bendahara[0], 'bendahara')}>
                                                <LazyImage alt="Bingkai Emas Bajak Laut" className="absolute inset-0 w-full h-full object-contain pointer-events-none z-20 drop-shadow-md" src={frameImage} />
                                                <div className="absolute inset-[2%_14%_16%_16%] h-[280px] z-10 flex flex-col items-center justify-center text-center px-1 bg-[#2c1f16] rounded-lg shadow-xl border border-[#d4a853]/30">
                                                    <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full overflow-hidden border-2 border-[#d4a853] shadow-md mb-2 shrink-0 bg-[#3d2b1f]">
                                                        <LazyImage className="w-full h-full object-cover" src={bendahara[0].foto} alt={bendahara[0].nama} />
                                                    </div>
                                                    <h3 className="font-headline-sm text-sm font-bold text-[#d4a853] leading-tight line-clamp-2 px-1">{bendahara[0].nama}</h3>
                                                    <div className="mt-1.5 px-2.5 py-0.5 rounded-full bg-[#d4a853] text-[#1a120e] font-label-nav-coordinates text-[10px] tracking-wider uppercase font-semibold shadow-xs">Bendahara 1</div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {bendahara[1] && (
                                        <div className="flex flex-col items-center w-full">
                                            <div className="w-0.5 h-4 bg-[#d4a853] hidden md:block"></div>
                                            <div className="relative w-[210px] h-[315px] group transition-transform duration-300 hover:scale-[1.02] cursor-pointer" onClick={() => openPengurusModal(bendahara[1], 'bendahara')}>
                                                <LazyImage alt="Bingkai Emas Bajak Laut" className="absolute inset-0 w-full h-full object-contain pointer-events-none z-20 drop-shadow-md" src={frameImage} />
                                                <div className="absolute inset-[2%_14%_16%_16%] h-[280px] z-10 flex flex-col items-center justify-center text-center px-1 bg-[#2c1f16] rounded-lg shadow-xl border border-[#d4a853]/30">
                                                    <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full overflow-hidden border-2 border-[#d4a853] shadow-md mb-2 shrink-0 bg-[#3d2b1f]">
                                                        <LazyImage className="w-full h-full object-cover" src={bendahara[1].foto} alt={bendahara[1].nama} />
                                                    </div>
                                                    <h3 className="font-headline-sm text-sm font-bold text-[#d4a853] leading-tight line-clamp-2 px-1">{bendahara[1].nama}</h3>
                                                    <div className="mt-1.5 px-2.5 py-0.5 rounded-full bg-[#d4a853] text-[#1a120e] font-label-nav-coordinates text-[10px] tracking-wider uppercase font-semibold shadow-xs">Bendahara 2</div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </ScrollReveal>

                        <div className="flex flex-col items-center my-0 w-full">
                            <div className="w-1 h-10 bg-[#d4a853] shadow-sm"></div>
                            <div className="w-3.5 h-3.5 rounded-full bg-[#3d2b1f] border-2 border-[#d4a853] flex items-center justify-center -my-1 z-10">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#d4a853]"></div>
                            </div>
                            <div className="w-1 h-6 bg-[#d4a853] shadow-sm"></div>
                        </div>

                        {/* Seksi */}
                        <ScrollReveal animation="fade-up" delay={400} duration={800}>
                            <div className="flex flex-col items-center w-full">
                                <div className="flex items-center gap-space-xs mb-3">
                                    <span className="material-symbols-outlined text-[#d4a853] text-sm">settings_suggest</span>
                                    <span className="font-label-nav-coordinates text-label-nav-coordinates text-[#d4a853] tracking-widest uppercase font-bold">Seksi Kebersihan &amp; Rohani</span>
                                    <span className="material-symbols-outlined text-[#d4a853] text-sm">settings_suggest</span>
                                </div>
                                <div className="w-full max-w-3xl hidden md:flex flex-col items-center mb-1">
                                    <div className="w-[70%] border-t-[3px] border-[#d4a853] relative">
                                        <div className="absolute -left-1 -top-1 w-2.5 h-2.5 rounded-full bg-[#d4a853]"></div>
                                        <div className="absolute left-1/2 -translate-x-1/2 -top-1 w-2.5 h-2.5 rounded-full bg-[#d4a853]"></div>
                                        <div className="absolute -right-1 -top-1 w-2.5 h-2.5 rounded-full bg-[#d4a853]"></div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 w-full max-w-3xl justify-items-center">
                                    {seksi.map((sek, index) => (
                                        <div key={index} className="flex flex-col items-center w-full">
                                            <div className="w-0.5 h-4 bg-[#d4a853] hidden md:block"></div>
                                            <div className="relative w-[210px] h-[315px] group transition-transform duration-300 hover:scale-[1.02] cursor-pointer" onClick={() => openPengurusModal(sek, 'seksi')}>
                                                <LazyImage alt="Bingkai Emas Bajak Laut" className="absolute inset-0 w-full h-full object-contain pointer-events-none z-20 drop-shadow-md" src={frameImage} />
                                                <div className="absolute inset-[2%_14%_16%_16%] h-[280px] z-10 flex flex-col items-center justify-center text-center px-1 bg-[#2c1f16] rounded-lg shadow-xl border border-[#d4a853]/30">
                                                    <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full overflow-hidden border-2 border-[#d4a853] shadow-md mb-2 shrink-0 bg-[#3d2b1f]">
                                                        <LazyImage className="w-full h-full object-cover" src={sek.foto} alt={sek.nama} />
                                                    </div>
                                                    <h3 className="font-headline-sm text-sm font-bold text-[#d4a853] leading-tight line-clamp-2 px-1">{sek.nama}</h3>
                                                    <div className="mt-1.5 px-2.5 py-0.5 rounded-full bg-[#d4a853] text-[#1a120e] font-label-nav-coordinates text-[10px] tracking-wider uppercase font-semibold shadow-xs">{sek.jabatan}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </ScrollReveal>
                    </div>
                </div>
            </div>

            {/* SECTION DAFTAR MURID */}
            <section id="murid" className="w-full py-space-xl px-gutter-mobile lg:px-gutter-desktop overflow-hidden">
                <div className="max-w-[1280px] mx-auto">
                    <ScrollReveal animation="fade-up" duration={800}>
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-lg mb-space-xl">
                            <div className="flex flex-col gap-space-2xs max-w-2xl">
                                <h2 className="font-headline-lg text-headline-lg text-primary tracking-tight">Daftar Murid Kelas XII RPL B 23'</h2>
                            </div>
                        </div>
                    </ScrollReveal>

                    <ScrollReveal animation="fade-up" delay={100} duration={800}>
                        <div className="mb-space-lg">
                            <div className="p-space-md rounded-xl bg-surface-container-low shadow-sm flex flex-col md:flex-row gap-space-md items-center justify-between">
                                <div className="relative w-full md:w-96">
                                    <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">search</span>
                                    <input className="w-full pl-11 pr-4 py-2.5 rounded-lg bg-surface text-on-surface font-label-code text-label-code shadow-inner placeholder:text-on-surface-variant/70 focus:outline-none focus:ring-2 focus:ring-secondary/30 transition-all" placeholder="// Cari nama awak..." type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                                </div>
                            </div>
                        </div>
                    </ScrollReveal>

                    <ScrollReveal animation="fade-up" delay={200} duration={800}>
                        <div className="relative rounded-xl overflow-hidden" style={{ backgroundImage: 'url("/images/assets/bg-struktur.webp")', backgroundSize: '2000px', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
                            <div className="absolute inset-0 bg-black/40 sm:bg-black/30 z-0"></div>

                            <div className="relative z-10 w-full py-space-xl px-space-md">
                                <style dangerouslySetInnerHTML={{
                                    __html: `
                                        @keyframes scroll-left-rack {
                                            0% { transform: translateX(0); }
                                            100% { transform: translateX(-50%); }
                                        }
                                        @keyframes scroll-right-rack {
                                            0% { transform: translateX(-50%); }
                                            100% { transform: translateX(0); }
                                        }
                                        .infinite-scroll-left-rack { animation: scroll-left-rack 45s linear infinite; }
                                        .infinite-scroll-right-rack { animation: scroll-right-rack 45s linear infinite; }
                                        .scroll-mask-rack {
                                            mask: linear-gradient(90deg, transparent 0%, black 5%, black 95%, transparent 100%);
                                            -webkit-mask: linear-gradient(90deg, transparent 0%, black 5%, black 95%, transparent 100%);
                                        }
                                        .image-frame-item-rack { transition: transform 0.3s ease, filter 0.3s ease; flex-shrink: 0; cursor: pointer; }
                                        .image-frame-item-rack:hover { transform: scale(1.08); filter: brightness(1.15); z-index: 10; }
                                    `
                                }} />

                                {topRackStudents.length > 0 && (
                                    <div className="scroll-mask-rack w-full mb-6 sm:mb-10">
                                        <div className="infinite-scroll-left-rack flex gap-7 sm:gap-8 md:gap-12 lg:gap-20 w-max">
                                            {[...topRackStudents, ...topRackStudents, ...topRackStudents].map((murid, idx) => (
                                                <div key={`top-${murid.id}-${idx}`} className="image-frame-item-rack group relative flex flex-col items-center" onClick={() => openMuridModal(murid)}>
                                                    <div className="relative w-[90px] sm:w-[95px] md:w-[115px] lg:w-[135px] aspect-[2/3] flex items-center justify-center">
                                                        <LazyImage alt="Bingkai Foto Murid" className="pointer-events-none absolute inset-0 w-full h-full object-contain z-10 select-none" src="/images/assets/bingkai-murid.png" />
                                                        <div className="absolute inset-[8%_10%_12%_10%] sm:inset-[10%_12%_14%_12%] overflow-hidden rounded-[4px] bg-[#1a120b] shadow-inner flex items-center justify-center z-0">
                                                            <LazyImage className="w-full h-full object-cover object-center" src={murid.foto} alt={murid.nama} loading="lazy" />
                                                        </div>
                                                    </div>
                                                    <div className="mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 px-1 sm:px-2 py-0.5 rounded bg-black/80 border border-secondary/30 text-white font-headline-sm text-[8px] sm:text-[10px] lg:text-xs tracking-wide shadow-lg text-center backdrop-blur-sm whitespace-nowrap">
                                                        {murid.nama.split(' ').slice(0, 2).join(' ')}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {bottomRackStudents.length > 0 && (
                                    <div className="scroll-mask-rack w-full">
                                        <div className="infinite-scroll-right-rack flex gap-7 sm:gap-8 md:gap-12 lg:gap-20 w-max">
                                            {[...bottomRackStudents, ...bottomRackStudents, ...bottomRackStudents].reverse().map((murid, idx) => (
                                                <div key={`bottom-${murid.id}-${idx}`} className="image-frame-item-rack group relative flex flex-col items-center" onClick={() => openMuridModal(murid)}>
                                                    <div className="relative w-[90px] sm:w-[95px] md:w-[115px] lg:w-[135px] aspect-[2/3] flex items-center justify-center">
                                                        <LazyImage alt="Bingkai Foto Murid" className="pointer-events-none absolute inset-0 w-full h-full object-contain z-10 select-none" src="/images/assets/bingkai-murid.png" />
                                                        <div className="absolute inset-[8%_10%_12%_10%] sm:inset-[10%_12%_14%_12%] overflow-hidden rounded-[4px] bg-[#1a120b] shadow-inner flex items-center justify-center z-0">
                                                            <LazyImage className="w-full h-full object-cover object-center" src={murid.foto} alt={murid.nama} loading="lazy" />
                                                        </div>
                                                    </div>
                                                    <div className="mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 px-1 sm:px-2 py-0.5 rounded bg-black/80 border border-secondary/30 text-white font-headline-sm text-[8px] sm:text-[10px] lg:text-xs tracking-wide shadow-lg text-center backdrop-blur-sm whitespace-nowrap">
                                                        {murid.nama.split(' ').slice(0, 2).join(' ')}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {topRackStudents.length === 0 && bottomRackStudents.length === 0 && (
                                    <div className="text-center py-12">
                                        <span className="material-symbols-outlined text-6xl text-white/30">search_off</span>
                                        <p className="font-body-lg text-body-lg text-white/60 mt-4">Tidak ada awak kapal yang ditemukan</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            {/* SECTION PROJECTS */}
            <section id="projects" className="w-full py-space-xl px-gutter-mobile lg:px-gutter-desktop">
                <div className="max-w-[1280px] mx-auto">
                    <ScrollReveal animation="fade-up" duration={800}>
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-lg mb-space-xl">
                            <div className="flex flex-col gap-space-2xs max-w-2xl">
                                <h2 className="font-headline-lg text-headline-lg text-primary tracking-tight">Wall of Projects</h2>
                                <p className="font-body-lg text-body-lg text-on-surface-variant">Koleksi karya terbaik dari murid XII RPL B 23'</p>
                            </div>
                        </div>
                    </ScrollReveal>

                    <ScrollReveal animation="zoom-in" delay={100} duration={900}>
                        <div className="relative rounded-xl overflow-hidden">
                            <div className="absolute inset-0 w-full h-full z-0" style={{ backgroundImage: 'url("/images/assets/bg-proyek.webp")', backgroundSize: '1250px', backgroundPosition: 'center top -10px', backgroundRepeat: 'no-repeat' }}></div>
                            <div className="absolute inset-0 bg-black/40 z-0"></div>

                            <div className="relative z-10">
                                <DraggableContainer variant="masonry" className="bg-transparent">
                                    <GridBody>
                                        {projectsData.map((project, index) => (
                                            <GridItem key={`${project.id}-${index}`} className="relative h-80 w-60 md:h-96 md:w-72 group">
                                                <div className="absolute inset-0 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
                                                    <LazyImage src={project.image} alt={project.title} className="pointer-events-none absolute h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                                                    <div className="absolute bottom-0 left-0 right-0 p-4">
                                                        <h3 className="font-headline-sm text-headline-sm text-white font-bold">{project.title}</h3>
                                                        <span className="font-label-code text-label-code text-secondary text-xs">{project.category}</span>
                                                        <div className="mt-2 flex items-center gap-2">
                                                            <a href={project.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-white/80 hover:text-secondary transition-colors font-label-code text-label-code text-xs bg-white/10 px-2 py-1 rounded-full">
                                                                <span>Lihat Proyek</span>
                                                                <span className="material-symbols-outlined text-sm">open_in_new</span>
                                                            </a>
                                                        </div>
                                                        <div className="mt-2 pt-2 border-t border-white/20 flex items-center gap-1.5">
                                                            <span className="material-symbols-outlined text-sm text-secondary">developer_mode</span>
                                                            <span className="font-label-code text-label-code text-white/70 text-[10px]">
                                                                <span className="text-secondary font-semibold">{project.developer}</span>
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </GridItem>
                                        ))}
                                    </GridBody>
                                </DraggableContainer>
                            </div>

                            <div className="absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-black/50 to-transparent pointer-events-none z-10"></div>
                            <div className="absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-black/50 to-transparent pointer-events-none z-10"></div>
                            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/50 to-transparent pointer-events-none z-10"></div>
                        </div>
                    </ScrollReveal>

                    <ScrollReveal animation="fade-up" delay={200} duration={800}>
                        <div className="flex items-center justify-center gap-2 mt-4 text-on-surface-variant/60">
                            <span className="material-symbols-outlined text-sm">swipe</span>
                            <span className="font-label-code text-label-code">Drag atau scroll untuk menjelajahi proyek</span>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            <MuridModal isOpen={isMuridModalOpen} onClose={closeMuridModal} data={selectedMurid} />
            <PengurusModal isOpen={isPengurusModalOpen} onClose={closePengurusModal} data={selectedPengurus} type={pengurusModalType} />
            <GalleryModal isOpen={isGalleryModalOpen} onClose={closeGalleryModal} data={selectedGallery} />

            {/* SECTION SOCIAL MEDIA */}
            <section id="social" className="w-full bg-surface py-space-xl px-gutter-mobile lg:px-gutter-desktop">
                <div className="max-w-[1280px] mx-auto flex flex-col gap-space-xl">
                    <ScrollReveal animation="fade-up" duration={800}>
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-lg">
                            <div className="flex flex-col gap-space-2xs max-w-2xl">
                                <h2 className="font-headline-lg text-headline-lg text-primary tracking-tight">Social Media RPL B 23'</h2>
                                <p className="font-body-md text-body-md text-on-surface-variant">Video dan momen terbaik dari awak kapal</p>
                            </div>
                            <div className="flex flex-wrap items-center gap-space-sm">
                                <a href="https://www.tiktok.com/@erpeelbe_?_t=ZS-906imFOCMQk&_r=1" target="_blank" rel="noopener noreferrer" className="flex items-center gap-space-2xs px-space-md py-space-sm bg-black text-white rounded-lg hover:shadow-lg transition-all font-title-sm text-title-sm">
                                    <i className="fa-brands fa-tiktok text-lg"></i>
                                    <span>Follow TikTok</span>
                                </a>
                            </div>
                        </div>
                    </ScrollReveal>

                    <ScrollReveal animation="zoom-in" delay={100} duration={900}>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <LazyTikTokEmbed videoId="7508712630828436742" title="TikTok Video 1" className="h-full" />
                            <LazyTikTokEmbed videoId="7431697249471712518" title="TikTok Photo 2" className="h-full" />
                            <LazyTikTokEmbed videoId="7508602625890290950" title="TikTok Video 3" className="h-full" />
                        </div>
                    </ScrollReveal>

                    <ScrollReveal animation="fade-up" delay={200} duration={800}>
                        <a href="https://www.tiktok.com/@erpeelbe_?_t=ZS-906imFOCMQk&_r=1" target="_blank" rel="noopener noreferrer" className="text-center text-secondary hover:text-primary transition-colors font-label-code text-label-code text-sm block">
                            Lihat Semua Video TikTok →
                        </a>
                    </ScrollReveal>
                </div>
            </section>

            {/* SECTION GALLERY */}
            <section id="gallery" className="w-full bg-surface-container-low py-space-xl px-gutter-mobile lg:px-gutter-desktop overflow-x-hidden">
                <div className="max-w-[1280px] mx-auto flex flex-col gap-space-xl">
                    <ScrollReveal animation="fade-up" duration={800}>
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-lg">
                            <div className="flex flex-col gap-space-2xs max-w-2xl">
                                <h2 className="font-headline-lg text-headline-lg text-primary tracking-tight">Galeri Kenangan XII RPL B 23'</h2>
                            </div>
                        </div>
                    </ScrollReveal>

                    <ScrollReveal animation="zoom-in" delay={100} duration={900}>
                        <GallerySwiper galleryData={galleryData} openGalleryModal={openGalleryModal} LazyImage={LazyImage} />
                    </ScrollReveal>
                </div>
            </section>

            {/* SECTION KATA KATA AGIT */}
            <section id="kata-kata" className="w-full relative">
                <div className="relative z-10">
                    <ScrollReveal animation="fade-up" duration={800}>
                        <KataKataBuku />
                    </ScrollReveal>
                </div>
            </section>

            <script dangerouslySetInnerHTML={{
                __html: `
                    document.getElementById('downloadManifestBtn')?.addEventListener('click', function() {
                        const originalText = this.innerHTML;
                        this.innerHTML = '<span class="material-symbols-outlined text-base animate-spin">refresh</span><span>Mengarsip Salinan Logbook...</span>';
                        setTimeout(() => {
                            this.innerHTML = '<span class="material-symbols-outlined text-base">check</span><span>Piagam Terverifikasi (PDF)</span>';
                            setTimeout(() => { this.innerHTML = originalText; }, 3000);
                        }, 1200);
                    });
                `
            }} />
        </div>
    );
};

export default Home;