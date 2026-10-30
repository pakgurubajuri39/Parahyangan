import React, { useState } from 'react';
import { Play, Sparkles, BookOpen, Users, Info, ShieldCheck, Volume2, VolumeX, Droplets, Zap, ArrowRight } from 'lucide-react';
import { NPCS } from '../game/constants';
import { sounds } from '../audio/soundManager';

interface LandingPageProps {
  onStartGame: () => void;
  hasSaveData: boolean;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartGame, hasSaveData }) => {
  const [activeTab, setActiveTab] = useState<'beranda' | 'cara_main' | 'karakter' | 'tentang'>('beranda');
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);

  const handleStart = () => {
    sounds.initOnUserAction();
    sounds.playRooster();
    onStartGame();
  };

  const toggleMusic = () => {
    sounds.initOnUserAction();
    const muted = sounds.toggleMute();
    setIsPlayingMusic(!muted);
  };

  return (
    <div className="fixed inset-0 z-50 w-full h-full bg-stone-950/95 backdrop-blur-md text-stone-100 flex flex-col overflow-hidden font-sans select-none animate-fade-in">
      {/* Background Scenic Ambient Layer */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-950/40 via-stone-950/90 to-stone-950 pointer-events-none" />

      {/* Mountain Landscape Silhouette in background */}
      <div className="absolute inset-0 opacity-15 pointer-events-none flex flex-col justify-end">
        <svg viewBox="0 0 1200 400" className="w-full h-80 object-cover text-emerald-900 fill-current">
          <path d="M0,400 L0,240 Q150,140 300,200 Q450,80 600,160 Q750,50 900,170 Q1050,110 1200,220 L1200,400 Z" />
          <path d="M0,400 L0,290 Q200,200 400,260 Q600,180 800,250 Q1000,190 1200,270 L1200,400 Z" className="text-stone-950 fill-current opacity-60" />
        </svg>
      </div>

      {/* Top Header with Navigation Tabs */}
      <header className="relative z-20 border-b border-amber-800/50 bg-stone-950/95 px-4 py-3 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xl">
        {/* Brand & Creator Logo */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-800 border-2 border-amber-300 flex items-center justify-center text-2xl shadow-[0_0_15px_rgba(245,158,11,0.4)]">
            🌾
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black tracking-wide text-amber-200 uppercase font-serif">
                Parahyangan: A Harvest Tale
              </h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-800/60 border border-amber-600/50 text-amber-300 font-semibold">
                v1.2
              </span>
            </div>
            <p className="text-[11px] text-amber-400 font-medium">Diciptakan oleh: <strong>Pak GuruAI</strong></p>
          </div>
        </div>

        {/* 4 Tabs on Top */}
        <nav className="flex items-center gap-1.5 bg-stone-900/90 border border-amber-700/60 rounded-2xl p-1 shadow-inner overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTab('beranda')}
            className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'beranda'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-900/50 scale-102'
                : 'text-stone-300 hover:text-white hover:bg-stone-800/80'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Beranda
          </button>

          <button
            onClick={() => setActiveTab('cara_main')}
            className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'cara_main'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-900/50 scale-102'
                : 'text-stone-300 hover:text-white hover:bg-stone-800/80'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-300" />
            Cara Main
          </button>

          <button
            onClick={() => setActiveTab('karakter')}
            className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'karakter'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-900/50 scale-102'
                : 'text-stone-300 hover:text-white hover:bg-stone-800/80'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-amber-300" />
            Karakter
          </button>

          <button
            onClick={() => setActiveTab('tentang')}
            className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'tentang'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-900/50 scale-102'
                : 'text-stone-300 hover:text-white hover:bg-stone-800/80'
            }`}
          >
            <Info className="w-3.5 h-3.5 text-amber-300" />
            Tentang Game
          </button>
        </nav>

        {/* Ambient Music Button */}
        <div className="hidden sm:flex items-center">
          <button
            onClick={toggleMusic}
            title={isPlayingMusic ? "Bisukan Musik Gamelan" : "Nyalakan Musik Gamelan"}
            className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-amber-800/60 text-xs text-amber-200 flex items-center gap-1.5 transition-colors"
          >
            {isPlayingMusic ? <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5 text-stone-400" />}
            <span className="text-[11px] font-semibold">{isPlayingMusic ? "Musik Aktif" : "Musik Mati"}</span>
          </button>
        </div>
      </header>

      {/* Main Tab Content Display */}
      <div className="relative z-10 flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col items-center justify-center">
        {/* TAB 1: BERANDA */}
        {activeTab === 'beranda' && (
          <div className="max-w-3xl w-full flex flex-col items-center text-center space-y-6 my-auto animate-fade-in">
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-900/40 border border-amber-600/60 text-amber-200 text-xs font-semibold backdrop-blur-md shadow-sm">
              <span>⛰️ Simulasi Pertanian Top-Down Priangan</span>
              <span>•</span>
              <span className="text-emerald-400 font-bold">Jawa Barat</span>
            </div>

            {/* Main Hero Title */}
            <div className="space-y-3">
              <h2 className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-400 tracking-tight font-serif drop-shadow-lg">
                Parahyangan: A Harvest Tale
              </h2>
              <p className="text-sm sm:text-base text-stone-200 max-w-xl mx-auto leading-relaxed font-normal">
                Bercocok tanam <strong>Padi Pandan Wangi Cianjur</strong>, mengalirkan <strong>Talang Bambu</strong> dari parit sawah, merawat <strong>Domba Garut</strong>, dan menjalin kehangatan dengan warga desa di kaki gunung.
              </p>
            </div>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-2xl text-left">
              <div className="p-3.5 rounded-2xl bg-stone-900/90 border border-amber-800/50 backdrop-blur-md shadow-md hover:border-amber-500 transition-colors">
                <span className="text-2xl">🌾</span>
                <h4 className="font-bold text-xs text-amber-200 mt-1">Sawah Terasering</h4>
                <p className="text-[10px] text-stone-400 mt-0.5">Padi Pandan Wangi & Ubi Cilembu manis</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-900/90 border border-amber-800/50 backdrop-blur-md shadow-md hover:border-amber-500 transition-colors">
                <span className="text-2xl">🎋</span>
                <h4 className="font-bold text-xs text-emerald-300 mt-1">Talang Bambu</h4>
                <p className="text-[10px] text-stone-400 mt-0.5">Irigasi sawah otomatis mengalir setiap pagi</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-900/90 border border-amber-800/50 backdrop-blur-md shadow-md hover:border-amber-500 transition-colors">
                <span className="text-2xl">🐑</span>
                <h4 className="font-bold text-xs text-yellow-300 mt-1">Hewan Ternak</h4>
                <p className="text-[10px] text-stone-400 mt-0.5">Domba Garut gagah & Ayam kampung bertelur</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-900/90 border border-amber-800/50 backdrop-blur-md shadow-md hover:border-amber-500 transition-colors">
                <span className="text-2xl">🎶</span>
                <h4 className="font-bold text-xs text-sky-300 mt-1">Gamelan Degung</h4>
                <p className="text-[10px] text-stone-400 mt-0.5">Nada pentatonis Salendro sejuk menenangkan</p>
              </div>
            </div>

            {/* Prominent Launch Button */}
            <div className="pt-2 w-full max-w-md">
              <button
                onClick={handleStart}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 hover:from-emerald-500 hover:to-green-500 text-white font-black text-sm sm:text-base uppercase tracking-wider shadow-[0_0_30px_rgba(34,197,94,0.6)] flex items-center justify-center gap-3 active:scale-95 transition-all border-2 border-emerald-400/80 cursor-pointer"
              >
                <Play className="w-5 h-5 fill-current" />
                {hasSaveData ? 'Lanjutkan Petualangan Tani' : 'Mulai Petualangan Tani Sekarang'}
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: CARA MAIN */}
        {activeTab === 'cara_main' && (
          <div className="max-w-3xl w-full bg-stone-900/95 border-2 border-amber-600/70 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-5 animate-fade-in my-auto">
            <div className="border-b border-amber-700/50 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-amber-200">Panduan & Cara Bermain</h3>
                <p className="text-xs text-stone-400">Petunjuk kontrol keyboard, layar sentuh, irigasi talang, & ternak</p>
              </div>
              <span className="text-3xl">🎮</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-stone-950/80 border border-stone-800 space-y-2">
                <h4 className="font-bold text-amber-300 text-sm flex items-center gap-1.5">
                  ⌨️ Kontrol Keyboard (Desktop / Laptop)
                </h4>
                <ul className="space-y-1.5 text-stone-300 leading-relaxed">
                  <li>• <strong>Gerak:</strong> Tombol [W, A, S, D] atau Tombol Panah.</li>
                  <li>• <strong>Berlari Cepat (Sprint):</strong> Tahan tombol [Shift] untuk berlari kencang!</li>
                  <li>• <strong>Aksi / Interaksi:</strong> [Spasi] atau [E] (Cangkul, Siram, Tanam, Panen, Elus Hewan, Ngobrol).</li>
                  <li>• <strong>Pilih Alat:</strong> Angka [1] s/d [8] atau Klik langsung pada Hotbar.</li>
                  <li>• <strong>Tap-to-Tile:</strong> Klik langsung petak tanah dengan mouse untuk aksi instan.</li>
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-stone-950/80 border border-stone-800 space-y-2">
                <h4 className="font-bold text-emerald-300 text-sm flex items-center gap-1.5">
                  📱 Kontrol Layar Sentuh (HP & Tablet)
                </h4>
                <ul className="space-y-1.5 text-stone-300 leading-relaxed">
                  <li>• <strong>D-Pad Virtual:</strong> Lingkaran di kiri bawah untuk berjalan lancar.</li>
                  <li>• <strong>Tombol [AKSI]:</strong> Tombol bulat hijau di kanan bawah untuk bertani & bicara.</li>
                  <li>• <strong>Tombol [LARI]:</strong> Sentuh tombol lari untuk beralih mode jalan santai / sprint.</li>
                  <li>• <strong>Tombol [ALAT]:</strong> Mengganti slot alat dengan cepat.</li>
                  <li>• <strong>Tombol [MAKAN]:</strong> Santap perbekalan untuk pulihkan stamina.</li>
                </ul>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-800/50 space-y-1 text-xs text-stone-300">
              <h4 className="font-bold text-amber-200 flex items-center gap-1.5">
                <Droplets className="w-4 h-4 text-sky-400" /> Rahasia Irigasi Talang Bambu & Ternak:
              </h4>
              <p className="leading-relaxed">
                Pasang <strong>Talang Bambu</strong> di atas petak sawah. Setiap fajar menyingsing (06:00), talang bambu akan mengalirkan air dari parit sawah secara otomatis ke petak di sekitarnya! Kunjungi kandang ternak untuk mengelus <strong>Domba Garut</strong> dan mengambil <strong>Telur Ayam Kampung</strong> segar setiap hari.
              </p>
            </div>

            <button
              onClick={handleStart}
              className="w-full py-3.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg"
            >
              Mengerti, Langsung Mulai Main!
            </button>
          </div>
        )}

        {/* TAB 3: KARAKTER */}
        {activeTab === 'karakter' && (
          <div className="max-w-4xl w-full bg-stone-900/95 border-2 border-amber-600/70 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-5 animate-fade-in my-auto">
            <div className="border-b border-amber-700/50 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-amber-200">Karakter & Tokoh Parahyangan</h3>
                <p className="text-xs text-stone-400">Warga desa ramah (*someah*) yang siap memandu perjalanan bertani Anda</p>
              </div>
              <span className="text-3xl">👥</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
              {/* Abah Surya */}
              <div className="p-4 rounded-2xl bg-stone-950/80 border border-amber-800/60 space-y-2">
                <div className="w-14 h-14 rounded-2xl bg-amber-950 border-2 border-amber-500 flex items-center justify-center text-3xl shadow-inner">
                  👴🏽
                </div>
                <div>
                  <h4 className="font-bold text-amber-200 text-sm">{NPCS.abah_surya.name}</h4>
                  <p className="text-[10px] text-amber-400 font-semibold">{NPCS.abah_surya.title}</p>
                </div>
                <p className="text-stone-300 leading-relaxed text-[11px]">{NPCS.abah_surya.bio}</p>
                <div className="pt-1 text-[10px] text-emerald-400 font-bold">
                  🌾 Toko: Bibit Padi, Ubi, Teh, & Talang Awi.
                </div>
              </div>

              {/* Neng Ceuceu */}
              <div className="p-4 rounded-2xl bg-stone-950/80 border border-rose-800/60 space-y-2">
                <div className="w-14 h-14 rounded-2xl bg-rose-950 border-2 border-rose-500 flex items-center justify-center text-3xl shadow-inner">
                  👩🏽‍🌾
                </div>
                <div>
                  <h4 className="font-bold text-rose-200 text-sm">{NPCS.neng_ceuceu.name}</h4>
                  <p className="text-[10px] text-rose-400 font-semibold">{NPCS.neng_ceuceu.title}</p>
                </div>
                <p className="text-stone-300 leading-relaxed text-[11px]">{NPCS.neng_ceuceu.bio}</p>
                <div className="pt-1 text-[10px] text-rose-300 font-bold">
                  🍃 Lokasi: Kebun Daun Teh Preanger.
                </div>
              </div>

              {/* Mang Ujang */}
              <div className="p-4 rounded-2xl bg-stone-950/80 border border-emerald-800/60 space-y-2">
                <div className="w-14 h-14 rounded-2xl bg-emerald-950 border-2 border-emerald-500 flex items-center justify-center text-3xl shadow-inner">
                  👨🏽‍🌾
                </div>
                <div>
                  <h4 className="font-bold text-emerald-200 text-sm">{NPCS.mang_ujang.name}</h4>
                  <p className="text-[10px] text-emerald-400 font-semibold">{NPCS.mang_ujang.title}</p>
                </div>
                <p className="text-stone-300 leading-relaxed text-[11px]">{NPCS.mang_ujang.bio}</p>
                <div className="pt-1 text-[10px] text-emerald-300 font-bold">
                  🐑 Lokasi: Kandang Domba Garut & Hayam.
                </div>
              </div>
            </div>

            {/* Livestock Preview Banner */}
            <div className="p-3.5 rounded-2xl bg-stone-950/60 border border-stone-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🐑 🐓 🦆</span>
                <div>
                  <p className="font-bold text-stone-200">Hewan Ternak Asli Sunda</p>
                  <p className="text-[10px] text-stone-400">Domba Garut tanduk gagah, Ayam Pelung, & Bebek Sawah</p>
                </div>
              </div>
              <button
                onClick={handleStart}
                className="px-4 py-2 rounded-xl bg-amber-700 hover:bg-amber-600 text-white font-bold text-xs cursor-pointer shadow-md"
              >
                Mulai Game
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: TENTANG GAME */}
        {activeTab === 'tentang' && (
          <div className="max-w-2xl w-full bg-stone-900/95 border-2 border-amber-600/70 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-5 animate-fade-in my-auto text-xs">
            <div className="border-b border-amber-700/50 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-amber-200">Tentang Game & Filosofi</h3>
                <p className="text-xs text-stone-400">Nilai luhur kearifan lokal tatar Sunda</p>
              </div>
              <span className="text-3xl">📜</span>
            </div>

            <div className="space-y-3 text-stone-200 leading-relaxed">
              <p>
                <strong>"Parahyangan: A Harvest Tale"</strong> merupakan game simulasi pertanian 2D top-down dengan kedalaman visual pseudo-3D yang merayakan agrikultur dan kebudayaan luhur Sunda di Jawa Barat.
              </p>
              <p>
                Bercocok tanam dipandang sebagai wujud syukur dan keharmonisan antara manusia, alam, dan sesama (<em>Tri Tangtu di Bumi</em>).
              </p>
              <div className="p-3.5 rounded-xl bg-amber-950/60 border border-amber-800/60 text-amber-200 italic font-serif text-center">
                “Tata titi duduga prayoga, silih asih, silih asah, silih asuh di tatar Priangan.”
              </div>
            </div>

            {/* Copyright & Branding Information */}
            <div className="p-4 rounded-2xl bg-stone-950 border border-amber-800/70 text-center space-y-1.5 shadow-inner">
              <p className="font-black text-amber-300 text-sm flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                "Parahyangan: A Harvest Tale"
              </p>
              <p className="text-stone-300">
                Pencipta: <strong>Pak GuruAI</strong>
              </p>
              <p className="text-[11px] text-amber-400 font-mono">
                @Copyright by. Pak GuruAI
              </p>
            </div>

            <button
              onClick={handleStart}
              className="w-full py-3.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg"
            >
              Mulai Petualangan Tani Sekarang
            </button>
          </div>
        )}
      </div>

      {/* Footer Branding */}
      <footer className="relative z-20 border-t border-amber-900/50 bg-stone-950/95 py-2.5 px-4 text-center">
        <p className="text-[11px] text-amber-300/80">
          "Parahyangan: A Harvest Tale" | Diciptakan oleh: <strong>Pak GuruAI</strong> | @Copyright by. Pak GuruAI
        </p>
      </footer>
    </div>
  );
};
