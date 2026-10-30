import React from 'react';
import { X, Keyboard, Smartphone, Sprout, Droplets, ShieldCheck } from 'lucide-react';

interface HelpModalProps {
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-stone-900 border-2 border-amber-600 rounded-3xl p-5 sm:p-6 shadow-2xl text-stone-100 flex flex-col gap-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-700/50 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-950 border border-amber-500 flex items-center justify-center text-2xl">
              📖
            </div>
            <div>
              <h2 className="text-xl font-black text-amber-200">Panduan Petani Parahyangan</h2>
              <p className="text-xs text-amber-400">Petunjuk kontrol, irigasi talang awi, & budidaya tanaman</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4 text-xs sm:text-sm">
          {/* Dual Controls Section */}
          <div className="bg-stone-800/80 border border-stone-700 rounded-2xl p-4 space-y-3">
            <h3 className="font-bold text-amber-300 flex items-center gap-2">
              <Keyboard className="w-4 h-4 text-amber-400" /> Kontrol Keyboard (Desktop / Laptop)
            </h3>
            <ul className="space-y-1 text-stone-300">
              <li>• <strong>Gerak:</strong> Tombol [W, A, S, D] atau Tombol Panah (Arrow Keys).</li>
              <li>• <strong>Aksi / Cangkul / Siram / Tanam / Bicara:</strong> Tombol [Spasi] atau [E].</li>
              <li>• <strong>Pilih Slot Alat:</strong> Tombol Angka [1] sampai [8] atau Klik langsung pada Hotbar.</li>
              <li>• <strong>Tap-to-Tile:</strong> Klik langsung pada petak tanah di dekat Anda untuk berinteraksi.</li>
            </ul>

            <h3 className="font-bold text-emerald-300 flex items-center gap-2 pt-2 border-t border-stone-700">
              <Smartphone className="w-4 h-4 text-emerald-400" /> Kontrol Layar Sentuh (HP & Tablet)
            </h3>
            <ul className="space-y-1 text-stone-300">
              <li>• <strong>D-Pad Virtual:</strong> Lingkaran navigasi di pojok kiri bawah layar untuk menggerakkan petani.</li>
              <li>• <strong>Tombol [AKSI]:</strong> Tombol bulat hijau besar di pojok kanan bawah untuk mencangkul, menyiram, menanam, memanen, atau berbicara dengan Abah Surya.</li>
              <li>• <strong>Tombol [ALAT]:</strong> Ganti alat / slot ransel dengan cepat.</li>
              <li>• <strong>Tombol [MAKAN]:</strong> Santap perbekalan untuk memulihkan stamina secara instan.</li>
            </ul>
          </div>

          {/* Agriculture Guide */}
          <div className="bg-stone-800/80 border border-stone-700 rounded-2xl p-4 space-y-2">
            <h3 className="font-bold text-amber-300 flex items-center gap-2">
              <Sprout className="w-4 h-4 text-amber-400" /> Komoditas Pertanian Khas Priangan
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
              <div className="p-2.5 rounded-xl bg-stone-900 border border-stone-800">
                <p className="font-bold text-amber-300">🌾 Padi Pandan Wangi</p>
                <p className="text-[11px] text-stone-400 mt-1">
                  Komoditas utama khas Cianjur. Membutuhkan tanah basah / terairi untuk tumbuh (3 hari).
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-stone-900 border border-stone-800">
                <p className="font-bold text-orange-300">🍠 Ubi Cilembu</p>
                <p className="text-[11px] text-stone-400 mt-1">
                  Ubi madu khas Sumedang. Tumbuh lekas di tanah gembur (2 hari) bernilai jual tinggi.
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-stone-900 border border-stone-800">
                <p className="font-bold text-emerald-300">🍃 Teh Preanger</p>
                <p className="text-[11px] text-stone-400 mt-1">
                  Dapat dipetik berulang kali tiap 2 hari tanpa perlu mencabut tanaman!
                </p>
              </div>
            </div>
          </div>

          {/* Bamboo Irrigation */}
          <div className="bg-stone-800/80 border border-stone-700 rounded-2xl p-4 space-y-2">
            <h3 className="font-bold text-sky-300 flex items-center gap-2">
              <Droplets className="w-4 h-4 text-sky-400" /> Aliran Air Bambu (Talang Cai Awi)
            </h3>
            <p className="text-stone-300 leading-relaxed text-xs">
              Pasang <strong>Talang Bambu</strong> di petak sawah. Setiap pagi saat fajar menyingsing,
              talang bambu yang terpasang akan mengalirkan air pegunungan untuk menyiram petak-petak di sekitarnya secara otomatis!
            </p>
          </div>

          {/* Saung & Stamina */}
          <div className="bg-stone-800/80 border border-stone-700 rounded-2xl p-4 space-y-2">
            <h3 className="font-bold text-yellow-300 flex items-center gap-2">
              ⚡ Manajemen Stamina & Saung Bambu
            </h3>
            <p className="text-stone-300 leading-relaxed text-xs">
              Mencangkul dan menyiram membutuhkan stamina. Bila stamina habis (0), gerak petani melambat.
              Pulihkan stamina dengan istirahat di <strong>Bale Saung Bambu</strong> atau santap hidangan khas
              seperti <strong>Nasi Liwet</strong> dan <strong>Bajigur</strong> dari Abah Surya.
            </p>
          </div>

          {/* Copyright & Branding Footer */}
          <div className="p-3 bg-amber-950/70 border border-amber-600/70 rounded-2xl text-center space-y-1">
            <p className="font-black text-amber-200 flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Parahyangan: A Harvest Tale
            </p>
            <p className="text-[11px] text-amber-300">
              Diciptakan oleh: <strong>Pak GuruAI</strong> | @Copyright by. Pak GuruAI
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-amber-700 hover:bg-amber-600 text-white font-bold text-xs uppercase tracking-wider transition-colors"
        >
          Tutup Panduan
        </button>
      </div>
    </div>
  );
};
