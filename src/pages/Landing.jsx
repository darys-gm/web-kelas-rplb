import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
    const navigate = useNavigate();
    const [isLoaded, setIsLoaded] = useState(false);
    const [showClouds, setShowClouds] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        setTimeout(() => setIsLoaded(true), 500);
    }, []);

    const handleExplore = () => {
        setShowClouds(true);
        
        setTimeout(() => {
            setIsTransitioning(true);
        }, 5000);
        
        setTimeout(() => {
            navigate('/home');
        }, 6500);
    };

    return (
        <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center selection:bg-[#c89d4b] selection:text-[#161412] px-4 sm:px-6">
            {/* ============================================
                VIDEO BACKGROUND - FORMAT WEBM (Lebih Ringan)
                ============================================ */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    className="w-full h-full object-cover object-center sm:object-center md:object-center"
                    style={{
                        objectPosition: 'center 30%'
                    }}
                >
                    {/* Prioritas utama: WebM (lebih ringan & kompresi lebih baik) */}
                    <source src="/videos/bg-home.webm" type="video/webm" />
                    {/* Fallback: MP4 untuk browser lama yang tidak support WebM */}
                    <source src="/videos/bg-home.mp4" type="video/mp4" />
                </video>
                
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e0c0a] via-[#161412]/50 to-[#0e0c0a]"></div>
                <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#c89d4b_1px,transparent_1px),linear-gradient(to_bottom,#c89d4b_1px,transparent_1px)] bg-[size:2rem_2rem] sm:bg-[size:4rem_4rem]"></div>
            </div>

            {/* ============================================
                EFEK AWAN KABUT
                ============================================ */}
            {showClouds && (
                <div className="fixed inset-0 z-[9999] pointer-events-none">
                    {/* Background hitam */}
                    <div className="absolute inset-0 bg-black/40 transition-opacity duration-2000"></div>

                    <style dangerouslySetInnerHTML={{
                        __html: `
                            @keyframes cloudFromLeft1 { 0% { opacity: 0; transform: translate(-150%, -30%) scale(0.5); } 100% { opacity: 0.8; transform: translate(0%, -30%) scale(1); } }
                            @keyframes cloudFromLeft2 { 0% { opacity: 0; transform: translate(-150%, 20%) scale(0.5); } 100% { opacity: 0.7; transform: translate(0%, 20%) scale(1); } }
                            @keyframes cloudFromLeft3 { 0% { opacity: 0; transform: translate(-150%, 60%) scale(0.5); } 100% { opacity: 0.9; transform: translate(0%, 60%) scale(1); } }
                            @keyframes cloudFromLeft4 { 0% { opacity: 0; transform: translate(-150%, -10%) scale(0.5); } 100% { opacity: 0.6; transform: translate(5%, -10%) scale(1.1); } }
                            @keyframes cloudFromLeft5 { 0% { opacity: 0; transform: translate(-150%, 40%) scale(0.5); } 100% { opacity: 0.8; transform: translate(-5%, 40%) scale(1); } }
                            @keyframes cloudFromLeft6 { 0% { opacity: 0; transform: translate(-150%, 80%) scale(0.5); } 100% { opacity: 0.7; transform: translate(10%, 80%) scale(1.05); } }
                            @keyframes cloudFromRight1 { 0% { opacity: 0; transform: translate(150%, -40%) scale(0.5); } 100% { opacity: 0.8; transform: translate(0%, -40%) scale(1); } }
                            @keyframes cloudFromRight2 { 0% { opacity: 0; transform: translate(150%, 10%) scale(0.5); } 100% { opacity: 0.9; transform: translate(0%, 10%) scale(1); } }
                            @keyframes cloudFromRight3 { 0% { opacity: 0; transform: translate(150%, 50%) scale(0.5); } 100% { opacity: 0.7; transform: translate(0%, 50%) scale(1); } }
                            @keyframes cloudFromRight4 { 0% { opacity: 0; transform: translate(150%, -20%) scale(0.5); } 100% { opacity: 0.8; transform: translate(-5%, -20%) scale(1.1); } }
                            @keyframes cloudFromRight5 { 0% { opacity: 0; transform: translate(150%, 30%) scale(0.5); } 100% { opacity: 0.6; transform: translate(5%, 30%) scale(1.05); } }
                            @keyframes cloudFromRight6 { 0% { opacity: 0; transform: translate(150%, 70%) scale(0.5); } 100% { opacity: 0.9; transform: translate(-10%, 70%) scale(1); } }
                            @keyframes cloudFromTop1 { 0% { opacity: 0; transform: translate(-40%, -150%) scale(0.5); } 100% { opacity: 0.8; transform: translate(-40%, 0%) scale(1); } }
                            @keyframes cloudFromTop2 { 0% { opacity: 0; transform: translate(10%, -150%) scale(0.5); } 100% { opacity: 0.7; transform: translate(10%, 0%) scale(1); } }
                            @keyframes cloudFromTop3 { 0% { opacity: 0; transform: translate(50%, -150%) scale(0.5); } 100% { opacity: 0.9; transform: translate(50%, 0%) scale(1); } }
                            @keyframes cloudFromTop4 { 0% { opacity: 0; transform: translate(-20%, -150%) scale(0.5); } 100% { opacity: 0.6; transform: translate(-20%, 5%) scale(1.1); } }
                            @keyframes cloudFromTop5 { 0% { opacity: 0; transform: translate(30%, -150%) scale(0.5); } 100% { opacity: 0.8; transform: translate(30%, -5%) scale(1.05); } }
                            @keyframes cloudFromBottom1 { 0% { opacity: 0; transform: translate(-30%, 150%) scale(0.5); } 100% { opacity: 0.8; transform: translate(-30%, 0%) scale(1); } }
                            @keyframes cloudFromBottom2 { 0% { opacity: 0; transform: translate(20%, 150%) scale(0.5); } 100% { opacity: 0.9; transform: translate(20%, 0%) scale(1); } }
                            @keyframes cloudFromBottom3 { 0% { opacity: 0; transform: translate(60%, 150%) scale(0.5); } 100% { opacity: 0.7; transform: translate(60%, 0%) scale(1); } }
                            @keyframes cloudFromBottom4 { 0% { opacity: 0; transform: translate(-10%, 150%) scale(0.5); } 100% { opacity: 0.8; transform: translate(-10%, -5%) scale(1.1); } }
                            @keyframes cloudFromBottom5 { 0% { opacity: 0; transform: translate(40%, 150%) scale(0.5); } 100% { opacity: 0.6; transform: translate(40%, 5%) scale(1.05); } }
                            @keyframes cloudFromDiagonalTL { 0% { opacity: 0; transform: translate(-150%, -150%) scale(0.3); } 100% { opacity: 0.8; transform: translate(0%, 0%) scale(1.1); } }
                            @keyframes cloudFromDiagonalTR { 0% { opacity: 0; transform: translate(150%, -150%) scale(0.3); } 100% { opacity: 0.7; transform: translate(0%, 0%) scale(1.05); } }
                            @keyframes cloudFromDiagonalBL { 0% { opacity: 0; transform: translate(-150%, 150%) scale(0.3); } 100% { opacity: 0.9; transform: translate(0%, 0%) scale(1.1); } }
                            @keyframes cloudFromDiagonalBR { 0% { opacity: 0; transform: translate(150%, 150%) scale(0.3); } 100% { opacity: 0.8; transform: translate(0%, 0%) scale(1.05); } }
                            @keyframes cloudCenterExpand1 { 0% { opacity: 0; transform: scale(0.1) translate(0%, 0%); } 100% { opacity: 0.7; transform: scale(1.3) translate(0%, 0%); } }
                            @keyframes cloudCenterExpand2 { 0% { opacity: 0; transform: scale(0.1) translate(10%, -10%); } 100% { opacity: 0.8; transform: scale(1.4) translate(10%, -10%); } }
                            @keyframes cloudCenterExpand3 { 0% { opacity: 0; transform: scale(0.1) translate(-10%, 10%); } 100% { opacity: 0.6; transform: scale(1.3) translate(-10%, 10%); } }
                            @keyframes cloudCenterExpand4 { 0% { opacity: 0; transform: scale(0.1) translate(5%, 5%); } 100% { opacity: 0.9; transform: scale(1.5) translate(5%, 5%); } }
                            @keyframes cloudCenterExpand5 { 0% { opacity: 0; transform: scale(0.1) translate(-5%, -5%); } 100% { opacity: 0.7; transform: scale(1.4) translate(-5%, -5%); } }
                            @keyframes cloudExtra1 { 0% { opacity: 0; transform: translate(-80%, -60%) scale(0.4); } 100% { opacity: 0.8; transform: translate(10%, -60%) scale(1.1); } }
                            @keyframes cloudExtra2 { 0% { opacity: 0; transform: translate(80%, 60%) scale(0.4); } 100% { opacity: 0.7; transform: translate(-10%, 60%) scale(1.05); } }
                            @keyframes cloudExtra3 { 0% { opacity: 0; transform: translate(-60%, 80%) scale(0.4); } 100% { opacity: 0.9; transform: translate(-60%, -10%) scale(1.1); } }
                            @keyframes cloudExtra4 { 0% { opacity: 0; transform: translate(60%, -80%) scale(0.4); } 100% { opacity: 0.6; transform: translate(60%, 10%) scale(1.05); } }
                            @keyframes cloudExtra5 { 0% { opacity: 0; transform: translate(-100%, 0%) scale(0.4); } 100% { opacity: 0.8; transform: translate(0%, 0%) scale(1.2); } }
                            @keyframes cloudExtra6 { 0% { opacity: 0; transform: translate(100%, 0%) scale(0.4); } 100% { opacity: 0.7; transform: translate(0%, 0%) scale(1.15); } }
                            @keyframes cloudExtra7 { 0% { opacity: 0; transform: translate(0%, -100%) scale(0.4); } 100% { opacity: 0.9; transform: translate(0%, 0%) scale(1.2); } }
                            @keyframes cloudExtra8 { 0% { opacity: 0; transform: translate(0%, 100%) scale(0.4); } 100% { opacity: 0.8; transform: translate(0%, 0%) scale(1.15); } }
                            .cloud-l1 { animation: cloudFromLeft1 3s ease-out 0s forwards; }
                            .cloud-l2 { animation: cloudFromLeft2 3s ease-out 0.2s forwards; }
                            .cloud-l3 { animation: cloudFromLeft3 3s ease-out 0.4s forwards; }
                            .cloud-l4 { animation: cloudFromLeft4 3s ease-out 0.6s forwards; }
                            .cloud-l5 { animation: cloudFromLeft5 3s ease-out 0.8s forwards; }
                            .cloud-l6 { animation: cloudFromLeft6 3s ease-out 1s forwards; }
                            .cloud-r1 { animation: cloudFromRight1 3s ease-out 0.1s forwards; }
                            .cloud-r2 { animation: cloudFromRight2 3s ease-out 0.3s forwards; }
                            .cloud-r3 { animation: cloudFromRight3 3s ease-out 0.5s forwards; }
                            .cloud-r4 { animation: cloudFromRight4 3s ease-out 0.7s forwards; }
                            .cloud-r5 { animation: cloudFromRight5 3s ease-out 0.9s forwards; }
                            .cloud-r6 { animation: cloudFromRight6 3s ease-out 1.1s forwards; }
                            .cloud-t1 { animation: cloudFromTop1 3s ease-out 0.15s forwards; }
                            .cloud-t2 { animation: cloudFromTop2 3s ease-out 0.35s forwards; }
                            .cloud-t3 { animation: cloudFromTop3 3s ease-out 0.55s forwards; }
                            .cloud-t4 { animation: cloudFromTop4 3s ease-out 0.75s forwards; }
                            .cloud-t5 { animation: cloudFromTop5 3s ease-out 0.95s forwards; }
                            .cloud-b1 { animation: cloudFromBottom1 3s ease-out 0.25s forwards; }
                            .cloud-b2 { animation: cloudFromBottom2 3s ease-out 0.45s forwards; }
                            .cloud-b3 { animation: cloudFromBottom3 3s ease-out 0.65s forwards; }
                            .cloud-b4 { animation: cloudFromBottom4 3s ease-out 0.85s forwards; }
                            .cloud-b5 { animation: cloudFromBottom5 3s ease-out 1.05s forwards; }
                            .cloud-d1 { animation: cloudFromDiagonalTL 3.5s ease-out 0.2s forwards; }
                            .cloud-d2 { animation: cloudFromDiagonalTR 3.5s ease-out 0.4s forwards; }
                            .cloud-d3 { animation: cloudFromDiagonalBL 3.5s ease-out 0.6s forwards; }
                            .cloud-d4 { animation: cloudFromDiagonalBR 3.5s ease-out 0.8s forwards; }
                            .cloud-c1 { animation: cloudCenterExpand1 3.5s ease-out 0.5s forwards; }
                            .cloud-c2 { animation: cloudCenterExpand2 3.5s ease-out 0.7s forwards; }
                            .cloud-c3 { animation: cloudCenterExpand3 3.5s ease-out 0.9s forwards; }
                            .cloud-c4 { animation: cloudCenterExpand4 3.5s ease-out 1.1s forwards; }
                            .cloud-c5 { animation: cloudCenterExpand5 3.5s ease-out 1.3s forwards; }
                            .cloud-e1 { animation: cloudExtra1 3.5s ease-out 0.3s forwards; }
                            .cloud-e2 { animation: cloudExtra2 3.5s ease-out 0.5s forwards; }
                            .cloud-e3 { animation: cloudExtra3 3.5s ease-out 0.7s forwards; }
                            .cloud-e4 { animation: cloudExtra4 3.5s ease-out 0.9s forwards; }
                            .cloud-e5 { animation: cloudExtra5 3.5s ease-out 1.2s forwards; }
                            .cloud-e6 { animation: cloudExtra6 3.5s ease-out 1.4s forwards; }
                            .cloud-e7 { animation: cloudExtra7 3.5s ease-out 1.6s forwards; }
                            .cloud-e8 { animation: cloudExtra8 3.5s ease-out 1.8s forwards; }
                            .cloud-final1 { animation: cloudCenterExpand1 3s ease-out 2s forwards; }
                            .cloud-final2 { animation: cloudCenterExpand2 3s ease-out 2.2s forwards; }
                            .cloud-final3 { animation: cloudCenterExpand3 3s ease-out 2.4s forwards; }
                            .cloud-final4 { animation: cloudFromLeft1 3s ease-out 2.1s forwards; }
                            .cloud-final5 { animation: cloudFromRight1 3s ease-out 2.3s forwards; }
                            .cloud-final6 { animation: cloudFromTop1 3s ease-out 2.5s forwards; }
                            .cloud-final7 { animation: cloudFromBottom1 3s ease-out 2.7s forwards; }
                        `
                    }} />

                    <div className="absolute inset-0">
                        <div className="cloud-l1 absolute inset-0 bg-[url('/images/assets/awan.png')] bg-cover bg-center bg-no-repeat opacity-0 blur-[1px]"></div>
                        <div className="cloud-l2 absolute inset-0 bg-[url('/images/assets/awan.png')] bg-cover bg-center bg-no-repeat opacity-0 blur-[2px]"></div>
                        <div className="cloud-l3 absolute inset-0 bg-[url('/images/assets/awan.png')] bg-cover bg-center bg-no-repeat opacity-0 blur-[1.5px]"></div>
                        <div className="cloud-l4 absolute inset-0 bg-[url('/images/assets/awan.png')] bg-cover bg-center bg-no-repeat opacity-0 blur-[2.5px]"></div>
                        <div className="cloud-l5 absolute inset-0 bg-[url('/images/assets/awan.png')] bg-cover bg-center bg-no-repeat opacity-0 blur-[1px]"></div>
                        <div className="cloud-l6 absolute inset-0 bg-[url('/images/assets/awan.png')] bg-cover bg-center bg-no-repeat opacity-0 blur-[3px]"></div>
                        <div className="cloud-r1 absolute inset-0 bg-[url('/images/assets/awan.png')] bg-cover bg-center bg-no-repeat opacity-0 blur-[1.5px]"></div>
                        <div className="cloud-r2 absolute inset-0 bg-[url('/images/assets/awan.png')] bg-cover bg-center bg-no-repeat opacity-0 blur-[2px]"></div>
                        <div className="cloud-r3 absolute inset-0 bg-[url('/images/assets/awan.png')] bg-cover bg-center bg-no-repeat opacity-0 blur-[1px]"></div>
                        <div className="cloud-r4 absolute inset-0 bg-[url('/images/assets/awan.png')] bg-cover bg-center bg-no-repeat opacity-0 blur-[3px]"></div>
                        <div className="cloud-r5 absolute inset-0 bg-[url('/images/assets/awan.png')] bg-cover bg-center bg-no-repeat opacity-0 blur-[1.5px]"></div>
                        <div className="cloud-r6 absolute inset-0 bg-[url('/images/assets/awan.png')] bg-cover bg-center bg-no-repeat opacity-0 blur-[2.5px]"></div>
                        <div className="cloud-t1 absolute inset-0 bg-[url('/images/assets/awan.png')] bg-cover bg-center bg-no-repeat opacity-0 blur-[2px]"></div>
                        <div className="cloud-t2 absolute inset-0 bg-[url('/images/assets/awan.png')] bg-cover bg-center bg-no-repeat opacity-0 blur-[1.5px]"></div>
                        <div className="cloud-t3 absolute inset-0 bg-[url('/images/assets/awan.png')] bg-cover bg-center bg-no-repeat opacity-0 blur-[3px]"></div>
                        <div className="cloud-t4 absolute inset-0 bg-[url('/images/assets/awan.png')] bg-cover bg-center bg-no-repeat opacity-0 blur-[1px]"></div>
                        <div className="cloud-t5 absolute inset-0 bg-[url('/images/assets/awan.png')] bg-cover bg-center bg-no-repeat opacity-0 blur-[2.5px]"></div>
                        <div className="cloud-b1 absolute inset-0 bg-[url('/images/assets/awan.png')] bg-cover bg-center bg-no-repeat opacity-0 blur-[1.5px]"></div>
                        <div className="cloud-b2 absolute inset-0 bg-[url('/images/assets/awan.png')] bg-cover bg-center bg-no-repeat opacity-0 blur-[2px]"></div>
                        <div className="cloud-b3 absolute inset-0 bg-[url('/images/assets/awan.png')] bg-cover bg-center bg-no-repeat opacity-0 blur-[3px]"></div>
                        <div className="cloud-b4 absolute inset-0 bg-[url('/images/assets/awan.png')] bg-cover bg-center bg-no-repeat opacity-0 blur-[1px]"></div>
                        <div className="cloud-b5 absolute inset-0 bg-[url('/images/assets/awan.png')] bg-cover bg-center bg-no-repeat opacity-0 blur-[2.5px]"></div>
                        <div className="cloud-d1 absolute inset-0 bg-[url('/images/assets/awan.png')] bg-cover bg-center bg-no-repeat opacity-0 blur-[2px] scale-110"></div>
                        <div className="cloud-d2 absolute inset-0 bg-[url('/images/assets/awan.png')] bg-cover bg-center bg-no-repeat opacity-0 blur-[1.5px] scale-105"></div>
                        <div className="cloud-d3 absolute inset-0 bg-[url('/images/assets/awan.png')] bg-cover bg-center bg-no-repeat opacity-0 blur-[2.5px] scale-115"></div>
                        <div className="cloud-d4 absolute inset-0 bg-[url('/images/assets/awan.png')] bg-cover bg-center bg-no-repeat opacity-0 blur-[1px] scale-108"></div>
                        <div className="cloud-c1 absolute inset-0 bg-[url('/images/assets/awan.png')] bg-cover bg-center bg-no-repeat opacity-0 blur-[3px]"></div>
                        <div className="cloud-c2 absolute inset-0 bg-[url('/images/assets/awan.png')] bg-cover bg-center bg-no-repeat opacity-0 blur-[2px]"></div>
                        <div className="cloud-c3 absolute inset-0 bg-[url('/images/assets/awan.png')] bg-cover bg-center bg-no-repeat opacity-0 blur-[4px]"></div>
                        <div className="cloud-c4 absolute inset-0 bg-[url('/images/assets/awan.png')] bg-cover bg-center bg-no-repeat opacity-0 blur-[1.5px]"></div>
                        <div className="cloud-c5 absolute inset-0 bg-[url('/images/assets/awan.png')] bg-cover bg-center bg-no-repeat opacity-0 blur-[2.5px]"></div>
                        <div className="cloud-e1 absolute inset-0 bg-[url('/images/assets/awan.png')] bg-cover bg-center bg-no-repeat opacity-0 blur-[2px]"></div>
                        <div className="cloud-e2 absolute inset-0 bg-[url('/images/assets/awan.png')] bg-cover bg-center bg-no-repeat opacity-0 blur-[3px]"></div>
                        <div className="cloud-e3 absolute inset-0 bg-[url('/images/assets/awan.png')] bg-cover bg-center bg-no-repeat opacity-0 blur-[1.5px]"></div>
                        <div className="cloud-e4 absolute inset-0 bg-[url('/images/assets/awan.png')] bg-cover bg-center bg-no-repeat opacity-0 blur-[2.5px]"></div>
                        <div className="cloud-final1 absolute inset-0 bg-[url('/images/assets/awan.png')] bg-cover bg-center bg-no-repeat opacity-0 blur-[4px] scale-120"></div>
                        <div className="cloud-final2 absolute inset-0 bg-[url('/images/assets/awan.png')] bg-cover bg-center bg-no-repeat opacity-0 blur-[3px] scale-115"></div>
                        <div className="cloud-final3 absolute inset-0 bg-[url('/images/assets/awan.png')] bg-cover bg-center bg-no-repeat opacity-0 blur-[2px] scale-110"></div>
                        <div className="cloud-final4 absolute inset-0 bg-[url('/images/assets/awan.png')] bg-cover bg-center bg-no-repeat opacity-0 blur-[3.5px] scale-118"></div>
                        <div className="cloud-final5 absolute inset-0 bg-[url('/images/assets/awan.png')] bg-cover bg-center bg-no-repeat opacity-0 blur-[2.5px] scale-112"></div>
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none"></div>

                    {/* LOADING SCREEN */}
                    {isTransitioning && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 px-4" style={{ willChange: 'transform, opacity' }}>
                            <div className="absolute inset-0 bg-black/80"></div>
                            
                            <div className="relative z-30 flex flex-col items-center justify-center w-full max-w-sm">
                                <div className="loader text-[#c89d4b] text-2xl sm:text-3xl md:text-4xl">
                                    <span className="font-serif tracking-wider">Loading...</span>
                                </div>
                                
                                <div className="mt-3 sm:mt-4 text-white/90 text-xs sm:text-sm font-mono tracking-widest animate-pulse text-center px-2">
                                    MEMPERSIAPKAN KONTEN HALAMAN
                                </div>
                                
                                <div className="mt-3 sm:mt-4 w-4/5 max-w-xs h-1.5 bg-white/20 rounded-full overflow-hidden">
                                    <div className="h-full bg-[#c89d4b] rounded-full animate-progress"></div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* DECORATIVE CORNER ACCENTS */}
            {!showClouds && (
                <>
                    <div className="absolute top-4 sm:top-8 left-4 sm:left-8 z-10 pointer-events-none flex items-center gap-2 sm:gap-3 text-[#c89d4b]/60">
                        <div className="w-8 h-8 sm:w-12 sm:h-12 border-t-2 border-l-2 border-[#c89d4b]/60 rounded-tl-sm relative">
                            <span className="absolute -top-1 -left-1 sm:-top-1.5 sm:-left-1.5 w-2 h-2 sm:w-3 sm:h-3 bg-[#c89d4b]/80 rotate-45"></span>
                        </div>
                    </div>

                    <div className="absolute top-4 sm:top-8 right-4 sm:right-8 z-10 pointer-events-none flex items-center gap-2 sm:gap-3 text-[#c89d4b]/60">
                        <div className="w-8 h-8 sm:w-12 sm:h-12 border-t-2 border-r-2 border-[#c89d4b]/60 rounded-tr-sm relative">
                            <span className="absolute -top-1 -right-1 sm:-top-1.5 sm:-right-1.5 w-2 h-2 sm:w-3 sm:h-3 bg-[#c89d4b]/80 rotate-45"></span>
                        </div>
                    </div>

                    <div className="absolute bottom-4 sm:bottom-8 left-4 sm:left-8 z-10 pointer-events-none flex items-center gap-2 sm:gap-3 text-[#c89d4b]/60">
                        <div className="w-8 h-8 sm:w-12 sm:h-12 border-b-2 border-l-2 border-[#c89d4b]/60 rounded-bl-sm relative">
                            <span className="absolute -bottom-1 -left-1 sm:-bottom-1.5 sm:-left-1.5 w-2 h-2 sm:w-3 sm:h-3 bg-[#c89d4b]/80 rotate-45"></span>
                        </div>
                    </div>

                    <div className="absolute bottom-4 sm:bottom-8 right-4 sm:right-8 z-10 pointer-events-none flex items-center gap-2 sm:gap-3 text-[#c89d4b]/60">
                        <div className="w-8 h-8 sm:w-12 sm:h-12 border-b-2 border-r-2 border-[#c89d4b]/60 rounded-br-sm relative">
                            <span className="absolute -bottom-1 -right-1 sm:-bottom-1.5 sm:-right-1.5 w-2 h-2 sm:w-3 sm:h-3 bg-[#c89d4b]/80 rotate-45"></span>
                        </div>
                    </div>
                </>
            )}

            {/* MAIN CONTENT */}
            <main className={`relative z-20 flex flex-col items-center justify-center max-w-2xl px-4 sm:px-6 py-8 sm:py-12 text-center transition-all duration-700 ${showClouds ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}`}>
                <div className="relative mb-6 sm:mb-8 animate-float">
                    <div className="absolute inset-0 rounded-full bg-[#c89d4b]/25 filter blur-2xl transform scale-125"></div>
                    
                    <div className="relative w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 rounded-full p-2 border border-[#c89d4b]/40 bg-gradient-to-b from-[#2a241c]/90 to-[#161412]/95 gold-glow flex items-center justify-center backdrop-blur-sm shadow-2xl">
                        <div className="w-full h-full rounded-full border border-dashed border-[#c89d4b]/50 flex items-center justify-center p-2 sm:p-3 relative overflow-hidden">
                            <img 
                                src="/images/logo-kelas.webp" 
                                alt="XI RPL B Logo" 
                                className="w-full h-full object-contain"
                            />
                        </div>
                    </div>

                    <div className="absolute -bottom-2 sm:-bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 sm:px-3 py-0.5 rounded-full border border-[#c89d4b]/60 bg-[#1e1a15] text-[8px] sm:text-[10px] tracking-[0.15em] sm:tracking-[0.25em] text-[#e5be6d] font-serif uppercase shadow-lg">
                        XII RPL B 23'
                    </div>
                </div>

                <div className="inline-flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 text-[10px] sm:text-xs md:text-sm uppercase tracking-[0.2em] sm:tracking-[0.35em] text-[#c89d4b]/90 font-serif">
                    <span className="h-[1px] w-6 sm:w-8 md:w-12 bg-gradient-to-r from-transparent to-[#c89d4b]/80"></span>
                    <span className="text-[8px] sm:text-[10px] md:text-xs">Selamat Datang di Kelas Kami</span>
                    <span className="h-[1px] w-6 sm:w-8 md:w-12 bg-gradient-to-l from-transparent to-[#c89d4b]/80"></span>
                </div>

                <h1 className={`font-serif text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-[#fff7e6] via-[#f0deb4] to-[#c89d4b] drop-shadow-[0_6px_20px_rgba(0,0,0,0.9)] mb-3 sm:mb-4 transition-all duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0 translate-y-4'}`}>
                    WELCOME
                </h1>

                <div className="relative group w-full max-w-xs sm:max-w-sm md:max-w-md">
                    <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-[#9b7428] via-[#e5be6d] to-[#9b7428] opacity-60 blur-md group-hover:opacity-100 group-hover:blur-lg transition-all duration-300"></div>

                    <button
                        onClick={handleExplore}
                        className="relative inline-flex items-center justify-center gap-2 sm:gap-4 w-full px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 rounded-xl bg-gradient-to-b from-[#2e261b] via-[#221c14] to-[#17130e] border border-[#c89d4b]/80 text-[#e5be6d] font-serif text-sm sm:text-base md:text-lg tracking-[0.15em] sm:tracking-[0.2em] uppercase font-bold shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_10px_25px_rgba(0,0,0,0.7)] hover:text-white hover:border-[#c89d4b] transition-all duration-300 transform hover:-translate-y-1"
                    >
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#c89d4b] group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="5" r="3"></circle>
                            <line x1="12" y1="22" x2="12" y2="8"></line>
                            <path d="M5 12H2a10 10 0 0 0 20 0h-3"></path>
                        </svg>

                        <span className="text-xs sm:text-sm md:text-base">Mulai Menjelajahi</span>

                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#c89d4b] group-hover:translate-x-1.5 transition-transform duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                    </button>
                </div>
            </main>

            {/* FOOTER */}
            <footer className="absolute bottom-2 sm:bottom-4 z-10 text-center text-[8px] sm:text-[11px] text-white/30 tracking-widest uppercase font-serif px-4">
                © 2024-2027 XII RPL B 23' (Develop By DarysDev)
            </footer>

            {/* STYLES & ANIMATIONS */}
            <style dangerouslySetInnerHTML={{
                __html: `
                    @keyframes pulseGlow {
                        0%, 100% {
                            box-shadow: 0 0 25px rgba(200, 157, 75, 0.2), 0 0 8px rgba(200, 157, 75, 0.3);
                        }
                        50% {
                            box-shadow: 0 0 45px rgba(200, 157, 75, 0.4), 0 0 16px rgba(200, 157, 75, 0.6);
                        }
                    }
                    @keyframes floatSubtle {
                        0%, 100% { transform: translateY(0px); }
                        50% { transform: translateY(-6px); }
                    }
                    @keyframes l2 {
                        to { background-size: 100% 3px; }
                    }
                    @keyframes progress {
                        0% { width: 0%; }
                        100% { width: 100%; }
                    }
                    .animate-float {
                        animation: floatSubtle 4s ease-in-out infinite;
                    }
                    .gold-glow {
                        animation: pulseGlow 3s ease-in-out infinite;
                    }
                    .loader {
                        width: fit-content;
                        font-weight: bold;
                        font-family: 'Cinzel', serif;
                        font-size: 22px;
                        padding-bottom: 4px;
                        background: linear-gradient(currentColor 0 0) 0 100%/0% 3px no-repeat;
                        animation: l2 2s linear infinite;
                    }
                    .animate-progress {
                        animation: progress 2s ease-in-out infinite;
                    }
                    @media (min-width: 480px) {
                        .loader {
                            font-size: 26px;
                            padding-bottom: 6px;
                        }
                    }
                    @media (min-width: 640px) {
                        .loader {
                            font-size: 30px;
                            padding-bottom: 8px;
                        }
                    }
                `
            }} />
        </div>
    );
};

export default Landing;