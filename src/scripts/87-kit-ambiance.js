    // ───────────────────────── Kit d'ambiance réutilisable ─────────────────────────
    // Chaque élément est une petite fonction déterministe (le temps vient du tick, jamais du hasard) réutilisée par plusieurs décors.
    // SCENE_LIFE dit, décor par décor, quels éléments placer et où : aucun code ni image propres à une scène.
    const SINE16 = [0, 1, 2, 3, 3, 3, 2, 1, 0, -1, -2, -3, -3, -3, -2, -1];
    const LIFE = {
      fire(g, t, i, x, y, scale = 1) { drawFlame(g, x, y, t, i, scale); drawEmbers(g, x, y, t, i); },
      torch(g, t, i, x, y) { drawFlame(g, x, y, t + i * 11, i + 3, .55); },
      smoke(g, t, i, x, y, speed = 1) { drawSmokeColumns(g, t + i * 40, [[x, y, speed]]); },
      // Bandes de brume qui dérivent à des vitesses différentes (trame clairsemée, comme les halos).
      fog(g, t, i, y, h, speed = 1, color = 'fog') {
        for (let band = 0; band < h; band += 6) for (let seg = 0; seg < 4; seg++) {
          const len = 40 + ((seg * 17 + band * 7) % 40), x = ((seg * 101 + band * 31 + Math.floor(t * speed / 9)) % (360 + len)) - len;
          ditherRect(g, ART[color], x, y + band, len, 4);
        }
      },
      snow(g, t, i, count = 40, speed = 1) {
        for (let k = 0; k < count; k++) {
          const x = (k * 53 + Math.floor(t / 11) * (1 + k % 2) + SINE16[(Math.floor(t / 9) + k) % 16]) % 320, y = (k * 37 + Math.floor(t * speed / 3) * (1 + k % 3)) % 200;
          paint(g, k % 5 ? ART.blueLight : ART.moon, x, y, 1, 1);
        }
      },
      drips(g, t, i, x, y0, y1, period = 150) {
        const p = (Math.floor(t / 2) + i * 41) % period, fall = Math.floor((y1 - y0) / 3);
        if (p < fall) paint(g, ART.blueLight, x, y0 + p * 3, 1, 2);
        else if (p < fall + 5) { const r = p - fall; paint(g, ART.waterLight, x - r, y1, 1, 1); paint(g, ART.waterLight, x + r, y1, 1, 1); }
      },
      ripples(g, t, i, x, y, spread = 12) {
        [0, 6].forEach(offset => {
          const r = (Math.floor(t / 7) + i * 5 + offset) % 12, w = Math.max(1, Math.round(r * spread / 12));
          if (r < 11) { paint(g, ART.waterLight, x - w, y, 2, 1); paint(g, ART.waterLight, x + w - 1, y, 2, 1); if (r > 3) paint(g, ART.blueLight, x - 1, y + 1, 3, 1); }
        });
      },
      birds(g, t, i, y, period = 900, direction = 1) {
        const run = (Math.floor(t / 2) + i * 211) % period, x = direction > 0 ? run * 3 - 30 : 350 - run * 3;
        if (x < -20 || x > 340) return;
        const wing = Math.floor(t / 6) % 2, by = y + SINE16[Math.floor(run / 5) % 16] + (i % 2);
        pixelLine(g, x - 3, by + (wing ? 0 : 2), x, by + 1, ART.shadow); pixelLine(g, x, by + 1, x + 3, by + (wing ? 0 : 2), ART.shadow);
      },
      pennant(g, t, i, x, y, length = 8, color = 'cloak') {
        for (let k = 0; k < length; k++) paint(g, ART[color], x + k, y + [0, 0, 1, 1, 0, -1, -1, 0][(k + Math.floor(t / 5) + i * 3) % 8], 1, Math.max(1, 3 - Math.floor(k / 3)));
      },
      // Étoiles qui scintillent : on repeint le ciel sur quelques-unes, une à la fois.
      stars(g, t, i, list) { list.forEach(([x, y], k) => { if ((Math.floor(t / 24) + k * 5) % 7 === 0) paint(g, ART.night, x, y, 1, 1); }); },
      clouds(g, t, i, y, count = 3, speed = 1, color = 'haze') {
        for (let k = 0; k < count; k++) {
          const x = ((k * 131 + Math.floor(t * speed / 14)) % 420) - 50, cy = y + (k % 2) * 7 - k * 3;
          pixelDisc(g, x, cy, 7, ART[color]); pixelDisc(g, x + 9, cy + 1, 9, ART[color]); pixelDisc(g, x + 20, cy + 2, 6, ART[color]); paint(g, ART[color], x - 5, cy + 2, 30, 5);
        }
      },
      // Lueur de fenêtre ou de braise : la trame change de teinte par à-coups, sans changer la forme.
      glow(g, t, i, x, y, w, h, color = 'window') { ditherRect(g, (Math.floor(t / 8) + i * 5) % 9 < 2 ? ART.hot : ART[color], x, y, w, h); },
      fireflies(g, t, i, cx, cy, rx, ry, count = 3) {
        for (let k = 0; k < count; k++) {
          const a = SINE16[(Math.floor(t / 6) + k * 5 + i * 3) % 16], b = SINE16[(Math.floor(t / 7) + k * 7 + 4) % 16];
          if ((Math.floor(t / 14) + k * 3 + i) % 6 < 4) { paint(g, ART.hot, cx + Math.round(a * rx / 3) + k * 9, cy + Math.round(b * ry / 3) - k * 4, 1, 1); paint(g, ART.flame, cx + Math.round(a * rx / 3) + k * 9 + 1, cy + Math.round(b * ry / 3) - k * 4, 1, 1); }
        }
      },
      motes(g, t, i, x, y, w, h, count = 10) {
        for (let k = 0; k < count; k++) paint(g, ART.accent, x + (k * 37 + Math.floor(t / 22) + SINE16[(k + Math.floor(t / 40)) % 16]) % w, y + (k * 23 + Math.floor(t / 38) * (k % 2 ? 1 : 2)) % h, 1, 1);
      },
      leaves(g, t, i, count = 10) {
        for (let k = 0; k < count; k++) {
          const x = (k * 61 + SINE16[(Math.floor(t / 8) + k * 3) % 16] * 2 + Math.floor(t / 16)) % 320, y = (k * 41 + Math.floor(t / 4)) % 200;
          paint(g, k % 3 ? ART.grassLight : ART.roofLight, x, y, 2, 1);
        }
      },
      pulse(g, t, i, x, y, rx, ry) {
        const r = (Math.floor(t / 6) + i * 8) % 16, f = r / 15, w = Math.round(rx * f), h = Math.max(1, Math.round(ry * f));
        const color = r < 6 ? VOLT.core : r < 11 ? VOLT.mid : VOLT.deep;
        for (let a = 0; a < 16; a++) { const px = Math.round(Math.sin(a / 16 * Math.PI * 2) * w), py = Math.round(Math.cos(a / 16 * Math.PI * 2) * h); paint(g, color, x + px, y + py, 1, 1); }
      },
      glint(g, t, i, x, y, period = 80) {
        const p = (Math.floor(t / 3) + i * 29) % period;
        if (p < 4) { paint(g, VOLT.core, x, y, 1, 1); if (p > 0 && p < 3) { paint(g, VOLT.core, x - 1, y, 3, 1); paint(g, VOLT.core, x, y - 1, 1, 3); } }
      },
      bats(g, t, i, y, period = 1200) {
        const run = (Math.floor(t / 2) + i * 307) % period, x = 340 - run * 2;
        if (x < -10 || x > 340) return;
        const by = y + SINE16[(Math.floor(run / 3)) % 16] * 2, wing = Math.floor(t / 4) % 2;
        paint(g, ART.shadow, x, by, 3, 1); paint(g, ART.shadow, x - 2, by - (wing ? 2 : 0), 2, 1); paint(g, ART.shadow, x + 3, by - (wing ? 2 : 0), 2, 1);
      },
      // Vaguelettes : tirets de lumière qui glissent à vitesses différentes selon la rangée.
      waves(g, t, i, y0, y1, color = 'waterLight') {
        for (let row = y0, n = 0; row < y1; row += 5, n++) {
          const len = 6 + (n * 5) % 9, x = ((n * 67 + Math.floor(t * (1 + n % 3) / 18)) % 360) - 20;
          paint(g, ART[color], x, row, len, 1);
        }
      },
      dust(g, t, i, x, y) {
        for (let k = 0; k < 5; k++) { const life = (Math.floor(t / 4) + k * 6 + i * 9) % 30; paint(g, ART.pathLight, x - life + k, y - Math.floor(life / 5), 1 + (life < 10 ? 1 : 0), 1); }
      }
    };

    // Éléments par décor. (x, y) dans le repère 320×200 du décor.
    const SCENE_LIFE = {
      cult_camp: [['fire', 197, 156, .9], ['smoke', 197, 150, 1], ['pennant', 183, 106, 9, 'roofLight'], ['pennant', 256, 84, 9, 'cloak'], ['pennant', 131, 127, 7, 'accent'], ['pennant', 298, 122, 7, 'roofLight'],
        ['stars', [[40, 18], [74, 27], [131, 13], [193, 24], [245, 16], [306, 29]]], ['birds', 36, 1000, 1], ['fog', 160, 12, 2]],
      hatchery: [['torch', 178, 106], ['drips', 150, 70, 150, 160], ['drips', 232, 60, 146, 210], ['ripples', 226, 146, 12], ['fog', 164, 14, 1], ['bats', 40, 1300]],
      caravan: [['clouds', 34, 3, 2], ['dust', 150, 176], ['dust', 206, 174], ['birds', 48, 1100, 1], ['birds', 70, 1500, -1]],
      carnath: [['glow', 204, 66, 26, 22], ['motes', 20, 60, 280, 110, 10], ['fog', 168, 14, 1]],
      marsh: [['fog', 132, 22, 1], ['fog', 166, 18, 2], ['fireflies', 60, 150, 40, 20, 3], ['fireflies', 240, 140, 40, 20, 3], ['ripples', 120, 176, 10], ['ripples', 210, 186, 12], ['birds', 50, 1400, 1]],
      portal: [['torch', 152, 114], ['torch', 279, 114], ['pulse', 232, 147, 40, 12], ['pulse', 232, 147, 40, 12], ['motes', 120, 60, 160, 100, 8]],
      lodge: [['snow', 0, 46, 1], ['glow', 170, 118, 12, 10], ['glow', 229, 118, 12, 10], ['glow', 265, 118, 12, 10], ['smoke', 268, 52, .6], ['stars', [[40, 18], [74, 27], [131, 13], [193, 24], [245, 16], [306, 29]]]],
      skyreach: [['clouds', 150, 4, 3, 'waterLight'], ['pennant', 226, 24, 8, 'cloak'], ['glint', 214, 70, 90], ['glint', 262, 66, 130], ['birds', 40, 1500, 1]],
      ice_cave: [['snow', 0, 24, .5], ['glint', 96, 138, 70], ['glint', 232, 150, 110], ['glint', 288, 124, 90], ['fog', 168, 14, 1, 'blueLight']],
      council: [['motes', 60, 60, 200, 90, 14], ['glow', 132, 48, 16, 34, 'blueLight'], ['glow', 182, 48, 16, 34, 'blueLight'], ['glow', 232, 48, 16, 34, 'blueLight']],
      tomb: [['fog', 150, 22, 1], ['motes', 60, 80, 200, 90, 10], ['birds', 40, 1700, -1], ['clouds', 30, 2, 1]],
      ice_sea: [['waves', 100, 190], ['snow', 0, 30, .6], ['glint', 240, 80, 60], ['glint', 262, 96, 90], ['birds', 40, 1200, 1], ['clouds', 26, 3, 1]],
      dragon_audience: [['motes', 70, 60, 180, 110, 16], ['glow', 105, 46, 18, 40, 'blueLight'], ['glow', 150, 46, 18, 40, 'blueLight'], ['glow', 200, 46, 18, 40, 'blueLight'], ['glint', 150, 120, 100], ['glint', 214, 126, 140]],
      forest: [['leaves', 14], ['fireflies', 70, 150, 40, 20, 4], ['fireflies', 250, 160, 30, 20, 3], ['motes', 40, 40, 240, 120, 12], ['fog', 150, 24, 1]],
      street: [['smoke', 31, 92, 1], ['smoke', 284, 92, 1], ['smoke', 66, 110, 1]],
      tunnel: [['drips', 100, 40, 150, 130], ['motes', 60, 60, 200, 100, 8]],
      temple: [['smoke', 283, 140, 1]],
      mill: [['ripples', 240, 172, 12], ['ripples', 286, 184, 14]],
      keep: [['stars', [[40, 18], [74, 27], [131, 13], [193, 24], [245, 16], [306, 29]]], ['clouds', 40, 3, 2, 'haze'], ['pennant', 190, 76, 8, 'cloak'], ['pennant', 274, 76, 8, 'cloak'], ['birds', 46, 1300, 1]],
      wall: [['stars', [[40, 18], [74, 27], [131, 13], [193, 24], [245, 16], [306, 29]]], ['clouds', 40, 3, 2, 'haze'], ['pennant', 190, 76, 8, 'cloak'], ['pennant', 274, 76, 8, 'cloak']]
    };

    function drawSceneLife(g, key, t) {
      (SCENE_LIFE[key] ?? []).forEach(([type, ...args], i) => LIFE[type]?.(g, t, i, ...args));
    }

    // Compagnie à l'écran : les sprites des protagonistes présents, en petit au premier plan, avec leur souffle et leur report de poids.
    // Un blessé se tient en garde, plus bas; un compagnon à terre est couché. Même code et mêmes modèles que les duels.
    const PARTY_SCALE = .36;
    // En petit, la compagnie prend les couleurs du décor : chaque teinte de sprite devient la teinte de ART la plus proche.
    let partyPalette = null;
    function getPartyPalette() {
      if (partyPalette) return partyPalette;
      const rgb = hex => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16)), artColors = Object.values(ART);
      partyPalette = Object.fromEntries(Object.entries(SB).map(([name, hex]) => {
        const [r, g, b] = rgb(hex); let best = artColors[0], bestDistance = Infinity;
        artColors.forEach(candidate => { const [cr, cg, cb] = rgb(candidate), d = (r - cr) ** 2 + (g - cg) ** 2 + (b - cb) ** 2; if (d < bestDistance) { bestDistance = d; best = candidate; } });
        return [name, best];
      }));
      return partyPalette;
    }
    function drawPartyPresence(g, t) {
      const original = { ...SB };
      try { Object.assign(SB, getPartyPalette()); drawPartyRow(g, t); } finally { Object.assign(SB, original); }
    }
    function drawPartyRow(g, t) {
      const present = Object.entries(characters).filter(([id, c]) => SPRITE_MODELS[id] && ['active', 'injured', 'down'].includes(c.state));
      present.forEach(([id, c], i) => {
        const x = 20 + i * 21, y = 197;
        paint(g, ART.shadow, x - 6, y - 1, 13, 2);
        if (c.state === 'down') { paint(g, ART.shadow, x - 7, y - 5, 14, 5); paint(g, ART.armor, x - 6, y - 4, 10, 3); paint(g, ART.pathLight, x + 4, y - 5, 3, 3); return; }
        drawProtagonist(g, id, x, y + (c.state === 'injured' ? 1 : 0), { t, guard: c.state === 'injured', scale: PARTY_SCALE });
      });
    }

