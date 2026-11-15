    // ───────────────────────── Direction artistique : Verdure en flammes ─────────────────────────
    // Feu orange contre foudre bleue. Tout est déterministe : le temps est le tick du jeu, jamais le hasard.
    const VOLT = { deep: '#3f7fb5', mid: '#7fd0ff', core: '#eaf7ff' };
    // Trame clairsemée (1 pixel sur 4) dans la palette : éclaire sans créer de couleurs intermédiaires.
    function ditherRect(g, color, x, y, w, h) {
      g.fillStyle = color;
      for (let yy = y; yy < y + h; yy++) for (let xx = x + ((yy % 4 === 0 ? 0 : yy % 4 === 2 ? 2 : 4) - x % 4 + 4) % 4; xx < x + w; xx += 4) {
        if (yy % 2 === 0) g.fillRect(xx, yy, 1, 1);
      }
    }

    // Cycle de foudre : deux impulsions brèves, rarement. Renvoie 0 (rien), 1 (faible) ou 2 (fort).
    function lightningLevel(t) {
      const m = (Math.floor(t) + 330) % 540;
      return m < 3 ? 2 : m >= 6 && m < 8 ? 1 : 0;
    }

    // Flamme à cinq images. Chaque foyer a sa phase et sa cadence : jamais deux feux synchronisés.
    const FLAME_FRAMES = [
      { tip: 8, lean: 0, wide: 5 }, { tip: 11, lean: 1, wide: 4 }, { tip: 7, lean: -1, wide: 5 }, { tip: 12, lean: 0, wide: 4 }, { tip: 9, lean: 2, wide: 5 }
    ];
    function drawFlame(g, x, y, t, i, scale = 1) {
      const rate = 5 + i % 3, frame = FLAME_FRAMES[(Math.floor(t / rate) + i * 2 + (i % 2 ? 1 : 0)) % FLAME_FRAMES.length];
      const tip = Math.round(frame.tip * scale), w = Math.round(frame.wide * scale);
      const reach = w + 3;
      for (let dy = -tip - 2; dy <= 5; dy += 1) {
        const k = 1 - Math.pow((dy + tip * .35) / (tip + 3), 2); if (k <= 0) continue;
        const half = Math.round(Math.sqrt(k) * reach); ditherRect(g, ART.glow, x - half + 1, y + dy, half * 2, 1);
      }
      pixelPolygon(g, [[x - w, y + 4], [x - w + 1, y - Math.round(tip * .45)], [x - 1, y - Math.round(tip * .7)], [x + frame.lean, y - tip],
        [x + w - 1, y - Math.round(tip * .55)], [x + w + 1, y + 4]], ART.flame);
      pixelPolygon(g, [[x - 2, y + 4], [x - 1, y - Math.round(tip * .4)], [x + frame.lean, y - Math.round(tip * .62)], [x + 2, y - Math.round(tip * .3)], [x + 3, y + 4]], ART.hot);
      paint(g, ART.ember, x - w, y + 3, w * 2 + 1, 2);
    }

    const EMBER_DRIFT = [0, 1, 1, 2, 1, 0, -1, -1];
    function drawEmbers(g, x, y, t, i) {
      for (let e = 0; e < 4; e++) {
        const life = (Math.floor(t / 3) + e * 13 + i * 19) % 44;
        if (life > 40) continue;
        paint(g, life < 14 ? ART.hot : life < 28 ? ART.flame : ART.ember, x + 2 + EMBER_DRIFT[(e * 3 + Math.floor(life / 5) + i) % 8] * 2 + (e - 2) * 3, y - 6 - life, 1, 1);
      }
    }

    // Colonnes de fumée qui montent et s'étirent : lentes, décalées, de plus en plus pâles.
    function drawSmokeColumns(g, t, columns = [[148, 100, 1], [206, 110, 2], [228, 92, 3], [286, 106, 2], [182, 122, 1]]) {
      columns.forEach(([x, y, speed], c) => {
        for (let p = 0; p < 7; p++) {
          const life = (Math.floor(t * speed / 6) + p * 9 + c * 17) % 63, h = life, r = 4 + Math.floor(life / 8);
          pixelDisc(g, x + [0, 1, 2, 3, 2, 1][(p + c + Math.floor(life / 10)) % 6] * 2 + Math.floor(life / 5) - p, y - h, r, life < 30 ? ART.smoke : ART.smokeLight);
        }
      });
    }

    // Lennithon : silhouette lisible dès la miniature. Ailes en six images, tête qui oscille, queue qui suit.
    const WING_BEAT = [-18, -10, 0, 12, 19, 8];
    function drawLennithon(g, t, flash) {
      const sway = [0, 1, 2, 3, 3, 2, 1, 0, -1, -2, -3, -3, -2, -1], step = Math.floor(t / 7), w = WING_BEAT[step % 6];
      const cx = 226 + sway[Math.floor(t / 11) % 14] * 3, cy = 70 + sway[(Math.floor(t / 13) + 4) % 14];
      const P = flash ? { body: VOLT.deep, mid: VOLT.mid, light: VOLT.core, far: ART.blueDark, bone: VOLT.mid }
        : { body: ART.blueDark, mid: ART.blue, light: ART.blueLight, far: ART.shadow, bone: ART.blue };
      const poly = (pts, color) => pixelPolygon(g, pts.map(([x, y]) => [cx + x, cy + y]), color);
      const line = (x1, y1, x2, y2, color) => pixelLine(g, cx + x1, cy + y1, cx + x2, cy + y2, color);
      // aile éloignée : plus petite, dans l'ombre
      poly([[-2, -7], [-14, -22 - w * .3], [-34, -20 + w * .6], [-46, -8 + w], [-36, -4 + w * .8], [-40, 5 + w * .6], [-26, 2 + w * .4], [-22, 9], [-6, 3]], P.far);
      line(-2, -7, -14, -22 - w * .3, P.body); line(-14, -22 - w * .3, -46, -8 + w, P.body);
      // queue en trois segments qui suivent le battement
      const sw = [0, 2, 3, 2, 0, -2][(step + 3) % 6];
      poly([[-15, 1], [-16, 8], [-30, 12 + sw], [-30, 7 + sw]], P.body);
      poly([[-30, 7 + sw], [-30, 12 + sw], [-44, 15 + sw * 2], [-44, 11 + sw * 2]], P.body);
      poly([[-44, 11 + sw * 2], [-44, 15 + sw * 2], [-56, 12 + sw * 3], [-50, 10 + sw * 2]], P.body);
      poly([[-56, 10 + sw * 3], [-60, 14 + sw * 3], [-55, 14 + sw * 3], [-52, 12 + sw * 3]], P.mid);
      // pattes arrière repliées
      poly([[-6, 8], [-11, 16], [-5, 15], [-2, 10]], P.body); poly([[2, 9], [0, 17], [5, 15], [6, 10]], P.body);
      // torse, ventre clair
      poly([[-17, 0], [-12, -7], [-2, -9], [10, -8], [19, -4], [21, 2], [13, 8], [0, 11], [-11, 8]], P.mid);
      poly([[-12, 4], [0, 8], [12, 5], [8, 9], [0, 11], [-9, 8]], P.light);
      poly([[-12, -7], [-2, -9], [10, -8], [12, -5], [-2, -6], [-10, -3]], P.body);
      // cou et tête
      poly([[11, -7], [17, -17], [24, -24], [30, -22], [26, -14], [22, -4]], P.mid);
      poly([[18, -16], [24, -24], [28, -22], [22, -13]], P.body);
      poly([[25, -25], [36, -26], [44, -22], [42, -18], [33, -17], [28, -15]], P.mid);
      poly([[30, -17], [42, -18], [39, -14], [30, -13]], P.body);
      poly([[36, -26], [44, -22], [42, -21], [35, -23]], P.light);
      line(27, -25, 21, -33, P.light); line(28, -25, 22, -33, P.mid); line(31, -26, 27, -34, P.light); line(32, -26, 28, -34, P.mid);
      paint(g, VOLT.core, cx + 37, cy - 23, 2, 1); paint(g, VOLT.mid, cx + 36, cy - 22, 1, 1);
      if (Math.floor(t / 9) % 5 === 2) paint(g, VOLT.mid, cx + 43, cy - 18, 3, 1);
      // aile proche : os, doigts, membrane festonnée, bord éclairé
      const S = [2, -8], E = [16, -22 - w * .35], Wr = [34, -28 + w * .55], T = [64, -14 + w], F1 = [58, 2 + w * .9], F2 = [46, 11 + w * .75], F3 = [30, 12 + w * .45];
      poly([S, E, Wr, T, [55, -3 + w * .85], F1, [50, 7 + w * .75], F2, [38, 9 + w * .5], F3, [22, 7], [8, 2]], P.body);
      poly([Wr, T, [55, -3 + w * .85], [42, -8 + w * .4]], P.mid);
      [[Wr, F1], [Wr, F2], [Wr, F3]].forEach(([a, b]) => line(a[0], a[1], b[0], b[1], P.bone));
      line(S[0], S[1], E[0], E[1], P.light); line(E[0], E[1], Wr[0], Wr[1], P.light); line(Wr[0], Wr[1], T[0], T[1], P.light);
      paint(g, P.light, cx + T[0], cy + Math.round(T[1]), 2, 2);
      return { x: cx + 44, y: cy - 19 };
    }

    // Éclair déterministe : zigzag fixe partant de la gueule.
    function drawBolt(g, from, level) {
      const zig = [[0, 0], [-5, 9], [3, 17], [-4, 27], [4, 36], [-2, 46], [3, 56]];
      for (let i = 1; i < zig.length; i++) {
        pixelLine(g, from.x + zig[i - 1][0] - 1, from.y + zig[i - 1][1], from.x + zig[i][0] - 1, from.y + zig[i][1], VOLT.deep);
        pixelLine(g, from.x + zig[i - 1][0], from.y + zig[i - 1][1], from.x + zig[i][0], from.y + zig[i][1], level > 1 ? VOLT.core : VOLT.mid);
      }
      paint(g, VOLT.core, from.x + 2, from.y + 56, 3, 2);
    }

    // Lumière de foudre sur toute la scène : le même décor redessiné dans des couleurs bleutées, les feux gardent leur orange.
    function tintToward(hex, amount, target = [150, 205, 255]) {
      const channel = index => parseInt(hex.slice(1 + index * 2, 3 + index * 2), 16);
      return '#' + [0, 1, 2].map(i => Math.min(255, Math.round(channel(i) * (1 - amount) + target[i] * amount + 6)).toString(16).padStart(2, '0')).join('');
    }
    function getLitScene(key, level) {
      const id = `${key}:lit${level}`;
      if (!uiState.art[id]) {
        const saved = { ...ART };
        Object.keys(ART).forEach(name => { if (!['flame', 'hot', 'ember', 'glow', 'window'].includes(name)) ART[name] = tintToward(saved[name], level > 1 ? .5 : .28); });
        try { uiState.art[id] = getSceneArt(key, true); } finally { Object.assign(ART, saved); }
      }
      return uiState.art[id];
    }

    const REFUGEE_SHAPES = [[0, 8, 5, 2], [1, 6, 4, 0], [0, 7, 3, 1]];
    // Premier plan : silhouettes d'une charrette brisée, de réfugiés et de pillards à la torche (cache).
    function drawVerdureForeground(g) {
      pixelPolygon(g, [[4, 200], [8, 186], [30, 182], [56, 186], [64, 200]], ART.shadow);
      paint(g, ART.shadow, 14, 176, 40, 8); pixelLine(g, 14, 176, 4, 168, ART.shadow); pixelLine(g, 54, 176, 66, 166, ART.shadow);
      pixelDisc(g, 20, 190, 7, ART.shadow); pixelDisc(g, 44, 192, 7, ART.shadow); paint(g, ART.stoneDark, 19, 189, 3, 3);
      pixelPolygon(g, [[18, 176], [24, 168], [38, 166], [50, 172], [52, 176]], ART.shadow);
      [[78, 188], [88, 192], [98, 187]].forEach(([x, y], i) => {
        paint(g, ART.shadow, x, y - 14, 6, 14); pixelDisc(g, x + 3, y - 17, 3, ART.shadow);
        if (i === 1) { paint(g, ART.shadow, x - 4, y - 10, 5, 8); }
      });
      [[286, 196], [302, 198]].forEach(([x, y]) => {
        paint(g, ART.shadow, x, y - 22, 7, 22); pixelDisc(g, x + 3, y - 26, 4, ART.shadow);
        pixelLine(g, x + 7, y - 18, x + 13, y - 30, ART.shadow);
      });
    }

    // Couche animée de Verdure : fumée, foyers, braises, dragon, foudre, torches.
    function drawVerdureLife(g, t) {
      const flash = lightningLevel(t);
      drawSmokeColumns(g, t);
      [[141, 102], [203, 115], [224, 95], [294, 111], [180, 125], [166, 108], [262, 128]].forEach(([x, y], i) => { drawFlame(g, x, y, t, i); drawEmbers(g, x, y, t, i); });
      const mouth = drawLennithon(g, t, flash);
      if (flash) drawBolt(g, mouth, flash);
      [[299, 170], [315, 168]].forEach(([x, y], i) => drawFlame(g, x, y, t + i * 9, i + 2, .6));
      pixelLine(g, 299, 172, 299, 178, ART.shadow);
    }

