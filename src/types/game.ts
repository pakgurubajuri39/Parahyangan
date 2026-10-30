export type ToolType =
  | 'cangkul'
  | 'gembor'
  | 'bibit_padi'
  | 'bibit_ubi'
  | 'bibit_teh'
  | 'talang_bambu'
  | 'sabit'
  | 'nasi_liwet'
  | 'ubi_rebus'
  | 'bajigur'
  | 'gunting_cukur'
  | 'pakan_ternak';

export type CropType = 'padi' | 'ubi' | 'teh';

export interface CropState {
  type: CropType;
  stage: number; // 0: seed, 1: sprout, 2: growing, 3: mature
  daysInStage: number;
  maxStages: number;
  isWatered: boolean;
  regrowable?: boolean;
}

export type TileKind =
  | 'grass'
  | 'soil_dry'
  | 'soil_wet'
  | 'path'
  | 'water_canal'
  | 'bridge_bamboo'
  | 'pond'
  | 'rock'
  | 'wood_floor'
  | 'wall_bamboo'
  | 'bed'
  | 'shipping_bin'
  | 'fence'
  | 'hay_bale'
  | 'trough';

export interface TileData {
  kind: TileKind;
  crop?: CropState | null;
  hasBambooAqueduct?: boolean;
  elevation?: number;
}

export type Season = 'kasa' | 'katiga' | 'rendeng';

export interface GameTime {
  day: number;
  hour: number;
  minute: number;
  season: Season;
  year: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  sundaneseName: string;
  category: 'tool' | 'seed' | 'crop' | 'food' | 'material' | 'animal_product';
  toolType?: ToolType;
  count: number;
  sellPrice: number;
  buyPrice: number;
  icon: string;
  description: string;
  energyBonus?: number;
}

export type Direction8 =
  | 'up'
  | 'down'
  | 'left'
  | 'right'
  | 'up-left'
  | 'up-right'
  | 'down-left'
  | 'down-right';

export interface PlayerState {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  direction: Direction8;
  isMoving: boolean;
  isActing: boolean;
  isSprinting: boolean;
  stamina: number;
  maxStamina: number;
  kujangCoins: number;
  selectedSlot: number;
}

export type NpcId = 'abah_surya' | 'neng_ceuceu' | 'mang_ujang' | 'mang_jaja';

export interface NpcScheduleItem {
  startHour: number;
  endHour: number;
  tileX: number;
  tileY: number;
  locationName: string;
  activityName: string;
  dialogueHint: string;
}

export interface NpcData {
  id: NpcId;
  name: string;
  title: string;
  role: string;
  x: number; // default tile pos
  y: number;
  avatar: string;
  bio: string;
  dialogues: string[];
  proximityGreetings: string[];
  schedule?: NpcScheduleItem[];
  shopItems?: InventoryItem[];
}

export type AnimalType = 'domba' | 'ayam' | 'bebek';

export interface Animal {
  id: string;
  type: AnimalType;
  name: string;
  x: number; // world px
  y: number;
  targetX: number;
  targetY: number;
  direction: 'left' | 'right';
  animTimer: number;
  isGrazing: boolean;
  hasProduct: boolean; // egg or wool ready for manual collect
  happiness: number; // 0 - 100
  pettedToday: boolean;
  isFed?: boolean;
  fedTimer?: number; // frames remaining fed
  eggTimer?: number; // periodic countdown to lay an egg on ground
}

export interface LaidEgg {
  id: string;
  x: number;
  y: number;
  type: 'ayam' | 'bebek';
  animOffset: number;
}

export interface LeafParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  rotation?: number;
  rotationSpeed: number;
  rotSpeed?: number;
  flipProgress: number;
  flipSpeed?: number;
  size: number;
  color: string;
  veinColor?: string;
  life: number;
  maxLife: number;
  alpha: number;
  swayOffset?: number;
  flutterFreq: number;
  type?: 'tea' | 'bamboo' | 'golden';
}

export interface DailyReport {
  day: number;
  itemsSold: { name: string; count: number; total: number }[];
  totalEarnings: number;
  cropsGrownCount: number;
  eggsCollected: number;
  woolCollected: number;
}

export interface FestivalData {
  id: string;
  name: string;
  sundaneseName: string;
  season: Season;
  day: number;
  badge: string;
  themeColor: string;
  description: string;
  bannerMessage: string;
  specialShopItems: InventoryItem[];
  npcDialogues: Record<NpcId, string>;
  npcGreetings: Record<NpcId, string>;
}
