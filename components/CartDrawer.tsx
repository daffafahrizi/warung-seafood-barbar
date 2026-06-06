"use client";

import React from 'react';

export default function CartDrawer({
    isOpen,
    onClose,
    cart,
    updateQuantity,
    removeFromCart,
    formatPrice,
    cartTotalAmount,
    orderType,
    setOrderType,
    customerName,
    setCustomerName,
    guestCount,
    setGuestCount,
    arrivalTime,
    setArrivalTime,
    notes,
    setNotes,
    handleCheckout
}: any) {

    // Tipe untuk CartItem agar TypeScript tidak bingung
    type CartItem = {
        id: string;
        title: string;
        price: number;
        image: string;
        quantity: number;
    };

    return (
        <div className={`fixed inset-0 z-60 flex justify-end transition-all duration-300 ${isOpen ? 'visible' : 'invisible'}`}>
            <div
                className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
                onClick={onClose}
            />
            <div className={`relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="p-6 border-b flex justify-between items-center bg-primary text-white">
                    <h2 className="font-headline-lg text-[24px]">Keranjang Pesanan</h2>
                    <button className="material-symbols-outlined hover:scale-110 transition-transform" onClick={onClose}>close</button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {cart.length === 0 ? (
                        <div className="text-center text-on-surface-variant font-body-md py-10 flex flex-col items-center gap-4">
                            <span className="material-symbols-outlined text-6xl text-outline-variant">shopping_basket</span>
                            <p>Keranjang masih kosong.</p>
                        </div>
                    ) : (
                        <>
                            {cart.map((item: CartItem) => (
                                <div key={item.id} className="flex gap-4 items-center">
                                    <div className="w-20 h-20 rounded-xl bg-surface-container overflow-hidden shrink-0">
                                        <img className="w-full h-full object-cover" src={item.image} alt={item.title} />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-label-bold text-[14px] text-on-surface">{item.title}</h4>
                                        <p className="text-primary font-bold text-[14px] mt-1">{formatPrice(item.price)}</p>
                                        <div className="flex items-center justify-between mt-2">
                                            <div className="flex items-center gap-3">
                                                <button onClick={() => updateQuantity(item.id, -1)} className="w-6 h-6 rounded border border-outline flex items-center justify-center hover:bg-surface-container-high transition-colors">-</button>
                                                <span className="text-[14px] font-body-md">{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.id, 1)} className="w-6 h-6 rounded border border-outline text-primary  flex items-center justify-center hover:bg-primary/5 transition-colors">+</button>
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="text-red-600 hover:text-red-800 transition-colors"
                                                title="Hapus item"
                                            >
                                                <span className="material-symbols-outlined text-[20px]">delete</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}

                    <div className="pt-6 border-t border-outline-variant space-y-4">
                        <div>
                            <label className="block text-xs font-label-bold uppercase mb-1 text-on-surface-variant">Nama Pemesan</label>
                            <input
                                value={customerName}
                                onChange={e => setCustomerName(e.target.value)}
                                className="w-full rounded-lg border border-outline-variant bg-surface-container-low p-2 focus:ring-primary focus:border-primary outline-none"
                                placeholder="Contoh: Budi"
                                type="text"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-label-bold uppercase mb-1 text-on-surface-variant">Tipe Pesanan</label>
                            <div className="grid grid-cols-2 gap-2">
                                <label className={`flex items-center justify-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${orderType === 'dine_in' ? 'border-primary bg-primary/5 text-primary' : 'border-outline-variant bg-surface-container-low hover:bg-surface-container-high'}`}>
                                    <input type="radio" name="order_type" value="dine_in" checked={orderType === 'dine_in'} onChange={() => setOrderType('dine_in')} className="hidden" />
                                    <span className="text-body-md text-[14px] font-medium">Dine in</span>
                                </label>
                                <label className={`flex items-center justify-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${orderType === 'takeaway' ? 'border-primary bg-primary/5 text-primary' : 'border-outline-variant bg-surface-container-low hover:bg-surface-container-high'}`}>
                                    <input type="radio" name="order_type" value="takeaway" checked={orderType === 'takeaway'} onChange={() => setOrderType('takeaway')} className="hidden" />
                                    <span className="text-body-md text-[14px] font-medium">Takeaway</span>
                                </label>
                            </div>
                        </div>

                        {orderType === 'dine_in' && (
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-label-bold uppercase mb-1 text-on-surface-variant">Jumlah Orang</label>
                                    <input
                                        value={guestCount}
                                        onChange={e => setGuestCount(Math.max(1, parseInt(e.target.value) || 1))}
                                        className="w-full rounded-lg border border-outline-variant bg-surface-container-low p-2 focus:ring-primary focus:border-primary outline-none"
                                        type="number" min="1"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-label-bold uppercase mb-1 text-on-surface-variant">Jam Datang</label>
                                    <input
                                        value={arrivalTime}
                                        onChange={e => setArrivalTime(e.target.value)}
                                        className="w-full rounded-lg border border-outline-variant bg-surface-container-low p-2 focus:ring-primary focus:border-primary outline-none"
                                        type="time"
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-label-bold uppercase mb-1 text-on-surface-variant">Catatan Tambahan</label>
                            <textarea
                                value={notes}
                                onChange={e => setNotes(e.target.value)}
                                className="w-full rounded-lg border border-outline-variant bg-surface-container-low h-20 p-2 focus:ring-primary focus:border-primary outline-none resize-none"
                                placeholder="Contoh: Sambal dipisah, minta tidak pedas"
                            ></textarea>
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-outline-variant bg-surface-container-lowest">
                    <div className="flex justify-between items-center mb-4">
                        <span className="font-body-lg font-medium">Total:</span>
                        <span className="font-headline-lg text-[24px] font-bold text-primary">{formatPrice(cartTotalAmount)}</span>
                    </div>
                    <button
                        onClick={handleCheckout}
                        disabled={cart.length === 0}
                        className={`w-full text-white font-label-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-transform ${cart.length > 0 ? 'bg-[#25D366] hover:scale-[1.02]' : 'bg-gray-400 cursor-not-allowed'}`}
                    >
                        <span className="material-symbols-outlined">chat</span> Kirim Pesanan via WhatsApp
                    </button>
                </div>
            </div>
        </div>
    );
}