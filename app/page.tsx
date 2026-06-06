"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useState, useMemo, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import dynamic from 'next/dynamic';
import Navbar from '../components/Navbar';

const ImageGallery = dynamic(() => import('@/components/ImageGallery'), { ssr: false });
const SocialFeed = dynamic(() => import('@/components/SocialFeed'), { ssr: false });

import CartDrawer from '../components/CartDrawer';
import MenuGrid from '../components/MenuGrid';
import Hero from '../components/Hero';
import TrustBanner from '../components/TrustBanner';
import Reviews from '../components/Reviews';
import Location from '../components/Location';
import Footer from '../components/Footer';

// --- TYPES ---
type MenuItem = {
  id: string;
  title: string;
  price: number;
  image: string;
  category: string;
  description?: string;
  isPopular?: boolean;
  isRecommended?: boolean;
};

type CartItem = MenuItem & { quantity: number };

export default function Page() {
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);

  // State untuk Supabase
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [loadingMenu, setLoadingMenu] = useState(true);

  // Form state
  const [orderType, setOrderType] = useState('dine_in');
  const [customerName, setCustomerName] = useState('');
  const [guestCount, setGuestCount] = useState(1);
  const [arrivalTime, setArrivalTime] = useState('');
  const [notes, setNotes] = useState('');
  //announcement
  const [announcement, setAnnouncement] = useState({ text: '', active: false });

  const cartTotalAmount = useMemo(() => cart.reduce((acc, item) => acc + (item.price * item.quantity), 0), [cart]);
  const cartTotalItems = useMemo(() => cart.reduce((acc, item) => acc + item.quantity, 0), [cart]);

  const toggleCart = () => setCartOpen(!cartOpen);


  // Menarik data dari Supabase
  // Menarik data dari Supabase & Pengumuman
  useEffect(() => {
    const fetchData = async () => {
      // 1. Tarik Pengumuman
      const { data: settings } = await supabase.from('store_settings').select('*').eq('id', 'main').single();
      if (settings) {
        setAnnouncement({ text: settings.announcement_text, active: settings.is_active });
      }
      // console.log('Settings:', settings); // Debug log untuk memastikan data pengumuman berhasil ditarik

      // 2. Tarik Menu
      const { data, error } = await supabase.from('menus').select('*');
      if (error) {
        console.error('Gagal narik data:', error);
      } else if (data) {
        const formattedData = data.map((item) => ({
          id: item.menu_id,
          name: item.name,
          price: item.price,
          priceDisplay: item.price_display,
          category: item.category,
          description: item.description,
          image: item.image,
          variants: item.variants,
        }));
        setMenuItems(formattedData);
      }
      setLoadingMenu(false);
    };

    fetchData();
  }, []);

  const addToCart = (item: any) => {
    setCart((prev) => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, title: item.name, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, amount: number) => {
    setCart((prev) => {
      return prev.map(i => {
        if (i.id === id) {
          const newQty = i.quantity + amount;
          return { ...i, quantity: newQty };
        }
        return i;
      }).filter(i => i.quantity > 0);
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter(i => i.id !== id));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price);
  };

  const handleCheckout = () => {
    if (cart.length === 0) return alert('Keranjang masih kosong!');
    if (!customerName) return alert('Silakan isi nama pemesan!');

    let text = `Halo Seafood Barbar, saya ingin memesan:\n\n`;
    text += `*Detail Pemesan:*\n`;
    text += `- Nama: ${customerName}\n`;
    text += `- Tipe Pesanan: ${orderType === 'dine_in' ? 'Dine in' : 'Takeaway'}\n`;
    if (orderType === 'dine_in') {
      text += `- Jumlah Orang: ${guestCount}\n`;
      text += `- Rencana Jam Datang: ${arrivalTime || '-'}\n`;
    }
    text += `\n*Daftar Pesanan:*\n`;
    cart.forEach(item => {
      text += `- ${item.quantity}x ${item.title} (${formatPrice(item.price)})\n`;
    });

    text += `\n*TOTAL: ${formatPrice(cartTotalAmount)}*\n`;

    if (notes) {
      text += `\n*Catatan Tambahan:*\n${notes}\n`;
    }

    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/6281225172528?text=${encodedText}`, '_blank');
  };

  return (
    <>
      <Navbar 
        cartItemsCount={cartTotalItems} 
        onCartClick={() => setCartOpen(true)} 
      />

      <main>
        <Hero />
        <TrustBanner />
        {announcement.active && announcement.text && (
          <div className="bg-red-50 border-l-4 border-red-600 p-4 mb-6 rounded-r-2xl shadow-sm max-w-300 mx-4 lg:mx-auto mt-6">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-red-600 text-2xl animate-pulse">campaign</span>
              <div>
                <h3 className="font-bold text-red-800 mb-1">Pengumuman Terkini</h3>
                <p className="text-sm text-red-700 whitespace-pre-wrap">{announcement.text}</p>
              </div>
            </div>
          </div>
        )}

        {loadingMenu ? (
          <div className="py-32 text-center flex flex-col items-center justify-center bg-surface-container-lowest" id="menu">
            <span className="material-symbols-outlined text-[48px] text-primary animate-spin mb-4">refresh</span>
            <p className="font-label-bold text-on-surface-variant">Memuat menu dari database...</p>
          </div>
        ) : (
          <MenuGrid
            menus={menuItems}
            cart={cart}
            onAddToCart={addToCart}
            onUpdateQuantity={updateQuantity}
            onRemoveFromCart={removeFromCart}
            formatPrice={formatPrice}
          />
        )}
        <ImageGallery />
        <Reviews />
        <SocialFeed />
        <Location />
      </main>

      <Footer />

      {/* --- FLOATING CHECKOUT BUTTON --- */}
      {cart.length > 0 && !cartOpen && (
        <div className="fixed bottom-6 left-0 right-0 z-40 flex justify-center px-6 pointer-events-none animate-fade-in">
          <button
            onClick={toggleCart}
            className="w-full max-w-md bg-primary text-white rounded-2xl p-4 flex justify-between items-center shadow-[0_10px_40px_rgba(147,0,11,0.4)] pointer-events-auto hover:scale-105 transition-transform"
          >
            <div className="flex flex-col text-left">
              <span className="font-label-bold text-[12px] text-white/80 uppercase tracking-widest">{cartTotalItems} Item di Keranjang</span>
              <span className="font-extrabold text-[20px]">{formatPrice(cartTotalAmount)}</span>
            </div>
            <div className="flex items-center gap-2 font-bold bg-white/20 px-4 py-2 rounded-xl">
              Lihat Pesanan <span className="material-symbols-outlined">receipt_long</span>
            </div>
          </button>
        </div>
      )}

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        updateQuantity={updateQuantity}
        removeFromCart={removeFromCart}
        formatPrice={formatPrice}
        cartTotalAmount={cartTotalAmount}
        orderType={orderType}
        setOrderType={setOrderType}
        customerName={customerName}
        setCustomerName={setCustomerName}
        guestCount={guestCount}
        setGuestCount={setGuestCount}
        arrivalTime={arrivalTime}
        setArrivalTime={setArrivalTime}
        notes={notes}
        setNotes={setNotes}
        handleCheckout={handleCheckout}
      />
    </>
  );
}
