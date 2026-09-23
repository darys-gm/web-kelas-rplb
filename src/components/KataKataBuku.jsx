import React, { useState, useRef, useCallback, useEffect } from 'react';
import HTMLFlipBook from 'react-pageflip';
import quotesData from '../data/quotes';

// ============================================
// KONFIGURASI — DIPISAH AGAR FLEKSIBEL
// ============================================

// 🔥 Ukuran HALAMAN buku (untuk HTMLFlipBook)
const PAGE_WIDTH = 340;
const PAGE_HEIGHT = 480;

// 🔥 Ukuran GAMBAR kaca pembesar (png + gagang)
const GLASS_SIZE = 220;

// 🔥 Ukuran LENSA zoom (lingkaran tempat konten diperbesar)
const LENS_SIZE = 110;

// 🔥 Offset posisi lensa relatif ke titik tengah gambar kaca
const LENS_OFFSET = {
    x: -30,
    y: -30,
};

// 🔥 Faktor zoom konten di dalam lensa
const MAG = 1.8;

// Posisi awal kaca di pojok kanan bawah buku
const INITIAL_OFFSET = {
    right: 250,
    bottom: 60,
};

const DRAG_DELAY = 120;

// ============================================
// HALAMAN KOSONG
// ============================================
const EmptyPage = React.forwardRef((props, ref) => (
    <div ref={ref} className="kkb-page-empty" data-density="hard">
        <div className="w-full h-full flex items-center justify-center">
            <span className="font-serif text-[#d4a853]/20 text-[10px] tracking-[0.3em] uppercase">
                ~ XII RPL B 23' ~
            </span>
        </div>
    </div>
));
EmptyPage.displayName = 'EmptyPage';

// ============================================
// COVER DEPAN
// ============================================
const FrontCover = React.forwardRef((props, ref) => (
    <div ref={ref} className="kkb-page-cover" data-density="hard">
        <div className="w-full h-full flex flex-col items-center justify-center px-6 text-center relative">
            <div className="absolute top-3 left-3 w-8 h-8 sm:w-12 sm:h-12 border-t-4 border-l-4 border-[#d4a853] rounded-tl-lg" />
            <div className="absolute top-3 right-3 w-8 h-8 sm:w-12 sm:h-12 border-t-4 border-r-4 border-[#d4a853] rounded-tr-lg" />
            <div className="absolute bottom-3 left-3 w-8 h-8 sm:w-12 sm:h-12 border-b-4 border-l-4 border-[#d4a853] rounded-bl-lg" />
            <div className="absolute bottom-3 right-3 w-8 h-8 sm:w-12 sm:h-12 border-b-4 border-r-4 border-[#d4a853] rounded-br-lg" />

            <div
                className="w-16 h-16 sm:w-24 sm:h-24 rounded-full flex items-center justify-center mb-4 sm:mb-6 overflow-hidden"
                style={{
                    background: 'radial-gradient(circle, #d4a853 0%, #8b6f47 70%, #5c4528 100%)',
                    boxShadow: '0 0 40px rgba(212, 168, 83, 0.5)',
                }}
            >
                <img
                    src="/images/logo-kelas.webp"
                    alt="Logo Kelas"
                    className="w-full h-full object-contain p-2 sm:p-3"
                    draggable={false}
                    onError={(e) => {
                        e.target.style.display = 'none';
                        if (!e.target.parentNode.querySelector('.logo-fallback')) {
                            const fallback = document.createElement('span');
                            fallback.className = 'logo-fallback material-symbols-outlined text-3xl sm:text-5xl text-[#1a120b]';
                            fallback.textContent = 'sailing';
                            e.target.parentNode.appendChild(fallback);
                        }
                    }}
                />
            </div>

            <h1
                className="font-serif text-xl sm:text-3xl font-black text-[#d4a853] tracking-widest uppercase mb-3 sm:mb-4"
                style={{ textShadow: '0 4px 8px rgba(0,0,0,0.9), 0 0 30px rgba(212,168,83,0.6)' }}
            >
                Kata Kata
            </h1>

            <div className="flex items-center gap-2 sm:gap-3 justify-center mb-3 sm:mb-4">
                <div className="w-10 sm:w-14 h-[2px] bg-[#d4a853]" />
                <span className="material-symbols-outlined text-[#d4a853] text-lg sm:text-2xl">skull</span>
                <div className="w-10 sm:w-14 h-[2px] bg-[#d4a853]" />
            </div>

            <h2 className="font-serif text-lg sm:text-2xl font-black text-[#d4a853] tracking-wider mb-6 sm:mb-8">
                AGIT
            </h2>

            <p className="font-serif text-[#d4a853]/85 text-[10px] sm:text-xs tracking-[0.3em] uppercase mb-1">
                XII RPL B 23'
            </p>
            <p className="font-serif text-[#d4a853]/65 text-[9px] sm:text-[10px] italic">
                Catatan Awak Kapal
            </p>
        </div>
    </div>
));
FrontCover.displayName = 'FrontCover';

