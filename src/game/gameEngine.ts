import {
  TileData,
  CropState,
  PlayerState,
  GameTime,
  InventoryItem,
  DailyReport,
  NpcId,
  Animal,
  Direction8,
  FestivalData,
  LeafParticle,
  LaidEgg,
} from '../types/game';
import {
  TILE_SIZE,
  MAP_COLS,
  MAP_ROWS,
  FRAMES_PER_GAME_MINUTE,
  NPCS,
  SEASONS_INFO,
  getFestivalForDate,
} from './constants';
import { WorldMap } from './mapGenerator';
import { sounds } from '../audio/soundManager';

export interface FloatingText {
  x: number;
  y: number;
  text: string;
  color: string;
  alpha: number;
  life: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
}

export interface Fish {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  color: string;
  speed: number;
  angle: number;
  size: number;
}

export interface Puddle {
  x: number;
  y: number;
  rx: number;
  ry: number;
  depth: number; // 0..1 current wetness level
  maxRadius: number;
  seed: number;
}

export interface RainSplash {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  life: number;
}

export class GameEngine {
  public canvas: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;
  public map: WorldMap;
  public player: PlayerState;
  public time: GameTime;
  public inventory: InventoryItem[];
  public shippingBinItems: InventoryItem[] = [];
  public isRaining: boolean = false;

  // Livestock
  public animals: Animal[] = [];

  // Traveling Merchant & Bamboo Craftsman (Mang Jaja) with daily schedule
  public mangJaja: {
    x: number;
    y: number;
    targetX: number;
    targetY: number;
    isMoving: boolean;
    animTimer: number;
    direction: Direction8;
    currentActivity: string;
    locationName: string;
  };

  // Proximity Speech Bubble
  public activeProximityNpc: NpcId | null = null;
  public proximityBubbleText: string = '';
  public proximityBubbleOpacity: number = 0;
  public proximityNpcPos: { x: number; y: number } = { x: 0, y: 0 };
  private proximityTimer: number = 0;

  // Camera viewport
  public cameraX: number = 0;
  public cameraY: number = 0;

  // Effects & animations
  private frameCount: number = 0;
  private floatingTexts: FloatingText[] = [];
  private particles: Particle[] = [];
  private fishes: Fish[] = [];
  // Weather & Atmosphere rendering
  public puddles: Puddle[] = [];
  private rainSplashes: RainSplash[] = [];
  private backgroundRainDrops: { x: number; y: number; speed: number; len: number }[] = [];
  private foregroundRainDrops: { x: number; y: number; speed: number; len: number }[] = [];
  public lightningFlashTimer: number = 0;
  private puddleStepCooldown: number = 0;

  // Priangan Highland Tea Leaf Particles & Poultry Egg System
  public leafParticles: LeafParticle[] = [];
  public laidEggs: LaidEgg[] = [];
  private windTimer: number = 0;

  // Seasonal Festival System
  public currentFestival: FestivalData | null = null;
  public onFestivalStart?: (festival: FestivalData) => void;

  // Interaction callbacks
  public onTalkNpc?: (npcId: NpcId) => void;
  public onOpenShop?: () => void;
  public onSleepPrompt?: () => void;
  public onShippingBinPrompt?: () => void;
  public onDailyReport?: (report: DailyReport) => void;
  public onStaminaAlert?: () => void;

  // Animation states
  private animTimer: number = 0;
  private swingTimer: number = 0;
  private actionType: 'cangkul' | 'gembor' | 'harvest' | 'general' = 'general';

  constructor(
    canvas: HTMLCanvasElement,
    map: WorldMap,
    initialInventory: InventoryItem[],
    savedPlayer?: Partial<PlayerState>,
    savedTime?: Partial<GameTime>,
    savedShippingBin?: InventoryItem[]
  ) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.map = map;
    this.inventory = initialInventory;
    this.shippingBinItems = savedShippingBin || [];

    this.player = {
      x: 8 * TILE_SIZE,
      y: 9 * TILE_SIZE,
      targetX: 8 * TILE_SIZE,
      targetY: 9 * TILE_SIZE,
      direction: 'down',
      isMoving: false,
      isActing: false,
      isSprinting: false,
      stamina: 100,
      maxStamina: 100,
      kujangCoins: 120,
      selectedSlot: 0,
      ...savedPlayer,
    };

    this.time = {
      day: 1,
      hour: 6,
      minute: 0,
      season: 'kasa',
      year: 1,
      ...savedTime,
    };

    this.mangJaja = {
      x: (map.jajaPos?.x ?? 26) * TILE_SIZE,
      y: (map.jajaPos?.y ?? 14) * TILE_SIZE,
      targetX: (map.jajaPos?.x ?? 26) * TILE_SIZE,
      targetY: (map.jajaPos?.y ?? 14) * TILE_SIZE,
      isMoving: false,
      animTimer: 0,
      direction: 'down',
      currentActivity: 'Mengecek jembatan & talang awi parit',
      locationName: 'Jembatan Parit Awi Utama',
    };

