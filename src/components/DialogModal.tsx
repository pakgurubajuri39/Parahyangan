import React, { useState } from 'react';
import { NpcId, FestivalData } from '../types/game';
import { NPCS } from '../game/constants';
import { X, Sparkles, ShoppingBag, BookOpen } from 'lucide-react';

interface DialogModalProps {
  npcId: NpcId;
  currentFestival?: FestivalData | null;
  onClose: () => void;
  onOpenShop: () => void;
  onOpenGuide: () => void;
}

export const DialogModal: React.FC<DialogModalProps> = ({
  npcId,
  currentFestival,
  onClose,
  onOpenShop,
  onOpenGuide,
}) => {
  const npc = NPCS[npcId] || NPCS.abah_surya;
  const festivalDialogue = currentFestival?.npcDialogues?.[npcId];
  const [wisdomIndex, setWisdomIndex] = useState(0);
  const [showSchedule, setShowSchedule] = useState(false);
  const [viewingFestivalWisdom, setViewingFestivalWisdom] = useState(Boolean(festivalDialogue));

  const handleNextWisdom = () => {
    setWisdomIndex((prev) => (prev + 1) % npc.dialogues.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-stone-900 border-2 border-amber-600 rounded-3xl p-5 sm:p-6 shadow-2xl text-stone-100 flex flex-col gap-4">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Character Header */}
        <div className="flex items-center gap-4 border-b border-amber-700/50 pb-4">
          <div className="relative w-16 h-16 rounded-2xl bg-amber-950 border-2 border-amber-500 overflow-hidden flex items-center justify-center text-3xl shadow-inner shrink-0">
            {npc.avatar}
          </div>
          <div className="flex-1 pr-6">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-xl font-black text-amber-200">{npc.name}</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-800 text-amber-200 uppercase tracking-widest">
                {npc.role}
              </span>
            </div>
            <p className="text-xs text-amber-400/90 italic font-serif">
              {npc.title}
            </p>
          </div>
        </div>

        {/* Dialogue or Schedule View */}
        {showSchedule && npc.schedule ? (
          <div className="bg-amber-950/70 border border-amber-600/60 rounded-2xl p-3.5 space-y-2 max-h-48 overflow-y-auto text-xs">
            <div className="font-bold text-amber-200 text-sm flex items-center gap-1.5 pb-1 border-b border-amber-800/40">
              <span>🧭 Jadwal Harian Berkeliling {npc.name}</span>
            </div>
            {npc.schedule.map((slot, i) => (
              <div key={i} className="p-2 rounded-xl bg-stone-950/70 border border-amber-900/50 flex flex-col gap-0.5">
                <div className="flex items-center justify-between text-amber-300 font-bold">
                  <span>🕒 {slot.startHour.toString().padStart(2, '0')}:00 - {slot.endHour.toString().padStart(2, '0')}:00</span>
                  <span className="text-emerald-400 text-[10px]">{slot.locationName}</span>
                </div>
                <p className="text-stone-300 text-[11px]">{slot.activityName}</p>
              </div>
            ))}
          </div>
        ) : viewingFestivalWisdom && festivalDialogue ? (
          <div className="bg-gradient-to-r from-amber-950/90 via-stone-900 to-amber-950/90 border-2 border-amber-500 rounded-2xl p-4 min-h-[95px] flex flex-col justify-center gap-2 shadow-lg">
            <div className="flex items-center gap-2">
              <span className="text-sm">🎉</span>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                Ucapan Spesial {currentFestival?.name}
              </span>
            </div>
            <p className="text-sm sm:text-base text-amber-100 leading-relaxed font-serif">
              {festivalDialogue}
            </p>
          </div>
        ) : (
          <div className="bg-amber-950/60 border border-amber-700/50 rounded-2xl p-4 min-h-[95px] flex items-center">
            <p className="text-sm sm:text-base text-amber-100 leading-relaxed font-serif">
              {npc.dialogues[wisdomIndex]}
            </p>
          </div>
        )}

        {/* Action Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
          {festivalDialogue && (
            <button
              onClick={() => setViewingFestivalWisdom(!viewingFestivalWisdom)}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all border ${
                viewingFestivalWisdom
                  ? 'bg-amber-600 hover:bg-amber-500 text-white border-amber-400'
                  : 'bg-amber-950/80 hover:bg-amber-900 text-amber-300 border-amber-600'
              }`}
            >
              <span>🎉</span>
              {viewingFestivalWisdom ? 'Obrolan Harian' : 'Ucapan Festival'}
            </button>
          )}

          <button
            onClick={() => {
              setViewingFestivalWisdom(false);
              handleNextWisdom();
            }}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-amber-800/80 hover:bg-amber-700 text-amber-100 font-bold text-xs uppercase tracking-wider transition-all border border-amber-600"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            Lanjut Obrolan
          </button>

          {npc.schedule ? (
            <button
              onClick={() => setShowSchedule(!showSchedule)}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-200 font-bold text-xs uppercase tracking-wider transition-all border border-amber-700"
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              {showSchedule ? 'Tutup Jadwal' : '🧭 Jadwal Hari Ini'}
            </button>
          ) : (
            <button
              onClick={() => {
                onClose();
                onOpenGuide();
              }}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-200 font-bold text-xs uppercase tracking-wider transition-all border border-stone-700"
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              Panduan Parahyangan
            </button>
          )}

          {npcId === 'abah_surya' || npcId === 'mang_jaja' ? (
            <button
              onClick={() => {
                onClose();
                onOpenShop();
              }}
              className="sm:col-span-2 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-emerald-900/40"
            >
              <ShoppingBag className="w-4 h-4" />
              {npcId === 'mang_jaja' ? 'Buka Bursa Keliling Mang Jaja' : 'Buka Toko Bibit Abah'}
            </button>
          ) : null}

          <button
            onClick={onClose}
            className="sm:col-span-2 flex items-center justify-center px-4 py-2.5 rounded-xl bg-stone-800/60 hover:bg-stone-700 text-stone-400 hover:text-stone-200 font-semibold text-xs tracking-wider transition-all"
          >
            Hatur Nuhun (Pamit)
          </button>
        </div>
      </div>
    </div>
  );
};
