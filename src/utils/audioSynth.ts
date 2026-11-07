/**
 * Royal Indian Ambient Soundscape Engine (Web Audio API)
 * Generates an authentic Tanpura drone & peaceful Indian Flute/Sitar harmonics in Raga Yaman / Bhupali
 * 100% self-contained: works offline, never breaks, zero CORS or missing file issues!
 */

class IndianAmbientAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private masterGain: GainNode | null = null;
  private oscillators: OscillatorNode[] = [];
  private melodyInterval: number | null = null;
  private volume: number = 0.45;

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public start() {
    if (this.isPlaying) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    this.isPlaying = true;
    const now = this.ctx.currentTime;

    // Tanpura Drone Fundamental Frequencies in Key of D (D3 ~ 146.83Hz, A3 ~ 220Hz, D4 ~ 293.66Hz)
    // Traditional Indian Tanpura strings: Pa (5th), Sa (root octave), Sa (root octave), Sa (fundamental)
    const tanpuraFreqs = [
      { freq: 220.00, gain: 0.06, type: 'triangle' as OscillatorType, detune: 2 },  // Pa (A3)
      { freq: 293.66, gain: 0.08, type: 'sine' as OscillatorType, detune: -3 },   // Sa (D4)
      { freq: 293.66, gain: 0.08, type: 'triangle' as OscillatorType, detune: 3 },// Sa (D4)
      { freq: 146.83, gain: 0.12, type: 'sine' as OscillatorType, detune: 0 },   // Kharaj Sa (D3)
      { freq: 73.41,  gain: 0.09, type: 'sine' as OscillatorType, detune: 0 },   // Sub bass warm drone
    ];

    this.oscillators = [];

    // Create Tanpura drone with gentle LFO modulation for warm acoustic resonance
    tanpuraFreqs.forEach((item) => {
      if (!this.ctx || !this.masterGain) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      // Warm low-pass filter
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(item.freq * 3.5, now);
      filter.Q.setValueAtTime(1.5, now);

      osc.type = item.type;
      osc.frequency.setValueAtTime(item.freq, now);
      osc.detune.setValueAtTime(item.detune, now);

      // Slow breathing swell
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(item.gain, now + 3);

      // Tremolo / natural shimmer
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(0.2 + Math.random() * 0.15, now);
      lfoGain.gain.setValueAtTime(item.gain * 0.25, now);
      lfo.connect(lfoGain.gain);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      this.oscillators.push(osc);
    });

    // Peaceful meditative bansuri / sitar scale notes in Raga Bhupali (D, E, F#, A, B, d)
    const bhupaliScale = [
      293.66, // D4 (Sa)
      329.63, // E4 (Re)
      369.99, // F#4 (Ga)
      440.00, // A4 (Pa)
      493.88, // B4 (Dha)
      587.33, // D5 (High Sa)
      659.25, // E5 (High Re)
      739.99, // F#5 (High Ga)
    ];

    // Melodic contemplative flute phrases
    const playFluteNote = () => {
      if (!this.isPlaying || !this.ctx || !this.masterGain) return;
      const noteTime = this.ctx.currentTime;
      const freq = bhupaliScale[Math.floor(Math.random() * bhupaliScale.length)];
      const duration = 2.5 + Math.random() * 2.5;

      const fluteOsc = this.ctx.createOscillator();
      const fluteGain = this.ctx.createGain();
      const fluteFilter = this.ctx.createBiquadFilter();

      // Soft breathy tone
      fluteOsc.type = 'sine';
      fluteOsc.frequency.setValueAtTime(freq, noteTime);

      // Subtle vibrato
      const vibrato = this.ctx.createOscillator();
      const vibratoGain = this.ctx.createGain();
      vibrato.frequency.setValueAtTime(4.8, noteTime);
      vibratoGain.gain.setValueAtTime(3.5, noteTime);
      vibrato.connect(fluteOsc.frequency);
      vibrato.start(noteTime);
      vibrato.stop(noteTime + duration);

      // Gentle lowpass warmth
      fluteFilter.type = 'lowpass';
      fluteFilter.frequency.setValueAtTime(1400, noteTime);

      // Envelope: gentle attack, peaceful sustain, long smooth decay
      fluteGain.gain.setValueAtTime(0.0001, noteTime);
      fluteGain.gain.exponentialRampToValueAtTime(0.09, noteTime + 0.8);
      fluteGain.gain.exponentialRampToValueAtTime(0.06, noteTime + duration - 0.8);
      fluteGain.gain.exponentialRampToValueAtTime(0.0001, noteTime + duration);

      fluteOsc.connect(fluteFilter);
      fluteFilter.connect(fluteGain);
      fluteGain.connect(this.masterGain);

      fluteOsc.start(noteTime);
      fluteOsc.stop(noteTime + duration);
    };

    // Schedule gentle flute phrasing every 3-5 seconds
    this.melodyInterval = window.setInterval(() => {
      if (this.isPlaying) {
        playFluteNote();
      }
    }, 4200);

    // Initial note after 1s
    setTimeout(playFluteNote, 1000);
  }

  public stop() {
    this.isPlaying = false;
    if (this.melodyInterval) {
      clearInterval(this.melodyInterval);
      this.melodyInterval = null;
    }
    const now = this.ctx ? this.ctx.currentTime : 0;
    this.oscillators.forEach((osc) => {
      try {
        osc.stop(now + 0.5);
      } catch {
        // ignore
      }
    });
    this.oscillators = [];
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
    } else {
      this.start();
    }
    return this.isPlaying;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  /**
   * Authentic Temple Bell Sound (Ghantha)
   * Played when a diya is lit or milestone reached
   */
  public playTempleBell() {
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;
      const now = this.ctx.currentTime;

      // Temple bell harmonics: metallic chime with lingering rich resonance
      const bellHarmonics = [
        { freq: 880, gain: 0.18, decay: 2.8 },
        { freq: 1760, gain: 0.12, decay: 2.2 },
        { freq: 2640, gain: 0.08, decay: 1.6 },
        { freq: 3520, gain: 0.05, decay: 1.1 },
        { freq: 528, gain: 0.15, decay: 3.2 }, // deep undertone
      ];

      bellHarmonics.forEach((h) => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(h.freq, now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(h.gain, now + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + h.decay);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + h.decay);
      });
    } catch (e) {
      console.warn('Audio play failed:', e);
    }
  }

  /**
   * Divine Sparkle / Golden chime
   */
  public playSparkleChime() {
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;
      const now = this.ctx.currentTime;
      const notes = [1046.50, 1318.51, 1567.98, 2093.00, 2637.02];

      notes.forEach((freq, idx) => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const t = now + idx * 0.08;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0.001, t);
        gain.gain.linearRampToValueAtTime(0.07, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.2);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(t);
        osc.stop(t + 1.2);
      });
    } catch {
      // ignore
    }
  }
}

export const royalAudio = new IndianAmbientAudioEngine();

