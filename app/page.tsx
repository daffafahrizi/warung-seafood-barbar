"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useState, useMemo } from 'react';
import { useEffect } from 'react';

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

// --- DATA ---
const menuItems: any[] = [
  // Udang & Lobster
  { id: 'u1', name: 'Udang Galah Bakar/Mentega', price: 45000, priceDisplay: 'Mulai Rp 45.000', category: 'Udang & Lobster', description: 'Ukuran Medium - Super. Daging tebal, gurih manis alami.', image: 'https://images.unsplash.com/photo-1625944531405-3c1340237719?w=500&q=80' },
  { id: 'u2', name: 'Lobster Bakar Jimbaran/Madu', price: 59000, priceDisplay: 'Mulai Rp 59.000', category: 'Udang & Lobster', description: 'Mewah dan bikin ngiler.', image: 'https://images.unsplash.com/photo-1544250346-6085a62f8547?w=500&q=80' },
  { id: 'u3', name: 'Udang Bago Bakar', price: 37000, priceDisplay: 'Mulai Rp 37.000', category: 'Udang & Lobster', description: 'Ukuran segar pilihan.', image: 'https://images.unsplash.com/photo-1565688534245-05d6b5be184a?w=500&q=80' },
  { id: 'u4', name: 'Udang Paname Bakar', price: 29000, priceDisplay: 'Rp 29.000 / 3 Pcs', category: 'Udang & Lobster', description: 'Favorit keluarga.', image: 'https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?w=500&q=80' },
  { id: 'u5', name: 'Udang Mayonaise', price: 23000, priceDisplay: 'Rp 23.000', category: 'Udang & Lobster', description: 'Gurih creamy.', image: 'https://images.unsplash.com/photo-1563223030-c3d52d3a3d53?w=500&q=80' },

  // Ikan Laut
  { id: 'i1', name: 'Barakuda', price: 17000, priceDisplay: 'Mulai Rp 17.000', category: 'Ikan Laut (Bakar/Goreng)', description: 'Ukuran S hingga Super.', image: 'https://images.unsplash.com/photo-1512152646272-91307b275685?w=500&q=80' },
  { id: 'i2', name: 'Kakap Laut', price: 27000, priceDisplay: 'Mulai Rp 27.000', category: 'Ikan Laut (Bakar/Goreng)', description: 'Fresh kakap pilihan.', image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500&q=80' },
  { id: 'i3', name: 'Bawal Laut', price: 39000, priceDisplay: 'Mulai Rp 39.000', category: 'Ikan Laut (Bakar/Goreng)', description: 'Daging lembut.', image: 'https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?w=500&q=80' },
  { id: 'i4', name: 'Kerapu', price: 43000, priceDisplay: 'Mulai Rp 43.000', category: 'Ikan Laut (Bakar/Goreng)', description: 'Daging putih tebal.', image: 'https://images.unsplash.com/photo-1524230505093-64472061993f?w=500&q=80' },
  { id: 'i5', name: 'Baronang', price: 40000, priceDisplay: 'Mulai Rp 40.000', category: 'Ikan Laut (Bakar/Goreng)', image: 'https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?w=500&q=80' },
  { id: 'i6', name: 'Ekor Kuning', price: 40000, priceDisplay: 'Mulai Rp 40.000', category: 'Ikan Laut (Bakar/Goreng)', image: 'https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?w=500&q=80' },
  { id: 'i7', name: 'Senangin', price: 37000, priceDisplay: 'Mulai Rp 37.000', category: 'Ikan Laut (Bakar/Goreng)', image: 'https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?w=500&q=80' },
  { id: 'i8', name: 'Gurame', price: 35000, priceDisplay: 'Mulai Rp 35.000', category: 'Ikan Laut (Bakar/Goreng)', image: 'https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?w=500&q=80' },
  { id: 'i9', name: 'Nila', price: 17000, priceDisplay: 'Mulai Rp 17.000', category: 'Ikan Laut (Bakar/Goreng)', image: 'https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?w=500&q=80' },

  // Kerang & Cumi
  { id: 'kc1', name: 'Kerang Scallop Bakar', price: 28000, priceDisplay: 'Rp 28.000 / 7 Pcs', category: 'Kerang & Cumi', image: 'https://images.unsplash.com/photo-1565688534245-05d6b5be184a?w=500&q=80' },
  { id: 'kc2', name: 'Cumi Bakar Jimbaran', price: 29000, priceDisplay: 'Rp 29.000 / 1 Besar + 3 Kecil', category: 'Kerang & Cumi', image: 'https://images.unsplash.com/photo-1565688534245-05d6b5be184a?w=500&q=80' },
  { id: 'kc3', name: 'Cumi Goreng Tepung', price: 17000, priceDisplay: 'Rp 17.000', category: 'Kerang & Cumi', image: 'https://images.unsplash.com/photo-1565688534245-05d6b5be184a?w=500&q=80' },
  { id: 'kc4', name: 'Kerang Hijau/Dara Bakar', price: 18000, priceDisplay: 'Mulai Rp 18.000', category: 'Kerang & Cumi', image: 'https://images.unsplash.com/photo-1565688534245-05d6b5be184a?w=500&q=80' },
  { id: 'kc5', name: 'Kerang Asam Manis', price: 16000, priceDisplay: 'Mulai Rp 16.000', category: 'Kerang & Cumi', image: 'https://images.unsplash.com/photo-1565688534245-05d6b5be184a?w=500&q=80' },

  // Ayam & Nasi
  { id: 'an1', name: 'Ayam Goreng Rempah', price: 15000, priceDisplay: 'Rp 15.000 / Paha Atas', category: 'Ayam & Nasi', image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=500&q=80' },
  { id: 'an2', name: 'Nasi Goreng Seafood', price: 29000, priceDisplay: 'Rp 29.000', category: 'Ayam & Nasi', image: 'https://images.unsplash.com/photo-1582233535974-984422e11892?w=500&q=80' },

  // Sayur & Tambahan
  { id: 's1', name: 'Nasi Putih', price: 5000, priceDisplay: 'Rp 5.000', category: 'Sayur & Tambahan', image: 'https://images.unsplash.com/photo-1616850280455-d3e914efaa67?w=500&q=80' },
  { id: 's2', name: 'Cah Kangkung / Toge', price: 7000, priceDisplay: 'Rp 7.000', category: 'Sayur & Tambahan', image: 'https://images.unsplash.com/photo-1548943487-a2e4e46b4840?w=500&q=80' },
  { id: 's3', name: 'Tahu/Tempe Goreng', price: 5000, priceDisplay: 'Rp 5.000', category: 'Sayur & Tambahan', image: 'https://images.unsplash.com/photo-1625943419058-299f24bea28b?w=500&q=80' },
  { id: 's4', name: 'Tahu/Tempe Bakar', price: 7000, priceDisplay: 'Rp 7.000', category: 'Sayur & Tambahan', image: 'https://images.unsplash.com/photo-1599889417937-23dd132d0d0f?w=500&q=80' },
  { id: 's5', name: 'Extra Sambal', price: 4000, priceDisplay: 'Mulai Rp 3.000', category: 'Sayur & Tambahan', image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=500&q=80' },
  { id: 's6', name: 'Kerupuk/Peyek/Emping', price: 4000, priceDisplay: 'Mulai Rp 4.000', category: 'Sayur & Tambahan', image: 'https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?w=500&q=80' },

  // Minuman
  { id: 'd1', name: 'Es Teh / Teh Panas', price: 4000, priceDisplay: 'Rp 4.000', category: 'Minuman', image: 'https://images.unsplash.com/photo-1499638673689-79a0b5115d87?w=500&q=80' },
  { id: 'd2', name: 'Es Teh Krampul', price: 5000, priceDisplay: 'Rp 5.000', category: 'Minuman', image: 'https://images.unsplash.com/photo-1499638673689-79a0b5115d87?w=500&q=80' },
  { id: 'd3', name: 'Es Jeruk', price: 6000, priceDisplay: 'Rp 6.000', category: 'Minuman', image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=500&q=80' },
  { id: 'd4', name: 'Es Infuse Water', price: 7000, priceDisplay: 'Rp 7.000 / Free Refill', category: 'Minuman', image: 'https://images.unsplash.com/photo-1523363060599-4d6428c94628?w=500&q=80' },
  { id: 'd5', name: 'Air Mineral/Air Es', price: 5000, priceDisplay: 'Mulai Rp 2.000', category: 'Minuman', image: 'https://images.unsplash.com/photo-1523363060599-4d6428c94628?w=500&q=80' },
];

export default function Page() {
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);

  // Form state
  const [orderType, setOrderType] = useState('dine_in');
  const [customerName, setCustomerName] = useState('');
  const [guestCount, setGuestCount] = useState(1);
  const [arrivalTime, setArrivalTime] = useState('');
  const [notes, setNotes] = useState('');

  const cartTotalAmount = useMemo(() => cart.reduce((acc, item) => acc + (item.price * item.quantity), 0), [cart]);
  const cartTotalItems = useMemo(() => cart.reduce((acc, item) => acc + item.quantity, 0), [cart]);

  const toggleCart = () => setCartOpen(!cartOpen);

  const addToCart = (item: any) => {
    setCart((prev) => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, title: item.name, quantity: 1 }];
    });
    // setCartOpen(true);
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
    text += `- Tipe Pesanan: ${orderType === 'dine_in' ? 'Makan di Sini' : 'Bungkus'}\n`;
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
    window.open(`https://wa.me/6281329813838?text=${encodedText}`, '_blank');
  };

  return (
    <>
      <Navbar cartItemsCount={cartTotalItems} onCartClick={toggleCart} />

      <main>
        <Hero />
        <TrustBanner />
        
        {/* Update Props MenuGrid ini */}
        <MenuGrid 
          menus={menuItems} 
          cart={cart}
          onAddToCart={addToCart} 
          onUpdateQuantity={updateQuantity}
          onRemoveFromCart={removeFromCart}
          formatPrice={formatPrice} 
        />
        
        <Reviews />
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
  // State untuk melacak menu mana yang aktif
  const [activeSection, setActiveSection] = useState('home');

  // Deteksi scroll layar untuk update garis bawah secara otomatis
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'promo', 'menu', 'lokasi'];
      let currentSection = 'home';

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          // Jika jarak elemen ke atas layar kurang dari 150px, anggap sedang aktif
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
    { id: 'lokasi', label: 'Lokasi' },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl border-b border-primary/10 shadow-sm h-20">
      <div className="max-w-[1280px] mx-auto px-6 flex justify-between items-center h-full">
        <span className="font-headline-lg text-[32px] font-extrabold text-primary tracking-tighter">SEAFOOD BARBAR</span>

        {/* Looping Nav Links dengan Active State Dinamis */}
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
            Pesanan Online
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

// --- BAGIAN YANG DIROMBAK DENGAN UI GOOGLE STITCH ---
function MenuCard({ item, cart, onAdd, onUpdateQuantity, onRemove, formatPrice }: any) {
  const hasVariants = item.priceDisplay.includes('Mulai');
  const variants = item.variants || (hasVariants ? [
    { name: 'Ukuran Sedang (M)', price: item.price },
    { name: 'Ukuran Besar (L)', price: item.price + 15000 },
    { name: 'Ukuran Super (XL)', price: item.price + 30000 },
  ] : null);

  const [selectedVariant, setSelectedVariant] = useState(variants ? variants[0] : null);
  const displayPrice = selectedVariant ? formatPrice(selectedVariant.price) : formatPrice(item.price);

  // Menentukan ID Unik berdasarkan ukuran (agar M dan L tidak tergabung)
  const cartItemId = selectedVariant ? `${item.id}-${selectedVariant.name}` : item.id;
  
  // Mencari apakah item ini sudah ada di keranjang
  const cartItem = cart.find((i: any) => i.id === cartItemId);
  const currentQty = cartItem ? cartItem.quantity : 0;

  const handleAddInitial = () => {
    const itemToAdd = {
      ...item,
      id: cartItemId,
      name: selectedVariant ? `${item.name} - ${selectedVariant.name}` : item.name,
      price: selectedVariant ? selectedVariant.price : item.price,
    };
    onAdd(itemToAdd);
  };

  const handleDecrement = () => {
    if (currentQty === 1) {
      onRemove(cartItemId);
    } else {
      onUpdateQuantity(cartItemId, -1);
    }
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
        <p className="text-primary font-headline-lg text-[22px] mb-4 font-bold">
          {displayPrice}
        </p>
        
        {item.description && <p className="text-on-surface-variant text-[14px] mb-4 flex-grow">{item.description}</p>}
        {!item.description && <div className="flex-grow mb-4"></div>}

        {variants && (
          <div className="mb-4 relative">
            <select 
              className="w-full p-3 border border-outline-variant rounded-xl text-[13px] font-label-bold text-on-surface-variant focus:border-primary focus:ring-primary focus:ring-1 outline-none appearance-none bg-surface-container-lowest transition-colors cursor-pointer"
              onChange={(e) => {
                const v = variants.find((v: any) => v.name === e.target.value);
                setSelectedVariant(v);
              }}
              value={selectedVariant?.name}
            >
              {variants.map((v: any) => (
                <option key={v.name} value={v.name}>{v.name}</option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">
              <span className="material-symbols-outlined text-[18px]">expand_more</span>
            </div>
          </div>
        )}

        {/* LOGIKA TOMBOL SHOPEEFOOD STYLE */}
        {currentQty === 0 ? (
          <button 
            onClick={handleAddInitial}
            className="w-full py-3 rounded-xl font-label-bold text-[14px] flex items-center justify-center gap-2 transition-all mt-auto bg-primary/5 text-primary hover:bg-primary hover:text-white"
          >
            Tambah <span className="material-symbols-outlined text-[18px]">add</span>
          </button>
        ) : (
          <div className="w-full mt-auto flex items-center justify-between bg-primary/5 rounded-xl p-1 border border-primary/20">
            <button 
              onClick={handleDecrement} 
              className="w-10 h-10 flex items-center justify-center rounded-lg text-primary hover:bg-primary/10 transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">{currentQty === 1 ? 'delete' : 'remove'}</span>
            </button>
            <span className="font-bold text-[16px] text-primary">{currentQty}</span>
            <button 
              onClick={() => onUpdateQuantity(cartItemId, 1)} 
              className="w-10 h-10 flex items-center justify-center rounded-lg text-white bg-primary hover:bg-primary-fixed-variant transition-colors shadow-sm"
            >
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
            className={`px-6 py-2 rounded-full font-label-bold text-[14px] transition-all duration-300 border ${
              activeCategory === cat 
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
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/></svg>
            </div>
          </div>
        ))}
      </div>
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
                <p className="font-body-md text-[16px] text-on-surface-variant">+62 813-2981-3838</p>
              </div>
            </div>
          </div>
          <a 
            href="https://maps.app.goo.gl/rvCrVxicN1ieBvPf8" // Kamu bisa ganti dengan link "Share" pendek dari Google Maps-mu
            target="_blank" 
            rel="noreferrer"
            className="bg-primary text-on-primary font-label-bold text-[14px] px-10 py-5 rounded-2xl hover:bg-secondary-container transition-all w-fit shadow-xl flex items-center gap-2"
          >
            Buka Aplikasi Maps <span className="material-symbols-outlined text-[18px]">open_in_new</span>
          </a>
        </div>
        
        {/* --- BAGIAN EMBED GOOGLE MAPS ASLI --- */}
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

// --- CART DRAWER COMPONENT ---

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
                  <span className="text-body-md text-[14px] font-medium">Makan di Tempat</span>
                </label>
                <label className={`flex items-center justify-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${orderType === 'takeaway' ? 'border-primary bg-primary/5 text-primary' : 'border-outline-variant bg-surface-container-low hover:bg-surface-container-high'}`}>
                  <input type="radio" name="order_type" value="takeaway" checked={orderType === 'takeaway'} onChange={() => setOrderType('takeaway')} className="hidden" />
                  <span className="text-body-md text-[14px] font-medium">Bungkus</span>
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