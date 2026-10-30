import React, { useState } from 'react';
import { InventoryItem, PlayerState, NpcId, FestivalData } from '../types/game';
import { ABAH_SHOP_ITEMS, MANG_JAJA_SHOP_ITEMS } from '../game/constants';
import { X, ShoppingCart, DollarSign } from 'lucide-react';
import { sounds } from '../audio/soundManager';

interface ShopModalProps {
  player: PlayerState;
  inventory: InventoryItem[];
  shopNpcId?: NpcId | null;
  currentFestival?: FestivalData | null;
  onClose: () => void;
  onBuyItem: (item: InventoryItem) => void;
  onSellItem: (itemId: string) => void;
}

export const ShopModal: React.FC<ShopModalProps> = ({
  player,
  inventory,
  shopNpcId = 'abah_surya',
  currentFestival,
  onClose,
  onBuyItem,
  onSellItem,
}) => {
  const [tab, setTab] = useState<'buy' | 'sell'>('buy');
  const isMangJaja = shopNpcId === 'mang_jaja';
  const shopItems = isMangJaja ? MANG_JAJA_SHOP_ITEMS : ABAH_SHOP_ITEMS;

  const sellableItems = inventory.filter((item) => item.sellPrice > 0 && item.count > 0);

  const handleBuy = (item: InventoryItem) => {
    if (player.kujangCoins < item.buyPrice) {
      sounds.playEat();
      return;
    }
    sounds.playCoin();
    onBuyItem(item);
  };

  const handleSell = (itemId: string) => {
    sounds.playCoin();
    onSellItem(itemId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-stone-900 border-2 border-amber-600 rounded-3xl p-5 sm:p-6 shadow-2xl text-stone-100 flex flex-col gap-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-700/50 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-950 border border-amber-500 flex items-center justify-center text-2xl">
              {isMangJaja ? '🪵' : '🌾'}
            </div>
            <div>
              <h2 className="text-xl font-black text-amber-200">
                {isMangJaja ? 'Bursa Keliling Mang Jaja' : 'Toko Bibit & Pasokan Abah Surya'}
              </h2>
              <p className="text-xs text-amber-400">
                {isMangJaja
                  ? 'Pengrajin awi tali, binih cengek domba, talang ukir & anyaman'
                  : 'Penyedia bibit unggul Priangan, talang awi, & sangu liwet'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Player Coins Badge */}
            <div className="bg-amber-950 px-3 py-1.5 rounded-xl border border-amber-500/60 flex items-center gap-1.5">
              <span className="text-sm">🗡️</span>
              <span className="text-amber-200 font-mono font-bold text-sm">
                {player.kujangCoins.toLocaleString()} Kujang
              </span>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2">
          <button
            onClick={() => setTab('buy')}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
              tab === 'buy'
                ? 'bg-amber-700 text-white shadow-md'
                : 'bg-stone-800 text-stone-400 hover:bg-stone-700 hover:text-stone-200'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            Beli Bibit & Pasokan
          </button>
          <button
            onClick={() => setTab('sell')}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
              tab === 'sell'
                ? 'bg-emerald-700 text-white shadow-md'
                : 'bg-stone-800 text-stone-400 hover:bg-stone-700 hover:text-stone-200'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            Jual Hasil Bumi Langsung
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-2.5 max-h-[50vh]">
          {tab === 'buy' ? (
            <>
              {/* Seasonal Festival Exclusive Items Section */}
              {currentFestival && currentFestival.specialShopItems && currentFestival.specialShopItems.length > 0 && (
                <div className="bg-gradient-to-r from-amber-950/90 via-stone-900 to-amber-950/90 border-2 border-amber-500 rounded-2xl p-3.5 space-y-2.5 shadow-lg">
                  <div className="flex items-center justify-between pb-1.5 border-b border-amber-500/40">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{currentFestival.badge}</span>
                      <span className="font-extrabold text-amber-200 text-xs sm:text-sm uppercase tracking-wider">
                        🎉 Komoditas Khusus: {currentFestival.name}
                      </span>
                    </div>
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded-full border border-amber-400/40">
                      Spesial Festival
                    </span>
                  </div>
                  <div className="space-y-2">
                    {currentFestival.specialShopItems.map((item) => {
                      const canAfford = player.kujangCoins >= item.buyPrice;
                      return (
                        <div
                          key={`fest_${item.id}`}
                          className="bg-stone-900/90 border border-amber-500/60 rounded-xl p-2.5 flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="text-2xl">{item.icon}</span>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <h4 className="text-xs sm:text-sm font-bold text-amber-100">{item.name}</h4>
                                <span className="text-[9px] bg-red-600/80 text-white font-bold px-1.5 py-0.2 rounded">Langka</span>
                              </div>
                              <p className="text-[10px] text-stone-300 leading-tight">{item.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-xs font-mono font-bold text-amber-300">
                              {item.buyPrice} Kujang
                            </span>
                            <button
                              onClick={() => handleBuy(item)}
                              disabled={!canAfford}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                canAfford
                                  ? 'bg-amber-600 hover:bg-amber-500 text-white active:scale-95'
                                  : 'bg-stone-700 text-stone-500 cursor-not-allowed'
                              }`}
                            >
                              Beli
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Standard Shop Items */}
              {shopItems.map((item) => {
              const canAfford = player.kujangCoins >= item.buyPrice;
              return (
                <div
                  key={item.id}
                  className="bg-stone-800/80 border border-stone-700 hover:border-amber-600/70 rounded-2xl p-3 flex items-center justify-between gap-3 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{item.icon}</span>
                    <div>
                      <h4 className="text-sm font-bold text-amber-100">{item.name}</h4>
                      <p className="text-[11px] text-stone-400">{item.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-amber-300">
                        {item.buyPrice} Kujang
                      </span>
                    </div>

                    <button
                      onClick={() => handleBuy(item)}
                      disabled={!canAfford}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        canAfford
                          ? 'bg-amber-600 hover:bg-amber-500 text-white active:scale-95'
                          : 'bg-stone-700 text-stone-500 cursor-not-allowed'
                      }`}
                    >
                      Beli
                    </button>
                  </div>
                </div>
              );
            })}
            </>
          ) : sellableItems.length === 0 ? (
            <div className="text-center py-12 text-stone-400 text-sm">
              <p className="text-2xl mb-2">🧺</p>
              <p>Belum ada hasil panen atau komoditas di ransel Anda.</p>
              <p className="text-xs text-stone-500 mt-1">
                Petik padi pandan wangi, ubi cilembu, atau daun teh terlebih dahulu!
              </p>
            </div>
          ) : (
            sellableItems.map((item) => (
              <div
                key={item.id}
                className="bg-stone-800/80 border border-stone-700 hover:border-emerald-600/70 rounded-2xl p-3 flex items-center justify-between gap-3 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{item.icon}</span>
                  <div>
                    <h4 className="text-sm font-bold text-emerald-200">
                      {item.name}{' '}
                      <span className="text-xs text-amber-300 font-mono">x{item.count}</span>
                    </h4>
                    <p className="text-[11px] text-stone-400">{item.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      +{item.sellPrice} Kujang / biji
                    </span>
                  </div>

                  <button
                    onClick={() => handleSell(item.id)}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white active:scale-95 transition-all"
                  >
                    Jual 1
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
