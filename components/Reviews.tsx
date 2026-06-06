import React from 'react';

export default function Reviews() {
    const reviewData = [
        {
            id: 1,
            name: "Februar Barkah",
            avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop",
            isLocalGuide: true,
            time: "3 bulan lalu",
            rating: 5,
            text: "Sedang berburu kuliner malam di sekitar Pujasera timur Alun-alun Lor, saya memutuskan mampir ke Warung Seafood Barbar. Aroma bakaran lautnya sungguh menggoda saat lewat, membuat saya penasaran untuk mencobanya. Rasanya memang seenak aromanya!"
        },
        {
            id: 2,
            name: "Anisa Gta",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
            isLocalGuide: true,
            time: "3 bulan lalu",
            rating: 5,
            text: "First time ke sini liat yg viral eh ternyata enak semua seafoodnya. Dari ikan barakuda sampai kerangnya bumbu jimbarannya manis pedas. Sambel dabu dabunya enak seger pedes mantap."
        },
        {
            id: 3,
            name: "Pradipta Indra Kumara",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
            isLocalGuide: true,
            time: "6 bulan lalu",
            rating: 5,
            text: "Tau tempat ini karena sering ke wedangan sebelah. Malam Minggu nyobain ke sini dengan kondisi cukup ramai. Sebenernya udah laper tapi karena ramai jadi wajar nunggu lama. Tapi pas makanannya datang, rasanya beneran terbayar lunas. Recommended!"
        }
    ];

    return (
        <section className="py-16 px-6 max-w-[1280px] mx-auto bg-background" id="reviews">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                <div>
                    <span className="text-[#4285F4] font-label-bold text-[14px] uppercase tracking-widest flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px]">verified</span>
                        Ulasan Asli Google Maps
                    </span>
                    <h2 className="font-headline-xl text-[40px] md:text-[48px] font-extrabold tracking-tight mt-2 text-on-surface">
                        Apa Kata Pelanggan Kami
                    </h2>
                </div>
                <div className="hidden md:flex items-center gap-4 bg-white px-6 py-3 rounded-2xl shadow-sm border border-outline-variant/30">
                    <div className="text-center">
                        <p className="text-[24px] font-extrabold text-on-surface">4.9</p>
                        <div className="flex text-[#FBBC04] text-[16px]">★★★★★</div>
                    </div>
                    <div className="w-px h-10 bg-surface-variant mx-2"></div>
                    <div>
                        <p className="text-[14px] font-label-bold text-on-surface">Rating Restoran</p>
                        <p className="text-[12px] text-on-surface-variant">Berdasarkan ulasan pelanggan</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {reviewData.map((review) => (
                    <div key={review.id} className="bg-white p-6 rounded-3xl shadow-sm border border-outline-variant/30 hover:shadow-xl transition-all duration-300 flex flex-col group">
                        <div className="flex items-center gap-4 mb-4">
                            <img src={review.avatar} alt={review.name} className="w-12 h-12 rounded-full object-cover border-2 border-surface-container" />
                            <div>
                                <h4 className="font-bold text-[16px] text-on-surface leading-tight">{review.name}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                    {review.isLocalGuide && (
                                        <span className="text-[12px] text-gray-500 flex items-center gap-1 font-medium">
                                            <span className="material-symbols-outlined text-[14px] text-[#EA4335]">stars</span> Local Guide
                                        </span>
                                    )}
                                    {review.isLocalGuide && <span className="text-gray-300">•</span>}
                                    <span className="text-[12px] text-gray-500">{review.time}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex text-[#FBBC04] mb-3 text-[18px] tracking-widest">
                            {"★★★★★".split("").map((star, i) => <span key={i}>{star}</span>)}
                        </div>
                        <p className="text-on-surface-variant text-[14px] leading-relaxed grow italic">"{review.text}"</p>
                        <div className="mt-6 flex justify-end opacity-40 group-hover:opacity-100 transition-opacity">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" /><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" /><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" /><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" /></svg>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}