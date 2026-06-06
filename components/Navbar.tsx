"use client";

import React, { useState, useEffect } from 'react';

export default function Navbar({ cartItemsCount, onCartClick }: any) {
    const [activeSection, setActiveSection] = useState('home');

    useEffect(() => {
        const handleScroll = () => {
            const sections = ['home', 'promo', 'menu', 'lokasi'];
            let currentSection = 'home';

            for (const section of sections) {
                const element = document.getElementById(section);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    // Offset 150px supaya pas scroll dikit langsung ganti status aktifnya
                    if (rect.top <= 150) {
                        currentSection = section;
                    }
                }
            }
            setActiveSection(currentSection);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { id: 'home', label: 'Home' },
        { id: 'menu', label: 'Menu' },
        { id: 'galeri', label: 'Galeri' },
        { id: 'lokasi', label: 'Lokasi' },
    ];

    return (
        <nav className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl border-b border-primary/10 shadow-sm h-20">
            <div className="max-w-[1280px] mx-auto px-6 flex justify-between items-center h-full">
                <span className="font-headline-lg text-[32px] font-extrabold text-primary tracking-tighter">SEAFOOD BARBAR</span>

                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <a
                            key={link.id}
                            href={`#${link.id}`}
                            onClick={() => setActiveSection(link.id)}
                            className={`font-label-bold text-[14px] transition-all duration-200 py-1 ${activeSection === link.id
                                    ? 'text-primary border-b-2 border-primary'
                                    : 'text-on-surface hover:text-primary'
                                }`}
                        >
                            {link.label}
                        </a>
                    ))}
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative cursor-pointer group" onClick={onCartClick}>
                        <span className="material-symbols-outlined text-primary text-[28px]">shopping_cart</span>
                        {cartItemsCount > 0 && (
                            <span className="absolute -top-1 -right-2 bg-secondary-container text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm group-hover:scale-110 transition-transform">
                                {cartItemsCount}
                            </span>
                        )}
                    </div>
                    <button onClick={onCartClick} className="hidden md:flex bg-primary text-on-primary font-label-bold text-[14px] px-6 py-3 rounded-lg hover:scale-105 active:scale-95 transition-all shadow-md items-center gap-2 hover-glow">
                        Pesan Online dan Reservasi
                    </button>
                </div>
            </div>
        </nav>
    );
}