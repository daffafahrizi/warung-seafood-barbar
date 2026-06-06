import React from 'react';

export default function Footer() {
    return (
        <footer className="bg-inverse-surface text-on-primary-fixed-variant w-full py-[64px] md:py-section-gap-desktop">
            <div className="max-w-[1280px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-12">
                <div className="flex flex-col items-center md:items-start gap-4">
                    <span className="font-headline-lg text-[32px] font-extrabold text-primary">SEAFOOD BARBAR</span>
                    <p className="font-body-md text-[16px] text-[#8e8d8d] max-w-xs text-center md:text-left">
                        Pionir Seafood Bakar Khas Jimbaran Bali di jantung kota Solo sejak 2018.
                    </p>
                </div>
                <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="flex items-center gap-4">
                        <span className="material-symbols-outlined text-secondary-container">workspace_premium</span>
                        <span className="font-label-bold text-[14px] text-white">HALAL ID: 003410003529661025</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <a className="text-[#8e8d8d] hover:text-primary-fixed transition-colors flex items-center gap-2" href="https://www.instagram.com/seafoodbarbarsolo" target="_blank" rel="noreferrer">
                            <span className="material-symbols-outlined">alternate_email</span> Instagram
                        </a>
                    </div>
                </div>
                <p className="font-body-md text-[16px] text-[#8e8d8d] text-center">
                    © {new Date().getFullYear()} Seafood Barbar Solo. <br />All Rights Reserved.
                </p>
            </div>
        </footer>
    );
}