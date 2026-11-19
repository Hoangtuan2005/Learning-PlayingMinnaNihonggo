// 8-bit Retro Sound Effects using Web Audio API

class RetroSoundFX {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.8;
  private masterGain: GainNode | null = null;

  private initContext() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    } catch {
      // AudioContext not supported
    }
  }

  private resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  private getDestination(): AudioNode {
    return this.masterGain || this.ctx!.destination;
  }

  // Pixel Button Click Blip
  public playClick() {
    if (this.isMuted || this.volume === 0) return;
    this.initContext();
    if (!this.ctx) return;
    this.resume();

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(600, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(this.getDestination());

    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  // Katana Slash Swoosh (White noise with high-pass sweep)
  public playSlash() {
    if (this.isMuted || this.volume === 0) return;
    this.initContext();
    if (!this.ctx) return;
    this.resume();

    const bufferSize = this.ctx.sampleRate * 0.15;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.15);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.getDestination());

    whiteNoise.start();
    whiteNoise.stop(this.ctx.currentTime + 0.15);
  }

  // High Combo Ding (8-bit Arpeggio)
  public playCombo(comboCount: number) {
    if (this.isMuted || this.volume === 0) return;
    this.initContext();
    if (!this.ctx) return;
    this.resume();

    const baseFreq = 523.25; // C5
    const multiplier = 1 + Math.min(10, comboCount) * 0.08;

    [0, 0.04, 0.08].forEach((delay, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq * multiplier * (1 + idx * 0.25), this.ctx!.currentTime + delay);

      gain.gain.setValueAtTime(0.15, this.ctx!.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx!.currentTime + delay + 0.1);

      osc.connect(gain);
      gain.connect(this.getDestination());

      osc.start(this.ctx!.currentTime + delay);
      osc.stop(this.ctx!.currentTime + delay + 0.1);
    });
  }

  // Miss / Damage Buzz
  public playMiss() {
    if (this.isMuted || this.volume === 0) return;
    this.initContext();
    if (!this.ctx) return;
    this.resume();

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(80, this.ctx.currentTime + 0.18);

    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.18);

    osc.connect(gain);
    gain.connect(this.getDestination());

    osc.start();
    osc.stop(this.ctx.currentTime + 0.18);
  }

  // Level Up Fanfare (Victory 8-bit tune)
  public playLevelUp() {
    if (this.isMuted || this.volume === 0) return;
    this.initContext();
    if (!this.ctx) return;
    this.resume();

    // Notes: C4, E4, G4, C5
    const notes = [261.63, 329.63, 392.00, 523.25];
    notes.forEach((freq, idx) => {
      const delay = idx * 0.09;
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx!.currentTime + delay);

      gain.gain.setValueAtTime(0.2, this.ctx!.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx!.currentTime + delay + (idx === 3 ? 0.35 : 0.1));

      osc.connect(gain);
      gain.connect(this.getDestination());

      osc.start(this.ctx!.currentTime + delay);
      osc.stop(this.ctx!.currentTime + delay + (idx === 3 ? 0.35 : 0.1));
    });
  }

  // Mastered Kanji Check (Coin Chime)
  public playMastered() {
    if (this.isMuted || this.volume === 0) return;
    this.initContext();
    if (!this.ctx) return;
    this.resume();

    // Coin sound: B5 then E6
    const freqs = [987.77, 1318.51];
    freqs.forEach((freq, idx) => {
      const delay = idx * 0.07;
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx!.currentTime + delay);

      gain.gain.setValueAtTime(0.18, this.ctx!.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx!.currentTime + delay + 0.2);

      osc.connect(gain);
      gain.connect(this.getDestination());

      osc.start(this.ctx!.currentTime + delay);
      osc.stop(this.ctx!.currentTime + delay + 0.2);
    });
  }

  // Correct word sliced in Ninja Game
  public playCorrect() {
    if (this.isMuted || this.volume === 0) return;
    this.initContext();
    if (!this.ctx) return;
    this.resume();

    const freqs = [587.33, 880.00]; // D5, A5
    freqs.forEach((freq, idx) => {
      const delay = idx * 0.06;
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx!.currentTime + delay);

      gain.gain.setValueAtTime(0.18, this.ctx!.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx!.currentTime + delay + 0.15);

      osc.connect(gain);
      gain.connect(this.getDestination());

      osc.start(this.ctx!.currentTime + delay);
      osc.stop(this.ctx!.currentTime + delay + 0.15);
    });
  }

  // Bomb exploded in Ninja Game
  public playBomb() {
    if (this.isMuted || this.volume === 0) return;
    this.initContext();
    if (!this.ctx) return;
    this.resume();

    // Low boom oscillator
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(100, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(25, this.ctx.currentTime + 0.35);

    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(this.getDestination());

    osc.start();
    osc.stop(this.ctx.currentTime + 0.35);
  }

  // Game Over Jingle
  public playGameOver() {
    if (this.isMuted || this.volume === 0) return;
    this.initContext();
    if (!this.ctx) return;
    this.resume();

    const freqs = [392.00, 370.00, 349.23, 329.63]; // G4, F#4, F4, E4
    freqs.forEach((freq, idx) => {
      const delay = idx * 0.15;
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, this.ctx!.currentTime + delay);

      gain.gain.setValueAtTime(0.16, this.ctx!.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx!.currentTime + delay + 0.2);

      osc.connect(gain);
      gain.connect(this.getDestination());

      osc.start(this.ctx!.currentTime + delay);
      osc.stop(this.ctx!.currentTime + delay + 0.2);
    });
  }

  // Cute Jump Boing
  public playJump() {
    if (this.isMuted || this.volume === 0) return;
    this.initContext();
    if (!this.ctx) return;
    this.resume();

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(240, now);
    osc.frequency.exponentialRampToValueAtTime(560, now + 0.18);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc.connect(gain);
    gain.connect(this.getDestination());

    osc.start(now);
    osc.stop(now + 0.22);
  }

  // Water Plop / Splash (Cute bubble & drop sound for fishing)
  public playSplash() {
    if (this.isMuted || this.volume === 0) return;
    this.initContext();
    if (!this.ctx) return;
    this.resume();

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(350, now);
    osc.frequency.exponentialRampToValueAtTime(750, now + 0.05);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.14);

    gain.gain.setValueAtTime(0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

    osc.connect(gain);
    gain.connect(this.getDestination());

    osc.start(now);
    osc.stop(now + 0.16);
  }

  // Fishing Reel Click (Fast ratchet mechanical tick)
  public playReel() {
    if (this.isMuted || this.volume === 0) return;
    this.initContext();
    if (!this.ctx) return;
    this.resume();

    const now = this.ctx.currentTime;
    [0, 0.03, 0.06].forEach((offset) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1400, now + offset);
      osc.frequency.setValueAtTime(800, now + offset + 0.015);

      gain.gain.setValueAtTime(0.08, now + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.02);

      osc.connect(gain);
      gain.connect(this.getDestination());

      osc.start(now + offset);
      osc.stop(now + offset + 0.025);
    });
  }
}

export const soundFX = new RetroSoundFX();
