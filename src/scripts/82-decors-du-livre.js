    // Six décors fixes supplémentaires. Aucun fait ou état du groupe n'est peint
    // dans le cache : prisonniers, œufs et héros relèvent des couches de scène.
    function drawCampArt(g) {
      drawNightSky(g);
      pixelPolygon(g,[[0,107],[0,68],[31,53],[68,71],[100,49],[141,73],[174,61],[212,84],[260,67],[320,83],[320,200],[0,200]],ART.stoneDark);
      pixelPolygon(g,[[0,124],[42,105],[84,114],[116,99],[157,117],[194,106],[239,115],[287,104],[320,119],[320,200],[0,200]],ART.soil);
      pixelPolygon(g,[[100,200],[127,173],[156,155],[198,146],[241,121],[251,125],[221,151],[181,169],[153,200]],ART.path);
      for(let i=0;i<36;i++) paint(g,i%3?ART.wallDark:ART.pathLight,115+i*17%193,145+i*13%53,3,1);
      [[164,130,35,23],[233,117,43,28],[283,146,33,24],[116,148,29,20]].forEach(([x,y,w,h],i)=>{
        pixelPolygon(g,[[x-3,y+2],[x+w/2,y-h],[x+w+4,y+2]],ART.roofDark);
        pixelPolygon(g,[[x+w/2,y-h],[x+w+4,y+2],[x+w/2+4,y+2]],i%2?ART.roof:ART.cloak);
        pixelPolygon(g,[[x+1,y],[x+w/2,y-h+4],[x+w/2+2,y]],i%2?ART.wallDark:ART.pathLight);
        pixelPolygon(g,[[x+w/2-4,y+1],[x+w/2,y-h+8],[x+w/2+5,y+1]],ART.shadow);
        pixelLine(g,x+w/2,y-h-4,x+w/2,y+2,ART.timber);
        pixelLine(g,x+2,y-3,x-5,y+6,ART.wallDark);pixelLine(g,x+w-2,y-3,x+w+7,y+6,ART.wallDark);
      });
      paint(g,ART.timber,245,94,2,28);pixelPolygon(g,[[247,95],[260,98],[254,104],[247,101]],ART.roofDark);
      paint(g,ART.shadow,217,153,54,28);
      paint(g,ART.wallDark,214,147,59,5);paint(g,ART.timber,214,178,59,4);
      for(let i=0;i<8;i++) {paint(g,ART.timber,215+i*8,146,2,36);paint(g,ART.pathLight,215+i*8,148,1,30);}
      paint(g,ART.timber,214,158,59,2);paint(g,ART.timber,214,172,59,2);
      pixelLine(g,218,146,232,134,ART.wallDark);pixelLine(g,272,146,280,135,ART.wallDark);
      pixelLine(g,232,134,280,135,ART.timber);pixelLine(g,280,135,280,166,ART.timber);
      for(let i=0;i<6;i++)pixelLine(g,220+i*9,146,232+i*9,134,ART.timber);
      [[191,161],[196,164],[203,162],[199,158]].forEach(([x,y])=>paint(g,ART.stone,x,y,5,3));
      paint(g,ART.ember,195,159,7,4);
      paint(g,ART.timber,285,166,21,14);paint(g,ART.wallDark,286,166,19,3);
      pixelLine(g,286,169,303,179,ART.pathLight);pixelLine(g,303,169,286,179,ART.pathLight);
      pixelPolygon(g,[[0,0],[33,0],[44,79],[28,133],[0,163]],ART.shadow);
    }

    function drawHatcheryArt(g) {
      paint(g,ART.night,0,0,320,200);
      pixelPolygon(g,[[0,25],[32,18],[66,39],[101,25],[136,41],[174,23],[214,45],[258,27],[293,43],[320,26],[320,200],[0,200]],ART.ridge);
      pixelPolygon(g,[[95,200],[126,158],[170,147],[199,119],[242,126],[272,154],[320,165],[320,200]],ART.soil);
      pixelPolygon(g,[[153,200],[183,165],[219,154],[262,158],[302,200]],ART.path);
      pixelPolygon(g,[[166,200],[190,175],[225,166],[259,172],[289,200]],ART.wallDark);
      for(let i=0;i<32;i++)paint(g,i%3?ART.stoneDark:ART.pathLight,139+i*17%180,159+i*13%40,3+i%4,1);
      pixelPolygon(g,[[179,143],[185,69],[205,48],[237,43],[268,56],[286,88],[291,150]],ART.shadow);
      pixelPolygon(g,[[194,146],[202,77],[218,65],[241,61],[259,74],[272,102],[276,148]],ART.night);
      [42,80,108,147,281].forEach((x,i)=>{
        const h=24+(i*13)%29;
        pixelPolygon(g,[[x-9,0],[x+10,0],[x+5,15],[x+2,h],[x-3,21]],ART.shadow);
        pixelLine(g,x-3,2,x,h-4,ART.stoneDark);
      });
      [[18,181,43],[88,169,30],[294,183,55]].forEach(([x,y,h])=>{
        pixelPolygon(g,[[x-13,y+12],[x-7,y-h/3],[x,y-h],[x+5,y-h/3],[x+17,y+12]],ART.stoneDark);
        pixelLine(g,x,y-h+3,x+6,y+6,ART.stone);
      });
      pixelPolygon(g,[[207,149],[222,137],[264,141],[279,155],[266,167],[221,166]],ART.stoneDark);
      pixelPolygon(g,[[212,151],[226,143],[260,146],[272,155],[259,161],[223,160]],ART.shadow);
      pixelLine(g,217,159,238,163,ART.wallDark);pixelLine(g,246,162,269,157,ART.wallDark);
      paint(g,ART.bark,178,112,2,33);paint(g,ART.ember,176,110,6,7);paint(g,ART.hot,178,112,2,5);
      [[189,143],[197,147],[270,148],[280,151]].forEach(([x,y])=>paint(g,ART.stone,x,y,4,2));
      [[60,77],[113,86],[145,65],[288,117]].forEach(([x,y],i)=>{
        pixelLine(g,x,y,x+5,y+12,ART.stoneDark);pixelLine(g,x+5,y+12,x+2,y+21,ART.stoneDark);
        paint(g,ART.blueDark,x+2,y+3+i,2,4);
      });
      pixelPolygon(g,[[0,0],[28,0],[43,56],[24,109],[48,167],[13,200],[0,200]],ART.shadow);
      pixelPolygon(g,[[320,0],[300,0],[287,46],[305,105],[294,151],[320,200]],ART.shadow);
    }

    function drawCaravanWagon(g,x,y,scale=1) {
      const p=(color,dx,dy,w,h)=>paint(g,color,x+dx*scale,y+dy*scale,w*scale,h*scale);
      p(ART.shadow,-5,5,43,7);p(ART.timber,0,-5,36,12);p(ART.pathLight,1,-5,34,2);
      pixelPolygon(g,[[x,y-5*scale],[x+2*scale,y-22*scale],[x+10*scale,y-30*scale],[x+27*scale,y-30*scale],[x+35*scale,y-21*scale],[x+36*scale,y-5*scale]],ART.cloak);
      pixelPolygon(g,[[x+20*scale,y-5*scale],[x+21*scale,y-25*scale],[x+27*scale,y-30*scale],[x+35*scale,y-21*scale],[x+36*scale,y-5*scale]],ART.wallDark);
      for(let i=0;i<3;i++)pixelLine(g,x+(5+i*10)*scale,y-7*scale,x+(7+i*9)*scale,y-25*scale,ART.pathLight);
      [7,29].forEach(dx=>{pixelDisc(g,x+dx*scale,y+8*scale,6*scale,ART.timber);pixelDisc(g,x+dx*scale,y+8*scale,4*scale,ART.wallDark);pixelDisc(g,x+dx*scale,y+8*scale,1*scale,ART.pathLight);});
      pixelLine(g,x+35*scale,y+1*scale,x+51*scale,y-1*scale,ART.timber);
      p(ART.wallDark,46,-10,20,7);p(ART.wallDark,61,-16,7,10);p(ART.wallDark,65,-18,5,4);
      [48,60].forEach(dx=>{p(ART.wallDark,dx,-4,2,12);p(ART.timber,dx+3,-4,2,10);});
    }

    function drawCaravanArt(g) {
      paint(g,ART.sky,0,0,320,200);
      [ART.sky,ART.dusk,ART.haze,ART.moon].forEach((color,i)=>paint(g,color,0,i*29,320,29));
      pixelDisc(g,270,86,13,ART.window);
      pixelPolygon(g,[[0,114],[0,88],[32,71],[73,83],[116,59],[158,82],[195,65],[236,83],[281,66],[320,89],[320,133],[0,133]],ART.far);
      pixelPolygon(g,[[0,131],[38,109],[74,118],[119,98],[162,114],[197,106],[244,121],[285,110],[320,127],[320,200],[0,200]],ART.grass);
      pixelPolygon(g,[[81,200],[120,164],[168,142],[224,132],[262,134],[217,149],[178,174],[153,200]],ART.path);
      pixelPolygon(g,[[115,200],[152,165],[203,143],[253,133],[224,145],[183,170],[163,200]],ART.pathLight);
      [51,87,119,151,181,296].forEach((x,i)=>drawPine(g,x,126+(i%3)*8,22+(i*7)%16,ART.tree));
      drawCaravanWagon(g,232,135,.45);drawCaravanWagon(g,192,151,.65);drawCaravanWagon(g,146,179,1);
      pixelLine(g,109,199,159,170,ART.wallDark);pixelLine(g,137,199,181,169,ART.wallDark);
      for(let i=0;i<54;i++)paint(g,i%3?ART.grassLight:ART.tree,i*37%320,139+i*13%60,2+i%3,1);
      drawPine(g,26,197,77);drawPine(g,302,197,64);drawPine(g,63,183,46);
      pixelPolygon(g,[[0,195],[53,186],[87,192],[108,200],[0,200]],ART.tree);
    }

    function drawRoadhouseArt(g) {
      paint(g,ART.night,0,0,320,200);
      pixelPolygon(g,[[27,43],[153,23],[299,53],[299,151],[172,164],[27,133]],ART.wallDark);
      pixelPolygon(g,[[153,23],[299,53],[299,151],[172,164]],ART.timber);
      for(let row=0;row<13;row++){pixelLine(g,28,47+row*7,157,29+row*10,ART.bark);pixelLine(g,157,29+row*10,298,57+row*7,ART.bark);}
      pixelPolygon(g,[[0,143],[161,153],[320,140],[320,200],[0,200]],ART.soil);
      for(let i=0;i<11;i++)pixelLine(g,37+i*28,200,154+i*4,155,ART.wallDark);
      paint(g,ART.shadow,194,61,39,42);paint(g,ART.sky,198,64,31,35);
      paint(g,ART.blueLight,200,66,12,32);paint(g,ART.ridge,215,66,11,32);
      paint(g,ART.timber,212,62,3,40);paint(g,ART.timber,196,79,35,3);
      paint(g,ART.wallDark,192,101,43,3);
      const crate=(x,y,w,h)=>{paint(g,ART.timber,x,y,w,h);paint(g,ART.cloak,x+1,y+1,w-2,2);paint(g,ART.wallDark,x+2,y+4,w-4,h-6);pixelLine(g,x+2,y+4,x+w-3,y+h-3,ART.pathLight);pixelLine(g,x+w-3,y+4,x+2,y+h-3,ART.pathLight);};
      crate(248,117,39,32);crate(237,92,35,25);crate(275,137,33,31);crate(203,130,30,24);
      for(let i=0;i<4;i++){
        const x=102+i%2*25,y=121+Math.floor(i/2)*22;
        pixelPolygon(g,[[x,y-9],[x+15,y-9],[x+18,y],[x+16,y+18],[x-1,y+18],[x-3,y]],ART.timber);
        paint(g,ART.wallDark,x,y-6,14,22);paint(g,ART.stoneDark,x-2,y-3,19,3);paint(g,ART.stoneDark,x-2,y+11,19,3);
        paint(g,ART.pathLight,x+2,y-7,2,20);
      }
      pixelPolygon(g,[[182,164],[224,160],[253,177],[210,185]],ART.night);
      pixelLine(g,182,163,210,182,ART.pathLight);pixelLine(g,210,182,253,176,ART.timber);
      pixelPolygon(g,[[181,163],[180,135],[219,130],[224,159]],ART.timber);
      for(let i=0;i<5;i++)pixelLine(g,184+i*8,137,185+i*8,160,ART.wallDark);
      pixelLine(g,183,140,218,136,ART.pathLight);pixelLine(g,185,155,221,151,ART.pathLight);
      pixelLine(g,224,168,237,176,ART.stoneDark);pixelLine(g,215,171,227,180,ART.stoneDark);
      paint(g,ART.bark,156,42,6,111);paint(g,ART.wallDark,158,44,2,106);
      paint(g,ART.timber,27,14,7,155);paint(g,ART.timber,291,17,8,155);
      pixelLine(g,28,34,156,15,ART.timber);pixelLine(g,156,15,298,42,ART.timber);
      paint(g,ART.shadow,17,0,18,200);paint(g,ART.shadow,0,0,320,13);
    }

    function drawMarshArt(g) {
      paint(g,ART.sky,0,0,320,200);
      [ART.night,ART.sky,ART.dusk,ART.fog].forEach((color,i)=>paint(g,color,0,i*29,320,29));
      pixelDisc(g,275,44,10,ART.moon);pixelDisc(g,271,41,10,ART.sky);
      pixelPolygon(g,[[0,128],[0,110],[36,99],[77,105],[117,92],[152,103],[188,94],[227,110],[267,98],[320,109],[320,145],[0,145]],ART.ridge);
      paint(g,ART.river,0,130,320,70);
      pixelPolygon(g,[[164,135],[181,126],[213,126],[223,135],[261,138],[271,148],[250,159],[190,155]],ART.soil);
      paint(g,ART.stoneDark,202,84,74,52);paint(g,ART.stone,207,89,68,42);
      for(let row=0;row<6;row++)for(let col=0;col<9;col++)paint(g,ART.wallDark,206+col*8+row%2*3,92+row*7,6,1);
      [202,264].forEach((x,i)=>{
        drawTower(g,x,139,72-i*9,17);
        pixelPolygon(g,[[x-4,68+i*9],[x+8,47+i*9],[x+21,68+i*9]],ART.roofDark);
      });
      paint(g,ART.shadow,231,108,18,28);paint(g,ART.bark,236,114,8,22);
      [184,199,214,229,244].forEach(x=>{paint(g,ART.bark,x,148,3,25);paint(g,ART.wallDark,x+1,149,1,23);});
      pixelPolygon(g,[[176,149],[245,146],[249,151],[175,155]],ART.timber);
      for(let i=0;i<11;i++)pixelLine(g,180+i*6,148,180+i*6,153,ART.pathLight);
      pixelPolygon(g,[[88,200],[101,178],[133,161],[176,150],[181,154],[140,169],[117,186],[111,200]],ART.timber);
      for(let i=0;i<9;i++)pixelLine(g,96+i*4,195-i*4,114+i*4,198-i*4,ART.pathLight);
      for(let i=0;i<40;i++)paint(g,i%3?ART.waterLight:ART.blueDark,i*43%320,135+i*11%64,4+i%8,1);
      [[29,176],[76,147],[282,175],[159,180]].forEach(([x,y],i)=>{pixelPolygon(g,[[x-12,y],[x+3,y-4],[x+17,y],[x+5,y+3]],ART.grass);paint(g,ART.grassLight,x-4,y,12,1);});
      [[19,191,108],[76,172,88],[304,200,110]].forEach(([x,y,h])=>{
        paint(g,ART.bark,x,y-h,5,h);pixelLine(g,x+2,y-h+31,x-19,y-h+8,ART.bark);pixelLine(g,x+3,y-h+45,x+23,y-h+16,ART.bark);
        pixelPolygon(g,[[x-24,y-h+10],[x-17,y-h-9],[x+9,y-h-16],[x+31,y-h+3],[x+25,y-h+19],[x+2,y-h+26]],ART.tree);
        for(let i=0;i<3;i++)paint(g,ART.grassLight,x-15+i*17,y-h+13,1,17+i*3);
      });
      [[35,193],[63,183],[272,186],[290,197]].forEach(([x,y])=>{pixelLine(g,x,y,x-2,y-17,ART.grassLight);pixelLine(g,x,y,x+5,y-12,ART.grass);paint(g,ART.cloak,x-3,y-21,2,5);});
    }

    function drawSkyreachArt(g) {
      [ART.night,ART.sky,ART.blueDark,ART.blue].forEach((color,i)=>paint(g,color,0,i*50,320,50));
      const cloud=(x,y,w)=>{
        paint(g,ART.blueLight,x,y,w,5);paint(g,ART.waterLight,x+7,y-4,w-19,4);
        paint(g,ART.blueLight,x+14,y-9,w-33,5);paint(g,ART.stoneLight,x+22,y-10,Math.max(5,w-49),2);
      };
      [[-18,104,90],[48,125,67],[238,108,103],[85,181,81],[241,179,107]].forEach(([x,y,w])=>cloud(x,y,w));
      pixelPolygon(g,[[140,151],[153,131],[204,125],[266,130],[292,148],[276,165],[254,171],[242,194],[224,179],[200,190],[188,170],[163,165]],ART.blueDark);
      pixelPolygon(g,[[151,148],[180,137],[225,133],[277,143],[268,157],[242,166],[221,177],[208,167],[184,163]],ART.blueLight);
      pixelPolygon(g,[[151,145],[179,130],[245,127],[289,144],[270,153],[184,151]],ART.stoneLight);
      pixelLine(g,186,156,203,177,ART.waterLight);pixelLine(g,237,164,242,183,ART.waterLight);pixelLine(g,258,154,248,169,ART.waterLight);
      paint(g,ART.blueLight,180,92,89,45);paint(g,ART.stoneLight,184,97,81,37);
      for(let row=0;row<5;row++)for(let col=0;col<10;col++)paint(g,ART.waterLight,184+col*8+row%2*4,101+row*7,6,1);
      [174,255].forEach((x,i)=>{
        paint(g,ART.waterLight,x,67+i*8,20,72-i*8);paint(g,ART.stoneLight,x+2,70+i*8,13,66-i*8);
        for(let c=0;c<4;c++)paint(g,ART.stoneLight,x+c*6,64+i*8,4,7);
        for(let y=80+i*8;y<126;y+=14)paint(g,ART.blueDark,x+7,y,4,7);
        pixelLine(g,x+2,70+i*8,x+2,135,ART.moon);
      });
      paint(g,ART.blueLight,215,50,21,74);paint(g,ART.stoneLight,218,53,13,69);
      pixelPolygon(g,[[211,54],[225,30],[241,54]],ART.waterLight);pixelLine(g,217,52,225,35,ART.moon);
      paint(g,ART.blueDark,222,66,5,11);paint(g,ART.blueDark,222,91,5,10);
      paint(g,ART.bark,225,19,1,15);pixelPolygon(g,[[226,20],[238,23],[231,28],[226,26]],ART.roofDark);
      pixelPolygon(g,[[206,137],[206,116],[217,106],[230,116],[230,137]],ART.blueDark);
      paint(g,ART.shadow,211,119,14,18);paint(g,ART.waterLight,212,120,3,16);
      pixelPolygon(g,[[116,200],[132,179],[151,158],[205,133],[212,137],[174,159],[153,183],[146,200]],ART.stoneLight);
      pixelLine(g,137,183,200,144,ART.blueLight);pixelLine(g,143,193,207,145,ART.waterLight);
      cloud(-6,165,107);cloud(275,158,73);
      pixelPolygon(g,[[0,200],[0,183],[31,174],[62,177],[78,188],[107,189],[121,200]],ART.ridge);
    }

    function drawLodgeArt(g) {
      paint(g,ART.sky,0,0,320,200);
      [ART.night,ART.sky,ART.dusk,ART.haze].forEach((color,i)=>paint(g,color,0,i*27,320,27));
      pixelPolygon(g,[[0,125],[0,79],[27,58],[49,74],[91,48],[130,80],[170,57],[210,83],[256,53],[283,75],[320,61],[320,144]],ART.far);
      pixelPolygon(g,[[0,133],[22,110],[74,101],[112,120],[161,108],[219,117],[277,105],[320,122],[320,200],[0,200]],ART.grass);
      [33,59,101,126,290,314].forEach((x,i)=>drawPine(g,x,142+(i%2)*10,39+(i*13)%22));
      paint(g,ART.stoneDark,157,125,134,36);paint(g,ART.wallDark,158,88,131,53);
      paint(g,ART.cloak,163,91,122,49);
      pixelPolygon(g,[[150,94],[171,66],[263,60],[300,92],[286,99],[161,99]],ART.roofDark);
      pixelPolygon(g,[[171,66],[263,60],[294,91],[180,91]],ART.roof);
      pixelLine(g,174,66,263,61,ART.roofLight);pixelLine(g,182,87,288,87,ART.wallDark);
      paint(g,ART.stoneDark,263,43,11,33);paint(g,ART.stone,265,45,6,28);
      for(let i=0;i<4;i++)paint(g,ART.wallDark,265,49+i*6,7,1);
      [160,188,220,252,282].forEach(x=>paint(g,ART.timber,x,92,4,49));
      paint(g,ART.timber,162,112,122,3);paint(g,ART.timber,162,137,124,4);
      [[164,94,185,110],[192,94,217,110],[223,94,249,110],[257,94,280,110]].forEach(([x,y,xx,yy])=>pixelLine(g,x,y,xx,yy,ART.timber));
      [[169,119],[228,119],[263,119]].forEach(([x,y])=>{
        paint(g,ART.shadow,x-1,y-1,14,15);paint(g,ART.window,x,y,11,12);
        paint(g,ART.timber,x+5,y,1,12);paint(g,ART.timber,x,y+5,11,1);
      });
      paint(g,ART.shadow,199,115,18,27);paint(g,ART.timber,202,117,13,24);paint(g,ART.accent,211,128,2,2);
      pixelPolygon(g,[[192,144],[198,139],[220,139],[228,144]],ART.stoneLight);
      paint(g,ART.stone,190,144,39,4);paint(g,ART.stoneDark,185,148,49,4);
      pixelPolygon(g,[[98,200],[145,169],[185,149],[233,151],[269,170],[302,200]],ART.path);
      for(let i=0;i<25;i++)paint(g,i%2?ART.stoneDark:ART.wallDark,128+i*19%164,161+i*11%36,3+i%3,1);
      [[155,144],[283,145]].forEach(([x,y])=>{paint(g,ART.bark,x,y-15,3,28);paint(g,ART.stoneDark,x-2,y-18,7,5);});
      drawPine(g,15,198,101);drawPine(g,75,181,66);drawPine(g,308,196,87);
      pixelPolygon(g,[[0,194],[39,181],[72,191],[109,200],[0,200]],ART.tree);
      for(let i=0;i<27;i++)paint(g,i%2?ART.grassLight:ART.tree,i*41%320,151+i*13%47,3,1);
    }

    function drawPortalArt(g) {
      paint(g,ART.night,0,0,320,200);
      pixelPolygon(g,[[34,23],[172,36],[303,15],[303,153],[174,166],[34,145]],ART.ridge);
      for(let row=0;row<10;row++)for(let col=0;col<14;col++){
        const x=39+col*20+row%2*9,y=35+row*12;
        paint(g,(row+col)%5?ART.stoneDark:ART.ridge,x,y,18,10);
        paint(g,ART.shadow,x,y+10,19,1);
      }
      pixelPolygon(g,[[0,153],[177,148],[320,154],[320,200],[0,200]],ART.soil);
      for(let i=0;i<9;i++)pixelLine(g,28+i*34,200,159+i*10,151,ART.stoneDark);
      for(let i=0;i<3;i++)pixelLine(g,0,166+i*14,320,170+i*13,ART.stoneDark);
      [[134,39],[286,27]].forEach(([x,y])=>{
        paint(g,ART.shadow,x-5,y,20,127);paint(g,ART.stoneDark,x,y,11,125);paint(g,ART.stone,x,y+3,3,116);
        paint(g,ART.stoneDark,x-4,y-1,19,9);paint(g,ART.stone,x-6,y+119,23,7);
        for(let i=0;i<8;i++)paint(g,ART.ridge,x+4,y+13+i*13,7,1);
      });
      pixelPolygon(g,[[180,148],[190,132],[218,123],[253,126],[276,139],[276,154],[250,167],[213,167],[188,159]],ART.stoneDark);
      pixelPolygon(g,[[189,146],[198,136],[219,129],[249,132],[268,141],[269,151],[248,161],[215,162],[197,156]],ART.blue);
      pixelPolygon(g,[[197,146],[205,140],[221,135],[246,137],[261,143],[261,150],[245,155],[218,156],[204,152]],ART.shadow);
      const runes=[[201,137],[221,130],[247,134],[265,144],[257,155],[234,160],[208,157],[192,147]];
      runes.forEach(([x,y],i)=>{
        paint(g,ART.blueLight,x,y,3,2);paint(g,ART.blueLight,x+1,y-2,1,5);
        if(i%2)paint(g,ART.stoneLight,x-1,y-2,3,1);else paint(g,ART.waterLight,x+2,y+2,3,1);
      });
      pixelPolygon(g,[[215,146],[225,139],[243,142],[246,149],[233,152]],ART.blueDark);
      pixelLine(g,219,146,239,146,ART.blue);paint(g,ART.blueLight,229,144,3,2);
      [[152,117],[278,114]].forEach(([x,y])=>{paint(g,ART.bark,x,y,2,20);paint(g,ART.ember,x-2,y-3,6,7);paint(g,ART.hot,x,y-1,2,5);});
      pixelPolygon(g,[[0,0],[36,0],[44,60],[26,115],[48,180],[24,200],[0,200]],ART.shadow);
      pixelPolygon(g,[[320,0],[306,0],[298,77],[312,141],[303,200],[320,200]],ART.shadow);
      for(let i=0;i<17;i++)paint(g,ART.stoneDark,112+i*13%185,169+i*7%29,3,1);
    }

    function drawPortalDamage(g) {
      [[[198,138],[205,145],[201,152],[206,157]],[[248,134],[242,140],[248,148],[245,161]],[[263,145],[252,147],[249,151]],[[213,158],[220,153],[229,152]]].forEach(points=>{
        for(let i=1;i<points.length;i++)pixelLine(g,...points[i-1],...points[i],ART.night);
      });
    }

    // Couche optionnelle: appeler après le décor hatchery, seulement si les œufs
    // sont encore présents dans l'état courant. Jamais dans getSceneArt/cache.
    function drawHatcheryEggs(g) {
      [[234,149],[251,151]].forEach(([x,y])=>{
        pixelPolygon(g,[[x-5,y+8],[x-7,y+3],[x-6,y-4],[x-2,y-11],[x+2,y-12],[x+6,y-5],[x+7,y+3],[x+4,y+8]],ART.shadow);
        pixelPolygon(g,[[x-4,y+5],[x-5,y],[x-3,y-7],[x,y-9],[x+1,y-2],[x-1,y+4]],ART.stoneDark);
        paint(g,ART.blueDark,x-2,y-6,2,3);
      });
    }

    // Décors des conseils et des enquêtes. Interprétation visuelle des lieux
    // documentés, sans héros, cadavres ni dragon de combat dans le cache.
    function drawCouncilArt(g) {
      paint(g,ART.night,0,0,320,200);
      pixelPolygon(g,[[0,0],[320,0],[320,126],[289,135],[250,131],[209,141],[160,130],[110,139],[55,129],[0,143]],ART.stoneDark);
      for(let i=0;i<7;i++) {
        const x=20+i*48;
        paint(g,ART.wallDark,x,4,2,111);paint(g,ART.stone,x+2,4,2,111);
        pixelPolygon(g,[[x-4,5],[x+8,5],[x+6,13],[x-3,13]],ART.stoneLight);
      }
      [153,211,269].forEach((x,i)=>{
        pixelPolygon(g,[[x-16,91],[x-16,42],[x-10,28],[x,20],[x+10,28],[x+16,42],[x+16,91]],ART.shadow);
        pixelPolygon(g,[[x-12,86],[x-12,43],[x-7,32],[x,26],[x+7,32],[x+12,43],[x+12,86]],ART.blueDark);
        paint(g,ART.blueLight,x-10,43,19,1);paint(g,ART.stoneDark,x-1,27,2,60);
        paint(g,ART.fog,x-8,46,2,34);paint(g,ART.waterLight,x+6,47,2,34);
        pixelPolygon(g,[[x-13,94],[x+14,94],[x+23,132],[x-23,132]],ART.ridge);
        const banner=[ART.roof,ART.cloak,ART.blue][i];
        paint(g,banner,x+21,34,13,45);pixelPolygon(g,[[x+21,79],[x+27,86],[x+34,79]],banner);
        paint(g,ART.accent,x+23,36,9,1);pixelLine(g,x+25,47,x+30,55,ART.pathLight);pixelLine(g,x+30,47,x+25,55,ART.pathLight);
      });
      paint(g,ART.wallDark,0,128,320,72);
      for(let row=0;row<5;row++) {
        const y=131+row*15;
        paint(g,ART.stoneDark,0,y,320,1);
        for(let col=0;col<11;col++)pixelLine(g,col*33+row%2*14,y,col*33+row%2*14-8,y+15,ART.stoneDark);
      }
      pixelPolygon(g,[[92,200],[143,144],[232,144],[304,200]],ART.roofDark);
      pixelLine(g,103,199,149,150,ART.accent);pixelLine(g,292,199,229,150,ART.accent);
      [[139,132],[165,126],[195,124],[226,127],[253,135]].forEach(([x,y])=>{
        paint(g,ART.timber,x-5,y-12,12,25);paint(g,ART.pathLight,x-3,y-10,8,1);
        paint(g,ART.roofDark,x-2,y-8,6,18);paint(g,ART.timber,x-7,y+10,16,4);
      });
      pixelPolygon(g,[[117,144],[143,132],[228,130],[268,142],[289,159],[268,177],[147,179],[109,164]],ART.timber);
      pixelPolygon(g,[[117,141],[143,129],[228,127],[268,139],[289,156],[268,171],[147,173],[109,160]],ART.path);
      pixelPolygon(g,[[129,143],[150,134],[227,132],[262,142],[276,155],[260,166],[151,167],[122,158]],ART.cloak);
      pixelLine(g,142,139,257,156,ART.pathLight);pixelLine(g,147,157,260,144,ART.pathLight);
      [[159,147],[184,141],[223,145],[244,155]].forEach(([x,y],i)=>{
        paint(g,ART.moon,x,y,10,6);paint(g,ART.wallDark,x+2,y+2,6,1);paint(g,ART.wallDark,x+2,y+4,4,1);
        if(i%2)paint(g,ART.roofDark,x+7,y+4,3,3);
      });
      [[145,150],[211,139],[267,151]].forEach(([x,y])=>{
        paint(g,ART.pathLight,x-2,y+5,6,2);paint(g,ART.moon,x,y-5,2,10);paint(g,ART.hot,x,y-7,2,3);
      });
      [151,185,222,255].forEach((x,i)=>{
        const y=174+i%2*2;
        paint(g,ART.timber,x-5,y,13,26);paint(g,ART.roofDark,x-2,y+3,7,16);paint(g,ART.pathLight,x-3,y+1,9,1);
      });
      paint(g,ART.shadow,0,0,70,200);paint(g,ART.stoneDark,57,0,12,200);paint(g,ART.stone,69,0,3,200);
      pixelPolygon(g,[[0,0],[104,0],[83,17],[72,35],[60,42],[0,32]],ART.shadow);
    }

    function drawTombArt(g) {
      [ART.sky,ART.dusk,ART.haze,ART.path,ART.cloak].forEach((color,i)=>paint(g,color,0,i*28,320,28));
      pixelDisc(g,265,48,12,ART.pathLight);
      pixelPolygon(g,[[0,132],[0,100],[34,87],[80,103],[116,80],[146,95],[183,76],[220,91],[262,79],[320,97],[320,200],[0,200]],ART.wallDark);
      pixelPolygon(g,[[0,158],[43,135],[85,143],[125,125],[158,137],[187,113],[226,125],[273,110],[320,125],[320,200],[0,200]],ART.path);
      pixelPolygon(g,[[89,200],[128,171],[162,150],[180,126],[252,121],[278,144],[320,167],[320,200]],ART.pathLight);
      paint(g,ART.stoneDark,148,66,142,92);paint(g,ART.stone,155,64,130,88);
      for(let row=0;row<8;row++) {
        paint(g,ART.wallDark,154,68+row*11,133,1);
        for(let col=0;col<6;col++)paint(g,ART.wallDark,155+col*25+row%2*10,69+row*11,1,10);
      }
      pixelPolygon(g,[[142,68],[158,54],[281,54],[296,68]],ART.stoneLight);
      paint(g,ART.wallDark,150,58,138,4);paint(g,ART.cloak,158,51,120,4);
      paint(g,ART.shadow,199,84,45,73);paint(g,ART.night,204,88,35,69);
      paint(g,ART.stoneLight,193,80,6,78);paint(g,ART.wallDark,244,79,7,79);
      paint(g,ART.stoneDark,194,78,57,7);paint(g,ART.pathLight,197,79,51,1);
      for(let i=0;i<5;i++) {
        const y=155+i*6,x=191-i*7;
        paint(g,i%2?ART.stone:ART.wallDark,x,y,65+i*14,6);paint(g,ART.pathLight,x,y,65+i*14,1);
      }
      [[169,155],[269,155]].forEach(([x,y],i)=>{
        paint(g,ART.wallDark,x-7,y-11,17,12);paint(g,ART.stoneLight,x-8,y-12,19,3);
        pixelPolygon(g,[[x-5,y-13],[x-4,y-46],[x-7,y-62],[x-3,y-71],[x+3,y-72],[x+7,y-63],[x+5,y-46],[x+8,y-13]],ART.stoneDark);
        pixelLine(g,x-2,y-59,x+2,y-48,ART.stoneLight);paint(g,ART.pathLight,x-3,y-64,8,2);
        paint(g,ART.shadow,x-2,y-63,6,1);paint(g,ART.stone,x-3,y-46,3,29);
        pixelLine(g,x+6,y-45,x+8,y-21,ART.wallDark);
      });
      pixelPolygon(g,[[0,191],[25,179],[56,183],[89,172],[117,193],[137,200],[0,200]],ART.soil);
      for(let i=0;i<55;i++)paint(g,i%3?ART.cloak:ART.wallDark,i*31%320,151+i*13%49,2+i%4,1);
      pixelPolygon(g,[[277,0],[320,0],[320,200],[310,191],[299,159],[307,128],[295,97],[303,60],[286,40]],ART.shadow);
      paint(g,ART.stoneDark,300,154,8,22);pixelLine(g,301,151,307,153,ART.pathLight);
    }

    function drawIceSeaArt(g) {
      [ART.sky,ART.blueDark,ART.blue,ART.blueLight,ART.fog].forEach((color,i)=>paint(g,color,0,i*22,320,22));
      pixelPolygon(g,[[0,104],[38,93],[77,102],[113,84],[148,104],[179,91],[217,105],[250,89],[285,96],[320,84],[320,131],[0,131]],ART.blueDark);
      paint(g,ART.river,0,107,320,93);
      for(let band=0;band<8;band++) {
        const y=111+band*12;
        paint(g,band%2?ART.waterLight:ART.blueDark,0,y,320,2);
        for(let i=0;i<14;i++)paint(g,band%2?ART.blueLight:ART.blue,4+i*27+band%2*9,y+5,i%3*4+6,1);
      }
      pixelPolygon(g,[[177,115],[187,82],[198,75],[206,44],[222,32],[230,58],[240,36],[251,18],[263,57],[276,53],[289,82],[309,97],[320,117]],ART.blueLight);
      pixelPolygon(g,[[177,115],[196,94],[206,67],[220,51],[222,33],[231,62],[239,60],[251,19],[254,73],[276,54],[282,95],[307,107],[320,117]],ART.fog);
      pixelPolygon(g,[[197,107],[211,87],[215,67],[225,62],[231,84],[239,72],[252,49],[254,91],[267,99],[278,91],[291,113]],ART.moon);
      pixelLine(g,206,68,201,108,ART.waterLight);pixelLine(g,231,65,231,93,ART.blue);pixelLine(g,251,26,246,70,ART.blueLight);
      pixelLine(g,268,66,274,107,ART.blue);paint(g,ART.blueDark,244,101,14,9);
      pixelPolygon(g,[[174,117],[188,123],[242,125],[287,121],[319,118],[304,130],[237,135],[188,129]],ART.blue);
      for(let i=0;i<14;i++)paint(g,i%2?ART.fog:ART.blueLight,178+i*11,119+i%3*3,7,1);
      pixelPolygon(g,[[98,160],[111,164],[189,164],[206,153],[199,169],[186,177],[117,176],[105,170]],ART.shadow);
      pixelPolygon(g,[[103,155],[120,162],[185,162],[202,150],[200,159],[187,168],[118,169],[108,164]],ART.timber);
      pixelLine(g,111,164,188,164,ART.pathLight);pixelLine(g,119,172,185,173,ART.wallDark);
      paint(g,ART.wallDark,121,155,65,6);paint(g,ART.cloak,129,150,17,9);paint(g,ART.timber,130,146,15,4);
      paint(g,ART.bark,158,87,3,76);pixelLine(g,159,85,116,159,ART.wallDark);pixelLine(g,159,85,198,155,ART.wallDark);
      pixelLine(g,138,103,188,103,ART.timber);
      pixelPolygon(g,[[140,105],[183,105],[187,134],[169,140],[144,133]],ART.cloak);
      pixelPolygon(g,[[140,105],[145,132],[157,135],[156,105]],ART.moon);
      pixelLine(g,162,105,164,138,ART.pathLight);pixelLine(g,175,105,179,135,ART.pathLight);
      for(let i=0;i<6;i++)pixelLine(g,121+i*12,163,122+i*12,171,ART.path);
      [[26,170,20],[69,139,15],[218,163,25],[289,181,27]].forEach(([x,y,w],i)=>{
        pixelPolygon(g,[[x,y],[x+w/3,y-4],[x+w,y-1],[x+w-3,y+3],[x+2,y+4]],i%2?ART.fog:ART.blueLight);
        paint(g,ART.waterLight,x+4,y+6,w-5,1);
      });
    }

    function drawIceCaveArt(g) {
      paint(g,ART.night,0,0,320,200);
      pixelPolygon(g,[[0,0],[320,0],[320,200],[0,200]],ART.blueDark);
      pixelPolygon(g,[[94,177],[100,65],[129,35],[179,21],[224,28],[263,60],[274,176]],ART.shadow);
      pixelPolygon(g,[[151,154],[153,88],[178,67],[217,72],[237,96],[238,159]],ART.night);
      pixelPolygon(g,[[0,161],[48,148],[97,158],[149,146],[205,157],[266,144],[320,163],[320,200],[0,200]],ART.blue);
      pixelPolygon(g,[[87,200],[137,171],[185,155],[230,164],[280,153],[320,174],[320,200]],ART.waterLight);
      pixelPolygon(g,[[148,200],[176,173],[225,168],[276,175],[320,198],[320,200]],ART.fog);
      [[19,56],[58,38],[95,73],[128,46],[275,71],[309,55]].forEach(([x,h],i)=>{
        const w=12+i%3*3;
        pixelPolygon(g,[[x-w,0],[x+w,0],[x+5,h/2],[x+1,h],[x-5,h/2]],i%2?ART.blueLight:ART.blue);
        pixelLine(g,x-5,3,x,h-7,ART.fog);
      });
      [[22,200,94],[66,181,71],[280,200,126],[308,200,94]].forEach(([x,y,h],i)=>{
        pixelPolygon(g,[[x-16,y],[x-8,y-h+18],[x+1,y-h],[x+11,y-h+22],[x+19,y]],ART.blueLight);
        pixelPolygon(g,[[x+1,y-h],[x+4,y],[x+19,y],[x+11,y-h+22]],ART.blue);
        pixelLine(g,x-5,y-h+20,x-9,y-1,ART.fog);
      });
      pixelPolygon(g,[[165,116],[179,125],[228,125],[240,113],[234,133],[223,139],[178,137]],ART.timber);
      pixelLine(g,178,129,228,130,ART.wallDark);paint(g,ART.bark,207,92,2,35);pixelLine(g,190,100,224,101,ART.wallDark);
      pixelPolygon(g,[[160,138],[172,130],[211,138],[241,132],[251,148],[224,156],[183,147]],ART.blueLight);
      pixelLine(g,173,133,184,143,ART.fog);pixelLine(g,222,141,238,136,ART.fog);
      for(let i=0;i<28;i++) {
        const x=79+i*13%233,y=164+i*11%34;
        pixelLine(g,x,y,x+7+i%4,y-3,ART.blueDark);
        if(i%3===0)pixelLine(g,x+4,y-1,x+11,y+4,ART.blueLight);
      }
      pixelPolygon(g,[[0,0],[29,0],[43,76],[34,139],[52,200],[0,200]],ART.shadow);
    }

    function drawForestArt(g) {
      paint(g,ART.sky,0,0,320,200);paint(g,ART.grass,0,121,320,79);
      for(let i=0;i<15;i++)drawPine(g,15+i*24,140+i%3*9,95+i%4*13,i%2?ART.tree:ART.grassLight);
      pixelPolygon(g,[[175,76],[201,66],[234,77],[264,68],[302,92],[320,82],[320,166],[178,160]],ART.stoneDark);
      pixelPolygon(g,[[191,82],[211,78],[235,88],[261,78],[295,99],[313,91],[320,158],[189,162]],ART.stone);
      paint(g,ART.stoneDark,207,102,66,54);
      pixelPolygon(g,[[211,156],[211,112],[219,99],[233,91],[247,98],[255,112],[255,156]],ART.shadow);
      pixelPolygon(g,[[218,156],[218,116],[224,106],[233,102],[242,108],[247,119],[247,156]],ART.night);
      [203,259].forEach((x,i)=>{
        paint(g,ART.wallDark,x,103,6,55);paint(g,ART.stoneLight,x,104,2,50);
        paint(g,ART.stoneDark,x-3,100,12,5);paint(g,ART.stoneDark,x-4,154,14,5);
        pixelLine(g,x+1,108,x+5,143,ART.grass);
      });
      pixelPolygon(g,[[201,102],[208,94],[229,83],[250,91],[270,102]],ART.stoneDark);
      pixelLine(g,207,100,230,88,ART.stoneLight);pixelLine(g,232,88,263,99,ART.wallDark);
      for(let row=0;row<5;row++)for(let col=0;col<7;col++)paint(g,ART.wallDark,192+col*17+row%2*7,112+row*9,14,1);
      pixelPolygon(g,[[279,68],[289,68],[293,104],[290,129],[298,157],[284,169],[274,160],[280,131],[277,103]],ART.waterLight);
      [280,284,289].forEach((x,i)=>pixelLine(g,x,76,x+2,157,ART.fog));
      pixelPolygon(g,[[181,167],[207,158],[237,163],[267,157],[299,161],[320,174],[320,200],[165,200]],ART.river);
      for(let i=0;i<19;i++)paint(g,i%2?ART.waterLight:ART.blue,175+i*11,177+i*7%20,4+i%4,1);
      pixelPolygon(g,[[52,200],[89,178],[132,168],[174,161],[194,160],[177,170],[133,180],[105,200]],ART.path);
      for(let i=0;i<45;i++)paint(g,i%3?ART.grassLight:ART.tree,i*23%320,145+i*17%54,2+i%3,1);
      [[12,200,197],[64,198,165],[119,185,147],[312,200,188]].forEach(([x,y,h],i)=>{
        paint(g,ART.bark,x,y-h,7,h);paint(g,ART.timber,x+2,y-h,2,h);
        pixelLine(g,x+3,y-h+42,x+23,y-h+17,ART.bark);
        pixelLine(g,x+4,y-h+68,x-22,y-h+43,ART.bark);
        for(let j=0;j<4;j++)pixelDisc(g,x-12+j*12,y-h+8+(j%2)*10,18+j%2*5,ART.tree);
      });
      pixelPolygon(g,[[0,0],[320,0],[320,15],[274,21],[229,10],[181,25],[134,14],[83,27],[44,12],[0,27]],ART.tree);
      for(let i=0;i<13;i++)paint(g,ART.grassLight,145+i*13%170,95+i*7%53,3,2);
    }

    function drawMetallicDragon(g,x,y,w,h,color,reverse=false) {
      const point=(a,b)=>[reverse?x+w-a*w:x+a*w,y+b*h];
      const shape=(points,shade)=>pixelPolygon(g,points.map(([a,b])=>point(a,b)),shade);
      shape([[.1,.8],[.01,.62],[.12,.39],[.2,.09],[.43,.43],[.57,.58],[.82,.75],[.91,.88]],ART.shadow);
      shape([[.1,.77],[.1,.56],[.22,.15],[.39,.47],[.6,.71]],color);
      shape([[.22,.22],[.24,.56],[.46,.65],[.39,.48]],ART.wallDark);
      shape([[.12,.8],[.28,.67],[.54,.66],[.71,.77],[.79,.92],[.32,.95]],color);
      shape([[.53,.72],[.53,.44],[.6,.22],[.73,.14],[.86,.24],[.83,.36],[.72,.4],[.69,.7]],color);
      shape([[.67,.19],[.65,.03],[.73,.17],[.8,.04],[.8,.22]],ART.stoneLight);
      shape([[.75,.25],[.99,.28],[.97,.35],[.82,.36]],color);
      const eye=point(.79,.25);paint(g,ART.night,eye[0],eye[1],2,1);
      shape([[.28,.88],[.27,1],[.39,1],[.45,.88]],ART.wallDark);
      shape([[.61,.88],[.65,1],[.78,1],[.74,.87]],ART.wallDark);
      shape([[.23,.9],[.09,.96],[0,.9],[.05,1],[.25,.98]],color);
    }

    function drawDragonAudienceArt(g) {
      paint(g,ART.night,0,0,320,200);
      pixelPolygon(g,[[0,0],[320,0],[320,146],[276,134],[222,145],[171,134],[110,147],[49,133],[0,145]],ART.stoneDark);
      for(let i=0;i<7;i++) {
        const x=18+i*48;
        paint(g,ART.wallDark,x,0,8,130);paint(g,ART.stone,x+1,0,2,130);
        pixelPolygon(g,[[x-3,0],[x+13,0],[x+9,9],[x,9]],ART.stoneLight);
      }
      [135,193,251,307].forEach((x,i)=>{
        pixelPolygon(g,[[x-16,79],[x-16,39],[x-10,23],[x,13],[x+10,23],[x+16,39],[x+16,79]],ART.shadow);
        pixelPolygon(g,[[x-11,75],[x-11,41],[x-6,28],[x,21],[x+6,28],[x+11,41],[x+11,75]],ART.blueDark);
        paint(g,ART.blueLight,x-8,40,2,32);paint(g,ART.stoneDark,x,23,2,50);
      });
      paint(g,ART.ridge,0,138,320,62);
      pixelPolygon(g,[[85,200],[126,165],[186,148],[250,154],[304,176],[320,200]],ART.stone);
      for(let i=0;i<8;i++)pixelLine(g,105+i*28,199,180+i*8,153,ART.wallDark);
      paint(g,ART.wallDark,0,164,320,1);paint(g,ART.wallDark,0,186,320,1);
      [[121,127,35,28],[162,115,35,28],[209,114,35,29],[251,124,35,29],[286,143,33,29]].forEach(([x,y,w,h])=>{
        pixelPolygon(g,[[x-6,y+h],[x+w+7,y+h],[x+w+14,y+h+8],[x-14,y+h+8]],ART.stoneDark);
        paint(g,ART.stoneLight,x-9,y+h,w+18,2);
      });
      drawMetallicDragon(g,119,98,36,54,ART.cloak);
      drawMetallicDragon(g,161,86,38,54,ART.pathLight);
      drawMetallicDragon(g,207,85,39,55,ART.fog,true);
      drawMetallicDragon(g,250,94,38,57,ART.glow,true);
      drawMetallicDragon(g,283,113,36,56,ART.accent,true);
      pixelPolygon(g,[[167,190],[178,182],[192,182],[203,190],[191,196],[179,196]],ART.wallDark);
      pixelPolygon(g,[[174,190],[181,186],[190,187],[196,190],[188,193],[180,193]],ART.pathLight);
      paint(g,ART.shadow,0,0,65,200);paint(g,ART.stoneDark,61,0,8,200);paint(g,ART.stone,68,0,2,200);
    }

    function getSceneArt(key, fresh = false) {
      if (fresh || !uiState.art[key]) {
        const layer = document.createElement('canvas'); layer.width = LOGICAL_WIDTH; layer.height = LOGICAL_HEIGHT;
        const g = layer.getContext('2d'); g.imageSmoothingEnabled = false;
        if(key!=='dragon-flight') ({ street: drawStreet, keep: drawKeep, wall: drawKeep, tunnel: drawTunnel, temple: drawTemple, mill: drawMill, duel: drawDuel, cave_duel: drawCaveDuel,
          cult_camp:drawCampArt,hatchery:drawHatcheryArt,caravan:drawCaravanArt,carnath:drawRoadhouseArt,marsh:drawMarshArt,skyreach:drawSkyreachArt,lodge:drawLodgeArt,portal:drawPortalArt,
          council:drawCouncilArt,tomb:drawTombArt,ice_sea:drawIceSeaArt,ice_cave:drawIceCaveArt,forest:drawForestArt,dragon_audience:drawDragonAudienceArt }[key] ?? drawVerdure)(g);
        if (fresh) return layer;
        uiState.art[key] = layer;
      }
      return uiState.art[key];
    }

