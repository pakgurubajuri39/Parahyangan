/**
 * Generates the complete, self-contained single-file HTML version
 * Ready for Google Apps Script Web App (HtmlService.createHtmlOutput) or direct browser double-click!
 * Pencipta: Pak GuruAI
 * Hak Cipta: @Copyright by. Pak GuruAI
 */

export function generateSingleFileHTML(): string {
  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
  <title>Parahyangan: A Harvest Tale - by Pak GuruAI</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=Cinzel:wght@700&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: 'Plus Jakarta Sans', sans-serif;
      margin: 0;
      padding: 0;
      overflow: hidden;
      background-color: #0c0a09;
      user-select: none;
      -webkit-user-select: none;
      touch-action: none;
    }
    canvas {
      image-rendering: -moz-crisp-edges;
      image-rendering: -webkit-crisp-edges;
      image-rendering: pixelated;
      image-rendering: crisp-edges;
      display: block;
    }
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: rgba(28, 25, 23, 0.6); border-radius: 4px; }
    ::-webkit-scrollbar-thumb { background: rgba(217, 119, 6, 0.6); border-radius: 4px; }
  </style>
</head>
<body class="relative w-screen h-screen bg-stone-950 flex flex-col items-center justify-center">

  <!-- Landing Page Overlay -->
  <div id="landingPage" class="absolute inset-0 z-40 bg-stone-950 text-stone-100 flex flex-col overflow-hidden">
    <!-- Header with Top Tabs -->
    <header class="border-b border-amber-800/40 bg-stone-950/90 backdrop-blur-md px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xl">
      <div class="flex items-center gap-2.5">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-amber-800 border-2 border-amber-400 flex items-center justify-center text-xl shadow-lg">🌾</div>
        <div>
          <h1 class="text-base sm:text-lg font-black text-amber-200 uppercase font-serif">Parahyangan: A Harvest Tale</h1>
          <p class="text-[10px] text-amber-400/90">Diciptakan oleh: Pak GuruAI</p>
        </div>
      </div>

      <nav class="flex items-center gap-1 bg-stone-900/90 border border-amber-700/50 rounded-2xl p-1">
        <button onclick="switchTab('beranda')" id="tabBtn_beranda" class="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-amber-700 text-white">✨ Beranda</button>
        <button onclick="switchTab('cara_main')" id="tabBtn_cara_main" class="px-3.5 py-1.5 rounded-xl text-xs font-bold text-stone-300 hover:text-white">📖 Cara Main</button>
        <button onclick="switchTab('karakter')" id="tabBtn_karakter" class="px-3.5 py-1.5 rounded-xl text-xs font-bold text-stone-300 hover:text-white">👥 Karakter</button>
        <button onclick="switchTab('tentang')" id="tabBtn_tentang" class="px-3.5 py-1.5 rounded-xl text-xs font-bold text-stone-300 hover:text-white">ℹ️ Tentang Game</button>
      </nav>
    </header>

    <!-- Tab Contents -->
    <div class="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col items-center justify-center">
      <!-- Beranda -->
      <div id="tabContent_beranda" class="max-w-3xl w-full flex flex-col items-center text-center space-y-6 my-auto">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-900/40 border border-amber-600/50 text-amber-300 text-xs font-semibold">
          <span>⛰️ Simulasi Pertanian Tradisional Sunda</span> • <span class="text-emerald-400">Priangan Jawa Barat</span>
        </div>
        <div class="space-y-2">
          <h2 class="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-400 font-serif">Parahyangan: A Harvest Tale</h2>
          <p className="text-sm sm:text-base text-stone-300 max-w-xl mx-auto leading-relaxed">
            Nikmati ketenangan desa di lereng gunung. Bercocok tanam Padi Pandan Wangi, merawat Domba Garut, mengalirkan Talang Bambu, dan temui sesepuh Abah Surya.
          </p>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-2xl text-left text-xs">
          <div class="p-3 rounded-2xl bg-stone-900 border border-amber-800/40">🌾 <strong>Padi Pandan Wangi</strong><p class="text-[10px] text-stone-400">Khas Cianjur harum pulen</p></div>
          <div class="p-3 rounded-2xl bg-stone-900 border border-amber-800/40">🎋 <strong>Talang Bambu</strong><p class="text-[10px] text-stone-400">Irigasi sawah otomatis</p></div>
          <div class="p-3 rounded-2xl bg-stone-900 border border-amber-800/40">🐑 <strong>Domba Garut</strong><p class="text-[10px] text-stone-400">Ternak domba & ayam</p></div>
          <div class="p-3 rounded-2xl bg-stone-900 border border-amber-800/40">🎶 <strong>Gamelan Degung</strong><p class="text-[10px] text-stone-400">Alunan nada Salendro</p></div>
        </div>
        <button onclick="startGame()" class="w-full max-w-md py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-700 text-white font-black text-sm uppercase tracking-wider shadow-2xl active:scale-95 transition-all">
          ▶ Mulai Petualangan Tani Sekarang
        </button>
      </div>

      <!-- Cara Main -->
      <div id="tabContent_cara_main" class="hidden max-w-3xl w-full bg-stone-900 border border-amber-700/60 rounded-3xl p-6 space-y-4 text-xs">
        <h3 class="text-xl font-bold text-amber-200">Panduan & Cara Main</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div class="p-4 rounded-xl bg-stone-950 border border-stone-800">
            <h4 class="font-bold text-amber-300 mb-1">⌨️ Keyboard (PC / Laptop)</h4>
            <p>• Gerak: [W, A, S, D] atau Panah.</p>
            <p>• Lari: Tahan [Shift] untuk sprint!</p>
            <p>• Aksi: [Spasi] atau [E] (Cangkul, Siram, Tanam, Panen, Elus Hewan, Ngobrol).</p>
            <p>• Slot Alat: Angka [1] sampai [7].</p>
          </div>
          <div class="p-4 rounded-xl bg-stone-950 border border-stone-800">
            <h4 class="font-bold text-emerald-300 mb-1">📱 Layar Sentuh (HP & Tablet)</h4>
            <p>• D-Pad kiri bawah untuk berjalan lancar.</p>
            <p>• Tombol [AKSI] hijau untuk interaksi.</p>
            <p>• Tombol [LARI] untuk sprint cepat.</p>
            <p>• Tombol [MAKAN] untuk pulihkan stamina.</p>
          </div>
        </div>
        <button onclick="startGame()" class="w-full py-3 rounded-xl bg-amber-600 text-white font-bold uppercase">Mainkan Sekarang</button>
      </div>

      <!-- Karakter -->
      <div id="tabContent_karakter" class="hidden max-w-3xl w-full bg-stone-900 border border-amber-700/60 rounded-3xl p-6 space-y-4 text-xs">
        <h3 class="text-xl font-bold text-amber-200">Karakter Desa Parahyangan</h3>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div class="p-3 bg-stone-950 rounded-xl border border-stone-800">
            <span class="text-3xl">👴🏽</span>
            <p class="font-bold text-amber-300 mt-1">Abah Surya</p>
            <p class="text-stone-400 text-[10px]">Sesepuh desa penyedia bibit & talang awi.</p>
          </div>
          <div class="p-3 bg-stone-950 rounded-xl border border-stone-800">
            <span class="text-3xl">👩🏽‍🌾</span>
            <p class="font-bold text-rose-300 mt-1">Neng Ceuceu</p>
            <p class="text-stone-400 text-[10px]">Pemetik teh manis di lereng bukit.</p>
          </div>
          <div class="p-3 bg-stone-950 rounded-xl border border-stone-800">
            <span class="text-3xl">👨🏽‍🌾</span>
            <p class="font-bold text-emerald-300 mt-1">Mang Ujang</p>
            <p class="text-stone-400 text-[10px]">Peternak domba Garut & ayam kampung.</p>
          </div>
        </div>
        <button onclick="startGame()" class="w-full py-3 rounded-xl bg-amber-600 text-white font-bold uppercase">Mulai Main</button>
      </div>

      <!-- Tentang -->
      <div id="tabContent_tentang" class="hidden max-w-2xl w-full bg-stone-900 border border-amber-700/60 rounded-3xl p-6 space-y-4 text-xs">
        <h3 class="text-xl font-bold text-amber-200">Tentang Game</h3>
        <p class="text-stone-300 leading-relaxed">
          "Parahyangan: A Harvest Tale" dibuat sebagai simulasi agrikultur budaya Priangan dengan nilai kearifan lokal Sunda.
        </p>
        <div class="p-3 rounded-xl bg-stone-950 border border-amber-800/60 text-center">
          <p class="font-bold text-amber-200">"Parahyangan: A Harvest Tale"</p>
          <p class="text-stone-300">Pencipta: <strong>Pak GuruAI</strong></p>
          <p class="text-[10px] text-amber-400 font-mono">@Copyright by. Pak GuruAI</p>
        </div>
        <button onclick="startGame()" class="w-full py-3 rounded-xl bg-amber-600 text-white font-bold uppercase">Mulai Petualangan</button>
      </div>
    </div>

    <footer class="border-t border-amber-900/40 bg-stone-950/90 py-2.5 px-4 text-center text-[11px] text-amber-300/80">
      "Parahyangan: A Harvest Tale" | Diciptakan oleh: <strong>Pak GuruAI</strong> | @Copyright by. Pak GuruAI
    </footer>
  </div>

  <!-- Game Main Screen -->
  <div id="game-container" class="relative w-full h-full flex items-center justify-center overflow-hidden">
    <canvas id="gameCanvas"></canvas>

    <!-- Top HUD Header -->
    <header class="absolute top-0 left-0 right-0 z-20 pointer-events-none p-2 sm:p-4">
      <div class="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div class="flex items-center gap-2">
          <button onclick="openLandingPage()" class="pointer-events-auto bg-amber-950/85 border border-amber-700/60 rounded-xl px-2.5 py-2 shadow-lg text-amber-200 hover:text-white text-xs font-bold">
            🏠 Menu
          </button>
          <div class="pointer-events-auto bg-amber-950/85 backdrop-blur-md border border-amber-700/60 rounded-xl px-3 py-2 shadow-lg flex items-center gap-3">
            <div class="flex flex-col">
              <div class="flex justify-between items-center text-xs font-semibold mb-1">
                <span class="text-amber-200 flex items-center gap-1">⚡ Stamina</span>
                <span id="staminaText" class="text-[11px] font-mono text-amber-300">100 / 100</span>
              </div>
              <div class="w-32 sm:w-44 h-3 bg-stone-900/90 rounded-full overflow-hidden p-0.5 border border-stone-700">
                <div id="staminaBar" class="h-full rounded-full transition-all duration-300 bg-gradient-to-r from-emerald-500 to-lime-400" style="width: 100%;"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="pointer-events-auto bg-amber-950/85 backdrop-blur-md border border-amber-700/60 rounded-xl px-3.5 py-1.5 shadow-lg flex items-center gap-3 text-amber-100">
          <div id="weatherIcon" class="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-900/50 border border-amber-600/40 text-amber-300 text-lg">☀️</div>
          <div class="flex flex-col text-left">
            <div class="text-[11px] text-amber-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <span id="seasonName">Musim Kasa</span> • <span id="dayCount" class="text-emerald-400">Poé ka-1</span>
            </div>
            <div class="text-sm sm:text-base font-extrabold font-mono tracking-tight text-white flex items-center gap-2">
              <span id="clockText">🕒 06:00</span>
            </div>
          </div>
        </div>

        <div class="pointer-events-auto flex items-center gap-2 self-end sm:self-auto">
          <div class="bg-amber-950/85 backdrop-blur-md border border-amber-700/60 rounded-xl px-3 py-1.5 shadow-lg flex items-center gap-2">
            <span class="text-lg">🗡️</span>
            <div class="flex flex-col">
              <span class="text-[10px] text-amber-400 uppercase tracking-widest font-semibold">Kujang Emas</span>
              <span id="kujangText" class="text-sm sm:text-base font-black text-amber-200 font-mono">120</span>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Bottom Hotbar -->
    <div class="absolute bottom-16 sm:bottom-12 left-0 right-0 z-20 pointer-events-none flex flex-col items-center gap-1 select-none px-2">
      <div id="hotbarTooltip" class="pointer-events-auto bg-amber-950/90 backdrop-blur-md border border-amber-600/60 rounded-full px-3 py-1 shadow-md text-center max-w-sm">
        <p id="hotbarTooltipText" class="text-xs font-bold text-amber-200">⛏️ Cangkul (Pacul)</p>
      </div>
      <div id="hotbarSlots" class="pointer-events-auto bg-stone-950/85 backdrop-blur-lg border-2 border-amber-800/80 rounded-2xl p-1.5 shadow-2xl flex items-center gap-1 sm:gap-2"></div>
    </div>

    <!-- Virtual Touch Controls -->
    <div id="virtualControls" class="absolute inset-0 pointer-events-none z-30 select-none overflow-hidden">
      <!-- Touch Analog Joystick -->
      <div id="joystickZone" class="absolute bottom-20 sm:bottom-16 left-3 sm:left-6 pointer-events-auto flex flex-col items-center gap-1">
        <div id="joystickBase" class="relative w-36 h-36 bg-stone-900/50 backdrop-blur-md rounded-full border-2 border-amber-500/40 shadow-2xl flex items-center justify-center touch-none">
          <div class="absolute inset-4 rounded-full border border-amber-600/20 pointer-events-none"></div>
          <div class="absolute w-full h-[1px] bg-amber-500/20 pointer-events-none"></div>
          <div class="absolute h-full w-[1px] bg-amber-500/20 pointer-events-none"></div>
          <div id="joystickKnob" class="absolute w-14 h-14 rounded-full bg-gradient-to-br from-amber-500 via-amber-600 to-amber-800 border-2 border-amber-300 shadow-xl flex items-center justify-center text-white text-xs font-black transition-transform duration-75">
            ❖
          </div>
        </div>
        <span class="text-[9px] font-bold text-amber-400/80 uppercase tracking-widest">Analog 360°</span>
      </div>

      <div class="absolute bottom-20 sm:bottom-16 right-3 sm:right-6 pointer-events-auto flex items-end gap-2">
        <div class="flex flex-col gap-2">
          <button id="btnSprint" onclick="toggleSprint()" class="w-12 h-12 rounded-full bg-stone-800/90 border-2 border-stone-600 text-stone-300 flex flex-col items-center justify-center shadow-lg active:scale-90">
            <span class="text-base">🏃</span>
            <span id="sprintLabel" class="text-[8px] font-bold uppercase">JALAN</span>
          </button>
          <button id="btnQuickEat" class="w-12 h-12 rounded-full bg-amber-800/90 border-2 border-amber-500 text-amber-100 flex flex-col items-center justify-center shadow-lg active:scale-90">
            <span class="text-base">🍲</span>
            <span class="text-[8px] font-bold uppercase">Makan</span>
          </button>
          <button id="btnCycleTool" class="w-12 h-12 rounded-full bg-stone-800/90 border-2 border-amber-600 text-amber-200 flex flex-col items-center justify-center shadow-lg active:scale-90">
            <span class="text-base">🔄</span>
            <span class="text-[8px] font-bold uppercase">Alat</span>
          </button>
        </div>

        <button id="btnMainAction" class="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-gradient-to-br from-emerald-500 to-green-700 border-4 border-amber-300 text-white flex flex-col items-center justify-center shadow-2xl active:scale-90">
          <span class="text-2xl sm:text-3xl leading-none">⚡</span>
          <span class="text-[10px] font-black tracking-wider uppercase mt-0.5">AKSI</span>
        </button>
      </div>
    </div>

    <!-- NPC Dialog Modal -->
    <div id="modalNpc" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div class="relative w-full max-w-lg bg-stone-900 border-2 border-amber-600 rounded-3xl p-5 sm:p-6 shadow-2xl text-stone-100 flex flex-col gap-4">
        <button onclick="closeModal('modalNpc')" class="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-800 text-stone-300 flex items-center justify-center">✕</button>
        <div class="flex items-center gap-4 border-b border-amber-700/50 pb-4">
          <div id="npcAvatar" class="w-16 h-16 rounded-2xl bg-amber-950 border-2 border-amber-500 flex items-center justify-center text-3xl">👴🏽</div>
          <div>
            <h3 id="npcName" class="text-xl font-black text-amber-200">Abah Surya</h3>
            <p id="npcTitle" class="text-xs text-amber-400">“Someah hadé ka sémah, mikanyaah ka bumi alam Parahyangan.”</p>
          </div>
        </div>
        <div class="bg-amber-950/60 border border-amber-700/50 rounded-2xl p-4 min-h-[90px] flex items-center">
          <p id="npcDialogText" class="text-sm sm:text-base text-amber-100 leading-relaxed font-serif"></p>
        </div>
        <div class="flex justify-end gap-2 pt-2">
          <button onclick="closeModal('modalNpc')" class="px-5 py-2.5 rounded-xl bg-amber-700 text-white font-bold text-xs uppercase">Hatur Nuhun</button>
        </div>
      </div>
    </div>

    <footer class="absolute bottom-1 left-0 right-0 z-20 pointer-events-none text-center">
      <p class="text-[10px] sm:text-[11px] text-amber-300/80 bg-stone-950/70 inline-block px-3 py-0.5 rounded-full backdrop-blur-sm border border-amber-800/40">
        "Parahyangan: A Harvest Tale" | Diciptakan oleh: Pak GuruAI | @Copyright by. Pak GuruAI
      </p>
    </footer>
  </div>

  <script>
    (function() {
      let isSprinting = false;
      let inGame = false;

      window.switchTab = function(tabName) {
        ['beranda', 'cara_main', 'karakter', 'tentang'].forEach(t => {
          document.getElementById('tabContent_' + t).classList.add('hidden');
          const btn = document.getElementById('tabBtn_' + t);
          btn.className = "px-3.5 py-1.5 rounded-xl text-xs font-bold text-stone-300 hover:text-white";
        });
        document.getElementById('tabContent_' + tabName).classList.remove('hidden');
        document.getElementById('tabBtn_' + tabName).className = "px-3.5 py-1.5 rounded-xl text-xs font-bold bg-amber-700 text-white";
      };

      window.startGame = function() {
        document.getElementById('landingPage').classList.add('hidden');
        inGame = true;
      };

      window.openLandingPage = function() {
        document.getElementById('landingPage').classList.remove('hidden');
        inGame = false;
      };

      window.toggleSprint = function() {
        isSprinting = !isSprinting;
        const btn = document.getElementById('btnSprint');
        const lbl = document.getElementById('sprintLabel');
        if (isSprinting) {
          btn.className = "w-12 h-12 rounded-full bg-amber-500 border-2 border-yellow-200 text-stone-950 flex flex-col items-center justify-center shadow-lg active:scale-90 font-black";
          lbl.innerText = "LARI";
        } else {
          btn.className = "w-12 h-12 rounded-full bg-stone-800/90 border-2 border-stone-600 text-stone-300 flex flex-col items-center justify-center shadow-lg active:scale-90";
          lbl.innerText = "JALAN";
        }
      };

      let audioCtx = null;
      function getAudioContext() {
        if (!audioCtx) {
          const AudioClass = window.AudioContext || window.webkitAudioContext;
          if (AudioClass) audioCtx = new AudioClass();
        }
        if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
        return audioCtx;
      }

      function playSound(type) {
        const ctx = getAudioContext();
        if (!ctx) return;
        const now = ctx.currentTime;
        if (type === 'hoe') {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(140, now);
          osc.frequency.exponentialRampToValueAtTime(40, now + 0.12);
          gain.gain.setValueAtTime(0.3, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.14);
          osc.connect(gain); gain.connect(ctx.destination);
          osc.start(); osc.stop(now + 0.15);
        } else if (type === 'water') {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(400, now);
          osc.frequency.exponentialRampToValueAtTime(200, now + 0.15);
          gain.gain.setValueAtTime(0.2, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
          osc.connect(gain); gain.connect(ctx.destination);
          osc.start(); osc.stop(now + 0.15);
        } else if (type === 'harvest') {
          [390, 438, 520, 656].forEach((f, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(f, now + i * 0.05);
            gain.gain.setValueAtTime(0.2, now + i * 0.05);
            gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.05 + 0.3);
            osc.connect(gain); gain.connect(ctx.destination);
            osc.start(now + i * 0.05); osc.stop(now + i * 0.05 + 0.35);
          });
        }
      }

      const TILE_SIZE = 36;
      const MAP_COLS = 64;
      const MAP_ROWS = 48;

      const player = {
        x: 8 * TILE_SIZE,
        y: 9 * TILE_SIZE,
        direction: 'down',
        stamina: 100,
        maxStamina: 100,
        kujangCoins: 120,
        selectedSlot: 0,
        animTimer: 0
      };

      const gameTime = { day: 1, hour: 6, minute: 0, season: 'kasa' };
      let isRaining = false;
      let isFishing = false;
      let fishingPhase = 'none';
      let fishingTimer = 0;
      let biteTimer = 0;
      let bobberX = 0;
      let bobberY = 0;
      let hookedFish = null;
      let bobberRipple = 0;

      const puddles = [
        { x: 8.5 * TILE_SIZE, y: 9.5 * TILE_SIZE, rx: 16, ry: 9, depth: 0 },
        { x: 15.5 * TILE_SIZE, y: 14.3 * TILE_SIZE, rx: 20, ry: 10, depth: 0 },
        { x: 22.0 * TILE_SIZE, y: 14.2 * TILE_SIZE, rx: 18, ry: 9, depth: 0 },
        { x: 30.5 * TILE_SIZE, y: 14.2 * TILE_SIZE, rx: 22, ry: 11, depth: 0 },
        { x: 42.0 * TILE_SIZE, y: 14.3 * TILE_SIZE, rx: 19, ry: 9, depth: 0 },
        { x: 13.5 * TILE_SIZE, y: 17.5 * TILE_SIZE, rx: 24, ry: 12, depth: 0 },
        { x: 20.0 * TILE_SIZE, y: 18.0 * TILE_SIZE, rx: 20, ry: 10, depth: 0 },
        { x: 44.0 * TILE_SIZE, y: 22.5 * TILE_SIZE, rx: 20, ry: 10, depth: 0 },
        { x: 25.0 * TILE_SIZE, y: 3.5 * TILE_SIZE, rx: 18, ry: 9, depth: 0 }
      ];
      const rainDrops = [];
      for (let i = 0; i < 75; i++) {
        rainDrops.push({ x: Math.random() * 1200, y: Math.random() * 800, speed: 12 + Math.random() * 6, len: 10 + Math.random() * 8 });
      }

      const inventory = [
        { id: 'tool_cangkul', name: 'Pacul / Cangkul', category: 'tool', toolType: 'cangkul', count: 1, icon: '⛏️' },
        { id: 'tool_gembor', name: 'Gembor Cai', category: 'tool', toolType: 'gembor', count: 1, icon: '🫖' },
        { id: 'tool_pancingan', name: 'Jeujeur Awi / Pancingan', category: 'tool', toolType: 'pancingan', count: 1, icon: '🎣' },
        { id: 'seed_padi', name: 'Bibit Padi Pandan Wangi', category: 'seed', toolType: 'bibit_padi', count: 8, icon: '🌾' },
        { id: 'seed_ubi', name: 'Bibit Ubi Cilembu', category: 'seed', toolType: 'bibit_ubi', count: 6, icon: '🍠' },
        { id: 'seed_teh', name: 'Bibit Teh Preanger', category: 'seed', toolType: 'bibit_teh', count: 4, icon: '🌱' },
        { id: 'mat_talang', name: 'Talang Bambu Irigasi', category: 'material', toolType: 'talang_bambu', count: 5, icon: '🎋' },
        { id: 'feed_unggas', name: 'Pakan Hayam & Bebek', category: 'feed', toolType: 'feed_unggas', count: 12, icon: '🌾' },
        { id: 'food_liwet', name: 'Nasi Liwet Parahyangan', category: 'food', toolType: 'nasi_liwet', count: 2, icon: '🍲' }
      ];

      const npcs = {
        abah: {
          id: 'abah_surya',
          name: 'Abah Surya',
          title: 'Sesepuh Desa Parahyangan',
          role: 'Guru Tani',
          x: 12,
          y: 10,
          avatar: '👴🏽',
          text: '“Sampurasun! Sing getol nyiram pepelakan pare pandan wangi.”',
          greetings: ['“Sampurasun incu Abah! Sejuk kieu hawa sawah...”', '“Sing sabar ngolah taneuh, beuki beuneur beuki tungkul.”']
        },
        ceuceu: {
          id: 'neng_ceuceu',
          name: 'Neng Ceuceu',
          title: 'Pemetik Teh Preanger',
          role: 'Kebun Teh',
          x: 34,
          y: 12,
          avatar: '👩🏽‍🌾',
          text: '“Wilujeng enjing Kang! Pucuk teh hejo parantos siap dipetik.”',
          greetings: ['“Wilujeng enjing Kang! Seungit pucuk teh nuju meujeuhna.”', '“Awas labuh dina galengan sawah, leueur Kang!”']
        },
        ujang: {
          id: 'mang_ujang',
          name: 'Mang Ujang',
          title: 'Peternak Domba Garut',
          role: 'Kandang Ternak',
          x: 40,
          y: 8,
          avatar: '👨🏽‍🌾',
          text: '“Rampes! Domba Garut abdi tandukna gagah, elus tiap dinten!”',
          greetings: ['“Rampes Kang! Domba Garut abdi garagah dinten ieu!”', '“Endog hayam kampung tos siap dicandak!”']
        },
        jaja: {
          id: 'mang_jaja',
          name: 'Mang Jaja',
          title: 'Pedagang Keliling & Pengrajin Awi',
          role: 'Pedagang Keliling',
          x: 26,
          y: 14,
          pxX: 26 * TILE_SIZE,
          pxY: 14 * TILE_SIZE,
          targetPxX: 26 * TILE_SIZE,
          targetPxY: 14 * TILE_SIZE,
          avatar: '🪵',
          text: '“Sampurasun! Binih cengek punjul sareng talang awi ukir... mangga dipilih!”',
          greetings: ['“Awi tali sareng binih cengek punjul!”', '“Nuju ngider keliling lembur yeuh, Kang!”', '“Jembatan awi anyar ieu kuat pisan!”'],
          schedule: [
            { start: 6, end: 9, x: 26, y: 14, loc: 'Jembatan Parit Awi Utama', act: 'Mengecek jembatan & talang awi' },
            { start: 9, end: 13, x: 11, y: 10, loc: 'Pelataran Saung Abah', act: 'Menggelar bursa bibit & anyaman' },
            { start: 13, end: 17, x: 32, y: 13, loc: 'Tepi Kebun Teh', act: 'Nawarkeun anyaman boboko' },
            { start: 17, end: 21, x: 40, y: 10, loc: 'Kandang Domba', act: 'Ngaso bari ngopi bajigur' },
            { start: 21, end: 24, x: 49, y: 14, loc: 'Gubug Pengrajin', act: 'Reureuh wengi' }
          ]
        }
      };

      const animals = [
        { type: 'domba', name: 'Si Jalu (Domba Garut)', x: 44 * TILE_SIZE, y: 6 * TILE_SIZE },
        { type: 'domba', name: 'Si Geulis', x: 47 * TILE_SIZE, y: 8 * TILE_SIZE },
        { type: 'ayam', name: 'Hayam Pelung', x: 16 * TILE_SIZE, y: 11 * TILE_SIZE, isFed: false, eggTimer: 300 },
        { type: 'ayam', name: 'Hayam Bikang', x: 17 * TILE_SIZE, y: 12 * TILE_SIZE, isFed: false, eggTimer: 180 },
        { type: 'bebek', name: 'Bebek Sawah', x: 19 * TILE_SIZE, y: 12 * TILE_SIZE, isFed: false, eggTimer: 240 },
        { type: 'bebek', name: 'Bebek Balong', x: 28 * TILE_SIZE, y: 20 * TILE_SIZE, isFed: false, eggTimer: 340 }
      ];

      const laidEggs = [
        { x: 17 * TILE_SIZE + 10, y: 10 * TILE_SIZE + 14, type: 'ayam' },
        { x: 28 * TILE_SIZE + 10, y: 20 * TILE_SIZE + 10, type: 'bebek' }
      ];

      const leafParticles = [];
      function addLeafParticle(x, y, type) {
        leafParticles.push({
          x: x + (Math.random() * 20 - 10),
          y: y + (Math.random() * 14 - 7),
          vx: 0.8 + Math.random() * 1.5,
          vy: 0.2 + Math.random() * 0.7,
          angle: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.08,
          flip: Math.random() * Math.PI,
          size: 5 + Math.random() * 3,
          color: type === 'golden' ? '#eab308' : '#16a34a',
          alpha: 1,
          life: 80
        });
      }

      const mapTiles = [];
      for (let r = 0; r < MAP_ROWS; r++) {
        const row = [];
        for (let c = 0; c < MAP_COLS; c++) {
          row.push({ kind: 'grass', crop: null, hasBambooAqueduct: false });
        }
        mapTiles.push(row);
      }

      // Saung Bambu Parahyangan (Cols 4..9, Rows 4..8)
      for (let r = 4; r <= 8; r++) {
        for (let c = 4; c <= 9; c++) {
          if (r === 4 || c === 4 || (c === 9 && r !== 7)) mapTiles[r][c].kind = 'wall_bamboo';
          else mapTiles[r][c].kind = 'wood_floor';
        }
      }
      mapTiles[5][5].kind = 'bed';
      mapTiles[7][10].kind = 'shipping_bin';

      // Kandang Ternak Awi (Cols 41..51, Rows 4..11)
      for (let r = 4; r <= 11; r++) {
        for (let c = 41; c <= 51; c++) {
          if (r === 4 || r === 11 || c === 51 || (c === 41 && r !== 8)) mapTiles[r][c].kind = 'wall_bamboo';
        }
      }

      // Peternakan Kecil Unggas (Cols 15..20, Rows 10..13)
      mapTiles[10][15].kind = 'wall_bamboo';
      mapTiles[10][16].kind = 'wall_bamboo';
      mapTiles[11][15].kind = 'wall_bamboo';
      mapTiles[11][16].kind = 'wood_floor';
      mapTiles[10][17].kind = 'hay_bale';
      mapTiles[10][18].kind = 'hay_bale';
      mapTiles[11][19].kind = 'trough';
      mapTiles[10][19].kind = 'fence';
      mapTiles[10][20].kind = 'fence';
      mapTiles[11][20].kind = 'fence';
      mapTiles[12][20].kind = 'fence';
      mapTiles[13][20].kind = 'fence';
      mapTiles[13][19].kind = 'fence';
      mapTiles[13][18].kind = 'fence';

      // Main thoroughfare path
      for (let c = 7; c <= 51; c++) mapTiles[14][c].kind = 'path';
      for (let r = 8; r <= 36; r++) mapTiles[r][7].kind = 'path';
      for (let c = 20; c <= 41; c++) mapTiles[7][c].kind = 'path';

      // Parit Sawah Canal
      for (let r = 0; r <= 27; r++) mapTiles[r][26].kind = 'water_canal';
      for (let c = 26; c <= 30; c++) mapTiles[20][c].kind = 'water_canal';
      for (let c = 14; c <= 26; c++) mapTiles[27][c].kind = 'water_canal';

      // Bridges over the canal (Cukang Awi)
      mapTiles[14][26].kind = 'bridge_bamboo';
      mapTiles[7][26].kind = 'bridge_bamboo';
      mapTiles[27][20].kind = 'bridge_bamboo';
      mapTiles[27][26].kind = 'bridge_bamboo';

      // Perimeter Trees & Forest Border
      for (let c = 0; c < MAP_COLS; c++) {
        if (c < 24 || c > 28) mapTiles[0][c].kind = 'tree_pinus';
        mapTiles[MAP_ROWS - 1][c].kind = c % 2 === 0 ? 'tree_kelapa' : 'tree_pisang';
      }
      for (let r = 0; r < MAP_ROWS; r++) {
        mapTiles[r][0].kind = 'tree_bambu';
        mapTiles[r][MAP_COLS - 1].kind = 'tree_bambu';
      }
      mapTiles[3][3].kind = 'tree_pisang';
      mapTiles[6][3].kind = 'tree_pisang';
      mapTiles[17][28].kind = 'tree_kelapa';
      mapTiles[28][28].kind = 'tree_kelapa';
      mapTiles[4][28].kind = 'tree_bambu';
      mapTiles[5][39].kind = 'tree_bambu';

      // Balong Empang (Expanded 29..43, 18..28)
      for (let r = 18; r <= 28; r++) {
        for (let c = 29; c <= 43; c++) mapTiles[r][c].kind = 'pond';
      }
      for (let r = 20; r <= 26; r++) {
        for (let c = 33; c <= 39; c++) mapTiles[r][c].kind = 'water_deep';
      }
      // Bamboo fishing pier (Dermaga Pancing Awi)
      mapTiles[23][40].kind = 'dock_bamboo';
      mapTiles[23][41].kind = 'dock_bamboo';
      mapTiles[23][42].kind = 'dock_bamboo';
      mapTiles[23][43].kind = 'dock_bamboo';
      mapTiles[23][44].kind = 'path';

      // Sawah Terasering Padi Utama
      for (let r = 16; r <= 25; r++) {
        for (let c = 10; c <= 24; c++) mapTiles[r][c].kind = 'soil_dry';
      }
      for (let c = 12; c <= 17; c++) {
        mapTiles[17][c].kind = 'soil_wet';
        mapTiles[17][c].crop = { type: 'padi', stage: 1, maxStages: 3 };
        mapTiles[16][c].hasBambooAqueduct = true;
      }

      // Kebun Teh Preanger
      for (let r = 5; r <= 11; r++) {
        for (let c = 30; c <= 38; c++) {
          mapTiles[r][c].kind = 'soil_wet';
          mapTiles[r][c].crop = { type: 'teh', stage: 2, maxStages: 3 };
        }
      }

      const canvas = document.getElementById('gameCanvas');
      const ctx = canvas.getContext('2d');
      let cameraX = 0, cameraY = 0;

      function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
      window.addEventListener('resize', resizeCanvas);
      resizeCanvas();

      let frameCount = 0;
      const keysDown = {};

      function gameLoop() {
        frameCount++;
        if (inGame) {
          // Relaxed and leisurely time pacing: 1 in-game minute = 20 frames
          if (frameCount % 20 === 0) {
            gameTime.minute++;
            if (gameTime.minute >= 60) {
              gameTime.minute = 0;
              gameTime.hour++;
              if (gameTime.hour >= 24) advanceDay();
            }
            updateHUD();
          }

          // Continuous Movement from Joystick or Keyboard
          let moveX = 0;
          let moveY = 0;
          if (keysDown['w'] || keysDown['ArrowUp']) moveY -= 1;
          if (keysDown['s'] || keysDown['ArrowDown']) moveY += 1;
          if (keysDown['a'] || keysDown['ArrowLeft']) moveX -= 1;
          if (keysDown['d'] || keysDown['ArrowRight']) moveX += 1;

          if (joyActive && (Math.abs(joyDx) > 0.08 || Math.abs(joyDy) > 0.08)) {
            moveX = joyDx;
            moveY = joyDy;
          }

          if (Math.abs(moveX) > 0.05 || Math.abs(moveY) > 0.05) {
            movePlayer(moveX, moveY);
          }

          // Update Mang Jaja movement along his schedule
          if (npcs.jaja && npcs.jaja.schedule) {
            const curSlot = npcs.jaja.schedule.find(s => gameTime.hour >= s.start && gameTime.hour < s.end) || npcs.jaja.schedule[0];
            npcs.jaja.targetPxX = curSlot.x * TILE_SIZE;
            npcs.jaja.targetPxY = curSlot.y * TILE_SIZE;
            const jdx = npcs.jaja.targetPxX - npcs.jaja.pxX;
            const jdy = npcs.jaja.targetPxY - npcs.jaja.pxY;
            if (Math.hypot(jdx, jdy) > 2) {
              const ang = Math.atan2(jdy, jdx);
              npcs.jaja.pxX += Math.cos(ang) * 1.0;
              npcs.jaja.pxY += Math.sin(ang) * 1.0;
              npcs.jaja.x = Math.round(npcs.jaja.pxX / TILE_SIZE);
              npcs.jaja.y = Math.round(npcs.jaja.pxY / TILE_SIZE);
            }
          }

          // Poultry egg laying simulation
          if (frameCount % 45 === 0) {
            animals.forEach(a => {
              if (a.type === 'ayam' || a.type === 'bebek') {
                if (a.eggTimer !== undefined) {
                  a.eggTimer -= a.isFed ? 75 : 45;
                  if (a.eggTimer <= 0) {
                    if (laidEggs.length < 18) {
                      laidEggs.push({
                        x: a.x + 8,
                        y: a.y + 12,
                        type: a.type
                      });
                    }
                    a.eggTimer = a.isFed ? 380 + Math.random() * 260 : 850 + Math.random() * 450;
                  }
                }
              }
            });
          }

          // Ambient tea breeze across Priangan hills
          if (frameCount % 24 === 0 && Math.random() < 0.8) {
            addLeafParticle((30 + Math.random() * 10) * TILE_SIZE, (4 + Math.random() * 8) * TILE_SIZE, 'tea');
          }

          // Update leaf particles
          for (let i = leafParticles.length - 1; i >= 0; i--) {
            const lp = leafParticles[i];
            lp.x += lp.vx + Math.sin(frameCount * 0.1) * 0.8;
            lp.y += lp.vy;
            lp.angle += lp.rotSpeed;
            lp.flip += 0.08;
            lp.life--;
            if (lp.life <= 0) leafParticles.splice(i, 1);
          }

          // Fishing update
          if (isFishing) {
            bobberRipple++;
            if (fishingPhase === 'waiting') {
              fishingTimer--;
              if (fishingTimer <= 0) {
                fishingPhase = 'bite';
                biteTimer = 110;
                const pool = [
                  { id: 'fish_mas', name: 'Lauk Mas Kancra', price: 38, icon: '🐟' },
                  { id: 'fish_gurame', name: 'Lauk Gurame Priangan', price: 55, icon: '🐠' },
                  { id: 'fish_nila', name: 'Lauk Nila Balong', price: 26, icon: '🐟' }
                ];
                hookedFish = pool[Math.floor(Math.random() * pool.length)];
                playSound('coin');
              }
            } else if (fishingPhase === 'bite') {
              biteTimer--;
              if (biteTimer <= 0) {
                isFishing = false;
                fishingPhase = 'none';
                hookedFish = null;
              }
            }
          }
        }
        render();
        requestAnimationFrame(gameLoop);
      }

      function advanceDay() {
        gameTime.day++;
        gameTime.hour = 6;
        gameTime.minute = 0;
        player.stamina = 100;
        player.x = 6 * TILE_SIZE;
        player.y = 8 * TILE_SIZE;

        for (let r = 0; r < MAP_ROWS; r++) {
          for (let c = 0; c < MAP_COLS; c++) {
            if (mapTiles[r][c].hasBambooAqueduct) {
              if (r > 0 && mapTiles[r-1][c].kind === 'soil_dry') mapTiles[r-1][c].kind = 'soil_wet';
              if (r < MAP_ROWS-1 && mapTiles[r+1][c].kind === 'soil_dry') mapTiles[r+1][c].kind = 'soil_wet';
            }
          }
        }

        for (let r = 0; r < MAP_ROWS; r++) {
          for (let c = 0; c < MAP_COLS; c++) {
            const t = mapTiles[r][c];
            if (t.crop && t.kind === 'soil_wet') {
              if (t.crop.stage < t.crop.maxStages) t.crop.stage++;
            }
            if (t.kind === 'soil_wet') t.kind = 'soil_dry';
          }
        }
        updateHUD();
      }

      function render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const targetX = player.x + TILE_SIZE/2 - canvas.width/2;
        const targetY = player.y + TILE_SIZE/2 - canvas.height/2;
        const maxW = MAP_COLS * TILE_SIZE;
        const maxH = MAP_ROWS * TILE_SIZE;
        cameraX += (Math.max(0, Math.min(maxW - canvas.width, targetX)) - cameraX) * 0.15;
        cameraY += (Math.max(0, Math.min(maxH - canvas.height, targetY)) - cameraY) * 0.15;

        ctx.save();
        ctx.translate(-Math.floor(cameraX), -Math.floor(cameraY));

        ctx.fillStyle = '#60a5fa';
        ctx.fillRect(0, -50, maxW, 140);
        ctx.fillStyle = '#334155';
        ctx.beginPath();
        ctx.moveTo(0, 110);
        ctx.lineTo(200, 30); ctx.lineTo(450, 70); ctx.lineTo(700, 20); ctx.lineTo(maxW, 100);
        ctx.lineTo(maxW, 120); ctx.lineTo(0, 120); ctx.closePath();
        ctx.fill();

        for (let r = 0; r < MAP_ROWS; r++) {
          for (let c = 0; c < MAP_COLS; c++) {
            const t = mapTiles[r][c];
            const x = c * TILE_SIZE, y = r * TILE_SIZE;
            if (t.kind === 'grass') {
              ctx.fillStyle = r % 2 === 0 ? '#4ade80' : '#22c55e';
              ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
            } else if (t.kind === 'soil_dry') {
              ctx.fillStyle = '#92400e';
              ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
            } else if (t.kind === 'soil_wet') {
              ctx.fillStyle = '#451a03';
              ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
              ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
              ctx.fillRect(x+4, y+8, 10, 2);
            } else if (t.kind === 'path') {
              ctx.fillStyle = '#d97706';
              ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
            } else if (t.kind === 'water_canal') {
              ctx.fillStyle = '#0284c7';
              ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
            } else if (t.kind === 'bridge_bamboo') {
              // Water flowing underneath
              ctx.fillStyle = '#0284c7';
              ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
              // Bridge deck
              ctx.fillStyle = '#713f12';
              ctx.fillRect(x, y + 2, TILE_SIZE, TILE_SIZE - 4);
              for (let i = 0; i < 4; i++) {
                ctx.fillStyle = i % 2 === 0 ? '#a16207' : '#ca8a04';
                ctx.fillRect(x, y + 4 + i * 7, TILE_SIZE, 6);
              }
              // Railings
              ctx.fillStyle = '#451a03';
              ctx.fillRect(x, y + 1, TILE_SIZE, 3);
              ctx.fillRect(x, y + TILE_SIZE - 4, TILE_SIZE, 3);
            } else if (t.kind === 'pond') {
              ctx.fillStyle = '#0369a1';
              ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
            } else if (t.kind === 'water_deep') {
              ctx.fillStyle = '#075985';
              ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
              ctx.fillStyle = 'rgba(56, 189, 248, 0.2)';
              ctx.fillRect(x + 4, y + 8, 14, 2);
            } else if (t.kind === 'dock_bamboo') {
              ctx.fillStyle = '#0284c7';
              ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
              ctx.fillStyle = '#ca8a04';
              ctx.fillRect(x, y + 4, TILE_SIZE, TILE_SIZE - 8);
              ctx.fillStyle = '#713f12';
              ctx.fillRect(x, y + 2, TILE_SIZE, 2);
              ctx.fillRect(x, y + TILE_SIZE - 4, TILE_SIZE, 2);
            } else if (t.kind === 'tree_pinus') {
              ctx.fillStyle = r % 2 === 0 ? '#4ade80' : '#22c55e';
              ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
              const cx = x + TILE_SIZE/2, cy = y + TILE_SIZE - 4;
              ctx.fillStyle = '#78350f';
              ctx.fillRect(cx - 3, cy - 10, 6, 10);
              ctx.fillStyle = '#14532d';
              ctx.beginPath();
              ctx.moveTo(cx, cy - 32); ctx.lineTo(cx - 12, cy - 8); ctx.lineTo(cx + 12, cy - 8); ctx.closePath(); ctx.fill();
            } else if (t.kind === 'tree_kelapa') {
              ctx.fillStyle = r % 2 === 0 ? '#4ade80' : '#22c55e';
              ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
              const cx = x + TILE_SIZE/2, cy = y + TILE_SIZE - 4;
              ctx.strokeStyle = '#854d0e'; ctx.lineWidth = 5; ctx.beginPath();
              ctx.moveTo(cx, cy); ctx.quadraticCurveTo(cx - 4, cy - 18, cx + 2, cy - 32); ctx.stroke();
              ctx.fillStyle = '#15803d';
              ctx.beginPath(); ctx.arc(cx + 2, cy - 32, 10, 0, Math.PI*2); ctx.fill();
            } else if (t.kind === 'tree_bambu') {
              ctx.fillStyle = r % 2 === 0 ? '#4ade80' : '#22c55e';
              ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
              const cx = x + TILE_SIZE/2, cy = y + TILE_SIZE - 4;
              ctx.strokeStyle = '#65a30d'; ctx.lineWidth = 3;
              ctx.beginPath(); ctx.moveTo(cx - 4, cy); ctx.lineTo(cx - 4, cy - 28); ctx.stroke();
              ctx.beginPath(); ctx.moveTo(cx + 4, cy); ctx.lineTo(cx + 4, cy - 26); ctx.stroke();
              ctx.fillStyle = '#4ade80';
              ctx.beginPath(); ctx.arc(cx, cy - 28, 8, 0, Math.PI*2); ctx.fill();
            } else if (t.kind === 'tree_pisang') {
              ctx.fillStyle = r % 2 === 0 ? '#4ade80' : '#22c55e';
              ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
              const cx = x + TILE_SIZE/2, cy = y + TILE_SIZE - 4;
              ctx.fillStyle = '#65a30d'; ctx.fillRect(cx - 3, cy - 14, 6, 14);
              ctx.fillStyle = '#16a34a';
              ctx.beginPath(); ctx.ellipse(cx - 8, cy - 16, 9, 4, -0.3, 0, Math.PI*2); ctx.fill();
              ctx.beginPath(); ctx.ellipse(cx + 8, cy - 16, 9, 4, 0.3, 0, Math.PI*2); ctx.fill();
            } else if (t.kind === 'wood_floor' || t.kind === 'bed') {
              ctx.fillStyle = '#ca8a04';
              ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
              if (t.kind === 'bed') {
                ctx.fillStyle = '#fef08a';
                ctx.fillRect(x+4, y+4, TILE_SIZE-8, TILE_SIZE-8);
              }
            } else if (t.kind === 'wall_bamboo') {
              ctx.fillStyle = '#854d0e';
              ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
            } else if (t.kind === 'shipping_bin') {
              ctx.fillStyle = '#78350f';
              ctx.fillRect(x+2, y+6, TILE_SIZE-4, TILE_SIZE-8);
            }

            if (t.crop) {
              const cx = x + TILE_SIZE/2, cy = y + TILE_SIZE/2;
              if (t.crop.stage === 0) {
                ctx.fillStyle = '#86efac';
                ctx.fillRect(cx-3, cy, 2, 6);
              } else if (t.crop.stage === 1) {
                ctx.fillStyle = '#22c55e';
                ctx.fillRect(cx-5, cy-4, 3, 10); ctx.fillRect(cx+2, cy-4, 3, 10);
              } else {
                ctx.fillStyle = '#eab308';
                ctx.fillRect(cx-6, cy-8, 3, 14); ctx.fillRect(cx+2, cy-8, 3, 14);
                ctx.fillStyle = '#fde047';
                ctx.beginPath(); ctx.arc(cx, cy-9, 4, 0, Math.PI*2); ctx.fill();
              }
            }

            if (t.hasBambooAqueduct) {
              ctx.fillStyle = '#65a30d';
              ctx.fillRect(x, y + TILE_SIZE/2 - 4, TILE_SIZE, 8);
              ctx.fillStyle = '#38bdf8';
              ctx.fillRect(x, y + TILE_SIZE/2 - 1, TILE_SIZE, 3);
            }
          }
        }

        ctx.fillStyle = '#451a03';
        ctx.beginPath();
        ctx.moveTo(3*TILE_SIZE - 6, 5*TILE_SIZE);
        ctx.lineTo(6*TILE_SIZE, 2*TILE_SIZE - 10);
        ctx.lineTo(9*TILE_SIZE + 6, 5*TILE_SIZE);
        ctx.closePath();
        ctx.fill();

        // Puddles on Ground
        drawPuddles(ctx);

        // Draw Small Poultry Farm Pen (Paranje Hayam, Sarang Jerami, Palung Pakan)
        const coopX = 15 * TILE_SIZE, coopY = 10 * TILE_SIZE;
        ctx.fillStyle = '#b45309';
        ctx.fillRect(coopX + 6, coopY + 14, 2 * TILE_SIZE - 12, 2 * TILE_SIZE - 18);
        ctx.fillStyle = '#451a03';
        ctx.beginPath();
        ctx.moveTo(coopX - 4, coopY + 14);
        ctx.lineTo(coopX + 40, coopY - 10);
        ctx.lineTo(coopX + 2 * TILE_SIZE + 4, coopY + 14);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#78350f';
        ctx.fillRect(coopX + 22, coopY + 4, 36, 11);
        ctx.fillStyle = '#fef08a';
        ctx.font = 'bold 7px sans-serif';
        ctx.fillText('Paranje Hayam', coopX + 23, coopY + 12);

        // Straw nests
        [ { x: 17 * TILE_SIZE, y: 10 * TILE_SIZE }, { x: 18 * TILE_SIZE, y: 10 * TILE_SIZE } ].forEach(nest => {
          ctx.fillStyle = '#ca8a04';
          ctx.beginPath(); ctx.ellipse(nest.x + 20, nest.y + 20, 14, 9, 0, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#eab308';
          ctx.beginPath(); ctx.ellipse(nest.x + 20, nest.y + 19, 10, 6, 0, 0, Math.PI * 2); ctx.fill();
        });

        // Feed trough
        const trX = 19 * TILE_SIZE, trY = 11 * TILE_SIZE;
        ctx.fillStyle = '#854d0e';
        ctx.fillRect(trX + 6, trY + 14, 28, 14);
        ctx.fillStyle = '#fde047';
        ctx.fillRect(trX + 10, trY + 17, 20, 8);

        // Draw Laid Eggs
        laidEggs.forEach(egg => {
          ctx.fillStyle = egg.type === 'ayam' ? '#fed7aa' : '#cffafe';
          ctx.beginPath();
          ctx.ellipse(egg.x, egg.y, 4.5, 6, 0.15, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.ellipse(egg.x - 1.2, egg.y - 2, 1.5, 2, -0.3, 0, Math.PI * 2);
          ctx.fill();
        });

        // Draw Animals (Domba Garut, Ayam, Bebek)
        animals.forEach(a => {
          const isDomba = a.type === 'domba';
          const isAyam = a.type === 'ayam';
          ctx.fillStyle = isDomba ? '#f8fafc' : isAyam ? '#ea580c' : '#facc15';
          ctx.beginPath();
          ctx.arc(a.x + 10, a.y + 10, isDomba ? 9 : 6, 0, Math.PI*2);
          ctx.fill();
          if (isDomba) {
            ctx.fillStyle = '#b45309';
            ctx.strokeRect(a.x + 2, a.y + 4, 4, 4);
          } else if (isAyam) {
            ctx.fillStyle = '#dc2626';
            ctx.fillRect(a.x + 10, a.y + 3, 3, 3);
          } else {
            ctx.fillStyle = '#f97316';
            ctx.fillRect(a.x + 13, a.y + 9, 4, 2.5);
          }
          if (a.isFed) {
            ctx.fillStyle = '#22c55e';
            ctx.beginPath(); ctx.arc(a.x + 16, a.y - 2, 2.5, 0, Math.PI * 2); ctx.fill();
          }
        });

        // Draw NPCs with Pseudo-3D & Mang Jaja with Pikulan Baskets
        let nearestNpc = null;
        let nearestDist = Infinity;

        Object.values(npcs).forEach(n => {
          const nx = (n.id === 'mang_jaja' ? n.pxX : n.x * TILE_SIZE);
          const ny = (n.id === 'mang_jaja' ? n.pxY : n.y * TILE_SIZE);
          const dist = Math.hypot(player.x - nx, player.y - ny);
          if (dist < nearestDist) {
            nearestDist = dist;
            nearestNpc = { ...n, nx, ny, dist };
          }

          // Shadow
          ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
          ctx.beginPath();
          ctx.ellipse(nx + 18, ny + 33, 12, 5, 0, 0, Math.PI * 2);
          ctx.fill();

          if (n.id === 'mang_jaja') {
            // Mang Jaja: Brown Pangsi, Straw Caping, Shoulder Balance Pole
            ctx.fillStyle = '#451a03';
            ctx.fillRect(nx+10, ny+18, 16, 14);
            ctx.fillStyle = '#78350f';
            ctx.fillRect(nx+10, ny+10, 16, 9);
            ctx.fillStyle = '#16a34a';
            ctx.fillRect(nx+10, ny+16, 16, 2.5); // Green sash

            // Head
            ctx.fillStyle = '#fed7aa';
            ctx.beginPath(); ctx.arc(nx+18, ny+6, 6, 0, Math.PI*2); ctx.fill();

            // Caping Bambu (Conical Hat)
            ctx.fillStyle = '#eab308';
            ctx.beginPath();
            ctx.moveTo(nx+8, ny+4); ctx.lineTo(nx+18, ny-5); ctx.lineTo(nx+28, ny+4);
            ctx.closePath(); ctx.fill();

            // Pikulan Bambu & Baskets
            ctx.strokeStyle = '#ca8a04';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(nx+2, ny+9); ctx.lineTo(nx+34, ny+9);
            ctx.stroke();

            // Left Basket (Seedlings)
            ctx.fillStyle = '#a16207';
            ctx.fillRect(nx-2, ny+15, 8, 7);
            ctx.fillStyle = '#22c55e';
            ctx.fillRect(nx-1, ny+12, 6, 3);

            // Right Basket (Chilies & Talang)
            ctx.fillStyle = '#a16207';
            ctx.fillRect(nx+30, ny+15, 8, 7);
            ctx.fillStyle = '#dc2626';
            ctx.fillRect(nx+31, ny+12, 6, 3);
          } else {
            // Abah Surya / Ceuceu / Ujang
            ctx.fillStyle = n.id === 'abah_surya' ? '#991b1b' : n.id === 'neng_ceuceu' ? '#7c2d12' : '#065f46';
            ctx.fillRect(nx+10, ny+18, 16, 14);
            ctx.fillStyle = n.id === 'abah_surya' ? '#f8fafc' : n.id === 'neng_ceuceu' ? '#f43f5e' : '#e2e8f0';
            ctx.fillRect(nx+10, ny+10, 16, 9);
            ctx.fillStyle = '#fed7aa';
            ctx.beginPath(); ctx.arc(nx+18, ny+6, 6, 0, Math.PI*2); ctx.fill();
            ctx.fillStyle = '#78350f';
            ctx.beginPath(); ctx.arc(nx+18, ny+4, 6.5, Math.PI, Math.PI*2); ctx.fill();
          }

          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 8px sans-serif';
          ctx.fillText(n.name, nx + 2, ny - 6);
        });

        // Floating Proximity Comic Speech Bubble
        if (nearestNpc && nearestNpc.dist <= TILE_SIZE * 2.2) {
          const bx = nearestNpc.nx + 18;
          const by = nearestNpc.ny - 20;
          const greeting = nearestNpc.greetings ? nearestNpc.greetings[0] : nearestNpc.text;
          ctx.font = 'bold 9px sans-serif';
          const tw = Math.min(240, Math.max(140, ctx.measureText(greeting).width + 20));

          ctx.fillStyle = 'rgba(28, 25, 23, 0.95)';
          ctx.beginPath();
          ctx.roundRect(bx - tw/2, by - 36, tw, 32, 6);
          ctx.fill();
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Tail
          ctx.fillStyle = 'rgba(28, 25, 23, 0.95)';
          ctx.beginPath();
          ctx.moveTo(bx - 4, by - 4); ctx.lineTo(bx, by + 4); ctx.lineTo(bx + 4, by - 4);
          ctx.closePath(); ctx.fill(); ctx.stroke();

          ctx.fillStyle = '#fde047';
          ctx.font = 'bold 8px sans-serif';
          ctx.fillText(nearestNpc.avatar + ' ' + nearestNpc.name, bx - tw/2 + 6, by - 24);

          ctx.fillStyle = '#ffffff';
          ctx.font = '8px sans-serif';
          ctx.fillText(greeting, bx - tw/2 + 6, by - 12);
        }

        // 8-Directional Pseudo-3D Shaded Player
        draw3DPlayer(ctx, player);

        // Bamboo fishing rod and bobber
        if (isFishing) {
          ctx.strokeStyle = '#ca8a04'; ctx.lineWidth = 3;
          ctx.beginPath(); ctx.moveTo(player.x + 18, player.y + 14); ctx.lineTo(player.x + 34, player.y + 4); ctx.stroke();
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)'; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(player.x + 34, player.y + 4); ctx.lineTo(bobberX, bobberY); ctx.stroke();
          ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.arc(bobberX, bobberY, 4, 0, Math.PI * 2); ctx.fill();
          if (fishingPhase === 'bite') {
            ctx.fillStyle = '#dc2626'; ctx.fillRect(bobberX - 24, bobberY - 26, 48, 16);
            ctx.fillStyle = '#ffffff'; ctx.font = 'bold 10px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('❗ TARIK!', bobberX, bobberY - 14);
          }
        }

        // Draw fluttering Priangan tea leaf particles in pseudo-3D
        leafParticles.forEach(lp => {
          ctx.save();
          ctx.translate(lp.x, lp.y);
          ctx.rotate(lp.angle);
          ctx.scale(1, Math.cos(lp.flip));
          ctx.fillStyle = lp.color;
          ctx.beginPath();
          ctx.ellipse(0, 0, lp.size, lp.size * 0.5, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = 'rgba(255,255,255,0.4)';
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(-lp.size * 0.8, 0);
          ctx.lineTo(lp.size * 0.8, 0);
          ctx.stroke();
          ctx.restore();
        });

        ctx.restore();

        if (isRaining) {
          drawRain(ctx);
        }

        if (gameTime.hour >= 19 || gameTime.hour < 6) {
          ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
      }

      function drawPuddles(ctx) {
        for (const p of puddles) {
          if (p.depth <= 0.05) continue;
          ctx.save();
          ctx.fillStyle = 'rgba(28, 25, 23, 0.45)';
          ctx.beginPath();
          ctx.ellipse(p.x, p.y, p.rx + 2, p.ry + 1.5, 0, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = isRaining ? 'rgba(56, 189, 248, 0.45)' : 'rgba(125, 211, 252, 0.4)';
          ctx.beginPath();
          ctx.ellipse(p.x, p.y, p.rx, p.ry, 0, 0, Math.PI * 2);
          ctx.fill();

          const rTime = (frameCount * 0.05) % 1;
          ctx.strokeStyle = 'rgba(224, 242, 254, ' + ((1 - rTime) * 0.5) + ')';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.ellipse(p.x, p.y, p.rx * rTime, p.ry * rTime, 0, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }
      }

      function drawRain(ctx) {
        ctx.save();
        ctx.strokeStyle = 'rgba(224, 242, 254, 0.55)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        for (const drop of rainDrops) {
          drop.x += 2;
          drop.y += drop.speed;
          if (drop.y > canvas.height) {
            drop.y = -drop.len;
            drop.x = Math.random() * (canvas.width + 100);
          }
          ctx.moveTo(drop.x, drop.y);
          ctx.lineTo(drop.x + 3, drop.y + drop.len);
        }
        ctx.stroke();
        ctx.restore();
      }

      function draw3DPlayer(ctx, p) {
        const px = p.x, py = p.y;
        const dir = p.direction;
        const isMoving = p.isMoving;
        const strideFreq = isSprinting ? 2.6 : 1.9;
        const runBob = isMoving ? Math.abs(Math.sin(p.animTimer * strideFreq)) * (isSprinting ? 3.0 : 1.8) : 0;
        const legPhase = isMoving ? Math.sin(p.animTimer * strideFreq) : 0;

        const dirAngles = {
          down: 0,
          'down-right': Math.PI * 0.25,
          right: Math.PI * 0.5,
          'up-right': Math.PI * 0.75,
          up: Math.PI,
          'up-left': Math.PI * 1.25,
          left: Math.PI * 1.5,
          'down-left': Math.PI * 1.75
        };
        const facingAngle = dirAngles[dir] || 0;
        const facingDown = dir === 'down' || dir === 'down-left' || dir === 'down-right';
        const facingUp = dir === 'up' || dir === 'up-left' || dir === 'up-right';
        const facingLeft = dir === 'left' || dir === 'up-left' || dir === 'down-left';

        const baseX = px + 18;
        const baseY = py + 32;

        // Dynamic Sun Contact Shadow
        ctx.save();
        ctx.fillStyle = 'rgba(15, 23, 42, 0.35)';
        ctx.beginPath();
        ctx.ellipse(baseX, baseY + 2, 13 + (isMoving ? 1.5 : 0), 6 * (1 - runBob * 0.1), 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.beginPath();
        ctx.ellipse(baseX, baseY + 1, 8, 3, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // 3D Sprite-Stacking
        ctx.save();
        const layerSpacing = 1.05;
        const getLayerCoord = (z) => ({
          x: baseX + Math.sin(facingAngle) * (z * 0.18),
          y: baseY - z * layerSpacing - runBob + Math.cos(facingAngle) * (z * 0.14)
        });

        const strideDist = legPhase * (isSprinting ? 6.5 : 4.5);
        const cosA = Math.cos(facingAngle);
        const sinA = Math.sin(facingAngle);
        const perpX = -cosA;
        const perpY = sinA;
        const forwardX = sinA;
        const forwardY = cosA;
        const hipSpacing = 4.2;

        // Slices 1..3: Tarumpah Sandals
        for (let z = 1; z <= 3; z++) {
          const { x: lx, y: ly } = getLayerCoord(z);
          const leftFootX = lx + perpX * hipSpacing + forwardX * strideDist;
          const leftFootY = ly + perpY * hipSpacing * 0.4 + forwardY * strideDist * 0.5;
          const rightFootX = lx - perpX * hipSpacing - forwardX * strideDist;
          const rightFootY = ly - perpY * hipSpacing * 0.4 - forwardY * strideDist * 0.5;

          ctx.fillStyle = z === 1 ? '#451a03' : z === 2 ? '#78350f' : '#92400e';
          ctx.beginPath();
          ctx.ellipse(leftFootX, leftFootY, 3.4, 2.2, facingAngle, 0, Math.PI * 2);
          ctx.ellipse(rightFootX, rightFootY, 3.4, 2.2, facingAngle, 0, Math.PI * 2);
          ctx.fill();
        }

        // Slices 4..9: Pangsi Pants Legs & Pelvis
        for (let z = 4; z <= 9; z++) {
          const { x: lx, y: ly } = getLayerCoord(z);
          if (z <= 7) {
            const legProg = (z - 4) / 4;
            const curStride = strideDist * (1 - legProg * 0.45);
            const leftLegX = lx + perpX * hipSpacing + forwardX * curStride;
            const leftLegY = ly + perpY * hipSpacing * 0.4 + forwardY * curStride * 0.5;
            const rightLegX = lx - perpX * hipSpacing - forwardX * curStride;
            const rightLegY = ly - perpY * hipSpacing * 0.4 - forwardY * curStride * 0.5;

            ctx.fillStyle = z % 2 === 0 ? '#0f172a' : '#1e293b';
            ctx.beginPath();
            ctx.ellipse(leftLegX, leftLegY, 3.5, 2.8, facingAngle, 0, Math.PI * 2);
            ctx.ellipse(rightLegX, rightLegY, 3.5, 2.8, facingAngle, 0, Math.PI * 2);
            ctx.fill();
          } else {
            ctx.fillStyle = z === 8 ? '#0f172a' : '#1e293b';
            ctx.beginPath();
            ctx.ellipse(lx, ly, 8.0, 5.0, facingAngle * 0.2, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // Slices 10..12: Red Batik Beubeur Sash
        for (let z = 10; z <= 12; z++) {
          const { x: lx, y: ly } = getLayerCoord(z);
          ctx.fillStyle = z === 11 ? '#ef4444' : '#b91c1c';
          ctx.beginPath();
          ctx.ellipse(lx, ly, 8.2, 5.2, facingAngle * 0.2, 0, Math.PI * 2);
          ctx.fill();
          if (z === 11) {
            const bx = lx + sinA * 5.2, by = ly + cosA * 3.8;
            ctx.fillStyle = '#facc15';
            ctx.fillRect(bx - 1.5, by - 1.5, 3, 3);
          }
        }

        // Slices 13..20: Baju Pangsi Torso & Arms
        for (let z = 13; z <= 20; z++) {
          const { x: lx, y: ly } = getLayerCoord(z);
          const crX = z >= 16 && z <= 18 ? 8.8 : 8.2;
          const crY = z >= 16 && z <= 18 ? 5.6 : 5.0;

          ctx.fillStyle = z >= 18 ? '#2563eb' : z % 2 === 0 ? '#1e3a8a' : '#172554';
          ctx.beginPath();
          ctx.ellipse(lx, ly, crX, crY, facingAngle * 0.15, 0, Math.PI * 2);
          ctx.fill();

          if (z >= 14 && z <= 18 && facingDown) {
            const cfx = lx + sinA * 4.5, cfy = ly + cosA * 3.5;
            if (z === 15 || z === 17) {
              ctx.fillStyle = '#fde047';
              ctx.fillRect(cfx - 1, cfy, 2, 2);
            }
          }

          // Arms
          if (z >= 14 && z <= 18) {
            const armPhase = -legPhase * (isSprinting ? 6.0 : 4.0);
            const leftArmX = lx + perpX * 9.5 + forwardX * armPhase;
            const leftArmY = ly + perpY * 9.5 * 0.4 + forwardY * armPhase * 0.5;
            const rightArmX = lx - perpX * 9.5 - forwardX * armPhase;
            const rightArmY = ly - perpY * 9.5 * 0.4 - forwardY * armPhase * 0.5;

            ctx.fillStyle = z >= 17 ? '#2563eb' : '#1e3a8a';
            ctx.beginPath();
            ctx.arc(leftArmX, leftArmY, 2.6, 0, Math.PI * 2);
            ctx.arc(rightArmX, rightArmY, 2.6, 0, Math.PI * 2);
            ctx.fill();

            if (z === 14) {
              ctx.fillStyle = '#fdba74';
              ctx.beginPath();
              ctx.arc(leftArmX, leftArmY, 2.0, 0, Math.PI * 2);
              ctx.arc(rightArmX, rightArmY, 2.0, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }

        // Slices 21..23: Neck
        for (let z = 21; z <= 23; z++) {
          const { x: lx, y: ly } = getLayerCoord(z);
          ctx.fillStyle = z === 21 ? '#ea580c' : '#fed7aa';
          ctx.beginPath();
          ctx.arc(lx, ly, 3.8, 0, Math.PI * 2);
          ctx.fill();
        }

        // Slices 24..28: 3D Head & 8-Direction Face
        for (let z = 24; z <= 28; z++) {
          const { x: lx, y: ly } = getLayerCoord(z);
          const hr = z === 28 ? 6.2 : z === 24 ? 5.8 : 6.6;
          ctx.fillStyle = z === 28 ? '#fff7ed' : '#fed7aa';
          ctx.beginPath();
          ctx.arc(lx, ly, hr, 0, Math.PI * 2);
          ctx.fill();

          if (z === 26) {
            ctx.fillStyle = '#0f172a';
            if (dir === 'down') {
              ctx.fillRect(lx - 3.2, ly + 2.0, 1.8, 2.0);
              ctx.fillRect(lx + 1.4, ly + 2.0, 1.8, 2.0);
              ctx.fillStyle = '#c2410c';
              ctx.fillRect(lx - 1.5, ly + 4.5, 3.0, 1.0);
            } else if (dir.includes('right')) {
              ctx.fillRect(lx + 2.0, ly + 1.5, 1.8, 2.0);
            } else if (dir.includes('left')) {
              ctx.fillRect(lx - 3.8, ly + 1.5, 1.8, 2.0);
            } else if (facingUp) {
              ctx.fillStyle = '#0f172a';
              ctx.beginPath();
              ctx.arc(lx, ly + 1.5, hr * 0.9, 0, Math.PI);
              ctx.fill();
            }
          }
        }

        // Slices 29..34: Sundanese Makuta Totopong (Folded Crown Peak)
        for (let z = 29; z <= 34; z++) {
          const { x: lx, y: ly } = getLayerCoord(z);
          if (z === 29) {
            ctx.fillStyle = '#78350f';
            ctx.beginPath();
            ctx.arc(lx, ly, 7.2, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#f59e0b';
            ctx.lineWidth = 1.2;
            ctx.stroke();
          } else if (z === 30 || z === 31) {
            ctx.fillStyle = z === 30 ? '#b45309' : '#d97706';
            ctx.beginPath();
            ctx.arc(lx, ly, 6.5 - (z - 29) * 0.8, 0, Math.PI * 2);
            ctx.fill();
          } else {
            const peakHeight = (z - 31) * 3.2;
            const peakX = lx + sinA * peakHeight;
            const peakY = ly + cosA * peakHeight * 0.5;
            ctx.fillStyle = z === 34 ? '#f59e0b' : '#b45309';
            ctx.beginPath();
            ctx.moveTo(lx - perpX * 3.5, ly - perpY * 3.5);
            ctx.lineTo(peakX, peakY - peakHeight);
            ctx.lineTo(lx + perpX * 3.5, ly + perpY * 3.5);
            ctx.closePath();
            ctx.fill();
          }
        }

        ctx.restore();
      }

      function updateHUD() {
        document.getElementById('staminaText').innerText = Math.round(player.stamina) + ' / ' + player.maxStamina;
        document.getElementById('staminaBar').style.width = Math.max(0, player.stamina) + '%';
        const hh = gameTime.hour.toString().padStart(2, '0');
        const mm = gameTime.minute.toString().padStart(2, '0');
        document.getElementById('clockText').innerText = '🕒 ' + hh + ':' + mm;
        document.getElementById('dayCount').innerText = 'Poé ka-' + gameTime.day;
        document.getElementById('kujangText').innerText = player.kujangCoins.toLocaleString();

        const active = inventory[player.selectedSlot];
        if (active) {
          document.getElementById('hotbarTooltipText').innerText = active.icon + ' ' + active.name;
        }
      }

      function movePlayer(dx, dy) {
        const dist = Math.hypot(dx, dy);
        if (dist > 0.08) {
          const angle = Math.atan2(dy, dx);
          const deg = ((angle * 180) / Math.PI + 360) % 360;

          if (deg >= 67.5 && deg < 112.5) player.direction = 'down';
          else if (deg >= 112.5 && deg < 157.5) player.direction = 'down-left';
          else if (deg >= 157.5 && deg < 202.5) player.direction = 'left';
          else if (deg >= 202.5 && deg < 247.5) player.direction = 'up-left';
          else if (deg >= 247.5 && deg < 292.5) player.direction = 'up';
          else if (deg >= 292.5 && deg < 337.5) player.direction = 'up-right';
          else if (deg >= 337.5 || deg < 22.5) player.direction = 'right';
          else player.direction = 'down-right';
        }

        // Calibrated realistic rural speeds: 2.2 walk, 3.4 sprint
        const speed = isSprinting ? 3.4 : 2.2;
        const norm = dist > 1 ? 1 / dist : 1;
        const vx = dx * norm * speed;
        const vy = dy * norm * speed;

        const nx = player.x + vx;
        const ny = player.y + vy;

        if (canWalk(nx, ny)) {
          player.x = nx;
          player.y = ny;
          player.isMoving = true;
          player.animTimer += isSprinting ? 0.22 : 0.14;
        } else if (canWalk(nx, player.y)) {
          player.x = nx;
          player.isMoving = true;
          player.animTimer += 0.14;
        } else if (canWalk(player.x, ny)) {
          player.y = ny;
          player.isMoving = true;
          player.animTimer += 0.14;
        } else {
          player.isMoving = false;
        }

        // Tea hills leaf flutter & egg pickup
        const mc = Math.floor((player.x + 18) / TILE_SIZE);
        const mr = Math.floor((player.y + 24) / TILE_SIZE);
        if (mc >= 28 && mc <= 42 && mr <= 15 && frameCount % 12 === 0) {
          addLeafParticle(player.x + 18, player.y + 20, 'tea');
        }

        // Automatic egg walk-over pickup
        for (let i = laidEggs.length - 1; i >= 0; i--) {
          const egg = laidEggs[i];
          if (Math.hypot(player.x + 18 - egg.x, player.y + 24 - egg.y) < 22) {
            laidEggs.splice(i, 1);
            player.kujangCoins += (egg.type === 'ayam' ? 20 : 35);
            playSound('coin');
            updateHUD();
          }
        }
      }

      function canWalk(px, py) {
        const col = Math.floor((px + 18) / TILE_SIZE);
        const row = Math.floor((py + 26) / TILE_SIZE);
        if (col < 0 || col >= MAP_COLS || row < 0 || row >= MAP_ROWS) return false;
        const t = mapTiles[row][col];
        if (
          t.kind === 'wall_bamboo' ||
          t.kind === 'water_canal' ||
          t.kind === 'pond' ||
          t.kind === 'water_deep' ||
          t.kind === 'tree_pinus' ||
          t.kind === 'tree_kelapa' ||
          t.kind === 'tree_bambu' ||
          t.kind === 'tree_pisang' ||
          t.kind === 'shipping_bin'
        ) return false;
        for (const n of Object.values(npcs)) {
          if (col === n.x && row === n.y) return false;
        }
        return true;
      }

      function advanceDay() {
        gameTime.day++;
        if (gameTime.day > 28) {
          gameTime.day = 1;
          gameTime.season = gameTime.season === 'kasa' ? 'katiga' : gameTime.season === 'katiga' ? 'rendeng' : 'kasa';
        }
        gameTime.hour = 6;
        gameTime.minute = 0;
        player.stamina = player.maxStamina;
        const rainChance = gameTime.season === 'rendeng' ? 0.7 : gameTime.season === 'katiga' ? 0.35 : 0.15;
        isRaining = Math.random() < rainChance;
        for (const p of puddles) p.depth = isRaining ? 0.8 : 0;
        for (let r = 0; r < MAP_ROWS; r++) {
          for (let c = 0; c < MAP_COLS; c++) {
            const t = mapTiles[r][c];
            if (t.crop && (t.kind === 'soil_wet' || isRaining)) {
              if (t.crop.stage < t.crop.maxStages) t.crop.stage++;
            }
            if (t.kind === 'soil_wet' && !isRaining) t.kind = 'soil_dry';
          }
        }
        updateHUD();
      }

      function performAction() {
        if (isFishing) {
          if (fishingPhase === 'bite' && hookedFish) {
            playSound('coin');
            player.kujangCoins += hookedFish.price;
            inventory.push({ id: hookedFish.id, name: hookedFish.name, category: 'fish', count: 1, icon: hookedFish.icon, sellPrice: hookedFish.price });
            updateHUD();
          }
          isFishing = false;
          fishingPhase = 'none';
          hookedFish = null;
          return;
        }

        let tc = Math.floor((player.x + TILE_SIZE/2) / TILE_SIZE);
        let tr = Math.floor((player.y + TILE_SIZE/2) / TILE_SIZE);

        for (const [id, n] of Object.entries(npcs)) {
          if (Math.hypot(tc - n.x, tr - n.y) <= 1.8) {
            window.openNpcModal(n);
            return;
          }
        }

        // Egg proximity pickup
        for (let i = laidEggs.length - 1; i >= 0; i--) {
          const egg = laidEggs[i];
          if (Math.hypot(player.x + 18 - egg.x, player.y + 18 - egg.y) <= 36) {
            laidEggs.splice(i, 1);
            player.kujangCoins += (egg.type === 'ayam' ? 20 : 35);
            playSound('coin');
            updateHUD();
            return;
          }
        }

        // Trough feeding at (19, 11)
        if (Math.hypot(tc - 19, tr - 11) <= 1.8) {
          animals.forEach(a => { if (a.type === 'ayam' || a.type === 'bebek') a.isFed = true; });
          playSound('water');
          return;
        }

        // Poultry & livestock feeding/petting
        for (const a of animals) {
          if (Math.hypot(player.x - a.x, player.y - a.y) < TILE_SIZE * 1.5) {
            a.isFed = true;
            a.eggTimer = Math.max(20, Math.floor((a.eggTimer || 300) * 0.35));
            playSound('coin');
            return;
          }
        }

        if (Math.hypot(tc - 4, tr - 4) <= 1.5) {
          advanceDay();
          return;
        }

        if (player.direction.includes('up')) tr--;
        if (player.direction.includes('down')) tr++;
        if (player.direction.includes('left')) tc--;
        if (player.direction.includes('right')) tc++;
        tc = Math.max(0, Math.min(MAP_COLS-1, tc));
        tr = Math.max(0, Math.min(MAP_ROWS-1, tr));

        const target = mapTiles[tr][tc];
        const item = inventory[player.selectedSlot];
        if (!item) return;

        if (item.toolType === 'cangkul') {
          if (target.kind === 'grass' || target.kind === 'soil_dry') {
            target.kind = 'soil_dry';
            player.stamina = Math.max(0, player.stamina - 3);
            playSound('hoe');
            if (tc >= 28 && tc <= 42 && tr <= 15) {
              addLeafParticle(tc * TILE_SIZE + 20, tr * TILE_SIZE + 20, 'tea');
            }
          }
        } else if (item.toolType === 'gembor') {
          if (target.kind === 'soil_dry') {
            target.kind = 'soil_wet';
            player.stamina = Math.max(0, player.stamina - 2);
            playSound('water');
          }
        } else if (item.category === 'seed' && item.count > 0) {
          if ((target.kind === 'soil_dry' || target.kind === 'soil_wet') && !target.crop) {
            target.crop = { type: 'padi', stage: 0, maxStages: 3 };
            item.count--;
            player.stamina = Math.max(0, player.stamina - 1);
            playSound('water');
          }
        } else if (item.toolType === 'talang_bambu' && item.count > 0) {
          target.hasBambooAqueduct = true;
          item.count--;
          playSound('water');
        } else if (item.toolType === 'pancingan') {
          if (target.kind === 'pond' || target.kind === 'water_deep' || target.kind === 'water_canal') {
            isFishing = true;
            fishingPhase = 'waiting';
            fishingTimer = 60 + Math.floor(Math.random() * 60);
            bobberX = tc * TILE_SIZE + 18;
            bobberY = tr * TILE_SIZE + 18;
            playSound('water');
          }
        } else if (target.crop && target.crop.stage >= target.crop.maxStages) {
          if (target.crop.type === 'teh') {
            for (let i = 0; i < 8; i++) addLeafParticle(tc * TILE_SIZE + 20, tr * TILE_SIZE + 20, 'tea');
          }
          target.crop = null;
          player.kujangCoins += 45;
          playSound('harvest');
        }
        updateHUD();
      }

      // Continuous Analog Joystick Event Tracking
      let joyActive = false;
      let joyDx = 0, joyDy = 0;
      const joyBase = document.getElementById('joystickBase');
      const joyKnob = document.getElementById('joystickKnob');
      const joyRadius = 45;

      function handleJoyMove(clientX, clientY) {
        if (!joyBase) return;
        const rect = joyBase.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        let deltaX = clientX - centerX;
        let deltaY = clientY - centerY;
        const dist = Math.hypot(deltaX, deltaY);
        if (dist > joyRadius) {
          deltaX = (deltaX / dist) * joyRadius;
          deltaY = (deltaY / dist) * joyRadius;
        }
        joyKnob.style.transform = 'translate(' + deltaX + 'px, ' + deltaY + 'px)';
        joyDx = deltaX / joyRadius;
        joyDy = deltaY / joyRadius;
      }

      function resetJoystick() {
        joyActive = false;
        joyDx = 0;
        joyDy = 0;
        if (joyKnob) joyKnob.style.transform = 'translate(0px, 0px)';
        player.isMoving = false;
      }

      if (joyBase) {
        joyBase.addEventListener('touchstart', (e) => {
          e.preventDefault();
          joyActive = true;
          const touch = e.touches[0];
          handleJoyMove(touch.clientX, touch.clientY);
        }, { passive: false });

        joyBase.addEventListener('touchmove', (e) => {
          e.preventDefault();
          if (joyActive) {
            const touch = e.touches[0];
            handleJoyMove(touch.clientX, touch.clientY);
          }
        }, { passive: false });

        joyBase.addEventListener('touchend', (e) => {
          e.preventDefault();
          resetJoystick();
        });
        joyBase.addEventListener('touchcancel', (e) => {
          e.preventDefault();
          resetJoystick();
        });
      }

      window.addEventListener('keydown', (e) => {
        if (!inGame) return;
        keysDown[e.key] = true;
        if (e.key === 'Shift') isSprinting = true;
        if (e.key === ' ' || e.key === 'e' || e.key === 'E') performAction();
        if (e.key >= '1' && e.key <= '7') {
          player.selectedSlot = parseInt(e.key) - 1;
          updateHUD();
        }
      });

      window.addEventListener('keyup', (e) => {
        keysDown[e.key] = false;
        if (e.key === 'Shift') isSprinting = false;
        if (!keysDown['w'] && !keysDown['s'] && !keysDown['a'] && !keysDown['d'] && !joyActive) {
          player.isMoving = false;
        }
      });

      document.getElementById('btnMainAction').onclick = performAction;
      document.getElementById('btnCycleTool').onclick = () => {
        player.selectedSlot = (player.selectedSlot + 1) % inventory.length;
        updateHUD();
      };
      document.getElementById('btnQuickEat').onclick = () => {
        const liwet = inventory.find(i => i.id === 'liwet');
        if (liwet && liwet.count > 0) {
          liwet.count--;
          player.stamina = Math.min(player.maxStamina, player.stamina + 40);
          playSound('eat');
          updateHUD();
        }
      };

      window.openNpcModal = function(n) {
        document.getElementById('modalNpc').classList.remove('hidden');
        document.getElementById('npcAvatar').innerText = n.avatar;
        document.getElementById('npcName').innerText = n.name;
        document.getElementById('npcTitle').innerText = n.title;
        let bodyText = n.text;
        if (n.schedule) {
          const curSlot = n.schedule.find(s => gameTime.hour >= s.start && gameTime.hour < s.end) || n.schedule[0];
          bodyText += '\n\n📍 Kagiatan ayeuna: ' + curSlot.act + ' di ' + curSlot.loc;
        }
        document.getElementById('npcDialogText').innerText = bodyText;
      };
      window.closeModal = function(id) {
        document.getElementById(id).classList.add('hidden');
      };

      const hotbarContainer = document.getElementById('hotbarSlots');
      inventory.forEach((item, idx) => {
        const btn = document.createElement('button');
        btn.className = "w-11 h-11 rounded-xl bg-stone-900 border border-stone-700 flex items-center justify-center text-xl text-stone-200 active:scale-95";
        btn.innerText = item.icon;
        btn.onclick = () => { player.selectedSlot = idx; updateHUD(); };
        hotbarContainer.appendChild(btn);
      });

      updateHUD();
      requestAnimationFrame(gameLoop);
    })();
  </script>
</body>
</html>`;
}
