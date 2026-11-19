// Audio utility with Web Speech API ja-JP fallback and audioUrl support

class AudioManager {
  private static synth: SpeechSynthesis | null = typeof window !== 'undefined' ? window.speechSynthesis : null;
  private static jaVoice: SpeechSynthesisVoice | null = null;
  private static initialized = false;
  private static volume = 0.8;
  private static defaultRate = 1.15; // Natural, brisk native Japanese conversational speed

  public static setVolume(vol: number): void {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  public static getVolume(): number {
    return this.volume;
  }

  public static setSpeed(rate: number): void {
    this.defaultRate = Math.max(0.5, Math.min(2.0, rate));
  }

  public static getSpeed(): number {
    return this.defaultRate;
  }

  private static initVoices() {
    if (!this.synth || this.initialized) return;

    const findVoice = () => {
      const voices = this.synth?.getVoices() || [];
      // Look for natural Japanese voices
      const voice = voices.find(v => v.lang.startsWith('ja') || v.lang.includes('JP'));
      if (voice) {
        this.jaVoice = voice;
      }
    };

    findVoice();
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = findVoice;
    }
    this.initialized = true;
  }

  public static speak(text: string, audioUrl?: string, rate?: number): void {
    if (typeof window === 'undefined') return;

    const speechRate = rate ?? this.defaultRate;

    // If an explicit audioUrl is provided and playable, try it first
    if (audioUrl) {
      try {
        const audio = new Audio(audioUrl);
        audio.volume = this.volume;
        audio.playbackRate = speechRate;
        audio.play().catch(() => {
          // Fall back to Web Speech API if audio url fails
          this.speakWithSpeechSynthesis(text, speechRate);
        });
        return;
      } catch {
        // Fall back
      }
    }

    this.speakWithSpeechSynthesis(text, speechRate);
  }

  private static speakWithSpeechSynthesis(text: string, rate: number): void {
    if (!this.synth) return;
    this.initVoices();

    // Cancel current speaking if any
    try {
      this.synth.cancel();
    } catch {
      // Ignore
    }

    const cleanText = text.replace(/[^\p{L}\p{N}\s、。！？・]/gu, '');
    const utterance = new SpeechSynthesisUtterance(cleanText || text);
    utterance.lang = 'ja-JP';
    utterance.rate = rate; // 1.15 = natural native conversational speed
    utterance.pitch = 1.0;
    utterance.volume = this.volume;

    if (this.jaVoice) {
      utterance.voice = this.jaVoice;
    }

    try {
      this.synth.speak(utterance);
    } catch (e) {
      console.warn("Speech synthesis error:", e);
    }
  }
}

export const playJapaneseAudio = (text: string, audioUrl?: string, rate?: number) => {
  AudioManager.speak(text, audioUrl, rate);
};

export const setAudioSpeed = (rate: number) => {
  AudioManager.setSpeed(rate);
};

export const getAudioSpeed = () => {
  return AudioManager.getSpeed();
};

export const setAudioVolume = (vol: number) => {
  AudioManager.setVolume(vol);
};

export const getAudioVolume = () => {
  return AudioManager.getVolume();
};
