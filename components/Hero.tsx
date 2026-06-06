import React from 'react';

export default function Hero() {
    return (
        <section className="pt-32 pb-[64px] md:pb-section-gap-desktop px-6 overflow-hidden" id="home">
            <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row items-center gap-16">
                <div className="w-full md:w-1/2 flex flex-col items-start gap-8">
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-bold text-[14px] uppercase tracking-widest">
                        Pionir Bakar Jimbaran Solo
                    </div>
                    <h1 className="font-display-lg-mobile md:font-display-lg text-[48px] md:text-[72px] text-primary leading-tight font-extrabold tracking-tight">
                        Sajian Seafood Segar, Rasa Barbar!
                    </h1>
                    <p className="font-body-lg text-[18px] text-on-surface-variant max-w-lg leading-relaxed">
                        Disajikan dengan sepenuh hati. Spesialis Seafood Bakar Jimbaran dengan bumbu meresap sempurna.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <button className="bg-primary text-on-primary font-label-bold text-[14px] px-8 py-4 rounded-lg hover:bg-secondary transition-colors flex items-center gap-2 shadow-lg hover-glow">
                            <span className="material-symbols-outlined">chat</span> Pesan via WhatsApp
                        </button>
                        <a href="#menu" className="border-2 border-primary text-primary font-label-bold text-[14px] px-8 py-4 rounded-lg hover:bg-primary/5 transition-all flex items-center justify-center">
                            Lihat Menu Kami
                        </a>
                    </div>
                </div>
                <div className="w-full md:w-1/2 relative">
                    <div className="absolute -top-10 -right-10 w-64 h-64 bg-secondary-container/20 rounded-full blur-3xl -z-10"></div>
                    <div className="rounded-3xl overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500">
                        <img alt="Signature Seafood Platter" className="w-full h-auto object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDooW7v9UamwNtl4XR4WtSk2fhVryrCuPu-JqXHTbQk0ptp_cuK3UoeXjPj4zTx28_iO34Rgvd9sC5UDlX0lVcQ-KZIhv9lATfI3rpU9G9XN2mop8jsyvfUlxz_KlSEwbWH32JTrZlbZgDz7tg_XF7nnZK5t-E1UNEULGMCVe9D9qQPpUy9iKmxB7w2qbQW2E_n0XQYEtHglaubS38i3ji1cYQ73MYpCI6bMAzsG_oDNRLIgc4yE8O2AQnxeh7cYOXPiFbKZ7FyT6hl" />
                    </div>
                    <div className="absolute -bottom-6 -left-6 glass p-6 rounded-2xl shadow-xl hidden md:block">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-primary rounded-full text-on-primary">
                                <span className="material-symbols-outlined">star</span>
                            </div>
                            <div>
                                <p className="font-label-bold text-[14px] text-on-surface">4.9/5 Rating</p>
                                <p className="text-xs text-on-surface-variant">Dari 2,000+ Pelanggan</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}