// ============================================
// HALAMAN ISI
// ============================================
const ContentPage = React.forwardRef(({ person, pageNumber }, ref) => {
    if (!person) {
        return (
            <div ref={ref} className="kkb-page-content">
                <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center opacity-30">
                        <span className="material-symbols-outlined text-5xl text-[#8b6f47]">auto_stories</span>
                        <p className="text-[10px] tracking-widest text-[#8b6f47] mt-2 uppercase font-serif">
                            Halaman Kosong
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div ref={ref} className="kkb-page-content">
            <div className="w-full h-full relative">
                <div className="absolute top-2 left-2 sm:top-3 sm:left-3 w-5 h-5 sm:w-7 sm:h-7 border-t-2 border-l-2 border-[#8b6f47]/40 rounded-tl-md pointer-events-none" />
                <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 w-5 h-5 sm:w-7 sm:h-7 border-b-2 border-r-2 border-[#8b6f47]/40 rounded-br-md pointer-events-none" />

                <div className="w-full h-full flex flex-col items-center justify-center px-3 sm:px-4 py-4 sm:py-5 text-center">
                    <div className="relative w-[80px] h-[120px] sm:w-[110px] sm:h-[165px] mb-2 sm:mb-3">
                        <div
                            className="absolute inset-0 rounded-sm"
                            style={{
                                background: 'linear-gradient(135deg, #d4a853 0%, #8b6f47 50%, #d4a853 100%)',
                                padding: '3px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                            }}
                        >
                            <div className="w-full h-full bg-[#1a120b] rounded-sm overflow-hidden flex items-center justify-center relative">
                                <img
                                    src={person.foto}
                                    alt={person.nama}
                                    className="w-full h-full object-cover"
                                    draggable={false}
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        if (!e.target.parentNode.querySelector('.photo-error-icon')) {
                                            const icon = document.createElement('div');
                                            icon.className = 'photo-error-icon absolute inset-0 flex items-center justify-center';
                                            icon.innerHTML = '<span class="material-symbols-outlined text-4xl text-[#8b6f47]">person</span>';
                                            e.target.parentNode.appendChild(icon);
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    <h3 className="font-serif text-[11px] sm:text-sm font-bold text-[#3d2914] leading-tight mb-1 sm:mb-1.5 px-1 line-clamp-2">
                        {person.nama}
                    </h3>

                    <div
                        className="px-2 sm:px-2.5 py-0.5 rounded-full text-[7px] sm:text-[9px] tracking-widest uppercase font-bold mb-1.5 sm:mb-2.5"
                        style={{
                            background: 'linear-gradient(135deg, #d4a853 0%, #b8935a 100%)',
                            color: '#1a120e',
                        }}
                    >
                        {person.jabatan}
                    </div>

                    <div className="flex items-center gap-1.5 sm:gap-2 w-full max-w-[120px] sm:max-w-[150px] mb-1.5 sm:mb-2.5">
                        <div className="flex-1 h-[1px] bg-[#8b6f47]/40" />
                        <span className="material-symbols-outlined text-[#8b6f47] text-[10px] sm:text-xs">anchor</span>
                        <div className="flex-1 h-[1px] bg-[#8b6f47]/40" />
                    </div>

                    <div className="relative px-2 max-w-[180px] sm:max-w-[220px]">
                        <span className="absolute -top-2 sm:-top-3 -left-1 font-serif text-2xl sm:text-4xl leading-none text-[#8b6f47]/25 select-none pointer-events-none">
                            "
                        </span>
                        <p className="font-serif text-[9px] sm:text-[11px] text-[#3d2914] italic leading-relaxed">
                            {person.quote}
                        </p>
                        <span className="absolute -bottom-4 sm:-bottom-5 -right-1 font-serif text-2xl sm:text-4xl leading-none text-[#8b6f47]/25 select-none pointer-events-none">
                            "
                        </span>
                    </div>
                </div>

                {pageNumber && (
                    <div className="absolute bottom-1.5 sm:bottom-2 left-1/2 -translate-x-1/2 text-[8px] sm:text-[10px] tracking-widest text-[#8b6f47]/60 font-serif">
                        — {pageNumber} —
                    </div>
                )}
            </div>
        </div>
    );
});
ContentPage.displayName = 'ContentPage';

// ============================================
// BACK COVER
// ============================================
const BackCover = React.forwardRef((props, ref) => (
    <div ref={ref} className="kkb-page-cover" data-density="hard">
        <div className="w-full h-full flex flex-col items-center justify-center">
            <span className="material-symbols-outlined text-4xl sm:text-6xl text-[#d4a853]/70">anchor</span>
            <p className="font-serif text-[#d4a853] text-base sm:text-lg italic mt-4 sm:mt-6 tracking-widest">
                ~ Tamat ~
            </p>
            <p className="font-serif text-[#d4a853]/60 text-[9px] sm:text-[10px] italic mt-2">
                XII RPL B 23'
            </p>
        </div>
    </div>
));
BackCover.displayName = 'BackCover';

// ============================================
// KOMPONEN UTAMA
// ============================================
const KataKataBuku = () => {
    const bookRef = useRef(null);
    const wrapperRef = useRef(null);
    const bookContainerRef = useRef(null);
    const zoomWrapRef = useRef(null);
    const zoomInnerRef = useRef(null);
    const dragTimerRef = useRef(null);
    const [currentPage, setCurrentPage] = useState(0);

    const [screenSize, setScreenSize] = useState({
        isMobile: false,
        isTablet: false,
        scale: 1,
    });

    // Posisi kaca di wrapper (pusat gambar kaca)
    const [magnifier, setMagnifier] = useState({
        posX: 0,
        posY: 0,
        isDragging: false,
        isPressing: false,
    });

    useEffect(() => {
        const handleResize = () => {
            const w = window.innerWidth;
            let isMobile = false;
            let isTablet = false;
            let scale = 1;

            if (w <= 480) { isMobile = true; scale = 0.42; }
            else if (w <= 640) { isMobile = true; scale = 0.5; }
            else if (w <= 768) { isTablet = true; scale = 0.6; }
            else if (w <= 1024) { isTablet = true; scale = 0.75; }
            else if (w <= 1280) { scale = 0.85; }
            else { scale = 1; }

            setScreenSize({ isMobile, isTablet, scale });
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Set posisi awal kaca
    useEffect(() => {
        if (!wrapperRef.current) return;
        const rect = wrapperRef.current.getBoundingClientRect();
        setMagnifier((prev) => ({
            ...prev,
            posX: rect.width - INITIAL_OFFSET.right,
            posY: rect.height - INITIAL_OFFSET.bottom,
        }));
    }, [screenSize.scale]);

    // Lock scroll
    useEffect(() => {
        if (magnifier.isDragging) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [magnifier.isDragging]);

    const onPageChange = useCallback((e) => {
        setCurrentPage(e.data);
    }, []);

    const goPrev = useCallback(() => bookRef.current?.pageFlip().flipPrev(), []);
    const goNext = useCallback(() => bookRef.current?.pageFlip().flipNext(), []);

    // Clone isi buku ke dalam zoom inner
    const syncZoomLayer = useCallback(() => {
        const zoomInner = zoomInnerRef.current;
        const bookContainer = bookContainerRef.current;
        if (!zoomInner || !bookContainer) return;

        zoomInner.innerHTML = '';
        for (const child of bookContainer.children) {
            if (child.classList && (child.classList.contains('kkb-magnifier') || child.classList.contains('kkb-lens-standalone'))) continue;
            zoomInner.appendChild(child.cloneNode(true));
        }
    }, []);

    useEffect(() => {
        syncZoomLayer();
    }, [currentPage, syncZoomLayer]);

    // Hitung posisi lensa di wrapper
    const getLensPos = () => ({
        x: magnifier.posX + LENS_OFFSET.x,
        y: magnifier.posY + LENS_OFFSET.y,
    });

    // Update zoom layer
    const placeZoom = useCallback(() => {
        const zoomWrap = zoomWrapRef.current;
        const zoomInner = zoomInnerRef.current;
        const bookContainer = bookContainerRef.current;
        if (!zoomWrap || !zoomInner || !bookContainer) return;

        const B = {
            w: bookContainer.clientWidth,
            h: bookContainer.clientHeight,
        };
        if (!B.w) return;

        const lensPos = getLensPos();
        const lensRadius = LENS_SIZE / 2;

        // Posisi lensa relatif ke buku (dalam koordinat wrapper)
        const bookRect = bookContainer.getBoundingClientRect();
        const wrapperRect = wrapperRef.current.getBoundingClientRect();
        const bookOffsetX = bookRect.left - wrapperRect.left;
        const bookOffsetY = bookRect.top - wrapperRect.top;

        // Posisi lensa relatif ke buku (undo scale)
        const lensBookX = (lensPos.x - bookOffsetX) / screenSize.scale;
        const lensBookY = (lensPos.y - bookOffsetY) / screenSize.scale;

        // Clamp posisi lensa di dalam buku
        const clampedBookX = Math.max(0, Math.min(lensBookX, B.w));
        const clampedBookY = Math.max(0, Math.min(lensBookY, B.h));

        // Mask: lingkaran yang mengikuti posisi lensa
        const mask = `radial-gradient(circle ${lensRadius}px at ${lensPos.x}px ${lensPos.y}px, #000 calc(100% - 1px), transparent 100%)`;
        zoomWrap.style.maskImage = mask;
        zoomWrap.style.webkitMaskImage = mask;
        zoomWrap.style.opacity = magnifier.isDragging ? '1' : '0';

        // Transform zoom: titik di bawah lensa harus tampil di tengah lensa
        const translateX = lensPos.x - clampedBookX * MAG * screenSize.scale;
        const translateY = lensPos.y - clampedBookY * MAG * screenSize.scale;

        zoomInner.style.width = `${B.w}px`;
        zoomInner.style.height = `${B.h}px`;
        zoomInner.style.transformOrigin = '0 0';
        zoomInner.style.transform = `translate(${translateX}px, ${translateY}px) scale(${MAG * screenSize.scale})`;
    }, [magnifier.posX, magnifier.posY, magnifier.isDragging, screenSize.scale]);

    useEffect(() => {
        placeZoom();
    }, [placeZoom]);

    // 🔥 CEK APAKAH KURSOR DI DALAM AREA KACA PEMBESAR
    const isCursorInsideGlass = useCallback((clientX, clientY) => {
        if (!wrapperRef.current) return false;

        const rect = wrapperRef.current.getBoundingClientRect();
        const cursorX = clientX - rect.left;
        const cursorY = clientY - rect.top;

        const dx = cursorX - magnifier.posX;
        const dy = cursorY - magnifier.posY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Radius kaca
        const glassRadius = GLASS_SIZE / 2;

        return distance <= glassRadius;
    }, [magnifier.posX, magnifier.posY]);

    // 🔥 GUNAKAN CAPTURE PHASE UNTUK MENCEGAH EVENT SAMPAI KE react-pageflip
    const handleMouseDownCapture = useCallback((e) => {
        if (!wrapperRef.current) return;

        // Jika kursor di dalam kaca → stopPropagation agar react-pageflip tidak menerima
        if (isCursorInsideGlass(e.clientX, e.clientY)) {
            e.stopPropagation();
            e.preventDefault();

            setMagnifier((prev) => ({ ...prev, isPressing: true }));

            dragTimerRef.current = setTimeout(() => {
                setMagnifier((prev) => ({ ...prev, isDragging: true }));
            }, DRAG_DELAY);
        }
    }, [isCursorInsideGlass]);

    const handleMouseMove = useCallback((e) => {
        if (!wrapperRef.current) return;
        if (!magnifier.isDragging) return;

        // Stop propagation agar react-pageflip tidak ikut menangani
        e.stopPropagation();

        const rect = wrapperRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setMagnifier((prev) => ({ ...prev, posX: x, posY: y }));
    }, [magnifier.isDragging]);

    const handleMouseUp = useCallback(() => {
        if (dragTimerRef.current) {
            clearTimeout(dragTimerRef.current);
            dragTimerRef.current = null;
        }
        setMagnifier((prev) => ({
            ...prev,
            isDragging: false,
            isPressing: false,
        }));
    }, []);

    useEffect(() => {
        window.addEventListener('mouseup', handleMouseUp);
        return () => window.removeEventListener('mouseup', handleMouseUp);
    }, [handleMouseUp]);

    useEffect(() => {
        return () => {
            if (dragTimerRef.current) clearTimeout(dragTimerRef.current);
        };
    }, []);

    const totalBookPages = quotesData.length + 2;
    const containerHeight = PAGE_HEIGHT * screenSize.scale;

    const lensPos = getLensPos();

    return (
        <section className="kkb-section">
            <style dangerouslySetInnerHTML={{
                __html: `
                    /* ============ SECTION UTAMA ============ */
                    .kkb-section {
                        position: relative;
                        width: 100vw;
                        margin-left: calc(-50vw + 50%);
                        margin-top: 0;
                        margin-bottom: 0;
                        padding: 40px 0 30px;
                        min-height: 100vh;
                        
                        background-image: 
                            linear-gradient(rgba(26, 18, 11, 0.75), rgba(26, 18, 11, 0.75)),
                            url('/images/assets/bg-struktur.webp');
                        background-size: cover;
                        background-position: center;
                        background-repeat: no-repeat;
                        background-attachment: fixed;
                        
                        overflow-x: hidden;
                        
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        gap: 8px;
                        
                        isolation: isolate;
                    }

                    /* ============ WRAPPER BUKU ============ */
                    .kkb-wrapper {
                        position: relative;
                        width: 100%;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        padding: 10px 0;
                        min-height: ${containerHeight + 40}px;
                        background: transparent;
                        overflow: visible;
                        cursor: default;
                        user-select: none;
                        -webkit-user-select: none;
                    }

                    .kkb-wrapper.kkb-dragging {
                        cursor: grabbing;
                    }

                    /* ============ CONTAINER ============ */
                    .kkb-container {
                        position: relative;
                        transform: scale(${screenSize.scale});
                        transform-origin: center center;
                        width: ${PAGE_WIDTH * 2}px;
                        height: ${PAGE_HEIGHT}px;
                        margin-top: ${-(PAGE_HEIGHT * (1 - screenSize.scale)) / 2}px;
                        margin-bottom: ${-(PAGE_HEIGHT * (1 - screenSize.scale)) / 2}px;
                    }

                    /* ============ ZOOM LAYER ============ */
                    .kkb-zoom-wrap {
                        position: absolute;
                        inset: 0;
                        pointer-events: none;
                        z-index: 90;
                        opacity: 0;
                        transition: opacity 0.15s ease;
                        overflow: hidden;
                    }

                    .kkb-zoom-inner {
                        position: absolute;
                        top: 0;
                        left: 0;
                        transform-origin: 0 0;
                        will-change: transform;
                    }

                    /* ============ LENSA (LINGKARAN ZOOM) ============ */
                    .kkb-lens-standalone {
                        position: absolute;
                        width: ${LENS_SIZE}px;
                        height: ${LENS_SIZE}px;
                        border-radius: 50%;
                        pointer-events: none;
                        z-index: 95;
                        transform: translate(-50%, -50%);
                        
                        background: transparent;
                        border: 1px solid rgba(255, 255, 255, 0.25);
                        box-shadow: 
                            inset 0 0 12px rgba(255, 255, 255, 0.15),
                            inset 0 0 4px rgba(0, 0, 0, 0.08);
                        
                        overflow: hidden;
                        transition: opacity 0.15s ease;
                        opacity: 0;
                    }

                    .kkb-lens-standalone.on {
                        opacity: 1;
                    }

                    .kkb-lens-standalone::before {
                        content: '';
                        position: absolute;
                        inset: 0;
                        border-radius: 50%;
                        background: 
                            radial-gradient(
                                circle at 30% 25%,
                                rgba(255, 255, 255, 0.35) 0%,
                                rgba(255, 255, 255, 0.1) 12%,
                                transparent 30%
                            );
                        pointer-events: none;
                    }

                    /* ============ GAMBAR KACA PEMBESAR ============ */
                    .kkb-magnifier {
                        position: absolute;
                        width: ${GLASS_SIZE}px;
                        height: ${GLASS_SIZE}px;
                        pointer-events: none;
                        z-index: 100;
                        transform: translate(-50%, -50%) rotate(-15deg);
                        transition: transform 0.15s ease-out;
                        
                        background-image: url('/images/assets/kaca-pembesar.png');
                        background-size: contain;
                        background-position: center;
                        background-repeat: no-repeat;
                        
                        filter: drop-shadow(0 8px 18px rgba(0, 0, 0, 0.5));
                    }

                    .kkb-magnifier.kkb-magnifier-active {
                        transform: translate(-50%, -50%) rotate(-15deg) scale(1.05);
                    }

                    /* 🔥 OVERLAY TRANSPARAN UNTUK MENCURI EVENT SAAT DRAG KACA */
                    .kkb-overlay-catcher {
                        position: absolute;
                        inset: 0;
                        z-index: 99;
                        pointer-events: none;
                        cursor: grabbing;
                    }

                    .kkb-overlay-catcher.active {
                        pointer-events: auto;
                    }

                    /* ============ SHADOW BUKU ============ */
                    .kkb-flipbook {
                        margin: 0 auto;
                        box-shadow: none;
                        transition: box-shadow 0.4s ease;
                    }

                    .kkb-flipbook.kkb-book-open {
                        box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.5);
                    }

                    /* ============ HALAMAN ============ */
                    .kkb-flipbook .page {
                        background: #faf5e8;
                        overflow: hidden;
                        position: relative;
                        border: 1px solid rgba(139, 111, 71, 0.2);
                        box-sizing: border-box;
                    }

                    /* ============ COVER ============ */
                    .kkb-page-cover {
                        background: 
                            radial-gradient(ellipse at center, #4a3520 0%, #2c1f16 60%, #1a120b 100%),
                            repeating-linear-gradient(90deg, rgba(0,0,0,0.15) 0px, rgba(0,0,0,0.15) 2px, transparent 2px, transparent 8px);
                    }

                    /* ============ HALAMAN KOSONG ============ */
                    .kkb-page-empty {
                        background: linear-gradient(135deg, #3d2914 0%, #2c1f16 100%);
                    }

                    /* ============ HALAMAN ISI ============ */
                    .kkb-page-content {
                        background: 
                            linear-gradient(135deg, #faf5e8 0%, #f0e6d0 100%),
                            repeating-linear-gradient(45deg, rgba(139, 111, 71, 0.04) 0px, rgba(139, 111, 71, 0.04) 1px, transparent 1px, transparent 5px);
                    }

                    /* ============ OVERRIDE STPAGEFLIP ============ */
                    .kkb-flipbook .stf__item {
                        transform-style: preserve-3d;
                        backface-visibility: hidden;
                        box-shadow: none !important;
                    }

                    /* ============ NAV BUTTON ============ */
                    .kkb-nav-btn {
                        width: 45px;
                        height: 45px;
                        border-radius: 50%;
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                        background: linear-gradient(135deg, #d4a853 0%, #8b6f47 100%);
                        border: 2px solid #d4a853;
                        color: #1a120b;
                        cursor: pointer;
                        transition: all 0.25s ease;
                        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
                        flex-shrink: 0;
                    }
                    .kkb-nav-btn:hover:not(:disabled) {
                        transform: scale(1.1);
                        box-shadow: 0 6px 22px rgba(212, 168, 83, 0.5);
                    }
                    .kkb-nav-btn:active:not(:disabled) {
                        transform: scale(0.95);
                    }
                    .kkb-nav-btn:disabled {
                        opacity: 0.3;
                        cursor: not-allowed;
                    }

                    /* ============ RESPONSIVE ============ */
                    @media (max-width: 1024px) {
                        .kkb-section {
                            padding: 40px 0 30px;
                            background-attachment: scroll;
                        }
                    }

                    @media (max-width: 768px) {
                        .kkb-section {
                            padding: 30px 0 20px;
                            gap: 4px;
                        }
                        .kkb-nav-btn {
                            width: 40px;
                            height: 40px;
                        }
                        .kkb-nav-btn .material-symbols-outlined {
                            font-size: 20px;
                        }
                        .kkb-magnifier,
                        .kkb-lens-standalone,
                        .kkb-overlay-catcher {
                            display: none;
                        }
                        .kkb-zoom-wrap {
                            display: none;
                        }
                    }

                    @media (max-width: 640px) {
                        .kkb-section {
                            padding: 20px 0 15px;
                        }
                        .kkb-nav-btn {
                            width: 36px;
                            height: 36px;
                        }
                        .kkb-nav-btn .material-symbols-outlined {
                            font-size: 18px;
                        }
                    }

                    @media (max-width: 480px) {
                        .kkb-section {
                            padding: 15px 0 10px;
                        }
                        .kkb-nav-btn {
                            width: 32px;
                            height: 32px;
                        }
                        .kkb-nav-btn .material-symbols-outlined {
                            font-size: 16px;
                        }
                    }
                `
            }} />

            <div className="w-full px-3 sm:px-4 md:px-6 flex flex-col items-center gap-4 sm:gap-6 md:gap-8">
                {/* HEADER */}
                <div className="text-center max-w-2xl">
                    <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 bg-gradient-to-r from-[#d4a853]/20 to-[#8b6f47]/20 backdrop-blur-sm rounded-full border border-[#d4a853]/40 mb-2 sm:mb-3">
                        <span className="material-symbols-outlined text-[#d4a853] text-[10px] sm:text-sm">auto_stories</span>
                        <span className="font-serif text-[#d4a853] uppercase tracking-[0.15em] sm:tracking-[0.2em] text-[8px] sm:text-[10px] md:text-xs font-bold">
                            Buku Kenangan
                        </span>
                        <span className="material-symbols-outlined text-[#d4a853] text-[10px] sm:text-sm">auto_stories</span>
                    </div>
                    <h2
                        className="font-serif text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-[#d4a853] tracking-tight mb-1 sm:mb-2"
                        style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5), 0 0 20px rgba(212,168,83,0.4)' }}
                    >
                        Kata Kata Agit
                    </h2>
                    <p className="font-serif text-[#d4a853]/70 text-[10px] sm:text-xs md:text-sm italic">
                        XII RPL B 23' — Catatan Awak Kapal
                    </p>
                </div>

                {/* BUKU + KACA PEMBESAR */}
                <div
                    className={`kkb-wrapper ${magnifier.isDragging ? 'kkb-dragging' : ''}`}
                    ref={wrapperRef}
                    onMouseDownCapture={handleMouseDownCapture}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseUp}
                >
                    <div className="kkb-container" ref={bookContainerRef}>
                        <HTMLFlipBook
                            ref={bookRef}
                            width={PAGE_WIDTH}
                            height={PAGE_HEIGHT}
                            size="fixed"
                            minWidth={PAGE_WIDTH}
                            maxWidth={PAGE_WIDTH * 2}
                            minHeight={PAGE_HEIGHT}
                            maxHeight={PAGE_HEIGHT * 2}
                            maxShadowOpacity={0.3}
                            showCover={true}
                            mobileScrollSupport={true}
                            onFlip={onPageChange}
                            className={`kkb-flipbook ${currentPage > 0 ? 'kkb-book-open' : ''}`}
                            flippingTime={800}
                            usePortrait={screenSize.isMobile}
                            autoSize={false}
                            clickEventForward={true}
                            useMouseEvents={true}
                            swipeDistance={30}
                            showPageCorners={false}
                            disableFlipByClick={false}
                        >
                            <FrontCover />
                            {quotesData.map((person, index) => (
                                <ContentPage
                                    key={person.id}
                                    person={person}
                                    pageNumber={index + 1}
                                />
                            ))}
                            <BackCover />
                            <EmptyPage />
                        </HTMLFlipBook>
                    </div>

                    {/* 🔥 OVERLAY TRANSPARAN — AKTIF SAAT DRAG KACA, UNTUK MENCURI EVENT */}
                    <div className={`kkb-overlay-catcher ${magnifier.isDragging ? 'active' : ''}`} />

                    {/* ZOOM LAYER */}
                    <div className="kkb-zoom-wrap" ref={zoomWrapRef} aria-hidden="true">
                        <div className="kkb-zoom-inner" ref={zoomInnerRef}></div>
                    </div>

                    {/* LENSA STANDALONE */}
                    <div
                        className={`kkb-lens-standalone ${magnifier.isDragging ? 'on' : ''}`}
                        style={{
                            left: `${lensPos.x}px`,
                            top: `${lensPos.y}px`,
                        }}
                    />

                    {/* GAMBAR KACA PEMBESAR */}
                    <div
                        className={`kkb-magnifier ${magnifier.isDragging ? 'kkb-magnifier-active' : ''}`}
                        style={{
                            left: `${magnifier.posX}px`,
                            top: `${magnifier.posY}px`,
                        }}
                    />
                </div>

                {/* NAVIGASI */}
                <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4">
                    <button
                        onClick={goPrev}
                        disabled={currentPage <= 0}
                        className="kkb-nav-btn"
                        aria-label="Halaman Sebelumnya"
                    >
                        <span className="material-symbols-outlined">chevron_left</span>
                    </button>

                    <div
                        className="px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-2.5 rounded-full border-2 min-w-[70px] sm:min-w-[85px] md:min-w-[100px] text-center"
                        style={{
                            background: 'linear-gradient(135deg, rgba(212,168,83,0.15) 0%, rgba(139,111,71,0.15) 100%)',
                            borderColor: '#d4a853',
                        }}
                    >
                        <span className="font-serif text-sm sm:text-lg md:text-xl font-bold tabular-nums text-[#d4a853]">
                            {currentPage + 1}
                        </span>
                        <span className="font-serif text-xs sm:text-sm md:text-base font-bold text-[#8b6f47] mx-0.5 sm:mx-1">/</span>
                        <span className="font-serif text-[10px] sm:text-xs md:text-sm font-bold tabular-nums text-[#8b6f47]">
                            {totalBookPages}
                        </span>
                    </div>

                    <button
                        onClick={goNext}
                        disabled={currentPage >= totalBookPages - 1}
                        className="kkb-nav-btn"
                        aria-label="Halaman Selanjutnya"
                    >
                        <span className="material-symbols-outlined">chevron_right</span>
                    </button>
                </div>

                <p className="font-serif italic text-[9px] sm:text-[10px] md:text-xs text-[#d4a853]/70 text-center px-2">
                    Tahan & geser kaca pembesar untuk melihat detail halaman
                </p>
            </div>
        </section>
    );
};

export default KataKataBuku;