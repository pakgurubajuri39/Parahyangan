import React, { useState } from 'react';
import { LandPlot } from '../types/game';

interface LandPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  landPlots: LandPlot[];
  playerKujang: number;
  initialSelectedPlotId?: string | null;
  onBuyCash: (plotId: string) => void;
  onBuyCredit: (plotId: string) => void;
}

export const LandPurchaseModal: React.FC<LandPurchaseModalProps> = ({
  isOpen,
  onClose,
  landPlots,
  playerKujang,
  initialSelectedPlotId,
  onBuyCash,
  onBuyCredit,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'credit'>('all');
  const [selectedPlotId, setSelectedPlotId] = useState<string>(
    initialSelectedPlotId || (landPlots.length > 0 ? landPlots[0].id : '')
  );

  // Sync selected plot when opened for a specific plot
  React.useEffect(() => {
    if (initialSelectedPlotId) {
      setSelectedPlotId(initialSelectedPlotId);
    }
  }, [initialSelectedPlotId]);

  if (!isOpen) return null;

  const selectedPlot = landPlots.find((p) => p.id === selectedPlotId) || landPlots[0];
  const activeCredits = landPlots.filter((p) => p.isOwnedByPlayer && p.creditState?.isActive);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col bg-stone-900 border-2 border-amber-600/80 rounded-2xl shadow-2xl overflow-hidden text-stone-100 font-sans">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-stone-950 via-amber-950/60 to-stone-950 border-b border-amber-600/40">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📜</span>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-amber-200 tracking-wide">
                Buku Tanah & Akad Kredit Parahyangan
              </h2>
              <p className="text-xs text-stone-400">
                Kuasai dan perluas petak lahan pertanian dengan tunai atau cicilan harian
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 bg-amber-950/70 border border-amber-500/50 rounded-full text-xs font-semibold text-amber-300 flex items-center gap-1.5 shadow-sm">
              <span>🪙</span>
              <span>{playerKujang} Kujang</span>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white transition-colors border border-stone-700"
              aria-label="Tutup"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-stone-800 bg-stone-950/60 px-4 pt-2 gap-2 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-t-lg transition-colors flex items-center gap-2 border-t border-x ${
              activeTab === 'all'
                ? 'bg-stone-900 border-amber-600/50 text-amber-300'
                : 'border-transparent text-stone-400 hover:text-stone-200 hover:bg-stone-900/50'
            }`}
          >
            <span>🌾</span>
            <span>Semua Petak Lahan ({landPlots.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('credit')}
            className={`px-4 py-2 rounded-t-lg transition-colors flex items-center gap-2 border-t border-x ${
              activeTab === 'credit'
                ? 'bg-stone-900 border-amber-600/50 text-amber-300'
                : 'border-transparent text-stone-400 hover:text-stone-200 hover:bg-stone-900/50'
            }`}
          >
            <span>📜</span>
            <span>Cicilan Aktif ({activeCredits.length})</span>
          </button>
        </div>

        {/* Main Body */}
        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Left Column: Plot Selector List */}
          <div className="md:col-span-5 flex flex-col gap-2.5 max-h-[380px] md:max-h-none overflow-y-auto pr-1">
            {activeTab === 'all' ? (
              landPlots.map((plot) => {
                const isSelected = plot.id === selectedPlot.id;
                const isOwned = plot.isOwnedByPlayer;
                const isCredit = isOwned && plot.creditState?.isActive;

                return (
                  <button
                    key={plot.id}
                    onClick={() => setSelectedPlotId(plot.id)}
                    className={`text-left p-3 rounded-xl border transition-all flex items-start gap-3 ${
                      isSelected
                        ? 'bg-gradient-to-r from-amber-950/80 to-stone-900 border-amber-500 shadow-md ring-1 ring-amber-500/50'
                        : 'bg-stone-950/50 hover:bg-stone-800/60 border-stone-800 hover:border-stone-700'
                    }`}
                  >
                    <span className="text-2xl mt-0.5">{plot.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="font-bold text-xs sm:text-sm text-stone-200 truncate">
                          {plot.name}
                        </span>
                        {isOwned ? (
                          isCredit ? (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-semibold whitespace-nowrap">
                              Kredit
                            </span>
                          ) : (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-semibold whitespace-nowrap">
                              Milik
                            </span>
                          )
                        ) : (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 font-semibold whitespace-nowrap">
                            Dijual
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-stone-400 truncate">{plot.ownerName}</p>
                      <div className="mt-1 flex items-center gap-2 text-[11px] text-amber-400 font-medium">
                        {!isOwned ? (
                          <>
                            <span>Tunai: {plot.cashPrice} K</span>
                            <span className="text-stone-600">•</span>
                            <span>DP: {plot.creditOption.downPayment} K</span>
                          </>
                        ) : isCredit ? (
                          <span className="text-cyan-400">
                            Sisa: {plot.creditState?.remainingDebt} K ({plot.creditState?.daysPaid}/{plot.creditState?.totalDays} hari)
                          </span>
                        ) : (
                          <span className="text-emerald-400">Hak Milik Penuh (Lunas)</span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })
            ) : activeCredits.length === 0 ? (
              <div className="p-6 text-center text-stone-500 text-xs border border-dashed border-stone-800 rounded-xl">
                Tidak ada cicilan kredit aktif saat ini. Anda dapat mengajukan kredit untuk lahan yang tersedia!
              </div>
            ) : (
              activeCredits.map((plot) => (
                <button
                  key={plot.id}
                  onClick={() => setSelectedPlotId(plot.id)}
                  className={`text-left p-3 rounded-xl border transition-all flex items-start gap-3 ${
                    plot.id === selectedPlot.id
                      ? 'bg-gradient-to-r from-cyan-950/80 to-stone-900 border-cyan-500 shadow-md ring-1 ring-cyan-500/50'
                      : 'bg-stone-950/50 hover:bg-stone-800/60 border-stone-800'
                  }`}
                >
                  <span className="text-2xl mt-0.5">{plot.icon}</span>
                  <div className="flex-1 min-w-0">
                    <span className="font-bold text-xs sm:text-sm text-cyan-200 truncate block">
                      {plot.name}
                    </span>
                    <span className="text-[11px] text-stone-400 block mt-0.5">
                      Cicilan: {plot.creditState?.dailyAmount} Kujang / hari
                    </span>
                    <div className="mt-2 w-full bg-stone-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-cyan-400 h-full rounded-full transition-all"
                        style={{
                          width: `${((plot.creditState?.daysPaid || 0) / (plot.creditState?.totalDays || 1)) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Right Column: Selected Plot Details & Actions */}
          <div className="md:col-span-7 flex flex-col bg-stone-950/80 rounded-xl p-4 border border-stone-800 justify-between">
            {selectedPlot ? (
              <div className="space-y-3.5">
                {/* Plot Title & Ownership Banner */}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{selectedPlot.icon}</span>
                    <div>
                      <h3 className="font-bold text-base text-amber-200">{selectedPlot.name}</h3>
                      <p className="text-xs text-stone-400 italic">
                        {selectedPlot.sundaneseName} • {selectedPlot.ownerName}
                      </p>
                    </div>
                  </div>

                  {/* Status Banner */}
                  <div className="mt-2.5">
                    {selectedPlot.isOwnedByPlayer ? (
                      selectedPlot.creditState?.isActive ? (
                        <div className="p-2.5 rounded-lg bg-cyan-950/70 border border-cyan-700/60 text-cyan-200 text-xs flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span>📜</span>
                            <span>
                              <strong>Kredit Cicilan Aktif:</strong> Lahan sah Anda garap sekarang!
                            </span>
                          </div>
                          <span className="font-bold text-cyan-300">
                            {selectedPlot.creditState.daysPaid} / {selectedPlot.creditState.totalDays} Hari
                          </span>
                        </div>
                      ) : (
                        <div className="p-2.5 rounded-lg bg-emerald-950/70 border border-emerald-700/60 text-emerald-200 text-xs flex items-center gap-2">
                          <span>🌾</span>
                          <span>
                            <strong>Hak Milik Sah Adat (Lunas):</strong> Bebas diolah dan ditanami selamanya.
                          </span>
                        </div>
                      )
                    ) : (
                      <div className="p-2.5 rounded-lg bg-amber-950/50 border border-amber-700/50 text-amber-200 text-xs flex items-center gap-2">
                        <span>🔒</span>
                        <span>
                          <strong>Lahan Belum Dimiliki:</strong> Harus dibeli tunai atau kredit sebelum dapat dicangkul/ditanami.
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Description & Perks */}
                <div className="p-3 bg-stone-900/80 rounded-lg border border-stone-800 text-xs space-y-2">
                  <p className="text-stone-300 leading-relaxed">{selectedPlot.description}</p>
                  <div className="pt-2 border-t border-stone-800/80 text-amber-300 font-medium flex items-center gap-2">
                    <span>✨</span>
                    <span>{selectedPlot.perks}</span>
                  </div>
                </div>

                {/* Price Breakdown / Credit Progress */}
                {selectedPlot.creditState?.isActive ? (
                  <div className="p-3 bg-cyan-950/40 rounded-lg border border-cyan-800/50 text-xs space-y-2">
                    <div className="flex justify-between text-stone-300">
                      <span>Cicilan Otomatis Setiap Jam 06:00:</span>
                      <strong className="text-cyan-300">
                        {selectedPlot.creditState.dailyAmount} Kujang / hari
                      </strong>
                    </div>
                    <div className="flex justify-between text-stone-300">
                      <span>Sisa Tanggungan Kredit:</span>
                      <strong className="text-cyan-300">
                        {selectedPlot.creditState.remainingDebt} Kujang
                      </strong>
                    </div>
                    <div className="w-full bg-stone-800 rounded-full h-2 overflow-hidden mt-1">
                      <div
                        className="bg-cyan-400 h-full rounded-full transition-all"
                        style={{
                          width: `${(selectedPlot.creditState.daysPaid / selectedPlot.creditState.totalDays) * 100}%`,
                        }}
                      />
                    </div>
                    <p className="text-[11px] text-stone-400 italic">
                      *Tiap pagi saat terbangun, {selectedPlot.creditState.dailyAmount} Kujang akan dipotong otomatis. Begitu lunas, sertifikat hak milik penuh langsung diserahkan!
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    {/* Cash Option Card */}
                    <div className="p-3 bg-stone-900/90 rounded-lg border border-stone-700 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] text-stone-400 uppercase tracking-wider block font-semibold">
                          Opsi 1: Pembelian Tunai
                        </span>
                        <div className="mt-1 text-base font-bold text-amber-300">
                          {selectedPlot.cashPrice} Kujang
                        </div>
                        <p className="text-[11px] text-stone-400 mt-1">
                          Langsung lunas tanpa tanggungan harian.
                        </p>
                      </div>
                      {!selectedPlot.isOwnedByPlayer && (
                        <button
                          onClick={() => onBuyCash(selectedPlot.id)}
                          disabled={playerKujang < selectedPlot.cashPrice}
                          className="mt-3 w-full py-2 px-3 rounded-lg bg-amber-600 hover:bg-amber-500 disabled:bg-stone-800 disabled:text-stone-500 text-stone-950 font-bold transition-all shadow text-xs flex items-center justify-center gap-1.5"
                        >
                          <span>🪙</span>
                          <span>Beli Tunai</span>
                        </button>
                      )}
                    </div>

                    {/* Credit Option Card */}
                    <div className="p-3 bg-stone-900/90 rounded-lg border border-cyan-800/60 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] text-cyan-300 uppercase tracking-wider block font-semibold">
                          Opsi 2: Kredit Cicilan Rakyat
                        </span>
                        <div className="mt-1 text-base font-bold text-cyan-200">
                          DP {selectedPlot.creditOption.downPayment} Kujang
                        </div>
                        <p className="text-[11px] text-stone-300 mt-1">
                          + {selectedPlot.creditOption.dailyPayment} Kujang / hari ({selectedPlot.creditOption.days} hari)
                        </p>
                        <p className="text-[10px] text-emerald-400 mt-1">
                          ✓ Langsung bisa dicangkul & ditanam!
                        </p>
                      </div>
                      {!selectedPlot.isOwnedByPlayer && (
                        <button
                          onClick={() => onBuyCredit(selectedPlot.id)}
                          disabled={playerKujang < selectedPlot.creditOption.downPayment}
                          className="mt-3 w-full py-2 px-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:bg-stone-800 disabled:text-stone-500 text-stone-950 font-bold transition-all shadow text-xs flex items-center justify-center gap-1.5"
                        >
                          <span>📜</span>
                          <span>Ambil Kredit (DP)</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-stone-500 text-xs py-8">
                Pilih petak lahan untuk melihat detail kepemilikan dan harga
              </div>
            )}

            {/* Bottom reminder info */}
            <div className="mt-4 pt-3 border-t border-stone-800/80 flex items-center justify-between text-[11px] text-stone-400">
              <span>📍 Patok batas hijau = Hak Milik | biru = Kredit | kuning/merah = Dijual</span>
              <button
                onClick={onClose}
                className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg text-xs font-medium transition-colors"
              >
                Tutup Buku
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
