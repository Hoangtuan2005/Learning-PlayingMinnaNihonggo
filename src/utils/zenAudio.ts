// Web Audio BGM Synthesizer for Zen Garden
// Plays soft, relaxing Japanese piano melodies (Doraemon theme, Ghibli, Sakura)
// 100% offline, procedural Web Audio piano tones with warm decay and reverb

export interface ZenTrack {
  id: string;
  title: string;
  artist: string;
  notes: { pitch: string; duration: number }[];
}

// Frequencies for standard piano notes
const NOTE_FREQS: Record<string, number> = {
  'C3': 130.81, 'D3': 146.83, 'E3': 164.81, 'F3': 174.61, 'G3': 196.00, 'A3': 220.00, 'B3': 246.94,
  'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23, 'G4': 392.00, 'A4': 440.00, 'B4': 493.88,
  'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'F5': 698.46, 'G5': 783.99, 'A5': 880.00, 'B5': 987.77,
  'C6': 1046.50, 'REST': 0
};

// Doraemon iconic melody in soothing chill piano tempo
const DORAEMON_CHILL_NOTES = [
  // "Konna koto ii na... dekitara ii na..."
  { pitch: 'G4', duration: 0.6 },
  { pitch: 'E4', duration: 0.6 },
  { pitch: 'G4', duration: 0.6 },
  { pitch: 'C5', duration: 1.0 },
  { pitch: 'B4', duration: 0.6 },
  { pitch: 'A4', duration: 0.6 },
  { pitch: 'G4', duration: 1.2 },
  { pitch: 'REST', duration: 0.3 },

  // "Anna yume konna yume ippai aru kedo..."
  { pitch: 'A4', duration: 0.6 },
  { pitch: 'F4', duration: 0.6 },
  { pitch: 'A4', duration: 0.6 },
  { pitch: 'D5', duration: 1.0 },
  { pitch: 'C5', duration: 0.6 },
  { pitch: 'B4', duration: 0.6 },
  { pitch: 'A4', duration: 1.2 },
  { pitch: 'REST', duration: 0.3 },

  // "Minna minna minna... kanaete kureru..."
  { pitch: 'G4', duration: 0.6 },
  { pitch: 'A4', duration: 0.6 },
  { pitch: 'B4', duration: 0.6 },
  { pitch: 'C5', duration: 0.8 },
  { pitch: 'D5', duration: 0.8 },
  { pitch: 'E5', duration: 1.2 },
  { pitch: 'REST', duration: 0.3 },

  // "Fushigi na pokke de kanaete kureru..."
  { pitch: 'D5', duration: 0.6 },
  { pitch: 'C5', duration: 0.6 },
  { pitch: 'B4', duration: 0.6 },
  { pitch: 'A4', duration: 0.6 },
  { pitch: 'G4', duration: 1.4 },
  { pitch: 'REST', duration: 0.4 },

  // "Sora wo jiyuu ni tobitai na..."
  { pitch: 'E5', duration: 0.8 },
  { pitch: 'E5', duration: 0.8 },
  { pitch: 'E5', duration: 0.8 },
  { pitch: 'D5', duration: 0.6 },
  { pitch: 'C5', duration: 1.2 },
  { pitch: 'REST', duration: 0.3 },

  // "(Hai! Takekoputaa!)"
  { pitch: 'G4', duration: 0.6 },
  { pitch: 'C5', duration: 0.8 },
  { pitch: 'E5', duration: 1.2 },
  { pitch: 'REST', duration: 0.4 },

  // "An an an... tottemo daisuki... Doraemon~"
  { pitch: 'G4', duration: 0.8 },
  { pitch: 'A4', duration: 0.8 },
  { pitch: 'C5', duration: 0.8 },
  { pitch: 'D5', duration: 0.8 },
  { pitch: 'E5', duration: 1.6 },
  { pitch: 'D5', duration: 0.8 },
  { pitch: 'C5', duration: 2.0 },
  { pitch: 'REST', duration: 1.0 },
];

// Spirited Away - Always With Me (Itsumo Nando Demo) chill piano
const GHIBLI_CHILL_NOTES = [
  { pitch: 'E4', duration: 0.8 },
  { pitch: 'G4', duration: 0.8 },
  { pitch: 'A4', duration: 0.8 },
  { pitch: 'C5', duration: 1.4 },
  { pitch: 'B4', duration: 0.8 },
  { pitch: 'A4', duration: 0.8 },
  { pitch: 'G4', duration: 1.6 },
  { pitch: 'REST', duration: 0.4 },

  { pitch: 'F4', duration: 0.8 },
  { pitch: 'A4', duration: 0.8 },
  { pitch: 'C5', duration: 1.4 },
  { pitch: 'B4', duration: 0.8 },
  { pitch: 'A4', duration: 0.8 },
  { pitch: 'G4', duration: 1.6 },
  { pitch: 'REST', duration: 0.4 },

  { pitch: 'E4', duration: 0.8 },
  { pitch: 'G4', duration: 0.8 },
  { pitch: 'A4', duration: 0.8 },
  { pitch: 'C5', duration: 1.2 },
  { pitch: 'D5', duration: 0.8 },
  { pitch: 'E5', duration: 1.6 },
  { pitch: 'REST', duration: 0.4 },

  { pitch: 'D5', duration: 0.8 },
  { pitch: 'C5', duration: 0.8 },
  { pitch: 'B4', duration: 0.8 },
  { pitch: 'A4', duration: 0.8 },
  { pitch: 'C5', duration: 2.2 },
  { pitch: 'REST', duration: 1.0 },
];

