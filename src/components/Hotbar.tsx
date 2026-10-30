import React from 'react';
import { InventoryItem } from '../types/game';

interface HotbarProps {
  inventory: InventoryItem[];
  selectedSlot: number;
  onSelectSlot: (slot: number) => void;
}

export const Hotbar: React.FC<HotbarProps> = ({ inventory, selectedSlot, onSelectSlot }) => {
  // First 8 items belong to hotbar
  const slots = Array.from({ length: 8 }, (_, i) => inventory[i] || null);
  const activeItem = inventory[selectedSlot] || null;

  return (
    <div className="absolute bottom-16 sm:bottom-12 left-0 right-0 z-20 pointer-events-none flex flex-col items-center gap-1 select-none px-2">
      {/* Active Item Tooltip */}
      {activeItem && (
        <div className="pointer-events-auto bg-amber-950/90 backdrop-blur-md border border-amber-600/60 rounded-full px-3 py-1 shadow-md text-center max-w-sm">
          <p className="text-xs font-bold text-amber-200">
            {activeItem.icon} {activeItem.name}{' '}
            <span className="text-[10px] text-amber-400 font-normal">({activeItem.sundaneseName})</span>
          </p>
          <p className="text-[10px] text-stone-300 hidden sm:block truncate">{activeItem.description}</p>
        </div>
      )}

      {/* Slots Row */}
      <div className="pointer-events-auto bg-stone-950/85 backdrop-blur-lg border-2 border-amber-800/80 rounded-2xl p-1.5 shadow-2xl flex items-center gap-1 sm:gap-2">
        {slots.map((item, idx) => {
          const isSelected = selectedSlot === idx;
          return (
            <button
              key={idx}
              onClick={() => onSelectSlot(idx)}
              className={`relative w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-all duration-150 touch-manipulation ${
                isSelected
                  ? 'bg-amber-600/50 border-2 border-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.6)] scale-105'
                  : 'bg-stone-900/80 border border-stone-700/80 hover:bg-stone-800/90 text-stone-300'
              }`}
              title={item ? `${item.name} (${idx + 1})` : `Slot ${idx + 1}`}
            >
              {/* Hotkey Number Badge */}
              <span className="absolute top-0.5 left-1 text-[9px] font-mono font-bold text-amber-300/80">
                {idx + 1}
              </span>

              {item ? (
                <>
                  <span className="text-xl sm:text-2xl filter drop-shadow">{item.icon}</span>
                  {/* Item count if seed/food/material */}
                  {item.category !== 'tool' && item.count > 0 && (
                    <span className="absolute bottom-0.5 right-1 text-[10px] sm:text-xs font-mono font-black text-white bg-amber-900/90 px-1 rounded-sm border border-amber-600/50">
                      {item.count}
                    </span>
                  )}
                </>
              ) : (
                <span className="text-stone-700 text-xs">•</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
