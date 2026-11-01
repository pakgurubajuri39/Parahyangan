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
        elevation: r < 12 ? 2 : r < 27 ? 1 : 0,
      });
    }
    tiles.push(row);
  }

  // =========================================================================
  // 0. BORDER FORESTS & SCENIC TREES (PEPOHONAN SUNDA)
  // =========================================================================

  // North Mountain Ridge Forest: Pine trees (Pinus Priangan) & rocky outcrops
  for (let c = 0; c < MAP_COLS; c++) {
    if (c < 24 || c > 28) {
      if (c % 2 === 0) {
        tiles[0][c].kind = 'tree_pinus';
      } else {
        tiles[0][c].kind = c % 3 === 0 ? 'rock' : 'tree_pinus';
      }
      if (c % 3 === 1 && c !== 5 && c !== 6) {
        tiles[1][c].kind = 'tree_pinus';
      }
    }
  }

  // West Forest Border: Bamboo Groves (Rumpun Dapuran Awi) & Banana Trees
  for (let r = 0; r < MAP_ROWS; r++) {
    tiles[r][0].kind = 'tree_bambu';
    if (r % 2 === 0 && (r < 4 || r > 8)) {
      tiles[r][1].kind = 'tree_bambu';
    }
    if (r >= 38 && r <= 46 && r % 2 === 1) {
      tiles[r][1].kind = 'tree_pisang';
    }
  }

  // East Border: Bamboo Groves & Aren / Coconut Palms (Pohon Kelapa / Aren Sunda)
  for (let r = 0; r < MAP_ROWS; r++) {
    tiles[r][MAP_COLS - 1].kind = 'tree_bambu';
    if (r % 2 === 1) {
      tiles[r][MAP_COLS - 2].kind = r > 20 ? 'tree_kelapa' : 'tree_bambu';
    }
  }

  // South Border: Coconut Palms & Banana Groves
  for (let c = 0; c < MAP_COLS; c++) {
    tiles[MAP_ROWS - 1][c].kind = c % 2 === 0 ? 'tree_kelapa' : 'tree_pisang';
    if (c % 3 === 0) {
      tiles[MAP_ROWS - 2][c].kind = 'tree_pisang';
    }
  }

  // Scenic Clustered Trees around Village:
  // Saung front and side banana trees
  tiles[3][3].kind = 'tree_pisang';
  tiles[6][3].kind = 'tree_pisang';
  tiles[9][3].kind = 'tree_pisang';
  tiles[3][10].kind = 'tree_kelapa';
  tiles[3][11].kind = 'tree_kelapa';

  // Bamboo clusters near tea hill slopes
  tiles[4][28].kind = 'tree_bambu';
  tiles[4][29].kind = 'tree_bambu';
  tiles[5][39].kind = 'tree_bambu';
  tiles[6][39].kind = 'tree_bambu';
  tiles[11][39].kind = 'tree_bambu';

  // Coconut palms near Balong pond shores
  tiles[17][28].kind = 'tree_kelapa';
  tiles[17][43].kind = 'tree_kelapa';
  tiles[28][28].kind = 'tree_kelapa';
  tiles[29][43].kind = 'tree_kelapa';

  // Pine trees near Livestock paddock
  tiles[3][52].kind = 'tree_pinus';
  tiles[3][53].kind = 'tree_pinus';
  tiles[5][53].kind = 'tree_pinus';
  tiles[8][53].kind = 'tree_pinus';
  tiles[11][53].kind = 'tree_pinus';

  // Banana groves in south farm expansions
  tiles[39][5].kind = 'tree_pisang';
  tiles[41][5].kind = 'tree_pisang';
  tiles[43][6].kind = 'tree_pisang';
  tiles[44][28].kind = 'tree_pisang';
  tiles[45][29].kind = 'tree_pisang';
  tiles[43][38].kind = 'tree_pisang';
  tiles[44][39].kind = 'tree_pisang';

  // =========================================================================
  // 1. SAUNG BAMBU PARAHYANGAN (Cols 4..9, Rows 4..8)
  // =========================================================================
  for (let r = 4; r <= 8; r++) {
    for (let c = 4; c <= 9; c++) {
      if (r === 4 || c === 4 || (c === 9 && r !== 7) || (r === 8 && c !== 7 && c !== 8)) {
        tiles[r][c].kind = 'wall_bamboo';
      } else {
        tiles[r][c].kind = 'wood_floor';
      }
    }
  }
  // Saung Bale-bale (Bed) at (5, 5)
  tiles[5][5].kind = 'bed';

  // Shipping Bin (Peti Jual) outside Saung beside porch at (11, 8)
  tiles[8][11].kind = 'shipping_bin';

  // =========================================================================
  // 2. KANDANG DOMBA GARUT (Cols 41..51, Rows 4..11)
  // =========================================================================
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

  // =========================================================================
  // 2.5 PETERNAKAN KECIL UNGGAS (Hayam & Bebek)
  // =========================================================================
  // Cols 15..20, Rows 10..13 (Timur Abah Surya)
  const poultry = { minX: 15, maxX: 20, minY: 10, maxY: 13 };
  tiles[10][15].kind = 'wall_bamboo';
  tiles[10][16].kind = 'wall_bamboo';
  tiles[11][15].kind = 'wall_bamboo';
  tiles[11][16].kind = 'wood_floor';
  tiles[10][17].kind = 'hay_bale';
  tiles[10][18].kind = 'hay_bale';
  tiles[11][19].kind = 'trough';
  tiles[10][19].kind = 'fence';
  tiles[10][20].kind = 'fence';
  tiles[11][20].kind = 'fence';
  tiles[12][20].kind = 'fence';
  tiles[13][20].kind = 'fence';
  tiles[13][19].kind = 'fence';
  tiles[13][18].kind = 'fence';

  // =========================================================================
  // 3. BENGKEL & GUBUG AWI MANG JAJA (Cols 46..51, Rows 14..18)
  // =========================================================================
  for (let r = 14; r <= 18; r++) {
    for (let c = 46; c <= 51; c++) {
      if (r === 14 || c === 51 || (c === 46 && r !== 16)) {
        tiles[r][c].kind = 'wall_bamboo';
      } else {
        tiles[r][c].kind = 'wood_floor';
      }
    }
  }

  // =========================================================================
  // 4. GAZEBO BALE SAWALA DI BARAT DAYA (Cols 4..8, Rows 30..34)
  // =========================================================================
  for (let r = 30; r <= 34; r++) {
    for (let c = 4; c <= 8; c++) {
      if ((r === 30 && (c === 4 || c === 8)) || (r === 34 && (c === 4 || c === 8))) {
        tiles[r][c].kind = 'wall_bamboo';
      } else {
        tiles[r][c].kind = 'wood_floor';
      }
    }
  }

  // Saung Paninjauan Selatan (Cols 30..33, Rows 41..44)
  for (let r = 41; r <= 44; r++) {
    for (let c = 30; c <= 33; c++) {
      if ((r === 41 && (c === 30 || c === 33)) || (r === 44 && (c === 30 || c === 33))) {
        tiles[r][c].kind = 'wall_bamboo';
      } else {
        tiles[r][c].kind = 'wood_floor';
      }
    }
  }

  // =========================================================================
  // 5. CURUG LUHUR & JARINGAN PARIT IRIGASI
  // =========================================================================
  // Curug Waterfall spring in north (Cols 24..28, Rows 0..3)
  tiles[0][24].kind = 'rock';
  tiles[0][28].kind = 'rock';
  tiles[1][24].kind = 'rock';
  tiles[1][28].kind = 'rock';
  tiles[2][24].kind = 'rock';
  tiles[2][28].kind = 'rock';
  tiles[0][25].kind = 'water_deep';
  tiles[0][26].kind = 'water_deep';
  tiles[0][27].kind = 'water_deep';
  tiles[1][25].kind = 'water_deep';
  tiles[1][26].kind = 'water_deep';
  tiles[1][27].kind = 'water_deep';
  tiles[2][26].kind = 'water_canal';

  // Main Canal from Curug south down to Row 38 along Col 26
  for (let r = 3; r <= 38; r++) {
    tiles[r][26].kind = 'water_canal';
  }
  // East Canal Branch to Balong Pond (Row 20, Cols 26..29)
  for (let c = 26; c <= 29; c++) {
    tiles[20][c].kind = 'water_canal';
  }
  // Central Irrigation Canal (Row 27, Cols 14..26)
  for (let c = 14; c <= 26; c++) {
    tiles[27][c].kind = 'water_canal';
  }
  // Southern Irrigation Canal (Row 38, Cols 12..26)
  for (let c = 12; c <= 26; c++) {
    tiles[38][c].kind = 'water_canal';
  }

  // =========================================================================
  // 6. CUKANG AWI BRIDGES (JEMBATAN PENYEBERANGAN)
  // =========================================================================
  // Bridge 1: North Cross to Tea Hills (Row 7, Col 26)
  tiles[7][26].kind = 'bridge_bamboo';
  // Bridge 2: Main Center Village Bridge (Row 14, Col 26)
  tiles[14][26].kind = 'bridge_bamboo';
  // Bridge 3: Middle Sawah Bridge (Row 27, Col 20)
  tiles[27][20].kind = 'bridge_bamboo';
  // Bridge 4: Balong Brook Bridge (Row 27, Col 26)
  tiles[27][26].kind = 'bridge_bamboo';
  // Bridge 5: South Sawah Extension Bridge (Row 38, Col 20)
  tiles[38][20].kind = 'bridge_bamboo';
  // Bridge 6: South Canal Bridge (Row 38, Col 26)
  tiles[38][26].kind = 'bridge_bamboo';

  // =========================================================================
  // 7. BALONG EMPANG IKAN & DERMAGA PANCING AWI (Cols 29..43, Rows 18..28)
  // =========================================================================
  for (let r = 18; r <= 28; r++) {
    for (let c = 29; c <= 43; c++) {
      tiles[r][c].kind = 'pond';
    }
  }
  // Deep central pool for prized Gurame & Lauk Mas Kancra
  for (let r = 20; r <= 26; r++) {
    for (let c = 32; c <= 39; c++) {
      tiles[r][c].kind = 'water_deep';
    }
  }

  // Bamboo Fishing Pier / Dock (Dermaga Pancing Awi) extending out into Balong!
  // Walkable wooden/bamboo pier at Row 23, Cols 40..43
  tiles[23][40].kind = 'dock_bamboo';
  tiles[23][41].kind = 'dock_bamboo';
  tiles[23][42].kind = 'dock_bamboo';
  tiles[23][43].kind = 'dock_bamboo';

  // Natural mossy boulders along Balong perimeter
  tiles[18][29].kind = 'rock';
  tiles[18][43].kind = 'rock';
  tiles[28][29].kind = 'rock';
  tiles[28][43].kind = 'rock';
  tiles[21][29].kind = 'rock';
  tiles[25][29].kind = 'rock';

  // =========================================================================
  // 8. JARINGAN JALAN SETAPAK (PATHS)
  // =========================================================================
  // Main East-West thoroughfare (Row 14, Cols 7..58)
  for (let c = 7; c <= 58; c++) {
    if (tiles[14][c].kind !== 'bridge_bamboo' && tiles[14][c].kind !== 'water_canal') {
      tiles[14][c].kind = 'path';
    }
  }
  // North-South main farm path (Col 7, Rows 8..44)
  for (let r = 8; r <= 44; r++) {
    tiles[r][7].kind = 'path';
  }
  // Path from Saung to Peti Jual and Abah Surya (Row 9, Cols 7..15)
  for (let c = 7; c <= 15; c++) {
    tiles[9][c].kind = 'path';
  }
  // North Path to Tea Hills and Livestock Gate (Row 7, Cols 20..41)
  for (let c = 20; c <= 41; c++) {
    if (tiles[7][c].kind !== 'bridge_bamboo') {
      tiles[7][c].kind = 'path';
    }
  }
  // Path to Craftsman workshop
  tiles[15][45].kind = 'path';
  tiles[16][45].kind = 'path';
  tiles[16][46].kind = 'path';
  // Path to Fishing Dock & East Balong shore (Col 44, Rows 14..36)
  for (let r = 14; r <= 36; r++) {
    tiles[r][44].kind = 'path';
  }
  // Dock connector: Path from Col 44 to bamboo dock at (23, 43)
  tiles[23][44].kind = 'path';

  // Path to Bale Sawala Gazebo
  for (let c = 7; c <= 10; c++) {
    tiles[32][c].kind = 'path';
  }
  // Path to South Saung Paninjauan
  for (let c = 7; c <= 30; c++) {
    if (tiles[43][c].kind !== 'bridge_bamboo' && tiles[43][c].kind !== 'water_canal') {
      tiles[43][c].kind = 'path';
    }
  }

  // =========================================================================
  // 9. TERASERING SAWAH PADI UTAMA (Center-South)
  // =========================================================================
  // Tier 1: Cols 10..24, Rows 16..25
  for (let r = 16; r <= 25; r++) {
    for (let c = 10; c <= 24; c++) {
      tiles[r][c].kind = 'soil_dry';
    }
  }
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
    tiles[16][c].hasBambooAqueduct = true;
  }

  // Tier 2: Cols 9..24, Rows 29..36
  for (let r = 29; r <= 36; r++) {
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

  // Tier 3: Expanded South Sawah & Palawija (Rows 39..44, Cols 10..25)
  for (let r = 39; r <= 44; r++) {
    for (let c = 10; c <= 25; c++) {
      tiles[r][c].kind = 'soil_dry';
    }
  }
  // Irrigated fertile demonstration plots in southern expansion
  for (let c = 12; c <= 16; c++) {
    tiles[40][c].kind = 'soil_wet';
    tiles[40][c].crop = {
      type: 'padi',
      stage: 2,
      daysInStage: 1,
      maxStages: 3,
      isWatered: true,
    };
  }

  // =========================================================================
  // 10. PERKEBUNAN UBI CILEMBU (North-West, Cols 13..21, Rows 4..9)
  // =========================================================================
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

  // =========================================================================
  // 11. KEBUN TEH PREANGER (Hills, Cols 30..38, Rows 5..11)
  // =========================================================================
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

  // =========================================================================
  // 12. KEBUN KOPI JAVA PREANGER & CABAI CENGEK (Cols 45..55, Rows 28..36)
  // =========================================================================
  for (let r = 28; r <= 36; r++) {
    for (let c = 46; c <= 55; c++) {
      tiles[r][c].kind = 'soil_dry';
    }
  }
  tiles[30][48].kind = 'soil_wet';
  tiles[30][48].crop = {
    type: 'ubi',
    stage: 2,
    daysInStage: 1,
    maxStages: 3,
    isWatered: true,
  };
  tiles[30][49].kind = 'soil_wet';
  tiles[30][49].crop = {
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
    shippingBinPos: { x: 11, y: 8 },
    abahPos: { x: 12, y: 10 },
    ceuceuPos: { x: 34, y: 12 },
    ujangPos: { x: 40, y: 8 },
    jajaPos: { x: 26, y: 14 },
    livestockPen: pen,
    poultryPen: poultry,
  };
}
