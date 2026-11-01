/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Game: Parahyangan: A Harvest Tale
 * Pencipta: Pak GuruAI
 * Hak Cipta: @Copyright by. Pak GuruAI
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GameEngine } from './game/gameEngine';
import { createParahyanganMap } from './game/mapGenerator';
import { INITIAL_INVENTORY, TILE_SIZE, MAP_COLS, MAP_ROWS } from './game/constants';
import { GameTime, PlayerState, InventoryItem, DailyReport, NpcId, FestivalData, LandPlot } from './types/game';
import { sounds } from './audio/soundManager';

import { LandingPage } from './components/LandingPage';
import { GameHUD } from './components/GameHUD';
import { Hotbar } from './components/Hotbar';
import { VirtualControls } from './components/VirtualControls';
import { DialogModal } from './components/DialogModal';
import { ShopModal } from './components/ShopModal';
import { ShippingBinModal } from './components/ShippingBinModal';
import { DailyReportModal } from './components/DailyReportModal';
import { HelpModal } from './components/HelpModal';
import { SingleFileExportModal } from './components/SingleFileExportModal';
import { WeatherOverlay } from './components/WeatherOverlay';
import { LandPurchaseModal } from './components/LandPurchaseModal';

const SAVE_KEY = 'parahyangan_harvest_save_v1';

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<GameEngine | null>(null);

  // Landing Page vs Active Game
  const [isLandingOpen, setIsLandingOpen] = useState(true);
  const [hasSaveData, setHasSaveData] = useState(false);

  // React state mirroring engine for UI updates
  const [playerState, setPlayerState] = useState<PlayerState>({
    x: 7 * TILE_SIZE,
    y: 9 * TILE_SIZE,
    targetX: 7 * TILE_SIZE,
    targetY: 9 * TILE_SIZE,
    direction: 'down',
    isMoving: false,
    isActing: false,
    isSprinting: false,
    stamina: 100,
    maxStamina: 100,
    kujangCoins: 120,
    selectedSlot: 0,
  });

  const [gameTime, setGameTime] = useState<GameTime>({
    day: 1,
    hour: 6,
    minute: 0,
    season: 'kasa',
    year: 1,
  });

  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [isRaining, setIsRaining] = useState(false);
  const [currentFestival, setCurrentFestival] = useState<FestivalData | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  // Device touch auto-detection
  const [touchControlsActive, setTouchControlsActive] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }
    return false;
  });

  // Modals state
  const [selectedNpcId, setSelectedNpcId] = useState<NpcId | null>(null);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isShippingBinOpen, setIsShippingBinOpen] = useState(false);
  const [isDailyReportOpen, setIsDailyReportOpen] = useState(false);
  const [dailyReportData, setDailyReportData] = useState<DailyReport | null>(null);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isBedPromptOpen, setIsBedPromptOpen] = useState(false);
  const [isLandModalOpen, setIsLandModalOpen] = useState(false);
  const [selectedPlotForModal, setSelectedPlotForModal] = useState<string | null>(null);
  const [landPlots, setLandPlots] = useState<LandPlot[]>([]);

  // Check saved game on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (raw) setHasSaveData(true);
    } catch {
      // Ignore
    }
  }, []);

  // Setup Canvas and Game Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let savedPlayer: Partial<PlayerState> | undefined;
    let savedTime: Partial<GameTime> | undefined;
    let savedInv: InventoryItem[] = INITIAL_INVENTORY;
    let savedShippingBin: InventoryItem[] = [];
    let savedLandPlots: LandPlot[] | undefined;

    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.player) {
          savedPlayer = { ...parsed.player, isActing: false };
        }
        if (parsed.time) savedTime = parsed.time;
        if (parsed.inventory) savedInv = parsed.inventory;
        if (parsed.shippingBin) savedShippingBin = parsed.shippingBin;
        if (parsed.landPlots) savedLandPlots = parsed.landPlots;
      }
    } catch {
      // Ignore parse error
    }

    const map = createParahyanganMap();
    const engine = new GameEngine(
      canvas,
      map,
      savedInv,
      savedPlayer,
      savedTime,
      savedShippingBin,
      savedLandPlots
    );
    engineRef.current = engine;
    setLandPlots([...engine.landPlots]);

    // Callbacks from engine
    engine.onTalkNpc = (npcId: NpcId) => setSelectedNpcId(npcId);
    engine.onOpenShop = () => setIsShopOpen(true);
    engine.onShippingBinPrompt = () => setIsShippingBinOpen(true);
    engine.onSleepPrompt = () => setIsBedPromptOpen(true);
    engine.onFestivalStart = (fest) => setCurrentFestival(fest);
    setCurrentFestival(engine.currentFestival);
    engine.onDailyReport = (report) => {
      setDailyReportData(report);
      setIsDailyReportOpen(true);
    };
    engine.onOpenLandPrompt = (plot: LandPlot) => {
      setSelectedPlotForModal(plot.id);
      setIsLandModalOpen(true);
    };

    const handleResize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    // Main animation loop
    let animId: number;
    let syncTimer = 0;

    const loop = () => {
      if (!isLandingOpen) {
        engine.updateTime();
      }
      engine.render();

      syncTimer++;
      if (syncTimer % 6 === 0) {
        setPlayerState({ ...engine.player });
        setGameTime({ ...engine.time });
        setInventory([...engine.inventory]);
        setIsRaining(engine.isRaining);
        setCurrentFestival(engine.currentFestival);
        setLandPlots([...engine.landPlots]);
      }

      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isLandingOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (isLandingOpen) return;

    const keysPressed = new Set<string>();

    const handleKeyDown = (e: KeyboardEvent) => {
      sounds.initOnUserAction();
      keysPressed.add(e.key.toLowerCase());

      const engine = engineRef.current;
      if (!engine) return;

      // Sprint toggle / Shift key
      if (e.key === 'Shift') {
        engine.player.isSprinting = true;
        setPlayerState((prev) => ({ ...prev, isSprinting: true }));
      }

      // Slot keys 1-8
      if (e.key >= '1' && e.key <= '8') {
        const slotIdx = parseInt(e.key) - 1;
        if (slotIdx < engine.inventory.length) {
          engine.player.selectedSlot = slotIdx;
          setPlayerState((prev) => ({ ...prev, selectedSlot: slotIdx }));
        }
        return;
      }

      // Action keys: Space or E
      if (e.key === ' ' || e.key === 'e' || e.key === 'E') {
        e.preventDefault();
        engine.performAction();
        setPlayerState({ ...engine.player });
        setInventory([...engine.inventory]);
        return;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.delete(e.key.toLowerCase());

      const engine = engineRef.current;
      if (engine) {
        if (e.key === 'Shift') {
          engine.player.isSprinting = false;
          setPlayerState((prev) => ({ ...prev, isSprinting: false }));
        }
        if (keysPressed.size === 0) {
          engine.stopMoving();
        }
      }
    };

    const moveInterval = setInterval(() => {
      const engine = engineRef.current;
      if (!engine) return;

      let dx = 0;
      let dy = 0;

      if (keysPressed.has('w') || keysPressed.has('arrowup')) dy -= 1;
      if (keysPressed.has('s') || keysPressed.has('arrowdown')) dy += 1;
      if (keysPressed.has('a') || keysPressed.has('arrowleft')) dx -= 1;
      if (keysPressed.has('d') || keysPressed.has('arrowright')) dx += 1;

      if (dx !== 0 || dy !== 0) {
        engine.movePlayer(dx, dy);
      }
    }, 16);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      clearInterval(moveInterval);
    };
  }, [isLandingOpen]);

  // Tap-to-Interact on canvas
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isLandingOpen) return;
    sounds.initOnUserAction();
    const canvas = canvasRef.current;
    const engine = engineRef.current;
    if (!canvas || !engine) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left + engine.cameraX;
    const clickY = e.clientY - rect.top + engine.cameraY;

    const clickedCol = Math.floor(clickX / TILE_SIZE);
    const clickedRow = Math.floor(clickY / TILE_SIZE);

    if (clickedCol >= 0 && clickedCol < MAP_COLS && clickedRow >= 0 && clickedRow < MAP_ROWS) {
      const playerCol = Math.floor((engine.player.x + TILE_SIZE / 2) / TILE_SIZE);
      const playerRow = Math.floor((engine.player.y + TILE_SIZE / 2) / TILE_SIZE);

      const dCol = clickedCol - playerCol;
      const dRow = clickedRow - playerRow;

      if (Math.abs(dCol) > Math.abs(dRow)) {
        engine.player.direction = dCol > 0 ? 'right' : 'left';
      } else {
        engine.player.direction = dRow > 0 ? 'down' : 'up';
      }

      if (Math.hypot(dCol, dRow) <= 1.8) {
        engine.performAction();
        setPlayerState({ ...engine.player });
        setInventory([...engine.inventory]);
      } else {
        engine.movePlayer(Math.sign(dCol), Math.sign(dRow));
      }
    }
  };

  const handleVirtualMove = useCallback((dx: number, dy: number, isSprinting?: boolean) => {
    sounds.initOnUserAction();
    const engine = engineRef.current;
    if (engine) engine.movePlayer(dx, dy, isSprinting);
  }, []);

  const handleVirtualStopMove = useCallback(() => {
    const engine = engineRef.current;
    if (engine) engine.stopMoving();
  }, []);

  const handleVirtualAction = useCallback(() => {
    sounds.initOnUserAction();
    const engine = engineRef.current;
    if (engine) {
      engine.performAction();
      setPlayerState({ ...engine.player });
      setInventory([...engine.inventory]);
    }
  }, []);

  const handleToggleSprint = useCallback(() => {
    sounds.initOnUserAction();
    const engine = engineRef.current;
    if (!engine) return;
    const newSprint = !engine.player.isSprinting;
    engine.player.isSprinting = newSprint;
    setPlayerState((prev) => ({ ...prev, isSprinting: newSprint }));
  }, []);

  const handleCycleTool = useCallback(() => {
    sounds.initOnUserAction();
    const engine = engineRef.current;
    if (!engine) return;
    const nextSlot = (engine.player.selectedSlot + 1) % engine.inventory.length;
    engine.player.selectedSlot = nextSlot;
    setPlayerState((prev) => ({ ...prev, selectedSlot: nextSlot }));
  }, []);

  const handleQuickEat = useCallback(() => {
    sounds.initOnUserAction();
    const engine = engineRef.current;
    if (!engine) return;
    const foodItem = engine.inventory.find((i) => i.category === 'food' && i.count > 0);
    if (foodItem && foodItem.energyBonus) {
      foodItem.count--;
      engine.player.stamina = Math.min(engine.player.maxStamina, engine.player.stamina + foodItem.energyBonus);
      sounds.playEat();
      engine.addFloatingText(`+${foodItem.energyBonus} Stamina!`, engine.player.x, engine.player.y - 12, '#22c55e');
      setPlayerState({ ...engine.player });
      setInventory([...engine.inventory]);
    } else {
      engine.addFloatingText('Tidak ada makanan di ransel!', engine.player.x, engine.player.y - 12, '#f97316');
    }
  }, []);

  const handleSaveGame = () => {
    sounds.initOnUserAction();
    const engine = engineRef.current;
    if (!engine) return;

    const data = {
      player: engine.player,
      time: engine.time,
      inventory: engine.inventory,
      shippingBin: engine.shippingBinItems,
      landPlots: engine.landPlots,
      savedAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(data));
      setHasSaveData(true);
      sounds.playCoin();
      engine.addFloatingText('💾 Permainan Disimpan!', engine.player.x, engine.player.y - 14, '#22c55e');
    } catch {
      alert('Gagal menyimpan ke LocalStorage');
    }
  };

  const handleBuyCash = (plotId: string) => {
    sounds.initOnUserAction();
    const engine = engineRef.current;
    if (!engine) return;
    const res = engine.buyLandPlotCash(plotId);
    if (res.success) {
      setPlayerState({ ...engine.player });
      setLandPlots([...engine.landPlots]);
    } else {
      sounds.playStaminaExhausted();
      engine.addFloatingText(res.message, engine.player.x, engine.player.y - 14, '#ef4444');
    }
  };

  const handleBuyCredit = (plotId: string) => {
    sounds.initOnUserAction();
    const engine = engineRef.current;
    if (!engine) return;
    const res = engine.buyLandPlotCredit(plotId);
    if (res.success) {
      setPlayerState({ ...engine.player });
      setLandPlots([...engine.landPlots]);
    } else {
      sounds.playStaminaExhausted();
      engine.addFloatingText(res.message, engine.player.x, engine.player.y - 14, '#ef4444');
    }
  };

  const handleToggleMute = () => {
    const muted = sounds.toggleMute();
    setIsMuted(muted);
  };

  const handleBuyItem = (item: InventoryItem) => {
    const engine = engineRef.current;
    if (!engine || engine.player.kujangCoins < item.buyPrice) return;

    engine.player.kujangCoins -= item.buyPrice;
    engine.addItemToInventory({ ...item, count: 1 });
    engine.addFloatingText(`Beli ${item.name}!`, engine.player.x, engine.player.y - 14, '#facc15');

    setPlayerState({ ...engine.player });
    setInventory([...engine.inventory]);
  };

  const handleSellItem = (itemId: string) => {
    const engine = engineRef.current;
    if (!engine) return;

    const item = engine.inventory.find((i) => i.id === itemId);
    if (item && item.count > 0 && item.sellPrice > 0) {
      item.count--;
      engine.player.kujangCoins += item.sellPrice;
      engine.addFloatingText(`+${item.sellPrice} Kujang!`, engine.player.x, engine.player.y - 14, '#4ade80');

      if (item.count <= 0 && item.category !== 'tool') {
        engine.inventory = engine.inventory.filter((i) => i.id !== itemId);
      }

      setPlayerState({ ...engine.player });
      setInventory([...engine.inventory]);
    }
  };

  const handleDepositShipping = (item: InventoryItem) => {
    const engine = engineRef.current;
    if (!engine || item.count <= 0) return;

    item.count--;
    const binItem = engine.shippingBinItems.find((i) => i.id === item.id);
    if (binItem) {
      binItem.count++;
    } else {
      engine.shippingBinItems.push({ ...item, count: 1 });
    }

    if (item.count <= 0 && item.category !== 'tool') {
      engine.inventory = engine.inventory.filter((i) => i.id !== item.id);
    }

    setInventory([...engine.inventory]);
  };

  const handleConfirmSleep = () => {
    setIsBedPromptOpen(false);
    const engine = engineRef.current;
    if (engine) {
      engine.advanceDay(false);
      setPlayerState({ ...engine.player });
      setGameTime({ ...engine.time });
      setInventory([...engine.inventory]);
    }
  };

  return (
    <main className="relative w-screen h-screen bg-stone-950 overflow-hidden font-sans select-none">
      {/* 2D HTML5 Game Canvas */}
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        className="absolute inset-0 w-full h-full cursor-pointer touch-none"
        style={{ imageRendering: 'pixelated' }}
      />

      {/* Atmospheric Weather Overlay (Rain, Mist, God Rays) */}
      <WeatherOverlay isRaining={isRaining} time={gameTime} />

      {/* Landing Page Overlay */}
      {isLandingOpen ? (
        <LandingPage
          onStartGame={() => setIsLandingOpen(false)}
          hasSaveData={hasSaveData}
        />
      ) : (
        <>
          {/* Top HUD */}
          <GameHUD
            time={gameTime}
            player={playerState}
            isRaining={isRaining}
            isMuted={isMuted}
            touchControlsActive={touchControlsActive}
            currentFestival={currentFestival}
            onToggleMute={handleToggleMute}
            onToggleTouchControls={() => setTouchControlsActive((prev) => !prev)}
            onSaveGame={handleSaveGame}
            onOpenExport={() => setIsExportOpen(true)}
            onOpenHelp={() => setIsHelpOpen(true)}
            onOpenLanding={() => setIsLandingOpen(true)}
            onOpenLandModal={() => {
              setSelectedPlotForModal(null);
              setIsLandModalOpen(true);
            }}
          />

          {/* Bottom Inventory Hotbar */}
          <Hotbar
            inventory={inventory}
            selectedSlot={playerState.selectedSlot}
            onSelectSlot={(slot) => {
              sounds.initOnUserAction();
              const engine = engineRef.current;
              if (engine) {
                engine.player.selectedSlot = slot;
                setPlayerState((prev) => ({ ...prev, selectedSlot: slot }));
              }
            }}
          />

          {/* Virtual Touch Controls */}
          {touchControlsActive && (
            <VirtualControls
              onMove={handleVirtualMove}
              onStopMove={handleVirtualStopMove}
              onAction={handleVirtualAction}
              onCycleTool={handleCycleTool}
              onQuickEat={handleQuickEat}
              isSprinting={playerState.isSprinting}
              onToggleSprint={handleToggleSprint}
            />
          )}

          {/* Sleep in Saung Confirmation Modal */}
          {isBedPromptOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
              <div className="relative w-full max-w-sm bg-stone-900 border-2 border-amber-500 rounded-3xl p-5 shadow-2xl text-stone-100 flex flex-col gap-4 text-center">
                <div className="text-4xl">🛏️</div>
                <h3 className="text-xl font-bold text-amber-200">Istirahat di Saung Bambu</h3>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Tidur di atas bale-bale samak pandan hingga fajar (06:00 enjing).
                  Stamina Anda akan pulih 100% dan tanaman sawah akan bertumbuh!
                </p>
                <div className="flex gap-2.5 pt-2">
                  <button
                    onClick={() => setIsBedPromptOpen(false)}
                    className="flex-1 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-bold uppercase tracking-wider"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleConfirmSleep}
                    className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg"
                  >
                    Tidur Nyenyak
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Multi-NPC Dialog Modal */}
          {selectedNpcId && (
            <DialogModal
              npcId={selectedNpcId}
              currentFestival={currentFestival}
              onClose={() => setSelectedNpcId(null)}
              onOpenShop={() => setIsShopOpen(true)}
              onOpenGuide={() => setIsHelpOpen(true)}
            />
          )}

          {/* Abah Surya & Mang Jaja Shop Modal */}
          {isShopOpen && (
            <ShopModal
              player={playerState}
              inventory={inventory}
              shopNpcId={selectedNpcId}
              currentFestival={currentFestival}
              onClose={() => setIsShopOpen(false)}
              onBuyItem={handleBuyItem}
              onSellItem={handleSellItem}
            />
          )}

          {/* Shipping Bin Modal */}
          {isShippingBinOpen && (
            <ShippingBinModal
              inventory={inventory}
              shippingBinItems={engineRef.current?.shippingBinItems || []}
              onClose={() => setIsShippingBinOpen(false)}
              onDepositItem={handleDepositShipping}
            />
          )}

          {/* Daily Sales Report Modal */}
          {isDailyReportOpen && dailyReportData && (
            <DailyReportModal
              report={dailyReportData}
              time={gameTime}
              isRaining={isRaining}
              onClose={() => setIsDailyReportOpen(false)}
            />
          )}

          {/* Agriculture & Controls Help Modal */}
          {isHelpOpen && <HelpModal onClose={() => setIsHelpOpen(false)} />}

          {/* Single File Export Modal */}
          {isExportOpen && <SingleFileExportModal onClose={() => setIsExportOpen(false)} />}

          {/* Land Purchase & Credit Installment Modal */}
          <LandPurchaseModal
            isOpen={isLandModalOpen}
            onClose={() => setIsLandModalOpen(false)}
            landPlots={landPlots.length > 0 ? landPlots : (engineRef.current?.landPlots || [])}
            playerKujang={playerState.kujangCoins}
            initialSelectedPlotId={selectedPlotForModal}
            onBuyCash={handleBuyCash}
            onBuyCredit={handleBuyCredit}
          />

          {/* Elegant Branding & Copyright Footer */}
          <footer className="absolute bottom-1 left-0 right-0 z-20 pointer-events-none text-center">
            <p className="text-[10px] sm:text-[11px] text-amber-300/80 bg-stone-950/70 inline-block px-3 py-0.5 rounded-full backdrop-blur-sm border border-amber-800/40">
              "Parahyangan: A Harvest Tale" | Diciptakan oleh: <strong>Pak GuruAI</strong> | @Copyright by. Pak GuruAI
            </p>
          </footer>
        </>
      )}
    </main>
  );
}
