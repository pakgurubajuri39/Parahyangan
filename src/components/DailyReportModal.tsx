import React from 'react';
import { DailyReport, GameTime } from '../types/game';
import { SEASONS_INFO } from '../game/constants';
import { Sun, Sparkles, TrendingUp, CheckCircle2 } from 'lucide-react';

interface DailyReportModalProps {
  report: DailyReport;
  time: GameTime;
  isRaining: boolean;
  onClose: () => void;
}

export const DailyReportModal: React.FC<DailyReportModalProps> = ({
  report,
  time,
  isRaining,
  onClose,
}) => {
  const season = SEASONS_INFO[time.season];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-stone-900 border-2 border-amber-500 rounded-3xl p-5 sm:p-6 shadow-2xl text-stone-100 flex flex-col gap-4">
        {/* Header with Sunrise Aesthetic */}
        <div className="text-center border-b border-amber-700/60 pb-3">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-600/30 border border-amber-400 text-3xl mb-2 shadow-inner">
            🌅
          </div>
          <h2 className="text-2xl font-black text-amber-200 tracking-wide font-serif">
            Fajar Parahyangan
          </h2>
          <p className="text-xs text-amber-400">
            {season.name} • Poé ka-{time.day} (Jam 06:00 Enjing)
          </p>
        </div>

        {/* Sales Earnings Breakdown */}
        <div className="bg-amber-950/60 border border-amber-700/60 rounded-2xl p-4 flex flex-col gap-2">
          <div className="flex items-center justify-between pb-2 border-b border-amber-800/60 text-xs font-bold text-amber-300">
            <span className="flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-400" /> Hasil Penjualan Peti
            </span>
            <span className="font-mono text-emerald-300 text-sm">
              +{report.totalEarnings.toLocaleString()} Kujang
            </span>
          </div>

          <div className="max-h-36 overflow-y-auto space-y-1 py-1">
            {report.itemsSold.length === 0 ? (
              <p className="text-xs text-stone-400 italic text-center py-2">
                Tidak ada hasil bumi yang dijual malam tadi.
              </p>
            ) : (
              report.itemsSold.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs text-stone-200">
                  <span>
                    {item.name} <span className="text-amber-400 font-mono">x{item.count}</span>
                  </span>
                  <span className="font-mono text-emerald-400 font-semibold">
                    +{item.total} Kujang
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Crops Grown Notification */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-stone-800/80 border border-stone-700 rounded-xl p-3 flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <p className="text-stone-400 text-[10px]">Tanaman Berkembang</p>
              <p className="font-bold text-amber-200">{report.cropsGrownCount} Petak Sawah</p>
            </div>
          </div>

          <div className="bg-stone-800/80 border border-stone-700 rounded-xl p-3 flex items-center gap-2.5">
            <Sun className="w-5 h-5 text-sky-400 shrink-0" />
            <div>
              <p className="text-stone-400 text-[10px]">Prakiraan Cuaca</p>
              <p className="font-bold text-sky-200">
                {isRaining ? '🌧️ Hujan Sejuk' : '☀️ Cerah Berangin'}
              </p>
            </div>
          </div>
        </div>

        {/* Motivational Wisdom */}
        <p className="text-center text-xs text-amber-300/80 italic font-serif px-2">
          “Wilujeng ngawitan dinten anyar. Mugi panen berkah tur lungsur langsar.”
        </p>

        {/* Button to Start New Day */}
        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-amber-950/50 flex items-center justify-center gap-2 active:scale-98 transition-all"
        >
          <CheckCircle2 className="w-4 h-4" />
          Mulai Aktivitas Hari Ini
        </button>
      </div>
    </div>
  );
};
