    function ensureCouncilVariables() {
      if (!variables.factionTrust || typeof variables.factionTrust !== 'object') variables.factionTrust = { harpers: 0, zhentarim: 0, cult: 0 };
      if (!variables.councilReputation || typeof variables.councilReputation !== 'object') variables.councilReputation = { harpers: 0, gauntlet: 0, enclave: 0, zhentarim: 0, lords: 0 };
      ['harpers', 'gauntlet', 'enclave', 'zhentarim', 'lords'].forEach(key => {
        if (typeof variables.councilReputation[key] !== 'number') variables.councilReputation[key] = 0;
      });
      if (typeof variables.casualties !== 'number') variables.casualties = 0;
      if (typeof variables.publicTrust !== 'number') variables.publicTrust = 0;
      if (typeof variables.totalSupport !== 'number') variables.totalSupport = 0;
      if (typeof variables.allianceStrength !== 'string') variables.allianceStrength = 'none';
    }

    function applyCouncilReputationDelta(delta = {}) {
      ensureCouncilVariables();
      Object.entries(delta).forEach(([key, value]) => {
        if (typeof value !== 'number') return;
        if (typeof variables.councilReputation[key] !== 'number') variables.councilReputation[key] = 0;
        variables.councilReputation[key] += value;
      });
    }

    function initializeCouncilSessionIfNeeded() {
      if (flags.councilSessionInitialized) return;
      ensureCouncilVariables();
      variables.councilReputation = { harpers: 0, gauntlet: 0, enclave: 0, zhentarim: 0, lords: 0 };
      variables.casualties = Math.max(variables.casualties, Math.max(0, variables.chaos - 1));

      const trust = variables.factionTrust;
      applyCouncilReputationDelta({
        harpers: trust.harpers ?? 0,
        zhentarim: trust.zhentarim ?? 0,
        gauntlet: Math.max(0, (trust.harpers ?? 0) - (trust.cult ?? 0)),
        enclave: Math.max(0, (trust.harpers ?? 0) - 1),
        lords: Math.max(-1, (trust.harpers ?? 0) - Math.max(0, trust.cult ?? 0))
      });

      if (flags.eggsDestroyed) applyCouncilReputationDelta({ harpers: 2, gauntlet: 1, enclave: 1, zhentarim: -2, lords: 1 });
      else applyCouncilReputationDelta({ harpers: -1, gauntlet: -1, enclave: 1, zhentarim: 1, lords: -1 });
      if (flags.cyanwrathDead) applyCouncilReputationDelta({ gauntlet: 1, lords: 1 });
      if (variables.casualties >= 4) applyCouncilReputationDelta({ harpers: -1, gauntlet: -1, enclave: -2, zhentarim: 0, lords: -2 });
      if (variables.moraleGroupe >= 2) applyCouncilReputationDelta({ harpers: 1, gauntlet: 1, enclave: 1, zhentarim: 0, lords: 1 });

      variables.publicTrust = Math.max(-5, Math.min(5, variables.moraleGroupe - Math.floor(variables.casualties / 2) + (flags.cyanwrathDead ? 1 : 0)));
      flags.councilSessionInitialized = true;
      flags.councilConvocationDone = false;
      flags.councilDefenseDone = false;
      flags.councilProposalsDone = false;
      flags.metallicAudienceDone = false;
      flags.metallicAlliance = false;
      writeContext('Le protocole du Conseil est ouvert. Les réputations de faction sont recalculées selon vos actes passés.');
    }

    function isSkillAvailable(characterId, requiredSkill) {
      if (!characterId) return true;
      const character = characters[characterId];
      if (!character) return false;
      const allowedStates = new Set(['active', 'injured']);
      if (!allowedStates.has(character.state)) return false;
      return requiredSkill ? character.skills.includes(requiredSkill) : true;
    }

    // D20: un tirage cryptographique au clic; affichage et animation sans tirage.
    const D20_RULES = {
      abilities: { str: 'FOR', dex: 'DEX', con: 'CON', int: 'INT', wis: 'SAG', cha: 'CHA' },
      skills: {
        leadership: ['cha','persuasion','Persuasion'], diplomacy: ['cha','persuasion','Persuasion'],
        redemption: ['cha','persuasion','Persuasion'], strategy: ['int','investigation','Investigation'],
        stealth: ['dex','stealth','Discrétion'], arcana: ['int','arcana','Arcanes'],
        nature: ['int','nature','Nature'], might: ['str','athletics','Athlétisme'],
        tracking: ['wis','survival','Survie']
      },
      weaponActions: ['attaquer-arriere-garde','briser-ligne-garde','force-brute-roper','moulin-assaut','swift-force'],
      faces: [4,13,7,18,2,16,5,11,20,8,14,3,17,6], duration: 42
    };
    let d20CheckSerial = 0;

    function getCheckDefinition(option, actorId = option?.characterId) {
      const legacy = option?.resolution ?? {}, override = option?.check ?? {};
      const sourceSkill = option?.skill ?? legacy.skill;
      const entry = D20_RULES.skills[sourceSkill] ?? ['int',null,'Intelligence'];
      let ability = entry[0], skillKey = entry[1], label = entry[2], kind = 'ability';
      if (sourceSkill === 'duel' || D20_RULES.weaponActions.includes(option?.id)) {
        ability = ['sislay','malar'].includes(actorId) ? 'dex' : 'str';
        skillKey = null; label = 'Attaque'; kind = 'attack';
      } else if (sourceSkill === 'wild_magic') {
        ability = 'cha'; skillKey = null; label = 'Attaque de sort'; kind = 'attack';
      }
      if (Object.hasOwn(D20_RULES.abilities,override.ability)) ability = override.ability;
      if (Object.hasOwn(override,'skillKey')) skillKey = override.skillKey;
      else if (Object.hasOwn(override,'skill')) skillKey = override.skill;
      if (override.kind === 'attack' || override.kind === 'ability') kind = override.kind;
      if (kind === 'attack') skillKey = null;
      if (typeof override.label === 'string' && override.label.trim()) label = override.label;
      const explicitDC = override.dc ?? legacy.dc;
      const difficulty = Number.isFinite(legacy.difficulty) ? legacy.difficulty : 4;
      const dc = Number.isFinite(explicitDC) ? Math.max(1,Math.round(explicitDC))
        : difficulty <= 2 ? 10 : difficulty <= 4 ? 12 : difficulty <= 6 ? 15 : 18;
      return { ability, skillKey, kind, label, dc };
    }

    function getCheckPreview(option, actorId = option?.characterId) {
      if (!actorId) throw new Error('Un personnage doit être désigné pour cette épreuve.');
      const stats = getAdventureStats(actorId,gameState.roomId), definition = getCheckDefinition(option,actorId);
      if (!stats) throw new Error('La fiche du personnage est introuvable.');
      const abilityModifier = stats.modifiers?.[definition.ability] ?? Math.floor(((stats.abilities?.[definition.ability] ?? 10)-10)/2);
      const proficiency = Number.isFinite(stats.proficiency) ? stats.proficiency : 2;
      let proficiencyBonus = 0, bonus = abilityModifier;
      if (definition.kind === 'attack') {
        proficiencyBonus = proficiency;
        const attack = definition.ability === 'str' ? stats.meleeAttackBonus
          : definition.ability === 'dex' ? stats.rangedAttackBonus
          : definition.ability === stats.spellAbility ? stats.spellAttackBonus : null;
        bonus = Number.isFinite(attack) ? attack : abilityModifier + proficiencyBonus;
      } else if (definition.skillKey && stats.skills?.[definition.skillKey]) {
        const skill = stats.skills[definition.skillKey], rank = Number.isFinite(skill.rank) ? skill.rank : 0;
        proficiencyBonus = proficiency * rank;
        const originalModifier = stats.modifiers?.[skill.ability] ?? abilityModifier;
        bonus = Number.isFinite(skill.bonus) ? skill.bonus + abilityModifier - originalModifier : abilityModifier + proficiencyBonus;
      }
      return { actorId, level: stats.level, ...definition, abilityModifier, proficiencyBonus,
        otherBonus: bonus-abilityModifier-proficiencyBonus, bonus };
    }

    function rollD20() {
      const generator = globalThis.crypto ?? (typeof window === 'undefined' ? null : window.crypto);
      if (!generator?.getRandomValues) throw new Error('Le générateur de dés du navigateur est indisponible.');
      const sample = new Uint32Array(1);
      // Les 16 valeurs excédentaires sont rejetées pour éviter le biais du modulo.
      do { generator.getRandomValues(sample); } while (sample[0] >= 4294967280);
      return sample[0] % 20 + 1;
    }

    function performD20Check(option, actorId = option?.characterId) {
      const preview = getCheckPreview(option,actorId), natural = rollD20(), total = natural + preview.bonus;
      const critical = preview.kind === 'attack' ? natural === 20 ? 'success' : natural === 1 ? 'failure' : null : null;
      const success = critical === 'success' || (critical !== 'failure' && total >= preview.dc);
      return { id: `${option.id}:${++d20CheckSerial}`, ...preview, natural, total, success, critical };
    }

    function getD20AnimationPending() {
      const animation = uiState.diceAnimation;
      if (!animation || animation.settled) return false;
      if (gameState.lastReport?.check?.id !== animation.check.id) { uiState.diceAnimation = null; return false; }
      return true;
    }

    function startD20Animation(check) {
      if (!check) { uiState.diceAnimation = null; return; }
      uiState.diceAnimation = { check, startedTick: gameState.tick, settled: false };
      if (uiState.preferences.diceAnimation === false || uiState.reducedMotion) finishD20Animation();
      else if (typeof scheduleAnimation === 'function') scheduleAnimation();
    }

    function finishD20Animation() {
      if (!getD20AnimationPending()) return false;
      // Verrou fermé AVANT les rendus imbriqués: ni second jet ni seconde ponctuation.
      uiState.diceAnimation.settled = true;
      if (typeof startSceneEffect === 'function') startSceneEffect();
      if (typeof refreshInterface === 'function') refreshInterface();
      return true;
    }

    function renderD20() {
      const panel = document.getElementById('checkPanel'), check = gameState.lastReport?.check;
      if (!panel) return;
      panel.hidden = !check;
      if (!check) { uiState.diceAnimation = null; return; }
      const elapsed = Math.max(0,gameState.tick-(uiState.diceAnimation?.startedTick ?? gameState.tick));
      if (getD20AnimationPending() && (elapsed >= D20_RULES.duration || uiState.reducedMotion || uiState.preferences.diceAnimation === false)) {
        finishD20Animation(); return;
      }
      const rolling = getD20AnimationPending(), face = rolling ? D20_RULES.faces[Math.floor(elapsed/3)%D20_RULES.faces.length] : check.natural;
      const signed = value => `${value < 0 ? '−' : '+'}${Math.abs(value)}`;
      const name = typeof characters === 'undefined' ? check.actorId : characters[check.actorId]?.name ?? check.actorId;
      document.getElementById('d20Value').textContent = String(face);
      const die = document.getElementById('d20Die');
      die.setAttribute('data-rolling',String(rolling));die.classList.toggle('rolling',rolling);
      die.style.transform = rolling ? `translateY(${[0,-2,-4,-2,0,1][Math.floor(elapsed/3)%6]}px) rotate(${[0,8,13,5,-7,-12,-4][Math.floor(elapsed/3)%7]}deg)` : '';
      document.getElementById('checkActor').textContent = `${name} · niveau ${check.level}`;
      document.getElementById('checkKind').textContent = `${check.label} · ${check.kind === 'attack' ? 'CA' : 'DD'} ${check.dc}`;
      const summary = rolling ? 'Le D20 roule…'
        : check.critical === 'success' ? 'Réussite critique — 20 naturel'
        : check.critical === 'failure' ? 'Échec critique — 1 naturel'
        : `${check.success ? 'Épreuve réussie' : 'Épreuve échouée'}${check.natural === 1 || check.natural === 20 ? ` — ${check.natural} naturel` : ''}`;
      const summaryElement = document.getElementById('checkSummary');
      if (summaryElement.textContent !== summary) summaryElement.textContent = summary;
      const components = `${D20_RULES.abilities[check.ability] ?? check.ability} ${signed(check.abilityModifier)} · maîtrise ${signed(check.proficiencyBonus)}${check.otherBonus ? ` · autres bonus ${signed(check.otherBonus)}` : ''}`;
      const target = `${check.kind === 'attack' ? 'CA' : 'DD'} ${check.dc}`;
      document.getElementById('checkBreakdown').textContent = rolling ? `${components} · ${target}` : `D20 ${check.natural} · ${components} = ${check.total}, ${target}`;
      panel.setAttribute('data-outcome',rolling ? 'pending' : check.success ? 'success' : 'failure');
    }

