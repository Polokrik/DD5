    // ───────────────────────── Fil de l'histoire et personnages rencontrés ─────────────────────────
    // Choix qui suivent la campagne jouée, dans l'ordre du journal (même liste que tests/campaign-path.cjs).
    // Ils sont présentés en premier et en bleu, avec les sorties qui font avancer l'histoire.
    const STORY_CHOICES = new Set([
      'charge-civils', 'swift-diplomatie', 'mission-sanctuaire', 'tunnel-temple', 'temple-evacuation', 'mission-moulin', 'moulin-assaut',
      'repousser-dragon', 'dragon-defendre', 'vers-duel', 'duel-campagne', 'fin-acte', 'depart-camp',
      'camp-liberation', 'retour-grotte', 'revanche-drekthar', 'voler-oeufs', 'oeufs-suite', 'mondath-retour', 'act2-end', 'elturel-arrivee', 'tournoi-caravane',
      'caravane-marchands', 'caravane-arrivee', 'carnath-marais', 'naerytar-entree', 'naerytar-portal', 'portal-traverse', 'lodge-reunion',
      'skyreach-reunion', 'skyreach-return', 'skyreach-convaincre', 'skyreach-rezmir', 'skyreach-proteger', 'act3-end', 'act5-muster',
      'council-open-session', 'defense-honnete', 'strategy-metallic', 'diderius-retour', 'glace-explorer', 'glace-victoire', 'conseil-dragons',
      'dragons-conditions', 'foret-temple', 'foret-affrontement', 'foret-retour', 'thay-conseil', 'resolve-council-session'
    ]);

    // Personnages rencontrés : uniquement ce que la chronique rapporte. Une fiche apparaît dans le journal
    // quand le Clan atteint le chapitre où le personnage entre dans l'histoire (pas de spoiler).
    const NPC_SHEETS = [
      { name: 'Le gouverneur Nighthill', match: 'Nighthill', role: 'Gouverneur de Verdure', text: 'Il accueille le Clan malgré ses blessures pendant l’attaque, puis lui confie la mission de retrouver le camp des assaillants et ce qui a été volé à la ville.' },
      { name: 'Escobert le Rouge', match: 'Escobert', role: 'Second du gouverneur', text: 'Nain des montagnes, il veille à la défense de la forteresse de Verdure, dont chaque porte semble pouvoir céder.' },
      { name: 'Linan', match: 'Linan', role: 'Habitant de Verdure', text: 'Le Clan le prend sous sa protection, lui et les siens, au cœur de l’attaque.' },
      { name: 'Langdedrosa Cyanwrath', match: 'Cyanwrath', role: 'Demi-dragon bleu, champion du Culte', text: 'Il défie le Clan au matin de l’attaque de Verdure; Drek’Thar l’affronte pour obtenir la libération des prisonniers. Leur rivalité se poursuit dans la grotte du Culte.' },
      { name: 'Frulam Mondath', match: 'Mondath', role: 'Cheffe des pillards du Culte', text: 'Le Culte recherche des œufs de dragon et agit sous son commandement autour de Verdure.' },
      { name: 'Leosin Erlanthar', match: 'Leosin', role: 'Moine', text: 'Prisonnier des cultistes, il est libéré par le Clan; il l’envoie ensuite rejoindre à Elturel Ontharr Frume.' },
      { name: 'Ontharr Frume', match: 'Ontharr', role: 'Paladin de Torm', text: 'À Elturel, avec Leosin, il présente l’alliance qui se dessine entre le Gantelet, les Ménestrels et l’Enclave d’Émeraude.' },
      { name: 'Ackyn Sélébon', match: 'Ackyn', role: 'Équipementier de Baldur’s Gate', text: 'Il fait engager le Clan dans une caravane de onze chariots.' },
      { name: 'Jamna Gleamsilver', match: 'Jamna', role: 'Gnome', text: 'Arrivée au vingt-sixième jour de la caravane, sa présence ne passe pas inaperçue; elle reste avec le Clan.' },
      { name: 'Azbara Jos', match: 'Azbara', role: 'Mage rouge', text: 'Il rejoint la caravane en même temps que Jamna.' },
      { name: 'Pressegueule', match: 'Pressegueule', role: 'Homme-lézard', text: 'Captif interrogé au relais de Carnath, il devient le guide du Clan à travers les marais.' },
      { name: 'Talis', match: 'Talis', role: 'Cherchée par Ellyjobell depuis Verdure', text: 'Retrouvée au pavillon de chasse, Talis occupe une place importante auprès des cultistes mais accepte de les trahir : renseignements, bannière à cinq bandes et deux mots de passe.' },
      { name: 'Le capitaine Othelstan', match: 'Othelstan', role: 'Capitaine à Parnast', text: 'Le Clan le rencontre avant d’entrer dans le château volant, qui se prépare au départ.' },
      { name: 'Blagothkus', match: 'Blagothkus', role: 'Géant des nuages, maître de Cumulus', text: 'Il soutient d’abord le retour de Tiamat pour la vaincre ensuite; convaincu par Bjolnir et par Eskarotha, il se retourne contre le Culte.' },
      { name: 'Eskarotha', match: 'Eskarotha', role: 'Esprit de l’épouse de Blagothkus', text: 'Son esprit habite les runes naines qui font voler Cumulus; elle aide le Clan.' },
      { name: 'Rezmir', match: 'Rezmir', role: 'Demi-dragon noir, Dragophone', text: 'Le Clan l’affronte et la capture à bord de Cumulus; elle ne livre rien.' },
      { name: 'Glazael', match: 'Glazael', role: 'Dragon blanc', text: 'Il dort sur son trésor au fond de Cumulus; les hommes de Blagothkus le capturent.' },
      { name: 'Severin le Rouge', match: 'Severin', role: 'Chef des Dragophones', text: 'Talis révèle qu’il dirige les Dragophones et le projet du Culte.' },
      { name: 'Varam le Blanc', match: 'Varam', role: 'Dragophone de l’Hiver et du Froid', text: 'Le Conseil de Waterdeep lance le Clan sur sa piste.' },
      { name: 'Laeral Silverhand', match: 'Laeral', role: 'À la tête de Waterdeep', text: 'Elle a remplacé Dagult Neverember à la direction de la cité.' },
      { name: 'Lerustah Half-Face', match: 'Lerustah', role: 'Capitaine du Frostskimmr', text: 'Il conduit le Clan vers les glaces du nord et lui accorde une semaine pour donner des nouvelles.' },
      { name: 'Maccath l’Écarlate', match: 'Maccath', role: 'Confrérie de l’Arcane', text: 'Disparue depuis trois ans, le Clan la retrouve dans l’iceberg; elle accepte de l’aider contre Arauthator.' },
      { name: 'Marfulb', match: 'Marfulb', role: 'Meneur des crapauds des glaces', text: 'Ses talents d’organisation deviennent une arme contre le maître de l’iceberg.' },
      { name: 'Arauthator', match: 'Arauthator', role: 'Dragon de l’iceberg', text: 'Les kobolds et les crapauds des glaces le servent; le Clan l’affronte avec les alliés réunis dans l’iceberg.' },
      { name: 'Cœur-d’Orc', match: 'Cœur-d’Orc', role: 'Chasseur des glaces', text: 'Il bat Bjolnir en duel, mais le combat laisse place à une estime réciproque.' },
      { name: 'Elia', match: 'Elia', role: 'Représentante des dragons métalliques', text: 'Elle porte le Clan jusqu’au conseil des dragons métalliques.' },
      { name: 'Galin', match: 'Galin', role: 'Gardien d’Altorn', text: 'Il a perdu sa femme dans l’attaque de son village par un dragon vert; il guide le Clan dans la Forêt Brumeuse.' },
      { name: 'Neronvein', match: 'Neronvein', role: 'Dragophone, ancien prince elfe', text: 'Il commande le temple de la Forêt Brumeuse; son masque a quitté les lieux.' },
      { name: 'Islabus Gloomward', match: 'Islabus', role: 'Mage rouge, ancien maître de Darrin', text: 'Il porte au Clan l’invitation à Thay et l’inquiétude de Szass Tam face à Tiamat.' }
    ];

    // Chapitre d'entrée de chaque personnage, lu dans la chronique.
    function npcChapter(sheet) {
      const index = CHRONICLE_CHAPTERS.findIndex(chapter => chapter.paragraphs.some(paragraph => paragraph.includes(sheet.match)));
      return index < 0 ? 99 : index + 1;
    }
    function reachedChapter() {
      return Math.max(rooms[gameState.roomId]?.chapter ?? 0, ...(gameState.decisions ?? []).map(entry => entry.chapter || 0));
    }

    // Noms et lieux mis en gras dans le récit (première occurrence de chaque paragraphe).
    const HIGHLIGHT_TERMS = ['Bjolnir', 'Drek’Thar', 'Drek\'Thar', 'Ellyjobell', 'Darrin', 'Sislay', 'Kairon', 'Malar', 'Langdedrosa', 'Cyanwrath', 'Nighthill', 'Escobert', 'Linan',
      'Leosin', 'Frulam Mondath', 'Mondath', 'Ontharr', 'Ackyn Sélébon', 'Jamna', 'Azbara', 'Pressegueule', 'Talis', 'Othelstan', 'Blagothkus', 'Eskarotha', 'Rezmir', 'Glazael',
      'Severin', 'Varam', 'Laeral Silverhand', 'Lerustah', 'Maccath', 'Marfulb', 'Arauthator', 'Cœur-d’Orc', 'Galin', 'Neronvein', 'Islabus', 'Boule', 'Bill',
      'Verdure', 'Elturel', 'Baldur’s Gate', 'Waterdeep', 'Carnath', 'Naerytar', 'Parnast', 'Cumulus', 'Secomber', 'Altorn', 'Forêt Brumeuse', 'Thay',
      'Reine des Dragons', 'Tiamat', 'Dragophones', 'Dragophone', 'Derrière la Porte de Fer'];
    let highlightPattern = null;
    function appendRichText(parent, text) {
      if (!highlightPattern) {
        const terms = [...new Set(HIGHLIGHT_TERMS)].sort((a, b) => b.length - a.length).map(term => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
        highlightPattern = new RegExp(`(?<![\\p{L}])(${terms.join('|')})(?![\\p{L}])`, 'gu');
      }
      const plain = value => { if (value) parent.appendChild(document.createTextNode ? document.createTextNode(value) : Object.assign(document.createElement('span'), { textContent: value })); };
      const seen = new Set(); let last = 0;
      for (const match of String(text).matchAll(highlightPattern)) {
        const key = match[0].replace('\'', '’');
        if (seen.has(key)) continue;
        seen.add(key); plain(text.slice(last, match.index));
        const strong = document.createElement('strong'); strong.textContent = match[0]; parent.appendChild(strong);
        last = match.index + match[0].length;
      }
      plain(String(text).slice(last));
      return parent;
    }
    function richParagraph(text) { return appendRichText(document.createElement('p'), text); }
