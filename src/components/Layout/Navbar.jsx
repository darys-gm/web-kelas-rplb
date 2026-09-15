import { useState, useEffect, useRef, useCallback } from 'react';

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('home');
    const [indicatorStyle, setIndicatorStyle] = useState({
        translateX: 0,
        width: 0,
        isReady: false,
    });

    // Refs untuk setiap button menu
    const navRefs = useRef({});
    const containerRef = useRef(null);
    const rafRef = useRef(null);
    const lastScrollRef = useRef(0);

    // Menu items sesuai section yang ada di Home.jsx
    const navItems = [
        { id: 'home', label: 'Beranda', icon: 'home' },
        { id: 'struktur-wrapper', label: 'Struktur', icon: 'account_tree' },
        { id: 'murid', label: 'Daftar Murid', icon: 'group' },
        { id: 'projects', label: 'Projects', icon: 'code' },
        { id: 'social', label: 'Social Media', icon: 'share' },
        { id: 'gallery', label: 'Gallery', icon: 'photo_library' },
    ];

    // ============================================
    // UPDATE INDICATOR (OPTIMIZED)
    // ============================================
    const updateIndicator = useCallback(() => {
        // Cancel animation frame yang pending
        if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
        }

        rafRef.current = requestAnimationFrame(() => {
            const activeButton = navRefs.current[activeSection];
            const container = containerRef.current;

            if (activeButton && container) {
                const buttonRect = activeButton.getBoundingClientRect();
                const containerRect = container.getBoundingClientRect();

                const newTranslateX = buttonRect.left - containerRect.left;
                const newWidth = buttonRect.width;

                setIndicatorStyle((prev) => {
                    // Skip update jika nilainya sama (hindari re-render tidak perlu)
                    if (
                        prev.translateX === newTranslateX &&
                        prev.width === newWidth &&
                        prev.isReady
                    ) {
                        return prev;
                    }
                    return {
                        translateX: newTranslateX,
                        width: newWidth,
                        isReady: true,
                    };
                });
            }
        });
    }, [activeSection]);

    // ============================================
    // UPDATE INDICATOR SAAT ACTIVE SECTION BERUBAH
    // ============================================
    useEffect(() => {
        updateIndicator();

        return () => {
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }
        };
    }, [activeSection, updateIndicator]);

    // ============================================
    // HANDLE RESIZE
    // ============================================
    useEffect(() => {
        const handleResize = () => {
            updateIndicator();
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [updateIndicator]);

    // ============================================
    // DETEKSI SECTION AKTIF SAAT SCROLL (THROTTLED)
    // ============================================
    useEffect(() => {
        let scrollRaf = null;

        const handleScroll = () => {
            // Cancel jika ada pending
            if (scrollRaf) return;

            scrollRaf = requestAnimationFrame(() => {
                const scrollPosition = window.scrollY + 120;

                let currentSection = 'home';
                navItems.forEach((item) => {
                    const section = document.getElementById(item.id);
                    if (section) {
                        const sectionTop = section.offsetTop;
                        const sectionBottom = sectionTop + section.offsetHeight;
                        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                            currentSection = item.id;
                        }
                    }
                });

                setActiveSection((prev) => (prev === currentSection ? prev : currentSection));
                scrollRaf = null;
            });
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (scrollRaf) cancelAnimationFrame(scrollRaf);
        };
    }, []);

    // ============================================
    // FUNGSI SCROLL KE SECTION
    // ============================================
    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            const offset = 80;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
        setIsMobileMenuOpen(false);
        setActiveSection(sectionId);
    };

    return (
        <nav className="fixed top-0 w-full z-50 bg-[#0a0603] border-b-2 border-[#d4a853]/40 shadow-[0_4px_30px_rgba(123,88,7,0.15)]">
            {/* Decorative top line */}
            <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-[#d4a853]/60 to-transparent"></div>

            <div className="max-w-[1280px] mx-auto px-4 lg:px-6">
                <div className="flex justify-between items-center h-16 md:h-20">
                    {/* Logo & Brand */}
                    <div
                        className="flex items-center gap-3 cursor-pointer group"
                        onClick={() => scrollToSection('home')}
                    >
                        <div className="relative">
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-[#d4a853]/30 to-[#d4a853]/10 border-2 border-[#d4a853]/40 flex items-center justify-center overflow-hidden group-hover:border-[#d4a853] group-hover:shadow-lg group-hover:shadow-[#d4a853]/20 transition-all duration-300">
                                <img
                                    src="/images/logo-kelas.webp"
                                    alt="Logo"
                                    className="w-full h-full object-cover p-1"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-display-hero text-display-hero text-[#d4a853] text-sm md:text-base tracking-wider font-bold leading-tight">
                                XII RPL B 23'
                            </span>
                        </div>
                    </div>

                    {/* Desktop Menu - Smooth Sliding Indicator */}
                    <div
                        ref={containerRef}
                        className="hidden lg:flex items-center gap-0.5 bg-[#1a120e] rounded-full px-1 py-1 border border-[#d4a853]/20 shadow-inner relative"
                    >
                        {/* Sliding Background Pill - GPU Accelerated */}
                        <div
                            className={`absolute top-1 bottom-1 rounded-full bg-gradient-to-r from-[#d4a853] to-[#b8860b] shadow-lg shadow-[#d4a853]/30 ${
                                indicatorStyle.isReady ? 'opacity-100' : 'opacity-0'
                            }`}
                            style={{
                                width: `${indicatorStyle.width}px`,
                                transform: `translateX(${indicatorStyle.translateX}px)`,
                                transition: indicatorStyle.isReady
                                    ? 'transform 600ms cubic-bezier(0.25, 1, 0.5, 1), width 600ms cubic-bezier(0.25, 1, 0.5, 1), opacity 200ms ease-out'
                                    : 'none',
                                willChange: 'transform, width',
                                backfaceVisibility: 'hidden',
                                WebkitFontSmoothing: 'antialiased',
                            }}
                        />

                        {/* Sliding Top Dot */}
                        <div
                            className={`absolute top-0 h-1 bg-yellow-400 rounded-full shadow-lg shadow-yellow-400/50 ${
                                indicatorStyle.isReady ? 'opacity-100' : 'opacity-0'
                            }`}
                            style={{
                                width: '12px',
                                transform: `translateX(${indicatorStyle.translateX + indicatorStyle.width / 2 - 6}px) translateY(-2px)`,
                                transition: indicatorStyle.isReady
                                    ? 'transform 600ms cubic-bezier(0.25, 1, 0.5, 1), opacity 200ms ease-out'
                                    : 'none',
                                willChange: 'transform',
                                backfaceVisibility: 'hidden',
                            }}
                        />

                        {/* Sliding Bottom Dot */}
                        <div
                            className={`absolute bottom-0 w-1.5 h-1.5 bg-yellow-400 rounded-full shadow-lg shadow-yellow-400/50 ${
                                indicatorStyle.isReady ? 'opacity-100' : 'opacity-0'
                            }`}
                            style={{
                                transform: `translateX(${indicatorStyle.translateX + indicatorStyle.width / 2 - 3}px) translateY(4px)`,
                                transition: indicatorStyle.isReady
                                    ? 'transform 600ms cubic-bezier(0.25, 1, 0.5, 1), opacity 200ms ease-out'
                                    : 'none',
                                willChange: 'transform',
                                backfaceVisibility: 'hidden',
                            }}
                        />

                        {/* Menu Buttons */}
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                ref={(el) => (navRefs.current[item.id] = el)}
                                onClick={() => scrollToSection(item.id)}
                                className={`relative px-4 py-2 rounded-full font-label-nav-coordinates text-label-nav-coordinates flex items-center gap-2 z-10 ${
                                    activeSection === item.id
                                        ? 'text-[#1a120e] font-semibold'
                                        : 'text-[#d4a853] hover:text-[#e8c060]'
                                }`}
                                style={{
                                    transition: 'color 400ms cubic-bezier(0.25, 1, 0.5, 1)',
                                }}
                            >
                                <span className="material-symbols-outlined text-sm">{item.icon}</span>
                                <span className="text-sm">{item.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="lg:hidden w-10 h-10 text-[#d4a853] rounded-full bg-gradient-to-br from-[#d4a853]/20 to-[#d4a853]/5 border border-[#d4a853]/20 flex items-center justify-center hover:bg-[#d4a853]/20 hover:border-[#d4a853]/40 transition-all"
                    >
                        <span className="material-symbols-outlined text-[#d4a853]">
                            {isMobileMenuOpen ? 'close' : 'menu'}
                        </span>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`lg:hidden bg-gradient-to-b from-[#0a0603] to-[#1a120e] border-t border-[#d4a853]/20 shadow-2xl transition-all duration-300 ${
                isMobileMenuOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
            }`}>
                <div className="max-w-[1280px] mx-auto px-4 py-4">
                    <div className="flex flex-col gap-1">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => scrollToSection(item.id)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-title-sm text-title-sm transition-all duration-300 ${
                                    activeSection === item.id
                                        ? 'bg-gradient-to-r from-[#d4a853] to-[#b8860b] text-[#1a120e] shadow-lg font-semibold'
                                        : 'text-[#d4a853] hover:bg-[#d4a853]/10 hover:text-[#e8c060]'
                                }`}
                            >
                                <span className="material-symbols-outlined text-xl">{item.icon}</span>
                                <span>{item.label}</span>
                                {activeSection === item.id && (
                                    <span className="ml-auto text-[#1a120e]">▶</span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;