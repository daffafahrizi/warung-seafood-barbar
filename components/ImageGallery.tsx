"use client";

import React, { useState } from 'react';

export default function ImageGallery() {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const galleryImages = [
        { id: 1, src: "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=800&q=80", alt: "Udang Bakar Jimbaran" },
        { id: 2, src: "https://images.unsplash.com/photo-1559742811-822873691df8?w=800&q=80", alt: "Seafood Platter" },
        { id: 3, src: "https://images.unsplash.com/photo-1574782091176-754cbcce7642?w=800&q=80", alt: "Kepiting Saus Padang" },
        { id: 4, src: "https://images.unsplash.com/photo-1625938144755-652e08e359b7?w=800&q=80", alt: "Kerang Hijau Bakar" },
        { id: 5, src: "https://images.unsplash.com/photo-1533682805518-48d1f5b8cb3a?w=800&q=80", alt: "Ikan Bakar Spesial" },
        { id: 6, src: "https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?w=800&q=80", alt: "Cumi Goreng Tepung" },
        { id: 7, src: "https://images.unsplash.com/photo-1615141982883-c7da0e69f108?w=800&q=80", alt: "Suasana Warung" },
        { id: 8, src: "https://images.unsplash.com/photo-1577005831969-9f4c34a2e886?w=800&q=80", alt: "Es Jeruk Segar" },
    ];

    return (
        <section className="py-[64px] md:py-25 px-6 max-w-[1280px] mx-auto bg-background" id="galeri">
            <div className="text-center mb-12">
                <span className="text-primary font-label-bold text-[14px] uppercase tracking-widest">Galeri Kami</span>
                <h2 className="font-headline-xl text-[40px] md:text-[48px] font-extrabold tracking-tight mt-2 text-on-surface">
                    Potret Keseruan Barbar
                </h2>
                <p className="font-body-md text-[16px] text-on-surface-variant max-w-2xl mx-auto mt-4">
                    Visual memanjakan mata sebelum memanjakan lidah. Intip berbagai sajian istimewa kami!
                </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {galleryImages.map((img) => (
                    <div
                        key={img.id}
                        onClick={() => setSelectedImage(img.src)}
                        className="group relative aspect-square overflow-hidden rounded-2xl cursor-pointer bg-surface-container shadow-sm hover:shadow-xl transition-all duration-300"
                    >
                        <img src={img.src} alt={img.alt} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <span className="material-symbols-outlined text-white text-[32px] drop-shadow-md">zoom_in</span>
                        </div>
                    </div>
                ))}
            </div>

            {selectedImage && (
                <div className="fixed inset-0 z-100 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" onClick={() => setSelectedImage(null)}>
                    <button className="absolute top-6 right-6 text-white hover:text-red-500 bg-black/50 p-2 rounded-full flex items-center justify-center" onClick={() => setSelectedImage(null)}>
                        <span className="material-symbols-outlined text-[32px]">close</span>
                    </button>
                    <img src={selectedImage} alt="Enlarged view" className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl" onClick={(e) => e.stopPropagation()} />
                </div>
            )}
        </section>
    );
}