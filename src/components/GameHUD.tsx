import React from 'react';
import { GameTime, PlayerState, FestivalData } from '../types/game';
import { SEASONS_INFO } from '../game/constants';
import { Volume2, VolumeX, Save, FileCode, HelpCircle, Sun, CloudRain, Home, Zap } from 'lucide-react';

interface GameHUDProps {
  time: GameTime;
  player: PlayerState;
  isRaining: boolean;
  isMuted: boolean;
  touchControlsActive: boolean;
  currentFestival?: FestivalData | null;
  onToggleMute: () => void;
  onToggleTouchControls: () => void;
  onSaveGame: () => void;
  onOpenExport: () => void;
  onOpenHelp: () => void;
  onOpenLanding: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  time,
  player,
  isRaining,
  isMuted,
  touchControlsActive,
  currentFestival,
  onToggleMute,
  onToggleTouchControls,
  onSaveGame,
  onOpenExport,
  onOpenHelp,
  onOpenLanding,
}) => {
  const season = SEASONS_INFO[time.season];
  const staminaPercent = Math.max(0, Math.min(100, (player.stamina / player.maxStamina) * 100));
  const isStaminaLow = player.stamina <= 15;

  const formatTime = (h: number, m: number) => {
    const hh = h.toString().padStart(2, '0');
    const mm = m.toString().padStart(2, '0');
    return `${hh}:${mm}`;
  };

  return (
    <header className="absolute top-0 left-0 right-0 z-20 pointer-events-none p-2 sm:p-4 select-none">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        {/* Left: Stamina Bar & Status & Home Button */}
        <div className="flex items-center gap-2">
          {/* Menu / Home button */}
          <button
            onClick={onOpenLanding}
            title="Kembali ke Menu / Beranda"
            className="pointer-events-auto bg-amber-950/85 backdrop-blur-md border border-amber-700/60 rounded-xl px-2.5 py-2 shadow-lg flex items-center gap-1.5 text-amber-200 hover:text-white hover:bg-amber-800 transition-all text-xs font-bold"
          >
            <Home className="w-4 h-4 text-amber-300" />
            <span className="hidden sm:inline">Menu</span>
          </button>

          <div className="pointer-events-auto bg-amber-950/85 backdrop-blur-md border border-amber-700/60 rounded-xl px-3 py-2 shadow-lg flex items-center gap-3">
            <div className="flex flex-col">
              <div className="flex justify-between items-center text-xs font-semibold mb-1">
                <span className="text-amber-200 flex items-center gap-1">
                  ⚡ Stamina
                  {isStaminaLow && (
                    <span className="animate-pulse text-red-400 font-bold text-[10px] ml-1">
                      [LEMAH! MAKAN/TIDUR]
                    </span>
                  )}
                  {player.isSprinting && (
                    <span className="text-yellow-300 text-[10px] ml-1 flex items-center gap-0.5">
                      <Zap className="w-3 h-3 text-yellow-400 fill-current" /> Lari
                    </span>
                  )}
                </span>
                <span className={`text-[11px] font-mono ${isStaminaLow ? 'text-red-400 font-bold' : 'text-amber-300'}`}>
                  {Math.round(player.stamina)} / {player.maxStamina}
                </span>
              </div>
              <div className="w-32 sm:w-44 h-3 bg-stone-900/90 rounded-full overflow-hidden p-0.5 border border-stone-700">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isStaminaLow
                      ? 'bg-gradient-to-r from-red-600 to-amber-500 animate-pulse'
                      : 'bg-gradient-to-r from-emerald-500 to-lime-400'
                  }`}
                  style={{ width: `${staminaPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Center: Kalender Sunda & Jam */}
        <div className="pointer-events-auto flex flex-col items-center gap-1">
          <div className="bg-amber-950/85 backdrop-blur-md border border-amber-700/60 rounded-xl px-3.5 py-1.5 shadow-lg flex items-center gap-3 text-amber-100">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-900/50 border border-amber-600/40 text-amber-300">
              {isRaining ? <CloudRain className="w-5 h-5 text-sky-400" /> : <Sun className="w-5 h-5 text-amber-400" />}
            </div>

            <div className="flex flex-col text-left">
              <div className="text-[11px] text-amber-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <span>{season.name}</span>
                <span className="text-amber-500">•</span>
                <span className="text-emerald-400">Poé ka-{time.day}</span>
              </div>
              <div className="text-sm sm:text-base font-extrabold font-mono tracking-tight text-white flex items-center gap-2">
                <span>🕒 {formatTime(time.hour, time.minute)}</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-amber-800/60 text-amber-200 rounded font-normal hidden sm:inline-block">
                  Thn {time.year}
                </span>
              </div>
            </div>
          </div>

          {/* Active Festival Alert Banner */}
          {currentFestival && (
            <div className="animate-bounce bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 text-stone-950 px-2.5 py-0.5 rounded-full shadow-md text-[10px] font-black uppercase tracking-wider flex items-center gap-1 border border-yellow-300">
              <span>{currentFestival.badge}</span>
              <span>{currentFestival.name}</span>
            </div>
          )}
        </div>

        {/* Right: Kujang Coins & Control Buttons */}
        <div className="pointer-events-auto flex items-center gap-2 self-end sm:self-auto">
          {/* Kujang Emas Counter */}
          <div className="bg-amber-950/85 backdrop-blur-md border border-amber-700/60 rounded-xl px-3 py-1.5 shadow-lg flex items-center gap-2">
            <span className="text-lg">🗡️</span>
            <div className="flex flex-col">
              <span className="text-[10px] text-amber-400 uppercase tracking-widest font-semibold">Kujang Emas</span>
              <span className="text-sm sm:text-base font-black text-amber-200 font-mono">
                {player.kujangCoins.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-1 bg-amber-950/85 backdrop-blur-md border border-amber-700/60 rounded-xl p-1 shadow-lg">
            <button
              onClick={onToggleMute}
              title={isMuted ? 'Nyalakan Suara Gamelan' : 'Bisukan Suara'}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-amber-200 hover:text-white hover:bg-amber-800/60 transition-colors"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>

            <button
              onClick={onToggleTouchControls}
              title={touchControlsActive ? 'Sembunyikan D-Pad Sentuh' : 'Tampilkan D-Pad Sentuh'}
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-colors ${
                touchControlsActive ? 'bg-amber-700 text-white' : 'text-amber-200 hover:bg-amber-800/60'
              }`}
            >
              🕹️
            </button>

            <button
              onClick={onSaveGame}
              title="Simpan Permainan ke LocalStorage"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-amber-200 hover:text-emerald-300 hover:bg-amber-800/60 transition-colors"
            >
              <Save className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenExport}
              title="Salin / Unduh Single File HTML (Google Apps Script Ready)"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-amber-300 hover:text-amber-100 hover:bg-amber-800/60 transition-colors"
            >
              <FileCode className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenHelp}
              title="Panduan Petani Parahyangan"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-amber-200 hover:text-white hover:bg-amber-800/60 transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
