    const ROSTER_TIMELINE = [
        {
          trigger: 'LODGE_REUNION',
          add: ['kairon'],
          remove: ['drekthar', 'sislay'],
          source: 'JDR DD5 2023.xlsx — Tyranny of dragons!203; PJ!J1:J5; identité confirmée par le MJ',
          message: 'Kairon rejoint le groupe au pavillon; Drek’Thar et la rôdeuse de Lunaaz partent vers d’autres horizons.'
        },
        {
          trigger: 'SKYREACH_REUNION',
          add: ['malar'],
          source: 'JDR DD5 2023.xlsx — Tyranny of dragons!226',
          message: 'Au château volant, Malar, voleur semi-elfe, rejoint la compagnie.'
        }
    ];
    const characters = {
      bjolnir: { name: 'Bjolnir', state: 'active', mainStory: true, skills: ['redemption', 'leadership', 'diplomacy', 'strategy'], narrativeTags: ['refuse de tuer', 'protège les autres', 'charismatique'] },
      malar: { name: 'Malar', state: 'absent', mainStory: true, skills: ['stealth'], narrativeTags: ['voleur semi-elfe', 'sournois'] },
      darrin: { name: 'Darrin', state: 'active', mainStory: true, skills: ['wild_magic', 'arcana'], narrativeTags: ['magie puissante', 'nombreux sorts', 'tendance à faire exploser les choses'] },
      drekthar: { name: 'Drek’Thar', state: 'active', mainStory: true, skills: ['might', 'duel'], narrativeTags: ['tempérament orc', 'aime le combat', 'combattant compétent'] },
      ellyjobell: { name: 'Ellyjobell Folkor', state: 'active', mainStory: false, skills: ['arcana', 'stealth', 'nature'], narrativeTags: ['intelligente', 'gentille', 'ingénieuse', 'naïve', 'premier degré'] },
      kairon: { name: 'Kairon Erudit', state: 'absent', mainStory: false, skills: ['strategy', 'arcana'], narrativeTags: ['sournois', 'intelligent', 'un peu froid', 'sarcastique', 'bon fond'] },
      sislay: { name: 'Sislay Baite', state: 'active', mainStory: false, skills: ['stealth', 'tracking'], narrativeTags: ['discrète', 'peu bavarde', 'efficace', 'pleine de ressources'] }
    };