    this.initFishes();
    this.initAnimals();
    this.initPuddles();
    this.initRain();
    this.checkFestival(false);
  }

  private initFishes() {
    const colors = ['#f97316', '#ef4444', '#fbbf24', '#ffffff', '#e11d48'];
    for (let i = 0; i < 9; i++) {
      const fx = (30 + Math.random() * 8) * TILE_SIZE;
      const fy = (19 + Math.random() * 6) * TILE_SIZE;
      this.fishes.push({
        x: fx,
        y: fy,
        targetX: fx + (Math.random() * 50 - 25),
        targetY: fy + (Math.random() * 50 - 25),
        color: colors[i % colors.length],
        speed: 0.35 + Math.random() * 0.35,
        angle: Math.random() * Math.PI * 2,
        size: 5 + Math.random() * 3,
      });
    }
  }

  private initAnimals() {
    this.animals = [
      // 2 Domba Garut in the expanded paddock (Cols 41..51, Rows 4..11)
      {
        id: 'domba_1',
        type: 'domba',
        name: 'Si Jalu (Domba Garut)',
        x: 44 * TILE_SIZE,
        y: 6 * TILE_SIZE,
        targetX: 44 * TILE_SIZE,
        targetY: 6 * TILE_SIZE,
        direction: 'left',
        animTimer: 0,
        isGrazing: false,
        hasProduct: true,
        happiness: 85,
        pettedToday: false,
      },
      {
        id: 'domba_2',
        type: 'domba',
        name: 'Si Geulis (Domba Garut)',
        x: 47 * TILE_SIZE,
        y: 8 * TILE_SIZE,
        targetX: 47 * TILE_SIZE,
        targetY: 8 * TILE_SIZE,
        direction: 'right',
        animTimer: 0.5,
        isGrazing: true,
        hasProduct: true,
        happiness: 90,
        pettedToday: false,
      },
      // Peternakan Kecil Unggas (Cols 15..20, Rows 10..13)
      {
        id: 'ayam_1',
        type: 'ayam',
        name: 'Hayam Pelung Jago',
        x: 16 * TILE_SIZE,
        y: 11 * TILE_SIZE,
        targetX: 16 * TILE_SIZE,
        targetY: 11 * TILE_SIZE,
        direction: 'right',
        animTimer: 0,
        isGrazing: false,
        hasProduct: true,
        happiness: 80,
        pettedToday: false,
        isFed: false,
        fedTimer: 0,
        eggTimer: 340,
      },
      {
        id: 'ayam_2',
        type: 'ayam',
        name: 'Hayam Bikang (Induk Telur)',
        x: 17 * TILE_SIZE,
        y: 12 * TILE_SIZE,
        targetX: 17 * TILE_SIZE,
        targetY: 12 * TILE_SIZE,
        direction: 'left',
        animTimer: 0.8,
        isGrazing: true,
        hasProduct: true,
        happiness: 85,
        pettedToday: false,
        isFed: false,
        fedTimer: 0,
        eggTimer: 180,
      },
      {
        id: 'ayam_3',
        type: 'ayam',
        name: 'Hayam Kate Geulis',
        x: 18 * TILE_SIZE,
        y: 11 * TILE_SIZE,
        targetX: 18 * TILE_SIZE,
        targetY: 11 * TILE_SIZE,
        direction: 'left',
        animTimer: 0.4,
        isGrazing: false,
        hasProduct: false,
        happiness: 75,
        pettedToday: false,
        isFed: false,
        fedTimer: 0,
        eggTimer: 420,
      },
      // Bebek Sawah in poultry run & near Balong
      {
        id: 'bebek_1',
        type: 'bebek',
        name: 'Bebek Sawah Hejo',
        x: 19 * TILE_SIZE,
        y: 12 * TILE_SIZE,
        targetX: 19 * TILE_SIZE,
        targetY: 12 * TILE_SIZE,
        direction: 'right',
        animTimer: 0.2,
        isGrazing: false,
        hasProduct: true,
        happiness: 85,
        pettedToday: false,
        isFed: false,
        fedTimer: 0,
        eggTimer: 260,
      },
      {
        id: 'bebek_2',
        type: 'bebek',
        name: 'Bebek Putih Balong',
        x: 27 * TILE_SIZE,
        y: 19 * TILE_SIZE,
        targetX: 27 * TILE_SIZE,
        targetY: 19 * TILE_SIZE,
        direction: 'left',
        animTimer: 0.6,
        isGrazing: true,
        hasProduct: true,
        happiness: 90,
        pettedToday: false,
        isFed: false,
        fedTimer: 0,
        eggTimer: 380,
      },
    ];

    // Initial laid eggs ready to discover in straw nests & near water bank
    this.laidEggs = [
      {
        id: 'egg_init_1',
        x: 17 * TILE_SIZE + 10,
        y: 10 * TILE_SIZE + 14,
        type: 'ayam',
        animOffset: 0.5,
      },
      {
        id: 'egg_init_2',
        x: 27 * TILE_SIZE + 16,
        y: 19 * TILE_SIZE + 16,
        type: 'bebek',
        animOffset: 1.2,
      },
    ];
  }

  private initPuddles() {
    this.puddles = [];
    // 16 Natural organic puddle locations across the expanded 54x40 world map
    const puddleSpots = [
      { col: 8.5, row: 9.5, rx: 16, ry: 9 },    // Saung front yard
      { col: 10.5, row: 10.2, rx: 14, ry: 8 },  // Near Abah Surya
      { col: 15.5, row: 14.3, rx: 20, ry: 10 }, // Central thoroughfare West
      { col: 22.0, row: 14.2, rx: 18, ry: 9 },  // West Bridge approach
      { col: 30.5, row: 14.2, rx: 22, ry: 11 }, // East Bridge approach
      { col: 42.0, row: 14.3, rx: 19, ry: 9 },  // Near Mang Ujang path
      { col: 47.0, row: 16.5, rx: 15, ry: 8 },  // Near Mang Jaja workshop
      { col: 13.5, row: 17.5, rx: 24, ry: 12 }, // Upper Sawah terrace edge
      { col: 20.0, row: 18.0, rx: 20, ry: 10 }, // Near irrigation ditch
      { col: 14.0, row: 30.5, rx: 22, ry: 11 }, // Lower Sawah terrace
      { col: 22.0, row: 32.0, rx: 18, ry: 9 },  // Sawah South edge
      { col: 27.5, row: 15.0, rx: 17, ry: 8 },  // Canal bank
      { col: 34.0, row: 8.5, rx: 16, ry: 8 },   // Tea Garden lower path
      { col: 41.5, row: 9.2, rx: 17, ry: 9 },   // Outside livestock gate
      { col: 6.5, row: 31.5, rx: 18, ry: 9 },   // Near Bale Sawala Gazebo
      { col: 38.0, row: 22.0, rx: 21, ry: 10 }, // Balong pond shoreline
    ];

    puddleSpots.forEach((spot, idx) => {
      this.puddles.push({
        x: spot.col * TILE_SIZE,
        y: spot.row * TILE_SIZE,
        rx: spot.rx,
        ry: spot.ry,
        maxRadius: Math.max(spot.rx, spot.ry),
        depth: this.isRaining ? 0.75 : 0.0,
        seed: idx * 1.37,
      });
    });
  }

  private initRain() {
    this.backgroundRainDrops = [];
    this.foregroundRainDrops = [];

    // Background fine, misty rain layer
    for (let i = 0; i < 90; i++) {
      this.backgroundRainDrops.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        speed: 11 + Math.random() * 5,
        len: 8 + Math.random() * 8,
      });
    }

    // Foreground fast angled rain layer
    for (let i = 0; i < 50; i++) {
      this.foregroundRainDrops.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        speed: 18 + Math.random() * 7,
        len: 14 + Math.random() * 12,
      });
    }
  }

  public checkFestival(notify = true) {
    const festival = getFestivalForDate(this.time.season, this.time.day);
    const wasFestival = this.currentFestival;
    this.currentFestival = festival;

    if (festival && (!wasFestival || wasFestival.id !== festival.id)) {
      if (notify) {
        sounds.playFestivalFanfare();
        this.addFloatingText(`🎉 Dinten Ieu: ${festival.name}!`, this.player.x, this.player.y - 20, '#f59e0b');
        if (this.onFestivalStart) {
          this.onFestivalStart(festival);
        }
      }
    }
  }

  public addRainSplash(worldX: number, worldY: number) {
    for (let i = 0; i < 3; i++) {
      const angle = -Math.PI * 0.8 + Math.random() * Math.PI * 0.6;
      const speed = 0.8 + Math.random() * 1.6;
      this.rainSplashes.push({
        x: worldX,
        y: worldY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.5,
        size: 1.5 + Math.random() * 1.5,
        alpha: 0.8,
        life: 14 + Math.random() * 8,
      });
    }
  }

  public addFloatingText(text: string, x: number, y: number, color = '#fbbf24') {
    this.floatingTexts.push({
      x,
      y,
      text,
      color,
      alpha: 1,
      life: 50,
    });
  }

  public addBurstParticles(x: number, y: number, color: string, count = 8) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 2.5;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color,
        size: 2 + Math.random() * 2.5,
        life: 25 + Math.random() * 15,
      });
    }
  }

  // Time tick: leisurely and relaxed! (FRAMES_PER_GAME_MINUTE = 20)
  public updateTime() {
    this.frameCount++;
    if (this.frameCount % FRAMES_PER_GAME_MINUTE === 0) {
      this.time.minute++;
      if (this.time.minute >= 60) {
        this.time.minute = 0;
        this.time.hour++;

        if (this.time.hour === 6) {
          sounds.playRooster();
        }

        if (this.time.hour >= 24) {
          this.advanceDay(true);
        }
      }
    }

    // 0. Update Priangan Highland leaf particle physics
    this.updateLeafParticles();

    // Weather simulation (puddles, splashes, distant thunder, mountain breeze)
    this.updateWeather();
    if (this.puddleStepCooldown > 0) this.puddleStepCooldown--;
    if (this.lightningFlashTimer > 0) this.lightningFlashTimer--;

    // Update Mang Jaja movement along his daily schedule
    this.updateMangJajaScheduleAndMovement();

    // Check NPC proximity for automatic floating greetings
    this.updateProximityBubbles();

    // Update animals every 45 frames
    if (this.frameCount % 45 === 0) {
      this.updateAnimals();
    }
  }

  private updateWeather() {
    // 1. Puddle evaporation or expansion
    for (const puddle of this.puddles) {
      if (this.isRaining) {
        puddle.depth = Math.min(1.0, puddle.depth + 0.003);
      } else {
        puddle.depth = Math.max(0.0, puddle.depth - 0.001);
      }
    }

    // 2. Spawn rain splash particles around visible world
    if (this.isRaining && Math.random() < 0.6) {
      const splashX = this.player.x + (Math.random() * 480 - 240);
      const splashY = this.player.y + (Math.random() * 360 - 180);
      this.addRainSplash(splashX, splashY);
    }

    // 3. Update rain splash physics
    for (let i = this.rainSplashes.length - 1; i >= 0; i--) {
      const s = this.rainSplashes[i];
      s.x += s.vx;
      s.y += s.vy;
      s.vy += 0.12;
      s.life--;
      s.alpha = Math.max(0, s.life / 20);
      if (s.life <= 0) {
        this.rainSplashes.splice(i, 1);
      }
    }

    // 4. Distant thunder & lightning flash in heavy rain (Musim Rendeng)
    if (this.isRaining && this.time.season === 'rendeng') {
      if (Math.random() < 0.0015 && this.lightningFlashTimer <= 0) {
        this.lightningFlashTimer = 6;
        sounds.playThunder();
        this.addFloatingText('⚡ Geleger Petir di Gunung Priangan!', this.player.x, this.player.y - 25, '#bae6fd');
      }
    }

    // 5. Highland mountain breeze fluttering tea leaves from tea hills
    if (this.frameCount % 24 === 0 && Math.random() < 0.8) {
      const breezeX = (28 + Math.random() * 12) * TILE_SIZE;
      const breezeY = (4 + Math.random() * 9) * TILE_SIZE;
      this.addLeafParticles(breezeX, breezeY, 1 + Math.floor(Math.random() * 2), 'tea');
    }
  }

  private updateMangJajaScheduleAndMovement() {
    const schedules = NPCS.mang_jaja?.schedule;
    if (!schedules || schedules.length === 0) return;

    const currentHour = this.time.hour;
    const currentSchedule =
      schedules.find((s) => currentHour >= s.startHour && currentHour < s.endHour) ||
      schedules[0];

    const targetPxX = currentSchedule.tileX * TILE_SIZE;
    const targetPxY = currentSchedule.tileY * TILE_SIZE;

    this.mangJaja.targetX = targetPxX;
    this.mangJaja.targetY = targetPxY;
    this.mangJaja.currentActivity = currentSchedule.activityName;
    this.mangJaja.locationName = currentSchedule.locationName;

    const dx = this.mangJaja.targetX - this.mangJaja.x;
    const dy = this.mangJaja.targetY - this.mangJaja.y;
    const dist = Math.hypot(dx, dy);

    if (dist > 2.5) {
      const speed = 1.0;
      const angle = Math.atan2(dy, dx);
      this.mangJaja.x += Math.cos(angle) * speed;
      this.mangJaja.y += Math.sin(angle) * speed;
      this.mangJaja.isMoving = true;
      this.mangJaja.animTimer += 0.16;

      if (Math.abs(dx) > Math.abs(dy)) {
        this.mangJaja.direction = dx > 0 ? 'right' : 'left';
      } else {
        this.mangJaja.direction = dy > 0 ? 'down' : 'up';
      }
    } else {
      this.mangJaja.x = this.mangJaja.targetX;
      this.mangJaja.y = this.mangJaja.targetY;
      this.mangJaja.isMoving = false;
    }
  }

  private updateProximityBubbles() {
    const playerCenterX = this.player.x + TILE_SIZE / 2;
    const playerCenterY = this.player.y + TILE_SIZE / 2;

    const npcsList = [
      {
        id: 'abah_surya' as NpcId,
        data: NPCS.abah_surya,
        x: this.map.abahPos.x * TILE_SIZE,
        y: this.map.abahPos.y * TILE_SIZE,
      },
      {
        id: 'neng_ceuceu' as NpcId,
        data: NPCS.neng_ceuceu,
        x: this.map.ceuceuPos.x * TILE_SIZE,
        y: this.map.ceuceuPos.y * TILE_SIZE,
      },
      {
        id: 'mang_ujang' as NpcId,
        data: NPCS.mang_ujang,
        x: this.map.ujangPos.x * TILE_SIZE,
        y: this.map.ujangPos.y * TILE_SIZE,
      },
      {
        id: 'mang_jaja' as NpcId,
        data: NPCS.mang_jaja,
        x: this.mangJaja.x,
        y: this.mangJaja.y,
      },
    ];

    let closestNpc: (typeof npcsList)[0] | null = null;
    let closestDist = Infinity;

    for (const npc of npcsList) {
      const dist = Math.hypot(
        playerCenterX - (npc.x + TILE_SIZE / 2),
        playerCenterY - (npc.y + TILE_SIZE / 2)
      );
      if (dist < closestDist) {
        closestDist = dist;
        closestNpc = npc;
      }
    }

    const proximityThreshold = TILE_SIZE * 2.3;

    if (closestNpc && closestDist <= proximityThreshold) {
      if (this.activeProximityNpc !== closestNpc.id) {
        this.activeProximityNpc = closestNpc.id;
        const greetings = closestNpc.data.proximityGreetings || closestNpc.data.dialogues;
        const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
        const festivalGreeting = this.currentFestival ? this.currentFestival.npcGreetings[closestNpc.id] : null;
        this.proximityBubbleText = festivalGreeting || randomGreeting;
        this.proximityTimer = 220;
        sounds.playHeart();
      }

      this.proximityBubbleOpacity = Math.min(1, this.proximityBubbleOpacity + 0.15);
      this.proximityNpcPos = { x: closestNpc.x, y: closestNpc.y };

      if (this.proximityTimer > 0) {
        this.proximityTimer--;
      } else {
        const greetings = closestNpc.data.proximityGreetings || closestNpc.data.dialogues;
        const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
        const festivalGreeting = this.currentFestival ? this.currentFestival.npcGreetings[closestNpc.id] : null;
        this.proximityBubbleText = festivalGreeting || randomGreeting;
        this.proximityTimer = 220;
      }
    } else {
      this.proximityBubbleOpacity = Math.max(0, this.proximityBubbleOpacity - 0.1);
      if (this.proximityBubbleOpacity <= 0) {
        this.activeProximityNpc = null;
      }
    }
  }

  private updateAnimals() {
    for (const animal of this.animals) {
      // Countdown fed timer
      if (animal.fedTimer && animal.fedTimer > 0) {
        animal.fedTimer -= 45;
        if (animal.fedTimer <= 0) {
          animal.isFed = false;
        }
      }

      // Egg laying timer for poultry (Ayam Kampung & Bebek Sawah)
      if (animal.type === 'ayam' || animal.type === 'bebek') {
        if (animal.eggTimer !== undefined) {
          // Fed poultry lays eggs faster!
          const decrement = animal.isFed ? 75 : 45;
          animal.eggTimer -= decrement;
          if (animal.eggTimer <= 0) {
            this.layEggFromAnimal(animal);
            animal.eggTimer = animal.isFed ? 380 + Math.random() * 260 : 850 + Math.random() * 450;
          }
        }
      }

      if (Math.random() < 0.4) {
        animal.isGrazing = !animal.isGrazing;
      }
      if (!animal.isGrazing && Math.random() < 0.6) {
        const offsetDist = animal.type === 'domba' ? 24 : 18;
        const newX = animal.x + (Math.random() * offsetDist * 2 - offsetDist);
        const newY = animal.y + (Math.random() * offsetDist * 2 - offsetDist);

        const col = Math.floor(newX / TILE_SIZE);
        const row = Math.floor(newY / TILE_SIZE);

        if (col >= 1 && col < MAP_COLS - 1 && row >= 1 && row < MAP_ROWS - 1) {
          const tile = this.map.tiles[row][col];
          if (tile.kind !== 'wall_bamboo' && tile.kind !== 'water_canal') {
            animal.direction = newX > animal.x ? 'right' : 'left';
            animal.x = newX;
            animal.y = newY;
          }
        }
      }
    }
  }

  // Periodic Egg Laying from fed/unfed poultry
  public layEggFromAnimal(animal: Animal) {
    if (this.laidEggs.length >= 18) return; // Cap maximum eggs on the ground

    const isChicken = animal.type === 'ayam';
    const eggX = animal.x + (animal.direction === 'right' ? -4 : 16);
    const eggY = animal.y + 12;

    this.laidEggs.push({
      id: `egg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      x: eggX,
      y: eggY,
      type: isChicken ? 'ayam' : 'bebek',
      animOffset: Math.random() * Math.PI * 2,
    });

    if (isChicken) {
      sounds.playChicken();
      this.addFloatingText('🥚 Hayam ngendog!', animal.x, animal.y - 12, '#fde047');
    } else {
      sounds.playDuck();
      this.addFloatingText('🥚 Bebek ngendog!', animal.x, animal.y - 12, '#38bdf8');
    }
    this.addBurstParticles(eggX, eggY, '#fde047', 6);
  }

  // Collect egg with sound, particles, and inventory addition
  public collectEgg(index: number) {
    if (index < 0 || index >= this.laidEggs.length) return;
    const egg = this.laidEggs.splice(index, 1)[0];

    sounds.playEggCollect();
    this.addBurstParticles(egg.x, egg.y, '#fef08a', 8);

    if (egg.type === 'ayam') {
      this.addItemToInventory({
        id: 'egg_ayam',
        name: 'Endog Hayam Kampung',
        sundaneseName: 'Endog Hayam Kampung Seger',
        category: 'animal_product',
        count: 1,
        sellPrice: 20,
        buyPrice: 0,
        icon: '🥚',
        energyBonus: 20,
        description: 'Telur ayam kampung segar bergizi. Bisa dimakan (+20 Stamina) atau dijual ke Abah Surya (+20 Kujang).',
      });
      this.addFloatingText('+1 Endog Hayam Kampung! 🥚', egg.x - 10, egg.y - 14, '#fde047');
    } else {
      this.addItemToInventory({
        id: 'egg_bebek',
        name: 'Endog Bebek Asin',
        sundaneseName: 'Endog Bebek Asin Gurih',
        category: 'animal_product',
        count: 1,
        sellPrice: 35,
        buyPrice: 0,
        icon: '🥚',
        energyBonus: 30,
        description: 'Telur bebek asin gurih kaya gizi khas Parahyangan. Jual bernilai tinggi (+35 Kujang) atau santap (+30 Stamina).',
      });
      this.addFloatingText('+1 Endog Bebek Asin! 🥚', egg.x - 10, egg.y - 14, '#38bdf8');
    }
  }

  // Feed trough in poultry pen to nourish all poultry at once
  public feedPoultryTrough() {
    const feedItem = this.inventory.find(
      (it) =>
        (it.id === 'feed_unggas' || it.id === 'pakan_ternak' || it.id === 'crop_padi' || it.id === 'seed_padi') &&
        it.count > 0
    );

    if (!feedItem) {
      this.addFloatingText('Palung Kosong! Butuh Pakan Bekatul / Gabah', 19 * TILE_SIZE, 11 * TILE_SIZE - 10, '#f87171');
      return;
    }

    feedItem.count--;
    sounds.playFeedAnimal();
    this.addBurstParticles(19 * TILE_SIZE + 20, 11 * TILE_SIZE + 20, '#facc15', 12);
    this.addFloatingText('Palung Terisi Bekatul & Gabah! 🌾', 19 * TILE_SIZE, 11 * TILE_SIZE - 10, '#fde047');

    let fedCount = 0;
    for (const animal of this.animals) {
      if (animal.type === 'ayam' || animal.type === 'bebek') {
        animal.isFed = true;
        animal.fedTimer = 2800;
        animal.happiness = Math.min(100, animal.happiness + 25);
        animal.eggTimer = Math.max(20, Math.floor((animal.eggTimer || 300) * 0.3));
        fedCount++;
      }
    }
    if (fedCount > 0) {
      sounds.playChicken();
      sounds.playDuck();
      this.addFloatingText(`${fedCount} Unggas Kenyang & Bahagia! ❤️`, 17 * TILE_SIZE, 11 * TILE_SIZE, '#4ade80');
    }
  }

  // Scatter feed on the ground to attract poultry
  public scatterPoultryFeed(worldX: number, worldY: number) {
    const currentItem = this.inventory[this.player.selectedSlot];
    if (!currentItem || currentItem.count <= 0) return;
    currentItem.count--;

    sounds.playFeedAnimal();
    this.addBurstParticles(worldX, worldY, '#facc15', 10);
    this.addFloatingText('🌾 Sebar Pakan Bekatul & Gabah!', worldX, worldY - 12, '#fde047');

    let fedCount = 0;
    for (const animal of this.animals) {
      if (animal.type === 'ayam' || animal.type === 'bebek') {
        const d = Math.hypot(animal.x - worldX, animal.y - worldY);
        if (d < 190) {
          animal.targetX = worldX + (Math.random() * 24 - 12);
          animal.targetY = worldY + (Math.random() * 24 - 12);
          animal.x = animal.targetX;
          animal.y = animal.targetY;
          animal.isFed = true;
          animal.fedTimer = 2400;
          animal.happiness = Math.min(100, animal.happiness + 20);
          animal.eggTimer = Math.max(15, Math.floor((animal.eggTimer || 300) * 0.35));
          fedCount++;
        }
      }
    }

    if (fedCount > 0) {
      if (Math.random() < 0.5) sounds.playChicken();
      else sounds.playDuck();
      this.addFloatingText(`${fedCount} Unggas Mematuk Pakan! ❤️`, worldX, worldY - 24, '#4ade80');
    }
  }

  public advanceDay(isExhausted = false) {
    this.applyBambooIrrigation();

    let cropsGrownCount = 0;
    for (let r = 0; r < MAP_ROWS; r++) {
      for (let c = 0; c < MAP_COLS; c++) {
        const tile = this.map.tiles[r][c];
        const wasWatered = tile.kind === 'soil_wet' || this.isRaining;

        if (tile.crop && wasWatered) {
          if (tile.crop.stage < tile.crop.maxStages) {
            tile.crop.stage++;
            cropsGrownCount++;
          }
        }

        if (tile.kind === 'soil_wet' && !this.isRaining) {
          tile.kind = 'soil_dry';
        }
      }
    }

    // Refresh livestock products & happiness
    let eggsCollected = 0;
    let woolCollected = 0;
    for (const animal of this.animals) {
      animal.hasProduct = true;
      animal.pettedToday = false;
      if (animal.type === 'ayam') eggsCollected++;
      if (animal.type === 'domba') woolCollected++;
    }

    let totalEarnings = 0;
    const soldBreakdown: { name: string; count: number; total: number }[] = [];

    if (this.shippingBinItems.length > 0) {
      for (const item of this.shippingBinItems) {
        const itemTotal = item.sellPrice * item.count;
        totalEarnings += itemTotal;
        soldBreakdown.push({
          name: item.name,
          count: item.count,
          total: itemTotal,
        });
      }
      this.player.kujangCoins += totalEarnings;
      this.shippingBinItems = [];
      sounds.playCoin();
    }

    this.time.day++;
    if (this.time.day > 28) {
      this.time.day = 1;
      if (this.time.season === 'kasa') this.time.season = 'katiga';
      else if (this.time.season === 'katiga') this.time.season = 'rendeng';
      else {
        this.time.season = 'kasa';
        this.time.year++;
      }
    }

    const seasonInfo = SEASONS_INFO[this.time.season];
    this.isRaining = Math.random() < seasonInfo.rainChance;
    this.checkFestival(true);
    if (this.isRaining) {
      for (const p of this.puddles) {
        p.depth = Math.min(1.0, p.depth + 0.4);
      }
    }

    this.time.hour = 6;
    this.time.minute = 0;

    if (isExhausted) {
      this.player.stamina = Math.floor(this.player.maxStamina * 0.65);
      this.addFloatingText('Pingsan Kelelahan! Stamina 65%', this.player.x, this.player.y, '#ef4444');
    } else {
      this.player.stamina = this.player.maxStamina;
      this.addFloatingText('Tidur Nyenyak di Saung! Stamina 100%', this.player.x, this.player.y, '#22c55e');
    }

    this.player.x = 6 * TILE_SIZE;
    this.player.y = 8 * TILE_SIZE;
    this.player.targetX = this.player.x;
    this.player.targetY = this.player.y;
    this.player.direction = 'down';

    sounds.playRooster();

    if (this.onDailyReport) {
      this.onDailyReport({
        day: this.time.day - 1 === 0 ? 28 : this.time.day - 1,
        itemsSold: soldBreakdown,
        totalEarnings,
        cropsGrownCount,
        eggsCollected,
        woolCollected,
      });
    }
  }

  private applyBambooIrrigation() {
    let wateredTilesCount = 0;
    for (let r = 0; r < MAP_ROWS; r++) {
      for (let c = 0; c < MAP_COLS; c++) {
        const tile = this.map.tiles[r][c];
        if (tile.hasBambooAqueduct) {
          const coords = [
            { r, c },
            { r: r - 1, c },
            { r: r + 1, c },
            { r, c: c - 1 },
            { r, c: c + 1 },
          ];
          for (const pos of coords) {
            if (pos.r >= 0 && pos.r < MAP_ROWS && pos.c >= 0 && pos.c < MAP_COLS) {
              const target = this.map.tiles[pos.r][pos.c];
              if (target.kind === 'soil_dry') {
                target.kind = 'soil_wet';
                wateredTilesCount++;
              }
            }
          }
        }
      }
    }
    if (wateredTilesCount > 0) {
      sounds.playBambooWater();
    }
  }

  // Smooth 8-directional and analog movement with collision sliding
  public movePlayer(dx: number, dy: number, forceSprint = false) {
    if (this.player.isActing) return;

    const dist = Math.hypot(dx, dy);
    if (dist > 0.08) {
      // Calculate 8-direction heading based on angle
      const angle = Math.atan2(dy, dx);
      const deg = ((angle * 180) / Math.PI + 360) % 360;

      if (deg >= 67.5 && deg < 112.5) {
        this.player.direction = 'down';
      } else if (deg >= 112.5 && deg < 157.5) {
        this.player.direction = 'down-left';
      } else if (deg >= 157.5 && deg < 202.5) {
        this.player.direction = 'left';
      } else if (deg >= 202.5 && deg < 247.5) {
        this.player.direction = 'up-left';
      } else if (deg >= 247.5 && deg < 292.5) {
        this.player.direction = 'up';
      } else if (deg >= 292.5 && deg < 337.5) {
        this.player.direction = 'up-right';
      } else if (deg >= 337.5 || deg < 22.5) {
        this.player.direction = 'right';
      } else {
        this.player.direction = 'down-right';
      }
    }

    // Leisurely & realistic rural movement: walk speed 2.2 px/frame, light jog sprint 3.4 px/frame, halved if stamina <= 0
    const isSprinting = forceSprint || this.player.isSprinting;
    let speed = isSprinting ? 3.4 : 2.2;
    if (this.player.stamina <= 0) speed = 1.2;

    // Normalize velocity vector
    const normFactor = dist > 1 ? 1 / dist : 1;
    const vx = dx * normFactor * speed;
    const vy = dy * normFactor * speed;

    const newX = this.player.x + vx;
    const newY = this.player.y + vy;

    // Smooth collision sliding (allows sliding along fences/walls effortlessly)
    let moved = false;
    if (this.canWalkTo(newX, newY)) {
      this.player.x = newX;
      this.player.y = newY;
      moved = true;
    } else if (Math.abs(vx) > 0.1 && this.canWalkTo(newX, this.player.y)) {
      this.player.x = newX;
      moved = true;
    } else if (Math.abs(vy) > 0.1 && this.canWalkTo(this.player.x, newY)) {
      this.player.y = newY;
      moved = true;
    }

    if (moved) {
      this.player.isMoving = true;
      this.animTimer += (isSprinting ? 0.22 : 0.14) * Math.min(1.2, Math.max(0.6, dist));

      // Dust puff particles while sprinting
      if (isSprinting && this.frameCount % 7 === 0) {
        this.addBurstParticles(this.player.x + 18, this.player.y + 33, '#d97706', 2);
      }

      // Puddle stepping splash detection
      if (this.puddleStepCooldown <= 0) {
        const feetX = this.player.x + 18;
        const feetY = this.player.y + 32;
        for (const puddle of this.puddles) {
          if (puddle.depth > 0.25) {
            const dxP = (feetX - puddle.x) / (puddle.rx * (0.6 + puddle.depth * 0.4));
            const dyP = (feetY - puddle.y) / (puddle.ry * (0.6 + puddle.depth * 0.4));
            if (dxP * dxP + dyP * dyP <= 1.0) {
              this.addBurstParticles(feetX, feetY, '#7dd3fc', 4);
              sounds.playPuddleSplash();
              this.puddleStepCooldown = 18;
              break;
            }
          }
        }
      }

      // Tea leaf particle flutter when active in tea plantation hills or crop areas
      const pCol = Math.floor((this.player.x + 18) / TILE_SIZE);
      const pRow = Math.floor((this.player.y + 24) / TILE_SIZE);
      const isNearTea = pCol >= 27 && pCol <= 43 && pRow >= 3 && pRow <= 15;
      const currentTile =
        pCol >= 0 && pCol < MAP_COLS && pRow >= 0 && pRow < MAP_ROWS ? this.map.tiles[pRow][pCol] : null;
      const isOverCrop = currentTile?.crop !== null;

      if ((isNearTea || isOverCrop) && this.frameCount % (isSprinting ? 6 : 14) === 0) {
        const leafType = currentTile?.crop?.type === 'padi' ? 'golden' : isNearTea ? 'tea' : 'bamboo';
        this.addLeafParticles(this.player.x + 18, this.player.y + 20, 1, leafType);
        if (Math.random() < 0.12) {
          sounds.playLeafRustle();
        }
      }

      // Proximity walk-over egg pickup
      for (let i = this.laidEggs.length - 1; i >= 0; i--) {
        const egg = this.laidEggs[i];
        const distToEgg = Math.hypot(this.player.x + 18 - egg.x, this.player.y + 24 - egg.y);
        if (distToEgg < 24) {
          this.collectEgg(i);
        }
      }
    } else {
      this.player.isMoving = false;
    }
  }

  public stopMoving() {
    this.player.isMoving = false;
  }

  private canWalkTo(px: number, py: number): boolean {
    const margin = 10;
    const points = [
      { x: px + margin, y: py + margin },
      { x: px + TILE_SIZE - margin, y: py + margin },
      { x: px + margin, y: py + TILE_SIZE - margin },
      { x: px + TILE_SIZE - margin, y: py + TILE_SIZE - margin },
    ];

    for (const pt of points) {
      const col = Math.floor(pt.x / TILE_SIZE);
      const row = Math.floor(pt.y / TILE_SIZE);

      if (col < 0 || col >= MAP_COLS || row < 0 || row >= MAP_ROWS) return false;

      const tile = this.map.tiles[row][col];
      if (
        tile.kind === 'wall_bamboo' ||
        tile.kind === 'water_canal' ||
        tile.kind === 'pond' ||
        tile.kind === 'rock' ||
        tile.kind === 'shipping_bin' ||
        tile.kind === 'fence'
      ) {
        return false;
      }

      // NPC collisions
      const npcPositions = [
        { x: this.map.abahPos.x, y: this.map.abahPos.y },
        { x: this.map.ceuceuPos.x, y: this.map.ceuceuPos.y },
        { x: this.map.ujangPos.x, y: this.map.ujangPos.y },
        {
          x: Math.floor((this.mangJaja.x + TILE_SIZE / 2) / TILE_SIZE),
          y: Math.floor((this.mangJaja.y + TILE_SIZE / 2) / TILE_SIZE),
        },
      ];
      for (const pos of npcPositions) {
        if (col === pos.x && row === pos.y) return false;
      }
    }
    return true;
  }

  public getTargetTileCoord(): { col: number; row: number } {
    let col = Math.floor((this.player.x + TILE_SIZE / 2) / TILE_SIZE);
    let row = Math.floor((this.player.y + TILE_SIZE / 2) / TILE_SIZE);

    switch (this.player.direction) {
      case 'up':
        row -= 1;
        break;
      case 'down':
        row += 1;
        break;
      case 'left':
        col -= 1;
        break;
      case 'right':
        col += 1;
        break;
      case 'up-right':
        row -= 1;
        col += 1;
        break;
      case 'up-left':
        row -= 1;
        col -= 1;
        break;
      case 'down-right':
        row += 1;
        col += 1;
        break;
      case 'down-left':
        row += 1;
        col -= 1;
        break;
    }
    return {
      col: Math.max(0, Math.min(MAP_COLS - 1, col)),
      row: Math.max(0, Math.min(MAP_ROWS - 1, row)),
    };
  }

  // Interacting or acting with tools
  public performAction() {
    if (this.player.isActing) return;

    const { col, row } = this.getTargetTileCoord();
    const playerCol = Math.floor((this.player.x + TILE_SIZE / 2) / TILE_SIZE);
    const playerRow = Math.floor((this.player.y + TILE_SIZE / 2) / TILE_SIZE);

    // 1. Check talking with Abah Surya
    const abahDist = Math.hypot(playerCol - this.map.abahPos.x, playerRow - this.map.abahPos.y);
    if (abahDist <= 1.8 && this.onTalkNpc) {
      this.onTalkNpc('abah_surya');
      return;
    }

    // 2. Check talking with Neng Ceuceu
    const ceuceuDist = Math.hypot(playerCol - this.map.ceuceuPos.x, playerRow - this.map.ceuceuPos.y);
    if (ceuceuDist <= 1.8 && this.onTalkNpc) {
      this.onTalkNpc('neng_ceuceu');
      return;
    }

    // 3. Check talking with Mang Ujang
    const ujangDist = Math.hypot(playerCol - this.map.ujangPos.x, playerRow - this.map.ujangPos.y);
    if (ujangDist <= 1.8 && this.onTalkNpc) {
      this.onTalkNpc('mang_ujang');
      return;
    }

    // 3.5 Check talking with Mang Jaja (Pedagang Keliling & Pengrajin Awi)
    const jajaCol = Math.floor((this.mangJaja.x + TILE_SIZE / 2) / TILE_SIZE);
    const jajaRow = Math.floor((this.mangJaja.y + TILE_SIZE / 2) / TILE_SIZE);
    const jajaDist = Math.hypot(playerCol - jajaCol, playerRow - jajaRow);
    if (jajaDist <= 1.8 && this.onTalkNpc) {
      this.onTalkNpc('mang_jaja');
      return;
    }

    // 3.8 Check collecting nearby laid eggs via Action button [E] / Tap
    for (let i = this.laidEggs.length - 1; i >= 0; i--) {
      const egg = this.laidEggs[i];
      const eggDist = Math.hypot(this.player.x + 18 - egg.x, this.player.y + 18 - egg.y);
      if (eggDist <= 38) {
        this.collectEgg(i);
        return;
      }
    }

    // 3.9 Check poultry trough at (19, 11)
    const troughDist = Math.hypot(playerCol - 19, playerRow - 11);
    if (troughDist <= 1.8) {
      this.feedPoultryTrough();
      return;
    }

    // 4. Check interacting with Livestock (Petting / Shearing / Feeding / Collecting Eggs)
    for (const animal of this.animals) {
      const animalDist = Math.hypot(this.player.x - animal.x, this.player.y - animal.y);
      if (animalDist < TILE_SIZE * 1.5) {
        this.interactWithAnimal(animal);
        return;
      }
    }

    // 5. Check interacting with Saung Bale Bed
    const bedDist = Math.hypot(playerCol - this.map.saungBedPos.x, playerRow - this.map.saungBedPos.y);
    if (bedDist <= 1.5 && this.onSleepPrompt) {
      this.onSleepPrompt();
      return;
    }

    // 6. Check interacting with Shipping Bin
    const binDist = Math.hypot(playerCol - this.map.shippingBinPos.x, playerRow - this.map.shippingBinPos.y);
    if (binDist <= 1.8 && this.onShippingBinPrompt) {
      this.onShippingBinPrompt();
      return;
    }

    // 7. Tool action on tile
    const currentItem = this.inventory[this.player.selectedSlot];
    if (!currentItem) return;

    const targetTile = this.map.tiles[row][col];
    const targetCenterX = col * TILE_SIZE + TILE_SIZE / 2;
    const targetCenterY = row * TILE_SIZE + TILE_SIZE / 2;

    // Scatter poultry feed onto farm yard to feed chickens & ducks
    if ((currentItem.id === 'feed_unggas' || currentItem.id === 'pakan_ternak') && currentItem.count > 0) {
      this.scatterPoultryFeed(targetCenterX, targetCenterY);
      return;
    }

    if (currentItem.category === 'food' && currentItem.energyBonus) {
      if (currentItem.count > 0) {
        this.consumeFood(currentItem);
        return;
      }
    }

    if (this.player.stamina < 3 && currentItem.category === 'tool') {
      this.addFloatingText('Stamina Habis! Makan / Istirahat', this.player.x, this.player.y, '#ef4444');
      sounds.playEat();
      if (this.onStaminaAlert) this.onStaminaAlert();
      return;
    }

    // Cangkul
    if (currentItem.toolType === 'cangkul') {
      if (targetTile.kind === 'grass' || targetTile.kind === 'soil_dry') {
        this.startToolSwing('cangkul');
        targetTile.kind = 'soil_dry';
        this.drainStamina(3);
        sounds.playHoe();
        this.addBurstParticles(targetCenterX, targetCenterY, '#78350f', 8);
        this.addFloatingText('-3 Stamina', targetCenterX, targetCenterY - 10, '#f97316');

        // Tea hills leaf flutter effect
        if (col >= 27 && col <= 43 && row >= 3 && row <= 15) {
          this.addLeafParticles(targetCenterX, targetCenterY, 3, 'tea');
          sounds.playLeafRustle();
        }
      }
      return;
    }

    // Gembor
    if (currentItem.toolType === 'gembor') {
      if (targetTile.kind === 'water_canal' || targetTile.kind === 'pond') {
        sounds.playWater();
        this.addBurstParticles(targetCenterX, targetCenterY, '#38bdf8', 10);
        this.addFloatingText('Gembor Penuh Air!', this.player.x, this.player.y, '#38bdf8');
        return;
      }

      if (targetTile.kind === 'soil_dry') {
        this.startToolSwing('gembor');
        targetTile.kind = 'soil_wet';
        this.drainStamina(2);
        sounds.playWater();
        this.addBurstParticles(targetCenterX, targetCenterY, '#38bdf8', 10);
        this.addFloatingText('-2 Stamina', targetCenterX, targetCenterY - 10, '#38bdf8');

        if (col >= 27 && col <= 43 && row >= 3 && row <= 15) {
          this.addLeafParticles(targetCenterX, targetCenterY, 2, 'tea');
        }
      }
      return;
    }

    // Menanam Bibit
    if (currentItem.category === 'seed' && currentItem.count > 0) {
      if ((targetTile.kind === 'soil_dry' || targetTile.kind === 'soil_wet') && !targetTile.crop) {
        const cropType =
          currentItem.toolType === 'bibit_padi'
            ? 'padi'
            : currentItem.toolType === 'bibit_ubi'
            ? 'ubi'
            : 'teh';

        targetTile.crop = {
          type: cropType,
          stage: 0,
          daysInStage: 0,
          maxStages: 3,
          isWatered: targetTile.kind === 'soil_wet',
          regrowable: cropType === 'teh',
        };

        currentItem.count--;
        this.drainStamina(1);
        sounds.playPlant();
        this.addBurstParticles(targetCenterX, targetCenterY, '#4ade80', 6);
        this.addFloatingText(`Tanam ${currentItem.name}!`, targetCenterX, targetCenterY - 10, '#86efac');

        if (cropType === 'teh') {
          this.addLeafParticles(targetCenterX, targetCenterY, 4, 'tea');
        }
      }
      return;
    }

    // Talang Bambu
    if (currentItem.toolType === 'talang_bambu' && currentItem.count > 0) {
      if (!targetTile.hasBambooAqueduct && targetTile.kind !== 'pond' && targetTile.kind !== 'wall_bamboo') {
        targetTile.hasBambooAqueduct = true;
        currentItem.count--;
        this.drainStamina(2);
        sounds.playBambooWater();
        this.addBurstParticles(targetCenterX, targetCenterY, '#84cc16', 8);
        this.addFloatingText('Talang Awi Terpasang!', targetCenterX, targetCenterY - 10, '#bef264');
      }
      return;
    }

    // Sabit / Panen
    if (targetTile.crop && targetTile.crop.stage >= targetTile.crop.maxStages) {
      this.harvestCrop(targetTile, targetCenterX, targetCenterY);
      return;
    }
  }

  private interactWithAnimal(animal: Animal) {
    sounds.playHeart();
    this.addBurstParticles(animal.x, animal.y, '#f43f5e', 8);

    const currentItem = this.inventory[this.player.selectedSlot];
    const isHoldingFeed =
      currentItem &&
      (currentItem.id === 'feed_unggas' ||
        currentItem.id === 'pakan_ternak' ||
        currentItem.id === 'crop_padi' ||
        currentItem.id === 'seed_padi') &&
      currentItem.count > 0;

    // Direct feeding of poultry
    if (isHoldingFeed && (animal.type === 'ayam' || animal.type === 'bebek')) {
      currentItem.count--;
      animal.isFed = true;
      animal.fedTimer = 2400;
      animal.happiness = Math.min(100, animal.happiness + 20);
      animal.eggTimer = Math.max(15, Math.floor((animal.eggTimer || 300) * 0.35));
      sounds.playFeedAnimal();
      if (animal.type === 'ayam') sounds.playChicken();
      else sounds.playDuck();
      this.addBurstParticles(animal.x, animal.y, '#facc15', 10);
      this.addFloatingText(`Diberi Pakan! ${animal.name} Bahagia! ❤️`, animal.x - 10, animal.y - 14, '#4ade80');
      return;
    }

    if (animal.type === 'domba') {
      sounds.playSheep();
      if (animal.hasProduct) {
        animal.hasProduct = false;
        this.addItemToInventory({
          id: 'wool_domba',
          name: 'Bulu Domba Garut',
          sundaneseName: 'Bulu Domba Garut Kandel',
          category: 'animal_product',
          count: 1,
          sellPrice: 40,
          buyPrice: 0,
          icon: '🐑',
          description: 'Wol domba Garut tebal dan halus. Nilai jual tinggi.',
        });
        this.addFloatingText('+1 Bulu Domba Garut (+40 Kujang)!', animal.x, animal.y - 14, '#fde047');
      } else {
        animal.happiness = Math.min(100, animal.happiness + 10);
        this.addFloatingText(`Elus ${animal.name} (Bahagia ❤️)!`, animal.x, animal.y - 14, '#fb7185');
      }
    } else if (animal.type === 'ayam') {
      sounds.playChicken();
      if (animal.hasProduct) {
        animal.hasProduct = false;
        this.addItemToInventory({
          id: 'egg_ayam',
          name: 'Endog Hayam Kampung',
          sundaneseName: 'Endog Hayam Kampung Seger',
          category: 'animal_product',
          count: 1,
          sellPrice: 20,
          buyPrice: 0,
          icon: '🥚',
          energyBonus: 20,
          description: 'Telur ayam kampung segar bergizi. Bisa dimakan (+20 Stamina) atau dijual.',
        });
        this.addFloatingText('+1 Endog Hayam Kampung!', animal.x, animal.y - 14, '#fde047');
      } else {
        animal.happiness = Math.min(100, animal.happiness + 10);
        this.addFloatingText(`Petok! ${animal.name} senang dielus! ❤️`, animal.x, animal.y - 14, '#fde047');
      }
    } else if (animal.type === 'bebek') {
      sounds.playDuck();
      if (animal.hasProduct) {
        animal.hasProduct = false;
        this.addItemToInventory({
          id: 'egg_bebek',
          name: 'Endog Bebek Asin',
          sundaneseName: 'Endog Bebek Asin Gurih',
          category: 'animal_product',
          count: 1,
          sellPrice: 35,
          buyPrice: 0,
          icon: '🥚',
          energyBonus: 30,
          description: 'Telur bebek asin gurih kaya gizi khas Parahyangan. Jual mahal (+35 Kujang) atau santap.',
        });
        this.addFloatingText('+1 Endog Bebek Asin!', animal.x, animal.y - 14, '#38bdf8');
      } else {
        animal.happiness = Math.min(100, animal.happiness + 10);
        this.addFloatingText(`Kwek-kwek! ${animal.name} riang dielus! ❤️`, animal.x, animal.y - 14, '#38bdf8');
      }
    }
  }

  private harvestCrop(tile: TileData, x: number, y: number) {
    if (!tile.crop) return;
    const crop = tile.crop;
    sounds.playHarvest();
    this.addBurstParticles(x, y, '#eab308', 14);

    let harvestedItemName = '';
    let cropId = '';
    let sellVal = 30;
    let icon = '🌾';

    if (crop.type === 'padi') {
      harvestedItemName = 'Padi Pandan Wangi';
      cropId = 'crop_padi';
      sellVal = 45;
      icon = '🌾';
      this.addLeafParticles(x, y, 7, 'golden');
    } else if (crop.type === 'ubi') {
      harvestedItemName = 'Ubi Cilembu Manis';
      cropId = 'crop_ubi';
      sellVal = 32;
      icon = '🍠';
    } else {
      harvestedItemName = 'Daun Teh Preanger';
      cropId = 'crop_teh';
      sellVal = 28;
      icon = '🍃';
      // Highland Preanger tea leaves explosion effect!
      this.addLeafParticles(x, y, 14, 'tea');
      sounds.playLeafRustle();
    }

    this.addItemToInventory({
      id: cropId,
      name: harvestedItemName,
      sundaneseName: harvestedItemName,
      category: 'crop',
      count: 2 + Math.floor(Math.random() * 2),
      sellPrice: sellVal,
      buyPrice: 0,
      icon,
      description: `Hasil panen bermutu tinggi khas tatar Parahyangan.`,
    });

    this.addFloatingText(`+ Panen ${harvestedItemName}!`, x, y - 14, '#fde047');
    this.drainStamina(1);

    if (crop.regrowable) {
      crop.stage = 1;
    } else {
      tile.crop = null;
    }
  }

  public addItemToInventory(item: InventoryItem) {
    const existing = this.inventory.find((i) => i.id === item.id);
    if (existing) {
      existing.count += item.count;
    } else {
      this.inventory.push({ ...item });
    }
  }

  private consumeFood(item: InventoryItem) {
    if (!item.energyBonus) return;
    item.count--;
    this.player.stamina = Math.min(this.player.maxStamina, this.player.stamina + item.energyBonus);
    sounds.playEat();
    this.addFloatingText(`+${item.energyBonus} Stamina!`, this.player.x, this.player.y - 12, '#22c55e');
    this.addBurstParticles(this.player.x, this.player.y, '#22c55e', 8);
  }

  private drainStamina(amount: number) {
    this.player.stamina = Math.max(0, this.player.stamina - amount);
    if (this.player.stamina < 15 && this.onStaminaAlert) {
      this.onStaminaAlert();
    }
  }

  private startToolSwing(type: 'cangkul' | 'gembor' | 'harvest' | 'general') {
    this.player.isActing = true;
    this.actionType = type;
    this.swingTimer = 12;
  }

  // Master Render Loop
  public render() {
    const { ctx, canvas } = this;
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    const worldW = MAP_COLS * TILE_SIZE;
    const worldH = MAP_ROWS * TILE_SIZE;

    const targetCamX = this.player.x + TILE_SIZE / 2 - width / 2;
    const targetCamY = this.player.y + TILE_SIZE / 2 - height / 2;

    this.cameraX += (Math.max(0, Math.min(worldW - width, targetCamX)) - this.cameraX) * 0.15;
    this.cameraY += (Math.max(0, Math.min(worldH - height, targetCamY)) - this.cameraY) * 0.15;

    ctx.save();
    ctx.translate(-Math.floor(this.cameraX), -Math.floor(this.cameraY));

    // 1. Sky & Mountains
    this.drawParahyanganSkyAndMountains(ctx, worldW);

    // 2. Tiles
    const startCol = Math.max(0, Math.floor(this.cameraX / TILE_SIZE));
    const endCol = Math.min(MAP_COLS - 1, Math.ceil((this.cameraX + width) / TILE_SIZE));
    const startRow = Math.max(0, Math.floor(this.cameraY / TILE_SIZE));
    const endRow = Math.min(MAP_ROWS - 1, Math.ceil((this.cameraY + height) / TILE_SIZE));

    for (let r = startRow; r <= endRow; r++) {
      for (let c = startCol; c <= endCol; c++) {
        this.drawTile(ctx, r, c);
      }
    }

    // 2.5 Organic Reflective Puddles on ground
    this.drawPuddles(ctx);

    // 3. Fishes in Balong
    this.updateAndDrawFishes(ctx);

    // 4. Crops
    for (let r = startRow; r <= endRow; r++) {
      for (let c = startCol; c <= endCol; c++) {
        const tile = this.map.tiles[r][c];
        if (tile.crop) {
          this.drawCrop(ctx, tile.crop, c * TILE_SIZE, r * TILE_SIZE);
        }
      }
    }

    // 5. Bamboo Aqueducts
    for (let r = startRow; r <= endRow; r++) {
      for (let c = startCol; c <= endCol; c++) {
        const tile = this.map.tiles[r][c];
        if (tile.hasBambooAqueduct) {
          this.drawBambooAqueduct(ctx, c * TILE_SIZE, r * TILE_SIZE);
        }
      }
    }

    // 5.5 Sundanese Festival Decorations (Penjor Bambu, Janur Kuning, Umbul-Umbul)
    if (this.currentFestival) {
      this.drawFestivalDecorations(ctx);
    }

    // 6. Saung Bambu Architecture
    this.drawSaungBambu(ctx);

    // 6.5 Small Poultry Farm Pen (Paranje Hayam & Bebek, Sarang Jerami, Palung Pakan)
    this.drawPoultryPen(ctx);

    // 6.7 Laid Eggs in nests and farm yard
    this.drawLaidEggs(ctx);

    // 7. Shipping Bin (Peti Jual)
    this.drawShippingBin(ctx);

    // 8. Livestock Animals (Domba Garut, Ayam Kampung, Bebek)
    this.drawAnimals(ctx);

    // 9. NPCs (Abah Surya, Neng Ceuceu, Mang Ujang) with 3D Depth Shading
    this.drawNpcs(ctx);

    // 10. Target Indicator
    this.drawTargetIndicator(ctx);

    // 11. Pseudo-3D Shaded Player Character
    this.draw3DShadedPlayer(ctx);

    // 11.5 Ground & Surface Rain Splashes
    if (this.isRaining) {
      this.renderRainSplashes(ctx);
    }

    // 11.7 Mountain Breeze Fluttering Leaf Particles (Daun Teh Priangan)
    this.renderLeafParticles(ctx);

    // 12. Particles & Floating Texts
    this.renderParticles(ctx);
    this.renderFloatingTexts(ctx);

    ctx.restore();

    // 13. Comprehensive Weather & Atmospheric Ambient System
    this.drawWeatherAndAtmosphere(ctx, width, height);

    if (this.swingTimer > 0) {
      this.swingTimer--;
      if (this.swingTimer <= 0) {
        this.player.isActing = false;
      }
    }
  }

  private drawParahyanganSkyAndMountains(ctx: CanvasRenderingContext2D, worldW: number) {
    const skyGrad = ctx.createLinearGradient(0, 0, 0, 160);
    if (this.time.hour >= 6 && this.time.hour < 10) {
      skyGrad.addColorStop(0, '#fde68a');
      skyGrad.addColorStop(1, '#93c5fd');
    } else if (this.time.hour >= 10 && this.time.hour < 17) {
      skyGrad.addColorStop(0, '#60a5fa');
      skyGrad.addColorStop(1, '#bae6fd');
    } else if (this.time.hour >= 17 && this.time.hour < 19) {
      skyGrad.addColorStop(0, '#ea580c');
      skyGrad.addColorStop(1, '#fde047');
    } else {
      skyGrad.addColorStop(0, '#0f172a');
      skyGrad.addColorStop(1, '#1e293b');
    }
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, -60, worldW, 160);

    ctx.fillStyle = this.time.hour >= 19 || this.time.hour < 6 ? '#1e293b' : '#334155';
    ctx.beginPath();
    ctx.moveTo(0, 120);
    ctx.lineTo(200, 30);
    ctx.lineTo(440, 70);
    ctx.lineTo(650, 20);
    ctx.lineTo(900, 80);
    ctx.lineTo(1200, 25);
    ctx.lineTo(worldW, 110);
    ctx.lineTo(worldW, 130);
    ctx.lineTo(0, 130);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
    const mistShift = (this.frameCount * 0.25) % (worldW + 300);
    ctx.beginPath();
    ctx.arc(mistShift - 100, 50, 45, 0, Math.PI * 2);
    ctx.arc(mistShift - 60, 40, 55, 0, Math.PI * 2);
    ctx.arc(mistShift, 50, 45, 0, Math.PI * 2);
    ctx.fill();
  }

  private drawTile(ctx: CanvasRenderingContext2D, r: number, c: number) {
    const tile = this.map.tiles[r][c];
    const x = c * TILE_SIZE;
    const y = r * TILE_SIZE;

    switch (tile.kind) {
      case 'grass': {
        ctx.fillStyle = r % 2 === 0 ? '#4ade80' : '#22c55e';
        ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
        ctx.fillStyle = '#16a34a';
        ctx.fillRect(x + 6, y + 8, 2, 4);
        ctx.fillRect(x + 22, y + 18, 2, 5);

        if ((r * 13 + c * 7) % 9 === 0) {
          ctx.fillStyle = '#fef08a';
          ctx.fillRect(x + 14, y + 14, 3, 3);
        }
        break;
      }
      case 'soil_dry': {
        ctx.fillStyle = '#92400e';
        ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
        ctx.fillStyle = '#78350f';
        ctx.fillRect(x, y + 5, TILE_SIZE, 3);
        ctx.fillRect(x, y + 16, TILE_SIZE, 3);
        ctx.fillRect(x, y + 27, TILE_SIZE, 3);
        break;
      }
      case 'soil_wet': {
        ctx.fillStyle = '#451a03';
        ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
        ctx.fillStyle = '#78350f';
        ctx.fillRect(x, y + 4, TILE_SIZE, 4);
        ctx.fillRect(x, y + 15, TILE_SIZE, 4);
        ctx.fillRect(x, y + 26, TILE_SIZE, 4);
        ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
        ctx.fillRect(x + 4, y + 8, 10, 2);
        ctx.fillRect(x + 18, y + 20, 12, 2);
        break;
      }
      case 'path': {
        ctx.fillStyle = '#d97706';
        ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
        ctx.fillStyle = '#b45309';
        ctx.fillRect(x + 4, y + 6, 8, 6);
        ctx.fillRect(x + 18, y + 16, 10, 7);
        break;
      }
      case 'fence': {
        // Wooden bamboo fence post
        ctx.fillStyle = '#4ade80';
        ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
        ctx.fillStyle = '#a16207';
        ctx.fillRect(x + 4, y + 4, 6, TILE_SIZE - 4);
        ctx.fillRect(x + 24, y + 4, 6, TILE_SIZE - 4);
        ctx.fillStyle = '#ca8a04';
        ctx.fillRect(x, y + 10, TILE_SIZE, 4);
        ctx.fillRect(x, y + 22, TILE_SIZE, 4);
        break;
      }
      case 'hay_bale': {
        ctx.fillStyle = '#facc15';
        ctx.fillRect(x + 2, y + 4, TILE_SIZE - 4, TILE_SIZE - 8);
        ctx.fillStyle = '#ca8a04';
        ctx.strokeRect(x + 2, y + 4, TILE_SIZE - 4, TILE_SIZE - 8);
        break;
      }
      case 'trough': {
        ctx.fillStyle = '#78350f';
        ctx.fillRect(x + 4, y + 8, TILE_SIZE - 8, TILE_SIZE - 16);
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(x + 6, y + 12, TILE_SIZE - 12, 6);
        break;
      }
      case 'water_canal': {
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
        const waveOffset = (this.frameCount * 0.8) % 18;
        ctx.fillStyle = '#bae6fd';
        ctx.fillRect(x + 4, y + waveOffset, TILE_SIZE - 8, 2);
        break;
      }
      case 'bridge_bamboo': {
        // Water canal under bridge
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
        const waveOffset = (this.frameCount * 0.8) % 18;
        ctx.fillStyle = '#bae6fd';
        ctx.fillRect(x + 2, y + waveOffset, TILE_SIZE - 4, 1.5);

        // Bamboo Bridge Deck (Cukang Awi)
        ctx.fillStyle = '#713f12';
        ctx.fillRect(x, y + 2, TILE_SIZE, TILE_SIZE - 4);

        // 4 Horizontal bamboo logs
        const logHeight = 7;
        for (let i = 0; i < 4; i++) {
          const ly = y + 4 + i * logHeight;
          ctx.fillStyle = i % 2 === 0 ? '#a16207' : '#ca8a04';
          ctx.fillRect(x, ly, TILE_SIZE, logHeight - 1);
          // Bamboo nodes
          ctx.fillStyle = '#854d0e';
          ctx.fillRect(x + 6, ly, 2, logHeight - 1);
          ctx.fillRect(x + 19, ly, 2, logHeight - 1);
          ctx.fillRect(x + 30, ly, 2, logHeight - 1);
        }

        // Top & Bottom Bamboo Handrails (Pager Cukang)
        ctx.fillStyle = '#451a03';
        ctx.fillRect(x, y + 1, TILE_SIZE, 3);
        ctx.fillRect(x, y + TILE_SIZE - 4, TILE_SIZE, 3);
        ctx.fillStyle = '#facc15';
        ctx.fillRect(x, y + 2, TILE_SIZE, 1);
        ctx.fillRect(x, y + TILE_SIZE - 3, TILE_SIZE, 1);

        // Posts & hemp rope lashings
        ctx.fillStyle = '#78350f';
        ctx.fillRect(x + 2, y, 3, TILE_SIZE);
        ctx.fillRect(x + TILE_SIZE - 5, y, 3, TILE_SIZE);
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(x + 1, y + 1, 5, 2);
        ctx.fillRect(x + TILE_SIZE - 6, y + 1, 5, 2);
        ctx.fillRect(x + 1, y + TILE_SIZE - 4, 5, 2);
        ctx.fillRect(x + TILE_SIZE - 6, y + TILE_SIZE - 4, 5, 2);
        break;
      }
      case 'pond': {
        ctx.fillStyle = '#0369a1';
        ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
        const ripple = Math.sin((this.frameCount + c * 10 + r * 15) * 0.05) * 2;
        ctx.fillStyle = 'rgba(186, 230, 253, 0.25)';
        ctx.fillRect(x + 4, y + 10 + ripple, 12, 2);
        break;
      }
      case 'wood_floor': {
        ctx.fillStyle = '#ca8a04';
        ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
        ctx.fillStyle = '#a16207';
        for (let i = 0; i < TILE_SIZE; i += 7) {
          ctx.fillRect(x, y + i, TILE_SIZE, 1);
        }
        break;
      }
      case 'wall_bamboo': {
        ctx.fillStyle = '#854d0e';
        ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
        ctx.fillStyle = '#a16207';
        ctx.fillRect(x + 2, y, 4, TILE_SIZE);
        ctx.fillRect(x + 10, y, 4, TILE_SIZE);
        ctx.fillRect(x + 18, y, 4, TILE_SIZE);
        ctx.fillRect(x + 26, y, 4, TILE_SIZE);
        break;
      }
      case 'bed': {
        ctx.fillStyle = '#ca8a04';
        ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(x + 4, y + 4, TILE_SIZE - 8, TILE_SIZE - 8);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(x + 8, y + 6, 20, 8);
        break;
      }
      case 'shipping_bin': {
        ctx.fillStyle = '#d97706';
        ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
        break;
      }
      default:
        ctx.fillStyle = '#22c55e';
        ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
    }
  }

  private updateAndDrawFishes(ctx: CanvasRenderingContext2D) {
    for (const fish of this.fishes) {
      const dx = fish.targetX - fish.x;
      const dy = fish.targetY - fish.y;
      const dist = Math.hypot(dx, dy);

      if (dist < 4) {
        fish.targetX = (25 + Math.random() * 5) * TILE_SIZE;
        fish.targetY = (16 + Math.random() * 4) * TILE_SIZE;
        fish.angle = Math.atan2(fish.targetY - fish.y, fish.targetX - fish.x);
      } else {
        fish.x += Math.cos(fish.angle) * fish.speed;
        fish.y += Math.sin(fish.angle) * fish.speed;
      }

      ctx.save();
      ctx.translate(fish.x, fish.y);
      ctx.rotate(fish.angle);

      ctx.fillStyle = fish.color;
      ctx.beginPath();
      ctx.ellipse(0, 0, fish.size, fish.size * 0.5, 0, 0, Math.PI * 2);
      ctx.fill();

      const wag = Math.sin(this.frameCount * 0.2) * 3;
      ctx.beginPath();
      ctx.moveTo(-fish.size, 0);
      ctx.lineTo(-fish.size - 4, -3 + wag);
      ctx.lineTo(-fish.size - 4, 3 + wag);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    }
  }

  private drawCrop(ctx: CanvasRenderingContext2D, crop: CropState, x: number, y: number) {
    const cx = x + TILE_SIZE / 2;
    const cy = y + TILE_SIZE / 2;

    switch (crop.type) {
      case 'padi': {
        if (crop.stage === 0) {
          ctx.fillStyle = '#86efac';
          ctx.fillRect(cx - 4, cy + 2, 2, 6);
          ctx.fillRect(cx + 2, cy + 3, 2, 5);
        } else if (crop.stage === 1) {
          ctx.fillStyle = '#22c55e';
          ctx.fillRect(cx - 6, cy - 2, 3, 10);
          ctx.fillRect(cx - 1, cy - 5, 3, 13);
          ctx.fillRect(cx + 4, cy - 3, 3, 11);
        } else {
          ctx.fillStyle = '#eab308';
          ctx.fillRect(cx - 7, cy - 6, 3, 14);
          ctx.fillRect(cx - 1, cy - 10, 3, 18);
          ctx.fillRect(cx + 5, cy - 7, 3, 15);

          ctx.fillStyle = '#fde047';
          ctx.beginPath();
          ctx.arc(cx - 7, cy - 7, 3.5, 0, Math.PI * 2);
          ctx.arc(cx, cy - 11, 4, 0, Math.PI * 2);
          ctx.arc(cx + 7, cy - 8, 3.5, 0, Math.PI * 2);
          ctx.fill();

          if (this.frameCount % 20 < 10) {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(cx - 3, cy - 12, 2, 2);
          }
        }
        break;
      }
      case 'ubi': {
        if (crop.stage === 0) {
          ctx.fillStyle = '#4ade80';
          ctx.fillRect(cx - 4, cy + 2, 3, 3);
          ctx.fillRect(cx + 2, cy + 2, 3, 3);
        } else if (crop.stage === 1) {
          ctx.fillStyle = '#16a34a';
          ctx.fillRect(cx - 8, cy - 2, 6, 6);
          ctx.fillRect(cx + 2, cy - 1, 6, 6);
        } else {
          ctx.fillStyle = '#15803d';
          ctx.fillRect(cx - 10, cy - 6, 20, 8);
          ctx.fillStyle = '#c2410c';
          ctx.beginPath();
          ctx.ellipse(cx, cy + 4, 8, 4.5, -0.2, 0, Math.PI * 2);
          ctx.fill();
        }
        break;
      }
      case 'teh': {
        if (crop.stage === 0) {
          ctx.fillStyle = '#16a34a';
          ctx.fillRect(cx - 2, cy + 2, 4, 7);
        } else if (crop.stage === 1) {
          ctx.fillStyle = '#15803d';
          ctx.beginPath();
          ctx.arc(cx, cy, 9, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = '#166534';
          ctx.beginPath();
          ctx.arc(cx, cy + 2, 11, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#86efac';
          ctx.beginPath();
          ctx.arc(cx - 4, cy - 7, 3, 0, Math.PI * 2);
          ctx.arc(cx + 4, cy - 7, 3, 0, Math.PI * 2);
          ctx.arc(cx, cy - 10, 3.5, 0, Math.PI * 2);
          ctx.fill();
        }
        break;
      }
    }
  }

  private drawBambooAqueduct(ctx: CanvasRenderingContext2D, x: number, y: number) {
    const cy = y + TILE_SIZE / 2;
    ctx.fillStyle = '#65a30d';
    ctx.fillRect(x, cy - 4, TILE_SIZE, 8);
    ctx.fillStyle = '#3f6212';
    ctx.fillRect(x + 4, cy - 6, 3, 12);
    ctx.fillRect(x + 18, cy - 6, 3, 12);
    ctx.fillRect(x + 30, cy - 6, 3, 12);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(x, cy - 1, TILE_SIZE, 3);

    const dripY = (this.frameCount * 2) % 14;
    ctx.fillStyle = '#7dd3fc';
    ctx.fillRect(x + 16, cy + 4 + dripY, 2, 3);
  }

  private drawSaungBambu(ctx: CanvasRenderingContext2D) {
    const rx = 4 * TILE_SIZE;
    const ry = 3 * TILE_SIZE;
    const rw = 6 * TILE_SIZE;
    const rh = 4 * TILE_SIZE;

    ctx.fillStyle = '#451a03';
    ctx.beginPath();
    ctx.moveTo(rx - 8, ry + rh);
    ctx.lineTo(rx + rw / 2, ry - 14);
    ctx.lineTo(rx + rw + 8, ry + rh);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#854d0e';
    ctx.fillRect(rx + rw / 2 - 8, ry - 16, 16, 6);

    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 9px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('SAUNG PARAHYANGAN', rx + rw / 2 - 46, ry + 16);

    const lx = 8 * TILE_SIZE + 12;
    const ly = 8 * TILE_SIZE - 10;
    ctx.fillStyle = '#78350f';
    ctx.fillRect(lx, ly, 4, 6);
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.arc(lx + 2, ly + 9, 5, 0, Math.PI * 2);
    ctx.fill();

    if (this.time.hour >= 18 || this.time.hour < 6) {
      const glow = ctx.createRadialGradient(lx + 2, ly + 9, 2, lx + 2, ly + 9, 32);
      glow.addColorStop(0, 'rgba(250, 204, 21, 0.45)');
      glow.addColorStop(1, 'rgba(250, 204, 21, 0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(lx + 2, ly + 9, 32, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  private drawShippingBin(ctx: CanvasRenderingContext2D) {
    const x = this.map.shippingBinPos.x * TILE_SIZE;
    const y = this.map.shippingBinPos.y * TILE_SIZE;

    ctx.fillStyle = '#78350f';
    ctx.fillRect(x + 2, y + 6, TILE_SIZE - 4, TILE_SIZE - 8);
    ctx.fillStyle = '#facc15';
    ctx.fillRect(x + 14, y + 14, 8, 6);
    ctx.fillRect(x + 2, y + 6, 4, 4);
    ctx.fillRect(x + TILE_SIZE - 6, y + 6, 4, 4);

    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 8px sans-serif';
    ctx.fillText('PETI JUAL', x + 1, y - 2);

    if (this.shippingBinItems.length > 0) {
      ctx.fillStyle = '#22c55e';
      ctx.beginPath();
      ctx.arc(x + TILE_SIZE - 4, y + 4, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Draw Small Poultry Farm Pen (Paranje Hayam, Sarang Jerami, Palung Pakan Bekatul)
  private drawPoultryPen(ctx: CanvasRenderingContext2D) {
    // 1. Bamboo Chicken Coop Shelter (Cols 15..16, Rows 10..11)
    const coopX = 15 * TILE_SIZE;
    const coopY = 10 * TILE_SIZE;

    // Coop shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.beginPath();
    ctx.roundRect(coopX + 4, coopY + 12, 2 * TILE_SIZE - 8, 2 * TILE_SIZE - 8, 4);
    ctx.fill();

    // Bamboo Wall Panels
    ctx.fillStyle = '#b45309';
    ctx.fillRect(coopX + 6, coopY + 14, 2 * TILE_SIZE - 12, 2 * TILE_SIZE - 18);
    // Bamboo slit texture
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 1.2;
    for (let bx = coopX + 10; bx < coopX + 2 * TILE_SIZE - 10; bx += 6) {
      ctx.beginPath();
      ctx.moveTo(bx, coopY + 16);
      ctx.lineTo(bx, coopY + 2 * TILE_SIZE - 6);
      ctx.stroke();
    }

    // Coop Entrance Arched Opening (Pintu Masuk Hayam)
    ctx.fillStyle = '#1e1b4b';
    ctx.beginPath();
    ctx.arc(coopX + 40, coopY + 2 * TILE_SIZE - 10, 10, Math.PI, 0);
    ctx.fillRect(coopX + 30, coopY + 2 * TILE_SIZE - 10, 20, 14);
    ctx.fill();

    // Bamboo Ijuk & Palm Thatch Roof
    ctx.fillStyle = '#451a03';
    ctx.beginPath();
    ctx.moveTo(coopX - 4, coopY + 14);
    ctx.lineTo(coopX + 40, coopY - 10);
    ctx.lineTo(coopX + 2 * TILE_SIZE + 4, coopY + 14);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Golden straw eaves trim
    ctx.fillStyle = '#ca8a04';
    for (let ox = coopX - 2; ox <= coopX + 2 * TILE_SIZE + 2; ox += 7) {
      ctx.fillRect(ox, coopY + 14, 4, 3);
    }

    // Coop Signboard
    ctx.fillStyle = '#78350f';
    ctx.fillRect(coopX + 22, coopY + 4, 36, 11);
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 1;
    ctx.strokeRect(coopX + 22, coopY + 4, 36, 11);
    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 7px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Paranje Hayam', coopX + 23, coopY + 12);

    // 2. Straw Nesting Boxes (Sarang Jerami Telur) at cols 17 and 18, row 10
    const nestSpots = [
      { x: 17 * TILE_SIZE, y: 10 * TILE_SIZE },
      { x: 18 * TILE_SIZE, y: 10 * TILE_SIZE },
    ];
    for (const nest of nestSpots) {
      // Ground shadow
      ctx.fillStyle = 'rgba(0,0,0,0.2)';
      ctx.beginPath();
      ctx.ellipse(nest.x + 20, nest.y + 24, 16, 7, 0, 0, Math.PI * 2);
      ctx.fill();

      // Straw woven bowl base
      ctx.fillStyle = '#ca8a04';
      ctx.beginPath();
      ctx.ellipse(nest.x + 20, nest.y + 20, 15, 10, 0, 0, Math.PI * 2);
      ctx.fill();

      // Warm golden straw fibers
      ctx.fillStyle = '#eab308';
      ctx.beginPath();
      ctx.ellipse(nest.x + 20, nest.y + 19, 12, 7, 0, 0, Math.PI * 2);
      ctx.fill();

      // Cozy nest center hollow
      ctx.fillStyle = '#854d0e';
      ctx.beginPath();
      ctx.ellipse(nest.x + 20, nest.y + 19, 7, 4, 0, 0, Math.PI * 2);
      ctx.fill();

      // Golden hay strands radiating
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 1;
      for (let a = 0; a < Math.PI * 2; a += 0.8) {
        ctx.beginPath();
        ctx.moveTo(nest.x + 20 + Math.cos(a) * 11, nest.y + 19 + Math.sin(a) * 7);
        ctx.lineTo(nest.x + 20 + Math.cos(a) * 16, nest.y + 19 + Math.sin(a) * 10);
        ctx.stroke();
      }
    }

    // 3. Poultry Feeding Trough (Palung Pakan Bekatul) at col 19, row 11
    const trX = 19 * TILE_SIZE;
    const trY = 11 * TILE_SIZE;

    // Trough shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.beginPath();
    ctx.ellipse(trX + 20, trY + 28, 16, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Bamboo hollow half-cylinder body
    ctx.fillStyle = '#854d0e';
    ctx.beginPath();
    ctx.roundRect(trX + 6, trY + 14, 28, 14, 4);
    ctx.fill();
    ctx.strokeStyle = '#5c330a';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(trX + 6, trY + 14, 28, 14);

    // Bamboo nodes
    ctx.fillStyle = '#a16207';
    ctx.fillRect(trX + 13, trY + 14, 2, 14);
    ctx.fillRect(trX + 25, trY + 14, 2, 14);

    // Grains inside trough (bekatul & jagung)
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.ellipse(trX + 20, trY + 20, 11, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ea580c';
    ctx.fillRect(trX + 15, trY + 18, 2, 2);
    ctx.fillRect(trX + 22, trY + 20, 2, 2);

    // Prompt if player adjacent to trough
    const playerCol = Math.floor((this.player.x + TILE_SIZE / 2) / TILE_SIZE);
    const playerRow = Math.floor((this.player.y + TILE_SIZE / 2) / TILE_SIZE);
    if (Math.hypot(playerCol - 19, playerRow - 11) <= 1.8) {
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(trX, trY - 6, 42, 12);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 8px sans-serif';
      ctx.fillText('[E] Isi Pakan', trX + 2, trY + 3);
    }
  }

  // Draw Laid Eggs on ground & nests with 3D highlights
  private drawLaidEggs(ctx: CanvasRenderingContext2D) {
    if (this.laidEggs.length === 0) return;

    for (let i = 0; i < this.laidEggs.length; i++) {
      const egg = this.laidEggs[i];
      const isChicken = egg.type === 'ayam';

      ctx.save();
      ctx.translate(egg.x, egg.y);

      // Soft ground contact shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
      ctx.beginPath();
      ctx.ellipse(0, 4, 6, 2.5, 0, 0, Math.PI * 2);
      ctx.fill();

      // 3D Egg body with gradient
      const eggGrad = ctx.createRadialGradient(-1.5, -2, 1, 0, 0, 6.5);
      if (isChicken) {
        // Warm cream / golden brown organic kampung egg
        eggGrad.addColorStop(0, '#ffffff');
        eggGrad.addColorStop(0.4, '#fed7aa');
        eggGrad.addColorStop(1, '#ea580c');
      } else {
        // Bebek egg: pristine celadon cyan-green tint
        eggGrad.addColorStop(0, '#ffffff');
        eggGrad.addColorStop(0.4, '#cffafe');
        eggGrad.addColorStop(1, '#0891b2');
      }

      ctx.fillStyle = eggGrad;
      ctx.beginPath();
      // Organic egg oval
      ctx.ellipse(0, 0, 4.8, 6.2, 0.15, 0, Math.PI * 2);
      ctx.fill();

      // Specular highlight gleam
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.beginPath();
      ctx.ellipse(-1.5, -2.5, 1.6, 2.4, -0.3, 0, Math.PI * 2);
      ctx.fill();

      // Interactive prompt if player is nearby
      const dist = Math.hypot(this.player.x + 18 - egg.x, this.player.y + 18 - egg.y);
      if (dist < 32) {
        ctx.fillStyle = '#fef08a';
        ctx.font = 'bold 8px sans-serif';
        ctx.fillText('[E] Ambil', -16, -9);
      }

      ctx.restore();
    }
  }

  // Draw Livestock with animation (Domba Garut, Ayam, Bebek)
  private drawAnimals(ctx: CanvasRenderingContext2D) {
    for (const animal of this.animals) {
      ctx.save();
      ctx.translate(animal.x, animal.y);

      // Shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
      ctx.beginPath();
      ctx.ellipse(12, 20, 10, 4, 0, 0, Math.PI * 2);
      ctx.fill();

      const bob = animal.isGrazing ? Math.sin(this.frameCount * 0.1) * 2 : 0;

      if (animal.type === 'domba') {
        // Domba Garut: White fluffy body with 3D gradient, curved horns
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.arc(10, 12, 10, 0, Math.PI * 2);
        ctx.arc(16, 12, 9, 0, Math.PI * 2);
        ctx.fill();

        // 3D Wool fluff bubbles
        ctx.fillStyle = '#e2e8f0';
        ctx.beginPath();
        ctx.arc(8, 7, 5, 0, Math.PI * 2);
        ctx.arc(14, 6, 6, 0, Math.PI * 2);
        ctx.arc(19, 10, 5, 0, Math.PI * 2);
        ctx.fill();

        // Face & muzzle
        const headX = animal.direction === 'right' ? 20 : 4;
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.arc(headX, 10 + bob, 5, 0, Math.PI * 2);
        ctx.fill();

        // Magnificent curved horns of Domba Garut!
        ctx.fillStyle = '#b45309';
        ctx.beginPath();
        ctx.arc(headX - 1, 6 + bob, 4.5, Math.PI * 0.8, Math.PI * 2.2);
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = '#78350f';
        ctx.stroke();

        // Legs
        ctx.fillStyle = '#334155';
        ctx.fillRect(6, 18, 3, 6);
        ctx.fillRect(15, 18, 3, 6);

        // Name tag
        ctx.fillStyle = '#fef08a';
        ctx.font = 'bold 8px sans-serif';
        ctx.fillText(animal.name, 0, -2);
      } else if (animal.type === 'ayam') {
        // Ayam Kampung
        const isFacingRight = animal.direction === 'right';
        const flip = isFacingRight ? 1 : -1;
        ctx.save();
        if (!isFacingRight) {
          ctx.translate(24, 0);
          ctx.scale(-1, 1);
        }

        // Body feathers
        ctx.fillStyle = animal.id === 'ayam_1' ? '#b45309' : '#ea580c';
        ctx.beginPath();
        ctx.ellipse(12, 12 + bob, 7, 6, 0, 0, Math.PI * 2);
        ctx.fill();

        // Wing feather
        ctx.fillStyle = '#78350f';
        ctx.beginPath();
        ctx.ellipse(10, 12 + bob, 4, 3, 0.2, 0, Math.PI * 2);
        ctx.fill();

        // Tall curved tail feathers
        ctx.fillStyle = '#15803d';
        ctx.beginPath();
        ctx.moveTo(6, 11 + bob);
        ctx.quadraticCurveTo(2, 4 + bob, 0, 7 + bob);
        ctx.quadraticCurveTo(4, 13 + bob, 6, 14 + bob);
        ctx.fill();

        // Red comb & wattle
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(15, 4 + bob, 3, 4);
        ctx.fillRect(17, 10 + bob, 2, 2.5);

        // Head & Beak
        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.moveTo(17, 8 + bob);
        ctx.lineTo(21, 9 + bob);
        ctx.lineTo(17, 10 + bob);
        ctx.closePath();
        ctx.fill();

        // Eye
        ctx.fillStyle = '#000000';
        ctx.fillRect(15, 7 + bob, 1.5, 1.5);

        // Legs
        ctx.fillStyle = '#ca8a04';
        ctx.fillRect(9, 17, 2, 5);
        ctx.fillRect(13, 17, 2, 5);

        ctx.restore();

        // Name tag
        ctx.fillStyle = '#fef08a';
        ctx.font = 'bold 7.5px sans-serif';
        ctx.fillText(animal.name, 0, -3);

        // Fed / Happy Heart badge
        if (animal.isFed) {
          ctx.fillStyle = '#22c55e';
          ctx.beginPath();
          ctx.arc(20, -4, 3, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 6px sans-serif';
          ctx.fillText('🌾', 16, -2);
        }
      } else if (animal.type === 'bebek') {
        // Bebek Sawah
        const isFacingRight = animal.direction === 'right';
        ctx.save();
        if (!isFacingRight) {
          ctx.translate(24, 0);
          ctx.scale(-1, 1);
        }

        // Body
        ctx.fillStyle = animal.id === 'bebek_2' ? '#f8fafc' : '#facc15';
        ctx.beginPath();
        ctx.ellipse(12, 13 + bob, 8, 5.5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Wing
        ctx.fillStyle = animal.id === 'bebek_2' ? '#e2e8f0' : '#eab308';
        ctx.beginPath();
        ctx.ellipse(10, 13 + bob, 5, 3, 0.15, 0, Math.PI * 2);
        ctx.fill();

        // Duck neck & head
        ctx.fillStyle = animal.id === 'bebek_2' ? '#f8fafc' : '#facc15';
        ctx.beginPath();
        ctx.arc(17, 9 + bob, 4.5, 0, Math.PI * 2);
        ctx.fill();

        // Duck eye
        ctx.fillStyle = '#000000';
        ctx.fillRect(17, 8 + bob, 1.5, 1.5);

        // Broad flat orange bill
        ctx.fillStyle = '#f97316';
        ctx.beginPath();
        ctx.roundRect(19, 9 + bob, 6, 3, 1.5);
        ctx.fill();

        // Little webbed feet
        ctx.fillStyle = '#ea580c';
        ctx.fillRect(9, 18, 2.5, 4);
        ctx.fillRect(13, 18, 2.5, 4);

        ctx.restore();

        // Name tag
        ctx.fillStyle = '#bae6fd';
        ctx.font = 'bold 7.5px sans-serif';
        ctx.fillText(animal.name, 0, -3);

        // Fed badge
        if (animal.isFed) {
          ctx.fillStyle = '#38bdf8';
          ctx.beginPath();
          ctx.arc(20, -4, 3, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 6px sans-serif';
          ctx.fillText('❤️', 16, -2);
        }
      }

      // Proximity interaction prompt
      const dist = Math.hypot(this.player.x - animal.x, this.player.y - animal.y);
      if (dist < TILE_SIZE * 1.5) {
        ctx.fillStyle = '#22c55e';
        ctx.fillRect(0, -16, 44, 10);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 7px sans-serif';
        ctx.fillText('[E] Pakan / Elus', 2, -8);
      }

      ctx.restore();
    }
  }

  // Priangan Highland Tea Leaf & Flora Particle System
  public addLeafParticles(x: number, y: number, count = 3, type: 'tea' | 'bamboo' | 'golden' = 'tea') {
    const colors =
      type === 'tea'
        ? ['#16a34a', '#22c55e', '#15803d', '#4ade80', '#86efac', '#a3e635']
        : type === 'bamboo'
        ? ['#84cc16', '#65a30d', '#a3e635', '#4d7c0f']
        : ['#eab308', '#ca8a04', '#facc15', '#fbbf24'];

    for (let i = 0; i < count; i++) {
      const vx = 0.8 + Math.random() * 1.5; // gentle Eastward wind drift
      const vy = 0.2 + Math.random() * 0.7; // soft descent
      this.leafParticles.push({
        x: x + (Math.random() * 20 - 10),
        y: y + (Math.random() * 14 - 7),
        vx,
        vy,
        angle: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.08,
        flipProgress: Math.random() * Math.PI,
        size: 5 + Math.random() * 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 0.9 + Math.random() * 0.1,
        life: 70 + Math.floor(Math.random() * 50),
        maxLife: 100,
        flutterFreq: 0.08 + Math.random() * 0.06,
        type,
      });
    }
  }

  private updateLeafParticles() {
    this.windTimer += 0.04;
    for (let i = this.leafParticles.length - 1; i >= 0; i--) {
      const leaf = this.leafParticles[i];
      // Gentle sinusoidal flutter
      const sway = Math.sin(this.frameCount * leaf.flutterFreq) * 0.85;
      const verticalFloat = Math.cos(this.frameCount * leaf.flutterFreq * 0.7) * 0.4;

      leaf.x += leaf.vx + sway;
      leaf.y += leaf.vy + verticalFloat;
      leaf.angle += leaf.rotationSpeed;
      leaf.flipProgress += 0.07;
      leaf.life--;

      if (leaf.life < 25) {
        leaf.alpha = leaf.life / 25;
      }

      if (leaf.life <= 0) {
        this.leafParticles.splice(i, 1);
      }
    }
  }

  private renderLeafParticles(ctx: CanvasRenderingContext2D) {
    if (this.leafParticles.length === 0) return;

    for (const leaf of this.leafParticles) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, leaf.alpha);
      ctx.translate(leaf.x, leaf.y);
      ctx.rotate(leaf.angle);

      // Pseudo-3D tumbling perspective flip
      const flipScaleY = Math.cos(leaf.flipProgress);
      ctx.scale(1, Math.max(0.18, Math.abs(flipScaleY)));

      // Draw pointed tea leaf shape with center rib vein
      ctx.fillStyle = leaf.color;
      ctx.beginPath();
      ctx.moveTo(-leaf.size, 0);
      ctx.quadraticCurveTo(0, -leaf.size * 0.65, leaf.size, 0);
      ctx.quadraticCurveTo(0, leaf.size * 0.65, -leaf.size, 0);
      ctx.closePath();
      ctx.fill();

      // Center rib vein (tulang daun teh)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(-leaf.size * 0.85, 0);
      ctx.lineTo(leaf.size * 0.85, 0);
      ctx.stroke();

      ctx.restore();
    }
  }

  // Draw All NPCs with Pseudo-3D Shading & Mang Jaja with Pikulan Baskets
  private drawNpcs(ctx: CanvasRenderingContext2D) {
    const npcsList = [
      { data: NPCS.abah_surya, x: this.map.abahPos.x * TILE_SIZE, y: this.map.abahPos.y * TILE_SIZE },
      { data: NPCS.neng_ceuceu, x: this.map.ceuceuPos.x * TILE_SIZE, y: this.map.ceuceuPos.y * TILE_SIZE },
      { data: NPCS.mang_ujang, x: this.map.ujangPos.x * TILE_SIZE, y: this.map.ujangPos.y * TILE_SIZE },
      { data: NPCS.mang_jaja, x: this.mangJaja.x, y: this.mangJaja.y },
    ];

    const playerCol = Math.floor((this.player.x + TILE_SIZE / 2) / TILE_SIZE);
    const playerRow = Math.floor((this.player.y + TILE_SIZE / 2) / TILE_SIZE);

    for (const npc of npcsList) {
      const { data, x, y } = npc;
      const isJajaMoving = data.id === 'mang_jaja' && this.mangJaja.isMoving;
      const bob = Math.sin(this.frameCount * 0.08 + (data.id === 'abah_surya' ? 0 : 1.5)) * 1.5;

      // 3D Shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
      ctx.beginPath();
      ctx.ellipse(x + 18, y + 33, 12, 5.5, 0, 0, Math.PI * 2);
      ctx.fill();

      if (data.id === 'abah_surya') {
        // Abah Surya (Sesepuh with Sarung & Totopong)
        ctx.fillStyle = '#991b1b';
        ctx.fillRect(x + 10, y + 18 + bob, 16, 14);
        ctx.fillStyle = '#facc15';
        ctx.fillRect(x + 10, y + 24 + bob, 16, 2);
        ctx.fillRect(x + 17, y + 18 + bob, 2, 14);

        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(x + 10, y + 10 + bob, 16, 9);

        ctx.fillStyle = '#fed7aa';
        ctx.beginPath();
        ctx.arc(x + 18, y + 6 + bob, 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(x + 18, y + 10 + bob, 3.5, 0, Math.PI);
        ctx.fill();

        ctx.fillStyle = '#78350f';
        ctx.beginPath();
        ctx.arc(x + 18, y + 4 + bob, 6.5, Math.PI, Math.PI * 2);
        ctx.fill();
      } else if (data.id === 'neng_ceuceu') {
        // Neng Ceuceu (Kebaya Sunda Lembayung & Samping Batik)
        ctx.fillStyle = '#7c2d12';
        ctx.fillRect(x + 10, y + 18 + bob, 16, 14);

        // Kebaya Lembayung Pink
        ctx.fillStyle = '#f43f5e';
        ctx.fillRect(x + 10, y + 10 + bob, 16, 9);

        // Selendang sutra kuning
        ctx.fillStyle = '#fde047';
        ctx.fillRect(x + 12, y + 12 + bob, 4, 12);

        // Hair bun / Sanggul Sunda dengan melati
        ctx.fillStyle = '#1e1b4b';
        ctx.beginPath();
        ctx.arc(x + 18, y + 5 + bob, 6.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(x + 13, y + 3 + bob, 3, 3); // Bunga Melati

        ctx.fillStyle = '#fde68a';
        ctx.beginPath();
        ctx.arc(x + 18, y + 8 + bob, 5, 0, Math.PI * 2);
        ctx.fill();
      } else if (data.id === 'mang_ujang') {
        // Mang Ujang (Peternak berkaos garis & rompi)
        ctx.fillStyle = '#065f46';
        ctx.fillRect(x + 10, y + 18 + bob, 16, 14);

        ctx.fillStyle = '#e2e8f0';
        ctx.fillRect(x + 10, y + 10 + bob, 16, 9);
        ctx.fillStyle = '#3b82f6';
        ctx.fillRect(x + 10, y + 13 + bob, 16, 2);

        ctx.fillStyle = '#78350f';
        ctx.beginPath();
        ctx.arc(x + 18, y + 4 + bob, 6, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Mang Jaja (Pengrajin Awi & Pedagang Keliling dengan Caping & Pikulan Bambu)
        const walkBob = isJajaMoving ? Math.abs(Math.sin(this.mangJaja.animTimer * 2)) * 2 : bob;
        const basketSway = isJajaMoving ? Math.sin(this.mangJaja.animTimer * 2) * 3 : 0;

        // Pants (Cokelat gelap)
        ctx.fillStyle = '#451a03';
        ctx.fillRect(x + 10, y + 18 + walkBob, 16, 14);

        // Torso (Baju Pangsi Cokelat Karamel)
        ctx.fillStyle = '#78350f';
        ctx.fillRect(x + 10, y + 10 + walkBob, 16, 9);
        // Sabuk Hijau Daun Pisang
        ctx.fillStyle = '#16a34a';
        ctx.fillRect(x + 10, y + 16 + walkBob, 16, 2.5);

        // Head
        ctx.fillStyle = '#fed7aa';
        ctx.beginPath();
        ctx.arc(x + 18, y + 6 + walkBob, 6, 0, Math.PI * 2);
        ctx.fill();

        // Kumis & jenggot tipis khas pengrajin
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(x + 16, y + 7 + walkBob, 4, 1.5);

        // Caping Anyaman Bambu (Conical Straw Hat)
        ctx.fillStyle = '#eab308';
        ctx.beginPath();
        ctx.moveTo(x + 8, y + 4 + walkBob);
        ctx.lineTo(x + 18, y - 5 + walkBob);
        ctx.lineTo(x + 28, y + 4 + walkBob);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#a16207';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Caping ridge lines
        ctx.beginPath();
        ctx.moveTo(x + 18, y - 5 + walkBob);
        ctx.lineTo(x + 13, y + 4 + walkBob);
        ctx.moveTo(x + 18, y - 5 + walkBob);
        ctx.lineTo(x + 23, y + 4 + walkBob);
        ctx.stroke();

        // Pikulan Bambu (Wooden balance shoulder pole)
        ctx.strokeStyle = '#ca8a04';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(x + 1, y + 9 + walkBob + basketSway * 0.4);
        ctx.lineTo(x + 35, y + 9 + walkBob - basketSway * 0.4);
        ctx.stroke();

        // Left Suspended Basket (Boboko Binih Hejo)
        const leftBasketY = y + 16 + walkBob + basketSway;
        ctx.strokeStyle = '#78350f';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x + 2, y + 9 + walkBob);
        ctx.lineTo(x + 2, leftBasketY);
        ctx.stroke();
        // Woven basket body
        ctx.fillStyle = '#a16207';
        ctx.beginPath();
        ctx.roundRect(x - 3, leftBasketY, 10, 8, 2);
        ctx.fill();
        // Sprouting seedlings inside
        ctx.fillStyle = '#22c55e';
        ctx.fillRect(x - 2, leftBasketY - 3, 3, 4);
        ctx.fillRect(x + 3, leftBasketY - 4, 3, 5);

        // Right Suspended Basket (Boboko Cengek & Talang Awi)
        const rightBasketY = y + 16 + walkBob - basketSway;
        ctx.beginPath();
        ctx.moveTo(x + 34, y + 9 + walkBob);
        ctx.lineTo(x + 34, rightBasketY);
        ctx.stroke();
        // Woven basket body
        ctx.fillStyle = '#a16207';
        ctx.beginPath();
        ctx.roundRect(x + 29, rightBasketY, 10, 8, 2);
        ctx.fill();
        // Red chili peppers & bamboo pipe inside
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(x + 30, rightBasketY - 3, 3, 4);
        ctx.fillRect(x + 34, rightBasketY - 3, 3, 4);
        ctx.fillStyle = '#65a30d';
        ctx.fillRect(x + 32, rightBasketY - 5, 2, 6);
      }

      // Name label
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 8px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(data.name, x + 2, y - 6);

      // Current Activity Subtitle for Mang Jaja
      if (data.id === 'mang_jaja') {
        ctx.fillStyle = '#fef08a';
        ctx.font = 'bold 7px sans-serif';
        ctx.fillText(this.mangJaja.isMoving ? '🚶 Nuju ngider...' : '🪵 Gelar lapak', x + 2, y + 36);
      }

      // Dialog prompt if adjacent
      const dist = Math.hypot(playerCol - Math.floor(x / TILE_SIZE), playerRow - Math.floor(y / TILE_SIZE));
      if (dist <= 1.8) {
        ctx.fillStyle = '#22c55e';
        ctx.fillRect(x - 2, y - 20, 40, 12);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 8px sans-serif';
        ctx.fillText('[E] ' + (data.id === 'mang_jaja' ? 'Lapak' : 'Ngobrol'), x, y - 11);
      }
    }

    // Draw Floating Proximity Speech Bubble if active
    if (this.proximityBubbleOpacity > 0.02 && this.activeProximityNpc) {
      this.drawProximityBubble(ctx);
    }
  }

  // Comic-style floating proximity speech bubble with tail pointing to NPC
  private drawProximityBubble(ctx: CanvasRenderingContext2D) {
    const npc = NPCS[this.activeProximityNpc!];
    if (!npc) return;

    const nx = this.proximityNpcPos.x + 18;
    const ny = this.proximityNpcPos.y - 24 + Math.sin(this.frameCount * 0.1) * 2;

    ctx.save();
    ctx.globalAlpha = this.proximityBubbleOpacity;

    const text = this.proximityBubbleText;
    ctx.font = 'bold 9px "Plus Jakarta Sans", sans-serif';
    const textWidth = ctx.measureText(text).width;
    const boxW = Math.min(260, Math.max(160, textWidth + 30));
    const boxH = 42;
    const boxX = nx - boxW / 2;
    const boxY = ny - boxH - 10;

    // Drop Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.beginPath();
    ctx.roundRect(boxX + 2, boxY + 2, boxW, boxH, 8);
    ctx.fill();

    // Bubble Background (warm dark amber)
    ctx.fillStyle = 'rgba(28, 25, 23, 0.95)';
    ctx.beginPath();
    ctx.roundRect(boxX, boxY, boxW, boxH, 8);
    ctx.fill();

    // Golden border
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Speech bubble triangle tail
    ctx.fillStyle = 'rgba(28, 25, 23, 0.95)';
    ctx.beginPath();
    ctx.moveTo(nx - 6, boxY + boxH);
    ctx.lineTo(nx, boxY + boxH + 8);
    ctx.lineTo(nx + 6, boxY + boxH);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Header with avatar & name
    ctx.fillStyle = '#fde047';
    ctx.font = 'bold 8px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(`${npc.avatar} ${npc.name}`, boxX + 8, boxY + 12);

    // Activity / Role tag
    ctx.fillStyle = '#a8a29e';
    ctx.font = '6px sans-serif';
    ctx.fillText(npc.id === 'mang_jaja' ? this.mangJaja.locationName : npc.role, boxX + 8 + ctx.measureText(`${npc.avatar} ${npc.name} `).width + 6, boxY + 12);

    // Dialogue message
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 8.5px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(text, boxX + 8, boxY + 25);

    // Sub-pill: Action reminder
    ctx.fillStyle = '#22c55e';
    ctx.font = 'bold 7px sans-serif';
    ctx.fillText('⚡ Tekan [E] pikeun ngobrol & balanja', boxX + 8, boxY + 36);

    ctx.restore();
  }

  private drawTargetIndicator(ctx: CanvasRenderingContext2D) {
    const { col, row } = this.getTargetTileCoord();
    const x = col * TILE_SIZE;
    const y = row * TILE_SIZE;

    ctx.strokeStyle = 'rgba(250, 204, 21, 0.7)';
    ctx.lineWidth = 2;
    ctx.strokeRect(x + 1, y + 1, TILE_SIZE - 2, TILE_SIZE - 2);
  }

  // -------------------------------------------------------------------------
  // High-Fidelity Sprite-Stacking / Slice-Stacking Pseudo-3D Player Engine
  // -------------------------------------------------------------------------
  private draw3DShadedPlayer(ctx: CanvasRenderingContext2D) {
    const px = this.player.x;
    const py = this.player.y;
    const dir = this.player.direction;
    const isMoving = this.player.isMoving;
    const isSprinting = this.player.isSprinting;

    // Movement stride frequency calibrated to slower, relaxed walk speed
    const strideFreq = isSprinting ? 2.6 : 1.9;
    const runBob = isMoving ? Math.abs(Math.sin(this.animTimer * strideFreq)) * (isSprinting ? 3.0 : 1.8) : 0;
    const legPhase = isMoving ? Math.sin(this.animTimer * strideFreq) : 0;

    // Direction angles in radians (0 = Down / South towards camera)
    const dirAngles: Record<Direction8, number> = {
      down: 0,
      'down-right': Math.PI * 0.25,
      right: Math.PI * 0.5,
      'up-right': Math.PI * 0.75,
      up: Math.PI,
      'up-left': Math.PI * 1.25,
      left: Math.PI * 1.5,
      'down-left': Math.PI * 1.75,
    };
    const facingAngle = dirAngles[dir] ?? 0;

    // Directional facing components
    const facingDown = dir === 'down' || dir === 'down-left' || dir === 'down-right';
    const facingUp = dir === 'up' || dir === 'up-left' || dir === 'up-right';
    const facingLeft = dir === 'left' || dir === 'up-left' || dir === 'down-left';
    const facingRight = dir === 'right' || dir === 'up-right' || dir === 'down-right';

    // Sun Lighting Vector based on game time (Morning: East/Right, Noon: Overhead, Evening: West/Left)
    const sunProgress = Math.max(0, Math.min(1, (this.time.hour - 6) / 12));
    const sunLightX = (0.5 - sunProgress) * 16;
    const shadowStretch = 6 + Math.abs(0.5 - sunProgress) * 8;

    // Base coordinate anchor (Player center at bottom)
    const baseX = px + 18;
    const baseY = py + 32;

    // -------------------------------------------------------------
    // PASS 1: Dynamic Contact Occlusion & Sun-Cast Shadow
    // -------------------------------------------------------------
    ctx.save();
    // Soft outer shadow skewed by sun vector
    ctx.fillStyle = 'rgba(15, 23, 42, 0.35)';
    ctx.beginPath();
    ctx.ellipse(
      baseX + sunLightX,
      baseY + 2,
      13 + (isMoving ? 1.5 : 0),
      shadowStretch * (1 - runBob * 0.1),
      sunLightX * 0.03,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Tight ambient occlusion directly beneath sandals
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.beginPath();
    ctx.ellipse(baseX, baseY + 1, 8, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // -------------------------------------------------------------
    // PASS 2: Sprite-Stacking Voxel Slices (Z = 0 up to Z = 32)
    // -------------------------------------------------------------
    ctx.save();

    // Forward torso tilt during motion
    const tiltAmount = isMoving ? (isSprinting ? 0.08 : 0.04) : 0;
    const tiltX = Math.sin(facingAngle) * tiltAmount;
    const tiltY = Math.cos(facingAngle) * tiltAmount;

    // Helper: calculate X and Y position for slice layer Z
    // Uses stack extrusion with directional perspective parallax
    const layerSpacing = 1.05;
    const getLayerCoord = (z: number) => {
      // Perspective lean: higher layers shift in opposite direction of viewpoint tilt
      const pX = baseX + Math.sin(facingAngle) * (z * 0.18) + z * tiltX;
      const pY = baseY - z * layerSpacing - runBob + Math.cos(facingAngle) * (z * 0.14) + z * tiltY;
      return { x: pX, y: pY };
    };

    // Stride displacement for legs (scissor motion aligned with facing angle)
    const strideDist = legPhase * (isSprinting ? 6.5 : 4.5);
    const cosA = Math.cos(facingAngle);
    const sinA = Math.sin(facingAngle);

    // Left & Right leg lateral offsets relative to facing angle
    const hipSpacing = 4.2;
    // Perpendicular vector (-sinA, cosA)
    const perpX = -cosA;
    const perpY = sinA;

    // Stride vector along facing direction
    const forwardX = sinA;
    const forwardY = cosA;

    // -------------------------------------------------------------
    // SLICES 1 - 3: Tarumpah (Sundanese Woven Leather Sandals)
    // -------------------------------------------------------------
    for (let z = 1; z <= 3; z++) {
      const { x: lx, y: ly } = getLayerCoord(z);

      // Left sandal position
      const leftFootX = lx + perpX * hipSpacing + forwardX * strideDist;
      const leftFootY = ly + perpY * hipSpacing * 0.4 + forwardY * strideDist * 0.5;

      // Right sandal position
      const rightFootX = lx - perpX * hipSpacing - forwardX * strideDist;
      const rightFootY = ly - perpY * hipSpacing * 0.4 - forwardY * strideDist * 0.5;

      // Sandal leather sole
      ctx.fillStyle = z === 1 ? '#451a03' : z === 2 ? '#78350f' : '#92400e';
      ctx.beginPath();
      ctx.ellipse(leftFootX, leftFootY, 3.4, 2.2, facingAngle, 0, Math.PI * 2);
      ctx.ellipse(rightFootX, rightFootY, 3.4, 2.2, facingAngle, 0, Math.PI * 2);
      ctx.fill();

      // Top sandal strap at z = 3
      if (z === 3) {
        ctx.fillStyle = '#b45309';
        ctx.beginPath();
        ctx.arc(leftFootX, leftFootY, 1.8, 0, Math.PI * 2);
        ctx.arc(rightFootX, rightFootY, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // -------------------------------------------------------------
    // SLICES 4 - 9: Pangsi Trousers (Cylindrical Legs & Pelvis)
    // -------------------------------------------------------------
    for (let z = 4; z <= 9; z++) {
      const { x: lx, y: ly } = getLayerCoord(z);

      // Transition from separate legs (z=4..7) to merged pelvis (z=8..9)
      if (z <= 7) {
        const legProg = (z - 4) / 4;
        const currentStride = strideDist * (1 - legProg * 0.45);

        const leftLegX = lx + perpX * hipSpacing + forwardX * currentStride;
        const leftLegY = ly + perpY * hipSpacing * 0.4 + forwardY * currentStride * 0.5;

        const rightLegX = lx - perpX * hipSpacing - forwardX * currentStride;
        const rightLegY = ly - perpY * hipSpacing * 0.4 - forwardY * currentStride * 0.5;

        // Indigo/charcoal Pangsi fabric gradient
        ctx.fillStyle = z % 2 === 0 ? '#0f172a' : '#1e293b';
        ctx.beginPath();
        ctx.ellipse(leftLegX, leftLegY, 3.5, 2.8, facingAngle, 0, Math.PI * 2);
        ctx.ellipse(rightLegX, rightLegY, 3.5, 2.8, facingAngle, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Pelvis / Hips (Merged baggy trousers)
        ctx.fillStyle = z === 8 ? '#0f172a' : '#1e293b';
        ctx.beginPath();
        ctx.ellipse(lx, ly, 8.0, 5.0, facingAngle * 0.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // -------------------------------------------------------------
    // SLICES 10 - 12: Beubeur Sunda (Crimson Batik Sash Belt)
    // -------------------------------------------------------------
    for (let z = 10; z <= 12; z++) {
      const { x: lx, y: ly } = getLayerCoord(z);

      ctx.fillStyle = z === 11 ? '#ef4444' : '#b91c1c';
      ctx.beginPath();
      ctx.ellipse(lx, ly, 8.2, 5.2, facingAngle * 0.2, 0, Math.PI * 2);
      ctx.fill();

      // Front buckle and dangling sash knot (Tali Beubeur)
      if (z === 11) {
        // Golden brass buckle
        const buckleX = lx + sinA * 5.2;
        const buckleY = ly + cosA * 3.8;
        ctx.fillStyle = '#facc15';
        ctx.fillRect(buckleX - 1.5, buckleY - 1.5, 3, 3);

        // Hanging sash ribbon fluttering behind or at side
        const sway = Math.sin(this.animTimer * strideFreq) * 2;
        ctx.fillStyle = '#dc2626';
        ctx.beginPath();
        ctx.moveTo(buckleX, buckleY);
        ctx.lineTo(buckleX + sway + 2, buckleY + 5);
        ctx.lineTo(buckleX + sway - 1, buckleY + 5);
        ctx.closePath();
        ctx.fill();
      }
    }

    // -------------------------------------------------------------
    // SLICES 13 - 20: Volumetric Pangsi Shirt Torso (Baju Salontreng)
    // -------------------------------------------------------------
    for (let z = 13; z <= 20; z++) {
      const { x: lx, y: ly } = getLayerCoord(z);

      // Torso expands slightly at chest (z=16..18)
      const chestRadiusX = z >= 16 && z <= 18 ? 8.8 : 8.2;
      const chestRadiusY = z >= 16 && z <= 18 ? 5.6 : 5.0;

      // 3D Lighting: Top/sun side receives highlight, bottom/rear receives shadow
      const isTopSlice = z >= 18;
      ctx.fillStyle = isTopSlice ? '#2563eb' : z % 2 === 0 ? '#1e3a8a' : '#172554';
      ctx.beginPath();
      ctx.ellipse(lx, ly, chestRadiusX, chestRadiusY, facingAngle * 0.15, 0, Math.PI * 2);
      ctx.fill();

      // Front V-neck and Gold Buttons on chest slices
      if (z >= 14 && z <= 18 && facingDown) {
        const chestFrontX = lx + sinA * 4.5;
        const chestFrontY = ly + cosA * 3.5;

        // Lapel collar crease
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(chestFrontX - 2, chestFrontY - 2);
        ctx.lineTo(chestFrontX, chestFrontY + 2);
        ctx.lineTo(chestFrontX + 2, chestFrontY - 2);
        ctx.stroke();

        // Golden button
        if (z === 15 || z === 17) {
          ctx.fillStyle = '#fde047';
          ctx.fillRect(chestFrontX - 1, chestFrontY, 2, 2);
        }
      }

      // Back fold seam if facing up
      if (z >= 15 && z <= 19 && facingUp) {
        const spineX = lx - sinA * 4.5;
        const spineY = ly - cosA * 3.5;
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(spineX, spineY - 2);
        ctx.lineTo(spineX, spineY + 2);
        ctx.stroke();
      }

      // -----------------------------------------------------------
      // Swinging Arms & Hands attached at sides (z = 14..19)
      // -----------------------------------------------------------
      if (z >= 14 && z <= 18) {
        const armPhase = -legPhase * (isSprinting ? 6.0 : 4.0);

        // Left arm (Counter-swings with stride)
        const leftArmX = lx + perpX * 9.5 + forwardX * armPhase;
        const leftArmY = ly + perpY * 9.5 * 0.4 + forwardY * armPhase * 0.5;

        // Right arm
        const rightArmX = lx - perpX * 9.5 - forwardX * armPhase;
        const rightArmY = ly - perpY * 9.5 * 0.4 - forwardY * armPhase * 0.5;

        // Pangsi sleeve fabric
        ctx.fillStyle = z >= 17 ? '#2563eb' : '#1e3a8a';
        ctx.beginPath();
        ctx.arc(leftArmX, leftArmY, 2.6, 0, Math.PI * 2);
        ctx.arc(rightArmX, rightArmY, 2.6, 0, Math.PI * 2);
        ctx.fill();

        // Hands at lower arm slices (z = 14)
        if (z === 14) {
          ctx.fillStyle = '#fdba74';
          ctx.beginPath();
          ctx.arc(leftArmX + forwardX * 1.5, leftArmY + forwardY * 1.5, 2.0, 0, Math.PI * 2);
          ctx.arc(rightArmX - forwardX * 1.5, rightArmY - forwardY * 1.5, 2.0, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // -------------------------------------------------------------
    // SLICES 21 - 23: Neck & Collar
    // -------------------------------------------------------------
    for (let z = 21; z <= 23; z++) {
      const { x: lx, y: ly } = getLayerCoord(z);
      ctx.fillStyle = z === 21 ? '#ea580c' : '#fed7aa';
      ctx.beginPath();
      ctx.arc(lx, ly, 3.8, 0, Math.PI * 2);
      ctx.fill();
    }

    // -------------------------------------------------------------
    // SLICES 24 - 28: Volumetric 3D Head & 8-Directional Gaze
    // -------------------------------------------------------------
    for (let z = 24; z <= 28; z++) {
      const { x: lx, y: ly } = getLayerCoord(z);

      // Skull slice diameter
      const headRadius = z === 28 ? 6.2 : z === 24 ? 5.8 : 6.6;

      // Skin tone with radial depth
      ctx.fillStyle = z === 28 ? '#fff7ed' : z === 27 ? '#ffedd5' : '#fed7aa';
      ctx.beginPath();
      ctx.arc(lx, ly, headRadius, 0, Math.PI * 2);
      ctx.fill();

      // Facial Features according to 8 Directions (Rendered on z = 25..27)
      if (z === 26) {
        ctx.fillStyle = '#0f172a';

        if (dir === 'down') {
          // Front View: Both eyes, pupils, friendly smile
          ctx.fillRect(lx - 3.2, ly + 2.0, 1.8, 2.0);
          ctx.fillRect(lx + 1.4, ly + 2.0, 1.8, 2.0);
          // Specular catchlight
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(lx - 2.8, ly + 2.2, 0.8, 0.8);
          ctx.fillRect(lx + 1.8, ly + 2.2, 0.8, 0.8);
          // Gentle warm smile
          ctx.fillStyle = '#c2410c';
          ctx.fillRect(lx - 1.5, ly + 4.5, 3.0, 1.0);
        } else if (dir === 'down-right') {
          // 3/4 Front Right
          ctx.fillRect(lx - 1.0, ly + 2.2, 1.8, 2.0);
          ctx.fillRect(lx + 3.0, ly + 1.8, 1.5, 1.8);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(lx - 0.6, ly + 2.4, 0.8, 0.8);
          // Nose tip
          ctx.fillStyle = '#f97316';
          ctx.fillRect(lx + 2.0, ly + 3.2, 1.5, 1.5);
        } else if (dir === 'down-left') {
          // 3/4 Front Left
          ctx.fillRect(lx - 4.5, ly + 1.8, 1.5, 1.8);
          ctx.fillRect(lx - 0.8, ly + 2.2, 1.8, 2.0);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(lx - 0.4, ly + 2.4, 0.8, 0.8);
          // Nose tip
          ctx.fillStyle = '#f97316';
          ctx.fillRect(lx - 3.5, ly + 3.2, 1.5, 1.5);
        } else if (dir === 'right') {
          // Profile Right
          ctx.fillRect(lx + 2.8, ly + 0.8, 1.8, 2.0);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(lx + 3.2, ly + 1.0, 0.8, 0.8);
          // Profile nose bridge
          ctx.fillStyle = '#ea580c';
          ctx.beginPath();
          ctx.moveTo(lx + 4.5, ly + 0.5);
          ctx.lineTo(lx + 6.8, ly + 1.8);
          ctx.lineTo(lx + 4.5, ly + 3.0);
          ctx.closePath();
          ctx.fill();
        } else if (dir === 'left') {
          // Profile Left
          ctx.fillRect(lx - 4.6, ly + 0.8, 1.8, 2.0);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(lx - 4.2, ly + 1.0, 0.8, 0.8);
          // Profile nose bridge
          ctx.fillStyle = '#ea580c';
          ctx.beginPath();
          ctx.moveTo(lx - 4.5, ly + 0.5);
          ctx.lineTo(lx - 6.8, ly + 1.8);
          ctx.lineTo(lx - 4.5, ly + 3.0);
          ctx.closePath();
          ctx.fill();
        } else if (facingUp) {
          // Back of head: dark textured hairline (face naturally occluded)
          ctx.fillStyle = '#0f172a';
          ctx.beginPath();
          ctx.arc(lx, ly + 1.5, headRadius * 0.9, 0, Math.PI);
          ctx.fill();
        }
      }
    }

    // -------------------------------------------------------------
    // SLICES 29 - 34: Sundanese Makuta Totopong Batik (Folded Crown Peak)
    // -------------------------------------------------------------
    for (let z = 29; z <= 34; z++) {
      const { x: lx, y: ly } = getLayerCoord(z);

      if (z === 29) {
        // Base Headband (Iket Sunda) wrapping the temples
        ctx.fillStyle = '#78350f';
        ctx.beginPath();
        ctx.arc(lx, ly, 7.2, 0, Math.PI * 2);
        ctx.fill();

        // Golden Batik diamond embroidery trim
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 1.2;
        ctx.stroke();
      } else if (z === 30 || z === 31) {
        // Folded cloth layers (Batik Priangan motif)
        ctx.fillStyle = z === 30 ? '#b45309' : '#d97706';
        ctx.beginPath();
        ctx.arc(lx, ly, 6.5 - (z - 29) * 0.8, 0, Math.PI * 2);
        ctx.fill();

        // Batik accent dots
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(lx - 2, ly - 2, 1.5, 1.5);
        ctx.fillRect(lx + 1, ly - 2, 1.5, 1.5);
      } else {
        // z = 32..34: Iconic Pucuk Makuta Totopong (Majestic Folded Peak)
        // The peak extrudes and points in the player's 8-directional facing vector!
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

        // Gold trim at crown summit
        if (z === 34) {
          ctx.fillStyle = '#fef08a';
          ctx.beginPath();
          ctx.arc(peakX, peakY - peakHeight, 1.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Rear cloth tie flaps (Kuncung Iket) fluttering behind the head
      if (z === 29) {
        const flapSway = Math.sin(this.animTimer * strideFreq) * 2.5;
        const rearX = lx - sinA * 5.5;
        const rearY = ly - cosA * 4.5;

        ctx.fillStyle = '#9a3412';
        ctx.beginPath();
        ctx.moveTo(rearX - 2, rearY);
        ctx.lineTo(rearX + flapSway - 4, rearY + 6);
        ctx.lineTo(rearX + flapSway, rearY + 6);
        ctx.closePath();
        ctx.fill();
      }
    }

    // -------------------------------------------------------------
    // PASS 3: Dynamic Tool Swinging Action Layer (Pacul / Gembor)
    // -------------------------------------------------------------
    if (this.player.isActing) {
      const { x: handX, y: handY } = getLayerCoord(15);
      const flipTool = facingLeft ? -1 : 1;

      if (this.actionType === 'cangkul') {
        const swingProgress = (12 - this.swingTimer) / 12;
        const swingAngle = Math.sin(swingProgress * Math.PI) * 1.9;

        ctx.save();
        ctx.translate(handX + (facingLeft ? -8 : 8), handY);
        ctx.scale(flipTool, 1);
        ctx.rotate(swingAngle - 0.4);

        // Wooden hoe handle
        ctx.fillStyle = '#b45309';
        ctx.fillRect(-2, -26, 4, 28);

        // Steel hoe blade with specular shine
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(-7, -30, 14, 7);
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(-7, -30, 14, 1.8);

        // Swing motion arc
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(0, 0, 26, -0.6, 0.8);
        ctx.stroke();

        ctx.restore();
      } else if (this.actionType === 'gembor') {
        ctx.save();
        ctx.translate(handX + (facingLeft ? -6 : 6), handY);
        ctx.scale(flipTool, 1);

        // Ceramic / brass water pitcher
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(4, -8, 14, 11);
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(16, -4, 6, 3);

        // Water stream droplets
        ctx.fillStyle = '#bae6fd';
        for (let i = 0; i < 3; i++) {
          ctx.fillRect(22 + i * 4, -2 + i * 4, 2, 2);
        }
        ctx.restore();
      }
    }

    ctx.restore();
  }

  private renderFloatingTexts(ctx: CanvasRenderingContext2D) {
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.floatingTexts[i];
      ft.y -= 0.6;
      ft.life--;
      ft.alpha = ft.life / 50;

      ctx.save();
      ctx.globalAlpha = Math.max(0, ft.alpha);
      ctx.fillStyle = ft.color;
      ctx.font = 'bold 11px "Plus Jakarta Sans", sans-serif';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 3;
      ctx.strokeText(ft.text, ft.x, ft.y);
      ctx.fillText(ft.text, ft.x, ft.y);
      ctx.restore();

      if (ft.life <= 0) {
        this.floatingTexts.splice(i, 1);
      }
    }
  }

  private renderParticles(ctx: CanvasRenderingContext2D) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life--;

      ctx.save();
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, p.life / 40);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  private drawPuddles(ctx: CanvasRenderingContext2D) {
    for (const puddle of this.puddles) {
      if (puddle.depth <= 0.05) continue;

      // Expand organic radius with puddle depth
      const currentRx = puddle.rx * (0.6 + puddle.depth * 0.4);
      const currentRy = puddle.ry * (0.6 + puddle.depth * 0.4);

      ctx.save();

      // Outer muddy edge ring
      ctx.fillStyle = 'rgba(28, 25, 23, 0.45)';
      ctx.beginPath();
      ctx.ellipse(puddle.x, puddle.y, currentRx + 2, currentRy + 1.5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Reflective water pool with depth gradient (sky reflection)
      const grad = ctx.createLinearGradient(
        puddle.x - currentRx,
        puddle.y - currentRy,
        puddle.x + currentRx,
        puddle.y + currentRy
      );
      if (this.isRaining) {
        grad.addColorStop(0, 'rgba(56, 189, 248, 0.45)');
        grad.addColorStop(0.5, 'rgba(14, 116, 144, 0.55)');
        grad.addColorStop(1, 'rgba(30, 41, 59, 0.65)');
      } else {
        grad.addColorStop(0, 'rgba(125, 211, 252, 0.5)');
        grad.addColorStop(0.6, 'rgba(3, 105, 161, 0.45)');
        grad.addColorStop(1, 'rgba(44, 74, 82, 0.55)');
      }

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(puddle.x, puddle.y, currentRx, currentRy, 0, 0, Math.PI * 2);
      ctx.fill();

      // Concentric rain / wind ripples
      const rippleTime = (this.frameCount * 0.05 + puddle.seed) % 1;
      const rippleRx = currentRx * rippleTime;
      const rippleRy = currentRy * rippleTime;
      const rippleAlpha = Math.max(0, (1 - rippleTime) * (0.45 * puddle.depth));

      ctx.strokeStyle = `rgba(224, 242, 254, ${rippleAlpha})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(puddle.x, puddle.y, rippleRx, rippleRy, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Second smaller ripple offset
      const ripple2Time = (this.frameCount * 0.05 + puddle.seed + 0.5) % 1;
      const ripple2Rx = currentRx * ripple2Time * 0.7;
      const ripple2Ry = currentRy * ripple2Time * 0.7;
      const ripple2Alpha = Math.max(0, (1 - ripple2Time) * (0.35 * puddle.depth));

      ctx.strokeStyle = `rgba(224, 242, 254, ${ripple2Alpha})`;
      ctx.beginPath();
      ctx.ellipse(puddle.x, puddle.y, ripple2Rx, ripple2Ry, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Specular bright sky sheen highlight (curved arc)
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.35 * puddle.depth})`;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.ellipse(
        puddle.x - currentRx * 0.25,
        puddle.y - currentRy * 0.25,
        currentRx * 0.45,
        currentRy * 0.35,
        -0.2,
        Math.PI * 1.1,
        Math.PI * 1.8
      );
      ctx.stroke();

      ctx.restore();
    }
  }

  private renderRainSplashes(ctx: CanvasRenderingContext2D) {
    for (const splash of this.rainSplashes) {
      ctx.save();
      ctx.fillStyle = '#bae6fd';
      ctx.globalAlpha = splash.alpha;
      ctx.beginPath();
      ctx.arc(splash.x, splash.y, splash.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  private drawFestivalDecorations(ctx: CanvasRenderingContext2D) {
    if (!this.currentFestival) return;
    const sway = Math.sin(this.frameCount * 0.08) * 4;

    // Key decorative spots for Penjor Bambu (Arched Bamboo Poles with Janur Kuning)
    const penjorSpots = [
      { x: 7 * TILE_SIZE + 4, y: 10 * TILE_SIZE, curveDir: 1 },    // Saung left
      { x: 11 * TILE_SIZE + 28, y: 10 * TILE_SIZE, curveDir: -1 }, // Saung right
      { x: 25 * TILE_SIZE + 10, y: 14 * TILE_SIZE, curveDir: 1 },  // West Bridge
      { x: 28 * TILE_SIZE + 24, y: 14 * TILE_SIZE, curveDir: -1 }, // East Bridge
      { x: 5 * TILE_SIZE + 8, y: 29 * TILE_SIZE, curveDir: 1 },    // Bale Sawala
      { x: 9 * TILE_SIZE + 24, y: 29 * TILE_SIZE, curveDir: -1 },  // Bale Sawala
      { x: 40 * TILE_SIZE + 12, y: 14 * TILE_SIZE, curveDir: 1 },  // Village Gate
    ];

    for (const spot of penjorSpots) {
      ctx.save();
      const px = spot.x;
      const py = spot.y;
      const dir = spot.curveDir;

      // Base bamboo pole
      ctx.strokeStyle = '#ca8a04'; // Golden bamboo
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(px, py);
      // Arched curve high up
      const topX = px + dir * 22 + sway * 0.6;
      const topY = py - 52;
      ctx.quadraticCurveTo(px + dir * 6, py - 38, topX, topY);
      ctx.stroke();

      // Bamboo segments rings
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 1;
      for (let i = 1; i <= 4; i++) {
        const segY = py - i * 10;
        ctx.beginPath();
        ctx.moveTo(px - 2, segY);
        ctx.lineTo(px + 2, segY);
        ctx.stroke();
      }

      // Arch tip with hanging Janur Kuning tassel (Ronce Janur)
      ctx.fillStyle = '#fde047'; // Fresh yellow young coconut palm
      ctx.beginPath();
      ctx.arc(topX, topY, 4, 0, Math.PI * 2);
      ctx.fill();

      // Hanging swaying tassel
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(topX, topY);
      ctx.quadraticCurveTo(topX + sway, topY + 14, topX + sway * 1.2, topY + 24);
      ctx.stroke();

      // Decorative Janur leaves fluttering from pole
      ctx.fillStyle = '#fef08a';
      for (let l = 0; l < 4; l++) {
        const ly = py - 18 - l * 8;
        const lx = px + dir * (l * 3);
        const leafSway = Math.sin(this.frameCount * 0.09 + l) * 3;
        ctx.beginPath();
        ctx.moveTo(lx, ly);
        ctx.lineTo(lx + dir * 10 + leafSway, ly - 4);
        ctx.lineTo(lx, ly - 2);
        ctx.fill();
      }

      // Colorful festival ribbon (Merah Putih / Kuning Kencana)
      ctx.strokeStyle = spot.curveDir === 1 ? '#ef4444' : '#22c55e';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(topX, topY + 4);
      ctx.lineTo(topX - dir * 6 + sway * 1.1, topY + 28);
      ctx.stroke();

      ctx.restore();
    }

    // Traditional Umbul-Umbul vertical festival flags along main central path
    const bannerSpots = [
      { x: 18 * TILE_SIZE + 16, y: 14 * TILE_SIZE, color: '#dc2626' }, // Merah
      { x: 23 * TILE_SIZE + 16, y: 14 * TILE_SIZE, color: '#f59e0b' }, // Kuning Emas
      { x: 32 * TILE_SIZE + 16, y: 14 * TILE_SIZE, color: '#16a34a' }, // Hijau Priangan
      { x: 44 * TILE_SIZE + 16, y: 14 * TILE_SIZE, color: '#0284c7' }, // Biru Langit
    ];

    for (const b of bannerSpots) {
      ctx.save();
      const bx = b.x;
      const by = b.y;
      // Tall bamboo mast
      ctx.strokeStyle = '#854d0e';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(bx, by);
      ctx.lineTo(bx, by - 48);
      ctx.stroke();

      // Fluttering elongated vertical banner cloth
      const flagSway = Math.sin(this.frameCount * 0.1 + bx) * 5;
      ctx.fillStyle = b.color;
      ctx.beginPath();
      ctx.moveTo(bx, by - 48);
      ctx.lineTo(bx + 14 + flagSway, by - 42);
      ctx.lineTo(bx + 11 + flagSway * 0.8, by - 16);
      ctx.lineTo(bx, by - 18);
      ctx.closePath();
      ctx.fill();

      // Gold zigzag flame pattern on festival banner
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(bx + 3, by - 44);
      ctx.lineTo(bx + 9 + flagSway * 0.5, by - 38);
      ctx.lineTo(bx + 3, by - 32);
      ctx.lineTo(bx + 8 + flagSway * 0.6, by - 26);
      ctx.stroke();

      ctx.restore();
    }

    // Janur Kuning decorative garland across Saung Bale & Bridges
    const garlandBridges = [
      { x1: 25 * TILE_SIZE, x2: 28 * TILE_SIZE + 32, y: 13 * TILE_SIZE + 4 },
      { x1: 8 * TILE_SIZE, x2: 11 * TILE_SIZE + 32, y: 8 * TILE_SIZE + 24 },
    ];
    for (const g of garlandBridges) {
      ctx.save();
      const midX = (g.x1 + g.x2) / 2;
      const sagY = g.y + 10 + Math.sin(this.frameCount * 0.05) * 1.5;
      ctx.strokeStyle = '#eab308';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(g.x1, g.y);
      ctx.quadraticCurveTo(midX, sagY, g.x2, g.y);
      ctx.stroke();

      // Hanging mini diamond janur ketupat ornaments
      for (let k = 0; k < 5; k++) {
        const t = (k + 1) / 6;
        const kx = (1 - t) * (1 - t) * g.x1 + 2 * (1 - t) * t * midX + t * t * g.x2;
        const ky = (1 - t) * (1 - t) * g.y + 2 * (1 - t) * t * sagY + t * t * g.y;
        ctx.fillStyle = k % 2 === 0 ? '#facc15' : '#84cc16';
        ctx.beginPath();
        ctx.moveTo(kx, ky);
        ctx.lineTo(kx + 3, ky + 4);
        ctx.lineTo(kx, ky + 8);
        ctx.lineTo(kx - 3, ky + 4);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
    }
  }

  private drawWeatherAndAtmosphere(ctx: CanvasRenderingContext2D, width: number, height: number) {
    // 1. Falling rain streaks (multi-depth layers)
    if (this.isRaining) {
      // Layer A: Background subtle mist drops (slower, thinner)
      ctx.save();
      ctx.strokeStyle = 'rgba(186, 230, 253, 0.35)';
      ctx.lineWidth = 1.0;
      ctx.beginPath();
      for (const drop of this.backgroundRainDrops) {
        drop.x += 1.8;
        drop.y += drop.speed;
        if (drop.y > height) {
          drop.y = -drop.len;
          drop.x = Math.random() * (width + 100) - 50;
        }
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x + 2.5, drop.y + drop.len);
      }
      ctx.stroke();
      ctx.restore();

      // Layer B: Foreground fast angled streaks with slight motion glow
      ctx.save();
      ctx.strokeStyle = 'rgba(224, 242, 254, 0.65)';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      for (const drop of this.foregroundRainDrops) {
        drop.x += 2.8;
        drop.y += drop.speed;
        if (drop.y > height) {
          drop.y = -drop.len;
          drop.x = Math.random() * (width + 100) - 50;
        }
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x + 4, drop.y + drop.len);
      }
      ctx.stroke();
      ctx.restore();

      // Layer C: Low-lying ground mist/fog banks floating during rain
      const fogOffset = (this.frameCount * 0.4) % width;
      ctx.save();
      const fogGrad = ctx.createLinearGradient(0, height - 90, 0, height);
      fogGrad.addColorStop(0, 'rgba(203, 213, 225, 0)');
      fogGrad.addColorStop(0.5, 'rgba(224, 242, 254, 0.12)');
      fogGrad.addColorStop(1, 'rgba(148, 163, 184, 0.22)');
      ctx.fillStyle = fogGrad;
      ctx.fillRect(0, height - 90, width, 90);

      // Drifting soft cloud puff ellipses
      ctx.fillStyle = 'rgba(241, 245, 249, 0.08)';
      for (let f = 0; f < 3; f++) {
        const fx = ((f * 320 + fogOffset) % (width + 200)) - 100;
        ctx.beginPath();
        ctx.ellipse(fx, height - 35, 140, 24, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // 2. Distant lightning flash overlay
    if (this.lightningFlashTimer > 0) {
      ctx.save();
      const flashOpacity = (this.lightningFlashTimer / 6) * 0.4;
      ctx.fillStyle = `rgba(255, 255, 255, ${flashOpacity})`;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();
    }

    // 3. Day / Night ambient lighting tint
    this.drawDayNightAmbient(ctx, width, height);

    // 4. Festival celebratory atmosphere (glowing golden dust & petals floating)
    if (this.currentFestival) {
      ctx.save();
      for (let p = 0; p < 12; p++) {
        const px = ((p * 77 + this.frameCount * 0.7) % (width + 40)) - 20;
        const py = ((p * 93 + Math.sin(this.frameCount * 0.03 + p) * 40 + this.frameCount * 0.3) % (height + 40)) - 20;
        ctx.fillStyle = p % 2 === 0 ? 'rgba(251, 191, 36, 0.6)' : 'rgba(244, 63, 94, 0.55)';
        ctx.beginPath();
        ctx.arc(px, py, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  private drawDayNightAmbient(ctx: CanvasRenderingContext2D, width: number, height: number) {
    const h = this.time.hour;
    let overlayColor = 'rgba(0,0,0,0)';

    if (h >= 6 && h < 8) {
      overlayColor = 'rgba(251, 191, 36, 0.08)';
    } else if (h >= 8 && h < 16) {
      overlayColor = 'rgba(0, 0, 0, 0)';
    } else if (h >= 16 && h < 18) {
      overlayColor = 'rgba(245, 158, 11, 0.12)';
    } else if (h >= 18 && h < 20) {
      overlayColor = 'rgba(124, 45, 18, 0.25)';
    } else if (h >= 20 || h < 6) {
      overlayColor = 'rgba(15, 23, 42, 0.45)';
    }

    if (overlayColor !== 'rgba(0,0,0,0)') {
      ctx.fillStyle = overlayColor;
      ctx.fillRect(0, 0, width, height);
    }
  }
}
