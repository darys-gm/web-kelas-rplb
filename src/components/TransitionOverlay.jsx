import { useEffect, useState } from 'react';

const TransitionOverlay = ({ onComplete, isEntry = false }) => {
    const [stage, setStage] = useState('clouds-in'); // clouds-in, loading, clouds-out

    useEffect(() => {
        if (isEntry) {
            // Mode Entry: Awan langsung menutup, lalu loading, lalu menghilang
            const timer1 = setTimeout(() => {
                setStage('loading');
            }, 1500);

            const timer2 = setTimeout(() => {
                setStage('clouds-out');
            }, 3500);

            const timer3 = setTimeout(() => {
                if (onComplete) onComplete();
            }, 4700);

            return () => {
                clearTimeout(timer1);
                clearTimeout(timer2);
                clearTimeout(timer3);
            };
        } else {
            // Mode Exit: Awan menutup, loading, lalu menghilang
            const timer1 = setTimeout(() => {
                setStage('loading');
            }, 1800);

            const timer2 = setTimeout(() => {
                setStage('clouds-out');
            }, 4300);

            const timer3 = setTimeout(() => {
                if (onComplete) onComplete();
            }, 5500);

            return () => {
                clearTimeout(timer1);
                clearTimeout(timer2);
                clearTimeout(timer3);
            };
        }
    }, [onComplete, isEntry]);

    // Generate 32 posisi awan berbeda untuk efek kabut
    const cloudPositions = [
        // Dari kiri (12 posisi)
        { x: '-100%', y: '0%', delay: 0 },
        { x: '-80%', y: '10%', delay: 0.1 },
        { x: '-90%', y: '30%', delay: 0.2 },
        { x: '-70%', y: '50%', delay: 0.15 },
        { x: '-85%', y: '70%', delay: 0.25 },
        { x: '-95%', y: '90%', delay: 0.3 },
        { x: '-75%', y: '15%', delay: 0.05 },
        { x: '-88%', y: '45%', delay: 0.18 },
        { x: '-92%', y: '65%', delay: 0.28 },
        { x: '-78%', y: '80%', delay: 0.22 },
        { x: '-82%', y: '25%', delay: 0.12 },
        { x: '-96%', y: '55%', delay: 0.32 },
        // Dari kanan (12 posisi)
        { x: '100%', y: '0%', delay: 0.1 },
        { x: '80%', y: '20%', delay: 0.2 },
        { x: '90%', y: '40%', delay: 0.15 },
        { x: '75%', y: '60%', delay: 0.25 },
        { x: '85%', y: '80%', delay: 0.3 },
        { x: '95%', y: '100%', delay: 0.35 },
        { x: '78%', y: '10%', delay: 0.08 },
        { x: '88%', y: '30%', delay: 0.18 },
        { x: '92%', y: '50%', delay: 0.28 },
        { x: '82%', y: '70%', delay: 0.22 },
        { x: '86%', y: '90%', delay: 0.32 },
        { x: '98%', y: '25%', delay: 0.12 },
        // Dari atas (6 posisi)
        { x: '0%', y: '-100%', delay: 0.2 },
        { x: '20%', y: '-90%', delay: 0.3 },
        { x: '40%', y: '-80%', delay: 0.25 },
        { x: '60%', y: '-95%', delay: 0.35 },
        { x: '80%', y: '-85%', delay: 0.4 },
        { x: '100%', y: '-100%', delay: 0.3 },
        // Dari bawah (6 posisi)
        { x: '0%', y: '100%', delay: 0.3 },
        { x: '25%', y: '90%', delay: 0.4 },
        { x: '50%', y: '95%', delay: 0.35 },
        { x: '75%', y: '85%', delay: 0.45 },
        { x: '100%', y: '100%', delay: 0.4 },
        { x: '30%', y: '98%', delay: 0.38 },
        // Diagonal (4 posisi)
        { x: '-100%', y: '-100%', delay: 0.15 },
        { x: '100%', y: '-100%', delay: 0.25 },
        { x: '-100%', y: '100%', delay: 0.35 },
        { x: '100%', y: '100%', delay: 0.45 },
        // Tengah tersebar (8 posisi)
        { x: '0%', y: '0%', delay: 0.5 },
        { x: '30%', y: '20%', delay: 0.55 },
        { x: '60%', y: '40%', delay: 0.6 },
        { x: '20%', y: '60%', delay: 0.5 },
        { x: '50%', y: '80%', delay: 0.65 },
        { x: '80%', y: '10%', delay: 0.55 },
        { x: '40%', y: '50%', delay: 0.58 },
        { x: '70%', y: '70%', delay: 0.62 },
    ];

    return (
        <div className="fixed inset-0 z-[9999] pointer-events-none">
            {/* Background hitam untuk transisi */}
            <div className="absolute inset-0 bg-black"></div>

            {/* Awan - Muncul dari berbagai sisi dengan jumlah banyak seperti kabut */}
            {cloudPositions.map((pos, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-all duration-1000 ease-out ${
                        stage === 'clouds-in' 
                            ? 'opacity-100 scale-100' 
                            : stage === 'clouds-out'
                            ? 'opacity-0 scale-150 blur-md'
                            : 'opacity-100 scale-100'
                    }`}
                    style={{
                        backgroundImage: 'url("/images/assets/awan.png")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        transform: stage === 'clouds-in' 
                            ? `translate(${pos.x}, ${pos.y}) scale(1)` 
                            : `translate(0, 0) scale(1.5)`,
                        transitionDelay: `${pos.delay}s`,
                        opacity: stage === 'clouds-in' ? 0.3 + Math.random() * 0.5 : 0,
                        zIndex: Math.floor(Math.random() * 5),
                        filter: `blur(${Math.random() * 3}px)`,
                    }}
                />
            ))}

            {/* Awan Layer Ekstra - Efek kabut tebal */}
            <div 
                className={`absolute inset-0 transition-all duration-1200 ease-out delay-700 ${
                    stage === 'clouds-in' 
                        ? 'opacity-100 scale-100' 
                        : stage === 'clouds-out'
                        ? 'opacity-0 scale-200 blur-lg'
                        : 'opacity-100 scale-100'
                }`}
                style={{
                    backgroundImage: 'url("/images/assets/awan.png")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    transform: stage === 'clouds-in' ? 'scale(1)' : 'scale(2)',
                    opacity: stage === 'clouds-in' ? 0.5 : 0,
                    backgroundColor: 'rgba(0,0,0,0.2)',
                    backgroundBlendMode: 'multiply'
                }}
            />

            {/* Awan Penutup Akhir - Menutup sempurna */}
            <div 
                className={`absolute inset-0 transition-all duration-800 ease-out delay-1000 ${
                    stage === 'clouds-in' 
                        ? 'opacity-100 scale-100' 
                        : stage === 'clouds-out'
                        ? 'opacity-0 scale-150 blur-sm'
                        : 'opacity-100 scale-100'
                }`}
                style={{
                    backgroundImage: 'url("/images/assets/awan.png")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    transform: stage === 'clouds-in' ? 'scale(1)' : 'scale(1.5)',
                    opacity: stage === 'clouds-in' ? 0.6 : 0,
                    backgroundColor: 'rgba(0,0,0,0.15)',
                    backgroundBlendMode: 'multiply'
                }}
            />

            {/* Loading Screen */}
            {stage === 'loading' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 transition-opacity duration-500 z-10">
                    <div className="loader text-[#c89d4b]">
                        <span className="font-serif tracking-wider">Loading...</span>
                    </div>
                    <div className="mt-4 text-white/50 text-sm font-mono tracking-widest animate-pulse">
                        MEMPERSIAPKAN GELADAK ARMADA
                    </div>
                    <div className="mt-2 text-white/30 text-xs font-mono tracking-widest">
                        <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-[#c89d4b] rounded-full animate-progress"></div>
                        </div>
                    </div>
                </div>
            )}

            {/* CSS Animations */}
            <style dangerouslySetInnerHTML={{
                __html: `
                    .loader {
                        width: fit-content;
                        font-weight: bold;
                        font-family: 'Cinzel', serif;
                        font-size: 30px;
                        padding-bottom: 8px;
                        background: linear-gradient(currentColor 0 0) 0 100%/0% 3px no-repeat;
                        animation: l2 2s linear infinite;
                    }
                    .loader:before {
                        content: "Loading...";
                    }
                    @keyframes l2 {
                        to {
                            background-size: 100% 3px;
                        }
                    }
                    @keyframes progress {
                        0% { width: 0%; }
                        100% { width: 100%; }
                    }
                    .animate-progress {
                        animation: progress 2s ease-in-out infinite;
                    }
                `
            }} />
        </div>
    );
};

export default TransitionOverlay;