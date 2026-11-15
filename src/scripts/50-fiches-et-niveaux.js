    // Instantanés PDF réels; les valeurs calculées ci-dessous sont une projection de jeu explicite.
    const CHARACTER_SHEETS = {
      bjolnir: {"name":"Bjolnir HautMarteau","level":10,"classKey":"paladin","subclass":"Rédemption","hitDie":10,"abilities":{"str":19,"dex":10,"con":16,"int":8,"wis":12,"cha":16},"armorClass":21,"hitPoints":85,"proficiency":4,"skills":{"acrobatics":{"bonus":0,"rank":0,"ability":"dex"},"animalHandling":{"bonus":1,"rank":0,"ability":"wis"},"arcana":{"bonus":-1,"rank":0,"ability":"int"},"athletics":{"bonus":8,"rank":1,"ability":"str"},"deception":{"bonus":3,"rank":0,"ability":"cha"},"history":{"bonus":-1,"rank":0,"ability":"int"},"insight":{"bonus":5,"rank":1,"ability":"wis"},"intimidation":{"bonus":3,"rank":0,"ability":"cha"},"investigation":{"bonus":-1,"rank":0,"ability":"int"},"medicine":{"bonus":1,"rank":0,"ability":"wis"},"nature":{"bonus":-1,"rank":0,"ability":"int"},"perception":{"bonus":1,"rank":0,"ability":"wis"},"performance":{"bonus":3,"rank":0,"ability":"cha"},"persuasion":{"bonus":7,"rank":1,"ability":"cha"},"religion":{"bonus":3,"rank":1,"ability":"int"},"sleightOfHand":{"bonus":0,"rank":0,"ability":"dex"},"stealth":{"bonus":0,"rank":0,"ability":"dex"},"survival":{"bonus":1,"rank":0,"ability":"wis"}},"saves":{"str":{"bonus":7,"rank":0,"ability":"str"},"dex":{"bonus":3,"rank":0,"ability":"dex"},"con":{"bonus":6,"rank":0,"ability":"con"},"int":{"bonus":2,"rank":0,"ability":"int"},"wis":{"bonus":8,"rank":1,"ability":"wis"},"cha":{"bonus":10,"rank":1,"ability":"cha"}},"spellAbility":"cha","referenceAttacks":[{"name":"Marteau de frappe précise (1 main)","attackBonus":9,"damage":"1d8+5 contondants"},{"name":"Marteau de frappe précise (2 mains)","attackBonus":9,"damage":"1d10+5 contondants"},{"name":"Masse","attackBonus":8,"damage":"1d6+4 contondants"}],"sources":["Bjolnir.pdf:page1 (caractéristiques, niveau, CA, PV, maîtrise, compétences, sauvegardes)","Bjolnir.pdf:page3 (incantation)"],"cautions":["FOR19 et gantelets d’ogre présents; on ne connaît pas la FOR naturelle antérieure.","Les sauvegardes imprimées incluent +3 d’Aura de protection. À niveau inférieur à6, ce bonus ne doit pas être appliqué."],"aura":{"level":6,"ability":"cha","printedBonus":3},"strengthReconstruction":{"base":17,"itemScore":19,"restoreAtLevel":10,"source":"Choix du MJ dans cette conversation: 16/17 minimum, valeur17 retenue pour la reconstitution.","status":"gmReconstruction"}},
      drekthar: {"name":"Drek’Thar","level":5,"classKey":"fighter","subclass":"Champion","hitDie":10,"abilities":{"str":20,"dex":12,"con":16,"int":14,"wis":10,"cha":13},"armorClass":16,"hitPoints":49,"proficiency":3,"skills":{"acrobatics":{"bonus":1,"rank":0,"ability":"dex"},"animalHandling":{"bonus":0,"rank":0,"ability":"wis"},"arcana":{"bonus":2,"rank":0,"ability":"int"},"athletics":{"bonus":8,"rank":1,"ability":"str"},"deception":{"bonus":1,"rank":0,"ability":"cha"},"history":{"bonus":5,"rank":1,"ability":"int"},"insight":{"bonus":0,"rank":0,"ability":"wis"},"intimidation":{"bonus":1,"rank":0,"ability":"cha"},"investigation":{"bonus":2,"rank":0,"ability":"int"},"medicine":{"bonus":0,"rank":0,"ability":"wis"},"nature":{"bonus":2,"rank":0,"ability":"int"},"perception":{"bonus":3,"rank":1,"ability":"wis"},"performance":{"bonus":1,"rank":0,"ability":"cha"},"persuasion":{"bonus":4,"rank":1,"ability":"cha"},"religion":{"bonus":2,"rank":0,"ability":"int"},"sleightOfHand":{"bonus":1,"rank":0,"ability":"dex"},"stealth":{"bonus":1,"rank":0,"ability":"dex"},"survival":{"bonus":0,"rank":0,"ability":"wis"}},"saves":{"str":{"bonus":8,"rank":1,"ability":"str"},"dex":{"bonus":1,"rank":0,"ability":"dex"},"con":{"bonus":6,"rank":1,"ability":"con"},"int":{"bonus":2,"rank":0,"ability":"int"},"wis":{"bonus":0,"rank":0,"ability":"wis"},"cha":{"bonus":1,"rank":0,"ability":"cha"}},"spellAbility":null,"referenceAttacks":[{"name":"Greatsword","attackBonus":8,"damage":"2d6+5 tranchants"},{"name":"Shortsword","attackBonus":8,"damage":"1d6+5 perforants"},{"name":"Light Crossbow","attackBonus":4,"damage":"1d8+1 perforants"},{"name":"Épée 2M de FEU","attackBonus":8,"damage":"2D6+5 + 1D6 (texte de fiche; type du dernier dé non explicité dans la cellule)"}],"sources":["drekthar.pdf:page1 (caractéristiques, niveau, CA, PV, maîtrise, compétences, sauvegardes)","drekthar.pdf:page3 (incantation)"],"cautions":["Intimidation +1 imprimée, sans la maîtrise normalement octroyée au demi-orc5e2014 (qui donnerait +4). Garder le total réel affiché et signaler l’écart."]},
      ellyjobell: {"name":"Ellyjobell Folkor","level":10,"classKey":"druid","subclass":"Cercle du berger (déduit des traits, non écrit dans l’en-tête)","hitDie":8,"abilities":{"str":14,"dex":18,"con":17,"int":17,"wis":18,"cha":12},"armorClass":18,"hitPoints":81,"proficiency":4,"skills":{"acrobatics":{"bonus":4,"rank":0,"ability":"dex"},"animalHandling":{"bonus":4,"rank":0,"ability":"wis"},"arcana":{"bonus":3,"rank":0,"ability":"int"},"athletics":{"bonus":6,"rank":1,"ability":"str"},"deception":{"bonus":1,"rank":0,"ability":"cha"},"history":{"bonus":3,"rank":0,"ability":"int"},"insight":{"bonus":4,"rank":0,"ability":"wis"},"intimidation":{"bonus":1,"rank":0,"ability":"cha"},"investigation":{"bonus":3,"rank":0,"ability":"int"},"medicine":{"bonus":8,"rank":1,"ability":"wis"},"nature":{"bonus":7,"rank":1,"ability":"int"},"perception":{"bonus":4,"rank":0,"ability":"wis"},"performance":{"bonus":1,"rank":0,"ability":"cha"},"persuasion":{"bonus":1,"rank":0,"ability":"cha"},"religion":{"bonus":3,"rank":0,"ability":"int"},"sleightOfHand":{"bonus":4,"rank":0,"ability":"dex"},"stealth":{"bonus":4,"rank":0,"ability":"dex"},"survival":{"bonus":8,"rank":1,"ability":"wis"}},"saves":{"str":{"bonus":2,"rank":0,"ability":"str"},"dex":{"bonus":4,"rank":0,"ability":"dex"},"con":{"bonus":3,"rank":0,"ability":"con"},"int":{"bonus":7,"rank":1,"ability":"int"},"wis":{"bonus":8,"rank":1,"ability":"wis"},"cha":{"bonus":1,"rank":0,"ability":"cha"}},"spellAbility":"wis","referenceAttacks":[{"name":"Bâton (1 main)","attackBonus":6,"damage":"1d6+2 contondants"},{"name":"Bâton (2 mains)","attackBonus":6,"damage":"1d8+2 contondants"},{"name":"Bâton magique","attackBonus":8,"damage":"1d8+4 contondants","note":"Compatible avec Gourdin magique (SAG), ne pas en déduire arbitrairement une arme +2"},{"name":"Flamme","attackBonus":8,"damage":"2d8 feu"},{"name":"Appel de la foudre","saveDC":16,"damage":"3d10 foudre"}],"sources":["Ellyjobell.pdf:page1 (caractéristiques, niveau, CA, PV, maîtrise, compétences, sauvegardes)","Ellyjobell.pdf:page3 (incantation)"],"cautions":["Niveau10 en en-tête, mais l’esprit de l’ours est nommé +14PV (devrait15 au niveau10) et la description de durée de forme sauvage indique2h (niveau10 devrait5h). Ne pas utiliser les fragments périmés comme progression."]},
      darrin: {"name":"Darrin Kloumsihande","level":10,"classKey":"sorcerer","subclass":"Magie sauvage","hitDie":6,"abilities":{"str":11,"dex":13,"con":14,"int":15,"wis":9,"cha":16},"armorClass":11,"hitPoints":62,"proficiency":4,"skills":{"acrobatics":{"bonus":5,"rank":1,"ability":"dex"},"animalHandling":{"bonus":-1,"rank":0,"ability":"wis"},"arcana":{"bonus":6,"rank":1,"ability":"int"},"athletics":{"bonus":0,"rank":0,"ability":"str"},"deception":{"bonus":7,"rank":1,"ability":"cha"},"history":{"bonus":6,"rank":1,"ability":"int"},"insight":{"bonus":-1,"rank":0,"ability":"wis"},"intimidation":{"bonus":3,"rank":0,"ability":"cha"},"investigation":{"bonus":2,"rank":0,"ability":"int"},"medicine":{"bonus":-1,"rank":0,"ability":"wis"},"nature":{"bonus":2,"rank":0,"ability":"int"},"perception":{"bonus":-1,"rank":0,"ability":"wis"},"performance":{"bonus":3,"rank":0,"ability":"cha"},"persuasion":{"bonus":7,"rank":1,"ability":"cha"},"religion":{"bonus":2,"rank":0,"ability":"int"},"sleightOfHand":{"bonus":1,"rank":0,"ability":"dex"},"stealth":{"bonus":1,"rank":0,"ability":"dex"},"survival":{"bonus":-1,"rank":0,"ability":"wis"}},"saves":{"str":{"bonus":0,"rank":0,"ability":"str"},"dex":{"bonus":1,"rank":0,"ability":"dex"},"con":{"bonus":6,"rank":1,"ability":"con"},"int":{"bonus":2,"rank":0,"ability":"int"},"wis":{"bonus":-1,"rank":0,"ability":"wis"},"cha":{"bonus":7,"rank":1,"ability":"cha"}},"spellAbility":"cha","referenceAttacks":[{"name":"Ray of Frost","attackBonus":7,"damage":"2d8 froid"},{"name":"Magic Missile","attackBonus":null,"damage":"1d4+1 force par projectile","note":"Pas de jet d’attaque en règle5e"},{"name":"Light Crossbow","attackBonus":5,"damage":"1d8+1 perforants"},{"name":"Dagger","attackBonus":5,"damage":"1d4+1 perforants"},{"name":"Éclair de chaos","attackBonus":7,"damage":"2d8+1d6"},{"name":"Boule de feu","attackBonusPrinted":7,"damage":"8d6 feu","note":"Cellule affichée +7, mais la règle utilise une sauvegarde DEX (DD de sorts15 ici), pas un jet d’attaque"}],"sources":["darrin.pdf:page1 (caractéristiques, niveau, CA, PV, maîtrise, compétences, sauvegardes)","darrin.pdf:page3 (incantation)"],"cautions":["En-tête ensorceleur10; XP6840 correspond à niveau5. Utiliser l’en-tête comme niveau du snapshot, sans considérer l’XP comme progression actuelle.","Chaos contrôlé (le texte dit niveau14) et Bombardement de sort (niveau18) sont listés sur la fiche10. Ne pas les activer au niveau10 ni plus tôt.","Project Image apparaît deux fois dans les sorts7, alors que l’ensorceleur10 ne dispose pas d’emplacement de sort7."]},
      kairon: {"name":"Kairon Erudit","level":9,"classKey":"warlock","subclass":"Fiélon","hitDie":8,"abilities":{"str":19,"dex":13,"con":15,"int":12,"wis":14,"cha":20},"armorClass":17,"hitPoints":67,"proficiency":4,"skills":{"acrobatics":{"bonus":1,"rank":0,"ability":"dex"},"animalHandling":{"bonus":2,"rank":0,"ability":"wis"},"arcana":{"bonus":1,"rank":0,"ability":"int"},"athletics":{"bonus":4,"rank":0,"ability":"str"},"deception":{"bonus":5,"rank":0,"ability":"cha"},"history":{"bonus":1,"rank":0,"ability":"int"},"insight":{"bonus":2,"rank":0,"ability":"wis"},"intimidation":{"bonus":5,"rank":0,"ability":"cha"},"investigation":{"bonus":1,"rank":0,"ability":"int"},"medicine":{"bonus":2,"rank":0,"ability":"wis"},"nature":{"bonus":1,"rank":0,"ability":"int"},"perception":{"bonus":2,"rank":0,"ability":"wis"},"performance":{"bonus":5,"rank":0,"ability":"cha"},"persuasion":{"bonus":5,"rank":0,"ability":"cha"},"religion":{"bonus":1,"rank":0,"ability":"int"},"sleightOfHand":{"bonus":1,"rank":0,"ability":"dex"},"stealth":{"bonus":1,"rank":0,"ability":"dex"},"survival":{"bonus":2,"rank":0,"ability":"wis"}},"saves":{"str":{"bonus":4,"rank":0,"ability":"str"},"dex":{"bonus":1,"rank":0,"ability":"dex"},"con":{"bonus":2,"rank":0,"ability":"con"},"int":{"bonus":1,"rank":0,"ability":"int"},"wis":{"bonus":2,"rank":0,"ability":"wis"},"cha":{"bonus":5,"rank":0,"ability":"cha"}},"spellAbility":"cha","referenceAttacks":[{"name":"Masse d’arme","attackBonus":8,"damage":"1d6+4 contondants"},{"name":"Dague","attackBonus":5,"damage":"1d4+1 perforants"},{"name":"Quarterstaff","attackBonus":8,"damage":"1d6+5 contondants"},{"name":"Décharge occulte (français)","attackBonusPrinted":5,"damagePrinted":"1d10+5 force","source":"kairon.pdf:page2"},{"name":"Eldritch Blast (anglais)","attackBonusPrinted":9,"damagePrinted":"1d10+4 force","source":"kairon.pdf:page2","note":"Deux entrées incohérentes: avec CHA20, maîtrise4 et Lance agonisante, règle attend +9 / 1d10+5 par rayon"},{"name":"Fire Bolt","attackBonus":9,"damage":"2d10 feu"},{"name":"Ray of Frost","attackBonus":9,"damage":"2d8 froid"}],"sources":["kairon.pdf:page1 (caractéristiques, niveau, CA, PV, maîtrise, compétences, sauvegardes)","kairon.pdf:page3 (incantation)"],"cautions":["La fiche9/PB4 indique sauvegardes SAG+2 et CHA+5 (aucune maîtrise). Un occultiste standard devrait SAG+6/CHA+9. Aucune multiclassage n’est attesté. Garder les valeurs de fiche et afficher la réserve.","Les18 compétences imprimées sont égales aux seuls modificateurs de caractéristiques. Les maîtrises de classe/historique ne sont pas renseignées dans les totaux.","En-tête occultiste9; XP34000 correspond à niveau8.","Quatre emplacements5 sont imprimés; occultiste9 pur dispose normalement de deux emplacements5.","FOR19 et gantelets d’ogre présents; FOR naturelle antérieure inconnue.","Décharge occulte +5/1d10+5 et Eldritch Blast +9/1d10+4 se contredisent; avec caractéristiques actuelles et invocation, calcul standard +9/1d10+5. Hellish Rebuke DD12 page1 vs DD17 page2 et en-tête DD17 page3."],"strengthReconstruction":{"base":17,"itemScore":19,"restoreAtLevel":9,"source":"Choix du MJ dans cette conversation: 16/17 minimum, valeur17 retenue pour la reconstitution.","status":"gmReconstruction"}},
      malar: {"name":"Malar","level":9,"classKey":"rogue","subclass":"Voleur","hitDie":8,"abilities":{"str":12,"dex":19,"con":12,"int":12,"wis":15,"cha":18},"armorClass":17,"hitPoints":58,"proficiency":4,"skills":{"acrobatics":{"bonus":8,"rank":1,"ability":"dex"},"animalHandling":{"bonus":2,"rank":0,"ability":"wis"},"arcana":{"bonus":1,"rank":0,"ability":"int"},"athletics":{"bonus":1,"rank":0,"ability":"str"},"deception":{"bonus":12,"rank":2,"ability":"cha"},"history":{"bonus":1,"rank":0,"ability":"int"},"insight":{"bonus":6,"rank":1,"ability":"wis"},"intimidation":{"bonus":4,"rank":0,"ability":"cha"},"investigation":{"bonus":9,"rank":2,"ability":"int"},"medicine":{"bonus":2,"rank":0,"ability":"wis"},"nature":{"bonus":1,"rank":0,"ability":"int"},"perception":{"bonus":6,"rank":1,"ability":"wis"},"performance":{"bonus":4,"rank":0,"ability":"cha"},"persuasion":{"bonus":4,"rank":0,"ability":"cha"},"religion":{"bonus":1,"rank":0,"ability":"int"},"sleightOfHand":{"bonus":4,"rank":0,"ability":"dex"},"stealth":{"bonus":12,"rank":2,"ability":"dex"},"survival":{"bonus":2,"rank":0,"ability":"wis"}},"saves":{"str":{"bonus":1,"rank":0,"ability":"str"},"dex":{"bonus":8,"rank":1,"ability":"dex"},"con":{"bonus":1,"rank":0,"ability":"con"},"int":{"bonus":5,"rank":1,"ability":"int"},"wis":{"bonus":2,"rank":0,"ability":"wis"},"cha":{"bonus":4,"rank":0,"ability":"cha"}},"spellAbility":null,"referenceAttacks":[{"name":"Rapier","attackBonus":8,"damage":"1d8+4 perforants"},{"name":"Shortbow","attackBonus":8,"damage":"1d6+4 perforants"},{"name":"Dagger","attackBonus":8,"damage":"1d4+4 perforants"}],"sources":["malar.pdf:page1 (caractéristiques, niveau, CA, PV, maîtrise, compétences, sauvegardes)","malar.pdf:page3 (incantation)"],"cautions":["En-tête roublard9; XP5001 correspond à niveau4."]},
      sislay: {"name":"Sislay Baite","level":5,"classKey":"ranger","subclass":"Chasseur","hitDie":10,"abilities":{"str":14,"dex":14,"con":16,"int":11,"wis":10,"cha":14},"armorClass":13,"hitPoints":53,"proficiency":3,"skills":{"acrobatics":{"bonus":2,"rank":0,"ability":"dex"},"animalHandling":{"bonus":0,"rank":0,"ability":"wis"},"arcana":{"bonus":0,"rank":0,"ability":"int"},"athletics":{"bonus":2,"rank":0,"ability":"str"},"deception":{"bonus":2,"rank":0,"ability":"cha"},"history":{"bonus":0,"rank":0,"ability":"int"},"insight":{"bonus":3,"rank":1,"ability":"wis"},"intimidation":{"bonus":5,"rank":1,"ability":"cha"},"investigation":{"bonus":0,"rank":0,"ability":"int"},"medicine":{"bonus":0,"rank":0,"ability":"wis"},"nature":{"bonus":0,"rank":0,"ability":"int"},"perception":{"bonus":0,"rank":0,"ability":"wis"},"performance":{"bonus":2,"rank":0,"ability":"cha"},"persuasion":{"bonus":2,"rank":0,"ability":"cha"},"religion":{"bonus":0,"rank":0,"ability":"int"},"sleightOfHand":{"bonus":2,"rank":0,"ability":"dex"},"stealth":{"bonus":2,"rank":0,"ability":"dex"},"survival":{"bonus":0,"rank":0,"ability":"wis"}},"saves":{"str":{"bonus":5,"rank":1,"ability":"str"},"dex":{"bonus":5,"rank":1,"ability":"dex"},"con":{"bonus":3,"rank":0,"ability":"con"},"int":{"bonus":0,"rank":0,"ability":"int"},"wis":{"bonus":0,"rank":0,"ability":"wis"},"cha":{"bonus":2,"rank":0,"ability":"cha"}},"spellAbility":"wis","referenceAttacks":[{"name":"Rapier","attackBonus":5,"damage":"1d8+2 perforants"},{"name":"Shortbow","attackBonus":5,"damage":"1d6+2 perforants"},{"name":"Arc long","attackBonus":5,"damage":"1d8+2"},{"name":"Hunter’s Mark","damage":"1d6 supplémentaires"},{"name":"Cure Wounds","healingPrinted":"1d8"}],"sources":["sislay.pdf:page1 (caractéristiques, niveau, CA, PV, maîtrise, compétences, sauvegardes)","sislay.pdf:page3 (incantation)"],"cautions":["Rôdeuse5 et sorts/traits de rôdeur corroborés, mais langues/maîtrises d’armes et armure ressemblent à ceux d’un roublard; livre de prière, symbole sacré et compteur Divine Sense paraissent copiés. Ils ne prouvent aucun multiclassage paladin ou roublard.","Seules Perspicacité et Intimidation ont un bonus de maîtrise visible; Discrétion+2, Perception0 et Survie0 sont les vrais totaux imprimés. Ne pas inventer une maîtrise parce que le personnage est une rôdeuse efficace."]}
    };

    function abilityModifier(score) {
      return Math.floor((Number(score) - 10) / 2);
    }

    function proficiencyBonus(level) {
      return 2 + Math.floor((Math.max(1, Math.min(20, Math.floor(Number(level) || 1))) - 1) / 4);
    }

    function getAdventureStats(id, roomId = gameState.roomId) {
      const sheet = CHARACTER_SHEETS[id];
      if (!sheet) return null;
      const requested = Number(getAdventureLevel(roomId));
      const hasAdventureLevel = Number.isInteger(requested) && requested >= 1 && requested <= 20;
      const level = hasAdventureLevel ? requested : sheet.level;
      const abilities = { ...sheet.abilities };
      const strength = sheet.strengthReconstruction;
      if (strength && level < strength.restoreAtLevel) abilities.str = strength.base;
      const modifiers = Object.fromEntries(Object.entries(abilities).map(([key, score]) => [key, abilityModifier(score)]));
      const proficiency = proficiencyBonus(level);
      const averageGain = Math.max(1, Math.floor(sheet.hitDie / 2) + 1 + modifiers.con);
      const hitPoints = level === sheet.level ? sheet.hitPoints
        : level > sheet.level ? sheet.hitPoints + (level - sheet.level) * averageGain
        : Math.max(1, sheet.hitDie + modifiers.con) + (level - 1) * averageGain;
      const skills = Object.fromEntries(Object.entries(sheet.skills).map(([key, skill]) => [key, {
        ability: skill.ability, rank: skill.rank, bonus: modifiers[skill.ability] + skill.rank * proficiency,
        referenceBonus: skill.bonus
      }]));
      const conscious = typeof characters === 'undefined' || !['dead', 'down', 'absent', 'captured', 'retired'].includes(characters[id]?.state);
      const aura = sheet.aura && level >= sheet.aura.level && conscious ? Math.max(1, modifiers[sheet.aura.ability]) : 0;
      const saves = Object.fromEntries(Object.entries(sheet.saves).map(([key, save]) => [key, {
        ability: key, rank: save.rank, bonus: modifiers[key] + save.rank * proficiency + aura,
        referenceBonus: save.bonus
      }]));
      const cautions = [];
      if (strength && level < strength.restoreAtLevel) cautions.push('FOR 17 reconstituée avec le MJ avant les gantelets; la date exacte de leur acquisition reste inconnue.');
      if (id === 'kairon') cautions.push('Les maîtrises de compétences et de sauvegardes manquent sur la fiche; les totaux imprimés sont conservés comme référence.');
      if (id === 'sislay') cautions.push('Certaines maîtrises de la fiche sont incomplètes; Discrétion reste sans maîtrise attestée.');
      return {
        id, name: sheet.name, level, hasAdventureLevel, referenceLevel: sheet.level,
        classKey: sheet.classKey, abilities, modifiers, proficiency, hitPoints,
        hitPointsAreEstimate: level !== sheet.level, armorClassReference: sheet.armorClass,
        skills, saves, auraBonus: aura,
        meleeAttackBonus: modifiers.str + proficiency,
        rangedAttackBonus: modifiers.dex + proficiency,
        spellAttackBonus: sheet.spellAbility ? modifiers[sheet.spellAbility] + proficiency : null,
        spellSaveDC: sheet.spellAbility ? 8 + modifiers[sheet.spellAbility] + proficiency : null,
        spellAbility: sheet.spellAbility, reference: sheet,
        projectionLabel: 'Caractéristiques de référence et maîtrise adaptée au niveau de la scène',
        attackNote: 'Bonus de base hors bonus magique d’arme. Les attaques imprimées restent dans la référence PDF.',
        cautions
      };
    }

    function renderCharacterStats(container, id) {
      const stats = getAdventureStats(id);
      if (!stats) return;
      const signed = value => (value >= 0 ? '+' : '') + value;
      const labels = { str: 'FOR', dex: 'DEX', con: 'CON', int: 'INT', wis: 'SAG', cha: 'CHA' };
      const element = (tag, text, className) => {
        const node = document.createElement(tag);
        if (text !== undefined) node.textContent = text;
        if (className) node.className = className;
        return node;
      };
      const section = element('section', undefined, 'character-stats');
      section.setAttribute('aria-label', 'Statistiques de ' + stats.name);
      section.appendChild(element('h4', 'Caractéristiques et épreuves'));
      section.appendChild(element('p', (stats.hasAdventureLevel ? 'Niveau de la scène ' : 'Niveau de la fiche ') +
        stats.level + ' · Maîtrise ' + signed(stats.proficiency) + ' · ' +
        (stats.hitPointsAreEstimate ? 'PV estimés ' : 'PV de la fiche ') + stats.hitPoints, 'stats-summary'));
      section.appendChild(element('p', 'Référence PDF: niveau ' + stats.referenceLevel +
        ' · PV ' + stats.reference.hitPoints + ' · CA ' + stats.armorClassReference, 'stats-reference'));
      const table = element('table', undefined, 'stats-table');
      table.appendChild(element('caption', 'Projection de jeu et valeurs réelles de la fiche'));
      const head = element('thead'), headRow = element('tr');
      ['Caractéristique', 'Dans cette scène', 'Fiche N' + stats.referenceLevel].forEach(label => headRow.appendChild(element('th', label)));
      head.appendChild(headRow); table.appendChild(head);
      const body = element('tbody');
      Object.entries(labels).forEach(([key, label]) => {
        const row = element('tr'), name = element('th', label); name.setAttribute('scope', 'row'); row.appendChild(name);
        row.appendChild(element('td', stats.abilities[key] + ' (' + signed(stats.modifiers[key]) + ')'));
        row.appendChild(element('td', stats.reference.abilities[key] + ' (' + signed(abilityModifier(stats.reference.abilities[key])) + ')'));
        body.appendChild(row);
      });
      table.appendChild(body); section.appendChild(table);
      const saveText = Object.entries(labels).map(([key, label]) => label + ' ' + signed(stats.saves[key].bonus)).join(' · ');
      section.appendChild(element('p', 'Sauvegardes projetées: ' + saveText +
        (stats.auraBonus ? ' · Aura de protection incluse: ' + signed(stats.auraBonus) : ''), 'stats-saves'));
      const details = element('details');
      details.appendChild(element('summary', 'Compétences, sauvegardes et attaques'));
      const skillLabels = {acrobatics:'Acrobaties',animalHandling:'Dressage',arcana:'Arcanes',athletics:'Athlétisme',deception:'Tromperie',history:'Histoire',insight:'Perspicacité',intimidation:'Intimidation',investigation:'Investigation',medicine:'Médecine',nature:'Nature',perception:'Perception',performance:'Représentation',persuasion:'Persuasion',religion:'Religion',sleightOfHand:'Escamotage',stealth:'Discrétion',survival:'Survie'};
      renderBonusTable(details,'Compétences',stats.skills,skillLabels,stats.referenceLevel);
      renderBonusTable(details,'Jets de sauvegarde',stats.saves,labels,stats.referenceLevel);
      details.appendChild(element('p',`Attaques de base dans cette scène : mêlée ${signed(stats.meleeAttackBonus)}, à distance ${signed(stats.rangedAttackBonus)}${stats.spellAttackBonus === null ? '' : `, sorts ${signed(stats.spellAttackBonus)} · DD des sorts ${stats.spellSaveDC}`}.`, 'stats-saves'));
      details.appendChild(element('p',stats.attackNote,'stats-caution'));
      details.appendChild(element('p',`Attaques imprimées sur la fiche : ${stats.reference.referenceAttacks.map(attack => `${attack.name} ${Number.isFinite(attack.attackBonus ?? attack.attackBonusPrinted) ? signed(attack.attackBonus ?? attack.attackBonusPrinted) : ''} (${attack.damage ?? attack.damagePrinted ?? attack.healingPrinted ?? 'voir fiche'})`).join(' ; ')}.`, 'stats-reference'));
      section.appendChild(details);
      section.appendChild(element('p',
        'Les scores de la fiche restent la référence. La maîtrise suit le niveau du chapitre; les PV estimés utilisent la moyenne de la classe. La CA affichée appartient à la fiche, sans équipement rétroactif.',
        'stats-caution'));
      stats.cautions.forEach(note => section.appendChild(element('p', note, 'stats-caution')));
      container.appendChild(section);
    }

    function renderBonusTable(container, caption, entries, labels, referenceLevel) {
      const table = document.createElement('table'); table.className = 'stats-table';
      const title = document.createElement('caption'); title.textContent = caption; table.appendChild(title);
      const head = document.createElement('thead'), headings = document.createElement('tr');
      ['Aptitude','Dans cette scène',`Fiche N${referenceLevel}`].forEach(label => {
        const cell = document.createElement('th'); cell.textContent = label; headings.appendChild(cell);
      });
      head.appendChild(headings); table.appendChild(head);
      const body = document.createElement('tbody'), signed = value => `${value >= 0 ? '+' : ''}${value}`;
      Object.entries(entries).forEach(([key, entry]) => {
        const row = document.createElement('tr'), label = document.createElement('th');
        label.setAttribute('scope','row'); label.textContent = labels[key] ?? key; row.appendChild(label);
        [entry.bonus,entry.referenceBonus].forEach(bonus => {
          const cell = document.createElement('td'); cell.textContent = signed(bonus); row.appendChild(cell);
        });
        body.appendChild(row);
      });
      table.appendChild(body); container.appendChild(table);
    }

    function getAdventureLevel(roomId = gameState.roomId) {
      if (DATA.actRooms.ACT_V.includes(roomId)) return 14;
      return Math.max(1, gameState.adventureLevel ?? 1, ADVENTURE_LEVELS[roomId] ?? 1);
    }

    function updateAdventureLevel() {
      if (!DATA.actRooms.ACT_V.includes(gameState.roomId)) gameState.adventureLevel = Math.max(gameState.adventureLevel ?? 1, ADVENTURE_LEVELS[gameState.roomId] ?? 1, flags.actICompleted ? 2 : 1);
    }