// Sakura Sakura (Traditional Japanese Melody)
const SAKURA_CHILL_NOTES = [
  { pitch: 'A4', duration: 1.0 },
  { pitch: 'A4', duration: 1.0 },
  { pitch: 'B4', duration: 1.8 },
  { pitch: 'REST', duration: 0.2 },
  { pitch: 'A4', duration: 1.0 },
  { pitch: 'A4', duration: 1.0 },
  { pitch: 'B4', duration: 1.8 },
  { pitch: 'REST', duration: 0.2 },

  { pitch: 'A4', duration: 0.8 },
  { pitch: 'B4', duration: 0.8 },
  { pitch: 'C5', duration: 0.8 },
  { pitch: 'B4', duration: 0.8 },
  { pitch: 'A4', duration: 0.8 },
  { pitch: 'B4', duration: 0.8 },
  { pitch: 'A4', duration: 1.6 },
  { pitch: 'REST', duration: 0.4 },

  { pitch: 'F4', duration: 1.0 },
  { pitch: 'E4', duration: 1.0 },
  { pitch: 'F4', duration: 1.0 },
  { pitch: 'A4', duration: 1.0 },
  { pitch: 'B4', duration: 1.4 },
  { pitch: 'A4', duration: 0.8 },
  { pitch: 'F4', duration: 0.8 },
  { pitch: 'E4', duration: 2.2 },
  { pitch: 'REST', duration: 1.0 },
];

export const ZEN_PLAYLIST: ZenTrack[] = [
  {
    id: 'doraemon',
    title: 'Doraemon Piano Chill BGM',
    artist: 'Lofi Studio JP',
    notes: DORAEMON_CHILL_NOTES,
  },
  {
    id: 'ghibli',
    title: 'Always With Me (Spirited Away Piano)',
    artist: 'Joe Hisaishi / Lofi Piano',
    notes: GHIBLI_CHILL_NOTES,
  },
  {
    id: 'sakura',
    title: 'Sakura Sakura (Vườn Hoa Anh Đào)',
    artist: 'Japanese Traditional Zen',
    notes: SAKURA_CHILL_NOTES,
  },
];

class ZenAudioManager {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private currentTrackIdx = 0;
  private currentNoteIdx = 0;
  private timerId: number | null = null;
  private masterGain: GainNode | null = null;
  private volume = 0.6;
  private listeners: (() => void)[] = [];

  constructor() {
    // Setup will lazily initialize on first play
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public subscribe(cb: () => void) {
    this.listeners.push(cb);
    return () => {
      this.listeners = this.listeners.filter(l => l !== cb);
    };
  }

  private notify() {
    this.listeners.forEach(cb => cb());
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getCurrentTrack(): ZenTrack {
    return ZEN_PLAYLIST[this.currentTrackIdx];
  }

  public getCurrentTrackIndex(): number {
    return this.currentTrackIdx;
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  // Play a soft realistic piano tone with warm harmonic overtones and envelope decay
  private playPianoNote(freq: number, duration: number) {
    if (!this.ctx || !this.masterGain || freq <= 0) return;

    const now = this.ctx.currentTime;
    
    // Fundamental oscillator (Warm sine + triangle blend)
    const osc1 = this.ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, now);

    const osc2 = this.ctx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 2, now); // 2nd harmonic octave

    // Soft low-pass filter to give warm, intimate acoustic piano warmth
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, now);
    filter.frequency.exponentialRampToValueAtTime(400, now + duration);

    // Note gain envelope
    const noteGain = this.ctx.createGain();
    noteGain.gain.setValueAtTime(0.001, now);
    // Instant attack
    noteGain.gain.linearRampToValueAtTime(0.25, now + 0.02);
    // Exponential gentle decay
    noteGain.gain.exponentialRampToValueAtTime(0.001, now + duration * 1.5);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(noteGain);
    noteGain.connect(this.masterGain);

    osc1.start(now);
    osc2.start(now);

    const stopTime = now + duration * 1.5;
    osc1.stop(stopTime);
    osc2.stop(stopTime);
  }

  // Bamboo water drop tap sound (Shishi-odoshi)
  public playBambooKnock() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.exponentialRampToValueAtTime(90, now + 0.12);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.13);
  }

  private stepMelody() {
    if (!this.isPlaying) return;

    const track = ZEN_PLAYLIST[this.currentTrackIdx];
    const note = track.notes[this.currentNoteIdx];
    const freq = NOTE_FREQS[note.pitch] || 0;

    if (freq > 0) {
      this.playPianoNote(freq, note.duration);
    }

    this.currentNoteIdx = (this.currentNoteIdx + 1) % track.notes.length;
    this.notify();

    // Schedule next note
    const delayMs = note.duration * 680; // slightly relaxed tempo
    this.timerId = window.setTimeout(() => {
      this.stepMelody();
    }, delayMs);
  }

  public play() {
    this.initContext();
    if (this.isPlaying) return;

    this.isPlaying = true;
    this.notify();
    this.stepMelody();
  }

  public pause() {
    this.isPlaying = false;
    if (this.timerId !== null) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    this.notify();
  }

  public togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  public nextTrack() {
    const wasPlaying = this.isPlaying;
    this.pause();
    this.currentTrackIdx = (this.currentTrackIdx + 1) % ZEN_PLAYLIST.length;
    this.currentNoteIdx = 0;
    this.notify();
    if (wasPlaying) {
      this.play();
    }
  }

  public prevTrack() {
    const wasPlaying = this.isPlaying;
    this.pause();
    this.currentTrackIdx = (this.currentTrackIdx - 1 + ZEN_PLAYLIST.length) % ZEN_PLAYLIST.length;
    this.currentNoteIdx = 0;
    this.notify();
    if (wasPlaying) {
      this.play();
    }
  }
}

export const zenAudio = new ZenAudioManager();
