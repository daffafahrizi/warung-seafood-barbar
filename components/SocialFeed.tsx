"use client";

import React, { useState, useEffect } from 'react';
import Script from 'next/script';

export default function SocialFeed() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    return (
        <section className="py-[64px] md:py-25 px-6 bg-surface-container-lowest overflow-hidden" id="social">
            <div className="max-w-[1280px] mx-auto text-center mb-12">
                <span className="font-label-bold text-[14px] uppercase tracking-widest text-secondary-container">Ikuti Keseruannya</span>
                <h2 className="font-headline-xl text-[40px] md:text-[48px] font-extrabold tracking-tight mt-2 text-on-surface">
                    Seafood Barbar di Media Sosial
                </h2>
                <p className="font-body-md text-[16px] text-on-surface-variant max-w-2xl mx-auto mt-4">
                    Intip keseruan di balik dapur kami, promo terbaru, and momen barbar para pelanggan!
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
                    <div className="p-6 grow flex items-center justify-center bg-gray-50 min-h-125">
                        {isMounted ? (
                            <blockquote
                                className="tiktok-embed w-full max-w-81.25 rounded-2xl shadow-lg border"
                                cite="https://www.tiktok.com/@seafoodbarbarsolo/video/7541363556218932486"
                                data-video-id="7541363556218932486"
                            >
                                <section></section>
                            </blockquote>
                        ) : (
                            <div className="animate-pulse flex flex-col items-center text-gray-400">
                                <span className="material-symbols-outlined text-[48px] mb-2">slow_motion_video</span>
                                <p className="text-sm font-bold">Memuat Video TikTok...</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* KOLOM INSTAGRAM */}
                <div className="bg-white rounded-3xl shadow-sm border border-outline-variant/30 overflow-hidden flex flex-col">
                    <div className="p-4 bg-linear-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white flex items-center justify-between">
                        <span className="font-bold text-[18px]">Instagram</span>
                        <a href="https://www.instagram.com/seafoodbarbarsolo" target="_blank" rel="noreferrer" className="text-xs bg-white text-black px-4 py-1.5 rounded-full font-bold hover:bg-gray-200 transition">
                            Follow Us
                        </a>
                    </div>
                    <div className="p-6 grow flex items-center justify-center bg-gray-50">
                        <iframe
                            src="https://www.instagram.com/reel/DX55diQzlBT/embed"
                            width="100%"
                            height="500"
                            frameBorder="0"
                            scrolling="no"
                            className="w-full max-w-[325px] rounded-2xl shadow-lg border bg-white"
                        ></iframe>
                    </div>
                </div>

            </div>

            <Script src="https://www.tiktok.com/embed.js" strategy="lazyOnload" />
        </section>
    );
}