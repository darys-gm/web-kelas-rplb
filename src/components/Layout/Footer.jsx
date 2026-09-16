const Footer = () => {
    return (
        <footer className="relative w-full overflow-hidden">
            {/* Background Image dengan Overlay */}
            <div
                className="absolute inset-0 w-full h-full z-0"
                style={{
                    backgroundImage: 'url("/images/assets/footer-bg.png")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                }}
            >
                {/* Overlay Gelap untuk Kontras */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0603] via-[#0a0603]/85 to-[#0a0603]/70"></div>
            </div>

            {/* Decorative Top Border - Emas */}
            <div className="relative z-10 h-1 w-full bg-gradient-to-r from-transparent via-[#d4a853] to-transparent"></div>

            {/* Konten Footer */}
            <div className="relative z-10 max-w-[1280px] mx-auto px-4 lg:px-6 py-12 md:py-16">
                <div className="flex flex-col items-center text-center gap-6">

                    {/* Judul Utama */}
                    <div className="flex flex-col items-center gap-2">
                        {/* Ornamen Emas di Atas */}
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-[#d4a853]"></div>
                            <span className="material-symbols-outlined text-[#d4a853] text-2xl">anchor</span>
                            <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-[#d4a853]"></div>
                        </div>

                        <h3
                            className="font-display-hero text-3xl sm:text-4xl md:text-5xl font-black text-[#d4a853] tracking-wider"
                            style={{
                                textShadow: '0 0 20px rgba(212, 168, 83, 0.5), 0 4px 8px rgba(0, 0, 0, 0.8)',
                                letterSpacing: '2px',
                            }}
                        >
                            Kelas XII RPL B 23'
                        </h3>

                        {/* Motto */}
                        <p
                            className="font-label-nav-coordinates text-[#e8c060] text-sm sm:text-base md:text-lg tracking-widest uppercase"
                            style={{
                                textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)',
                            }}
                        >
                            &ldquo;Kreativitas Tanpa Batas&rdquo;
                        </p>

                        {/* Ornamen Bawah */}
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-[#d4a853] text-xs">✦</span>
                            <div className="w-20 h-px bg-gradient-to-r from-transparent via-[#d4a853]/60 to-transparent"></div>
                            <span className="text-[#d4a853] text-xs">✦</span>
                        </div>
                    </div>

                    {/* Social Media Icons */}
                    <div className="flex items-center justify-center gap-4 sm:gap-5 mt-2">
                        {/* Instagram */}
                        <a
                            href="https://www.instagram.com/xiirplbe_?stkn=d2M5amZ6YmthZjJw"
                            className="group relative w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Instagram"
                            style={{
                                background: 'linear-gradient(135deg, #d4a853 0%, #b8860b 100%)',
                                boxShadow: '0 4px 15px rgba(212, 168, 83, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.2)',
                            }}
                        >
                            {/* Glow on hover */}
                            <span
                                className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                style={{
                                    background: 'radial-gradient(circle, rgba(255, 215, 0, 0.6) 0%, transparent 70%)',
                                    filter: 'blur(12px)',
                                    transform: 'scale(1.4)',
                                }}
                            />
                            <i className="fab fa-instagram text-xl sm:text-2xl text-[#1a120e] relative z-10"></i>
                        </a>

                        {/* TikTok */}
                        <a
                            href="https://www.tiktok.com/@erpeelbe_?_t=ZS-906imFOCMQk&_r=1"
                            className="group relative w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="TikTok"
                            style={{
                                background: 'linear-gradient(135deg, #d4a853 0%, #b8860b 100%)',
                                boxShadow: '0 4px 15px rgba(212, 168, 83, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.2)',
                            }}
                        >
                            <span
                                className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                style={{
                                    background: 'radial-gradient(circle, rgba(255, 215, 0, 0.6) 0%, transparent 70%)',
                                    filter: 'blur(12px)',
                                    transform: 'scale(1.4)',
                                }}
                            />
                            <i className="fa-brands fa-tiktok text-xl sm:text-2xl text-[#1a120e] relative z-10"></i>
                        </a>

                        {/* YouTube */}
                        <a
                            href="https://youtube.com/@xrplbe?si=FTFyuR6cnU_G6zPe"
                            className="group relative w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="YouTube"
                            style={{
                                background: 'linear-gradient(135deg, #d4a853 0%, #b8860b 100%)',
                                boxShadow: '0 4px 15px rgba(212, 168, 83, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.2)',
                            }}
                        >
                            <span
                                className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                style={{
                                    background: 'radial-gradient(circle, rgba(255, 215, 0, 0.6) 0%, transparent 70%)',
                                    filter: 'blur(12px)',
                                    transform: 'scale(1.4)',
                                }}
                            />
                            <i className="fab fa-youtube text-xl sm:text-2xl text-[#1a120e] relative z-10"></i>
                        </a>
                    </div>

                    {/* Divider */}
                    <div className="flex items-center gap-3 mt-4">
                        <div className="w-16 h-px bg-[#d4a853]/30"></div>
                        <span className="material-symbols-outlined text-[#d4a853] text-2xl">anchor</span>
                        <div className="w-16 h-px bg-[#d4a853]/30"></div>
                    </div>

                    {/* Copyright */}
                    <p
                        className="font-label-code text-[#d4a853]/70 text-xs sm:text-sm tracking-wide"
                        style={{
                            textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)',
                        }}
                    >
                        &copy; 2024-2027 Kelas XII RPL B 23'. Barudak Bageur.
                    </p>
                </div>
            </div>

            {/* Decorative Bottom Border - Emas */}
            <div className="relative z-10 h-1 w-full bg-gradient-to-r from-transparent via-[#d4a853] to-transparent"></div>
        </footer>
    );
};

export default Footer;