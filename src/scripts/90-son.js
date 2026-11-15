    // Ambiances et ponctuations synthétiques: aucune voix enregistrée, aucun réseau.
    // Appeler enable(true) depuis un geste joueur; la construction reste silencieuse.
    function createSoundscape() {
      const state = { context: null, master: null, noise: null, ambient: null,
        voices: new Set(), enabled: false, volume: .25, scene: 'verdure', request: 0, suspending: null };
      const scenes = {
        verdure: { cutoff: 550, wind: .16, water: 0 },
        street: { cutoff: 700, wind: .14, water: 0 },
        keep: { cutoff: 220, wind: .055, water: 0 },
        tunnel: { cutoff: 250, wind: .075, water: .035 },
        temple: { cutoff: 620, wind: .12, water: 0 },
        mill: { cutoff: 800, wind: .13, water: .04 },
        duel: { cutoff: 330, wind: .075, water: 0 }
      };
      const effects = {
        hammer: [['tone','triangle',110,46,.42,.38], ['tone','sine',360,190,.16,.06], ['noise','lowpass',500,180,.18,.16]],
        fog: [['noise','lowpass',750,300,1.1,.12]],
        magic: [['tone','sine',200,660,.65,.11], ['tone','triangle',300,210,.8,.035]],
        clash: [['tone','triangle',190,82,.28,.25], ['tone','sine',660,440,.09,.06], ['noise','lowpass',1800,600,.18,.09]],
        dragon: [['noise','bandpass',170,70,1.1,.2], ['tone','triangle',66,36,1.1,.17]],
        door: [['tone','triangle',85,50,.2,.2], ['noise','lowpass',400,160,.16,.1]],
        retreat: [['noise','lowpass',480,180,.6,.1]]
      };

      function clampVolume(value) {
        const n = Number(value);
        return Number.isFinite(n) ? Math.max(0, Math.min(1, n)) : state.volume;
      }

      function makeNoise(context) {
        const buffer = context.createBuffer(1, Math.ceil(context.sampleRate * 2), context.sampleRate);
        const samples = buffer.getChannelData(0);
        let seed = 15170423;
        for (let i = 0; i < samples.length; i++) {
          seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
          samples[i] = (seed / 2147483648 - 1) * .7;
        }
        return buffer;
      }

      function release(entry) {
        state.voices.delete(entry);
        entry.nodes.forEach(node => { try { node.disconnect(); } catch {} });
      }

      function stop(entry) {
        if (!entry) return;
        try { entry.source.stop(); } catch {}
        release(entry);
      }

      function stopAll() {
        [...state.voices].forEach(stop);
        (state.ambient?.entries ?? []).forEach(stop);
        state.ambient = null;
      }

      function makeNoiseBand(type, cutoff, peak, loop = false) {
        const context = state.context, source = context.createBufferSource();
        const filter = context.createBiquadFilter(), gain = context.createGain();
        source.buffer = state.noise; source.loop = loop;
        filter.type = type; filter.frequency.value = cutoff; filter.Q.value = .45;
        gain.gain.value = peak;
        source.connect(filter); filter.connect(gain); gain.connect(state.master);
        const entry = { source, filter, gain, nodes: [source, filter, gain] };
        source.onended = () => release(entry);
        return entry;
      }

      function updateAmbient() {
        if (!state.enabled || !state.context || state.context.state !== 'running') return;
        const scene = scenes[state.scene] ?? scenes.keep, now = state.context.currentTime;
        if (!state.ambient) {
          const wind = makeNoiseBand('lowpass', scene.cutoff, 0, true);
          const water = makeNoiseBand('bandpass', 1450, 0, true);
          water.filter.Q.value = 1.2;
          state.ambient = { wind, water, entries: [wind, water] };
          wind.source.start(); water.source.start(0, .71);
        }
        const { wind, water } = state.ambient;
        wind.filter.frequency.setTargetAtTime(scene.cutoff, now, .25);
        wind.gain.gain.setTargetAtTime(scene.wind, now, .4);
        water.gain.gain.setTargetAtTime(scene.water, now, .4);
      }

      function setVolume(value) {
        state.volume = clampVolume(value);
        if (state.master && state.context) {
          const param = state.master.gain, now = state.context.currentTime;
          param.cancelScheduledValues(now);
          param.setTargetAtTime(state.enabled ? state.volume * .3 : 0, now, .025);
        }
      }

      async function enable(enabled, volume = state.volume) {
        const request = ++state.request;
        state.volume = clampVolume(volume);
        if (!enabled) {
          state.enabled = false;
          if (state.master && state.context) {
            const now = state.context.currentTime;
            state.master.gain.cancelScheduledValues(now);
            state.master.gain.setValueAtTime(0, now);
          }
          stopAll();
          try {
            if (state.context?.state === 'running') {
              const pending = state.context.suspend().catch(() => {});
              state.suspending = pending; await pending;
              if (state.suspending === pending) state.suspending = null;
            }
          } catch {}
          return true;
        }
        try {
          if (state.suspending) await state.suspending;
          if (request !== state.request) return false;
          if (!state.context || state.context.state === 'closed') {
            const Constructor = typeof window === 'undefined' ? null : window.AudioContext || window.webkitAudioContext;
            if (!Constructor) return false;
            state.context = new Constructor();
            state.master = state.context.createGain();
            state.master.gain.value = 0;
            state.master.connect(state.context.destination);
            state.noise = makeNoise(state.context);
          }
          if (state.context.state !== 'running') await state.context.resume();
          if (request !== state.request || state.context.state !== 'running') return false;
          state.enabled = true;
          setVolume(state.volume); updateAmbient();
          return true;
        } catch {
          if (request === state.request) {
            state.enabled = false; stopAll();
          }
          return false;
        }
      }

      function pulse(spec) {
        const [kind, type, from, to, duration, peak] = spec;
        const context = state.context, now = context.currentTime;
        let entry;
        if (kind === 'noise') {
          entry = makeNoiseBand(type, from, 0);
          entry.filter.frequency.exponentialRampToValueAtTime(to, now + duration);
        } else {
          const source = context.createOscillator(), gain = context.createGain();
          source.type = type; source.frequency.setValueAtTime(from, now);
          source.frequency.exponentialRampToValueAtTime(to, now + duration);
          source.connect(gain); gain.connect(state.master);
          entry = { source, gain, nodes: [source, gain] };
          source.onended = () => release(entry);
        }
        const envelope = entry.gain.gain;
        envelope.setValueAtTime(0, now);
        envelope.linearRampToValueAtTime(peak, now + .025);
        envelope.exponentialRampToValueAtTime(.0001, now + duration);
        state.voices.add(entry);
        entry.source.start(now); entry.source.stop(now + duration + .03);
      }

      function play(kind) {
        if (!state.enabled || state.context?.state !== 'running' || !effects[kind]) return false;
        while (state.voices.size > 8) stop(state.voices.values().next().value);
        effects[kind].forEach(pulse);
        return true;
      }

      function setScene(scene) {
        state.scene = Object.hasOwn(scenes, scene) ? scene : 'keep';
        updateAmbient();
      }

      async function dispose() {
        const context = state.context;
        ++state.request; state.enabled = false; stopAll();
        state.context = null; state.master = null; state.noise = null;
        try { if (context && context.state !== 'closed') await context.close(); } catch {}
      }

      return { enable, setVolume, setScene, play, pause: () => enable(false), dispose };
    }

    const soundscape = createSoundscape();

