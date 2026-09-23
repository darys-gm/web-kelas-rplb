import React, { useState, useRef, useCallback, useEffect } from 'react';
import HTMLFlipBook from 'react-pageflip';
import quotesData from '../data/quotes';

// ============================================
// KONFIGURASI
// ============================================
const PAGE_WIDTH = 340;
const PAGE_HEIGHT = 480;
const GLASS_SIZE = 220;
const LENS_SIZE = 110;
const LENS_OFFSET = { x: -18, y: -76 };
const MAG = 1.8;
const INITIAL_OFFSET = { right: 350, bottom: 60 };

const ZOOM_MIN = 0.75;
const ZOOM_MAX = 2.5;
const ZOOM_STEP = 0.25;

const THUMB_WIDTH = 50;

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
                                    loading="eager"
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
    const magnifierElRef = useRef(null);
    const lensElRef = useRef(null);
    const scrollAreaRef = useRef(null);
    const trackRef = useRef(null);
    const thumbRef = useRef(null);

    const [currentPage, setCurrentPage] = useState(0);
    // 🔥 State untuk lock flip
    const [isFlipping, setIsFlipping] = useState(false);
    // 🔥 State untuk preload indicator
    const [imagesPreloaded, setImagesPreloaded] = useState(false);

    const [screenSize, setScreenSize] = useState({
        isMobile: false,
        isTablet: false,
        scale: 1,
    });

    const [zoomLevel, setZoomLevel] = useState(1);
    const [isDragging, setIsDragging] = useState(false);

    const [thumbPos, setThumbPos] = useState(0);
    const [showScrollbar, setShowScrollbar] = useState(false);
    const [isThumbDragging, setIsThumbDragging] = useState(false);

    const magnifierPosRef = useRef({ x: 0, y: 0 });
    const screenSizeRef = useRef({ isMobile: false, isTablet: false, scale: 1 });
    const isDraggingRef = useRef(false);
    const rafRef = useRef(null);
    const scrollRafRef = useRef(null);
    const thumbDragRef = useRef({ startX: 0, startScrollLeft: 0 });
    // 🔥 Ref untuk lock flip (lebih cepat dari state)
    const isFlippingRef = useRef(false);

    const isMobileOrTablet = screenSize.isMobile || screenSize.isTablet;
    const effectiveScale = screenSize.scale * (isMobileOrTablet ? zoomLevel : 1);

    const disableFlip = isMobileOrTablet && zoomLevel > 1;

    useEffect(() => {
        screenSizeRef.current = screenSize;
    }, [screenSize]);

    // ============================================
    // 🔥 PRELOAD SEMUA GAMBAR
    // ============================================
    useEffect(() => {
        let cancelled = false;
        const imagesToPreload = [
            '/images/logo-kelas.webp',
            '/images/assets/kaca-pembesar.png',
            ...quotesData.map((person) => person.foto).filter(Boolean),
        ];

        let loadedCount = 0;
        const total = imagesToPreload.length;

        const checkDone = () => {
            loadedCount++;
            if (loadedCount >= total && !cancelled) {
                setImagesPreloaded(true);
            }
        };

        imagesToPreload.forEach((src) => {
            const img = new Image();
            img.onload = checkDone;
            img.onerror = checkDone; // tetap hitung meskipun gagal
            img.src = src;
        });

        // Timeout fallback — jangan tunggu selamanya
        const timeout = setTimeout(() => {
            if (!cancelled) setImagesPreloaded(true);
        }, 4000);

        return () => {
            cancelled = true;
            clearTimeout(timeout);
        };
    }, []);

    useEffect(() => {
        const handleResize = () => {
            const w = window.innerWidth;
            let isMobile = false;
            let isTablet = false;
            let scale = 1;

            if (w <= 380) { isMobile = true; scale = 0.32; }
            else if (w <= 480) { isMobile = true; scale = 0.4; }
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

    // ============================================
    // MAGNIFIER (Desktop Only)
    // ============================================
    const applyMagnifierPosition = useCallback(() => {
        if (!magnifierElRef.current || !lensElRef.current) return;

        const pos = magnifierPosRef.current;
        const scale = screenSizeRef.current.scale;

        magnifierElRef.current.style.transform = 
            `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%) rotate(-15deg) scale(${scale})`;

        const lensX = pos.x + LENS_OFFSET.x * scale;
        const lensY = pos.y + LENS_OFFSET.y * scale;

        lensElRef.current.style.transform = 
            `translate3d(${lensX}px, ${lensY}px, 0) translate(-50%, -50%) scale(${scale})`;

        const zoomWrap = zoomWrapRef.current;
        const zoomInner = zoomInnerRef.current;
        const bookContainer = bookContainerRef.current;
        if (!zoomWrap || !zoomInner || !bookContainer || !wrapperRef.current) return;

        const B = {
            w: bookContainer.clientWidth,
            h: bookContainer.clientHeight,
        };
        if (!B.w) return;

        const lensRadius = (LENS_SIZE / 2) * scale;

        const bookRect = bookContainer.getBoundingClientRect();
        const wrapperRect = wrapperRef.current.getBoundingClientRect();
        const bookOffsetX = bookRect.left - wrapperRect.left;
        const bookOffsetY = bookRect.top - wrapperRect.top;

        const lensBookX = (lensX - bookOffsetX) / scale;
        const lensBookY = (lensY - bookOffsetY) / scale;

        const clampedBookX = Math.max(0, Math.min(lensBookX, B.w));
        const clampedBookY = Math.max(0, Math.min(lensBookY, B.h));

        const mask = `radial-gradient(circle ${lensRadius}px at ${lensX}px ${lensY}px, #000 calc(100% - 1px), transparent 100%)`;
        zoomWrap.style.maskImage = mask;
        zoomWrap.style.webkitMaskImage = mask;

        const translateX = lensX - clampedBookX * MAG * scale;
        const translateY = lensY - clampedBookY * MAG * scale;

        zoomInner.style.width = `${B.w}px`;
        zoomInner.style.height = `${B.h}px`;
        zoomInner.style.transform = `translate3d(${translateX}px, ${translateY}px, 0) scale(${MAG * scale})`;
    }, []);

    const syncZoomLayer = useCallback(() => {
        const zoomInner = zoomInnerRef.current;
        const bookContainer = bookContainerRef.current;
        if (!zoomInner || !bookContainer) return;

        zoomInner.innerHTML = '';
        for (const child of bookContainer.children) {
            if (child.classList && (
                child.classList.contains('kkb-magnifier') ||
                child.classList.contains('kkb-lens-standalone')
            )) continue;
            zoomInner.appendChild(child.cloneNode(true));
        }
        applyMagnifierPosition();
    }, [applyMagnifierPosition]);

    useEffect(() => {
        if (isMobileOrTablet) return;
        syncZoomLayer();
    }, [currentPage, screenSize.scale, syncZoomLayer, isMobileOrTablet]);

    useEffect(() => {
        if (isMobileOrTablet || !wrapperRef.current) return;
        const rect = wrapperRef.current.getBoundingClientRect();
        magnifierPosRef.current = {
            x: rect.width - INITIAL_OFFSET.right * screenSize.scale,
            y: rect.height - INITIAL_OFFSET.bottom * screenSize.scale,
        };
        applyMagnifierPosition();
    }, [screenSize.scale, applyMagnifierPosition, isMobileOrTablet]);

    const isCursorInsideGlass = useCallback((clientX, clientY) => {
        if (isMobileOrTablet) return false;
        if (!wrapperRef.current) return false;

        const rect = wrapperRef.current.getBoundingClientRect();
        const cursorX = clientX - rect.left;
        const cursorY = clientY - rect.top;

        const dx = cursorX - magnifierPosRef.current.x;
        const dy = cursorY - magnifierPosRef.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        const glassRadius = (GLASS_SIZE / 2) * screenSizeRef.current.scale;
        return distance <= glassRadius;
    }, [isMobileOrTablet]);

    const handlePointerDown = useCallback((e) => {
        if (isMobileOrTablet) return;
        if (!wrapperRef.current) return;
        if (!isCursorInsideGlass(e.clientX, e.clientY)) return;

        e.stopPropagation();
        e.preventDefault();

        if (e.target.setPointerCapture) {
            try { e.target.setPointerCapture(e.pointerId); } catch (_) {}
        }

        isDraggingRef.current = true;
        setIsDragging(true);
    }, [isCursorInsideGlass, isMobileOrTablet]);

    const handlePointerMove = useCallback((e) => {
        if (isMobileOrTablet) return;
        if (!isDraggingRef.current) return;
        if (!wrapperRef.current) return;

        e.stopPropagation();

        const rect = wrapperRef.current.getBoundingClientRect();
        magnifierPosRef.current = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };

        if (rafRef.current === null) {
            rafRef.current = requestAnimationFrame(() => {
                rafRef.current = null;
                applyMagnifierPosition();
            });
        }
    }, [applyMagnifierPosition, isMobileOrTablet]);

    const handlePointerUp = useCallback(() => {
        if (!isDraggingRef.current) return;
        isDraggingRef.current = false;
        setIsDragging(false);

        if (rafRef.current !== null) {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
        }
    }, []);

    useEffect(() => {
        window.addEventListener('pointerup', handlePointerUp);
        window.addEventListener('pointercancel', handlePointerUp);
        return () => {
            window.removeEventListener('pointerup', handlePointerUp);
            window.removeEventListener('pointercancel', handlePointerUp);
        };
    }, [handlePointerUp]);

    useEffect(() => {
        return () => {
            if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
        };
    }, []);

    useEffect(() => {
        if (isMobileOrTablet) return;
        if (isDragging) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isDragging, isMobileOrTablet]);

    useEffect(() => {
        if (!isMobileOrTablet) setZoomLevel(1);
    }, [isMobileOrTablet]);

    // ============================================
    // SCROLLBAR
    // ============================================
    const updateScrollbar = useCallback(() => {
        const el = scrollAreaRef.current;
        if (!el) return;

        const maxScroll = el.scrollWidth - el.clientWidth;
        if (maxScroll <= 0) {
            setShowScrollbar(false);
            setThumbPos(0);
            return;
        }

        setShowScrollbar(true);
        setThumbPos(el.scrollLeft / maxScroll);
    }, []);

    useEffect(() => {
        if (!isMobileOrTablet) return;
        if (!scrollAreaRef.current) return;

        const el = scrollAreaRef.current;

        if (zoomLevel <= 1) {
            el.scrollLeft = 0;
            updateScrollbar();
            return;
        }

        const raf1 = requestAnimationFrame(() => {
            const raf2 = requestAnimationFrame(() => {
                if (!scrollAreaRef.current) return;
                const sw = el.scrollWidth;
                const cw = el.clientWidth;

                if (sw > cw) {
                    el.scrollLeft = (sw - cw) / 2;
                } else {
                    el.scrollLeft = 0;
                }
                updateScrollbar();
            });
        });

        return () => cancelAnimationFrame(raf1);
    }, [zoomLevel, effectiveScale, isMobileOrTablet, updateScrollbar]);

    useEffect(() => {
        const el = scrollAreaRef.current;
        if (!el) return;

        const handleScroll = () => {
            if (scrollRafRef.current !== null) return;
            scrollRafRef.current = requestAnimationFrame(() => {
                scrollRafRef.current = null;
                updateScrollbar();
            });
        };

        el.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            el.removeEventListener('scroll', handleScroll);
            if (scrollRafRef.current !== null) {
                cancelAnimationFrame(scrollRafRef.current);
                scrollRafRef.current = null;
            }
        };
    }, [updateScrollbar]);

    // Thumb drag
    const handleThumbPointerDown = useCallback((e) => {
        e.stopPropagation();
        e.preventDefault();

        setIsThumbDragging(true);
        thumbDragRef.current = {
            startX: e.clientX,
            startScrollLeft: scrollAreaRef.current?.scrollLeft || 0,
        };

        if (e.target.setPointerCapture) {
            try { e.target.setPointerCapture(e.pointerId); } catch (_) {}
        }
    }, []);

    const handleThumbPointerMove = useCallback((e) => {
        if (!isThumbDragging) return;
        e.stopPropagation();

        const track = trackRef.current;
        const thumb = thumbRef.current;
        const el = scrollAreaRef.current;
        if (!track || !thumb || !el) return;

        const trackRect = track.getBoundingClientRect();
        const thumbWidth = thumb.getBoundingClientRect().width;
        const usableWidth = trackRect.width - thumbWidth;

        const dx = e.clientX - thumbDragRef.current.startX;
        const maxScroll = el.scrollWidth - el.clientWidth;
        const scrollDelta = (dx / usableWidth) * maxScroll;

        el.scrollLeft = thumbDragRef.current.startScrollLeft + scrollDelta;
    }, [isThumbDragging]);

    const handleThumbPointerUp = useCallback(() => {
        setIsThumbDragging(false);
    }, []);

    useEffect(() => {
        if (!isThumbDragging) return;
        const onUp = () => setIsThumbDragging(false);
        window.addEventListener('pointerup', onUp);
        window.addEventListener('pointercancel', onUp);
        return () => {
            window.removeEventListener('pointerup', onUp);
            window.removeEventListener('pointercancel', onUp);
        };
    }, [isThumbDragging]);

    const handleTrackPointerDown = useCallback((e) => {
        if (e.target.closest('.kkb-scrollbar-thumb')) return;

        const track = trackRef.current;
        const thumb = thumbRef.current;
        const el = scrollAreaRef.current;
        if (!track || !thumb || !el) return;

        const trackRect = track.getBoundingClientRect();
        const thumbWidth = thumb.getBoundingClientRect().width;
        const usableWidth = trackRect.width - thumbWidth;

        const clickX = e.clientX - trackRect.left;
        const thumbCenter = clickX - thumbWidth / 2;
        const progress = Math.max(0, Math.min(1, thumbCenter / usableWidth));

        const maxScroll = el.scrollWidth - el.clientWidth;
        el.scrollTo({
            left: progress * maxScroll,
            behavior: 'smooth',
        });
    }, []);

    // ============================================
    // 🔥 HANDLERS HALAMAN
    // ============================================
    const onPageChange = useCallback((e) => {
        setCurrentPage(e.data);
    }, []);

    // 🔥 onChangeState — track kapan flip dimulai / selesai
    const onStateChange = useCallback((e) => {
        const state = e.data;
        if (state === 'flipping') {
            isFlippingRef.current = true;
            setIsFlipping(true);
        } else if (state === 'read' || state === 'user_fold') {
            isFlippingRef.current = false;
            setIsFlipping(false);
        }
    }, []);

    // 🔥 Guard: jangan flip kalau masih flipping
    const goPrev = useCallback(() => {
        if (isFlippingRef.current) return;
        bookRef.current?.pageFlip().flipPrev();
    }, []);

    const goNext = useCallback(() => {
        if (isFlippingRef.current) return;
        bookRef.current?.pageFlip().flipNext();
    }, []);

    const handleZoomIn = useCallback(() => {
        setZoomLevel((z) => Math.min(ZOOM_MAX, +(z + ZOOM_STEP).toFixed(2)));
    }, []);

    const handleZoomOut = useCallback(() => {
        setZoomLevel((z) => Math.max(ZOOM_MIN, +(z - ZOOM_STEP).toFixed(2)));
    }, []);

    const handleZoomReset = useCallback(() => {
        setZoomLevel(1);
    }, []);

    const totalBookPages = quotesData.length + 2;
    const containerHeight = PAGE_HEIGHT * effectiveScale;

    const scaledBookWidth = PAGE_WIDTH * 2 * effectiveScale;
    const scaledBookHeight = PAGE_HEIGHT * effectiveScale;

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

                    .kkb-wrapper {
                        position: relative;
                        width: 100%;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        padding: 10px 0;
                        background: transparent;
                        overflow: visible;
                        user-select: none;
                        -webkit-user-select: none;
                        -webkit-touch-callout: none;
                    }

                    .kkb-scroll-area {
                        position: relative;
                        width: 100%;
                        overflow-x: auto;
                        overflow-y: hidden;
                        -webkit-overflow-scrolling: touch;
                        scrollbar-width: none;
                        display: flex;
                        align-items: center;
                        padding: 10px 0;
                        overscroll-behavior-x: contain;
                    }
                    .kkb-scroll-area::-webkit-scrollbar {
                        display: none;
                    }

                    .kkb-spacer {
                        position: relative;
                        flex-shrink: 0;
                        margin: 0 auto;
                    }

                    .kkb-container {
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: ${PAGE_WIDTH * 2}px;
                        height: ${PAGE_HEIGHT}px;
                        transform-origin: top left;
                        will-change: transform;
                    }

                    /* 🔥 PRELOAD STATE - sembunyikan buku sampai gambar siap */
                    .kkb-container.kkb-loading {
                        opacity: 0;
                    }
                    .kkb-container.kkb-ready {
                        opacity: 1;
                        transition: opacity 0.3s ease;
                    }

                    /* ============ SCROLLBAR SLIDER ============ */
                    .kkb-scrollbar {
                        display: none;
                        width: 100%;
                        max-width: 520px;
                        padding: 10px 16px;
                        margin-top: 10px;
                        position: relative;
                        z-index: 200;
                        touch-action: manipulation;
                        opacity: 0;
                        transition: opacity 0.25s ease;
                    }

                    .kkb-scrollbar.show {
                        display: block;
                        opacity: 1;
                    }

                    .kkb-scrollbar-track {
                        position: relative;
                        width: 100%;
                        height: 16px;
                        background: rgba(212, 168, 83, 0.12);
                        border: 1px solid rgba(212, 168, 83, 0.25);
                        border-radius: 999px;
                        cursor: pointer;
                        touch-action: none;
                        box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
                    }

                    .kkb-scrollbar-thumb {
                        position: absolute;
                        top: 50%;
                        transform: translateY(-50%);
                        height: 22px;
                        width: ${THUMB_WIDTH}px;
                        background: linear-gradient(180deg, #e0b869 0%, #b8935a 100%);
                        border-radius: 999px;
                        cursor: grab;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        box-shadow: 
                            0 2px 8px rgba(0, 0, 0, 0.5),
                            inset 0 1px rgba(255, 255, 255, 0.5),
                            inset 0 -1px rgba(0, 0, 0, 0.15);
                        touch-action: none;
                        -webkit-tap-highlight-color: transparent;
                        transition: box-shadow 0.15s ease, transform 0.15s ease;
                        will-change: left;
                    }

                    .kkb-scrollbar-thumb.dragging,
                    .kkb-scrollbar-thumb:active {
                        cursor: grabbing;
                        transform: translateY(-50%) scale(1.08);
                        box-shadow: 
                            0 6px 16px rgba(0, 0, 0, 0.7),
                            0 0 20px rgba(212, 168, 83, 0.5),
                            inset 0 1px rgba(255, 255, 255, 0.7);
                    }

                    .kkb-scrollbar-circle {
                        width: 8px;
                        height: 8px;
                        border-radius: 50%;
                        background: radial-gradient(circle at 35% 35%, #4a3520, #1a120b);
                        box-shadow: 
                            inset 0 1px 2px rgba(0, 0, 0, 0.5),
                            0 1px 1px rgba(255, 255, 255, 0.3);
                        pointer-events: none;
                    }

                    .kkb-zoom-wrap {
                        position: absolute;
                        inset: 0;
                        pointer-events: none;
                        z-index: 90;
                        opacity: 0;
                        transition: opacity 0.12s ease;
                        overflow: hidden;
                        will-change: opacity;
                    }
                    .kkb-zoom-wrap.on { opacity: 1; }

                    .kkb-zoom-inner {
                        position: absolute;
                        top: 0;
                        left: 0;
                        transform-origin: 0 0;
                        will-change: transform;
                    }

                    .kkb-lens-standalone {
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: ${LENS_SIZE}px;
                        height: ${LENS_SIZE}px;
                        border-radius: 50%;
                        pointer-events: none;
                        z-index: 95;
                        transform-origin: 0 0;
                        will-change: transform;
                        background: transparent;
                        border: 1px solid rgba(255, 255, 255, 0.25);
                        box-shadow: 
                            inset 0 0 12px rgba(255, 255, 255, 0.15),
                            inset 0 0 4px rgba(0, 0, 0, 0.08);
                        overflow: hidden;
                        transition: opacity 0.12s ease;
                        opacity: 0;
                    }
                    .kkb-lens-standalone.on { opacity: 1; }

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

                    .kkb-magnifier {
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: ${GLASS_SIZE}px;
                        height: ${GLASS_SIZE}px;
                        pointer-events: none;
                        z-index: 100;
                        transform-origin: 0 0;
                        will-change: transform;
                        background-image: url('/images/assets/kaca-pembesar.png');
                        background-size: contain;
                        background-position: center;
                        background-repeat: no-repeat;
                        filter: drop-shadow(0 8px 18px rgba(0, 0, 0, 0.5));
                    }

                    .kkb-flipbook {
                        margin: 0 auto;
                        box-shadow: none;
                        transition: box-shadow 0.4s ease;
                    }

                    .kkb-flipbook.kkb-book-open {
                        box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.5);
                    }

                    .kkb-flipbook .page {
                        background: #faf5e8;
                        overflow: hidden;
                        position: relative;
                        border: 1px solid rgba(139, 111, 71, 0.2);
                        box-sizing: border-box;
                    }

                    .kkb-page-cover {
                        background: 
                            radial-gradient(ellipse at center, #4a3520 0%, #2c1f16 60%, #1a120b 100%),
                            repeating-linear-gradient(90deg, rgba(0,0,0,0.15) 0px, rgba(0,0,0,0.15) 2px, transparent 2px, transparent 8px);
                    }

                    .kkb-page-empty {
                        background: linear-gradient(135deg, #3d2914 0%, #2c1f16 100%);
                    }

                    .kkb-page-content {
                        background: 
                            linear-gradient(135deg, #faf5e8 0%, #f0e6d0 100%),
                            repeating-linear-gradient(45deg, rgba(139, 111, 71, 0.04) 0px, rgba(139, 111, 71, 0.04) 1px, transparent 1px, transparent 5px);
                    }

                    .kkb-flipbook .stf__item {
                        transform-style: preserve-3d;
                        backface-visibility: hidden;
                        box-shadow: none !important;
                    }

                    /* ============ ZOOM CONTROLS ============ */
                    .kkb-zoom-controls {
                        display: none;
                        align-items: center;
                        justify-content: center;
                        gap: 6px;
                        margin-top: 12px;
                        padding: 5px 8px;
                        background: rgba(26, 18, 11, 0.7);
                        border: 1px solid rgba(212, 168, 83, 0.4);
                        border-radius: 999px;
                        backdrop-filter: blur(8px);
                        -webkit-backdrop-filter: blur(8px);
                        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
                        position: relative;
                        z-index: 200;
                    }

                    .kkb-zoom-btn {
                        width: 36px;
                        height: 36px;
                        border-radius: 50%;
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                        background: linear-gradient(135deg, #d4a853 0%, #8b6f47 100%);
                        border: 2px solid #d4a853;
                        color: #1a120b;
                        cursor: pointer;
                        transition: all 0.2s ease;
                        flex-shrink: 0;
                        -webkit-tap-highlight-color: transparent;
                        user-select: none;
                    }

                    .kkb-zoom-btn:active:not(:disabled) { transform: scale(0.9); }
                    .kkb-zoom-btn:disabled { opacity: 0.3; cursor: not-allowed; }
                    .kkb-zoom-btn .material-symbols-outlined { font-size: 20px; }

                    .kkb-zoom-readout {
                        font-family: Georgia, serif;
                        font-size: 13px;
                        font-weight: 700;
                        color: #d4a853;
                        min-width: 52px;
                        padding: 6px 4px;
                        text-align: center;
                        letter-spacing: 0.05em;
                        user-select: none;
                        background: transparent;
                        border: none;
                        cursor: pointer;
                        border-radius: 8px;
                        transition: background 0.15s ease;
                        -webkit-tap-highlight-color: transparent;
                    }

                    .kkb-zoom-readout:active {
                        background: rgba(212, 168, 83, 0.15);
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
                        transition: all 0.2s ease;
                        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
                        flex-shrink: 0;
                        -webkit-tap-highlight-color: transparent;
                    }
                    .kkb-nav-btn:active:not(:disabled) { transform: scale(0.95); }
                    .kkb-nav-btn:disabled { opacity: 0.3; cursor: not-allowed; }

                    /* 🔥 Flipping state — visual feedback */
                    .kkb-nav-btn.kkb-flipping {
                        opacity: 0.5;
                        pointer-events: none;
                    }

                    /* ============ RESPONSIVE ============ */
                    @media (max-width: 1024px) {
                        .kkb-section {
                            padding: 40px 0 30px;
                            background-attachment: scroll;
                        }
                        .kkb-magnifier,
                        .kkb-lens-standalone,
                        .kkb-zoom-wrap {
                            display: none !important;
                        }
                        .kkb-zoom-controls {
                            display: inline-flex;
                        }
                    }

                    @media (max-width: 768px) {
                        .kkb-section { padding: 30px 0 20px; gap: 4px; }
                        .kkb-nav-btn { width: 40px; height: 40px; }
                        .kkb-nav-btn .material-symbols-outlined { font-size: 20px; }
                        .kkb-zoom-btn { width: 34px; height: 34px; }
                        .kkb-zoom-readout { font-size: 12px; min-width: 48px; }
                        .kkb-scrollbar-track { height: 14px; }
                        .kkb-scrollbar-thumb { height: 20px; }
                    }

                    @media (max-width: 640px) {
                        .kkb-section { padding: 20px 0 15px; }
                        .kkb-nav-btn { width: 36px; height: 36px; }
                        .kkb-nav-btn .material-symbols-outlined { font-size: 18px; }
                        .kkb-zoom-btn { width: 32px; height: 32px; }
                        .kkb-zoom-btn .material-symbols-outlined { font-size: 18px; }
                        .kkb-zoom-readout { font-size: 11px; min-width: 44px; }
                        .kkb-scrollbar-track { height: 12px; }
                        .kkb-scrollbar-thumb { height: 18px; }
                        .kkb-scrollbar-circle { width: 6px; height: 6px; }
                    }

                    @media (max-width: 480px) {
                        .kkb-section { padding: 15px 0 10px; }
                        .kkb-nav-btn { width: 32px; height: 32px; }
                        .kkb-nav-btn .material-symbols-outlined { font-size: 16px; }
                        .kkb-zoom-btn { width: 30px; height: 30px; }
                        .kkb-zoom-btn .material-symbols-outlined { font-size: 16px; }
                        .kkb-scrollbar { padding: 8px 12px; }
                    }
                `
            }} />

            <div className="w-full px-3 sm:px-4 md:px-6 flex flex-col items-center gap-4 sm:gap-6 md:gap-8">
                {/* HEADER */}
                <div className="text-center max-w-2xl">
                    <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 bg-gradient-to-r from-[#d4a853]/20 to-[#8b6f47]/20 backdrop-blur-sm rounded-full border border-[#d4a853]/40 mb-2 sm:mb-3">
                        <span className="font-serif text-[#d4a853] uppercase tracking-[0.15em] sm:tracking-[0.2em] text-[8px] sm:text-[10px] md:text-xs font-bold">
                            Buku Kenangan
                        </span>
                    </div>
                    <h2
                        className="font-serif text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-[#d4a853] tracking-tight mb-1 sm:mb-2"
                        style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5), 0 0 20px rgba(212,168,83,0.4)' }}
                    >
                        Kata Kata Agit
                    </h2>
                    <p className="font-serif text-[#d4a853]/70 text-[10px] sm:text-xs md:text-sm italic">
                        XII RPL B 23'
                    </p>
                </div>

                {/* BUKU + KACA PEMBESAR + ZOOM */}
                <div
                    className="kkb-wrapper"
                    ref={wrapperRef}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerLeave={handlePointerUp}
                >
                    {/* SCROLL AREA */}
                    <div
                        className="kkb-scroll-area"
                        ref={scrollAreaRef}
                        style={{
                            touchAction: isMobileOrTablet ? 'pan-x' : 'auto',
                        }}
                    >
                        <div
                            className="kkb-spacer"
                            style={{
                                width: `${scaledBookWidth}px`,
                                height: `${scaledBookHeight}px`,
                            }}
                        >
                            <div
                                className={`kkb-container ${imagesPreloaded ? 'kkb-ready' : 'kkb-loading'}`}
                                ref={bookContainerRef}
                                style={{
                                    transform: `scale(${effectiveScale})`,
                                }}
                            >
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
                                    mobileScrollSupport={false}
                                    onFlip={onPageChange}
                                    onStateChange={onStateChange}
                                    className={`kkb-flipbook ${currentPage > 0 ? 'kkb-book-open' : ''}`}
                                    /* 🔥 Naikkan flippingTime jadi 600ms untuk animasi lebih halus */
                                    flippingTime={600}
                                    usePortrait={false}
                                    autoSize={false}
                                    clickEventForward={false}
                                    useMouseEvents={!isMobileOrTablet}
                                    swipeDistance={10}
                                    showPageCorners={false}
                                    disableFlipByClick={isMobileOrTablet || disableFlip}
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
                        </div>
                    </div>

                    {/* SCROLLBAR SLIDER */}
                    <div className={`kkb-scrollbar ${showScrollbar ? 'show' : ''}`}>
                        <div
                            className="kkb-scrollbar-track"
                            ref={trackRef}
                            onPointerDown={handleTrackPointerDown}
                        >
                            <div
                                className={`kkb-scrollbar-thumb ${isThumbDragging ? 'dragging' : ''}`}
                                ref={thumbRef}
                                style={{
                                    left: `calc(${thumbPos * 100}% - ${thumbPos * THUMB_WIDTH}px)`,
                                }}
                                onPointerDown={handleThumbPointerDown}
                                onPointerMove={handleThumbPointerMove}
                                onPointerUp={handleThumbPointerUp}
                            >
                                <div className="kkb-scrollbar-circle" />
                            </div>
                        </div>
                    </div>

                    {/* ZOOM CONTROLS */}
                    <div className="kkb-zoom-controls">
                        <button
                            className="kkb-zoom-btn"
                            onClick={handleZoomOut}
                            disabled={zoomLevel <= ZOOM_MIN}
                            aria-label="Zoom out"
                        >
                            <span className="material-symbols-outlined">zoom_out</span>
                        </button>

                        <button
                            className="kkb-zoom-readout"
                            onClick={handleZoomReset}
                            aria-label="Reset zoom"
                        >
                            {Math.round(zoomLevel * 100)}%
                        </button>

                        <button
                            className="kkb-zoom-btn"
                            onClick={handleZoomIn}
                            disabled={zoomLevel >= ZOOM_MAX}
                            aria-label="Zoom in"
                        >
                            <span className="material-symbols-outlined">zoom_in</span>
                        </button>
                    </div>

                    {/* MAGNIFIER (Desktop Only) */}
                    <div className={`kkb-zoom-wrap ${isDragging ? 'on' : ''}`} ref={zoomWrapRef} aria-hidden="true">
                        <div className="kkb-zoom-inner" ref={zoomInnerRef}></div>
                    </div>

                    <div
                        className={`kkb-lens-standalone ${isDragging ? 'on' : ''}`}
                        ref={lensElRef}
                    />

                    <div
                        className="kkb-magnifier"
                        ref={magnifierElRef}
                    />
                </div>

                {/* NAVIGASI */}
                <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4">
                    <button
                        onClick={goPrev}
                        /* 🔥 Disable saat flipping */
                        disabled={currentPage <= 0 || isFlipping}
                        className={`kkb-nav-btn ${isFlipping ? 'kkb-flipping' : ''}`}
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
                        /* 🔥 Disable saat flipping */
                        disabled={currentPage >= totalBookPages - 1 || isFlipping}
                        className={`kkb-nav-btn ${isFlipping ? 'kkb-flipping' : ''}`}
                        aria-label="Halaman Selanjutnya"
                    >
                        <span className="material-symbols-outlined">chevron_right</span>
                    </button>
                </div>

                <p className="font-serif italic text-[9px] sm:text-[10px] md:text-xs text-[#d4a853]/70 text-center px-2">
                    {isMobileOrTablet
                        ? 'Gunakan tombol ← → untuk ganti halaman · Zoom & slider untuk melihat detail'
                        : 'Tahan & geser kaca pembesar untuk melihat detail halaman'
                    }
                </p>
            </div>
        </section>
    );
};

export default KataKataBuku;