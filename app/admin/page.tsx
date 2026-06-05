"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';

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
            // JIKA BERHASIL: Paksa website untuk memuat ulang layar agar masuk ke Dashboard!
            window.location.reload();
        }

        setLoggingIn(false);
    };

    const handleLogout = async () => { await supabase.auth.signOut(); window.location.reload(); };

    // Ambil Menu & Pengumuman
    const fetchData = async () => {
        setLoading(true);
        // 1. Tarik Pengumuman
        const { data: settings } = await supabase.from('store_settings').select('*').eq('id', 'main').single();
        if (settings) {
            setAnnouncementText(settings.announcement_text || '');
            setIsAnnouncementActive(settings.is_active || false);
        }
        // 2. Tarik Menu
        const { data } = await supabase.from('menus').select('*').order('category', { ascending: true }).order('name', { ascending: true });
        if (data) setMenus(data);
        setLoading(false);
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

    // --- CRUD LOGIC (Versi Bersih tanpa is_available) ---
    const resetForm = () => { setIsEditing(false); setCurrentId(null); setMenuId(''); setName(''); setPrice(0); setPriceDisplay(''); setCategory('Udang & Lobster'); setDescription(''); setImage(''); setImageFile(null); setVariants([]); };

    const handleEditSetup = (item: any) => { setIsEditing(true); setCurrentId(item.id); setMenuId(item.menu_id); setName(item.name); setPrice(item.price); setPriceDisplay(item.price_display); setCategory(item.category); setDescription(item.description || ''); setImage(item.image); setImageFile(null); setVariants(item.variants || []); window.scrollTo({ top: 0, behavior: 'smooth' }); };

    const handleAddVariant = () => setVariants([...variants, { name: '', price: 0 }]);
    const handleRemoveVariant = (index: number) => setVariants(variants.filter((_, i) => i !== index));
    const handleVariantChange = (index: number, field: 'name' | 'price', value: any) => { const newVariants = [...variants]; newVariants[index] = { ...newVariants[index], [field]: value }; setVariants(newVariants); };

    const uploadImage = async (file: File) => {
        const fileExt = file.name.split('.').pop(); const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `menus/${fileName}`;
        const { error } = await supabase.storage.from('menu-images').upload(filePath, file);
        if (error) throw error;
        const { data } = supabase.storage.from('menu-images').getPublicUrl(filePath); return data.publicUrl;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!menuId || !name || !price || !priceDisplay || (!image && !imageFile)) return alert('Mohon isi semua kolom wajib!');
        setSubmitting(true);
        try {
            let finalImageUrl = image; if (imageFile) finalImageUrl = await uploadImage(imageFile);
            const payload = { menu_id: menuId, name, price: Number(price), price_display: priceDisplay, category, description: description || null, image: finalImageUrl, variants: variants.length > 0 ? variants : null };
            if (isEditing && currentId) {
                const { error } = await supabase.from('menus').update(payload).eq('id', currentId); if (error) throw error; alert('Menu berhasil diperbarui!');
            } else {
                const { error } = await supabase.from('menus').insert([payload]); if (error) throw error; alert('Menu baru berhasil ditambahkan!');
            }
            resetForm(); fetchData();
        } catch (err: any) { alert('Gagal: ' + err.message); } finally { setSubmitting(false); }
    };

    const handleDelete = async (id: string, menuName: string) => {
        if (!confirm(`Hapus "${menuName}"?`)) return;
        const { error } = await supabase.from('menus').delete().eq('id', id);
        if (!error) { alert('Terhapus!'); fetchData(); }
    };

    if (authChecking) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><p className="font-bold text-gray-500 animate-pulse">Memeriksa akses...</p></div>;

    if (!session) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6">
                <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border p-8">
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
        <div className="min-h-screen bg-gray-50 py-12 px-6">
            <div className="max-w-6xl mx-auto space-y-12">
                <div className="flex justify-between items-center border-b pb-6">
                    <div><h1 className="text-3xl font-extrabold text-gray-900">Dashboard Admin</h1><p className="text-gray-500">Kelola Menu & Pengumuman</p></div>
                    <button onClick={handleLogout} className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-bold rounded-lg">Logout</button>
                </div>

                {/* --- SEKSI PENGUMUMAN --- */}
                <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
                    <div className="bg-red-50 p-6 border-b border-red-100 flex items-start gap-4">
                        <span className="material-symbols-outlined text-red-600 text-3xl">campaign</span>
                        <div className="flex-1">
                            <h2 className="text-xl font-bold text-red-900">Papan Pengumuman Toko</h2>
                            <p className="text-red-700 text-sm mt-1">Tulis pesan jika ada menu yang habis agar pelanggan tidak memesannya.</p>

                            <div className="mt-4">
                                <textarea
                                    value={announcementText}
                                    onChange={(e) => setAnnouncementText(e.target.value)}
                                    placeholder="Contoh: Hari ini tgl 15, Udang Galah dan Cumi KOSONG ya..."
                                    className="w-full h-24 rounded-xl border border-red-200 p-3 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                                />
                            </div>

                            <div className="flex items-center justify-between mt-4">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" checked={isAnnouncementActive} onChange={(e) => setIsAnnouncementActive(e.target.checked)} />
                                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                                    <span className="ml-3 text-sm font-bold text-gray-700">{isAnnouncementActive ? '🟢 Pengumuman Ditayangkan' : '⚪ Pengumuman Disembunyikan'}</span>
                                </label>

                                <button onClick={handleSaveAnnouncement} disabled={savingAnnouncement} className="px-6 py-2 bg-red-700 hover:bg-red-800 text-white font-bold rounded-lg text-sm transition">
                                    {savingAnnouncement ? 'Menyimpan...' : 'Simpan Pengumuman'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Tambah Menu */}
                <div className="bg-white rounded-2xl shadow-sm border p-8">
                    <h2 className="text-xl font-bold text-gray-800 mb-6">{isEditing ? '📝 Edit Menu' : '✨ Tambah Menu Baru'}</h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div><label className="block text-xs font-bold uppercase text-gray-600 mb-2">ID Manual</label><input type="text" value={menuId} onChange={e => setMenuId(e.target.value)} className="w-full rounded-xl border p-3 bg-gray-50" /></div>
                        <div><label className="block text-xs font-bold uppercase text-gray-600 mb-2">Nama Menu</label><input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full rounded-xl border p-3 bg-gray-50" /></div>
                        <div><label className="block text-xs font-bold uppercase text-gray-600 mb-2">Harga Utama</label><input type="number" value={price} onChange={e => setPrice(Number(e.target.value))} className="w-full rounded-xl border p-3 bg-gray-50" /></div>
                        <div><label className="block text-xs font-bold uppercase text-gray-600 mb-2">Teks Tampilan Harga</label><input type="text" value={priceDisplay} onChange={e => setPriceDisplay(e.target.value)} className="w-full rounded-xl border p-3 bg-gray-50" /></div>
                        <div><label className="block text-xs font-bold uppercase text-gray-600 mb-2">Kategori</label><select value={category} onChange={e => setCategory(e.target.value)} className="w-full rounded-xl border p-3 bg-gray-50">{categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}</select></div>
                        <div className="flex flex-col gap-2"><label className="block text-xs font-bold uppercase text-gray-600">Foto Menu</label><div className="flex items-center gap-4">{(image || imageFile) && (<img src={imageFile ? URL.createObjectURL(imageFile) : image} alt="Preview" className="w-14 h-14 object-cover rounded-lg" />)}<input type="file" accept="image/*" onChange={e => { if (e.target.files && e.target.files.length > 0) setImageFile(e.target.files[0]); }} className="w-full text-sm text-gray-500" /></div></div>

                        {/* Varian */}
                        <div className="md:col-span-2 bg-gray-50 p-6 rounded-xl border mt-4">
                            <div className="flex justify-between items-center mb-4">
                                <div><h3 className="font-bold text-gray-800">Varian Ukuran / Porsi (Opsional)</h3></div>
                                <button type="button" onClick={handleAddVariant} className="px-4 py-2 bg-white border rounded-lg text-sm font-bold text-gray-700">Tambah Ukuran</button>
                            </div>
                            {variants.map((variant, index) => (
                                <div key={index} className="flex gap-4 items-end bg-white p-4 rounded-lg border shadow-sm mb-2">
                                    <div className="flex-1"><label className="block text-xs font-bold uppercase mb-1">Nama Ukuran</label><input type="text" value={variant.name} onChange={(e) => handleVariantChange(index, 'name', e.target.value)} className="w-full rounded-lg border p-2 text-sm" /></div>
                                    <div className="flex-1"><label className="block text-xs font-bold uppercase mb-1">Harga</label><input type="number" value={variant.price || ''} onChange={(e) => handleVariantChange(index, 'price', Number(e.target.value))} className="w-full rounded-lg border p-2 text-sm" /></div>
                                    <button type="button" onClick={() => handleRemoveVariant(index)} className="p-2.5 bg-red-50 text-red-600 rounded-lg">Hapus</button>
                                </div>
                            ))}
                        </div>

                        <div className="md:col-span-2"><label className="block text-xs font-bold uppercase text-gray-600 mb-2">Deskripsi Makanan (Opsional)</label><textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full h-24 rounded-xl border p-3 bg-gray-50" /></div>
                        <div className="md:col-span-2 flex justify-end gap-3 pt-2">
                            {isEditing && <button type="button" onClick={resetForm} className="px-6 py-3 border rounded-xl font-medium">Batal Edit</button>}
                            <button type="submit" disabled={submitting} className="px-8 py-3 bg-red-700 text-white rounded-xl font-bold">{submitting ? 'Menyimpan...' : 'Simpan Menu'}</button>
                        </div>
                    </form>
                </div>

                {/* Tabel Menu Bersih */}
                <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
                    <div className="p-6 border-b"><h2 className="text-xl font-bold text-gray-800">📋 Daftar Menu Aktif ({menus.length})</h2></div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead><tr className="bg-gray-50 text-gray-600 text-xs font-bold uppercase border-b"><th className="p-4">Foto</th><th className="p-4">Nama Menu</th><th className="p-4">Kategori</th><th className="p-4">Harga / Tampilan</th><th className="p-4 text-center">Aksi</th></tr></thead>
                            <tbody className="divide-y text-sm text-gray-700">
                                {menus.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50/80">
                                        <td className="p-4"><img src={item.image} alt={item.name} className="w-16 h-12 object-cover rounded-lg bg-gray-100" /></td>
                                        <td className="p-4"><div className="font-bold text-gray-900">{item.name}</div></td>
                                        <td className="p-4"><span className="px-2.5 py-1 rounded-full text-xs bg-gray-100">{item.category}</span></td>
                                        <td className="p-4"><div className="font-bold text-gray-900">Rp {item.price.toLocaleString('id-ID')}</div></td>
                                        <td className="p-4 text-center">
                                            <button onClick={() => handleEditSetup(item)} className="p-2 text-blue-600 mx-1"><span className="material-symbols-outlined">edit</span></button>
                                            <button onClick={() => handleDelete(item.id, item.name)} className="p-2 text-red-600 mx-1"><span className="material-symbols-outlined">delete</span></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}