    const LOGICAL_WIDTH = 320;
    const LOGICAL_HEIGHT = 200;
    const VERBS = ['look', 'l', 'examine', 'x', 'go', 'walk', 'help', '?', 'inventory', 'i', 'undo', 'choose', 'save', 'load', 'clear', 'sheet', 'party', 'export', 'import', 'debug', 'set', 'flag'];
    const SAVE_KEY = 'clanDestain.save.v1';
    const PREFERENCES_KEY = 'clanDestain.preferences.v1';
    const DIRECTION_ALIASES = {
      n: 'nord', nord: 'nord',
      s: 'sud', sud: 'sud',
      e: 'est', est: 'est',
      w: 'ouest', ouest: 'ouest'
    };
    const URL_PARAMS = new URLSearchParams(window.location.search);
    // La bataille finale hypothétique reste dans le code, mais n'est pas proposée aux joueurs de la campagne.
    const WHAT_IF_FINALE = URL_PARAMS.has('whatif');

