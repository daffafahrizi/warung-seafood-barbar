"use client";

import React, { useState } from 'react';

// --- KOMPONEN KECIL: MENU CARD ---
function MenuCard({ item, cart, onAdd, onUpdateQuantity, onRemove, formatPrice }: any) {
    const variants = item.variants && item.variants.length > 0 ? item.variants : null;
    const [selectedVariant, setSelectedVariant] = useState(variants ? variants[0] : null);

    const needsFlavorSelection = item.name.toLowerCase().includes('jimbaran') && item.name.toLowerCase().includes('madu');
    const [selectedFlavor, setSelectedFlavor] = useState(needsFlavorSelection ? 'Jimbaran' : '');

    const displayPrice = selectedVariant ? formatPrice(selectedVariant.price) : formatPrice(item.price);

    const variantId = selectedVariant ? `-${selectedVariant.name}` : '';
    const flavorId = selectedFlavor ? `-${selectedFlavor}` : '';
    const cartItemId = `${item.id}${variantId}${flavorId}`;

    const cartItem = cart.find((i: any) => i.id === cartItemId);
    const currentQty = cartItem ? cartItem.quantity : 0;

    const handleAddInitial = () => {
        let finalName = item.name;
        if (needsFlavorSelection) {
            finalName = finalName.replace(/\s*\(?Jimbaran\s*\/\s*Madu\)?\s*/i, '');
            finalName = `${finalName} - Rasa ${selectedFlavor}`;
        }
        if (selectedVariant) {
            finalName = `${finalName} (${selectedVariant.name})`;
        }

        const itemToAdd = {
            ...item,
            id: cartItemId,
            name: finalName,
            price: selectedVariant ? selectedVariant.price : item.price,
        };
        onAdd(itemToAdd);
    };

    const handleDecrement = () => {
        if (currentQty === 1) onRemove(cartItemId);
        else onUpdateQuantity(cartItemId, -1);
    };

    return (
        <div className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full border border-outline-variant/30 relative">
            <div className="aspect-4/3 overflow-hidden relative bg-surface-container">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                {item.priceDisplay.includes('Mulai') && (
                    <div className="absolute top-4 right-4 bg-tertiary-fixed-dim text-on-tertiary-fixed px-3 py-1 rounded-full font-label-bold text-[10px] uppercase shadow-sm">
                        Beragam Ukuran
                    </div>
                )}
            </div>

            <div className="p-6 flex flex-col grow bg-white">
                <h3 className="font-headline-lg text-[20px] text-on-surface mb-2 leading-tight">{item.name}</h3>
                <p className="text-primary font-headline-lg text-[22px] mb-4 font-bold">{displayPrice}</p>

                {item.description && <p className="text-on-surface-variant text-[14px] mb-4 grow">{item.description}</p>}
                {!item.description && <div className="grow mb-4"></div>}

                {variants && (
                    <div className="mb-4 relative">
                        <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Pilih Ukuran</label>
                        <select
                            className="w-full p-3 border border-outline-variant rounded-xl text-[13px] font-label-bold text-on-surface-variant focus:border-primary focus:ring-primary focus:ring-1 outline-none appearance-none bg-surface-container-lowest cursor-pointer"
                            onChange={(e) => {
                                const v = variants.find((v: any) => v.name === e.target.value);
                                setSelectedVariant(v);
                            }}
                            value={selectedVariant?.name}
                        >
                            {variants.map((v: any) => <option key={v.name} value={v.name}>{v.name}</option>)}
                        </select>
                        <div className="absolute right-3 top-7 pointer-events-none text-on-surface-variant">
                            <span className="material-symbols-outlined text-[18px]">expand_more</span>
                        </div>
                    </div>
                )}

                {needsFlavorSelection && (
                    <div className="mb-4">
                        <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Pilihan Bumbu Bakar</label>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={() => setSelectedFlavor('Jimbaran')}
                                className={`py-2 text-[12px] font-bold rounded-lg border transition-all ${selectedFlavor === 'Jimbaran' ? 'bg-primary/10 border-primary text-primary' : 'bg-gray-50 border-gray-200 text-gray-500'}`}
                            >
                                Jimbaran
                            </button>
                            <button
                                onClick={() => setSelectedFlavor('Madu')}
                                className={`py-2 text-[12px] font-bold rounded-lg border transition-all ${selectedFlavor === 'Madu' ? 'bg-primary/10 border-primary text-primary' : 'bg-gray-50 border-gray-200 text-gray-500'}`}
                            >
                                Madu
                            </button>
                        </div>
                    </div>
                )}

                {currentQty === 0 ? (
                    <button onClick={handleAddInitial} className="w-full py-3 rounded-xl font-label-bold text-[14px] flex items-center justify-center gap-2 transition-all mt-auto bg-primary/5 text-primary hover:bg-primary hover:text-white">
                        Tambah <span className="material-symbols-outlined text-[18px]">add</span>
                    </button>
                ) : (
                    <div className="w-full mt-auto flex items-center justify-between bg-primary/5 rounded-xl p-1 border border-primary/20">
                        <button onClick={handleDecrement} className="w-10 h-10 flex items-center justify-center rounded-lg text-primary hover:bg-primary/10 transition-colors">
                            <span className="material-symbols-outlined text-[20px]">{currentQty === 1 ? 'delete' : 'remove'}</span>
                        </button>
                        <span className="font-bold text-[16px] text-primary">{currentQty}</span>
                        <button onClick={() => onUpdateQuantity(cartItemId, 1)} className="w-10 h-10 flex items-center justify-center rounded-lg text-white bg-primary hover:bg-primary-fixed-variant transition-colors shadow-sm">
                            <span className="material-symbols-outlined text-[20px]">add</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

// --- KOMPONEN UTAMA: MENU GRID (DI-EXPORT) ---
export default function MenuGrid({ menus, cart, onAddToCart, onUpdateQuantity, onRemoveFromCart, formatPrice }: any) {
    const [activeCategory, setActiveCategory] = useState('Udang & Lobster');
    const categories = ['Udang & Lobster', 'Ikan Laut (Bakar/Goreng)', 'Kerang & Cumi', 'Ayam & Nasi', 'Sayur & Tambahan', 'Minuman'];
    const filteredMenus = menus.filter((m: any) => m.category === activeCategory);

    return (
        <section className="py-16 px-6 max-w-[1280px] mx-auto bg-surface-container-lowest" id="menu">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                <div>
                    <span className="font-label-bold text-[14px] uppercase tracking-widest text-secondary-container">Favorit Pelanggan</span>
                    <h2 className="font-headline-xl text-[48px] font-extrabold tracking-tight mt-2 text-on-surface">Menu Andalan Kami</h2>
                </div>
            </div>

            <div className="flex flex-wrap gap-3 items-center mb-12">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-6 py-2 rounded-full font-label-bold text-[14px] transition-all duration-300 border ${activeCategory === cat
                            ? 'bg-primary text-white border-primary shadow-lg shadow-primary/30 scale-105'
                            : 'bg-white text-on-surface-variant border-outline-variant hover:bg-surface-container-high'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredMenus.map((item: any) => (
                    <MenuCard
                        key={item.id}
                        item={item}
                        cart={cart}
                        onAdd={onAddToCart}
                        onUpdateQuantity={onUpdateQuantity}
                        onRemove={onRemoveFromCart}
                        formatPrice={formatPrice}
                    />
                ))}
            </div>
        </section>
    );
}