import { TileData } from '../types/game';
import { MAP_COLS, MAP_ROWS } from './constants';

export interface WorldMap {
  cols: number;
  rows: number;
  tiles: TileData[][];
  saungBedPos: { x: number; y: number };
  shippingBinPos: { x: number; y: number };
  abahPos: { x: number; y: number };
  ceuceuPos: { x: number; y: number };
  ujangPos: { x: number; y: number };
  jajaPos: { x: number; y: number };
  livestockPen: { minX: number; maxX: number; minY: number; maxY: number };
  poultryPen: { minX: number; maxX: number; minY: number; maxY: number };
}

export function createParahyanganMap(): WorldMap {
  const tiles: TileData[][] = [];

  for (let r = 0; r < MAP_ROWS; r++) {
    const row: TileData[] = [];
    for (let c = 0; c < MAP_COLS; c++) {
      row.push({
        kind: 'grass',
        crop: null,
        hasBambooAqueduct: false,
        elevation: r < 12 ? 2 : r < 25 ? 1 : 0,
      });
    }
    tiles.push(row);
  }

  // 1. Saung Bambu Parahyangan (Cols 4..9, Rows 4..8)
  for (let r = 4; r <= 8; r++) {
    for (let c = 4; c <= 9; c++) {
      if (r === 4 || c === 4 || (c === 9 && r !== 7)) {
        tiles[r][c].kind = 'wall_bamboo';
      } else {
        tiles[r][c].kind = 'wood_floor';
      }
    }
  }
  // Saung Bale-bale (Bed) at (5, 5)
  tiles[5][5].kind = 'bed';

  // Shipping Bin (Peti Jual) outside Saung at (10, 7)
  tiles[7][10].kind = 'shipping_bin';

  // 2. Kandang Domba Garut (Cols 41..51, Rows 4..11)
  const pen = { minX: 41, maxX: 51, minY: 4, maxY: 11 };
  for (let r = pen.minY; r <= pen.maxY; r++) {
    for (let c = pen.minX; c <= pen.maxX; c++) {
      // Fences on perimeter, leaving gate at (41, 8)
      if (r === pen.minY || r === pen.maxY || c === pen.maxX || (c === pen.minX && r !== 8)) {
        tiles[r][c].kind = 'fence';
      } else {
        tiles[r][c].kind = 'grass';
      }
    }
  }
  // Hay bales & troughs inside paddock
  tiles[5][49].kind = 'hay_bale';
  tiles[5][50].kind = 'hay_bale';
  tiles[6][50].kind = 'trough';
  tiles[9][49].kind = 'hay_bale';
  tiles[10][50].kind = 'trough';

  // 2.5 Peternakan Kecil Unggas (Kandang Hayam & Bebek di Area Pertanian)
  // Cols 15..20, Rows 10..13 (Timur Abah Surya, dekat jalan utama sawah)
  const poultry = { minX: 15, maxX: 20, minY: 10, maxY: 13 };
  // Bamboo chicken coop shelter
  tiles[10][15].kind = 'wall_bamboo';
  tiles[10][16].kind = 'wall_bamboo';
  tiles[11][15].kind = 'wall_bamboo';
  tiles[11][16].kind = 'wood_floor'; // inside coop
  // Straw nesting boxes (sarang jerami telur)
  tiles[10][17].kind = 'hay_bale';
  tiles[10][18].kind = 'hay_bale';
  // Poultry feed trough (wadah pakan bekatul unggas)
  tiles[11][19].kind = 'trough';
  // Perimeter bamboo low fence
  tiles[10][19].kind = 'fence';
  tiles[10][20].kind = 'fence';
  tiles[11][20].kind = 'fence';
  tiles[12][20].kind = 'fence';
  tiles[13][20].kind = 'fence';
  tiles[13][19].kind = 'fence';
  tiles[13][18].kind = 'fence';
  // Open gate at cols 16..17, row 13 for free-range chickens & ducks to wander

  // 3. Bengkel & Gubug Awi Mang Jaja (Cols 46..51, Rows 14..18)
  for (let r = 14; r <= 18; r++) {
    for (let c = 46; c <= 51; c++) {
      if (r === 14 || c === 51 || (c === 46 && r !== 16)) {
        tiles[r][c].kind = 'wall_bamboo';
      } else {
        tiles[r][c].kind = 'wood_floor';
      }
    }
  }

  // 4. Gazebo Bale Sawala di Selatan (Cols 4..8, Rows 30..34)
  for (let r = 30; r <= 34; r++) {
    for (let c = 4; c <= 8; c++) {
      if ((r === 30 && (c === 4 || c === 8)) || (r === 34 && (c === 4 || c === 8))) {
        tiles[r][c].kind = 'wall_bamboo';
      } else {
        tiles[r][c].kind = 'wood_floor';
      }
    }
  }

  // 5. Parit Sawah & Mata Air Curug (Water Canal & River)
  // Curug Waterfall spring in north (Cols 25..27, Rows 0..2)
  tiles[0][25].kind = 'rock';
  tiles[0][27].kind = 'rock';
  tiles[1][25].kind = 'rock';
  tiles[1][27].kind = 'rock';

  // Main Canal from North down to Row 27 along Col 26
  for (let r = 0; r <= 27; r++) {
    tiles[r][26].kind = 'water_canal';
  }
  // East Canal Branch to Balong Pond (Row 20, Cols 26..30)
  for (let c = 26; c <= 30; c++) {
    tiles[20][c].kind = 'water_canal';
  }
  // South Irrigation Canal (Row 27, Cols 14..26)
  for (let c = 14; c <= 26; c++) {
    tiles[27][c].kind = 'water_canal';
  }

  // 6. Cukang Awi Bridges (Jembatan Bambu untuk menyeberang parit)
  // Bridge 1: North Cross to Tea Hills & Paddock (Row 7, Col 26)
  tiles[7][26].kind = 'bridge_bamboo';
  // Bridge 2: Main Center Bridge to Balong & Craftsman (Row 14, Col 26)
  tiles[14][26].kind = 'bridge_bamboo';
  // Bridge 3: South Bridge to Rice Terraces (Row 27, Col 20)
  tiles[27][20].kind = 'bridge_bamboo';
  // Bridge 4: South-East Bridge across Balong brook (Row 27, Col 26)
  tiles[27][26].kind = 'bridge_bamboo';

  // 7. Balong Empang Ikan Air Tawar (Cols 29..39, Rows 18..26)
  for (let r = 18; r <= 26; r++) {
    for (let c = 29; c <= 39; c++) {
      tiles[r][c].kind = 'pond';
    }
  }
  // Rocks bordering the Balong
  tiles[18][29].kind = 'rock';
  tiles[18][39].kind = 'rock';
  tiles[26][29].kind = 'rock';
  tiles[26][39].kind = 'rock';

  // 8. Jaringan Jalan Setapak (Paths)
  // Main East-West thoroughfare across the entire village (Row 14)
  for (let c = 7; c <= 51; c++) {
    if (tiles[14][c].kind !== 'bridge_bamboo' && tiles[14][c].kind !== 'water_canal') {
      tiles[14][c].kind = 'path';
    }
  }
  // North-South path from Saung down to Sawah
  for (let r = 8; r <= 36; r++) {
    tiles[r][7].kind = 'path';
  }
  // Path from Saung to Peti Jual and Abah Surya
  for (let c = 7; c <= 15; c++) {
    tiles[9][c].kind = 'path';
  }
  // North Path to Tea Hills and Livestock Gate (Row 7, Cols 20..41)
  for (let c = 20; c <= 41; c++) {
    if (tiles[7][c].kind !== 'bridge_bamboo') {
      tiles[7][c].kind = 'path';
    }
  }
  // Path to Craftsman workshop (Cols 45..46, Row 16)
  tiles[15][45].kind = 'path';
  tiles[16][45].kind = 'path';
  tiles[16][46].kind = 'path';
  // Path to Southern Coffee & Chili Garden (Col 40, Rows 14..35)
  for (let r = 14; r <= 35; r++) {
    tiles[r][40].kind = 'path';
  }
  // Path to Bale Sawala Gazebo
  for (let c = 7; c <= 10; c++) {
    tiles[32][c].kind = 'path';
  }

  // 9. Terasering Sawah Padi Utama (Center-South)
  // Tier 1: Cols 10..24, Rows 16..25
  for (let r = 16; r <= 25; r++) {
    for (let c = 10; c <= 24; c++) {
      tiles[r][c].kind = 'soil_dry';
    }
  }
  // Pre-planted demonstration paddies in Tier 1
  for (let c = 12; c <= 17; c++) {
    tiles[17][c].kind = 'soil_wet';
    tiles[17][c].crop = {
      type: 'padi',
      stage: 1,
      daysInStage: 0,
      maxStages: 3,
      isWatered: true,
    };
    tiles[18][c].kind = 'soil_wet';
    tiles[18][c].crop = {
      type: 'padi',
      stage: 2,
      daysInStage: 1,
      maxStages: 3,
      isWatered: true,
    };
  }
  // Pre-installed bamboo talang aqueducts along row 16
  for (let c = 12; c <= 17; c++) {
    tiles[16][c].hasBambooAqueduct = true;
  }

  // Tier 2: Cols 9..24, Rows 29..37
  for (let r = 29; r <= 37; r++) {
    for (let c = 9; c <= 24; c++) {
      tiles[r][c].kind = 'soil_dry';
    }
  }
  tiles[31][12].kind = 'soil_wet';
  tiles[31][12].crop = {
    type: 'padi',
    stage: 3,
    daysInStage: 2,
    maxStages: 3,
    isWatered: true,
  };
  tiles[31][13].kind = 'soil_wet';
  tiles[31][13].crop = {
    type: 'padi',
    stage: 3,
    daysInStage: 2,
    maxStages: 3,
    isWatered: true,
  };

  // 10. Perkebunan Ubi Cilembu (North-West, Cols 13..21, Rows 4..9)
  for (let r = 4; r <= 9; r++) {
    for (let c = 13; c <= 21; c++) {
      tiles[r][c].kind = 'soil_dry';
    }
  }
  tiles[6][15].kind = 'soil_dry';
  tiles[6][15].crop = {
    type: 'ubi',
    stage: 1,
    daysInStage: 0,
    maxStages: 3,
    isWatered: false,
  };
  tiles[6][16].kind = 'soil_dry';
  tiles[6][16].crop = {
    type: 'ubi',
    stage: 2,
    daysInStage: 1,
    maxStages: 3,
    isWatered: false,
  };

  // 11. Kebun Teh Preanger (Hills, Cols 30..38, Rows 5..11)
  for (let r = 5; r <= 11; r++) {
    for (let c = 30; c <= 38; c++) {
      tiles[r][c].kind = 'soil_wet';
      tiles[r][c].crop = {
        type: 'teh',
        stage: 2,
        daysInStage: 1,
        maxStages: 3,
        isWatered: true,
        regrowable: true,
      };
    }
  }

  // 12. Kebun Kopi Java Preanger & Cabai Cengek Domba (Cols 42..49, Rows 28..36)
  for (let r = 28; r <= 36; r++) {
    for (let c = 42; c <= 49; c++) {
      tiles[r][c].kind = 'soil_dry';
    }
  }
  // Pre-planted chili crops
  tiles[30][44].kind = 'soil_wet';
  tiles[30][44].crop = {
    type: 'ubi',
    stage: 2,
    daysInStage: 1,
    maxStages: 3,
    isWatered: true,
  };
  tiles[30][45].kind = 'soil_wet';
  tiles[30][45].crop = {
    type: 'ubi',
    stage: 3,
    daysInStage: 2,
    maxStages: 3,
    isWatered: true,
  };

  return {
    cols: MAP_COLS,
    rows: MAP_ROWS,
    tiles,
    saungBedPos: { x: 5, y: 5 },
    shippingBinPos: { x: 10, y: 7 },
    abahPos: { x: 12, y: 10 },
    ceuceuPos: { x: 34, y: 12 },
    ujangPos: { x: 40, y: 8 },
    jajaPos: { x: 26, y: 14 },
    livestockPen: pen,
    poultryPen: poultry,
  };
}
