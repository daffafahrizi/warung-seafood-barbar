"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useState, useMemo, useEffect } from 'react';
import { supabase } from '@/utils/supabase';

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
      <Navbar cartItemsCount={cartTotalItems} onCartClick={toggleCart} />

      <main>
        <Hero />
        <TrustBanner />
        {announcement.active && announcement.text && (
          <div className="bg-red-50 border-l-4 border-red-600 p-4 mb-6 rounded-r-2xl shadow-sm max-w-[1200px] mx-4 lg:mx-auto mt-6">
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

// --- SUBCOMPONENTS ---

function Navbar({ cartItemsCount, onCartClick }: { cartItemsCount: number; onCartClick: () => void }) {
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'promo', 'menu', 'lokasi'];
      let currentSection = 'home';

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150) {
            currentSection = section;
          }
        }
      }
      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'menu', label: 'Menu' },
    { id: 'galeri', label: 'Galeri' },
    { id: 'lokasi', label: 'Lokasi' },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl border-b border-primary/10 shadow-sm h-20">
      <div className="max-w-[1280px] mx-auto px-6 flex justify-between items-center h-full">
        <span className="font-headline-lg text-[32px] font-extrabold text-primary tracking-tighter">SEAFOOD BARBAR</span>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={() => setActiveSection(link.id)}
              className={`font-label-bold text-[14px] transition-all duration-200 py-1 ${activeSection === link.id
                ? 'text-primary border-b-2 border-primary'
                : 'text-on-surface hover:text-primary'
                }`}
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <div className="relative cursor-pointer group" onClick={onCartClick}>
            <span className="material-symbols-outlined text-primary text-[28px]">shopping_cart</span>
            {cartItemsCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-secondary-container text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm group-hover:scale-110 transition-transform">
                {cartItemsCount}
              </span>
            )}
          </div>
          <button onClick={onCartClick} className="hidden md:flex bg-primary text-on-primary font-label-bold text-[14px] px-6 py-3 rounded-lg hover:scale-105 active:scale-95 transition-all shadow-md items-center gap-2 hover-glow">
            Pesan Online dan  Reservasi
          </button>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="pt-32 pb-[64px] md:pb-[120px] px-6 overflow-hidden" id="home">
      <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row items-center gap-16">
        <div className="w-full md:w-1/2 flex flex-col items-start gap-8">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-bold text-[14px] uppercase tracking-widest">
            Pionir Bakar Jimbaran Solo
          </div>
          <h1 className="font-display-lg-mobile md:font-display-lg text-[48px] md:text-[72px] text-primary leading-tight font-extrabold tracking-tight">
            Sajian Seafood Segar, Rasa Barbar!
          </h1>
          <p className="font-body-lg text-[18px] text-on-surface-variant max-w-lg leading-relaxed">
            Disajikan dengan sepenuh hati. Spesialis Seafood Bakar Jimbaran dengan bumbu meresap sempurna.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="bg-primary text-on-primary font-label-bold text-[14px] px-8 py-4 rounded-lg hover:bg-secondary transition-colors flex items-center gap-2 shadow-lg hover-glow">
              <span className="material-symbols-outlined">chat</span> Pesan via WhatsApp
            </button>
            <a href="#menu" className="border-2 border-primary text-primary font-label-bold text-[14px] px-8 py-4 rounded-lg hover:bg-primary/5 transition-all flex items-center justify-center">
              Lihat Menu Kami
            </a>
          </div>
        </div>
        <div className="w-full md:w-1/2 relative">
          <div className="absolute -top-10 -right-10 w-64 h-64 bg-secondary-container/20 rounded-full blur-3xl -z-10"></div>
          <div className="rounded-3xl overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500">
            <img alt="Signature Seafood Platter" className="w-full h-auto object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDooW7v9UamwNtl4XR4WtSk2fhVryrCuPu-JqXHTbQk0ptp_cuK3UoeXjPj4zTx28_iO34Rgvd9sC5UDlX0lVcQ-KZIhv9lATfI3rpU9G9XN2mop8jsyvfUlxz_KlSEwbWH32JTrZlbZgDz7tg_XF7nnZK5t-E1UNEULGMCVe9D9qQPpUy9iKmxB7w2qbQW2E_n0XQYEtHglaubS38i3ji1cYQ73MYpCI6bMAzsG_oDNRLIgc4yE8O2AQnxeh7cYOXPiFbKZ7FyT6hl" />
          </div>
          <div className="absolute -bottom-6 -left-6 glass p-6 rounded-2xl shadow-xl hidden md:block">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary rounded-full text-on-primary">
                <span className="material-symbols-outlined">star</span>
              </div>
              <div>
                <p className="font-label-bold text-[14px] text-on-surface">4.9/5 Rating</p>
                <p className="text-xs text-on-surface-variant">Dari 2,000+ Pelanggan</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustBanner() {
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

function MenuCard({ item, cart, onAdd, onUpdateQuantity, onRemove, formatPrice }: any) {
  const variants = item.variants && item.variants.length > 0 ? item.variants : null;
  const [selectedVariant, setSelectedVariant] = useState(variants ? variants[0] : null);

  // Trik Cerdas: Deteksi otomatis apakah menu ini gabungan Jimbaran & Madu
  const needsFlavorSelection = item.name.toLowerCase().includes('jimbaran') && item.name.toLowerCase().includes('madu');
  const [selectedFlavor, setSelectedFlavor] = useState(needsFlavorSelection ? 'Jimbaran' : '');

  const displayPrice = selectedVariant ? formatPrice(selectedVariant.price) : formatPrice(item.price);

  // Buat ID keranjang unik gabungan dari: ID Menu + Ukuran + Rasa (Biar di keranjang nggak nyampur)
  const variantId = selectedVariant ? `-${selectedVariant.name}` : '';
  const flavorId = selectedFlavor ? `-${selectedFlavor}` : '';
  const cartItemId = `${item.id}${variantId}${flavorId}`;

  const cartItem = cart.find((i: any) => i.id === cartItemId);
  const currentQty = cartItem ? cartItem.quantity : 0;

  const handleAddInitial = () => {
    // Format nama agar rapi di keranjang (Misal: "Udang Bago Bakar - Jimbaran - Medium")
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
      <div className="aspect-[4/3] overflow-hidden relative bg-surface-container">
        <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        {item.priceDisplay.includes('Mulai') && (
          <div className="absolute top-4 right-4 bg-tertiary-fixed-dim text-on-tertiary-fixed px-3 py-1 rounded-full font-label-bold text-[10px] uppercase shadow-sm">
            Beragam Ukuran
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-grow bg-white">
        <h3 className="font-headline-lg text-[20px] text-on-surface mb-2 leading-tight">{item.name}</h3>
        <p className="text-primary font-headline-lg text-[22px] mb-4 font-bold">{displayPrice}</p>

        {item.description && <p className="text-on-surface-variant text-[14px] mb-4 flex-grow">{item.description}</p>}
        {!item.description && <div className="flex-grow mb-4"></div>}

        {/* 1. Dropdown Pilihan Ukuran */}
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
            <div className="absolute right-3 top-[28px] pointer-events-none text-on-surface-variant">
              <span className="material-symbols-outlined text-[18px]">expand_more</span>
            </div>
          </div>
        )}

        {/* 2. Pilihan Bumbu (Otomatis Muncul Kalau Nama Menu Mengandung Jimbaran/Madu) */}
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

        {/* Tombol Add / Plus Minus */}
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

function MenuGrid({ menus, cart, onAddToCart, onUpdateQuantity, onRemoveFromCart, formatPrice }: any) {
  const [activeCategory, setActiveCategory] = useState('Udang & Lobster');
  const categories = ['Udang & Lobster', 'Ikan Laut (Bakar/Goreng)', 'Kerang & Cumi', 'Ayam & Nasi', 'Sayur & Tambahan', 'Minuman'];
  const filteredMenus = menus.filter((m: any) => m.category === activeCategory);

  return (
    <section className="py-16 px-6 max-w-[1280px] mx-auto bg-surface-container-lowest" id="menu">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div>
          <span className="text-secondary font-label-bold text-[14px] uppercase tracking-widest text-secondary-container">Favorit Pelanggan</span>
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

function ImageGallery() {
  // State untuk menyimpan foto mana yang sedang diklik (diperbesar)
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Daftar foto galeri (Bisa kamu ganti link-nya dengan foto asli Seafood Barbar nanti)
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

      {/* Grid Foto */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {galleryImages.map((img) => (
          <div
            key={img.id}
            onClick={() => setSelectedImage(img.src)}
            className="group relative aspect-square overflow-hidden rounded-2xl cursor-pointer bg-surface-container shadow-sm hover:shadow-xl transition-all duration-300"
          >
            <img
              src={img.src}
              alt={img.alt}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            {/* Overlay Gelap & Icon Kaca Pembesar saat di-hover */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-[32px] drop-shadow-md">zoom_in</span>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL / LIGHTBOX (Muncul hanya jika foto diklik) */}
      {selectedImage && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" onClick={() => setSelectedImage(null)}>
          {/* Tombol Tutup */}
          <button
            className="absolute top-6 right-6 text-white hover:text-red-500 transition-colors bg-black/50 p-2 rounded-full flex items-center justify-center"
            onClick={() => setSelectedImage(null)}
          >
            <span className="material-symbols-outlined text-[32px]">close</span>
          </button>

          {/* Gambar Ukuran Penuh */}
          <img
            src={selectedImage}
            alt="Enlarged view"
            className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()} // Supaya kalau klik fotonya, modal gak tertutup
          />
        </div>
      )}
    </section>
  );
}

function Reviews() {
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
            <div className="flex text-[#FBBC04] text-[16px]">
              ★★★★★
            </div>
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
                      <span className="material-symbols-outlined text-[14px] text-[#EA4335]">stars</span>
                      Local Guide
                    </span>
                  )}
                  {review.isLocalGuide && <span className="text-gray-300">•</span>}
                  <span className="text-[12px] text-gray-500">{review.time}</span>
                </div>
              </div>
            </div>

            <div className="flex text-[#FBBC04] mb-3 text-[18px] tracking-widest">
              {"★★★★★".split("").map((star, i) => (
                <span key={i}>{star}</span>
              ))}
            </div>

            <p className="text-on-surface-variant text-[14px] leading-relaxed flex-grow italic">
              "{review.text}"
            </p>

            <div className="mt-6 flex justify-end opacity-40 group-hover:opacity-100 transition-opacity">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" /><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" /><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" /><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" /></svg>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function SocialFeed() {
  // 1. Tambahkan state penanda ini di bagian paling atas fungsi SocialFeed
  const [isMounted, setIsMounted] = useState(false);

  // 2. Gunakan useEffect untuk mengubah penanda saat web sudah masuk ke browser (Client)
  useEffect(() => {
    setIsMounted(true);
  }, []);
  return (
    <section className="py-[64px] md:py-[100px] px-6 bg-surface-container-lowest overflow-hidden" id="social">
      <div className="max-w-[1280px] mx-auto text-center mb-12">
        <span className="text-secondary font-label-bold text-[14px] uppercase tracking-widest text-secondary-container">Ikuti Keseruannya</span>
        <h2 className="font-headline-xl text-[40px] md:text-[48px] font-extrabold tracking-tight mt-2 text-on-surface">
          Seafood Barbar di Media Sosial
        </h2>
        <p className="font-body-md text-[16px] text-on-surface-variant max-w-2xl mx-auto mt-4">
          Intip keseruan di balik dapur kami, promo terbaru, dan momen barbar para pelanggan!
        </p>
      </div>

      <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* KOLOM TIKTOK */}
        <div className="bg-white rounded-3xl shadow-sm border border-outline-variant/30 overflow-hidden flex flex-col">
          <div className="p-4 bg-black text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[18px]">TikTok</span>
            </div>
            <a href="https://www.tiktok.com/@seafoodbarbar" target="_blank" rel="noreferrer" className="text-xs bg-white text-black px-4 py-1.5 rounded-full font-bold hover:bg-gray-200 transition">
              Follow Us
            </a>
          </div>
          <div className="p-6 flex-grow flex items-center justify-center bg-gray-50">
            {/* TEMPAT EMBED TIKTOK */}
            {/* Ganti URL blockquote di bawah dengan URL Embed dari video TikTok-mu */}
            <blockquote className="tiktok-embed" cite="https://www.tiktok.com/@seafoodbarbarsolo/video/7541363556218932486" data-video-id="7541363556218932486" > <section> <a target="_blank" title="@seafoodbarbarsolo" href="https://www.tiktok.com/@seafoodbarbarsolo?refer=embed">@seafoodbarbarsolo</a> Haloo Barbarian Yuuk cobain makan di WARUNG SEAFOOD BARBAR. Seafood nyaa fresh, bumbuu bedaa dari yang lain Harganyaa kaki lima Alamat : Warung Seafood Barbar, Komplek Kuliner Alun-alun Utara Solo Jam Buka : 17.00 -23.15 (Last Order) Whatsapp : 081329813838 100%  HALAL <a title="fyp" target="_blank" href="https://www.tiktok.com/tag/fyp?refer=embed">#fyp</a> <a title="solo" target="_blank" href="https://www.tiktok.com/tag/solo?refer=embed">#Solo</a> <a title="rekomendasimakanan" target="_blank" href="https://www.tiktok.com/tag/rekomendasimakanan?refer=embed">#rekomendasimakanan</a> <a title="seafood" target="_blank" href="https://www.tiktok.com/tag/seafood?refer=embed">#seafood</a> <a target="_blank" title="♬ original sound  - Warung Seafood Barbar" href="https://www.tiktok.com/music/original-sound-Warung-Seafood-Barbar-7541363906531396408?refer=embed">♬ original sound  - Warung Seafood Barbar</a> </section> </blockquote> <script async src="https://www.tiktok.com/embed.js"></script>
          </div>
        </div>

        {/* KOLOM INSTAGRAM */}
        <div className="bg-white rounded-3xl shadow-sm border border-outline-variant/30 overflow-hidden flex flex-col">
          <div className="p-4 bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[18px]">Instagram</span>
            </div>
            <a href="https://www.instagram.com/seafoodbarbar" target="_blank" rel="noreferrer" className="text-xs bg-white text-black px-4 py-1.5 rounded-full font-bold hover:bg-gray-200 transition">
              Follow Us
            </a>
          </div>
          <div className="p-6 flex-grow flex items-center justify-center bg-gray-50">

            {/* --- INI KODE EMBED IG VERSI REACT (JALUR IFRAME) --- */}
            <iframe
              src="https://www.instagram.com/reel/DX55diQzlBT/embed"
              width="100%"
              height="500"
              frameBorder="0"
              scrolling="no"
              className="w-full max-w-[325px] rounded-2xl shadow-lg border bg-white"
            ></iframe>
            {/* ---------------------------------------------------- */}

          </div>
        </div>

      </div>

      {/* SCRIPT WAJIB UNTUK TIKTOK EMBED */}
      <script async src="https://www.tiktok.com/embed.js"></script>
    </section>
  );
}

function Location() {
  return (
    <section className="py-[64px] md:py-[120px] px-6 bg-secondary-fixed/30 relative overflow-hidden" id="lokasi">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-primary-container/5 -skew-x-12 transform origin-top"></div>
      <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row items-center gap-16 relative z-10">
        <div className="w-full md:w-1/2 flex flex-col gap-8">
          <div>
            <span className="text-primary font-label-bold text-[14px] uppercase tracking-widest">Kunjungi Warung Kami</span>
            <h2 className="font-headline-xl text-[48px] font-extrabold tracking-tight mt-2 text-on-surface">Suasana Nyaman, Lokasi Strategis</h2>
          </div>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white rounded-2xl shadow-sm text-primary">
                <span className="material-symbols-outlined">location_on</span>
              </div>
              <div>
                <h4 className="font-label-bold text-[14px] text-on-surface">Alamat Utama</h4>
                <p className="font-body-md text-[16px] text-on-surface-variant"> Jl. Alun Alun Utara, Kedung Lumbu, Kec. Ps. Kliwon, Kota Surakarta, Jawa Tengah 57133. Kawasan Wisata Kuliner Alun-Alun Utara Solo, Surakarta</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white rounded-2xl shadow-sm text-primary">
                <span className="material-symbols-outlined">schedule</span>
              </div>
              <div>
                <h4 className="font-label-bold text-[14px] text-on-surface">Jam Operasional</h4>
                <p className="font-body-md text-[16px] text-on-surface-variant">Setiap Hari: 17:00 — 23:15 WIB</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white rounded-2xl shadow-sm text-primary">
                <span className="material-symbols-outlined">call</span>
              </div>
              <div>
                <h4 className="font-label-bold text-[14px] text-on-surface">Hubungi Kami</h4>
                <p className="font-body-md text-[16px] text-on-surface-variant">+62 812-2517-2528</p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2 rounded-3xl overflow-hidden shadow-2xl h-[400px] border-8 border-white bg-gray-200 relative">
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

function Footer() {
  return (
    <footer className="bg-inverse-surface text-on-primary-fixed-variant w-full py-[64px] md:py-[120px]">
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
            <a className="text-[#8e8d8d] hover:text-primary-fixed transition-colors flex items-center gap-2" href="#">
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

function CartDrawer({
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
  return (
    <div className={`fixed inset-0 z-[60] flex justify-end transition-all duration-300 ${isOpen ? 'visible' : 'invisible'}`}>
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
                        <button onClick={() => updateQuantity(item.id, 1)} className="w-6 h-6 rounded border border-outline text-primary border-primary flex items-center justify-center hover:bg-primary/5 transition-colors">+</button>
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