    // Palette fixe ; scanlines entières pour éviter l'anticrénelage du pixel art.
    const ART = {
      night: '#162333', sky: '#293747', dusk: '#414553', haze: '#66505a', glow: '#a06556',
      fog: '#84706d', moon: '#e5c79d', far: '#394453', ridge: '#2c3948', tree: '#1c3038',
      grass: '#35494a', grassLight: '#4c5b51', soil: '#263a40', path: '#7f7863', pathLight: '#a39273',
      stone: '#727477', stoneLight: '#92918a', stoneDark: '#505b62', wall: '#a5937a', wallDark: '#6b6662',
      roof: '#784c49', roofLight: '#a05f4b', roofDark: '#453d47', timber: '#443b40', window: '#e6b574',
      flame: '#e59155', ember: '#b96b49', hot: '#f1ca83', smoke: '#584e59', smokeLight: '#73616a',
      blue: '#587a8e', blueDark: '#344c65', blueLight: '#8399a0', shadow: '#172c3d', river: '#435b66',
      waterLight: '#778781', cloak: '#b49970', armor: '#7d8c89', bark: '#343f46', accent: '#d2ac78'
    };

    function paint(g, color, x, y, w, h) { g.fillStyle = color; g.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); }

    function pixelPolygon(g, points, color) {
      const min = Math.floor(Math.min(...points.map(p => p[1]))), max = Math.ceil(Math.max(...points.map(p => p[1])));
      for (let y = min; y <= max; y++) {
        const crossings = [];
        points.forEach(([x1, y1], i) => {
          const [x2, y2] = points[(i + 1) % points.length];
          if ((y1 <= y && y2 > y) || (y2 <= y && y1 > y)) crossings.push(x1 + (y - y1) * (x2 - x1) / (y2 - y1));
        });
        crossings.sort((a, b) => a - b);
        for (let i = 0; i + 1 < crossings.length; i += 2) paint(g, color, Math.ceil(crossings[i]), y, Math.ceil(crossings[i + 1]) - Math.ceil(crossings[i]), 1);
      }
    }

    function pixelDisc(g, x, y, radius, color) {
      for (let row = -radius; row <= radius; row++) {
        const width = Math.floor(Math.sqrt(radius * radius - row * row));
        paint(g, color, x - width, y + row, width * 2 + 1, 1);
      }
    }

    function pixelLine(g, x, y, endX, endY, color) {
      const steps = Math.max(Math.abs(endX - x), Math.abs(endY - y));
      for (let i = 0; i <= steps; i++) paint(g, color, x + (endX - x) * i / steps, y + (endY - y) * i / steps, 1, 1);
    }

    function drawHouse(g, x, base, width, height, style = 0) {
      const top = base - height;
      paint(g, style % 2 ? ART.wall : ART.wallDark, x, top, width, height);
      paint(g, ART.timber, x, top, 2, height);
      paint(g, ART.timber, x + width - 2, top, 2, height);
      pixelPolygon(g, [[x - 3, top + 1], [x + width / 2, top - 10], [x + width + 3, top + 1]], ART.roofDark);
      pixelPolygon(g, [[x + width / 2, top - 10], [x + width + 3, top + 1], [x + 2, top + 1]], style % 3 ? ART.roof : ART.roofLight);
      paint(g, ART.timber, x, top + Math.floor(height / 2), width, 1);
      for (let row = 0; row < 2; row++) for (let col = 0; col < Math.floor(width / 6); col++) {
        paint(g, ART.timber, x + 3 + col * 6, top + 5 + row * 9, 3, 4);
        if ((style + row + col) % 3) paint(g, ART.window, x + 3 + col * 6, top + 5 + row * 9, 1, 3);
      }
    }

    function drawTower(g, x, base, height, width = 12) {
      paint(g, ART.stoneDark, x, base - height, width, height);
      paint(g, ART.stone, x, base - height, width - 3, height);
      paint(g, ART.stoneLight, x, base - height, 2, height);
      for (let i = 0; i < width; i += 4) paint(g, ART.stone, x + i, base - height - 3, 3, 4);
      for (let y = base - height + 5; y < base - 3; y += 7) {
        paint(g, ART.shadow, x + 4, y, 2, 4);
        paint(g, ART.wallDark, x + 2, y + 5, width - 4, 1);
      }
    }

    function drawPine(g, x, base, height, color = ART.tree) {
      paint(g, ART.bark, x, base - height, 2, height);
      for (let layer = 0; layer < 4; layer++) {
        const top = base - height + layer * height / 7, spread = height * (.16 + layer * .045);
        pixelPolygon(g, [[x + 1, top], [x - spread, top + height * .4], [x + spread, top + height * .4]], color);
      }
    }

