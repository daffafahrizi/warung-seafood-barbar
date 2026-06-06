"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { supabase } from '@/utils/supabase';

export default function ImageGallery() {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [galleryImages, setGalleryImages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Fungsi untuk menarik data foto dari Supabase
    useEffect(() => {
        const fetchGallery = async () => {
            const { data, error } = await supabase
                .from('gallery')
                .select('*')
                .order('created_at', { ascending: false }); // Urutkan dari yang paling baru diupload admin

            if (data) {
                setGalleryImages(data);
            }
            setLoading(false);
        };

        fetchGallery();
    }, []);

    // Trik Performa: Kalau data masih loading atau admin belum upload satupun foto, 
    // komponen ini tidak akan merender apa-apa (hilang sementara).
    if (loading || galleryImages.length === 0) return null;

    return (
        <section className="py-[64px] md:py-[100px] px-6 max-w-[1280px] mx-auto bg-background" id="galeri">
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
                        onClick={() => setSelectedImage(img.image)}
                        className="group relative aspect-square overflow-hidden rounded-2xl cursor-pointer bg-surface-container shadow-sm hover:shadow-xl transition-all duration-300"
                    >
                        {/* Foto Thumbnail menggunakan Next Image (Super Ringan) */}
                        <Image
                            src={img.image}
                            alt={img.alt_text || 'Galeri Seafood Barbar'}
                            fill
                            sizes="(max-width: 768px) 50vw, 25vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />

                        {/* Efek Hover Kaca Keren */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
                            <span className="material-symbols-outlined text-white text-[32px] drop-shadow-md">zoom_in</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pop-up Layar Penuh (Lightobx) saat foto diklik */}
            {selectedImage && (
                <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" onClick={() => setSelectedImage(null)}>
                    <button className="absolute top-6 right-6 text-white hover:text-red-500 bg-black/50 p-2 rounded-full flex items-center justify-center z-50 transition-colors" onClick={() => setSelectedImage(null)}>
                        <span className="material-symbols-outlined text-[32px]">close</span>
                    </button>

                    <div className="relative w-full max-w-4xl h-[80vh]">
                        <Image
                            src={selectedImage}
                            alt="Enlarged view"
                            fill
                            className="object-contain"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                </div>
            )}
        </section>
    );
}