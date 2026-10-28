/**
 * The piece's sound, synthesised in the browser (no audio files):
 *  room  – brown noise, the air of a closed house
 *  hum   – a low open fifth under the key and the thread
 *  wind  – moving noise, for the wall and the kites
 *  drone – a buzzing saw wave: Gazans call the sound of surveillance drones "zanana"
 * The count is left almost silent on purpose.
 */
type Layer = "room" | "hum" | "wind" | "drone";
type Mood = Partial<Record<Layer, number>>;

export const MOODS: Record<string, Mood> = {
  simula: { room: 0.5 },
  tahanan: { room: 0.6, hum: 0.12 },
  susi: { room: 0.35, hum: 0.4 },
  boto: { room: 0.5, hum: 0.1 },
  pader: { wind: 0.45, room: 0.2 },
  lakad: { wind: 0.22, drone: 0.4 },
  bilang: { room: 0.08 },
  sining: { room: 0.4, hum: 0.18 },
  sinulid: { wind: 0.25, hum: 0.3 },
  halaga: { room: 0.3, hum: 0.22, drone: 0.08 },
  kalayaan: { wind: 0.6, hum: 0.12 },
};

class Ambient {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private layers = new Map<Layer, GainNode>();

  get running() {
    return this.ctx?.state === "running";
  }

  start() {
    if (this.ctx) {
      void this.ctx.resume();
      this.fadeMaster(0.9);
      return;
    }
    const ctx = new AudioContext();
    this.ctx = ctx;
    this.master = ctx.createGain();
    this.master.gain.value = 0;
    this.master.connect(ctx.destination);

    const layer = (name: Layer) => {
      const g = ctx.createGain();
      g.gain.value = 0;
      g.connect(this.master!);
      this.layers.set(name, g);
      return g;
    };

    // room: brown noise through a low-pass
    const room = layer("room");
    const brown = this.noiseSource("brown");
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 520;
    brown.connect(lp).connect(room);
    brown.start();

    // hum: an open fifth, breathing slowly
    const hum = layer("hum");
    const humBus = ctx.createGain();
    humBus.gain.value = 0.18;
    humBus.connect(hum);
    for (const f of [55, 82.41, 110.3]) {
      const o = ctx.createOscillator();
      o.type = "sine";
      o.frequency.value = f;
      o.connect(humBus);
      o.start();
    }
    const breath = ctx.createOscillator();
    const breathDepth = ctx.createGain();
    breath.frequency.value = 0.08;
    breathDepth.gain.value = 0.06;
    breath.connect(breathDepth).connect(humBus.gain);
    breath.start();

    // wind: white noise through a wandering band-pass
    const wind = layer("wind");
    const white = this.noiseSource("white");
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 700;
    bp.Q.value = 0.6;
    const windLfo = ctx.createOscillator();
    const windDepth = ctx.createGain();
    windLfo.frequency.value = 0.07;
    windDepth.gain.value = 380;
    windLfo.connect(windDepth).connect(bp.frequency);
    windLfo.start();
    const windLevel = ctx.createGain();
    windLevel.gain.value = 0.35;
    white.connect(bp).connect(windLevel).connect(wind);
    white.start();

    // drone: two detuned saws, band-passed, with a fast tremolo
    const drone = layer("drone");
    const droneBus = ctx.createGain();
    droneBus.gain.value = 0.05;
    const dbp = ctx.createBiquadFilter();
    dbp.type = "bandpass";
    dbp.frequency.value = 460;
    dbp.Q.value = 1.4;
    droneBus.connect(dbp).connect(drone);
    for (const f of [104, 106.6]) {
      const o = ctx.createOscillator();
      o.type = "sawtooth";
      o.frequency.value = f;
      o.connect(droneBus);
      o.start();
    }
    const trem = ctx.createOscillator();
    const tremDepth = ctx.createGain();
    trem.frequency.value = 7.5;
    tremDepth.gain.value = 0.018;
    trem.connect(tremDepth).connect(droneBus.gain);
    trem.start();

    this.fadeMaster(0.9);
  }

  stop() {
    if (!this.ctx) return;
    this.fadeMaster(0);
    const ctx = this.ctx;
    window.setTimeout(() => {
      if (this.master && this.master.gain.value < 0.01) void ctx.suspend();
    }, 900);
  }

  setMood(id: string) {
    if (!this.ctx) return;
    const mood = MOODS[id] ?? {};
    const now = this.ctx.currentTime;
    this.layers.forEach((gain, name) => {
      gain.gain.cancelScheduledValues(now);
      gain.gain.setTargetAtTime(mood[name] ?? 0, now, 1.2);
    });
  }

  /** A short metallic click: the key turning in the lock. */
  click() {
    if (!this.running || !this.ctx || !this.master) return;
    const ctx = this.ctx;
    const src = this.noiseSource("white", 0.08);
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 2600;
    bp.Q.value = 6;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.5, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    src.connect(bp).connect(g).connect(this.master);
    src.start();
  }

  /** A small bell, once per candle lit in the count. */
  bell() {
    if (!this.running || !this.ctx || !this.master) return;
    const ctx = this.ctx;
    const t = ctx.currentTime;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.22, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 2.4);
    g.connect(this.master);
    for (const [f, a] of [
      [659.25, 1],
      [1318.5, 0.35],
      [1977.8, 0.12],
    ] as const) {
      const o = ctx.createOscillator();
      const og = ctx.createGain();
      o.frequency.value = f;
      og.gain.value = a;
      o.connect(og).connect(g);
      o.start(t);
      o.stop(t + 2.5);
    }
  }

  private fadeMaster(to: number) {
    if (!this.ctx || !this.master) return;
    const now = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setTargetAtTime(to, now, 0.4);
  }

  private noiseSource(kind: "white" | "brown", seconds = 4) {
    const ctx = this.ctx!;
    const length = Math.floor(ctx.sampleRate * seconds);
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let last = 0;
    for (let i = 0; i < length; i++) {
      const white = Math.random() * 2 - 1;
      if (kind === "white") {
        data[i] = white * 0.5;
      } else {
        last = (last + 0.02 * white) / 1.02;
        data[i] = last * 3.5;
      }
    }
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    src.loop = seconds > 1;
    return src;
  }
}

export const ambient = new Ambient();
