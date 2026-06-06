import React from 'react';

export default function TrustBanner() {
    return (
        <div className="w-full bg-primary py-4 overflow-hidden" id="promo">
            <div className="flex items-center gap-12 animate-marquee whitespace-nowrap">
                {Array.from({ length: 4 }).map((_, i) => (
                    <React.Fragment key={i}>
                        <span className="text-on-primary font-label-bold text-[14px] tracking-[0.2em] flex items-center gap-2">
                            <span className="material-symbols-outlined text-tertiary-fixed-dim">verified</span> HALAL INDONESIA CERTIFIED
                        </span>
                        <span className="text-on-primary font-label-bold text-[14px] tracking-[0.2em] flex items-center gap-2">
                            <span className="material-symbols-outlined text-tertiary-fixed-dim">local_fire_department</span> SEMUA MENU BAKAR FREE SAMBAL DABU-DABU & LALAPAN
                        </span>
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
}