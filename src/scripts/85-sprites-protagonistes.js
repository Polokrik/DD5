    // ───────────────────────── Direction artistique : duels de Drek’Thar et de Langdedrosa ─────────────────────────
    // Silhouettes d'abord, puis masses de couleur, puis lumière. Gestes de repos sobres : respiration, arme qui se déplace,
    // étoffe, rare étincelle. Les coups, eux, ne partent qu'au déclenchement du duel.
    function polyAt(g, ox, oy, scale, flip, points, color) {
      pixelPolygon(g, points.map(([px, py]) => [ox + Math.round(px * scale) * (flip ? -1 : 1), oy + Math.round(py * scale)]), color);
    }
    function lineAt(g, ox, oy, scale, flip, x1, y1, x2, y2, color) {
      pixelLine(g, ox + Math.round(x1 * scale) * (flip ? -1 : 1), oy + Math.round(y1 * scale), ox + Math.round(x2 * scale) * (flip ? -1 : 1), oy + Math.round(y2 * scale), color);
    }

    // ───────────────────────── Sprites des protagonistes (référence : Character Sprite Bible, grille 64×96) ─────────────────────────
    // Chaque personnage garde son centre de gravité et son ancrage de silhouette. Le modèle canonique fait 64×96;
    // en scène il est réduit par un facteur d'échelle appliqué aux coordonnées (arêtes arrondies, jamais d'interpolation).
    const SB = { ink: '#172c3d', deep: '#282330', skin: '#a77759', skin2: '#d0a075', steel: '#637980', steel2: '#aabfc0', white: '#e9e3d4', leather: '#66432d', leather2: '#9a6240',
      gold: '#c59a43', gold2: '#f0cf72', red: '#7d3338', red2: '#b9564f', green: '#526d44', green2: '#80a25b', blue: '#354d78', blue2: '#6685b7', purple: '#452756', purple2: '#78418a',
      ice2: '#bde5e5', acid: '#83b94e', black: '#26242c', brown: '#4b3228' };

    // Rampes de couleur des sprites : pour chaque teinte, sa voisine claire et sa voisine sombre dans la même palette.
    const SPRITE_RAMP_LIGHT = { skin: 'skin2', steel: 'steel2', leather: 'leather2', gold: 'gold2', red: 'red2', green: 'green2', blue: 'blue2', purple: 'purple2', black: 'deep', brown: 'leather' };
    const SPRITE_RAMP_DARK = { skin2: 'skin', steel2: 'steel', leather2: 'leather', gold2: 'gold', red2: 'red', green2: 'green', blue2: 'blue', purple2: 'purple',
      skin: 'leather', steel: 'deep', leather: 'brown', gold: 'leather2', red: 'deep', green: 'deep', blue: 'deep', purple: 'deep', brown: 'deep', white: 'steel2' };
    let spriteRampCache = null;
    function spriteRamps() {
      if (spriteRampCache?.ink === SB.ink && spriteRampCache?.skin === SB.skin) return spriteRampCache;
      const byHex = map => Object.fromEntries(Object.entries(map).map(([from, to]) => [SB[from], SB[to]]));
      spriteRampCache = { ink: SB.ink, skin: SB.skin, light: byHex(SPRITE_RAMP_LIGHT), dark: byHex(SPRITE_RAMP_DARK) };
      return spriteRampCache;
    }

    function spriteOps(g, ox, oy, s) {
      const X = v => Math.round(ox + v * s), Y = v => Math.round(oy + v * s);
      // Volume partagé : chaque aplat assez grand reçoit un liseré clair en haut et un liseré sombre à droite et en bas,
      // pris dans la rampe de sa propre couleur (aucune teinte ajoutée). Tous les sprites y gagnent, sans les redessiner.
      const shade = s >= .5 ? spriteRamps() : null;
      const P = (color, x, y, w = 1, h = 1) => {
        const x0 = X(x), y0 = Y(y), pw = Math.max(1, X(x + w) - x0), ph = Math.max(1, Y(y + h) - y0);
        // Les contours épais ont des coins adoucis : la silhouette perd son aspect de bloc.
        if (color === SB.ink && pw >= 6 && ph >= 6) { paint(g, color, x0 + 1, y0, pw - 2, ph); paint(g, color, x0, y0 + 1, 1, ph - 2); paint(g, color, x0 + pw - 1, y0 + 1, 1, ph - 2); }
        else paint(g, color, x0, y0, pw, ph);
        if (!shade || pw < 5 || ph < 5) return;
        const light = shade.light[color], dark = shade.dark[color];
        if (light) paint(g, light, x0, y0, pw - 1, 1);
        if (dark) { paint(g, dark, x0 + pw - 1, y0, 1, ph); paint(g, dark, x0, y0 + ph - 1, pw, 1); }
      };
      const poly = (color, pts) => pixelPolygon(g, pts.map(([px, py]) => [X(px), Y(py)]), color);
      const line = (color, x1, y1, x2, y2, w = 2) => {
        const half = Math.max(1, Math.round(w * s)), horizontal = Math.abs(x2 - x1) >= Math.abs(y2 - y1);
        for (let k = 0; k < half; k++) { const d = k - Math.floor((half - 1) / 2); pixelLine(g, X(x1) + (horizontal ? 0 : d), Y(y1) + (horizontal ? d : 0), X(x2) + (horizontal ? 0 : d), Y(y2) + (horizontal ? d : 0), color); }
      };
      return { P, poly, line };
    }

    // Amplitude de chaque coup (unités du modèle 64×96) et garde, d'après la bible.
    const SPRITE_REACH = { bjolnir: 6, drekthar: 5, ellyjobell: 6, darrin: 6, sislay: 8, kairon: 5, malar: 9 };
    const SPRITE_GUARD = { bjolnir: 3, drekthar: 5, ellyjobell: 4, darrin: 5, sislay: 3, kairon: 2, malar: 2 };

    // Chaque modèle reçoit une pose explicite : b = souffle, s = mouvement secondaire (barbe, étoffe, manche), a = élan de l'arme,
    // g = garde, r = action rare. Aucune valeur continue : la pose est une image.
    const SPRITE_MODELS = {
      bjolnir(o, p) {
        const { P, poly, line } = o, b = p.b, g = p.g, atk = p.a;
        P(SB.ink, 20, 69, 12, 22); P(SB.ink, 37, 69, 12, 22); P(SB.leather, 22, 70, 9, 18); P(SB.leather, 39, 70, 9, 18); P(SB.ink, 18, 87, 16, 6); P(SB.ink, 36, 87, 16, 6);
        P(SB.ink, 15, 30 + b, 37, 43); P(SB.steel, 18, 33 + b, 31, 37); P(SB.steel2, 20, 35 + b, 27, 6); P(SB.skin, 24, 17 + b, 21, 17); P(SB.ink, 22, 15 + b, 25, 7);
        P(SB.gold, 27, 29 + b, 15, 17); P(SB.gold2, 29, 31 + b, 11, 4); P(SB.brown, 25 + p.s, 36 + b, 19, 14); P(SB.skin2, 27, 22 + b, 4, 3); P(SB.skin2, 39, 22 + b, 4, 3);
        P(SB.ink, 7 - g, 38 + b, 22, 34); poly(SB.blue, [[10 - g, 40 + b], [27 - g, 40 + b], [27 - g, 65 + b], [18 - g, 71 + b], [10 - g, 65 + b]]);
        P(SB.steel2, 16 - g, 47 + b, 5, 16); P(SB.steel2, 11 - g, 53 + b, 16, 5);
        line(SB.ink, 47 + atk, 44 + b, 55 + atk, 18 + b, 6); P(SB.ink, 47 + atk, 10 + b, 16, 13); P(SB.steel, 49 + atk, 12 + b, 12, 9); P(SB.steel2, 50 + atk, 13 + b, 10, 3);
        if (p.r) P(SB.skin2, 45 + atk, 43 + b, 4, 3);
      },
      drekthar(o, p) {
        const { P, poly, line } = o, b = p.b, g = p.g, atk = p.a;
        P(SB.ink, 18, 71, 12, 21); P(SB.ink, 38, 71, 12, 21); P(SB.leather, 20, 72, 9, 17); P(SB.leather, 40, 72, 9, 17); P(SB.ink, 16, 88, 17, 5); P(SB.ink, 36, 88, 17, 5);
        P(SB.ink, 13, 30 + b, 39, 44); P(SB.steel, 16, 33 + b, 33, 38);
        for (let y = 36; y < 65; y += 6) line(SB.steel2, 18, y + b, 47, y + b, 2);
        P(SB.green, 23, 14 + b, 22, 19); P(SB.ink, 20, 12 + b, 27, 6); P(SB.ink, 20, 20 + b, 5, 7); P(SB.green2, 27, 20 + b, 4, 3); P(SB.green2, 39, 20 + b, 4, 3);
        P(SB.red, 12 + p.s, 35 + b + p.r, 9, 28); P(SB.leather2, 45, 36 + b + p.r, 8, 27);
        const len = 42 + atk, sx = 44 - g, sy = 51 + b + Math.max(0, atk);
        line(SB.ink, sx, sy, sx + len * .5, sy - len, 6); line(SB.steel2, sx, sy, sx + len * .5, sy - len, 3); line(SB.gold, sx - 5, sy + 1, sx + 5, sy - 4, 3);
      },
      ellyjobell(o, p) {
        const { P, poly, line } = o, b = p.b, glow = p.a > 0 ? SB.gold2 : SB.green2;
        P(SB.ink, 23, 70, 9, 20); P(SB.ink, 36, 70, 9, 20); P(SB.leather, 24, 72, 7, 16); P(SB.leather, 37, 72, 7, 16); P(SB.ink, 21, 87, 13, 5); P(SB.ink, 35, 87, 13, 5);
        P(SB.ink, 17, 36 + b, 32, 38); P(SB.green, 20, 39 + b, 26, 33);
        poly(SB.green2, [[16, 38 + b], [24, 31 + b], [31, 37 + b], [38, 30 + b], [49, 39 + b], [43, 47 + b], [22, 46 + b]]);
        P(SB.skin, 25, 20 + b, 17, 16); poly(SB.green, [[22, 24 + b], [29, 13 + b], [45, 24 + b], [42, 31 + b], [24, 31 + b]]); P(SB.skin2, 28, 25 + b, 3, 3); P(SB.skin2, 38, 25 + b, 3, 3);
        const sx = 11 + (p.g ? 4 : 0) + p.s;
        line(SB.brown, sx, 82, sx + 2, 15, 4); P(SB.gold2, sx, 12, 5, 5); P(glow, 10, 11, 6, 6); P(glow, 7, 15, 3, 3);
        if (p.r) { P(SB.green2, 7, 6 + b, 2, 2); P(SB.gold2, 14, 3, 2, 2); }
      },
      darrin(o, p) {
        const { P, poly, line } = o, b = p.b, spread = p.g ? 2 : 7, atk = p.a;
        P(SB.ink, 22, 70, 9, 21); P(SB.ink, 36, 70, 9, 21); P(SB.leather, 23, 72, 7, 17); P(SB.leather, 37, 72, 7, 17); P(SB.ink, 20, 88, 14, 5); P(SB.ink, 34, 88, 14, 5);
        P(SB.ink, 17, 32 + b, 32, 42); P(SB.purple, 20, 35 + b, 26, 36); P(SB.purple2, 21, 37 + b, 24, 5); P(SB.purple, 20 + p.s, 71, 26, 1);
        P(SB.skin, 25, 16 + b, 17, 17); P(SB.brown, 23, 13 + b, 21, 8); P(SB.skin2, 29, 23 + b, 3, 3); P(SB.skin2, 39, 23 + b, 3, 3);
        line(SB.purple2, 20, 41 + b, 12 - spread, 51 + b - atk, 6); line(SB.purple2, 46, 41 + b, 54 + spread, 48 + b + atk, 6);
        P(SB.skin2, 7 - spread, 48 + b - atk, 6, 6); P(SB.skin2, 53 + spread, 45 + b + atk, 6, 6);
        P(SB.gold2, 4 - spread, 42 + b - atk - (p.r ? 3 : 0), 4, 4); P(SB.ice2, 58 + spread, 39 + b + atk, 4, 4);
      },
      sislay(o, p) {
        const { P, poly, line } = o, b = p.b, atk = p.a;
        P(SB.ink, 18, 70, 10, 21); P(SB.ink, 38, 68, 10, 23); P(SB.leather, 20, 71, 7, 17); P(SB.leather, 40, 70, 7, 19); P(SB.ink, 16, 88, 15, 5); P(SB.ink, 36, 88, 15, 5);
        P(SB.ink, 16, 31 + b, 34, 41); P(SB.leather, 19, 34 + b, 28, 36); P(SB.green, 22, 36 + b, 22, 10);
        const hx = p.r ? 2 : 0;
        P(SB.green, 24 + hx, 16 + b, 20, 17); P(SB.ink, 21 + hx, 13 + b, 25, 7); P(SB.green2, 29 + hx, 23 + b, 3, 3); P(SB.green2, 39 + hx, 23 + b, 3, 3);
        const bx = 12 - (p.g ? 2 : 0) + p.s;
        line(SB.brown, bx, 29 + b, bx - 5, 72 + b, 3); line(SB.brown, bx - 5, 72 + b, bx - 8, 50 + b, 2); line(SB.brown, bx - 8, 50 + b, bx, 29 + b, 2);
        line(SB.steel2, 43, 49 + b, 60 + atk, 58 + b, 3);
      },
      kairon(o, p) {
        const { P, poly, line } = o, b = p.b, atk = p.a;
        P(SB.ink, 21, 69, 10, 22); P(SB.ink, 38, 69, 10, 22); P(SB.black, 23, 71, 7, 18); P(SB.black, 40, 71, 7, 18); P(SB.ink, 19, 88, 15, 5); P(SB.ink, 36, 88, 15, 5);
        P(SB.ink, 15, 31 + b, 35, 44); P(SB.purple, 18, 34 + b, 29, 38);
        poly(SB.purple2, [[18, 54 + b], [31, 49 + b], [30 + p.s, 78 + b], [21 + p.s, 72 + b]]); poly(SB.purple, [[47, 54 + b], [34, 49 + b], [35 - p.s, 78 + b], [44 - p.s, 72 + b]]);
        P(SB.red, 24, 16 + b, 20, 17); poly(SB.ink, [[24, 19 + b], [17, 7 + b], [28, 14 + b]]); poly(SB.ink, [[42, 19 + b], [49, 7 + b], [38, 14 + b]]);
        if (p.r) { P(SB.white, 18, 8 + b, 2, 2); P(SB.white, 47, 8 + b, 2, 2); }
        P(SB.gold2, 29, 23 + b, 3, 3); P(SB.gold2, 39, 23 + b, 3, 3);
        const sx = 53 + atk - (p.g ? 6 : 0);
        line(SB.brown, sx, 84, sx + 2, 15, 4); P(SB.gold2, sx, 12, 5, 5); P(p.a > 0 ? SB.acid : SB.purple2, 52 + atk - (p.g ? 6 : 0), 10, 7, 7);
        line(SB.red2, 19, 42 + b, 10 - atk, 53 + b, 5);
      },
      malar(o, p) {
        const { P, poly, line } = o, bob = p.b, low = p.g ? 2 : 0, atk = p.a;
        P(SB.ink, 17, 70 + low, 11, 20); P(SB.ink, 39, 68 + low, 10, 22); P(SB.black, 19, 72 + low, 8, 16); P(SB.black, 41, 70 + low, 7, 18); P(SB.ink, 15, 87 + low, 16, 5); P(SB.ink, 37, 87 + low, 16, 5);
        P(SB.ink, 15, 32 + bob + low, 35, 40); P(SB.black, 18, 35 + bob + low, 29, 34);
        poly(SB.blue, [[17, 38 + bob + low], [28, 35 + bob + low], [25 - p.s, 68 + bob + low], [14 - p.s, 63 + bob + low]]);
        P(SB.skin, 25, 17 + bob + low, 18, 16); P(SB.brown, 22, 14 + bob + low, 23, 8); P(SB.skin2, 29, 24 + bob + low, 3, 3); P(SB.skin2, 39, 24 + bob + low, 3, 3);
        line(SB.ink, 42, 50 + bob + low, 61 + atk, 46 + bob + low, 6); line(SB.steel2, 43, 49 + bob + low, 61 + atk, 45 + bob + low, 3); P(SB.gold, 41, 47 + bob + low, 5, 5);
        if (p.r) { P(SB.steel2, 34, 62 + bob + low, 5, 2); P(SB.white, 38, 61 + bob + low, 1, 1); }
      }
    };
    // Passe de détail par personnage, dessinée par-dessus le modèle de la bible : mêmes ancrages, mêmes poses.
    // Visages, barbe, casques, ceintures, bordures et accessoires qui rapprochent les sept du niveau de Langdedrosa.
    const SPRITE_DETAILS = {
      bjolnir({ P, line }, p) {
        const b = p.b, g = p.g, atk = p.a, s = p.s;
        P(SB.steel, 23, 13 + b, 23, 5); P(SB.steel2, 25, 13 + b, 13, 1); P(SB.steel2, 33, 18 + b, 2, 6);
        P(SB.ink, 28, 23 + b, 2, 2); P(SB.ink, 40, 23 + b, 2, 2);
        [27, 33, 39].forEach(x => P(SB.leather2, x + s, 38 + b, 2, 11)); P(SB.brown, 29 + s, 50 + b, 12, 3);
        P(SB.leather, 18, 63 + b, 31, 3); P(SB.gold2, 31, 63 + b, 5, 3);
        line(SB.gold, 10 - g, 40 + b, 27 - g, 40 + b, 1); line(SB.gold, 10 - g, 65 + b, 18 - g, 71 + b, 1); line(SB.gold, 27 - g, 65 + b, 18 - g, 71 + b, 1); P(SB.gold2, 17 - g, 54 + b, 3, 3);
        line(SB.leather2, 48 + atk, 42 + b, 54 + atk, 22 + b, 1); P(SB.gold, 49 + atk, 17 + b, 12, 1);
        P(SB.leather2, 22, 86, 9, 1); P(SB.leather2, 39, 86, 9, 1);
      },
      drekthar({ P, line }, p) {
        const b = p.b, g = p.g, atk = p.a, s = p.s;
        P(SB.ink, 11, 29 + b + p.r, 13, 7); P(SB.steel2, 12, 30 + b + p.r, 11, 4); P(SB.ink, 41, 29 + b + p.r, 13, 7); P(SB.steel2, 42, 30 + b + p.r, 11, 4);
        P(SB.ink, 30, 8 + b, 8, 5); P(SB.ink, 24, 18 + b, 20, 2); P(SB.gold2, 28, 21 + b, 2, 1); P(SB.gold2, 40, 21 + b, 2, 1);
        P(SB.white, 27, 28 + b, 2, 3); P(SB.white, 39, 28 + b, 2, 3);
        P(SB.red2, 14 + s, 38 + b, 2, 22); P(SB.leather, 16, 62 + b, 33, 4); P(SB.gold, 31, 62 + b, 4, 4);
        const len = 42 + atk, sx = 44 - g, sy = 51 + b + Math.max(0, atk);
        line(SB.white, sx + 1, sy - 3, sx + len * .5 - 1, sy - len + 2, 1);
      },
      ellyjobell({ P, line }, p) {
        const b = p.b, s = p.s, sx = 11 + (p.g ? 4 : 0) + s;
        P(SB.ink, 29, 26 + b, 1, 2); P(SB.ink, 39, 26 + b, 1, 2); P(SB.red2, 27, 30 + b, 2, 1); P(SB.red2, 40, 30 + b, 2, 1);
        line(SB.green2, 22, 24 + b, 29, 13 + b, 1); line(SB.green2, 29, 13 + b, 45, 24 + b, 1);
        [22, 30, 38].forEach((x, i) => P(i % 2 ? SB.green : SB.green2, x, 46 + b + i % 2, 5, 2));
        P(SB.leather2, 38, 56 + b, 6, 6); P(SB.leather, 38, 56 + b, 6, 1);
        P(SB.leather2, sx + 1, 40, 2, 2); P(SB.leather2, sx + 1, 62, 2, 2);
      },
      darrin({ P }, p) {
        const b = p.b, spread = p.g ? 2 : 7, atk = p.a;
        P(SB.ink, 30, 24 + b, 2, 2); P(SB.ink, 40, 24 + b, 2, 2); P(SB.brown, 22, 12 + b, 4, 4); P(SB.brown, 41, 11 + b, 4, 4);
        P(SB.purple2, 32, 42 + b, 2, 29); P(SB.gold, 20, 70, 26, 1); P(SB.gold, 20, 42 + b, 26, 1);
        if (Math.abs(p.s) || p.r) { P(SB.gold2, 2 - spread, 51 + b - atk, 1, 1); P(SB.ice2, 61 + spread, 44 + b + atk, 1, 1); }
      },
      sislay({ P, line }, p) {
        const b = p.b, hx = p.r ? 2 : 0;
        P(SB.ink, 44, 25 + b, 7, 20); P(SB.leather2, 45, 26 + b, 5, 18); P(SB.red2, 45, 22 + b, 1, 4); P(SB.red2, 48, 22 + b, 1, 4);
        P(SB.white, 29 + hx, 29 + b, 1, 2); P(SB.white, 39 + hx, 29 + b, 1, 2);
        line(SB.leather2, 20, 36 + b, 45, 64 + b, 2); P(SB.brown, 19, 60 + b, 28, 3); P(SB.gold, 31, 60 + b, 3, 3);
      },
      kairon({ P, line }, p) {
        const b = p.b;
        line(SB.ink, 44, 66 + b, 54, 80, 3); line(SB.red, 44, 66 + b, 53, 79, 2); P(SB.red, 52, 78, 4, 3);
        P(SB.ink, 30, 29 + b, 8, 1);
        [40, 47, 54, 61].forEach(y => { P(SB.gold, 21, y + b, 1, 1); P(SB.gold, 44, y + b, 1, 1); });
        line(SB.red2, 32, 49 + b, 32, 70 + b, 1);
      },
      malar({ P, line }, p) {
        const low = p.g ? 2 : 0, bob = p.b;
        P(SB.ink, 30, 24 + bob + low, 2, 2); P(SB.ink, 40, 24 + bob + low, 2, 2);
        line(SB.blue2, 17, 38 + bob + low, 28, 35 + bob + low, 1); line(SB.blue2, 17, 38 + bob + low, 14 - p.s, 63 + bob + low, 1);
        line(SB.leather, 20, 40 + bob + low, 46, 62 + bob + low, 2); P(SB.brown, 18, 60 + bob + low, 29, 3);
        P(SB.leather2, 19, 87 + low, 8, 1); P(SB.leather2, 41, 87 + low, 7, 1);
      }
    };

    const SPRITE_IDS = Object.keys(SPRITE_MODELS);

    // Villageois et figurants : même grille 64×96 et même trait que les protagonistes, en plus simple.
    // variant change la couleur de l'habit et la coiffe; ils respirent avec un décalage propre à chacun.
    function drawVillager(g, x, y, t, variant = 0, scale = .4) {
      const { P, poly } = spriteOps(g, x - 32 * scale, y - 93 * scale, scale), b = [0, 0, 2, 2][Math.floor((t + variant * 29) / 26) % 4];
      const cloth = [SB.leather2, SB.blue, SB.green, SB.red][variant % 4], hood = variant % 2 === 0;
      P(SB.ink, 22, 70, 9, 21); P(SB.ink, 35, 70, 9, 21); P(SB.leather, 23, 72, 7, 17); P(SB.leather, 36, 72, 7, 17); P(SB.ink, 20, 88, 13, 5); P(SB.ink, 34, 88, 13, 5);
      P(SB.ink, 17, 34 + b, 31, 40); P(cloth, 20, 37 + b, 25, 34);
      P(SB.skin, 25, 18 + b, 16, 17); P(SB.skin2, 28, 25 + b, 3, 3); P(SB.skin2, 37, 25 + b, 3, 3);
      if (hood) poly(cloth, [[22, 24 + b], [28, 13 + b], [42, 14 + b], [45, 25 + b], [41, 20 + b], [26, 20 + b]]);
      else P(SB.brown, 23, 14 + b, 20, 7);
      if (variant % 3 === 1) P(SB.white, 14, 46 + b, 7, 9);
    }

    // Images explicites d'un coup : anticipation → frappe → impact → récupération. Le facteur multiplie la portée du personnage.
    const ATTACK_FRAMES = [
      { name: 'anticipation', reach: -1.3, lean: -2, share: .32 },
      { name: 'frappe', reach: 2.2, lean: 3, share: .16 },
      { name: 'impact', reach: 2.2, lean: 3, share: .2, impact: true },
      { name: 'récupération', reach: .8, lean: 1, share: .32 }
    ];
    // progress ∈ [start, start + length] : renvoie l'image du coup, ou null hors du coup.
    function attackFrameAt(progress, start, length) {
      if (progress < start || progress >= start + length) return null;
      let local = (progress - start) / length;
      for (const frame of ATTACK_FRAMES) { if (local < frame.share) return frame; local -= frame.share; }
      return ATTACK_FRAMES[ATTACK_FRAMES.length - 1];
    }

    // Pose de repos : souffle sur deux images, mouvement secondaire décalé, une action rare toutes les 10 s environ.
    function spritePose(id, t, frame = null, guard = false) {
      const phase = SPRITE_IDS.indexOf(id) * 37, k = Math.floor((t + phase) / 24) % 4;
      const pose = { b: [0, 1, 2, 1][k], s: [0, 0, 1, 1][Math.floor((t + phase) / 41) % 4], x: [0, 1, 1, 0, 0, -1, -1, 0][Math.floor((t + phase * 3) / 70) % 8], g: guard ? SPRITE_GUARD[id] : 0, a: 0, r: ((t + phase * 5) % 620) < 44 ? 1 : 0 };
      if (frame) { pose.a = Math.round(SPRITE_REACH[id] * frame.reach); pose.r = 0; }
      return pose;
    }

    // Dessine un protagoniste. (x, y) : centre des pieds; scale : réduction du modèle 64×96 (0,5 à 1). Retourne la position approximative de l'arme.
    function drawProtagonist(g, id, x, y, options = {}) {
      const model = SPRITE_MODELS[id]; if (!model) return null;
      const { t = 0, frame = null, guard = false, scale = .7 } = options, pose = spritePose(id, t, frame, guard);
      const lean = frame ? frame.lean : pose.x * 2;
      const ops = spriteOps(g, x - 32 * scale + lean * scale, y - 93 * scale, scale);
      model(ops, pose); SPRITE_DETAILS[id]?.(ops, pose);
      return { x: x + Math.round((SPRITE_TIP[id][0] - 32 + pose.a) * scale), y: y + Math.round((SPRITE_TIP[id][1] - 93) * scale) };
    }
    // Pointe de l'arme (modèle 64×96) : sert à placer l'étincelle d'impact.
    const SPRITE_TIP = { bjolnir: [56, 18], drekthar: [66, 9], ellyjobell: [13, 12], darrin: [62, 41], sislay: [62, 58], kairon: [59, 12], malar: [62, 46] };

