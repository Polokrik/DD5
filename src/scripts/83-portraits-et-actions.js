    function getPortrait(id) {
      if (uiState.portraits[id]) return uiState.portraits[id];
      const person = PRESENTATION.people[id] ?? PRESENTATION.people.bjolnir;
      const face = document.createElement('canvas'); face.width = 32; face.height = 48;
      const g = face.getContext('2d'); g.imageSmoothingEnabled = false;
      paint(g, ART.sky, 0, 0, 32, 48); paint(g, ART.ridge, 2, 2, 28, 44);
      pixelPolygon(g, [[0,48],[2,35],[10,30],[22,30],[30,35],[32,48]], person.coat);
      paint(g, person.skin, 13, 26, 6, 8); paint(g, person.hair, 7, 8, 18, 19);
      paint(g, person.skin, 9, 13, 14, 15); paint(g, person.skin, 7, 17, 18, 5);
      paint(g, person.hair, 9, 8, 14, 5); paint(g, person.hair, 7, 11, 4, 6);
      paint(g, ART.shadow, 11, 19, 3, 2); paint(g, ART.shadow, 19, 19, 3, 2);
      paint(g, ART.hot, 12, 19, 1, 1); paint(g, ART.hot, 19, 19, 1, 1);
      paint(g, ART.wallDark, 15, 22, 2, 3); paint(g, ART.wallDark, 13, 27, 6, 1);
      if (id === 'bjolnir') {
        pixelPolygon(g, [[8,23],[13,25],[18,24],[24,22],[23,32],[17,37],[10,32]], person.hair);
        paint(g, ART.ember, 12, 28, 2, 8); paint(g, ART.cloak, 15, 34, 4, 2); paint(g, ART.armor, 2, 35, 7, 7); paint(g, ART.armor, 24, 35, 6, 7);
      } else if (id === 'ellyjobell') {
        paint(g, person.hair, 5, 14, 4, 16); paint(g, person.hair, 23, 14, 4, 16);
        pixelPolygon(g, [[7,12],[9,7],[16,10],[23,6],[25,12]], ART.grassLight); paint(g, ART.cloak, 15, 34, 3, 3);
      } else if (id === 'kairon') {
        pixelPolygon(g, [[7,13],[6,3],[11,7],[12,13]], ART.stoneLight); pixelPolygon(g, [[20,13],[22,4],[26,2],[24,15]], ART.stoneLight);
      } else if (['drekthar', 'sislay'].includes(id)) {
        paint(g, ART.moon, 10, 25, 2, 5); paint(g, ART.moon, 21, 25, 2, 5);
      }
      pixelLine(g, 9, 35, 15, 47, ART.shadow); pixelLine(g, 23, 35, 17, 47, ART.shadow);
      uiState.portraits[id] = face.toDataURL(); return uiState.portraits[id];
    }

    function getActionDirection() {
      if (getD20AnimationPending()) return null;
      const report = gameState.lastReport;
      if (!Object.hasOwn(SCENE_DIRECTIONS.actions,report?.optionId)) return null;
      const direction = SCENE_DIRECTIONS.actions[report.optionId];
      if (!direction) return null;
      const actorState=characters[direction.actor]?.state;
      if(direction.actor && !['active','injured'].includes(actorState) && !(report.failed && ['down','dead'].includes(actorState))) return null;
      if (!report.failed) return direction;
      return { ...direction, kind: direction.kind === 'duel' ? 'duel' : 'retreat', fallen: 'hero', caption: 'La tentative échoue; les conséquences sont détaillées ci-dessous.' };
    }

    function startSceneEffect() {
      if (getD20AnimationPending()) return;
      const direction = getActionDirection();
      if (!direction || !uiState.preferences.effects) { uiState.effect = null; return; }
      uiState.effect = { optionId: gameState.lastReport.optionId, startedTick: gameState.tick };
      const sound = { advance: 'retreat', duel: 'clash' }[direction.kind] ?? direction.kind;
      const effect = uiState.effect;
      if (uiState.preferences.sound) activateSound().then(enabled => { if (enabled && uiState.effect === effect) soundscape.play(sound); });
      render(); scheduleAnimation();
    }

    function effectProgress() {
      if (uiState.reducedMotion || !uiState.preferences.effects || !uiState.effect || uiState.effect.optionId !== gameState.lastReport?.optionId) return 1;
      return Math.max(0, Math.min(1,(gameState.tick - uiState.effect.startedTick) / 132));
    }

    function drawSmallPerson(g, id, x, y, fallen = false) {
      const orc = ['drekthar','sislay'].includes(id), skin = orc ? ART.grassLight : ART.pathLight;
      if (fallen) { paint(g, ART.armor, x, y - 4, 12, 4); paint(g, skin, x + 12, y - 4, 4, 4); return; }
      const height = id === 'bjolnir' ? 14 : id === 'ellyjobell' ? 12 : 18;
      paint(g, id === 'darrin' || id === 'ellyjobell' ? ART.cloak : ART.armor, x, y - height + 5, 7, height - 5);
      paint(g, skin, x + 1,y - height,5,5); paint(g, ART.shadow,x + 4,y - height + 2,1,1);
      paint(g, ART.shadow,x,y,2,4); paint(g, ART.shadow,x + 5,y,2,4);
      if (id === 'bjolnir') { paint(g, ART.ember,x + 1,y - height + 4,5,4); pixelLine(g,x + 8,y - 9,x + 12,y - 1,ART.timber); paint(g,ART.stoneLight,x + 10,y - 3,6,3); }
      if (orc) { paint(g,ART.moon,x + 1,y - height + 4,1,2); paint(g,ART.moon,x + 5,y - height + 4,1,2); }
    }

    // Coups : élans brefs et décalés pendant la durée du duel (0 hors des élans).
    function drawFallenFigure(g, x, y, kind) {
      if (kind === 'hero') {
        paint(g, ART.armor, x - 14, y - 7, 24, 7); paint(g, ART.stoneDark, x - 14, y - 2, 24, 2); paint(g, ART.grassLight, x + 10, y - 8, 7, 7);
        paint(g, ART.moon, x + 15, y - 4, 1, 2); pixelLine(g, x - 20, y - 1, x - 38, y - 3, ART.stoneLight);
      } else {
        paint(g, ART.stoneDark, x - 8, y - 10, 38, 10); paint(g, ART.blueDark, x + 30, y - 10, 10, 9); paint(g, ART.blue, x + 31, y - 10, 8, 2);
        pixelLine(g, x - 10, y - 5, x - 26, y - 3, ART.blueDark); pixelLine(g, x - 12, y - 8, x - 36, y - 4, ART.stoneLight);
      }
    }

    // Étincelle d'impact : croix claire de trois images, au point de contact des armes.
    function drawImpactSpark(g, x, y, step) {
      const arms = [2, 4, 3][step % 3];
      paint(g, ART.hot, x - 1, y - 1, 3, 3); paint(g, SB.white, x, y, 1, 1);
      [[-1, 0], [1, 0], [0, -1], [0, 1]].forEach(([dx, dy]) => paint(g, ART.flame, x + dx * arms, y + dy * arms, 1, 1));
      [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([dx, dy]) => paint(g, ART.hot, x + dx * (arms - 1), y + dy * (arms - 1), 1, 1));
    }

    function drawDuelActors(g, direction, progress, reversed = false) {
      const t = uiState.reducedMotion ? 0 : gameState.tick, finished = direction?.kind === 'duel' && progress > .55;
      const fallen = finished ? direction.fallen : null, dueling = direction?.kind === 'duel' && !finished;
      const heroScale = reversed ? .86 : .7, foeScale = reversed ? .62 : .78;
      const heroX = reversed ? 207 : 182, foeX = reversed ? 258 : 250, baseY = reversed ? 174 : 172;
      // Deux coups de Drek’Thar encadrent la riposte de Langdedrosa : anticipation, frappe, impact, récupération.
      const heroFrame = dueling ? attackFrameAt(progress, .03, .17) ?? attackFrameAt(progress, .36, .17) : null;
      const foeFrame = dueling ? attackFrameAt(progress, .19, .15) : null;
      const foeStrike = foeFrame ? { anticipation: -.4, frappe: 1, impact: 1, 'récupération': .35 }[foeFrame.name] : 0;
      let tip = null;
      if (['active','injured'].includes(characters.drekthar.state) || direction?.actor === 'drekthar') {
        if (fallen === 'hero' || characters.drekthar.state === 'dead') drawFallenFigure(g, heroX, baseY, 'hero');
        else tip = drawProtagonist(g, 'drekthar', heroX, baseY, { t, frame: heroFrame, guard: Boolean(foeFrame && (foeFrame.name === 'frappe' || foeFrame.impact)), scale: heroScale });
      }
      if (fallen === 'enemy') drawFallenFigure(g, foeX - 18, baseY + 2, 'foe');
      else drawLangdedrosa(g, foeX, baseY, t, foeStrike, foeScale);
      const impact = (heroFrame?.impact && tip) ? tip : foeFrame?.impact ? { x: heroX + Math.round(34 * heroScale), y: baseY - Math.round(50 * heroScale) } : null;
      if (impact) drawImpactSpark(g, impact.x, impact.y, Math.floor(t / 3));
    }

    // Ville encore fumante à l'aube : colonnes lentes derrière l'enceinte, spectateurs en anneau.
    function drawDuelBackdrop(g, t) {
      drawSmokeColumns(g, t, [[146, 108, 1], [176, 108, 1], [226, 106, 2]]);
      drawSpectators(g, t, [[150, 154, 11], [160, 153, 12], [196, 152, 11], [292, 152, 13]]);
    }
    function drawDuelForeground(g, t) {
      drawSpectators(g, t, [[112, 172, 22], [123, 168, 24], [134, 165, 21], [286, 176, 24], [298, 172, 26], [-2, 204, 38], [304, 206, 34]]);
    }

    function drawSceneAction(g, direction, progress) {
      if (!direction) return;
      const {kind,actor} = direction, step = Math.floor(progress * 20), moving = progress < 1;
      if (actor && kind !== 'duel') {
        const x = ['fog','door'].includes(kind) ? 225 : 176 + Math.min(12,step), t = uiState.reducedMotion ? 0 : gameState.tick;
        if (!SPRITE_MODELS[actor] || ['down','dead'].includes(characters[actor]?.state)) drawSmallPerson(g,actor,x,169,['down','dead'].includes(characters[actor]?.state));
        else {
          const frame = ['clash','hammer','magic'].includes(kind) && moving ? attackFrameAt(progress, .08, .72) : null;
          const tip = drawProtagonist(g, actor, x, 169, { t, frame, guard: kind === 'retreat' && moving, scale: .5 });
          if (frame?.impact && tip) drawImpactSpark(g, tip.x + 4, tip.y, Math.floor(t / 3));
        }
      }
      if (kind === 'fog') {
        for (let i=0;i<4;i++) drawVillager(g,247-i*13-Math.min(42,step*2),171+i%2*3,uiState.reducedMotion ? 0 : gameState.tick,i,.36);
        for (let band=0;band<4;band++) for (let col=0;col<49;col++) {
          const x=126+col*4,y=140+band*10+[2,1,0,0,1,2,3,3][(col+step+band*3)%8];
          paint(g,band%2?ART.blueLight:ART.waterLight,x,y,4,5);
          if(col%2) paint(g,ART.blueLight,x,y-1,2,1);
        }
      } else if (kind === 'hammer' && moving) {
        const radius=7+step*3;
        for(let i=0;i<14;i++) { const angle=i*Math.PI/7; paint(g,ART.pathLight,188+Math.cos(angle)*radius,173+Math.sin(angle)*radius*.3,3,1); }
        if(progress>.35) for(let i=0;i<5;i++) pixelLine(g,218+i*9,172,222+i*9,173,ART.stoneLight);
      } else if (kind === 'magic' && moving) {
        for(let i=0;i<14;i++){const x=191+((i*13+step*4)%100),y=124+((i*17)%47);paint(g,i%3?ART.blueLight:ART.moon,x,y,2,2);}
      } else if (['clash','duel','retreat'].includes(kind) && moving) {
        for(let i=0;i<12;i++) paint(g,ART.pathLight,205+(i*13+step)%64,164+(i*7)%12,2,1);
      } else if (kind === 'door') {
        for(let i=0;i<6;i++) paint(g,ART.stoneLight,271+Math.min(9,step)+i,90,1,62);
      }
    }

