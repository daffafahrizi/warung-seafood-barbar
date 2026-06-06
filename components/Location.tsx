import React from 'react';

export default function Location() {
    return (
        <section className="py-[64px] md:py-section-gap-desktop px-6 bg-secondary-fixed/30 relative overflow-hidden" id="lokasi">
            <div className="absolute top-0 right-0 w-1/3 h-full bg-primary-container/5 -skew-x-12 transform origin-top"></div>
            <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row items-center gap-16 relative z-10">
                <div className="w-full md:w-1/2 flex flex-col gap-8">
                    <div>
                        <span className="text-primary font-label-bold text-[14px] uppercase tracking-widest">Kunjungi Warung Kami</span>
                        <h2 className="font-headline-xl text-[48px] font-extrabold tracking-tight mt-2 text-on-surface">Suasana Nyaman, Lokasi Strategis</h2>
                    </div>
                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-white rounded-2xl shadow-sm text-primary"><span className="material-symbols-outlined">location_on</span></div>
                            <div>
                                <h4 className="font-label-bold text-[14px] text-on-surface">Alamat Utama</h4>
                                <p className="font-body-md text-[16px] text-on-surface-variant"> Jl. Alun Alun Utara, Kedung Lumbu, Kec. Ps. Kliwon, Kota Surakarta, Jawa Tengah 57133.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-white rounded-2xl shadow-sm text-primary"><span className="material-symbols-outlined">schedule</span></div>
                            <div>
                                <h4 className="font-label-bold text-[14px] text-on-surface">Jam Operasional</h4>
                                <p className="font-body-md text-[16px] text-on-surface-variant">Setiap Hari: 17:00 — 23:15 WIB</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-white rounded-2xl shadow-sm text-primary"><span className="material-symbols-outlined">call</span></div>
                            <div>
                                <h4 className="font-label-bold text-[14px] text-on-surface">Hubungi Kami</h4>
                                <p className="font-body-md text-[16px] text-on-surface-variant">+62 812-2517-2528</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full md:w-1/2 rounded-3xl overflow-hidden shadow-2xl h-100 border-8 border-white bg-gray-200 relative">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3954.9993923247503!2d110.82724817505003!3d-7.575043192439222!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a170033494223%3A0xa880a7a11c04ee33!2sWarung%20Seafood%20Barbar!5e0!3m2!1sid!2sid!4v1780564702263!5m2!1sid!2sid"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen={true}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Google Maps Warung Seafood Barbar"
                        className="absolute inset-0"
                    ></iframe>
                </div>
            </div>
        </section>
    );
}