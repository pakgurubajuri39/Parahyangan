import React from 'react';
import { InventoryItem } from '../types/game';
import { X, PackageCheck, ArrowDownCircle } from 'lucide-react';
import { sounds } from '../audio/soundManager';

interface ShippingBinModalProps {
  inventory: InventoryItem[];
  shippingBinItems: InventoryItem[];
  onClose: () => void;
  onDepositItem: (item: InventoryItem) => void;
}

export const ShippingBinModal: React.FC<ShippingBinModalProps> = ({
  inventory,
  shippingBinItems,
  onClose,
  onDepositItem,
}) => {
  const depositableItems = inventory.filter((item) => item.sellPrice > 0 && item.count > 0);
  const totalEstimatedEarnings = shippingBinItems.reduce(
    (acc, item) => acc + item.sellPrice * item.count,
    0
  );

  const handleDeposit = (item: InventoryItem) => {
    sounds.playCoin();
    onDepositItem(item);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-sm">
      <div className="relative w-full max-w-xl max-h-[90vh] bg-stone-900 border-2 border-amber-600 rounded-3xl p-5 sm:p-6 shadow-2xl text-stone-100 flex flex-col gap-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-700/50 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-950 border border-amber-500 flex items-center justify-center text-2xl">
              📦
            </div>
            <div>
              <h2 className="text-xl font-black text-amber-200">Peti Pengiriman Hasil Bumi (Kotak Jual)</h2>
              <p className="text-xs text-amber-400">
                Taruh hasil bumi di sini. Kujang emas akan masuk setiap pagi setelah fajar!
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Estimated Overnight Earnings Banner */}
        <div className="bg-amber-950/70 border border-amber-600/70 rounded-2xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PackageCheck className="w-5 h-5 text-emerald-400" />
            <span className="text-xs sm:text-sm font-bold text-amber-100">
              Estimasi Penghasilan Besok Pagi:
            </span>
          </div>
          <span className="text-sm sm:text-base font-black text-amber-300 font-mono">
            +{totalEstimatedEarnings.toLocaleString()} Kujang
          </span>
        </div>

        {/* Items Currently in Bin */}
        <div>
          <h4 className="text-xs font-bold text-stone-300 uppercase tracking-wider mb-2">
            Hasil Panen di Dalam Peti ({shippingBinItems.length} jenis)
          </h4>
          <div className="max-h-36 overflow-y-auto space-y-1.5 bg-stone-950/60 p-2.5 rounded-xl border border-stone-800">
            {shippingBinItems.length === 0 ? (
              <p className="text-xs text-stone-500 text-center py-4">
                Peti masih kosong. Pilih hasil bumi di bawah untuk dimasukkan.
              </p>
            ) : (
              shippingBinItems.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-xs py-1 px-2 rounded bg-stone-900 border border-stone-800"
                >
                  <span className="flex items-center gap-2">
                    <span>{item.icon}</span>
                    <span className="font-semibold text-stone-200">{item.name}</span>
                    <span className="text-amber-400 font-mono">x{item.count}</span>
                  </span>
                  <span className="font-mono text-emerald-400 font-bold">
                    +{item.sellPrice * item.count} Kujang
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Items in Player Inventory Ready to Deposit */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <h4 className="text-xs font-bold text-stone-300 uppercase tracking-wider mb-2">
            Masukkan Dari Ransel Petani
          </h4>
          <div className="flex-1 overflow-y-auto space-y-2 max-h-48 pr-1">
            {depositableItems.length === 0 ? (
              <p className="text-xs text-stone-500 text-center py-6">
                Tidak ada hasil bumi yang dapat dimasukkan di ransel saat ini.
              </p>
            ) : (
              depositableItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-stone-800/80 border border-stone-700 rounded-xl p-2.5 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{item.icon}</span>
                    <div>
                      <p className="font-bold text-stone-200">{item.name}</p>
                      <p className="text-[10px] text-stone-400 font-mono">
                        Tersedia: {item.count} | Nilai: {item.sellPrice} Kujang/biji
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeposit(item)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold transition-all active:scale-95 shadow-sm"
                  >
                    <ArrowDownCircle className="w-3.5 h-3.5" />
                    Kirim 1
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold text-xs uppercase tracking-wider transition-colors"
        >
          Tutup Peti Jual
        </button>
      </div>
    </div>
  );
};
