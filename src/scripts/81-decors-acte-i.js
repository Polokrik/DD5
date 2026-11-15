    function drawNightSky(g) {
      [ART.night, ART.sky, ART.dusk, ART.haze, ART.glow].forEach((c, i) => paint(g, c, 0, i * 23, 320, 23));
      pixelDisc(g, 280, 43, 12, ART.moon); pixelDisc(g, 274, 39, 12, ART.sky);
      [[40,18],[74,27],[131,13],[193,24],[245,16],[306,29]].forEach(([x,y]) => paint(g, ART.fog, x, y, 1, 1));
      pixelPolygon(g, [[0,110],[0,78],[27,63],[47,77],[75,60],[106,83],[145,66],[173,83],[210,58],[238,74],[274,62],[320,79],[320,115]], ART.far);
      pixelPolygon(g, [[0,112],[0,96],[35,86],[76,97],[120,79],[168,98],[201,87],[239,91],[277,80],[320,94],[320,120]], ART.ridge);
    }

    function drawVerdure(g) {
      drawNightSky(g);
      paint(g, ART.ridge, 0, 112, 320, 14);
      paint(g, ART.river, 0, 125, 320, 75);
      for (let i = 0; i < 19; i++) paint(g, i % 2 ? ART.waterLight : ART.glow, 120 + i * 10, 145 + (i * 7) % 35, 5 + i % 9, 1);
      for (let row = 0; row < 3; row++) for (let i = 0; i < 10; i++) drawHouse(g, 107 + i * 23 + (row % 2) * 9, 107 + row * 13, 13 + i % 6, 15 + (i * 7) % 11, i + row);
      drawTower(g, 251, 117, 44, 16); drawTower(g, 274, 120, 33, 12);
      pixelPolygon(g, [[249,73],[259,56],[268,73]], ART.roofDark);
      paint(g, ART.stoneDark, 109, 133, 211, 8);
      for (let i = 0; i < 52; i++) paint(g, ART.stone, 109 + i * 4, 131, 3, 3);
      drawTower(g, 154, 149, 28, 11); drawTower(g, 176, 150, 28, 11);
      pixelPolygon(g, [[164,149],[164,136],[170,131],[176,136],[176,149]], ART.shadow);
      pixelPolygon(g, [[0,155],[25,143],[54,147],[87,134],[113,144],[136,158],[174,168],[212,183],[320,181],[320,200],[0,200]], ART.soil);
      pixelPolygon(g, [[76,200],[87,178],[117,162],[147,151],[167,146],[171,149],[143,157],[117,174],[108,200]], ART.path);
      pixelPolygon(g, [[94,200],[105,178],[127,164],[170,147],[165,152],[132,169],[117,184],[113,200]], ART.pathLight);
      for (let i = 0; i < 55; i++) paint(g, i % 3 ? ART.grass : ART.grassLight, (i * 43) % 320, 161 + (i * 13) % 39, 2 + i % 4, 1);
      [[6,191,63],[24,180,43],[310,200,64],[293,195,39]].forEach(p => drawPine(g, ...p));
      [0,1,2,3,4].forEach(i => {
        const x = 63 + i * 9, y = 163 - (i % 3) * 2;
        paint(g, ART.shadow, x - 1, y, 5, 11); paint(g, i % 2 ? ART.cloak : ART.armor, x, y, 2, 8);
        paint(g, ART.pathLight, x, y - 3, 3, 3); pixelLine(g, x + 4, y, x + 5, y + 12, ART.stoneLight);
      });
      drawVerdureForeground(g);
    }

    function drawStreet(g) {
      drawNightSky(g); paint(g, ART.wallDark, 0, 125, 320, 75);
      pixelPolygon(g, [[95,200],[145,113],[181,113],[229,200]], ART.path);
      drawTower(g, 151, 123, 34, 15);
      for (let side = 0; side < 2; side++) for (let i = 0; i < 4; i++) {
        const w = 38 - i * 6, x = side ? 202 + i * 25 : 82 - i * 31;
        drawHouse(g, x, 144 + (3 - i) * 12, w, 39 + (3 - i) * 11, i + side);
      }
      paint(g, ART.timber, 250, 121, 22, 41); pixelPolygon(g, [[249,121],[260,113],[273,121]], ART.roofDark);
      [0,1,2,3].forEach(i => {
        const x = 220 + i * 8, y = 147 + i % 2 * 2;
        paint(g, i % 2 ? ART.cloak : ART.armor, x, y, 5, 11); paint(g, ART.wall, x + 1, y - 4, 3, 4);
      });
      for (let i = 0; i < 8; i++) {
        const x = 113 + i * 11, y = 152 + i % 3 * 5;
        paint(g, ART.roof, x, y, 4, 7); paint(g, ART.ember, x + 1, y - 3, 4, 4);
        paint(g, ART.window, x + 3, y - 2, 1, 1); pixelLine(g, x + 5, y, x + 8, y - 5, ART.stoneLight);
      }
      paint(g, ART.shadow, 0, 192, 320, 8);
    }

    function drawKeep(g) {
      drawNightSky(g); paint(g, ART.soil, 0, 139, 320, 61);
      paint(g, ART.stoneDark, 152, 93, 168, 65); paint(g, ART.stone, 160, 100, 160, 48);
      for (let i = 0; i < 40; i++) paint(g, ART.stone, 153 + i * 4, 90, 3, 6);
      for (let row = 0; row < 6; row++) for (let i = 0; i < 15; i++) paint(g, ART.wallDark, 160 + i * 11 + row % 2 * 5, 103 + row * 7, 8, 1);
      drawTower(g, 180, 163, 89, 22); drawTower(g, 264, 163, 89, 22);
      pixelPolygon(g, [[202,164],[202,127],[231,109],[264,127],[264,164]], ART.shadow);
      paint(g, ART.timber, 211, 132, 43, 32);
      for (let i = 0; i < 8; i++) paint(g, ART.stoneDark, 212 + i * 6, 133, 2, 30);
      pixelPolygon(g, [[171,200],[215,164],[251,164],[310,200]], ART.path);
      drawPine(g, 80, 185, 54); drawPine(g, 29, 189, 69);
    }

    function drawDragon(g, phase) {
      const rise = [0, 1, 2, 1, 0, -1, -2, -1][phase % 8];
      pixelPolygon(g, [[237,74],[219,63],[192,39+rise],[196,60],[201,56],[210,71],[218,67],[229,81]], ART.blueDark);
      pixelPolygon(g, [[236,76],[252,56],[288,41-rise],[280,57],[272,55],[263,70],[254,66],[242,83]], ART.blueDark);
      pixelLine(g, 237, 75, 218, 62, ART.blue); pixelLine(g, 218, 62, 192, 39+rise, ART.blue);
      pixelLine(g, 240, 77, 254, 57, ART.blue); pixelLine(g, 254, 57, 288, 41-rise, ART.blue);
      pixelPolygon(g, [[226,82],[234,70],[241,72],[245,83],[250,90],[245,93],[238,86],[234,91],[229,88],[221,98],[205,97],[218,93]], ART.blue);
      pixelPolygon(g, [[235,74],[239,65],[247,61],[255,63],[251,66],[244,66],[243,76]], ART.blue);
      pixelLine(g, 246, 61, 244, 56, ART.blueLight); pixelLine(g, 241, 64, 238, 60, ART.blueLight);
      paint(g, ART.hot, 249, 63, 1, 1);
    }

    // Décors fixes: géométrie entière et couleurs prises exclusivement dans ART.
    function drawTunnel(g) {
      paint(g, ART.night, 0, 0, 320, 200);
      pixelPolygon(g, [[0,0],[182,0],[206,47],[183,152],[0,200]], ART.shadow);
      pixelPolygon(g, [[0,0],[320,0],[291,53],[211,53],[186,23]], ART.ridge);
      for (let row = 0; row < 8; row++) for (let col = 0; col < 8; col++) {
        const x = col * 29 - row % 2 * 14, y = row * 21;
        paint(g, (row + col) % 4 ? ART.ridge : ART.stoneDark, x, y, 27, 18);
        paint(g, ART.shadow, x + 2, y + 17, 24, 1);
      }
      pixelPolygon(g, [[182,154],[195,68],[208,45],[228,33],[255,34],[279,49],[295,72],[304,159]], ART.stoneDark);
      pixelPolygon(g, [[195,154],[207,72],[218,55],[234,47],[252,48],[271,61],[283,81],[290,154]], ART.stone);
      pixelPolygon(g, [[206,154],[216,77],[225,63],[237,57],[251,58],[266,69],[274,86],[279,154]], ART.sky);
      paint(g, ART.haze, 221, 83, 50, 26);
      pixelPolygon(g, [[215,107],[230,94],[246,100],[260,89],[276,109],[279,151],[207,153]], ART.ridge);
      pixelPolygon(g, [[209,128],[229,113],[244,115],[253,122],[276,116],[280,155],[207,155]], ART.river);
      for (let i = 0; i < 7; i++) paint(g, ART.waterLight, 216 + i * 8, 129 + i % 3 * 6, 7, 1);
      pixelPolygon(g, [[0,200],[186,150],[214,144],[272,146],[320,185],[320,200]], ART.soil);
      pixelPolygon(g, [[68,200],[195,151],[238,145],[272,154],[223,171],[185,200]], ART.path);
      pixelPolygon(g, [[120,200],[218,159],[248,151],[271,155],[232,171],[196,200]], ART.pathLight);
      for (let i = 0; i < 7; i++) pixelLine(g, 83 + i * 17, 199, 213 + i * 5, 151, ART.wallDark);
      [[192,116,12,5],[197,88,12,5],[207,65,12,5],[221,45,9,6],[240,36,8,9],[260,42,8,8],[277,58,9,6],[287,82,8,6],[292,112,8,6]].forEach(([x,y,w,h]) => paint(g, ART.wallDark, x,y,w,h));
      pixelLine(g, 200, 148, 214, 75, ART.stoneLight);
      pixelLine(g, 216, 63, 231, 49, ART.stoneLight);
      paint(g, ART.timber, 280, 85, 4, 70); paint(g, ART.stoneDark, 273, 81, 3, 71);
      for (let i = 0; i < 5; i++) pixelLine(g, 275 + i * 2, 87, 282 + i, 151, ART.wallDark);
      pixelLine(g, 274, 113, 287, 118, ART.stoneLight);
      pixelPolygon(g, [[0,200],[0,184],[114,169],[175,157],[195,155],[140,177],[94,200]], ART.river);
      for (let i = 0; i < 14; i++) paint(g, ART.blueDark, 8 + i * 11, 190 - Math.floor(i / 2) * 3, 9 - i % 4, 1);
      for (let i = 0; i < 23; i++) paint(g, i % 2 ? ART.grass : ART.grassLight, 167 + i * 6, 169 + i * 11 % 31, 3, 1);
      paint(g, ART.bark, 178, 107, 2, 30); paint(g, ART.ember, 176, 105, 6, 6);
      pixelPolygon(g, [[176,107],[175,99],[178,102],[180,94],[182,104],[181,109]], ART.flame);
      paint(g, ART.hot, 178, 102, 2, 6);
      pixelPolygon(g, [[0,0],[57,0],[38,132],[0,185]], ART.night);
      paint(g, ART.shadow, 0, 196, 320, 4);
    }

    function drawTemple(g) {
      paint(g, ART.night, 0, 0, 320, 200); drawNightSky(g); paint(g, ART.soil, 0, 133, 320, 67);
      for (let i = 0; i < 5; i++) drawHouse(g, 59 + i * 29, 134, 23, 23 + i % 2 * 7, i);
      for (let i = 0; i < 6; i++) pixelDisc(g, 93 + i * 8, 83 - i * 9, 7 + i, i % 2 ? ART.smoke : ART.smokeLight);
      pixelPolygon(g, [[177,109],[220,88],[286,103],[286,151],[175,150]], ART.stoneDark);
      pixelPolygon(g, [[169,112],[221,77],[285,99],[280,111],[222,91],[177,124]], ART.roofDark);
      pixelPolygon(g, [[219,79],[285,100],[279,109],[220,91]], ART.roof);
      paint(g, ART.stone, 219, 87, 65, 66);
      pixelPolygon(g, [[215,88],[249,56],[288,89]], ART.stoneDark);
      pixelPolygon(g, [[219,88],[249,61],[282,88]], ART.stone);
      pixelLine(g, 217, 88, 249, 58, ART.stoneLight);
      pixelLine(g, 249, 58, 287, 88, ART.stoneLight);
      drawTower(g, 278, 151, 102, 20);
      pixelPolygon(g, [[273,49],[287,24],[302,49]], ART.roofDark);
      pixelLine(g, 278, 48, 287, 29, ART.roofLight);
      paint(g, ART.shadow, 283, 58, 9, 12); paint(g, ART.accent, 285, 61, 5, 6);
      for (let row = 0; row < 8; row++) for (let col = 0; col < 6; col++) {
        paint(g, ART.wallDark, 223 + col * 10 + row % 2 * 4, 94 + row * 7, 8, 1);
      }
      pixelPolygon(g, [[236,151],[236,124],[249,111],[263,124],[263,151]], ART.shadow);
      pixelPolygon(g, [[241,150],[241,126],[249,118],[257,126],[257,150]], ART.window);
      paint(g, ART.timber, 258, 125, 3, 26);
      paint(g, ART.shadow, 248, 98, 4, 9); paint(g, ART.blueLight, 249, 99, 2, 4);
      paint(g, ART.stoneLight, 232, 152, 35, 3); paint(g, ART.stoneDark, 227, 155, 45, 4);
      paint(g, ART.stone, 221, 159, 56, 4);
      pixelPolygon(g, [[178,200],[218,164],[275,164],[314,200]], ART.path);
      for (let i = 0; i < 21; i++) paint(g, ART.wallDark, 188 + i * 6, 172 + i * 9 % 25, 5, 1);
      paint(g, ART.timber, 189, 151, 30, 4); paint(g, ART.bark, 191, 144, 3, 18);
      pixelLine(g, 195, 143, 215, 157, ART.wallDark); pixelLine(g, 208, 143, 196, 160, ART.wallDark);
      for (let i = 0; i < 4; i++) {
        const x = 182 + i * 13, y = 165 + i % 2 * 6;
        paint(g, ART.roofDark, x, y, 5, 8); paint(g, ART.ember, x + 1, y - 3, 4, 4);
        pixelLine(g, x + 4, y + 1, x + 9, y - 4, ART.stoneLight);
      }
      paint(g, ART.bark, 283, 145, 2, 19); paint(g, ART.flame, 281, 143, 5, 7);
      paint(g, ART.hot, 283, 144, 2, 4);
      drawPine(g, 31, 183, 64); drawPine(g, 72, 174, 40);
      pixelPolygon(g, [[0,189],[61,175],[119,186],[157,178],[178,200],[0,200]], ART.tree);
    }

    function drawMill(g) {
      paint(g, ART.night, 0, 0, 320, 200); drawNightSky(g); paint(g, ART.soil, 0, 130, 320, 70);
      drawHouse(g, 91, 137, 26, 26, 1); drawHouse(g, 129, 139, 24, 32, 3);
      for (let i = 0; i < 4; i++) pixelDisc(g, 119 + i * 4, 95 - i * 10, 7 + i * 2, ART.smoke);
      pixelPolygon(g, [[278,114],[320,111],[320,200],[225,200],[253,169],[272,152]], ART.river);
      for (let i = 0; i < 25; i++) paint(g, i % 3 ? ART.waterLight : ART.blueDark, 252 + i * 13 % 67, 122 + i * 11 % 77, 5 + i % 7, 1);
      paint(g, ART.stoneDark, 175, 132, 78, 29);
      for (let row = 0; row < 4; row++) for (let col = 0; col < 8; col++) paint(g, ART.wallDark, 177 + col * 10 + row % 2 * 4, 134 + row * 7, 8, 1);
      paint(g, ART.wall, 178, 92, 75, 42);
      pixelPolygon(g, [[170,94],[210,63],[258,93]], ART.roofDark);
      pixelPolygon(g, [[211,64],[258,93],[252,97],[210,73]], ART.roof);
      pixelLine(g, 175, 93, 211, 65, ART.roofLight);
      paint(g, ART.timber, 179, 94, 4, 42); paint(g, ART.timber, 210, 93, 4, 42); paint(g, ART.timber, 249, 93, 4, 42);
      paint(g, ART.timber, 179, 115, 73, 3);
      pixelLine(g, 183, 96, 209, 114, ART.timber); pixelLine(g, 214, 115, 248, 96, ART.timber);
      paint(g, ART.shadow, 188, 101, 12, 10); paint(g, ART.window, 190, 103, 7, 6);
      paint(g, ART.timber, 193, 102, 1, 8);
      paint(g, ART.shadow, 218, 123, 17, 37); paint(g, ART.timber, 220, 126, 13, 34);
      for (let i = 0; i < 3; i++) paint(g, ART.wallDark, 222 + i * 4, 127, 1, 30);
      paint(g, ART.timber, 243, 112, 77, 5); paint(g, ART.pathLight, 243, 112, 77, 1);
      paint(g, ART.bark, 301, 114, 5, 47);
      pixelDisc(g, 267, 145, 27, ART.timber); pixelDisc(g, 267, 145, 24, ART.wallDark);
      pixelDisc(g, 267, 145, 20, ART.shadow);
      [[267,121],[284,128],[291,145],[284,162],[267,169],[250,162],[243,145],[250,128]].forEach(([x,y]) => {
        pixelLine(g, 267, 145, x,y, ART.pathLight); pixelLine(g, 268, 145, x + 1,y, ART.timber);
      });
      pixelDisc(g, 267, 145, 4, ART.stoneDark); paint(g, ART.stoneLight, 266, 143, 2, 3);
      for (let i = 0; i < 5; i++) {
        const x = 180 + i * 6, y = 149 - i % 2 * 4;
        pixelPolygon(g, [[x,y],[x + 2,y - 5],[x + 6,y - 5],[x + 8,y],[x + 8,y + 8],[x,y + 8]], ART.cloak);
        paint(g, ART.wallDark, x + 2,y - 4, 4,1);
      }
      paint(g, ART.bark, 206, 181, 112, 6); paint(g, ART.pathLight, 207, 181, 110, 2);
      for (let i = 0; i < 13; i++) paint(g, ART.timber, 210 + i * 8, 182, 1, 5);
      paint(g, ART.bark, 222, 181, 4, 19); paint(g, ART.bark, 305, 181, 4, 19);
      for (let i = 0; i < 2; i++) {
        const x = 159 + i * 31, y = 161 + i * 9;
        paint(g, ART.roofDark, x, y, 5, 11); paint(g, ART.wallDark, x + 1, y - 3, 4, 3);
        pixelLine(g, x + 5, y + 2, x + 9, y - 6, ART.stoneLight);
      }
      paint(g, ART.bark, 166, 144, 2, 15); paint(g, ART.flame, 164, 141, 5, 6); paint(g, ART.hot, 166, 142, 2, 4);
      drawPine(g, 15, 194, 80); drawPine(g, 54, 186, 60);
      for (let i = 0; i < 28; i++) paint(g, i % 3 ? ART.grass : ART.grassLight, i * 17 % 234, 168 + i * 7 % 31, 3, 1);
    }

    function drawDuel(g) {
      paint(g, ART.sky, 0, 0, 320, 200);
      [ART.sky, ART.dusk, ART.haze, ART.glow, ART.moon].forEach((c,i) => paint(g, c, 0, i * 24, 320, 24));
      pixelDisc(g, 228, 95, 16, ART.hot);
      pixelPolygon(g, [[0,111],[0,92],[38,72],[66,91],[110,75],[145,96],[184,82],[226,99],[260,77],[320,96],[320,130]], ART.far);
      paint(g, ART.stoneDark, 122, 105, 198, 47); paint(g, ART.stone, 145, 112, 175, 38);
      for (let i = 0; i < 44; i++) paint(g, ART.stoneDark, 122 + i * 5, 102, 3, 5);
      for (let row = 0; row < 5; row++) for (let col = 0; col < 18; col++) paint(g, ART.wallDark, 144 + col * 10 + row % 2 * 4, 116 + row * 7, 8, 1);
      drawTower(g, 255, 154, 83, 20); drawTower(g, 298, 154, 83, 20);
      pixelPolygon(g, [[274,153],[274,128],[286,116],[298,128],[298,153]], ART.shadow);
      paint(g, ART.timber, 278, 131, 4, 20); paint(g, ART.timber, 293, 131, 4, 20);
      paint(g, ART.soil, 0, 153, 320, 47);
      pixelPolygon(g, [[88,200],[147,161],[230,151],[287,167],[320,200]], ART.path);
      pixelPolygon(g, [[125,191],[154,174],[221,162],[265,169],[292,190],[260,198],[167,198]], ART.pathLight);
      for (let i = 0; i < 35; i++) paint(g, i % 2 ? ART.wallDark : ART.path, 128 + i * 19 % 169, 171 + i * 7 % 28, 2 + i % 4, 1);
      drawPine(g, 19, 187, 75); drawPine(g, 60, 176, 49);
      pixelPolygon(g, [[0,195],[54,180],[101,190],[128,200],[0,200]], ART.tree);
    }

    function drawCaveDuel(g) {
      paint(g,ART.night,0,0,320,200);
      pixelPolygon(g,[[0,0],[320,0],[320,165],[280,153],[234,164],[180,151],[130,166],[60,153],[0,165]],ART.ridge);
      pixelPolygon(g,[[0,0],[320,0],[310,35],[287,28],[272,56],[255,22],[230,37],[213,19],[188,47],[166,20],[138,51],[111,25],[86,40],[54,21],[32,46],[0,30]],ART.shadow);
      paint(g,ART.stoneDark,158,114,152,43);
      for(let row=0;row<5;row++) for(let col=0;col<13;col++) paint(g,ART.wallDark,160+col*12+row%2*5,116+row*8,10,1);
      paint(g,ART.soil,0,158,320,42);
      pixelPolygon(g,[[128,200],[157,169],[220,157],[285,173],[320,200]],ART.path);
      for(let i=0;i<30;i++) paint(g,i%2?ART.stoneDark:ART.wallDark,130+(i*19)%185,169+(i*13)%29,3,1);
      [173,292].forEach(x=>{
        paint(g,ART.stone, x,111,9,44);pixelPolygon(g,[[x-5,114],[x+3,94],[x+14,113],[x+11,130],[x-2,128]],ART.stoneDark);
        pixelLine(g,x+6,98,x+10,93,ART.stoneLight);paint(g,ART.shadow,x+6,111,2,2);
      });
      [149,277].forEach(x=>{paint(g,ART.bark,x,122,2,21);paint(g,ART.flame,x-2,119,5,7);paint(g,ART.hot,x,121,2,4);});
      pixelPolygon(g,[[0,0],[41,0],[53,52],[26,117],[58,166],[0,200]],ART.shadow);
    }

