"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import imageCompression from 'browser-image-compression';

export default function AdminDashboard() {
    const [session, setSession] = useState<any>(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loggingIn, setLoggingIn] = useState(false);
    const [authChecking, setAuthChecking] = useState(true);

    const [menus, setMenus] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // State Pengumuman
    const [announcementText, setAnnouncementText] = useState('');
    const [isAnnouncementActive, setIsAnnouncementActive] = useState(false);
    const [savingAnnouncement, setSavingAnnouncement] = useState(false);

    // Form States Menu
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState<string | null>(null);
    const [menuId, setMenuId] = useState('');
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [priceDisplay, setPriceDisplay] = useState('');
    const [category, setCategory] = useState('Udang & Lobster');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [variants, setVariants] = useState<{ name: string, price: number }[]>([]);

    const categories = ['Udang & Lobster', 'Ikan Laut (Bakar/Goreng)', 'Kerang & Cumi', 'Ayam & Nasi', 'Sayur & Tambahan', 'Minuman'];

    // State Galeri
    const [galleries, setGalleries] = useState<any[]>([]);
    const [galleryAlt, setGalleryAlt] = useState('');
    const [galleryFile, setGalleryFile] = useState<File | null>(null);
    const [uploadingGallery, setUploadingGallery] = useState(false);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session); setAuthChecking(false);
        });
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoggingIn(true);
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            alert('Gagal Login: Email/Password salah!');
        } else if (data.session) {
            window.location.reload();
        }
        setLoggingIn(false);
    };

    const handleLogout = async () => { await supabase.auth.signOut(); window.location.reload(); };

    const fetchData = async () => {
        setLoading(true);
        const { data: settings } = await supabase.from('store_settings').select('*').eq('id', 'main').single();
        if (settings) {
            setAnnouncementText(settings.announcement_text || '');
            setIsAnnouncementActive(settings.is_active || false);
        }
        const { data } = await supabase.from('menus').select('*').order('category', { ascending: true }).order('name', { ascending: true });
        if (data) setMenus(data);
        setLoading(false);

        const { data: galleryData } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
        if (galleryData) setGalleries(galleryData);
    };

    useEffect(() => { if (session) fetchData(); }, [session]);

    const handleSaveAnnouncement = async () => {
        setSavingAnnouncement(true);
        const { error } = await supabase.from('store_settings').update({
            announcement_text: announcementText,
            is_active: isAnnouncementActive
        }).eq('id', 'main');
        if (error) alert('Gagal menyimpan pengumuman! ' + error.message);
        else alert('✅ Pengumuman berhasil di-update!');
        setSavingAnnouncement(false);
    };

    const resetForm = () => { setIsEditing(false); setCurrentId(null); setMenuId(''); setName(''); setPrice(0); setPriceDisplay(''); setCategory('Udang & Lobster'); setDescription(''); setImage(''); setImageFile(null); setVariants([]); };

    const handleEditSetup = (item: any) => { setIsEditing(true); setCurrentId(item.id); setMenuId(item.menu_id); setName(item.name); setPrice(item.price); setPriceDisplay(item.price_display); setCategory(item.category); setDescription(item.description || ''); setImage(item.image); setImageFile(null); setVariants(item.variants || []); window.scrollTo({ top: 0, behavior: 'smooth' }); };

    const handleAddVariant = () => setVariants([...variants, { name: '', price: 0 }]);
    const handleRemoveVariant = (index: number) => setVariants(variants.filter((_, i) => i !== index));
    const handleVariantChange = (index: number, field: 'name' | 'price', value: any) => { const newVariants = [...variants]; newVariants[index] = { ...newVariants[index], [field]: value }; setVariants(newVariants); };

    const uploadImage = async (file: File) => {
        // 1. Definisikan aturan kompresi (Maks 200KB)
        const options = {
            maxSizeMB: 0.2,            // Maksimal 200KB
            maxWidthOrHeight: 1200,    // Resize resolusi agar tidak terlalu raksasa
            useWebWorker: true,
        };

        try {
            // 2. Kompresi otomatis di HP/Laptop sebelum dikirim ke Supabase
            const compressedFile = await imageCompression(file, options);

            // 3. Lanjut upload file yang sudah kecil ke Supabase
            const fileExt = compressedFile.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `menus/${fileName}`;

            const { error } = await supabase.storage
                .from('menu-images')
                .upload(filePath, compressedFile);

            if (error) throw error;

            const { data } = supabase.storage.from('menu-images').getPublicUrl(filePath);
            return data.publicUrl;

        } catch (err) {
            console.error("Gagal kompres/upload:", err);
            throw err;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validasi dasar
        if (!menuId || !name || !price || !priceDisplay || (!image && !imageFile)) {
            return alert('Mohon isi semua kolom wajib!');
        }

        setSubmitting(true);

        try {
            // Jika ada imageFile baru, upload & ambil URL baru. 
            // Kalau tidak, gunakan URL lama yang tersimpan di state 'image'.
            let finalImageUrl = image;
            if (imageFile) {
                finalImageUrl = await uploadImage(imageFile);
            }

            const payload = {
                menu_id: menuId,
                name,
                price: Number(price),
                price_display: priceDisplay,
                category,
                description: description || null,
                image: finalImageUrl,
                variants: variants.length > 0 ? variants : null
            };

            if (isEditing && currentId) {
                // Update
                const { error } = await supabase.from('menus').update(payload).eq('id', currentId);
                if (error) throw error;
                alert('✅ Menu berhasil diperbarui!');
            } else {
                // Insert Baru
                const { error } = await supabase.from('menus').insert([payload]);
                if (error) throw error;
                alert('✅ Menu baru berhasil ditambahkan!');
            }

            resetForm();
            fetchData();

        } catch (err: any) {
            console.error(err);
            alert('❌ Gagal: ' + err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string, menuName: string) => {
        if (!confirm(`Hapus "${menuName}"?`)) return;
        const { error } = await supabase.from('menus').delete().eq('id', id);
        if (!error) { alert('Terhapus!'); fetchData(); }
    };

    const handleUploadGallery = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!galleryFile) return alert('Pilih foto dulu!');
        setUploadingGallery(true);
        try {
            const imageUrl = await uploadImage(galleryFile);
            const { error } = await supabase.from('gallery').insert([{ image: imageUrl, alt_text: galleryAlt || 'Galeri Seafood Barbar' }]);
            if (error) throw error;
            alert('Foto galeri berhasil ditambahkan!');
            setGalleryFile(null);
            setGalleryAlt('');
            fetchData();
        } catch (err: any) { alert('Gagal upload: ' + err.message); }
        finally { setUploadingGallery(false); }
    };

    const handleDeleteGallery = async (id: string) => {
        if (!confirm('Hapus foto ini dari galeri?')) return;
        const { error } = await supabase.from('gallery').delete().eq('id', id);
        if (!error) { alert('Terhapus!'); fetchData(); }
    };

    if (authChecking) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><p className="font-bold text-gray-500 animate-pulse">Memeriksa akses...</p></div>;

    if (!session) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 md:px-6">
                <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border p-6 md:p-8">
                    <div className="text-center mb-8"><h1 className="text-2xl font-extrabold text-gray-900">Admin Login</h1></div>
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div><label className="block text-xs font-bold uppercase text-gray-600 mb-2">Email</label><input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border p-3 bg-gray-50" /></div>
                        <div><label className="block text-xs font-bold uppercase text-gray-600 mb-2">Password</label><input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-xl border p-3 bg-gray-50" /></div>
                        <button type="submit" disabled={loggingIn} className="w-full py-3 bg-red-700 text-white rounded-xl font-bold">{loggingIn ? 'Memeriksa...' : 'Masuk Dashboard'}</button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 md:py-12 px-4 md:px-6">
            <div className="max-w-6xl mx-auto space-y-8 md:space-y-12">

                {/* Header (Responsive) */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4 md:pb-6 gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">Dashboard Admin</h1>
                        <p className="text-sm md:text-base text-gray-500">Kelola Menu & Pengumuman</p>
                    </div>
                    <button onClick={handleLogout} className="w-full sm:w-auto px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-bold rounded-lg transition-colors">
                        Logout
                    </button>
                </div>

                {/* --- SEKSI PENGUMUMAN --- */}
                <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
                    <div className="bg-red-50 p-4 md:p-6 border-b border-red-100 flex flex-col md:flex-row items-start gap-4">
                        <div className="hidden md:block">
                            <span className="material-symbols-outlined text-red-600 text-3xl">campaign</span>
                        </div>
                        <div className="flex-1 w-full">
                            <div className="flex items-center gap-2 md:block">
                                <span className="material-symbols-outlined text-red-600 text-2xl md:hidden">campaign</span>
                                <h2 className="text-lg md:text-xl font-bold text-red-900">Papan Pengumuman</h2>
                            </div>
                            <p className="text-red-700 text-xs md:text-sm mt-1">Tulis pesan jika ada menu yang habis agar pelanggan tidak memesannya.</p>

                            <div className="mt-4">
                                <textarea
                                    value={announcementText}
                                    onChange={(e) => setAnnouncementText(e.target.value)}
                                    placeholder="Contoh: Hari ini tgl 15, Udang Galah dan Cumi KOSONG ya..."
                                    className="w-full h-24 rounded-xl border border-red-200 p-3 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-sm md:text-base"
                                />
                            </div>

                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-4 gap-4">
                                <label className="relative inline-flex items-center cursor-pointer w-full sm:w-auto">
                                    <input type="checkbox" className="sr-only peer" checked={isAnnouncementActive} onChange={(e) => setIsAnnouncementActive(e.target.checked)} />
                                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                                    <span className="ml-3 text-xs md:text-sm font-bold text-gray-700">{isAnnouncementActive ? '🟢 Ditayangkan' : '⚪ Disembunyikan'}</span>
                                </label>

                                <button onClick={handleSaveAnnouncement} disabled={savingAnnouncement} className="w-full sm:w-auto px-6 py-3 md:py-2 bg-red-700 hover:bg-red-800 text-white font-bold rounded-xl md:rounded-lg text-sm transition">
                                    {savingAnnouncement ? 'Menyimpan...' : 'Simpan Pengumuman'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Tambah Menu */}
                <div className="bg-white rounded-2xl shadow-sm border p-4 md:p-8">
                    <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-6">{isEditing ? '📝 Edit Menu' : '✨ Tambah Menu Baru'}</h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <div><label className="block text-xs font-bold uppercase text-gray-600 mb-2">ID Manual</label><input type="text" value={menuId} onChange={e => setMenuId(e.target.value)} className="w-full rounded-xl border p-3 bg-gray-50 text-sm md:text-base" /></div>
                        <div><label className="block text-xs font-bold uppercase text-gray-600 mb-2">Nama Menu</label><input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full rounded-xl border p-3 bg-gray-50 text-sm md:text-base" /></div>
                        <div><label className="block text-xs font-bold uppercase text-gray-600 mb-2">Harga Utama</label><input type="number" value={price || ''} onChange={e => setPrice(Number(e.target.value))} className="w-full rounded-xl border p-3 bg-gray-50 text-sm md:text-base" /></div>
                        <div><label className="block text-xs font-bold uppercase text-gray-600 mb-2">Teks Tampilan Harga</label><input type="text" value={priceDisplay} onChange={e => setPriceDisplay(e.target.value)} className="w-full rounded-xl border p-3 bg-gray-50 text-sm md:text-base" /></div>
                        <div><label className="block text-xs font-bold uppercase text-gray-600 mb-2">Kategori</label><select value={category} onChange={e => setCategory(e.target.value)} className="w-full rounded-xl border p-3 bg-gray-50 text-sm md:text-base">{categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}</select></div>

                        <div className="flex flex-col gap-2">
                            <label className="block text-xs font-bold uppercase text-gray-600">
                                Foto Menu {isEditing && !imageFile && <span className="text-gray-500 font-normal">(Biarkan kosong untuk tetap pakai foto lama)</span>}
                            </label>
                            <div className="flex items-center gap-4">
                                {(image || imageFile) && (
                                    <img src={imageFile ? URL.createObjectURL(imageFile) : image} alt="Preview" className="w-12 h-12 md:w-14 md:h-14 object-cover rounded-lg flex-shrink-0" />
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={e => {
                                        if (e.target.files && e.target.files.length > 0) {
                                            const file = e.target.files[0];
                                            // if (file.size > 2 * 1024 * 1024) {
                                            //     alert('⚠️ Ukuran foto terlalu besar! Maksimal 2MB ya.');
                                            //     e.target.value = '';
                                            //     return;
                                            // }
                                            setImageFile(file);
                                        }
                                    }}
                                    className="w-full text-xs md:text-sm text-gray-500 file:mr-2 md:file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs md:file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 cursor-pointer"
                                />
                            </div>
                        </div>

                        {/* Varian (Responsive) */}
                        <div className="md:col-span-2 bg-gray-50 p-4 md:p-6 rounded-xl border mt-2">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                                <div><h3 className="font-bold text-sm md:text-base text-gray-800">Varian Ukuran / Porsi (Opsional)</h3></div>
                                <button type="button" onClick={handleAddVariant} className="w-full sm:w-auto px-4 py-2.5 sm:py-2 bg-white border rounded-lg text-sm font-bold text-gray-700 shadow-sm">Tambah Ukuran</button>
                            </div>
                            {variants.map((variant, index) => (
                                <div key={index} className="flex flex-col sm:flex-row gap-3 sm:items-end bg-white p-4 rounded-lg border shadow-sm mb-3">
                                    <div className="flex-1 w-full"><label className="block text-xs font-bold uppercase mb-1">Nama Ukuran</label><input type="text" value={variant.name} onChange={(e) => handleVariantChange(index, 'name', e.target.value)} className="w-full rounded-lg border p-2 text-sm" placeholder="Misal: Porsi Kecil" /></div>
                                    <div className="flex-1 w-full"><label className="block text-xs font-bold uppercase mb-1">Harga</label><input type="number" value={variant.price || ''} onChange={(e) => handleVariantChange(index, 'price', Number(e.target.value))} className="w-full rounded-lg border p-2 text-sm" placeholder="Misal: 35000" /></div>
                                    <button type="button" onClick={() => handleRemoveVariant(index)} className="w-full sm:w-auto p-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-bold text-sm sm:text-base flex justify-center items-center gap-1 transition-colors">
                                        <span className="material-symbols-outlined text-[18px] sm:hidden">delete</span> Hapus
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="md:col-span-2"><label className="block text-xs font-bold uppercase text-gray-600 mb-2">Deskripsi Makanan (Opsional)</label><textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full h-24 rounded-xl border p-3 bg-gray-50 text-sm md:text-base" /></div>

                        <div className="md:col-span-2 flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
                            {isEditing && <button type="button" onClick={resetForm} className="w-full sm:w-auto px-6 py-3.5 sm:py-3 border rounded-xl font-bold text-gray-600 bg-white">Batal Edit</button>}
                            <button type="submit" disabled={submitting} className="w-full sm:w-auto px-8 py-3.5 sm:py-3 bg-red-700 hover:bg-red-800 text-white rounded-xl font-bold transition-colors">{submitting ? 'Menyimpan...' : 'Simpan Menu'}</button>
                        </div>
                    </form>
                </div>

                {/* --- SEKSI DAFTAR MENU (UI PROFESIONAL) --- */}
                <div className="bg-white rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden mt-8 md:mt-12">
                    <div className="px-4 md:px-6 py-4 md:py-5 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h2 className="text-base md:text-[18px] font-extrabold text-gray-800 flex items-center gap-2">
                                <span className="material-symbols-outlined text-red-600 text-[20px] md:text-[24px]">restaurant_menu</span>
                                Daftar Menu Aktif
                            </h2>
                            <p className="text-[12px] md:text-[13px] text-gray-500 mt-1">Kelola harga, ketersediaan, dan detail menu warung.</p>
                        </div>
                        <span className="bg-red-50 border border-red-100 text-red-700 text-[11px] md:text-[12px] font-bold px-3 md:px-4 py-1.5 rounded-full flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">fastfood</span>
                            {menus.length} Menu
                        </span>
                    </div>

                    {/* Area Tabel (Dengan forced horizontal scroll) */}
                    <div className="overflow-x-auto">
                        {menus.length === 0 ? (
                            <div className="text-center py-12 md:py-16 bg-white">
                                <span className="material-symbols-outlined text-gray-300 text-[48px] md:text-[64px] mb-4">no_meals</span>
                                <h3 className="text-base md:text-[18px] font-bold text-gray-700">Belum Ada Menu</h3>
                                <p className="text-[12px] md:text-[14px] text-gray-500 mt-1">Tambahkan menu pertamamu melalui form di atas.</p>
                            </div>
                        ) : (
                            <table className="w-full text-left border-collapse min-w-[650px]">
                                <thead>
                                    <tr className="bg-white border-b border-gray-100 text-[11px] md:text-[12px] uppercase tracking-wider text-gray-400 font-extrabold">
                                        <th className="px-4 md:px-6 py-4 rounded-tl-lg">Info Menu</th>
                                        <th className="px-4 md:px-6 py-4">Kategori</th>
                                        <th className="px-4 md:px-6 py-4">Harga Label</th>
                                        <th className="px-4 md:px-6 py-4 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {menus.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50/80 transition-colors group">
                                            <td className="px-4 md:px-6 py-4">
                                                <div className="flex items-center gap-3 md:gap-4">
                                                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
                                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[13px] md:text-[14px] font-bold text-gray-800 line-clamp-1">{item.name}</p>
                                                        {item.variants && item.variants.length > 0 && (
                                                            <p className="text-[10px] md:text-[11px] text-gray-400 font-medium mt-0.5 flex items-center gap-1">
                                                                <span className="material-symbols-outlined text-[12px]">style</span>
                                                                {item.variants.length} Ukuran
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 md:px-6 py-4">
                                                <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] md:text-[11px] font-bold bg-gray-100 text-gray-600 border border-gray-200 whitespace-nowrap">
                                                    {item.category}
                                                </span>
                                            </td>
                                            <td className="px-4 md:px-6 py-4">
                                                <p className="text-[13px] md:text-[14px] font-bold text-gray-800 whitespace-nowrap">{item.price_display}</p>
                                                <p className="text-[11px] md:text-[12px] text-gray-400 whitespace-nowrap">Rp {item.price.toLocaleString('id-ID')}</p>
                                            </td>
                                            <td className="px-4 md:px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button onClick={() => handleEditSetup(item)} className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors border border-blue-100">
                                                        <span className="material-symbols-outlined text-[16px]">edit</span>
                                                    </button>
                                                    <button onClick={() => handleDelete(item.id, item.name)} className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors border border-red-100">
                                                        <span className="material-symbols-outlined text-[16px]">delete</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* --- SEKSI KELOLA GALERI (UI PROFESIONAL) --- */}
                <div className="bg-white rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden mt-8 md:mt-12">
                    <div className="px-4 md:px-6 py-4 md:py-5 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h2 className="text-base md:text-[18px] font-extrabold text-gray-800 flex items-center gap-2">
                                <span className="material-symbols-outlined text-red-600 text-[20px] md:text-[24px]">photo_library</span>
                                Kelola Galeri Website
                            </h2>
                            <p className="text-[12px] md:text-[13px] text-gray-500 mt-1">Upload dokumentasi, suasana warung, dan konten terbaru.</p>
                        </div>
                        <span className="bg-red-50 border border-red-100 text-red-700 text-[11px] md:text-[12px] font-bold px-3 md:px-4 py-1.5 rounded-full flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">imagesmode</span>
                            {galleries.length} Foto
                        </span>
                    </div>

                    <div className="p-4 md:p-8">
                        <form onSubmit={handleUploadGallery} className="mb-8 md:mb-10">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                                <div className="lg:col-span-2">
                                    <label className="block text-[12px] md:text-[13px] font-bold uppercase tracking-wider text-gray-500 mb-2">Pilih Foto Galeri</label>
                                    <div className="flex items-center justify-center w-full">
                                        <label className="flex flex-col items-center justify-center w-full h-32 md:h-40 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer bg-gray-50/50 hover:bg-red-50/30 hover:border-red-300 transition-all duration-200 group">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <span className="material-symbols-outlined text-gray-400 text-[32px] md:text-[40px] mb-2 md:mb-3 group-hover:text-red-500 transition-colors">cloud_upload</span>
                                                <p className="mb-1 text-[12px] md:text-[14px] text-gray-600 text-center px-4"><span className="font-bold text-red-600">Klik untuk upload</span> atau drag and drop</p>
                                                <p className="text-[10px] md:text-[12px] text-gray-400">PNG, JPG, JPEG (Maks. 2MB)</p>
                                            </div>
                                            <input type="file" className="hidden" accept="image/*" required onChange={e => { if (e.target.files) setGalleryFile(e.target.files[0]) }} />
                                        </label>
                                    </div>
                                    {galleryFile && (
                                        <div className="mt-3 inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-[12px] md:text-[13px] font-bold px-3 py-1.5 rounded-lg">
                                            <span className="material-symbols-outlined text-[16px]">check_circle</span>
                                            {galleryFile.name}
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col justify-between gap-4 lg:gap-0">
                                    <div>
                                        <label className="block text-[12px] md:text-[13px] font-bold uppercase tracking-wider text-gray-500 mb-2">Deskripsi Foto</label>
                                        <input
                                            type="text"
                                            value={galleryAlt}
                                            onChange={e => setGalleryAlt(e.target.value)}
                                            placeholder="Contoh: Suasana malam di warung..."
                                            className="w-full rounded-xl border border-gray-200 p-3.5 text-[13px] md:text-[14px] focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all bg-white"
                                            required
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={uploadingGallery}
                                        className={`w-full py-3.5 md:py-4 rounded-xl font-bold text-[13px] md:text-[14px] text-white transition-all duration-300 flex items-center justify-center gap-2 ${uploadingGallery ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 shadow-sm'}`}
                                    >
                                        {uploadingGallery ? (
                                            <><span className="material-symbols-outlined animate-spin text-[18px] md:text-[20px]">refresh</span> Mengupload...</>
                                        ) : (
                                            <><span className="material-symbols-outlined text-[18px] md:text-[20px]">upload</span> Upload ke Galeri</>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </form>

                        <hr className="border-gray-100 mb-6 md:mb-8" />

                        {galleries.length === 0 ? (
                            <div className="text-center py-12 md:py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                <span className="material-symbols-outlined text-gray-300 text-[48px] md:text-[64px] mb-4">hide_image</span>
                                <h3 className="text-base md:text-[18px] font-bold text-gray-700">Galeri Masih Kosong</h3>
                                <p className="text-[12px] md:text-[14px] text-gray-500 mt-1">Upload foto pertamamu melalui form di atas.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-5">
                                {galleries.map(item => (
                                    <div key={item.id} className="relative group rounded-xl md:rounded-2xl overflow-hidden border border-gray-100 shadow-sm aspect-square bg-gray-100">
                                        <img src={item.image} alt={item.alt_text} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />

                                        {/* Overlay (Bisa ditap di HP, Hover di PC) */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 md:group-hover:opacity-100 active:opacity-100 focus:opacity-100 transition-all duration-300 flex flex-col justify-end p-3 md:p-4">
                                            <p className="text-white text-[11px] md:text-[12px] font-medium line-clamp-2 mb-2 md:mb-3 drop-shadow-md">{item.alt_text}</p>
                                            <button
                                                onClick={() => handleDeleteGallery(item.id)}
                                                className="w-full bg-red-600/90 hover:bg-red-500 backdrop-blur-md text-white py-1.5 md:py-2 rounded-lg md:rounded-xl text-[11px] md:text-[12px] font-bold flex items-center justify-center gap-1.5 transition-colors border border-white/10"
                                            >
                                                <span className="material-symbols-outlined text-[14px] md:text-[16px]">delete</span> Hapus
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
} 