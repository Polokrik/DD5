    // Palette de Langdedrosa : violet, or et bleu d'écailles, avec un contour noir sélectif sur la silhouette extérieure.
    const LD = { k: '#0c0c0c', p0: '#2e0c40', p1: '#4c155f', p2: '#762c7c', p3: '#92457f', p4: '#bf6784', b1: '#4b4f7e', b2: '#606493', b3: '#7590a4',
      g1: '#cf9478', g2: '#dbd3a2', t: '#9ebeb2', steel: '#9aa3b4' };

    // Ruban d'épaisseur variable le long d'une courbe (queue) : renvoie une liste de polygones.
    function ribbonShapes(points, widths, color) {
      const shapes = [];
      for (let i = 0; i < points.length - 1; i++) {
        const [ax, ay] = points[i], [bx, by] = points[i + 1], dx = bx - ax, dy = by - ay, len = Math.hypot(dx, dy) || 1, nx = -dy / len, ny = dx / len;
        shapes.push({ pts: [[ax + nx * widths[i], ay + ny * widths[i]], [bx + nx * widths[i + 1], by + ny * widths[i + 1]], [bx - nx * widths[i + 1], by - ny * widths[i + 1]], [ax - nx * widths[i], ay - ny * widths[i]]], color });
      }
      return shapes;
    }

    // Dessine une liste de formes : d'abord le contour (silhouette extérieure), puis les aplats par-dessus.
    // « lift » allonge les jambes : tout point au-dessus des pieds monte de lift pixels, les jambières s'étirent.
    function drawShapeSet(g, ox, oy, scale, rawShapes, outline = LD.k, lift = 0) {
      const raise = py => py < -6 ? py - lift : py;
      const shapes = !lift ? rawShapes : rawShapes.map(shape => shape.pts ? { ...shape, pts: shape.pts.map(([px, py]) => [px, raise(py)]) }
        : { ...shape, line: [shape.line[0], raise(shape.line[1]), shape.line[2], raise(shape.line[3])] });
      const offsets = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [1, 1], [-1, 1], [1, -1]];
      shapes.forEach(shape => { if (shape.pts && !shape.noOutline) offsets.forEach(([dx, dy]) => polyAt(g, ox + dx, oy + dy, scale, false, shape.pts, outline)); });
      shapes.forEach(shape => {
        if (shape.pts) polyAt(g, ox, oy, scale, false, shape.pts, shape.color);
        else if (shape.line) lineAt(g, ox, oy, scale, false, ...shape.line, shape.color);
      });
    }

    // Langdedrosa Cyanwrath, demi-dragon bleu. Regarde vers la gauche. Origine : centre des pieds.
    function drawLangdedrosa(g, x, y, t, strike = 0, scale = 1) {
      const breath = [0, 0, -1, -1][Math.floor(t / 22) % 4], bladeSway = [0, -1, -2, -1, 0, 1][Math.floor(t / 38) % 6], flap = Math.floor(t / 15) % 3, wag = [0, 1, 2, 1, 0, -1][Math.floor(t / 26) % 6];
      const lunge = -Math.round(strike * 14 * scale), thrust = Math.round(strike * 9);
      const up = breath, S = [];
      // queue épineuse qui ondule, avec pointes sur l'extérieur
      const tail = [[10, -28], [22, -18 + wag], [36, -14 + wag], [46, -22 + wag * 1.5], [50, -36 + wag * 2], [46, -48 + wag * 2], [40, -53 + wag * 2]];
      S.push(...ribbonShapes(tail, [6, 6, 5, 4.5, 3.5, 2.5, 1], LD.b1));
      [[22, -25 + wag], [34, -20 + wag], [44, -30 + wag], [47, -42 + wag * 2], [42, -51 + wag * 2]].forEach(([px, py], i) => S.push({ pts: [[px - 2, py + 1], [px + (i > 1 ? 4 : 1), py - 5], [px + 2, py + 2]], color: LD.b3 }));
      // lance : hampe violette en diagonale, pointe haute dorée, lame en croissant côté adversaire
      const bx = -36 - thrust, by = -17;
      S.push({ line: [26, -76, bx + 4, by], color: LD.p1 }, { line: [27, -76, bx + 5, by], color: LD.p1 }, { line: [25, -77, bx + 3, by - 1], color: LD.p3 });
      S.push({ pts: [[26, -82], [30, -76], [26, -73], [24, -78]], color: LD.g2 });
      S.push({ pts: [[bx + 6, by - 3 + bladeSway], [bx - 3, by - 8 + bladeSway], [bx - 10, by - 2 + bladeSway], [bx - 6, by + 2 + bladeSway], [bx - 1, by - 1 + bladeSway]], color: LD.steel }, { line: [bx + 5, by - 3 + bladeSway, bx - 9, by - 2 + bladeSway], color: LD.g2 });
      // pans de cape violette derrière
      S.push({ pts: [[6, -40 + up], [16, -38 + up], [23 + flap, -11], [13, -8 - flap]], color: LD.p1 });
      // jambes écaillées, jambières violettes cerclées d'or, pieds griffus
      S.push({ pts: [[2, -34], [12, -34], [14, -18], [10, -8], [3, -8]], color: LD.b1 }, { pts: [[2, -15], [12, -15], [13, -5], [1, -5]], color: LD.p1 }, { line: [2, -15, 12, -15], color: LD.g1 }, { pts: [[0, 0], [1, -5], [14, -5], [18, 0]], color: LD.b1 });
      S.push({ pts: [[-14, -34], [-3, -34], [-1, -18], [-5, -8], [-13, -8], [-16, -20]], color: LD.b2 }, { pts: [[-15, -15], [-4, -15], [-3, -5], [-16, -5]], color: LD.p2 }, { line: [-15, -15, -4, -15], color: LD.g1 }, { line: [-15, -13, -4, -13], color: LD.g2 });
      S.push({ pts: [[-20, 0], [-16, -5], [-2, -5], [1, 0]], color: LD.b2 });
      // tablier de tissu violet et or
      S.push({ pts: [[-12, -38], [4, -38], [6, -12 + flap % 2], [0, -7 - flap % 2], [-8, -8], [-13, -12]], color: LD.p2 }, { pts: [[-5, -31], [-1, -26], [-5, -21], [-9, -26]], color: LD.p3 }, { line: [-13, -12, 6, -12], color: LD.g1 });
      // plastron d'écailles dorées entre deux flancs violets, col clair
      S.push({ pts: [[-17, -56 + up], [-12, -58 + up], [-13, -40], [-17, -42]], color: LD.p2 }, { pts: [[6, -58 + up], [11, -56 + up], [10, -42], [8, -40]], color: LD.p2 });
      S.push({ pts: [[-12, -58 + up], [6, -58 + up], [8, -40], [-13, -40]], color: LD.g1 });
      [[-8, -52], [-3, -52], [2, -52], [-10, -47], [-5, -47], [0, -47], [5, -47], [-8, -42], [-3, -42], [2, -42]].forEach(([px, py]) => S.push({ pts: [[px, py + up * (py < -44)], [px + 2, py + up * (py < -44)], [px + 2, py + 2 + up * (py < -44)], [px, py + 2 + up * (py < -44)]], color: LD.g2, noOutline: true }));
      S.push({ pts: [[-6, -61 + up], [2, -61 + up], [2, -56 + up], [-6, -56 + up]], color: LD.t });
      // épaulière arrière à pointes (violet bordé d'or), épaulière avant plus petite
      S.push({ pts: [[4, -60 + up], [8, -71 + up], [12, -64 + up], [17, -73 + up], [21, -64 + up], [26, -69 + up], [26, -58 + up], [22, -50 + up], [12, -48 + up], [6, -52 + up]], color: LD.p2 });
      S.push({ line: [4, -60 + up, 8, -71 + up], color: LD.g1 }, { line: [8, -71 + up, 12, -64 + up], color: LD.g1 }, { line: [12, -64 + up, 17, -73 + up], color: LD.g1 }, { line: [17, -73 + up, 21, -64 + up], color: LD.g1 }, { line: [21, -64 + up, 26, -69 + up], color: LD.g1 });
      S.push({ pts: [[10, -56 + up], [20, -58 + up], [22, -52 + up], [12, -50 + up]], color: LD.p3, noOutline: true });
      S.push({ pts: [[-23, -58 + up], [-20, -68 + up], [-15, -62 + up], [-11, -69 + up], [-6, -60 + up], [-7, -52 + up], [-14, -47 + up], [-22, -50 + up]], color: LD.p3 });
      S.push({ line: [-23, -58 + up, -20, -68 + up], color: LD.g1 }, { line: [-20, -68 + up, -15, -62 + up], color: LD.g1 }, { line: [-15, -62 + up, -11, -69 + up], color: LD.g1 }, { line: [-11, -69 + up, -6, -60 + up], color: LD.g1 });
      // bras avant : écailles bleues, brassard violet et or, poing refermé sur la hampe
      S.push({ pts: [[-23, -52 + up], [-17, -52 + up], [-14, -42], [-20, -37], [-25, -41]], color: LD.b2 }, { pts: [[-25, -41], [-20, -37], [-21, -32], [-28, -31], [-30, -36]], color: LD.b1 });
      S.push({ pts: [[-26, -42], [-18, -39], [-19, -36], [-27, -38]], color: LD.p2 }, { line: [-26, -42, -18, -39], color: LD.g1 });
      S.push({ pts: [[-32, -37], [-25, -37], [-25, -30], [-32, -30]], color: LD.b2 });
      S.push({ pts: [[-12, -48 + up], [-6, -48 + up], [-6, -42 + up], [-12, -42 + up]], color: LD.b2 });
      // cou et tête de dragon (plus petite, sur un cou visible) : crête, corne dorée, mâchoire dentée, œil clair
      const H = pts => pts.map(([px, py]) => [Math.round((px + 8) * .74) - 8, Math.round((py + 70) * .74) - 75 + up]);
      S.push({ pts: [[-9, -60 + up], [1, -60 + up], [1, -69 + up], [-9, -69 + up]], color: LD.t });
      S.push({ pts: H([[-12, -78], [-19, -90], [-15, -88], [-7, -78]]), color: LD.g2 }, { pts: H([[-6, -78], [-9, -85], [-4, -79]]), color: LD.g1 });
      S.push({ pts: H([[-19, -73], [-11, -78], [-2, -77], [2, -71], [0, -65], [-8, -63], [-16, -65]]), color: LD.b2 });
      S.push({ pts: H([[-19, -73], [-28, -71], [-29, -67], [-21, -65], [-16, -65]]), color: LD.b2 });
      S.push({ pts: H([[-28, -67], [-19, -63], [-8, -63], [-11, -66], [-21, -66]]), color: LD.b1 });
      S.push({ pts: H([[0, -77], [4, -83], [5, -75]]), color: LD.b3 }, { pts: H([[2, -72], [9, -76], [7, -68]]), color: LD.b3 });
      S.push({ pts: H([[-15, -73], [-12, -73], [-12, -70], [-15, -70]]), color: LD.g2, noOutline: true });
      drawShapeSet(g, x + lunge, y, scale, S, LD.k, 13);
      // rare étincelle de foudre à la pointe de la lame
      if (Math.floor(t / 130) % 3 === 1 && Math.floor(t / 4) % 8 < 3) {
        const sx = x + lunge + Math.round((bx - 9) * scale), sy = y + Math.round((by + bladeSway - 3 - 13) * scale);
        paint(g, VOLT.core, sx, sy, 1, 2); paint(g, VOLT.mid, sx + 1, sy + 2, 2, 1); paint(g, VOLT.core, sx - 1, sy + 3, 1, 2);
      }
    }

    // Berserker du Culte : torse nu, casque à cornes, hache lourde. Souffle et arme décalés par la position.
    function drawBerserker(g, x, y, t, fallen = false, facing = 1) {
      if (fallen) { paint(g, ART.roofLight, x - 10, y - 6, 20, 6); paint(g, ART.pathLight, x + 10 * facing, y - 7, 6, 6); pixelLine(g, x - 14, y - 1, x - 24, y - 2, ART.stoneLight); return; }
      const breath = [0, -1][Math.floor((t + x) / 24) % 2], sway = [0, -2, -1][Math.floor((t + x) / 31) % 3], f = facing, by = y + breath;
      const poly = pts => pts.map(([px, py]) => [x + px * f, by + py]);
      pixelPolygon(g, poly([[-5, 0], [-5, -13], [-1, -13], [-1, 0]]), ART.timber); pixelPolygon(g, poly([[1, 0], [1, -13], [5, -13], [5, 0]]), ART.timber);
      pixelPolygon(g, poly([[-7, -13], [-8, -27], [-4, -31], [4, -31], [8, -27], [7, -13]]), ART.roofLight);
      pixelPolygon(g, poly([[-7, -13], [7, -13], [7, -16], [-7, -16]]), ART.bark);
      pixelPolygon(g, poly([[-4, -41], [4, -41], [5, -33], [-5, -33]]), ART.pathLight); pixelPolygon(g, poly([[-5, -41], [5, -41], [6, -37], [-6, -37]]), ART.stoneDark);
      pixelLine(g, x - 6 * f, by - 40, x - 9 * f, by - 47, ART.stoneLight); pixelLine(g, x + 6 * f, by - 40, x + 9 * f, by - 47, ART.stoneLight);
      pixelLine(g, x + 4 * f, by - 26, x + 15 * f, by - 36 + sway, ART.bark);
      pixelPolygon(g, poly([[11, -43 + sway], [19, -40 + sway], [17, -33 + sway], [12, -35 + sway]]), ART.stoneLight);
    }

    // Spectateurs en anneau autour du cercle de combat : silhouettes, souffle d'étoffe décalé pour chacun.
    function drawSpectators(g, t, ringXs) {
      ringXs.forEach(([x, y, tall], i) => {
        const sway = Math.floor((t + i * 23) / 40) % 5 === 0 ? 1 : 0, hy = y - tall - sway;
        paint(g, ART.shadow, x, hy + 5, 6, tall - 4 + sway); pixelDisc(g, x + 3, hy + 3, 3, ART.shadow);
        if (i % 3 === 0) { pixelLine(g, x + 7, y - tall + 6, x + 8, y - tall - 6, ART.stoneDark); }
        paint(g, i % 2 ? ART.roofDark : ART.cloak, x + 1, hy + 8, 4, 2);
      });
    }

