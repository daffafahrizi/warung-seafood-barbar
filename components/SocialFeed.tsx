"use client";

import React, { useState } from 'react';
import Script from 'next/script';

export default function SocialFeed() {
    // State untuk melacak apakah user sudah mengklik tombol Play
    const [showTikTok, setShowTikTok] = useState(false);
    const [showIG, setShowIG] = useState(false);

    return (
        <section className="py-[64px] md:py-[100px] px-6 bg-surface-container-lowest overflow-hidden" id="social">
            <div className="max-w-[1280px] mx-auto text-center mb-12">
                <span className="text-secondary font-label-bold text-[14px] uppercase tracking-widest text-secondary-container">Ikuti Keseruannya</span>
                <h2 className="font-headline-xl text-[40px] md:text-[48px] font-extrabold tracking-tight mt-2 text-on-surface">
                    Seafood Barbar di Media Sosial
                </h2>
                <p className="font-body-md text-[16px] text-on-surface-variant max-w-2xl mx-auto mt-4">
                    Intip keseruan di balik dapur kami, promo terbaru, dan momen barbar para pelanggan!
                </p>
            </div>

            <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* KOLOM TIKTOK */}
                <div className="bg-white rounded-3xl shadow-sm border border-outline-variant/30 overflow-hidden flex flex-col">
                    <div className="p-4 bg-black text-white flex items-center justify-between">
                        <span className="font-bold text-[18px]">TikTok</span>
                        <a href="https://www.tiktok.com/@seafoodbarbarsolo" target="_blank" rel="noreferrer" className="text-xs bg-white text-black px-4 py-1.5 rounded-full font-bold hover:bg-gray-200 transition">
                            Follow Us
                        </a>
                    </div>
                    <div className="p-6 flex-grow flex items-center justify-center bg-gray-50 min-h-[500px]">

                        {!showTikTok ? (
                            /* FASE 1: TOPENG (Pajangan Gambar Super Ringan) */
                            <div
                                onClick={() => setShowTikTok(true)}
                                className="relative w-full max-w-[325px] h-[480px] bg-gray-900 rounded-2xl shadow-lg border cursor-pointer group overflow-hidden flex flex-col items-center justify-center"
                            >
                                {/* Background Gambar Seafood Blur */}
                                <img src="https://images.unsplash.com/photo-1559742811-822873691df8?w=400&q=80" alt="TikTok Thumbnail" className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-110 transition-transform duration-500" />

                                {/* Tombol Play */}
                                <div className="relative z-10 w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center group-hover:bg-white/40 transition-colors border border-white/30">
                                    <span className="material-symbols-outlined text-white text-[40px] ml-1">play_arrow</span>
                                </div>
                                <p className="relative z-10 text-white font-bold mt-4 drop-shadow-md tracking-wider text-sm">Putar Video TikTok</p>
                            </div>
                        ) : (
                            /* FASE 2: ASLI (Dipanggil cuma kalau sudah diklik) */
                            <div className="w-full flex justify-center animate-fade-in">
                                <blockquote className="tiktok-embed w-full max-w-[325px] rounded-2xl shadow-lg border" cite="https://www.tiktok.com/@seafoodbarbarsolo/video/7541363556218932486" data-video-id="7541363556218932486">
                                    <section></section>
                                </blockquote>
                                <Script src="https://www.tiktok.com/embed.js" strategy="lazyOnload" />
                            </div>
                        )}

                    </div>
                </div>

                {/* KOLOM INSTAGRAM */}
                <div className="bg-white rounded-3xl shadow-sm border border-outline-variant/30 overflow-hidden flex flex-col">
                    <div className="p-4 bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white flex items-center justify-between">
                        <span className="font-bold text-[18px]">Instagram</span>
                        <a href="https://www.instagram.com/seafoodbarbarsolo" target="_blank" rel="noreferrer" className="text-xs bg-white text-black px-4 py-1.5 rounded-full font-bold hover:bg-gray-200 transition">
                            Follow Us
                        </a>
                    </div>
                    <div className="p-6 flex-grow flex items-center justify-center bg-gray-50 min-h-[500px]">

                        {!showIG ? (
                            /* FASE 1: TOPENG (Pajangan Gambar Super Ringan) */
                            <div
                                onClick={() => setShowIG(true)}
                                className="relative w-full max-w-[325px] h-[480px] bg-gray-900 rounded-2xl shadow-lg border cursor-pointer group overflow-hidden flex flex-col items-center justify-center"
                            >
                                <img src="https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400&q=80" alt="IG Thumbnail" className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-110 transition-transform duration-500" />
                                <div className="relative z-10 w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center group-hover:bg-white/40 transition-colors border border-white/30">
                                    <span className="material-symbols-outlined text-white text-[40px] ml-1">play_arrow</span>
                                </div>
                                <p className="relative z-10 text-white font-bold mt-4 drop-shadow-md tracking-wider text-sm">Lihat Reels Instagram</p>
                            </div>
                        ) : (
                            /* FASE 2: ASLI */
                            <div className="w-full flex justify-center animate-fade-in">
                                <iframe
                                    src="https://www.instagram.com/reel/DX55diQzlBT/embed"
                                    width="100%"
                                    height="480"
                                    frameBorder="0"
                                    scrolling="no"
                                    // allowTransparency={true}
                                    className="w-full max-w-[325px] rounded-2xl shadow-lg border bg-white"
                                ></iframe>
                            </div>
                        )}

                    </div>
                </div>

            </div>
        </section>
    );
}